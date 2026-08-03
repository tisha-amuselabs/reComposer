#!/usr/bin/env node
// Wraps `next dev`: regenerates the items index once up front, then keeps
// watching src/app/vansh/data/items/ for the rest of the session so newly
// added item files show up (in rotation, and in the ?demo=1 picker) without
// restarting the dev server.

import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { generate, itemsDir } from "./generate-items-index.mjs";

generate();

let timer = null;
const watcher = watch(itemsDir, { persistent: true }, (_event, filename) => {
  if (!filename || filename === "index.ts") return;
  clearTimeout(timer);
  timer = setTimeout(generate, 150);
});

const child = spawn(process.platform === "win32" ? "next.cmd" : "next", ["dev"], {
  stdio: "inherit",
});

function shutdown(signal) {
  watcher.close();
  if (!child.killed) child.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  watcher.close();
  process.exit(code ?? (signal ? 1 : 0));
});
