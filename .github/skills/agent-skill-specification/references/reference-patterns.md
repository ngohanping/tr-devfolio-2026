# Reference File Best Practices

Guidelines for organizing `references/`, `scripts/`, and `assets/` directories for maximum clarity and efficiency.

## Directory Organization

### `references/` Directory

Store detailed documentation and lookups that agents load on demand.

**Purpose:** Keep SKILL.md lean while maintaining depth through referenced files.

**Structure:**

```
skill-name/
├── SKILL.md
├── references/
│   ├── REFERENCE.md (or reference-guide.md) — Main detailed reference
│   ├── language-patterns.md — Language-specific patterns
│   ├── secret-patterns.md — Regex and detection patterns
│   ├── forms.md — Structured data templates
│   └── examples.md — Detailed use cases
```

**File Naming:**

- Use lowercase with hyphens: `language-patterns.md` ✅
- Avoid underscores: `language_patterns.md` ❌
- Be descriptive: `secret-patterns.md` ✅ vs `patterns.md` ❌
- Use `.md` extension consistently

**Reference Guidelines:**

If the SKILL.md is lengthy, complex, or covers multiple topics, use the `references/` directory to offload detailed information (typically over 100–150 lines or if it exceeds a few KB).

### `scripts/` Directory

Store executable code that agents can run.

**Purpose:** Execute utility functions, validation, or integration logic.

**Structure:**

```
skill-name/
├── SKILL.md
├── scripts/
│   ├── validate.py — Main Python script
│   ├── helpers.py — Shared utilities
│   └── requirements.txt — Python dependencies
```

**Script Guidelines:**

- Self-contained: declare dependencies clearly
- Helpful errors: include error messages and debugging info
- Handle edge cases: don't crash on unexpected input
- Supported languages: Python, Bash, JavaScript (agent-dependent)

**Example Script Header:**

```python
#!/usr/bin/env python3
"""
Validate a skill against the agentskills.io specification.

Dependencies: pyyaml (install: pip install pyyaml)
Usage: python scripts/validate.py /path/to/skill
"""
```

### `assets/` Directory

Store static resources: templates, images, data files.

**Purpose:** Provide templates, diagrams, lookup tables agents reference.

**Structure:**

```
skill-name/
├── SKILL.md
├── assets/
│   ├── templates/
│   │   └── response-template.md
│   ├── images/
│   │   └── workflow-diagram.png
│   └── data/
│       └── vulnerability-lookup.json
```

**File Types:**

- Templates: `.md`, `.txt`, `.json` (text-based)
- Images: `.png`, `.jpg`, `.svg` (for diagrams, examples)
- Data: `.json`, `.csv`, `.yaml` (lookup tables, reference data)

## Cross-File References

### How to Reference Files

In SKILL.md and reference files, use relative paths:

**Correct:**

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the validation script: `scripts/validate.py`
```

**Incorrect:**

```markdown
See [the guide](/path/to/references/REFERENCE.md) — absolute path ❌
See [the guide](./references/REFERENCE.md) — unnecessary ./ ❌
See [the guide](REFERENCE.md) — incorrect relative path ❌
```

### One-Level-Deep References

Keep reference chains shallow. Don't create files that reference other files.

**Good:**

```
SKILL.md → references/guide.md (depth: 1)
```

**Bad:**

```
SKILL.md → references/guide.md → references/deep/other.md (depth: 2+)
```

**Why:** Prevents agents from chasing deeply nested reference chains that exhaust context.

### When to Load References

Mention in SKILL.md instructions when to read each reference file:

**Good Example:**

```markdown
### Step 2 — Dependency Audit

Before scanning, audit dependencies:

- Check package.json for known vulnerable packages
- Read `references/vulnerable-packages.md` for CVE watchlist
```

**Bad Example:**

```markdown
Audit dependencies. (No mention of when to read references.)
```

## File Naming Patterns

### Reference Files

- `REFERENCE.md` or `reference-guide.md` — Main detailed reference
- `{topic}-patterns.md` — Pattern lookup (e.g., `secret-patterns.md`, `language-patterns.md`)
- `{topic}-checklist.md` — Validation or task checklist
- `{domain}.md` — Domain-specific guide (e.g., `finance.md`, `legal.md`)
- `examples.md` — Additional examples and use cases
- `forms.md` — Structured data templates or forms

### Scripts

- `validate.py` — Validation logic
- `transform.py` — Data transformation
- `helpers.py` — Utility functions
- `main.sh` — Main bash script entry point
- `setup.sh` — Setup or initialization script

### Assets

- `templates/response-template.md` — Document template
- `templates/form-template.json` — JSON form template
- `images/workflow.png` — Workflow diagram
- `data/lookup.json` — Reference lookup data

## File Size Guidelines

Keep files focused and navigable:

| File Type       | Target Size                 | Max Size      |
| --------------- | --------------------------- | ------------- |
| SKILL.md body   | 1,000-2,000 words (~2-4KB)  | < 5,000 words |
| Reference files | 500-1,500 words (~1-3KB)    | < 3,000 words |
| Scripts         | Self-contained, < 500 lines | < 1,000 lines |
| Checklists      | 50-250 items                | < 500 items   |

**Why:** Agents load entire files into context. Smaller files = more efficiency.

## Documentation in Scripts

Include clear documentation headers:

**Python:**

```python
#!/usr/bin/env python3
"""
Purpose: Brief description of what this script does.

Dependencies:
  - Package name (install: pip install package-name)
  - Another package

Usage:
  python scripts/script.py <argument>

Example:
  python scripts/script.py /path/to/skill

Environment Variables:
  VARIABLE_NAME - Description
"""

import sys

def main():
    """Main script entry point."""
    pass

if __name__ == "__main__":
    main()
```

**Bash:**

```bash
#!/bin/bash
# Purpose: Brief description
# Dependencies: git, jq, python3
# Usage: ./scripts/script.sh <argument>

set -e  # Exit on error

main() {
    echo "Running script..."
}

main "$@"
```

## Progressive Disclosure Example

Structure a skill to load context efficiently:

```
SKILL.md (loaded first, ~2KB)
├── Short description
├── When to use
├── Quick overview of 8-step workflow
└── Reference files section with "Load X when you...

references/step-details.md (loaded on demand, ~1.5KB)
├── Step 1: Overview, quick reference
├── Step 2: Overview, quick reference
├── Step 3: "See language-patterns.md for details"
└── ...other steps summarized

references/language-patterns.md (loaded on demand, ~2KB)
├── Language-specific patterns
├── Framework-specific vulnerabilities
└── Detection signals
```

**Result:** Agent loads ~2KB initially, then 1-2KB per reference as needed. Avoids loading 6KB+ upfront.

## Validation Checklist for References

When adding references:

- [ ] File exists and has proper extension (.md, .py, etc.)
- [ ] File is mentioned in SKILL.md instructions
- [ ] File size is reasonable (< 3KB recommended)
- [ ] File is one level deep from SKILL.md
- [ ] File references don't chain deeply
- [ ] Path references are relative and correct
- [ ] Documentation headers are clear (scripts only)
- [ ] File is focused on one topic or domain
- [ ] No orphaned files (all files are referenced)
