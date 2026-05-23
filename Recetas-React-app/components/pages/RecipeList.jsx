import React, { useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Text } from 'react-native';
import RecipeCard from '../molecules/RecipeCard';
import LoadingSpinner from '../atom/LoadingSpinner';

export default function RecipeList({ 
  recipes, 
  loading = false, 
  onRefresh, 
  onRecipePress,
  emptyMessage = 'No hay recetas disponibles',
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Cargando recetas..." />;
  }

  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      showsVerticalScrollIndicator
      persistentScrollbar
      renderItem={({ item }) => (
        <RecipeCard
          recipe={{
            title: item.titulo,
            time: `${item.tiempo_coccion} mins`,
            difficulty: item.dificultad,
            imageUrl: item.imagen_key ? null : null,
            tags: item.is_public ? ['Pública'] : ['Privada'],
          }}
          onPress={() => onRecipePress?.(item)}
        />
      )}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F4C95D" />
        ) : undefined
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});