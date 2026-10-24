import React, { useState } from 'react';
import { MenuItem } from '../data/menuData';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const isFamilyBox = item.is_family_box;
  const isAvailable = item.is_available !== false;
  const displayImage = item.image_url || (item as any).imageUrl || '';

  // Render Big Box / Family presentation
  if (isFamilyBox) {
    return (
      <article
        className={`food-item bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(180,130,80,0.07)] border transition-all ${
          isAvailable ? 'border-slate-100' : 'border-slate-200 opacity-75'
        }`}
        data-id={item.id}
      >
        {/* Full Width Hero Image */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e6eeff]">
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
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-base text-[#121c2a]">{item.name}</h3>
            {!item.has_sizes && (
              <span className="font-bold text-lg text-[#8d4b00] whitespace-nowrap">
                {item.price.toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#554336]">ر.س</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#554336] leading-relaxed">{item.description}</p>
        </div>

        {/* Sizes Display if available */}
        {item.has_sizes && item.sizes && item.sizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 mt-1">
            <span className="text-xs text-slate-500 font-semibold ml-1">الأسعار والأحجام:</span>
            {item.sizes.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#eff4ff] text-[#8d4b00] border border-[#e6eeff]"
              >
                {s.name}: {s.price} ر.س
              </span>
            ))}
          </div>
        )}
      </article>
    );
  }

  // Standard Food Card (Pure Menu View)
  return (
    <article
      className={`food-item bg-white rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(180,130,80,0.06)] border flex gap-3.5 transition-all ${
        isAvailable ? 'border-slate-100/80' : 'border-slate-200 opacity-75'
      }`}
      data-id={item.id}
    >
      {/* Thumbnail with Calorie Pill */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#e6eeff]">
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
                  className="text-[#006e2d] material-symbols-outlined text-[17px]"
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
        </div>

        {/* Pricing / Sizes Row */}
        <div className="pt-2 border-t border-slate-50 mt-1">
          {item.has_sizes && item.sizes && item.sizes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#eff4ff] text-[#8d4b00]"
                >
                  {s.name}: {s.price} ر.س
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-bold text-base text-[#8d4b00]">
                {item.price.toFixed(2)}{' '}
                <span className="text-xs font-normal text-[#554336]">ر.س</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                طازج بالفرن الحجري
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
