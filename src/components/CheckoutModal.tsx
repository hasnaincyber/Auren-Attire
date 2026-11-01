import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Building2, 
  CreditCard, 
  MessageCircle, 
  FileText, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CustomerDetails, Order, PaymentMethod } from '../types';
import { 
  calculateCartTotals, 
  formatPKR, 
  generateWhatsAppOrderUrl, 
  STORE_PHONE_NUMBER 
} from '../utils/shop';
import { PAKISTANI_CITIES, PAKISTANI_PROVINCES } from '../data/initialProducts';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    couponDiscount, 
    placeOrder, 
    lastPlacedOrder, 
    setLastPlacedOrder,
    setCurrentView 
  } = useShop();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const totals = calculateCartTotals(cart, couponDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setFormError('Please enter the recipient’s full name.');
      return;
    }

    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setFormError('Please enter a valid Pakistani mobile number (e.g. 0300 1234567).');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter a complete delivery address (House/Street/Area).');
      return;
    }

    setFormError(null);

    const customerDetails: CustomerDetails = {
      fullName,
      phone,
      email,
      address,
      city,
      province,
      postalCode,
      orderNotes
    };

    placeOrder(customerDetails, paymentMethod);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLastPlacedOrder(null);
  };

  const cleanWhatsAppNumber = STORE_PHONE_NUMBER.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white text-stone-900 w-full max-w-3xl rounded-md shadow-2xl max-h-[92vh] overflow-y-auto z-10 border border-stone-200">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full z-20"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {lastPlacedOrder ? (
          /* ================= ORDER SUCCESS CONFIRMATION ================= */
          <div className="p-6 sm:p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-1">
              Order Registered
            </span>
            <h2 className="font-editorial text-3xl font-bold text-stone-900 mb-2">
              Thank You for Choosing Auren Attire!
            </h2>
            <p className="text-xs text-stone-600 max-w-md mx-auto mb-6">
              Your order has been recorded in our store queue. We have generated order reference: <strong className="text-stone-900">{lastPlacedOrder.orderNumber}</strong>.
            </p>

            {/* Order Summary Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-sm p-5 text-left max-w-lg mx-auto mb-6 text-xs space-y-3">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Order Number</span>
                <span className="font-mono font-bold text-stone-900">{lastPlacedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Recipient</span>
                <span className="font-semibold text-stone-900">{lastPlacedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phone</span>
                <span>{lastPlacedOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address</span>
                <span className="text-right max-w-xs">{lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.city}, {lastPlacedOrder.customer.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Mode</span>
                <span className="font-semibold uppercase text-amber-900">
                  {lastPlacedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : lastPlacedOrder.paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer' : 'Online Card'}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="text-amber-900">{formatPKR(lastPlacedOrder.total)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Confirmation CTA */}
            <div className="space-y-3 max-w-md mx-auto">
              <a
                href={generateWhatsAppOrderUrl(
                  lastPlacedOrder.items,
                  lastPlacedOrder.total,
                  lastPlacedOrder.customer,
                  STORE_PHONE_NUMBER
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm & Track on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  handleClose();
                  setCurrentView('shop');
                }}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
              >
                Continue Browsing Collection
              </button>
            </div>

            <p className="text-[11px] text-stone-400 mt-6 max-w-md mx-auto">
              * Demonstration Notice: This order is securely stored in your local browser session and prepared for Supabase PostgreSQL synchronization via the Admin Dashboard.
            </p>
          </div>
        ) : (
          /* ================= CHECKOUT FORM ================= */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="border-b border-stone-200 pb-4 mb-6">
              <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold block mb-1">
                Auren Attire Delivery
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                Shipping & Payment Details
              </h2>
            </div>

            {formError && (
              <div className="p-3 mb-6 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Customer & Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 pb-1 border-b border-stone-100">
                  1. Delivery Address (Pakistan)
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Khan"
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Phone (for delivery SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address / House No / Area *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House #14-B, Street 3, Phase 5, DHA"
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                    >
                      {PAKISTANI_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Instructions / Special Notes
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, gift wrap, etc."
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Right Column: Payment Method & Order Summary */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-900 pb-1 border-b border-stone-100">
                  2. Payment Method
                </h3>

                <div className="space-y-2">
                  {/* COD */}
                  <label className={`block p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-200 hover:border-stone-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-amber-700"
                        />
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-800" />
                          <span className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-6">
                      Pay cash to the courier representative when the parcel arrives at your doorstep.
                    </p>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`block p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-200 hover:border-stone-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="accent-amber-700"
                      />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-stone-700" />
                        <span className="text-xs font-bold text-stone-900">Direct Bank Transfer</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-6">
                      Meezan Bank / HBL / Bank Alfalah IBAN provided upon confirmation.
                    </p>
                  </label>

                  {/* Online Card / Wallet */}
                  <label className={`block p-3.5 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'card_online' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-200 hover:border-stone-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card_online'}
                        onChange={() => setPaymentMethod('card_online')}
                        className="accent-amber-700"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-stone-700" />
                        <span className="text-xs font-bold text-stone-900">Visa / Mastercard / JazzCash</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 pl-6">
                      Online payment gateway integration will sync via backend credentials.
                    </p>
                  </label>
                </div>

                {/* Items Summary */}
                <div className="bg-stone-50 p-4 rounded border border-stone-200 space-y-2 mt-4 text-xs">
                  <div className="font-semibold text-stone-900 pb-1 border-b border-stone-200 flex justify-between">
                    <span>Order Summary</span>
                    <span>{cart.length} unique {cart.length === 1 ? 'item' : 'items'}</span>
                  </div>
                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPKR(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span>-{formatPKR(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Fee (TCS/Trax)</span>
                      <span>{totals.shippingFee === 0 ? 'FREE' : formatPKR(totals.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Grand Total</span>
                      <span className="text-amber-900">{formatPKR(totals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Place Order ({formatPKR(totals.total)})</span>
                </button>

                <p className="text-[10px] text-center text-stone-500">
                  By placing this order you agree to our 7-day exchange and delivery terms.
                </p>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};
