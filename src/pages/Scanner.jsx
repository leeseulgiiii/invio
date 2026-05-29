import { useState } from 'react';

function Scanner() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleCamera = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGallery = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult([
        { name: '바닐라 시럽', amount: '2팩' },
        { name: '원두', amount: '1박스' },
        { name: '오트밀크', amount: '3개' },
      ]);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setAnalyzing(false);
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
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">명세서 등록</h2>
        <p className="text-xs text-[#a08060] mt-1">사진을 촬영하거나 갤러리에서 선택해 주세요</p>
      </div>

      {/* 이미지 미리보기 */}
      {image && (
        <div className="mx-4 mt-2 bg-white rounded-2xl p-3 relative">
          <img src={image} alt="명세서" className="w-full h-56 object-contain rounded-xl" />
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded-full"
          >
            다시 찍기
          </button>
        </div>
      )}

      {/* 버튼 2개 */}
      {!image && (
        <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
          {/* 사진 촬영 */}
          <label className="cursor-pointer">
            <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-[#c8b89a] hover:bg-[#fdf6ee] transition-all">
              <span className="text-4xl">📷</span>
              <span className="text-sm font-bold text-[#3b2a1a]">사진 촬영</span>
              <span className="text-xs text-[#a08060]">카메라로 찍기</span>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCamera}
            />
          </label>

          {/* 사진 선택 */}
          <label className="cursor-pointer">
            <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-[#c8b89a] hover:bg-[#fdf6ee] transition-all">
              <span className="text-4xl">🖼️</span>
              <span className="text-sm font-bold text-[#3b2a1a]">사진 선택</span>
              <span className="text-xs text-[#a08060]">갤러리에서 선택</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGallery}
            />
          </label>
        </div>
      )}

      {/* 분석 버튼 */}
      {image && !result && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#5a3e28] transition-all"
          >
            {analyzing ? '🤖 AI 분석 중...' : '🤖 AI 분석 시작'}
          </button>
        </div>
      )}

      {/* 분석 결과 */}
      {result && (
        <div className="mx-4 mt-4 bg-white rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#3b2a1a]">분석 결과</span>
            <span className="text-xs text-green-500 font-semibold">✅ 분석 완료</span>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {result.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-[#3b2a1a] font-semibold">{item.name}</span>
                <span className="text-xs text-blue-500 font-bold">+{item.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#5a3e28] transition-all">
            재고에 반영하기
          </button>
        </div>
      )}

      {/* 이용 안내 */}
      {!image && (
        <div className="mx-4 mt-4 bg-[#fdf6ee] rounded-2xl px-5 py-4 mb-4">
          <p className="text-sm font-bold text-[#3b2a1a] mb-2">📌 이용 안내</p>
          <ul className="text-xs text-[#a08060] flex flex-col gap-1">
            <li>• 명세서가 잘 보이도록 평평하게 놓고 촬영해 주세요</li>
            <li>• AI가 품목명과 수량을 자동으로 인식해요</li>
            <li>• 분석 후 직접 수정도 가능해요</li>
          </ul>
        </div>
      )}

    </div>
  );
}

export default Scanner;