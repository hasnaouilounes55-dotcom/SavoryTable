import React, { useState } from 'react';
import { Recipe } from '../types.ts';
import { useRecipes } from '../context/RecipeContext.tsx';
import { Heart, Clock, Utensils, Star, Play, Check } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { openRecipeDetail, toggleFavorite, isFavorite } = useRecipes();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const favorited = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <article
      onClick={() => openRecipeDetail(recipe)}
      className="group flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-left"
    >
      {/* Lead with Imagery */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-stone-100 text-stone-600">
            <Utensils className="w-10 h-10 text-stone-400 mb-2 stroke-[1.5]" />
            <span className="font-serif-display text-sm font-semibold text-stone-800 text-center line-clamp-1">
              {recipe.title}
            </span>
            <span className="text-xs text-stone-500 mt-1">{recipe.cuisine} Culinary Special</span>
          </div>
        )}

        {/* Video Tutorial Badge (Affordance-only indicator) */}
        {recipe.videoTutorial && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-medium rounded-md shadow-xs">
            <Play className="w-3 h-3 fill-current text-amber-400" />
            <span>Video Guide</span>
          </div>
        )}

        {/* Save to Favorites Heart Toggle */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            favorited
              ? 'bg-white text-rose-500 shadow-sm'
              : 'bg-stone-900/40 text-white hover:bg-white hover:text-stone-900'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${favorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Card Content - Clean Zero-Pill Typography */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata line without pills */}
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-2">
            <span className="text-amber-800 uppercase tracking-wider text-[11px] font-semibold">
              {recipe.cuisine}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="tabular-nums">{recipe.totalMinutes}m</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          {/* Recipe Title */}
          <h3 className="font-serif-display text-lg font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Card Footer: Rating, Servings, & Read More */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-stone-900 tabular-nums">{recipe.rating}</span>
            <span className="text-stone-400 tabular-nums">({recipe.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 tabular-nums">{recipe.servings} Servings</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-medium text-stone-800 group-hover:text-amber-700 transition-colors">
              View Tutorial →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
