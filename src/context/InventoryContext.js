import { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : { 비품: [], 상온: [], 냉장: [], 냉동: [] };
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('logs');
    return saved ? JSON.parse(saved) : [];
  });

  // 임시 변동값 저장 { '냉장-우유': -3, '상온-원두': +1 }
  const [pending, setPending] = useState({});

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (type, itemName, qty, category) => {
    const newLog = {
      id: `${Date.now()}-${Math.random()}`,  // 고유 id
      ts: new Date().toISOString(),
      type,
      itemName,
      qty,
      category,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // +/- 누를 때 pending에만 기록
  const updatePending = (category, index, type) => {
    const item = inventory[category][index];
    const key = `${category}-${item.name}`;
    setPending((prev) => ({
      ...prev,
      [key]: {
        category,
        index,
        name: item.name,
        delta: (prev[key]?.delta ?? 0) + (type === '+' ? 1 : -1),
      },
    }));
  };

  // 등록 버튼 누를 때 실제 반영
const commitChanges = () => {
  if (Object.keys(pending).length === 0) return;

  const changes = Object.values(pending);

  // 재고 업데이트
  setInventory((prev) => {
    const updated = { ...prev };
    changes.forEach(({ category, index, delta }) => {
      const items = [...updated[category]];
      items[index] = {
        ...items[index],
        current: Math.max(0, items[index].current + delta),
      };
      updated[category] = items;
    });
    return updated;
  });

  // 로그 추가 (setInventory 밖에서 따로)
  changes.forEach(({ category, name, delta }) => {
    if (delta !== 0) {
      addLog(delta > 0 ? 'IN' : 'USE', name, Math.abs(delta), category);
    }
  });

  setPending({});
};

  const loadFromExcel = (data) => {
    const grouped = { 비품: [], 상온: [], 냉장: [], 냉동: [] };
    data.forEach((row) => {
      const cat = row.category;
      if (grouped[cat]) {
        grouped[cat].push({
          name: row.name,
          current: row.current_stock,
          safe: row.safety_stock,
          unit: row.unit,
        });
      }
    });
    setInventory(grouped);
  };

  const addProduct = (product) => {
    setInventory((prev) => {
      const updated = [...(prev[product.category] || [])];
      updated.push({
        name: product.name,
        current: Number(product.current),
        safe: Number(product.safe),
        unit: product.unit,
      });
      return { ...prev, [product.category]: updated };
    });
  };

  const bulkAddStock = (items) => {
    items.forEach(({ category, name, qty }) => {
      setInventory((prev) => {
        const updated = [...(prev[category] || [])];
        const idx = updated.findIndex((i) => i.name === name);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], current: updated[idx].current + qty };
        }
        return { ...prev, [category]: updated };
      });
      addLog('IN', name, qty, category);
    });
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      logs,
      pending,
      loadFromExcel,
      updatePending,
      commitChanges,
      addProduct,
      bulkAddStock,
      addLog,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}