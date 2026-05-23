import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atom/Icon';

export default function IngredientList({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay ingredientes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}> Ingredientes</Text>
      {ingredients.map((item, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Icon name="check" size={14} color="#F4C95D" style={styles.checkIcon} />
          <Text style={styles.ingredientName}>{item.nombre}</Text>
          <Text style={styles.ingredientQuantity}>{item.cantidad}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#F4C95D',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  checkIcon: {
    marginRight: 12,
  },
  ingredientName: {
    flex: 2,
    color: '#FFFFFF',
    fontSize: 14,
  },
  ingredientQuantity: {
    flex: 1,
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});