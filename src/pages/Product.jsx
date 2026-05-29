import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useInventory } from '../context/InventoryContext';

const categories = ['상온', '냉장', '냉동', '비품'];

function Product() {
  const { addProduct, loadFromExcel } = useInventory();
  const [form, setForm] = useState({
    name: '', category: '상온', current: '', safe: '', unit: '', memo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [excelLoaded, setExcelLoaded] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.current || !form.safe) {
      alert('품목명, 현재 재고, 안전 재고는 필수예요!');
      return;
    }
    addProduct(form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setForm({ name: '', category: '상온', current: '', safe: '', unit: '', memo: '' });
  };

  const handleExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      loadFromExcel(data);
      setExcelLoaded(true);
      setTimeout(() => setExcelLoaded(false), 2000);
    };
    reader.readAsBinaryString(file);
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
        <h2 className="text-lg font-extrabold text-[#3b2a1a]">상품 등록</h2>
        <p className="text-xs text-[#a08060] mt-1">엑셀로 일괄 등록하거나 직접 입력해요</p>
      </div>

      {/* 엑셀 일괄 등록 */}
      <div className="mx-4 bg-[#fdf6ee] rounded-2xl px-5 py-4 mb-3">
        <p className="text-sm font-bold text-[#3b2a1a] mb-1">📂 엑셀 일괄 등록</p>
        <p className="text-xs text-[#a08060] mb-3">category, name, current_stock, safety_stock, unit 컬럼이 있는 엑셀 파일을 올려주세요</p>
        <label className="cursor-pointer">
          <div className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl text-center">
            {excelLoaded ? '✅ 일괄 등록 완료!' : '📂 엑셀 파일 업로드'}
          </div>
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
        </label>
      </div>

      {/* 직접 등록 폼 */}
      <div className="mx-4 bg-white rounded-2xl px-5 py-5 flex flex-col gap-4">
        <p className="text-sm font-bold text-[#3b2a1a]">✏️ 직접 등록</p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-[#3b2a1a]">품목명 <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="예) 바닐라 시럽"
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3b2a1a]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-[#3b2a1a]">카테고리 <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`py-2 rounded-xl text-sm font-bold transition-all ${
                  form.category === cat ? 'bg-[#3b2a1a] text-white' : 'bg-gray-100 text-[#a08060]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[#3b2a1a]">현재 재고 <span className="text-red-400">*</span></label>
            <input
              type="number"
              name="current"
              value={form.current}
              onChange={handleChange}
              placeholder="0"
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3b2a1a]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[#3b2a1a]">안전 재고 <span className="text-red-400">*</span></label>
            <input
              type="number"
              name="safe"
              value={form.safe}
              onChange={handleChange}
              placeholder="0"
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3b2a1a]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-[#3b2a1a]">단위</label>
          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="예) 개, 박스, 팩, kg"
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#3b2a1a]"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-[#3b2a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#5a3e28] transition-all"
        >
          {submitted ? '✅ 등록 완료!' : '상품 등록하기'}
        </button>
      </div>
    </div>
  );
}

export default Product;