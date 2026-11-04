/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShopProvider, 
  useShop 
} from './context/ShopContext';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { FeaturedSections } from './components/FeaturedSections';
import { ShopPage } from './components/ShopPage';
import { BlogPage } from './components/BlogPage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  AboutPage, 
  ContactPage, 
  ShippingPolicyPage, 
  ReturnsPolicyPage 
} from './components/InfoPages';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { Footer } from './components/Footer';
import { 
  Home, 
  Layers, 
  ShoppingBag, 
  MessageCircle, 
  CheckCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { STORE_PHONE_NUMBER } from './utils/shop';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cart, 
    setIsCartOpen,
    toastMessage,
    quickCategorySelect,
    navigateToBlog,
    activeBlogSlug,
    blogPosts,
    selectedProduct,
    filters
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const pageMetadata: Record<string, { title: string; description: string }> = {
      home: {
        title: 'Auren Attire | Luxury Pakistani Kids & Baby Wear',
        description: 'Discover premium Pakistani children’s clothing and luxury baby wear by Auren Attire. Handcrafted festive Eastern collections, soft cottons, and modern designs with nationwide delivery across Pakistan.',
      },
      shop: {
        title: 'Shop Baby & Kids Clothing | Auren Attire',
        description: 'Shop baby boys’ and girls’ clothing, newborn sets, rompers, and Pakistani festive wear at Auren Attire.',
      },
      blog: {
        title: 'The Auren Journal | Auren Attire',
        description: 'Explore baby clothing, sizing, fabric, and care guides from the Auren Attire journal.',
      },
      about: {
        title: 'About Auren Attire | Baby & Kids Clothing',
        description: 'Learn about Auren Attire and our approach to Pakistani baby and children’s clothing.',
      },
      contact: {
        title: 'Contact Auren Attire',
        description: 'Contact Auren Attire for help with baby clothing, orders, sizing, and delivery.',
      },
      shipping: {
        title: 'Shipping Policy | Auren Attire',
        description: 'Read Auren Attire’s delivery information for orders across Pakistan.',
      },
      returns: {
        title: 'Returns & Exchange Policy | Auren Attire',
        description: 'Read Auren Attire’s returns and exchange information before placing an order.',
      },
      privacy: {
        title: 'Privacy Policy | Auren Attire',
        description: 'Learn how Auren Attire handles information submitted through the storefront.',
      },
      terms: {
        title: 'Terms and Conditions | Auren Attire',
        description: 'Review the terms for browsing and shopping with Auren Attire.',
      },
      admin: {
        title: 'Store Administration | Auren Attire',
        description: 'Auren Attire store administration.',
      },
    };
    const blogPost = currentView === 'blog-post'
      ? blogPosts.find((post) => post.slug === activeBlogSlug)
      : undefined;
    const productPage = window.location.pathname.startsWith('/product/') ? selectedProduct : null;
    const categoryMetadata = {
      'baby-boys': {
        title: 'Baby Boys’ Suits & Kurtas | Auren Attire',
        description: 'Shop Pakistani baby boys’ suits and kurtas at Auren Attire, with nationwide delivery across Pakistan.',
      },
      'baby-girls': {
        title: 'Baby Girls’ Festive Wear | Auren Attire',
        description: 'Explore baby girls’ festive wear and traditional outfits at Auren Attire.',
      },
      'newborn-sets': {
        title: 'Newborn Clothing & Sets | Auren Attire',
        description: 'Shop newborn clothing and baby sets at Auren Attire, with nationwide delivery across Pakistan.',
      },
      rompers: {
        title: 'Baby Rompers & Suits | Auren Attire',
        description: 'Explore baby rompers and everyday suits at Auren Attire.',
      },
    } as const;
    const categoryPage = currentView === 'shop' && filters.category !== 'all'
      ? categoryMetadata[filters.category]
      : undefined;
    const metadata = blogPost
      ? {
          title: `${blogPost.title} | The Auren Journal`,
          description: blogPost.excerpt,
        }
      : productPage
        ? {
            title: `${productPage.title} | Auren Attire`,
            description: productPage.description,
          }
        : categoryPage ?? pageMetadata[currentView] ?? pageMetadata.home;
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

    document.title = metadata.title;
    const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setMeta('name', 'description', metadata.description);
    setMeta('property', 'og:title', metadata.title);
    setMeta('property', 'og:description', metadata.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'robots', currentView === 'admin' ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [activeBlogSlug, blogPosts, currentView, filters.category, selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 font-sans selection:bg-[#eae3d9] selection:text-stone-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-stone-900 text-stone-100 text-xs px-4 py-3 rounded shadow-2xl border border-stone-800 flex items-center gap-2 max-w-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* HOMEPAGE: Exclusively focused on clothing brand & shopping (Zero blog cards/sections) */}
        {currentView === 'home' && (
          <>
            <Hero />
            <CategoryShowcase />
            <FeaturedSections />
          </>
        )}

        {/* SHOP PAGE */}
        {currentView === 'shop' && <ShopPage />}

        {/* SEPARATE BLOG PAGE (/blog & /blog/[slug]) */}
        {(currentView === 'blog' || currentView === 'blog-post') && <BlogPage />}

        {/* INSTITUTIONAL PAGES */}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'shipping' && <ShippingPolicyPage />}
        {currentView === 'returns' && <ReturnsPolicyPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
        {currentView === 'terms' && <TermsAndConditionsPage />}

        {/* ADMIN DASHBOARD (Accessible by store owner) */}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <SizeGuideModal />
      <CartDrawer />
      <CheckoutModal />

      {/* Floating WhatsApp Quick Concierge (Bottom Right, Never Overlaps Content) */}
      <aside aria-label="Customer Support" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <a
          href={`https://wa.me/923258990087?text=${encodeURIComponent('Hello Auren Attire! I am shopping for baby wear on your website and would like styling assistance.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          title="Chat directly on WhatsApp (03258990087)"
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
          </div>
          <span className="hidden sm:inline text-xs font-semibold tracking-wide">WhatsApp Help</span>
        </a>
      </aside>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation" 
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 text-stone-700 flex items-center justify-around py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'home' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-950'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            quickCategorySelect('baby-boys');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'shop' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-950'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Suits</span>
        </button>

        <button
          onClick={() => {
            quickCategorySelect('newborn-sets');
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-stone-500 hover:text-stone-950 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Newborn</span>
        </button>

        <button
          onClick={navigateToBlog}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'blog' || currentView === 'blog-post' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-950'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-stone-500 hover:text-stone-950 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-stone-900 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>
      </nav>

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
