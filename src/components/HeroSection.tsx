import React from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { Search, Sparkles, SlidersHorizontal, X, ArrowRight, Play, BookOpen } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCuisine,
    setSelectedCuisine,
    setIsRecommendationOpen,
    allRecipes,
  } = useRecipes();

  const categories = [
    'All',
    'Pasta & Noodles',
    'Main Course',
    'Seafood',
    'Soups & Stews',
    'Baking & Desserts',
    'Vegetarian & Bowls',
    'Street Food & Tacos',
  ];

  const cuisines = [
    'All',
    'Italian',
    'French',
    'Japanese',
    'Mexican',
    'Indian',
    'Thai',
    'Spanish',
    'Greek',
    'American',
  ];

  return (
    <div className="relative border-b border-stone-200/90 bg-[#FAF9F5] overflow-hidden">
      {/* Hero Banner Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Curated Culinary Masterclasses · 22 Tested Recipes</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 text-balance leading-[1.12]">
              Artisan recipes, dynamic measurements, and video masterclasses.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Explore step-by-step written guides with interactive serving scalers, built-in kitchen timers, embedded chef video tutorials, and personalized recipe recommendations.
            </p>

            {/* Instant Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 22 recipes by dish name, cuisine, or ingredients (e.g. salmon, truffle, chili)..."
                  className="w-full pl-11 pr-10 py-3.5 text-sm bg-white border border-stone-300 rounded-2xl shadow-xs focus:outline-2 focus:outline-amber-600 text-stone-900 placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setIsRecommendationOpen(true)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current text-stone-900" />
                <span>Ask for Custom Recipe Recommendations</span>
              </button>

              <div className="text-xs text-stone-500 flex items-center gap-2">
                <span className="font-bold text-stone-800 tabular-nums">{allRecipes.length}</span>
                <span>artisan recipes available</span>
              </div>
            </div>
          </div>

          {/* Right: Featured Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 aspect-[4/3] bg-stone-100 group">
              <img
                src="/src/assets/images/hero_culinary_artisan_1791058918102.jpg"
                alt="Artisan culinary kitchen flatlay"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Masterclass Collection
                </div>
                <h3 className="font-serif-display text-xl font-bold leading-snug">
                  From Neapolitan Pizza to French Galettes
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  Each recipe features dynamically scaled ingredient grams, precision timings, and verified YouTube tutorials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category & Cuisine Filter Strip */}
      <div id="recipe-categories-anchor" className="border-t border-stone-200/80 bg-white py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Functional Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-2 shrink-0">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                      : 'bg-stone-100/80 text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cuisine Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Cuisine:
              </span>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium cursor-pointer focus:outline-2 focus:outline-amber-600"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cuisines' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
