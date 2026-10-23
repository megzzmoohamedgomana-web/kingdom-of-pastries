import React from 'react';
import { useCart } from '../context/CartContext';

export const FloatingCartBar: React.FC = () => {
  const { totalItemsCount, totalPrice, setIsCheckoutOpen } = useCart();

  if (totalItemsCount <= 0) return null;

  return (
    <aside
      className="fixed bottom-20 left-4 right-4 z-40 transition-all duration-300 transform translate-y-0 animate-slide-up"
      id="floating-cart-bar"
    >
      <div className="max-w-md mx-auto bg-[#27313f] text-[#eaf1ff] rounded-2xl p-2.5 px-3.5 shadow-2xl flex items-center justify-between gap-3 border border-slate-700/50">
        {/* Cart Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-[#8d4b00] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-white text-[22px]">shopping_bag</span>
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#006e2d] text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#27313f]"
              id="floating-cart-badge"
            >
              {totalItemsCount}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-white">
              {totalItemsCount} صنف في السلة
            </span>
            <span className="text-xs text-slate-300">
              المجموع:{' '}
              <strong className="text-[#ffdcc3] font-bold">
                {totalPrice.toFixed(2)} ر.س
              </strong>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="h-11 px-4 rounded-xl bg-[#8d4b00] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#b15f00] transition-transform active:scale-95 shadow-md flex-shrink-0"
          id="open-checkout-modal-btn"
        >
          <span>إتمام الطلب</span>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
      </div>
    </aside>
  );
};
