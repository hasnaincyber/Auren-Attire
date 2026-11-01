import React from 'react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

interface CategoryTile {
  title: string;
  category: CategoryType;
  subCategory?: string;
  image: string;
}

export const CategoryShowcase: React.FC = () => {
  const { quickCategorySelect } = useShop();

  const categories: CategoryTile[] = [
    {
      title: 'BABY GIRLS',
      category: 'baby-girls',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'BABY BOYS',
      category: 'baby-boys',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'NEWBORN ESSENTIALS',
      category: 'newborn-sets',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'ROMPERS & SUITS',
      category: 'rompers',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Donsje-style Centered Heading */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.1em] uppercase text-stone-900">
          SHOP BY CATEGORY
        </h2>
      </div>

      {/* 4 Photo Tiles Grid (exact match to Donsje reference) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => quickCategorySelect(cat.category, cat.subCategory)}
            className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden cursor-pointer bg-stone-100 shadow-xs hover:shadow-md transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Dark bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>

            {/* Bottom Title Label */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white drop-shadow-sm group-hover:text-amber-200 transition-colors">
                {cat.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
