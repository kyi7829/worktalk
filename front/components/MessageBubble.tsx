"use client";

interface Props {
  nickname: string;
  content: string;
  isMine: boolean;
  style?: React.CSSProperties;
}

export default function MessageBubble({ nickname, content, isMine, style }: Props) {
  return (
    <div
      className="absolute max-w-48 z-10"
      style={style}
    >
      <div
        className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
          isMine
            ? "bg-green-500 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        <div className="text-[10px] font-semibold mb-0.5 opacity-70">{nickname}</div>
        <div className="break-words">{content}</div>
      </div>
    </div>
  );
}
