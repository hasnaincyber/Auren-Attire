import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { filterProducts } from '../utils/shop';

export const ShopPage: React.FC = () => {
  const { products, filters, setFilters, resetFilters } = useShop();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = filterProducts(products, filters);

  const availableSizes = ['0-3M', '3-6M', '6-12M', '12-18M', '1-2Y'];
  const availableOccasions = ['Festive', 'Casual', 'Newborn Essentials'];

  const toggleSizeFilter = (size: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const toggleOccasionFilter = (occasion: string) => {
    setFilters((prev) => {
      const exists = prev.occasions.includes(occasion);
      return {
        ...prev,
        occasions: exists ? prev.occasions.filter((o) => o !== occasion) : [...prev.occasions, occasion]
      };
    });
  };

  const handleCategoryChange = (cat: CategoryType) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      subCategory: 'all'
    }));
  };

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.subCategory !== 'all' ||
    filters.sizes.length > 0 ||
    filters.occasions.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice > 0 ||
    filters.searchQuery !== '' ||
    filters.inStockOnly;

  const categoryLabels: Record<CategoryType, string> = {
    'all': 'All Baby Wear',
    'baby-boys': 'Baby Boys',
    'baby-girls': 'Baby Girls',
    'newborn-sets': 'Newborn Sets',
    'rompers': 'Rompers & Suits'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* 1. Page Header */}
      <div className="border-b border-stone-200 pb-6 mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
        <div>
          <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-1">
            BABY & NEWBORN ATTIRE
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-stone-900 tracking-wide uppercase">
            {categoryLabels[filters.category] || 'Baby Collection'}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl font-light">
            Pure combed cotton mulmul suits, traditional kurtas, peplum ghararas, and hypoallergenic organic muslin sets.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-end gap-1.5 mt-4 sm:mt-0 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {(['all', 'baby-boys', 'baby-girls', 'newborn-sets', 'rompers'] as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xs text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                filters.category === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-white border border-stone-200/90 rounded-sm mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-600 ml-0.5"></span>
            )}
          </button>

          <span className="text-xs text-stone-600">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> baby designs
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline">Sort By:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            className="bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 py-1.5 px-3 rounded focus:outline-none focus:border-stone-400"
          >
            <option value="featured">Featured & Best Selling</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-stone-400">Active Filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs">
              {categoryLabels[filters.category]}
              <button onClick={() => setFilters((p) => ({ ...p, category: 'all' }))} className="hover:text-amber-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.sizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-300 rounded text-xs">
              Size: {s}
              <button onClick={() => toggleSizeFilter(s)} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-300 rounded text-xs">
              &quot;{filters.searchQuery}&quot;
              <button onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-stone-600 hover:text-stone-900 underline ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* 3. Main Grid Layout with Desktop Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-sm border border-stone-200/90 h-fit">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-stone-900">
              Refine Baby Suits
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Sizes Filter for Baby */}
          <div>
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">
              Baby Size & Age
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {availableSizes.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSizeFilter(sz)}
                    className={`py-1.5 px-2 text-xs rounded-sm border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white font-bold'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-stone-50'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="border-t border-stone-100 pt-5">
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">
              Occasion
            </h3>
            <div className="space-y-1.5">
              {availableOccasions.map((occ) => (
                <label key={occ} className="flex items-center gap-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.occasions.includes(occ)}
                    onChange={() => toggleOccasionFilter(occ)}
                    className="accent-stone-900 rounded"
                  />
                  <span>{occ}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-stone-100 pt-5">
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">
              Price Range (PKR)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500">Min (Rs.)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters((p) => ({ ...p, minPrice: Number(e.target.value) }))}
                  className="w-full bg-stone-50 border border-stone-200 text-xs px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500">Max (Rs.)</label>
                <input
                  type="number"
                  placeholder="10,000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                  className="w-full bg-stone-50 border border-stone-200 text-xs px-2 py-1 rounded"
                />
              </div>
            </div>
          </div>

          {/* In Stock Only */}
          <div className="border-t border-stone-100 pt-5">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))}
                className="accent-stone-900 rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-sm p-12 text-center">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h2 className="font-editorial text-2xl font-bold text-stone-800 mb-2">
                No baby designs found matching your criteria
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                Try clearing selected sizes or filters to view all available baby suits.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div 
            className="fixed inset-0 bg-stone-950/60"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="font-editorial text-lg font-bold text-stone-900">Refine Baby Suits</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Baby Size & Age
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {availableSizes.map((sz) => {
                    const isSelected = filters.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSizeFilter(sz)}
                        className={`py-1.5 text-xs rounded border ${
                          isSelected ? 'bg-stone-900 text-white font-bold' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
