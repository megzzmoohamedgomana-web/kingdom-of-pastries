import React, { useState } from 'react';
import { BranchSelectorModal } from './BranchSelectorModal';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-40 pt-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(180,130,80,0.06)] border-b border-[#e6eeff]">
        <div className="max-w-md mx-auto px-4 py-2.5 h-[64px] flex items-center justify-between gap-3">
          {/* Brand Lockup */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="p-1 rounded-xl bg-white shadow-xs border border-slate-100 flex-shrink-0">
              <img
                src="/assets/aistudio/Image_3_abcf1713.png"
                alt="شعار مملكة المعجنات"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-base sm:text-lg text-[#8d4b00] leading-tight truncate">
                مملكة المعجنات
              </h1>
              <span className="text-[11px] text-[#554336] truncate leading-tight mt-0.5">
                قائمة الفطائر والمخبوزات الطازجة
              </span>
            </div>
          </div>

          {/* Header Actions: Branches Location */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Branch Locations */}
            <button
              type="button"
              onClick={() => setIsBranchModalOpen(true)}
              aria-label="فروعنا ومواقع المحل"
              className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#8d4b00] border border-[#e6eeff] flex items-center justify-center hover:bg-[#dee9fc] transition-transform active:scale-95 flex-shrink-0"
              title="عرض الفروع ومواقعها"
            >
              <span className="material-symbols-outlined text-[19px]">location_on</span>
            </button>
          </div>
        </div>
      </header>

      {/* Branch Modal */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
      />
    </>
  );
};
