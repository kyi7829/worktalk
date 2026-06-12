"use client";

import { useRef, useState } from "react";

interface Props {
  onSend: (content: string) => Promise<void>;
}

export default function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || sending) return;
    setSending(true);
    try {
      await onSend(value.trim());
      setValue("");
    } finally {
      setSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <div className="border-t border-gray-300 bg-white px-4 py-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX))}
            placeholder="메시지를 입력하세요... (기록에 남지 않습니다)"
            className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-green-500"
            readOnly={sending}
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || sending}
          className="bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded disabled:opacity-40 hover:bg-green-700"
        >
          전송
        </button>
      </form>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>휘발성 메시지 · 저장되지 않음</span>
        <span>{value.length}/{MAX}</span>
      </div>
    </div>
  );
}
