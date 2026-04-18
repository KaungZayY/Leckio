import { useEffect, useState } from "react";
import { addFavorite, removeFavorite, getAllFavorites } from "@/lib/favorites";
import type { Recipe } from "@/types/recipe";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    const data = await getAllFavorites();
    setFavorites(data.map((r) => r.idMeal));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFavorite = async (recipe: Recipe) => {
    if (favorites.includes(recipe.idMeal)) {
      await removeFavorite(recipe.idMeal);
    } else {
      await addFavorite(recipe);
    }

    await loadFavorites();
  };

  const isFav = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFav };
};
