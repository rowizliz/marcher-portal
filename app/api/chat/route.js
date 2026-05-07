import { NextResponse } from "next/server";
import { getMessages, addMessage, deleteMessage, editMessage, addNotification } from "@/lib/store";

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

    const target = from === "admin" ? "client" : "admin";
    const sender = from === "admin" ? "Rowiz Lê Design" : "Marcher";
    const preview = file ? `📎 ${file.name}` : (text.length > 60 ? text.slice(0, 60) + "..." : text);
    await addNotification(target, "chat", `💬 Tin nhắn mới từ ${sender}`, preview);

    return NextResponse.json({ success: true, messages: msgs }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const msgs = await deleteMessage(id);
    return NextResponse.json({ success: true, messages: msgs });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const { id, text } = await request.json();
    if (!id || !text) return NextResponse.json({ error: "id and text required" }, { status: 400 });
    const msgs = await editMessage(id, text);
    return NextResponse.json({ success: true, messages: msgs });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
