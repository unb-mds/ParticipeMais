import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ScrollView } from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraTela = SCREEN_WIDTH * 1;

export default function PerfilScreen() {
  const router = useRouter();
  const [usuarioCarregado, setUsuarioCarregado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [score, setScore] = useState<number>(0);
  const [nivel, setNivel] = useState<number>(0);

  const campos = ["nome", "email", "senha"] as const;
  type Campo = typeof campos[number];

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [editando, setEditando] = useState({
    nome: false,
    email: false,
    senha: false,
  });

  const [formEditado, setFormEditado] = useState(false);

  useEffect(() => {
  const carregarDadosUsuario = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      if (usuario) {
        const userObj = JSON.parse(usuario);
        setDados({
          nome: userObj.nome || '',
          email: userObj.email || '',
          senha: '*************'
        });
        setNomeUsuario(userObj.nome || '');
      } else {
        setNomeUsuario('');
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setUsuarioCarregado(true);
    }
  };

  carregarDadosUsuario();
}, []);

  const handleEdit = (campo: Campo) => {
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  const handleChange = (campo: Campo, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    setFormEditado(true);
  };

  const handleSalvar = () => {
    setEditando({ nome: false, email: false, senha: false });
    setFormEditado(false);
    Alert.alert("Sucesso", "Dados salvos com sucesso!");
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // remove dados do usuário
      router.replace('/login'); // redireciona para tela de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  if (usuarioCarregado && !nomeUsuario) {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.header}>Faça login para acessar o perfil</Text>
      <TouchableOpacity style={styles.botao} onPress={() => router.replace('/login')}>
        <Text style={styles.logoutButtonText}>Ir para login</Text>
      </TouchableOpacity>
    </View>
  );
}

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

const nivelAtualIndex = niveis.findIndex((n, i) => {
  const proximo = niveis[i + 1];
  return !proximo || score < proximo.minimo;
});

const nivelNome = niveis[nivelAtualIndex]?.nome || "Desconhecido";
const proximoMinimo = niveis[nivelAtualIndex + 1]?.minimo || score;

  return (
    <ScrollView style={styles.estiloTUdo}>
      <View style={styles.container}>
        <Text style={styles.header}>Perfil</Text>
        <View style={styles.linhaCinza} />

        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.imgur.com/0y8Ftya.png" }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon} onPress={() => console.log("Editar foto")}>
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{dados.nome}</Text>
            <Text style={styles.level}>Nível {nivelAtualIndex + 1} - {nivelNome}</Text>
          </View>
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.textoAbaixo}>Nível {nivelAtualIndex + 1} - {nivelNome}</Text>
          <View style={styles.linhaXp}>
            <View style={styles.barraFundo}>
              <View style={[styles.barraXp, { width: `${(score / proximoMinimo) * 100}%` }]} />
            </View>
            <Text style={styles.texto_barra}>{score} / {proximoMinimo} xp</Text>
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
                  {campo === 'senha' ? '*************' : dados[campo]}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editIconOutside}
                onPress={() => {
                  if (campo === 'nome') router.push('/alterar-nome');
                  else if (campo === 'email') router.push('/alterar-email');
                  else if (campo === 'senha') router.push('/alterarSenha');
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
  estiloTUdo: {
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Raleway_700Bold",
    marginTop: 40,
  },
  linhaCinza: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 12,
    width: larguraTela,
    alignSelf: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 40,
    marginTop: 15
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 4,
  },
  username: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: "Raleway_400Bold",
    paddingHorizontal: 5,
    color: "#3A3A3A"
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
    alignSelf: 'flex-start',
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
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
    marginBottom: 8,
  },
  linhaXp: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  barraFundo: {
    flex: 1,
    height: 15,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  barraXp: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  texto_barra: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway_400Regular',
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#666",
    fontFamily: "Raleway_700Bold",
  },
  field: {
    marginBottom: 12
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    fontFamily: "Raleway_400Regular",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Raleway_400Regular',
    color: '#333',
  },
  editIconOutside: {
    marginLeft: 12,
    padding: 8,
  },
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
  backgroundColor: '#007bff',
  padding: 12,
  borderRadius: 8,
  marginTop: 20,
},
});