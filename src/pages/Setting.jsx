import { useState } from 'react'

function Setting() {
  const [storeName, setStoreName] = useState('INVIO 카페')
  const [alarm, setAlarm] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="bg-white px-5 pt-10 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">설정</h2>
        <p className="text-xs text-[#a08060] mt-1">앱 환경을 설정하세요</p>
      </div>

      <div className="mx-4 mt-4 flex flex-col gap-3">

        {/* 매장 정보 */}
        <div className="bg-white rounded-2xl px-5 py-4">
          <p className="text-xs font-bold text-[#a08060] mb-3">매장 정보</p>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">매장 이름</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#a08060]"
            />
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-3">
         <p className="text-xs font-bold text-[#a08060]">알림 설정</p>
         <div className="flex items-center justify-between">
            <span className="text-sm text-[#1a1a1a]">부족 재고 알림</span>
            <button
              onClick={() => setAlarm(!alarm)}
              className={`w-11 h-6 rounded-full transition-colors ${alarm ? 'bg-[#3b2a1a]' : 'bg-gray-200'}`}
            >
             <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${alarm ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* 화면 설정 */}
        <div className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-3">
          <p className="text-xs font-bold text-[#a08060]">화면 설정</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#1a1a1a]">다크모드</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#3b2a1a]' : 'bg-gray-200'}`}
            >
             <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
           </button>
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-3">
          <p className="text-xs font-bold text-[#a08060]">앱 정보</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">버전</span>
            <span className="font-semibold">v1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">개발</span>
            <span className="font-semibold">INVIO</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Setting