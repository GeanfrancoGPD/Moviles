import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../atom/Button';
import { useAuth } from '../context/AuthContext';
import { deleteUserAccount } from '../../services/api';

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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es irreversible. Se borrarán todos tus datos, recetas y grupos. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount(user.id);
              await logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la cuenta');
            }
          }
        }
      ]
    );
  };

  const userName = user?.name || user?.nombre || 'Usuario';
  const userEmail = user?.email || user?.gmail || 'sin-correo@local';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Perfil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>

          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Estado</Text>
            <Text style={styles.metaValue}>Sesión activa</Text>
          </View>

          <Button title="Contraseña y seguridad" onPress={() => navigation.navigate('AccountSecurity')} />
          <Button title="Cerrar Sesión" onPress={handleLogout} />
          <Button title="Eliminar cuenta" onPress={handleDeleteAccount} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16 },
  title: { color: '#0B2F1A', fontSize: 26, fontWeight: '700', marginBottom: 14 },
  profileCard: { backgroundColor: '#F7FBF8', borderRadius: 20, borderWidth: 1, borderColor: '#E1EFE6', padding: 18, gap: 12 },
  avatarCircle: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#0B5D3C', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  name: { color: '#0B2F1A', fontSize: 22, fontWeight: '700' },
  email: { color: '#5E7068', fontSize: 16 },
  metaBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1EFE6', borderRadius: 14, padding: 12 },
  metaLabel: { color: '#5E7068', fontSize: 13, marginBottom: 4 },
  metaValue: { color: '#0B2F1A', fontSize: 15, fontWeight: '600' },
});