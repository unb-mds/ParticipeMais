import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "../components/conferencia/header";
import StatusBadge from "../components/conferencia/statusbagde";
import Objetivos from "../components/planos/objetivos";
import Oficina from "../components/planos/oficinas";
import Dados from "../components/conferencia/dados";
import DadosPizza from "../components/conferencia/dadosPizza";
import { UrlObject } from "expo-router/build/global-state/routeInfo";
import Propostas from "@/components/conferencia/propostas_gerais";

export interface Planos {
  id: number;
  nome: string;
  descricao: string;
  sobre: string;
  status: boolean;
  palavras_chaves: string;
}

export interface Proposta {
  id: number;
  titulo_proposta: string;
  autor: string;
  descricao_proposta: string;
  qtd_votos: number;
  data_criacao: string;
  total_palavras_chave: number;
  url_proposta: string;
  etapa: number;
}

export type Oficinas = {
  id: number;
  titulo_oficina: string;
  descricao_oficina: string;
  regiao_oficina: string;
  duracao_oficina: string;
  qtd_propostas_oficina: number;
  qtd_inscritos_oficina: number;
  propostas_relacionadas: string[];
  status: "Ativa" | "Encerrada";
  modalidade: "Presencial" | "Online";
};

export default function PlanoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>("");
  const [planos, setPlanos] = useState<Planos[]>([]);
  const [propostas, setProposta] = useState<Proposta[]>([]);
  const [oficinas, setOficinas] = useState<Oficinas[]>([]);
  const [estatisticas, setEstatisticas] = useState<any[]>([]);
  const [totalPropostas, setTotalPropostas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorito, setFavorito] = useState<boolean>(false);

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem("accessToken");
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token && id) {
      fetchPlanos();
    }
  }, [token, id]);

  const fetchPlanos = async () => {
    try {
      const response = await fetch(`http://98.84.77.124:8000/planos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log("API response:", json);

        setPlanos([json.data.planos]); // ajustado
        setProposta(json.data.propostas || null); // ajustado
        setOficinas(json.data.oficinas || null); // ajustado
        setTotalPropostas(json.total_propostas);
        setEstatisticas(json.estatisticas || []);
        // console.log(oficinas)

        setLoading(false);
      } else {
        console.log("erro ao receber dados da API");
        router.replace("/login");
      }
    } catch (error) {
      router.replace("/login");
    }
  };
  const verificarFavorito = async () => {
    try {
      const res = await fetch(`http://98.84.77.124:8000/planos/favoritas/`, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      const idsFavoritos = data.favoritos ?? []; // fallback defensivo
      setFavorito(idsFavoritos.includes(Number(id)));
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  };
  const toggleFavorito = async () => {
    try {
      const res = await fetch(`http://98.84.77.124:8000/planos/toggle/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setFavorito((prev) => !prev);
      } else {
        console.warn("Não foi possível atualizar favorito");
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };
  useEffect(() => {
    if (token && id) {
      fetchPlanos();
      verificarFavorito(); // 👈 adicionar aqui
    }
  }, [token, id]);

  const objetivos = [
    "Reduzir desigualdades sociais e regionais",
    "Enfrentar as mudanças climáticas",
    "Preparar o país para a transição demográfica",
    "Promover o aumento dos investimentos e garantir crescimento econômico",
    "Promover sustentabilidade macroeconômica",
  ];

  const planopalavra = planos[0];

  const palavrasChave = planopalavra?.palavras_chaves
    ? planopalavra.palavras_chaves
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .slice(0, 12)
    : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2670E8" />
        <Text style={styles.loadingText}>Carregando plano...</Text>
      </SafeAreaView>
    );
  }

  const plano = planos[0];
  console.log("Acessando planos:");
  console.log("planos:", planos);
  console.log("id:", id);

  return (
    <SafeAreaView style={styles.container_total}>
      <Header
        router={router}
        titulo="Planos"
        favorito={favorito}
        onToggleFavorito={toggleFavorito}
      />

      <FlatList
        data={[]}
        keyExtractor={(_, index) => `dummy-${index}`}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge status={plano?.status ? "Ativa" : "Inativa"} />

            <Text style={styles.title}>{plano?.nome || "Não informado"}</Text>

            {/* Dados pequenos */}
            <View style={styles.dadosContainer}>
              <View style={styles.dadosLinha}>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={14}
                    color="#000"
                  />
                  <Text style={styles.dadoNumero}>{oficinas.length}</Text>
                  <Text style={styles.dadoText}>Oficinas</Text>
                </View>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={14}
                    color="#000"
                  />
                  <Text style={styles.dadoNumero}>{propostas.length}</Text>
                  <Text style={styles.dadoText}>Propostas</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>
              {plano?.descricao || "Não informado"}
            </Text>

            {/* <EtapasCalendar etapas={etapas} /> */}

            <Objetivos objetivos={objetivos} />
            {oficinas && oficinas.length > 0 ? (
              <>
                <Oficina oficinas={oficinas} propostas={propostas} />

                <Dados
                  estatistica={oficinas.length}
                  palavrasChave={palavrasChave}
                />
              </>
            ) : (
              <View>
                <Oficina oficinas={oficinas} propostas={propostas} />
              </View>
            )}

            {propostas && propostas.length > 0 ? (
              <>
                <Propostas propostas={propostas} />

                {/* 📈 Dados */}
                <DadosPizza
                  estatisticas={estatisticas}
                  total={totalPropostas}
                  palavrasChave={palavrasChave}
                />
              </>
            ) : (
              <>
                <Propostas propostas={propostas} />
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_total: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Raleway-Regular",
  },
  title: {
    fontSize: 30,
    fontFamily: "Raleway-Bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    lineHeight: 20,
    marginTop: 10,
  },
  dadosContainer: {
    gap: 10,
    marginBottom: 16,
  },
  dadosLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dadoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  dadoNumero: {
    fontSize: 14,
    fontFamily: "Raleway-Bold",
    color: "#000",
  },
  dadoText: {
    fontSize: 10,
    color: "#555",
  },
});
