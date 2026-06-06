# Feature Specification: Layout Update

**Feature Branch**: `002-layout-update`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "Modify the layout of the recently merged UI feature to use horizontal nav bar at the top of the page and the dashboard items should be displayed in the home page. The vertical nav bar will have Expense as a navigation item which when clicked will display a list of expenses and there will be a add expense button which will open the add expense section."

## User Interface

The application layout is restructured as follows:

- **Horizontal Navigation Bar**: Fixed at the top of every page. Contains the app title/logo and primary navigation links (Home, Dashboard summary link).
- **Vertical Navigation Bar** (sidebar): Positioned on the left side below the horizontal bar. Contains secondary navigation items:
  - **Expense** — clicking this navigates to the expense list view.
- **Home Page** (default route `/`): Displays dashboard items — total number of expenses, total amount spent, recent expenses list, and category breakdown.
- **Expense List View**: Shown when the user clicks **Expense** in the vertical nav bar. Displays all expenses sorted by date (most recent first). Includes an **Add Expense** button at the top.
- **Add Expense Section**: Opens inline or as a modal/panel when the **Add Expense** button is clicked. Contains the expense entry form (amount, date, category, description).
- **Edit/Delete**: Each expense row in the list has edit and delete controls directly available.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a New Expense (Priority: P1)

The user records a new personal expense by clicking the **Add Expense** button in the expense list view, filling out the amount, date, category, and an optional description. Once submitted, the expense appears in the expense list and is reflected in the dashboard totals on the home page.

**Why this priority**: Recording expenses is the foundational action — without it, there is nothing to view, delete, or summarize.

**Independent Test**: Can be fully tested by navigating to the expense list via the vertical nav bar, clicking Add Expense, filling in the form, and submitting. The newly added expense should immediately appear in the expense list and affect dashboard totals on the home page.

**Acceptance Scenarios**:

1. **Given** the user is on the expense list view, **When** they click Add Expense, fill in a valid amount, select a date and category, and optionally add a description, **Then** the expense is saved and appears in the expense list
2. **Given** the user submits an expense with a negative amount, **When** they attempt to save, **Then** the system rejects the entry and shows a validation message
3. **Given** the user submits an expense with a missing amount or date, **When** they attempt to save, **Then** the system rejects the entry and highlights the missing field

---

### User Story 2 - View and Filter Expenses (Priority: P1)

The user clicks **Expense** in the vertical navigation bar to view a list of all recorded expenses sorted by date (most recent first). They can browse through expenses and see the amount, date, category, and description for each entry.

**Why this priority**: Viewing expenses is the primary way users interact with their data — this is the core read capability.

**Independent Test**: Can be fully tested by clicking Expense in the vertical nav bar and seeing the list of previously added expenses displayed in reverse chronological order with all relevant fields visible.

**Acceptance Scenarios**:

1. **Given** the user has recorded multiple expenses, **When** they click Expense in the vertical nav bar, **Then** all expenses are displayed sorted by date (most recent first) with amount, date, category, and description
2. **Given** the user has no recorded expenses, **When** they click Expense in the vertical nav bar, **Then** a friendly empty-state message is shown indicating no expenses yet

---

### User Story 3 - Edit an Expense (Priority: P1)

The user modifies an existing expense in the expense list view to correct or update any of its fields (amount, date, category, description). After saving, the changes are reflected immediately in both the expense list and the dashboard totals on the home page.

**Why this priority**: Without editing, users must delete and re-add to fix mistakes, which is poor UX. Edit completes the CRUD lifecycle and is essential for daily use.

**Independent Test**: Can be fully tested by adding an expense, then changing each field from the expense list view and verifying the updated values appear in the expense list and dashboard.

**Acceptance Scenarios**:

1. **Given** an expense exists in the expense list, **When** the user triggers edit, modifies one or more fields, and saves, **Then** the expense is updated and changes appear in the expense list and dashboard totals
2. **Given** the user is editing an expense, **When** they clear the amount or date and attempt to save, **Then** the system rejects the entry and highlights the missing field
3. **Given** the user is editing an expense, **When** they cancel the edit without saving, **Then** the expense remains unchanged

---

### User Story 4 - Delete an Expense (Priority: P2)

The user removes an expense from the expense list view. After deletion, the expense is permanently removed from the list and the dashboard totals on the home page are updated accordingly.

**Why this priority**: Deletion corrects mistakes and keeps the record clean, but the app is functional without it (users can add and view).

**Independent Test**: Can be fully tested by adding an expense, then deleting it from the expense list and confirming it no longer appears in the expense list or dashboard totals.

**Acceptance Scenarios**:

1. **Given** an expense exists in the expense list, **When** the user triggers delete and confirms, **Then** the expense is permanently removed from the list and dashboard totals are updated
2. **Given** the user triggers delete, **When** they cancel the confirmation, **Then** the expense is not removed

---

### User Story 5 - View Dashboard on Home Page (Priority: P2)

The user visits the home page (default route `/`) and sees dashboard items: total number of expenses, total amount spent, recent expenses (5-10 most recent), and a breakdown by category (text list with category name, total amount, and percentage).

**Why this priority**: The dashboard provides value-added insight, but the app is still useful for basic recording and viewing without it.

**Independent Test**: Can be fully tested by adding several expenses with different categories and amounts, navigating to the home page, and verifying the dashboard shows the correct total count, total sum, and a list of recent expenses.

**Acceptance Scenarios**:

1. **Given** the user has added multiple expenses, **When** they view the home page, **Then** they see the total number of expenses and the total amount spent
2. **Given** the user has expenses in multiple categories, **When** they view the home page, **Then** they see a breakdown by category (text list with category name, total amount, and percentage)
3. **Given** the user opens the app, **When** the home page loads, **Then** the 5-10 most recent expenses are displayed

---

### Edge Cases

- What happens when the user tries to add an expense with an amount exceeding a reasonable maximum (e.g., 999,999,999)? The system should validate and reject values outside a reasonable range.
- How does the system handle empty categories or descriptions? Category should be required; description should be optional with a reasonable character limit.
- What happens when the user's data store is full (localStorage capacity reached)? The system MUST prevent new entries and display a clear error message explaining that storage is full. For corruption, the system should show a user-friendly error message and prevent data loss where possible.
- How does the system handle the date field if the user selects a future date? Reasonable default: allow any valid date including future dates (user may want to log a planned expense or a receipt from a future-dated transaction).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to add a new expense with amount, date, category, and optional description via an Add Expense button in the expense list view
- **FR-002**: The amount field MUST accept positive numeric values only and MUST display a clear validation error for invalid input
- **FR-003**: The date field MUST allow date selection via a date picker and MUST default to the current date
- **FR-004**: The category field MUST provide a predefined set of categories (e.g., Food, Transportation, Entertainment, Utilities, Shopping, Other) and allow the user to select one
- **FR-005**: Users MUST be able to view all expenses in a list sorted by date (most recent first), accessed by clicking Expense in the vertical navigation bar
- **FR-006**: Users MUST be able to delete an individual expense with a confirmation step from the expense list view
- **FR-007**: The home page MUST display the total number of expenses and the total amount spent across all expenses (dashboard items)
- **FR-008**: The home page MUST show a list of the most recent expenses (minimum 5)
- **FR-009**: All expense data MUST persist across browser sessions (data is saved locally)
- **FR-010**: The system MUST show an empty-state message when no expenses exist
- **FR-011**: Users MUST be able to edit the amount, date, category, and description of an existing expense, with the same validation rules as adding
- **FR-012**: The application MUST have a horizontal navigation bar at the top of every page
- **FR-013**: The application MUST have a vertical navigation bar (sidebar) with an Expense navigation item
- **FR-014**: The home page (default route `/`) MUST display the dashboard items — totals, recent expenses, and category breakdown

### Key Entities *(include if feature involves data)*

- **Expense**: Represents a single financial transaction. Key attributes: id (auto-generated unique identifier), amount (positive number), date (calendar date), category (from predefined list), description (optional free text).
- **Expense Summary**: A computed aggregate derived from all expenses. Attributes: total count, total sum, optional category breakdown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new expense and see it appear in the list within 2 seconds of submission
- **SC-002**: A user can complete the full record→view→delete workflow in under 30 seconds on their first attempt
- **SC-003**: The home page loads and displays correct dashboard totals immediately upon opening the app
- **SC-004**: 100% of expenses added by the user remain visible after a page refresh
- **SC-005**: The app is usable with zero learning curve — a first-time user can successfully add an expense without external instructions

## Assumptions

- The app is a single-user personal tracker; no authentication, user accounts, or multi-user support is needed
- Currency is assumed to be USD; no multi-currency support is required for v1
- Data persistence uses client-side storage (browser local storage); no server or database is required
- The app is used on desktop/laptop web browsers; mobile-responsive design is a nice-to-have but not required for v1
- Predefined categories (Food, Transportation, Entertainment, Utilities, Shopping, Other) cover the majority of personal expense tracking needs
- No export, reporting, or data import functionality is needed for v1
- No recurring expense or budget tracking capabilities are in scope
