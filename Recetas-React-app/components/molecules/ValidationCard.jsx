import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "../molecules/Card";

export default function ValidationCard({ focusedField, value }) {
  const textValue = value ?? "";

  if (!focusedField) {
    return null;
  }

  const validationRules = {
    emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue),
    passwordMayuscula: /[A-Z]/.test(textValue),
    passwordMinuscula: /[a-z]/.test(textValue),
    passwordLongitud: textValue.length >= 6,
  };

  if (focusedField === "email") {
    return (
      <Card title="Validación de correo">
        <Text style={styles.helperText}>
          Usa un correo con formato válido para continuar.
        </Text>
        <View style={styles.ruleRow}>
          <View
            style={[
              styles.statusDot,
              validationRules.emailValido ? styles.statusOk : styles.statusNo,
            ]}
          />
          <Text
            style={[
              styles.ruleText,
              validationRules.emailValido ? styles.valid : styles.invalid,
            ]}
          >
            {validationRules.emailValido ? "Correo válido" : "Correo inválido"}
          </Text>
        </View>
      </Card>
    );
  }

  if (focusedField === "password") {
    return (
      <Card title="Requisitos de contraseña">
        <Text style={styles.helperText}>
          La contraseña debe cumplir estas reglas antes de entrar.
        </Text>

        <RuleItem
          label="Al menos una mayúscula"
          valid={validationRules.passwordMayuscula}
        />
        <RuleItem
          label="Al menos una minúscula"
          valid={validationRules.passwordMinuscula}
        />
        <RuleItem
          label="Mínimo 6 caracteres"
          valid={validationRules.passwordLongitud}
        />
      </Card>
    );
  }

  return null;
}

function RuleItem({ label, valid }) {
  return (
    <View style={styles.ruleRow}>
      <View
        style={[styles.statusDot, valid ? styles.statusOk : styles.statusNo]}
      />
      <Text style={[styles.ruleText, valid ? styles.valid : styles.invalid]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  helperText: {
    color: "rgba(255, 255, 255, 0.74)",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusOk: {
    backgroundColor: "#6AD27A",
  },
  statusNo: {
    backgroundColor: "#FF6B6B",
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  valid: {
    color: "#DFF7E3",
  },
  invalid: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
