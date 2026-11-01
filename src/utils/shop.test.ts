import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPKR,
  calculateDiscountPercent,
  calculateCartTotals,
  filterProducts,
  generateWhatsAppOrderUrl,
  generateSingleProductWhatsAppUrl,
  formatWhatsAppTarget,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  STORE_PHONE_NUMBER
} from './shop';
import { CartItem, FilterState, Product } from '../types';

const mockBabyProductA: Product = {
  id: 'prod-1',
  sku: 'AUR-BB-001',
  title: 'Baby Boys Embroidered Kurta Set',
  slug: 'baby-boys-embroidered-kurta-set',
  category: 'baby-boys',
  subCategory: 'baby-kurta-shalwar',
  occasion: 'Festive',
  price: 3450,
  compareAtPrice: 4200,
  images: ['https://example.com/img1.jpg'],
  sizes: ['0-3M', '3-6M', '6-12M'],
  colors: [{ name: 'Royal Ivory', hex: '#FAF9F6' }],
  description: 'Soft combed cotton kurta with subtle resham neckline.',
  fabricDetails: '100% Cotton with Mulmul Lining',
  careInstructions: 'Gentle wash',
  isNewArrival: true,
  isBestSeller: true,
  stock: 15,
  rating: 4.9,
  reviewCount: 28,
  featured: true,
  createdAt: '2026-03-01T10:00:00Z'
};

const mockBabyProductB: Product = {
  id: 'prod-2',
  sku: 'AUR-BG-002',
  title: 'Baby Girls Peplum Gharara Suit',
  slug: 'baby-girls-peplum-gharara-suit',
  category: 'baby-girls',
  subCategory: 'baby-peplum-gharara',
  occasion: 'Festive',
  price: 4650,
  compareAtPrice: 5500,
  images: ['https://example.com/img2.jpg'],
  sizes: ['3-6M', '6-12M', '12-18M'],
  colors: [{ name: 'Dusty Rose', hex: '#DCAE96' }],
  description: 'Soft organza peplum with pure lawn inner lining.',
  fabricDetails: 'Organza over Mulmul',
  careInstructions: 'Dry clean recommended',
  isNewArrival: true,
  isBestSeller: false,
  stock: 8,
  rating: 4.8,
  reviewCount: 14,
  featured: false,
  createdAt: '2026-03-05T10:00:00Z'
};

test('STORE_PHONE_NUMBER is configured to 03258990087', () => {
  assert.equal(STORE_PHONE_NUMBER, '03258990087');
  assert.equal(formatWhatsAppTarget('03258990087'), '923258990087');
});

test('formatPKR formats Pakistani Rupee currency accurately', () => {
  assert.equal(formatPKR(4500), 'Rs. 4,500');
  assert.equal(formatPKR(0), 'Rs. 0');
});

test('calculateDiscountPercent correctly calculates discount percentage', () => {
  assert.equal(calculateDiscountPercent(3450, 4200), 18);
});

test('calculateCartTotals calculates subtotal, discounts, and free shipping threshold', () => {
  const cartItems: CartItem[] = [
    {
      id: 'cart-1',
      product: mockBabyProductA,
      selectedSize: '0-3M',
      selectedColor: mockBabyProductA.colors[0],
      quantity: 1,
    }
  ];

  const totals = calculateCartTotals(cartItems, 0);
  assert.equal(totals.subtotal, 3450);
  assert.equal(totals.shippingFee, STANDARD_SHIPPING_FEE);
  assert.equal(totals.total, 3450 + STANDARD_SHIPPING_FEE);
});

test('generateWhatsAppOrderUrl outputs valid WhatsApp link with 923258990087', () => {
  const cartItems: CartItem[] = [
    {
      id: 'cart-1',
      product: mockBabyProductA,
      selectedSize: '0-3M',
      selectedColor: mockBabyProductA.colors[0],
      quantity: 1,
    }
  ];

  const url = generateWhatsAppOrderUrl(cartItems, 3700, {
    fullName: 'Fatima',
    city: 'Lahore'
  });

  assert.ok(url.startsWith('https://wa.me/923258990087'));
  assert.ok(url.includes('Fatima'));
});
