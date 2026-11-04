-- Additive Auren Attire store schema.
-- This migration does not drop or rewrite the existing products/orders tables.

CREATE TABLE IF NOT EXISTS public.store_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_store_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.store_admins
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL DEFAULT '',
  occasion TEXT NOT NULL DEFAULT 'Casual',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL DEFAULT '',
  fabric_details TEXT NOT NULL DEFAULT '',
  care_instructions TEXT NOT NULL DEFAULT '',
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title TEXT,
  meta_description TEXT,
  image_alt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  banner_image TEXT,
  seo_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Baby Care',
  author TEXT NOT NULL DEFAULT 'Auren Editorial',
  read_time TEXT NOT NULL DEFAULT '4 min read',
  cover_image TEXT NOT NULL DEFAULT '',
  image_alt TEXT,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  order_notes TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method = 'cod'),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  coupon_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.store_products(id) ON DELETE SET NULL,
  sku TEXT NOT NULL,
  title TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image TEXT
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_store_products_category ON public.store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_published ON public.store_products(is_published);
CREATE INDEX IF NOT EXISTS idx_store_products_created ON public.store_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_blog_published ON public.store_blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_created ON public.store_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_order_items_order ON public.store_order_items(order_id);

ALTER TABLE public.store_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read their own role" ON public.store_admins;
CREATE POLICY "Admins can read their own role"
  ON public.store_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can read published products" ON public.store_products;
CREATE POLICY "Public can read published products"
  ON public.store_products FOR SELECT TO anon, authenticated
  USING (is_published OR public.is_store_admin());

DROP POLICY IF EXISTS "Admins manage products" ON public.store_products;
CREATE POLICY "Admins manage products"
  ON public.store_products FOR ALL TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "Public can read published categories" ON public.store_categories;
CREATE POLICY "Public can read published categories"
  ON public.store_categories FOR SELECT TO anon, authenticated
  USING (is_published OR public.is_store_admin());

DROP POLICY IF EXISTS "Admins manage categories" ON public.store_categories;
CREATE POLICY "Admins manage categories"
  ON public.store_categories FOR ALL TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "Public can read published blog posts" ON public.store_blog_posts;
CREATE POLICY "Public can read published blog posts"
  ON public.store_blog_posts FOR SELECT TO anon, authenticated
  USING (is_published OR public.is_store_admin());

DROP POLICY IF EXISTS "Admins manage blog posts" ON public.store_blog_posts;
CREATE POLICY "Admins manage blog posts"
  ON public.store_blog_posts FOR ALL TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "Admins can read orders" ON public.store_orders;
CREATE POLICY "Admins can read orders"
  ON public.store_orders FOR SELECT TO authenticated
  USING (public.is_store_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.store_orders;
CREATE POLICY "Admins can update orders"
  ON public.store_orders FOR UPDATE TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

DROP POLICY IF EXISTS "Admins can read order items" ON public.store_order_items;
CREATE POLICY "Admins can read order items"
  ON public.store_order_items FOR SELECT TO authenticated
  USING (public.is_store_admin());

DROP POLICY IF EXISTS "Admins manage settings" ON public.store_settings;
CREATE POLICY "Admins manage settings"
  ON public.store_settings FOR ALL TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

CREATE OR REPLACE FUNCTION public.place_store_order(
  p_customer JSONB,
  p_items JSONB,
  p_payment_method TEXT DEFAULT 'cod',
  p_coupon_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_item JSONB;
  v_product public.store_products%ROWTYPE;
  v_lines JSONB := '[]'::jsonb;
  v_quantity INTEGER;
  v_size TEXT;
  v_color TEXT;
  v_subtotal NUMERIC(10, 2) := 0;
  v_discount NUMERIC(10, 2) := 0;
  v_shipping NUMERIC(10, 2);
  v_total NUMERIC(10, 2);
  v_coupon TEXT := NULLIF(upper(trim(COALESCE(p_coupon_code, ''))), '');
  v_discount_percent INTEGER := 0;
  v_order_id UUID := gen_random_uuid();
  v_order_number TEXT;
  v_status TEXT := 'pending';
  v_name TEXT := trim(COALESCE(p_customer->>'fullName', ''));
  v_phone TEXT := trim(COALESCE(p_customer->>'phone', ''));
  v_address TEXT := trim(COALESCE(p_customer->>'address', ''));
  v_city TEXT := trim(COALESCE(p_customer->>'city', ''));
  v_province TEXT := trim(COALESCE(p_customer->>'province', ''));
BEGIN
  IF p_payment_method IS DISTINCT FROM 'cod' THEN
    RAISE EXCEPTION 'Only Cash on Delivery is currently available.';
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_items) < 1
     OR jsonb_array_length(p_items) > 30 THEN
    RAISE EXCEPTION 'The order must contain between 1 and 30 items.';
  END IF;

  IF length(v_name) NOT BETWEEN 2 AND 160
     OR length(regexp_replace(v_phone, '[^0-9]', '', 'g')) NOT BETWEEN 10 AND 15
     OR length(v_address) NOT BETWEEN 5 AND 500
     OR length(v_city) NOT BETWEEN 2 AND 100
     OR length(v_province) NOT BETWEEN 2 AND 100 THEN
    RAISE EXCEPTION 'Please provide valid customer and delivery details.';
  END IF;

  IF length(COALESCE(p_customer->>'email', '')) > 254
     OR (COALESCE(p_customer->>'email', '') <> ''
         AND COALESCE(p_customer->>'email', '') !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$') THEN
    RAISE EXCEPTION 'Please provide a valid email address.';
  END IF;

  IF length(COALESCE(p_customer->>'orderNotes', '')) > 1000
     OR length(COALESCE(p_customer->>'postalCode', '')) > 20 THEN
    RAISE EXCEPTION 'Optional order details exceed the allowed length.';
  END IF;

  IF v_coupon = 'AUREN10' THEN
    v_discount_percent := 10;
  ELSIF v_coupon IN ('EID2026', 'BABYLOVE') THEN
    v_discount_percent := 15;
  ELSE
    v_coupon := NULL;
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::INTEGER;
    v_size := trim(COALESCE(v_item->>'size', ''));
    v_color := trim(COALESCE(v_item->>'color', ''));

    IF v_quantity NOT BETWEEN 1 AND 10 OR v_size = '' OR v_color = '' THEN
      RAISE EXCEPTION 'An item has an invalid quantity, size, or color.';
    END IF;

    SELECT * INTO v_product
    FROM public.store_products
    WHERE slug = trim(COALESCE(v_item->>'slug', ''))
      AND is_published = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A product in your bag is no longer available.';
    END IF;

    IF NOT (v_product.sizes @> jsonb_build_array(v_size))
       OR NOT EXISTS (
         SELECT 1
         FROM jsonb_array_elements(v_product.colors) AS color_options(option)
         WHERE option->>'name' = v_color
       ) THEN
      RAISE EXCEPTION 'A selected product size or color is no longer available.';
    END IF;

    IF v_product.stock < v_quantity THEN
      RAISE EXCEPTION 'A product in your bag no longer has enough stock.';
    END IF;

    UPDATE public.store_products
    SET stock = stock - v_quantity, updated_at = now()
    WHERE id = v_product.id;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'sku', v_product.sku,
      'title', v_product.title,
      'size', v_size,
      'color', v_color,
      'price', v_product.price,
      'quantity', v_quantity,
      'image', v_product.images->>0,
      'slug', v_product.slug
    ));
  END LOOP;

  v_discount := round(v_subtotal * v_discount_percent / 100.0, 2);
  v_shipping := CASE WHEN v_subtotal - v_discount >= 4999 THEN 0 ELSE 250 END;
  v_total := v_subtotal - v_discount + v_shipping;
  v_order_number := 'AUR-' || to_char(now(), 'YYYYMMDD') || '-'
    || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  INSERT INTO public.store_orders (
    id, order_number, customer_name, phone, email, address, city, province,
    postal_code, order_notes, payment_method, status, subtotal, discount,
    shipping_fee, total, coupon_code
  ) VALUES (
    v_order_id, v_order_number, v_name, v_phone,
    NULLIF(trim(COALESCE(p_customer->>'email', '')), ''),
    v_address, v_city, v_province,
    NULLIF(trim(COALESCE(p_customer->>'postalCode', '')), ''),
    NULLIF(trim(COALESCE(p_customer->>'orderNotes', '')), ''),
    'cod', v_status, v_subtotal, v_discount, v_shipping, v_total, v_coupon
  );

  INSERT INTO public.store_order_items (
    order_id, product_id, sku, title, size, color, price, quantity, image
  )
  SELECT
    v_order_id,
    (line->>'product_id')::UUID,
    line->>'sku',
    line->>'title',
    line->>'size',
    line->>'color',
    (line->>'price')::NUMERIC,
    (line->>'quantity')::INTEGER,
    line->>'image'
  FROM jsonb_array_elements(v_lines) AS order_lines(line);

  RETURN jsonb_build_object(
    'id', v_order_id,
    'orderNumber', v_order_number,
    'items', v_lines,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'shippingFee', v_shipping,
    'total', v_total,
    'couponCode', v_coupon,
    'customer', jsonb_build_object(
      'fullName', v_name,
      'email', NULLIF(trim(COALESCE(p_customer->>'email', '')), ''),
      'phone', v_phone,
      'address', v_address,
      'city', v_city,
      'province', v_province,
      'postalCode', NULLIF(trim(COALESCE(p_customer->>'postalCode', '')), ''),
      'orderNotes', NULLIF(trim(COALESCE(p_customer->>'orderNotes', '')), '')
    ),
    'paymentMethod', 'cod',
    'status', v_status,
    'createdAt', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.place_store_order(JSONB, JSONB, TEXT, TEXT) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.place_store_order(JSONB, JSONB, TEXT, TEXT) TO anon;

GRANT SELECT ON public.store_products, public.store_categories, public.store_blog_posts TO anon, authenticated;
GRANT ALL ON public.store_products, public.store_categories, public.store_blog_posts TO authenticated;
GRANT SELECT, UPDATE ON public.store_orders TO authenticated;
GRANT SELECT ON public.store_order_items, public.store_admins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO authenticated;
