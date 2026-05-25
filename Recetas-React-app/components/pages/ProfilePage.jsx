import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../atom/Button';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    navigation.replace('Login');
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={true}
      persistentScrollbar={true}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Mi Perfil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</Text>
          </View>

          <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || 'sin-correo@local'}</Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Estado</Text>
            <Text style={styles.metaValue}>Sesión activa</Text>
          </View>

          <Button title="Cerrar Sesión" onPress={handleLogout} />
        </View>
      </View>
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
  },
  title: {
    color: '#0B2F1A',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
  },
  profileCard: {
    backgroundColor: '#F7FBF8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1EFE6',
    padding: 18,
    gap: 12,
  },
  avatarCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#0B5D3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    color: '#0B2F1A',
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    color: '#5E7068',
    fontSize: 16,
  },
  metaBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EFE6',
    borderRadius: 14,
    padding: 12,
  },
  metaLabel: {
    color: '#5E7068',
    fontSize: 13,
    marginBottom: 4,
  },
  metaValue: {
    color: '#0B2F1A',
    fontSize: 15,
    fontWeight: '600',
  },
});