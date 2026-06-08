"use client";

import { useState } from "react";
import { useAnonymousSession } from "@/hooks/useAnonymousSession";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import SpreadsheetBackground from "./SpreadsheetBackground";
import ExcelToolbar from "./ExcelToolbar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import CreateRoomModal from "./CreateRoomModal";

interface Props {
  roomId: string;
  showCreateRoom?: boolean;
}

// 메시지마다 안정적인 랜덤 위치 생성 (id 기반 시드)
function getPosition(id: string): { top: string; left: string } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const top = 10 + (Math.abs(hash) % 60);
  const left = 5 + (Math.abs(hash >> 8) % 75);
  return { top: `${top}%`, left: `${left}%` };
}

export default function ChatRoom({ roomId, showCreateRoom = false }: Props) {
  const session = useAnonymousSession();
  const messages = useRealtimeMessages(roomId);
  const [showModal, setShowModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleSend = async (content: string) => {
    if (!session) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, nickname: session.nickname, content }),
    });
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code) window.location.href = `/room/${code}`;
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <ExcelToolbar nickname={session?.nickname ?? "..."} />

      {/* 채팅 영역 */}
      <div className="relative flex-1 overflow-hidden">
        <SpreadsheetBackground />

        {/* 메시지 말풍선 */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            nickname={msg.nickname}
            content={msg.content}
            isMine={session?.nickname === msg.nickname}
            style={getPosition(msg.id)}
          />
        ))}

        {/* 방 생성/입장 버튼 (공개방에서만) */}
        {showCreateRoom && (
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 items-end">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-green-700"
            >
              + 익명 방 만들기
            </button>
            <div className="flex gap-1">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="초대코드 입력"
                maxLength={6}
                className="border border-gray-400 rounded px-2 py-1 text-xs text-gray-900 placeholder:text-gray-500 w-28 font-mono uppercase bg-white"
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
              <button
                onClick={handleJoin}
                className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded hover:bg-gray-800"
              >
                입장
              </button>
            </div>
          </div>
        )}

        {/* 나가기 버튼 (비공개 방에서만) */}
        {!showCreateRoom && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => window.location.href = "/"}
              className="bg-white border border-gray-400 text-gray-700 text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-100"
            >
              ← 나가기
            </button>
          </div>
        )}
      </div>

      <MessageInput onSend={handleSend} />

      {showModal && <CreateRoomModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
