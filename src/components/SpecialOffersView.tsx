import React from 'react';
import { SpecialOffer } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const SpecialOffersView: React.FC = () => {
  const { specialOffers, addToCart, setIsCheckoutOpen } = useCart();

  const handleAddOffer = (offer: SpecialOffer) => {
    // Add combo representation as MenuItem
    addToCart({
      id: offer.id,
      category_id: 'family',
      category_name: 'عروض خاصة',
      name: offer.title,
      price: offer.discounted_price,
      calories: offer.calories,
      description: offer.description,
      image_url: offer.image_url,
      is_available: true,
      is_family_box: true
    });
    setIsCheckoutOpen(true);
  };

  const availableOffers = specialOffers.filter((o) => o.is_available !== false);

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-28 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-[#8d4b00] to-[#b15f00] text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-xs inline-block mb-1.5">
            عروض حصرية لفترة محدودة
          </span>
          <h2 className="text-xl font-bold">باقات التوفير والجمعات 🥐</h2>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            استمتع بأشهى تشكيلات الفطائر والمعجنات الملكية مع خصومات تصل إلى 30%
          </p>
        </div>
        <span className="material-symbols-outlined text-[100px] text-white/10 absolute -left-4 -bottom-4 pointer-events-none">
          local_offer
        </span>
      </div>

      {/* Offers Cards */}
      {availableOffers.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
          <span className="material-symbols-outlined text-[40px] text-slate-300">
            local_offer
          </span>
          <h3 className="font-bold text-sm text-slate-700 mt-2">لا توجد عروض نشطة حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">ترقبوا عروض نهاية الأسبوع قريباً!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {availableOffers.map((offer) => (
            <article
              key={offer.id}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(180,130,80,0.08)] border border-slate-100 flex flex-col gap-3"
            >
              {/* Image */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#e6eeff]">
                {offer.image_url ? (
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ffdcc3] to-[#eff4ff] text-[#8d4b00]">
                    <span className="material-symbols-outlined text-[48px]">local_offer</span>
                  </div>
                )}
                <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-[#006e2d] text-white text-xs font-bold shadow-md">
                  {offer.badge}
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-xs">
                  {offer.calories} سعرة
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#121c2a]">{offer.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 line-through">
                      {offer.original_price.toFixed(2)} ر.س
                    </span>
                    <span className="text-base font-bold text-[#8d4b00]">
                      {offer.discounted_price.toFixed(2)}{' '}
                      <span className="text-xs font-normal">ر.س</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#554336] leading-relaxed">{offer.description}</p>

                {/* Items included list */}
                {offer.items_included && offer.items_included.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      محتويات العرض:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {offer.items_included.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#eff4ff] text-[#554336] border border-[#e6eeff]"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-[#006e2d] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  شامل ضريبة 15%
                </span>

                <button
                  type="button"
                  onClick={() => handleAddOffer(offer)}
                  className="px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#b15f00] transition-transform active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  <span>أضف العرض واطلب</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
