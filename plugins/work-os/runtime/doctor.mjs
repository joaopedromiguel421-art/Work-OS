import { promises as fs } from "node:fs";
import path from "node:path";
import {
  PLUGIN_ROOT,
  isMain,
  parseArgs,
  pathExists,
  readJson
} from "./lib.mjs";
import { runQuality } from "./quality.mjs";

async function markdownFiles(directory) {
  if (!(await pathExists(directory))) return [];
  return (await fs.readdir(directory, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
    .map(entry => entry.name)
    .sort();
}

export async function inspectPlugin({ allowPartial = false } = {}) {
  const repoRoot = path.resolve(PLUGIN_ROOT, "..", "..");
  const skillsDir = path.join(PLUGIN_ROOT, "skills");
  const skillNames = await pathExists(skillsDir)
    ? (await fs.readdir(skillsDir, { withFileTypes: true })).filter(entry => entry.isDirectory() && entry.name !== ".system").map(entry => entry.name).sort()
    : [];
  const agents = await markdownFiles(path.join(PLUGIN_ROOT, "agents"));
  const hooksFile = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
  const hooks = await pathExists(hooksFile) ? Object.keys((await readJson(hooksFile)).hooks || {}) : [];
  const checks = [
    { id: "marketplace", ok: await pathExists(path.join(repoRoot, ".claude-plugin", "marketplace.json")) },
    { id: "plugin-manifest", ok: await pathExists(path.join(PLUGIN_ROOT, ".claude-plugin", "plugin.json")) },
    { id: "no-plugin-mcp", ok: !(await pathExists(path.join(PLUGIN_ROOT, ".mcp.json"))) },
    { id: "no-legacy-commands", ok: !(await pathExists(path.join(PLUGIN_ROOT, "commands"))) },
    { id: "skills", ok: allowPartial ? skillNames.length >= 1 : skillNames.length === 25, actual: skillNames.length, expected: allowPartial ? ">=1" : 25 },
    { id: "agents", ok: allowPartial ? true : agents.length === 3, actual: agents.length, expected: allowPartial ? "0..3" : 3 },
    { id: "hook-events", ok: allowPartial ? hooks.length >= 1 : hooks.length === 13, actual: hooks.length, expected: allowPartial ? ">=1" : 13 }
  ];
  return { ok: checks.every(check => check.ok), pluginRoot: PLUGIN_ROOT, skills: skillNames, agents, hooks, checks };
}

export async function doctor({ project, allowPartial = false } = {}) {
  const plugin = await inspectPlugin({ allowPartial });
  let projectCheck = null;
  if (project) projectCheck = await runQuality({ project: path.resolve(project), profile: "fast" });
  return { ok: plugin.ok && (!projectCheck || projectCheck.ok), plugin, project: projectCheck };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await doctor({ project: args.project, allowPartial: args.allowPartial === true });
  if (args.format === "json") process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    process.stdout.write(`${result.ok ? "PASS" : "FAIL"} Work OS doctor\n`);
    for (const check of result.plugin.checks) process.stdout.write(`${check.ok ? "PASS" : "FAIL"} ${check.id}${check.actual === undefined ? "" : ` (${check.actual}/${check.expected})`}\n`);
    if (result.project) process.stdout.write(`${result.project.ok ? "PASS" : "FAIL"} project quality:fast\n`);
  }
  if (!result.ok) process.exitCode = 1;
}

if (isMain(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(`doctor error: ${error.message}\n`);
    process.exitCode = 2;
  });
}
