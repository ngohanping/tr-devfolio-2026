# Implementation Plan: Architecture Hub — Frontend Base Setup

## Feature Name
Architecture Hub Frontend Scaffold — Angular + Tailwind canvas-based architecture onboarding portal.

---

## Purpose

Establish the complete frontend base for Architecture Hub: an Angular application where users drag-and-drop architecture nodes onto a canvas, connect them, and export the result as an image or Mermaid.js diagram. The canvas state will eventually sync into a company-wide Neo4j graph — but for now the frontend uses mock data only.

---

## Design Reference

- **UI mock:** Architecture Hub screenshot (dark sidebar, canvas, service marketplace right panel)
- **Colour system:** Primary `#FFD900`, Secondary `#000000`, Tertiary `#FFFFFF`, Neutral `#F4F4F4`
- **Typography:** Headlines/Labels → Space Grotesk, Body → Inter
- **Node border colours:** SERVICE/DATABASE/WORKER → green, PROPOSED → orange, Restricted → muted

---

## Skills Used

- `angular-scaffolding` — project bootstrap
- `angular-development` — components, services, routing, RxJS
- `tailwind-design-system` — colour tokens, component patterns (header, card, button, input, modal)
- `coding-standard-knowledge` — vertical slice structure, naming conventions, strict TypeScript
- `test-driven-development` — Jest unit tests alongside each component/service

---

## Implementation Steps

### Step 1 — Scaffold the Angular project

Run the scaffolding script:
```bash
.github/skills/angular-scaffolding/scripts/project-scaffolding.sh
```

This sets up:
- Angular CLI project with strict mode
- Tailwind CSS v3
- Jest
- SSR enabled
- `.env` configuration
- `ApiService` + HTTP interceptor

After scaffolding, extend `tailwind.config.js` with the design tokens:

```js
theme: {
  extend: {
    colors: {
      primary:   '#FFD900',
      secondary: '#000000',
      tertiary:  '#FFFFFF',
      neutral:   '#F4F4F4',
      node: {
        service:  '#22c55e',
        proposed: '#f97316',
      }
    },
    fontFamily: {
      headline: ['Space Grotesk', 'sans-serif'],
      body:     ['Inter', 'sans-serif'],
    }
  }
}
```

Add Google Fonts import to `src/styles.scss`:
```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

---

### Step 2 — App shell: Sidebar + Topbar layout

**Files:**
- `src/app/app.component.html` — root layout shell
- `src/app/shared/components/sidebar/sidebar.component.*`
- `src/app/shared/components/topbar/topbar.component.*`

**Sidebar spec:**
- Dark background (`bg-secondary`)
- Logo: "Architecture Hub" (primary yellow, Space Grotesk) + "PRECISION SYSTEMS" subtitle
- Nav items: Dashboard, Squad Management, Squad Architecture, Ecosystem View, AI Chat
- Active item: primary yellow text + left accent bar
- Icons: use Angular Material icons or Heroicons
- Bottom: user avatar chip (initials, `bg-primary`, username, version label)
- Fixed width `w-60`, full height

**Topbar spec:**
- Search input: "Search architecture nodes..." placeholder, left icon, `bg-neutral` fill
- Right: "● LIVE CANVAS" pill badge (green dot, outlined), notification bell, help icon
- Sits above the canvas area only (not above the sidebar)

**Root template pattern:**
```html
<div class="flex h-screen overflow-hidden">
  <app-sidebar />
  <div class="flex flex-col flex-1 min-w-0">
    <app-topbar />
    <main class="flex-1 overflow-hidden">
      <router-outlet />
    </main>
  </div>
</div>
```

---

### Step 3 — Routing setup

**File:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'squad-architecture', pathMatch: 'full' },
  { path: 'dashboard',          loadComponent: () => import('./features/dashboard/...') },
  { path: 'squad-management',   loadComponent: () => import('./features/squad-management/...') },
  { path: 'squad-architecture', loadComponent: () => import('./features/squad-architecture/...') },
  { path: 'ecosystem-view',     loadComponent: () => import('./features/ecosystem-view/...') },
  { path: 'ai-chat',            loadComponent: () => import('./features/ai-chat/...') },
];
```

All routes lazy-loaded via `loadComponent`.

---

### Step 4 — Architecture Node model + mock data service

**Files:**
- `src/app/shared/models/architecture-node.model.ts`
- `src/app/core/services/architecture.service.ts`

**Model:**
```typescript
export type NodeType = 'SERVICE' | 'DATABASE' | 'WORKER' | 'PROPOSED';
export type NodeStatus = 'active' | 'proposed' | 'restricted';

export interface ArchitectureNode {
  id: string;
  type: NodeType;
  name: string;
  subtitle: string;
  tags?: string[];
  status: NodeStatus;
  position: { x: number; y: number };
}
```

**Service:** `ArchitectureService` with:
- `getCanvasNodes$(): Observable<ArchitectureNode[]>` — returns mock canvas nodes
- `getMarketplaceServices$(): Observable<ArchitectureNode[]>` — returns mock marketplace entries
- `updateNodePosition(id, position): void` — updates position in local state (BehaviorSubject)

Mock data should replicate the screenshot: Auth-Gateway (SERVICE), Centralized-API (PROPOSED), User-Store-DB (DATABASE), Email-Service (WORKER).

---

### Step 5 — Node Card component

**File:** `src/app/shared/components/node-card/node-card.component.*`

Inputs: `node: ArchitectureNode`

Renders:
- Type badge (top-left): `SERVICE` / `DATABASE` / `WORKER` / `PROPOSED` — coloured label text
- Status icon (top-right): green checkmark for active, orange clock for proposed, lock for restricted
- Node name (headline font, large)
- Subtitle (small, muted)
- Border colour driven by type: green for active types, orange for PROPOSED, grey for restricted
- `cursor-grab` when draggable

Accessibility: `role="article"`, `aria-label="{{ node.name }} {{ node.type }} node"`

---

### Step 6 — Squad Architecture page (Canvas + Marketplace)

**File:** `src/app/features/squad-architecture/squad-architecture.component.*`

Three-panel layout:
```
┌─────────────────────────────────┬──────────────────┐
│  Canvas area (flex-1)           │ Service Marketplace│
│  - Canvas toolbar (top-left)    │ (w-72, border-l)  │
│  - Draggable NodeCards          │ - Filter input    │
│  - Canvas Stats (bottom-left)   │ - ServiceCards    │
│  - FAB (+) bottom-right         │ - Publish button  │
└─────────────────────────────────┴──────────────────┘
```

**Canvas toolbar** (absolute top-left overlay):
- Cursor / Share / Add / Zoom-in / Zoom-out icon buttons
- White background, rounded, shadow

**Drag-and-drop:**
- Use Angular CDK `DragDropModule` for node dragging on the canvas
- `cdkDrag` on each NodeCard; canvas div is the drop container
- On drop, call `architectureService.updateNodePosition(id, newPosition)`
- Marketplace cards are `cdkDrag` with `cdkDragRootElement` — dragging onto canvas adds the node

**Canvas Stats card** (absolute bottom-left):
- "Canvas Stats" heading
- Nodes Active: count
- Sync Status: "Healthy" (green text)
- "Export Mermaid.js" primary button → triggers `exportMermaid()` method (stub for now)

**FAB (+):**
- Fixed bottom-right of canvas, `bg-primary`, rounded-full, shadow-lg

**Service Marketplace panel:**
- Right side, fixed width `w-72`
- Filter search input at top
- List of `ServiceMarketplaceCard` components (lighter variant of NodeCard)
- "Publish Services" outlined button at bottom

---

### Step 7 — Export stubs

**File:** `src/app/core/services/export.service.ts`

```typescript
export class ExportService {
  exportAsMermaid(nodes: ArchitectureNode[]): string { /* stub */ }
  exportAsImage(canvasEl: HTMLElement): Promise<void> { /* stub — use html2canvas later */ }
}
```

Wire "Export Mermaid.js" button to `exportService.exportAsMermaid()` — for now just `console.log` the output.

---

### Step 8 — Stub page components

Create minimal placeholder components for all other routes so routing works end-to-end:
- `DashboardComponent` — "Dashboard — coming soon"
- `SquadManagementComponent` — "Squad Management — coming soon"
- `EcosystemViewComponent` — "Ecosystem View — coming soon"
- `AiChatComponent` — "AI Chat — coming soon"

---

### Step 9 — Tests

Write Jest unit tests for:
- `ArchitectureService` — `getCanvasNodes$` returns correct mock nodes, `updateNodePosition` mutates state
- `NodeCardComponent` — renders name, type badge, correct border class per type
- `SidebarComponent` — renders all nav items, applies active class to correct route
- `ExportService.exportAsMermaid` — returns non-empty string given mock nodes

---

## Files to Create or Modify

| File | Action |
|---|---|
| `CLAUDE.md` | **Created** — project context |
| `tailwind.config.js` | Extend with design tokens |
| `src/styles.scss` | Add Google Fonts import |
| `src/app/app.component.html` | Root shell layout |
| `src/app/app.routes.ts` | Lazy-loaded routes |
| `src/app/shared/models/architecture-node.model.ts` | **New** — node interface |
| `src/app/core/services/architecture.service.ts` | **New** — canvas + marketplace data |
| `src/app/core/services/export.service.ts` | **New** — export stubs |
| `src/app/shared/components/sidebar/*` | **New** — dark sidebar |
| `src/app/shared/components/topbar/*` | **New** — search + live canvas bar |
| `src/app/shared/components/node-card/*` | **New** — reusable node card |
| `src/app/features/squad-architecture/*` | **New** — main canvas page |
| `src/app/features/dashboard/*` | **New** — stub page |
| `src/app/features/squad-management/*` | **New** — stub page |
| `src/app/features/ecosystem-view/*` | **New** — stub page |
| `src/app/features/ai-chat/*` | **New** — stub page |

---

## Feasibility

| Criterion | Assessment |
|---|---|
| Complexity | Medium — CDK drag-drop is the main new piece |
| Angular CDK | `@angular/cdk/drag-drop` handles canvas dragging cleanly |
| Neo4j coupling | Zero — all data via mock `ArchitectureService` |
| Export | Mermaid stub is trivial; image export deferred (html2canvas) |
| Effort estimate | ~1 day scaffold + shell, ~1 day canvas + marketplace, ~0.5 day tests |
