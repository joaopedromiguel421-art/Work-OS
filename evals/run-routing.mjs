import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "../plugins/work-os/runtime/lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const lexicon = JSON.parse(await fs.readFile(path.join(ROOT, "evals", "skill-routing", "lexicon.json"), "utf8"));
const suite = JSON.parse(await fs.readFile(path.join(ROOT, "evals", "skill-routing", "cases.json"), "utf8"));

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function score(prompt, config) {
  const text = normalize(prompt);
  if (config.manualOnly && !text.includes("/work-os:")) return -Infinity;
  let value = 0;
  for (const [term, weight] of config.positive || []) if (text.includes(normalize(term))) value += weight;
  for (const [term, weight] of config.negative || []) if (text.includes(normalize(term))) value -= weight;
  return value;
}

export function route(prompt) {
  const ranked = Object.entries(lexicon.skills)
    .map(([name, config]) => ({ name, score: score(prompt, config) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  if (ranked[0].score < lexicon.threshold) return { selected: null, ranked: ranked.slice(0, 3) };
  return { selected: ranked[0].name, ranked: ranked.slice(0, 3) };
}

const results = suite.cases.map(item => ({ ...item, actual: route(item.prompt).selected, ranked: route(item.prompt).ranked }));
const failures = results.filter(item => item.actual !== item.expected);
const accuracy = (results.length - failures.length) / results.length;
const requiredAccuracy = 0.92;
const report = {
  proxy: true,
  note: lexicon.note,
  cases: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  accuracy,
  requiredAccuracy,
  failures
};

if (args.format === "json") process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
else {
  process.stdout.write(`${failures.length === 0 || accuracy >= requiredAccuracy ? "PASS" : "FAIL"} routing proxy: ${report.passed}/${report.cases} (${(accuracy * 100).toFixed(1)}%, threshold ${(requiredAccuracy * 100).toFixed(0)}%)\n`);
  for (const failure of failures) process.stdout.write(`FAIL ${failure.id}: expected ${failure.expected ?? "none"}, got ${failure.actual ?? "none"}; top ${failure.ranked.map(item => `${item.name}:${item.score}`).join(", ")}\n`);
}
if (accuracy < requiredAccuracy) process.exitCode = 1;
