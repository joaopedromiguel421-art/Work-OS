import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runQuality } from "../plugins/work-os/runtime/quality.mjs";

async function fixture(t, manifest) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-quality-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  if (manifest) {
    await fs.mkdir(path.join(root, "quality"), { recursive: true });
    await fs.writeFile(path.join(root, "quality", "quality.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  }
  return root;
}

const base = checks => ({ schemaVersion: 1, defaultProfile: "standard", profiles: { fast: {}, standard: {} }, checks });

test("quality runner skips projects without a manifest", async t => {
  const root = await fixture(t);
  const result = await runQuality({ project: root, profile: "standard" });
  assert.equal(result.ok, true);
  assert.equal(result.skipped, true);
});

test("quality runner executes commands without a shell and distinguishes warnings", async t => {
  const root = await fixture(t, base([
    { id: "pass", kind: "command", command: process.execPath, args: ["-e", "process.exit(0)"], profiles: ["standard"] },
    { id: "warn", kind: "command", command: process.execPath, args: ["-e", "process.exit(7)"], profiles: ["standard"], required: false }
  ]));
  const result = await runQuality({ project: root, profile: "standard" });
  assert.equal(result.ok, true);
  assert.deepEqual(result.checks.map(item => item.status), ["pass", "warn"]);
});

test("quality runner fails a required check and reports its ID", async t => {
  const root = await fixture(t, base([
    { id: "required-failure", kind: "command", command: process.execPath, args: ["-e", "process.stderr.write('expected');process.exit(3)"], profiles: ["standard"] }
  ]));
  const result = await runQuality({ project: root, profile: "standard" });
  assert.equal(result.ok, false);
  assert.equal(result.checks[0].id, "required-failure");
  assert.match(result.checks[0].message, /expected/);
});

test("quality runner times out and prevents cwd escape", async t => {
  const root = await fixture(t, base([
    { id: "timeout", kind: "command", command: process.execPath, args: ["-e", "setTimeout(()=>{}, 1000)"], timeoutMs: 30, profiles: ["standard"] },
    { id: "escape", kind: "command", command: process.execPath, args: ["-e", "process.exit(0)"], cwd: "..", profiles: ["standard"] }
  ]));
  const result = await runQuality({ project: root, profile: "standard" });
  assert.equal(result.ok, false);
  assert.equal(result.checks[0].timedOut, true);
  assert.match(result.checks[1].message, /inside the project/);
});
