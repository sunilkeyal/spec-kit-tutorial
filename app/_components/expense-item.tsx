"use client";

import { useState } from "react";
import { deleteExpense } from "@/lib/storage";
import type { Expense } from "@/src/server/types";

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(expense.amount);

  const formattedDate = new Date(expense.date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setDeleting(true);
      deleteExpense(expense.id);
      onDelete?.();
    }
  }

  if (deleting) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-gray-900">
          {formattedAmount}
        </span>
        <span className="text-sm text-gray-500">{formattedDate}</span>
        {expense.description && (
          <span className="text-sm text-gray-600">{expense.description}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {expense.category}
        </span>
        <button
          type="button"
          onClick={() => onEdit?.(expense)}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
