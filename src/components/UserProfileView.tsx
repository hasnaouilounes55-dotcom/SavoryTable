import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import { RecipeCard } from './RecipeCard.tsx';
import {
  Heart,
  ShoppingCart,
  ChefHat,
  BookmarkCheck,
  Trash2,
  Plus,
  Check,
  Sparkles,
  ArrowLeft,
  Settings,
  UtensilsCrossed,
  UserPlus,
  LogOut,
  Compass,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    favorites,
    toggleGroceryItem,
    removeGroceryItem,
    clearCompletedGroceryItems,
    setActiveView,
    setIsRecommendationOpen,
    openRecipeDetail,
    isGuest,
    openAuthModal,
    signOut,
  } = useRecipes();

  const [activeTab, setActiveTab] = useState<'favorites' | 'grocery' | 'custom' | 'settings'>('favorites');
  const [newGroceryItem, setNewGroceryItem] = useState('');
  const [newGroceryAmount, setNewGroceryAmount] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editSkill, setEditSkill] = useState(userProfile.skillLevel);

  const handleAddCustomGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryItem.trim()) return;

    const newItem = {
      id: `custom-g-${Date.now()}`,
      item: newGroceryItem.trim(),
      amount: newGroceryAmount.trim() || '1x',
      recipeTitle: 'Custom Pantry Need',
      checked: false,
    };

    updateUserProfile({
      groceryList: [newItem, ...userProfile.groceryList],
    });

    setNewGroceryItem('');
    setNewGroceryAmount('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || userProfile.name,
      bio: editBio.trim() || userProfile.bio,
      skillLevel: editSkill,
    });
    setIsEditingProfile(false);
  };

  const pendingGroceryCount = userProfile.groceryList.filter((i) => !i.checked).length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24 text-stone-900">
      {/* Top Banner & Header */}
      <div className="border-b border-stone-200/90 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Recipe Catalogue</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
                {isGuest ? <Compass className="w-7 h-7 text-amber-300" /> : userProfile.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-950">
                    {userProfile.name}
                  </h1>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-md">
                    {isGuest ? 'Guest Mode' : userProfile.skillLevel}
                  </span>
                </div>

                <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                  {userProfile.bio}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-stone-500">
                  <span className="tabular-nums font-semibold text-stone-900">
                    {favorites.length} Saved Dishes
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="tabular-nums font-semibold text-stone-900">
                    {userProfile.customRecipes.length} Custom Dishes
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="tabular-nums font-semibold text-stone-900">
                    {pendingGroceryCount} Grocery Items
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isGuest ? (
                <>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Free Account</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Sign In</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsRecommendationOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Ask for New Recipe</span>
                  </button>

                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Sign out from this device"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Guest Conversion Callout Banner */}
          {isGuest && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">You are browsing as a Guest</h4>
                  <p className="text-xs text-amber-900/80">
                    Create an account to permanently sync your personal cookbook, saved recipes, and interactive grocery list across devices.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-amber-100/60 text-amber-950 border border-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Inline Profile Editor */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="mt-6 p-5 bg-stone-50 rounded-xl border border-stone-200/90 text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Chef Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cooking Experience</label>
                  <select
                    value={editSkill}
                    onChange={(e: any) => setEditSkill(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-900 cursor-pointer"
                  >
                    <option value="Beginner Cook">Beginner Cook</option>
                    <option value="Enthusiastic Foodie">Enthusiastic Foodie</option>
                    <option value="Home Gourmet">Home Gourmet</option>
                    <option value="Seasoned Chef">Seasoned Chef</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Culinary Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Profile Navigation Tabs */}
          <div className="flex items-center gap-1 mt-8 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'favorites'
                  ? 'border-amber-600 text-stone-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Saved Favorite Dishes</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-stone-100 rounded text-stone-600 tabular-nums">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('grocery')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'grocery'
                  ? 'border-amber-600 text-stone-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Grocery Shopping List</span>
              {pendingGroceryCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold tabular-nums">
                  {pendingGroceryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'custom'
                  ? 'border-amber-600 text-stone-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>My AI Generated Recipes</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-stone-100 rounded text-stone-600 tabular-nums">
                {userProfile.customRecipes.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: SAVED FAVORITES */}
        {activeTab === 'favorites' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-stone-950">
                  Your Saved Dishes ({favorites.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Dishes bookmarked for dinner parties, quick weeknights, and masterclasses
                </p>
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={() => setIsRecommendationOpen(true)}
                  className="text-xs text-amber-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discover More</span>
                </button>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-300">
                <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif-display text-lg font-bold text-stone-900">
                  No Saved Dishes Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
                  Browse our catalog of 20+ master recipes and click the heart icon on any card to save it here for later.
                </p>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Explore 22 Artisan Recipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GROCERY SHOPPING LIST */}
        {activeTab === 'grocery' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-stone-950">
                  Aisle Shopping List
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Check off items in the market as you gather your ingredients
                </p>
              </div>

              {userProfile.groceryList.some((i) => i.checked) && (
                <button
                  onClick={clearCompletedGroceryItems}
                  className="text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Checked</span>
                </button>
              )}
            </div>

            {/* Add Custom Grocery Item */}
            <form onSubmit={handleAddCustomGrocery} className="mb-6 flex gap-2">
              <input
                type="text"
                value={newGroceryItem}
                onChange={(e) => setNewGroceryItem(e.target.value)}
                placeholder="Add ingredient or pantry staple (e.g. Maldon flaky salt)"
                className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-2 focus:outline-amber-600 text-stone-900"
              />
              <input
                type="text"
                value={newGroceryAmount}
                onChange={(e) => setNewGroceryAmount(e.target.value)}
                placeholder="Qty (e.g. 1 box)"
                className="w-24 px-3 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-2 focus:outline-amber-600 text-stone-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* List */}
            {userProfile.groceryList.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-stone-300">
                <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">Your grocery list is empty.</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Click "Add to Grocery List" on any recipe page to populate your shopping trip.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
                {userProfile.groceryList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      item.checked ? 'bg-stone-50/70 text-stone-400' : 'hover:bg-amber-50/30 text-stone-800'
                    }`}
                  >
                    <div
                      onClick={() => toggleGroceryItem(item.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div>
                        <span className={`text-xs font-semibold ${item.checked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {item.item}
                        </span>
                        <div className="text-[11px] text-stone-400">
                          {item.recipeTitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-800 tabular-nums">
                        {item.amount}
                      </span>
                      <button
                        onClick={() => removeGroceryItem(item.id)}
                        className="text-stone-300 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM AI GENERATED RECIPES */}
        {activeTab === 'custom' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-stone-950">
                  Custom AI Generated Recipes ({userProfile.customRecipes.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Original culinary creations generated for your exact cravings and pantry ingredients
                </p>
              </div>

              <button
                onClick={() => setIsRecommendationOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ask for Another Recipe</span>
              </button>
            </div>

            {userProfile.customRecipes.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-300">
                <Sparkles className="w-12 h-12 text-amber-500/60 mx-auto mb-3" />
                <h3 className="font-serif-display text-lg font-bold text-stone-900">
                  No Custom Recipes Generated Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
                  Use our AI recommendation feature to ask for a recipe based on what's in your fridge or a specific craving.
                </p>
                <button
                  onClick={() => setIsRecommendationOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
                >
                  Ask Chef Recommender Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.customRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
