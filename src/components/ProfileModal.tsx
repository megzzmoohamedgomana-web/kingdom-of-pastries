import React from 'react';
import { useCart } from '../context/CartContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const { customerInfo, setCustomerInfo } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8d4b00] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">بيانات العميل</h3>
              <p className="text-xs text-slate-500">لحفظ بياناتك وتسريع طلباتك القادمة</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 py-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              الاسم الكريم *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: عبد الله الشمري"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#8d4b00] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              رقم الجوال للتأكيد *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs text-slate-500 font-mono" dir="ltr">
                +966
              </span>
              <input
                type="tel"
                dir="ltr"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="5XXXXXXXX"
                className="w-full h-11 pl-14 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm text-right focus:bg-white focus:border-[#8d4b00] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              عنوان التوصيل الافتراضي
            </label>
            <textarea
              rows={2}
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="مثال: حي الشاطئ، شارع الأمير نايف، بجوار الممشى..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#8d4b00] outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تفضيلات وملاحظات عامة على الخبز
            </label>
            <input
              type="text"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="مثال: تحمير زيادة، بدون بصل، صوص ثوم إضافي"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#8d4b00] outline-none transition-all"
            />
          </div>

          {/* Admin Panel Direct Entry */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAdmin) onOpenAdmin();
                else window.location.hash = '#admin';
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#8d4b00]">
                  admin_panel_settings
                </span>
                <span>لوحة تحكم الإدارة (Admin Panel)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">/admin</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-sm hover:bg-[#b15f00] transition-colors"
          >
            حفظ البيانات
          </button>
        </div>
      </div>
    </div>
  );
};
