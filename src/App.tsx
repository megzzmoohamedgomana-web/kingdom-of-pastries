/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { CategoryNav } from './components/CategoryNav';
import { FoodCard } from './components/FoodCard';
import { BottomNavBar } from './components/BottomNavBar';
import { SpecialOffersView } from './components/SpecialOffersView';
import { BranchesView } from './components/BranchesView';
import { BranchSelectorModal } from './components/BranchSelectorModal';
import { AdminPanel } from './components/AdminPanel';
import { DishDetailModal } from './components/DishDetailModal';
import { MenuItem } from './data/menuData';

const MainMenuCatalog: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const {
    searchQuery,
    activeFilter,
    categories,
    menuItems,
    isLoadingMenu,
    menuError,
    reloadMenu
  } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter (if selected)
      if (activeCategory && item.category_id !== activeCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = (item.category_name || item.category_id).toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [menuItems, activeCategory, searchQuery]);

  // If activeCategory is empty (''), all categories and items are shown
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById('catalog-content-start');
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Context & Search & Filters */}
      <SearchBarAndFilters onOpenBranchModal={() => setIsBranchModalOpen(true)} />

      {/* Sticky Categories Navigation (Dynamic from Supabase) */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Sections Container */}
      <div id="catalog-content-start" className="px-4 flex flex-col gap-6 pt-4 max-w-md mx-auto w-full">
        {/* Loading Skeleton */}
        {isLoadingMenu && (
          <div className="flex flex-col gap-3 py-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 rounded-full bg-slate-300 animate-pulse" />
              <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 shadow-xs border border-slate-100 flex gap-3 animate-pulse"
              >
                <div className="w-28 h-28 rounded-lg bg-slate-200 flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-slate-200 rounded-md w-16" />
                    <div className="w-9 h-9 rounded-lg bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Empty or Error State */}
        {!isLoadingMenu && menuItems.length === 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center flex flex-col items-center gap-3 my-4">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#8d4b00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">database</span>
            </div>
            <h3 className="font-bold text-base text-slate-800">
              قاعدة بيانات Supabase جاهزة
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              {menuError
                ? `تنبيه: ${menuError}. يرجى تشغيل استعلام SQL في سوبابيس لإنشاء الجداول.`
                : 'لم يتم العثور على أصناف في جدول menu_items حتى الآن. قم بنسخ استعلام SQL وتشغيله في Supabase SQL Editor أو إضافة أصناف عبر لوحة الإدارة.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs mt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex-1 py-2.5 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00] shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>فتح لوحة الإدارة (Admin)</span>
              </button>
              <button
                type="button"
                onClick={reloadMenu}
                className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Active Category Filter Indicator */}
        {activeCategory && (
          <div className="flex items-center justify-between bg-[#eff4ff] border border-[#e6eeff] px-3.5 py-2.5 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8d4b00] text-[18px]">
                filter_alt
              </span>
              <span className="text-xs font-bold text-[#121c2a]">
                عرض قسم:{' '}
                <span className="text-[#8d4b00]">
                  {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory('')}
              className="text-xs font-bold text-[#8d4b00] hover:text-[#b15f00] flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer transition-colors"
            >
              <span>عرض كل الأقسام</span>
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Empty state when filtering */}
        {!isLoadingMenu && menuItems.length > 0 && filteredItems.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100 my-4 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[44px] text-slate-400">
              {activeCategory ? 'inventory_2' : 'search_off'}
            </span>
            <h3 className="font-bold text-base text-slate-800">
              {activeCategory
                ? 'لا توجد أصناف في هذا القسم حالياً'
                : 'لا توجد نتائج مطابقة للبحث'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeCategory
                ? 'يمكنك التبديل إلى قسم آخر أو عرض جميع الأصناف'
                : 'جرب البحث بكلمات أخرى أو مسح نص البحث'}
            </p>
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory('')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00] cursor-pointer shadow-xs"
              >
                عرض كل الأقسام
              </button>
            )}
          </div>
        )}

        {/* Categories & Items from Supabase */}
        {!isLoadingMenu &&
          (activeCategory
            ? categories.filter((c) => c.id === activeCategory)
            : categories
          ).map((category) => {
            const sectionItems = filteredItems.filter(
              (item) => item.category_id === category.id
            );

            if (sectionItems.length === 0) return null;

            return (
              <section
                key={category.id}
                id={`section-${category.id}`}
                className="flex flex-col gap-3 scroll-mt-40"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 rounded-full bg-[#8d4b00]" />
                    <h2 className="font-bold text-lg text-[#121c2a]">
                      {category.name}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {sectionItems.length} {sectionItems.length === 1 ? 'صنف' : 'أصناف'}
                  </span>
                </div>

                {/* Items Grid */}
                <div className="flex flex-col gap-3">
                  {sectionItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      onClick={() => setSelectedDish(item)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
      </div>

      {/* Dish Details Modal */}
      <DishDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab } = useCart();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBranchesModalOpen, setIsBranchesModalOpen] = useState(false);

  // Check URL pathname or hash for /admin on load and listen to changes
  useEffect(() => {
    const checkAdminRoute = () => {
      const isPathAdmin =
        window.location.pathname.endsWith('/admin') || window.location.pathname === '/admin';
      const isHashAdmin =
        window.location.hash === '#admin' || window.location.hash.startsWith('#/admin');
      if (isPathAdmin || isHashAdmin) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.location.hash = '#admin';
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col antialiased selection:bg-[#ffdcc3] selection:text-[#2f1500]">
      {/* Header */}
      <Header onOpenAdmin={handleOpenAdmin} />

      {/* Main Menu Catalog View Area */}
      <main className="flex-1 w-full pt-[64px]">
        {activeTab === 'menu' && <MainMenuCatalog onOpenAdmin={handleOpenAdmin} />}
        {activeTab === 'offers' && <SpecialOffersView />}
        {activeTab === 'branches' && <BranchesView />}
      </main>

      {/* Persistent Bottom Tab Navigation Bar */}
      <BottomNavBar onOpenBranches={() => setIsBranchesModalOpen(true)} />

      {/* Branches Modal */}
      <BranchSelectorModal
        isOpen={isBranchesModalOpen}
        onClose={() => setIsBranchesModalOpen(false)}
      />

      {/* Admin Panel Modal / Screen */}
      {isAdminOpen && <AdminPanel onClose={handleCloseAdmin} />}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
