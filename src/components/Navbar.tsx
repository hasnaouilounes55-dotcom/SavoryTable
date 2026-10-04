import React from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { Sparkles, Heart, User, ChefHat, BookmarkCheck, UserPlus, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    closeRecipeDetail,
    favorites,
    setIsRecommendationOpen,
    userProfile,
    isGuest,
    openAuthModal,
  } = useRecipes();

  const handleNavClick = (view: 'home' | 'profile' | 'requests', e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (view === 'home') {
      closeRecipeDetail();
    } else {
      setActiveView(view);
      window.location.hash = `#/${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-600 rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-stone-900 font-serif-display">
              SavoryTable
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-stone-900 cursor-pointer ${
              activeView === 'home' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600 decoration-2' : ''
            }`}
          >
            All Recipes
          </button>
          <button
            onClick={() => {
              handleNavClick('home');
              setTimeout(() => {
                const el = document.getElementById('recipe-categories-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-stone-900 cursor-pointer"
          >
            Categories
          </button>
          <button
            onClick={() => setIsRecommendationOpen(true)}
            className="transition-colors hover:text-stone-900 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Chef Recommender</span>
          </button>
          <button
            onClick={() => handleNavClick('requests')}
            className={`transition-colors hover:text-stone-900 cursor-pointer ${
              activeView === 'requests' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600 decoration-2' : ''
            }`}
          >
            Community Requests
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className={`transition-colors hover:text-stone-900 cursor-pointer flex items-center gap-1.5 ${
              activeView === 'profile' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600 decoration-2' : ''
            }`}
          >
            <span>My Cookbook</span>
            {favorites.length > 0 && (
              <span className="text-xs font-semibold tabular-nums text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                {favorites.length}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guest Account Trigger */}
          {isGuest ? (
            <button
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-stone-950" />
              <span className="hidden sm:inline">Create</span> Account
            </button>
          ) : (
            <button
              onClick={() => setIsRecommendationOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-900 bg-amber-200/80 hover:bg-amber-300/80 border border-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span className="hidden sm:inline">Ask for</span> Recipe
            </button>
          )}

          {/* Profile & Cook Book Button */}
          <button
            onClick={() => handleNavClick('profile')}
            aria-label="User Profile and Saved Recipes"
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'profile'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-xs font-semibold text-stone-800">
              {isGuest ? 'G' : userProfile.name.charAt(0)}
            </div>
            <span className="hidden md:inline font-medium">
              {isGuest ? 'Guest' : userProfile.name.split(' ')[0]}
            </span>
            <span className="flex items-center gap-1 text-xs text-stone-500 tabular-nums">
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
              <span>{favorites.length}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
