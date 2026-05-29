import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPublicRecipes } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../atom/Button';
import SearchBar from '../atom/SearchBar';
import RecipeList from '../molecules/RecipeList';

export default function ExplorePage({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

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

  useFocusEffect(useCallback(() => { loadRecipes(); }, []));

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Buscar recetas públicas"
        containerStyle={styles.searchBar}
      />
      <View style={styles.buttonContainer}>
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
            : 'No hay recetas públicas disponibles'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});