import { config } from 'dotenv';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts';
import { INITIAL_BLOG_POSTS } from '../src/data/initialBlogPosts';

config({ path: '.env.seed.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the current shell before seeding.'
  );
}
const projectUrl = supabaseUrl;
const privateServiceRoleKey = serviceRoleKey;

const products = INITIAL_PRODUCTS.map((product) => ({
  source_id: product.id,
  sku: product.sku,
  slug: product.slug,
  title: product.title,
  category: product.category,
  sub_category: product.subCategory,
  occasion: product.occasion,
  price: product.price,
  compare_at_price: product.compareAtPrice ?? null,
  images: product.images,
  sizes: product.sizes,
  colors: product.colors,
  description: product.description,
  fabric_details: product.fabricDetails,
  care_instructions: product.careInstructions,
  is_new_arrival: product.isNewArrival,
  is_best_seller: product.isBestSeller,
  stock: product.stock,
  featured: product.featured ?? false,
  is_published: true,
  created_at: product.createdAt,
}));

const blogPosts = INITIAL_BLOG_POSTS.map((post) => ({
  source_id: post.id,
  slug: post.slug,
  title: post.title,
  category: post.category,
  author: post.author,
  read_time: post.readTime,
  cover_image: post.coverImage,
  excerpt: post.excerpt,
  content: post.content,
  tags: post.tags ?? [],
  is_published: post.isPublished,
  published_at: new Date(post.publishedAt).toISOString(),
}));

async function seedTable(table: string, rows: object[]) {
  const response = await fetch(
    `${projectUrl.replace(/\/+$/, '')}/rest/v1/${table}?on_conflict=source_id`,
    {
    method: 'POST',
    headers: {
      apikey: privateServiceRoleKey,
      Authorization: `Bearer ${privateServiceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Seeding ${table} failed (${response.status}): ${message}`);
  }
}

await seedTable('store_products', products);
await seedTable('store_blog_posts', blogPosts);
console.log(`Catalog seed complete. Existing records were left unchanged; submitted ${products.length} products and ${blogPosts.length} articles.`);
