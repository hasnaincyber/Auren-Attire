import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BlogPost,
  CartItem, 
  CategoryType, 
  CustomerDetails, 
  FilterState, 
  Order, 
  PageView, 
  PaymentMethod, 
  Product, 
  ProductColor 
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_BLOG_POSTS } from '../data/initialBlogPosts';
import { supabase } from '../lib/supabase';

interface ShopContextType {
  products: Product[];
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  // Blog state & navigation
  blogPosts: BlogPost[];
  activeBlogSlug: string | null;
  navigateToBlog: () => void;
  navigateToBlogPost: (slug: string) => void;
  navigateToProduct: (slug: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  // Shopping Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  quickCategorySelect: (category: CategoryType, subCategory?: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  couponCode: string;
  couponDiscount: number;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  placeOrder: (customer: CustomerDetails, paymentMethod: PaymentMethod) => Promise<Order>;
  // Admin dynamic product management
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Active toast/notice
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  subCategory: 'all',
  minPrice: 0,
  maxPrice: 0,
  sizes: [],
  occasions: [],
  sortBy: 'featured',
  searchQuery: '',
  inStockOnly: false
};

const viewPaths: Partial<Record<PageView, string>> = {
  home: '/',
  shop: '/shop',
  blog: '/blog',
  'blog-post': '/blog',
  about: '/about',
  contact: '/contact',
  shipping: '/shipping-policy',
  returns: '/return-policy',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  admin: '/admin/login',
};

function viewFromPath(path: string): PageView {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  if (normalizedPath.startsWith('/blog/')) return 'blog-post';
  if (normalizedPath === '/blog') return 'blog';
  if (normalizedPath === '/about') return 'about';
  if (normalizedPath === '/contact') return 'contact';
  if (normalizedPath === '/shipping-policy') return 'shipping';
  if (normalizedPath === '/return-policy') return 'returns';
  if (normalizedPath === '/privacy-policy') return 'privacy';
  if (normalizedPath === '/terms-and-conditions') return 'terms';
  if (normalizedPath === '/admin' || normalizedPath === '/admin/login') return 'admin';
  if (
    normalizedPath === '/shop' ||
    normalizedPath.startsWith('/category/') ||
    normalizedPath.startsWith('/product/')
  ) {
    return 'shop';
  }
  return 'home';
}

function filtersFromPath(path: string): FilterState {
  const category = path.match(/^\/category\/([^/]+)\/?$/)?.[1];
  if (
    category === 'baby-boys' ||
    category === 'baby-girls' ||
    category === 'newborn-sets' ||
    category === 'rompers'
  ) {
    return { ...defaultFilters, category };
  }
  return defaultFilters;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'auren_attire_baby_products_v3';
const LOCAL_STORAGE_KEY_BLOGS = 'auren_attire_blogs_v3';
const LOCAL_STORAGE_KEY_CART = 'auren_attire_cart_v3';
const LOCAL_STORAGE_KEY_WISHLIST = 'auren_attire_wishlist_v3';

type StoreProductRow = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  category: string;
  sub_category: string;
  occasion: Product['occasion'];
  price: number;
  compare_at_price: number | null;
  images: unknown;
  sizes: unknown;
  colors: unknown;
  description: string;
  fabric_details: string;
  care_instructions: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  stock: number;
  featured: boolean;
  created_at: string;
};

type StoreBlogRow = {
  id: string;
  slug: string;
  title: string;
  category: BlogPost['category'];
  author: string;
  read_time: string;
  cover_image: string;
  excerpt: string;
  content: string;
  tags: unknown;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

function mapStoreProduct(row: StoreProductRow): Product {
  const category: CategoryType =
    row.category === 'baby-boys' ||
    row.category === 'baby-girls' ||
    row.category === 'newborn-sets' ||
    row.category === 'rompers'
      ? row.category
      : 'baby-boys';
  const images = Array.isArray(row.images)
    ? row.images.filter((image): image is string => typeof image === 'string')
    : [];
  const sizes = Array.isArray(row.sizes)
    ? row.sizes.filter((size): size is string => typeof size === 'string')
    : [];
  const colors = Array.isArray(row.colors)
    ? row.colors.filter(
        (color): color is ProductColor =>
          typeof color === 'object' &&
          color !== null &&
          'name' in color &&
          typeof color.name === 'string' &&
          'hex' in color &&
          typeof color.hex === 'string'
      )
    : [];

  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    title: row.title,
    category,
    subCategory: row.sub_category,
    occasion: row.occasion,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    images,
    sizes,
    colors,
    description: row.description,
    fabricDetails: row.fabric_details,
    careInstructions: row.care_instructions,
    isNewArrival: row.is_new_arrival,
    isBestSeller: row.is_best_seller,
    stock: Number(row.stock),
    rating: 0,
    reviewCount: 0,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

function mapStoreBlogPost(row: StoreBlogRow): BlogPost {
  const tags = Array.isArray(row.tags)
    ? row.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    author: row.author,
    readTime: row.read_time,
    coverImage: row.cover_image,
    excerpt: row.excerpt,
    content: row.content,
    tags,
    isPublished: row.is_published,
    publishedAt: new Date(row.published_at ?? row.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };
}

function toStoreProductRow(product: Product) {
  return {
    sku: product.sku,
    slug: product.slug,
    title: product.title,
    category: product.category,
    sub_category: product.subCategory,
    occasion: product.occasion,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    fabric_details: product.fabricDetails,
    care_instructions: product.careInstructions,
    is_new_arrival: product.isNewArrival,
    is_best_seller: product.isBestSeller,
    stock: product.stock,
    featured: product.featured ?? false,
  };
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dynamic Products with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    if (supabase) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // 2. Dynamic Blog Posts with localStorage persistence
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_BLOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_BLOG_POSTS;
  });

  useEffect(() => {
    if (supabase) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BLOGS, JSON.stringify(blogPosts));
    } catch {
      // ignore
    }
  }, [blogPosts]);

  // 4. Navigation View & Active Blog Slug
  const [currentView, setCurrentViewState] = useState<PageView>(() =>
    typeof window === 'undefined' ? 'home' : viewFromPath(window.location.pathname)
  );

  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        return decodeURIComponent(path.slice('/blog/'.length));
      }
    }
    return null;
  });

  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/product\/([^/]+)\/?$/);
      return match ? decodeURIComponent(match[1]) : null;
    }
    return null;
  });

  const setCurrentView = (view: PageView) => {
    setCurrentViewState(view);
    if (typeof window === 'undefined') return;

    const path = view === 'blog-post' && activeBlogSlug
      ? `/blog/${encodeURIComponent(activeBlogSlug)}`
      : viewPaths[view] ?? '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle URL history syncing
  const navigateToBlog = () => {
    setActiveBlogSlug(null);
    setCurrentViewState('blog');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToBlogPost = (slug: string) => {
    setActiveBlogSlug(slug);
    setCurrentViewState('blog-post');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/blog/${encodeURIComponent(slug)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const productMatch = path.match(/^\/product\/([^/]+)\/?$/);
      setActiveProductSlug(productMatch ? decodeURIComponent(productMatch[1]) : null);
      if (path.startsWith('/blog/')) {
        setActiveBlogSlug(decodeURIComponent(path.slice('/blog/'.length)));
      } else {
        setActiveBlogSlug(null);
      }
      setCurrentViewState(viewFromPath(path));
      setFilters(filtersFromPath(path));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 5. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // 6. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Customer orders are stored in Supabase, never in browser localStorage.
  const [orders, setOrders] = useState<Order[]>([]);

  // 8. Modals
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 9. Filter State
  const [filters, setFilters] = useState<FilterState>(() =>
    typeof window === 'undefined' ? defaultFilters : filtersFromPath(window.location.pathname)
  );

  // 10. Coupon State
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    setActiveProductSlug(product?.slug ?? null);
    if (typeof window === 'undefined') return;

    if (product) {
      setCurrentViewState('shop');
      const path = `/product/${encodeURIComponent(product.slug)}`;
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } else if (window.location.pathname.startsWith('/product/')) {
      window.history.replaceState({}, '', '/shop');
      setCurrentViewState('shop');
    }
  };

  const navigateToProduct = (slug: string) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      showToast('This product is currently unavailable.');
      return;
    }
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!activeProductSlug) {
      setSelectedProductState(null);
      return;
    }
    const product = products.find((item) => item.slug === activeProductSlug);
    if (product) setSelectedProductState(product);
  }, [activeProductSlug, products]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;
    const loadStoreContent = async () => {
      const [productResult, blogResult] = await Promise.all([
        client.from('store_products').select('*').order('created_at', { ascending: false }),
        client.from('store_blog_posts').select('*').order('published_at', { ascending: false }),
      ]);

      if (!active) return;
      if (productResult.error) {
        showToast(`Could not load the store catalog: ${productResult.error.message}`);
      } else if (productResult.data.length > 0) {
        setProducts(productResult.data.map((row) => mapStoreProduct(row)));
      }

      if (blogResult.error) {
        showToast(`Could not load store articles: ${blogResult.error.message}`);
      } else if (blogResult.data.length > 0) {
        setBlogPosts(blogResult.data.map((row) => mapStoreBlogPost(row)));
      }
    };

    void loadStoreContent();
    const { data: { subscription } } = client.auth.onAuthStateChange(() => {
      void loadStoreContent();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'AUREN10') {
      setCouponCode('AUREN10');
      setCouponDiscount(10);
      setCouponError(null);
      showToast('Promo code AUREN10 applied: 10% OFF!');
      return true;
    } else if (formatted === 'EID2026' || formatted === 'BABYLOVE') {
      setCouponCode(formatted);
      setCouponDiscount(15);
      setCouponError(null);
      showToast('Special Promo applied: 15% OFF!');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try AUREN10 for 10% off.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponError(null);
    showToast('Promo code removed.');
  };

  const quickCategorySelect = (category: CategoryType, subCategory: string = 'all') => {
    setFilters({
      ...defaultFilters,
      category,
      subCategory,
    });
    setCurrentViewState('shop');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/category/${category}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: ProductColor,
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.name}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize,
          selectedColor,
          quantity
        }
      ];
    });

    showToast(`Added ${product.title} (${selectedSize}) to bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from bag.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const placeOrder = async (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    if (!supabase) {
      throw new Error('Checkout is not connected to the store database yet. Please contact us on WhatsApp to place your order.');
    }

    if (cart.length === 0) {
      throw new Error('Your shopping bag is empty.');
    }

    const { data, error } = await supabase.rpc('place_store_order', {
      p_customer: customer,
      p_items: cart.map((item) => ({
        slug: item.product.slug,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
      })),
      p_payment_method: paymentMethod,
      p_coupon_code: couponCode || null,
    });

    if (error) {
      throw new Error(error.message || 'We could not save your order. Please try again or contact us on WhatsApp.');
    }

    if (
      !data ||
      typeof data !== 'object' ||
      !('id' in data) ||
      !('orderNumber' in data) ||
      !('subtotal' in data) ||
      !('discount' in data) ||
      !('shippingFee' in data) ||
      !('total' in data) ||
      !('createdAt' in data)
    ) {
      throw new Error('The store returned an invalid order confirmation. Please contact us before retrying.');
    }

    const newOrder: Order = {
      id: String(data.id),
      orderNumber: String(data.orderNumber),
      items: [...cart],
      subtotal: Number(data.subtotal),
      discount: Number(data.discount),
      shippingFee: Number(data.shippingFee),
      total: Number(data.total),
      couponCode: typeof data.couponCode === 'string' ? data.couponCode : undefined,
      customer,
      paymentMethod: 'cod',
      status: 'pending',
      createdAt: String(data.createdAt),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setCouponCode('');
    setCouponDiscount(0);

    return newOrder;
  };

  // Dynamic Product Management
  const addProduct = async (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!supabase) {
      showToast('Product changes require the connected Supabase store.');
      return;
    }

    const { data, error } = await supabase
      .from('store_products')
      .insert({
        ...toStoreProductRow({
          ...newProdData,
          id: '',
          createdAt: new Date().toISOString(),
          rating: 0,
          reviewCount: 0,
        }),
        is_published: true,
      })
      .select('*')
      .single();

    if (error) {
      showToast(`Could not save product: ${error.message}`);
      return;
    }

    const newProduct = mapStoreProduct(data);
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" created successfully.`);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!supabase) {
      showToast('Product changes require the connected Supabase store.');
      return;
    }

    const existing = products.find((item) => item.id === id);
    if (!existing) {
      showToast('Could not find that product in the current catalog.');
      return;
    }

    const updatedProduct = { ...existing, ...updates };
    const { data, error } = await supabase
      .from('store_products')
      .update({
        ...toStoreProductRow(updatedProduct),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      showToast(`Could not update product: ${error.message}`);
      return;
    }

    const savedProduct = mapStoreProduct(data);
    setProducts((prev) => prev.map((item) => (item.id === id ? savedProduct : item)));
    showToast('Product updated successfully.');
  };

  const deleteProduct = async (id: string) => {
    if (!supabase) {
      showToast('Product changes require the connected Supabase store.');
      return;
    }

    const { data, error } = await supabase
      .from('store_products')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      showToast(`Could not delete product: ${error.message}`);
      return;
    }
    if (!data) {
      showToast('Product was not deleted; it may already be unavailable.');
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast('Product deleted from the catalog.');
  };

  // Dynamic Blog Management
  const addBlogPost = async (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    if (!supabase) {
      showToast('Article changes require the connected Supabase store.');
      return;
    }

    const publishedAt = postData.isPublished ? new Date().toISOString() : null;
    const { data, error } = await supabase
      .from('store_blog_posts')
      .insert({
        slug: postData.slug,
        title: postData.title,
        category: postData.category,
        author: postData.author,
        read_time: postData.readTime,
        cover_image: postData.coverImage,
        excerpt: postData.excerpt,
        content: postData.content,
        tags: postData.tags ?? [],
        is_published: postData.isPublished,
        published_at: publishedAt,
      })
      .select('*')
      .single();

    if (error) {
      showToast(`Could not save article: ${error.message}`);
      return;
    }

    const newPost = mapStoreBlogPost(data);
    setBlogPosts((prev) => [newPost, ...prev]);
    showToast(`Article "${newPost.title}" saved.`);
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    if (!supabase) {
      showToast('Article changes require the connected Supabase store.');
      return;
    }

    const existing = blogPosts.find((post) => post.id === id);
    if (!existing) {
      showToast('Could not find that article in the current list.');
      return;
    }

    const updatedPost = { ...existing, ...updates };
    const { data, error } = await supabase
      .from('store_blog_posts')
      .update({
        slug: updatedPost.slug,
        title: updatedPost.title,
        category: updatedPost.category,
        author: updatedPost.author,
        read_time: updatedPost.readTime,
        cover_image: updatedPost.coverImage,
        excerpt: updatedPost.excerpt,
        content: updatedPost.content,
        tags: updatedPost.tags ?? [],
        is_published: updatedPost.isPublished,
        published_at: updates.isPublished === false
          ? null
          : updates.isPublished === true
            ? new Date().toISOString()
            : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      showToast(`Could not update article: ${error.message}`);
      return;
    }

    const savedPost = mapStoreBlogPost(data);
    setBlogPosts((prev) => prev.map((post) => (post.id === id ? savedPost : post)));
    showToast('Article updated successfully.');
  };

  const deleteBlogPost = async (id: string) => {
    if (!supabase) {
      showToast('Article changes require the connected Supabase store.');
      return;
    }

    const { data, error } = await supabase
      .from('store_blog_posts')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      showToast(`Could not delete article: ${error.message}`);
      return;
    }
    if (!data) {
      showToast('Article was not deleted; it may already be unavailable.');
      return;
    }

    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
    showToast('Article deleted.');
  };

  const getBlogPostBySlug = (slug: string) => {
    return blogPosts.find((p) => p.slug === slug);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        currentView,
        setCurrentView,
        blogPosts,
        activeBlogSlug,
        navigateToBlog,
        navigateToBlogPost,
        navigateToProduct,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        getBlogPostBySlug,
        cart,
        wishlist,
        filters,
        setFilters,
        resetFilters,
        quickCategorySelect,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        couponCode,
        couponDiscount,
        couponError,
        applyCoupon,
        removeCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        orders,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
