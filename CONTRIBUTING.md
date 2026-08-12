# Contributing

1. Read `CLAUDE.md`, architecture ADRs, capability ownership, security policy, and upstream policy.
2. Open a bounded change. Do not add an overlapping Skill/agent or a new runtime abstraction without an accepted ADR.
3. Keep Node.js runtime code dependency-free and shell-free. Test paths on Windows, macOS, and Linux semantics.
4. Update descriptions and routing cases together when a Skill's scope changes.
5. Update source pin, file blob SHA, adaptation record, license notice, and tests together when external material influences a change.
6. Run `npm run verify`.

Changes that enable an MCP, credential, external action, telemetry export, production target, or destructive command by default are out of scope for V1.
