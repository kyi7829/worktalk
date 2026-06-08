"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RoomDuration, MsgDuration } from "@/types";

interface Props {
  onClose: () => void;
}

export default function CreateRoomModal({ onClose }: Props) {
  const router = useRouter();
  const [roomTtl, setRoomTtl] = useState<RoomDuration>(3600);
  const [msgTtl, setMsgTtl] = useState<MsgDuration>(10);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomTtl, msgTtl }),
    });
    const { room } = await res.json();
    setCode(room.code);
    setLoading(false);
  };

  const handleEnter = () => {
    if (code) router.push(`/room/${code}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-80">
        <h2 className="text-base font-semibold text-gray-900 mb-4">익명 방 만들기</h2>

        {!code ? (
          <>
            <label className="block text-xs font-medium text-gray-700 mb-1">방 유지 시간</label>
            <select
              value={roomTtl}
              onChange={(e) => setRoomTtl(Number(e.target.value) as RoomDuration)}
              className="w-full border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white mb-3"
            >
              <option value={3600}>1시간</option>
              <option value={14400}>4시간</option>
              <option value={86400}>24시간</option>
            </select>

            <label className="block text-xs font-medium text-gray-700 mb-1">메시지 유지 시간</label>
            <select
              value={msgTtl}
              onChange={(e) => setMsgTtl(Number(e.target.value) as MsgDuration)}
              className="w-full border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white mb-4"
            >
              <option value={5}>5초</option>
              <option value={10}>10초</option>
              <option value={30}>30초</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-400 rounded px-3 py-1.5 text-sm text-gray-700 font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 bg-green-600 text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "생성 중..." : "방 만들기"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-600 font-medium mb-1">초대코드</p>
            <div
              className="bg-gray-100 rounded text-center font-mono text-2xl font-bold tracking-widest py-3 mb-3 cursor-pointer hover:bg-gray-200 text-gray-900"
              onClick={() => navigator.clipboard.writeText(code)}
              title="클릭하여 복사"
            >
              {code}
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">클릭하면 클립보드에 복사됩니다</p>
            <button
              onClick={handleEnter}
              className="w-full bg-green-600 text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-green-700"
            >
              방에 입장하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
