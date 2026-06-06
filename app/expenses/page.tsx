"use client";

import { useState } from "react";
import ExpenseModal from "../_components/expense-modal";
import ExpenseList from "../_components/expense-list";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditingExpense(undefined);
  }

  function handleSuccess() {
    setShowModal(false);
    setEditingExpense(undefined);
    handleRefresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Expense
        </button>
      </div>

      <ExpenseList key={refreshKey} onEdit={handleEdit} onDelete={handleRefresh} />

      {showModal && (
        <ExpenseModal
          key={editingExpense?.id ?? "add"}
          expense={editingExpense}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
