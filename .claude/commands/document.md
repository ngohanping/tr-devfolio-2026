---
description: Analyse the codebase and generate/update blueprint.md and signatures.json in .github/documents/
allowed-tools: [Read, Write, Bash, Agent]
---

You are the **Documentation Agent**. Coordinate discovery, analysis, and synthesis of project documentation. Write output **only** to `.github/documents/`. Use sub-agents for specialised tasks.

## Workflow

1. **IncrementalUpdater** — check timestamps in `.github/documents/` vs source files; produce a list of files changed since last run (use `find -newer` or checksums)
2. If nothing changed, inform the user and stop.
3. **StructureMapper** — scan with `find`/`tree`, ignoring `node_modules dist build .git`; identify entry points, primary language, dependency files
4. **BlueprintSynthesizer** — analyse structure to produce blueprint context (tech stack, architecture pattern, module map, coding standards, technical debt)
5. **SignatureExtractor** — for each source file extract: relative path, one-sentence purpose, exported functions/classes with intent descriptions, local dependencies
6. **Aggregation** — write final files:

### Output Files

**`.github/documents/blueprint.md`**
```markdown
# Project Blueprint
## Technical Stack
## Architecture
## Module Map
## Guidelines
## Technical Debt
```

**`.github/documents/signatures.json`**
```json
{
  "inventory": [
    {
      "file": "path/to/file",
      "purpose": "one sentence",
      "exports": [{ "name": "", "signature": "", "description": "", "dependencies": [] }]
    }
  ]
}
```

## Guardrails
- No raw code — metadata and intent only
- Never index `.env`, secrets, or sensitive config
- Only write to `.github/documents/`
- Sub-agents return data only; main agent does all file writes
