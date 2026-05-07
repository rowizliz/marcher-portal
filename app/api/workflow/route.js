import { NextResponse } from "next/server";
import { getWorkflow, updateWorkflow } from "@/lib/store";

export async function GET() {
  const workflow = await getWorkflow();
  return NextResponse.json(workflow);
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const updated = await updateWorkflow(body);
    return NextResponse.json({ success: true, workflow: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
