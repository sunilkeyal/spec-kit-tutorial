# Research: Layout Update

## Summary

All technical context fields were determinable from the project's existing configuration (Next.js 16 + TypeScript + Tailwind v4). No unknowns required external research.

## Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Framework | Next.js 16.2.7 (App Router) | Existing project dependency |
| UI Library | React 19.2.4 | Existing project dependency |
| Styling | Tailwind CSS v4 | Existing project dependency |
| Storage | Browser localStorage | Spec requirement; no server needed |
| Routing | App Router (`app/` directory) | Existing project convention |
| Nav bar pattern | Client component with `usePathname()` | Standard Next.js pattern for active link highlighting |
| Modal pattern | Client Component with portal | Common React pattern; no external dependency needed |

## Alternatives Considered

- **Using a UI library (e.g., shadcn/ui) for the modal**: Rejected — the spec calls for a simple modal/overlay; a hand-rolled solution avoids additional dependencies and is trivially implementable with Tailwind + React portal.
