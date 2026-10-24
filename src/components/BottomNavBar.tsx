import React from 'react';
import { useCart } from '../context/CartContext';

interface BottomNavBarProps {
  onOpenBranches?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenBranches }) => {
  const { activeTab, setActiveTab } = useCart();

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(31,41,55,0.06)] border-t border-[#e6eeff]">
      <div className="h-16 px-6 flex items-center justify-around max-w-md mx-auto">
        {/* Menu Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-colors ${
            activeTab === 'menu'
              ? 'text-[#8d4b00] font-bold'
              : 'text-[#554336] hover:text-[#121c2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">bakery_dining</span>
          <span className="text-[11px] mt-0.5 font-semibold">قائمة المنيو</span>
        </button>

        {/* Offers Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-colors ${
            activeTab === 'offers'
              ? 'text-[#8d4b00] font-bold'
              : 'text-[#554336] hover:text-[#121c2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">local_offer</span>
          <span className="text-[11px] mt-0.5 font-semibold">باقات العروض</span>
        </button>

        {/* Branches Tab */}
        <button
          type="button"
          onClick={() => {
            if (onOpenBranches) onOpenBranches();
            else setActiveTab('branches');
          }}
          className={`flex flex-col items-center justify-center py-1 px-4 transition-colors ${
            activeTab === 'branches'
              ? 'text-[#8d4b00] font-bold'
              : 'text-[#554336] hover:text-[#121c2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">storefront</span>
          <span className="text-[11px] mt-0.5 font-semibold">فروعنا</span>
        </button>
      </div>
    </nav>
  );
};
