# Tasks: Layout Update

**Input**: Design documents from `specs/feature-002-layout-update/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in the spec — no test tasks included. Validation via manual steps in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `app/`, `lib/` at repository root (Next.js App Router)
- Components under `app/_components/`
- Shared utilities under `lib/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency verification

- [X] T001 Verify project dependencies are installed (`npm install`) and dev server starts (`npm run dev`)
- [X] T002 [P] Verify existing `app/layout.tsx` root layout to understand current structure before refactoring
- [X] T003 [P] Verify existing `app/page.tsx` (current home page) content to plan migration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create TypeScript interfaces in `lib/types.ts` (Expense, ExpenseSummary, CategoryBreakdown, Category constants)
- [X] T005 Implement localStorage CRUD helpers in `lib/storage.ts` (getAll, create, update, deleteExpense, computeSummary)
- [X] T006 [P] Create horizontal navigation bar component in `app/_components/nav-bar.tsx` (Dashboard and Expense links with active state highlighting via `usePathname()`)
- [X] T007 Update root layout in `app/layout.tsx` to include the nav-bar component and main content wrapper

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Add a New Expense (Priority: P1) 🎯 MVP

**Goal**: User can add a new expense via a modal/overlay in the expense list view

**Independent Test**: Navigate to the expense list, click Add Expense, fill in the form, submit, and verify the expense appears in the expense list and dashboard totals update.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create shared expense modal component in `app/_components/expense-modal.tsx` (form fields: amount, date, category, description; dark overlay; close on submit/cancel)
- [X] T009 [P] [US1] Add validation logic for expense form (positive amount, required date, required category, description max 500 chars)
- [X] T010 [US1] Create expense list page skeleton at `app/expenses/page.tsx` with Add Expense button that opens the modal
- [X] T011 [US1] Wire modal submit to `lib/storage.ts` create function and refresh the expense list on success
- [X] T012 [US1] Handle localStorage full error with user-friendly message in the modal

**Checkpoint**: User can add expenses and they persist across page refresh

---

## Phase 4: User Story 2 - View and Filter Expenses (Priority: P1)

**Goal**: User can view all expenses in a data table with sortable columns and paginated results

**Independent Test**: Click Expense in the horizontal nav bar, verify all expenses are displayed in a table with alternating row colors, column headers are clickable to toggle sort, page size selector works, and empty state shown when no expenses exist.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create expense list data table component in `app/_components/expense-list.tsx` with table header, alternating row colors, and sortable columns (Amount, Date, Category, Description)
- [X] T014 [P] [US2] Implement column sorting in `app/_components/expense-list.tsx` — clicking a column header toggles ascending/descending with visual indicator (▲/▼)
- [X] T015 [P] [US2] Implement pagination in `app/_components/expense-list.tsx` with page size options (10, 20, 50) and first/prev/next/last navigation
- [X] T016 [US2] Wire expense list page at `app/expenses/page.tsx` to load expenses from storage and render the data table
- [X] T017 [US2] Implement empty state message when no expenses exist (with link to add first expense)
- [X] T018 [US2] Create expense table row component in `app/_components/expense-item.tsx` with amount, date, category badge, description, and action buttons

**Checkpoint**: User can navigate to expense list and see all expenses in a sortable, paginated data table

---

## Phase 5: User Story 3 - Edit an Expense (Priority: P1)

**Goal**: User can edit an existing expense using the same modal, pre-populated with current data

**Independent Test**: Add an expense, click edit, modify a field, save, verify the change appears in the expense list and dashboard.

### Implementation for User Story 3

- [X] T019 [P] [US3] Add edit button to each expense row in `app/_components/expense-item.tsx` that triggers the modal with the selected expense
- [X] T020 [US3] Add edit mode to `app/_components/expense-modal.tsx` that pre-populates fields with existing expense data (uses `expense` prop)
- [X] T021 [US3] Wire edit submit to `lib/storage.ts` update function and refresh list on success

**Checkpoint**: User can edit expenses and changes persist

---

## Phase 6: User Story 4 - Delete an Expense (Priority: P2)

**Goal**: User can delete an expense with a confirmation step

**Independent Test**: Add an expense, click delete, confirm deletion, verify the expense is removed from the list and dashboard totals update. Cancel should not remove.

### Implementation for User Story 4

- [X] T022 [P] [US4] Add delete button to each expense row in `app/_components/expense-item.tsx`
- [X] T023 [US4] Implement confirmation dialog for delete (inline modal overlay with Delete/Cancel buttons)
- [X] T024 [US4] Wire delete confirm to `lib/storage.ts` deleteExpense function and refresh list on success
- [X] T025 [US4] Cancel delete should not remove the expense (setShowConfirm(false) without deleting)

**Checkpoint**: User can delete expenses with confirmation

---

## Phase 7: User Story 5 - View Dashboard Page (Priority: P2)

**Goal**: User visits the home page (route `/`) and sees dashboard items — totals, recent expenses, category breakdown

**Independent Test**: Add several expenses with different categories, navigate to the Dashboard page, verify totals are correct, recent expenses shown, and category breakdown is accurate.

### Implementation for User Story 5

- [X] T026 [US5] Add computeSummary function to `lib/storage.ts` (total count, total amount, recent 10 expenses, category breakdown with percentages)
- [X] T027 [US5] Update `app/page.tsx` to display dashboard content (totals cards, recent expenses list, category breakdown with percentages, empty state with link to expenses page)
- [X] T028 [US5] Style dashboard page to match the app's visual design (Tailwind cards, grid layout)

**Checkpoint**: Dashboard page shows accurate summary data

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T029 [P] Verify active link highlighting in `app/_components/nav-bar.tsx` works for both Dashboard and Expense routes
- [X] T030 [P] Run `npm run build` and `npm run lint` — fix any errors
- [ ] T031 Run quickstart.md validation scenarios end-to-end
- [ ] T032 Code cleanup and final commit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P1 → P1 → P2 → P2)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P1)**: Can start after Foundational — No dependencies on other stories but shares nav-bar and layout
- **US3 (P1)**: Depends on US1 (reuses expense-modal.tsx) and US2 (edit button in expense list)
- **US4 (P2)**: Depends on US2 (delete button in expense list)
- **US5 (P2)**: Depends on US1/US3 (data to display) and US2 (recent expenses)

### Within Each User Story

- Models before services
- Components before integration
- Core implementation before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US1 and US2 can be developed in parallel (different components)
- Components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch components for User Story 1 together:
Task: "Create shared expense modal component in app/_components/expense-modal.tsx"
Task: "Add validation logic for expense form"

# Then wire them together:
Task: "Create expense list page skeleton at app/expenses/page.tsx with Add Expense button"
Task: "Wire modal submit to lib/storage.ts create function"
```

## Parallel Example: User Story 2

```bash
# Launch table infrastructure together:
Task: "Create expense list data table component in app/_components/expense-list.tsx"
Task: "Implement column sorting in app/_components/expense-list.tsx"
Task: "Implement pagination in app/_components/expense-list.tsx"

# Then wire together:
Task: "Wire expense list page at app/expenses/page.tsx"
Task: "Create expense table row component in app/_components/expense-item.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Add Expense)
4. Complete Phase 4: User Story 2 (View Expenses) — includes data table, sorting, pagination
5. **STOP and VALIDATE**: User can add and view expenses end-to-end
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Add and view expenses in data table → Deploy/Demo (MVP!)
3. Add US3 → Edit expenses → Deploy/Demo
4. Add US4 → Delete expenses → Deploy/Demo
5. Add US5 → Dashboard page → Deploy/Demo

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
