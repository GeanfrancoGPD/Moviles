import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import GroupCard from '../molecules/GroupCard';

export default function GroupList({ 
  groups, 
  onGroupPress, 
  onGroupDelete,
  emptyMessage = 'No hay grupos creados',
}) {
  if (!groups || groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      showsVerticalScrollIndicator={true}
      persistentScrollbar={true}
      renderItem={({ item }) => (
        <GroupCard
          group={item}
          onPress={() => onGroupPress?.(item)}
          onDelete={() => onGroupDelete?.(item)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});