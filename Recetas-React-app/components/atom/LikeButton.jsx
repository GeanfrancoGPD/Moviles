import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getUserGroups, addRecipeToGroup } from "../../services/api";
import { useAuth } from "../context/AuthContext";

const AddToGroupButton = ({ recipeId, onAdded, style }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    if (modalVisible && user?.id) {
      loadGroups();
    }
  }, [modalVisible, user?.id]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await getUserGroups(user.id);
      // Soporta { success, data } o array directo
      const data = res?.success ? res.data : res;
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando grupos:", error);
      Alert.alert("Error", "No se pudieron cargar tus grupos");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedGroupId(null);
  };

  const handleAddToGroup = async () => {
    if (!selectedGroupId) {
      Alert.alert(
        "Selecciona un grupo",
        "Por favor elige un grupo para guardar la receta.",
      );
      return;
    }

    setAdding(true);
    try {
      const res = await addRecipeToGroup(selectedGroupId, recipeId);
      if (res && res.success === false)
        throw new Error(res.message ?? "Error al agregar");
      Alert.alert("Éxito", "Receta agregada al grupo correctamente");
      handleClose();
      if (onAdded) onAdded(selectedGroupId);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.message ?? "No se pudo agregar la receta al grupo",
      );
    } finally {
      setAdding(false);
    }
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.groupItem,
        selectedGroupId === item.id && styles.selectedGroupItem,
      ]}
      onPress={() => setSelectedGroupId(item.id)}
    >
      <Text style={styles.groupName}>{item.nombre}</Text>
      {selectedGroupId === item.id && <Text style={styles.checkMark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>➕ Grupo</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Agregar a grupo</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0B5D3C"
                style={styles.spinner}
              />
            ) : groups.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes grupos creados.</Text>
                <Text style={styles.emptySubtext}>
                  Crea un grupo desde la sección "Grupos"
                </Text>
              </View>
            ) : (
              <FlatList
                data={groups}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGroupItem}
                contentContainerStyle={{ paddingVertical: 8 }}
                style={styles.list}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  (!selectedGroupId || adding) && styles.disabledButton,
                ]}
                onPress={handleAddToGroup}
                disabled={adding || !selectedGroupId}
              >
                <Text style={styles.confirmButtonText}>
                  {adding ? "Agregando..." : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F4C95D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#2C3E50",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#0B2F1A",
  },
  spinner: { margin: 20 },
  list: { maxHeight: 280 },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    borderRadius: 8,
  },
  selectedGroupItem: {
    backgroundColor: "#F3FAF6",
  },
  groupName: {
    fontSize: 16,
    color: "#0B2F1A",
  },
  checkMark: {
    fontSize: 18,
    color: "#0B5D3C",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#0B5D3C",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#EEEEEE",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AddToGroupButton;
