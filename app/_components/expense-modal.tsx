"use client";

import { useState, useCallback } from "react";
import { create, update } from "@/lib/storage";
import { CATEGORIES, CATEGORY_DISPLAY_NAMES, VALIDATION_LIMITS } from "@/lib/types";
import type { Category, Expense } from "@/lib/types";

interface FormData {
  amount: string;
  date: string;
  category: string;
  description: string;
}

interface FormErrors {
  amount?: string;
  date?: string;
  category?: string;
  description?: string;
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};

  const amountNum = Number(form.amount);
  if (!form.amount || isNaN(amountNum)) {
    errors.amount = "Amount is required";
  } else if (amountNum <= 0) {
    errors.amount = "Amount must be positive";
  } else if (amountNum > VALIDATION_LIMITS.maxAmount) {
    errors.amount = `Amount must not exceed ${VALIDATION_LIMITS.maxAmount}`;
  }

  if (!form.date) {
    errors.date = "Date is required";
  }

  if (!form.category) {
    errors.category = "Category is required";
  }

  if (form.description.length > VALIDATION_LIMITS.maxDescriptionLength) {
    errors.description = `Description must be ${VALIDATION_LIMITS.maxDescriptionLength} characters or fewer`;
  }

  return errors;
}

export default function ExpenseModal({
  expense,
  onSuccess,
  onClose,
}: {
  expense?: Expense;
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const isEditing = !!expense;
  const [form, setForm] = useState<FormData>(() => ({
    amount: expense ? String(expense.amount) : "",
    date: expense ? expense.date : new Date().toISOString().split("T")[0],
    category: expense ? expense.category : "",
    description: expense ? (expense.description ?? "") : "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [storageError, setStorageError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStorageError(null);
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setStorageError(null);

      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        if (isEditing && expense) {
          update(expense.id, {
            amount: Number(form.amount),
            date: form.date,
            category: form.category as Category,
            description: form.description || null,
          });
        } else {
          create({
            amount: Number(form.amount),
            date: form.date,
            category: form.category as Category,
            description: form.description || null,
          });
        }
        onSuccess?.();
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "QuotaExceededError"
        ) {
          setStorageError(
            "Storage is full. Please delete some expenses before adding new ones."
          );
        } else {
          setStorageError("An unexpected error occurred. Please try again.");
        }
      }
    },
    [form, isEditing, expense, onSuccess]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {storageError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {storageError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={form.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
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
              value={form.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_DISPLAY_NAMES[cat]}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isEditing ? "Save Changes" : "Add Expense"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
