import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getPublicRecipes, toggleLike } from '../../services/api';
import Button from '../atom/Button';
import SearchBar from '../atom/SearchBar';
import RecipeCard from '../molecules/RecipeCard';
import LikeButton from '../atom/LikeButton';
import LoadingSpinner from '../atom/LoadingSpinner';

export default function ExplorePage({ navigation }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [likesState, setLikesState] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await getPublicRecipes(user?.id);
      setRecipes(data);
      const initialState = {};
      data.forEach(recipe => {
        initialState[recipe.id] = {
          liked: recipe.is_liked_by_user || false,
        };
      });
      setLikesState(initialState);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadRecipes(); }, []));

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const handleLikeToggle = async (recipeId, newLiked) => {
    try {
      const result = await toggleLike(recipeId, user?.id);
      setLikesState(prev => ({
        ...prev,
        [recipeId]: { liked: result.liked },
      }));
    } catch (error) {
      throw error;
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  let filteredRecipes = normalizedQuery
    ? recipes.filter(recipe => (recipe.titulo || '').toLowerCase().includes(normalizedQuery))
    : recipes;
  if (sortAlphabetically) {
    filteredRecipes = [...filteredRecipes].sort((a, b) => (a.titulo || '').localeCompare((b.titulo || ''), 'es', { sensitivity: 'base' }));
  }

  if (loading && !refreshing) return <LoadingSpinner message="Cargando recetas..." />;

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
        <Button title="A - Z" compact active={sortAlphabetically} onPress={() => setSortAlphabetically(prev => !prev)} />
      </View>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={{
              title: item.titulo,
              time: `${item.tiempo_coccion} min`,
              difficulty: item.dificultad,
              tags: item.is_public ? ['Pública'] : ['Privada'],
            }}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            footer={
              <LikeButton
                recipeId={item.id}
                initialLiked={likesState[item.id]?.liked ?? false}
                onLikeToggle={handleLikeToggle}
                size="small"
              />
            }
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F4C95D" />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay recetas públicas</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 12 },
  searchBar: { marginHorizontal: 16, marginBottom: 8 },
  buttonContainer: { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  list: { paddingVertical: 8 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },
});