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
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function TelaRecuperacaoSenha() {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Título e descrição */}
        <View style={styles.textContainer}>
          <Text style={styles.titulo}>Esqueceu sua senha?</Text>
          <Text style={styles.descricao}>
            Não se preocupe, enviaremos um código para seu e-mail.
          </Text>
        </View>

        {/* Input E-mail */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, temErro && styles.inputErro]}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="send"
        />

        {/* Botão */}
        <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
          <Text style={styles.botaoTexto}>Enviar código</Text>
        </TouchableOpacity>

        {/* Voltar para login */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Lembrou sua senha?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.rodapeLink}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  textContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1e293b",
    textAlign: "center",
  },
  descricao: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748b",
    maxWidth: 300,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 8,
    color: "#475569",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  inputErro: {
    borderColor: "#dc2626",
    borderWidth: 1,
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  rodape: {
    flexDirection: "row",
    marginTop: 24,
    gap: 4,
  },
  rodapeTexto: {
    color: "#64748b",
  },
  rodapeLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});