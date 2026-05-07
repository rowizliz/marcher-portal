import { NextResponse } from "next/server";
import { getContent, updateContent } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });
  const content = await getContent(type);
  return NextResponse.json(content);
}

export async function PATCH(request) {
  try {
    const { type, data } = await request.json();
    if (!type || !data) return NextResponse.json({ error: "type and data required" }, { status: 400 });
    const updated = await updateContent(type, data);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
