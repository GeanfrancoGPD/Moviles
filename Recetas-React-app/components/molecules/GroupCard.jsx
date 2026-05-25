import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../atom/Icon';

export default function GroupCard({ group, onPress, onDelete }) {
  const { nombre, descripcion, recetaCount = 0 } = group;

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="group" size={24} color="#0B5D3C" />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{nombre}</Text>
          {descripcion ? (
            <Text style={styles.description} numberOfLines={2}>{descripcion}</Text>
          ) : null}
          <Text style={styles.meta}>{recetaCount} recetas</Text>
        </View>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Icon name="delete" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEFE4',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3FAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#0B2F1A',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: '#5E7068',
    fontSize: 13,
    marginBottom: 4,
  },
  meta: {
    color: '#0B5D3C',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
});