import React, { useState, useEffect } from 'react';
import { Recipe } from '../types.ts';
import { useRecipes } from '../context/RecipeContext.tsx';
import { NutritionBreakdown } from './NutritionBreakdown.tsx';
import {
  ArrowLeft,
  Heart,
  Clock,
  Flame,
  Users,
  Utensils,
  Share2,
  Printer,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Play,
  ExternalLink,
  ChefHat,
  Timer,
  Pause,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Star,
} from 'lucide-react';

interface RecipeDetailPageProps {
  recipe: Recipe;
}

export const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipe }) => {
  const {
    closeRecipeDetail,
    toggleFavorite,
    isFavorite,
    addToGroceryList,
    addCookingNote,
    cookingNotes,
    openRecipeDetail,
    allRecipes,
  } = useRecipes();

  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [groceryAdded, setGroceryAdded] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteRating, setNewNoteRating] = useState(5);
  const [noteSubmitted, setNoteSubmitted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(recipe.id);

  // Reset servings and state when recipe changes
  useEffect(() => {
    setCurrentServings(recipe.servings || 4);
    setCheckedIngredients({});
    setCompletedSteps({});
    setActiveTimerStep(null);
    setIsTimerRunning(false);
    setTimerSecondsLeft(0);
    setImageError(false);
  }, [recipe.id]);

  // Step countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const handleStartTimer = (stepNumber: number, minutes: number) => {
    if (activeTimerStep === stepNumber && isTimerRunning) {
      setIsTimerRunning(false);
    } else if (activeTimerStep === stepNumber && !isTimerRunning && timerSecondsLeft > 0) {
      setIsTimerRunning(true);
    } else {
      setActiveTimerStep(stepNumber);
      setTimerSecondsLeft(minutes * 60);
      setIsTimerRunning(true);
    }
  };

  const handleResetTimer = (stepNumber: number, minutes: number) => {
    setActiveTimerStep(stepNumber);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Dynamic servings scaling ratio
  const ratio = currentServings / (recipe.servings || 4);

  const formatScaledQuantity = (qty: number): string => {
    const scaled = qty * ratio;
    if (scaled <= 0) return '';
    if (Number.isInteger(scaled)) return scaled.toString();
    if (scaled < 0.25) return '¼';
    if (scaled === 0.25) return '¼';
    if (scaled === 0.5) return '½';
    if (scaled === 0.75) return '¾';
    if (scaled === 1.5) return '1 ½';
    if (scaled === 2.5) return '2 ½';
    return (Math.round(scaled * 10) / 10).toString();
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleStepDone = (stepNumber: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddAllToGrocery = () => {
    addToGroceryList(recipe);
    setGroceryAdded(true);
    setTimeout(() => setGroceryAdded(false), 2500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCookingNote(recipe.id, newNoteText.trim(), newNoteRating);
    setNewNoteText('');
    setNoteSubmitted(true);
    setTimeout(() => setNoteSubmitted(false), 3000);
  };

  // Recipe notes filtered
  const recipeNotes = cookingNotes.filter((n) => n.recipeId === recipe.id);

  // Related recipes
  const relatedRecipes = allRecipes
    .filter((r) => r.id !== recipe.id && (r.cuisine === recipe.cuisine || r.category === recipe.category))
    .slice(0, 3);

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (recipe.instructions.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24 text-stone-900">
      {/* Top Action & Breadcrumb Bar */}
      <div className="border-b border-stone-200/90 bg-white/70 backdrop-blur-md sticky top-18 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={closeRecipeDetail}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all recipes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Share recipe link"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => window.print()}
              title="Print recipe tutorial"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => toggleFavorite(recipe.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                favorited
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span>{favorited ? 'Saved in Profile' : 'Save Favorite'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Editorial Title Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 text-xs font-medium text-stone-500 mb-3">
            <span className="uppercase tracking-wider font-semibold text-amber-800">
              {recipe.cuisine} Heritage
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.difficulty} Level</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums text-stone-900">{recipe.rating}</span>
              <span className="text-stone-400 font-normal">({recipe.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 max-w-4xl text-balance leading-tight">
            {recipe.title}
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            {recipe.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs">
              <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Prep Time</div>
              <div className="mt-1 text-base font-semibold text-stone-900 tabular-nums flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{recipe.prepTime}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs">
              <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Cook Time</div>
              <div className="mt-1 text-base font-semibold text-stone-900 tabular-nums flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>{recipe.cookTime}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs">
              <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Total Time</div>
              <div className="mt-1 text-base font-semibold text-stone-900 tabular-nums">
                {recipe.totalMinutes} mins
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs">
              <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Calories / Serving</div>
              <div className="mt-1 text-base font-semibold text-stone-900 tabular-nums">
                {recipe.nutrition?.calories || 480} kcal
              </div>
            </div>
          </div>
        </section>

        {/* Featured Photography Banner */}
        <div className="relative aspect-[16/9] max-h-[460px] w-full rounded-2xl overflow-hidden border border-stone-200/80 mb-10 shadow-sm bg-stone-100">
          {!imageError ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-100 via-stone-100 to-amber-50 text-stone-700">
              <Utensils className="w-16 h-16 text-stone-400 mb-3 stroke-[1.5]" />
              <span className="font-serif-display text-2xl font-bold text-stone-900 text-center">
                {recipe.title}
              </span>
              <span className="text-sm text-stone-500 mt-1">{recipe.cuisine} Artisan Culinary Guide</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
            <div className="flex flex-wrap gap-2 text-xs font-medium text-white/90">
              {recipe.dietary.map((d, idx) => (
                <span key={idx} className="bg-stone-900/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  {d}
                </span>
              ))}
            </div>
            {recipe.videoTutorial && (
              <a
                href="#video-tutorial-section"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jump to Video Tutorial</span>
              </a>
            )}
          </div>
        </div>

        {/* Two-Column Responsive Layout: Left = Quantities & Ingredients, Right = Step-by-Step Tutorial & Video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Dynamic Servings Scaler & Ingredients Checklist */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif-display text-xl font-bold text-stone-950">
                    Ingredients
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Quantities dynamically scaled for your table
                  </p>
                </div>

                {/* Servings Stepper */}
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
                  <button
                    onClick={() => setCurrentServings((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease servings"
                    className="w-7 h-7 rounded-md bg-white text-stone-700 hover:text-stone-950 hover:bg-stone-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-stone-900 px-1 tabular-nums whitespace-nowrap">
                    {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
                  </span>
                  <button
                    onClick={() => setCurrentServings((prev) => Math.min(24, prev + 1))}
                    aria-label="Increase servings"
                    className="w-7 h-7 rounded-md bg-white text-stone-700 hover:text-stone-950 hover:bg-stone-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 py-3 border-b border-stone-100">
                <span className="text-[11px] text-stone-400 font-medium mr-1">Presets:</span>
                {[2, 4, 6, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentServings(s)}
                    className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      currentServings === s
                        ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-200'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {s}p
                  </button>
                ))}
              </div>

              {/* Scaled Ingredients List */}
              <ul className="divide-y divide-stone-100 mt-2 max-h-[480px] overflow-y-auto pr-1">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[ing.name];
                  const scaledQty = formatScaledQuantity(ing.quantity);

                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredientCheck(ing.name)}
                      className={`py-3 flex items-start gap-3 cursor-pointer group transition-colors rounded-lg px-2 ${
                        isChecked ? 'bg-stone-50/80 text-stone-400' : 'hover:bg-amber-50/40 text-stone-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 text-sm leading-snug">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`font-medium ${isChecked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {ing.name}
                          </span>
                          <span className="font-semibold text-stone-800 tabular-nums whitespace-nowrap text-right">
                            {scaledQty} {ing.unit}
                          </span>
                        </div>
                        {ing.notes && (
                          <div className="text-xs text-stone-500 mt-0.5 italic">
                            {ing.notes}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Add to Grocery List Action */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <button
                  onClick={handleAddAllToGrocery}
                  className={`w-full py-2.5 px-4 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    groceryAdded
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900'
                  }`}
                >
                  {groceryAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Your Grocery List!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-amber-300" />
                      <span>Add Ingredients to Grocery List</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  Access your synchronized shopping list in the User Profile
                </p>
              </div>
            </div>

            {/* Extended Nutritional Information Breakdown per Serving */}
            {recipe.nutrition && (
              <NutritionBreakdown
                nutrition={recipe.nutrition}
                servings={recipe.servings || 4}
                currentServings={currentServings}
                recipeTitle={recipe.title}
              />
            )}
          </aside>

          {/* RIGHT COLUMN: Step-by-Step Written Tutorial, Active Timers, Video Guide */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step-by-Step Written Tutorial */}
            <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-5 border-b border-stone-100 mb-6">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-stone-950">
                    Step-by-Step Written Tutorial
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {recipe.instructions.length} culinary steps · Follow at your own pace
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="text-right">
                  <div className="text-xs font-semibold text-stone-800 tabular-nums">
                    {completedCount} of {recipe.instructions.length} completed
                  </div>
                  <div className="w-28 h-1.5 bg-stone-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Instructions List */}
              <div className="space-y-6">
                {recipe.instructions.map((step) => {
                  const isDone = completedSteps[step.stepNumber];
                  const hasTimer = step.timerMinutes && step.timerMinutes > 0;
                  const isThisTimerActive = activeTimerStep === step.stepNumber;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-5 rounded-xl border transition-all duration-200 ${
                        isDone
                          ? 'bg-stone-50/60 border-stone-200/60 opacity-80'
                          : 'bg-white border-stone-200/90 shadow-2xs hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-900 text-amber-100'
                            }`}
                          >
                            {isDone ? '✓' : step.stepNumber}
                          </span>
                          <h3 className={`font-serif-display text-lg font-bold ${isDone ? 'line-through text-stone-500' : 'text-stone-950'}`}>
                            {step.title}
                          </h3>
                        </div>

                        {/* Interactive Step Checkbox */}
                        <button
                          onClick={() => toggleStepDone(step.stepNumber)}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>

                      {/* Detail Text */}
                      <p className="text-sm text-stone-700 leading-relaxed pl-10 pr-2">
                        {step.detail}
                      </p>

                      {/* Chef's Secret Tip */}
                      {step.tip && (
                        <div className="mt-3.5 ml-10 p-3 bg-amber-50/70 border-l-2 border-amber-500 rounded-r-lg text-xs text-amber-950 leading-relaxed flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-amber-900">Chef's Secret: </span>
                            {step.tip}
                          </div>
                        </div>
                      )}

                      {/* Interactive Step Timer */}
                      {hasTimer && (
                        <div className="mt-3.5 ml-10 flex items-center gap-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                            <Timer className="w-4 h-4 text-amber-600" />
                            <span>Recommended time:</span>
                            <span className="font-bold text-stone-900">{step.timerMinutes} mins</span>
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            {isThisTimerActive && (
                              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                                {formatTimer(timerSecondsLeft)}
                              </span>
                            )}

                            <button
                              onClick={() => handleStartTimer(step.stepNumber, step.timerMinutes!)}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              {isThisTimerActive && isTimerRunning ? (
                                <>
                                  <Pause className="w-3 h-3" />
                                  <span>Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current text-amber-300" />
                                  <span>{isThisTimerActive ? 'Resume' : 'Start Timer'}</span>
                                </>
                              )}
                            </button>

                            {isThisTimerActive && (
                              <button
                                onClick={() => handleResetTimer(step.stepNumber, step.timerMinutes!)}
                                title="Reset timer"
                                className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Video Tutorial Section */}
            {recipe.videoTutorial && (
              <section id="video-tutorial-section" className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Official Video Tutorial</span>
                    </div>
                    <h2 className="font-serif-display text-2xl font-bold text-stone-950">
                      {recipe.videoTutorial.title}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Curated culinary guide by <span className="font-semibold text-stone-700">{recipe.videoTutorial.channelName}</span> · Duration {recipe.videoTutorial.duration}
                    </p>
                  </div>

                  <a
                    href={recipe.videoTutorial.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Responsive Video Player */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-md">
                  <iframe
                    src={recipe.videoTutorial.embedUrl}
                    title={recipe.videoTutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 flex items-center justify-between">
                  <span>
                    💡 <strong className="text-stone-900">Pro Tip:</strong> Watch the video to master pan heat control and visual sauce cues before starting to cook.
                  </span>
                  <a
                    href={recipe.videoTutorial.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-amber-800 hover:underline shrink-0 ml-2"
                  >
                    Search Alternatives →
                  </a>
                </div>
              </section>
            )}

            {/* Chef Notes Section */}
            {recipe.chefNotes && (
              <section className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2 text-amber-900 font-serif-display text-lg font-bold">
                  <ChefHat className="w-5 h-5 text-amber-700" />
                  <span>Executive Chef's Commentary</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  "{recipe.chefNotes}"
                </p>
              </section>
            )}

            {/* Cooking Notes & Reviews Section */}
            <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-stone-950">
                    Community Reviews & Kitchen Notes
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Share your adjustments, cooking times, and impressions
                  </p>
                </div>
              </div>

              {/* Submit Note Form */}
              <form onSubmit={handleAddNote} className="mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-700">Add Your Personal Note or Review</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewNoteRating(star)}
                        className="text-stone-300 hover:text-amber-500 cursor-pointer p-0.5"
                      >
                        <Star className={`w-4 h-4 ${star <= newNoteRating ? 'text-amber-500 fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Added 1 extra clove of garlic, baked for 32 mins instead of 35. Turn out magnificent!"
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                />

                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[11px] text-stone-400">Saved to your profile and community discussion</span>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Post Kitchen Note
                  </button>
                </div>

                {noteSubmitted && (
                  <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Note saved successfully!
                  </div>
                )}
              </form>

              {/* Notes List */}
              <div className="space-y-3.5">
                {recipeNotes.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No notes posted yet for this recipe. Be the first to share!</p>
                ) : (
                  recipeNotes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-stone-900">{note.user}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(note.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-stone-400 text-[11px]">{note.date}</span>
                        </div>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Related Culinary Recommendations */}
            {relatedRecipes.length > 0 && (
              <section className="pt-4 border-t border-stone-200">
                <h3 className="font-serif-display text-xl font-bold text-stone-950 mb-4">
                  You Might Also Enjoy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedRecipes.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => openRecipeDetail(rel)}
                      className="group p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer text-left"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-2">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">{rel.cuisine}</div>
                      <div className="font-serif-display text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                        {rel.title}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">{rel.totalMinutes} mins · {rel.difficulty}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
