# Release policy

1. Keep marketplace and plugin versions identical.
2. Require a clean `npm run verify` result on Node 22 and the current Node LTS.
3. Require the Windows, macOS, and Linux CI matrix.
4. Run the license audit and review every upstream manifest change.
5. Update the changelog and compatibility notes.
6. Tag releases only after the marketplace/plugin pair validates in Claude Code.
7. Never enable an MCP, credential, deploy target, or telemetry export as a release default.
