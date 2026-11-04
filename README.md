# Auren Attire

Auren Attire's storefront is a React application built with Vite and TypeScript.

## Run locally

**Prerequisites:** Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local address when the development server starts. To create and
preview a production build:

```bash
npm run build
npm run preview
```

Build output is written to `dist/`.
The build also generates `public/sitemap.xml` from the starter catalog and
articles and writes `public/robots.txt`. Set `VITE_SITE_URL` in the build
environment to the site's canonical origin if it differs from
`https://auren-attire.netlify.app`.

## Supabase setup

The storefront uses Supabase for published catalog content, authenticated
store-owner access, and durable cash-on-delivery orders. To connect a project:

1. In Supabase, open the SQL Editor and run
   [`src/db/store-migration.sql`](./src/db/store-migration.sql). It adds
   `store_*` tables and row-level security without dropping the existing tables.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from the project's API settings. The anon key is
   intended for browser use; RLS policies are required.
3. Add those same two `VITE_` variables in Netlify's site environment-variable
   settings, then trigger a deploy.
4. Create the store owner's user in Supabase Authentication. In the SQL Editor,
   add that user's actual Auth UUID to `public.store_admins`; do not grant admin
   access to an unverified account.
5. To add the existing starter catalog without overwriting existing records,
   copy `supabase/seed.env.example` to `.env.seed.local`, fill in the project
   URL and **private service-role key**, then run `npm run seed:catalog`.
   `.env.seed.local` is ignored by Git and is never read by the browser bundle.
   Remove that local file after seeding.

The service-role key must never be added to a `VITE_` variable, committed, or
entered in chat. Public checkout is handled by the validated
`place_store_order` database function; it recalculates prices and stock and
records an order only when the database confirms success. Online card and bank
payments are not enabled.

## Deploy on Netlify

The included `netlify.toml` configures the production build and publish folder.
Connect the `hasnaincyber/auren-attire` GitHub repository to Netlify and deploy
the `main` branch. Netlify will build the site on each new commit to that
branch. The site can use a free `netlify.app` subdomain; choose its name in
Netlify's site domain settings.

Local `.env` files are ignored by Git; `.env.example` contains placeholders
only. Private keys belong only in the local seed file or the relevant provider's
private environment settings.
