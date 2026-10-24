import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MenuItem, Category, SpecialOffer, ItemSize } from '../data/menuData';
import {
  saveMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
  saveCategory,
  deleteCategory,
  saveSpecialOffer,
  deleteSpecialOffer,
  uploadPhotoToSupabase
} from '../services/menuService';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { categories, menuItems, specialOffers, reloadMenu } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('kingdom_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dishes' | 'categories' | 'offers' | 'sql'>('dishes');

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');

  // Dish Edit/Create Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Partial<MenuItem> | null>(null);
  const [customSizes, setCustomSizes] = useState<ItemSize[]>([]);
  const [hasSizes, setHasSizes] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Category Edit/Create State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isUploadingCategoryPhoto, setIsUploadingCategoryPhoto] = useState(false);

  // Offer Edit/Create State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer> | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'kingdom123' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kingdom_admin_auth', 'true');
      setLoginError(null);
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kingdom_admin_auth');
  };

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Dish Operations
  const openNewDishModal = () => {
    const defaultCat = categories[0]?.id || 'fresh';
    setEditingDish({
      id: '',
      name: '',
      category_id: defaultCat,
      price: 10,
      calories: '300',
      description: '',
      image_url: '',
      is_available: true,
      has_sizes: false,
      sizes: [],
      is_bestseller: false,
      is_spicy: false,
      is_veg: false,
      is_quick: false,
      is_family_box: false
    });
    setHasSizes(false);
    setCustomSizes([{ name: 'حجم صغير', price: 16 }, { name: 'حجم كبير', price: 20 }]);
    setIsDishModalOpen(true);
  };

  const openEditDishModal = (dish: MenuItem) => {
    setEditingDish({ ...dish });
    setHasSizes(Boolean(dish.has_sizes && dish.sizes && dish.sizes.length > 0));
    setCustomSizes(
      dish.sizes && dish.sizes.length > 0
        ? [...dish.sizes]
        : [{ name: 'حجم صغير', price: 16 }, { name: 'حجم كبير', price: 20 }]
    );
    setIsDishModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const publicUrl = await uploadPhotoToSupabase(file);
      setEditingDish(prev => prev ? { ...prev, image_url: publicUrl } : null);
      showStatus('تم رفع الصورة إلى سوبابيس بنجاح!');
    } catch (err: any) {
      showStatus(`فشل رفع الصورة: ${err.message || 'خطأ في سوبابيس'}`, 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.name?.trim()) {
      showStatus('يرجى كتابة اسم الصنف', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const cat = categories.find(c => c.id === editingDish.category_id);
      
      const payload: Partial<MenuItem> & { name: string; price: number } = {
        id: editingDish.id || `dish-${Date.now()}`,
        name: editingDish.name.trim(),
        category_id: editingDish.category_id || categories[0]?.id || 'fresh',
        category_name: cat?.name || '',
        price: hasSizes && customSizes.length > 0 ? customSizes[0].price : Number(editingDish.price) || 0,
        calories: editingDish.calories || '',
        description: editingDish.description || '',
        image_url: editingDish.image_url || '',
        is_available: editingDish.is_available !== false,
        has_sizes: hasSizes,
        sizes: hasSizes ? customSizes : [],
        is_bestseller: Boolean(editingDish.is_bestseller),
        is_spicy: Boolean(editingDish.is_spicy),
        is_veg: Boolean(editingDish.is_veg),
        is_quick: Boolean(editingDish.is_quick),
        is_family_box: Boolean(editingDish.is_family_box)
      };

      await saveMenuItem(payload);
      await reloadMenu();
      setIsDishModalOpen(false);
      showStatus('تم حفظ الصنف بنجاح في قاعدة بيانات سوبابيس');
    } catch (err: any) {
      showStatus(`فشل حفظ الصنف: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDish = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف صنف "${name}" نهائياً من سوبابيس؟`)) return;
    try {
      setActionLoading(true);
      await deleteMenuItem(id);
      await reloadMenu();
      showStatus(`تم حذف ${name} بنجاح`);
    } catch (err: any) {
      showStatus(`فشل الحذف: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await toggleItemAvailability(id, !current);
      await reloadMenu();
      showStatus(`تم ${!current ? 'تفعيل' : 'تعطيل'} توفر الصنف للعملاء`);
    } catch (err: any) {
      showStatus(`فشل التحديث: ${err.message}`, 'error');
    }
  };

  // Category Operations
  const handleCategoryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCategoryPhoto(true);
      const publicUrl = await uploadPhotoToSupabase(file);
      setEditingCategory((prev) => (prev ? { ...prev, image_url: publicUrl } : null));
      showStatus('تم رفع صورة القسم إلى سوبابيس بنجاح!');
    } catch (err: any) {
      showStatus(`فشل رفع صورة القسم: ${err.message || 'خطأ في سوبابيس'}`, 'error');
    } finally {
      setIsUploadingCategoryPhoto(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) return;

    try {
      setActionLoading(true);
      const catId = editingCategory.id?.trim() || `cat-${Date.now()}`;
      await saveCategory({
        id: catId,
        name: editingCategory.name.trim(),
        badge: editingCategory.badge?.trim() || '',
        image_url: editingCategory.image_url?.trim() || '',
        sort_order: Number(editingCategory.sort_order) || 0
      });
      await reloadMenu();
      setIsCategoryModalOpen(false);
      showStatus('تم حفظ التصنيف وصورته بنجاح في سوبابيس');
    } catch (err: any) {
      showStatus(`فشل حفظ التصنيف: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟`)) return;
    try {
      setActionLoading(true);
      await deleteCategory(id);
      await reloadMenu();
      showStatus('تم حذف التصنيف بنجاح');
    } catch (err: any) {
      showStatus(`فشل حذف التصنيف: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Offer Operations
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer?.title?.trim()) return;

    try {
      setActionLoading(true);
      await saveSpecialOffer({
        id: editingOffer.id || `offer-${Date.now()}`,
        title: editingOffer.title.trim(),
        badge: editingOffer.badge || '',
        description: editingOffer.description || '',
        original_price: Number(editingOffer.original_price) || 0,
        discounted_price: Number(editingOffer.discounted_price) || 0,
        calories: editingOffer.calories || '',
        image_url: editingOffer.image_url || '',
        items_included: editingOffer.items_included || [],
        is_available: editingOffer.is_available !== false
      });
      await reloadMenu();
      setIsOfferModalOpen(false);
      showStatus('تم حفظ العرض بنجاح في سوبابيس');
    } catch (err: any) {
      showStatus(`فشل حفظ العرض: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العرض؟')) return;
    try {
      setActionLoading(true);
      await deleteSpecialOffer(id);
      await reloadMenu();
      showStatus('تم حذف العرض بنجاح');
    } catch (err: any) {
      showStatus(`فشل حذف العرض: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered dishes for admin table
  const filteredDishes = menuItems.filter(dish => {
    const matchesSearch =
      dish.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCategory =
      adminCategoryFilter === 'all' || dish.category_id === adminCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // If Not Authenticated -> Show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#121c2a]/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#8d4b00] text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900">لوحة تحكم الإدارة</h2>
                <span className="text-[11px] text-slate-500">مملكة المعجنات - سوبابيس</span>
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

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kingdom123"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#8d4b00] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                كلمة المرور (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#8d4b00] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#8d4b00] text-white font-bold text-sm hover:bg-[#b15f00] transition-colors mt-2 shadow-md shadow-[#8d4b00]/20"
            >
              تسجيل الدخول للإدارة
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9ff] flex flex-col overflow-hidden">
      {/* Admin Top Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8d4b00] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-slate-900">لوحة تحكم مملكة المعجنات</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                متصل بـ Supabase
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              إدارة الأصناف، الأسعار، الصور، والتصنيفات في قاعدة البيانات مباشرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadMenu}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
            title="تحديث البيانات من سوبابيس"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center gap-1"
            title="تسجيل الخروج"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">خروج</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800"
            title="الرجوع للتطبيق"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Status Toast Banner */}
      {statusMessage && (
        <div
          className={`px-4 py-2.5 text-xs font-bold text-center transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 flex gap-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('dishes')}
          className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dishes'
              ? 'border-[#8d4b00] text-[#8d4b00]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bakery_dining</span>
          <span>إدارة الأصناف والفطائر ({menuItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-[#8d4b00] text-[#8d4b00]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">category</span>
          <span>التصنيفات ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'offers'
              ? 'border-[#8d4b00] text-[#8d4b00]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_offer</span>
          <span>العروض والجمعات ({specialOffers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sql')}
          className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-[#8d4b00] text-[#8d4b00]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">database</span>
          <span>أوامر SQL لقاعدة البيانات</span>
        </button>
      </div>

      {/* Main Admin Content Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full">
        {/* ================= DISHES TAB ================= */}
        {activeTab === 'dishes' && (
          <div className="flex flex-col gap-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute right-3 text-slate-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="search"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="ابحث عن صنف للتعديل أو الحذف..."
                    className="w-full h-10 pr-9 pl-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#8d4b00] outline-none"
                  />
                </div>

                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#8d4b00] outline-none"
                >
                  <option value="all">جميع التصنيفات</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={openNewDishModal}
                className="h-10 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b15f00] shadow-sm flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>إضافة صنف جديد</span>
              </button>
            </div>

            {/* Dishes Grid / Table */}
            {filteredDishes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <span className="material-symbols-outlined text-[40px] text-slate-300">
                  lunch_dining
                </span>
                <p className="font-bold text-sm text-slate-700 mt-2">لا توجد أصناف مطابقة</p>
                <p className="text-xs text-slate-400 mt-1">
                  تأكد من تشغيل أوامر SQL في سوبابيس أو اضغط "إضافة صنف جديد"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={`bg-white rounded-2xl p-3.5 border transition-all shadow-2xs flex flex-col justify-between gap-3 ${
                      dish.is_available ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {dish.image_url ? (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                        {!dish.is_available && (
                          <span className="absolute inset-0 bg-red-900/60 text-white text-[10px] font-bold flex items-center justify-center">
                            غير متوفر
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#8d4b00] font-semibold inline-block mt-0.5">
                          {dish.category_name || dish.category_id}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {dish.description || 'لا يوجد وصف'}
                        </p>
                      </div>
                    </div>

                    {/* Sizes / Price Info */}
                    <div className="bg-slate-50 rounded-xl p-2 text-xs flex items-center justify-between border border-slate-100">
                      <div>
                        {dish.has_sizes && dish.sizes && dish.sizes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {dish.sizes.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700"
                              >
                                {s.name}: <strong>{s.price} ر.س</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-bold text-[#8d4b00]">
                            {dish.price.toFixed(2)} ر.س
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dish.calories} سعرة
                      </span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-2">
                      {/* Availability Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(dish.id, dish.is_available)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                          dish.is_available
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        title="تغيير حالة توفر الصنف للعملاء"
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {dish.is_available ? 'check_circle' : 'cancel'}
                        </span>
                        <span>{dish.is_available ? 'متوفر للعملاء' : 'معطّل (غير متوفر)'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditDishModal(dish)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                          title="تعديل التفاصيل والصور"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id, dish.name)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="حذف نهائي"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CATEGORIES TAB ================= */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">أقسام وتصنيفات المنيو</h3>
                <p className="text-xs text-slate-500">
                  إضافة أو تعديل الأقسام الرئيسية التي تظهر بشريط التصنيفات للزبائن
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory({ id: '', name: '', badge: '', image_url: '', sort_order: categories.length + 1 });
                  setIsCategoryModalOpen(true);
                }}
                className="h-10 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#b15f00]"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>تصنيف جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">
                          photo_library
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{cat.name}</h4>
                      <span className="text-[11px] text-slate-500 block truncate">
                        المعرف: <code className="text-[#8d4b00]">{cat.id}</code>
                      </span>
                      {cat.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block mt-0.5">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory({ ...cat });
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                      title="تعديل القسم والصورة"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="حذف"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= OFFERS TAB ================= */}
        {activeTab === 'offers' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">إدارة العروض الترويجية</h3>
                <p className="text-xs text-slate-500">
                  العروض والبوكسات الخاصة التي تظهر في تبويب "العروض"
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingOffer({
                    id: '',
                    title: '',
                    badge: 'عرض خاص',
                    description: '',
                    original_price: 60,
                    discounted_price: 45,
                    calories: '1500',
                    image_url: '',
                    items_included: ['فطيرة كباب', 'مشروب غازي'],
                    is_available: true
                  });
                  setIsOfferModalOpen(true);
                }}
                className="h-10 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#b15f00]"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>عرض جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {specialOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block mt-0.5">
                        {offer.badge}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-xs line-through text-slate-400 block">
                        {offer.original_price} ر.س
                      </span>
                      <span className="font-bold text-[#8d4b00] text-sm">
                        {offer.discounted_price} ر.س
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{offer.description}</p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOffer({ ...offer });
                        setIsOfferModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SQL QUERY TAB ================= */}
        {activeTab === 'sql' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  كود SQL الكامل لإنشاء جداول سوبابيس (Supabase Schema & Seed)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  قم بنسخ هذا الكود بالكامل ولصقه في <strong>Supabase SQL Editor</strong> والضغط
                  على <strong>Run</strong> لإنشاء الجداول وسياسات الحماية ورفع جميع الأصناف.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  fetch('/supabase_setup.sql')
                    .then(r => r.text())
                    .then(code => {
                      navigator.clipboard.writeText(code);
                      showStatus('تم نسخ استعلام SQL بالكامل إلى الحافظة!');
                    })
                    .catch(() => showStatus('يرجى نسخ الكود من النافذة', 'error'));
                }}
                className="px-4 py-2 rounded-xl bg-[#8d4b00] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#b15f00]"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>نسخ كود SQL</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px] dir-ltr text-left">
              <pre>{`-- 1. Create Categories Table (With image_url support)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    badge TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT DEFAULT '',
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    calories TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_available BOOLEAN DEFAULT TRUE,
    has_sizes BOOLEAN DEFAULT FALSE,
    sizes JSONB DEFAULT '[]'::jsonb,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_veg BOOLEAN DEFAULT FALSE,
    is_quick BOOLEAN DEFAULT FALSE,
    is_family_box BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Special Offers Table
CREATE TABLE IF NOT EXISTS public.special_offers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    badge TEXT DEFAULT '',
    description TEXT DEFAULT '',
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discounted_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    calories TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    items_included JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS & Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public can view special_offers" ON public.special_offers FOR SELECT USING (true);

CREATE POLICY "Allow anon all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on special_offers" ON public.special_offers FOR ALL USING (true) WITH CHECK (true);

-- 5. Create 'photos' Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Allow upload to photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Allow update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos');
CREATE POLICY "Allow delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos');`}</pre>
            </div>
          </div>
        )}
      </div>

      {/* ================= EDIT/CREATE DISH MODAL ================= */}
      {isDishModalOpen && editingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingDish.id ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="flex flex-col gap-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    اسم الصنف *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDish.name || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    placeholder="مثال: فطيرة كباب دجاج"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#8d4b00] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    التصنيف *
                  </label>
                  <select
                    value={editingDish.category_id || categories[0]?.id}
                    onChange={(e) => setEditingDish({ ...editingDish, category_id: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#8d4b00] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-2">
                <label className="block text-xs font-bold text-slate-800">
                  صورة الصنف (Supabase Storage: bucket 'photos')
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {editingDish.image_url ? (
                    <img
                      src={editingDish.image_url}
                      alt="preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}

                  <div className="flex-1 w-full flex flex-col gap-2">
                    <label className="cursor-pointer h-10 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#8d4b00] text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-2xs">
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>
                        {isUploadingPhoto ? 'جاري الرفع إلى سوبابيس...' : 'رفع صورة من جهازك'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={editingDish.image_url || ''}
                      onChange={(e) => setEditingDish({ ...editingDish, image_url: e.target.value })}
                      placeholder="أو الصق رابط الصورة المباشر هنا..."
                      className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:border-[#8d4b00] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sizing & Pricing Configuration */}
              <div className="bg-[#eff4ff] p-3.5 rounded-2xl border border-[#e6eeff] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      خيارات الأحجام والمقاسات (Sizes)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      اختر إذا كان الصنف له حجم موحد أو مقاسات متعددة (مثل صغير / كبير)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasSizes(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !hasSizes
                          ? 'bg-[#8d4b00] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      سعر موحد
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSizes(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        hasSizes
                          ? 'bg-[#8d4b00] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      مقاسات متعددة
                    </button>
                  </div>
                </div>

                {!hasSizes ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        السعر بالريال (SAR) *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={editingDish.price || 0}
                        onChange={(e) =>
                          setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-sm focus:border-[#8d4b00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        السعرات الحرارية
                      </label>
                      <input
                        type="text"
                        value={editingDish.calories || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, calories: e.target.value })}
                        placeholder="مثال: 450"
                        className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-sm focus:border-[#8d4b00] outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-700">
                      قائمة الأحجام المتاحة لهذا الصنف:
                    </span>
                    {customSizes.map((size, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={size.name}
                          onChange={(e) => {
                            const next = [...customSizes];
                            next[idx].name = e.target.value;
                            setCustomSizes(next);
                          }}
                          placeholder="اسم المقاس (مثل: حجم صغير)"
                          className="flex-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs outline-none"
                        />
                        <div className="relative w-28">
                          <input
                            type="number"
                            step="0.5"
                            value={size.price}
                            onChange={(e) => {
                              const next = [...customSizes];
                              next[idx].price = parseFloat(e.target.value) || 0;
                              setCustomSizes(next);
                            }}
                            className="w-full h-9 px-2 rounded-lg bg-white border border-slate-200 text-xs outline-none"
                          />
                          <span className="absolute left-2 top-2 text-[10px] text-slate-400">
                            ر.س
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomSizes(customSizes.filter((_, i) => i !== idx));
                          }}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setCustomSizes([
                          ...customSizes,
                          { name: `مقاس ${customSizes.length + 1}`, price: 15 }
                        ]);
                      }}
                      className="self-start text-xs font-bold text-[#8d4b00] flex items-center gap-1 hover:underline pt-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>إضافة حجم آخر</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الوصف والمكونات
                </label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  placeholder="وصف مختصر لمكونات الفطيرة وطريقة التحضير..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#8d4b00] outline-none resize-none"
                />
              </div>

              {/* Dish Availability Toggle & Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      حالة التوفر للزبائن (Availability)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      عند التعطيل، سيظهر الصنف كـ "غير متوفر" للزبائن ولن يستطيعوا طلبه
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.is_available !== false}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, is_available: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Tags Switches */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingDish.is_bestseller)}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, is_bestseller: e.target.checked })
                      }
                      className="rounded text-[#8d4b00]"
                    />
                    <span>الأكثر طلباً ⭐</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingDish.is_veg)}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, is_veg: e.target.checked })
                      }
                      className="rounded text-[#006e2d]"
                    />
                    <span>نباتي 🌿</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingDish.is_spicy)}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, is_spicy: e.target.checked })
                      }
                      className="rounded text-red-600"
                    />
                    <span>حار سبايسي 🔥</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingDish.is_quick)}
                      onChange={(e) =>
                        setEditingDish({ ...editingDish, is_quick: e.target.checked })
                      }
                      className="rounded text-[#8d4b00]"
                    />
                    <span>سريع (&lt;20 د) ⏱️</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00] disabled:opacity-50 shadow-md"
                >
                  {actionLoading ? 'جاري الحفظ في سوبابيس...' : 'حفظ الصنف في قاعدة البيانات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT/CREATE CATEGORY MODAL ================= */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingCategory.id ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  معرّف التصنيف (ID بالإنجليزية) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.id || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                  placeholder="مثال: grills أو fresh"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم التصنيف بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="مثال: المشويات الملكية"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  البادج المصاحب (Badge)
                </label>
                <input
                  type="text"
                  value={editingCategory.badge || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value })}
                  placeholder="مثال: طازج من الفرن"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              {/* Category Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  صورة القسم / التصنيف (التي تظهر للزبائن في المنيو)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {editingCategory.image_url ? (
                      <img
                        src={editingCategory.image_url}
                        alt="معاينة صورة القسم"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-[26px]">
                        image
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                      <span>
                        {isUploadingCategoryPhoto ? 'جاري الرفع إلى سوبابيس...' : 'رفع صورة من الجهاز'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingCategoryPhoto}
                        onChange={handleCategoryPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={editingCategory.image_url || ''}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, image_url: e.target.value })
                      }
                      placeholder="أو ضع رابط صورة مباشر (URL)..."
                      className="w-full h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00]"
                >
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT/CREATE OFFER MODAL ================= */}
      {isOfferModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingOffer.id ? 'تعديل العرض' : 'إضافة عرض خاص جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان العرض *
                </label>
                <input
                  type="text"
                  required
                  value={editingOffer.title || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="مثال: عرض الجمعات الملكي"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    السعر الأصلي (ر.س)
                  </label>
                  <input
                    type="number"
                    value={editingOffer.original_price || 0}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, original_price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    سعر العرض المخفض *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingOffer.discounted_price || 0}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, discounted_price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  وصف العرض
                </label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رابط صورة العرض
                </label>
                <input
                  type="url"
                  value={editingOffer.image_url || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, image_url: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#b15f00]"
                >
                  حفظ العرض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
