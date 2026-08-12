import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { handleHook } from "../plugins/work-os/runtime/hook.mjs";

test("sensitive command matrix is denied or escalated, never auto-approved", async t => {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-security-project-"));
  const data = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-security-data-"));
  t.after(() => fs.rm(project, { recursive: true, force: true }));
  t.after(() => fs.rm(data, { recursive: true, force: true }));
  process.env.CLAUDE_PLUGIN_DATA = data;
  const expectations = [
    ["rm -rf /", "deny"],
    ["rm -rf .", "deny"],
    ["find . -type f -delete", "deny"],
    ["git push --force origin main", "deny"],
    ["git clean -fd", "deny"],
    ["npm install unknown-package", "ask"],
    ["npm ci", "ask"],
    ["npx unknown-package", "ask"],
    ["npm publish", "ask"],
    ["rm -rf build", "ask"],
    ["git restore src/app.js", "ask"],
    ["curl --request POST https://example.invalid/resource", "ask"],
    ["terraform apply", "ask"],
    ["prisma migrate deploy", "ask"],
    ["git push origin feature", "ask"]
  ];
  for (const [command, expected] of expectations) {
    const output = await handleHook({ hook_event_name: "PreToolUse", session_id: `case-${command}`, cwd: project, tool_name: "Bash", tool_input: { command } });
    assert.equal(output.hookSpecificOutput.permissionDecision, expected, command);
    assert.notEqual(output.hookSpecificOutput.permissionDecision, "allow");
  }
});

test("project template disables automatic MCP activation and protects known secret paths", async () => {
  const settings = JSON.parse(await fs.readFile(path.resolve("plugins", "work-os", "templates", "project", ".claude", "settings.json"), "utf8"));
  assert.equal(settings.enableAllProjectMcpServers, false);
  assert.deepEqual(settings.enabledMcpjsonServers, []);
  assert.ok(settings.permissions.deny.includes("Read(./.env)"));
  assert.ok(settings.permissions.deny.some(rule => rule.includes("--dangerously-skip-permissions")));
});
