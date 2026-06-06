import { NextRequest, NextResponse } from "next/server";
import { validateExpenseFormData } from "@/src/server/validation";
import type { ApiResponse, Expense } from "@/src/server/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Expense>>> {
  const { id } = await params;

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
    id,
  };

  return NextResponse.json({ data: expense });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  const { id } = await params;

  return NextResponse.json({ data: { id } });
}
