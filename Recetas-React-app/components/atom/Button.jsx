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
    backgroundColor: "#F4C95D",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 2,
  },
  buttonText: {
    color: "#1B1B1B",
    fontSize: 16,
    fontWeight: "800",
  },
});
