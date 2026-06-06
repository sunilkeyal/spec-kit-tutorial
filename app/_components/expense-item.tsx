"use client";

import { useState } from "react";
import { deleteExpense } from "@/lib/storage";
import type { Expense } from "@/lib/types";

export default function ExpenseItem({
  expense,
  even,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  even: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    setDeleting(true);
    deleteExpense(expense.id);
    setShowConfirm(false);
    onDelete?.();
  }

  if (deleting) {
    return null;
  }

  return (
    <>
      <tr className={`border-b transition-colors ${even ? "bg-white" : "bg-gray-50/60"}`}>
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
          {formattedAmount}
        </td>
        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
          {formattedDate}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {expense.category}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
          {expense.description || "—"}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(expense)}
              className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {showConfirm && (
        <tr className="absolute">
          <td colSpan={5} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setShowConfirm(false)}
              />
              <div className="relative z-10 w-80 rounded-lg bg-white p-6 shadow-xl">
                <p className="mb-4 text-sm text-gray-700">
                  Are you sure you want to delete this expense?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
