import RecipeCard from "@/components/general/RecipeCard";
import { useFavorites } from "@/context/useFavoritesContext";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text
} from "react-native";

export default function favourites() {
  const { favorites } = useFavorites();

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item, index) => item.idMeal ?? index.toString()}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() => router.push(`/recipes/${item.idMeal}`)}
        />
      )}
      contentContainerStyle={[
        styles.container,
        favorites.length === 0 && styles.emptyContainer,
      ]}
      ListEmptyComponent={<Text style={styles.empty}>No favorites yet ❤️</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
