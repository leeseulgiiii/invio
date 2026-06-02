import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useInventory } from '../context/InventoryContext';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const CATEGORIES = ['상온', '냉장', '냉동', '비품'];

function Scanner() {

  const { inventory, bulkAddStock } = useInventory();
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImageBase64(reader.result.split(',')[1]);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt =  `이 거래 명세서 이미지를 분석해서 품목명과 수량을 JSON 배열로만 반환해줘.
다른 설명 없이 JSON만 반환해야 해.
형식: [{"name": "품목명", "quantity": 수량, "unit": "단위"}]
품목명은 띄어쓰기 없이 붙여서 반환해줘. (예: "우유", "원두", "냉동딸기")
단위는 개, 팩, 박스, 병, kg 중에서 선택해줘.
수량은 숫자로만 반환해줘.`;

      const res = await model.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      ]);

      const text = res.response.text();
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      const allItems = Object.values(inventory).flat();
      const enriched = parsed.map((item) => {
        const exists = allItems.find((inv) => inv.name === item.name);
        const existingCategory = exists
          ? Object.keys(inventory).find((cat) =>
              inventory[cat].some((i) => i.name === item.name)
            )
          : null;
        return {
          ...item,
          isNew: !exists,
          category: existingCategory || '상온',
          safeStock: '',
          showDropdown: false,
        };
      });

      setResult(enriched);
    } catch (err) {
      setError('분석에 실패했어요. 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCategoryChange = (index, category) => {
    setResult((prev) =>
      prev.map((item, i) => (i === index ? { ...item, category } : item))
    );
  };

  const handleSafeStockChange = (index, value) => {
    setResult((prev) =>
      prev.map((item, i) => (i === index ? { ...item, safeStock: value } : item))
    );
  };

  const toggleDropdown = (index) => {
    setResult((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, showDropdown: !item.showDropdown }
          : { ...item, showDropdown: false }
      )
    );
  };

  const handleApply = () => {
    if (!result) return;

    const items = result.map((item) => ({
      category: item.category,
      name: item.name.replace(/\s+/g, '').trim(), // 띄어쓰기 제거해서 통일
      qty: item.quantity,
    }));

    bulkAddStock(items);
    alert('재고에 반영됐어요!');
    setImage(null);
    setImageBase64(null);
    setResult(null);
  };

  const handleReset = () => {
    setImage(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">

      {/* 헤더 */}
      <div className="bg-white px-5 pt-10 pb-4 flex items-center justify-center border-b border-gray-100 relative">
        <button className="absolute left-5 text-gray-400 text-xl">←</button>
        <span className="text-base font-bold text-[#1a1a1a]">AI 명세서 분석</span>
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
          <label className="cursor-pointer">
            <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-[#c8b89a] hover:bg-[#fdf6ee] transition-all">
              <span className="text-4xl">📷</span>
              <span className="text-sm font-bold text-[#3b2a1a]">사진 촬영</span>
              <span className="text-xs text-[#a08060]">카메라로 찍기</span>
            </div>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImage} />
          </label>
          <label className="cursor-pointer">
            <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-[#c8b89a] hover:bg-[#fdf6ee] transition-all">
              <span className="text-4xl">🖼️</span>
              <span className="text-sm font-bold text-[#3b2a1a]">사진 선택</span>
              <span className="text-xs text-[#a08060]">갤러리에서 선택</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </div>
      )}

      {/* 분석 버튼 */}
      {image && !result && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#5a3e28] transition-all disabled:opacity-50"
          >
            {analyzing ? '🤖 AI 분석 중...' : '🤖 AI 분석 시작'}
          </button>
        </div>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="mx-4 mt-3 bg-red-50 rounded-2xl px-5 py-3">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        </div>
      )}

      {/* 분석 결과 */}
      {result && (
        <div className="mx-4 mt-4 bg-white rounded-2xl px-5 py-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#3b2a1a]">분석 결과</span>
            <span className="text-xs text-green-500 font-semibold">✅ 분석 완료</span>
          </div>

          <div className="bg-[#fdf6ee] rounded-xl px-3 py-2 mb-3">
            <p className="text-xs text-[#a08060]">🆕 신규 품목은 카테고리와 안전재고를 설정해 주세요</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {result.map((item, index) => (
              <div key={index} className="border-b border-gray-50 pb-3 last:border-0">

                {/* 품목명 + 수량 */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#3b2a1a] font-semibold">{item.name}</span>
                    {item.isNew ? (
                      <span className="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full font-bold">🆕 신규</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-500 px-2 py-0.5 rounded-full font-bold">✅ 기존</span>
                    )}
                  </div>
                  <span className="text-xs text-blue-500 font-bold">+{item.quantity} {item.unit}</span>
                </div>

                {/* 카테고리 드롭다운 + 안전재고 */}
                <div className="flex gap-2 items-center">

                  {/* 카테고리 드롭다운 */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#3b2a1a] font-semibold"
                    >
                      <span>{item.category || '분류'}</span>
                      <span className="text-gray-400 text-xs">▼</span>
                    </button>
                    {item.showDropdown && (
                      <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              handleCategoryChange(index, cat);
                              toggleDropdown(index);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-[#fdf6ee] transition-all ${
                              item.category === cat
                                ? 'text-[#3b2a1a] bg-[#fdf6ee]'
                                : 'text-gray-500'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 안전재고 입력 */}
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-xs text-[#a08060]">안전재고</span>
                    <input
                      type="number"
                      value={item.safeStock}
                      onChange={(e) => handleSafeStockChange(index, e.target.value)}
                      placeholder="0"
                      className="w-12 text-sm font-bold text-[#3b2a1a] bg-transparent text-center focus:outline-none"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#5a3e28] transition-all"
          >
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
            <li>• 신규 품목은 카테고리를 직접 선택할 수 있어요</li>
          </ul>
        </div>
      )}

    </div>
  );
}

export default Scanner;

//test