import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

const directory = path.resolve("plugins", "work-os", "skills", "work", "references", "workflows");

test("all 14 workflows define entry, main ownership, parallelism, gates, and completion", async () => {
  const files = (await fs.readdir(directory)).filter(file => file.endsWith(".md")).sort();
  assert.equal(files.length, 14);
  for (const file of files) {
    const text = await fs.readFile(path.join(directory, file), "utf8");
    assert.match(text, /^## Entry$/m, `${file} entry`);
    assert.match(text, /^## Main-conversation sequence$/m, `${file} main sequence`);
    assert.match(text, /parallel|Separate context/i, `${file} parallelism`);
    assert.match(text, /quality|gate/i, `${file} quality gate`);
    assert.match(text, /^## Complete when$/m, `${file} completion`);
    assert.match(text, /main conversation/i, `${file} write ownership`);
  }
});
