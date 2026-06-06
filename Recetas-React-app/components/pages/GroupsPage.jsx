import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import GroupList from "../molecules/GroupList";
import { useAuth } from "../context/AuthContext";
import {
  getUserGroups,
  deleteGroup,
  getGroupRecipes,
} from "../../services/api";

//  Sustituir por llamada real al backend
const getUserGroupsApi = async (userId) => {
  console.log("Obtener grupos del usuario", userId);
  const data = await getUserGroups(userId);
  return data;
  // return [
  //   { id: 1, nombre: "Amigos", descripcion: "Recetas para compartir con amigos" },
  //   { id: 2, nombre: "Familia", descripcion: "Recetas para la familia" },
  // ];
};

const deleteGroupApi = async (groupId, userId, isOwner) => {
  console.log("Eliminar grupo", groupId, userId, isOwner);
  const data = await deleteGroup(groupId);
  return data;
};

export default function GroupsPage({ navigation }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setGroups([]);
        return;
      }
      const data = await getUserGroupsApi(user.id);

      const groupsWithCount = await Promise.all(
        (Array.isArray(data) ? data : []).map(async (group) => {
          try {
            const recipes = await getGroupRecipes(group.id);
            return {
              ...group,
              recetaCount: Array.isArray(recipes) ? recipes.length : 0,
            };
          } catch (error) {
            return {
              ...group,
              recetaCount: group.recetaCount ?? 0,
            };
          }
        }),
      );

      setGroups(groupsWithCount);
    } catch (error) {
      console.error(error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [user]),
  );

  const handleDeleteGroup = (group) => {
    Alert.alert(
      "Eliminar grupo",
      `¿Eliminar "${group.nombre}"?\n\nLas recetas que te pertenecen NO se eliminarán, solo perderán la asociación.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroupApi(group.id, user.id, true);
              setGroups((prev) => prev.filter((g) => g.id !== group.id));
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <GroupList
        groups={groups}
        loading={loading}
        onRefresh={loadGroups}
        onGroupPress={async (group) => {
          try {
            const recipes = await getGroupRecipes(group.id);
            navigation.navigate("GroupDetail", {
              groupId: group.id,
              groupName: group.nombre,
              group,
              preloadedRecipes: Array.isArray(recipes) ? recipes : [],
            });
          } catch (error) {
            navigation.navigate("GroupDetail", {
              groupId: group.id,
              groupName: group.nombre,
              group,
              preloadedRecipes: [],
            });
          }
        }}
        onGroupDelete={handleDeleteGroup}
        emptyMessage="No tienes grupos. Crea tu primer grupo."
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateGroup")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B5D3C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: { color: "#FFFFFF", fontSize: 28, fontWeight: "700" },
});
