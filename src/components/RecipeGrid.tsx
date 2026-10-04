import React from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { RecipeCard } from './RecipeCard.tsx';
import { Sparkles, Utensils, RotateCcw } from 'lucide-react';

export const RecipeGrid: React.FC = () => {
  const {
    recipes,
    allRecipes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCuisine,
    setSelectedCuisine,
    setIsRecommendationOpen,
  } = useRecipes();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCuisine('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedCuisine !== 'All';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-950">
            {selectedCategory === 'All' ? 'Artisan Recipe Catalogue' : selectedCategory}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Showing <span className="font-semibold text-stone-800 tabular-nums">{recipes.length}</span> of {allRecipes.length} curated master recipes
            {selectedCuisine !== 'All' && ` · ${selectedCuisine} Cuisine`}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 shadow-xs max-w-xl mx-auto">
          <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif-display text-xl font-bold text-stone-900">
            No recipes matched your criteria
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 mb-6 leading-relaxed">
            We couldn't find any recipes matching "{searchQuery}". You can reset your filters or ask our Chef AI to invent a brand new recipe based on your ingredients!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Search & Filters
            </button>
            <button
              onClick={() => setIsRecommendationOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Ask for New Recipe Recommendation</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
