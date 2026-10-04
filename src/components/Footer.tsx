import React from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { Heart, Sparkles, ChefHat } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsRecommendationOpen, favorites, isGuest, openAuthModal } = useRecipes();

  return (
    <footer className="border-t border-stone-200 bg-white text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-sm font-bold">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif-display">
                SavoryTable
              </span>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed">
              Curated master recipes, dynamic servings scaling, video guides, and AI recommendations for the modern kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              Explore Recipes
            </h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  All 22 Artisan Dishes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsRecommendationOpen(true)}
                  className="hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ask AI Recommender</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('requests');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Community Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Personal Cookbook */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              My Profile
            </h4>
            <ul className="space-y-2 text-stone-500">
              <li>
                <button
                  onClick={() => {
                    setActiveView('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Saved Favorite Dishes ({favorites.length})
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Aisle Grocery List
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Custom Generated Dishes
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal(isGuest ? 'register' : 'login')}
                  className="hover:text-stone-900 text-amber-700 font-medium transition-colors cursor-pointer"
                >
                  {isGuest ? '★ Create Free Account' : 'Account Settings & Switch'}
                </button>
              </li>
            </ul>
          </div>

          {/* Culinary Standards */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              Culinary Standards
            </h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Every dish features tested grams and metric units, authentic cooking techniques, timing markers, and verified video tutorials.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} SavoryTable Artisan Kitchen. All culinary rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Crafted for passionate home gourmets</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
