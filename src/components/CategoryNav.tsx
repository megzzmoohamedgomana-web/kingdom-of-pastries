import React from 'react';
import { useCart } from '../context/CartContext';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

// Fallback images map for the 16 standard Kingdom of Pastries categories
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  'fresh': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg',
  'zaatar': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554474-1.jpg',
  'falafel': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641972211QEuV9C.jpeg',
  'labneh': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641974495grEitv.jpeg',
  'cheese': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612553957-4.jpg',
  'spinach': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/cWiHFeiNBMXukPi4WrEI.jpeg',
  'meat': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/BncMseRdiY9uUV7n4kaX.jpg',
  'grills': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/CX6S_BtqFZ75bFAj674g.jpeg',
  'hotdog': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641972048Lyq3sg.jpeg',
  'pizza': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1642011197bduIkJ.jpeg',
  'family': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/kbtsxPCmTABRtzB5iSpe.jpg',
  'sweets': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1642067383W5gcR2.jpg',
  'drinks': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591386-2.jpg',
  'morning': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/JGekrN7u3Xfo8iO63BC4.jpeg',
  'cafeteria': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/5KP5rgTRf7XLClHojZkA.png',
  'sauces': 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/zXQo69Jw2gSQo_s2urZR.png',
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onSelectCategory }) => {
  const { categories, menuItems } = useCart();

  if (categories.length === 0) return null;

  return (
    <nav className="sticky top-[64px] z-30 bg-[#f8f9ff]/95 backdrop-blur-md shadow-xs py-2.5 px-3 overflow-x-auto no-scrollbar flex items-start gap-3 border-b border-[#e6eeff]">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        // Determine image URL: priority given to category image_url from Supabase, then default map, then first dish photo
        const firstDish = menuItems.find((m) => m.category_id === cat.id && m.image_url);
        const resolvedImage =
          cat.image_url ||
          CATEGORY_DEFAULT_IMAGES[cat.id] ||
          firstDish?.image_url ||
          'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg';

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all outline-none group cursor-pointer ${
              isActive ? 'scale-105' : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
            }`}
          >
            {/* Visual Photo Thumbnail with Active Ring */}
            <div
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-0.5 transition-all shadow-xs ${
                isActive
                  ? 'ring-2 ring-[#8d4b00] ring-offset-2 ring-offset-[#f8f9ff] bg-[#8d4b00]/10 shadow-sm'
                  : 'border border-slate-200/90 bg-white hover:border-[#8d4b00]/40'
              }`}
            >
              <img
                src={resolvedImage}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg';
                }}
                className="w-full h-full object-cover rounded-[14px]"
              />

              {cat.badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#8d4b00] text-white text-[9px] font-bold shadow-xs leading-none">
                  {cat.badge}
                </span>
              )}
            </div>

            {/* Category Name Beneath Photo */}
            <span
              className={`text-[11px] sm:text-xs font-bold text-center line-clamp-1 max-w-[70px] sm:max-w-[78px] transition-colors leading-tight ${
                isActive ? 'text-[#8d4b00]' : 'text-[#121c2a] group-hover:text-[#8d4b00]'
              }`}
              title={cat.name}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
