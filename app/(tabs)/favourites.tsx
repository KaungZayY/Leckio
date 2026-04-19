import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { getAllFavorites } from "@/lib/favorites";
import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/general/RecipeCard";
import Spinner from "@/components/general/Spinner";
import { router } from "expo-router";

export default function favourites() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const data = await getAllFavorites();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to load favorites", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  if (loading && !refreshing) {
    return <Spinner message="Loading favorites..." />;
  }

  return (
    <>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipes/${item.idMeal}`)}
          />
        )}
        contentContainerStyle={[
          styles.container,
          recipes.length === 0 && styles.emptyContainer,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No favorites yet ❤️</Text>
        }
      />
    </>
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
