import React, { useState } from 'react';
import { MenuItem, ItemSize } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);

  // Active selected size if item has sizes
  const defaultSize = item.has_sizes && item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined;
  const [selectedSize, setSelectedSize] = useState<ItemSize | undefined>(defaultSize);

  const cartKey = selectedSize ? `${item.id}-${selectedSize.name}` : item.id;
  const cartEntry = cart[cartKey];
  const quantity = cartEntry ? cartEntry.quantity : 0;
  const isFamilyBox = item.is_family_box;
  const isAvailable = item.is_available !== false;
  const currentPrice = selectedSize ? selectedSize.price : item.price;
  const displayImage = item.image_url || (item as any).imageUrl || '';

  // Render Big Box / Family presentation
  if (isFamilyBox) {
    return (
      <article
        className={`food-item bg-white rounded-xl p-3.5 shadow-[0_2px_8px_rgba(180,130,80,0.08)] border transition-all ${
          isAvailable ? 'border-slate-100/80 active:scale-[0.995]' : 'border-slate-200 opacity-75'
        }`}
        data-id={item.id}
      >
        {/* Full Width Hero Image */}
        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-[#e6eeff]">
          {!imageError && displayImage ? (
            <img
              src={displayImage}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#ffdcc3] to-[#eff4ff] text-[#8d4b00]">
              <span className="material-symbols-outlined text-[48px]">bakery_dining</span>
              <span className="text-xs font-bold mt-1">مملكة المعجنات</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-[#8d4b00] text-white text-xs font-bold shadow-md flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>الأعلى مبيعاً</span>
            </span>

            {!isAvailable && (
              <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                غير متوفر اليوم
              </span>
            )}
          </div>

          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-xs">
            {item.calories} سعرة
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-base text-[#121c2a]">{item.name}</h3>
            <span className="font-bold text-base text-[#8d4b00] whitespace-nowrap">
              {currentPrice.toFixed(2)}{' '}
              <span className="text-xs font-normal text-[#554336]">ر.س</span>
            </span>
          </div>
          <p className="text-xs text-[#554336] leading-relaxed">{item.description}</p>
        </div>

        {/* Sizes Selector if available */}
        {item.has_sizes && item.sizes && item.sizes.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">الحجم:</span>
            <div className="flex gap-1.5">
              {item.sizes.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedSize?.name === s.name
                      ? 'bg-[#8d4b00] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#554336] hover:bg-[#dee9fc]'
                  }`}
                >
                  {s.name} ({s.price} ر.س)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Action */}
        <div className="flex items-center justify-end pt-1">
          {!isAvailable ? (
            <span className="text-xs font-bold text-red-600 px-3 py-1.5 bg-red-50 rounded-lg">
              غير متوفر حالياً
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2 bg-[#eff4ff] rounded-lg p-1 border border-[#e6eeff] shadow-sm">
              <button
                type="button"
                onClick={() => updateQuantity(cartKey, -1)}
                className="w-8 h-8 rounded-md bg-white text-[#8d4b00] flex items-center justify-center font-bold active:scale-95 transition-transform shadow-xs"
                aria-label="تقليل الكمية"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {quantity === 1 ? 'delete' : 'remove'}
                </span>
              </button>
              <span className="w-7 text-center font-bold text-slate-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(cartKey, 1)}
                className="w-8 h-8 rounded-md bg-[#8d4b00] text-white flex items-center justify-center font-bold active:scale-95 transition-transform shadow-xs"
                aria-label="زيادة الكمية"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(item, 1, selectedSize)}
              className="px-4 py-2 rounded-lg bg-[#8d4b00] text-white flex items-center gap-1.5 text-xs font-bold hover:bg-[#b15f00] transition-transform active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>أضف للطلب</span>
            </button>
          )}
        </div>
      </article>
    );
  }

  // Standard Food Card
  return (
    <article
      className={`food-item bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(180,130,80,0.06)] border flex gap-3 transition-all ${
        isAvailable
          ? 'border-slate-100/60 active:scale-[0.99]'
          : 'border-slate-200 opacity-75'
      }`}
      data-id={item.id}
    >
      {/* Thumbnail with Calorie Pill */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[#e6eeff]">
        {!imageError && displayImage ? (
          <img
            src={displayImage}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#ffdcc3] to-[#eff4ff] text-[#8d4b00]">
            <span className="material-symbols-outlined text-[36px]">bakery_dining</span>
            <span className="text-[10px] font-bold mt-0.5">طازج</span>
          </div>
        )}

        {!isAvailable && (
          <span className="absolute inset-0 bg-red-950/70 text-white text-[11px] font-bold flex items-center justify-center text-center p-1">
            غير متوفر
          </span>
        )}

        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
          {item.calories} سعرة
        </span>
      </div>

      {/* Item Details */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-sm text-[#121c2a] truncate">{item.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.is_veg && (
                <span
                  className="text-[#006e2d] material-symbols-outlined text-[18px]"
                  title="مناسب للنباتيين"
                >
                  eco
                </span>
              )}
              {item.is_spicy && (
                <span
                  className="text-[#ba1a1a] material-symbols-outlined text-[16px]"
                  title="حار وسبايسي"
                >
                  local_fire_department
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-[#554336] line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>

          {/* Sizes Selection Pills */}
          {item.has_sizes && item.sizes && item.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.sizes.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    selectedSize?.name === s.name
                      ? 'bg-[#8d4b00] text-white shadow-2xs'
                      : 'bg-[#eff4ff] text-[#554336] hover:bg-[#dee9fc]'
                  }`}
                >
                  {s.name} ({s.price} ر.س)
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <span className="font-bold text-base text-[#8d4b00]">
            {currentPrice.toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#554336]">ر.س</span>
          </span>

          <div className="action-slot">
            {!isAvailable ? (
              <span className="text-[11px] font-bold text-red-600 px-2 py-1 bg-red-50 rounded-md">
                نفد اليوم
              </span>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-1.5 bg-[#eff4ff] rounded-lg p-1 shadow-sm border border-[#e6eeff]">
                <button
                  type="button"
                  onClick={() => updateQuantity(cartKey, -1)}
                  className="w-7 h-7 rounded-md bg-white text-[#8d4b00] flex items-center justify-center font-bold active:scale-95 transition-transform"
                  aria-label="تقليل الكمية"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {quantity === 1 ? 'delete' : 'remove'}
                  </span>
                </button>
                <span className="w-6 text-center font-bold text-slate-900 text-xs">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(cartKey, 1)}
                  className="w-7 h-7 rounded-md bg-[#8d4b00] text-white flex items-center justify-center font-bold active:scale-95 transition-transform"
                  aria-label="زيادة الكمية"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(item, 1, selectedSize)}
                className="w-9 h-9 rounded-lg bg-[#8d4b00] text-white flex items-center justify-center hover:bg-[#b15f00] transition-transform active:scale-95 shadow-sm"
                aria-label={`أضف ${item.name} للسلة`}
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
