import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Lock,
  User,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType, PageView } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    currentView, 
    setCurrentView, 
    quickCategorySelect,
    navigateToBlog,
    filters,
    setFilters,
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    showToast
  } = useShop();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery: localSearch
    }));
    setCurrentView('shop');
    setIsSearchOpen(false);
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAdmin(adminPin)) {
      setIsAdminPinModalOpen(false);
      setAdminPin('');
      setPinError(false);
      setCurrentView('admin');
    } else {
      setPinError(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">

      {/* 2. Main Minimal Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none ml-1"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Center/Left Brand Logo */}
          <div 
            className="text-center cursor-pointer select-none lg:text-left" 
            onClick={() => {
              setCurrentView('home');
              window.history.pushState({}, '', '/');
            }}
          >
            <span className="block font-editorial text-2xl sm:text-3xl tracking-[0.18em] uppercase font-bold text-stone-900">
              AUREN ATTIRE
            </span>
            <span className="block text-[8px] uppercase tracking-[0.3em] text-stone-500 font-medium -mt-1">
              BABY & NEWBORN • PAKISTAN
            </span>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-[0.15em] uppercase font-medium text-stone-700">
            <button
              onClick={() => {
                setCurrentView('home');
                window.history.pushState({}, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors py-2 relative ${
                currentView === 'home' ? 'text-stone-950 font-bold' : 'hover:text-stone-950'
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"></span>
              )}
            </button>

            <button
              onClick={() => quickCategorySelect('baby-boys')}
              className={`transition-colors py-2 relative ${
                currentView === 'shop' && filters.category === 'baby-boys'
                  ? 'text-stone-950 font-bold'
                  : 'hover:text-stone-950'
              }`}
            >
              Baby Boys
            </button>

            <button
              onClick={() => quickCategorySelect('baby-girls')}
              className={`transition-colors py-2 relative ${
                currentView === 'shop' && filters.category === 'baby-girls'
                  ? 'text-stone-950 font-bold'
                  : 'hover:text-stone-950'
              }`}
            >
              Baby Girls
            </button>

            <button
              onClick={() => quickCategorySelect('newborn-sets')}
              className={`transition-colors py-2 relative ${
                currentView === 'shop' && filters.category === 'newborn-sets'
                  ? 'text-stone-950 font-bold'
                  : 'hover:text-stone-950'
              }`}
            >
              Newborn Sets
            </button>

            <button
              onClick={() => quickCategorySelect('rompers')}
              className={`transition-colors py-2 relative ${
                currentView === 'shop' && filters.category === 'rompers'
                  ? 'text-stone-950 font-bold'
                  : 'hover:text-stone-950'
              }`}
            >
              Rompers & Suits
            </button>

            {/* Strict Blog Link */}
            <button
              onClick={navigateToBlog}
              className={`transition-colors py-2 relative ${
                currentView === 'blog' || currentView === 'blog-post'
                  ? 'text-stone-950 font-bold'
                  : 'hover:text-stone-950'
              }`}
            >
              Blog
              {(currentView === 'blog' || currentView === 'blog-post') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"></span>
              )}
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-stone-700">
            {/* Search Toggle (Desktop) */}
            <div className="hidden lg:block relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search baby suits..."
                    className="bg-stone-50 border border-stone-300 text-xs text-stone-800 px-3 py-1.5 rounded-l-md w-48 focus:outline-none focus:border-stone-900"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 text-white px-3 py-1.5 rounded-r-md text-xs font-semibold"
                    aria-label="Submit search"
                  >
                    Go
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 text-stone-400 hover:text-stone-800"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 hover:text-stone-950 transition-colors"
                  aria-label="Search collection"
                >
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('shop');
              }}
              className="relative p-1.5 hover:text-stone-950 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 hover:text-stone-950 transition-colors"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Private Owner Access Trigger (Hidden/Discreet for store owner only) */}
            <button
              type="button"
              onClick={() => {
                if (isAdminUnlocked) {
                  setCurrentView('admin');
                } else {
                  setIsAdminPinModalOpen(true);
                }
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              title={isAdminUnlocked ? "Admin Dashboard (Unlocked)" : "Store Owner Portal"}
              aria-label="Store Owner Portal"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search baby suits, rompers, newborn..."
                className="bg-stone-50 border border-stone-300 text-xs text-stone-900 px-3 py-2 rounded-l-md w-full focus:outline-none focus:border-stone-900"
                autoFocus
              />
              <button
                type="submit"
                className="bg-stone-900 text-white px-4 py-2 rounded-r-md text-xs font-bold"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Secret Store Owner PIN Modal */}
      {isAdminPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-md max-w-xs w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-stone-700" />
                <span>Store Owner Access</span>
              </div>
              <button 
                onClick={() => {
                  setIsAdminPinModalOpen(false);
                  setPinError(false);
                }}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <p className="text-xs text-stone-500">
                Enter your administrative PIN to manage products, blogs, and orders.
              </p>
              <div>
                <input
                  type="password"
                  autoFocus
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="PIN code"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-sm text-center tracking-widest font-mono focus:outline-none focus:border-stone-900"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-600 mt-1.5 text-center">
                    Incorrect password
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
