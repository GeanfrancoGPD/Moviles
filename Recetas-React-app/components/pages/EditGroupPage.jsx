import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import GroupForm from "../molecules/GroupForm";
import GroupRecipesList from "../molecules/GroupRecipesList";
import Button from "../atom/Button";
import {
  getGroupById,
  getGroupRecipes,
  updateGroup,
  removeRecipeFromGroup,
} from "../../services/api";

export default function EditGroupPage({ route, navigation }) {
  const { groupId, group } = route.params;
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        let nextGroup = group || null;
        if (!nextGroup && groupId) {
          nextGroup = await getGroupById(groupId);
        }

        if (nextGroup) {
          setInitialData(nextGroup);
        }

        if (groupId) {
          const groupRecipes = await getGroupRecipes(groupId);
          setRecipes(Array.isArray(groupRecipes) ? groupRecipes : []);
        }
      } catch (error) {
        console.warn("Error cargando grupo:", error);
        Alert.alert("Error", "No se pudo cargar el grupo");
        navigation.goBack();
      } finally {
        setLoadingGroup(false);
      }
    };
    fetchGroup();
  }, [group, groupId, navigation]);

  const handleUpdate = async (data) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await updateGroup(groupId || group.id, {
        ...data,
      });

      Alert.alert("Éxito", "Grupo actualizado");
      navigation.goBack();
    } catch (error) {
      console.warn("Error updating group:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipeIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  const handleRemoveSelectedRecipes = () => {
    if (!selectedRecipeIds.length) return;

    Alert.alert(
      "Sacar del grupo",
      "¿Deseas sacar las recetas seleccionadas del grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sacar",
          onPress: async () => {
            setRemoving(true);
            try {
              await Promise.all(
                selectedRecipeIds.map((recipeId) =>
                  removeRecipeFromGroup(groupId || group.id, recipeId),
                ),
              );
              setRecipes((prev) =>
                prev.filter((recipe) => !selectedRecipeIds.includes(recipe.id)),
              );
              setSelectedRecipeIds([]);
              Alert.alert("Éxito", "Recetas removidas del grupo");
            } catch (error) {
              console.warn("Error removiendo recetas del grupo:", error);
              Alert.alert(
                "Error",
                "No se pudieron quitar las recetas seleccionadas",
              );
            } finally {
              setRemoving(false);
            }
          },
        },
      ],
    );
  };

  if (loadingGroup) {
    return <ActivityIndicator style={styles.loader} color="#0B5D3C" />;
  }

  if (!initialData) return null;

  const isOwner = initialData.usuario_id === user?.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar grupo</Text>
      </View>
      <GroupForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitLabel="Guardar cambios"
        isLoading={loading}
      />

      <Text style={styles.sectionTitle}>Recetas en este grupo</Text>
      <Text style={styles.selectionHint}>
        Mantén presionada una receta para seleccionarla y luego pulsa "Sacar del grupo".
      </Text>
      {selectedRecipeIds.length > 0 && (
        <Button
          title={`Sacar ${selectedRecipeIds.length} receta${selectedRecipeIds.length > 1 ? 's' : ''}`}
          onPress={handleRemoveSelectedRecipes}
          containerStyle={styles.removeSelectedButton}
          active={true}
        />
      )}
      <GroupRecipesList
        recipes={recipes}
        onRecipePress={(recipe) =>
          navigation.navigate("RecipeDetail", { recipeId: recipe.id })
        }
        isOwner={isOwner}
        selectable={true}
        selectedIds={selectedRecipeIds}
        onToggleSelect={toggleRecipeSelection}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3FAF6",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { color: "#0B5D3C", fontSize: 20, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700", color: "#0B2F1A" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2F1A",
    marginTop: 24,
    marginBottom: 10,
  },
  selectionHint: {
    color: "#4A6351",
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  removeSelectedButton: {
    marginBottom: 16,
  },
});
