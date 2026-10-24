import React from 'react';
import { BRANCHES } from '../data/menuData';

export const BranchesView: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-24 max-w-md mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl p-4 bg-[#8d4b00] text-white shadow-md flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[28px]">store</span>
        </div>
        <div>
          <h2 className="text-lg font-bold">فروع مملكة المعجنات</h2>
          <p className="text-xs text-white/80 mt-0.5">
            تفضل بزيارتنا واستمتع بأشهى الفطائر الطازجة من الفرن الحجري مباشرة
          </p>
        </div>
      </div>

      {/* Branches List */}
      <div className="flex flex-col gap-3">
        {BRANCHES.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d4b00] text-[20px]">
                  location_on
                </span>
                <h3 className="font-bold text-sm text-slate-900">{branch.name}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {branch.isOpen ? 'مفتوح الآن' : 'مغلق'}
              </span>
            </div>

            <p className="text-xs text-slate-600 pr-7 leading-relaxed">{branch.address}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 pr-7 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>{branch.hours}</span>
              </span>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#8d4b00] font-bold text-xs hover:bg-[#d9e3f6] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">map</span>
                <span>الاتجاهات على الخريطة</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
