import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/icon.png")} // caminho da imagem local
        style={styles.logo}
        resizeMode="contain" // evita cortes na imagem
      />

      {/* Título */}
      <Text style={styles.titulo}>Entre na sua conta</Text>

      {/* Input E-mail */}
      <Text style={styles.label}>Insira seu e-mail por favor:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input Senha */}
      <Text style={styles.label}>Insira sua senha por favor:</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* Termos */}
      <Text style={styles.termos}>Aceito termos e serviços de uso</Text>

      {/* Links */}
      <TouchableOpacity>
        <Text style={styles.link}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.link}>Ainda não possui uma conta?</Text>
      </TouchableOpacity>

      {/* Botão Entrar */}
      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: "contain",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  termos: {
    fontSize: 12,
    color: "#666",
    marginVertical: 12,
    textAlign: "center",
  },
  link: {
    color: "#1a73e8",
    textAlign: "center",
    marginVertical: 4,
    fontSize: 14,
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    marginTop: 24,
    width: "100%",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
