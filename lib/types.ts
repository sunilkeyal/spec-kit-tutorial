export type Category =
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Shopping"
  | "Other";

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

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: Category;
  description: string | null;
}

export interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  recentExpenses: Expense[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: Category;
  totalAmount: number;
  percentage: number;
}

export const VALIDATION_LIMITS = {
  maxAmount: 999999999,
  maxDescriptionLength: 500,
} as const;
