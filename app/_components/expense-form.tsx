"use client";

import { useActionState, useEffect, useRef } from "react";
import { addExpense, updateExpense } from "@/lib/actions";
import { create, update } from "@/lib/storage";
import type { Expense, ValidationResult } from "@/src/server/types";
import { CATEGORIES, CATEGORY_DISPLAY_NAMES } from "@/src/server/constants";

const initialState: ValidationResult = { success: false };

function AddExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState(
    addExpense,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.data) {
      try {
        const { amount, date, category, description } = state.data;
        create({ amount, date, category, description });
        formRef.current?.reset();
        onSuccess?.();
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "QuotaExceededError"
        ) {
          alert(
            "Storage is full. Please delete some expenses before adding new ones."
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormFields state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}

function EditExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: {
  expense: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    updateExpense,
    initialState
  );

  useEffect(() => {
    if (state.success && state.data) {
      try {
        const { amount, date, category, description } = state.data;
        update(expense.id, { amount, date, category, description });
        onSuccess?.();
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "QuotaExceededError"
        ) {
          alert(
            "Storage is full. Please delete some expenses before adding new ones."
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={expense.id} />
      <FormFields
        state={state}
        defaults={{
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          description: expense.description ?? "",
        }}
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FormFields({
  state,
  defaults,
}: {
  state: ValidationResult;
  defaults?: {
    amount: number;
    date: string;
    category: string;
    description: string;
  };
}) {
  return (
    <>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          defaultValue={defaults?.amount}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.amount && (
          <p className="mt-1 text-sm text-red-600">{state.errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={defaults?.date ?? new Date().toISOString().split("T")[0]}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.date && (
          <p className="mt-1 text-sm text-red-600">{state.errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaults?.category}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_DISPLAY_NAMES[cat]}
            </option>
          ))}
        </select>
        {state.errors?.category && (
          <p className="mt-1 text-sm text-red-600">{state.errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaults?.description}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.description && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.description}
          </p>
        )}
      </div>
    </>
  );
}

export default function ExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  if (expense) {
    return (
      <EditExpenseForm
        expense={expense}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }
  return <AddExpenseForm onSuccess={onSuccess} />;
}
