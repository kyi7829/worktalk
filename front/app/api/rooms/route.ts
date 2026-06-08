import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { Room } from "@/types";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  const { roomTtl = 3600, msgTtl = 10 } = await req.json();

  const code = generateCode();
  const room: Room = {
    id: crypto.randomUUID(),
    code,
    isPublic: false,
    roomTtl,
    msgTtl,
    createdAt: Date.now(),
  };

  await redis.set(`room:${code}`, JSON.stringify(room), { ex: roomTtl });

  return NextResponse.json({ room });
}
