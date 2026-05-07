import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/store";

// Get the latest submission for the client to review
export async function GET() {
  const subs = await getSubmissions();
  if (!subs || subs.length === 0) return NextResponse.json(null);
  // subs are unshifted (newest first)
  return NextResponse.json(subs[0]);
}
