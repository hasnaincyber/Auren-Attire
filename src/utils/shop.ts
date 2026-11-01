import { CartItem, CustomerDetails, FilterState, Product } from '../types';

export const STORE_PHONE_NUMBER = '03258990087';
export const STORE_EMAIL = 'razqa469@gmail.com';
export const FREE_SHIPPING_THRESHOLD = 4999;
export const STANDARD_SHIPPING_FEE = 250;

/**
 * Format currency in Pakistani Rupee (PKR / Rs.)
 * e.g., 4500 -> "Rs. 4,500"
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs. 0';
  }
  const formatted = Math.round(amount).toLocaleString('en-PK');
  return `Rs. ${formatted}`;
}

/**
 * Calculate percentage discount between regular and compare at price
 */
export function calculateDiscountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount);
}

/**
 * Calculate Cart Totals including subtotal, discount, shipping, and total
 */
export function calculateCartTotals(
  items: CartItem[],
  couponDiscountPercent: number = 0
): {
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  freeShippingRemaining: number;
  qualifiesForFreeShipping: boolean;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = couponDiscountPercent > 0 
    ? Math.round((subtotal * couponDiscountPercent) / 100) 
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const qualifiesForFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = (items.length > 0 && !qualifiesForFreeShipping) ? STANDARD_SHIPPING_FEE : 0;
  const total = discountedSubtotal + shippingFee;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  return {
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingRemaining,
    qualifiesForFreeShipping,
  };
}

/**
 * Filter & Sort Products
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // Category match
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Subcategory match
    if (filters.subCategory && filters.subCategory !== 'all') {
      if (product.subCategory !== filters.subCategory) {
        return false;
      }
    }

    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const titleMatch = product.title.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      const catMatch = product.category.toLowerCase().includes(q);
      const subMatch = product.subCategory.toLowerCase().includes(q);
      const skuMatch = product.sku.toLowerCase().includes(q);
      const occasionMatch = product.occasion.toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !catMatch && !subMatch && !skuMatch && !occasionMatch) {
        return false;
      }
    }

    // Price range
    if (filters.minPrice > 0 && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice > 0 && product.price > filters.maxPrice) {
      return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasSize = filters.sizes.some((size) => product.sizes.includes(size));
      if (!hasSize) return false;
    }

    // Occasion filter
    if (filters.occasions.length > 0) {
      if (!filters.occasions.includes(product.occasion)) {
        return false;
      }
    }

    // Stock check
    if (filters.inStockOnly && product.stock <= 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
    }
  });
}

/**
 * Format WhatsApp Phone Number (handles Pakistan 03... to 923...)
 */
export function formatWhatsAppTarget(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('03')) {
    return `92${digits.slice(1)}`;
  }
  if (digits.startsWith('92')) {
    return digits;
  }
  return digits;
}

/**
 * Generate formatted WhatsApp Direct Order message for an entire cart
 */
export function generateWhatsAppOrderUrl(
  items: CartItem[],
  total: number,
  customer?: Partial<CustomerDetails>,
  phone: string = STORE_PHONE_NUMBER
): string {
  const cleanPhone = formatWhatsAppTarget(phone);

  let text = `*NEW ORDER INQUIRY - AUREN ATTIRE*\n`;
  text += `------------------------------------\n`;
  text += `Hello Auren Attire! I would like to place an order for the following baby wear:\n\n`;

  items.forEach((item, index) => {
    text += `*Item ${index + 1}:* ${item.product.title}\n`;
    text += `• SKU: ${item.product.sku}\n`;
    text += `• Size: ${item.selectedSize}\n`;
    text += `• Color: ${item.selectedColor.name}\n`;
    text += `• Qty: ${item.quantity}\n`;
    text += `• Price: ${formatPKR(item.product.price * item.quantity)}\n\n`;
  });

  text += `------------------------------------\n`;
  text += `*Order Total:* ${formatPKR(total)}\n\n`;

  if (customer && customer.fullName) {
    text += `*Customer Delivery Details:*\n`;
    text += `• Name: ${customer.fullName}\n`;
    if (customer.phone) text += `• Phone: ${customer.phone}\n`;
    if (customer.city) text += `• City: ${customer.city}\n`;
    if (customer.address) text += `• Address: ${customer.address}\n`;
    if (customer.province) text += `• Province: ${customer.province}\n`;
    if (customer.orderNotes) text += `• Notes: ${customer.orderNotes}\n`;
  }

  text += `\nPlease confirm availability and delivery dispatch timeline. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WhatsApp message for a single product Quick Order
 */
export function generateSingleProductWhatsAppUrl(
  product: Product,
  selectedSize: string,
  selectedColorName: string,
  phone: string = STORE_PHONE_NUMBER
): string {
  const cleanPhone = formatWhatsAppTarget(phone);

  let text = `*PRODUCT INQUIRY - AUREN ATTIRE*\n`;
  text += `------------------------------------\n`;
  text += `Hello! I would like to order this piece from your baby wear collection:\n\n`;
  text += `• *Product:* ${product.title}\n`;
  text += `• *SKU:* ${product.sku}\n`;
  text += `• *Price:* ${formatPKR(product.price)}\n`;
  text += `• *Selected Size:* ${selectedSize || '0-3M'}\n`;
  text += `• *Color:* ${selectedColorName || 'As Shown'}\n\n`;
  text += `Please share delivery details for my city in Pakistan. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
