import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../atom/Inputs";
import Button from "../atom/Button";
import Card from "../molecules/Card";

const imageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCi1BRrDqNfPWjt1gBro2agzG7k2-5XE4X6lIikweuiChxIgNZSAd_xFZAcU9VYCCfqwAv7qE0LFAyLz4pQxtCl8paK5N2xWB2Aa9hTjVNgC6RkMGxLOJxyZpVF80zQNBnZDcWX-5R37D1F652k9DwIuLFN33Kavrr6A_fvIWVw-8QqJMSz3z8ktxe4eBPUtGNQ5I0Wu65SCbGq3STHyrocHzdTlHfGJfTtTN9OfeIlQsBCmLvpt7quFiJxpadIJqGaxGTN7Ov1zGoE";

export default function Login({ navigation }) {
  const [gmail, setgmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleLogin = () => {
    setErrorMessage("");

    if (!gmail || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    console.log("Campos validados correctamente. Enviando a la API...");
    console.log("datos:", gmail, password);

    fetch("http://localhost:5000/api/login", {
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
        // Manejar la respuesta de la API aquí
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
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              type="email"
              value={gmail}
              autoCapitalize="none"
              onChangeText={setgmail}
            />

            <Input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChangeText={setPassword}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
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
    marginTop: 4,
  },
});
