import { isMain, readState, readStdinJson } from "./lib.mjs";

async function main() {
  const input = await readStdinJson();
  const state = await readState(input);
  const active = Object.keys(state.active || {}).length;
  const model = input.model?.display_name || input.model?.id || input.model || "model";
  const context = Number.isFinite(input.context_window?.used_percentage) ? ` ctx ${Math.round(input.context_window.used_percentage)}%` : "";
  process.stdout.write(`WO ${model}${context} agents ${active}/2`);
}

if (isMain(import.meta.url)) main().catch(() => process.stdout.write("WO"));
