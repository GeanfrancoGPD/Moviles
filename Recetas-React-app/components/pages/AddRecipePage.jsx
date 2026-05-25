import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Input from '../atom/Inputs';
import IngredientEditorList from '../molecules/IngredientEditorList';
import StepEditorList from '../molecules/StepEditorList';
import { createRecipe, getUserGroups } from '../../services/api';
import { useAuth } from '../context/AuthContext';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate'];

export default function AddRecipePage({ navigation, route }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const editingRecipe = route.params?.recipe;
  const isEditing = !!editingRecipe;
  
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tiempo_coccion: '',
    dificultad: 'Easy',
    calorias: '',
    porciones: '2',
    is_public: true,
    ingredients: [{ nombre: '', cantidad: '' }],
    steps: [{ descripcion: '' }],
    wantsGroup: false,
    groupId: null,
  });

  // Cargar grupos del usuario
  useEffect(() => {
    const loadGroups = async () => {
      if (!user?.id) {
        setGroups([]);
        return;
      }

      try {
        const data = await getUserGroups(user.id);
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setGroups([]);
      }
    };

    loadGroups();
  }, [user]);

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing && editingRecipe) {
      setForm({
        titulo: editingRecipe.titulo || '',
        descripcion: editingRecipe.descripcion || '',
        tiempo_coccion: editingRecipe.tiempo_coccion ? String(editingRecipe.tiempo_coccion) : '',
        dificultad: editingRecipe.dificultad || 'Easy',
        calorias: editingRecipe.calorias ? String(editingRecipe.calorias) : '',
        porciones: editingRecipe.porciones ? String(editingRecipe.porciones) : '2',
        is_public: editingRecipe.is_public !== undefined ? editingRecipe.is_public : true,
        ingredients: editingRecipe.ingredientes?.length ? editingRecipe.ingredientes : [{ nombre: '', cantidad: '' }],
        steps: editingRecipe.pasos?.length ? editingRecipe.pasos : [{ descripcion: '' }],
        wantsGroup: false,
        groupId: null,
      });
    }
  }, [isEditing, editingRecipe]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const addIngredient = () => {
    setForm((current) => ({
      ...current,
      ingredients: [...current.ingredients, { nombre: '', cantidad: '' }],
    }));
  };

  const updateIngredient = (index, field, value) => {
    setForm((current) => {
      const nextIngredients = [...current.ingredients];
      nextIngredients[index] = { ...nextIngredients[index], [field]: value };
      return { ...current, ingredients: nextIngredients };
    });
  };

  const removeIngredient = (index) => {
    if (form.ingredients.length === 1) {
      setForm((current) => ({
        ...current,
        ingredients: [{ nombre: '', cantidad: '' }],
      }));
    } else {
      setForm((current) => ({
        ...current,
        ingredients: current.ingredients.filter((_, itemIndex) => itemIndex !== index),
      }));
    }
  };

  const addStep = () => {
    setForm((current) => ({
      ...current,
      steps: [...current.steps, { descripcion: '' }],
    }));
  };

  const updateStep = (index, value) => {
    setForm((current) => {
      const nextSteps = [...current.steps];
      nextSteps[index] = { ...nextSteps[index], descripcion: value };
      return { ...current, steps: nextSteps };
    });
  };

  const removeStep = (index) => {
    if (form.steps.length === 1) {
      setForm((current) => ({
        ...current,
        steps: [{ descripcion: '' }],
      }));
    } else {
      setForm((current) => ({
        ...current,
        steps: current.steps.filter((_, itemIndex) => itemIndex !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('=== INICIANDO GUARDADO DE RECETA ===');
    console.log('Usuario ID:', user?.id);
    
    if (!user?.id) {
      Alert.alert('Inicio de sesión requerido', 'Necesitas iniciar sesión para crear una receta.');
      navigation.navigate('Login');
      return;
    }

    if (!form.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    const ingredients = form.ingredients.filter((item) => item.nombre.trim());
    const steps = form.steps.filter((item) => item.descripcion.trim());

    console.log('Ingredientes válidos:', ingredients.length);
    console.log('Pasos válidos:', steps.length);

    if (ingredients.length === 0) {
      Alert.alert('Error', 'Agrega al menos un ingrediente');
      return;
    }

    if (steps.length === 0) {
      Alert.alert('Error', 'Agrega al menos un paso');
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        imagen_key: 'default',
        tiempo_coccion: parseInt(form.tiempo_coccion, 10) || 0,
        dificultad: form.dificultad,
        calorias: parseInt(form.calorias, 10) || 0,
        porciones: parseInt(form.porciones, 10) || 1,
        is_public: form.is_public,
        ingredients: ingredients,
        steps: steps,
        wantsGroup: form.wantsGroup,
        groupId: form.wantsGroup ? form.groupId : null,
      };

      console.log('Enviando datos al API...');
      const result = await createRecipe(recipeData, user.id);
      console.log('Resultado:', result);

      Alert.alert('Éxito', isEditing ? 'Receta actualizada correctamente' : 'Receta creada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', error.message || 'No se pudo crear la receta');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0B5D3C" />
        <Text style={styles.loadingText}>Guardando receta...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
      persistentScrollbar={true}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Receta' : 'Nueva Receta'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Detalles de la Receta</Text>
      
      <Text style={styles.label}>Título de la Receta *</Text>
      <Input
        placeholder="Ej. Pastel de Manzana de la Abuela"
        value={form.titulo}
        onChangeText={(value) => updateField('titulo', value)}
      />

      <Text style={styles.label}>Descripción</Text>
      <Input
        placeholder="Cuéntanos sobre tu receta..."
        value={form.descripcion}
        onChangeText={(value) => updateField('descripcion', value)}
        multiline
      />

      <View style={styles.toggleCard}>
        <Text style={styles.toggleLabel}>Visibilidad</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.togglePill, form.is_public && styles.togglePillActive]}
            onPress={() => updateField('is_public', true)}
          >
            <Text style={[styles.toggleText, form.is_public && styles.toggleTextActive]}>Pública</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togglePill, !form.is_public && styles.togglePillActive]}
            onPress={() => updateField('is_public', false)}
          >
            <Text style={[styles.toggleText, !form.is_public && styles.toggleTextActive]}>Privada</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ingredientes *</Text>
      <IngredientEditorList
        ingredients={form.ingredients}
        onAdd={addIngredient}
        onUpdate={updateIngredient}
        onRemove={removeIngredient}
      />

      <Text style={styles.sectionTitle}>Pasos de Preparación *</Text>
      <StepEditorList
        steps={form.steps}
        onAdd={addStep}
        onUpdate={updateStep}
        onRemove={removeStep}
      />

      <View style={styles.toggleCard}>
        <Text style={styles.toggleLabel}>¿Agregar a un grupo?</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.togglePill, !form.wantsGroup && styles.togglePillActive]}
            onPress={() => updateField('wantsGroup', false)}
          >
            <Text style={[styles.toggleText, !form.wantsGroup && styles.toggleTextActive]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togglePill, form.wantsGroup && styles.togglePillActive]}
            onPress={() => updateField('wantsGroup', true)}
          >
            <Text style={[styles.toggleText, form.wantsGroup && styles.toggleTextActive]}>Sí</Text>
          </TouchableOpacity>
        </View>

        {form.wantsGroup ? (
          groups.length > 0 ? (
            <View style={styles.groupList}>
              <Text style={styles.groupLabel}>Selecciona un grupo:</Text>
              <View style={styles.groupChipsContainer}>
                {groups.map((group) => {
                  const active = form.groupId === group.id;
                  return (
                    <TouchableOpacity
                      key={group.id}
                      style={[styles.groupChip, active && styles.groupChipActive]}
                      onPress={() => updateField('groupId', group.id)}
                    >
                      <Text style={[styles.groupChipText, active && styles.groupChipTextActive]}>
                        {group.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text style={styles.helperText}>No tienes grupos creados. Crea un grupo primero en la pestaña Grupos.</Text>
          )
        ) : (
          <Text style={styles.helperText}>La receta se guardará sin grupo.</Text>
        )}
      </View>

      <Text style={styles.label}>Dificultad</Text>
      <View style={styles.difficultyRow}>
        {DIFFICULTIES.map((difficulty) => {
          const active = form.dificultad === difficulty;
          return (
            <TouchableOpacity
              key={difficulty}
              style={[styles.difficultyPill, active && styles.difficultyPillActive]}
              onPress={() => updateField('dificultad', difficulty)}
            >
              <Text style={[styles.difficultyText, active && styles.difficultyTextActive]}>{difficulty}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.inlineRow}>
        <View style={styles.inlineCol}>
          <Text style={styles.label}>Tiempo (min)</Text>
          <Input
            placeholder="45"
            value={form.tiempo_coccion}
            onChangeText={(value) => updateField('tiempo_coccion', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inlineCol}>
          <Text style={styles.label}>Calorías</Text>
          <Input
            placeholder="420"
            value={form.calorias}
            onChangeText={(value) => updateField('calorias', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Porciones</Text>
      <Input
        placeholder="2"
        value={form.porciones}
        onChangeText={(value) => updateField('porciones', value)}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? (isEditing ? 'Actualizando...' : 'Publicando...') : (isEditing ? 'Actualizar Receta' : 'Publicar Receta')}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#0B5D3C',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3FAF6',
    borderWidth: 1,
    borderColor: '#DCEFE4',
  },
  backText: {
    color: '#0B2F1A',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#0B2F1A',
    fontSize: 22,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#0B2F1A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    color: '#1F3B2D',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  toggleCard: {
    backgroundColor: '#F7FBF8',
    borderWidth: 1,
    borderColor: '#E1EFE6',
    borderRadius: 20,
    padding: 14,
    marginTop: 14,
    marginBottom: 8,
  },
  toggleLabel: {
    color: '#0B2F1A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  togglePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCEFE4',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  togglePillActive: {
    backgroundColor: '#0B5D3C',
    borderColor: '#0B5D3C',
  },
  toggleText: {
    color: '#365348',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  groupList: {
    marginTop: 12,
  },
  groupLabel: {
    color: '#0B2F1A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  groupChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEFE4',
    marginRight: 8,
    marginBottom: 8,
  },
  groupChipActive: {
    backgroundColor: '#0B5D3C',
    borderColor: '#0B5D3C',
  },
  groupChipText: {
    color: '#365348',
    fontWeight: '600',
  },
  groupChipTextActive: {
    color: '#FFFFFF',
  },
  helperText: {
    color: '#6D7C75',
    marginTop: 10,
    fontSize: 13,
  },
  difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  difficultyPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F3FAF6',
    borderWidth: 1,
    borderColor: '#DCEFE4',
  },
  difficultyPillActive: {
    backgroundColor: '#0B5D3C',
    borderColor: '#0B5D3C',
  },
  difficultyText: {
    color: '#365348',
    fontWeight: '600',
    fontSize: 12,
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  inlineCol: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#0B5D3C',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#0B5D3C',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
});