import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import GroupForm from '../molecules/GroupForm';

//  Sustituir por llamada real al backend
const createGroupApi = async (groupData) => {
  console.log('Crear grupo:', groupData);
  return { id: Date.now(), ...groupData };
};

export default function CreateGroupPage({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data) => {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión');
      navigation.navigate('Login');
      return;
    }
    setLoading(true);
    try {
      await createGroupApi({ ...data, usuario_id: user.id });
      Alert.alert('Éxito', 'Grupo creado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crear grupo</Text>
      </View>
      <GroupForm onSubmit={handleCreate} isLoading={loading} />
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