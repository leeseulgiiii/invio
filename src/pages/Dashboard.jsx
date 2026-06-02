import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: '🤖', label: 'AI 명세서 분석', path: '/scanner' },
  { icon: '📦', label: '재고 관리', path: '/manage' },
  { icon: '📊', label: '데이터 분석', path: '/graph' },
  { icon: '🔴', label: '실시간 재고', path: '/realtime' },
  { icon: '🏷️', label: '상품 등록', path: '/product' },
  { icon: '📢', label: '공지사항', path: '/notice' },
  { icon: '⚙️', label: '설정', path: '/setting' },
];

function Dashboard() {
  const navigate = useNavigate();
  const { inventory, logs } = useInventory();
  const totalItems = Object.values(inventory).flat().length;
  const lowItems = Object.values(inventory).flat().filter((i) => i.current < i.safe).length;
  const today = new Date();
  const todayLogs = logs.filter((log) => {
    const d = new Date(log.ts);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const todayIn = todayLogs.filter((l) => l.type === 'IN');
  const todayOut = todayLogs.filter((l) => l.type === 'USE');
  const todayInQty = todayIn.reduce((sum, l) => sum + l.qty, 0);
  const todayOutQty = todayOut.reduce((sum, l) => sum + l.qty, 0);

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

      {/* 메뉴 그리드 */}
      <div className="bg-white px-5 py-4 mt-2">
        <div className="grid grid-cols-4 gap-4">
          {menuItems.map((menu, index) => (
            <button
              key={index}
              onClick={() => navigate(menu.path)}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-[#f0f4ff] rounded-2xl flex items-center justify-center text-2xl">
                {menu.icon}
              </div>
              <span className="text-xs text-gray-600 text-center">{menu.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 배너 */}
      <div className="mx-4 mt-3 bg-[#e8f0fe] rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">실시간 재고 확인</p>
          <p className="text-sm font-bold text-[#1a1a1a] mt-0.5">
            <span className="text-blue-500">AI 명세서 분석</span>으로 재고 등록
          </p>
        </div>
        <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xs font-bold">
          AI
        </div>
      </div>

      {/* 재고 현황 */}
<Link 
  to="/manage" 
  className="block bg-white mx-4 mt-3 rounded-2xl px-5 py-4 cursor-pointer hover:shadow-sm transition-shadow"
>
  <div className="flex items-center justify-between mb-1">
    <span className="text-sm font-bold text-[#1a1a1a]">재고 현황 &gt;</span>
    <span className="text-xs text-gray-400">실시간 기준</span>
  </div>
  
  <p className="text-4xl font-extrabold text-[#1a1a1a] my-3">{totalItems}개</p>
  
  <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">전체 품목</span>
      <span className="font-semibold">{totalItems}개</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">부족 재고</span>
      <span className={`font-semibold ${lowItems > 0 ? 'text-red-500' : 'text-gray-800'}`}>
        {lowItems}개
      </span>
    </div>
  </div>
</Link>

{/* 오늘 입출고 요약 */}
<div className="bg-white mx-4 mt-3 rounded-2xl px-5 py-4">
  <div className="flex items-center justify-between mb-3">
    <span className="text-sm font-bold text-[#1a1a1a]">오늘 입출고 요약</span>
    <span className="text-xs text-gray-400">오늘 기준</span>
  </div>
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-blue-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-blue-400 font-semibold">입고</span>
      <span className="text-2xl font-extrabold text-blue-500">{todayIn.length}건</span>
      <span className="text-xs text-gray-400">총 {todayInQty}개 항목</span>
    </div>
    <div className="bg-red-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-red-400 font-semibold">출고</span>
      <span className="text-2xl font-extrabold text-red-500">{todayOut.length}건</span>
      <span className="text-xs text-gray-400">총 {todayOutQty}개 항목</span>
    </div>
  </div>
</div>

{/* 재고 회전율 요약 */}
<div className="bg-white mx-4 mt-3 rounded-2xl px-5 py-4 mb-4">
  <div className="flex items-center justify-between mb-3">
    <span className="text-sm font-bold text-[#1a1a1a]">재고 회전율 요약</span>
    <span className="text-xs text-gray-400">이번 주 기준</span>
  </div>
  <div className="flex flex-col gap-3">
    {[
      { rank: 1, name: '원두', rate: '92%', width: '92%' },
      { rank: 2, name: '오트밀크', rate: '74%', width: '74%' },
      { rank: 3, name: '바닐라 시럽', rate: '61%', width: '61%' },
      { rank: 4, name: '일회용 컵', rate: '45%', width: '45%' },
      { rank: 5, name: '카라멜 소스', rate: '30%', width: '30%' },
    ].map((item) => (
      <div key={item.rank} className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400 w-4">{item.rank}</span>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-[#1a1a1a]">{item.name}</span>
            <span className="text-xs text-blue-500 font-bold">{item.rate}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div style={{ width: item.width }} className="bg-blue-500 h-2 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}

export default Dashboard;