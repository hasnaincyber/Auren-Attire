import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Database, 
  ShoppingBag, 
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BlogPost, Order, Product } from '../types';
import { formatPKR } from '../utils/shop';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

type StoreOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  order_notes: string | null;
  payment_method: 'cod';
  status: Order['status'];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon_code: string | null;
  created_at: string;
};

function mapStoreOrder(row: StoreOrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    items: [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shippingFee: Number(row.shipping_fee),
    total: Number(row.total),
    couponCode: row.coupon_code ?? undefined,
    customer: {
      fullName: row.customer_name,
      email: row.email ?? '',
      phone: row.phone,
      address: row.address,
      city: row.city,
      province: row.province,
      postalCode: row.postal_code ?? undefined,
      orderNotes: row.order_notes ?? undefined,
    },
    paymentMethod: 'cod',
    status: row.status,
    createdAt: row.created_at,
  };
}

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    navigateToBlog,
    navigateToBlogPost,
    showToast,
    setCurrentView 
  } = useShop();

  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [isStoreAdmin, setIsStoreAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');

  const visibleOrders = orders.filter((order) => {
    const query = orderSearch.trim().toLowerCase();
    const matchesSearch = !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.fullName.toLowerCase().includes(query) ||
      order.customer.phone.toLowerCase().includes(query);
    return matchesSearch && (orderStatusFilter === 'all' || order.status === orderStatusFilter);
  });

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAdminSession(session);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthError(error.message);
      setAdminSession(data.session);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !adminSession) {
      setIsStoreAdmin(false);
      return;
    }

    let active = true;
    setAuthLoading(true);
    setAuthError(null);
    void supabase
      .from('store_admins')
      .select('user_id')
      .eq('user_id', adminSession.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAuthError(`Could not verify store-admin access: ${error.message}`);
          setIsStoreAdmin(false);
        } else {
          setIsStoreAdmin(Boolean(data));
        }
        setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [adminSession]);

  useEffect(() => {
    const client = supabase;
    if (!client || !isStoreAdmin) {
      setOrders([]);
      return;
    }

    let active = true;
    const loadOrders = async () => {
      const { data, error } = await client
        .from('store_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!active) return;
      if (error) {
        showToast(`Could not load orders: ${error.message}`);
        return;
      }
      setOrders(data.map((row) => mapStoreOrder(row)));
    };

    void loadOrders();
    return () => {
      active = false;
    };
  }, [isStoreAdmin]);

  const handleAdminSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSigningIn(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    if (error) {
      setAuthError(`Sign-in failed: ${error.message}`);
    } else {
      setAdminSession(data.session);
      setLoginPassword('');
    }
    setIsSigningIn(false);
  };

  const handleAdminSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(`Could not sign out: ${error.message}`);
      return;
    }
    setAdminSession(null);
    setIsStoreAdmin(false);
    setCurrentView('home');
  };

  const handleOrderStatusChange = async (order: Order, status: Order['status']) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('store_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order.id);

    if (error) {
      showToast(`Could not update order ${order.orderNumber}: ${error.message}`);
      return;
    }
    setOrders((previous) =>
      previous.map((item) => item.id === order.id ? { ...item, status } : item)
    );
  };

  const [activeTab, setActiveTab] = useState<'products' | 'blogs' | 'orders' | 'supabase'>('products');
  
  // Product state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<'baby-boys' | 'baby-girls' | 'newborn-sets' | 'rompers'>('baby-boys');
  const [newPrice, setNewPrice] = useState<number>(3450);
  const [newComparePrice, setNewComparePrice] = useState<number>(4200);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80');
  const [newDescription, setNewDescription] = useState('Pure mulmul cotton festive baby suit.');
  const [newFabric, setNewFabric] = useState('100% Egyptian Lawn with Mulmul Cotton Lining');

  // Blog post state
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState<BlogPost['category']>('Baby Care');
  const [blogAuthor, setBlogAuthor] = useState('Auren Editorial');
  const [blogReadTime, setBlogReadTime] = useState('4 min read');
  const [blogCoverImage, setBlogCoverImage] = useState('https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogIsPublished, setBlogIsPublished] = useState(true);

  // --- Handlers: Products ---
  const handleSaveProdEdit = (id: string) => {
    updateProduct(id, { price: editPrice, stock: editStock });
    setEditingProdId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSku.trim()) return;

    addProduct({
      title: newTitle,
      sku: newSku,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      subCategory: 'rompers-sleepsuits',
      occasion: 'Festive',
      price: Number(newPrice),
      compareAtPrice: newComparePrice ? Number(newComparePrice) : undefined,
      images: [newImageUrl],
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
      colors: [{ name: 'Royal Ivory', hex: '#FAF9F6' }, { name: 'Warm Cream', hex: '#FAF0E6' }],
      description: newDescription,
      fabricDetails: newFabric,
      careInstructions: 'Gentle baby wash in cold water.',
      isNewArrival: true,
      isBestSeller: false,
      stock: 20,
      rating: 0,
      reviewCount: 0,
      featured: false
    });

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewSku('');
  };

  // --- Handlers: Blogs ---
  const handleOpenAddBlog = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogCategory('Baby Care');
    setBlogAuthor('Auren Editorial');
    setBlogReadTime('4 min read');
    setBlogCoverImage('https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogIsPublished(true);
    setIsAddBlogOpen(true);
  };

  const handleStartEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogReadTime(post.readTime);
    setBlogCoverImage(post.coverImage);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogIsPublished(post.isPublished);
    setIsAddBlogOpen(true);
  };

  const handleSaveBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    const autoSlug = blogSlug.trim() || blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingBlogId) {
      updateBlogPost(editingBlogId, {
        title: blogTitle,
        slug: autoSlug,
        category: blogCategory,
        author: blogAuthor,
        readTime: blogReadTime,
        coverImage: blogCoverImage,
        excerpt: blogExcerpt,
        content: blogContent,
        isPublished: blogIsPublished
      });
    } else {
      addBlogPost({
        title: blogTitle,
        slug: autoSlug,
        category: blogCategory,
        author: blogAuthor,
        readTime: blogReadTime,
        coverImage: blogCoverImage,
        excerpt: blogExcerpt,
        content: blogContent,
        isPublished: blogIsPublished
      });
    }

    setIsAddBlogOpen(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-editorial text-3xl text-stone-900">Store owner sign in</h1>
        <p className="mt-4 text-sm text-stone-600">
          Admin access is unavailable until Supabase is configured and the store schema is installed.
          No shared PIN or browser-only unlock is used.
        </p>
      </section>
    );
  }

  if (authLoading) {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center text-sm text-stone-600" aria-live="polite">
        Checking store-owner access…
      </section>
    );
  }

  if (!adminSession || !isStoreAdmin) {
    return (
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-editorial text-3xl text-stone-900 text-center">Store owner sign in</h1>
        {adminSession ? (
          <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-stone-700">
            <p>This account is authenticated but is not authorized to administer this store.</p>
            <button type="button" onClick={handleAdminSignOut} className="mt-3 underline">
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSignIn} className="mt-6 space-y-4 rounded border border-stone-200 bg-white p-6">
            <label className="block text-sm text-stone-700">
              Email
              <input
                type="email"
                required
                autoComplete="username"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm text-stone-700">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              />
            </label>
            {authError && <p role="alert" className="text-sm text-rose-700">{authError}</p>}
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full rounded bg-stone-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSigningIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
        {!adminSession && authError && <p role="alert" className="mt-3 text-center text-sm text-rose-700">{authError}</p>}
        <p className="mt-4 text-center text-xs text-stone-500">
          Admin accounts must be created in Supabase and explicitly added to the store-admin list.
        </p>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
        <div>
          <span className="text-stone-500 text-xs uppercase tracking-widest font-semibold block mb-1">
            STORE OWNER CONSOLE
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-stone-900">
            Auren Attire Management
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Easily update products, publish or edit blog articles, and inspect live orders without editing source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void handleAdminSignOut()}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock administrative console"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>

          {activeTab === 'products' ? (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Baby Suit</span>
            </button>
          ) : activeTab === 'blogs' ? (
            <button
              onClick={handleOpenAddBlog}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write Blog Article</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-stone-200 mb-8 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Baby Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'blogs'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Blog Articles ({blogPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Log ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'supabase'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Architecture</span>
        </button>
      </div>

      {/* 1. Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 text-xs text-stone-500">
            Manage live baby wear pricing, inventory, and variants.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Baby Suit</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price (PKR)</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const isEditing = editingProdId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-12 object-cover rounded-xs border border-stone-200 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-stone-900 block truncate">{p.title}</span>
                          <span className="text-[10px] text-stone-400">
                            Sizes: {p.sizes.join(', ')}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-stone-600 font-medium">
                        {p.sku}
                      </td>

                      <td className="py-3 px-3 uppercase text-stone-600 font-medium">
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px]">
                          {p.category.replace('-', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-24 bg-white border border-stone-300 px-2 py-1 rounded text-xs"
                          />
                        ) : (
                          <span className="font-bold text-stone-900">{formatPKR(p.price)}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-16 bg-white border border-stone-300 px-2 py-1 rounded text-xs"
                          />
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.stock} in stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveProdEdit(p.id)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Save changes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProdId(p.id);
                              setEditPrice(p.price);
                              setEditStock(p.stock);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                            title="Edit price/stock"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Blog Articles Management Tab */}
      {activeTab === 'blogs' && (
        <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Published articles appear exclusively on the separate <strong>/blog</strong> page</span>
            <button
              onClick={navigateToBlog}
              className="text-stone-900 font-semibold underline flex items-center gap-1"
            >
              <span>View Public Blog</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-12 h-10 object-cover rounded-xs border border-stone-200 shrink-0 bg-stone-100"
                      />
                      <div className="max-w-md">
                        <strong className="text-stone-900 block truncate">{post.title}</strong>
                        <span className="text-[11px] font-mono text-stone-400">/blog/{post.slug}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-medium">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600">{post.author}</td>
                    <td className="py-3 px-3 text-stone-500 text-[11px]">{post.publishedAt}</td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => updateBlogPost(post.id, { isPublished: !post.isPublished })}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          post.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {post.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{post.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => navigateToBlogPost(post.slug)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="View published article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleStartEditBlog(post)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Orders Log Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 rounded-sm p-6">
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs font-medium text-stone-700">
              Search orders
              <input
                type="search"
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Order number, customer, or phone"
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              />
            </label>
            <label className="text-xs font-medium text-stone-700">
              Filter by status
              <select
                value={orderStatusFilter}
                onChange={(event) => setOrderStatusFilter(event.target.value as 'all' | Order['status'])}
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          {visibleOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="font-editorial text-lg font-bold text-stone-800">
                {orders.length === 0 ? 'No orders recorded yet' : 'No orders match your search'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-stone-50 border border-stone-200 rounded text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                    <span className="text-[10px] text-stone-400">{new Date(ord.createdAt).toLocaleString()}</span>
                    <label className="flex items-center gap-2">
                      <span className="sr-only">Status for {ord.orderNumber}</span>
                      <select
                        value={ord.status}
                        onChange={(event) => void handleOrderStatusChange(ord, event.target.value as Order['status'])}
                        className="rounded border border-stone-300 bg-white px-2 py-1 font-semibold uppercase text-[10px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className="text-[10px] text-stone-500">COD</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600">
                    <div>
                      <strong className="text-stone-900 block">Customer:</strong>
                      <span>{ord.customer.fullName} ({ord.customer.phone})</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Delivery City:</strong>
                      <span>{ord.customer.city}, {ord.customer.province}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <strong className="text-stone-900 block">Delivery Address:</strong>
                      <span>{ord.customer.address}</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Total:</strong>
                      <span className="font-bold text-stone-900">{formatPKR(ord.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Supabase Architecture Tab */}
      {activeTab === 'supabase' && (
        <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Database className="w-5 h-5 text-stone-700" />
            <span>Supabase store connection</span>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Apply the additive migration at <code>src/db/store-migration.sql</code> in your Supabase SQL Editor.
            It adds separate store tables and row-level security without dropping the existing schema.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Configure the Vite public project URL and anon key in the local environment and Netlify.
            Never place a Supabase service-role key in browser code or a VITE-prefixed variable.
          </p>
        </div>
      )}

      {/* Add / Edit Blog Post Modal */}
      {isAddBlogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-stone-950/70" onClick={() => setIsAddBlogOpen(false)} />
          <div className="relative bg-white text-stone-900 w-full max-w-2xl rounded-md shadow-2xl p-6 sm:p-8 z-10 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <h2 className="font-editorial text-2xl font-bold text-stone-900">
                {editingBlogId ? 'Edit Blog Article' : 'Write New Blog Article'}
              </h2>
              <button onClick={() => setIsAddBlogOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => {
                    setBlogTitle(e.target.value);
                    if (!editingBlogId) {
                      setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Caring for Baby Combed Cotton"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">URL Slug (/blog/[slug]) *</label>
                  <input
                    type="text"
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="caring-for-baby-combed-cotton"
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  >
                    <option value="Baby Care">Baby Care</option>
                    <option value="Newborn Essentials">Newborn Essentials</option>
                    <option value="Styling & Sizing">Styling & Sizing</option>
                    <option value="Heritage Fabrics">Heritage Fabrics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={blogCoverImage}
                  onChange={(e) => setBlogCoverImage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Excerpt (Lead summary) *</label>
                <textarea
                  required
                  rows={2}
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="A brief overview of the article..."
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Article Body Content *</label>
                <textarea
                  required
                  rows={7}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write article content here. You can use ### Section for headings."
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={blogIsPublished}
                  onChange={(e) => setBlogIsPublished(e.target.checked)}
                  className="accent-stone-900 rounded"
                />
                <label htmlFor="publishToggle" className="font-semibold text-stone-800 cursor-pointer">
                  Publish article live on /blog
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddBlogOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold uppercase tracking-wider rounded"
                >
                  {editingBlogId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-stone-950/70" onClick={() => setIsAddProductOpen(false)} />
          <div className="relative bg-white text-stone-900 w-full max-w-xl rounded-md shadow-2xl p-6 sm:p-8 z-10 border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <h2 className="font-editorial text-2xl font-bold text-stone-900">
                Add New Baby Suit
              </h2>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Baby Girl Chikankari Angrakha Suit"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. AUR-BB-501"
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  >
                    <option value="baby-boys">Baby Boys</option>
                    <option value="baby-girls">Baby Girls</option>
                    <option value="newborn-sets">Newborn Sets</option>
                    <option value="rompers">Rompers & Suits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price in PKR (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Compare Price (Rs.)</label>
                  <input
                    type="number"
                    value={newComparePrice}
                    onChange={(e) => setNewComparePrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold uppercase tracking-wider rounded"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
