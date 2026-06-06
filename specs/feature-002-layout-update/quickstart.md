# Quickstart: Layout Update

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)

## Setup

```bash
npm install
```

## Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Validation Scenarios

### 1. Dashboard Page (route `/`)

**Setup**: Open the app to the root URL.

**Expected**:
- Horizontal nav bar visible at the top with **Dashboard** and **Expense** links
- Dashboard page shows: total expense count, total amount spent, recent expenses list (empty state if none), category breakdown
- Dashboard link is visually active/highlighted

### 2. Navigation to Expense List

**Action**: Click **Expense** in the horizontal nav bar.

**Expected**:
- URL changes to `/expenses`
- Expense list shown, sorted by date descending
- **Add Expense** button visible at the top
- Expense link in nav bar is now visually active

### 3. Add Expense via Modal

**Action**: Click **Add Expense** → fill in amount, date, category, description → submit.

**Expected**:
- Modal/overlay opens centered on screen with dark overlay behind it
- Date defaults to today
- After submit, modal closes
- Expense appears in the list
- Dashboard totals update when navigating back

### 4. Validation

**Action**: Submit the form with negative amount or missing date.

**Expected**: Validation error displayed; expense not saved.

### 5. Edit Expense

**Action**: Click edit on an expense row in the list.

**Expected**:
- Same modal opens, pre-populated with the expense's current values
- Modify fields and save → changes reflected in list and dashboard

### 6. Delete Expense

**Action**: Click delete on an expense row.

**Expected**:
- Confirmation dialog appears
- Confirm → expense removed from list and dashboard totals updated
- Cancel → expense unchanged

### 7. Persistence

**Action**: Add an expense, refresh the page (F5).

**Expected**: All expenses remain visible after refresh.

### 8. Empty State

**Action**: Clear all expenses (or fresh browser with no data).

**Expected**: Expense list shows a friendly empty-state message; Dashboard shows zero totals.

## Build Check

```bash
npm run build
npm run lint
```

Both MUST pass without errors.
