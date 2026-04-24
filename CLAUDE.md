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

---

# Hackathon Problem Statement & Requirements

## Primary Problem Statement

**"How can we effectively manage, optimize, and scale our architecture ecosystem at Scoot when we lack visibility into how our architecture patterns connect, what capacity exists in our current infrastructure, whether our systems can support additional solutions, and how we keep this knowledge accurate as the ecosystem continuously evolves?"**

---

## Detailed Problem Breakdown

### Problem 1: Architecture Pattern Integration & Visibility
**Current State:** We have established internal architecture patterns, but there is no clear understanding or documentation of how these patterns connect and interact with each other.

**Impact:** This creates knowledge silos, increases onboarding time, and makes it difficult to assess the impact of changes across the ecosystem.

### Problem 2: Solution Interconnectivity Mapping
**Current State:** We do not have an overall mapping of connections across all solutions. There is no centralised view that shows how every solution is connected to the rest of the ecosystem, leaving us unable to gauge whether introducing a new connection would overload an existing application or service.

**Impact:** Without this connection map, we cannot effectively determine the blast radius of change, predict congestion points, or make informed decisions about onboarding new integrations — increasing the risk of unintended performance degradation or cascading failures.

### Problem 3: Capacity Planning & Load Testing
**Current State:** There is no systematic approach to capacity planning or load testing our current architecture. Specifically, we cannot answer critical questions such as "Can e.g pod support another solution connecting in?"

**Impact:** This leads to:
- Risk of overloading existing infrastructure
- Inability to make data-driven scaling decisions
- Potential service degradation or outages when new solutions are onboarded

### Problem 4: Reactive vs. Proactive Infrastructure Management
**Current State:** Infrastructure scaling decisions (e.g., adding workers) are made reactively rather than proactively, with manual ticket-raising processes that slow down response times. There is currently no structured evaluation of whether an issue should be resolved through **horizontal scaling** (adding more instances/pods) or **vertical scaling** (increasing resources on existing instances), nor any established patterns for safer deployment strategies such as **blue/green deployments** that would allow scaling or upgrades with zero downtime and easy rollback.

**Impact:** This results in delayed scaling responses, potential performance issues during deployments, inefficient resource utilisation, and a higher risk of outages when changes are applied to live infrastructure across the Scoot ecosystem.

### Problem 5: No Ingestion Pipeline for Evolving Knowledge
**Current State:** The architecture topology, connection maps, and capacity baselines are produced as one-time, point-in-time artefacts. There is no structured pipeline for a new solution to register itself and automatically propagate its connections, dependencies, and resource requirements into the existing knowledge base.

**Impact:** As the ecosystem evolves, the architecture knowledge degrades silently — new integrations are added without updating the topology map, connection dependency matrix, or capacity assessments. This continuously recreates Problem 2, effectively making any visibility gained from Phase 1 temporary and unreliable without significant ongoing manual effort.

---

## Desired Outcome

An intelligent architecture agent solution that provides real-time visibility, capacity insights, and automated recommendations to resolve and optimize the overall infrastructure landscape/ecosystem at Scoot.

---

## Solution Approach: Phased Implementation Plan

### Phase 1: Establish Visibility Foundation
**Addresses Problems 1 & 2**

**Objective:** Create a comprehensive view of the architecture ecosystem and understand how everything connects.

**Key Activities:**
- Document and catalog all existing architecture patterns
- Map current solutions and their interconnections
- Build automated discovery of dependencies and integration points
- Create visual representation of the infrastructure topology

**Deliverables:**
- Architecture pattern catalog
- Infrastructure topology map showing all solution connections
- Connection dependency matrix

**Success Criteria:** Complete visibility into how architecture patterns connect and how current solutions interact with each other.

---

### Phase 2: Build Capacity Intelligence
**Addresses Problem 3**

**Objective:** Understand current capacity limits and enable data-driven capacity planning decisions.

**Key Activities:**
- Implement comprehensive resource monitoring (CPU, memory, network, storage)
- Conduct systematic load testing across the architecture
- Establish capacity baselines and thresholds for each service/pod
- Build capacity analysis engine to answer questions like "Can e.g pod support another solution?"
- Develop capacity forecasting models based on usage patterns

**Deliverables:**
- Real-time capacity monitoring dashboard
- Load testing framework and results
- Capacity reports per service/pod with headroom analysis
- Predictive capacity planning tool

**Success Criteria:** Ability to accurately assess whether any pod/service can support additional solutions before onboarding them.

---

### Phase 3: Enable Intelligent Automation
**Addresses Problem 4**

**Objective:** Transform reactive infrastructure management into proactive, automated operations.

**Key Activities:**
- Build recommendation engine that analyzes capacity data and usage patterns
- Develop a **web application** interface for real-time architecture queries, topology exploration, and capacity insights
- Implement automated worker scaling recommendations (horizontal vs. vertical) based on thresholds
- Support deployment strategy guidance including blue/green deployment recommendations for zero-downtime scaling
- Create automated ticket generation system with pre-filled justifications
- Integrate decision support workflows for approval processes

**Deliverables:**
- Web application with AI-powered recommendations and interactive architecture views
- Automated worker request ticket system
- Recommendation engine with configurable rules (including horizontal/vertical scaling and blue/green deployment strategies)
- Proactive alerting system for capacity concerns

**Success Criteria:** Shift from manual, reactive scaling to automated, proactive infrastructure management — with clear horizontal vs. vertical scaling guidance, blue/green deployment patterns, and reduced ticket resolution time.

---

### Phase 4: Continuous Optimization & Ecosystem Resolution
**Addresses All Problems — Holistic View**

**Objective:** Achieve complete resolution of the infrastructure landscape with continuous optimization.

**Key Activities:**
- Implement end-to-end ecosystem monitoring and optimization
- Build cross-pattern impact analysis capabilities
- Enable self-healing and auto-remediation for approved scenarios
- Create strategic planning tools for future architecture evolution
- Establish feedback loops for continuous improvement

**Deliverables:**
- Resolved infrastructure ecosystem view
- Automated optimization recommendations
- Strategic capacity planning dashboard
- Complete architecture agent platform

**Success Criteria:** Holistic management of Scoot's infrastructure ecosystem with proactive capacity management, automated scaling, and clear visibility across all architecture patterns and solutions.

---

### Phase 5: Automated Knowledge Ingestion & Continuous Discovery
**Addresses Problem 5**

**Objective:** Ensure the architecture knowledge base remains accurate and up-to-date as new solutions are onboarded, without relying on manual documentation.

**Key Activities:**
- Design and implement a service registration API (or schema contract) that new solutions must satisfy upon onboarding
- Build CI/CD pipeline hooks that trigger knowledge ingestion when a new service is deployed
- Automate topology map and connection dependency matrix updates when new integrations are registered
- Re-trigger capacity assessments automatically when new connections are declared
- Provide a self-service onboarding interface in the web application for teams to register new solutions
- Establish validation rules to reject or flag incomplete/conflicting registration data

**Deliverables:**
- Service registration API / schema contract
- CI/CD integration hooks for automated discovery
- Auto-updated topology map and connection dependency matrix on each ingestion
- Onboarding interface within the web application
- Audit trail of knowledge changes over time

**Success Criteria:** Any new solution onboarded through the standard pipeline automatically updates the architecture knowledge base within minutes, with zero manual documentation required.

---

## Implementation Timeline

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| Phase 1 | 4–6 weeks | Complete architecture visibility |
| Phase 2 | 6–8 weeks | Capacity intelligence operational |
| Phase 3 | 6–8 weeks | Automation & web app live |
| Phase 4 | 8–10 weeks | Full ecosystem resolution |
| Phase 5 | 4–6 weeks | Automated knowledge ingestion live |

---

## Overall Success Metrics

| Metric | Target |
|--------|--------|
| Visibility | 100% of architecture patterns and solutions mapped |
| Capacity | Accurate capacity forecasting with <5% error margin |
| Automation | 80% reduction in manual capacity assessment time |
| Proactivity | 90% of scaling actions initiated before issues occur |
| Efficiency | 50% reduction in worker request ticket resolution time |
