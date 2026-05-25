import React from 'react';
import { View, Text } from 'react-native';

// Minimal non-SVG icon fallback: render a small letter/mark inside a circle.
export default function Icon({ name, size = 20, color = '#FFFFFF', style }) {
  const map = {
    time: 'T',
    difficulty: 'D',
    calories: 'C',
    servings: 'S',
    add: '+',
    edit: 'E',
    delete: 'X',
    share: 'SH',
    save: 'SV',
    group: 'G',
    search: 'S',
    filter: 'F',
    back: '<',
    close: 'x',
    check: 'v',
    arrowRight: '>',
    arrowLeft: '<',
    menu: 'M',
    heart: 'H',
    user: 'U',
    settings: 'S',
    camera: 'C',
  };

  const symbol = map[name];
  if (!symbol) return null;

  const bg = { backgroundColor: 'transparent' };

  return (
    <View style={style}>
      <Text style={{ color, fontSize: size }}>{symbol}</Text>
    </View>
  );
}