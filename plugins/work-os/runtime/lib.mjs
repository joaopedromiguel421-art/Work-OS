import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RUNTIME_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PLUGIN_ROOT = path.resolve(RUNTIME_DIR, "..");

export function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      result._.push(value);
      continue;
    }
    const [rawKey, inline] = value.slice(2).split(/=(.*)/s, 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inline !== undefined) {
      result[key] = inline;
    } else if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
      result[key] = argv[index + 1];
      index += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

export async function readStdinJson(stream = process.stdin, limit = 2_000_000) {
  let raw = "";
  for await (const chunk of stream) {
    raw += chunk;
    if (raw.length > limit) throw new Error(`Hook input exceeds ${limit} bytes`);
  }
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function sha256(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

export function pathWithinUsing(pathApi, parent, candidate) {
  const relative = pathApi.relative(pathApi.resolve(parent), pathApi.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !pathApi.isAbsolute(relative));
}

export function pathWithin(parent, candidate) {
  return pathWithinUsing(path, parent, candidate);
}

async function canonicalFuturePath(target) {
  let cursor = path.resolve(target);
  const missing = [];
  while (!(await pathExists(cursor))) {
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    missing.unshift(path.basename(cursor));
    cursor = parent;
  }
  let canonical = cursor;
  try { canonical = await fs.realpath(cursor); } catch {}
  return path.resolve(canonical, ...missing);
}

export async function pathWithinReal(parent, candidate) {
  if (!pathWithin(parent, candidate)) return false;
  const [canonicalParent, canonicalCandidate] = await Promise.all([
    canonicalFuturePath(parent),
    canonicalFuturePath(candidate)
  ]);
  return pathWithin(canonicalParent, canonicalCandidate);
}

export function truncate(value, max = 1_500) {
  const text = String(value ?? "");
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

const REDACTION_PATTERNS = [
  [/\b(sk-ant-[a-zA-Z0-9_-]{12,})\b/g, "[REDACTED_ANTHROPIC_KEY]"],
  [/\b(sk-[a-zA-Z0-9_-]{16,})\b/g, "[REDACTED_API_KEY]"],
  [/\b(gh[oprsu]_[a-zA-Z0-9]{20,})\b/g, "[REDACTED_GITHUB_TOKEN]"],
  [/\b(Bearer\s+)[a-zA-Z0-9._~+\/-]{12,}/gi, "$1[REDACTED]"],
  [/(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]"]
];

export function redact(value) {
  if (typeof value === "string") {
    return REDACTION_PATTERNS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => {
      if (/password|passwd|secret|token|api.?key|authorization/i.test(key)) return [key, "[REDACTED]"];
      return [key, redact(item)];
    }));
  }
  return value;
}

export function projectRoot(input = {}) {
  return path.resolve(input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd());
}

export function pluginDataRoot() {
  return path.resolve(process.env.CLAUDE_PLUGIN_DATA || path.join(os.tmpdir(), "work-os-plugin-data"));
}

export function sessionKey(input = {}) {
  return sha256(`${projectRoot(input)}\0${input.session_id || "no-session"}`).slice(0, 24);
}

export function statePath(input = {}) {
  return path.join(pluginDataRoot(), "state", `${sessionKey(input)}.json`);
}

export async function readState(input = {}) {
  try {
    return await readJson(statePath(input));
  } catch {
    return { active: {}, reserved: 0, totalCustomAgents: 0, stopAttempts: 0 };
  }
}

export async function updateState(input, mutate) {
  const filePath = statePath(input);
  const lockPath = `${filePath}.lock`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  let lock;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      lock = await fs.open(lockPath, "wx");
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  if (!lock) throw new Error("Could not acquire Work OS state lock");
  try {
    const current = await readState(input);
    const next = await mutate(current) || current;
    await writeJson(filePath, next);
    return next;
  } finally {
    await lock.close();
    await fs.rm(lockPath, { force: true });
  }
}

export async function appendEvent(input, event, details = {}) {
  const root = pluginDataRoot();
  const repo = sha256(projectRoot(input)).slice(0, 16);
  const session = String(input.session_id || "no-session").replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(root, "runs", repo, `${session}.jsonl`);
  const record = redact({
    timestamp: new Date().toISOString(),
    event,
    sessionId: input.session_id || null,
    project: projectRoot(input),
    ...details
  });
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
  return filePath;
}

export async function pruneOldLogs(days = 30) {
  const runs = path.join(pluginDataRoot(), "runs");
  if (!(await pathExists(runs))) return;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  for (const repoEntry of await fs.readdir(runs, { withFileTypes: true })) {
    if (!repoEntry.isDirectory()) continue;
    const repoDir = path.join(runs, repoEntry.name);
    for (const entry of await fs.readdir(repoDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
      const filePath = path.join(repoDir, entry.name);
      const stat = await fs.stat(filePath);
      if (stat.mtimeMs < cutoff) await fs.rm(filePath, { force: true });
    }
  }
}

export function isMain(importMetaUrl) {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(importMetaUrl);
}
