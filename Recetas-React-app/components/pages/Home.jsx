// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getPublicRecipes } from "../../services/api";
import RecipeCard from "../molecules/RecipeCard";

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);

  const sampleRecipes = [
    { id: 1, titulo: 'Wild Mushroom Risotto', tiempo_coccion: 45, dificultad: 'Intermediate', is_public: true },
    { id: 2, titulo: 'Mediterranean Zucchini Pasta', tiempo_coccion: 20, dificultad: 'Easy', is_public: true },
    { id: 3, titulo: 'Honey Glazed Salmon', tiempo_coccion: 25, dificultad: 'Easy', is_public: true },
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await getPublicRecipes(user?.id);
      if (data && data.length > 0) {
        setRecipes(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayRecipes = recipes.length > 0 ? recipes : sampleRecipes;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator
    >
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80' }} 
          style={styles.heroImage} 
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Cocinar es convertir ingredientes en momentos inolvidables</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personalizado para ti</Text>
      </View>

      <View style={styles.recipeSection}>
        {displayRecipes.map((item) => (
          <RecipeCard
            key={item.id}
            recipe={{
              title: item.titulo,
              time: `${item.tiempo_coccion} mins`,
              difficulty: item.dificultad,
              tags: item.is_public ? ['Pública'] : ['Privada'],
              imageUrl: null,
            }}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 120,
  },
  heroContainer: { 
    position: 'relative', 
    height: 260, 
    marginBottom: 18 
  },
  heroImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  heroOverlay: { 
    position: 'absolute', 
    left: 16, 
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(11, 47, 26, 0.42)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  heroKicker: { 
    color: '#F4C95D', 
    fontSize: 12, 
    marginBottom: 6, 
    fontWeight: '700' 
  },
  heroTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroMeta: { 
    color: '#F2F4F1', 
    marginTop: 6,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeader: { 
    paddingHorizontal: 16, 
    marginTop: 8, 
    marginBottom: 8 
  },
  sectionTitle: { 
    color: '#0B2F1A', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  recipeSection: {
    paddingBottom: 24,
  },
});