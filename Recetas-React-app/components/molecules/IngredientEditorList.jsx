import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../atom/Inputs';

export default function IngredientEditorList({
  ingredients,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={styles.flex2}>
            <Input
              placeholder="Nombre del ingrediente"
              value={ingredient.nombre}
              onChangeText={(value) => onUpdate(index, 'nombre', value)}
            />
          </View>
          <View style={styles.flex1}>
            <Input
              placeholder="Cantidad"
              value={ingredient.cantidad}
              onChangeText={(value) => onUpdate(index, 'cantidad', value)}
            />
          </View>
          <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={onAdd} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>+ Agregar Ingrediente</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  flex2: {
    flex: 2,
  },
  flex1: {
    flex: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  removeButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  linkButtonText: {
    color: '#0B5D3C',
    fontWeight: '700',
    fontSize: 14,
  },
});
