"use client";

import type {
  Expense,
  ExpenseFormData,
  ExpenseSummary,
  CategoryBreakdownEntry,
} from "@/src/server/types";
import { CATEGORIES } from "@/src/server/constants";

const STORAGE_KEY = "expenses";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function readExpenses(): Expense[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(
        "localStorage expense data was not an array. Resetting to empty."
      );
      return [];
    }
    return parsed as Expense[];
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.warn(
        "localStorage expense data corrupted. Resetting to empty."
      );
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    throw err;
  }
}

function writeExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      throw new DOMException(
        "QuotaExceededError",
        "Storage is full. Please delete some expenses before adding new ones."
      );
    }
    throw err;
  }
}

export function getAll(): Expense[] {
  return readExpenses().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getById(id: string): Expense | undefined {
  return readExpenses().find((e) => e.id === id);
}

export function create(data: ExpenseFormData): Expense {
  const expenses = readExpenses();
  const expense: Expense = {
    id: crypto.randomUUID(),
    amount: data.amount,
    date: data.date,
    category: data.category,
    description: data.description || null,
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  writeExpenses(expenses);
  return expense;
}

export function update(
  id: string,
  data: Partial<ExpenseFormData>
): Expense {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Expense with id "${id}" not found`);
  }
  const updated: Expense = {
    ...expenses[index],
    ...(data.amount !== undefined ? { amount: data.amount } : {}),
    ...(data.date !== undefined ? { date: data.date } : {}),
    ...(data.category !== undefined ? { category: data.category } : {}),
    ...(data.description !== undefined
      ? { description: data.description || null }
      : {}),
  };
  expenses[index] = updated;
  writeExpenses(expenses);
  return updated;
}

export function deleteExpense(id: string): void {
  const expenses = readExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  if (filtered.length === expenses.length) {
    throw new Error(`Expense with id "${id}" not found`);
  }
  writeExpenses(filtered);
}

export function getSummary(): ExpenseSummary {
  const expenses = readExpenses();
  const totalCount = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = new Map<string, { totalAmount: number; count: number }>();
  for (const cat of CATEGORIES) {
    categoryMap.set(cat, { totalAmount: 0, count: 0 });
  }
  for (const expense of expenses) {
    const entry = categoryMap.get(expense.category);
    if (entry) {
      entry.totalAmount += expense.amount;
      entry.count += 1;
    }
  }

  const categoryBreakdown: CategoryBreakdownEntry[] = Array.from(
    categoryMap.entries()
  )
    .filter(([, v]) => v.count > 0)
    .map(([category, v]) => ({
      category: category as Expense["category"],
      totalAmount: v.totalAmount,
      count: v.count,
      percentage: totalAmount > 0 ? Math.round((v.totalAmount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return { totalCount, totalAmount, categoryBreakdown };
}

import type {
  Expense as NewExpense,
  ExpenseSummary as NewExpenseSummary,
  CategoryBreakdown as NewCategoryBreakdown,
} from "./types";

export function computeSummary(): NewExpenseSummary {
  const expenses = readExpenses();
  const totalCount = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentExpenses = sorted.slice(0, 10);

  const catTotals = new Map<string, number>();
  for (const expense of expenses) {
    catTotals.set(
      expense.category,
      (catTotals.get(expense.category) ?? 0) + expense.amount
    );
  }

  const categoryBreakdown: NewCategoryBreakdown[] = Array.from(
    catTotals.entries()
  )
    .map(([category, catAmount]) => ({
      category: category as NewExpense["category"],
      totalAmount: catAmount,
      percentage:
        totalAmount > 0 ? Math.round((catAmount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    totalCount,
    totalAmount,
    recentExpenses: recentExpenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      date: e.date,
      category: e.category as NewExpense["category"],
      description: e.description,
    })),
    categoryBreakdown,
  };
}
