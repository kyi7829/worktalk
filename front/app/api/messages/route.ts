import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { realtime } from "@/lib/realtime";
import type { Message } from "@/types";

const PUBLIC_ROOM_ID = "public";
const DEFAULT_MSG_TTL = 10;
const LOG_TTL = 60 * 60 * 24 * 90; // 90일

export async function POST(req: NextRequest) {
  const { roomId = PUBLIC_ROOM_ID, nickname, content } = await req.json();

  if (!nickname || !content || content.trim().length === 0) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  if (content.length > 200) {
    return NextResponse.json({ error: "Too long" }, { status: 400 });
  }

  // 방 메타데이터에서 msgTtl 조회
  let msgTtl = DEFAULT_MSG_TTL;
  if (roomId !== PUBLIC_ROOM_ID) {
    const raw = await redis.get<string>(`room:${roomId}`);
    if (!raw) {
      return NextResponse.json({ error: "Room not found or expired" }, { status: 404 });
    }
    const room = typeof raw === "string" ? JSON.parse(raw) : raw;
    msgTtl = room.msgTtl ?? DEFAULT_MSG_TTL;
  }

  const now = Date.now();
  const msg: Message = {
    id: crypto.randomUUID(),
    roomId,
    nickname,
    content: content.trim(),
    createdAt: now,
    expiresAt: now + msgTtl * 1000,
  };

  const msgKey = `msg:${roomId}:${msg.id}`;
  const serialized = JSON.stringify(msg);
  const logEntry = JSON.stringify({
    timestamp: msg.createdAt,
    roomId: msg.roomId,
    nickname: msg.nickname,
    message: msg.content,
  });

  // 휘발성 저장 + 관리자 로그 기록 + realtime 이벤트 발행
  const today = new Date().toISOString().slice(0, 10);
  await Promise.all([
    redis.set(msgKey, serialized, { ex: msgTtl }),
    redis.lpush(`log:${today}`, logEntry),
    redis.expire(`log:${today}`, LOG_TTL),
  ]);
  await realtime.channel(roomId).emit("chat.message", msg);

  return NextResponse.json({ message: msg });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId") ?? PUBLIC_ROOM_ID;

  // 패턴으로 해당 방 메시지 키 스캔
  const keys = await redis.keys(`msg:${roomId}:*`);
  if (keys.length === 0) {
    return NextResponse.json({ messages: [] });
  }

  const values = await redis.mget<string[]>(...keys);
  const messages = values
    .filter(Boolean)
    .map((v) => {
      const message = (typeof v === "string" ? JSON.parse(v) : v) as Message;
      return {
        ...message,
        expiresAt: message.expiresAt ?? message.createdAt + DEFAULT_MSG_TTL * 1000,
      };
    })
    .filter((message) => message.expiresAt > Date.now())
    .sort((a, b) => a.createdAt - b.createdAt);

  return NextResponse.json({ messages });
}
