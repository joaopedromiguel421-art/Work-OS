# Upstream policy

`manifest.json` pins every approved influence. Work OS uses clean-room, project-specific wording and does not vendor complete repositories or complete upstream Skills.

An update is a review task, not a merge task:

1. The read-only checker reports newer default-branch commits.
2. A maintainer reviews the pinned-to-latest diff and license changes.
3. Only a clearly useful concept or file is selected.
4. The adaptation note, pin, blob hash, tests, and notices change together.
5. Local Work OS files remain authoritative; upstream content never overwrites them automatically.

Submodules and subtrees are intentionally not used because the selected units are small and heavily adapted.
