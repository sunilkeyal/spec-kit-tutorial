import { CATEGORIES, VALIDATION_LIMITS } from "./constants";
import type { Category, ExpenseFormData, ValidationResult } from "./types";

export function validateAmount(amount: unknown): string | null {
  if (amount === undefined || amount === null || amount === "") {
    return "Amount is required";
  }

  const num = Number(amount);

  if (Number.isNaN(num)) {
    return "Amount must be a valid number";
  }

  if (!Number.isFinite(num)) {
    return "Amount must be a finite number";
  }

  if (num <= 0) {
    return "Amount must be positive";
  }

  if (num > VALIDATION_LIMITS.maxAmount) {
    return `Amount must not exceed ${VALIDATION_LIMITS.maxAmount}`;
  }

  const decimalPlaces = (String(num).split(".")[1] || "").length;
  if (decimalPlaces > VALIDATION_LIMITS.maxDecimals) {
    return `Amount must have at most ${VALIDATION_LIMITS.maxDecimals} decimal places`;
  }

  return null;
}

export function validateDate(date: unknown): string | null {
  if (date === undefined || date === null || date === "") {
    return "Date is required";
  }

  const dateStr = String(date);
  const parsed = new Date(dateStr);

  if (Number.isNaN(parsed.getTime())) {
    return "Date must be a valid date";
  }

  return null;
}

export function validateCategory(category: unknown): string | null {
  if (category === undefined || category === null || category === "") {
    return "Category is required";
  }

  if (!CATEGORIES.includes(category as Category)) {
    return `Category must be one of: ${CATEGORIES.join(", ")}`;
  }

  return null;
}

export function validateDescription(description: unknown): string | null {
  if (description === undefined || description === null) {
    return null;
  }

  const desc = String(description).trim();

  if (desc.length > VALIDATION_LIMITS.maxDescriptionLength) {
    return `Description must be ${VALIDATION_LIMITS.maxDescriptionLength} characters or fewer`;
  }

  return null;
}

export function validateExpenseFormData(
  formData: Record<string, unknown>
): ValidationResult {
  const errors: Partial<Record<keyof ExpenseFormData, string>> = {};

  const amountError = validateAmount(formData.amount);
  if (amountError) errors.amount = amountError;

  const dateError = validateDate(formData.date);
  if (dateError) errors.date = dateError;

  const categoryError = validateCategory(formData.category);
  if (categoryError) errors.category = categoryError;

  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const descriptionRaw =
    formData.description !== undefined && formData.description !== null
      ? String(formData.description).trim() || null
      : null;

  return {
    success: true,
    data: {
      id: "",
      amount: Number(formData.amount),
      date: String(formData.date),
      category: formData.category as Category,
      description: descriptionRaw,
      createdAt: "",
    },
  };
}
