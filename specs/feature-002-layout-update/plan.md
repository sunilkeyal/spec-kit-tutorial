# Implementation Plan: Layout Update

**Branch**: `002-layout-update` | **Date**: 2026-06-06 | **Spec**: `specs/feature-002-layout-update/spec.md`

**Input**: Feature specification from `specs/feature-002-layout-update/spec.md`

## Summary

Restructure the existing expense tracker UI layout. Replace the current page-based navigation with a horizontal nav bar (Dashboard, Expense links), move the dashboard summary to the home page (route `/`), place the expense list under its own route, and use a shared modal for add/edit expense forms.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**: Next.js 16.2.7, React 19.2.4, Tailwind CSS v4

**Storage**: Browser localStorage (client-side only)

**Testing**: No test framework configured

**Target Platform**: Desktop/laptop web browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: Web application (Next.js App Router)

**Performance Goals**: N/A — localStorage operations are instant; no network requests

**Constraints**: localStorage 5-10 MB limit; single-user; offline-only

**Scale/Scope**: Single-user personal expense tracker with 2 pages (Dashboard, Expenses)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Next.js App Router | ✅ Pass | All routes under `app/`; Server Components as default |
| II. Clean & Modular Architecture | ✅ Pass | Co-located components; shared logic in `lib/` |
| III. TypeScript Strictness | ✅ Pass | `strict: true`; no `any` types |
| IV. Async Request APIs | ✅ Pass | No cookies/headers needed; pages are static |
| V. Modern CSS with Tailwind v4 | ✅ Pass | Uses `@import "tailwindcss"`; no `@tailwind` directives |

**Gate verdict**: PASS — no violations. Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/feature-002-layout-update/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (empty — internal-only app)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # Root layout with horizontal nav bar
├── page.tsx             # Dashboard page (route `/`)
├── expenses/
│   └── page.tsx         # Expense list page (route `/expenses`)
└── _components/
    ├── nav-bar.tsx      # Horizontal navigation bar (Dashboard, Expense links)
    ├── expense-modal.tsx # Shared modal for add/edit expense forms
    └── expense-list.tsx  # Expense list component

lib/
├── storage.ts           # localStorage CRUD helpers
└── types.ts             # TypeScript interfaces (Expense, ExpenseSummary)
```

**Structure Decision**: Next.js App Router layout with co-located components under `app/_components/`. Shared utilities in `lib/`. This aligns with Option 2 (Web application) and follows the constitution's co-location and modularity conventions.

## Complexity Tracking

Not needed — all constitution checks pass.
