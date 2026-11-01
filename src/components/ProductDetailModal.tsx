import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Ruler, 
  MessageCircle, 
  ChevronRight,
  Check,
  Share2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  calculateDiscountPercent, 
  formatPKR, 
  generateSingleProductWhatsAppUrl,
  STORE_PHONE_NUMBER 
} from '../utils/shop';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsSizeGuideOpen,
    showToast
  } = useShop();

  const product = selectedProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'fabric' | 'shipping' | 'reviews'>('fabric');

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || 'Standard';
  const currentColor = product.colors[selectedColorIndex] || product.colors[0];
  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, currentSize, currentColor, quantity);
  };

  const handleDirectWhatsAppOrder = () => {
    const url = generateSingleProductWhatsAppUrl(
      product,
      currentSize,
      currentColor.name,
      STORE_PHONE_NUMBER
    );
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} at Auren Attire Pakistan`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white text-stone-900 w-full max-w-4xl max-h-[92vh] rounded-md shadow-2xl overflow-y-auto z-10 border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 z-20 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 p-4 sm:p-8">
          
          {/* 1. Left Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-rose-700 text-white text-xs font-bold px-2.5 py-1 rounded-xs tracking-wider uppercase shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xs overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-amber-600 scale-95' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Right Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category, SKU, and Share */}
              <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest mb-1.5 font-medium">
                <span>{product.category} • {product.subCategory.replace('-', ' ')}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-stone-400">SKU: {product.sku}</span>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-stone-400 hover:text-stone-800"
                    title="Share product"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-2">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-amber-800 underline hover:text-amber-900"
                >
                  {product.reviewCount} Verified Customer Reviews
                </button>
              </div>

              {/* Price */}
              <div className="p-3.5 bg-stone-50 rounded-sm border border-stone-200/60 mb-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block uppercase tracking-wider mb-0.5">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-sans">
                      {formatPKR(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPKR(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded">
                    In Stock • Ready to Dispatch
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Selected Shade: <span className="font-normal text-stone-900">{currentColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs transition-all ${
                        selectedColorIndex === idx
                          ? 'border-amber-700 bg-amber-50/50 font-semibold text-amber-950 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 text-stone-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector + Size Guide Modal Trigger */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                    Age / Size: <span className="font-normal text-stone-900">{currentSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-sm border transition-all ${
                        currentSize === size
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-300 hover:border-stone-700 text-stone-800 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-300 rounded-sm overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-400">
                  {product.stock} items available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                {/* 1. Add to Bag */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-sm border transition-colors ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-400 text-rose-600'
                        : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* 2. WhatsApp Direct Order */}
                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order via WhatsApp ({STORE_PHONE_NUMBER})</span>
                </button>
              </div>

              {/* Pakistan Trust Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-stone-50 rounded border border-stone-200/60 text-[10px] text-stone-600 text-center mb-6">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Nationwide COD</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>100% Pure Fabrics</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>7-Day Easy Exchange</span>
                </div>
              </div>
            </div>

            {/* Product Details Tabs (Fabric, Delivery, Customer Reviews) */}
            <div className="border-t border-stone-200 pt-4">
              <div className="flex gap-4 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'fabric'
                      ? 'border-amber-700 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Fabric & Craft
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'shipping'
                      ? 'border-amber-700 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Pakistan Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-amber-700 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Customer Reviews ({product.reviews?.length || product.reviewCount})
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-xs text-stone-600 leading-relaxed min-h-[90px]">
                {activeTab === 'fabric' && (
                  <div className="space-y-2">
                    <p>{product.description}</p>
                    <p><strong className="text-stone-900">Fabric:</strong> {product.fabricDetails}</p>
                    <p><strong className="text-stone-900">Care:</strong> {product.careInstructions}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>• Delivery across Lahore, Karachi, Islamabad & Rawalpindi in 2-3 business days.</p>
                    <p>• Rest of Pakistan: 3-4 business days via TCS, Leopards & Trax Express.</p>
                    <p>• Standard shipping: Rs. 250 (Free for orders exceeding Rs. 4,999).</p>
                    <p>• Cash on Delivery (COD) available with parcel tracking via SMS.</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="p-2.5 bg-stone-50 rounded border border-stone-200/60">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-stone-900">{rev.author} ({rev.city})</span>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 mb-1">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-700 font-medium ml-2">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                          <p className="text-stone-700">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-stone-500">
                        <p>No customer reviews yet. Be the first to review this ensemble!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
