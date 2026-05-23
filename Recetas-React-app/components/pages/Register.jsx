import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Input from "../atom/Inputs";
import Button from "../atom/Button";
import Card from "../molecules/Card";
import ValidationCard from "../molecules/ValidationCard";
import { API_URL } from "@env";

const imageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCi1BRrDqNfPWjt1gBro2agzG7k2-5XE4X6lIikweuiChxIgNZSAd_xFZAcU9VYCCfqwAv7qE0LFAyLz4pQxtCl8paK5N2xWB2Aa9hTjVNgC6RkMGxLOJxyZpVF80zQNBnZDcWX-5R37D1F652k9DwIuLFN33Kavrr6A_fvIWVw-8QqJMSz3z8ktxe4eBPUtGNQ5I0Wu65SCbGq3STHyrocHzdTlHfGJfTtTN9OfeIlQsBCmLvpt7quFiJxpadIJqGaxGTN7Ov1zGoE";

export default function Register({ navigation }) {
  const [gmail, setgmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = () => {
    setErrorMessage("");

    if (!name || !gmail || !password || !confirmPassword) {
      setErrorMessage("Por favor, rellena todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    console.log("Campos validados correctamente. Enviando a la API...");
    console.log("Datos enviados:", API_URL);
    fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        gmail: gmail,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Registro exitoso");
        }
      })
      .catch((error) => {
        console.error("Error al registrar:", error);
        setErrorMessage("Error al registrar. Por favor, inténtalo de nuevo.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* CORRECCIÓN: El estilo 'styles.image' ahora asegura el flex: 1 aquí dentro */}
        <ImageBackground source={{ uri: imageUri }} style={styles.image}>
          <View style={styles.overlay} />
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.hero}>
              <Text style={styles.kicker}>Comienza aquí</Text>
              <Text style={styles.title}>Crea tu cuenta</Text>
              <Text style={styles.subtitle}>
                Regístrate para guardar y compartir tus recetas favoritas.
              </Text>
            </View>

            <Card title="Registro">
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Input
                placeholder="Nombre completo"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField("name")}
                onBlur={() =>
                  setFocusedField((currentField) =>
                    currentField === "name" ? null : currentField,
                  )
                }
              />

              <Input
                placeholder="Correo electrónico"
                keyboardType="email-address"
                type="email"
                autoCapitalize="none"
                value={gmail}
                onChangeText={setgmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() =>
                  setFocusedField((currentField) =>
                    currentField === "email" ? null : currentField,
                  )
                }
              />
              {focusedField === "email" && (
                <ValidationCard focusedField={focusedField} value={gmail} />
              )}

              <Input
                placeholder="Contraseña"
                type="password"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() =>
                  setFocusedField((currentField) =>
                    currentField === "password" ? null : currentField,
                  )
                }
              />
              {focusedField === "password" && (
                <ValidationCard focusedField={focusedField} value={password} />
              )}

              <Input
                placeholder="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() =>
                  setFocusedField((currentField) =>
                    currentField === "confirmPassword" ? null : currentField,
                  )
                }
              />

              <Button title="Registrarse" onPress={handleRegister} />

              <Text
                style={styles.footerText}
                onPress={() => navigation.navigate("Login")}
              >
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.link}>Iniciar sesión</Text>
              </Text>
            </Card>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  image: {
    flex: 1, // Garantiza que la imagen de fondo ocupe todo el espacio recalculado por el teclado
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 12, 12, 0.62)",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  hero: {
    marginBottom: 24,
  },
  kicker: {
    color: "#F4C95D",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    maxWidth: 320,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 340,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 75, 75, 0.15)",
    borderColor: "rgba(255, 75, 75, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF4B4B",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.78)",
    textAlign: "center",
    fontSize: 13,
    marginTop: 16,
  },
  link: {
    color: "#F4C95D",
    fontWeight: "600",
  },
});
