import React from 'react';
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { calculateDiscountPercent, formatPKR } from '../utils/shop';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigateToProduct,
    toggleWishlist, 
    isInWishlist, 
    addToCart 
  } = useShop();

  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first available size and color
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#000000' };
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <div 
      onClick={() => navigateToProduct(product.slug)}
      className="group relative flex flex-col bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* 1. Image Container */}
      <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Secondary Image on Hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-wider uppercase bg-stone-900 text-stone-100 rounded-xs shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded-xs shadow-sm flex items-center gap-0.5 sm:gap-1">
              <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
              BEST
            </span>
          )}
          {discount > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-wider uppercase bg-rose-700 text-white rounded-xs shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full transition-colors z-10 shadow-sm ${
            isWishlisted 
              ? 'bg-rose-600 text-white' 
              : 'bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Quick Add Action Overlay on Hover (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-2 bottom-2.5 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateToProduct(product.slug);
            }}
            className="flex-1 py-2.5 bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          
          <button
            type="button"
            onClick={handleQuickAdd}
            className="px-3 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors"
            title="Quick Add to Bag"
            aria-label="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Occasion */}
          <div className="flex items-center text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-wider mb-1 font-medium">
            <span className="truncate pr-1">{product.category.replace('-', ' ')}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-editorial text-xs sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 hover:text-amber-800 transition-colors">
            <a
              href={`/product/${encodeURIComponent(product.slug)}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigateToProduct(product.slug);
              }}
            >
              {product.title}
            </a>
          </h3>

          {/* Color preview dots */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5">
            {product.colors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-stone-300 shadow-2xs"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <span className="text-[9px] sm:text-[10px] text-stone-400 ml-0.5 sm:ml-1">
              {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
        </div>

        {/* Pricing in PKR with mobile quick-add button */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="text-xs sm:text-base font-bold text-stone-900 font-sans">
              {formatPKR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                {formatPKR(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Instant 1-Tap Add to Cart */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="sm:hidden p-1.5 bg-stone-900 active:bg-amber-600 text-white rounded-xs active:scale-90 transition-transform shadow-2xs"
              title="Add to bag"
              aria-label="Add to bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>

            {/* Available Sizes preview badge (desktop) */}
            <div className="hidden sm:flex gap-1 text-[10px] text-stone-500 font-mono">
              {product.sizes.slice(0, 3).map((size, idx) => (
                <span key={idx} className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded">
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-stone-400">+{product.sizes.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
