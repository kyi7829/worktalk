"use client";

const COLS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function SpreadsheetBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 열 헤더 */}
      <div className="flex border-b border-gray-300 bg-gray-100" style={{ marginLeft: 40 }}>
        {COLS.map((col) => (
          <div
            key={col}
            className="border-r border-gray-300 text-center text-xs text-gray-600 font-medium py-0.5"
            style={{ width: 96 }}
          >
            {col}
          </div>
        ))}
      </div>
      {/* 행 */}
      {ROWS.map((row) => (
        <div key={row} className="flex border-b border-gray-200" style={{ height: 20 }}>
          {/* 행 번호 */}
          <div
            className="bg-gray-100 border-r border-gray-300 text-right text-xs text-gray-500 pr-1 flex items-center justify-end shrink-0"
            style={{ width: 40, minWidth: 40 }}
          >
            {row}
          </div>
          {/* 셀들 */}
          {COLS.map((col) => (
            <div
              key={col}
              className="border-r border-gray-200"
              style={{ width: 96 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
