import React from 'react';
import { useCart } from '../context/CartContext';

export const CartView: React.FC = () => {
  const {
    cart,
    updateQuantity,
    clearCart,
    subtotal,
    totalPrice,
    setIsCheckoutOpen,
    setActiveTab
  } = useCart();

  const cartEntries = Object.values(cart).filter(e => e.quantity > 0);

  if (cartEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#eff4ff] text-[#8d4b00] flex items-center justify-center mb-4 shadow-inner">
          <span className="material-symbols-outlined text-[40px]">shopping_basket</span>
        </div>
        <h2 className="text-xl font-bold text-[#121c2a]">سلة التسوق فارغة</h2>
        <p className="text-xs text-[#554336] mt-2 max-w-xs leading-relaxed">
          لم تقم بإضافة أي فطائر بعد. اختر ما يحلو لك من قائمتنا المخبوزة طازجة يومياً!
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className="mt-6 px-6 py-3 rounded-xl bg-[#8d4b00] text-white font-bold text-xs hover:bg-[#b15f00] transition-transform active:scale-95 shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">bakery_dining</span>
          <span>ابدأ باختيار فطائرك</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-32 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#121c2a]">سلة الطلبات</h2>
          <p className="text-xs text-[#554336] mt-0.5">
            لديك {cartEntries.reduce((s, it) => s + it.quantity, 0)} أصناف مختارة
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
          <span>إفراغ السلة</span>
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex flex-col gap-3">
        {cartEntries.map(({ item, quantity }) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-3 shadow-[0_2px_8px_rgba(180,130,80,0.06)] border border-slate-100 flex items-center gap-3"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#e6eeff] flex-shrink-0">
              <img
                src={item.image_url || (item as any).imageUrl || ''}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#121c2a] truncate">{item.name}</h4>
              <span className="text-xs text-[#8d4b00] font-bold block mt-0.5">
                {item.price.toFixed(2)} ر.س
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1.5 bg-[#eff4ff] rounded-lg p-1 border border-[#e6eeff]">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="w-7 h-7 rounded-md bg-white text-[#8d4b00] flex items-center justify-center font-bold active:scale-95 transition-transform shadow-xs"
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
                onClick={() => updateQuantity(item.id, 1)}
                className="w-7 h-7 rounded-md bg-[#8d4b00] text-white flex items-center justify-center font-bold active:scale-95 transition-transform shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2.5 mt-2">
        <h3 className="font-bold text-sm text-[#121c2a]">تفاصيل الحساب</h3>
        <div className="flex justify-between items-center text-xs text-[#554336]">
          <span>المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#554336]">
          <span>ضريبة القيمة المضافة 15%</span>
          <span className="text-[#006e2d] font-semibold">مشمولة في الأسعار</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#554336]">
          <span>رسوم التوصيل</span>
          <span className="text-[#006e2d] font-semibold">مجاناً للطلبات القريبة</span>
        </div>
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-sm text-[#121c2a]">المبلغ الإجمالي</span>
          <span className="font-bold text-lg text-[#8d4b00]">
            {totalPrice.toFixed(2)} <span className="text-xs font-normal">ر.س</span>
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        onClick={() => setIsCheckoutOpen(true)}
        className="w-full h-12 rounded-xl bg-[#8d4b00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b15f00] transition-transform active:scale-98 shadow-lg shadow-[#8d4b00]/25 mt-2"
      >
        <span>المتابعة إلى إتمام الطلب</span>
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      </button>
    </div>
  );
};
