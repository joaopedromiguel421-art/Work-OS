import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve("plugins", "work-os");

function field(text, name) {
  const match = text.match(new RegExp(`^${name}:\\s*["']?(.+?)["']?$`, "m"));
  return match?.[1] || "";
}

test("Skill descriptions are distinct, bounded, and include positive/negative routing", async () => {
  const names = (await fs.readdir(path.join(ROOT, "skills"), { withFileTypes: true })).filter(item => item.isDirectory()).map(item => item.name);
  const descriptions = [];
  for (const name of names) {
    const text = await fs.readFile(path.join(ROOT, "skills", name, "SKILL.md"), "utf8");
    const description = field(text, "description");
    assert.match(description, /Use when/);
    assert.match(description, /Do not use/);
    assert.ok(description.length <= 500, `${name} description is too long`);
    descriptions.push(description);
  }
  assert.equal(new Set(descriptions).size, 25);

  const agentDescriptions = [];
  for (const file of await fs.readdir(path.join(ROOT, "agents"))) {
    agentDescriptions.push(field(await fs.readFile(path.join(ROOT, "agents", file), "utf8"), "description"));
  }
  const estimatedAlwaysOnTokens = Math.ceil((descriptions.join("\n").length + agentDescriptions.join("\n").length) / 4);
  assert.ok(estimatedAlwaysOnTokens < 4_000, `estimated always-on routing context ${estimatedAlwaysOnTokens} tokens`);
});

test("manual Skills cannot be model-invoked", async () => {
  for (const name of ["work", "project-context"]) {
    const text = await fs.readFile(path.join(ROOT, "skills", name, "SKILL.md"), "utf8");
    assert.match(text, /^disable-model-invocation:\s*true$/m);
  }
});

test("all custom agents are bounded read-only workers with no memory or nesting", async () => {
  const expected = {
    "research-scout.md": { maxTurns: "12", effort: "medium" },
    "security-reviewer.md": { maxTurns: "18", effort: "high" },
    "ux-critic.md": { maxTurns: "15", effort: "high" }
  };
  for (const [file, config] of Object.entries(expected)) {
    const text = await fs.readFile(path.join(ROOT, "agents", file), "utf8");
    const tools = field(text, "tools");
    for (const forbidden of ["Write", "Edit", "Bash", "Agent", "NotebookEdit", "Skill"]) assert.doesNotMatch(tools, new RegExp(`\\b${forbidden}\\b`));
    assert.equal(field(text, "model"), "sonnet");
    assert.equal(field(text, "effort"), config.effort);
    assert.equal(field(text, "maxTurns"), config.maxTurns);
    assert.doesNotMatch(text, /^memory:/m);
    assert.match(text, /Do not spawn/i);
  }
});
