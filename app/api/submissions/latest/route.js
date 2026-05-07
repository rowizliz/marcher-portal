import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/store";

// Get the latest submission for the client to review
export async function GET() {
  const subs = await getSubmissions();
  if (subs.length === 0) return NextResponse.json(null);
  // Return the most recent submission
  const latest = subs[subs.length - 1];
  return NextResponse.json(latest);
}
