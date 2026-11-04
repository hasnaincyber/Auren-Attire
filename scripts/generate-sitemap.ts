import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { INITIAL_BLOG_POSTS } from '../src/data/initialBlogPosts';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts';

const siteUrl = (process.env.VITE_SITE_URL || 'https://auren-attire.netlify.app').replace(/\/+$/, '');
const routes = [
  '/',
  '/shop',
  '/category/baby-boys',
  '/category/baby-girls',
  '/category/newborn-sets',
  '/category/rompers',
  '/about',
  '/contact',
  '/shipping-policy',
  '/return-policy',
  '/privacy-policy',
  '/terms-and-conditions',
  '/blog',
  ...INITIAL_PRODUCTS.map((product) => `/product/${encodeURIComponent(product.slug)}`),
  ...INITIAL_BLOG_POSTS.map((post) => `/blog/${encodeURIComponent(post.slug)}`),
];

const uniqueRoutes = [...new Set(routes)];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueRoutes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

const publicDirectory = path.resolve('public');
await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDirectory, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(
    path.join(publicDirectory, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${siteUrl}/sitemap.xml\n`,
    'utf8'
  ),
]);
