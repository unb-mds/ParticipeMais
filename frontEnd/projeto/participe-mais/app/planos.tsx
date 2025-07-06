import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import LinkAcesso from '../components/planos/linkacesso';
import Objetivos from '../components/planos/objetivos';
import Metas from '../components/planos/metas';
import Oficina from '../components/planos/oficinas';
import Dados from '../components/conferencia/dados';
import Eventos from '../components/planos/eventos';
import { UrlObject } from 'expo-router/build/global-state/routeInfo';

export interface Planos {
  id: number;
  nome: string;
  descricao: string;
  sobre: string;
  status: boolean;
}

export interface Propostas {
  id: number;
  titulo_proposta: string;
  autor: string;
  descricao_propostas: string;
  qtd_votos: number;
}

export type Oficinas = {
  id: number;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  dataInicio: string;
  dataTermino: string;
  status: 'Ativa' | 'Encerrada';
  modalidade: 'Presencial' | 'Online';
};

export default function PlanoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>('');
  const [planos, setPlanos] = useState<Planos[]>([]);
  const [proposta, setProposta] = useState<Propostas[]>([]);
  const [oficinas, setOficinas] = useState<Oficinas[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [favorito, setFavorito] = useState<boolean>(false);

  useEffect(()=> {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo){
          setToken(tokenSalvo);
        } else {
          router.replace('/login');
        }
      } catch(error){
        router.replace('/login');
      }
    }
    obterToken();
  }, []);

useEffect(()=> {
  if (token && id){
    fetchPlanos();
  }
}, [token, id]);

  const fetchPlanos = async () => {
    try {
      const response = await fetch(`http://localhost:8000/planos/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log('API response:', json);

        setPlanos([json.data.conferencias]);  // ajustado
        setProposta(json.data.propostas);  // ajustado
        setOficinas(json.data.oficinas || null);  // ajustado

        setLoading(false);
      } else {
        console.log('erro ao receber dados da API');
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    }
  };
  const verificarFavorito = async () => {
    try {
      const res = await fetch(`http://localhost:8000/planos/favoritas/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const idsFavoritos = data.favoritos ?? []; // fallback defensivo
      setFavorito(idsFavoritos.includes(Number(id)));
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };
const toggleFavorito = async () => {
  try {
    const res = await fetch(`http://localhost:8000/planos/toggle/${id}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setFavorito((prev) => !prev);
    } else {
      console.warn('Não foi possível atualizar favorito');
    }
  } catch (error) {
    console.error('Erro ao atualizar favorito:', error);
  }
};
useEffect(() => {
  if (token && id) {
    fetchPlanos();
    verificarFavorito(); // 👈 adicionar aqui
  }
}, [token, id]);

  const objetivos = [
    'Reduzir desigualdades sociais e regionais',
    'Enfrentar as mudanças climáticas',
    'Preparar o país para a transição demográfica',
    'Promover o aumento dos investimentos e garantir crescimento econômico',
    'Promover sustentabilidade macroeconômica',
  ];

  const dadosEstatisticos = {
    total: 1527,
    andamento: 57, // percentual
    encerradas: 43, // percentual
  };
  
const palavrasChave = [
  'Sustentabilidade',
  'Clima',
  'Energia',
  'Resíduos',
  'Água',
  'Educação Ambiental',
  'Transporte',
  'Justiça Climática',
  'Inovação',
];

  if (loading) {
      return (
        <SafeAreaView style={styles.container_total}>
          <ActivityIndicator size="large" color="#2670E8" style={{ marginTop: 50 }} />
        </SafeAreaView>
      );
    }

  const plano = planos[0];
  console.log('Acessando planos:');
  console.log('planos:', planos);
  console.log('id:', id);

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

            <Text style={styles.title}>
              {plano?.nome || 'Não informado'}
            </Text>

            {/* Dados pequenos */}
            <View style={styles.dadosContainer}>
              <View style={styles.dadosLinha}>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons name="account-group-outline" size={14} color="#000" />
                  <Text style={styles.dadoNumero}>sla</Text>
                  <Text style={styles.dadoText}>Oficinas</Text>
                </View>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons name="file-document-outline" size={14} color="#000" />
                  <Text style={styles.dadoNumero}>{proposta.length}</Text>
                  <Text style={styles.dadoText}>Propostas</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>
              {plano?.descricao || 'Não informado'}
            </Text>

            <LinkAcesso
              titulo="O que Brasil queremos nos próximos 25 anos?"
              descricao="Para responder a essa pergunta, acesse diretamente o questionário na seção 'Planos' do site Brasil Participativo."
              textoBotao="Acesse o questionário"
              onPress={() => {}}
            />

            {/* <EtapasCalendar etapas={etapas} /> */}

            <Objetivos objetivos={objetivos} />

            { oficinas && oficinas.length > 0 ? (
              <Oficina oficinas={oficinas} propostas={proposta} />
            ) : (
              <View>
                <Text style={styles.description}>
                  Não há oficinas disponíveis no momento.
                </Text>
              </View>
            )}

            <Dados
              estatisticas={dadosEstatisticos}
              palavrasChave={palavrasChave}
            />

          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_total: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
    marginTop: 10,
  },
  dadosContainer: {
    gap: 10,
    marginBottom: 16,
  },
  dadosLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  dadoNumero: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  dadoText: {
    fontSize: 10,
    color: '#555',
  },
});
