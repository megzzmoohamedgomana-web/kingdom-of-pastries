import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BranchSelectorModal } from './BranchSelectorModal';
import { ProfileModal } from './ProfileModal';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { selectedBranch } = useCart();
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-40 pt-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(180,130,80,0.06)] border-b border-[#e6eeff]">
        <div className="max-w-md mx-auto px-3.5 py-2.5 h-[64px] flex items-center justify-between gap-2.5">
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
                فطائر ومخبوزات طازجة يومياً
              </span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* WhatsApp direct */}
            <a
              href={`https://wa.me/${selectedBranch.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل عبر واتساب"
              className="w-9 h-9 rounded-full bg-[#006e2d] text-white flex items-center justify-center hover:bg-[#006e2d]/90 transition-transform active:scale-95 shadow-[0_2px_6px_rgba(0,110,45,0.25)] flex-shrink-0"
              title="تواصل مباشر عبر واتساب"
            >
              <span className="material-symbols-outlined text-[19px]">chat</span>
            </a>

            {/* Branch Location */}
            <button
              type="button"
              onClick={() => setIsBranchModalOpen(true)}
              aria-label="موقع المحل على الخريطة"
              className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#8d4b00] border border-[#e6eeff] flex items-center justify-center hover:bg-[#dee9fc] transition-transform active:scale-95 flex-shrink-0"
              title="تغيير الفرع أو عرض الموقع"
            >
              <span className="material-symbols-outlined text-[19px]">location_on</span>
            </button>

            {/* Customer Profile & Admin Access */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="الملف الشخصي"
              className="w-9 h-9 rounded-full bg-[#8d4b00] text-white flex items-center justify-center hover:bg-[#b15f00] transition-transform active:scale-95 shadow-xs flex-shrink-0"
              title="بيانات العميل والإدارة"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAdmin={onOpenAdmin}
      />
    </>
  );
};
