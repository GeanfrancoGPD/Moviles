import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserRecipes } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeList from '../molecules/RecipeList';
import Button from '../atom/Button';
import SearchBar from '../atom/SearchBar';

export default function MyRecipesPage({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecipes = normalizedQuery
    ? recipes.filter((recipe) =>
        (recipe.titulo || '').toLowerCase().includes(normalizedQuery)
      )
    : recipes;

  const displayedRecipes = sortAlphabetically
    ? [...filteredRecipes].sort((a, b) =>
        (a.titulo || '').localeCompare((b.titulo || ''), 'es', { sensitivity: 'base' })
      )
    : filteredRecipes;

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Buscar en mis recetas"
        containerStyle={styles.searchBar}
      />

      <View style={styles.sortButtonContainer}>
        <Button
          title="A - Z"
          compact
          active={sortAlphabetically}
          onPress={() => setSortAlphabetically((current) => !current)}
        />
      </View>

      <RecipeList
        recipes={displayedRecipes}
        loading={loading}
        onRefresh={loadRecipes}
        onRecipePress={(recipe) => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
        emptyMessage={
          normalizedQuery
            ? 'No se encontraron recetas con ese nombre'
            : 'No tienes recetas aún. ¡Crea tu primera receta!'
        }
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
  searchBar: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  sortButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  fabContainer: { padding: 16, paddingBottom: 30 },
});