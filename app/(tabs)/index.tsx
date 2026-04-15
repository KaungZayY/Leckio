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
import { fetchRandomRecipes } from "@/services/themealdb";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Recipe[] = await fetchRandomRecipes(10);
      const formatted: RecipeCardData[] = data.map((recipe) => ({
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strArea: recipe.strArea,
        strCategory: recipe.strCategory,
        strTags: recipe.strTags,
      }));
      setRecipes(formatted);
    } catch (error) {
      setError("Failed to fetch recipes. Please try again.");
      console.error(error);
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
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => router.push(`/recipes/${item.idMeal}`)}/>}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No recipes found.</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF8F2",
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
    marginTop: 20,
    color: "#666",
  },
});
