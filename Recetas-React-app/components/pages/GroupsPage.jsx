import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GroupList from './GroupList';
import { useAuth } from '../context/AuthContext';
import { getUserGroups } from '../../services/api';

const MOCK_GROUPS = [
  { id: 1, nombre: 'Desayunos Saludables', descripcion: 'Para empezar bien el día', recetaCount: 3 },
  { id: 2, nombre: 'Cenas Rápidas', descripcion: 'Listas en 30 min o menos', recetaCount: 5 },
];

export default function GroupsPage({ navigation }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setGroups(MOCK_GROUPS);
        return;
      }

      const data = await getUserGroups(user.id);
      setGroups(Array.isArray(data) && data.length > 0 ? data : MOCK_GROUPS);
    } catch (error) {
      console.error(error);
      setGroups(MOCK_GROUPS);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  const handleDeleteGroup = (group) => {
    Alert.alert(
      'Eliminar grupo',
      `¿Estás seguro de que quieres eliminar el grupo "${group.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setGroups(groups.filter(g => g.id !== group.id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GroupList
        groups={groups}
        onGroupPress={(group) => navigation.navigate('GroupDetail', { groupId: group.id, groupName: group.nombre })}
        onGroupDelete={handleDeleteGroup}
        emptyMessage="No tienes grupos. ¡Crea tu primer grupo!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});