import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../atom/Inputs';

export default function StepEditorList({
  steps,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepBlock}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{index + 1}</Text>
          </View>
          <View style={styles.stepInputContainer}>
            <Input
              placeholder={index === 0 ? 'Describe el primer paso...' : 'Describe el siguiente paso...'}
              value={step.descripcion}
              onChangeText={(value) => onUpdate(index, value)}
              multiline
            />
          </View>
          <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeStepButton}>
            <Text style={styles.removeStepText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={onAdd} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>+ Agregar Paso</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B5D3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepInputContainer: {
    flex: 1,
  },
  removeStepButton: {
    marginTop: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  removeStepText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '700',
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  linkButtonText: {
    color: '#0B5D3C',
    fontWeight: '700',
    fontSize: 14,
  },
});
