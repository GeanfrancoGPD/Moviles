import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function LikeButton({
  recipeId,
  initialLiked = false,
  onLikeToggle,
  size = 'small',
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      if (onLikeToggle) await onLikeToggle(recipeId, newLiked);
    } catch (error) {
      setLiked(liked);
    } finally {
      setLoading(false);
    }
  };

  const fontSize = size === 'small' ? 12 : 14;

  return (
    <TouchableOpacity
      style={[styles.container, liked && styles.containerLiked]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { fontSize }, liked && styles.likedText]}>
        {liked ? 'Liked' : 'Like'}
      </Text>
    </TouchableOpacity>
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
});