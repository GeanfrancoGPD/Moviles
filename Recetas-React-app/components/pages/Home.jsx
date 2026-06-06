import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getPublicRecipes, toggleLike } from "../../services/api";
import RecipeCard from "../molecules/RecipeCard";
import LikeButton from "../atom/LikeButton";

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [likesState, setLikesState] = useState({});

  const loadRecipes = async () => {
    try {
      const data = await getPublicRecipes(user?.id);
      if (Array.isArray(data)) {
        setRecipes(data);
        const initialState = {};
        data.forEach((recipe) => {
          initialState[recipe.id] = {
            liked: recipe.is_liked_by_user || false,
          };
        });
        setLikesState(initialState);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [user?.id]),
  );

  const handleLikeToggle = async (recipeId, newLiked) => {
    try {
      const result = await toggleLike(recipeId, user?.id);
      setLikesState((prev) => ({
        ...prev,
        [recipeId]: { liked: result.liked },
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
          }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>
            Cocinar es convertir ingredientes en momentos inolvidables
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personalizado para ti</Text>
      </View>

      {recipes.map((item) => (
        <RecipeCard
          key={item.id}
          recipe={{
            title: item.titulo,
            time: `${item.tiempo_coccion} min`,
            difficulty: item.dificultad,
            tags: item.is_public ? ["Pública"] : ["Privada"],
          }}
          onPress={() =>
            navigation.navigate("RecipeDetail", { recipeId: item.id })
          }
          footer={
            <LikeButton
              recipeId={item.id}
              initialLiked={likesState[item.id]?.liked ?? false}
              onLikeToggle={handleLikeToggle}
              size="small"
            />
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingBottom: 120 },
  heroContainer: { position: "relative", height: 260, marginBottom: 18 },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    position: "absolute",
    left: 16,
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(11, 47, 26, 0.42)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sectionHeader: { paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { color: "#0B2F1A", fontSize: 18, fontWeight: "700" },
});
