import React from 'react';
import { useCart } from '../context/CartContext';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onSelectCategory }) => {
  const { categories } = useCart();

  if (categories.length === 0) return null;

  return (
    <nav className="sticky top-[64px] z-30 bg-[#f8f9ff]/95 backdrop-blur-md shadow-sm py-2 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-[#e6eeff]">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#8d4b00] text-white font-bold shadow-sm scale-[1.02]'
                : 'bg-white text-[#554336] hover:text-[#121c2a] shadow-sm hover:bg-[#eff4ff]'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
};
