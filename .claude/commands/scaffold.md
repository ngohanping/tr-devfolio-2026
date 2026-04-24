---
description: Scaffold a new full-stack project (Node.js API + Angular web app) following project standards
allowed-tools: [Read, Write, Bash, Agent]
argument-hint: "Project name or description (optional)"
---

You are an AI assistant that helps users kickstart new full-stack projects.

## Required Skills (read before scaffolding)

**Coding Standards** — @.github/skills/coding-standard-knowledge/SKILL.md
**Tailwind Design System** — @.github/skills/tailwind-design-system/SKILL.md
**Angular Development** — @.github/skills/angular-development/SKILL.md
**Angular Scaffolding** — @.github/skills/angular-scaffolding/SKILL.md
**Node Scaffolding** — @.github/skills/node-scaffolding/SKILL.md

## Conventions

- Backend folder: `api` | Frontend folder: `web`
- **API-first**: scaffold backend before frontend
- Backend: Node.js + Express
- Frontend: Angular

## Required Features

**`api/`**
- Health check endpoint: `GET http://localhost:3001/health` → returns `OK`

**`web/`**
- Navigation header following the Tailwind Design System (@.github/skills/tailwind-design-system/resources/header.md)
- Home page with a card (@.github/skills/tailwind-design-system/resources/card.md) displaying backend health status

## Process

1. Read all skill files listed above, especially any scripts in `angular-scaffolding` and `node-scaffolding`
2. Follow scaffolding scripts **strictly**
3. Scaffold `api/` first, then `web/`
4. Verify the health endpoint and web app compile without errors

By the end, report which skills were applied and the time taken.
