import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform, // Necesario para ajustar el comportamiento según el sistema operativo
} from "react-native";
import Input from "../atom/Inputs";
import Button from "../atom/Button";
import Card from "../molecules/Card";
import ValidationCard from "../molecules/ValidationCard";
import { API_URL } from "@env";

const imageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCi1BRrDqNfPWjt1gBro2agzG7k2-5XE4X6lIikweuiChxIgNZSAd_xFZAcU9VYCCfqwAv7qE0LFAyLz4pQxtCl8paK5N2xWB2Aa9hTjVNgC6RkMGxLOJxyZpVF80zQNBnZDcWX-5R37D1F652k9DwIuLFN33Kavrr6A_fvIWVw-8QqJMSz3z8ktxe4eBPUtGNQ5I0Wu65SCbGq3STHyrocHzdTlHfGJfTtTN9OfeIlQsBCmLvpt7quFiJxpadIJqGaxGTN7Ov1zGoE";

export default function Login({ navigation }) {
  const [gmail, setgmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [focusedField, setFocusedField] = React.useState(null);

  const handleLogin = () => {
    setErrorMessage("");

    if (!gmail || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    console.log("Campos validados correctamente. Enviando a la API...");
    console.log("Datos enviados:", API_URL);
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gmail: gmail,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta de la API:", data);
        if (!data.success) {
          setErrorMessage(data.message);
        } else {
          // navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        setErrorMessage(
          "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
        );
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Envolvemos todo el contenido dentro de KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ImageBackground source={{ uri: imageUri }} style={styles.image}>
          <View style={styles.overlay} />
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
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

              {focusedField === "email" ? (
                <ValidationCard focusedField={focusedField} value={gmail} />
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

              {/* --- CAMPO CONTRASEÑA --- */}
              {focusedField === "password" ? (
                <ValidationCard focusedField={focusedField} value={password} />
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

              <Button
                title="Entrar"
                onPress={() => {
                  handleLogin();
                }}
              />

              <Text
                style={styles.footerText}
                onPress={() => navigation.navigate("Register")}
              >
                ¿No tienes cuenta?
              </Text>
              <Text style={styles.footerText}>¿Olvidaste tu contraseña?</Text>
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
    flex: 1, // 3. Esto es crucial para que el KeyboardAvoidingView ocupe toda la pantalla
  },
  image: {
    flex: 1,
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
  footerText: {
    color: "rgba(255, 255, 255, 0.78)",
    textAlign: "center",
    fontSize: 13,
    marginTop: 12, // Aumenté un poco el margen superior para que no se pegue tanto
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
});
