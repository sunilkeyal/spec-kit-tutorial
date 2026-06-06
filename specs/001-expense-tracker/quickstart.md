# Quickstart Validation Guide: Basic Expense Tracker

## Prerequisites

- Node.js 18+
- `npm install` completed in project root

## Setup

No database, environment variables, or external services required.

## Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation Scenarios

### Scenario 1: Add an Expense

1. Open the app → dashboard with empty-state "No expenses yet" is displayed
2. Click "Add Expense" → form with amount, date (defaults today), category dropdown, optional description
3. Enter amount `12.50`, select today, choose "Food", enter "Lunch"
4. Submit → Server action validates → expense saved to localStorage → appears in list and dashboard totals
5. Refresh page → expense persists

### Scenario 2: Validation Errors

1. Click "Add Expense", leave amount empty, submit → error: "Amount is required"
2. Enter `-5` in amount, submit → error: "Amount must be positive"
3. Enter `0` in amount, submit → error: "Amount must be positive"
4. Omit category, submit → error: "Category is required"
5. Enter description >200 characters, submit → error: "Description must be 200 characters or fewer"

### Scenario 3: View Expense List

1. Add 3+ expenses with different dates
2. Navigate to expense list → expenses sorted by date desc (most recent first)
3. Each row displays: amount, date, category, description

### Scenario 4: Edit an Expense

1. Click edit on an existing expense → form pre-filled with current values
2. Change amount to `15.00`, change category to "Transportation"
3. Save → list reflects changes, dashboard totals recalculated
4. Click edit, click cancel → expense unchanged

### Scenario 5: Delete an Expense

1. Click delete on an expense → confirmation prompt appears
2. Click cancel → expense remains
3. Click delete again, confirm → expense removed, dashboard updated

### Scenario 6: Dashboard

1. Add expenses across 3+ categories (e.g., Food: $50, Transport: $30, Entertainment: $20)
2. Navigate to dashboard → verify:
   - Total count = 3
   - Total amount = $100.00
   - Category breakdown: Food $50 (50%), Transport $30 (30%), Entertainment $20 (20%)
   - 5-10 most recent expenses listed

### Scenario 7: Empty State

1. Delete all expenses
2. Expense list shows: "No expenses yet"
3. Dashboard shows zero totals

### Scenario 8: API Routes

> Verify route handlers respond correctly (optional — for API consumers).

```bash
# List all expenses
curl http://localhost:3000/api/expenses

# Create an expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":12.50,"date":"2026-06-05","category":"Food"}'

# Update an expense
curl -X PUT http://localhost:3000/api/expenses/{id} \
  -H "Content-Type: application/json" \
  -d '{"amount":15.00}'

# Delete an expense
curl -X DELETE http://localhost:3000/api/expenses/{id}
```

## Contract References

- Data shapes: [contracts/types.ts](./contracts/types.ts)
- Storage API: [contracts/storage.ts](./contracts/storage.ts)
- API contract: [contracts/api.ts](./contracts/api.ts)
- Validation rules: [data-model.md](./data-model.md#validation-rules)

## Expected Outcomes

| Scenario | Result |
|----------|--------|
| Add expense | Persisted, visible in list + dashboard |
| Validation | Invalid inputs rejected with field-level errors |
| View list | Sorted by date desc, all fields shown |
| Edit expense | Changes persisted, UI updated |
| Delete expense | Removed after confirmation |
| Dashboard | Correct totals, category breakdown, recent list |
| Empty state | Friendly message displayed |
| API routes | Correct HTTP status codes + JSON responses |
