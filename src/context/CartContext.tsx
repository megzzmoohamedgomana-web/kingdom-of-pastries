import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, Branch, BRANCHES, Category, SpecialOffer } from '../data/menuData';
import { fetchCategories, fetchMenuItems, fetchSpecialOffers } from '../services/menuService';

interface MenuContextType {
  selectedBranch: Branch;
  activeTab: 'menu' | 'offers' | 'branches';
  activeFilter: string;
  searchQuery: string;
  // Supabase dynamic data
  categories: Category[];
  menuItems: MenuItem[];
  specialOffers: SpecialOffer[];
  isLoadingMenu: boolean;
  menuError: string | null;
  reloadMenu: () => Promise<void>;
  setSelectedBranch: (branch: Branch) => void;
  setActiveTab: (tab: 'menu' | 'offers' | 'branches') => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (q: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [activeTab, setActiveTab] = useState<'menu' | 'offers' | 'branches'>('menu');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Supabase State
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const reloadMenu = useCallback(async () => {
    try {
      setIsLoadingMenu(true);
      setMenuError(null);

      const [cats, items, offers] = await Promise.all([
        fetchCategories().catch(err => {
          console.warn('Categories fetch error:', err);
          return [];
        }),
        fetchMenuItems(false).catch(err => {
          console.warn('Menu items fetch error:', err);
          return [];
        }),
        fetchSpecialOffers(false).catch(err => {
          console.warn('Offers fetch error:', err);
          return [];
        })
      ]);

      setCategories(cats);
      setMenuItems(items);
      setSpecialOffers(offers);
    } catch (err: any) {
      console.error('Failed to load menu from Supabase:', err);
      setMenuError(err.message || 'فشل في تحميل البيانات من قاعدة البيانات');
    } finally {
      setIsLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    reloadMenu();
  }, [reloadMenu]);

  return (
    <MenuContext.Provider
      value={{
        selectedBranch,
        activeTab,
        activeFilter,
        searchQuery,
        categories,
        menuItems,
        specialOffers,
        isLoadingMenu,
        menuError,
        reloadMenu,
        setSelectedBranch,
        setActiveTab,
        setActiveFilter,
        setSearchQuery
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
