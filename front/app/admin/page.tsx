"use client";

import Link from "next/link";
import { useState } from "react";

type View = "login" | "dashboard";

export default function AdminPage() {
  const [view, setView] = useState<View>("login");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [downloading, setDownloading] = useState(false);
  const [authedPassword, setAuthedPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthedPassword(password);
      setView("dashboard");
    } else {
      const { error: msg } = await res.json();
      setError(msg ?? "비밀번호가 틀렸습니다.");
    }
    setPassword("");
  };

  const handleDownload = async () => {
    setDownloading(true);
    const url = `/api/admin/logs?date=${date}&password=${encodeURIComponent(authedPassword)}`;
    const res = await fetch(url);
    if (!res.ok) {
      setError("다운로드 실패");
      setDownloading(false);
      return;
    }
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `worktalk-log-${date}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setDownloading(false);
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 w-80">
          <h1 className="text-base font-semibold mb-6 text-center">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-green-600 text-white rounded py-2 text-sm hover:bg-green-700"
            >
              로그인
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:underline">
              ← 채팅방으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-96">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-base font-semibold">채팅 로그 다운로드</h1>
          <button
            onClick={() => setView("login")}
            className="text-xs text-gray-400 hover:underline"
          >
            로그아웃
          </button>
        </div>

        <label className="block text-xs text-gray-600 mb-1">날짜 선택</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:border-green-500"
        />

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-green-600 text-white rounded py-2 text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {downloading ? "다운로드 중..." : `${date} 로그 JSON 다운로드`}
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          로그는 90일간 보관됩니다
        </p>
      </div>
    </div>
  );
}
