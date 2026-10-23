import React from 'react';
import { useCart, OrderType } from '../context/CartContext';

interface SearchBarAndFiltersProps {
  onOpenBranchModal: () => void;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({ onOpenBranchModal }) => {
  const {
    orderType,
    setOrderType,
    selectedBranch,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter
  } = useCart();

  const handleModeChange = (mode: OrderType) => {
    setOrderType(mode);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Location & WhatsApp Quick Context Bar */}
      <section className="px-4 py-2 flex items-center justify-between gap-2 bg-[#eff4ff] border-b border-[#e6eeff]">
        <button
          type="button"
          onClick={onOpenBranchModal}
          className="flex items-center gap-1.5 text-[#121c2a] hover:text-[#8d4b00] transition-colors min-w-0 text-right"
        >
          <span
            className="material-symbols-outlined text-[18px] text-[#8d4b00] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            pin_drop
          </span>
          <span className="text-xs font-semibold truncate">{selectedBranch.name}</span>
          <span className="material-symbols-outlined text-[16px] text-[#554336] flex-shrink-0">
            chevron_left
          </span>
        </button>

        <a
          href={`https://wa.me/${selectedBranch.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7cf994]/40 text-[#007230] text-xs font-bold hover:bg-[#7cf994] transition-colors shadow-sm"
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat
          </span>
          <span>تواصل مباشر</span>
        </a>
      </section>

      {/* Fulfillment Mode Bar with Timing Subtitles */}
      <section className="px-4 pt-2.5 pb-1">
        <div className="flex items-center justify-between bg-[#d9e3f6] p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => handleModeChange('delivery')}
            className={`flex-1 py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
              orderType === 'delivery'
                ? 'bg-white text-[#8d4b00] font-bold shadow-sm'
                : 'text-[#554336] hover:text-[#121c2a]'
            }`}
          >
            <span className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[18px]">moped</span>
              <span>توصيل</span>
            </span>
            <span className="text-[10px] text-[#554336] mt-0.5">30-45 دقيقة</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('pickup')}
            className={`flex-1 py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
              orderType === 'pickup'
                ? 'bg-white text-[#8d4b00] font-bold shadow-sm'
                : 'text-[#554336] hover:text-[#121c2a]'
            }`}
          >
            <span className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>استلام من الفرع</span>
            </span>
            <span className="text-[10px] text-[#554336] mt-0.5">~15 دقيقة</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('dinein')}
            className={`flex-1 py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
              orderType === 'dinein'
                ? 'bg-white text-[#8d4b00] font-bold shadow-sm'
                : 'text-[#554336] hover:text-[#121c2a]'
            }`}
          >
            <span className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              <span>داخل المحل</span>
            </span>
            <span className="text-[10px] text-[#554336] mt-0.5">طازج وفوري</span>
          </button>
        </div>
      </section>

      {/* Search & Quick Filters */}
      <section className="px-4 pt-1.5 pb-2">
        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-[#554336] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن فطيرة، معجنات، بيتزا..."
            className="w-full h-11 pr-10 pl-10 rounded-xl bg-white text-[#121c2a] text-sm placeholder:text-[#554336]/60 shadow-sm outline-none border border-transparent focus:border-[#8d4b00]/30 focus:bg-[#eff4ff] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 w-6 h-6 rounded-full bg-[#e6eeff] text-[#554336] flex items-center justify-center hover:bg-[#dee9fc]"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'bestseller' ? 'all' : 'bestseller')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'bestseller'
                ? 'bg-[#8d4b00] text-white shadow-sm'
                : 'bg-[#ffdcc3] text-[#2f1500] hover:bg-[#ffb77d]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span>الأكثر طلباً</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'offers' ? 'all' : 'offers')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'offers'
                ? 'bg-[#8d4b00] text-white shadow-sm'
                : 'bg-[#e6eeff] text-[#554336] hover:bg-[#dee9fc]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">high_res</span>
            <span>عروض خاصة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'fast' ? 'all' : 'fast')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'fast'
                ? 'bg-[#8d4b00] text-white shadow-sm'
                : 'bg-[#e6eeff] text-[#554336] hover:bg-[#dee9fc]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>أقل من 20 دقيقة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'veg' ? 'all' : 'veg')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              activeFilter === 'veg'
                ? 'bg-[#006e2d] text-white shadow-sm'
                : 'bg-[#e6eeff] text-[#554336] hover:bg-[#dee9fc]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">eco</span>
            <span>نباتي</span>
          </button>
        </div>
      </section>
    </div>
  );
};
