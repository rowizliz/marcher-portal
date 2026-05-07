import { NextResponse } from "next/server";
import { getMessages, addMessage, addNotification } from "@/lib/store";

export async function GET() {
  const msgs = await getMessages();
  return NextResponse.json(msgs);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { from, text, file } = body;
    if (!from || (!text && !file)) return NextResponse.json({ error: "from and text/file required" }, { status: 400 });
    const msgs = await addMessage({ from, text: text || "", file: file || null });

    // Send notification to the other side
    const target = from === "admin" ? "client" : "admin";
    const sender = from === "admin" ? "Rowiz Lê Design" : "Marcher";
    const preview = file ? `📎 ${file.name}` : (text.length > 60 ? text.slice(0, 60) + "..." : text);
    await addNotification(target, "chat", `💬 Tin nhắn mới từ ${sender}`, preview);

    return NextResponse.json({ success: true, messages: msgs }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
