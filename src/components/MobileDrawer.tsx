import React from 'react';
import { 
  X, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  PhoneCall, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { STORE_PHONE_NUMBER } from '../utils/shop';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { quickCategorySelect, setCurrentView, navigateToBlog } = useShop();

  if (!isOpen) return null;

  const handleNav = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white text-stone-900 h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-stone-200 z-10">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div>
              <span className="font-editorial text-xl font-bold tracking-widest text-stone-900 block">
                AUREN ATTIRE
              </span>
              <span className="text-[8px] uppercase tracking-widest text-stone-500 block">
                Baby & Newborn Luxury • Pakistan
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => handleNav(() => setCurrentView('home'))}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-800 hover:bg-stone-50"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Baby Boys */}
            <button
              onClick={() => handleNav(() => quickCategorySelect('baby-boys'))}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-800 hover:bg-stone-50 border-t border-stone-100"
            >
              <span>Baby Boys (Suits & Kurtas)</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Baby Girls */}
            <button
              onClick={() => handleNav(() => quickCategorySelect('baby-girls'))}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-800 hover:bg-stone-50 border-t border-stone-100"
            >
              <span>Baby Girls (Peplum & Ghararas)</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Newborn Sets */}
            <button
              onClick={() => handleNav(() => quickCategorySelect('newborn-sets'))}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-800 hover:bg-stone-50 border-t border-stone-100"
            >
              <span>Newborn Essentials & Sets</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Rompers & Suits */}
            <button
              onClick={() => handleNav(() => quickCategorySelect('rompers'))}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-800 hover:bg-stone-50 border-t border-stone-100"
            >
              <span>Rompers & Ajrak Suits</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Blog Link */}
            <button
              onClick={() => handleNav(navigateToBlog)}
              className="w-full flex items-center justify-between px-3 py-3 rounded text-stone-900 bg-stone-100/70 hover:bg-stone-100 border-t border-stone-100 font-bold"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>The Auren Journal (Blog)</span>
              </span>
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </button>
          </div>

          {/* Institutional Links */}
          <div className="p-4 border-t border-stone-100 space-y-1 text-xs text-stone-600 font-normal">
            <button
              onClick={() => handleNav(() => setCurrentView('about'))}
              className="w-full text-left py-2 px-3 hover:bg-stone-50 rounded flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>About Auren Attire</span>
            </button>
            <button
              onClick={() => handleNav(() => setCurrentView('shipping'))}
              className="w-full text-left py-2 px-3 hover:bg-stone-50 rounded flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Nationwide Delivery Policy</span>
            </button>
            <button
              onClick={() => handleNav(() => setCurrentView('returns'))}
              className="w-full text-left py-2 px-3 hover:bg-stone-50 rounded flex items-center gap-2"
            >
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              <span>7-Day Return & Exchange</span>
            </button>
            <button
              onClick={() => handleNav(() => setCurrentView('contact'))}
              className="w-full text-left py-2 px-3 hover:bg-stone-50 rounded flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-stone-400" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* Footer WhatsApp direct button */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <a
            href={`https://wa.me/923258990087?text=${encodeURIComponent('Hello! I would like personal assistance shopping Auren Attire baby wear.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded flex items-center justify-center gap-2 text-xs font-semibold tracking-wide transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp (03258990087)</span>
          </a>
          <p className="text-[10px] text-center text-stone-500 mt-2">
            Nationwide Delivery Across Pakistan • Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
};
