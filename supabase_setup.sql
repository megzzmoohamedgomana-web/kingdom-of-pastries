-- ========================================================
-- مملكة المعجنات (Kingdom of Pastries) - Supabase Database Setup
-- Run this complete script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    badge TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    sizes JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "صغير", "price": 16}, {"name": "كبير", "price": 20}]
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

-- 4. Enable Row Level Security (RLS) & Public Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view menu_items" ON public.menu_items;
CREATE POLICY "Public can view menu_items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view special_offers" ON public.special_offers;
CREATE POLICY "Public can view special_offers" ON public.special_offers FOR SELECT USING (true);

-- Allow Public / Anon Insert, Update, Delete for Admin Panel
DROP POLICY IF EXISTS "Allow anon all on categories" ON public.categories;
CREATE POLICY "Allow anon all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on menu_items" ON public.menu_items;
CREATE POLICY "Allow anon all on menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on special_offers" ON public.special_offers;
CREATE POLICY "Allow anon all on special_offers" ON public.special_offers FOR ALL USING (true) WITH CHECK (true);

-- 5. Create Storage Bucket for 'photos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'photos' bucket
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow upload to photos" ON storage.objects;
CREATE POLICY "Allow upload to photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow update photos" ON storage.objects;
CREATE POLICY "Allow update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow delete photos" ON storage.objects;
CREATE POLICY "Allow delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos');


-- ========================================================
-- 6. Insert Default Categories
-- ========================================================
INSERT INTO public.categories (id, name, badge, sort_order) VALUES
('fresh', 'جديدنا كله فريش !', 'مخبوز طازج', 1),
('zaatar', 'الزعتر الأصيل', 'فرن حجري', 2),
('family', 'البيتزا والوجبات العائلية', 'مثالي للمشاركة', 3),
('falafel', 'فلافل ولبنة', 'بلدي فاخر', 4),
('cheese', 'الجبن والسبانخ', 'خلطات خاصة', 5),
('meat', 'المشويات واللحم', 'مشوي عالسيخ', 6),
('cafeteria', 'كافتيريا وصباح الملكة', 'فطور ملكي', 7),
('sweets-drinks', 'حلا والمشروبات', 'لذيذ ومنعش', 8)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    badge = EXCLUDED.badge,
    sort_order = EXCLUDED.sort_order;


-- ========================================================
-- 7. Insert All Dishes & Menu Items
-- ========================================================
INSERT INTO public.menu_items 
(id, category_id, category_name, name, price, calories, description, image_url, is_available, has_sizes, sizes, is_bestseller, is_spicy, is_veg, is_quick, is_family_box, sort_order) 
VALUES
-- جديدنا كله فريش !
('fresh-1', 'fresh', 'جديدنا كله فريش !', 'كباب دجاج ملغوم فطيرة', 14.00, '602', 'فطيرة كباب دجاج ملغومة طازجة مع صوص خاص وجبنة ذائبة في عجينة طازجة مقرمشة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg', true, false, '[]', true, false, false, true, false, 1),
('fresh-2', 'fresh', 'جديدنا كله فريش !', 'شيش طاووق ملغوم فطيرة', 14.00, '330', 'فطيرة شيش طاووق ملغومة فريش بتتبيلة ملكية مميزة مع صوص الثومية والجبن', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/J9rK9Xo_XK-el-Bob16Z.jpeg', true, false, '[]', true, false, false, true, false, 2),
('fresh-3', 'fresh', 'جديدنا كله فريش !', 'اللحسة', 10.00, '190 - 250', 'بيض مطبوخ بخلطة الجبن السائل على الطريقة التقليدية المحبوبة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/G594HQIkcLbnHOYEjHyB.jpeg', true, false, '[]', false, false, true, true, false, 3),
('fresh-4', 'fresh', 'جديدنا كله فريش !', 'تونة سبايسي', 12.00, '440', 'تونة متبلة حارة (Spicy) مع الخضار المتبلة ورشة صوص حار مميز', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/vnOes1uJOxLwg4jtjbcP.jpeg', true, false, '[]', false, true, false, true, false, 4),
('fresh-5', 'fresh', 'جديدنا كله فريش !', 'كبدة جبن', 14.00, '360', 'كبدة طازجة مع الجبن الكريمي مطهوة ببهارات شرقية فاخرة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/5KP5rgTRf7XLClHojZkA.png', true, false, '[]', true, false, false, true, false, 5),
('fresh-6', 'fresh', 'جديدنا كله فريش !', 'دجاج جبن', 12.00, '365', 'دجاج مفروم متبل بالجبن ومخبوز بفرن الحجر', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/B3NjvLRLm2kMjdAi3j42.jpeg', true, false, '[]', false, false, false, true, false, 6),
('fresh-7', 'fresh', 'جديدنا كله فريش !', 'بيض بالجبن', 10.00, '300', 'فطيرة بيض طازج مع جبن سائل ذائب وغني', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/Qjia5ER_witovRzN3_sD.jpeg', true, false, '[]', false, false, true, true, false, 7),
('fresh-8', 'fresh', 'جديدنا كله فريش !', 'شكشوكة عدني', 8.00, '350', 'شكشوكة بالطريقة العدنية الأصيلة مع الطماطم والكزبرة والبهار', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2CsHG1Nm2MgFPmOCeeeO.jpeg', true, false, '[]', false, false, true, true, false, 8),
('fresh-9', 'fresh', 'جديدنا كله فريش !', 'مسلوق سبيشل', 10.00, '137', 'بيض مسلوق متبل خاص مع رشة بهارات وزيت زيتون بكر', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/0pUWUWKggIiidwJprPO3.png', true, false, '[]', false, false, true, true, false, 9),
('fresh-10', 'fresh', 'جديدنا كله فريش !', 'مسخن', 10.00, '137', 'مسخن دجاج وبصل وسماق بلدي أصيل بزيت الزيتون الفلسطيني', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/HGFWILGTlMZx0kVIfDzs.jpeg', true, false, '[]', true, false, false, true, false, 10),
('fresh-11', 'fresh', 'جديدنا كله فريش !', 'كباب لحم ملغوم فطيرة', 14.00, '480', 'فطيرة كباب لحم ملغومة فريش مع خلطة طحينة وأجبان خاصة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg', true, false, '[]', true, false, false, true, false, 11),

-- الزعتر
('zaatar-1', 'zaatar', 'الزعتر', 'زعتر بلدي', 3.00, '660', 'منقوشة زعتر كلاسيكية مع زيت زيتون بكر ممتاز ومخبوزة في الفرن الحجري', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554474-1.jpg', true, false, '[]', false, false, true, true, false, 12),
('zaatar-2', 'zaatar', 'الزعتر', 'زعتر مملكة المعجنات', 6.00, '620', 'خلطة زعتر خاصة بالمملكة مع رشة سمسم وخضار مشكلة وجبن موزاريلا', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554557-2.jpg', true, false, '[]', true, false, true, true, false, 13),
('zaatar-3', 'zaatar', 'الزعتر', 'زعتر مشكل', 8.00, '620', 'زعتر مشكل مع إضافات جبنة وخضار طازجة مخبوزة حتى القرمشة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554687-3.jpg', true, false, '[]', false, false, true, true, false, 14),

-- فلافل ولبنة
('falafel-1', 'falafel', 'فلافل', 'فطيرة فلافل سادة', 5.00, '700', 'فطيرة فلافل سادة طازجة ومقرمشة مع طحينة وطماطم ومخلل', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641972211QEuV9C.jpeg', true, false, '[]', false, false, true, true, false, 15),
('falafel-2', 'falafel', 'فلافل', 'فلافل باللبنة', 8.00, '780', 'فلافل ذهبية مع اللبنة التركية الطازجة والنعناع', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554945-22.jpg', true, false, '[]', true, false, true, true, false, 16),
('falafel-3', 'falafel', 'فلافل', 'فلافل شيدر', 8.00, '820', 'فلافل مع جبن شيدر ذائب يمنحها قواماً كريمياً لا يقاوم', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555009-33.jpg', true, false, '[]', false, false, true, true, false, 17),
('labneh-1', 'falafel', 'لبنة', 'لبنة سادة', 7.00, '500', 'لبنة طازجة سادة مع قطرات زيت الزيتون البكر', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641974495grEitv.jpeg', true, false, '[]', false, false, true, true, false, 18),
('labneh-2', 'falafel', 'لبنة', 'لبنة بالجبن', 8.00, '580', 'مزيج اللبنة الحامضة مع الجبن الأبيض الكريمي', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555462-2.jpg', true, false, '[]', false, false, true, true, false, 19),
('labneh-3', 'falafel', 'لبنة', 'لبنة بالذرة', 9.00, '640', 'لبنة مع حبات الذرة الحلوة والموزاريلا', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555542-3.jpg', true, false, '[]', false, false, true, false, false, 20),
('labneh-4', 'falafel', 'لبنة', 'لبنة بالزعتر', 8.00, '520', 'لبنة متبلة بالزعتر الأخضر البلدي وزيت الزيتون', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555627-4.jpg', true, false, '[]', true, false, true, true, false, 21),
('labneh-5', 'falafel', 'لبنة', 'لبنة بالزيتون', 9.00, '510', 'لبنة مع شرائح الزيتون الأسود والأخضر المخلي', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555698-5.jpg', true, false, '[]', false, false, true, true, false, 22),
('labneh-6', 'falafel', 'لبنة', 'لبنة بالجبن والزعتر', 10.00, '610', 'مزيج ثلاثي شهي من اللبنة والجبن والزعتر البلدي', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612555954-8.jpg', true, false, '[]', false, false, true, true, false, 23),
('labneh-7', 'falafel', 'لبنة', 'لبنة بالجبن والبيض', 12.00, '630', 'لبنة غنية مع جبن وبيض مخفوق ومخبوز بالفرن', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612556038-9.jpg', true, false, '[]', false, false, true, false, false, 24),
('labneh-8', 'falafel', 'لبنة', 'لبنة جبن زيتون', 10.00, '590', 'لبنة وجبن وزيتون مشكل على العجينة المقرمشة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612556151-10.jpg', true, false, '[]', false, false, true, true, false, 25),

-- الجبن والسبانخ
('cheese-1', 'cheese', 'الجبن', 'الأجبان الثلاثة خبز بالثوم', 9.00, '573', 'تشكيلة أجبان فاخرة بخبز الثوم المميز والأعشاب الإيطالية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612553957-4.jpg', true, false, '[]', true, false, true, false, false, 26),
('cheese-2', 'cheese', 'الجبن', 'الأجبان الثلاثة خبز عادي', 8.00, '571', 'تشكيلة أجبان غنية بالعجينة الذهبية الكلاسيكية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612554060-5.jpg', true, false, '[]', false, false, true, false, false, 27),
('cheese-3', 'cheese', 'الجبن', 'جبن حلوم البستو', 12.00, '590', 'جبن حلوم مشوي مع صلصة البستو الإيطالية وقطع الطماطم الكرزية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/fPw-NpT1GnZobKJrAA2K.jpeg', true, false, '[]', true, false, true, false, false, 28),
('cheese-4', 'cheese', 'الجبن', 'جبن شيدر', 7.00, '540', 'فطيرة جبن شيدر بريطاني غنية ومذابة بالفرن', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612556509-1.jpg', true, false, '[]', false, false, true, true, false, 29),
('cheese-5', 'cheese', 'الجبن', 'جبن عكاوى بالحبة السودا', 8.00, '560', 'جبن عكاوي بلدي بحبة البركة الأصيلة على الطريقة الشامية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/rLTy59WBlqsalDL17g_W.jpg', true, false, '[]', false, false, true, true, false, 30),
('cheese-6', 'cheese', 'الجبن', 'جبن بالموزاريلا', 7.00, '520', 'جبن موزاريلا ذائب ومطاطي طازج من الفرن', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612556703-3.jpg', true, false, '[]', false, false, true, true, false, 31),
('cheese-7', 'cheese', 'الجبن', 'موزاريلا بالبيض', 10.00, '590', 'موزاريلا مع بيض طازج ورشة فلفل أسود', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/KRDIYHoAU4j4t4z2l4SQ.jpeg', true, false, '[]', false, false, true, false, false, 32),
('cheese-8', 'cheese', 'الجبن', 'جبن سائل', 8.00, '580', 'فطيرة جبن سائل كلاسيك دافئة وخفيفة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612557686-1.jpg', true, false, '[]', false, false, true, true, false, 33),
('cheese-9', 'cheese', 'الجبن', 'جبن سائل بالخضار', 9.00, '600', 'جبن سائل مع خضار مشكلة (طماطم، فلفل رومي، زيتون)', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612557892-2.jpg', true, false, '[]', false, false, true, true, false, 34),
('spinach-1', 'cheese', 'سبانخ', 'سبانخ جبن موزاريلا', 9.00, '540', 'سبانخ بلدية متبلة مع موزاريلا ذائبة ومحمصة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612565047-4.jpg', true, false, '[]', false, false, true, false, false, 35),
('spinach-2', 'cheese', 'سبانخ', 'سبانخ باللبنة', 9.00, '530', 'سبانخ حامضة مع لبنة طازجة وزيت زيتون', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612565087-5.jpg', true, false, '[]', false, false, true, false, false, 36),
('spinach-3', 'cheese', 'سبانخ', 'فطيرة سبانخ', 8.00, '450', 'سبانخ بلدية بالبصل والليمون والسماق البلدي', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/cWiHFeiNBMXukPi4WrEI.jpeg', true, false, '[]', false, false, true, true, false, 37),

-- المشويات واللحم
('meat-1', 'meat', 'لحم', 'لحم بالجبن و البيض', 12.00, '650', 'لحم مفروم طازج بالجبن والبيض المخفوق', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/BncMseRdiY9uUV7n4kaX.jpg', true, false, '[]', false, false, false, false, false, 38),
('meat-2', 'meat', 'لحم', 'لحم بالجبنة', 12.00, '580', 'صفيحة لحم بالجبن الذائب والتوابل الملكية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612566011-2.jpg', true, false, '[]', true, false, false, false, false, 39),
('meat-3', 'meat', 'لحم', 'لحم بالبيض', 12.00, '560', 'لحم مفروم متبل بالبيض المحمص في الفرن الحجري', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612566097-3.jpg', true, false, '[]', false, false, false, false, false, 40),
('meat-4', 'meat', 'لحم', 'لحم بالعجين', 10.00, '510', 'صفيحة لحم بالعجين دمشقية أصيلة بدبس الرمان والصنوبر', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/OtlX0Bkk_oC7QYTrvZ1K.jpg', true, false, '[]', true, false, false, false, false, 41),
('grill-1', 'meat', 'المشويات', 'كباب لحم فطيرة', 12.00, '280', 'فطيرة سيخ كباب لحم مشوي على الفحم بتتبيلة خاصة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/CX6S_BtqFZ75bFAj674g.jpeg', true, false, '[]', true, false, false, false, false, 42),
('grill-2', 'meat', 'المشويات', 'كباب لحم لبنة فطيرة', 13.00, '320', 'كباب لحم مشوي مع لبنة تركية طازجة ولمسة سماق', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/al7axbxyyXD6zKwaXHdc.jpeg', true, false, '[]', false, false, false, false, false, 43),
('grill-3', 'meat', 'المشويات', 'كباب لحم جبن فطيرة', 13.00, '534', 'كباب لحم مشوي مع جبن كيري وموزاريلا ذائب', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/ZLIAqH2_ZK48afCptZL3.jpeg', true, false, '[]', false, false, false, false, false, 44),
('grill-4', 'meat', 'المشويات', 'كباب دجاج فطيرة', 11.00, '488', 'فطيرة سيخ كباب دجاج مشوي متبل بالثوم والليمون', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/CX6S_BtqFZ75bFAj674g.jpeg', true, false, '[]', false, false, false, false, false, 45),
('grill-5', 'meat', 'المشويات', 'كباب دجاج لبنة فطيرة', 12.00, '481', 'كباب دجاج مشوي مع لبنة ناعمة وخضار متبلة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/al7axbxyyXD6zKwaXHdc.jpeg', true, false, '[]', false, false, false, false, false, 46),
('grill-6', 'meat', 'المشويات', 'كباب دجاج جبن فطيرة', 13.00, '550', 'كباب دجاج مشوي مع جبن ساخن بالعجينة المقرمشة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/ZLIAqH2_ZK48afCptZL3.jpeg', true, false, '[]', false, false, false, false, false, 47),
('grill-7', 'meat', 'المشويات', 'شيش طاووق فطيرة', 11.00, '580', 'أوصال شيش طاووق مشوية طازجة مع الثوم والمخلل', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/5Nmnk2NrHyM5-KmMx7D5.jpeg', true, false, '[]', true, false, false, false, false, 48),
('grill-8', 'meat', 'المشويات', 'شيش طاووق لبنة فطيرة', 12.00, '560', 'شيش طاووق مع لبنة طازجة في فطيرة ساخنة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/0e5ONPVG0UE9XN1VgXqo.png', true, false, '[]', false, false, false, false, false, 49),
('grill-9', 'meat', 'المشويات', 'شيش طاووق جبن فطيرة', 13.00, '540', 'شيش طاووق مع جبن كريمي ذائب وصوص الثوم', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/OTn21Xja-gmtTx7pHpMj.jpeg', true, false, '[]', false, false, false, false, false, 50),
('hotdog-1', 'meat', 'هوت دوج', 'فطيرة هوت دوج', 12.00, '570', 'فطيرة هوت دوج كلاسيك مع الكاتشب والخردل وموزاريلا', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1641972048Lyq3sg.jpeg', true, false, '[]', false, false, false, false, false, 51),
('hotdog-2', 'meat', 'هوت دوج', 'هوت دوج شيدر', 14.00, '680', 'هوت دوج مغطى بجبنة الشيدر الذائبة ومقرمش', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612568334-2.jpg', true, false, '[]', false, false, false, false, false, 52),

-- البيتزا والوجبات العائلية (مع دعم المقاسات / Sizes)
('pizza-ranch', 'family', 'البيتزا', 'بيتزا دجاج رانش', 16.00, '1000 - 1487', 'صلصة رانش كريمية مع قطع دجاج مشوية وموزاريلا وفلفل بارد مقرمش', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1642011197bduIkJ.jpeg', true, true, '[{"name": "حجم صغير", "price": 16.00}, {"name": "حجم كبير", "price": 20.00}]'::jsonb, true, false, false, false, false, 53),
('pizza-tawook', 'family', 'البيتزا', 'بيتزا شيش طاووق', 18.00, '500 - 1000', 'بيتزا شيش طاووق مشوية بالفرن الحجري مع صوص الثوم والموزاريلا', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/KhSS6OzqcyDI1O_Iv0cO.jpeg', true, true, '[{"name": "حجم صغير", "price": 18.00}, {"name": "حجم كبير", "price": 24.00}]'::jsonb, false, false, false, false, false, 54),
('pizza-margarita', 'family', 'البيتزا', 'بيتزا مارجريتا', 16.00, '830 - 1380', 'بيتزا مارجريتا كلاسيكية بصلصة الطماطم الإيطالية وجبن الموزاريلا والريحان', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1642060608WKQ8F3.jpg', true, true, '[{"name": "حجم صغير", "price": 16.00}, {"name": "حجم كبير", "price": 20.00}]'::jsonb, false, false, true, false, false, 55),
('pizza-pepperoni', 'family', 'البيتزا', 'بيتزا بيبروني', 16.00, '1460', 'بيتزا بيبروني لحم بقري مدخن مع جبنة موزاريلا غنية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-category/1642011197bduIkJ.jpeg', true, true, '[{"name": "حجم صغير", "price": 16.00}, {"name": "حجم كبير", "price": 20.00}]'::jsonb, true, false, false, false, false, 56),
('pizza-dynamite', 'family', 'البيتزا', 'بيتزا داينمايت حارة', 16.00, '1000', 'بيتزا داينمايت حارة (Spicy) بصلصة الداينمايت النارية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1642064298-OnAMV.jpeg', true, true, '[{"name": "حجم صغير", "price": 16.00}, {"name": "حجم كبير", "price": 20.00}]'::jsonb, false, true, false, false, false, 57),

-- الوجبات العائلية (بوكسات)
('family-1', 'family', 'الوجبات العائلية', 'مينى معجنات كبير (بوكس عائلي)', 55.00, '3180', 'تشكيلة فاخرة من الميني معجنات المتنوعة (لحم، جبن، زعتر، سبانخ) مثالية للمناسبات والجمعات العائلية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/kbtsxPCmTABRtzB5iSpe.jpg', true, false, '[]', true, false, false, false, true, 58),
('family-2', 'family', 'الوجبات العائلية', 'مينى معجنات صغير', 35.00, '1924', 'بوكس تشكيلة ميني معجنات صغير منوع وطازج ومناسب للجمعات الخفيفة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/7de8SvGObmvanIChqcwV.jpg', true, false, '[]', false, false, false, false, true, 59),
('family-3', 'family', 'الوجبات العائلية', 'بوكس مشكل مشويات', 82.00, '5800', 'بوكس فاخر يجمع تشكيلة معجنات المشويات الملكية (كباب لحم ودجاج وطاووق) مع الصوصات الخاصة والبطاطس', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/hux7l-F6P-NwQhOJQoIa.jpg', true, false, '[]', true, false, false, false, true, 60),
('family-4', 'family', 'الوجبات العائلية', 'مشكل مملكة المعجنات', 77.00, '5185', 'البوكس الملكي الفاخر المميز بأصناف المملكة الأكثر شهرة وتنوعاً', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612570302-3.jpg', true, false, '[]', true, false, false, false, true, 61),
('family-5', 'family', 'الوجبات العائلية', 'مشكل سوبر', 25.00, '2335', 'صحن معجنات مشكل سوبر خفيف ومتنوع', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612570153-1.jpg', true, false, '[]', false, false, false, false, true, 62),
('family-6', 'family', 'الوجبات العائلية', 'مشكل اكسترا', 50.00, '3455', 'صحن معجنات مشكل اكسترا للأصدقاء والعائلة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612570226-2.jpg', true, false, '[]', false, false, false, false, true, 63),
('family-7', 'family', 'الوجبات العائلية', 'صفائح مشكل كبير', 35.00, '2141', 'صفائح لحم واجبان متنوعة ومقرمشة كبير', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1642575773w1SDQl.jpg', true, false, '[]', false, false, false, false, true, 64),
('family-8', 'family', 'الوجبات العائلية', 'بوكس الافطار', 63.00, '5310', 'بوكس إفطار متكامل للعائلة يضم اللبنة والجبن والشكشوكة والزعتر والفلافل', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/crqkoULWwHfMmFZczOlb.jpeg', true, false, '[]', true, false, false, false, true, 65),

-- كافتيريا وصباح الملكة
('morning-1', 'cafeteria', 'صباح الملكة', 'شكشوكة كلاسيك', 7.00, '569', 'شكشوكة كلاسيكية طازجة محضرة على أصولها', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/JGekrN7u3Xfo8iO63BC4.jpeg', true, false, '[]', false, false, true, true, false, 66),

-- حلا والمشروبات
('sweet-1', 'sweets-drinks', 'حلا', 'عش البلبل', 18.00, '520 - 850', 'عش البلبل المميز باللبنة والجبن وعسل النحل الطبيعي دافئ ومقرمش', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1642067383W5gcR2.jpg', true, true, '[{"name": "حجم صغير", "price": 18.00}, {"name": "حجم كبير", "price": 23.00}]'::jsonb, true, false, true, false, false, 67),
('sweet-3', 'sweets-drinks', 'حلا', 'حلاوة بالجبن الموزاريلا', 8.05, '690', 'فطيرة حلاوة طحينية ساخنة مع جبن موزاريلا مطاطي', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612568626-2.jpeg', true, false, '[]', false, false, true, false, false, 68),
('sweet-4', 'sweets-drinks', 'حلا', 'لبنة بالعسل', 8.00, '530', 'لبنة طازجة مع عسل النحل الصافي على العجينة المقرمشة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612568855-4.jpg', true, false, '[]', false, false, true, false, false, 69),
('sweet-5', 'sweets-drinks', 'حلا', 'شوكولاتة بالعجين', 8.00, '600', 'فطيرة شوكولاتة نوتيلا دافئة وغنية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612568926-5.jpg', true, false, '[]', false, false, true, false, false, 70),
('sweet-6', 'sweets-drinks', 'حلا', 'حلاوة طحينية', 7.00, '640', 'فطيرة حلاوة طحينية بلدية دافئة', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612568596-1.jpg', true, false, '[]', false, false, true, false, false, 71),
('sauce-1', 'sweets-drinks', 'الصوصات', 'ثوميه شامية', 2.00, '125', 'صلصة الثومية الشامية الأصلية الكريمية', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/zXQo69Jw2gSQo_s2urZR.png', true, false, '[]', false, false, true, true, false, 72),
('sauce-2', 'sweets-drinks', 'الصوصات', 'صوص الطحينة', 2.00, '89', 'طحينة بيضاء بلدي مع الليمون والكمون', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/Mp9y7bmwrtfY74K9zuCv.jpeg', true, false, '[]', false, false, true, true, false, 73),
('drink-1', 'sweets-drinks', 'المشروبات', 'بيبسي بارد', 4.00, '152', 'مشروب غازي بيبسي مثلج ومنعش', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591386-2.jpg', true, false, '[]', false, false, false, true, false, 74),
('drink-2', 'sweets-drinks', 'المشروبات', 'سفن آب', 4.00, '159', 'مشروب غازي سفن آب ليمون منعش', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591475-3.jpg', true, false, '[]', false, false, false, true, false, 75),
('drink-3', 'sweets-drinks', 'المشروبات', 'ميرندا برتقال', 4.00, '191', 'مشروب ميرندا غازي مثلج بنكهة البرتقال', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591603-4.jpg', true, false, '[]', false, false, false, true, false, 76),
('drink-4', 'sweets-drinks', 'المشروبات', 'ماونتن ديو', 4.00, '173', 'مشروب غازي ماونتن ديو بارد', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591742-91_9a6442de25966ce638d70197db05f03c.jpg', true, false, '[]', false, false, false, true, false, 77),
('drink-5', 'sweets-drinks', 'المشروبات', 'مياه معدنية نقية', 1.00, '0', 'مياه صحية نقية طبيعية 330 مل', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/1612591328-1.jpg', true, false, '[]', false, false, false, true, false, 78)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    category_name = EXCLUDED.category_name,
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    calories = EXCLUDED.calories,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    is_available = EXCLUDED.is_available,
    has_sizes = EXCLUDED.has_sizes,
    sizes = EXCLUDED.sizes,
    is_bestseller = EXCLUDED.is_bestseller,
    is_spicy = EXCLUDED.is_spicy,
    is_veg = EXCLUDED.is_veg,
    is_quick = EXCLUDED.is_quick,
    is_family_box = EXCLUDED.is_family_box,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();


-- ========================================================
-- 8. Insert Special Offers
-- ========================================================
INSERT INTO public.special_offers
(id, title, badge, description, original_price, discounted_price, calories, image_url, items_included, is_available, sort_order)
VALUES
('offer-1', 'عرض الجمعات الملكي 👑', 'وفر 28 ريال', 'بوكس مينى معجنات كبير عائلي + 2 بيتزا حجم كبير من اختيارك + 4 مشروبات غازية باردة مجاناً', 115.00, 87.00, '4950', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/kbtsxPCmTABRtzB5iSpe.jpg', '["مينى معجنات كبير", "بيتزا دجاج رانش كبير", "بيتزا بيبروني كبير", "4 مشروبات غازية"]'::jsonb, true, 1),
('offer-2', 'عرض الثنائي المشوي 🔥', 'الأكثر مبيعاً', '2 كباب دجاج ملغوم فطيرة + 2 كباب لحم ملغوم + 2 صصوص ثومية + 2 بيبسي مثلج', 68.00, 52.00, '2280', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/2nUwnLwDxLiapdroTtPf.jpeg', '["2 فطيرة كباب دجاج ملغوم", "2 فطيرة كباب لحم ملغوم", "2 صوص ثومية", "2 بيبسي"]'::jsonb, true, 2),
('offer-3', 'بوكس الإفطار الصباحي الملكي ☀️', 'فطور الملوك', 'فطيرة اللحسة + شكشوكة عدني + لبنة بالزعتر + فطيرة فلافل شيدر + شاي كرك طازج', 42.00, 32.00, '1850', 'https://ellmenus.com/images/0AbE3fsB2dD0KmUhsfQm/food-item/crqkoULWwHfMmFZczOlb.jpeg', '["فطيرة اللحسة", "شكشوكة عدني", "لبنة بالزعتر", "فطيرة فلافل شيدر"]'::jsonb, true, 3)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    original_price = EXCLUDED.original_price,
    discounted_price = EXCLUDED.discounted_price,
    calories = EXCLUDED.calories,
    image_url = EXCLUDED.image_url,
    items_included = EXCLUDED.items_included,
    is_available = EXCLUDED.is_available,
    sort_order = EXCLUDED.sort_order;
