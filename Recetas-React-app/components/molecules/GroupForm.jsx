import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Input from "../atom/Inputs";
import Button from "../atom/Button";

export default function GroupForm({
  initialData = { nombre: "", descripcion: "" },
  onSubmit,
  submitLabel = "Crear grupo",
  isLoading = false,
}) {
  const [nombre, setNombre] = useState(initialData.nombre);
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!nombre.trim()) {
      setError("El nombre del grupo es obligatorio");
      return;
    }
    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (nombre.length > 50) {
      setError("El nombre no puede exceder 50 caracteres");
      return;
    }
    setError("");
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del grupo</Text>
      <Input
        placeholder="Ej. Desayunos saludables"
        value={nombre}
        onChangeText={setNombre}
        style={error ? styles.inputError : null}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Descripción (opcional)</Text>
      <Input
        placeholder="Describe el propósito del grupo..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Button title={submitLabel} onPress={handleSubmit} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  label: { color: "#1F3B2D", fontSize: 14, fontWeight: "600", marginTop: 8 },
  inputError: { borderColor: "#FF6B6B" },
  error: { color: "#FF6B6B", fontSize: 12, marginTop: -8 },
});
