"use client";

interface Props {
  nickname: string;
}

export default function ExcelToolbar({ nickname }: Props) {
  return (
    <div className="shrink-0">
      {/* 제목 표시줄 */}
      <div className="bg-green-700 text-white text-xs px-3 py-0.5 flex justify-between items-center">
        <span className="font-semibold">Workplace Data Analysis.xlsx</span>
        <span className="opacity-80">나: {nickname}</span>
      </div>
      {/* 메뉴 바 */}
      <div className="bg-white border-b border-gray-300 flex items-center gap-4 px-3 py-0.5 text-xs text-gray-700">
        {["파일","홈","삽입","데이터","검토","보기"].map((m) => (
          <span key={m} className="hover:bg-gray-100 px-2 py-0.5 rounded cursor-default">{m}</span>
        ))}
      </div>
      {/* 수식 입력줄 */}
      <div className="bg-white border-b border-gray-300 flex items-center gap-2 px-2 py-0.5 text-xs">
        <span className="text-gray-500 w-12 text-center border border-gray-200 px-1">A1</span>
        <span className="text-gray-300">fx</span>
        <span className="flex-1 text-gray-400">채팅중...</span>
      </div>
    </div>
  );
}
