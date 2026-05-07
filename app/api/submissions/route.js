import { NextResponse } from "next/server";
import { getSubmissions, addSubmission, updateSubmission, updateSubmissionStatus, addNotification } from "@/lib/store";

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json(submissions);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const submission = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: "new",
      company_name: body.company_name || "N/A",
      contact_person: body.contact_person || "N/A",
      form_data: body.form_data || {},
    };
    await addSubmission(submission);
    await addNotification("admin", "submission", "📋 Client Brief mới!", `${submission.company_name} vừa gửi phiếu khảo sát dự án`);
    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Update existing submission
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, company_name, contact_person, form_data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const result = await updateSubmission(id, {
      company_name: company_name || "N/A",
      contact_person: contact_person || "N/A",
      form_data: form_data || {},
    });
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await addNotification("admin", "submission", "📋 Client Brief cập nhật!", `${company_name} vừa cập nhật phiếu khảo sát`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const result = await updateSubmissionStatus(id, status);
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
