import React from 'react';
import { useCart } from '../context/CartContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, totalItemsCount } = useCart();

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(31,41,55,0.08)] border-t border-[#e6eeff]">
      <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
        {/* Menu Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            activeTab === 'menu' ? 'text-[#8d4b00] font-bold' : 'text-[#554336] hover:text-[#121c2a]'
          }`}
          data-path="main-menu"
        >
          <span className="material-symbols-outlined text-[22px]">bakery_dining</span>
          <span className="text-[11px] mt-0.5">القائمة</span>
        </button>

        {/* Offers Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            activeTab === 'offers' ? 'text-[#8d4b00] font-bold' : 'text-[#554336] hover:text-[#121c2a]'
          }`}
          data-path="special-offers"
        >
          <span className="material-symbols-outlined text-[22px]">local_offer</span>
          <span className="text-[11px] mt-0.5">العروض</span>
        </button>

        {/* Order Tracking Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
            activeTab === 'orders' ? 'text-[#8d4b00] font-bold' : 'text-[#554336] hover:text-[#121c2a]'
          }`}
          data-path="order-tracking"
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="text-[11px] mt-0.5">طلباتي</span>
        </button>

        {/* Cart Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors relative ${
            activeTab === 'cart' ? 'text-[#8d4b00] font-bold' : 'text-[#554336] hover:text-[#121c2a]'
          }`}
          data-path="view-cart"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          <span className="text-[11px] mt-0.5">السلة</span>
          {totalItemsCount > 0 && (
            <span className="absolute top-1 left-3 w-4 h-4 bg-[#8d4b00] text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-xs">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
