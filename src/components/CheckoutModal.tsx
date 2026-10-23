import React, { useState } from 'react';
import { useCart, OrderType } from '../context/CartContext';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    orderType,
    setOrderType,
    customerInfo,
    setCustomerInfo,
    isCheckoutOpen,
    setIsCheckoutOpen,
    updateQuantity,
    subtotal,
    totalPrice,
    placeOrder,
    selectedBranch
  } = useCart();

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const cartItems = Object.values(cart).filter(e => e.quantity > 0);

  const handleWhatsAppSubmit = () => {
    if (cartItems.length === 0) {
      setValidationError('يرجى إضافة صنف واحد على الأقل قبل تأكيد الطلب.');
      return;
    }

    if (!customerInfo.name.trim()) {
      setValidationError('يرجى إدخال اسم العميل للمتابعة.');
      return;
    }

    if (orderType === 'delivery' && !customerInfo.address.trim()) {
      setValidationError('يرجى إدخال عنوان التوصيل أو الحي.');
      return;
    }

    setValidationError(null);
    placeOrder(true);
  };

  const handleInAppSubmit = () => {
    if (cartItems.length === 0) {
      setValidationError('السلة فارغة.');
      return;
    }
    setValidationError(null);
    placeOrder(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      />

      {/* Sheet Content */}
      <section
        className="relative z-50 bg-white rounded-t-3xl shadow-2xl max-h-[92vh] w-full max-w-lg mx-auto flex flex-col overflow-hidden animate-slide-up"
        id="checkout-sheet"
      >
        {/* Drag Pill & Header */}
        <div className="p-4 pb-2 flex flex-col items-center border-b border-slate-100">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 mb-3" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/Image_3_abcf1713.png"
                alt="Logo"
                className="w-8 h-8 rounded-lg object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h2 className="font-bold text-base text-[#121c2a]">تأكيد طلبك</h2>
                <span className="text-[11px] text-[#554336]">
                  مملكة المعجنات - إرسال فوري لواتساب الفرع ({selectedBranch.name})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#554336] flex items-center justify-center hover:bg-[#d9e3f6] transition-colors"
              aria-label="إغلاق نافذة الدفع"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-4 py-3 flex flex-col gap-4">
          {/* Validation Banner */}
          {validationError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Fulfillment Mode Segmented Controls */}
          <div className="bg-[#eff4ff] p-1 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              className={`flex-1 py-2 rounded-lg text-center text-xs font-bold transition-all ${
                orderType === 'delivery'
                  ? 'bg-white text-[#8d4b00] shadow-sm'
                  : 'text-[#554336] hover:text-[#121c2a]'
              }`}
            >
              توصيل
            </button>
            <button
              type="button"
              onClick={() => setOrderType('pickup')}
              className={`flex-1 py-2 rounded-lg text-center text-xs font-bold transition-all ${
                orderType === 'pickup'
                  ? 'bg-white text-[#8d4b00] shadow-sm'
                  : 'text-[#554336] hover:text-[#121c2a]'
              }`}
            >
              استلام فرع
            </button>
            <button
              type="button"
              onClick={() => setOrderType('dinein')}
              className={`flex-1 py-2 rounded-lg text-center text-xs font-bold transition-all ${
                orderType === 'dinein'
                  ? 'bg-white text-[#8d4b00] shadow-sm'
                  : 'text-[#554336] hover:text-[#121c2a]'
              }`}
            >
              داخل المحل
            </button>
          </div>

          {/* Dynamic Location / Fulfillment Inputs */}
          {orderType === 'delivery' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#121c2a]">
                عنوان التوصيل أو رابط اللوكيشن *
              </label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="مثال: حي الشاطئ، شارع الأمير نايف، بجوار مسجد..."
                className="h-11 px-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
              />
            </div>
          )}

          {orderType === 'dinein' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#121c2a]">رقم الطاولة *</label>
              <input
                type="text"
                value={customerInfo.tableNumber}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, tableNumber: e.target.value }))
                }
                placeholder="مثال: طاولة رقم 4 (داخل الصالة)"
                className="h-11 px-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
              />
            </div>
          )}

          {orderType === 'pickup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#121c2a]">وقت الاستلام التقريبي</label>
              <select
                value={customerInfo.pickupTime}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, pickupTime: e.target.value }))
                }
                className="h-11 px-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
              >
                <option value="بعد 15 دقيقة (فوراً)">بعد 15 دقيقة (فوراً)</option>
                <option value="بعد 30 دقيقة">بعد 30 دقيقة</option>
                <option value="بعد 45 دقيقة">بعد 45 دقيقة</option>
                <option value="بعد ساعة">بعد ساعة</option>
              </select>
            </div>
          )}

          {/* Customer Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#121c2a]">الاسم الكريم *</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="مثال: عبد الله الشمري"
                className="h-11 px-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#121c2a]">رقم الجوال للتأكيد</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#554336] dir-ltr font-mono">
                  +966
                </span>
                <input
                  type="tel"
                  dir="ltr"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="5XXXXXXXX"
                  className="w-full h-11 pl-12 pr-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs text-right focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Baking Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#121c2a]">
              ملاحظات خاصة على المعجنات
            </label>
            <input
              type="text"
              value={customerInfo.notes}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="مثال: تحمير زيادة، تقليل شطة، بدون بصل، ثوم إضافي..."
              className="h-11 px-3 rounded-xl bg-[#eff4ff] text-[#121c2a] text-xs focus:bg-white border border-transparent focus:border-[#8d4b00] outline-none shadow-xs transition-all"
            />
          </div>

          {/* Selected Items Breakdown List */}
          <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#121c2a]">ملخص الأصناف المختارة</span>

            {cartItems.length === 0 ? (
              <p className="text-xs text-[#554336] text-center py-4">
                السلة فارغة، اختر بعض المعجنات اللذيذة!
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {cartItems.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white text-xs border border-slate-100 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#e6eeff] flex items-center justify-center text-[#8d4b00] font-bold text-[11px]">
                        {quantity}×
                      </span>
                      <span className="truncate font-semibold text-slate-900">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#8d4b00]">
                        {(quantity * item.price).toFixed(2)} ر.س
                      </span>
                      <div className="flex items-center gap-1 bg-[#eff4ff] rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded bg-white text-[#8d4b00] flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded bg-[#8d4b00] text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations */}
            <div className="pt-2 mt-1 flex flex-col gap-1 bg-white p-2.5 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs text-[#554336]">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#554336]">
                <span>رسوم الخدمة والضريبة (15% مشمولة)</span>
                <span className="text-[#006e2d] font-semibold">مشمولة في الأسعار</span>
              </div>
              <div className="flex justify-between items-center font-bold text-[#121c2a] text-sm pt-1 border-t border-slate-100">
                <span>المجموع النهائي</span>
                <span className="text-base text-[#8d4b00] font-bold">
                  {totalPrice.toFixed(2)} ر.س
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sheet Sticky Bottom Actions */}
        <div className="p-4 pt-2 bg-white border-t border-slate-100 pb-safe flex flex-col gap-2">
          {/* WhatsApp Direct Order Button */}
          <button
            type="button"
            onClick={handleWhatsAppSubmit}
            disabled={cartItems.length === 0}
            className="w-full h-12 rounded-xl bg-[#006e2d] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#006e2d]/90 transition-transform active:scale-98 shadow-lg shadow-[#006e2d]/25 disabled:opacity-50"
            id="send-whatsapp-order-btn"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>إرسال الطلب عبر واتساب</span>
          </button>

          {/* In-App Direct Confirmation Button */}
          <button
            type="button"
            onClick={handleInAppSubmit}
            disabled={cartItems.length === 0}
            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            تأكيد الطلب ومتابعة حالته في التطبيق
          </button>

          <span className="block text-center text-[10px] text-[#554336]">
            سيتم إرسال تفاصيل طلبك مباشرة لتجهيزه طازجاً في الفرن فوراً
          </span>
        </div>
      </section>
    </div>
  );
};
