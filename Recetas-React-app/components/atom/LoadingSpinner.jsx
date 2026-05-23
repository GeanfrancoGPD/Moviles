import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F4C95D" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    color: '#CCCCCC',
    marginTop: 16,
    fontSize: 14,
  },
});