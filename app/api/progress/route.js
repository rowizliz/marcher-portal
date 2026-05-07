import { NextResponse } from "next/server";
import { getProgress, updateProgress, addNotification } from "@/lib/store";

export async function GET() {
  const steps = await getProgress();
  return NextResponse.json(steps);
}

export async function PATCH(request) {
  try {
    const { steps, source } = await request.json();
    if (!steps) return NextResponse.json({ error: "steps required" }, { status: 400 });

    // Compare with current steps to detect changes
    const current = await getProgress();
    
    for (let i = 0; i < steps.length; i++) {
      const cur = current[i];
      const next = steps[i];
      if (!cur || !next) continue;

      // Admin changed status
      if (cur.status !== next.status && source !== "client") {
        const statusLabel = next.status === "done" ? "✅ Hoàn thành" : next.status === "active" ? "🔄 Đang thực hiện" : "⏳ Chờ";
        await addNotification("client", "progress", `📍 Cập nhật tiến độ: ${next.label}`, `Trạng thái: ${statusLabel}`);
      }

      // Admin wrote a note
      if (cur.admin_note !== next.admin_note && next.admin_note && source !== "client") {
        await addNotification("client", "note", `✏️ Phản hồi mới: ${next.label}`, next.admin_note.slice(0, 80));
      }

      // Client wrote a note
      if (cur.client_note !== next.client_note && next.client_note && source === "client") {
        await addNotification("admin", "note", `📝 Ghi chú từ Marcher: ${next.label}`, next.client_note.slice(0, 80));
      }
    }

    const updated = await updateProgress(steps);
    return NextResponse.json({ success: true, steps: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
