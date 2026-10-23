import React from 'react';
import { useCart, SubmittedOrder } from '../context/CartContext';

export const OrderTrackingView: React.FC = () => {
  const { orders, addToCart, setIsCheckoutOpen, setActiveTab } = useCart();

  const handleReorder = (order: SubmittedOrder) => {
    order.items.forEach(({ item, quantity }) => {
      addToCart(item, quantity);
    });
    setIsCheckoutOpen(true);
  };

  const getStatusText = (status: SubmittedOrder['status'], orderType: string) => {
    switch (status) {
      case 'received':
        return 'تم استلام الطلب وتأكيده';
      case 'baking':
        return 'جاري العجن والخبز في الفرن الحجري 🔥';
      case 'packaging':
        return 'التجهيز والتغليف الحراري 📦';
      case 'ready':
        return orderType === 'delivery'
          ? 'في الطريق إليك مع مندوب التوصيل 🛵'
          : 'جاهز للاستلام الفوري من الكاونتر 🥐';
      case 'completed':
        return 'تم تسليم الطلب بنجاح بالعافية ✨';
      default:
        return 'قيد التجهيز';
    }
  };

  const getStatusStepIndex = (status: SubmittedOrder['status']) => {
    switch (status) {
      case 'received':
        return 0;
      case 'baking':
        return 1;
      case 'packaging':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-28 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#121c2a]">متابعة طلباتي</h2>
          <p className="text-xs text-[#554336] mt-0.5">
            تتبع مراحل خبز وتجهيز فطائرك في الفرن مباشرة
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className="text-xs font-bold text-[#8d4b00] hover:underline flex items-center gap-1"
        >
          <span>طلب جديد</span>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#8d4b00] flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">receipt_long</span>
          </div>
          <h3 className="font-bold text-base text-slate-800">لا توجد طلبات حتى الآن</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            تصفح قائمتنا الشهية واطلب الآن فطائرك ومخبوزاتك المفضلة طازجة وسريعة
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00]"
          >
            تصفح القائمة
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const stepIndex = getStatusStepIndex(order.status);
            const isFinished = order.status === 'completed';

            return (
              <article
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(180,130,80,0.08)] border border-slate-100 flex flex-col gap-3.5"
              >
                {/* Order Meta Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#8d4b00] flex items-center justify-center font-bold text-xs">
                      KP
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#121c2a]">{order.orderNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6eeff] text-[#8d4b00] font-semibold">
                          {order.orderType === 'delivery'
                            ? 'توصيل'
                            : order.orderType === 'pickup'
                            ? 'استلام فرع'
                            : 'داخل المحل'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#554336]">{order.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="font-bold text-sm text-[#8d4b00]">
                      {order.totalAmount.toFixed(2)} ر.س
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {order.items.reduce((s, it) => s + it.quantity, 0)} أصناف
                    </span>
                  </div>
                </div>

                {/* Live Status Tracker */}
                <div className="bg-[#f8f9ff] rounded-xl p-3 flex flex-col gap-2.5 border border-[#e6eeff]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121c2a]">حالة الطلب:</span>
                    <span
                      className={`text-xs font-bold ${
                        isFinished ? 'text-[#006e2d]' : 'text-[#8d4b00]'
                      }`}
                    >
                      {getStatusText(order.status, order.orderType)}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#8d4b00] to-[#006e2d] h-full transition-all duration-700 ease-out"
                      style={{ width: `${order.statusProgress}%` }}
                    />
                  </div>

                  {/* 4 Step Milestones */}
                  <div className="grid grid-cols-4 text-center text-[10px] pt-1 text-[#554336]">
                    <div className={stepIndex >= 0 ? 'text-[#8d4b00] font-bold' : ''}>
                      تم الاستلام
                    </div>
                    <div className={stepIndex >= 1 ? 'text-[#8d4b00] font-bold' : ''}>
                      في الفرن
                    </div>
                    <div className={stepIndex >= 2 ? 'text-[#8d4b00] font-bold' : ''}>
                      تجهيز وتغليف
                    </div>
                    <div className={stepIndex >= 3 ? 'text-[#006e2d] font-bold' : ''}>
                      {order.orderType === 'delivery' ? 'بالتوصيل' : 'جاهز'}
                    </div>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 py-1">
                  {order.items.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs text-[#121c2a]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#8d4b00] font-bold">{quantity}×</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-slate-500">
                        {(quantity * item.price).toFixed(2)} ر.س
                      </span>
                    </div>
                  ))}
                  {order.notes && (
                    <p className="text-[11px] text-slate-500 pt-1 italic">
                      ملاحظة: {order.notes}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${order.branch.whatsapp}?text=${encodeURIComponent(
                      `مرحباً مملكة المعجنات، أستفسر عن حالة طلبي ${order.orderNumber}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-[#006e2d]/10 text-[#006e2d] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#006e2d]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>مراسلة الفرع</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="flex-1 py-2 rounded-xl bg-[#eff4ff] text-[#8d4b00] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#d9e3f6] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>إعادة الطلب</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
