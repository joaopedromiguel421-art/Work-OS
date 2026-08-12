import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "../plugins/work-os/runtime/lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "upstream", "manifest.json"), "utf8"));
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function latest(repository) {
  const response = await fetch(`https://api.github.com/repos/${repository}/commits?per_page=1`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "work-os-upstream-check/0.1",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const values = await response.json();
  if (!values[0]?.sha) throw new Error("empty commit response");
  return { sha: values[0].sha, date: values[0].commit?.committer?.date || null, url: values[0].html_url || null };
}

const results = [];
for (const source of manifest.sources) {
  try {
    const current = await latest(source.repository);
    results.push({ repository: source.repository, pinned: source.commit, latest: current.sha, updateAvailable: current.sha !== source.commit, latestDate: current.date, compareUrl: current.sha === source.commit ? null : `https://github.com/${source.repository}/compare/${source.commit}...${current.sha}` });
  } catch (error) {
    results.push({ repository: source.repository, pinned: source.commit, error: error.message, updateAvailable: null });
  }
}

const summary = { checkedAt: new Date().toISOString(), updates: results.filter(item => item.updateAvailable).length, errors: results.filter(item => item.error).length, results };
if (args.format === "json") process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
else {
  process.stdout.write(`Upstream check: ${summary.updates} update(s), ${summary.errors} error(s)\n`);
  for (const result of results) process.stdout.write(`${result.error ? "ERROR" : result.updateAvailable ? "UPDATE" : "CURRENT"} ${result.repository}${result.error ? `: ${result.error}` : result.updateAvailable ? ` ${result.pinned.slice(0, 8)} -> ${result.latest.slice(0, 8)}` : ""}\n`);
}

if (summary.errors && args.strict === true) process.exitCode = 1;
