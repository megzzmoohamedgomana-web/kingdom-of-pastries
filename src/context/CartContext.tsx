import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, Branch, BRANCHES, Category, SpecialOffer, ItemSize } from '../data/menuData';
import { fetchCategories, fetchMenuItems, fetchSpecialOffers } from '../services/menuService';

export type OrderType = 'delivery' | 'pickup' | 'dinein';

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  selectedSize?: ItemSize;
  notes?: string;
}

export type OrderStatus = 'received' | 'baking' | 'packaging' | 'ready' | 'completed';

export interface SubmittedOrder {
  id: string;
  orderNumber: string;
  timestamp: string;
  orderType: OrderType;
  branch: Branch;
  items: CartItemEntry[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  address?: string;
  tableNumber?: string;
  pickupTime?: string;
  notes?: string;
  status: OrderStatus;
  statusProgress: number;
}

interface CartContextType {
  cart: Record<string, CartItemEntry>;
  orderType: OrderType;
  selectedBranch: Branch;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    tableNumber: string;
    pickupTime: string;
    notes: string;
  };
  orders: SubmittedOrder[];
  isCheckoutOpen: boolean;
  activeTab: 'menu' | 'offers' | 'orders' | 'cart';
  activeFilter: string;
  searchQuery: string;
  // Supabase dynamic data
  categories: Category[];
  menuItems: MenuItem[];
  specialOffers: SpecialOffer[];
  isLoadingMenu: boolean;
  menuError: string | null;
  reloadMenu: () => Promise<void>;
  // Cart Actions
  addToCart: (item: MenuItem, qty?: number, selectedSize?: ItemSize) => void;
  updateQuantity: (cartKey: string, delta: number) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setSelectedBranch: (branch: Branch) => void;
  setCustomerInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    address: string;
    tableNumber: string;
    pickupTime: string;
    notes: string;
  }>>;
  setIsCheckoutOpen: (open: boolean) => void;
  setActiveTab: (tab: 'menu' | 'offers' | 'orders' | 'cart') => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (q: string) => void;
  placeOrder: (viaWhatsApp?: boolean) => SubmittedOrder;
  totalItemsCount: number;
  subtotal: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ORDERS = 'kingdom_pastries_orders_v1';
const LOCAL_STORAGE_KEY_CUSTOMER = 'kingdom_pastries_customer_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Empty initial cart per user request
  const [cart, setCart] = useState<Record<string, CartItemEntry>>({});

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'offers' | 'orders' | 'cart'>('menu');
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

  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOMER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: '',
      phone: '',
      address: '',
      tableNumber: '',
      pickupTime: 'بعد 15 دقيقة (فوراً)',
      notes: ''
    };
  });

  const [orders, setOrders] = useState<SubmittedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Save customer info to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMER, JSON.stringify(customerInfo));
    } catch {
      // ignore
    }
  }, [customerInfo]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Simulate order baking progress periodically for active orders
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.status === 'completed') return order;
          const nextProgress = Math.min(order.statusProgress + 5, 100);
          let nextStatus: OrderStatus = order.status;
          if (nextProgress >= 90) nextStatus = 'completed';
          else if (nextProgress >= 65) nextStatus = 'ready';
          else if (nextProgress >= 30) nextStatus = 'baking';
          else nextStatus = 'received';
          return {
            ...order,
            statusProgress: nextProgress,
            status: nextStatus
          };
        })
      );
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item: MenuItem, qty: number = 1, selectedSize?: ItemSize) => {
    // Unique key considering selected size
    const cartKey = selectedSize ? `${item.id}-${selectedSize.name}` : item.id;
    const itemPrice = selectedSize ? selectedSize.price : item.price;
    const itemName = selectedSize ? `${item.name} (${selectedSize.name})` : item.name;

    const cartItem: MenuItem = {
      ...item,
      name: itemName,
      price: itemPrice
    };

    setCart(prev => {
      const existing = prev[cartKey];
      const newQty = existing ? existing.quantity + qty : qty;
      return {
        ...prev,
        [cartKey]: {
          item: cartItem,
          quantity: newQty,
          selectedSize
        }
      };
    });
  };

  const updateQuantity = (cartKey: string, delta: number) => {
    setCart(prev => {
      const current = prev[cartKey];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[cartKey];
        return next;
      }
      return {
        ...prev,
        [cartKey]: {
          ...current,
          quantity: newQty
        }
      };
    });
  };

  const removeFromCart = (cartKey: string) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[cartKey];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const totalItemsCount = Object.values(cart).reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = Object.values(cart).reduce((sum, entry) => sum + entry.quantity * entry.item.price, 0);
  const totalPrice = subtotal;

  const placeOrder = (viaWhatsApp: boolean = false): SubmittedOrder => {
    const orderItems = Object.values(cart).filter(e => e.quantity > 0);
    const orderNum = `#KP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `اليوم، ${now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: SubmittedOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      timestamp: timeString,
      orderType,
      branch: selectedBranch,
      items: orderItems,
      totalAmount: totalPrice,
      customerName: customerInfo.name.trim() || 'عميل مملكة المعجنات',
      customerPhone: customerInfo.phone.trim(),
      address: orderType === 'delivery' ? customerInfo.address.trim() : undefined,
      tableNumber: orderType === 'dinein' ? customerInfo.tableNumber.trim() : undefined,
      pickupTime: orderType === 'pickup' ? customerInfo.pickupTime : undefined,
      notes: customerInfo.notes.trim(),
      status: 'received',
      statusProgress: 15
    };

    setOrders(prev => [newOrder, ...prev]);

    if (viaWhatsApp) {
      const orderTypeArabic =
        orderType === 'delivery' ? 'توصيل' :
        orderType === 'pickup' ? 'استلام من الفرع' : 'داخل المحل';

      let locationText = '';
      if (orderType === 'delivery') {
        locationText = `\n📍 *عنوان التوصيل:* ${customerInfo.address.trim() || 'سيتم إرسال اللوكيشن عبر المحادثة'}`;
      } else if (orderType === 'dinein') {
        locationText = `\n🪑 *رقم الطاولة:* ${customerInfo.tableNumber.trim() || 'داخل الصالة'}`;
      } else {
        locationText = `\n⏱️ *وقت الاستلام:* ${customerInfo.pickupTime}`;
      }

      const itemsLines = orderItems
        .map(e => `▫️ *${e.quantity}x* ${e.item.name} (${(e.quantity * e.item.price).toFixed(2)} ر.س)`)
        .join('\n');

      const message =
`السلام عليكم ورحمة الله،
أود تأكيد الطلب *${orderNum}* من *مملكة المعجنات* 👑

🏪 *الفرع:* ${selectedBranch.name}
🛵 *نوع الطلب:* ${orderTypeArabic}${locationText}
👤 *الاسم:* ${customerInfo.name.trim() || 'عميل مملكة المعجنات'}
📱 *الجوال:* ${customerInfo.phone.trim() || 'نفس رقم الواتساب'}

📋 *الأصناف المطلوبة:*
${itemsLines}

💰 *الإجمالي النهائي:* ${totalPrice.toFixed(2)} ر.س
(الأسعار شاملة ضريبة القيمة المضافة 15%)
${customerInfo.notes.trim() ? `\n📝 *ملاحظات خاصة:* ${customerInfo.notes.trim()}` : ''}

شكراً لكم وبانتظار بدء تجهيز الطلب! ✨`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${selectedBranch.whatsapp}?text=${encoded}`;

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    clearCart();
    setIsCheckoutOpen(false);
    setActiveTab('orders');
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orderType,
        selectedBranch,
        customerInfo,
        orders,
        isCheckoutOpen,
        activeTab,
        activeFilter,
        searchQuery,
        categories,
        menuItems,
        specialOffers,
        isLoadingMenu,
        menuError,
        reloadMenu,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setOrderType,
        setSelectedBranch,
        setCustomerInfo,
        setIsCheckoutOpen,
        setActiveTab,
        setActiveFilter,
        setSearchQuery,
        placeOrder,
        totalItemsCount,
        subtotal,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
