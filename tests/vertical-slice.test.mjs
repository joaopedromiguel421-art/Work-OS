import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectPlugin } from "../plugins/work-os/runtime/doctor.mjs";
import { handleHook } from "../plugins/work-os/runtime/hook.mjs";
import { initProject, planInit } from "../plugins/work-os/runtime/init.mjs";
import { runQuality } from "../plugins/work-os/runtime/quality.mjs";

async function temporaryProject(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}

test("vertical slice exposes a native marketplace plugin and all hook events", async () => {
  const inventory = await inspectPlugin({ allowPartial: true });
  assert.equal(inventory.ok, true);
  assert.equal(inventory.hooks.length, 13);
  assert.ok(inventory.skills.includes("work"));
});

test("project init previews, applies without overwrite, and is idempotent", async t => {
  const project = await temporaryProject(t);
  const preview = await planInit({ project, date: "2026-08-11" });
  assert.ok(preview.counts.create > 10);
  assert.equal(await fs.readdir(project).then(items => items.length), 0);

  const applied = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(applied.applied, true);
  assert.equal((await runQuality({ project, profile: "fast" })).ok, true);

  const second = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(second.applied, true);
  assert.equal(second.counts.conflict, 0);
  assert.equal(second.counts.create, 0);
  assert.equal(second.counts.merge, 0);
});

test("project init refuses conflicts before writing anything", async t => {
  const project = await temporaryProject(t);
  await fs.writeFile(path.join(project, "CLAUDE.md"), "existing\n", "utf8");
  const result = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(result.applied, false);
  assert.ok(result.counts.conflict >= 1);
  assert.equal(await fs.readFile(path.join(project, "CLAUDE.md"), "utf8"), "existing\n");
  assert.equal(await fs.access(path.join(project, "context")).then(() => true, () => false), false);
});

test("project init refuses a template path that escapes through a symlink", async t => {
  const parent = await temporaryProject(t);
  const project = path.join(parent, "project");
  const outside = path.join(parent, "outside");
  await fs.mkdir(project);
  await fs.mkdir(outside);
  await fs.symlink(outside, path.join(project, "context"), process.platform === "win32" ? "junction" : "dir");
  const result = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(result.applied, false);
  assert.ok(result.operations.some(operation => operation.action === "conflict" && operation.path.startsWith("context/")));
  assert.deepEqual(await fs.readdir(outside), []);
  assert.equal(await fs.access(path.join(project, ".claude")).then(() => true, () => false), false);
});

test("project init treats a non-file template destination as a conflict", async t => {
  const project = await temporaryProject(t);
  await fs.mkdir(path.join(project, "CLAUDE.md"));
  const result = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(result.applied, false);
  assert.ok(result.operations.some(operation => operation.path === "CLAUDE.md" && operation.action === "conflict"));
  assert.equal(await fs.access(path.join(project, "context")).then(() => true, () => false), false);
});

test("security hook denies destructive commands and asks for installs", async t => {
  const data = await temporaryProject(t);
  process.env.CLAUDE_PLUGIN_DATA = data;
  const common = { hook_event_name: "PreToolUse", session_id: "security", cwd: data, tool_name: "Bash" };
  const destructive = await handleHook({ ...common, tool_input: { command: "git reset --hard" } });
  assert.equal(destructive.hookSpecificOutput.permissionDecision, "deny");
  const install = await handleHook({ ...common, tool_input: { command: "npm install example" } });
  assert.equal(install.hookSpecificOutput.permissionDecision, "ask");
  const safe = await handleHook({ ...common, tool_input: { command: "npm test" } });
  assert.equal(safe, null);
});

test("post-write batch runs the initialized project's fast quality profile", async t => {
  const project = await temporaryProject(t);
  const data = await temporaryProject(t);
  process.env.CLAUDE_PLUGIN_DATA = data;
  await initProject({ project, apply: true, date: "2026-08-11" });
  const result = await handleHook({
    hook_event_name: "PostToolBatch",
    session_id: "batch",
    cwd: project,
    tool_calls: [{ tool_name: "Write", tool_input: { file_path: "x.txt" }, tool_response: "ok" }]
  });
  assert.equal(result.hookSpecificOutput.hookEventName, "PostToolBatch");
  assert.match(result.hookSpecificOutput.additionalContext, /passed/i);
});
