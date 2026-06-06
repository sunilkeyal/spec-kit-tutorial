---

description: "Task list for Basic Expense Tracker implementation"

---

# Tasks: Basic Expense Tracker

**Input**: Design documents from `specs/001-expense-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: None — no test framework is configured per project conventions.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Include exact file paths in descriptions

## Path Conventions

- Project root is the Next.js project root
- `app/` — Next.js App Router pages, layouts, route handlers
- `app/_components/` — Client Component leaf nodes
- `lib/` — Shared utilities and server actions
- `src/server/` — Server-side business logic (validation, constants, types)

---

## Phase 1: Setup

**Purpose**: Create directory structure and configure the project shell

- [ ] T001 Create directory structure: `app/_components/`, `app/api/expenses/[id]/`, `lib/`, `src/server/`
- [ ] T002 [P] Update `app/layout.tsx` metadata title to "Expense Tracker" and update root layout styling for the app

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure MUST be complete before ANY user story can begin

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create `src/server/types.ts` with shared TypeScript interfaces (Expense, Category, ExpenseFormData, ValidationResult, ExpenseSummary)
- [ ] T004 [P] Create `src/server/constants.ts` with predefined category list (Food, Transportation, Entertainment, Utilities, Shopping, Other) and validation limits (max amount, max description length)
- [ ] T005 [P] Create `src/server/validation.ts` with server-side field validation functions for amount (>0, ≤999,999,999.99, max 2 decimals), date (valid parseable date), category (must be from predefined set), description (optional, max 200 chars, trimmed)
- [ ] T006 Create `lib/storage.ts` with localStorage CRUD abstraction implementing create/getAll/getById/update/delete/getSummary with error handling for QuotaExceededError and JSON parse failures

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Add a New Expense (Priority: P1) 🎯 MVP

**Goal**: User can record a new personal expense with amount, date, category, and optional description. The expense persists in localStorage and appears in the list.

**Independent Test**: Open app → click "Add Expense" → fill amount, date, category → submit → expense appears in list → refresh page → expense still visible

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create `app/_components/expense-form.tsx` Client Component with form fields (amount input, date picker defaulting to today, category dropdown from constants, optional description textarea) and submit handler
- [ ] T008 [US1] Create `lib/actions.ts` with `"use server"` addExpense action that validates form data using `src/server/validation.ts` and returns ValidationResult
- [ ] T009 [US1] Integrate add expense flow on `app/page.tsx` — render expense-form component, call server action on submit, write to localStorage via lib/storage.ts on success, display inline validation errors

**Checkpoint**: User can add an expense and see it in the list. MVP achieved! 🎉

---

## Phase 4: User Story 2 - View and Filter Expenses (Priority: P1)

**Goal**: User can view all recorded expenses sorted by date (most recent first) with amount, date, category, and description. Empty state shown when no expenses exist.

**Independent Test**: Add 3 expenses with different dates → navigate to expense list → verify sorted most recent first → delete all → verify empty-state message displayed

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create `app/_components/expense-item.tsx` Client Component rendering a single expense row (amount formatted as currency, date, category badge, description)
- [ ] T011 [US2] Create `app/_components/expense-list.tsx` Client Component that reads expenses from localStorage via lib/storage.ts, sorts by date desc, renders expense-item for each, and shows empty-state message when no expenses exist
- [ ] T012 [US2] Wire up expense list on `app/page.tsx` — render expense-list component below the add form, refresh list after add

**Checkpoint**: User can view all expenses sorted by date. Empty state handled.

---

## Phase 5: User Story 3 - Edit an Expense (Priority: P1)

**Goal**: User can modify any field of an existing expense. Changes persist and update the list and dashboard immediately.

**Independent Test**: Add an expense → click edit → change amount and category → save → verify updated values in list → click edit → cancel → verify unchanged

### Implementation for User Story 3

- [ ] T013 [P] [US3] Extend `lib/actions.ts` with `"use server"` updateExpense action that validates updated fields using `src/server/validation.ts` and returns ValidationResult
- [ ] T014 [US3] Extend `app/_components/expense-form.tsx` to support edit mode — accept optional existing expense prop, pre-fill fields, switch submit to update flow
- [ ] T015 [US3] Wire up edit flow — add edit button to `app/_components/expense-item.tsx`, trigger expense-form in edit mode, save updates to localStorage via lib/storage.ts

**Checkpoint**: User can edit any existing expense. Full CRUD pattern established.

---

## Phase 6: User Story 4 - Delete an Expense (Priority: P2)

**Goal**: User can remove an expense with confirmation. Deletion is permanent and dashboard updates immediately.

**Independent Test**: Add an expense → click delete → cancel → expense remains → click delete → confirm → expense removed from list and dashboard

### Implementation for User Story 4

- [ ] T016 [US4] Add delete button with confirmation dialog to `app/_components/expense-item.tsx` — show confirmation prompt on click, remove from localStorage on confirm, cancel leaves expense intact
- [ ] T017 [US4] Wire up delete flow — after successful deletion, trigger list refresh and dashboard update on `app/page.tsx`

**Checkpoint**: User can delete expenses with confirmation safety.

---

## Phase 7: User Story 5 - View Dashboard with Totals (Priority: P2)

**Goal**: User sees total expense count, total amount spent, category breakdown (text list with name, amount, percentage), and 5-10 most recent expenses.

**Independent Test**: Add expenses across 3 categories (Food $50, Transport $30, Entertainment $20) → verify total count=3, total=$100, breakdown shows each category with correct percentage

### Implementation for User Story 5

- [ ] T018 [P] [US5] Create `app/_components/dashboard-summary.tsx` Client Component that reads from localStorage via lib/storage.ts and renders totalCount, totalAmount, categoryBreakdown list (category name, total amount, percentage), and 5-10 most recent expenses
- [ ] T019 [US5] Wire up dashboard section on `app/page.tsx` — render dashboard-summary component at the top of the page, refresh after any CRUD operation

**Checkpoint**: Dashboard displays accurate totals and category breakdown. All user stories complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Route handlers (REST API contract), edge case hardening, and final validation

- [ ] T020 [P] Create `app/api/expenses/route.ts` with GET (return all expenses from localStorage) and POST (validate request body, call create, return created expense with 201) route handlers
- [ ] T021 [P] Create `app/api/expenses/[id]/route.ts` with PUT (validate request body, call update, return updated expense) and DELETE (call delete, return success with 200) route handlers
- [ ] T022 Handle localStorage QuotaExceededError gracefully — show user-friendly error message in expense-form and prevent data loss
- [ ] T023 Handle localStorage JSON parse corruption — reset to empty array with console warning, show error toast if applicable
- [ ] T024 Run full validation against quickstart.md scenarios — verify all 8 scenarios pass end-to-end
- [ ] T025 Run `npm run lint` and `npm run build` — fix any linting or build errors

**Checkpoint**: All features implemented, lint and build pass, REST API contract defined.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational completion
  - US2 (View) can start in parallel with US1 (Add) since US2 only reads localStorage
  - US3 (Edit) naturally follows US1 (Add) — edit requires an existing expense
  - US4 (Delete) naturally follows US1 (Add) — delete requires an existing expense
  - US5 (Dashboard) can start after US1 (Add) since it aggregates stored expenses
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Dependencies | Independent? |
|-------|-------------|-------------|
| US1 (Add - P1) | Foundational | ✅ Yes — tests by adding an expense |
| US2 (View - P1) | Foundational | ✅ Yes — tests by adding expenses then viewing |
| US3 (Edit - P1) | US1, Foundational | ✅ Yes — tests by adding then editing |
| US4 (Delete - P2) | US1, Foundational | ✅ Yes — tests by adding then deleting |
| US5 (Dashboard - P2) | US1, Foundational | ✅ Yes — tests by adding then checking dashboard |

### Within Each User Story

- Models/types before services
- Core implementation before integration on page
- Story complete before moving to next

### Parallel Opportunities

- T003, T004, T005 (all [P] in Foundational) — can run in parallel
- T007, T008 (US1 model + form) — can run in parallel
- T010, T011 (US2 list + item) — can run in parallel
- T020, T021 (route handlers) — can run in parallel
- Across stories: US2 can start independently once Foundational is done

---

## Parallel Example: User Story 1

```bash
# Launch form and server action in parallel:
Task: "Create expense-form.tsx in app/_components/expense-form.tsx"
Task: "Create lib/actions.ts with addExpense server action"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Add Expense)
4. **STOP and VALIDATE**: Add an expense, refresh page, verify it persists
5. MVP complete — user can add and view their first expense

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → MVP (Add expense works!)
3. Add User Story 2 → View list with empty state
4. Add User Story 3 → Edit existing expenses
5. Add User Story 4 → Delete with confirmation
6. Add User Story 5 → Dashboard with totals and breakdown
7. Add Polish → Route handlers + edge cases

### Sequential Execution (Recommended)

Foundation → US1 → US2 → US3 → US4 → US5 → Polish

Each step adds incremental value without breaking previous work.

---

## Notes

- No test tasks — no test framework is configured per project conventions
- [P] tasks = different files, no dependencies — can be done in parallel
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The page.tsx file is updated incrementally — each story adds its component(s) to the page
