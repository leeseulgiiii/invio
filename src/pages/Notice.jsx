import { useState } from 'react'

function Notice() {
  const notices = [
    { id: 1, title: '재고 관리 시스템 오픈 안내', date: '2026.06.01', content: 'INVIO 재고 관리 시스템이 오픈되었습니다. 많은 이용 부탁드립니다.' },
    { id: 2, title: '우유 발주 예정 안내', date: '2026.05.30', content: '이번 주 금요일 우유 발주 예정입니다. 재고 확인 부탁드립니다.' },
    { id: 3, title: '마감 재고 정리 방법 변경', date: '2026.05.28', content: '마감 시 재고 정리 방법이 변경되었습니다. 앱에서 직접 입력해주세요.' },
  ]

  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="bg-white px-5 pt-10 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">공지사항</h2>
        <p className="text-xs text-[#a08060] mt-1">사장님이 남긴 공지를 확인하세요</p>
      </div>

      <div className="mx-4 mt-4 flex flex-col gap-3">
        {notices.map((n) => (
          <div
            key={n.id}
            onClick={() => setSelected(selected?.id === n.id ? null : n)}
            className="bg-white rounded-2xl px-5 py-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1a1a1a]">{n.title}</span>
              <span className="text-xs text-gray-400">{n.date}</span>
            </div>
            {selected?.id === n.id && (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{n.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notice