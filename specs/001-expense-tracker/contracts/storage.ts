// Storage contract — public API of lib/storage.ts
// See ../data-model.md for validation rules and ../quickstart.md for usage

export interface ExpenseStorage {
  /** Get all expenses sorted by date descending */
  getAll(): Expense[];

  /** Get a single expense by ID */
  getById(id: string): Expense | undefined;

  /** Create a new expense. Returns the created expense with id and createdAt. */
  create(data: ExpenseFormData): Expense;

  /** Update fields of an existing expense. Returns the updated expense. */
  update(id: string, data: Partial<ExpenseFormData>): Expense;

  /** Delete an expense by ID. */
  delete(id: string): void;

  /** Compute summary from all expenses. */
  getSummary(): ExpenseSummary;
}

// Throws:
// - QuotaExceededError (storage full) on create/update
// - SyntaxError (JSON parse failure) on get

import type { Expense, ExpenseFormData, ExpenseSummary } from "./types";
