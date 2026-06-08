"use client";

import { useEffect, useState } from "react";
import { getSession, type Session } from "@/lib/session";

export function useAnonymousSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return session;
}
