export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: Category;
  description: string | null;
  createdAt: string;
}

export type Category =
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Shopping"
  | "Other";

export interface ExpenseFormData {
  amount: number;
  date: string;
  category: Category;
  description: string | null;
}

export interface ValidationResult {
  success: boolean;
  errors?: Partial<Record<keyof ExpenseFormData, string>>;
  data?: Expense;
}

export interface CategoryBreakdownEntry {
  category: Category;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  categoryBreakdown: CategoryBreakdownEntry[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}
