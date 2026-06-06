"use client";

import { getAll } from "@/lib/storage";
import type { Expense } from "@/src/server/types";
import ExpenseItem from "./expense-item";

export default function ExpenseList({
  onEdit,
  onDelete,
}: {
  onEdit?: (expense: Expense) => void;
  onDelete?: () => void;
}) {
  const expenses = getAll();

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500 shadow-sm">
        No expenses yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
