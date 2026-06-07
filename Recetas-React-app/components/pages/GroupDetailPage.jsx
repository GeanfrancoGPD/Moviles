import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import GroupRecipesList from "../molecules/GroupRecipesList";
import Button from "../atom/Button";
import {
  getGroupById,
  getGroupRecipes,
  removeRecipeFromGroup,
  deleteGroup,
} from "../../services/api";

export default function GroupDetailPage({ route, navigation }) {
  const {
    groupId,
    groupName,
    group: preloadedGroup,
    preloadedRecipes,
  } = route.params;
  const { user } = useAuth();
  const [group, setGroup] = useState(preloadedGroup || null);
  const [recipes, setRecipes] = useState(preloadedRecipes || []);
  const [loading, setLoading] = useState(!(preloadedGroup && preloadedRecipes));
  const isOwner = group?.usuario_id === user?.id;

  const loadData = async () => {
    setLoading(true);
    try {
      let nextGroup = null;
      if (preloadedGroup && preloadedGroup.usuario_id != null) {
        nextGroup = preloadedGroup;
      } else if (groupId) {
        nextGroup = await getGroupById(groupId);
      }
      const nextRecipes =
        Array.isArray(preloadedRecipes) && preloadedRecipes.length >= 0
          ? preloadedRecipes
          : await getGroupRecipes(groupId);

      if (nextGroup) {
        setGroup(nextGroup);
      }
      setRecipes(Array.isArray(nextRecipes) ? nextRecipes : []);
    } catch (error) {
      console.warn("Error cargando grupo:", error);
      // No bloquear la UI: si hay preloadedGroup, úsalo como fallback
      if (preloadedGroup) setGroup(preloadedGroup);
      setRecipes(Array.isArray(preloadedRecipes) ? preloadedRecipes : []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const canUsePreloaded =
        preloadedGroup && Array.isArray(preloadedRecipes);

      if (canUsePreloaded) {
        setGroup(preloadedGroup);
        setRecipes(preloadedRecipes);
        setLoading(false);
        return undefined;
      }

      loadData();
      return undefined;
    }, [groupId, preloadedGroup, preloadedRecipes]),
  );

  const handleDeleteGroup = () => {
    Alert.alert(
      "Eliminar grupo",
      `¿Estás seguro de que quieres eliminar el grupo "${group?.nombre}"?\n\n${
        isOwner
          ? "Las recetas que te pertenecen NO se eliminarán, solo perderán la asociación a este grupo."
          : "Solo serás removido del grupo, las recetas no se verán afectadas."
      }`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroup(groupId, user.id, isOwner);
              Alert.alert("Éxito", "Grupo eliminado");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handleRemoveRecipe = (recipeId) => {
    Alert.alert("Quitar receta", "¿Quitar esta receta del grupo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Quitar",
        onPress: async () => {
          try {
            await removeRecipeFromGroup(groupId, recipeId);
            setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
          } catch {
            Alert.alert("Error", "No se pudo quitar la receta");
          }
        },
      },
    ]);
  };

  const handleAddRecipe = () => {
    navigation.navigate("Explore", { addToGroupId: groupId });
  };

  if (loading)
    return <ActivityIndicator style={styles.loader} color="#0B5D3C" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{group?.nombre}</Text>
      </View>
      {group?.descripcion ? (
        <Text style={styles.description}>{group.descripcion}</Text>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Recetas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{isOwner ? "Dueño" : "Miembro"}</Text>
          <Text style={styles.statLabel}>Rol</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recetas en este grupo</Text>
      <GroupRecipesList
        recipes={recipes}
        onRecipePress={(recipe) =>
          navigation.navigate("RecipeDetail", { recipeId: recipe.id })
        }
        onRemoveFromGroup={isOwner ? handleRemoveRecipe : null}
        isOwner={isOwner}
      />

      <View style={styles.actions}>
        <Button
          title="Editar grupo"
          onPress={async () => {
            try {
              let fullGroup = group;
              if (!fullGroup || fullGroup.usuario_id == null) {
                if (groupId) {
                  fullGroup = await getGroupById(groupId);
                }
              }

              if (fullGroup && fullGroup.usuario_id === user?.id) {
                navigation.navigate("EditGroup", {
                  group: fullGroup,
                  groupId,
                });
                return;
              }

              if (fullGroup && fullGroup.usuario_id != null) {
                Alert.alert("No autorizado", "Solo el dueño puede editar el grupo");
                return;
              }

              navigation.navigate("EditGroup", {
                group,
                groupId,
              });
            } catch (err) {
              console.warn("Error preparando edición:", err);
              navigation.navigate("EditGroup", {
                group,
                groupId,
              });
            }
          }}
        />

        {isOwner ? (
          <Button title="Eliminar grupo" onPress={handleDeleteGroup} />
        ) : (
          <Button title="Salir del grupo" onPress={handleDeleteGroup} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  title: { flex: 1, fontSize: 24, fontWeight: "700", color: "#0B2F1A" },
  description: { color: "#5E7068", fontSize: 14, marginBottom: 20 },
  stats: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#F7FBF8",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#0B2F1A" },
  statLabel: { fontSize: 12, color: "#5E7068", marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2F1A",
    marginBottom: 12,
  },
  actions: { marginTop: 24, gap: 12 },
});
