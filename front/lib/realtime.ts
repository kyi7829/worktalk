import { Realtime, type InferRealtimeEvents } from "@upstash/realtime";
import { z } from "zod/v4";
import { redis } from "./redis";

const messageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  nickname: z.string(),
  content: z.string(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

export const realtime = new Realtime({
  redis,
  schema: {
    chat: {
      message: messageSchema,
    },
  },
});

export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
