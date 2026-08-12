import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { handleHook } from "../plugins/work-os/runtime/hook.mjs";
import { summarizeRuns } from "../plugins/work-os/runtime/telemetry.mjs";

test("local JSONL observability summarizes Skills without exporting data", async t => {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-telemetry-project-"));
  const data = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-telemetry-data-"));
  t.after(() => fs.rm(project, { recursive: true, force: true }));
  t.after(() => fs.rm(data, { recursive: true, force: true }));
  process.env.CLAUDE_PLUGIN_DATA = data;
  await handleHook({ hook_event_name: "PreToolUse", session_id: "telemetry", cwd: project, tool_name: "Skill", tool_input: { skill: "work-os:spec-delivery" } });
  const summary = await summarizeRuns({ project });
  assert.equal(summary.hookErrors, 0);
  assert.deepEqual(summary.skills, [{ name: "work-os:spec-delivery", count: 1 }]);
  assert.ok(summary.records >= 1);
});
