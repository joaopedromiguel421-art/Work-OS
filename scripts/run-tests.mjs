import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "../plugins/work-os/runtime/lib.mjs";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.dir || "tests");

async function discover(directory) {
  const found = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await discover(target));
    else if (entry.isFile() && entry.name.endsWith(".test.mjs")) found.push(target);
  }
  return found.sort();
}

let files;
try {
  files = await discover(root);
} catch (error) {
  process.stderr.write(`Cannot discover tests in ${root}: ${error.message}\n`);
  process.exit(1);
}
if (!files.length) {
  process.stderr.write(`No .test.mjs files found in ${root}\n`);
  process.exit(1);
}

const child = spawn(process.execPath, ["--test", "--test-concurrency=1", ...files], {
  stdio: "inherit",
  shell: false,
  windowsHide: true
});
child.on("error", error => {
  process.stderr.write(`Test runner failed: ${error.message}\n`);
  process.exitCode = 1;
});
child.on("close", code => { process.exitCode = code ?? 1; });
