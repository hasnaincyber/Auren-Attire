import React from 'react';
import { STORE_EMAIL, STORE_PHONE_NUMBER } from '../utils/shop';

const lastUpdated = 'November 4, 2026';

export const PrivacyPolicyPage: React.FC = () => (
  <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-stone-800">
    <header className="text-center mb-12">
      <span className="text-stone-500 text-xs uppercase tracking-[0.2em] font-semibold block mb-2">
        CUSTOMER INFORMATION
      </span>
      <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-stone-500">Last updated: {lastUpdated}</p>
    </header>

    <div className="space-y-8 text-sm leading-7 text-stone-700">
      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">1. About this policy</h2>
        <p>
          This policy describes how Auren Attire, a Pakistani children’s and baby clothing
          storefront serving customers in Pakistan, handles information when you visit
          https://auren-attire.netlify.app or contact us about an order.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">2. Information you provide</h2>
        <p>
          If you submit an order while the store database is available, checkout sends the
          recipient’s name, phone number, delivery address, city, province, and selected
          products, sizes, quantities, and payment method to the store database. Email,
          postal code, WhatsApp number, and order notes are optional. We may also receive
          information you choose to include in a message or customer-support conversation.
          Orders are not confirmed unless the database reports that they were saved.
        </p>
        <p className="mt-3">
          The shopping bag and wishlist are kept in browser storage on your device. They
          are not submitted as an order unless you complete checkout. Do not enter a
          child’s personal information in an order or message.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">3. How information is used</h2>
        <p>
          Information submitted at checkout is used to record and process the order,
          arrange delivery, contact the customer about the order, provide support, and
          address returns or delivery issues. We do not currently use this storefront to
          send automated marketing emails.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">4. Cookies, browser storage, and advertising</h2>
        <p>
          The storefront uses browser storage for shopping-bag and wishlist preferences.
          No non-essential analytics or advertising cookies are intentionally configured
          in this project. We do not currently configure Google Analytics, Google Ads
          conversion tracking, remarketing, or the Meta Pixel. If those tools are added,
          this policy and any required consent choices will be updated before they are
          enabled.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">5. Service providers</h2>
        <p>
          The website is hosted by Netlify. When Supabase is configured for the store,
          submitted orders and store-management data are processed by Supabase under the
          project owner’s account. Cash on Delivery is the only payment option currently
          enabled; this site does not collect card or bank-account details.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">6. Sharing, security, and retention</h2>
        <p>
          Order details may be shared with a delivery provider when necessary to deliver
          a parcel, with service providers that operate the website, or with authorities
          where disclosure is legally required. We do not sell customer personal
          information. Reasonable safeguards are used, but no internet transmission or
          electronic storage method can be guaranteed completely secure.
        </p>
        <p className="mt-3">
          Information is retained only as long as reasonably needed for order fulfilment,
          customer support, legitimate business records, and applicable legal obligations.
          The retention period depends on the record and the purpose for which it was
          provided.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">7. Children’s privacy</h2>
        <p>
          Auren Attire sells clothing for children and babies, but the website is intended
          for adults such as parents, guardians, and gift purchasers. We do not knowingly
          seek personal information directly from children.
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">8. Your choices and requests</h2>
        <p>
          You may contact us to ask about, correct, or request deletion of personal
          information, subject to records we must retain for an order or legal obligation.
          Please include enough information for us to identify the relevant order without
          sending payment credentials.
        </p>
        <p className="mt-3">
          Email: <a className="underline" href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
          <br />
          WhatsApp / phone: <a className="underline" href={`https://wa.me/92${STORE_PHONE_NUMBER.replace(/^0/, '')}`}>{STORE_PHONE_NUMBER}</a>
        </p>
      </section>

      <section>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">9. Changes to this policy</h2>
        <p>
          We may update this policy when the website’s features, service providers, or
          information practices change. The “Last updated” date above identifies the
          latest published revision.
        </p>
      </section>
    </div>
  </article>
);
