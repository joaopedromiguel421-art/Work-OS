import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = path.join(ROOT, "plugins", "work-os");
const EXPECTED_SKILLS = 25;
const EXPECTED_AGENTS = 3;
const EXPECTED_HOOKS = 13;
const EXPECTED_WORKFLOWS = 14;

async function exists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function directories(target) {
  if (!(await exists(target))) return [];
  return (await fs.readdir(target, { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
}

async function files(target, suffix = "") {
  if (!(await exists(target))) return [];
  return (await fs.readdir(target, { withFileTypes: true })).filter(entry => entry.isFile() && entry.name.endsWith(suffix)).map(entry => entry.name).sort();
}

function frontmatter(text) {
  if (!text.startsWith("---\n")) return {};
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return {};
  const result = {};
  for (const line of text.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (match) result[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return result;
}

export async function validateRepository() {
  const errors = [];
  const marketplace = JSON.parse(await fs.readFile(path.join(ROOT, ".claude-plugin", "marketplace.json"), "utf8"));
  const pluginManifest = JSON.parse(await fs.readFile(path.join(PLUGIN, ".claude-plugin", "plugin.json"), "utf8"));
  if (marketplace.plugins.length !== 1 || marketplace.plugins[0].name !== "work-os") errors.push("marketplace must expose exactly the work-os plugin");
  if (marketplace.plugins[0].version !== pluginManifest.version) errors.push("marketplace and plugin versions differ");
  if (await exists(path.join(PLUGIN, ".mcp.json"))) errors.push("plugin must not enable an MCP by default");
  if (await exists(path.join(PLUGIN, "commands"))) errors.push("legacy commands directory is not allowed");

  const skillNames = await directories(path.join(PLUGIN, "skills"));
  if (skillNames.length !== EXPECTED_SKILLS) errors.push(`expected ${EXPECTED_SKILLS} Skills, found ${skillNames.length}`);
  const descriptions = new Map();
  for (const name of skillNames) {
    const target = path.join(PLUGIN, "skills", name, "SKILL.md");
    if (!(await exists(target))) { errors.push(`${name} is missing SKILL.md`); continue; }
    const meta = frontmatter(await fs.readFile(target, "utf8"));
    if (meta.name !== name) errors.push(`${name} frontmatter name does not match directory`);
    if (!meta.description?.includes("Use when") || !meta.description?.includes("Do not use")) errors.push(`${name} description needs positive and negative routing triggers`);
    if (descriptions.has(meta.description)) errors.push(`${name} duplicates ${descriptions.get(meta.description)} description`);
    descriptions.set(meta.description, name);
  }
  for (const manual of ["work", "project-context"]) {
    const meta = frontmatter(await fs.readFile(path.join(PLUGIN, "skills", manual, "SKILL.md"), "utf8"));
    if (meta["disable-model-invocation"] !== "true") errors.push(`${manual} must be manual-only`);
  }

  const agentFiles = await files(path.join(PLUGIN, "agents"), ".md");
  if (agentFiles.length !== EXPECTED_AGENTS) errors.push(`expected ${EXPECTED_AGENTS} subagents, found ${agentFiles.length}`);
  for (const file of agentFiles) {
    const text = await fs.readFile(path.join(PLUGIN, "agents", file), "utf8");
    const meta = frontmatter(text);
    const tools = meta.tools || "";
    for (const forbidden of ["Write", "Edit", "Bash", "Agent", "NotebookEdit"]) if (new RegExp(`\\b${forbidden}\\b`).test(tools)) errors.push(`${file} exposes forbidden tool ${forbidden}`);
    if (/^memory:\s*/m.test(text)) errors.push(`${file} must not declare memory`);
    if (!/Do not spawn/i.test(text)) errors.push(`${file} must explicitly prohibit nested spawning`);
  }

  const hooks = JSON.parse(await fs.readFile(path.join(PLUGIN, "hooks", "hooks.json"), "utf8"));
  if (Object.keys(hooks.hooks || {}).length !== EXPECTED_HOOKS) errors.push(`expected ${EXPECTED_HOOKS} hook handlers`);
  const workflows = await files(path.join(PLUGIN, "skills", "work", "references", "workflows"), ".md");
  if (workflows.length !== EXPECTED_WORKFLOWS) errors.push(`expected ${EXPECTED_WORKFLOWS} workflows, found ${workflows.length}`);

  const capabilities = JSON.parse(await fs.readFile(path.join(ROOT, "governance", "capabilities.json"), "utf8"));
  if (capabilities.capabilities.length !== EXPECTED_SKILLS) errors.push("capability registry must have one entry per Skill");
  const owners = capabilities.capabilities.map(item => item.owner);
  if (new Set(owners).size !== owners.length) errors.push("capability owners must be unique");
  for (const skill of skillNames) if (!owners.includes(skill)) errors.push(`${skill} has no capability owner entry`);

  const templateClaude = await fs.readFile(path.join(PLUGIN, "templates", "project", "CLAUDE.md"), "utf8");
  if (templateClaude.split(/\r?\n/).length >= 150) errors.push("project CLAUDE.md template must stay under 150 lines");
  if (await exists(path.join(PLUGIN, "templates", "project", ".mcp.json"))) errors.push("project template must not include .mcp.json");

  return { ok: errors.length === 0, errors, counts: { skills: skillNames.length, agents: agentFiles.length, hooks: Object.keys(hooks.hooks || {}).length, workflows: workflows.length } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validateRepository();
  if (result.ok) process.stdout.write(`PASS repository structure ${JSON.stringify(result.counts)}\n`);
  else {
    process.stderr.write(`FAIL repository structure\n${result.errors.map(error => `- ${error}`).join("\n")}\n`);
    process.exitCode = 1;
  }
}
