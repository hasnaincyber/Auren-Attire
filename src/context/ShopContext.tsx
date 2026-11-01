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
import { calculateCartTotals } from '../utils/shop';

interface ShopContextType {
  products: Product[];
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  // Blog state & navigation
  blogPosts: BlogPost[];
  activeBlogSlug: string | null;
  navigateToBlog: () => void;
  navigateToBlogPost: (slug: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;
  // Admin privacy / unlock
  isAdminUnlocked: boolean;
  unlockAdmin: (passcode: string) => boolean;
  lockAdmin: () => void;
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
  placeOrder: (customer: CustomerDetails, paymentMethod: PaymentMethod) => Order;
  // Admin dynamic product management
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
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

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'auren_attire_baby_products_v3';
const LOCAL_STORAGE_KEY_BLOGS = 'auren_attire_blogs_v3';
const LOCAL_STORAGE_KEY_CART = 'auren_attire_cart_v3';
const LOCAL_STORAGE_KEY_WISHLIST = 'auren_attire_wishlist_v3';
const LOCAL_STORAGE_KEY_ORDERS = 'auren_attire_orders_v3';
const LOCAL_STORAGE_KEY_ADMIN = 'auren_attire_admin_auth_v3';

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
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BLOGS, JSON.stringify(blogPosts));
    } catch {
      // ignore
    }
  }, [blogPosts]);

  // 3. Admin Security Lock
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      // Check query param e.g. ?admin=1
      if (typeof window !== 'undefined' && window.location.search.includes('admin=1')) {
        return true;
      }
      return localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const unlockAdmin = (passcode: string): boolean => {
    if (passcode.trim() === '2007' || passcode.trim().toLowerCase() === 'auren2007') {
      setIsAdminUnlocked(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, 'true');
      } catch {}
      showToast('Admin mode unlocked.');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
    } catch {}
    showToast('Admin locked.');
  };

  // 4. Navigation View & Active Blog Slug
  const [currentView, setCurrentView] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        return 'blog-post';
      }
      if (path === '/blog') {
        return 'blog';
      }
    }
    return 'home';
  });

  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        return path.replace('/blog/', '');
      }
    }
    return null;
  });

  // Handle URL history syncing
  const navigateToBlog = () => {
    setActiveBlogSlug(null);
    setCurrentView('blog');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToBlogPost = (slug: string) => {
    setActiveBlogSlug(slug);
    setCurrentView('blog-post');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/blog/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        setActiveBlogSlug(path.replace('/blog/', ''));
        setCurrentView('blog-post');
      } else if (path === '/blog') {
        setActiveBlogSlug(null);
        setCurrentView('blog');
      } else {
        setCurrentView('home');
      }
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

  // 7. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // 8. Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 9. Filter State
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

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
    setCurrentView('shop');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
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

  const placeOrder = (customer: CustomerDetails, paymentMethod: PaymentMethod): Order => {
    const totals = calculateCartTotals(cart, couponDiscount);
    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingFee: totals.shippingFee,
      total: totals.total,
      couponCode: couponCode || undefined,
      customer,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setCouponCode('');
    setCouponDiscount(0);

    return newOrder;
  };

  // Dynamic Product Management
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `aur-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" created successfully!`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast('Product deleted from catalog.');
  };

  const resetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PRODUCTS);
    showToast('Catalog reset to official Auren Attire baby wear defaults.');
  };

  // Dynamic Blog Management
  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}`,
      publishedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    showToast(`Article "${newPost.title}" published!`);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updates } : post))
    );
    showToast('Article updated successfully!');
  };

  const deleteBlogPost = (id: string) => {
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
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        getBlogPostBySlug,
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
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
        resetCatalog,
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
