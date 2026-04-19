import React, { createContext, useContext, useEffect, useState } from "react";
import { addFavorite, removeFavorite, getAllFavorites } from "@/lib/favorites";
import type { Recipe } from "@/types/recipe";

type FavoritesContextType = {
  favorites: Recipe[];
  isFav: (id: string) => boolean;
  toggleFavorite: (recipe: Recipe) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // load from sqlite once
  const loadFavorites = async () => {
    const data = await getAllFavorites();
    setFavorites(data);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const isFav = (id: string) => {
    return favorites.some((r) => r.idMeal === id);
  };

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.idMeal === recipe.idMeal);

      if (exists) {
        removeFavorite(recipe.idMeal); // don't await
        return prev.filter((r) => r.idMeal !== recipe.idMeal);
      } else {
        addFavorite(recipe); // don't await
        return [recipe, ...prev];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFav, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
};
