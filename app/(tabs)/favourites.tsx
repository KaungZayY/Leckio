import RecipeCard from "@/components/general/RecipeCard";
import { useFavorites } from "@/context/useFavoritesContext";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import SearchBar from "@/components/general/SearchBar";

export default function favourites() {
  const [query, setQuery] = useState<string>("");
  const { favorites } = useFavorites();

  const filtered = useMemo(() => {
    if (!query.trim()) return favorites;

    return favorites.filter((recipe) =>
      recipe.strMeal.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, favorites]);

  return (
    <View style={styles.container}>
      {/* 🔍 SEARCH */}
      {favorites.length > 0 && (
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => {}}
          placeholder="Search your favorites..."
        />
      )}

      {/* 📜 LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item.idMeal ?? index.toString()}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipes/${item.idMeal}`)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {favorites.length === 0
              ? "No favorites yet ❤️"
              : "No matching recipes 🔍"}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginLeft: 16,
    marginBottom: 6,
    color: "#1F2933",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
