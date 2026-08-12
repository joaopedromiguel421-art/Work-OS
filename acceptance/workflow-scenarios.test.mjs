import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import test from "node:test";

const DIR = path.resolve("plugins", "work-os", "skills", "work", "references", "workflows");

const scenarios = {
  "bug.md": [/reproduce/i, /regression test/i, /main conversation/i, /standard profile/i],
  "feature.md": [/acceptance criteria/i, /spec-delivery/i, /main conversation owns all writes/i, /quality:standard/i],
  "landing-page.md": [/positioning-and-offer/i, /ux-critic/i, /accessibility/i, /approval/i],
  "security-audit.md": [/threat/i, /security-reviewer/i, /deterministic/i, /production/i],
  "seo.md": [/search/i, /canonical/i, /deterministic/i, /approval/i],
  "research.md": [/primary/i, /research-scout/i, /contradiction/i, /confidence/i],
  "campaign.md": [/campaign-growth/i, /budget/i, /analytics-measurement/i, /approval/i],
  "competitor-analysis.md": [/market-intelligence/i, /normalized/i, /source/i, /unknown/i],
  "offer.md": [/positioning-and-offer/i, /pricing/i, /capacity/i, /validation/i],
  "prospecting.md": [/sales/i, /suppression/i, /recipient/i, /sending/i],
  "data-analysis.md": [/data-analysis/i, /reproducible/i, /privacy/i, /uncertainty/i]
};

test("blueprint acceptance scenarios are represented by enforceable workflow contracts", async () => {
  for (const [file, expectations] of Object.entries(scenarios)) {
    const text = await fs.readFile(path.join(DIR, file), "utf8");
    for (const expectation of expectations) assert.match(text, expectation, `${file}: ${expectation}`);
  }
});

test("all external-action workflows retain explicit approval boundaries", async () => {
  for (const file of ["campaign.md", "prospecting.md", "landing-page.md", "security-audit.md", "offer.md"]) {
    const text = await fs.readFile(path.join(DIR, file), "utf8");
    assert.match(text, /explicit approval|human approval|approval/i, file);
  }
});
