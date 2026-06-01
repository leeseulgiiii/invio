import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

function Manage() {
  const { logs } = useInventory();
  const [filter, setFilter] = useState('전체');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  });

  const prevDay = () => {
    const d = new Date(date.year, date.month - 1, date.day - 1);
    setDate({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
  };

  const nextDay = () => {
    const d = new Date(date.year, date.month - 1, date.day + 1);
    setDate({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
  };

  // 선택한 날짜 + 필터로 로그 필터링
  const filteredLogs = logs.filter((log) => {
    const d = new Date(log.ts);
    const matchDate =
      d.getFullYear() === date.year &&
      d.getMonth() + 1 === date.month &&
      d.getDate() === date.day;
    const matchFilter =
      filter === '전체' ||
      (filter === '입고' && log.type === 'IN') ||
      (filter === '출고' && log.type === 'USE');
    return matchDate && matchFilter;
  });

  const totalIn = logs.filter((l) => {
    const d = new Date(l.ts);
    return d.getFullYear() === date.year && d.getMonth() + 1 === date.month && d.getDate() === date.day && l.type === 'IN';
  }).length;

  const totalOut = logs.filter((l) => {
    const d = new Date(l.ts);
    return d.getFullYear() === date.year && d.getMonth() + 1 === date.month && d.getDate() === date.day && l.type === 'USE';
  }).length;

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
        <button onClick={prevDay} className="text-[#3b2a1a] text-lg font-bold px-2">←</button>
        <div className="flex items-center gap-2">
          <span className="text-sm">📅</span>
          <span className="text-sm font-bold text-[#3b2a1a]">
            {date.year} - {String(date.month).padStart(2, '0')} - {String(date.day).padStart(2, '0')}
          </span>
        </div>
        <button onClick={nextDay} className="text-[#3b2a1a] text-lg font-bold px-2">→</button>
      </div>

      {/* 요약 카드 */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
          <span className="text-xs text-blue-400 font-semibold">총 입고</span>
          <span className="text-2xl font-extrabold text-blue-500">+{totalIn}건</span>
        </div>
        <div className="bg-red-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
          <span className="text-xs text-red-400 font-semibold">총 출고</span>
          <span className="text-2xl font-extrabold text-red-500">-{totalOut}건</span>
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="mx-4 mt-3 flex gap-2">
        {['전체', '입고', '출고'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === f
                ? f === '입고'
                  ? 'bg-blue-500 text-white'
                  : f === '출고'
                  ? 'bg-red-500 text-white'
                  : 'bg-[#3b2a1a] text-white'
                : 'bg-white text-[#a08060] border border-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 재고 목록 */}
      <div className="mx-4 mt-3 bg-white rounded-2xl px-5 py-4">
        <div className="grid grid-cols-3 pb-2 border-b border-gray-100 mb-2">
          <span className="text-sm font-bold text-[#a08060]">구분</span>
          <span className="text-sm font-bold text-[#a08060] text-center">품목</span>
          <span className="text-sm font-bold text-[#a08060] text-right">변동</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <span className="text-3xl">📦</span>
            <p className="text-sm font-semibold text-[#a08060]">오늘의 입출고가 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="grid grid-cols-3 py-2 border-b border-gray-50 last:border-0 items-center">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                  log.type === 'IN' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                }`}>
                  {log.type === 'IN' ? '입고' : '출고'}
                </span>
                <span className="text-sm text-[#1a1a1a] font-semibold text-center">{log.itemName}</span>
                <span className={`text-sm font-bold text-right ${
                  log.type === 'IN' ? 'text-blue-500' : 'text-red-500'
                }`}>
                  {log.type === 'IN' ? `+${log.qty}` : `-${log.qty}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Manage;