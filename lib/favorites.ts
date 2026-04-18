import { db } from "./db.ts";
import type { Recipe } from "@/types/recipe";

const getDatabase = async () => await db;

// helper: extract ingredients into array
const extractIngredients = (recipe: Recipe) => {
  const list: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}` as keyof Recipe] as string | null;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string | null;

    if (ing && ing.trim()) {
      list.push(`${measure?.trim() || ""} ${ing}`.trim());
    }
  }

  return list;
};

export const addFavorite = async (recipe: Recipe) => {
  const database = await getDatabase();

  const ingredients = JSON.stringify(extractIngredients(recipe));

  await database.runAsync(
    `
    INSERT OR REPLACE INTO favorites 
    (idMeal, strMeal, strMealThumb, strArea, strCategory, strInstructions, strTags, ingredients)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
    [
      recipe.idMeal,
      recipe.strMeal,
      recipe.strMealThumb,
      recipe.strArea,
      recipe.strCategory,
      recipe.strInstructions,
      recipe.strTags,
      ingredients,
    ],
  );
};

export const removeFavorite = async (idMeal: string) => {
  const database = await getDatabase();

  await database.runAsync(`DELETE FROM favorites WHERE idMeal = ?`, [idMeal]);
};

export const isFavorite = async (idMeal: string) => {
  const database = await getDatabase();

  const result = await database.getFirstAsync(
    `SELECT idMeal FROM favorites WHERE idMeal = ?`,
    [idMeal],
  );

  return !!result;
};


export const getAllFavorites = async () => {
  const database = await getDatabase();

  const rows = await database.getAllAsync<any>(
    `SELECT * FROM favorites`
  );

  return rows.map(r => ({
    ...r,
    ingredients: JSON.parse(r.ingredients),
  }));
} 