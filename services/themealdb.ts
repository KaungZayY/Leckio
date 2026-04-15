import type { Recipe, RecipeListResponse } from "@/types/recipe";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// get single random recipe
export const fetchRandomRecipe = async (): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/random.php`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  const data: RecipeListResponse = await response.json();

  if (!data.meals || data.meals.length === 0) {
    throw new Error("No recipe found");
  }

  return data.meals[0];
};

// get multiple random recipes
// one request per multiple random recipes is under damn paywall
// make that damn list unique as well
export const fetchRandomRecipes = async (
  count: number = 5,
): Promise<Recipe[]> => {
  const uniqueRecipes: Recipe[] = [];
  const seenIds = new Set<string>();

  // Prevent infinite loops in case of excessive duplicates
  const maxAttempts = count * 5;
  let attempts = 0;

  while (uniqueRecipes.length < count && attempts < maxAttempts) {
    const remaining = count - uniqueRecipes.length;

    // Fetch multiple recipes concurrently
    const batch = await Promise.all(
      Array.from({ length: remaining }, () => fetchRandomRecipe()),
    );

    for (const recipe of batch) {
      if (recipe && !seenIds.has(recipe.idMeal)) {
        seenIds.add(recipe.idMeal);
        uniqueRecipes.push(recipe);
      }
    }

    attempts++;
  }

  return uniqueRecipes;
};

export const fetchRecipeById = async (id: number): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe details");
  }

  const data: RecipeListResponse = await response.json();

  if (!data.meals || data.meals.length === 0) {
    throw new Error("Recipe not found");
  }

  return data.meals[0];
};
