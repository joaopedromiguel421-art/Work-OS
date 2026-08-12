import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

test("license and file-level provenance audit passes", () => {
  const result = spawnSync(process.execPath, ["scripts/license-audit.mjs"], { cwd: path.resolve("."), encoding: "utf8", shell: false });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /9 sources, 20 file-level records/);
});

test("plugin runtime contains no network client or default MCP configuration", async () => {
  const runtime = path.resolve("plugins", "work-os", "runtime");
  for (const file of await fs.readdir(runtime)) {
    if (!file.endsWith(".mjs")) continue;
    const text = await fs.readFile(path.join(runtime, file), "utf8");
    assert.doesNotMatch(text, /\bfetch\s*\(|node:https|node:http/, file);
  }
  const packageJson = JSON.parse(await fs.readFile(path.resolve("package.json"), "utf8"));
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
});
