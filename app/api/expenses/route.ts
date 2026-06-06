import { NextRequest, NextResponse } from "next/server";
import { validateExpenseFormData } from "@/src/server/validation";
import type { ApiResponse, Expense } from "@/src/server/types";

export async function GET(): Promise<NextResponse<ApiResponse<Expense[]>>> {
  return NextResponse.json({ data: [] });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Expense>>> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = validateExpenseFormData(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: result.errors },
      { status: 400 }
    );
  }

  const expense: Expense = {
    ...result.data!,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: expense }, { status: 201 });
}
