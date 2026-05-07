import { NextResponse } from "next/server";
import { getNotifications, markNotificationsRead } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target") || "client";
  const notifs = await getNotifications(target);
  return NextResponse.json(notifs);
}

export async function PATCH(request) {
  try {
    const { target } = await request.json();
    if (!target) return NextResponse.json({ error: "target required" }, { status: 400 });
    const updated = await markNotificationsRead(target);
    return NextResponse.json({ success: true, notifications: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
