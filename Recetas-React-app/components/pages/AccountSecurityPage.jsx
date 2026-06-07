import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Button from '../atom/Button';
import { useAuth } from '../context/AuthContext';
import { updatePassword, updateUserProfile } from '../../services/api';

function AccordionSection({ title, expanded, onToggle, children }) {
  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '▴' : '▾'}</Text>
      </TouchableOpacity>

      {expanded ? <View style={styles.sectionBody}>{children}</View> : null}
    </View>
  );
}

export default function AccountSecurityPage({ navigation }) {
  const { user, updateUserSession } = useAuth();
  const [openSection, setOpenSection] = useState('user');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setUserName(user?.name || '');
    setUserEmail(user?.email || '');
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      if (!user?.id) {
        throw new Error('No hay usuario autenticado');
      }

      if (!userName.trim() || !userEmail.trim()) {
        Alert.alert('Faltan datos', 'Debes completar nombre y correo.');
        return;
      }

      const updatedProfile = await updateUserProfile({
        id: user.id,
        nombre: userName.trim(),
        gmail: userEmail.trim(),
      });

      const nextUser = updatedProfile?.[0]
        ? { ...user, ...updatedProfile[0], name: updatedProfile[0].nombre || updatedProfile[0].name || userName.trim(), email: updatedProfile[0].email || updatedProfile[0].gmail || userEmail.trim() }
        : { ...user, name: userName.trim(), email: userEmail.trim() };

      await updateUserSession(nextUser);
      Alert.alert('Éxito', 'El usuario se actualizó correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el usuario.');
    }
  };

  const handleConfirmSaveProfile = () => {
    Alert.alert(
      'Confirmar modificación',
      '¿Seguro que quieres editar usuario y contraseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', onPress: handleSaveProfile },
      ],
    );
  };

  const handleSavePassword = async () => {
    try {
      if (!user?.id) {
        throw new Error('No hay usuario autenticado');
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Faltan datos', 'Completa todos los campos de contraseña.');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Validación', 'La nueva contraseña y su confirmación no coinciden.');
        return;
      }

      await updatePassword({
        id: user.id,
        password: newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Éxito', 'La contraseña se actualizó correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar la contraseña.');
    }
  };

  const handleConfirmSavePassword = () => {
    Alert.alert(
      'Confirmar modificación',
      '¿Seguro que quieres modificar la clave?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', onPress: handleSavePassword },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción aún no está conectada al backend.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Home', { screen: 'Perfil' })}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Volver al perfil</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Contraseña y seguridad</Text>

      <AccordionSection
        title="Editar usuario"
        expanded={openSection === 'user'}
        onToggle={() => setOpenSection((current) => (current === 'user' ? null : 'user'))}
      >
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Escribe tu nombre"
          placeholderTextColor="#8A8A8A"
          style={styles.input}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          value={userEmail}
          onChangeText={setUserEmail}
          placeholder="Escribe tu correo"
          placeholderTextColor="#8A8A8A"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Button title="Guardar usuario" onPress={handleConfirmSaveProfile} />
      </AccordionSection>

      <AccordionSection
        title="Editar contraseña"
        expanded={openSection === 'password'}
        onToggle={() => setOpenSection((current) => (current === 'password' ? null : 'password'))}
      >
        <Text style={styles.label}>Contraseña actual</Text>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Contraseña actual"
          placeholderTextColor="#8A8A8A"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nueva contraseña"
          placeholderTextColor="#8A8A8A"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repite la nueva contraseña"
          placeholderTextColor="#8A8A8A"
          secureTextEntry
          style={styles.input}
        />

        <Button title="Guardar contraseña" onPress={handleConfirmSavePassword} />
      </AccordionSection>

      <View style={styles.deleteBox}>
        <Text style={styles.deleteTitle}>Eliminar cuenta</Text>
        <Text style={styles.deleteText}>
          Esta acción es permanente y eliminará tu acceso y tus datos asociados.
        </Text>
        <Button title="Eliminar cuenta" onPress={handleDeleteAccount} />
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
    paddingBottom: 28,
    gap: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  backButtonText: {
    color: '#2D6A4F',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: '#0B2F1A',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionCard: {
    backgroundColor: '#F7FBF8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1EFE6',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    color: '#0B2F1A',
    fontSize: 17,
    fontWeight: '700',
  },
  chevron: {
    color: '#2D6A4F',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  label: {
    color: '#5E7068',
    fontSize: 13,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EFE6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0B2F1A',
    fontSize: 15,
  },
  deleteBox: {
    backgroundColor: '#FFF7F5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1D8D3',
    padding: 16,
    gap: 10,
  },
  deleteTitle: {
    color: '#8E2C22',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteText: {
    color: '#7E5A55',
    fontSize: 14,
    lineHeight: 20,
  },
});