import { promises as fs } from "node:fs";
import path from "node:path";
import {
  PLUGIN_ROOT,
  isMain,
  parseArgs,
  pathExists,
  pathWithinReal,
  readJson
} from "./lib.mjs";

const TEMPLATE_ROOT = path.join(PLUGIN_ROOT, "templates", "project");

async function walk(root, current = root) {
  const files = [];
  for (const entry of await fs.readdir(current, { withFileTypes: true })) {
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...await walk(root, target));
    else if (entry.isFile()) files.push(path.relative(root, target));
  }
  return files.sort();
}

function renderTemplate(content, values) {
  return content
    .replaceAll("{{PROJECT_NAME}}", values.projectName)
    .replaceAll("{{INIT_DATE}}", values.date)
    .replaceAll("{{WORK_OS_VERSION}}", values.version);
}

function mergeGitignore(existing, fragment) {
  const current = existing.replace(/\r\n/g, "\n");
  const lines = new Set(current.split("\n"));
  const additions = fragment.replace(/\r\n/g, "\n").split("\n").filter(line => line && !lines.has(line));
  if (!additions.length) return current.endsWith("\n") ? current : `${current}\n`;
  const prefix = current.trimEnd();
  return `${prefix}${prefix ? "\n\n" : ""}# Work OS local state\n${additions.join("\n")}\n`;
}

export async function planInit({ project, date = new Date().toISOString().slice(0, 10) }) {
  const root = path.resolve(project);
  if (await pathExists(root)) {
    const rootStat = await fs.stat(root);
    if (!rootStat.isDirectory()) throw new Error("project path must be a directory");
  }
  const marketplace = await readJson(path.resolve(PLUGIN_ROOT, "..", "..", ".claude-plugin", "marketplace.json"));
  const values = {
    projectName: path.basename(root),
    date,
    version: marketplace.plugins[0].version
  };
  const operations = [];
  for (const relative of await walk(TEMPLATE_ROOT)) {
    if (relative === "gitignore.fragment") continue;
    const source = path.join(TEMPLATE_ROOT, relative);
    const destination = path.join(root, relative);
    const rendered = renderTemplate(await fs.readFile(source, "utf8"), values);
    if (!(await pathWithinReal(root, destination))) {
      operations.push({ action: "conflict", path: relative, content: rendered, detail: "resolved path escapes the project root" });
      continue;
    }
    if (!(await pathExists(destination))) {
      operations.push({ action: "create", path: relative, content: rendered });
      continue;
    }
    try {
      const existing = await fs.readFile(destination, "utf8");
      operations.push({ action: existing === rendered ? "unchanged" : "conflict", path: relative, content: rendered });
    } catch (error) {
      operations.push({ action: "conflict", path: relative, content: rendered, detail: `existing path is not a readable text file: ${error.code || error.message}` });
    }
  }
  const fragment = await fs.readFile(path.join(TEMPLATE_ROOT, "gitignore.fragment"), "utf8");
  const gitignorePath = path.join(root, ".gitignore");
  if (!(await pathWithinReal(root, gitignorePath))) {
    operations.push({ action: "conflict", path: ".gitignore", content: "", detail: "resolved path escapes the project root" });
    return {
      project: root,
      version: values.version,
      operations,
      counts: Object.fromEntries(["create", "merge", "unchanged", "conflict"].map(action => [action, operations.filter(item => item.action === action).length]))
    };
  }
  let existingGitignore = "";
  if (await pathExists(gitignorePath)) {
    try {
      existingGitignore = await fs.readFile(gitignorePath, "utf8");
    } catch (error) {
      operations.push({ action: "conflict", path: ".gitignore", content: "", detail: `existing path is not a readable text file: ${error.code || error.message}` });
      return {
        project: root,
        version: values.version,
        operations,
        counts: Object.fromEntries(["create", "merge", "unchanged", "conflict"].map(action => [action, operations.filter(item => item.action === action).length]))
      };
    }
  }
  const merged = mergeGitignore(existingGitignore, fragment);
  operations.push({
    action: merged === existingGitignore ? "unchanged" : existingGitignore ? "merge" : "create",
    path: ".gitignore",
    content: merged
  });
  return {
    project: root,
    version: values.version,
    operations,
    counts: Object.fromEntries(["create", "merge", "unchanged", "conflict"].map(action => [action, operations.filter(item => item.action === action).length]))
  };
}

export async function initProject(options) {
  const plan = await planInit(options);
  const conflicts = plan.operations.filter(item => item.action === "conflict");
  if (!options.apply || conflicts.length) {
    return { ...plan, applied: false, reason: conflicts.length ? "Resolve conflicts before apply; no files were written" : "Preview only" };
  }
  await fs.mkdir(plan.project, { recursive: true });
  const rollback = [];
  try {
    for (const operation of plan.operations) {
      if (!["create", "merge"].includes(operation.action)) continue;
      const destination = path.join(plan.project, operation.path);
      if (!(await pathWithinReal(plan.project, destination))) throw new Error(`${operation.path} resolves outside the project root`);
      const existed = await pathExists(destination);
      const previous = existed ? await fs.readFile(destination, "utf8") : null;
      rollback.push({ destination, existed, previous });
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, operation.content, "utf8");
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const entry of rollback.reverse()) {
      try {
        if (entry.existed) await fs.writeFile(entry.destination, entry.previous, "utf8");
        else await fs.rm(entry.destination, { force: true });
      } catch (rollbackError) {
        rollbackErrors.push(`${path.relative(plan.project, entry.destination)}: ${rollbackError.message}`);
      }
    }
    const suffix = rollbackErrors.length ? `; rollback errors: ${rollbackErrors.join("; ")}` : "";
    throw new Error(`Initialization failed and changes were rolled back: ${error.message}${suffix}`);
  }
  return { ...plan, applied: true, reason: "Project overlay initialized" };
}

function formatPlan(result) {
  const lines = [
    `${result.applied ? "APPLIED" : "PREVIEW"} Work OS ${result.version} -> ${result.project}`,
    `create ${result.counts.create}, merge ${result.counts.merge}, unchanged ${result.counts.unchanged}, conflict ${result.counts.conflict}`
  ];
  for (const operation of result.operations) lines.push(`${operation.action.toUpperCase()} ${operation.path}${operation.detail ? ` — ${operation.detail}` : ""}`);
  lines.push(result.reason);
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await initProject({ project: args.project || process.cwd(), apply: args.apply === true, date: args.date });
  if (args.format === "json") process.stdout.write(`${JSON.stringify({ ...result, operations: result.operations.map(({ content, ...item }) => item) }, null, 2)}\n`);
  else process.stdout.write(`${formatPlan(result)}\n`);
  if (result.counts.conflict) process.exitCode = 2;
}

if (isMain(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(`init error: ${error.message}\n`);
    process.exitCode = 1;
  });
}
