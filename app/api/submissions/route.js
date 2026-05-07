import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/store";

export async function GET() {
  const data = readData();
  return NextResponse.json(data.submissions || []);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = readData();

    const submission = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: "new",
      company_name: body.company_name || "N/A",
      contact_person: body.contact_person || "N/A",
      form_data: body.form_data || {},
    };

    data.submissions = data.submissions || [];
    data.submissions.unshift(submission);
    writeData(data);

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const data = readData();
    const sub = (data.submissions || []).find((s) => s.id === id);
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
    sub.status = status;
    writeData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
