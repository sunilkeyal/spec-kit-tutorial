# Data Model: Layout Update

## Entities

### Expense

Represents a single financial transaction.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Auto-generated on creation; immutable |
| `amount` | `number` | Yes | Positive numeric; max 999,999,999 |
| `date` | `string` (ISO date) | Yes | Format `YYYY-MM-DD`; any valid date allowed (including future) |
| `category` | `string` | Yes | Must be one of: `Food`, `Transportation`, `Entertainment`, `Utilities`, `Shopping`, `Other` |
| `description` | `string` | No | Max 500 characters; optional free text |

### ExpenseSummary

Computed aggregate derived from all expenses (not persisted separately).

| Field | Type | Description |
|-------|------|-------------|
| `totalCount` | `number` | Total number of expenses |
| `totalAmount` | `number` | Sum of all expense amounts |
| `recentExpenses` | `Expense[]` | 5-10 most recent expenses sorted by date descending |
| `categoryBreakdown` | `CategoryBreakdown[]` | Per-category totals and percentages |

### CategoryBreakdown

| Field | Type | Description |
|-------|------|-------------|
| `category` | `string` | Category name |
| `totalAmount` | `number` | Sum of amounts for this category |
| `percentage` | `number` | Percentage of total spend (0-100) |

## Validation Rules

- **Amount**: Positive numeric; must not exceed 999,999,999; displays validation error for negative/zero/non-numeric input
- **Date**: Required; defaults to current date; accepts past and future dates
- **Category**: Required; limited to predefined list; no free-text categories
- **Description**: Optional; max 500 characters
- **Storage**: All data persisted in localStorage; on storage full, prevent new entries and show error message

## State Transitions

- **Create**: User fills modal form → validation → save to localStorage → update list and dashboard
- **Read**: Load from localStorage → render sorted by date descending
- **Update**: Open modal pre-populated → modify fields → validation → save to localStorage → update list and dashboard
- **Delete**: User clicks delete → confirmation dialog → remove from localStorage → update list and dashboard
