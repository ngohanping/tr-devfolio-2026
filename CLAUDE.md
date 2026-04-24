# Architecture Hub — Project Context

## What This Project Is

**Architecture Hub** is a web application that allows teams to onboard and visualise their project's system architecture. Users can:

- Design architecture diagrams on an interactive canvas via **drag-and-drop**
- Place and connect nodes (services, databases, workers, proposed components, etc.)
- Export the canvas as an **image** or **Mermaid.js diagram**
- Publish/sync the architecture into a **company-wide infrastructure graph** (powered by Neo4j — handled by a separate team)

The frontend is the current focus. Neo4j integration will be wired in by another team once the UI is stable.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular (latest, strict mode, standalone components) |
| Styling | Tailwind CSS v3 |
| Testing | Jest |
| Rendering | SSR enabled |
| Graph/Neo4j | Out of scope for frontend — stub/mock data only |

---

## Design System

### Colours

| Token | Hex | Usage |
|---|---|---|
| Primary | `#FFD900` | CTAs, active nav item, FAB, accent highlights |
| Secondary | `#000000` | Sidebar background, dark surfaces |
| Tertiary | `#FFFFFF` | Light surfaces, cards on dark bg |
| Neutral | `#F4F4F4` | Page background, subtle dividers |

Node border colours by type:
- `SERVICE` → green (`#22c55e`)
- `DATABASE` → green (`#22c55e`)
- `WORKER` → green (`#22c55e`)
- `PROPOSED` → orange (`#f97316`)
- Restricted → muted/greyed out

### Typography

| Role | Font |
|---|---|
| Headline / Label | Space Grotesk |
| Body | Inter |

### Component References

Follow the design-system skill references for all shared UI:
- `.github/skills/tailwind-design-system/resources/header.md` — navigation header
- `.github/skills/tailwind-design-system/resources/button.md` — buttons
- `.github/skills/tailwind-design-system/resources/card.md` — node cards, marketplace cards
- `.github/skills/tailwind-design-system/resources/input.md` — search inputs
- `.github/skills/tailwind-design-system/resources/modal.md` — dialogs

---

## Application Layout

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (dark, 240px)   │  Top bar (search + status)│
│  - Architecture Hub logo │  - Search architecture..  │
│  - Nav items             │  - LIVE CANVAS badge       │
│  - User avatar (bottom)  │  - Notification + Help    │
│──────────────────────────│───────────────────────────│
│                          │                           │
│   Canvas (main area)     │  Service Marketplace      │
│   - Drag-drop nodes      │  (right panel, 300px)     │
│   - Toolbar overlay      │  - Filter input           │
│   - Canvas Stats card    │  - Draggable service cards│
│   - FAB (+)              │  - Publish Services btn   │
└──────────────────────────────────────────────────────┘
```

### Pages / Routes

| Route | Component | Description |
|---|---|---|
| `/dashboard` | `DashboardComponent` | Overview / landing |
| `/squad-management` | `SquadManagementComponent` | Manage squads |
| `/squad-architecture` | `SquadArchitectureComponent` | **Main canvas page (active state in design)** |
| `/ecosystem-view` | `EcosystemViewComponent` | Company-wide graph view |
| `/ai-chat` | `AiChatComponent` | AI assistant |

---

## Feature Structure (Vertical Slice)

```
src/app/
  core/
    services/          # api.service.ts, auth.service.ts
    interceptors/      # api.interceptor.ts
    guards/            # auth.guard.ts
  shared/
    components/        # Reusable UI: sidebar, topbar, node-card, etc.
    models/            # Shared interfaces
  features/
    dashboard/
    squad-management/
    squad-architecture/   # Main canvas feature
      canvas/            # Canvas container + drag-drop
      node-card/         # Architecture node cards
      service-marketplace/ # Right panel
      canvas-stats/      # Bottom-left stats panel
    ecosystem-view/
    ai-chat/
```

---

## Canvas / Node Model

```typescript
export interface ArchitectureNode {
  id: string;
  type: 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
  name: string;
  subtitle: string;       // e.g. "v2.4.1 • k8s-cluster-01"
  tags?: string[];        // e.g. ["REST", "V3.0"]
  status?: 'active' | 'proposed' | 'restricted';
  position: { x: number; y: number };
}
```

---

## Coding Standards

- Feature-based (vertical slice) folder structure under `src/app/features/`
- Observable methods suffixed with `$` (e.g., `getNodes$()`)
- `OnPush` change detection on all components
- `trackBy` on all `*ngFor` lists
- Lazy-loaded feature modules
- Strict TypeScript — no `any`
- Jest for all unit tests, mocked dependencies
- Global shared UI (sidebar, topbar) lives in `app.component.html` via `<router-outlet>`

---

## Agents & Skills Available

| Agent | File |
|---|---|
| Implementation Plan | `.github/agents/implementation-plan.agent.md` |
| Implementation | `.github/agents/implementation.agent.md` |
| Code Review | `.github/agents/code-review.agent.md` |
| Documentation | `.github/agents/documentation.agent.md` |
| Project Scaffolding | `.github/agents/project-scaffolding.agent.md` |

Skills: `angular-development`, `angular-scaffolding`, `tailwind-design-system`, `coding-standard-knowledge`, `test-driven-development`, `nodejs-development`, `python-development`

---

## Out of Scope (for now)

- Neo4j graph queries or mutations — use stub/mock data
- Real-time collaboration (future)
- Authentication/SSO integration (future)
- Backend API — assume a stub `api.service.ts` returning mock `ArchitectureNode[]`
