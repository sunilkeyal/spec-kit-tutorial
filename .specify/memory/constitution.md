<!--
  Sync Impact Report

  Version change: (none) → 1.0.0
  Modified principles: (none - initial creation)
  Added sections:
    - I. Next.js App Router
    - II. Clean & Modular Architecture
    - III. TypeScript Strictness
    - IV. Async Request APIs
    - V. Modern CSS with Tailwind v4
    - Technology Stack & Constraints
    - Development Workflow
    - Governance
  Removed sections: (none)
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (no changes needed)
    - .specify/templates/spec-template.md ✅ (no changes needed)
    - .specify/templates/tasks-template.md ✅ (no changes needed)
  Follow-up TODOs: (none)
-->

# SpecKit Tutorial Constitution

## Core Principles

### I. Next.js App Router

Every feature MUST use the Next.js App Router (`app/` directory). The legacy
`pages/` directory MUST NOT be used. Server Components are the default; Client
Components (`"use client"`) MUST be leaf nodes in the component tree and used
only when interactivity, browser APIs, or lifecycle effects are required.
Route handlers, layouts, and loading/error boundaries MUST follow the App Router
convention.

**Rationale**: App Router is the canonical routing paradigm in Next.js 16 and
provides streaming, server-centric rendering, and nested layouts. Using it
exclusively avoids confusion and ensures forward compatibility.

### II. Clean & Modular Architecture

All code MUST adhere to the single-responsibility principle. Components,
functions, and modules MUST have one clear purpose. Files MUST be co-located
with their nearest logical parent (e.g., route-specific components next to their
page). Cross-cutting logic MUST be extracted into shared modules under `lib/` or
`utils/`.

**Rationale**: Modular code is easier to test, refactor, and reason about.
Co-location reduces navigation overhead and keeps related concerns together.

### III. TypeScript Strictness

TypeScript MUST be used in strict mode (`strict: true` in `tsconfig.json`). The
`any` type is FORBIDDEN except in rare, justified cases (e.g., third-party type
gaps) with an explicit `// eslint-disable-next-line` comment. Interfaces SHOULD
be preferred over type aliases for object shapes; unions and intersections are
acceptable where appropriate. Every exported function MUST have an explicit
return type.

**Rationale**: Strict TypeScript catches entire classes of bugs at compile time
and serves as living documentation for the codebase.

### IV. Async Request APIs

The `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` APIs
MUST be `await`ed before access. Synchronous access to these APIs is REMOVED in
Next.js 16 and will cause runtime errors. Any new route or page MUST use async
patterns for all request data.

**Rationale**: Async request APIs enable the Next.js server to properly suspend
and stream responses. This is a hard requirement of the framework.

### V. Modern CSS with Tailwind v4

All styling MUST use Tailwind CSS v4 with the `@import "tailwindcss"` syntax.
The legacy `@tailwind` directives MUST NOT be used. Theme values MUST be defined
inside `@theme inline {}` blocks. Custom CSS SHOULD be minimal and scoped to
global resets or third-party overrides.

**Rationale**: Tailwind v4's new engine is faster and the inline theme API
ensures proper CSS custom property generation without configuration files.

## Technology Stack & Constraints

The project uses the following exact dependency versions:
- **Framework**: Next.js 16.2.7
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 with PostCSS
- **Linting**: ESLint 9 (flat config in `eslint.config.mjs`)
- **Build**: Turbopack (default in `next dev`/`next build`); `--webpack` flag
  available as escape hatch
- **Path Alias**: `@/*` maps to project root

All dependencies MUST remain within these major versions unless a formal
upgrade plan is approved. No additional runtime frameworks (e.g., Chakra UI,
Material UI) may be introduced without justification in the constitution.

## Development Workflow

1. **Read guidance first**: Before writing code, consult `AGENTS.md` for
   framework-specific conventions and `node_modules/next/dist/docs/` for API
   changes.
2. **Dev server**: `npm run dev` starts the Turbopack dev server.
3. **Lint**: `npm run lint` MUST pass before any commit.
4. **Build**: `npm run build` MUST succeed; production builds verify correctness
   beyond what the dev server checks.
5. **No pages/ directory**: All routes live under `app/`.
6. **Middleware**: Use `proxy.ts` (not `middleware.ts`) for request interception.

## Governance

This constitution supersedes all other development guidelines. Any amendment
requires:

1. A documented proposal outlining the change and its rationale.
2. Approval from the project maintainer or team lead.
3. A version bump following semantic versioning rules defined below.

**Versioning policy**:
- MAJOR: Backward-incompatible governance changes, principle removal, or
  redefinition of an existing principle.
- MINOR: New principle or section added, materially expanded guidance.
- PATCH: Clarifications, typo fixes, wording refinements (no semantic change).

All pull requests and code reviews MUST verify compliance with the principles
outlined here. Complexity introduced by any feature must be justified against
the simplicity principle.

Use `AGENTS.md` for runtime development guidance and framework-specific
conventions.

**Version**: 1.0.0 | **Ratified**: 2026-06-05 | **Last Amended**: 2026-06-05
