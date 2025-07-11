import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Modal,
} from "react-native";

export default function TelaCadastro() {
  const router = useRouter();
  const [isVerificandoLogin, setIsVerificandoLogin] = useState(true);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaNovamente, setSenhaNovamente] = useState("");

  const [erros, setErros] = useState({
    nome: false,
    email: false,
    senha: false,
    senhaNovamente: false,
  });

  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        // if (token) router.replace('/perfil');
      } catch (error) {
        console.error("Erro ao verificar login:", error);
      } finally {
        setIsVerificandoLogin(false);
      }
    };
    verificarLogin();
  }, []);

  if (isVerificandoLogin) return null;

  const handleCadastrar = async () => {
  // Validação local inicial simples
  const novosErros = {
    nome: nome.trim() === "",
    email: email.trim() === "",
    senha: senha === "",
    senhaNovamente: senhaNovamente === "" || senhaNovamente !== senha,
  };

  setErros(novosErros);

  if (Object.values(novosErros).some(Boolean)) {
    setMensagemErro(
      "Preencha todos os campos corretamente e verifique as senhas."
    );
    setModalVisivel(true);
    return;
  }

  try {
    const response = await fetch("https://14becbe8f935.ngrok-free.app/auth/cadastro/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        senha,       // troquei para 'senha' pois no backend espera 'senha' e 'senha2'
        senha2: senhaNovamente,
        data_nascimento: "2000-01-01",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);
      await AsyncStorage.setItem("usuario", JSON.stringify(data.data));
      router.replace("/login");
    } else {
      // Limpa erros antes de setar
      setErros({ nome: false, email: false, senha: false, senhaNovamente: false });

      // data.errors é um objeto com campos e arrays de mensagens de erro
      if (data.errors) {
        // Pega o primeiro campo com erro
        const campoComErro = Object.keys(data.errors)[0];
        const mensagemCampo = data.errors[campoComErro][0];

        // Define erro apenas para o campo que deu problema
        setErros((old) => ({
          nome: campoComErro === "nome",
          email: campoComErro === "email",
          senha: campoComErro === "senha",
          senhaNovamente: campoComErro === "senha2" || campoComErro === "senhaNovamente",
        }));

        // Mostra a mensagem do backend (primeira do campo)
        setMensagemErro(mensagemCampo);
      } else {
        // Mensagem genérica
        setMensagemErro(data.message || "Erro ao cadastrar usuário.");
      }

      setModalVisivel(true);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    setMensagemErro(`Erro na requisição: ${msg}`);
    setModalVisivel(true);
  }
};


  const estiloInput = (campo: keyof typeof erros) =>
    erros[campo] ? styles.inputErro : styles.input;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Crie sua conta!</Text>

        <Text style={styles.label}>Nome de usuário</Text>
        <TextInput
          style={estiloInput("nome")}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={estiloInput("email")}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={estiloInput("senha")}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput
          style={estiloInput("senhaNovamente")}
          placeholder="Repita a senha"
          value={senhaNovamente}
          onChangeText={setSenhaNovamente}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.rodapeLink}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisivel} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Erro ao Cadastrar</Text>
            <Text style={styles.modalMensagem}>{mensagemErro}</Text>
            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={styles.modalBotao}
            >
              <Text style={styles.modalBotaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { width: 120, height: 120, marginBottom: 32 },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
    color: "#1e293b",
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
  },
  inputErro: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  rodape: { flexDirection: "row", marginTop: 24, gap: 4 },
  rodapeTexto: { color: "#64748b" },
  rodapeLink: { color: "#2563eb", fontWeight: "600" },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#dc2626",
  },
  modalMensagem: {
    fontSize: 14,
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 20,
  },
  modalBotao: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalBotaoTexto: { color: "white", fontWeight: "600", fontSize: 14 },
});
