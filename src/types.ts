export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  category?: 'Produce' | 'Pantry' | 'Meat & Seafood' | 'Dairy & Refrigerated' | 'Spices & Herbs' | 'Bakery';
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  detail: string;
  tip?: string;
  timerMinutes?: number;
}

export interface VideoTutorial {
  title: string;
  youtubeId: string;
  embedUrl: string;
  searchUrl: string;
  channelName: string;
  duration: string;
}

export interface DetailedNutritionBreakdown {
  // Lipids & Fats breakdown
  saturatedFat?: string;
  transFat?: string;
  polyunsaturatedFat?: string;
  monounsaturatedFat?: string;

  // Cholesterol & Electrolytes
  cholesterol?: string;
  sodium?: string;
  potassium?: string;

  // Carbohydrate breakdown
  dietaryFiber?: string;
  sugars?: string;
  addedSugars?: string;

  // Essential Micronutrients & Minerals
  calcium?: string;
  iron?: string;
  vitaminD?: string;
  vitaminA?: string;
  vitaminC?: string;
}

export interface DailyValues {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  saturatedFat?: number;
  cholesterol?: number;
  sodium?: number;
  fiber?: number;
  sugars?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminD?: number;
}

export interface NutritionInfo {
  calories: number;
  servingSize?: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  // Extended per-serving breakdown fields
  sugar?: string;
  saturatedFat?: string;
  transFat?: string;
  unsaturatedFat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  calcium?: string;
  iron?: string;
  vitaminD?: string;
  // Nested structured breakdown
  breakdown?: DetailedNutritionBreakdown;
  // Percentage of standard 2,000 calorie daily reference values
  dailyValues?: DailyValues;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Pasta & Noodles' | 'Main Course' | 'Seafood' | 'Soups & Stews' | 'Baking & Desserts' | 'Vegetarian & Bowls' | 'Street Food & Tacos';
  cuisine: string;
  prepTime: string;
  cookTime: string;
  totalMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Intermediate' | 'Mastery';
  rating: number;
  reviewCount: number;
  image: string;
  dietary: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  videoTutorial: VideoTutorial;
  chefNotes: string;
  nutrition: NutritionInfo;
  isCustom?: boolean;
}

export interface AuthSession {
  status: 'authenticated' | 'guest';
  isGuest: boolean;
  name: string;
  email: string;
  createdAt: string;
}

export type AuthModalMode = 'onboarding' | 'register' | 'login';

export interface UserProfile {
  name: string;
  email: string;
  avatarSeed: string;
  bio: string;
  skillLevel: 'Beginner Cook' | 'Enthusiastic Foodie' | 'Home Gourmet' | 'Seasoned Chef';
  favoriteIds: string[];
  cookedHistoryIds: string[];
  dietaryPreferences: string[];
  isGuest?: boolean;
  groceryList: {
    id: string;
    item: string;
    amount: string;
    recipeTitle: string;
    checked: boolean;
  }[];
  customRecipes: Recipe[];
}

export interface CommunityRecipeRequest {
  id: string;
  dishName: string;
  cuisine: string;
  notes: string;
  requestedBy: string;
  votes: number;
  createdAt: string;
  status: 'Testing' | 'In Development' | 'Published';
}

export interface CookingNote {
  id: string;
  recipeId: string;
  rating: number;
  text: string;
  date: string;
  user: string;
}
