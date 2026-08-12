import { promises as fs } from "node:fs";
import path from "node:path";
import {
  appendEvent,
  isMain,
  pathExists,
  pathWithin,
  pathWithinReal,
  pluginDataRoot,
  projectRoot,
  pruneOldLogs,
  readState,
  readStdinJson,
  redact,
  sessionKey,
  sha256,
  statePath,
  truncate,
  updateState
} from "./lib.mjs";
import { formatQuality, runQuality } from "./quality.mjs";

const CUSTOM_AGENTS = new Set(["research-scout", "security-reviewer", "ux-critic", "work-os:research-scout", "work-os:security-reviewer", "work-os:ux-critic"]);
const WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);

function eventName(input) {
  return input.hook_event_name || input.hookEventName || "Unknown";
}

function customAgentName(toolInput = {}) {
  return toolInput.subagent_type || toolInput.agent_type || toolInput.name || "";
}

function isCustomAgent(name) {
  return CUSTOM_AGENTS.has(name) || [...CUSTOM_AGENTS].some(candidate => name.endsWith(`:${candidate}`));
}

function secretPath(filePath = "") {
  const normalized = String(filePath).replaceAll("\\", "/");
  if (/\.env\.(example|sample|template)$/i.test(normalized)) return false;
  return /(^|\/)\.env($|\.)|(^|\/)(id_rsa|id_ed25519|credentials|\.npmrc)$|\.(pem|p12|pfx|key)$/i.test(normalized);
}

function recursiveDelete(command) {
  return /\brm\s+[^\r\n]*(?:-[a-z]*r[a-z]*|--recursive)\b/i.test(command)
    || /\bremove-item\b[^\r\n]*\b-recurse\b/i.test(command)
    || /\b(?:rmdir|del)\b[^\r\n]*\/s\b/i.test(command);
}

function broadDeleteTarget(command) {
  const normalized = String(command).replaceAll("\\", "/");
  return /(?:^|[\s"'=])(?:\/|~(?:\/[^\s"';&|]*)?|\.\/?|\.\.\/?|\*|\.\/\*|\$home(?:\/[^\s"';&|]*)?|\$\{home\}(?:\/[^\s"';&|]*)?|\$pwd\/?|\$\{pwd\}\/?|%userprofile%(?:\/[^\s"';&|]*)?|[a-z]:\/)(?=$|[\s"';&|])/i.test(normalized);
}

function bashDecision(command = "") {
  const text = String(command).trim();
  const lower = text.toLowerCase();
  if (recursiveDelete(text) && broadDeleteTarget(text)) {
    return { action: "deny", reason: "Broad recursive deletion is blocked" };
  }
  const deny = [
    { pattern: /\b(curl|wget)\b[^|\r\n]*\|\s*(sh|bash|zsh|fish|pwsh|powershell)\b/i, reason: "Remote content may not be piped directly to a shell" },
    { pattern: /\b(?:sh|bash|zsh|fish|pwsh|powershell)\b[^\r\n]*\$\(\s*(?:curl|wget)\b|\b(?:source|\.)\s+<\(\s*(?:curl|wget)\b/i, reason: "Remote content may not be executed through command or process substitution" },
    { pattern: /\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|push\b[^\r\n]*--force)/i, reason: "Destructive Git operation is blocked" },
    { pattern: /\bfind\s+(?:\.|\.\/|\/|~)(?=\s)[^\r\n]*\s-delete\b/i, reason: "Broad recursive deletion is blocked" },
    { pattern: /--dangerously-skip-permissions|bypasspermissions/i, reason: "Permission bypass is blocked" },
    { pattern: /\b(cat|type|get-content|more|less|sed|awk)\b[^\r\n]*(?:\.env(?:\s|$)|id_rsa|id_ed25519|\.npmrc|credentials|\.pem\b|\.key\b)/i, reason: "Direct secret-file access is blocked" }
  ];
  for (const rule of deny) if (rule.pattern.test(text)) return { action: "deny", reason: rule.reason };

  const ask = [
    { pattern: /\b(npm\s+(?:i|install|add|ci)|npx\b|pnpm\s+(?:add|install|dlx)|yarn\s+(?:add|install|dlx)|bun\s+(?:add|install)|bunx\b|pip(?:3)?\s+install|pipx\s+install|uv\s+add|cargo\s+add|go\s+get)\b/i, reason: "Dependency installation or package execution requires explicit approval" },
    { pattern: /\b(npm\s+publish|docker\s+push|git\s+(?:push|commit|tag|restore)|git\s+checkout\s+--|gh\s+(?:pr\s+create|release\s+create|issue\s+create))\b/i, reason: "Publishing, remote Git, or worktree-discard action requires explicit approval" },
    { pattern: /\b(?:curl|wget)\b[^\r\n]*(?:-X\s*(?:POST|PUT|PATCH|DELETE)|--request\s+(?:POST|PUT|PATCH|DELETE)|--data(?:-raw|-binary|-urlencode)?\b|--post-data\b|\s-d\s)/i, reason: "Network request with side effects requires explicit approval" },
    { pattern: /\brm\s+[^\r\n]*(?:-[a-z]*r[a-z]*|--recursive)\b|\bremove-item\b[^\r\n]*\b-recurse\b|\b(?:rmdir|del)\b[^\r\n]*\/s\b/i, reason: "Recursive deletion requires explicit approval" },
    { pattern: /\b(kubectl|helm|terraform\s+(?:apply|destroy)|pulumi\s+up|aws\b|gcloud\b|az\b|vercel\b[^\r\n]*--prod|wrangler\s+deploy|netlify\s+deploy)\b/i, reason: "Infrastructure or deploy action requires explicit approval" },
    { pattern: /\b(?:alter\s+(?:table|database|schema)|create\s+(?:database|schema)|drop\s+(?:database|table|schema)|truncate\s+table|delete\s+from|insert\s+into|update\s+[^\s]+\s+set|migrate\s+(?:up|deploy)|prisma\s+migrate\s+deploy)\b/i, reason: "Potentially consequential database action requires explicit approval" },
    { pattern: /\b(production|--prod|prod\.)\b/i, reason: "Production-targeted action requires explicit approval" }
  ];
  for (const rule of ask) if (rule.pattern.test(lower)) return { action: "ask", reason: rule.reason };
  return { action: "allow" };
}

async function reserveCustomAgent(input) {
  let denied = null;
  await updateState(input, state => {
    const active = Object.keys(state.active || {}).length;
    const reserved = Number(state.reserved || 0);
    const total = Number(state.totalCustomAgents || 0);
    if (active + reserved >= 2) denied = "At most two custom subagents may run concurrently";
    else if (total >= 3) denied = "At most three custom subagents may be used in one task";
    else {
      state.reserved = reserved + 1;
      state.totalCustomAgents = total + 1;
    }
    return state;
  });
  return denied;
}

async function classifyTool(input, reserve = false) {
  const tool = input.tool_name || "";
  const toolInput = input.tool_input || {};
  const root = projectRoot(input);

  if (tool.startsWith("mcp__")) return { action: "ask", reason: "MCP tools are opt-in external integrations" };
  if (["Read", "Write", "Edit", "MultiEdit", "NotebookEdit"].includes(tool)) {
    const filePath = toolInput.file_path || toolInput.path || toolInput.notebook_path || "";
    if (filePath && secretPath(filePath)) return { action: "deny", reason: "Secret-file access is blocked by default" };
    if (WRITE_TOOLS.has(tool) || tool === "MultiEdit") {
      const absolute = path.resolve(root, filePath || ".");
      if (!pathWithin(root, absolute) || !(await pathWithinReal(root, absolute))) return { action: "deny", reason: "Writes must stay inside the project root, including resolved symlinks" };
    }
  }
  if (tool === "Bash") return bashDecision(toolInput.command || "");
  if (tool === "Agent") {
    const name = customAgentName(toolInput);
    if (isCustomAgent(name) && reserve) {
      const denial = await reserveCustomAgent(input);
      if (denial) return { action: "deny", reason: denial };
    }
  }
  return { action: "allow" };
}

function preToolOutput(decision) {
  if (decision.action === "allow") return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: decision.action,
      permissionDecisionReason: decision.reason
    }
  };
}

function permissionOutput(decision) {
  if (decision.action !== "deny") return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: { behavior: "deny", message: decision.reason, interrupt: false }
    }
  };
}

function qualityReason(result) {
  const failed = result.checks.filter(check => check.status === "fail").slice(0, 4);
  return truncate(`Work OS quality:${result.profile} failed. ${failed.map(check => `${check.id}: ${check.message}`).join(" | ")}`, 3_000);
}

async function handlePostBatch(input) {
  const calls = Array.isArray(input.tool_calls) ? input.tool_calls : [];
  if (!calls.some(call => WRITE_TOOLS.has(call.tool_name) || call.tool_name === "MultiEdit")) return null;
  const result = await runQuality({ project: projectRoot(input), profile: "fast" });
  await appendEvent(input, "quality", { trigger: "PostToolBatch", profile: "fast", ok: result.ok, durationMs: result.durationMs, counts: result.counts });
  if (!result.ok) return { decision: "block", reason: qualityReason(result) };
  return {
    hookSpecificOutput: {
      hookEventName: "PostToolBatch",
      additionalContext: `Work OS fast quality passed (${result.durationMs}ms).`
    }
  };
}

async function handleStop(input) {
  const root = projectRoot(input);
  if (!(await pathExists(path.join(root, "context", ".work-os.json")))) {
    await updateState(input, state => {
      state.reserved = 0;
      state.totalCustomAgents = 0;
      state.stopAttempts = 0;
      state.stopFingerprint = null;
      return state;
    });
    return null;
  }
  const result = await runQuality({ project: root, profile: "standard" });
  const fingerprint = sha256(result.checks.filter(check => check.status === "fail").map(check => `${check.id}:${check.message}`).join("\n"));
  let attempts = 0;
  await updateState(input, state => {
    if (result.ok) {
      state.stopAttempts = 0;
      state.stopFingerprint = null;
      state.totalCustomAgents = 0;
    } else {
      state.stopAttempts = state.stopFingerprint === fingerprint ? Number(state.stopAttempts || 0) + 1 : 1;
      state.stopFingerprint = fingerprint;
    }
    attempts = state.stopAttempts;
    return state;
  });
  await appendEvent(input, "quality", { trigger: "Stop", profile: "standard", ok: result.ok, attempts, durationMs: result.durationMs, counts: result.counts });
  if (result.ok) return null;
  if (attempts <= 2) return { decision: "block", reason: `${qualityReason(result)} Attempt ${attempts}/2 before circuit breaker.` };
  await updateState(input, state => {
    state.reserved = 0;
    state.totalCustomAgents = 0;
    state.stopAttempts = 0;
    state.stopFingerprint = null;
    return state;
  });
  return { systemMessage: `Work OS circuit breaker released Stop with unresolved quality failures. Run the quality runner manually. ${qualityReason(result)}` };
}

async function handleConfigChange(input) {
  if (input.source === "policy_settings") return null;
  const filePath = input.file_path;
  if (!filePath || !(await pathExists(filePath))) return null;
  try {
    const settings = JSON.parse(await fs.readFile(filePath, "utf8"));
    const serialized = JSON.stringify(settings).toLowerCase();
    if (settings.disableAllHooks === true || serialized.includes("bypasspermissions")) {
      return { decision: "block", reason: "Work OS blocks disabling all hooks or enabling bypassPermissions in session configuration" };
    }
  } catch (error) {
    return { decision: "block", reason: `Configuration is not valid JSON: ${error.message}` };
  }
  return null;
}

async function handleSubagentStart(input) {
  if (!isCustomAgent(input.agent_type || "")) return null;
  await updateState(input, state => {
    state.reserved = Math.max(0, Number(state.reserved || 0) - 1);
    state.active ||= {};
    state.active[input.agent_id || `unknown-${Date.now()}`] = { type: input.agent_type, startedAt: new Date().toISOString() };
    return state;
  });
  return {
    hookSpecificOutput: {
      hookEventName: "SubagentStart",
      additionalContext: "This Work OS subagent is read-only, must not spawn another agent, and must return concise evidence to the main conversation."
    }
  };
}

async function handleSubagentStop(input) {
  if (!isCustomAgent(input.agent_type || "")) return null;
  let durationMs = null;
  await updateState(input, state => {
    const active = state.active || {};
    const started = active[input.agent_id]?.startedAt;
    if (started) durationMs = Date.now() - Date.parse(started);
    delete active[input.agent_id];
    state.active = active;
    return state;
  });
  await appendEvent(input, "subagent", { phase: "stop", agentType: input.agent_type, agentId: input.agent_id, durationMs });
  return null;
}

async function releaseAgentReservation(input) {
  if (input.tool_name !== "Agent" || !isCustomAgent(customAgentName(input.tool_input || {}))) return;
  await updateState(input, state => {
    state.reserved = Math.max(0, Number(state.reserved || 0) - 1);
    state.totalCustomAgents = Math.max(0, Number(state.totalCustomAgents || 0) - 1);
    return state;
  });
}

export async function handleHook(input) {
  const event = eventName(input);
  const base = { tool: input.tool_name || null, agentType: input.agent_type || null };
  try {
    if (event === "SessionStart") {
      await pruneOldLogs(30);
      await appendEvent(input, event, { source: input.source, model: input.model });
      const initialized = await pathExists(path.join(projectRoot(input), "context", ".work-os.json"));
      return initialized ? {
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: "Work OS project overlay detected. Main conversation owns writes; custom subagents are read-only; quality manifest is authoritative; MCP integrations remain opt-in."
        }
      } : null;
    }
    if (event === "InstructionsLoaded") {
      let lines = null;
      try { lines = (await fs.readFile(input.file_path, "utf8")).split(/\r?\n/).length; } catch {}
      await appendEvent(input, event, { filePath: input.file_path, loadReason: input.load_reason, memoryType: input.memory_type, lines });
      return null;
    }
    if (event === "PreToolUse") {
      const decision = await classifyTool(input, true);
      await appendEvent(input, event, { ...base, decision: decision.action, reason: decision.reason, skill: input.tool_name === "Skill" ? input.tool_input?.skill : undefined });
      return preToolOutput(decision);
    }
    if (event === "PermissionRequest") {
      const decision = await classifyTool(input, false);
      await appendEvent(input, event, { ...base, decision: decision.action, reason: decision.reason });
      return permissionOutput(decision);
    }
    if (event === "PostToolUse") {
      await appendEvent(input, event, base);
      return null;
    }
    if (event === "PostToolUseFailure") {
      await releaseAgentReservation(input);
      await appendEvent(input, event, { ...base, error: truncate(input.error || input.tool_response || "tool failure", 1_000) });
      return null;
    }
    if (event === "PostToolBatch") return await handlePostBatch(input);
    if (event === "SubagentStart") {
      await appendEvent(input, "subagent", { phase: "start", agentType: input.agent_type, agentId: input.agent_id });
      return await handleSubagentStart(input);
    }
    if (event === "SubagentStop") return await handleSubagentStop(input);
    if (event === "PreCompact") {
      const state = await readState(input);
      await appendEvent(input, event, { trigger: input.trigger, state: { activeAgents: Object.keys(state.active || {}).length, totalCustomAgents: state.totalCustomAgents || 0 } });
      return null;
    }
    if (event === "Stop") return await handleStop(input);
    if (event === "SessionEnd") {
      await appendEvent(input, event, { reason: input.reason });
      await fs.rm(statePath(input), { force: true });
      return null;
    }
    if (event === "ConfigChange") {
      const result = await handleConfigChange(input);
      await appendEvent(input, event, { source: input.source, filePath: input.file_path, blocked: result?.decision === "block" });
      return result;
    }
    await appendEvent(input, event, base);
    return null;
  } catch (error) {
    await appendEvent(input, "hook-error", { event, message: error.message }).catch(() => {});
    const reason = `Work OS hook failed closed: ${truncate(error.message, 1_000)}`;
    if (event === "PreToolUse") return preToolOutput({ action: "deny", reason });
    if (event === "PermissionRequest") return permissionOutput({ action: "deny", reason });
    if (["PostToolBatch", "Stop", "ConfigChange"].includes(event)) return { decision: "block", reason };
    return null;
  }
}

async function main() {
  const input = await readStdinJson();
  const output = await handleHook(input);
  if (output) process.stdout.write(`${JSON.stringify(redact(output))}\n`);
}

if (isMain(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(`Work OS hook error: ${truncate(error.message, 1_000)}\n`);
    process.exitCode = 2;
  });
}
