import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function RecipeCard({ recipe, onPress, style, footer }) {
  const {
    title = 'Recipe Title',
    time = '— mins',
    difficulty = 'Easy',
    tags = [],
    imageUrl = null,
  } = recipe;

  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.card, style]} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.heroImage} />
      ) : (
        <View style={styles.heroPlaceholder}>
          <Text style={styles.placeholderLetter}>
            {(title || 'R').charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{time}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{difficulty}</Text>
        </View>

        <View style={styles.tagsRow}>
          {tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginVertical: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLetter: { fontSize: 28, color: '#2D6A4F', fontWeight: '700' },
  content: { padding: 12 },
  title: {
    color: '#0B2F1A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  metaText: {
    color: '#55696A',
    fontSize: 12,
  },
  metaDot: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});