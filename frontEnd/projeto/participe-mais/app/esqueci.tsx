import React, { useState } from "react";
import { useRouter } from "expo-router";
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

export default function TelaCadastro() {
  const [email, setEmail] = useState("");
  const [temErro, setTemErro] = useState(false);
  const router = useRouter();

  const handleEnviar = () => {
    if (!email.trim()) {
      setTemErro(true);
      Alert.alert("Erro", "Por favor, preencha o campo de e-mail.");
      return;
    }

    setTemErro(false);
    Alert.alert("Sucesso", "Email enviado com sucesso!");
    // router.push('/') ou outra ação
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título */}
      <Text style={styles.titulo}>Esqueceu sua senha?</Text>
      <Text style={styles.descricao}>
        Não se preocupe, enviaremos um código para seu e-mail.
      </Text>

      {/* Input E-mail */}
      <Text style={styles.label}>Insira seu e-mail por favor:</Text>
      <TextInput
        style={[styles.input, temErro && styles.inputErro]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>

      {/* Voltar para login */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Voltar para login</Text>
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
  },
  titulo: {
    fontSize: 20,
    marginBottom: 12,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
  },
  descricao: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Raleway_400Regular",
    color: "#444",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Raleway_400Regular",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: "Raleway_400Regular",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputErro: {
    borderColor: "red",
    borderWidth: 2,
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    marginTop: 12,
    width: "100%",
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  link: {
    color: "#1a73e8",
    textAlign: "center",
    marginVertical: 16,
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
  },
});
