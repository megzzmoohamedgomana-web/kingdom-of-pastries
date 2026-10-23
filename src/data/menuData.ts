export interface ItemSize {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  price: number;
  calories: string;
  description: string;
  image_url: string;
  is_available: boolean;
  has_sizes?: boolean;
  sizes?: ItemSize[];
  is_bestseller?: boolean;
  is_spicy?: boolean;
  is_veg?: boolean;
  is_quick?: boolean;
  is_family_box?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  badge?: string;
  sort_order?: number;
}

export interface SpecialOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  original_price: number;
  discounted_price: number;
  calories: string;
  image_url: string;
  items_included: string[];
  is_available: boolean;
  sort_order?: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  district: string;
  phone: string;
  whatsapp: string;
  address: string;
  isOpen: boolean;
  hours: string;
  mapUrl: string;
}

export const BRANCHES: Branch[] = [
  {
    id: 'dammam-shatee',
    name: 'فرع الدمام - حي الشاطئ',
    city: 'الدمام',
    district: 'حي الشاطئ',
    phone: '0553856006',
    whatsapp: '966553856006',
    address: 'شارع الأمير نايف بن عبدالعزيز، بجوار الممشى، حي الشاطئ، الدمام',
    isOpen: true,
    hours: 'مفتوح 24 ساعة (طوال أيام الأسبوع)',
    mapUrl: 'https://www.google.com/maps?daddr=26.429783389013608,50.06738620070687'
  },
  {
    id: 'khobar-olaya',
    name: 'فرع الخبر - حي العليا',
    city: 'الخبر',
    district: 'حي العليا',
    phone: '0553856006',
    whatsapp: '966553856006',
    address: 'طريق الملك سعود، مقابل الراشد مول، الخبر',
    isOpen: true,
    hours: '6:00 ص - 2:00 ص',
    mapUrl: 'https://maps.google.com'
  },
  {
    id: 'dammam-faisaliyah',
    name: 'فرع الدمام - حي الفيصلية',
    city: 'الدمام',
    district: 'حي الفيصلية',
    phone: '0553856006',
    whatsapp: '966553856006',
    address: 'شارع عمر بن الخطاب، حي الفيصلية، الدمام',
    isOpen: true,
    hours: '24 ساعة',
    mapUrl: 'https://maps.google.com'
  },
  {
    id: 'dhahran-doha',
    name: 'فرع الظهران - حي الدوحة',
    city: 'الظهران',
    district: 'حي الدوحة',
    phone: '0553856006',
    whatsapp: '966553856006',
    address: 'شارع عبد الله بن عباس، حي الدوحة الجنوبية',
    isOpen: true,
    hours: '6:00 ص - 1:00 ص',
    mapUrl: 'https://maps.google.com'
  },
  {
    id: 'riyadh-sulaimaniyah',
    name: 'فرع الرياض - حي السليمانية',
    city: 'الرياض',
    district: 'حي السليمانية',
    phone: '0553856006',
    whatsapp: '966553856006',
    address: 'طريق الأمير محمد بن عبد العزيز (التحلية)',
    isOpen: true,
    hours: '24 ساعة',
    mapUrl: 'https://maps.google.com'
  }
];

// Helper functions for mapping database records
export function mapDbMenuItem(dbRow: any): MenuItem {
  let sizes: ItemSize[] = [];
  if (Array.isArray(dbRow.sizes)) {
    sizes = dbRow.sizes;
  } else if (typeof dbRow.sizes === 'string') {
    try {
      sizes = JSON.parse(dbRow.sizes);
    } catch {
      sizes = [];
    }
  }

  return {
    id: String(dbRow.id),
    category_id: String(dbRow.category_id || ''),
    category_name: dbRow.category_name || '',
    name: dbRow.name || '',
    price: Number(dbRow.price) || 0,
    calories: String(dbRow.calories || ''),
    description: dbRow.description || '',
    image_url: dbRow.image_url || '',
    is_available: dbRow.is_available !== false,
    has_sizes: Boolean(dbRow.has_sizes),
    sizes,
    is_bestseller: Boolean(dbRow.is_bestseller),
    is_spicy: Boolean(dbRow.is_spicy),
    is_veg: Boolean(dbRow.is_veg),
    is_quick: Boolean(dbRow.is_quick),
    is_family_box: Boolean(dbRow.is_family_box),
    sort_order: Number(dbRow.sort_order) || 0,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at
  };
}

export function mapDbOffer(dbRow: any): SpecialOffer {
  let items_included: string[] = [];
  if (Array.isArray(dbRow.items_included)) {
    items_included = dbRow.items_included;
  } else if (typeof dbRow.items_included === 'string') {
    try {
      items_included = JSON.parse(dbRow.items_included);
    } catch {
      items_included = [];
    }
  }

  return {
    id: String(dbRow.id),
    title: dbRow.title || '',
    badge: dbRow.badge || '',
    description: dbRow.description || '',
    original_price: Number(dbRow.original_price) || 0,
    discounted_price: Number(dbRow.discounted_price) || 0,
    calories: String(dbRow.calories || ''),
    image_url: dbRow.image_url || '',
    items_included,
    is_available: dbRow.is_available !== false,
    sort_order: Number(dbRow.sort_order) || 0
  };
}
