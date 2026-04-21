import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import RecipeCard from "@/components/general/RecipeCard";
import Spinner from "@/components/general/Spinner";
import type {
  Recipe,
  RecipeListResponse,
  RecipeCardData,
} from "@/types/recipe";
import { fetchRandomRecipes, fetchRecipesByName } from "@/services/themealdb";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import SearchBar from "@/components/general/SearchBar";

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Recipe[] = await fetchRandomRecipes(10);
      setRecipes(data);
    } catch (error) {
      setError("Failed to fetch recipes. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchByName = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        await fetchRandom();
        return;
      }

      const data = await fetchRecipesByName(query);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    if (query.trim()) {
      await handleSearchByName();
    } else {
      await fetchRandom();
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return <Spinner message="Fetching delicious recipes..." />;
  }

  return (
    <>
      <View style={styles.container}>
        {/* 🔍 Search */}
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearchByName}
        />

        {/* 📜 List */}
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => item.idMeal ?? index.toString()}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => router.push(`/recipes/${item.idMeal}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            recipes.length === 0 && styles.emptyContainer,
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No recipes found 🍽️</Text>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
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
