import { NextResponse } from "next/server";
import { getProgress, updateProgress } from "@/lib/store";

export async function GET() {
  const steps = await getProgress();
  return NextResponse.json(steps);
}

export async function PATCH(request) {
  try {
    const { steps } = await request.json();
    if (!steps) return NextResponse.json({ error: "steps required" }, { status: 400 });
    const updated = await updateProgress(steps);
    return NextResponse.json({ success: true, steps: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
