"use client";

import { useEffect, useState } from "react";
import { useRealtime } from "@/lib/realtime-client";
import type { Message } from "@/types";

function mergeMessages(current: Message[], next: Message): Message[] {
  if (next.expiresAt <= Date.now()) {
    return current;
  }

  const byId = new Map(current.map((message) => [message.id, message]));
  byId.set(next.id, next);

  return Array.from(byId.values())
    .filter((message) => message.expiresAt > Date.now())
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function useRealtimeMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      try {
        const res = await fetch(`/api/messages?roomId=${encodeURIComponent(roomId)}`);
        if (!res.ok) return;

        const data = (await res.json()) as { messages: Message[] };
        if (!cancelled) {
          setMessages(
            data.messages
              .filter((message) => message.expiresAt > Date.now())
              .sort((a, b) => a.createdAt - b.createdAt)
          );
        }
      } catch {
        // Snapshot failures are non-fatal; realtime events can still arrive.
      }
    }

    setMessages([]);
    loadSnapshot();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useRealtime({
    channels: [roomId],
    events: ["chat.message"],
    onData({ data }) {
      setMessages((current) => mergeMessages(current, data));
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMessages((current) =>
        current.filter((message) => message.expiresAt > Date.now())
      );
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return messages;
}
