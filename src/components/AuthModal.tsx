import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import {
  X,
  ChefHat,
  Sparkles,
  UserCheck,
  Compass,
  ArrowRight,
  BookmarkCheck,
  ShoppingCart,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { AuthModalMode } from '../types.ts';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    continueAsGuest,
    createAccount,
    signIn,
    authModalMode,
  } = useRecipes();

  const [currentMode, setCurrentMode] = useState<AuthModalMode>(authModalMode || 'onboarding');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skillLevel, setSkillLevel] = useState<
    'Beginner Cook' | 'Enthusiastic Foodie' | 'Home Gourmet' | 'Seasoned Chef'
  >('Home Gourmet');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Mediterranean']);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync mode when parent opens modal in specific mode
  React.useEffect(() => {
    if (authModalMode) {
      setCurrentMode(authModalMode);
      setErrorMessage('');
    }
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const dietaryOptions = [
    'Mediterranean',
    'Vegetarian',
    'High Protein',
    'Gluten-Free',
    'Dairy-Free',
    'Low Carb',
    'Pescatarian',
  ];

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length > 0 && password.length < 6) {
      setErrorMessage('Password should be at least 6 characters.');
      return;
    }

    createAccount({
      name: name.trim(),
      email: email.trim(),
      password,
      skillLevel,
      dietaryPreferences: selectedDietary,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    signIn(email.trim(), password);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-900 text-amber-200 flex items-center justify-center shadow-md mb-3">
              <ChefHat className="w-6 h-6" />
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-950">
              Welcome to SavoryTable
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              Curated master recipes, dynamic ingredient scaling, step-by-step video tutorials, and your personal cookbook.
            </p>
          </div>

          {/* VIEW 1: Onboarding Choice (Create Account vs Continue as Guest) */}
          {currentMode === 'onboarding' && (
            <div className="space-y-4">
              {/* Option A: Create Account Card */}
              <div className="relative p-5 rounded-xl border-2 border-stone-900 bg-stone-900 text-white shadow-md hover:border-amber-500 transition-all">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-300" />
                    <span className="font-serif-display text-lg font-bold text-white">
                      Create an Account
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                <p className="text-xs text-stone-300 mb-3 leading-relaxed">
                  Join our culinary community to personalize your culinary journey and save progress.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-300 mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Save favorite recipes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Sync grocery list</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>AI custom recipe generator</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Post community requests</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode('register');
                    setErrorMessage('');
                  }}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Sign Up with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMode('login');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-stone-300 hover:text-white underline cursor-pointer"
                  >
                    Already have an account? Sign in here
                  </button>
                </div>
              </div>

              {/* Option B: Continue as Guest Card */}
              <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-all">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-stone-700" />
                    <span className="font-serif-display text-lg font-bold text-stone-900">
                      Continue as Guest
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full">
                    No Sign-up
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  Explore all 22 artisan recipes, view step-by-step video masterclasses, scale ingredients, and test cooking timers right away.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-4">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>You can always create a permanent account later from your profile.</span>
                </div>

                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs sm:text-sm rounded-lg border border-stone-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Start Browsing as Guest</span>
                  <ArrowRight className="w-4 h-4 text-stone-500" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: Register Form */}
          {currentMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif-display text-lg font-bold text-stone-900">
                  Create Your Free Account
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentMode('onboarding')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  ← Back to options
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password (optional for quick start)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Culinary Experience Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900 cursor-pointer"
                >
                  <option value="Beginner Cook">Beginner Cook (Learning basics)</option>
                  <option value="Enthusiastic Foodie">Enthusiastic Foodie (Loves new cuisines)</option>
                  <option value="Home Gourmet">Home Gourmet (Cooks regularly with technique)</option>
                  <option value="Seasoned Chef">Seasoned Chef (Advanced skills & precision)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Culinary & Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((tag) => {
                    const isSelected = selectedDietary.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleDietary(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100/80 border-amber-300 text-amber-900'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>Create Account & Start Cooking</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentMode('login')}
                  className="hover:text-stone-900 underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Continue as guest instead
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: Login Form */}
          {currentMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif-display text-lg font-bold text-stone-900">
                  Sign In to SavoryTable
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentMode('onboarding')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  ← Back to options
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. chef@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-2 focus:outline-amber-600 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentMode('register')}
                  className="hover:text-stone-900 underline cursor-pointer"
                >
                  New to SavoryTable? Create account
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Continue as guest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
