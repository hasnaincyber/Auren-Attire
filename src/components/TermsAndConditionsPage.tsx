import React from 'react';
import { STORE_EMAIL, STORE_PHONE_NUMBER } from '../utils/shop';

export const TermsAndConditionsPage: React.FC = () => (
  <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
    <header className="text-center mb-12">
      <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
        SHOPPING WITH AUREN ATTIRE
      </span>
      <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
        Terms and Conditions
      </h1>
      <p className="mt-4 text-sm text-stone-500">Last updated: November 4, 2026</p>
    </header>

    <div className="space-y-8 text-sm leading-7 text-stone-700">
      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Using this website</h2>
        <p>
          These terms apply when you browse or place an order through the Auren Attire
          website. By using the website, you agree to provide accurate information and
          use its shopping features lawfully. A parent, guardian, or other adult should
          place orders for children.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Products, prices, and availability</h2>
        <p>
          Product descriptions, images, sizes, stock, and prices are provided to help you
          choose. Availability may change. The order total, including any discount and
          delivery charge, is calculated when an order is submitted. If an item or price
          cannot be confirmed, we will contact you before fulfilment.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Orders and payment</h2>
        <p>
          Cash on Delivery is the only payment method currently offered. An order is
          considered submitted only after the website confirms it has been saved. A
          generated reference does not guarantee delivery; we may contact you to verify
          the delivery details or stock before dispatch.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Delivery, returns, and exchanges</h2>
        <p>
          Delivery charges, estimated delivery times, and exchange conditions are
          described in our <a className="underline" href="/shipping-policy">Shipping Policy</a> and{' '}
          <a className="underline" href="/return-policy">Returns and Exchange Policy</a>. Those policies
          form part of these terms.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">Contact</h2>
        <p>
          Questions about these terms or an order:
          <br />
          <a className="underline" href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
          <br />
          WhatsApp / phone: <a className="underline" href={`https://wa.me/92${STORE_PHONE_NUMBER.replace(/^0/, '')}`}>{STORE_PHONE_NUMBER}</a>
        </p>
      </section>
    </div>
  </article>
);
