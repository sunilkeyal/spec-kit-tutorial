# Data Model: Basic Expense Tracker

## Entities

### Expense

Represents a single financial transaction recorded by the user.

| Field | Type | Required | Default | Validation | Notes |
|-------|------|----------|---------|------------|-------|
| `id` | `string` (UUID v4) | Yes | `crypto.randomUUID()` | Must be unique across all expenses | Generated client-side on create |
| `amount` | `number` | Yes | — | > 0; ≤ 999,999,999.99; max 2 decimals; reject NaN | Stored as float |
| `date` | `string` (ISO 8601) | Yes | Today's date | Must be a parseable date | Future dates allowed |
| `category` | `string` | Yes | — | Must be one of predefined set | See Category enum |
| `description` | `string` | No | `null` | Max 200 chars; trimmed | Optional |
| `createdAt` | `string` (ISO 8601) | Yes | Auto-generated | Read-only after creation | Set on creation |

### ExpenseSummary

Computed read-only aggregate derived from all expenses.

| Field | Type | Computation |
|-------|------|-------------|
| `totalCount` | `number` | Count of all expenses |
| `totalAmount` | `number` | Sum of `amount` across all expenses |
| `categoryBreakdown` | `Array<{category, totalAmount, count, percentage}>` | Grouped by category, sorted by totalAmount desc |

## Validation Rules

- **amount**: Must be a number, > 0, ≤ 999,999,999.99, max 2 decimal places. Reject NaN, negative, zero.
- **date**: Must be a valid ISO date string parseable by `new Date()`.
- **category**: Must be one of: `Food`, `Transportation`, `Entertainment`, `Utilities`, `Shopping`, `Other`.
- **description**: Optional; max 200 characters; leading/trailing whitespace trimmed.

## State Transitions

```
[Empty] ──add──→ [Expense exists] ──edit──→ [Updated]
                    │
                    ├──delete──→ [Removed]
                    │
                    └──view────→ [Displayed]
```

- **Create**: Form submit → Server Action validates → Client writes to localStorage → Re-render
- **Read**: Client reads from localStorage → Sort by date desc → Render list + computed summary
- **Update**: Form submit → Server Action validates → Client updates by ID in localStorage → Re-render
- **Delete**: User confirms → Client removes by ID from localStorage → Re-render
- **Empty**: Array length === 0 → Show friendly empty-state message
- **Storage full**: `QuotaExceededError` caught → Show error, prevent write
- **Corruption**: JSON parse failure → Reset to empty array with console warning

## Predefined Categories

| Value | Display |
|-------|---------|
| `Food` | Food & Dining |
| `Transportation` | Transportation |
| `Entertainment` | Entertainment |
| `Utilities` | Utilities |
| `Shopping` | Shopping |
| `Other` | Other |
