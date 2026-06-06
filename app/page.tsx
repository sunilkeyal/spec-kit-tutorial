"use client";

import { useState } from "react";
import type { Expense } from "@/src/server/types";
import ExpenseForm from "./_components/expense-form";
import ExpenseList from "./_components/expense-list";
import DashboardSummary from "./_components/dashboard-summary";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const editingSectionTitle = editingExpense ? "Edit Expense" : "Add Expense";

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Tracker
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <DashboardSummary key={refreshKey} />

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            {editingSectionTitle}
          </h2>
          <ExpenseForm
            key={editingExpense?.id ?? "add"}
            expense={editingExpense}
            onSuccess={() => {
              setEditingExpense(undefined);
              handleRefresh();
            }}
            onCancel={() => setEditingExpense(undefined)}
          />
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Expenses
          </h2>
          <ExpenseList
            key={refreshKey}
            onEdit={setEditingExpense}
            onDelete={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
}
