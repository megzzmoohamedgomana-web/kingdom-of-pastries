import { supabase, STORAGE_BUCKET } from '../utils/supabase';
import { MenuItem, Category, SpecialOffer, mapDbMenuItem, mapDbOffer } from '../data/menuData';

// Fetch all active categories from Supabase
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories from Supabase:', error);
    throw error;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    badge: row.badge || '',
    sort_order: row.sort_order || 0
  }));
}

// Fetch all menu items from Supabase
export async function fetchMenuItems(onlyAvailable: boolean = false): Promise<MenuItem[]> {
  let query = supabase
    .from('menu_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (onlyAvailable) {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching menu items from Supabase:', error);
    throw error;
  }

  return (data || []).map(mapDbMenuItem);
}

// Fetch special offers from Supabase
export async function fetchSpecialOffers(onlyAvailable: boolean = false): Promise<SpecialOffer[]> {
  let query = supabase
    .from('special_offers')
    .select('*')
    .order('sort_order', { ascending: true });

  if (onlyAvailable) {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching offers from Supabase:', error);
    throw error;
  }

  return (data || []).map(mapDbOffer);
}

// Add or update a menu item
export async function saveMenuItem(item: Partial<MenuItem> & { name: string; price: number }): Promise<MenuItem> {
  const id = item.id || `dish-${Date.now()}`;
  const payload = {
    id,
    category_id: item.category_id,
    category_name: item.category_name || '',
    name: item.name,
    price: item.price,
    calories: item.calories || '',
    description: item.description || '',
    image_url: item.image_url || '',
    is_available: item.is_available !== false,
    has_sizes: Boolean(item.has_sizes),
    sizes: item.sizes || [],
    is_bestseller: Boolean(item.is_bestseller),
    is_spicy: Boolean(item.is_spicy),
    is_veg: Boolean(item.is_veg),
    is_quick: Boolean(item.is_quick),
    is_family_box: Boolean(item.is_family_box),
    sort_order: item.sort_order || 0,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('menu_items')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error saving menu item:', error);
    throw error;
  }

  return mapDbMenuItem(data);
}

// Quick toggle item availability
export async function toggleItemAvailability(id: string, is_available: boolean): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error toggling availability:', error);
    throw error;
  }
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

// Add or update category
export async function saveCategory(category: Category): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .upsert({
      id: category.id,
      name: category.name,
      badge: category.badge || '',
      sort_order: category.sort_order || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving category:', error);
    throw error;
  }

  return data;
}

// Delete category
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Add or update special offer
export async function saveSpecialOffer(offer: Partial<SpecialOffer> & { title: string }): Promise<SpecialOffer> {
  const id = offer.id || `offer-${Date.now()}`;
  const payload = {
    id,
    title: offer.title,
    badge: offer.badge || '',
    description: offer.description || '',
    original_price: offer.original_price || 0,
    discounted_price: offer.discounted_price || 0,
    calories: offer.calories || '',
    image_url: offer.image_url || '',
    items_included: offer.items_included || [],
    is_available: offer.is_available !== false,
    sort_order: offer.sort_order || 0
  };

  const { data, error } = await supabase
    .from('special_offers')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error saving special offer:', error);
    throw error;
  }

  return mapDbOffer(data);
}

// Delete special offer
export async function deleteSpecialOffer(id: string): Promise<void> {
  const { error } = await supabase
    .from('special_offers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting special offer:', error);
    throw error;
  }
}

// Upload photo to Supabase storage 'photos' bucket
export async function uploadPhotoToSupabase(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `dish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const filePath = `dishes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Error uploading photo to Supabase:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
