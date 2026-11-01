export type CategoryType = 'all' | 'baby-boys' | 'baby-girls' | 'newborn-sets' | 'rompers';

export type SubCategoryType = 
  | 'all'
  | 'baby-kurta-shalwar' 
  | 'baby-peplum-gharara' 
  | 'newborn-sets' 
  | 'rompers-sleepsuits' 
  | 'organic-muslin' 
  | 'ajrak-heritage';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  category: CategoryType;
  subCategory: string;
  occasion: 'Festive' | 'Casual' | 'Formal' | 'Newborn Essentials';
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  description: string;
  fabricDetails: string;
  careInstructions: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface FilterState {
  category: CategoryType;
  subCategory: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  occasions: string[];
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  searchQuery: string;
  inStockOnly: boolean;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  orderNotes?: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card_online';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Baby Care' | 'Newborn Essentials' | 'Styling & Sizing' | 'Heritage Fabrics';
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  tags?: string[];
}

export type PageView = 'home' | 'shop' | 'blog' | 'blog-post' | 'about' | 'contact' | 'shipping' | 'returns' | 'admin';
