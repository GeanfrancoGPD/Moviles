import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
