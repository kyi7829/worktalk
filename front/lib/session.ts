"use client";

const SESSION_KEY = "worktalk_session";

export interface Session {
  id: string;
  nickname: string;
}

function generateNickname(): string {
  const num = Math.floor(Math.random() * 97) + 3; // 03~99
  return `익명${String(num).padStart(2, "0")}`;
}

function generateId(): string {
  return crypto.randomUUID();
}

export function getSession(): Session {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) {
    return JSON.parse(stored) as Session;
  }
  const session: Session = { id: generateId(), nickname: generateNickname() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
