import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const categories = ['비품', '상온', '냉장', '냉동'];

function Realtime() {
  const { inventory, updateStock } = useInventory();
  const [selected, setSelected] = useState('냉동');

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
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">실시간 재고 현황</h2>
        <p className="text-xs text-[#a08060] mt-1">카테고리별 현재 재고를 확인해요</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="mx-4 bg-white rounded-2xl px-3 py-2 flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              selected === cat ? 'bg-[#3b2a1a] text-white' : 'text-[#a08060] hover:bg-[#fdf6ee]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 재고 테이블 */}
      <div className="mx-4 mt-3 bg-white rounded-2xl px-4 py-4">
        <div className="grid grid-cols-5 pb-2 border-b border-gray-100 mb-2">
          <span className="text-sm font-bold text-[#a08060] col-span-2">품목</span>
          <span className="text-sm font-bold text-[#a08060] text-center">현재고</span>
          <span className="text-sm font-bold text-[#a08060] text-center">안전재고</span>
          <span className="text-sm font-bold text-[#a08060] text-center">재고변동</span>
        </div>

        {inventory[selected].length === 0 ? (
          <div className="py-10 text-center text-sm text-[#a08060]">
            등록된 재고가 없어요. 상품 등록에서 추가해 주세요!
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {inventory[selected].map((item, index) => (
              <div key={index} className="grid grid-cols-5 py-2 border-b border-gray-50 last:border-0 items-center">
                <span className="text-sm text-[#1a1a1a] font-semibold col-span-2">{item.name}</span>
                <span className="text-sm font-bold text-[#3b2a1a] text-center">{item.current}</span>
                <span className="text-sm font-bold text-[#a08060] text-centenpr">{item.safe}</span>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateStock(selected, index, '+')}
                    className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 text-xs font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateStock(selected, index, '-')}
                    className="w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Realtime;