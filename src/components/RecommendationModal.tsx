import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { Recipe } from '../types.ts';
import {
  Sparkles,
  X,
  ChefHat,
  Clock,
  Utensils,
  Check,
  Flame,
  ArrowRight,
  BookmarkPlus,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const RecommendationModal: React.FC = () => {
  const { isRecommendationOpen, setIsRecommendationOpen, addCustomRecipe, submitRecipeRequest } = useRecipes();

  const [prompt, setPrompt] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [dietary, setDietary] = useState('None');
  const [prepTime, setPrepTime] = useState('Under 30 mins');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedToBoard, setSubmittedToBoard] = useState(false);

  if (!isRecommendationOpen) return null;

  const quickCravings = [
    'Quick 20-min dinner with pasta and fresh greens',
    'Romantic date night seafood dinner',
    'Warm comforting winter stew or curry',
    'High-protein meal prep with chicken & quinoa',
    'Authentic street-style crispy tacos',
    'Flaky Parisian breakfast pastry or tart',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setGeneratedRecipe(null);
    setSubmittedToBoard(false);

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim() || 'Create an exquisite seasonal home-cooked dish',
          ingredients: ingredients.trim(),
          cuisine: cuisine === 'Any' ? '' : cuisine,
          dietary: dietary === 'None' ? '' : dietary,
          prepTime,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate recipe recommendation');
      }

      const data = await res.json();
      if (data.recipe) {
        // Convert to full Recipe format
        const fullRecipe: Recipe = {
          id: `custom-${Date.now()}`,
          title: data.recipe.title,
          slug: data.recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: data.recipe.description || 'A custom chef-crafted recipe developed to match your exact pantry and cravings.',
          category: data.recipe.category || 'Main Course',
          cuisine: data.recipe.cuisine || cuisine || 'Artisan Fusion',
          prepTime: data.recipe.prepTime || '15 mins',
          cookTime: data.recipe.cookTime || '20 mins',
          totalMinutes: data.recipe.totalMinutes || 35,
          servings: data.recipe.servings || 4,
          difficulty: data.recipe.difficulty || 'Intermediate',
          rating: 5.0,
          reviewCount: 1,
          image: '/src/assets/images/hero_culinary_artisan_1791058918102.jpg',
          dietary: data.recipe.tags || [dietary !== 'None' ? dietary : 'Custom Recipe'],
          nutrition: {
            calories: data.recipe.calories || 460,
            servingSize: `1 portion (~${Math.round(280 + Math.random() * 80)}g)`,
            protein: '32g',
            carbs: '44g',
            fat: '18g',
            fiber: '5g',
            saturatedFat: '4.5g',
            transFat: '0g',
            unsaturatedFat: '13.5g',
            cholesterol: '85mg',
            sodium: '620mg',
            potassium: '560mg',
            sugar: '4g',
            calcium: '120mg',
            iron: '3.4mg',
            vitaminD: '0.8mcg',
            breakdown: {
              saturatedFat: '4.5g',
              transFat: '0g',
              monounsaturatedFat: '9.5g',
              polyunsaturatedFat: '4g',
              cholesterol: '85mg',
              sodium: '620mg',
              potassium: '560mg',
              dietaryFiber: '5g',
              sugars: '4g',
              addedSugars: '0g',
              calcium: '120mg',
              iron: '3.4mg',
              vitaminD: '0.8mcg',
            },
            dailyValues: {
              calories: Math.round(((data.recipe.calories || 460) / 2000) * 100),
              protein: 64,
              carbs: 16,
              fat: 23,
              saturatedFat: 23,
              cholesterol: 28,
              sodium: 27,
              fiber: 18,
              sugars: 8,
              calcium: 9,
              iron: 19,
              potassium: 12,
              vitaminD: 4,
            },
          },
          chefNotes: data.recipe.chefNote || 'Prepared with precision by SavoryTable AI Culinary Engine. Season to taste at each step.',
          ingredients: data.recipe.ingredients.map((ing: any) => ({
            name: ing.name,
            quantity: typeof ing.quantity === 'number' ? ing.quantity : 1,
            unit: ing.unit || '',
            notes: ing.notes || '',
            category: 'Pantry',
          })),
          instructions: data.recipe.instructions.map((inst: any, idx: number) => ({
            stepNumber: inst.stepNumber || idx + 1,
            title: inst.title || `Step ${idx + 1}`,
            detail: inst.detail || inst.instruction || '',
            tip: inst.tip || '',
            timerMinutes: inst.timerMinutes || undefined,
          })),
          videoTutorial: {
            title: data.recipe.videoTutorial?.title || `Masterclass: How to Cook ${data.recipe.title}`,
            youtubeId: 'bJUiWdM__Qw',
            embedUrl: data.recipe.videoTutorial?.embedUrl || 'https://www.youtube.com/embed/bJUiWdM__Qw',
            searchUrl: data.recipe.videoTutorial?.youtubeSearchUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(data.recipe.title + ' recipe tutorial')}`,
            channelName: 'Culinary Masterclass',
            duration: '10:00',
          },
          isCustom: true,
        };

        setGeneratedRecipe(fullRecipe);
      } else {
        throw new Error('No recipe returned');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Could not generate recipe recommendation at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCookbook = () => {
    if (!generatedRecipe) return;
    addCustomRecipe(generatedRecipe);
    setIsRecommendationOpen(false);
  };

  const handlePostToCommunity = async () => {
    if (!generatedRecipe) return;
    await submitRecipeRequest(
      generatedRecipe.title,
      generatedRecipe.cuisine,
      `Requested via AI Chef recommendation: "${prompt || 'Pantry recipe'}"`
    );
    setSubmittedToBoard(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-8 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl font-bold text-stone-950 leading-tight">
                Ask for Recipe Recommendations
              </h2>
              <p className="text-xs text-stone-500">
                Powered by Gemini AI · Custom recipes scaled for your kitchen
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRecommendationOpen(false)}
            aria-label="Close modal"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!generatedRecipe ? (
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Prompt / Cravings */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                  1. What are you craving or what is the occasion?
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Quick 20-minute vegetarian pasta for a cozy date night"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-2 focus:outline-amber-600 text-stone-900 placeholder:text-stone-400"
                />

                {/* Quick Cravings Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {quickCravings.map((craving, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPrompt(craving)}
                      className="text-[11px] font-medium px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 rounded-md transition-colors cursor-pointer text-left"
                    >
                      + {craving}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients on hand */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                  2. Ingredients you have on hand (Pantry & Fridge)
                </label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Garlic, cherry tomatoes, feta, olive oil, basil, chicken breasts"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-2 focus:outline-amber-600 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              {/* Row: Cuisine & Dietary & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                    Cuisine
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-800 cursor-pointer"
                  >
                    <option value="Any">Chef's Choice (Any)</option>
                    <option value="Italian">Italian</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Thai">Thai</option>
                    <option value="Indian">Indian</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                    Dietary
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-800 cursor-pointer"
                  >
                    <option value="None">No Restrictions</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="High-Protein">High-Protein</option>
                    <option value="Keto-Friendly">Keto-Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                    Time Budget
                  </label>
                  <select
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-800 cursor-pointer"
                  >
                    <option value="Under 20 mins">Fast (Under 20m)</option>
                    <option value="Under 35 mins">Standard (30-35m)</option>
                    <option value="Under 60 mins">Leisurely (45-60m)</option>
                    <option value="Weekend Braise">Weekend Masterclass</option>
                  </select>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-5 text-sm font-semibold rounded-xl text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Developing custom recipe with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current text-stone-900" />
                      <span>Generate Personalized Recipe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Result View: Recipe preview with actions to save and view */
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                    {generatedRecipe.cuisine} · {generatedRecipe.totalMinutes} mins · {generatedRecipe.difficulty}
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-950">
                    {generatedRecipe.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {generatedRecipe.description}
                  </p>
                </div>

                <button
                  onClick={() => setGeneratedRecipe(null)}
                  className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New Request</span>
                </button>
              </div>

              {/* Ingredients Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Ingredients ({generatedRecipe.servings} servings)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <span className="font-medium text-stone-800">{ing.name}</span>
                      <span className="font-semibold text-stone-900 tabular-nums">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Instructions ({generatedRecipe.instructions.length} steps)
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {generatedRecipe.instructions.map((step) => (
                    <div key={step.stepNumber} className="p-3 bg-stone-50 rounded-lg text-xs leading-relaxed">
                      <div className="font-bold text-stone-900 mb-0.5">
                        {step.stepNumber}. {step.title}
                      </div>
                      <div className="text-stone-600">{step.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveToCookbook}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save to My Cookbook & Open Recipe Page</span>
                </button>

                <button
                  onClick={handlePostToCommunity}
                  disabled={submittedToBoard}
                  className={`py-3 px-4 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    submittedToBoard
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {submittedToBoard ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Submitted to Requests Board!</span>
                    </>
                  ) : (
                    <span>Share to Community Requests</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
