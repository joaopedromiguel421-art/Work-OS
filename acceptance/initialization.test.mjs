import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { doctor } from "../plugins/work-os/runtime/doctor.mjs";
import { initProject, planInit } from "../plugins/work-os/runtime/init.mjs";
import { runQuality } from "../plugins/work-os/runtime/quality.mjs";

test("a clean project previews, initializes, validates, and remains idempotent", async t => {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-accept-clean-"));
  t.after(() => fs.rm(project, { recursive: true, force: true }));
  const preview = await planInit({ project, date: "2026-08-11" });
  assert.equal(await fs.readdir(project).then(items => items.length), 0);
  assert.equal(preview.counts.conflict, 0);

  assert.equal((await initProject({ project, apply: true, date: "2026-08-11" })).applied, true);
  const health = await doctor({ project });
  assert.equal(health.ok, true);
  assert.equal((await runQuality({ project, profile: "standard" })).ok, true);
  assert.equal(await fs.access(path.join(project, ".mcp.json")).then(() => true, () => false), false);
  const claudeLines = (await fs.readFile(path.join(project, "CLAUDE.md"), "utf8")).split(/\r?\n/).length;
  assert.ok(claudeLines < 150);

  const repeat = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(repeat.counts.create + repeat.counts.merge + repeat.counts.conflict, 0);
});

test("initialization works in a path containing spaces", async t => {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-accept-space-"));
  const project = path.join(parent, "project with spaces");
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  const result = await initProject({ project, apply: true, date: "2026-08-11" });
  assert.equal(result.applied, true);
  assert.equal((await runQuality({ project, profile: "fast" })).ok, true);
});
