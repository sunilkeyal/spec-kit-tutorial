# Implementation Plan: Basic Expense Tracker

**Branch**: `001-expense-tracker` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-expense-tracker/spec.md`

## Summary

Single-user personal expense tracking web app with Next.js App Router. Users can add, view, edit, and delete expenses (amount, date, category, description). Dashboard displays totals, recent expenses (5-10), and category breakdown. Data persisted in browser localStorage. Route handlers define the REST API contract; server actions handle form validation; server-side logic in `src/server/`.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Next.js 16.2.7, React 19.2.4, Tailwind CSS v4

**Storage**: Browser localStorage (client-side persistence)

**Testing**: None (no test framework configured)

**Target Platform**: Desktop/laptop web browsers

**Project Type**: Web application (Next.js App Router) with REST API route handlers and server actions

**Performance Goals**: Add-to-list <2s, full workflow <30s, dashboard renders instantly (localStorage is synchronous)

**Constraints**: localStorage ~5-10MB limit per origin; localStorage is client-only (not accessible in server actions/route handlers); single-user; no auth; desktop-only v1

**Scale/Scope**: Single user; expense count bounded by localStorage capacity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status |
|------|-------------|--------|
| I. App Router | Must use `app/` directory, Server Components default, Client Components as leaf nodes | ✅ PASS — app/ layout + page shell; Client Component leaves in `_components/` |
| II. Clean Architecture | Single-responsibility, kebab-case files, PascalCase components, camelCase utilities, server/client separation | ✅ PASS — Clear separation: `src/server/`, `lib/`, `_components/`, `api/` |
| III. TypeScript Strict | strict:true, no `any`, explicit return types | ✅ PASS — All contracts use strict interfaces |
| IV. Async Request APIs | await cookies(), headers(), params, searchParams | ✅ PASS — Route handlers use async patterns where needed |
| V. Tailwind v4 | @import "tailwindcss", @theme inline, no @tailwind | ✅ PASS — Standard v4 usage |
| Tech Stack Versions | Stay within specified major versions | ✅ PASS — No new dependencies |
| No pages/ | Use `app/` only | ✅ PASS |
| Middleware | Use `proxy.ts` not `middleware.ts` | ✅ PASS — No middleware needed |

**No violations identified. Complexity Tracking not required.**

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracker/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                    # Root layout (Server Component)
├── page.tsx                      # Dashboard page (Server Component shell)
├── _components/
│   ├── expense-form.tsx          # Add/Edit expense form (Client Component)
│   ├── expense-list.tsx          # Expense list (Client Component)
│   ├── expense-item.tsx          # Single expense row (Client Component)
│   └── dashboard-summary.tsx     # Totals + category breakdown (Client Component)
└── api/
    └── expenses/
        ├── route.ts              # GET (list all), POST (create)
        └── [id]/
            └── route.ts          # PUT (update), DELETE

src/
└── server/
    ├── validation.ts             # Server-side field validation logic
    ├── constants.ts              # Category list, validation limits
    └── types.ts                  # Shared server types

lib/
├── storage.ts                    # localStorage CRUD abstraction (client-only)
└── actions.ts                    # Server Actions for form validation
```

**Structure Decision**: Route handlers in `app/api/expenses/` define the REST contract. Server actions in `lib/actions.ts` validate form submissions server-side then delegate persistence to client-side `lib/storage.ts`. Business logic (validation rules, constants) extracted to `src/server/` for reuse across server actions, route handlers, and future backend migration.

## Complexity Tracking

> Not required — all constitution gates pass without violations.
