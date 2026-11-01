import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeCategory, setActiveCategory] = useState<'kids' | 'baby'>('kids');

  if (!isSizeGuideOpen) return null;

  const kidsData = [
    { size: '1-2Y', age: '12 - 24 Months', chestIn: '21 - 22"', chestCm: '53 - 56 cm', lengthIn: '18 - 20"', lengthCm: '46 - 51 cm', waistIn: '19 - 20"', waistCm: '48 - 51 cm' },
    { size: '2-3Y', age: '2 - 3 Years', chestIn: '22 - 23"', chestCm: '56 - 58 cm', lengthIn: '21 - 23"', lengthCm: '53 - 58 cm', waistIn: '20 - 21"', waistCm: '51 - 53 cm' },
    { size: '4-5Y', age: '4 - 5 Years', chestIn: '24 - 25"', chestCm: '61 - 63 cm', lengthIn: '25 - 27"', lengthCm: '63 - 68 cm', waistIn: '21 - 22"', waistCm: '53 - 56 cm' },
    { size: '6-7Y', age: '6 - 7 Years', chestIn: '26 - 27"', chestCm: '66 - 68 cm', lengthIn: '29 - 31"', lengthCm: '74 - 79 cm', waistIn: '22 - 23"', waistCm: '56 - 58 cm' },
    { size: '8-9Y', age: '8 - 9 Years', chestIn: '28 - 29"', chestCm: '71 - 74 cm', lengthIn: '33 - 35"', lengthCm: '84 - 89 cm', waistIn: '24 - 25"', waistCm: '61 - 63 cm' },
    { size: '10-11Y', age: '10 - 11 Years', chestIn: '30 - 31"', chestCm: '76 - 79 cm', lengthIn: '37 - 39"', lengthCm: '94 - 99 cm', waistIn: '25 - 26"', waistCm: '63 - 66 cm' },
  ];

  const babyData = [
    { size: '0-3M', age: '0 - 3 Months', chestIn: '16 - 17"', chestCm: '40 - 43 cm', lengthIn: '14 - 15"', lengthCm: '35 - 38 cm', weight: '3.5 - 5.5 kg' },
    { size: '3-6M', age: '3 - 6 Months', chestIn: '17 - 18"', chestCm: '43 - 46 cm', lengthIn: '15 - 16.5"', lengthCm: '38 - 42 cm', weight: '5.5 - 7.5 kg' },
    { size: '6-12M', age: '6 - 12 Months', chestIn: '18 - 19.5"', chestCm: '46 - 50 cm', lengthIn: '16.5 - 18"', lengthCm: '42 - 46 cm', weight: '7.5 - 10 kg' },
    { size: '12-18M', age: '12 - 18 Months', chestIn: '19.5 - 21"', chestCm: '50 - 53 cm', lengthIn: '18 - 19.5"', lengthCm: '46 - 50 cm', weight: '10 - 12 kg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white text-stone-900 w-full max-w-2xl rounded-md shadow-2xl p-6 sm:p-8 z-10 border border-stone-200">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Ruler className="w-5 h-5 text-amber-700" />
          <h2 className="font-editorial text-2xl font-bold text-stone-900">
            Auren Attire Size Guide
          </h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Tailored specifically according to standard Pakistani children&apos;s physique with comfortable room for movement.
        </p>

        {/* Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-stone-50 p-3 rounded border border-stone-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory('kids')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                activeCategory === 'kids'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              Boys & Girls (1Y - 11Y)
            </button>
            <button
              onClick={() => setActiveCategory('baby')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                activeCategory === 'baby'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              Baby & Newborn (0M - 18M)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded">
            <button
              onClick={() => setUnit('inches')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                unit === 'inches' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                unit === 'cm' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-sm mb-6">
          {activeCategory === 'kids' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Age Group</th>
                  <th className="py-3 px-3">Chest</th>
                  <th className="py-3 px-3">Kurta Length</th>
                  <th className="py-3 px-3">Waist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {kidsData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="py-2.5 px-3 font-bold text-stone-900">{row.size}</td>
                    <td className="py-2.5 px-3 text-stone-600">{row.age}</td>
                    <td className="py-2.5 px-3">{unit === 'inches' ? row.chestIn : row.chestCm}</td>
                    <td className="py-2.5 px-3">{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                    <td className="py-2.5 px-3">{unit === 'inches' ? row.waistIn : row.waistCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Age</th>
                  <th className="py-3 px-3">Chest</th>
                  <th className="py-3 px-3">Romper Length</th>
                  <th className="py-3 px-3">Recommended Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {babyData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="py-2.5 px-3 font-bold text-stone-900">{row.size}</td>
                    <td className="py-2.5 px-3 text-stone-600">{row.age}</td>
                    <td className="py-2.5 px-3">{unit === 'inches' ? row.chestIn : row.chestCm}</td>
                    <td className="py-2.5 px-3">{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                    <td className="py-2.5 px-3">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Measuring Tips */}
        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-sm text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>FITTING ADVICE FOR FESTIVE WEAR</span>
          </div>
          <p>
            If your child falls between sizes or has a healthier build, we always recommend choosing one size up for festive kurtas, waistcoats, and ghararas to allow graceful fall and comfort throughout the event.
          </p>
          <p className="font-medium">
            Still unsure? Message our WhatsApp stylist directly at 03258990087 for baby sizing guidance.
          </p>
        </div>
      </div>
    </div>
  );
};
