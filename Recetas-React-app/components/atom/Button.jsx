import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
  compact = false,
  active = false,
  containerStyle,
  textStyle,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.button,
        compact && styles.compactButton,
        active && styles.activeButton,
        containerStyle,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, compact && styles.compactText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0B5D3C",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 2,
  },
  compactButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    minWidth: 0,
    marginTop: 0,
  },
  activeButton: {
    backgroundColor: "#0B5D3C",
    shadowColor: "#0B5D3C",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  compactText: {
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
