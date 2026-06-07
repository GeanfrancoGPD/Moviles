import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RecipeCard from './RecipeCard';
import Icon from '../atom/Icon';

export default function GroupRecipesList({
  recipes,
  onRecipePress,
  onRemoveFromGroup,
  isOwner = true,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
}) {
  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No hay recetas en este grupo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipes.map((recipe) => {
        const isSelected = selectedIds.includes(recipe.id);
        return (
          <View key={recipe.id} style={styles.recipeWrapper}>
            <RecipeCard
              recipe={{
                title: recipe.titulo,
                time: `${recipe.tiempo_coccion || 0} min`,
                difficulty: recipe.dificultad,
                tags: [recipe.is_public ? 'Pública' : 'Privada'],
              }}
              onPress={() => {
                if (selectable && onToggleSelect) {
                  return onToggleSelect(recipe.id);
                }
                return onRecipePress?.(recipe);
              }}
              onLongPress={() => onToggleSelect?.(recipe.id)}
              selected={isSelected}
            />
            {isOwner && !selectable && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveFromGroup(recipe.id)}
              >
                <Icon name="delete" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  recipeWrapper: { position: 'relative' },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#8A8A8A', fontSize: 16 },
});