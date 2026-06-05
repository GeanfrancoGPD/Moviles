import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import GroupForm from "../molecules/GroupForm";
import { createGroup } from "../../services/api";

const createGroupApi = async (groupData) => {
  const response = await createGroup(groupData);
  return response;
};

export default function CreateGroupPage({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    if (!user?.id) {
      Alert.alert("Error", "Debes iniciar sesión");
      navigation.navigate("Login");
      return;
    }

    setLoading(true);

    try {
      await createGroupApi(data);

      Alert.alert("Éxito", "Grupo creado correctamente");

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo crear el grupo",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Crear grupo</Text>
        </View>

        <GroupForm onSubmit={handleCreate} isLoading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3FAF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  backText: {
    color: "#0B5D3C",
    fontSize: 22,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0B2F1A",
  },
});
