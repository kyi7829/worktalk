export interface Room {
  id: string;
  code: string;
  isPublic: boolean;
  roomTtl: number;   // 방 유지 시간 (초)
  msgTtl: number;    // 메시지 유지 시간 (초)
  createdAt: number;
}

export interface Message {
  id: string;
  roomId: string;
  nickname: string;
  content: string;
  createdAt: number;
  expiresAt: number;
}

export type RoomDuration = 3600 | 14400 | 86400; // 1h | 4h | 24h
export type MsgDuration = 5 | 10 | 30;            // 5s | 10s | 30s
