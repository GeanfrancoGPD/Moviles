import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserRecipes } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeList from './RecipeList';
import Button from '../atom/Button';

export default function MyRecipesPage({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    console.log('=== CARGANDO MIS RECETAS ===');
    console.log('Usuario ID:', user?.id);
    
    setLoading(true);
    
    try {
      if (!user?.id) {
        console.log('No hay usuario logueado');
        setRecipes([]);
        return;
      }
      
      const data = await getUserRecipes(user.id);
      console.log('Recetas recibidas:', data?.length);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <RecipeList
        recipes={recipes}
        loading={loading}
        onRefresh={loadRecipes}
        onRecipePress={(recipe) => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
        emptyMessage="No tienes recetas aún. ¡Crea tu primera receta!"
      />

      <View style={styles.fabContainer}>
        <Button
          title="+ Nueva Receta"
          onPress={() => {
            if (!user) navigation.navigate('Login');
            else navigation.navigate('AddRecipe');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  fabContainer: { padding: 16, paddingBottom: 30 },
});