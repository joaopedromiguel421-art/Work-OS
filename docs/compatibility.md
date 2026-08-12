# Compatibility

| Component | Supported |
|---|---|
| Claude Code | 2.1.227+ |
| Node.js | 22 and 24 CI matrix |
| Operating systems | Windows, macOS, Linux |
| Module format | JavaScript ESM |
| Runtime dependencies | None |
| Shell requirement | None for Work OS runtime/quality commands |

Paths use `node:path`; child checks use `spawn` with `shell: false`; text files normalize LF while `.gitattributes` preserves appropriate Windows script endings if such scripts are added later. Tests simulate Windows and POSIX path/security cases, and CI executes on all three operating systems.

No PowerShell/Bash-specific installer exists. Marketplace installation and `/work-os:work init` are the supported paths.
