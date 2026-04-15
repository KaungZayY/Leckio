import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchRecipeById } from "@/services/themealdb";
import type { Recipe } from "@/types/recipe";
import Spinner from "@/components/general/Spinner";

function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await fetchRecipeById(id as string);
      setRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // useEffect -> onMounted & when id change, do this again

  if (loading) {
    return <Spinner message="Loading recipe..." />;
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  // Extract ingredients dynamically
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as
      | string
      | null;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string | null;

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure?.trim() || ""} ${ingredient}`.trim());
    }
  }

  const tags = recipe.strTags
    ? recipe.strTags.split(",").map((tag) => tag.trim())
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: recipe?.strMeal ?? "Recipe Details",
        }}
      />
      <ScrollView style={styles.container}>
        {/* Image */}
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.strMeal}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.metaText}>{recipe.strArea}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={18} color="#666" />
              <Text style={styles.metaText}>{recipe.strCategory}</Text>
            </View>
          </View>

          {/* Tags */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={styles.ingredient}>
              • {item}
            </Text>
          ))}

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>

          {/* YouTube Link */}
          {recipe.strYoutube && (
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(recipe.strYoutube!)}
            >
              ▶ Watch on YouTube
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1F2933",
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#555",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#FFE8D6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginTop: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    marginTop: 4,
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeDetailScreen;
