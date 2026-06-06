"use server";

import { validateExpenseFormData } from "@/src/server/validation";
import type { ValidationResult } from "@/src/server/types";

export async function addExpense(
  prevState: ValidationResult,
  formData: FormData
): Promise<ValidationResult> {
  const raw: Record<string, unknown> = {
    amount: formData.get("amount"),
    date: formData.get("date"),
    category: formData.get("category"),
    description: formData.get("description"),
  };

  const result = validateExpenseFormData(raw);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: result.data,
  };
}

export async function updateExpense(
  prevState: ValidationResult,
  formData: FormData
): Promise<ValidationResult> {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      errors: { amount: "Expense ID is required for updates" },
    };
  }

  const raw: Record<string, unknown> = {
    amount: formData.get("amount"),
    date: formData.get("date"),
    category: formData.get("category"),
    description: formData.get("description"),
  };

  const result = validateExpenseFormData(raw);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: {
      amount: result.data!.amount,
      date: result.data!.date,
      category: result.data!.category,
      description: result.data!.description,
      createdAt: result.data!.createdAt,
      id,
    },
  };
}
