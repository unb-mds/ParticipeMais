import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }),
      });

      if (response.ok) {
        const data = await response.json();

        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        await AsyncStorage.setItem('nomeUsuario', data.user.nome);
        await AsyncStorage.setItem('usuario', JSON.stringify(data.user));

        const token = await AsyncStorage.getItem('accessToken');
        console.log("Access token salvo:", token);

        Alert.alert('Sucesso', data.message);

        router.push('/'); 

      } else {
        const errorData = await response.json();
        const mensagemErro = errorData.detail || JSON.stringify(errorData);
        Alert.alert('Erro', mensagemErro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro na requisição: ' + (error instanceof Error ? error.message : String(error)));
    }
  };





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
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
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
    marginBottom: 24,
    fontFamily: "Raleway_700Bold", // título em negrito
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Raleway_400Regular", // rótulo padrão
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: "Raleway_400Regular", // entrada de texto
  },
  termos: {
    fontSize: 12,
    color: "#666",
    marginVertical: 12,
    textAlign: "center",
    fontFamily: "Raleway_400Regular", // texto de termos
  },
  link: {
    color: "#1a73e8",
    textAlign: "center",
    marginVertical: 4,
    fontSize: 14,
    fontFamily: "Raleway_400Regular", // link normal
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
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold", // texto do botão com destaque
  },
});

