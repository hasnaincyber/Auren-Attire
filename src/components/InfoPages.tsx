import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Send
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { STORE_PHONE_NUMBER, STORE_EMAIL } from '../utils/shop';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
          OUR STORY
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
          About Auren Attire
        </h1>
        <div className="w-12 h-0.5 bg-stone-300 mx-auto mt-4"></div>
      </div>

      <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-stone-700 font-light">
        <p className="text-lg text-stone-900 font-normal leading-relaxed first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-stone-800">
          Auren Attire was founded with a singular devotion: creating Pakistan’s most luxurious, skin-friendly suits and heirloom ensembles exclusively for babies and newborns.
        </p>

        <p>
          We observed that festive baby wear in South Asia was all too often made with scratchy synthetic fabrics, stiff buckram, and harsh metal threads that irritated tender infant skin. Auren Attire set out to craft an antidote: subcontinental elegance tailored in cloud-soft Egyptian lawn, pure unbleached mulmul linings, and natural organic cotton.
        </p>

        <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
          <div className="p-6 bg-[#f7f4ef] border border-stone-200 rounded-sm text-center">
            <ShieldCheck className="w-8 h-8 text-stone-800 mx-auto mb-3" />
            <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
              Zero-Itch Guarantee
            </h3>
            <p className="text-xs text-stone-600 font-light">
              100% pure Egyptian lawn and mulmul cotton linings cushion every single seam and embroidered patch.
            </p>
          </div>

          <div className="p-6 bg-[#f7f4ef] border border-stone-200 rounded-sm text-center">
            <Sparkles className="w-8 h-8 text-stone-800 mx-auto mb-3" />
            <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
              Generational Artisans
            </h3>
            <p className="text-xs text-stone-600 font-light">
              Delicate resham work, soft gota accents, and authentic block-printed Sindhi Ajrak crafted for infants.
            </p>
          </div>

          <div className="p-6 bg-[#f7f4ef] border border-stone-200 rounded-sm text-center">
            <Truck className="w-8 h-8 text-stone-800 mx-auto mb-3" />
            <h3 className="font-editorial text-lg font-bold text-stone-900 mb-1">
              Nationwide Delivery
            </h3>
            <p className="text-xs text-stone-600 font-light">
              Doorstep delivery with reliable Cash on Delivery (COD) across all cities of Pakistan.
            </p>
          </div>
        </div>

        <h2 className="font-editorial text-2xl font-bold text-stone-900 pt-4">
          Thoughtfully Sized for Growth
        </h2>
        <p>
          Babies grow quickly during their first year. Our baby suits and kurtas are engineered with relaxed silhouettes, soft elasticated waistbands, and snap fasteners at the crotch to make dressing and diaper changing effortless.
        </p>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => {
            setCurrentView('shop');
          }}
          className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          Explore Baby Collections
        </button>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lahore',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = formData.subject.trim() || 'Auren Attire customer inquiry';
    const body = [
      `Name: ${formData.name}`,
      `Phone / WhatsApp: ${formData.phone}`,
      `Email: ${formData.email || 'Not provided'}`,
      `City: ${formData.city}`,
      '',
      formData.message,
    ].join('\n');
    window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('An email draft is opening. Press Send in your email app to contact us.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
          CUSTOMER CONCIERGE
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
          Contact Auren Attire
        </h1>
        <div className="w-12 h-0.5 bg-stone-300 mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info (Physical address option removed per user instruction) */}
        <div className="space-y-6">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
              We are delighted to assist you
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Need advice on newborn sizing, custom baby festive orders, or order tracking across Pakistan? Reach out through our direct helpline or send a message below.
            </p>
          </div>

          <div className="space-y-3.5">
            <a
              href={`https://wa.me/923258990087?text=${encodeURIComponent('Hello Auren Attire! I would like customer support.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-[#f7f4ef] border border-stone-200 rounded-sm hover:bg-[#ede7de] transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-stone-900 block">WhatsApp Customer Helpline</strong>
                <span className="text-xs text-stone-700 font-mono font-medium">{STORE_PHONE_NUMBER}</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">Direct chat with our baby wear stylists</span>
              </div>
            </a>

            <div className="flex items-start gap-4 p-4 bg-[#f7f4ef] border border-stone-200 rounded-sm">
              <Phone className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-600">
                <strong className="text-sm font-bold text-stone-900 block mb-0.5">Phone Call Support</strong>
                <p className="font-mono text-stone-800">{STORE_PHONE_NUMBER}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Monday to Saturday: 10:00 AM – 8:00 PM (PKT)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#f7f4ef] border border-stone-200 rounded-sm">
              <Mail className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-600">
                <strong className="text-sm font-bold text-stone-900 block mb-0.5">Official Email</strong>
                <a href={`mailto:${STORE_EMAIL}`} className="text-stone-900 font-medium underline">
                  {STORE_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#f7f4ef] border border-stone-200 rounded-sm">
              <Clock className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-600">
                <strong className="text-sm font-bold text-stone-900 block mb-0.5">Online Store Availability</strong>
                <p>Website orders & WhatsApp inquiries active 24/7 across Pakistan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-stone-200 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-editorial text-xl font-bold text-stone-900 mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-stone-500 mb-4 font-light">
                Submitting opens an email draft. Your message is sent only after you press Send in your email app.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sara Ahmed"
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03258990087"
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Baby Sizing Guidance / Urgent Order"
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your query here..."
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Prepare Email</span>
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
          FAST NATIONWIDE COURIER
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
          Delivery & Shipping Policy
        </h1>
        <div className="w-12 h-0.5 bg-stone-300 mx-auto mt-4"></div>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
        <div className="bg-[#f7f4ef] border border-stone-200 p-5 rounded-sm">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-1.5">
            <Truck className="w-5 h-5 text-stone-800" />
            <span>FREE DELIVERY ON ORDERS ABOVE RS. 4,999 ACROSS PAKISTAN</span>
          </div>
          <p className="text-stone-600">
            For orders below Rs. 4,999, a flat delivery fee of Rs. 250 applies nationwide, regardless of city or weight.
          </p>
        </div>

        <div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
            1. Delivery Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li><strong>Major Hubs (Lahore, Karachi, Islamabad, Rawalpindi):</strong> 2 to 3 business days.</li>
            <li><strong>All Other Cities in Pakistan:</strong> 3 to 4 business days via TCS, Leopards, or Trax Express.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
            2. Cash on Delivery (COD)
          </h2>
          <p className="text-stone-600">
            Cash on Delivery is available across Pakistan. Please have the exact payment amount ready for the courier rider when the parcel arrives.
          </p>
        </div>

        <div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
            3. Order Tracking Support
          </h2>
          <p className="text-stone-600">
            For real-time delivery status updates, message our WhatsApp helpline directly at <strong className="font-mono">{STORE_PHONE_NUMBER}</strong> with your Order Number.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
          PEACE OF MIND
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
          7-Day Size Exchange Policy
        </h1>
        <div className="w-12 h-0.5 bg-stone-300 mx-auto mt-4"></div>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
        <div className="bg-[#f7f4ef] border border-stone-200 p-5 rounded-sm">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-1.5">
            <RotateCcw className="w-5 h-5 text-stone-800" />
            <span>HASSLE-FREE SIZE EXCHANGES FOR INFANTS</span>
          </div>
          <p className="text-stone-600">
            Babies grow rapidly. If your selected baby suit doesn&apos;t fit your child perfectly, we offer a hassle-free 7-day size exchange guarantee.
          </p>
        </div>

        <div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
            1. Exchange Terms
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li>The item must be unwashed, unworn, and have its original tag intact.</li>
            <li>Exchange requests must be submitted within 7 days of receiving your parcel.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 mb-2">
            2. How to Request an Exchange
          </h2>
          <p className="text-stone-600">
            Simply send a WhatsApp message to <strong className="font-mono">{STORE_PHONE_NUMBER}</strong> with your Order Number and desired replacement size. We will coordinate the exchange smoothly.
          </p>
        </div>
      </div>
    </div>
  );
};
