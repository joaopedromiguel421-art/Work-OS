import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  isMain,
  parseArgs,
  pathExists,
  pathWithin,
  pathWithinReal,
  readJson,
  truncate
} from "./lib.mjs";

const DEFAULT_TIMEOUT = 120_000;

function selectedForProfile(check, profile) {
  if (check.enabled === false) return false;
  if (!check.profiles) return true;
  return Array.isArray(check.profiles) && check.profiles.includes(profile);
}

function normalizeManifest(manifest) {
  if (manifest.schemaVersion !== 1) throw new Error("quality manifest schemaVersion must be 1");
  if (!Array.isArray(manifest.checks)) throw new Error("quality manifest checks must be an array");
  const ids = new Set();
  for (const check of manifest.checks) {
    if (!check.id || typeof check.id !== "string") throw new Error("every quality check needs an id");
    if (ids.has(check.id)) throw new Error(`duplicate quality check id: ${check.id}`);
    ids.add(check.id);
    if (!check.kind || !["builtin", "command"].includes(check.kind)) {
      throw new Error(`quality check ${check.id} has unsupported kind`);
    }
  }
  return manifest;
}

async function runProcess(check, project) {
  if (!check.command || /[\r\n]/.test(check.command)) throw new Error("command checks need one executable name");
  const cwd = path.resolve(project, check.cwd || ".");
  if (!pathWithin(project, cwd) || !(await pathWithinReal(project, cwd))) throw new Error("quality check cwd must stay inside the project, including resolved symlinks");
  const args = Array.isArray(check.args) ? check.args.map(String) : [];
  const timeoutMs = Number(check.timeoutMs || DEFAULT_TIMEOUT);
  const started = Date.now();
  return await new Promise(resolve => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const child = spawn(check.command, args, {
      cwd,
      shell: false,
      windowsHide: true,
      env: { ...process.env, ...(check.env || {}) }
    });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);
    child.stdout.on("data", chunk => { stdout = truncate(stdout + chunk, 20_000); });
    child.stderr.on("data", chunk => { stderr = truncate(stderr + chunk, 20_000); });
    child.on("error", error => {
      clearTimeout(timer);
      resolve({ ok: false, exitCode: null, durationMs: Date.now() - started, stdout, stderr: error.message, timedOut });
    });
    child.on("close", exitCode => {
      clearTimeout(timer);
      resolve({ ok: exitCode === 0 && !timedOut, exitCode, durationMs: Date.now() - started, stdout, stderr, timedOut });
    });
  });
}

async function builtinFilesExist(check, project) {
  const missing = [];
  for (const relative of check.paths || []) {
    if (!(await pathExists(path.resolve(project, relative)))) missing.push(relative);
  }
  return { ok: missing.length === 0, message: missing.length ? `Missing: ${missing.join(", ")}` : "All required files exist" };
}

async function builtinJsonFiles(check, project) {
  const errors = [];
  for (const relative of check.paths || []) {
    try {
      await readJson(path.resolve(project, relative));
    } catch (error) {
      errors.push(`${relative}: ${error.message}`);
    }
  }
  return { ok: errors.length === 0, message: errors.length ? errors.join("; ") : "JSON files are valid" };
}

async function builtinWorkOsProject(_check, project) {
  const required = [
    "CLAUDE.md",
    ".claude/settings.json",
    "context/.work-os.json",
    "context/project.md",
    "context/architecture.md",
    "specs/current.md",
    "quality/quality.json"
  ];
  const missing = [];
  for (const relative of required) if (!(await pathExists(path.join(project, relative)))) missing.push(relative);
  const errors = [];
  if (missing.length) errors.push(`missing ${missing.join(", ")}`);
  if (await pathExists(path.join(project, ".mcp.json"))) errors.push(".mcp.json exists; MCPs must be explicitly reviewed and opted in");
  try {
    const lines = (await fs.readFile(path.join(project, "CLAUDE.md"), "utf8")).split(/\r?\n/).length;
    if (lines > 200) errors.push(`CLAUDE.md has ${lines} lines (limit 200)`);
  } catch {}
  for (const relative of [".claude/settings.json", "context/.work-os.json", "quality/quality.json"]) {
    if (await pathExists(path.join(project, relative))) {
      try { await readJson(path.join(project, relative)); } catch (error) { errors.push(`${relative}: ${error.message}`); }
    }
  }
  return { ok: errors.length === 0, message: errors.length ? errors.join("; ") : "Work OS project overlay is healthy" };
}

async function runBuiltin(check, project) {
  if (check.builtin === "files-exist") return builtinFilesExist(check, project);
  if (check.builtin === "json-files") return builtinJsonFiles(check, project);
  if (check.builtin === "work-os-project") return builtinWorkOsProject(check, project);
  throw new Error(`unknown builtin: ${check.builtin}`);
}

export async function runQuality({ project = process.cwd(), profile, manifestPath } = {}) {
  const root = path.resolve(project);
  const target = path.resolve(manifestPath || path.join(root, "quality", "quality.json"));
  const started = Date.now();
  if (!(await pathExists(target))) {
    return { ok: true, skipped: true, profile: profile || null, project: root, durationMs: 0, checks: [], message: "No quality manifest" };
  }
  const manifest = normalizeManifest(await readJson(target));
  const activeProfile = profile || manifest.defaultProfile || "standard";
  if (manifest.profiles && !Object.hasOwn(manifest.profiles, activeProfile)) {
    throw new Error(`unknown quality profile: ${activeProfile}`);
  }
  const checks = [];
  for (const check of manifest.checks.filter(item => selectedForProfile(item, activeProfile))) {
    const checkStarted = Date.now();
    try {
      const raw = check.kind === "command" ? await runProcess(check, root) : await runBuiltin(check, root);
      const required = check.required !== false;
      checks.push({
        id: check.id,
        description: check.description || check.id,
        kind: check.kind,
        required,
        ok: Boolean(raw.ok),
        status: raw.ok ? "pass" : required ? "fail" : "warn",
        durationMs: raw.durationMs ?? Date.now() - checkStarted,
        exitCode: raw.exitCode,
        timedOut: raw.timedOut || false,
        message: truncate(raw.message || raw.stderr || raw.stdout || (raw.ok ? "Passed" : "Failed"), 2_000),
        stdout: raw.stdout ? truncate(raw.stdout, 4_000) : undefined,
        stderr: raw.stderr ? truncate(raw.stderr, 4_000) : undefined
      });
    } catch (error) {
      checks.push({
        id: check.id,
        description: check.description || check.id,
        kind: check.kind,
        required: check.required !== false,
        ok: false,
        status: check.required === false ? "warn" : "fail",
        durationMs: Date.now() - checkStarted,
        message: truncate(error.message, 2_000)
      });
    }
  }
  const failed = checks.filter(check => check.status === "fail");
  return {
    ok: failed.length === 0,
    skipped: false,
    profile: activeProfile,
    project: root,
    manifest: target,
    durationMs: Date.now() - started,
    counts: {
      pass: checks.filter(check => check.status === "pass").length,
      warn: checks.filter(check => check.status === "warn").length,
      fail: failed.length
    },
    checks
  };
}

export function formatQuality(result) {
  if (result.skipped) return `SKIP quality: ${result.message}`;
  const lines = [`${result.ok ? "PASS" : "FAIL"} quality:${result.profile} (${result.durationMs}ms)`];
  for (const check of result.checks) {
    lines.push(`${check.status.toUpperCase()} ${check.id}: ${check.message}`);
  }
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runQuality({
    project: args.project || process.cwd(),
    profile: args.profile,
    manifestPath: args.manifest
  });
  if (args.format === "json") process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`${formatQuality(result)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (isMain(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(`quality runner error: ${error.message}\n`);
    process.exitCode = 2;
  });
}
