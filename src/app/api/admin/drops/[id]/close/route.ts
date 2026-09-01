import { NextRequest, NextResponse } from "next/server";
import { closeDrop } from "@/lib/closeDrop";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await closeDrop(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    const status = message === "drop not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
