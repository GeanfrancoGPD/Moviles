import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPublicRecipes } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeList from '../molecules/RecipeList';

export default function ExplorePage({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await getPublicRecipes(user.id);
      setRecipes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadRecipes(); }, []));

  return (
    <View style={styles.container}>
      <RecipeList
        recipes={recipes}
        loading={loading}
        onRefresh={loadRecipes}
        onRecipePress={(recipe) => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
        emptyMessage="No hay recetas públicas disponibles"
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  } 
});