import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SearchBar({
  value = '',
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Buscar...',
  style,
  containerStyle,
  inputStyle,
  showClearButton = true,
  autoCorrect = false,
  autoCapitalize = 'none',
  returnKeyType = 'search',
  leftIcon = '⌕',
  ...textInputProps
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }

    if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Text style={styles.icon}>{leftIcon}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor="#8A8A8A"
        style={[styles.input, inputStyle]}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        {...textInputProps}
      />

      {showClearButton && value.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4EF',
    borderWidth: 1,
    borderColor: '#E3DDD4',
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  icon: {
    color: '#355E4B',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1E2C26',
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E2D8',
    marginLeft: 8,
  },
  clearText: {
    color: '#355E4B',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
  },
});