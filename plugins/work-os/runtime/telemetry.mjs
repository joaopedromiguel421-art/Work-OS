import { promises as fs } from "node:fs";
import path from "node:path";
import {
  isMain,
  parseArgs,
  pathExists,
  pluginDataRoot,
  sha256
} from "./lib.mjs";

export async function summarizeRuns({ project = process.cwd(), session } = {}) {
  const repo = sha256(path.resolve(project)).slice(0, 16);
  const directory = path.join(pluginDataRoot(), "runs", repo);
  const records = [];
  if (await pathExists(directory)) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
      if (session && entry.name !== `${session}.jsonl`) continue;
      const raw = await fs.readFile(path.join(directory, entry.name), "utf8");
      for (const line of raw.split(/\r?\n/).filter(Boolean)) {
        try { records.push(JSON.parse(line)); } catch {}
      }
    }
  }
  const skills = records.filter(record => record.event === "PreToolUse" && record.tool === "Skill" && record.skill).map(record => record.skill);
  const subagents = records.filter(record => record.event === "subagent" && record.phase === "stop");
  const quality = records.filter(record => record.event === "quality");
  const errors = records.filter(record => record.event === "hook-error" || record.ok === false);
  const started = records.map(record => Date.parse(record.timestamp)).filter(Number.isFinite).sort((a, b) => a - b);
  return {
    project: path.resolve(project),
    records: records.length,
    firstEvent: started.length ? new Date(started[0]).toISOString() : null,
    lastEvent: started.length ? new Date(started.at(-1)).toISOString() : null,
    skills: Object.entries(skills.reduce((acc, skill) => ({ ...acc, [skill]: (acc[skill] || 0) + 1 }), {})).map(([name, count]) => ({ name, count })),
    subagents: subagents.map(record => ({ type: record.agentType, durationMs: record.durationMs })),
    quality: quality.map(record => ({ trigger: record.trigger, profile: record.profile, ok: record.ok, durationMs: record.durationMs, counts: record.counts })),
    hookErrors: errors.length
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await summarizeRuns({ project: args.project || process.cwd(), session: args.session });
  if (args.format === "json") process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    process.stdout.write(`Work OS runs: ${result.records} events, ${result.hookErrors} error(s)\n`);
    process.stdout.write(`Skills: ${result.skills.map(item => `${item.name}×${item.count}`).join(", ") || "none recorded"}\n`);
    process.stdout.write(`Subagents: ${result.subagents.map(item => `${item.type} ${item.durationMs ?? "?"}ms`).join(", ") || "none recorded"}\n`);
    for (const item of result.quality) process.stdout.write(`${item.ok ? "PASS" : "FAIL"} quality:${item.profile} via ${item.trigger} (${item.durationMs}ms)\n`);
  }
}

if (isMain(import.meta.url)) main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
