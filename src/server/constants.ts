import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Other",
];

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  Food: "Food & Dining",
  Transportation: "Transportation",
  Entertainment: "Entertainment",
  Utilities: "Utilities",
  Shopping: "Shopping",
  Other: "Other",
};

export const VALIDATION_LIMITS = {
  maxAmount: 999999999.99,
  minAmount: 0.01,
  maxDecimals: 2,
  maxDescriptionLength: 200,
} as const;
