# Upstreams, updates, and licenses

The repository uses pinned conceptual adaptations, not forks, submodules, subtrees, or whole-source copies. `upstream/manifest.json` pins repository commits and license blobs. `upstream/adaptations.json` pins every consulted source file by Git blob SHA and maps it to local targets and an adaptation note.

## Update process

1. Run `npm run upstream:check` or review the weekly read-only CI output.
2. Compare the pinned commit to the reported head.
3. Review only changes relevant to the selected source files and check repository/subdirectory license changes.
4. Decide whether a concept improves the single Work OS authority. Reject duplicates and upstream runtime/orchestration.
5. Rewrite/adapt locally; never overwrite from upstream.
6. Update commit, blob SHA, adaptation record, notices, routing/acceptance tests, and changelog together.
7. Run the release quality profile and human license review.

## License policy

Work OS is Apache-2.0. MIT and Apache-2.0 conceptual sources allow commercial use, modification, and redistribution subject to notices/terms retained in `licenses/`, `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`. The manifest pins applicable Apache NOTICE and selected-subdirectory license blobs separately from aggregator roots. Anthropic Skills has per-skill mixed terms; Work OS uses it only as reference and excludes source-available document/brand content.

Projects classified reference-only or share-alike/incompatible are not incorporated. The audit is a technical completeness check, not legal advice; a release owner performs the final legal review.
