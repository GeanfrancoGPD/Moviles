import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// Importación corregida de la librería especializada
import { SafeAreaView } from "react-native-safe-area-context";

import Input from "../atom/Inputs";
import Button from "../atom/Button";
import Card from "../molecules/Card";
import ValidationCard from "../molecules/ValidationCard";
import { useAuth } from "../context/AuthContext";

const imageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCi1BRrDqNfPWjt1gBro2agzG7k2-5XE4X6lIikweuiChxIgNZSAd_xFZAcU9VYCCfqwAv7qE0LFAyLz4pQxtCl8paK5N2xWB2Aa9hTjVNgC6RkMGxLOJxyZpVF80zQNBnZDcWX-5R37D1F652k9DwIuLFN33Kavrr6A_fvIWVw-8QqJMSz3z8ktxe4eBPUtGNQ5I0Wu65SCbGq3STHyrocHzdTlHfGJfTtTN9OfeIlQsBCmLvpt7quFiJxpadIJqGaxGTN7Ov1zGoE";

export default function Login({ navigation }) {
  const { login } = useAuth();
  const [gmail, setgmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [focusedField, setFocusedField] = React.useState(null);

  const handleLogin = async () => {
    setErrorMessage("");
    if (!gmail || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña.");
      return;
    }
    try {
      await login(gmail, password);
      navigation.replace("Home");
    } catch (err) {
      setErrorMessage(err.message || "Credenciales incorrectas");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ImageBackground source={{ uri: imageUri }} style={styles.image}>
          <View style={styles.overlay} />
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.kicker}>Bienvenido</Text>
              <Text style={styles.title}>Recetas que te acompañan</Text>
              <Text style={styles.subtitle}>
                Ingresa para guardar tus recetas favoritas y descubrir nuevas
                ideas.
              </Text>
            </View>

            <Card title="Iniciar sesión">
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Input
                placeholder="Correo electrónico"
                keyboardType="email-address"
                type="email"
                value={gmail}
                autoCapitalize="none"
                onChangeText={setgmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() =>
                  setFocusedField((currentField) =>
                    currentField === "email" ? null : currentField,
                  )
                }
              />

              {focusedField === "email" ? (
                <ValidationCard focusedField={focusedField} value={gmail} />
              ) : null}

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

              {focusedField === "password" ? (
                <ValidationCard focusedField={focusedField} value={password} />
              ) : null}

              <Button title="Entrar" onPress={handleLogin} />

              <Text
                style={styles.footerText}
                onPress={() => navigation.navigate("Register")}
              >
                ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text>
              </Text>
            </Card>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111111" },
  keyboardAvoidingView: { flex: 1 },
  image: { flex: 1 },
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
  hero: { marginBottom: 24 },
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
  footerText: {
    color: "rgba(255, 255, 255, 0.78)",
    textAlign: "center",
    fontSize: 13,
    marginTop: 16,
  },
  link: { color: "#F4C95D", fontWeight: "600" },
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
});
