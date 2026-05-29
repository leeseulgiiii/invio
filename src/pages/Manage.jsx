import { useState } from 'react';

const inventoryData = [
  { category: '상온', name: '원두', change: -2 },
  { category: '냉장', name: '우유', change: -10 },
  { category: '상온', name: '바닐라파우더', change: -1 },
  { category: '비품', name: '플라스틱 컵', change: -2 },
  { category: '냉장', name: '오트밀크', change: +5 },
  { category: '상온', name: '카라멜 소스', change: -3 },
  { category: '냉장', name: '생크림', change: +10 },
  { category: '비품', name: '종이 빨대', change: -20 },
  { category: '상온', name: '초코 파우더', change: +3 },
  { category: '냉장', name: '딸기 시럽', change: -4 },
  { category: '비품', name: '테이크아웃 컵', change: +15 },
  { category: '상온', name: '헤이즐넛 시럽', change: -2 },
];
const totalIn = inventoryData.filter((item) => item.change > 0).length;
const totalOut = inventoryData.filter((item) => item.change < 0).length;

function Manage() {
  const [date, setDate] = useState({ year: 2026, month: 6, day: 1 });

  const prevDay = () => {
    setDate((prev) => ({ ...prev, day: prev.day - 1 }));
  };

  const nextDay = () => {
    setDate((prev) => ({ ...prev, day: prev.day + 1 }));
  };

  const categoryIcon = (category) => {
    switch (category) {
      case '상온': return '🌡️';
      case '냉장': return '❄️';
      case '비품': return '🧹';
      default: return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">

      {/* 헤더 */}
      <div className="bg-white px-5 pt-10 pb-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#1a1a1a]">INVIO 카페</span>
          <span className="text-gray-400 text-sm">▼</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="text-xs text-red-500 font-semibold">영업 마감</span>
        </div>
      </div>

      {/* 타이틀 */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">재고 변동 내역</h2>
        <p className="text-xs text-[#a08060] mt-1">날짜별 재고 입출고 현황을 확인해요</p>
      </div>

      {/* 날짜 선택 */}
      <div className="mx-4 bg-white rounded-2xl px-5 py-3 flex items-center justify-between">
        <button
          onClick={prevDay}
          className="text-[#3b2a1a] text-lg font-bold px-2"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span className="text-sm font-bold text-[#3b2a1a]">
            {date.year} - {String(date.month).padStart(2, '0')} - {String(date.day).padStart(2, '0')}
          </span>
        </div>
        <button
          onClick={nextDay}
          className="text-[#3b2a1a] text-lg font-bold px-2"
        >
          →
        </button>
      </div>

      {/* 요약 카드 */}
<div className="mx-4 mt-3 grid grid-cols-2 gap-3">
  <div className="bg-blue-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
    <span className="text-xs text-blue-400 font-semibold">총 입고</span>
    <span className="text-2xl font-extrabold text-blue-500">+{totalIn}개</span>
  </div>
  <div className="bg-red-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
    <span className="text-xs text-red-400 font-semibold">총 출고</span>
    <span className="text-2xl font-extrabold text-red-500">-{totalOut}개</span>
  </div>
</div>

      {/* 재고 목록 */}
      <div className="mx-4 mt-3 bg-white rounded-2xl px-5 py-4">
       <div className="grid grid-cols-3 pb-2 border-b border-gray-100 mb-2">
  <span className="text-lg font-bold text-[#a08060]">분류</span>
  <span className="text-lg font-bold text-[#a08060] text-center">품목</span>
  <span className="text-lg font-bold text-[#a08060] text-right">재고 변동</span>
</div>

        <div className="flex flex-col gap-2">
  {inventoryData.map((item, index) => (
    <div key={index} className="grid grid-cols-3 py-2 border-b border-gray-50 last:border-0 items-center">
      <span className="text-lg text-[#3b2a1a] font-semibold">{item.category}</span>
      <span className="text-lg text-[#1a1a1a] font-semibold text-center">{item.name}</span>
      <span className={`text-lg font-bold text-right ${item.change < 0 ? 'text-red-500' : 'text-blue-500'}`}>
        {item.change > 0 ? `+${item.change}` : item.change}
      </span>
    </div>
  ))}
</div>
      </div>

    </div>
  );
}

export default Manage;