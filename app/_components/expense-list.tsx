"use client";

import { useState, useMemo } from "react";
import { getAll } from "@/lib/storage";
import type { Expense } from "@/lib/types";
import ExpenseItem from "./expense-item";

type SortKey = "amount" | "date" | "category" | "description";
type SortDir = "asc" | "desc";

const PAGE_SIZES = [10, 20, 50];

const columns: { key: SortKey; label: string }[] = [
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
];

export default function ExpenseList({
  onEdit,
  onDelete,
}: {
  onEdit?: (expense: Expense) => void;
  onDelete?: () => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const allExpenses = useMemo(() => {
    const sorted = getAll();
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "description": {
          const da = (a.description ?? "").toLowerCase();
          const db = (b.description ?? "").toLowerCase();
          cmp = da.localeCompare(db);
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(allExpenses.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = allExpenses.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(e.target.value));
    setPage(0);
  }

  if (allExpenses.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">No expenses yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Click &quot;Add Expense&quot; to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="cursor-pointer select-none px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key ? (
                      <span className="text-xs">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">▲</span>
                    )}
                  </span>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((expense, i) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                even={i % 2 === 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>
            {allExpenses.length === 0
              ? "0 of 0"
              : `${safePage * pageSize + 1}–${Math.min(
                  (safePage + 1) * pageSize,
                  allExpenses.length
                )} of ${allExpenses.length}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage(0)}
            className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-30"
          >
            ««
          </button>
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-30"
          >
            «
          </button>
          <span className="px-2 text-sm text-gray-600">
            {totalPages === 0 ? 0 : safePage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-30"
          >
            »
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
            className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-30"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}
