import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const raw = await redis.get<string>(`room:${code.toUpperCase()}`);

  if (!raw) {
    return NextResponse.json({ error: "Room not found or expired" }, { status: 404 });
  }

  const room = typeof raw === "string" ? JSON.parse(raw) : raw;
  return NextResponse.json({ room });
}
