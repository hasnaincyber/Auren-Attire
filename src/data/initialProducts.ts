import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- BABY BOYS SUITS ---
  {
    id: 'aur-bb-01',
    sku: 'AUR-BB-101',
    title: 'Baby Boy Royal Ivory Embroidered Kurta Suit',
    slug: 'baby-boy-royal-ivory-embroidered-kurta-suit',
    category: 'baby-boys',
    subCategory: 'baby-kurta-shalwar',
    occasion: 'Festive',
    price: 3650,
    compareAtPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '1-2Y'],
    colors: [
      { name: 'Royal Ivory', hex: '#FAF9F6' },
      { name: 'Warm Almond', hex: '#EFDECD' },
      { name: 'Sky Celeste', hex: '#D6EAF8' }
    ],
    description: 'An exquisitely soft pure mulmul cotton kurta suit for baby boys with delicate antique threadwork on collar. Paired with soft-elastic shalwar designed for tender baby skin.',
    fabricDetails: '100% Breathable Egyptian Lawn Cotton with feather-soft mulmul lining.',
    careInstructions: 'Gentle hand wash with mild baby-safe detergent.',
    isNewArrival: true,
    isBestSeller: true,
    stock: 22,
    rating: 4.9,
    reviewCount: 38,
    featured: true,
    createdAt: '2026-03-10T12:00:00Z',
    reviews: [
      {
        id: 'rev-1',
        author: 'Ayesha Raza',
        city: 'Lahore',
        rating: 5,
        date: '24 March 2026',
        comment: 'So soft on my 4-month-old baby’s skin! He stayed calm throughout the family dawat.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'aur-bb-02',
    sku: 'AUR-BB-102',
    title: 'Baby Boy Jamawar Waistcoat & Kurta Shalwar Suit',
    slug: 'baby-boy-jamawar-waistcoat-kurta-suit',
    category: 'baby-boys',
    subCategory: 'baby-kurta-shalwar',
    occasion: 'Festive',
    price: 4450,
    compareAtPrice: 5500,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['3-6M', '6-12M', '12-18M', '1-2Y'],
    colors: [
      { name: 'Sage Green', hex: '#9E9764' },
      { name: 'Golden Sand', hex: '#D4AF37' },
      { name: 'Champagne', hex: '#F7E7CE' }
    ],
    description: 'A miniature bespoke Jamawar waistcoat paired with a lightweight pure lawn kurta and shalwar. Engineered with soft snap fasteners for quick diaper changes.',
    fabricDetails: 'Soft Brocade Jamawar with 100% Combed Cotton Kurta.',
    careInstructions: 'Dry clean recommended for waistcoat.',
    isNewArrival: true,
    isBestSeller: false,
    stock: 14,
    rating: 4.8,
    reviewCount: 19,
    featured: true,
    createdAt: '2026-03-08T10:00:00Z'
  },
  {
    id: 'aur-bb-03',
    sku: 'AUR-BB-103',
    title: 'Baby Boy Italian Linen Relaxed Dungaree Suit',
    slug: 'baby-boy-linen-relaxed-dungaree-suit',
    category: 'baby-boys',
    subCategory: 'rompers-sleepsuits',
    occasion: 'Casual',
    price: 3250,
    compareAtPrice: 3950,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: [
      { name: 'Oatmeal Natural', hex: '#E0D6C8' },
      { name: 'Earthy Sand', hex: '#C2B280' }
    ],
    description: 'Minimalist earthy linen romper dungaree suit with wooden buttons and organic cotton undershirt.',
    fabricDetails: '55% Pure Flax Linen, 45% Organic Combed Cotton.',
    careInstructions: 'Machine wash gentle cold.',
    isNewArrival: false,
    isBestSeller: true,
    stock: 18,
    rating: 4.9,
    reviewCount: 31,
    featured: false,
    createdAt: '2026-02-15T09:00:00Z'
  },

  // --- BABY GIRLS SUITS ---
  {
    id: 'aur-bg-01',
    sku: 'AUR-BG-201',
    title: 'Baby Girl Organza Peplum & Tiered Gharara Suit',
    slug: 'baby-girl-organza-peplum-gharara-suit',
    category: 'baby-girls',
    subCategory: 'baby-peplum-gharara',
    occasion: 'Festive',
    price: 4950,
    compareAtPrice: 6200,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['3-6M', '6-12M', '12-18M', '1-2Y'],
    colors: [
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Pistachio Mist', hex: '#D4E2D4' },
      { name: 'Champagne Cream', hex: '#FFF8DC' }
    ],
    description: 'Festive baby girl peplum frock and flared gharara suit. Layered with soft gota patti trims and 100% itch-free mulmul cotton underlay.',
    fabricDetails: 'Soft Glazed Organza with pure hypoallergenic Mulmul Cotton lining.',
    careInstructions: 'Dry clean only. Gentle steam press.',
    isNewArrival: true,
    isBestSeller: true,
    stock: 12,
    rating: 5.0,
    reviewCount: 42,
    featured: true,
    createdAt: '2026-03-12T16:00:00Z',
    reviews: [
      {
        id: 'rev-2',
        author: 'Zainab Bilgrami',
        city: 'Islamabad',
        rating: 5,
        date: '27 March 2026',
        comment: 'Looks like a miniature designer bridal suit! The cotton lining protected her completely.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'aur-bg-02',
    sku: 'AUR-BG-202',
    title: 'Baby Girl Chikankari Angrakha Frock Suit',
    slug: 'baby-girl-chikankari-angrakha-frock-suit',
    category: 'baby-girls',
    subCategory: 'baby-peplum-gharara',
    occasion: 'Festive',
    price: 3850,
    compareAtPrice: 4600,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: [
      { name: 'Lavender Mist', hex: '#E6E6FA' },
      { name: 'Soft Peach', hex: '#FADBD8' },
      { name: 'Pearl White', hex: '#F7F7F7' }
    ],
    description: 'Traditional crossover Angrakha baby frock suit featuring handcrafted Chikankari jaal and matching elasticated churidar pajama.',
    fabricDetails: '100% Superfine Swiss Voile Cotton.',
    careInstructions: 'Gentle hand wash in cold water.',
    isNewArrival: true,
    isBestSeller: false,
    stock: 16,
    rating: 4.8,
    reviewCount: 22,
    featured: false,
    createdAt: '2026-03-04T13:00:00Z'
  },
  {
    id: 'aur-bg-03',
    sku: 'AUR-BG-203',
    title: 'Baby Girl Tiered Ruffle Tulle Suit with Headband',
    slug: 'baby-girl-tiered-ruffle-tulle-suit',
    category: 'baby-girls',
    subCategory: 'newborn-sets',
    occasion: 'Festive',
    price: 3650,
    compareAtPrice: 4400,
    images: [
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: [
      { name: 'Champagne Rose', hex: '#E8D3C8' },
      { name: 'Warm Cream', hex: '#FAF0E6' }
    ],
    description: 'Charming festive baby suit with micro-ruffles, satin bow detail, and gentle stretch headband.',
    fabricDetails: 'Fine Tulle over hypoallergenic combed cotton.',
    careInstructions: 'Hand wash cold. Dry flat.',
    isNewArrival: false,
    isBestSeller: true,
    stock: 15,
    rating: 4.9,
    reviewCount: 27,
    featured: true,
    createdAt: '2026-02-18T10:00:00Z'
  },

  // --- NEWBORN SETS ---
  {
    id: 'aur-nb-01',
    sku: 'AUR-NB-301',
    title: 'Newborn Pure Mulmul 3-Piece Festive Kurta Suit',
    slug: 'newborn-pure-mulmul-3-piece-kurta-suit',
    category: 'newborn-sets',
    subCategory: 'newborn-sets',
    occasion: 'Newborn Essentials',
    price: 3150,
    compareAtPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M'],
    colors: [
      { name: 'Pure White & Gold', hex: '#FFFFFA' },
      { name: 'Almond Cream', hex: '#EFDECD' }
    ],
    description: 'Designed exclusively for newborns with zero tags, flat seam technology, and soft envelope neckline. Includes kurta, shalwar, and matching baby cap.',
    fabricDetails: '100% Feather-soft Mulmul Cotton.',
    careInstructions: 'Gentle baby wash.',
    isNewArrival: true,
    isBestSeller: true,
    stock: 25,
    rating: 5.0,
    reviewCount: 54,
    featured: true,
    createdAt: '2026-03-01T15:00:00Z',
    reviews: [
      {
        id: 'rev-3',
        author: 'Dr. Maryam Siddiqui',
        city: 'Rawalpindi',
        rating: 5,
        date: '28 March 2026',
        comment: 'The softest fabric I have ever touched. Perfect for my baby’s Aqiqah photoshoot.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'aur-nb-02',
    sku: 'AUR-NB-302',
    title: 'Organic Muslin 3-Piece Kimono Sleepsuit Set',
    slug: 'organic-muslin-kimono-sleepsuit-set',
    category: 'newborn-sets',
    subCategory: 'organic-muslin',
    occasion: 'Newborn Essentials',
    price: 2850,
    compareAtPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M'],
    colors: [
      { name: 'Warm Ecru', hex: '#C2B280' },
      { name: 'Oatmeal Taupe', hex: '#E0D6C8' },
      { name: 'Blush Powder', hex: '#FADBD8' }
    ],
    description: 'Side-tie kimono wrap romper, knot beanie, and scratch mittens in 4-layer cloud-soft GOTS certified organic muslin.',
    fabricDetails: '100% GOTS Certified Organic Cotton Muslin.',
    careInstructions: 'Machine washable.',
    isNewArrival: false,
    isBestSeller: true,
    stock: 30,
    rating: 5.0,
    reviewCount: 61,
    featured: true,
    createdAt: '2026-02-18T10:00:00Z'
  },

  // --- ROMPERS & SUITS ---
  {
    id: 'aur-rm-01',
    sku: 'AUR-RM-401',
    title: 'Traditional Handloom Ajrak Print Cotton Romper Suit',
    slug: 'handloom-ajrak-print-cotton-romper-suit',
    category: 'rompers',
    subCategory: 'ajrak-heritage',
    occasion: 'Festive',
    price: 2650,
    compareAtPrice: 3200,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: [
      { name: 'Indigo Terracotta', hex: '#722F37' },
      { name: 'Earthy Ochre', hex: '#CC7722' }
    ],
    description: 'Traditional Sindhi hand block-printed Ajrak on combed cotton with nickel-free bottom crotch snaps for effortless diaper changes.',
    fabricDetails: '100% Combed Natural Cotton.',
    careInstructions: 'Machine wash warm.',
    isNewArrival: true,
    isBestSeller: true,
    stock: 35,
    rating: 5.0,
    reviewCount: 52,
    featured: true,
    createdAt: '2026-03-14T09:00:00Z'
  },
  {
    id: 'aur-rm-02',
    sku: 'AUR-RM-402',
    title: 'Pastel Knit Cardigan & Booties Romper Set',
    slug: 'pastel-knit-cardigan-booties-romper-set',
    category: 'rompers',
    subCategory: 'rompers-sleepsuits',
    occasion: 'Casual',
    price: 3450,
    compareAtPrice: 4200,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ],
    sizes: ['0-3M', '3-6M', '6-12M'],
    colors: [
      { name: 'Almond Taupe', hex: '#E0D6C8' },
      { name: 'Sage Mist', hex: '#B2AC88' }
    ],
    description: 'Ultra-gentle knitted baby suit with matching cozy booties. Non-scratchy blend made for infant temperature regulation.',
    fabricDetails: '100% Hypoallergenic Soft Baby Yarn.',
    careInstructions: 'Hand wash cold. Dry flat.',
    isNewArrival: false,
    isBestSeller: false,
    stock: 14,
    rating: 4.8,
    reviewCount: 16,
    featured: false,
    createdAt: '2026-02-12T08:00:00Z'
  }
];

export const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Gujrat',
  'Mardan',
  'Sukkur',
  'Mirpur (AJK)',
  'Gilgit',
  'Skardu'
];

export const PAKISTANI_PROVINCES = [
  'Punjab',
  'Sindh',
  'Islamabad Capital Territory',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];
