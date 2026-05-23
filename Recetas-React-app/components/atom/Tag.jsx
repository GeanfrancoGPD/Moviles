// components/atoms/Tag.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tag({ label, color = '#F4C95D', variant = 'default' }) {
  const tagStyles = {
    default: { backgroundColor: 'rgba(255,255,255,0.12)' },
    primary: { backgroundColor: color },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color },
  };

  return (
    <View style={[styles.tag, tagStyles[variant]]}>
      <Text style={[styles.text, variant === 'primary' && { color: '#1B1B1B' }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DDDDDD',
  },
});