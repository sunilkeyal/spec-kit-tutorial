"use client";

import { computeSummary } from "@/lib/storage";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/types";

export default function Home() {
  const summary = computeSummary();

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(summary.totalAmount);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            {summary.totalCount}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">{formattedTotal}</p>
        </div>
      </div>

      {summary.recentExpenses.length > 0 && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Recent Expenses
          </h2>
          <div className="space-y-2">
            {summary.recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {expense.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {expense.description}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.categoryBreakdown.length > 0 && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Category Breakdown
          </h2>
          <div className="space-y-2">
            {summary.categoryBreakdown.map((entry) => (
              <div
                key={entry.category}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {CATEGORY_DISPLAY_NAMES[entry.category]}
                </span>
                <span className="text-sm text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(entry.totalAmount)}{" "}
                  ({entry.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.totalCount === 0 && (
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No expenses yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Go to the{" "}
            <a href="/expenses" className="text-blue-600 hover:underline">
              Expenses
            </a>{" "}
            page to add your first expense
          </p>
        </div>
      )}
    </div>
  );
}
