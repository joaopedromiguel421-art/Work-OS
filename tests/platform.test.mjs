import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathWithinReal, pathWithinUsing } from "../plugins/work-os/runtime/lib.mjs";

test("path containment works for POSIX paths", () => {
  assert.equal(pathWithinUsing(path.posix, "/repo", "/repo/src/a.js"), true);
  assert.equal(pathWithinUsing(path.posix, "/repo", "/repo-other/a.js"), false);
  assert.equal(pathWithinUsing(path.posix, "/repo", "/tmp/a.js"), false);
});

test("path containment works for Windows drives and siblings", () => {
  assert.equal(pathWithinUsing(path.win32, "C:\\repo", "C:\\repo\\src\\a.js"), true);
  assert.equal(pathWithinUsing(path.win32, "C:\\repo", "C:\\repo-other\\a.js"), false);
  assert.equal(pathWithinUsing(path.win32, "C:\\repo", "D:\\repo\\a.js"), false);
});

test("resolved containment rejects a symlink that escapes the project", async t => {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), "work-os-symlink-"));
  t.after(() => fs.rm(parent, { recursive: true, force: true }));
  const project = path.join(parent, "project");
  const outside = path.join(parent, "outside");
  await fs.mkdir(project);
  await fs.mkdir(outside);
  const link = path.join(project, "linked");
  await fs.symlink(outside, link, process.platform === "win32" ? "junction" : "dir");
  assert.equal(await pathWithinReal(project, path.join(link, "file.txt")), false);
  assert.equal(await pathWithinReal(project, path.join(project, "safe", "file.txt")), true);
});
