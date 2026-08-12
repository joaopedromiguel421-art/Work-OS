import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";
import { inspectPlugin } from "../plugins/work-os/runtime/doctor.mjs";
import { validateRepository } from "../scripts/validate.mjs";

test("repository has the exact blueprint inventory and one owner per capability", async () => {
  const result = await validateRepository();
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.deepEqual(result.counts, { skills: 25, agents: 3, hooks: 13, workflows: 14 });
});

test("plugin doctor confirms native structure and no default MCP or legacy commands", async () => {
  const result = await inspectPlugin();
  assert.equal(result.ok, true);
  assert.equal(result.skills.length, 25);
  assert.equal(result.agents.length, 3);
  assert.equal(result.hooks.length, 13);
});

test("project quality template exposes the blueprint deterministic gate categories", async () => {
  const manifest = JSON.parse(await fs.readFile(path.resolve("plugins", "work-os", "templates", "project", "quality", "quality.json"), "utf8"));
  const ids = new Set(manifest.checks.map(check => check.id));
  for (const required of [
    "format-check", "lint", "typecheck", "unit-tests", "integration-tests", "build",
    "secret-scan", "dependency-security", "schema-validation", "migration-validation",
    "accessibility", "performance-budget"
  ]) assert.equal(ids.has(required), true, required);
  assert.equal(manifest.checks.find(check => check.id === "performance-budget").required, false);
  assert.equal(manifest.checks.filter(check => check.id !== "work-os-project").every(check => check.enabled === false), true);
});
