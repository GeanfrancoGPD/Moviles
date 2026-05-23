import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { getRecipeById, deleteRecipe } from '../../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../atom/Button';

export default function RecipeDetailPage({ route, navigation }) {
  const { recipeId } = route.params;
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => { loadRecipe(); }, []);

  const loadRecipe = async () => {
    try {
      const data = await getRecipeById(recipeId);
      setRecipe(data);
      // Verificar si el usuario actual es el dueño
      setIsOwner(user?.id === data.usuario_id);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la receta');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    const recipeIdValue = Number(recipe?.id);
    const userIdValue = Number(user?.id);

    if (!Number.isFinite(recipeIdValue) || !Number.isFinite(userIdValue)) {
      Alert.alert('Error', 'No se pudo validar la receta o el usuario');
      return;
    }

    try {
      await deleteRecipe(recipeIdValue, userIdValue);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo eliminar');
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = globalThis.confirm?.('¿Estás seguro de que quieres eliminar esta receta?');
      if (confirmed) {
        executeDelete();
      }
      return;
    }

    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: executeDelete,
        },
      ]
    );
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <Text>Cargando...</Text>
    </View>
  );
  
  if (!recipe) return (
    <View style={styles.loadingContainer}>
      <Text>No se encontró la receta</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Detalle de Receta</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{recipe.titulo}</Text>
        
        {/* Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Tiempo</Text>
            <Text style={styles.metaValue}>{recipe.tiempo_coccion} min</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Porciones</Text>
            <Text style={styles.metaValue}>{recipe.porciones}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Calorías</Text>
            <Text style={styles.metaValue}>{recipe.calorias} cal</Text>
          </View>
        </View>
        
        {/* Difficulty */}
        <Text style={styles.difficulty}>Dificultad: {recipe.dificultad}</Text>

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {recipe.ingredientes?.map((ing, idx) => (
          <View key={idx} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.ingredientName}>{ing.nombre}</Text>
            <Text style={styles.ingredientQty}>{ing.cantidad}</Text>
          </View>
        ))}

        {/* Preparation Section */}
        <Text style={styles.sectionTitle}>Preparación</Text>
        {recipe.pasos?.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step.descripcion}</Text>
          </View>
        ))}

        {/* Action Buttons - SOLO PARA EL DUEÑO */}
        {isOwner && (
          <View style={styles.actions}>
            <Button 
              title="Editar receta" 
              onPress={() => navigation.navigate('AddRecipe', { recipe })} 
            />
            <Button 
              title="Eliminar receta" 
              onPress={handleDelete} 
            />
          </View>
        )}
        
        {/* Extra space at bottom */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCEFE4',
    backgroundColor: '#F3FAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#0B5D3C',
    fontSize: 20,
    fontWeight: '700',
  },
  topTitle: {
    color: '#0B2F1A',
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  title: {
    color: '#0B2F1A',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 36,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#F7FBF8',
    borderWidth: 1,
    borderColor: '#E1EFE6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metaLabel: {
    color: '#5E7068',
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: '#1F3B2D',
    fontSize: 16,
    fontWeight: '700',
  },
  difficulty: {
    color: '#0B5D3C',
    fontSize: 15,
    marginBottom: 24,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#0B2F1A',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0B5D3C',
    marginRight: 10,
  },
  ingredientName: {
    flex: 2,
    color: '#1F3B2D',
    fontSize: 15,
  },
  ingredientQty: {
    flex: 1,
    color: '#5E7068',
    fontSize: 14,
    textAlign: 'right',
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0B5D3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    color: '#1F3B2D',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    marginTop: 30,
    gap: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});