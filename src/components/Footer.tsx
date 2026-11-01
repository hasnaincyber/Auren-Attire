import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Ruler,
  Lock,
  BookOpen
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { STORE_PHONE_NUMBER, STORE_EMAIL } from '../utils/shop';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    quickCategorySelect, 
    setIsSizeGuideOpen, 
    showToast,
    navigateToBlog,
    isAdminUnlocked 
  } = useShop();
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      showToast('Welcome to the Auren Attire family! Use code AUREN10 for 10% off your baby wear order.');
    }
  };

  return (
    <footer className="bg-[#ede7de] text-stone-700 border-t border-[#dfd7cc] pb-24 lg:pb-12">
      
      {/* 1. Value Pillars Strip */}
      <div className="border-b border-[#dfd7cc] py-6 bg-[#f5efe7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-stone-800" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-900">
                Cash on Delivery
              </h4>
              <p className="text-[10px] text-stone-500 font-light">
                Nationwide door-to-door delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-stone-800" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-900">
                100% Mulmul Lining
              </h4>
              <p className="text-[10px] text-stone-500 font-light">
                Gentle on tender baby skin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-stone-800" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-900">
                7-Day Size Exchange
              </h4>
              <p className="text-[10px] text-stone-500 font-light">
                Hassle-free infant swaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-900">
                WhatsApp Helpline
              </h4>
              <p className="text-[10px] text-stone-500 font-light">
                {STORE_PHONE_NUMBER}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (No physical address option) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-editorial text-2xl font-bold tracking-[0.18em] uppercase text-stone-900 block">
              AUREN ATTIRE
            </span>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm font-light">
              Luxury Pakistani suits, heirloom festive ensembles, and organic cotton essentials crafted exclusively for babies and newborns.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-stone-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                <span className="font-mono">{STORE_PHONE_NUMBER}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                <span>{STORE_EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-[0.15em] text-stone-900 mb-3">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => quickCategorySelect('baby-boys')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Baby Boys Suits & Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => quickCategorySelect('baby-girls')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Baby Girls Peplum Ghararas
                </button>
              </li>
              <li>
                <button
                  onClick={() => quickCategorySelect('newborn-sets')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Newborn 3-Piece Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => quickCategorySelect('rompers')}
                  className="hover:text-stone-950 transition-colors"
                >
                  Organic Ajrak Rompers
                </button>
              </li>
              <li>
                <button
                  onClick={navigateToBlog}
                  className="hover:text-stone-950 transition-colors flex items-center gap-1 font-medium text-stone-900"
                >
                  <BookOpen className="w-3 h-3 text-stone-700" />
                  <span>The Auren Journal (Blog)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-[0.15em] text-stone-900 mb-3">
              Client Care
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-stone-950 transition-colors flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Baby Sizing Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('shipping');
                    window.history.pushState({}, '', '/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 transition-colors"
                >
                  Nationwide Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('returns');
                    window.history.pushState({}, '', '/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 transition-colors"
                >
                  7-Day Size Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.history.pushState({}, '', '/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.history.pushState({}, '', '/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-[0.15em] text-stone-900 mb-3">
              Private Circle
            </h3>
            <p className="text-xs text-stone-600 mb-3 font-light leading-relaxed">
              Receive previews of upcoming newborn collections and private promotions.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-white border border-stone-300 rounded text-xs text-stone-800 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>VIP Invitation Activated!</span>
                </div>
                <p className="text-[10px] text-stone-600">
                  Use coupon <strong>AUREN10</strong> for 10% off.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full bg-white border border-stone-300 text-xs text-stone-800 px-3 py-2 rounded focus:outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Join VIP List
                </button>
              </form>
            )}

            <div className="mt-3">
              <a
                href={`https://wa.me/923258990087?text=${encodeURIComponent('Hello Auren Attire! I would like to inquire about baby suits.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {STORE_PHONE_NUMBER}</span>
              </a>
            </div>
          </div>

        </div>

        {/* 3. Bottom Bar with Discreet Admin Access */}
        <div className="mt-10 pt-6 border-t border-[#dfd7cc] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 Auren Attire Pakistan. Handcrafted for babies and newborns.</p>
          
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-white/70 border border-stone-300 rounded text-[10px] text-stone-700">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 bg-white/70 border border-stone-300 rounded text-[10px] text-stone-700">
              TCS / Trax Express
            </span>

            {/* Discreet Admin Link for store owner only */}
            {isAdminUnlocked ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="text-[10px] text-stone-700 hover:text-stone-950 underline font-mono flex items-center gap-1"
                title="Admin Dashboard (Unlocked)"
              >
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Store Admin</span>
              </button>
            ) : (
              <span className="text-[10px] text-stone-400">
                Pakistan
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
