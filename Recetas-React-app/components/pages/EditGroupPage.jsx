import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import GroupForm from '../molecules/GroupForm';

//  Sustituir por llamada real al backend
const getGroupByIdApi = async (id) => {
  console.log('Obtener grupo', id);
  return { id, nombre: 'Grupo ejemplo', descripcion: 'Descripción' };
};
const updateGroupApi = async (id, data) => {
  console.log('Actualizar grupo', id, data);
  return { id, ...data };
};

export default function EditGroupPage({ route, navigation }) {
  const { groupId, group } = route.params;
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      if (group) {
        setInitialData(group);
      } else if (groupId) {
        try {
          const data = await getGroupByIdApi(groupId);
          setInitialData(data);
        } catch {
          Alert.alert('Error', 'No se pudo cargar el grupo');
          navigation.goBack();
        }
      }
    };
    fetchGroup();
  }, []);

  const handleUpdate = async (data) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await updateGroupApi(groupId || group.id, { ...data, usuario_id: user.id });
      Alert.alert('Éxito', 'Grupo actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3FAF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { color: '#0B5D3C', fontSize: 20, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700', color: '#0B2F1A' },
});