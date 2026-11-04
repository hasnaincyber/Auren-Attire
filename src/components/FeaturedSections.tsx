import React, { useState } from 'react';
import { ArrowRight, Sparkles, Award, Shield, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CategoryType } from '../types';

export const FeaturedSections: React.FC = () => {
  const { products, setCurrentView, setFilters } = useShop();
  const [newArrivalTab, setNewArrivalTab] = useState<CategoryType>('all');

  // Filter New Arrivals (Baby suits only)
  const newArrivals = products
    .filter((p) => p.isNewArrival)
    .filter((p) => newArrivalTab === 'all' || p.category === newArrivalTab)
    .slice(0, 4);

  // Filter Best Sellers
  const bestSellers = products
    .filter((p) => p.isBestSeller)
    .slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      
      {/* 1. New Arrivals Section (Zero blog content, strictly shopping) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-5 mb-8 gap-4">
          <div>
            <span className="text-stone-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mb-1 block">
              JUST UNVEILED
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-normal tracking-wide text-stone-900 uppercase">
              New Baby Arrivals
            </h2>
          </div>

          {/* Category Tabs for Baby */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setNewArrivalTab('all')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold transition-colors whitespace-nowrap ${
                newArrivalTab === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setNewArrivalTab('baby-boys')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold transition-colors whitespace-nowrap ${
                newArrivalTab === 'baby-boys'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Baby Boys
            </button>
            <button
              onClick={() => setNewArrivalTab('baby-girls')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold transition-colors whitespace-nowrap ${
                newArrivalTab === 'baby-girls'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Baby Girls
            </button>
            <button
              onClick={() => setNewArrivalTab('newborn-sets')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold transition-colors whitespace-nowrap ${
                newArrivalTab === 'newborn-sets'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Newborn
            </button>
          </div>
        </div>

        {/* Product Cards: 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: newArrivalTab }));
              setCurrentView('shop');
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
          >
            <span>View All Baby Wear</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. Editorial Craftsmanship Banner (Lighter, warmer Donsje feel) */}
      <section className="bg-[#ede7de] text-stone-900 py-16 sm:py-20 border-y border-[#ded6cb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-stone-600 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
              THE AUREN ATTIRE PROMISE
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight mb-5 leading-tight">
              Designed for celebrations, crafted for tender baby skin.
            </h2>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-8 font-light">
              We believe baby celebratory suits should never cause fussiness or prickliness. Every Auren infant ensemble is underlaid with pure Egyptian lawn or mulmul cotton, eliminating rough edges, harsh tags, and stiff buckram.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-stone-800" />
                </div>
                <div>
                  <h3 className="font-editorial text-base font-bold text-stone-900 mb-0.5">
                    Mulmul Inner Lining
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Zero prickliness. Feather-soft pure cotton cushions tender newborn skin.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-stone-800" />
                </div>
                <div>
                  <h3 className="font-editorial text-base font-bold text-stone-900 mb-0.5">
                    Master Artisan Tailoring
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Gentle hand resham threadwork and authentic Sindhi Ajrak block prints.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg border border-stone-300">
            <img
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80"
              alt="Baby Wearing Auren Attire"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* 3. Best Sellers Section (Strictly shopping, no blogs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-stone-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold block mb-1">
            CHERISHED BY FAMILIES
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal tracking-wide text-stone-900 uppercase">
            Most Loved Baby Suits
          </h2>
          <div className="w-12 h-0.5 bg-stone-400 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};
