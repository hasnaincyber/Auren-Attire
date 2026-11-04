import React, { useState, useEffect } from 'react';
import { RotateCcw, Truck, Headphones, Sparkles, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  imageFallback: string;
  categoryTarget: 'all' | 'baby-boys' | 'baby-girls' | 'newborn-sets' | 'rompers';
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tag: 'NEW SEASON',
    title: 'Tiny ones, big firsts.',
    subtitle: 'Soft, premium everyday wear for ages 0–12.',
    buttonText: 'Shop new in',
    image: '/assets/hero-newin.webp',
    imageFallback: 'https://alayajunior.com/cdn/shop/files/web-creative-hero-newin-desktop.webp?v=1784895449&width=2400',
    categoryTarget: 'all'
  },
  {
    id: 'slide-2',
    tag: 'ORGANIC COMFORT',
    title: 'Pure softness, newborn essentials.',
    subtitle: 'Gentle pure cotton suits and heirloom sets crafted for delicate skin.',
    buttonText: 'Explore newborn',
    image: '/assets/hero-diaper.webp',
    imageFallback: 'https://alayajunior.com/cdn/shop/files/web-creative-hero-diaper-desktop.webp?v=1784895466&width=2400',
    categoryTarget: 'newborn-sets'
  }
];

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters, quickCategorySelect } = useShop();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto slide change with pause on interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleHeroAction = () => {
    if (currentSlide.categoryTarget === 'all') {
      setFilters((prev) => ({ ...prev, category: 'all', subCategory: 'all' }));
      setCurrentView('shop');
    } else {
      quickCategorySelect(currentSlide.categoryTarget);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#e8ded3] text-stone-900 border-b border-stone-200/80">
      {/* Hero Banner Container */}
      <div className="relative w-full h-[460px] sm:h-[580px] md:h-[660px] lg:h-[720px] overflow-hidden">
        {/* Slide Imagery with smooth transition */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              onError={(e) => {
                // Fallback to CDN webp or local attachment
                const target = e.currentTarget;
                if (target.src !== slide.imageFallback) {
                  target.src = slide.imageFallback;
                } else {
                  target.src = '/assets/aistudio/image_6b7e2945.png';
                }
              }}
              alt={slide.title}
              className="w-full h-full object-cover object-[center_center]"
            />
          </div>
        ))}

        {/* Subtle warm ambient wash for crisp typography legibility */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-stone-100/50 via-stone-100/20 to-transparent"></div>

        {/* Content Overlay matching reference image typography and positioning */}
        <div className="absolute inset-0 z-30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
            <div className="max-w-lg pt-4 sm:pt-16">
              
              {/* Eyebrow Tag */}
              <div className="mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-stone-700 inline-block drop-shadow-2xs">
                  {currentSlide.tag}
                </span>
              </div>

              {/* Editorial Serif Title */}
              <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-stone-900 tracking-tight leading-[1.12] mb-2.5 sm:mb-4 drop-shadow-2xs">
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed mb-5 sm:mb-8 max-w-xs sm:max-w-sm drop-shadow-2xs">
                {currentSlide.subtitle}
              </p>

              {/* Soft Dusty Rose Pill Button */}
              <div>
                <button
                  onClick={handleHeroAction}
                  className="px-7 py-3 sm:px-8 sm:py-3.5 bg-[#be8e89] hover:bg-[#a97c77] active:scale-95 text-white font-medium text-xs sm:text-sm tracking-wide rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {currentSlide.buttonText}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots at bottom left (● ○ style from uploaded reference) */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-12 z-30 flex items-center space-x-2">
          {HERO_SLIDES.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentSlideIndex(dotIndex)}
              className={`transition-all duration-300 cursor-pointer ${
                dotIndex === currentSlideIndex
                  ? 'w-2.5 h-2.5 bg-white rounded-full shadow-sm'
                  : 'w-2.5 h-2.5 rounded-full border border-white/90 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Feature Strip at bottom matching the reference screenshot */}
      <div className="bg-[#fcfaf7] border-t border-stone-200/60 py-2.5 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex sm:grid sm:grid-cols-3 justify-between items-center gap-1 sm:gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-stone-700 flex-1 px-1">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600 shrink-0" />
            <span className="text-[10px] sm:text-xs font-medium tracking-wide">20 Days Return</span>
          </div>
          <div className="h-4 w-px bg-stone-300/60 sm:hidden"></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-stone-700 flex-1 px-1">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600 shrink-0" />
            <span className="text-[10px] sm:text-xs font-medium tracking-wide">Fast COD Delivery</span>
          </div>
          <div className="h-4 w-px bg-stone-300/60 sm:hidden"></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-stone-700 flex-1 px-1">
            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600 shrink-0" />
            <span className="text-[10px] sm:text-xs font-medium tracking-wide">Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
