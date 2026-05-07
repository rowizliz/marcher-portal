import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export async function GET() {
  const data = readData();
  return NextResponse.json(data.workflow || { current_phase: "week_1", progress: 0, notes: "" });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const data = readData();
    data.workflow = { ...data.workflow, ...body, updated_at: new Date().toISOString() };
    writeData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
