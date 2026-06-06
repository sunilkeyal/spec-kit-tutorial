// --- Entity types ---

export interface Expense {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: Category;
  description: string | null;
  createdAt: string; // ISO 8601
}

export type Category =
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Shopping"
  | "Other";

export interface CategoryBreakdownEntry {
  category: Category;
  totalAmount: number;
  count: number;
  percentage: number; // 0–100
}

export interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  categoryBreakdown: CategoryBreakdownEntry[];
}

// --- Form payload ---

export interface ExpenseFormData {
  amount: number;
  date: string;
  category: Category;
  description: string | null;
}

// --- Server Action result ---

export interface ValidationResult {
  success: boolean;
  errors?: Partial<Record<keyof ExpenseFormData, string>>;
  data?: Expense;
}

// --- Route Handler request / response ---

export interface CreateExpenseRequest {
  amount: number;
  date: string;
  category: Category;
  description?: string | null;
}

export interface UpdateExpenseRequest {
  amount?: number;
  date?: string;
  category?: Category;
  description?: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}
