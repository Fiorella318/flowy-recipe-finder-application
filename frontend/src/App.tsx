import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import RecipeSearchForm from './components/RecipeSearchForm';
import RecipeResults from './components/RecipeResults';
import RecipeDetail from './components/RecipeDetail';
import WelcomeModal from './components/WelcomeModal';
import { useGetSampleRecipes } from './hooks/useQueries';
import { Heart } from 'lucide-react';
import type { Recipe as BackendRecipe } from './backend';

const queryClient = new QueryClient();

export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface SearchPreferences {
  ingredients: Ingredient[];
  tastePreference: 'salty' | 'sweet' | '';
  additionalPreferences: string;
  timeAvailable?: number;
}

export interface Recipe {
  title: string;
  image: string;
  cookingTime: number;
  ingredients: Array<{ name: string; quantity?: string }>;
  instructions: string;
  servings?: number;
  matchScore?: number;
  ingredientMatchPercentage?: number;
  hasDirectMatch?: boolean;
  perfectMatch?: boolean;
  actualScore?: number;
  preferenceAlignment?: string;
}

function AppContent() {
  const [searchPreferences, setSearchPreferences] = useState<SearchPreferences>({
    ingredients: [],
    tastePreference: '',
    additionalPreferences: '',
    timeAvailable: undefined,
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { data: backendRecipes = [] } = useGetSampleRecipes();

  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('flowy-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('flowy-welcome-seen', 'true');
  };

  // Convert backend recipes to frontend format
  const convertBackendRecipes = (backendRecipes: BackendRecipe[]): Recipe[] => {
    return backendRecipes.map(recipe => ({
      title: recipe.title,
      image: recipe.image,
      cookingTime: Number(recipe.cookingTime), // Convert bigint to number
      ingredients: recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity
      })),
      instructions: recipe.instructions,
      servings: 4 // Default servings since backend doesn't provide this
    }));
  };

  // Enhanced recipe database with comprehensive recipe collection
  const getEnhancedRecipes = (baseRecipes: Recipe[], userIngredients: Ingredient[]): Recipe[] => {
    const enhancedRecipes = [...baseRecipes];
    
    // Expanded recipe database optimized for flexible ingredient matching
    const additionalRecipes: Recipe[] = [
      // LIQUID RECIPES - Sweet
      {
        title: "Strawberry Milk Smoothie",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
        cookingTime: 5,
        ingredients: [
          { name: "strawberries", quantity: "1 cup fresh" },
          { name: "milk", quantity: "1 cup" },
          { name: "sugar", quantity: "2 tbsp" }
        ],
        instructions: "1. Wash and hull fresh strawberries. 2. Add strawberries, milk, and sugar to blender. 3. Blend until smooth and creamy. 4. Add ice and blend again until frothy. 5. Pour into glasses and serve immediately.",
        servings: 2
      },
      {
        title: "Fresh Strawberry Juice",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
        cookingTime: 10,
        ingredients: [
          { name: "strawberries", quantity: "2 cups fresh" },
          { name: "sugar", quantity: "3 tbsp" },
          { name: "water", quantity: "1/2 cup" }
        ],
        instructions: "1. Wash and hull strawberries thoroughly. 2. Blend strawberries with sugar until smooth. 3. Strain through fine mesh to remove seeds if desired. 4. Add water to taste. 5. Stir well and chill. 6. Serve over ice in tall glasses.",
        servings: 2
      },
      {
        title: "Creamy Vanilla Milkshake",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
        cookingTime: 5,
        ingredients: [
          { name: "milk", quantity: "1 cup" },
          { name: "sugar", quantity: "2 tbsp" }
        ],
        instructions: "1. Add milk and sugar to blender. 2. Blend until smooth and creamy. 3. Adjust sweetness with more sugar if needed. 4. Pour into tall glasses. 5. Serve immediately with straws.",
        servings: 2
      },

      // LIQUID RECIPES - Salty
      {
        title: "Creamy Tomato Soup",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        cookingTime: 25,
        ingredients: [
          { name: "tomatoes", quantity: "4 large" },
          { name: "onion", quantity: "1 medium" },
          { name: "garlic", quantity: "2 cloves" }
        ],
        instructions: "1. Sauté onion and garlic until soft. 2. Add tomatoes and simmer 15 minutes. 3. Blend until smooth. 4. Season with salt and pepper. 5. Serve hot with crusty bread.",
        servings: 4
      },
      {
        title: "Simple Chicken Broth",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        cookingTime: 45,
        ingredients: [
          { name: "chicken", quantity: "2 lbs bones" },
          { name: "vegetables", quantity: "2 cups mixed" },
          { name: "water", quantity: "8 cups" }
        ],
        instructions: "1. Place chicken bones in large pot. 2. Add vegetables. 3. Cover with water and bring to boil. 4. Simmer 45 minutes, skimming foam. 5. Strain and serve hot.",
        servings: 6
      },

      // CRUNCHY RECIPES - Sweet
      {
        title: "Simple Sugar Cookies",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
        cookingTime: 30,
        ingredients: [
          { name: "flour", quantity: "2 cups" },
          { name: "butter", quantity: "1 cup" },
          { name: "sugar", quantity: "3/4 cup" },
          { name: "eggs", quantity: "1 large" }
        ],
        instructions: "1. Preheat oven to 375°F. 2. Cream butter and sugar. 3. Beat in egg. 4. Mix in flour gradually. 5. Drop on baking sheets and bake 9-11 minutes until golden and crunchy.",
        servings: 24
      },
      {
        title: "Crunchy Granola",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
        cookingTime: 35,
        ingredients: [
          { name: "oats", quantity: "2 cups" },
          { name: "nuts", quantity: "1 cup mixed" },
          { name: "sugar", quantity: "1/4 cup" },
          { name: "butter", quantity: "1/4 cup" }
        ],
        instructions: "1. Preheat oven to 350°F. 2. Mix oats and nuts. 3. Heat sugar and butter until melted. 4. Combine wet and dry ingredients. 5. Press into pan and bake 25 minutes until golden and crunchy.",
        servings: 12
      },

      // CRUNCHY RECIPES - Salty
      {
        title: "Crispy Fried Chicken",
        image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop",
        cookingTime: 40,
        ingredients: [
          { name: "chicken", quantity: "8 pieces" },
          { name: "flour", quantity: "2 cups" },
          { name: "eggs", quantity: "2 large" },
          { name: "oil", quantity: "for frying" }
        ],
        instructions: "1. Season chicken with salt and pepper. 2. Dredge in flour, dip in beaten eggs. 3. Fry in hot oil until golden and extra crunchy. 4. Drain on paper towels. 5. Serve hot and crispy.",
        servings: 4
      },
      {
        title: "Roasted Garlic Potatoes",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
        cookingTime: 45,
        ingredients: [
          { name: "potatoes", quantity: "2 lbs" },
          { name: "garlic", quantity: "4 cloves" },
          { name: "oil", quantity: "3 tbsp" }
        ],
        instructions: "1. Preheat oven to 425°F. 2. Cut potatoes into chunks. 3. Toss with minced garlic and oil. 4. Roast 35-45 minutes until golden and crunchy outside. 5. Season with salt and serve hot.",
        servings: 6
      },

      // FLUFFY RECIPES - Sweet
      {
        title: "Extra Fluffy Pancakes",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        cookingTime: 20,
        ingredients: [
          { name: "flour", quantity: "1 cup" },
          { name: "milk", quantity: "1 cup" },
          { name: "eggs", quantity: "1 large" },
          { name: "sugar", quantity: "2 tbsp" }
        ],
        instructions: "1. Mix dry ingredients in large bowl. 2. Whisk milk and egg separately. 3. Gently fold wet into dry ingredients for extra fluffy texture. 4. Cook on griddle until bubbles form. 5. Flip and cook until golden and fluffy.",
        servings: 4
      },
      {
        title: "Fluffy Vanilla Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        cookingTime: 45,
        ingredients: [
          { name: "flour", quantity: "2 cups" },
          { name: "sugar", quantity: "1 1/2 cups" },
          { name: "eggs", quantity: "3 large" },
          { name: "milk", quantity: "1 cup" },
          { name: "butter", quantity: "1/2 cup" }
        ],
        instructions: "1. Preheat oven to 350°F. 2. Cream butter and sugar until fluffy. 3. Beat in eggs one at a time. 4. Alternate flour and milk. 5. Pour into pans and bake 25-30 minutes until fluffy and golden.",
        servings: 12
      },

      // FLUFFY RECIPES - Salty
      {
        title: "Fluffy Dinner Rolls",
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
        cookingTime: 60,
        ingredients: [
          { name: "flour", quantity: "3 cups" },
          { name: "milk", quantity: "1 cup warm" },
          { name: "sugar", quantity: "2 tbsp" },
          { name: "butter", quantity: "1/4 cup" }
        ],
        instructions: "1. Mix warm milk with sugar. 2. Mix with flour and butter. 3. Knead until smooth. 4. Rise 1 hour. 5. Shape into rolls and rise 30 minutes. 6. Bake until fluffy and golden.",
        servings: 12
      },
      {
        title: "Fluffy Rice Pilaf",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
        cookingTime: 25,
        ingredients: [
          { name: "rice", quantity: "1 cup long grain" },
          { name: "onion", quantity: "1 small diced" },
          { name: "butter", quantity: "2 tbsp" }
        ],
        instructions: "1. Sauté onion in butter. 2. Add rice and toast 2 minutes. 3. Add water and bring to boil. 4. Cover and simmer 18 minutes. 5. Fluff with fork and serve fluffy and light.",
        servings: 4
      },

      // Simple combination recipes for common ingredients
      {
        title: "Garlic Butter Rice",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
        cookingTime: 25,
        ingredients: [
          { name: "rice", quantity: "1 cup" },
          { name: "garlic", quantity: "3 cloves minced" },
          { name: "butter", quantity: "3 tbsp" }
        ],
        instructions: "1. Cook rice according to package directions. 2. In large pan, melt butter and sauté garlic until fragrant. 3. Add cooked rice and toss to coat. 4. Season with salt. 5. Serve hot as perfect side dish.",
        servings: 4
      },
      {
        title: "Meat and Rice Bowl",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
        cookingTime: 35,
        ingredients: [
          { name: "meat", quantity: "1 lb ground" },
          { name: "rice", quantity: "1 cup" },
          { name: "garlic", quantity: "2 cloves" }
        ],
        instructions: "1. Cook rice until fluffy. 2. Brown meat in large skillet. 3. Add minced garlic, cook until fragrant. 4. Season with salt and pepper. 5. Serve meat over rice in bowls.",
        servings: 4
      },
      {
        title: "Garlic Herb Bread",
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
        cookingTime: 20,
        ingredients: [
          { name: "bread", quantity: "1 loaf" },
          { name: "butter", quantity: "1/2 cup softened" },
          { name: "garlic", quantity: "4 cloves minced" }
        ],
        instructions: "1. Preheat oven to 375°F. 2. Mix softened butter with minced garlic. 3. Slice bread and spread garlic butter mixture generously. 4. Wrap in foil and bake 15 minutes. 5. Unwrap and bake 5 more minutes until golden.",
        servings: 6
      },
      {
        title: "Scrambled Eggs with Butter",
        image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop",
        cookingTime: 10,
        ingredients: [
          { name: "eggs", quantity: "6 large" },
          { name: "butter", quantity: "2 tbsp" },
          { name: "milk", quantity: "2 tbsp" }
        ],
        instructions: "1. Crack eggs into bowl and whisk with milk. 2. Heat butter in non-stick pan over medium-low heat. 3. Pour in eggs and gently stir continuously. 4. Cook until just set and creamy. 5. Season with salt and pepper.",
        servings: 3
      },
      {
        title: "Buttered Toast",
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop",
        cookingTime: 5,
        ingredients: [
          { name: "bread", quantity: "4 slices" },
          { name: "butter", quantity: "4 tbsp" }
        ],
        instructions: "1. Toast bread slices until golden brown. 2. Spread butter generously on warm toast. 3. Serve immediately while butter is melting.",
        servings: 2
      },
      {
        title: "Simple Tomato Salad",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
        cookingTime: 10,
        ingredients: [
          { name: "tomatoes", quantity: "4 large" },
          { name: "onion", quantity: "1 small" },
          { name: "oil", quantity: "2 tbsp olive" }
        ],
        instructions: "1. Slice tomatoes and onion thinly. 2. Arrange on serving plate. 3. Drizzle with olive oil. 4. Season with salt and pepper. 5. Let sit 5 minutes before serving.",
        servings: 4
      }
    ];
    
    enhancedRecipes.push(...additionalRecipes);
    return enhancedRecipes;
  };

  const handleSearch = async (preferences: SearchPreferences) => {
    setIsSearching(true);
    setSearchPreferences(preferences);
    
    try {
      // Convert backend recipes to frontend format
      const frontendRecipes = convertBackendRecipes(backendRecipes);
      // Get enhanced recipe collection
      const enhancedRecipes = getEnhancedRecipes(frontendRecipes, preferences.ingredients);
      // Apply flexible recipe selection logic that always returns 3 recipes
      const matchedRecipes = getFlexibleRecipeMatches(enhancedRecipes, preferences);
      setRecipes(matchedRecipes);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Flexible recipe matching logic that ensures exactly 3 recipes are always returned
  const getFlexibleRecipeMatches = (allRecipes: Recipe[], preferences: SearchPreferences): Recipe[] => {
    if (allRecipes.length === 0 || preferences.ingredients.length === 0) {
      // If no ingredients provided, return 3 random recipes
      return allRecipes.slice(0, 3).map(recipe => ({
        ...recipe,
        matchScore: 50,
        ingredientMatchPercentage: 0.5
      }));
    }
    
    // First, filter by taste preference
    let filteredRecipes = allRecipes;
    if (preferences.tastePreference === 'sweet') {
      filteredRecipes = allRecipes.filter(recipe => isDessert(recipe));
    } else if (preferences.tastePreference === 'salty') {
      filteredRecipes = allRecipes.filter(recipe => !isDessert(recipe));
    }
    
    // Calculate ingredient match scores for all recipes
    const scoredRecipes = filteredRecipes.map(recipe => {
      const ingredientMatchData = calculateIngredientMatch(recipe, preferences.ingredients);
      const preferenceScore = preferences.additionalPreferences.trim() 
        ? calculateAdditionalPreferencesMatch(recipe, preferences.additionalPreferences, preferences.tastePreference)
        : 0;
      
      // Calculate total score with ingredient match as primary factor (80% weight)
      let totalScore = ingredientMatchData.matchPercentage * 80;
      totalScore += preferenceScore * 15; // Preference alignment
      
      // Time preference bonus (5% weight)
      if (preferences.timeAvailable && recipe.cookingTime <= preferences.timeAvailable) {
        totalScore += 5;
      }
      
      return {
        ...recipe,
        matchScore: Math.round(ingredientMatchData.matchPercentage * 100),
        ingredientMatchPercentage: ingredientMatchData.matchPercentage,
        hasDirectMatch: ingredientMatchData.hasDirectMatch,
        perfectMatch: ingredientMatchData.matchPercentage >= 1.0,
        actualScore: totalScore,
        preferenceAlignment: getPreferenceAlignment(recipe, preferences)
      };
    });

    // Sort by quality: perfect matches first, then by ingredient match percentage, then by preference alignment
    const sortedRecipes = scoredRecipes.sort((a, b) => {
      // 1. Perfect matches first (100% ingredient match)
      if (a.perfectMatch && !b.perfectMatch) return -1;
      if (!a.perfectMatch && b.perfectMatch) return 1;
      
      // 2. Higher ingredient match percentage
      const aIngredientMatch = a.ingredientMatchPercentage || 0;
      const bIngredientMatch = b.ingredientMatchPercentage || 0;
      if (Math.abs(aIngredientMatch - bIngredientMatch) > 0.01) {
        return bIngredientMatch - aIngredientMatch;
      }
      
      // 3. Preference alignment (if additional preferences specified)
      if (preferences.additionalPreferences.trim()) {
        const aPreferenceScore = calculateAdditionalPreferencesMatch(a, preferences.additionalPreferences, preferences.tastePreference);
        const bPreferenceScore = calculateAdditionalPreferencesMatch(b, preferences.additionalPreferences, preferences.tastePreference);
        if (Math.abs(aPreferenceScore - bPreferenceScore) > 0.1) {
          return bPreferenceScore - aPreferenceScore;
        }
      }
      
      // 4. Time preference
      if (preferences.timeAvailable) {
        const aTimeMatch = a.cookingTime <= preferences.timeAvailable;
        const bTimeMatch = b.cookingTime <= preferences.timeAvailable;
        if (aTimeMatch && !bTimeMatch) return -1;
        if (!aTimeMatch && bTimeMatch) return 1;
      }
      
      // 5. Overall score
      return (b.actualScore || 0) - (a.actualScore || 0);
    });

    // Apply flexible selection to ensure exactly 3 recipes
    return selectExactlyThreeRecipes(sortedRecipes, preferences);
  };

  // Select exactly 3 recipes using flexible criteria
  const selectExactlyThreeRecipes = (sortedRecipes: Recipe[], preferences: SearchPreferences): Recipe[] => {
    if (sortedRecipes.length === 0) {
      // Fallback: return any 3 recipes if no matches found
      return preferences.tastePreference === 'sweet' 
        ? [
            { title: "Simple Sugar Cookies", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop", cookingTime: 30, ingredients: [{ name: "flour" }, { name: "sugar" }, { name: "butter" }], instructions: "Basic cookie recipe", servings: 12, matchScore: 30, ingredientMatchPercentage: 0.3 },
            { title: "Vanilla Milkshake", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop", cookingTime: 5, ingredients: [{ name: "milk" }, { name: "sugar" }], instructions: "Blend ingredients", servings: 2, matchScore: 25, ingredientMatchPercentage: 0.25 },
            { title: "Fluffy Pancakes", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", cookingTime: 20, ingredients: [{ name: "flour" }, { name: "milk" }, { name: "eggs" }], instructions: "Mix and cook", servings: 4, matchScore: 35, ingredientMatchPercentage: 0.35 }
          ]
        : [
            { title: "Simple Tomato Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop", cookingTime: 25, ingredients: [{ name: "tomatoes" }, { name: "onion" }], instructions: "Cook and blend", servings: 4, matchScore: 40, ingredientMatchPercentage: 0.4 },
            { title: "Garlic Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop", cookingTime: 25, ingredients: [{ name: "rice" }, { name: "garlic" }], instructions: "Cook rice, add garlic", servings: 4, matchScore: 35, ingredientMatchPercentage: 0.35 },
            { title: "Scrambled Eggs", image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop", cookingTime: 10, ingredients: [{ name: "eggs" }, { name: "butter" }], instructions: "Scramble eggs with butter", servings: 2, matchScore: 30, ingredientMatchPercentage: 0.3 }
          ];
    }

    // Try different match thresholds to ensure we get exactly 3 recipes
    const thresholds = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0];
    
    for (const threshold of thresholds) {
      const candidateRecipes = sortedRecipes.filter(recipe => 
        (recipe.ingredientMatchPercentage || 0) >= threshold
      );
      
      if (candidateRecipes.length >= 3) {
        // We have enough recipes at this threshold
        const selectedRecipes: Recipe[] = [];
        
        // Always include the best perfect match if available
        const perfectMatches = candidateRecipes.filter(r => r.perfectMatch);
        if (perfectMatches.length > 0) {
          selectedRecipes.push(perfectMatches[0]);
        }
        
        // Fill remaining slots with best available recipes, avoiding duplicates
        const remainingRecipes = candidateRecipes.filter(r => 
          !selectedRecipes.some(selected => selected.title === r.title)
        );
        
        // Add up to 2 more recipes (or 3 if no perfect match was added)
        const slotsToFill = 3 - selectedRecipes.length;
        selectedRecipes.push(...remainingRecipes.slice(0, slotsToFill));
        
        // Ensure match scores reflect the actual threshold used
        return selectedRecipes.map(recipe => ({
          ...recipe,
          matchScore: Math.max(recipe.matchScore || 0, Math.round(threshold * 100))
        }));
      }
    }
    
    // Final fallback: take the top 3 recipes regardless of match score
    const finalSelection = sortedRecipes.slice(0, 3);
    if (finalSelection.length < 3) {
      // Pad with generic recipes if needed
      const genericRecipes = [
        { title: "Basic Recipe 1", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", cookingTime: 30, ingredients: [{ name: "common ingredients" }], instructions: "Simple cooking method", servings: 4, matchScore: 20, ingredientMatchPercentage: 0.2 },
        { title: "Basic Recipe 2", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", cookingTime: 25, ingredients: [{ name: "basic ingredients" }], instructions: "Easy preparation", servings: 4, matchScore: 15, ingredientMatchPercentage: 0.15 },
        { title: "Basic Recipe 3", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", cookingTime: 20, ingredients: [{ name: "simple ingredients" }], instructions: "Quick cooking", servings: 4, matchScore: 10, ingredientMatchPercentage: 0.1 }
      ];
      
      while (finalSelection.length < 3) {
        finalSelection.push(genericRecipes[finalSelection.length]);
      }
    }
    
    return finalSelection;
  };

  // Enhanced ingredient matching that's more flexible
  const calculateIngredientMatch = (recipe: Recipe, userIngredients: Ingredient[]) => {
    if (userIngredients.length === 0) {
      return { matchPercentage: 0.5, hasDirectMatch: false, matchedCount: 0 };
    }
    
    const recipeIngredients = recipe.ingredients.map(ing => normalizeIngredient(ing.name));
    let matchedCount = 0;
    let hasDirectMatch = false;
    
    userIngredients.forEach(userIng => {
      const normalizedUserIng = normalizeIngredient(userIng.name);
      
      // Check for exact matches or variations
      const hasMatch = recipeIngredients.some(recipeIng => 
        isIngredientMatch(normalizedUserIng, recipeIng)
      );
      
      if (hasMatch) {
        matchedCount++;
        hasDirectMatch = true;
      }
    });
    
    // Calculate match percentage - more generous than strict matching
    const matchPercentage = matchedCount / userIngredients.length;
    
    return {
      matchPercentage,
      hasDirectMatch,
      matchedCount
    };
  };

  // More flexible ingredient matching function
  const isIngredientMatch = (userIngredient: string, recipeIngredient: string): boolean => {
    // Direct exact matches
    if (userIngredient === recipeIngredient) return true;
    if (userIngredient.includes(recipeIngredient) || recipeIngredient.includes(userIngredient)) return true;
    
    // Check comprehensive variations
    const userVariations = getIngredientVariations(userIngredient);
    const recipeVariations = getIngredientVariations(recipeIngredient);
    
    return userVariations.some(uVar => 
      recipeVariations.some(rVar => uVar === rVar || uVar.includes(rVar) || rVar.includes(uVar))
    );
  };

  // Get comprehensive variations of an ingredient
  const getIngredientVariations = (ingredient: string): string[] => {
    const base = ingredient.replace(/s$/, ''); // Remove plural
    const variations = [ingredient, base];
    
    // Comprehensive variation mapping
    const variationMap: { [key: string]: string[] } = {
      'tomato': ['tomato', 'tomatoes'],
      'potato': ['potato', 'potatoes'],
      'onion': ['onion', 'onions'],
      'garlic': ['garlic', 'garlic clove', 'garlic cloves'],
      'egg': ['egg', 'eggs'],
      'chicken': ['chicken', 'chicken breast', 'chicken pieces', 'poultry'],
      'beef': ['beef', 'ground beef'],
      'pork': ['pork', 'ground pork'],
      'meat': ['meat', 'beef', 'pork', 'chicken', 'ground beef', 'ground pork', 'ground meat'],
      'milk': ['milk', 'whole milk', 'skim milk'],
      'flour': ['flour', 'all purpose flour', 'wheat flour'],
      'sugar': ['sugar', 'white sugar', 'granulated sugar'],
      'oil': ['oil', 'cooking oil', 'vegetable oil', 'olive oil'],
      'butter': ['butter', 'unsalted butter', 'salted butter'],
      'cheese': ['cheese', 'parmesan cheese', 'cheddar cheese'],
      'bread': ['bread', 'loaf', 'bread loaf'],
      'rice': ['rice', 'white rice', 'long grain rice'],
      'vegetables': ['vegetables', 'veggies', 'vegetable', 'mixed vegetables'],
      'pasta': ['pasta', 'spaghetti', 'noodles'],
      'strawberry': ['strawberry', 'strawberries'],
      'nuts': ['nuts', 'mixed nuts', 'roasted nuts'],
      'oats': ['oats', 'rolled oats', 'oat']
    };
    
    // Find matching variations
    Object.entries(variationMap).forEach(([key, vars]) => {
      if (vars.some(v => ingredient.includes(v) || v.includes(ingredient))) {
        variations.push(...vars);
      }
    });
    
    return [...new Set(variations)];
  };

  // Calculate additional preferences match
  const calculateAdditionalPreferencesMatch = (recipe: Recipe, additionalPreferences: string, tastePreference: string): number => {
    const title = recipe.title.toLowerCase();
    const instructions = recipe.instructions.toLowerCase();
    const preferences = additionalPreferences.toLowerCase();
    
    let matchScore = 0;
    const preferenceTerms = preferences.split(/[,\s]+/).filter(term => term.length > 2);
    
    preferenceTerms.forEach(term => {
      // Direct matches
      if (title.includes(term) || instructions.includes(term)) {
        matchScore += 1.0;
      } else {
        // Creative interpretation matches
        const creativeMatches = getCreativePreferenceMatches(term, tastePreference);
        creativeMatches.forEach(match => {
          if (title.includes(match) || instructions.includes(match)) {
            matchScore += 0.8;
          }
        });
      }
    });
    
    return Math.min(matchScore / Math.max(preferenceTerms.length, 1), 1.0);
  };

  // Get creative preference matches
  const getCreativePreferenceMatches = (term: string, tastePreference: string): string[] => {
    const creativeMap: { [key: string]: { sweet: string[], salty: string[] } } = {
      'liquid': {
        sweet: ['smoothie', 'juice', 'milkshake', 'drink'],
        salty: ['soup', 'broth', 'stew']
      },
      'crunchy': {
        sweet: ['cookie', 'granola', 'crispy'],
        salty: ['fried', 'crispy', 'roasted', 'crunchy']
      },
      'fluffy': {
        sweet: ['cake', 'pancake', 'fluffy'],
        salty: ['bread', 'roll', 'fluffy', 'rice']
      },
      'crispy': {
        sweet: ['cookie', 'pastry', 'crispy'],
        salty: ['fried', 'roasted', 'crispy']
      }
    };
    
    const termMapping = creativeMap[term];
    if (!termMapping) return [term];
    
    if (tastePreference === 'sweet') {
      return termMapping.sweet;
    } else if (tastePreference === 'salty') {
      return termMapping.salty;
    } else {
      return [...termMapping.sweet, ...termMapping.salty];
    }
  };

  // Get preference alignment description for display
  const getPreferenceAlignment = (recipe: Recipe, preferences: SearchPreferences): string => {
    if (!preferences.additionalPreferences.trim()) return '';
    
    const title = recipe.title.toLowerCase();
    const instructions = recipe.instructions.toLowerCase();
    const additionalPrefs = preferences.additionalPreferences.toLowerCase();
    
    const preferenceTerms = additionalPrefs.split(/[,\s]+/).filter(term => term.length > 2);
    const alignedTerms: string[] = [];
    
    preferenceTerms.forEach(term => {
      if (title.includes(term) || instructions.includes(term)) {
        alignedTerms.push(term);
      } else {
        const creativeMatches = getCreativePreferenceMatches(term, preferences.tastePreference);
        creativeMatches.forEach(match => {
          if (title.includes(match) || instructions.includes(match)) {
            alignedTerms.push(term);
          }
        });
      }
    });
    
    return alignedTerms.length > 0 ? `Matches: ${alignedTerms.join(', ')}` : '';
  };

  // Check if recipe is a dessert or sweet recipe
  const isDessert = (recipe: Recipe): boolean => {
    const title = recipe.title.toLowerCase();
    const instructions = recipe.instructions.toLowerCase();
    const ingredients = recipe.ingredients.map(ing => ing.name.toLowerCase()).join(' ');
    
    const sweetKeywords = [
      'cookie', 'cake', 'cupcake', 'dessert', 'sweet', 'chocolate', 
      'pudding', 'pie', 'tart', 'ice cream', 'candy', 'frosting', 'pancake',
      'smoothie', 'milkshake', 'juice', 'granola', 'vanilla', 'sugar',
      'honey', 'syrup', 'berry', 'strawberry', 'fruit'
    ];
    
    const savoryKeywords = [
      'soup', 'broth', 'chicken', 'meat', 'beef', 'pork', 'fish',
      'vegetable', 'tomato', 'garlic', 'onion', 'herb', 'salt',
      'pepper', 'soy sauce', 'bread', 'roll', 'rice', 'pasta'
    ];
    
    const sweetCount = sweetKeywords.filter(keyword => 
      title.includes(keyword) || instructions.includes(keyword) || ingredients.includes(keyword)
    ).length;
    
    const savoryCount = savoryKeywords.filter(keyword => 
      title.includes(keyword) || instructions.includes(keyword) || ingredients.includes(keyword)
    ).length;
    
    return sweetCount > savoryCount;
  };

  // Normalize ingredient names for comparison
  const normalizeIngredient = (name: string): string => {
    return name.toLowerCase().trim().replace(/s$/, '').replace(/[^a-z]/g, '');
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToResults = () => {
    setSelectedRecipe(null);
  };

  const handleBackToSearch = () => {
    setSelectedRecipe(null);
    setRecipes([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleWelcomeClose} />
      
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-orange-200 dark:border-orange-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                <img 
                  src="/assets/generated/chef-hat-icon.png" 
                  alt="Chef Hat" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Flowy
              </h1>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Find recipes with your ingredients
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedRecipe ? (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={handleBackToResults}
            onBackToSearch={handleBackToSearch}
          />
        ) : recipes.length > 0 ? (
          <RecipeResults 
            recipes={recipes} 
            onRecipeSelect={handleRecipeSelect}
            onBackToSearch={handleBackToSearch}
            searchPreferences={searchPreferences}
          />
        ) : (
          <RecipeSearchForm 
            onSearch={handleSearch} 
            isSearching={isSearching}
          />
        )}
      </main>

      <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-orange-200 dark:border-orange-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>© 2025. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
