import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe, UserProfile, CommunityRecipeRequest, CookingNote, AuthModalMode } from '../types.ts';
import { INITIAL_RECIPES } from '../data/recipes.ts';

interface RecipeContextType {
  recipes: Recipe[];
  allRecipes: Recipe[];
  favorites: Recipe[];
  selectedRecipe: Recipe | null;
  activeView: 'home' | 'recipe-detail' | 'profile' | 'requests';
  searchQuery: string;
  selectedCategory: string;
  selectedCuisine: string;
  userProfile: UserProfile;
  communityRequests: CommunityRecipeRequest[];
  cookingNotes: CookingNote[];
  isRecommendationOpen: boolean;
  // Auth & Onboarding
  isGuest: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  continueAsGuest: () => void;
  createAccount: (data: {
    name: string;
    email: string;
    password?: string;
    skillLevel?: 'Beginner Cook' | 'Enthusiastic Foodie' | 'Home Gourmet' | 'Seasoned Chef';
    dietaryPreferences?: string[];
  }) => void;
  signIn: (email: string, password?: string) => boolean;
  signOut: () => void;
  // Recipe Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedCuisine: (cuisine: string) => void;
  openRecipeDetail: (recipe: Recipe) => void;
  closeRecipeDetail: () => void;
  setActiveView: (view: 'home' | 'recipe-detail' | 'profile' | 'requests') => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addToGroceryList: (recipe: Recipe, ingredientNames?: string[]) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  clearCompletedGroceryItems: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addCustomRecipe: (recipe: Recipe) => void;
  submitRecipeRequest: (dishName: string, cuisine: string, notes: string) => Promise<boolean>;
  voteRecipeRequest: (id: string) => Promise<void>;
  addCookingNote: (recipeId: string, text: string, rating: number) => void;
  setIsRecommendationOpen: (open: boolean) => void;
}

const GUEST_PROFILE: UserProfile = {
  name: 'Guest Gourmet',
  email: '',
  avatarSeed: 'Guest',
  bio: 'Exploring artisan recipes, master culinary techniques, and videos as a guest.',
  skillLevel: 'Home Gourmet',
  favoriteIds: ['rec-01', 'rec-02'],
  cookedHistoryIds: [],
  dietaryPreferences: ['Mediterranean'],
  isGuest: true,
  groceryList: [
    {
      id: 'g-1',
      item: 'Fresh egg tagliatelle pasta',
      amount: '400g',
      recipeTitle: 'Tagliatelle al Tartufo',
      checked: false,
    },
    {
      id: 'g-2',
      item: 'Cultured European unsalted butter',
      amount: '70g',
      recipeTitle: 'Tagliatelle al Tartufo',
      checked: true,
    },
  ],
  customRecipes: [],
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Lounes Hasnaoui',
  email: 'hasnaouilounes55@gmail.com',
  avatarSeed: 'Lounes',
  bio: 'Passionate home cook exploring Mediterranean, French, and Japanese artisan traditions.',
  skillLevel: 'Home Gourmet',
  favoriteIds: ['rec-01', 'rec-02', 'rec-04', 'rec-06'],
  cookedHistoryIds: ['rec-01', 'rec-12'],
  dietaryPreferences: ['Mediterranean', 'Fresh Herb Focused'],
  isGuest: false,
  groceryList: [
    {
      id: 'g-1',
      item: 'Fresh egg tagliatelle pasta',
      amount: '400g',
      recipeTitle: 'Tagliatelle al Tartufo',
      checked: false,
    },
    {
      id: 'g-2',
      item: 'Cultured European unsalted butter',
      amount: '70g',
      recipeTitle: 'Tagliatelle al Tartufo',
      checked: true,
    },
    {
      id: 'g-3',
      item: 'Wild salmon fillets (skin-on)',
      amount: '4 fillets',
      recipeTitle: 'Pan-Seared Salmon',
      checked: false,
    },
    {
      id: 'g-4',
      item: 'Fresh dill fronds',
      amount: '3 tbsp',
      recipeTitle: 'Pan-Seared Salmon',
      checked: false,
    },
  ],
  customRecipes: [],
};

const RecipeContext = createContext<RecipeContextType | null>(null);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const authStatus = localStorage.getItem('savory_auth_completed');
      const saved = localStorage.getItem('savory_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (authStatus === 'guest') parsed.isGuest = true;
        if (authStatus === 'authenticated') parsed.isGuest = false;
        return parsed;
      }
      if (authStatus === 'guest' || !authStatus) {
        return GUEST_PROFILE;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  // Automatically prompt on join if user hasn't completed onboarding yet
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const completed = localStorage.getItem('savory_auth_completed');
      return completed === null || completed === undefined;
    } catch {
      return true;
    }
  });

  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('onboarding');

  const [communityRequests, setCommunityRequests] = useState<CommunityRecipeRequest[]>([
    {
      id: 'req-1',
      dishName: 'Authentic Spanish Paella Valenciana',
      cuisine: 'Spanish',
      notes: 'Crispy socarrat bottom with rabbit, chicken, rosemary and butter beans.',
      requestedBy: 'Elena R.',
      votes: 42,
      createdAt: '2026-09-28',
      status: 'In Development',
    },
    {
      id: 'req-2',
      dishName: 'Japanese Fluffy Soufflé Pancakes',
      cuisine: 'Japanese',
      notes: 'Tall, jiggly 3-inch pancakes with maple butter and berries.',
      requestedBy: 'Kenji T.',
      votes: 38,
      createdAt: '2026-09-30',
      status: 'Testing',
    },
    {
      id: 'req-3',
      dishName: 'Georgian Khachapuri Adjaruli',
      cuisine: 'Georgian',
      notes: 'Traditional cheese boat bread with runny egg yolk and butter swirl.',
      requestedBy: 'Nika M.',
      votes: 29,
      createdAt: '2026-10-01',
      status: 'Published',
    },
    {
      id: 'req-4',
      dishName: 'Moroccan Chicken Tagine with Preserved Lemon & Olives',
      cuisine: 'Moroccan',
      notes: 'Tender bone-in chicken slow-cooked with saffron, olives, and authentic Moroccan spices.',
      requestedBy: 'Youssef B.',
      votes: 25,
      createdAt: '2026-10-02',
      status: 'Testing',
    },
  ]);

  const [cookingNotes, setCookingNotes] = useState<CookingNote[]>(() => {
    try {
      const saved = localStorage.getItem('savory_cooking_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'note-1',
        recipeId: 'rec-01',
        rating: 5,
        text: 'The technique of swirling reserved starchy pasta water with cold butter off the flame produced an unbelievable velvet sheen. Absolutely restaurant grade!',
        date: '2026-10-01',
        user: 'Chef Marco',
      },
      {
        id: 'note-2',
        recipeId: 'rec-02',
        rating: 5,
        text: 'Scoring the salmon skin and pressing it down for the first 60 seconds made it shatteringly crisp. Dill beurre blanc is a keeper.',
        date: '2026-09-29',
        user: 'Sarah Jenkins',
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'recipe-detail' | 'profile' | 'requests'>('home');
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savory_user_profile', JSON.stringify(userProfile));
    } catch {
      // storage error
    }
  }, [userProfile]);

  // Sync cooking notes
  useEffect(() => {
    try {
      localStorage.setItem('savory_cooking_notes', JSON.stringify(cookingNotes));
    } catch {
      // storage error
    }
  }, [cookingNotes]);

  // Load community requests from server if reachable
  useEffect(() => {
    fetch('/api/recipe-requests')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.requests?.length) {
          setCommunityRequests(data.requests);
        }
      })
      .catch(() => {
        // use default state
      });
  }, []);

  // Hash-based URL syncing for direct linking to recipe pages
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/recipe/')) {
        const slug = hash.replace('#/recipe/', '');
        const found = [...INITIAL_RECIPES, ...userProfile.customRecipes].find(
          (r) => r.slug === slug || r.id === slug
        );
        if (found) {
          setSelectedRecipe(found);
          setActiveView('recipe-detail');
        }
      } else if (hash === '#/profile') {
        setActiveView('profile');
      } else if (hash === '#/requests') {
        setActiveView('requests');
      } else if (!hash || hash === '#/' || hash === '#') {
        if (activeView !== 'home') setActiveView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [userProfile.customRecipes]);

  const allRecipes = [...INITIAL_RECIPES, ...userProfile.customRecipes];

  const favorites = allRecipes.filter((r) => userProfile.favoriteIds.includes(r.id));

  const toggleFavorite = (recipeId: string) => {
    setUserProfile((prev) => {
      const exists = prev.favoriteIds.includes(recipeId);
      const updated = exists
        ? prev.favoriteIds.filter((id) => id !== recipeId)
        : [...prev.favoriteIds, recipeId];
      return { ...prev, favoriteIds: updated };
    });
  };

  const isFavorite = (recipeId: string) => {
    return userProfile.favoriteIds.includes(recipeId);
  };

  const openRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('recipe-detail');
    window.location.hash = `#/recipe/${recipe.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
    setActiveView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToGroceryList = (recipe: Recipe, ingredientNames?: string[]) => {
    const itemsToAdd = (ingredientNames
      ? recipe.ingredients.filter((i) => ingredientNames.includes(i.name))
      : recipe.ingredients
    ).map((i) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      item: i.name,
      amount: `${i.quantity} ${i.unit}`,
      recipeTitle: recipe.title,
      checked: false,
    }));

    setUserProfile((prev) => ({
      ...prev,
      groceryList: [...prev.groceryList, ...itemsToAdd],
    }));
  };

  const toggleGroceryItem = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      groceryList: prev.groceryList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const removeGroceryItem = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      groceryList: prev.groceryList.filter((item) => item.id !== id),
    }));
  };

  const clearCompletedGroceryItems = () => {
    setUserProfile((prev) => ({
      ...prev,
      groceryList: prev.groceryList.filter((item) => !item.checked),
    }));
  };

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...partial }));
  };

  const addCustomRecipe = (recipe: Recipe) => {
    setUserProfile((prev) => ({
      ...prev,
      customRecipes: [recipe, ...prev.customRecipes],
      favoriteIds: [...prev.favoriteIds, recipe.id],
    }));
    openRecipeDetail(recipe);
  };

  const submitRecipeRequest = async (dishName: string, cuisine: string, notes: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/recipe-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName,
          cuisine,
          notes,
          requestedBy: userProfile.name || 'Passionate Cook',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.request) {
          setCommunityRequests((prev) => [data.request, ...prev]);
          return true;
        }
      }
    } catch {
      // offline fallback
      const localReq: CommunityRecipeRequest = {
        id: `req-${Date.now()}`,
        dishName,
        cuisine,
        notes,
        requestedBy: userProfile.name || 'Passionate Cook',
        votes: 1,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'In Development',
      };
      setCommunityRequests((prev) => [localReq, ...prev]);
      return true;
    }
    return false;
  };

  const voteRecipeRequest = async (id: string) => {
    try {
      await fetch(`/api/recipe-requests/${id}/vote`, { method: 'POST' });
    } catch {
      // continue local state update
    }
    setCommunityRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, votes: req.votes + 1 } : req))
    );
  };

  const addCookingNote = (recipeId: string, text: string, rating: number) => {
    const newNote: CookingNote = {
      id: `note-${Date.now()}`,
      recipeId,
      rating,
      text,
      date: new Date().toISOString().split('T')[0],
      user: userProfile.name || 'Home Cook',
    };
    setCookingNotes((prev) => [newNote, ...prev]);
  };

  const continueAsGuest = () => {
    try {
      localStorage.setItem('savory_auth_completed', 'guest');
    } catch {}
    setUserProfile((prev) => ({
      ...prev,
      isGuest: true,
      name: prev.name && prev.name !== 'Guest Gourmet' ? prev.name : 'Guest Gourmet',
    }));
    setIsAuthModalOpen(false);
  };

  const createAccount = (data: {
    name: string;
    email: string;
    password?: string;
    skillLevel?: 'Beginner Cook' | 'Enthusiastic Foodie' | 'Home Gourmet' | 'Seasoned Chef';
    dietaryPreferences?: string[];
  }) => {
    try {
      localStorage.setItem('savory_auth_completed', 'authenticated');
      const usersRaw = localStorage.getItem('savory_registered_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      users.push({
        name: data.name,
        email: data.email,
        password: data.password || 'artisan123',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('savory_registered_users', JSON.stringify(users));
    } catch {}

    setUserProfile((prev) => ({
      ...prev,
      name: data.name,
      email: data.email,
      avatarSeed: data.name,
      skillLevel: data.skillLevel || prev.skillLevel,
      dietaryPreferences: data.dietaryPreferences || prev.dietaryPreferences,
      isGuest: false,
    }));
    setIsAuthModalOpen(false);
  };

  const signIn = (email: string, password?: string): boolean => {
    try {
      localStorage.setItem('savory_auth_completed', 'authenticated');
      const usersRaw = localStorage.getItem('savory_registered_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUserProfile((prev) => ({
          ...prev,
          name: found.name,
          email: found.email,
          avatarSeed: found.name,
          isGuest: false,
        }));
        setIsAuthModalOpen(false);
        return true;
      }
    } catch {}

    const inferredName = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
    setUserProfile((prev) => ({
      ...prev,
      name: formattedName || 'Artisan Cook',
      email: email,
      avatarSeed: formattedName,
      isGuest: false,
    }));
    setIsAuthModalOpen(false);
    return true;
  };

  const signOut = () => {
    try {
      localStorage.removeItem('savory_auth_completed');
    } catch {}
    setUserProfile((prev) => ({
      ...prev,
      name: 'Guest Gourmet',
      email: '',
      isGuest: true,
    }));
    setAuthModalMode('onboarding');
    setIsAuthModalOpen(true);
  };

  const openAuthModal = (mode: AuthModalMode = 'onboarding') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    const completed = localStorage.getItem('savory_auth_completed');
    if (!completed) {
      try {
        localStorage.setItem('savory_auth_completed', 'guest');
      } catch {}
      setUserProfile((prev) => ({ ...prev, isGuest: true }));
    }
    setIsAuthModalOpen(false);
  };

  // Filtered recipe list
  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesQuery =
      searchQuery === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || recipe.category === selectedCategory;

    const matchesCuisine =
      selectedCuisine === 'All' || recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase();

    return matchesQuery && matchesCategory && matchesCuisine;
  });

  return (
    <RecipeContext.Provider
      value={{
        recipes: filteredRecipes,
        allRecipes,
        favorites,
        selectedRecipe,
        activeView,
        searchQuery,
        selectedCategory,
        selectedCuisine,
        userProfile,
        communityRequests,
        cookingNotes,
        isRecommendationOpen,
        isGuest: !!userProfile.isGuest,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        continueAsGuest,
        createAccount,
        signIn,
        signOut,
        setSearchQuery,
        setSelectedCategory,
        setSelectedCuisine,
        openRecipeDetail,
        closeRecipeDetail,
        setActiveView,
        toggleFavorite,
        isFavorite,
        addToGroceryList,
        toggleGroceryItem,
        removeGroceryItem,
        clearCompletedGroceryItems,
        updateUserProfile,
        addCustomRecipe,
        submitRecipeRequest,
        voteRecipeRequest,
        addCookingNote,
        setIsRecommendationOpen,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
