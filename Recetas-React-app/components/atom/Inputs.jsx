import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

export default function Input({
  placeholder,
  type,
  keyboardType,
  value,
  onChangeText,
}) {
  // Estado para controlar si se muestra el texto o se oculta con asteriscos
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.65)"
        style={styles.input}
        keyboardType={type === "email" ? keyboardType : undefined}
        // Si es password y "isPasswordVisible" es falso, se oculta el texto
        secureTextEntry={type === "password" && !isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      />

      {/* Solo mostramos el ojito si el tipo de input es "password" */}
      {type === "password" && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {/* Aquí puedes usar un icono de librerías como lucide-react-native o expo-vector-icons */}
          <Text style={styles.iconText}>{isPasswordVisible ? "👁️" : "🙈"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Alinea el input y el ojo horizontalmente
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1, // Hace que el input tome todo el espacio disponible dejando el ojo al final
    color: "#FFFFFF",
    paddingVertical: 14,
    fontSize: 15,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  iconText: {
    fontSize: 18,
  },
});
