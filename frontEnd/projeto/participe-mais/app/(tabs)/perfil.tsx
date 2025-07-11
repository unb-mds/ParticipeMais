import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;

const niveis = [
  { nome: "Iniciante Cívico", minimo: 0 },
  { nome: "Votante Iniciante", minimo: 50 },
  { nome: "Ativador de Temas", minimo: 100 },
  { nome: "Cidadão Participativo", minimo: 150 },
  { nome: "Explorador de Temas", minimo: 250 },
  { nome: "Construtor de Vozes", minimo: 350 },
  { nome: "Guardião do Debate", minimo: 450 },
  { nome: "Conselheiro Político", minimo: 550 },
  { nome: "Líder Comunitário", minimo: 650 },
  { nome: "Mestre Cívico", minimo: 800 },
];

export default function PerfilScreen() {
  const router = useRouter();
  const [usuarioCarregado, setUsuarioCarregado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [score, setScore] = useState<{ xp: number; nivel: number } | null>(
    null
  );
  const [nivel, setNivel] = useState<number>(0);
  const [abaAtiva, setAbaAtiva] = useState<
    "descubra" | "comunidade" | "pesquisar"
  >("descubra");
  const [nome, setNome] = useState<string>("Usuário");
  const [loading, setLoading] = useState(true);
  const campos = ["nome", "email", "senha"] as const;

  type Campo = (typeof campos)[number];

  const [dados, setDados] = useState({ nome: "", email: "", senha: "" });
  const [formEditado, setFormEditado] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const carregarInformacoes = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem("accessToken");
        const usuarioSalvo = await AsyncStorage.getItem("usuario");

        if (!tokenSalvo) {
          router.replace("/login");
          return;
        }

        setToken(tokenSalvo);

        if (usuarioSalvo) {
          const userObj = JSON.parse(usuarioSalvo);
          setDados({
            nome: userObj.nome || "",
            email: userObj.email || "",
            senha: "",
          });
        }

        setUsuarioCarregado(true);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        router.replace("/login");
      }
    };

    carregarInformacoes();
  }, []);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(
          "https://14becbe8f935.ngrok-free.app/comunidade/score/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // aqui usamos o mesmo formato da ScoreScreen
        if (data?.pontos !== undefined) {
          setScore({ xp: data.pontos, nivel: 1 }); // nivel opcional
          setNome(data.usuario);
        } else {
          console.warn("Resposta inesperada:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  const handleSalvar = () => {
    setFormEditado(false);
    Alert.alert("Sucesso", "Dados salvos com sucesso!");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://14becbe8f935.ngrok-free.app/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await AsyncStorage.multiRemove(["usuario", "accessToken"]);
        Alert.alert("Você saiu da conta com sucesso!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Erro ao sair da conta",
          errorData.detail || "Erro inesperado"
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível se desconectar.");
    }
  };

  if (usuarioCarregado && !dados.nome) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.header}>Faça login para acessar o perfil</Text>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.logoutButtonText}>Ir para login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nivelAtualIndex = niveis.findLastIndex(
    (n) => (score?.xp ?? 0) >= n.minimo
  );

  const nivelNome = niveis[nivelAtualIndex]?.nome || "Desconhecido";
  const proximoMinimo = niveis[nivelAtualIndex + 1]?.minimo || score?.xp || 0;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Perfil</Text>
        <View style={styles.linhaCinza} />

        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{dados.nome}</Text>
            <Text style={styles.level}>
              Nível {nivelAtualIndex + 1} - {nivelNome}
            </Text>
          </View>
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.textoAbaixo}>
            Nível {nivelAtualIndex + 1} - {nivelNome}
          </Text>
          <View style={styles.linhaXp}>
            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barraXp,
                  { width: `${((score?.xp ?? 0) / proximoMinimo) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.texto_barra}>
              {score?.xp ?? 0} / {proximoMinimo} xp
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seus dados</Text>

        {campos.map((campo: Campo) => (
          <View key={campo} style={styles.field}>
            <Text style={styles.label}>
              {campo === "nome"
                ? "Nome completo"
                : campo === "email"
                ? "E-mail"
                : "Senha"}
            </Text>

            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <Text style={styles.input}>
                  {campo === "senha" ? "*************" : dados[campo]}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editIconOutside}
                onPress={() => {
                  if (campo === "nome") router.push("/alterar-nome");
                  else if (campo === "email") router.push("/alterar-email");
                  else if (campo === "senha") router.push("/alterarSenha");
                }}
              >
                <Octicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {formEditado && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Raleway_700Bold",
    marginTop: 40,
  },
  linhaCinza: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 12,
    width: SCREEN_WIDTH,
    alignSelf: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 40,
    marginTop: 15,
  },
  avatarWrapper: { position: "relative" },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 4,
  },
  userInfo: { flexDirection: "column", justifyContent: "center" },
  username: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: "Raleway_400Bold",
    paddingHorizontal: 5,
    color: "#3A3A3A",
  },
  level: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 4,
    fontFamily: "Raleway_400Regular",
    alignSelf: "flex-start",
  },
  xpCard: {
    backgroundColor: "#1976D2",
    borderRadius: 30,
    padding: 20,
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 10,
  },
  textoAbaixo: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    marginBottom: 8,
  },
  linhaXp: { flexDirection: "row", alignItems: "center", width: "100%" },
  barraFundo: {
    flex: 1,
    height: 15,
    backgroundColor: "#8BC34A",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
  },
  barraXp: { height: "100%", backgroundColor: "#4CAF50", borderRadius: 10 },
  texto_barra: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#666",
    fontFamily: "Raleway_700Bold",
  },
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    fontFamily: "Raleway_400Regular",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputRow: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
    color: "#333",
  },
  editIconOutside: { marginLeft: 12, padding: 8 },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  botao: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
});
