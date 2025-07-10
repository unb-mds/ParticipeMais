import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Modal,
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;
const Largura = SCREEN_WIDTH * 0.85;

type PesquisaSectionProps = {
  filtros: string[];
};

interface Conferencias {
  id: number;
  image_url: string;
  titulo: string;
}
interface Planos {
  id: number;
  image_url: string;
  nome: string;
}
interface Consultas {
  id: number;
  image_url: string;
  nome: string;
}
interface Categoria {
  id: number;
  nome: string;
}

function corAleatoria(): string {
  const cores = ["#2670E8", "#4CAF50", "#FF9800", "#ce93d8", "#F44336"];
  return cores[Math.floor(Math.random() * cores.length)];
}

export default function PesquisaSection({ filtros }: PesquisaSectionProps) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [conferencias, setConferencias] = useState<Conferencias[]>([]);
  const [planos, setPlanos] = useState<Planos[]>([]);
  const [consultas, setConsultas] = useState<Consultas[]>([]);
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem("accessToken");
        if (tokenSalvo) setToken(tokenSalvo);
        else router.replace("/login");
      } catch (error) {
        router.replace("/login");
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token) fetchPesquisa();
  }, [token]);

  const fetchPesquisa = async () => {
    try {
      const response = await fetch("http://172.20.10.9:8000/pesquisar/lista", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;
        setConferencias(data.conferencias);
        setPlanos(data.planos);
        setConsultas(data.consultas);
        setCategoria(data.categorias);
      } else {
        console.error("Erro ao buscar dados:", response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const conferenciasFiltradas = useMemo(() => {
    return conferencias.filter((item) =>
      item.titulo.toLowerCase().includes(busca.toLowerCase())
    );
  }, [conferencias, busca]);

  const planosFiltrados = useMemo(() => {
    return planos.filter((item) =>
      item.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [planos, busca]);

  const consultasFiltradas = useMemo(() => {
    return consultas.filter((item) =>
      item.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [consultas, busca]);

  const categoriasFiltradas = useMemo(() => {
    return categoria.filter((item) =>
      item.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [categoria, busca]);

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <EvilIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Pesquise tudo que desejar!!"
          placeholderTextColor="#aaa"
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity onPress={() => setBusca('')}>
          <Ionicons name="close-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Botões de filtro */}
      <FlatList
        data={categoria}
        horizontal
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaFiltros}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.botaoFiltro}
            onPress={() => setBusca(item.nome)}
          >
            <Text style={styles.textoFiltro}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Categorias */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Acesse as temáticas</Text>
      </View>

      {categoriasFiltradas.length > 0 ? (
        <FlatList
          data={categoriasFiltradas}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaBolinhas}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/comunidade/categorias",
                  params: { id: item.id.toString() },
                })
              }
            >
              <View
                style={[
                  styles.bolinha,
                  { backgroundColor: corDaCategoria(item.nome) },
                ]}
              >
                {getIconByCategoria(item.nome, "#fff")}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ paddingHorizontal: 12, color: "#777" }}>
          Nenhuma temática encontrada.
        </Text>
      )}

      {/* Conferências */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Conferências</Text>
      </View>

      {conferenciasFiltradas.length > 0 ? (
        <FlatList
          data={conferenciasFiltradas}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaConferencias}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "../conferencias",
                  params: { id: item.id.toString() },
                })
              }
            >
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[
                  styles.cardConferencia,
                  { borderWidth: 2, borderColor: corAleatoria() },
                ]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ paddingHorizontal: 12, color: "#777" }}>
          Nenhuma conferência encontrada.
        </Text>
      )}

      {/* Planos */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Planos</Text>
      </View>

      {planosFiltrados.length > 0 ? (
        <FlatList
          data={planosFiltrados}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaConferencias}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "../planos",
                  params: { id: item.id.toString() },
                })
              }
            >
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[
                  styles.cardPlano,
                  { borderWidth: 2, borderColor: corAleatoria() },
                ]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ paddingHorizontal: 12, color: "#777" }}>
          Nenhum plano encontrado.
        </Text>
      )}

      {/* Consultas */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Consultas</Text>
      </View>

      {consultasFiltradas.length > 0 ? (
        <FlatList
          data={consultasFiltradas}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.listaConferencias,
            { paddingBottom: 100 },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "../consultas",
                  params: { id: item.id.toString() },
                })
              }
            >
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[
                  styles.cardConsulta,
                  { borderWidth: 2, borderColor: corAleatoria() },
                ]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text
          style={{ paddingHorizontal: 12, color: "#777", marginBottom: 100 }}
        >
          Nenhuma consulta encontrada.
        </Text>
      )}
    </View>
  );
}

// Funções auxiliares
function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    "meio ambiente": "#4CAF50",
    infraestrutura: "#FF9800",
    saúde: "#2670E8",
    educação: "#ce93d8",
    "direito das mulheres": "#FF1493",
    "igualdade racial": "#CD853F",
    "direitos da pessoa idosa": "#F0E68C",
    "desenvolvimento rural": "#006400",
    tecnologia: "#8B008B",
    "participação social": "#F44336",
  };
  return mapaCores[categoria.toLowerCase()] || "#e0e0e0";
}

function getIconByCategoria(categoria: string, cor: string = "#fff") {
  switch (categoria.toLowerCase()) {
    case "meio ambiente":
      return <Ionicons name="leaf-outline" size={24} color={cor} />;
    case "educação":
      return <MaterialIcons name="school" size={24} color={cor} />;
    case "saúde":
      return <Ionicons name="medkit" size={24} color={cor} />;
    case "infraestrutura":
      return (
        <MaterialCommunityIcons name="wheel-barrow" size={24} color={cor} />
      );
    case "participação social":
      return <FontAwesome name="group" size={24} color={cor} />;
    case "direito das mulheres":
      return <Ionicons name="woman" size={24} color={cor} />;
    case "tecnologia":
      return <FontAwesome6 name="user-gear" size={24} color={cor} />;
    case "desenvolvimento rural":
      return <FontAwesome6 name="cow" size={24} color={cor} />;
    case "direitos da pessoa idosa":
      return <MaterialIcons name="elderly" size={24} color={cor} />;
    case "igualdade racial":
      return <FontAwesome5 name="equals" size={24} color={cor} />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
}

// Estilos
const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontFamily: "Raleway_400Regular",
  },
  listaFiltros: {
    paddingVertical: 6,
  },
  botaoFiltro: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 10,
  },
  textoFiltro: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Raleway_700Bold",
  },
  listaBolinhas: {
    paddingVertical: 10,
  },
  bolinha: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 30,
  },
  headerTematicas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 4,
  },
  textoTematicas: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    color: "#333",
  },
  listaConferencias: {
    paddingVertical: 10,
    paddingLeft: 4,
  },
  cardConferencia: {
    width: 250,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#ccc",
  },
  cardPlano: {
    width: 180,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#ccc",
  },
  cardConsulta: {
    width: 240,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#ccc",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
  modalCloseText: {
    color: "#2670E8",
    fontWeight: "bold",
  },
});
