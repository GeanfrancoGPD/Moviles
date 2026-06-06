import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, FlatList } from 'react-native';
import Button from './Button';

export default function LikeButton({
  recipeId,
  initialLiked = false,
  onLikeToggle,
  onAddToGroup,
  userGroups = [],
  size = 'small',
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleLikePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newLiked = !liked;
      const result = await onLikeToggle(recipeId, newLiked);
      setLiked(result.liked);

      if (newLiked && userGroups.length > 0) {
        setSelectedGroups([]);
        setShowGroupModal(true);
      }
    } catch (error) {
      setLiked(liked);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroups = async () => {
    if (selectedGroups.length === 0) {
      setShowGroupModal(false);
      return;
    }
    setLoading(true);
    try {
      if (onAddToGroup) {
        await onAddToGroup(recipeId, selectedGroups);
      }
      setShowGroupModal(false);
    } catch (error) {
      console.error("Error adding to groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const fontSize = size === 'small' ? 12 : 14;

  return (
    <>
      <TouchableOpacity
        style={[styles.container, liked && styles.containerLiked]}
        onPress={handleLikePress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { fontSize }, liked && styles.likedText]}>
          {liked ? 'Liked' : 'Like'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showGroupModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar a grupos</Text>
            <Text style={styles.modalSubtitle}>Selecciona los grupos donde quieras incluir esta receta:</Text>
            <FlatList
              data={userGroups}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.groupItem} onPress={() => toggleGroupSelection(item.id)}>
                  <View style={[styles.checkbox, selectedGroups.includes(item.id) && styles.checked]} />
                  <Text style={styles.groupName}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              style={styles.groupList}
            />
            <View style={styles.modalButtons}>
              <Button title="Omitir" onPress={() => setShowGroupModal(false)} compact />
              <Button title="Agregar" onPress={handleAddToGroups} compact />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#F7FBF8',
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E1EFE6',
  },
  containerLiked: {
    backgroundColor: '#0B5D3C',
    borderColor: '#0B5D3C',
  },
  buttonText: {
    color: '#5E7068',
    fontWeight: '600',
  },
  likedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B2F1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#5E7068',
    marginBottom: 16,
  },
  groupList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1EFE6',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0B5D3C',
    marginRight: 12,
  },
  checked: {
    backgroundColor: '#0B5D3C',
  },
  groupName: {
    fontSize: 16,
    color: '#0B2F1A',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});