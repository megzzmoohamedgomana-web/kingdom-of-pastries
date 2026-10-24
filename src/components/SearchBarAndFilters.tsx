import React from 'react';
import { useCart } from '../context/CartContext';

interface SearchBarAndFiltersProps {
  onOpenBranchModal: () => void;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({ onOpenBranchModal }) => {
  const {
    selectedBranch,
    searchQuery,
    setSearchQuery
  } = useCart();

  return (
    <div className="flex flex-col w-full">
      {/* Branch Context Bar */}
      <section className="px-4 py-2.5 flex items-center justify-between gap-2 bg-[#eff4ff] border-b border-[#e6eeff]">
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
          <span className="text-xs font-bold truncate">{selectedBranch.name}</span>
          <span className="material-symbols-outlined text-[16px] text-[#554336] flex-shrink-0">
            chevron_left
          </span>
        </button>

        <span className="text-[11px] text-[#007230] font-bold bg-[#7cf994]/30 px-2.5 py-0.5 rounded-full">
          مفتوح الآن
        </span>
      </section>

      {/* Search Input */}
      <section className="px-4 pt-3 pb-2.5">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-[#554336] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في القائمة عن فطيرة، معجنات، بيتزا..."
            className="w-full h-11 pr-10 pl-10 rounded-xl bg-white text-[#121c2a] text-sm placeholder:text-[#554336]/60 shadow-xs outline-none border border-slate-200/80 focus:border-[#8d4b00] focus:bg-[#eff4ff]/50 transition-all"
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
      </section>
    </div>
  );
};
