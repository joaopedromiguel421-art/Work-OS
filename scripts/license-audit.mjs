import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "upstream", "manifest.json"), "utf8"));
const adaptations = JSON.parse(await fs.readFile(path.join(ROOT, "upstream", "adaptations.json"), "utf8"));
const errors = [];

if (manifest.schemaVersion !== 1 || adaptations.schemaVersion !== 1) errors.push("unsupported provenance schema");
if (manifest.sources.length !== 9) errors.push(`expected 9 curated upstream sources, found ${manifest.sources.length}`);
const repositories = new Set(manifest.sources.map(source => source.repository));
const allowed = new Set(["MIT", "Apache-2.0", "mixed-per-skill"]);
for (const source of manifest.sources) {
  if (!/^[a-f0-9]{40}$/.test(source.commit)) errors.push(`${source.repository} commit is not pinned`);
  if (!allowed.has(source.license)) errors.push(`${source.repository} has unapproved license ${source.license}`);
  if (source.license !== "mixed-per-skill" && !/^[a-f0-9]{40}$/.test(source.licenseBlobSha || "")) errors.push(`${source.repository} license blob is not pinned`);
  for (const field of ["noticeBlobSha", "selectedDirectoryLicenseBlobSha"]) {
    if (source[field] && !/^[a-f0-9]{40}$/.test(source[field])) errors.push(`${source.repository} ${field} is not pinned`);
  }
  if (source.license === "mixed-per-skill" && source.classification !== "reference-and-structure-only") errors.push("mixed-license Anthropic Skills must remain reference-only");
}

const impeccable = manifest.sources.find(source => source.repository === "pbakaus/impeccable");
if (!impeccable?.noticeBlobSha || !impeccable.noticeDisposition) errors.push("Impeccable NOTICE applicability must be recorded");
const knowledgeWork = manifest.sources.find(source => source.repository === "anthropics/knowledge-work-plugins");
if (!knowledgeWork?.selectedDirectoryLicenseBlobSha || !knowledgeWork.licenseScope) errors.push("Knowledge Work selected-directory license scope must be pinned");

for (const record of adaptations.records) {
  if (!repositories.has(record.repository)) errors.push(`adaptation references unapproved repository ${record.repository}`);
  if (!/^[a-f0-9]{40}$/.test(record.blobSha || "")) errors.push(`${record.repository}:${record.source} lacks a blob SHA`);
  if (!Array.isArray(record.targets) || !record.targets.length) errors.push(`${record.repository}:${record.source} lacks targets`);
  if (!record.adaptation || record.adaptation.length < 20) errors.push(`${record.repository}:${record.source} lacks an adaptation note`);
}

for (const source of manifest.sources.filter(item => item.classification !== "reference-and-structure-only")) {
  if (!adaptations.records.some(record => record.repository.toLowerCase() === source.repository.toLowerCase())) errors.push(`${source.repository} has no file-level adaptation record`);
}

const requiredFiles = [
  "LICENSE",
  "NOTICE",
  "THIRD_PARTY_NOTICES.md",
  "licenses/MIT-OpenSpec.txt",
  "licenses/MIT-spec-kit.txt",
  "licenses/MIT-agent-skills.txt",
  "licenses/MIT-superpowers.txt",
  "licenses/MIT-marketingskills.txt",
  "licenses/MIT-ECC.txt",
  "upstream/adaptations/README.md"
];
for (const relative of requiredFiles) {
  try { await fs.access(path.join(ROOT, relative)); } catch { errors.push(`missing notice: ${relative}`); }
}

const pluginFiles = [];
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else pluginFiles.push(target);
  }
}
await walk(path.join(ROOT, "plugins", "work-os"));
for (const file of pluginFiles) {
  const text = await fs.readFile(file, "utf8").catch(() => "");
  if (/Complete terms in LICENSE\.txt|Copyright \(c\) 2025 Addy Osmani|Copyright \(c\) 2025 Jesse Vincent/.test(text)) errors.push(`possible unadapted upstream body in ${path.relative(ROOT, file)}`);
}

if (errors.length) {
  process.stderr.write(`FAIL license/provenance audit\n${errors.map(error => `- ${error}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`PASS license/provenance audit: ${manifest.sources.length} sources, ${adaptations.records.length} file-level records\n`);
}
