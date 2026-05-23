import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StepList({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay pasos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preparación</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepDescription}>{step.descripcion}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#F4C95D',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4C95D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    color: '#1B1B1B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepDescription: {
    flex: 1,
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});