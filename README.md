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

## Deploy on Netlify

The included `netlify.toml` configures the production build and publish folder.
Connect the `hasnaincyber/auren-attire` GitHub repository to Netlify and deploy
the `main` branch. Netlify will build the site on each new commit to that
branch. The site can use a free `netlify.app` subdomain; choose its name in
Netlify's site domain settings.

If the app needs secrets in the future, add them in Netlify's environment
variable settings rather than committing a `.env` file. Local `.env` files are
ignored by Git; `.env.example` contains placeholders only.
