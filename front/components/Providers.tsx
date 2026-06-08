"use client";

import { RealtimeProvider } from "@upstash/realtime/client";
import type React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RealtimeProvider api={{ url: "/api/realtime", withCredentials: true }}>
      {children}
    </RealtimeProvider>
  );
}
