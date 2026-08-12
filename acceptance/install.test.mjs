import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = path.resolve(".");
const PLUGIN = path.join(ROOT, "plugins", "work-os");
const CLAUDE_BIN = process.env.CLAUDE_BIN || "claude";

test("marketplace resolves exactly one installable local plugin", async () => {
  const marketplace = JSON.parse(await fs.readFile(path.join(ROOT, ".claude-plugin", "marketplace.json"), "utf8"));
  assert.equal(marketplace.name, "work-os-marketplace");
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, "work-os");
  assert.equal(path.resolve(ROOT, marketplace.plugins[0].source), PLUGIN);
  const plugin = JSON.parse(await fs.readFile(path.join(PLUGIN, ".claude-plugin", "plugin.json"), "utf8"));
  assert.equal(plugin.name, "work-os");
  assert.equal(plugin.version, marketplace.plugins[0].version);
});

test("plugin uses native discovery paths and portable Node hook commands", async () => {
  const hooks = JSON.parse(await fs.readFile(path.join(PLUGIN, "hooks", "hooks.json"), "utf8"));
  assert.equal(Object.keys(hooks.hooks).length, 13);
  for (const groups of Object.values(hooks.hooks)) {
    for (const group of groups) for (const hook of group.hooks) {
      assert.equal(hook.type, "command");
      assert.equal(hook.command, "node");
      assert.deepEqual(hook.args, ["${CLAUDE_PLUGIN_ROOT}/runtime/hook.mjs"]);
    }
  }
  assert.equal(await fs.access(path.join(PLUGIN, "skills")).then(() => true), true);
  assert.equal(await fs.access(path.join(PLUGIN, "agents")).then(() => true), true);
  assert.equal(await fs.access(path.join(PLUGIN, ".mcp.json")).then(() => true, () => false), false);
  assert.equal(await fs.access(path.join(PLUGIN, "commands")).then(() => true, () => false), false);
});

test("official Claude CLI validates the plugin and marketplace when the CLI is installed", t => {
  const version = spawnSync(CLAUDE_BIN, ["--version"], { encoding: "utf8", shell: false });
  if (version.error?.code === "ENOENT") return t.skip("Claude CLI is not installed in this test environment");
  assert.equal(version.status, 0, version.stderr);
  for (const target of ["./plugins/work-os", "./.claude-plugin/marketplace.json"]) {
    const result = spawnSync(CLAUDE_BIN, ["plugin", "validate", "--strict", target], {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    });
    assert.equal(result.status, 0, `${target}\n${result.stdout}\n${result.stderr}`);
  }
});

test("official Claude CLI installs the local marketplace and plugin in isolation", async t => {
  const version = spawnSync(CLAUDE_BIN, ["--version"], { encoding: "utf8", shell: false });
  if (version.error?.code === "ENOENT") return t.skip("Claude CLI is not installed in this test environment");
  assert.equal(version.status, 0, version.stderr);

  const configDir = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-cli-install-"));
  t.after(() => fs.rm(configDir, { recursive: true, force: true }));
  const env = {
    ...process.env,
    CLAUDE_CONFIG_DIR: configDir,
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    DISABLE_TELEMETRY: "1",
    DISABLE_ERROR_REPORTING: "1",
    DISABLE_AUTOUPDATER: "1"
  };
  delete env.ANTHROPIC_API_KEY;
  delete env.CLAUDE_CODE_OAUTH_TOKEN;

  const add = spawnSync(CLAUDE_BIN, ["plugin", "marketplace", "add", ROOT, "--scope", "user"], {
    cwd: ROOT,
    encoding: "utf8",
    env,
    shell: false
  });
  assert.equal(add.status, 0, `${add.stdout}\n${add.stderr}`);

  const install = spawnSync(CLAUDE_BIN, ["plugin", "install", "work-os@work-os-marketplace", "--scope", "user"], {
    cwd: ROOT,
    encoding: "utf8",
    env,
    shell: false
  });
  assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);

  const list = spawnSync(CLAUDE_BIN, ["plugin", "list", "--json"], {
    cwd: ROOT,
    encoding: "utf8",
    env,
    shell: false
  });
  assert.equal(list.status, 0, `${list.stdout}\n${list.stderr}`);
  const installed = JSON.parse(list.stdout);
  const workOs = installed.find(plugin => plugin.id === "work-os@work-os-marketplace");
  assert.equal(workOs?.version, "0.1.0");
  assert.equal(workOs?.enabled, true);
  assert.equal(path.resolve(workOs.installPath).startsWith(path.resolve(configDir)), true);
  const installedSkills = (await fs.readdir(path.join(workOs.installPath, "skills"), { withFileTypes: true }))
    .filter(entry => entry.isDirectory());
  assert.equal(installedSkills.length, 25);
  assert.equal(await fs.access(path.join(workOs.installPath, "agents", "research-scout.md")).then(() => true), true);
  assert.equal(await fs.access(path.join(workOs.installPath, "hooks", "hooks.json")).then(() => true), true);
  assert.equal(await fs.access(path.join(workOs.installPath, ".mcp.json")).then(() => true, () => false), false);
});
