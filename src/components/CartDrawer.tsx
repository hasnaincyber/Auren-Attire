import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  Truck, 
  Tag, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  calculateCartTotals, 
  formatPKR, 
  generateWhatsAppOrderUrl, 
  STORE_PHONE_NUMBER 
} from '../utils/shop';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    setIsCheckoutOpen,
    couponCode,
    couponDiscount,
    couponError,
    applyCoupon,
    removeCoupon,
    setCurrentView
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const totals = calculateCartTotals(cart, couponDiscount);
  const percentToFreeShipping = Math.min(100, (totals.subtotal / 4999) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl(cart, totals.total, undefined, STORE_PHONE_NUMBER);
    window.open(url, '_blank');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white text-stone-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 border-l border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-800" />
            <h2 className="font-editorial text-xl font-bold tracking-tight text-stone-900">
              Shopping Bag ({totals.itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-amber-950 mb-1.5 font-medium">
            <Truck className="w-4 h-4 text-amber-700 shrink-0" />
            {totals.qualifiesForFreeShipping ? (
              <span className="font-semibold text-emerald-800">
                🎉 Congratulations! You have unlocked FREE Nationwide Shipping.
              </span>
            ) : (
              <span>
                Add <strong className="text-amber-900">{formatPKR(totals.freeShippingRemaining)}</strong> more to get <strong>FREE Nationwide Delivery</strong>!
              </span>
            )}
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                totals.qualifiesForFreeShipping ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              style={{ width: `${percentToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3 stroke-1" />
              <p className="font-editorial text-xl font-bold text-stone-800 mb-1">Your bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Discover our latest handcrafted festive Eastern collection and baby wear.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('shop');
                }}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-3.5 first:pt-0">
                {/* Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-24 object-cover rounded-xs border border-stone-200 shrink-0 bg-stone-100"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-editorial text-sm font-bold text-stone-900 leading-snug line-clamp-1">
                        {item.product.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>

                    <div className="text-xs font-mono text-stone-400 mt-0.5">
                      SKU: {item.product.sku}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty +/- */}
                    <div className="flex items-center border border-stone-200 rounded bg-stone-50">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-bold text-stone-900 font-sans">
                      {formatPKR(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            
            {/* Promo Code Input */}
            <div>
              {couponDiscount > 0 ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{couponCode}</strong> applied ({couponDiscount}% off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-rose-700 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Promo code (e.g. AUREN10)"
                      className="w-full bg-white border border-stone-300 text-xs text-stone-800 pl-8 pr-3 py-2 rounded-sm focus:outline-none focus:border-amber-700 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Promo Discount</span>
                  <span>-{formatPKR(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span>
                  {totals.shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-semibold">FREE</strong>
                  ) : (
                    formatPKR(totals.shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200 font-sans">
                <span>Estimated Total</span>
                <span className="text-amber-900">{formatPKR(totals.total)}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct WhatsApp Order */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>Cash on Delivery (COD) Available</span>
              <button
                onClick={clearCart}
                className="hover:text-rose-600 underline"
              >
                Clear Bag
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
