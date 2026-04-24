# Frontmatter Examples

Valid and invalid frontmatter examples for the `SKILL.md` file.

## Minimal Valid Example

All required fields, no optional fields:

```yaml
---
name: code-review
description: 'Review code for quality, maintainability, and adherence to best practices. Use when analyzing code for improvements, checking for bugs, or ensuring consistent coding standards.'
---
```

---

## Full Example with Optional Fields

All fields included:

```yaml
---
name: api-documentation
description: 'Generate comprehensive API documentation from code annotations and usage patterns. Use when creating docs from TypeScript/JavaScript comments, building API references, or auto-generating endpoint specifications.'
license: MIT
compatibility: 'Requires Node.js 16+ and npm'
metadata:
  author: my-org
  version: '2.1'
  tags: 'documentation, api, generator'
allowed-tools: Bash(npm:*) Read Write
---
```

---

## Name Field Examples

### ✅ VALID

All follow the rules: 1-64 chars, lowercase, hyphens only, no leading/trailing hyphens, no consecutive hyphens.

```yaml
name: code-review
name: pdf-processing
name: data-analysis
name: skill123
name: api-docs
name: genai-chatbot
name: x  # Single character is OK
name: my-super-long-skill-name-that-is-still-under-64-characters  # 64 chars is max
```

### ❌ INVALID

```yaml
name: Code-Review  # ❌ Uppercase not allowed
name: -code-review  # ❌ Cannot start with hyphen
name: code-review-  # ❌ Cannot end with hyphen
name: code--review  # ❌ Consecutive hyphens not allowed
name: code_review  # ❌ Underscores not allowed
name: code.review  # ❌ Periods not allowed
name: code review  # ❌ Spaces not allowed
name: ''  # ❌ Empty string
name: this-is-a-very-long-skill-name-that-exceeds-the-sixty-four-character-limit-by-far  # ❌ Over 64 chars
```

---

## Description Field Examples

### ✅ GOOD

Clear action verbs, describes what agent can do, when to use it, specific keywords.

```yaml
description: 'Audit and identify security vulnerabilities in codebases by reasoning about code like a security researcher—tracing data flows, uncovering injection flaws, hardcoded secrets, and weak cryptography. Use when scanning for SQL injection, XSS, command injection, or conducting comprehensive security reviews across JavaScript, TypeScript, Python, Java, PHP, Go, Ruby, and Rust.'
```

```yaml
description: 'Extract text and tables from PDF files, fill PDF forms dynamically, and merge multiple PDFs into single documents. Use when handling PDF content, automating form filling, or combining PDF documents for reports or distribution.'
```

```yaml
description: 'Analyze code repositories for performance bottlenecks, memory leaks, and inefficient algorithms. Use when optimizing Node.js, Python, or Java applications, profiling runtime performance, or improving application scalability.'
```

### ⚠️ ACCEPTABLE BUT WEAK

Shorter, less specific:

```yaml
description: 'Generate API documentation from code. Use for TypeScript, JavaScript, and Python projects.'
```

### ❌ POOR

Too generic, vague, missing use cases:

```yaml
description: 'A tool that does code stuff.'
```

```yaml
description: 'Helps with processing.'
```

```yaml
description: 'Process data.' # No description of how to use it
```

---

## License Field Examples

### Valid

```yaml
license: MIT
license: Apache-2.0
license: GPL-3.0
license: Proprietary. See LICENSE.txt for terms
license: BSD-2-Clause
license: Unlicense
```

### With Bundled License File

```yaml
license: Proprietary — complete terms in LICENSE.md
```

---

## Compatibility Field Examples

### Valid (Real Constraints)

```yaml
compatibility: 'Requires Python 3.10+, pip, and uv'
```

```yaml
compatibility: 'Requires Git, Docker, Docker Compose, and Linux/macOS (tested on both; Windows requires WSL2)'
```

```yaml
compatibility: 'Designed for Claude Code and later versions'
```

```yaml
compatibility: 'Requires access to the internet and a valid API key'
```

### Invalid (Too Generic)

```yaml
compatibility: 'Compatible with everything'  # ❌ Not specific
compatibility: 'May have issues on some systems'  # ❌ Vague
compatibility: 'Not for casual users'  # ❌ Doesn't describe real constraints
```

---

## Metadata Field Examples

### ✅ Valid

```yaml
metadata:
  author: 'my-organization'
  version: '1.0.0'
```

```yaml
metadata:
  author: 'john-doe'
  version: '2.1.3'
  tags: 'security, audit, compliance'
  contact: 'security-team@example.com'
```

### ❌ Invalid

```yaml
metadata: # Missing values
  author:
  version:
```

```yaml
metadata: # Non-string values
  version: 1.0 # Should be "1.0"
  enabled: true # Should be "true" (quoted)
```

---

## Allowed-Tools Field Examples

### Valid (Experimental)

```yaml
allowed-tools: Read Write Bash
```

```yaml
allowed-tools: Bash(git:*) Bash(jq:*) Read
```

```yaml
allowed-tools: Python JavaScript
```

### Invalid

```yaml
allowed-tools: Read | Write  # ❌ Use space, not pipe
allowed-tools: 'Read, Write'  # ❌ Use space, not comma
```

---

## Full SKILL.md Frontmatter Template

Use this as a starting point:

```yaml
---
name: my-skill
description: 'Clear action verbs describing what the skill does and when to use it. Include specific keywords that help agents discover the skill for relevant tasks.'
license: MIT
compatibility: 'Specify any environment requirements (optional; omit if no special requirements)'
metadata:
  author: your-org
  version: '1.0'
allowed-tools: Tool1 Tool2
---
```

---

## Validation Rules Summary

| Field           | Required | Constraints                                                             | Example                             |
| --------------- | -------- | ----------------------------------------------------------------------- | ----------------------------------- |
| `name`          | Yes      | 1-64 chars, lowercase, hyphens, no leading/trailing/consecutive hyphens | `code-review`                       |
| `description`   | Yes      | 1-1024 chars, describe capability and use cases                         | Clear action verbs                  |
| `license`       | No       | Under 500 chars, reference standard license or file                     | `MIT` or `Proprietary. See LICENSE` |
| `compatibility` | No       | 1-500 chars if present, real constraints only                           | `Requires Python 3.10+`             |
| `metadata`      | No       | Valid key-value map, string values only                                 | `{author: "org", version: "1.0"}`   |
| `allowed-tools` | No       | Space-delimited, tool names only (experimental)                         | `Read Write Bash`                   |

---

## Common Mistakes

### Mistake #1: Name Doesn't Match Directory

```
Directory: code-review-security/
❌ name: code-review  # Doesn't match

Directory: code-review-security/
✅ name: code-review-security  # Matches
```

### Mistake #2: Description Too Short or Generic

```yaml
❌ description: 'Review code.' # Too vague

✅ description: 'Audit code for quality issues, security vulnerabilities, and maintainability problems. Use when reviewing pull requests, analyzing codebases for improvements, or ensuring coding standards compliance.'
```

### Mistake #3: Uppercase in Name

```yaml
❌ name: Code-Review # Uppercase not allowed

✅ name: code-review
```

### Mistake #4: No Description Use Cases

```yaml
❌ description: 'Generate API documentation from code.' # Missing when/how to use

✅ description: 'Generate API documentation from code. Use when documenting REST APIs, creating TypeScript/JavaScript docs, or auto-generating API references from JSDoc comments.'
```

---

## Checking Your Frontmatter

Quick validation checklist:

- [ ] YAML syntax is valid (proper `---` delimiters, no tab indentation)
- [ ] `name` is lowercase, matches directory name
- [ ] `description` is 1-1024 chars with verbs and use cases
- [ ] Optional fields follow their constraints
- [ ] No typos in field names (common: `descrption`, `licenes`)
- [ ] All string values are quoted correctly
