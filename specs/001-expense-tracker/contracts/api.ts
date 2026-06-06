// API contract — request/response shapes for route handlers
// See ../quickstart.md for usage examples

// GET  /api/expenses          → { data: Expense[] }
// POST /api/expenses          → { data: Expense } | { error: string, errors?: Record<string, string> }
//       Body: CreateExpenseRequest
// PUT  /api/expenses/[id]     → { data: Expense } | { error: string, errors?: Record<string, string> }
//       Body: UpdateExpenseRequest
// DELETE /api/expenses/[id]    → { data: { id: string } } | { error: string }

import type {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ApiResponse,
} from "./types";
