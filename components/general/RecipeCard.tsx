import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { Recipe } from "@/types/recipe.ts";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RecipeCardProps {
  recipe: RecipeCardData;
  onPress?: () => void;
}

function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const tags = recipe.strTags ? recipe.strTags.split(",").slice(0, 5) : [];
  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={onPress}
      >
        {/* Recipe Image */}
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {recipe.strMeal}
          </Text>

          {/* Info Row */}
          <View style={styles.infoRow}>
            {recipe.strArea && (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{recipe.strArea}</Text>
              </View>
            )}

            {recipe.strCategory && (
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={16}
                  color="#666"
                />
                <Text style={styles.infoText}>{recipe.strCategory}</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
}

export default RecipeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    height: 190,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#FFF1E6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 6,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
  },
});
