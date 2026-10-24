import React, { useState } from 'react';
import { MenuItem } from '../data/menuData';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ item, onClose }) => {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const isAvailable = item.is_available !== false;
  const displayImage = item.image_url || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Image */}
        <div className="relative w-full h-56 sm:h-64 bg-slate-100 flex-shrink-0">
          {!imageError && displayImage ? (
            <img
              src={displayImage}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#ffdcc3] to-[#eff4ff] text-[#8d4b00]">
              <span className="material-symbols-outlined text-[64px]">bakery_dining</span>
              <span className="text-sm font-bold mt-1">مملكة المعجنات</span>
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-95"
            aria-label="إغلاق"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* Availability overlay if unavailable */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-red-950/75 flex items-center justify-center text-white">
              <span className="px-4 py-1.5 rounded-full bg-red-600 text-sm font-bold shadow-lg">
                غير متوفر حالياً
              </span>
            </div>
          )}

          {/* Calories Pill */}
          {item.calories && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>{item.calories} سعرة</span>
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Title and Category */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-bold text-xl text-[#121c2a] leading-snug">
                {item.name}
              </h2>
              {isAvailable ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex-shrink-0">
                  متوفر للطلب
                </span>
              ) : (
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex-shrink-0">
                  غير متوفر
                </span>
              )}
            </div>

            {item.category_name && (
              <span className="text-xs text-[#8d4b00] font-semibold">
                قسم: {item.category_name}
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="bg-[#eff4ff]/50 rounded-2xl p-3.5 border border-[#e6eeff]">
              <span className="text-[11px] font-bold text-[#554336] block mb-1">
                وصف الصنف والمكونات:
              </span>
              <p className="text-xs text-[#121c2a] leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Tags and Badges */}
          {(item.is_bestseller || item.is_spicy || item.is_family_box) && (
            <div className="flex flex-wrap items-center gap-2">
              {item.is_bestseller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdcc3] text-[#2f1500] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  <span>الأكثر طلباً</span>
                </span>
              )}
              {item.is_spicy && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  <span>حار سبايسي</span>
                </span>
              )}
              {item.is_family_box && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  <span>وجبة عائلية</span>
                </span>
              )}
            </div>
          )}

          {/* Pricing Section */}
          <div className="pt-3 border-t border-slate-100">
            {item.has_sizes && item.sizes && item.sizes.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700">الأحجام والأسعار المتوفرة:</span>
                <div className="grid grid-cols-2 gap-2">
                  {item.sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e6eeff] flex flex-col justify-between"
                    >
                      <span className="text-xs text-slate-600 font-semibold">{s.name}</span>
                      <span className="text-sm font-bold text-[#8d4b00] mt-1">
                        {Number(s.price).toFixed(2)} ر.س
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#eff4ff] p-3.5 rounded-2xl border border-[#e6eeff]">
                <span className="text-xs font-bold text-slate-700">السعر:</span>
                <span className="text-xl font-extrabold text-[#8d4b00]">
                  {Number(item.price).toFixed(2)}{' '}
                  <span className="text-xs font-normal text-[#554336]">ريال سعودي</span>
                </span>
              </div>
            )}
          </div>

          {/* Close Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#8d4b00] hover:bg-[#b15f00] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
            >
              إغلاق نافذة التفاصيل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
