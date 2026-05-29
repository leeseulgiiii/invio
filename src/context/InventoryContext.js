import { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState({
    비품: [],
    상온: [],
    냉장: [],
    냉동: [],
  });

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

  const updateStock = (category, index, type) => {
    setInventory((prev) => {
      const updated = [...prev[category]];
      if (type === '+') {
        updated[index] = { ...updated[index], current: updated[index].current + 1 };
      } else {
        updated[index] = { ...updated[index], current: Math.max(0, updated[index].current - 1) };
      }
      return { ...prev, [category]: updated };
    });
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

  return (
    <InventoryContext.Provider value={{ inventory, loadFromExcel, updateStock, addProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}