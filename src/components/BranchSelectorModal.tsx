import React from 'react';
import { BRANCHES, Branch } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface BranchSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({ isOpen, onClose }) => {
  const { selectedBranch, setSelectedBranch } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8d4b00]">store</span>
            <h3 className="font-bold text-lg text-slate-800">اختر الفرع الأقرب إليك</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Branches List */}
        <div className="overflow-y-auto py-3 space-y-2.5">
          {BRANCHES.map((branch) => {
            const isSelected = selectedBranch.id === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-[#8d4b00] bg-[#ffdcc3]/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#8d4b00]/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isSelected ? 'text-[#8d4b00]' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{branch.name}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    {branch.isOpen ? 'مفتوح الآن' : 'مغلق'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 pr-7">{branch.address}</p>

                <div className="flex items-center justify-between pt-1 pr-7 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {branch.hours}
                  </span>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#8d4b00] hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">map</span>
                    <span>الاتجاهات</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-sm hover:bg-[#b15f00] transition-colors"
          >
            تأكيد الاختيار
          </button>
        </div>
      </div>
    </div>
  );
};
