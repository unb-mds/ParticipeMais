import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import EixosTematicos from '../components/conferencia/eixostematicos';
import Propostas from '../components/conferencia/propostas_gerais';
import VisaoGeral from '../components/consultas/visaogeral';
import DadosPizza from '../components/conferencia/dadosPizza';

import { Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { UrlObject } from 'expo-router/build/global-state/routeInfo';

export interface Consultas {
  id: number;
  nome: string;
  descricao: string;
  sobre: string;
  status: boolean;
  link: UrlObject;
  etapas: Etapas[];
  palavras_chaves: string;
}

export interface Etapas {
  id: number
  titulo_etapa: string;
  descricao_etapa: string;
  status: string;
  regiao_etapa: string;
  duracao_etapa: string;
  qtd_propostas_etapa: number;
  qtd_inscritos_etapa: number;
  propostas_relacionadas: string; // ajustado para array de strings
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

export default function ConsultaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = React.useState<string>('');
  const [consultas, setConsultas] = React.useState<Consultas[]>([]);
  const [etapas, setEtapas] = useState<Etapas[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorito, setFavorito] = useState(false);


 useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    };
    obterToken();
  }, []);
  
  useEffect(() => {
    if (token && id) {
      fetchConsultas();
    }
  }, [token, id]);
  
  const fetchConsultas = async () => {
    try {
      const response = await fetch(`http://172.20.10.9:8000/consultas/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      });
      
      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        // ajusta se vier um objeto, coloca em array
        setConsultas(Array.isArray(data.consultas) ? data.consultas : [data.consultas]);
        setEtapas(data.etapas || []);
        setPropostas(data.propostas || []);
        setLoading(false);

        console.log('Consultas:', data.consultas);
        console.log('Propostas:', data.propostas);
        
      } else {
        console.log('error');
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    }
  };

  const verificarFavorito = async () => {
  try {
    const res = await fetch(`http://172.20.10.9:8000/consultas/favoritas/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    const idsFavoritos = data.favoritos; // deve ser lista de IDs
    setFavorito(idsFavoritos.includes(Number(id)));
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
  }
};
const toggleFavorito = async () => {
  try {
    const res = await fetch(`http://172.20.10.9:8000/consultas/toggle/${id}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setFavorito((prev: boolean) => !prev);
    } else {
      console.warn('Não foi possível atualizar favorito');
    }
  } catch (error) {
    console.error('Erro ao atualizar favorito', error);
  }
};
useEffect(() => {
  if (token && id) {
    fetchConsultas();
    verificarFavorito();
  }
}, [token, id]);


  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2670E8" />
        <Text style={styles.loadingText}>Carregando consulta...</Text>
      </SafeAreaView>
    );
  }

  const consulta = consultas[0];

  const palavrasChave = consulta?.palavras_chaves
  ? consulta.palavras_chaves
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .slice(0, 12)
  : [];

  return (
    <SafeAreaView style={styles.container_total}>
      <Header
        router={router}
        titulo="Consultas Públicas"
        favorito={favorito}
        onToggleFavorito={toggleFavorito}
      />

      <FlatList
        data={[]} // vazio, pois todo conteúdo está no HeaderComponent
        keyExtractor={(_, index) => `dummy-${index}`}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* <StatusBadge status={consultas} /> */}

            <Text style={styles.title}>{consulta.nome}</Text>

            <Text style={styles.description}>
              {consulta.descricao}
            </Text>
           <VisaoGeral
                oficinas={etapas.length}
                propostas={propostas.length}
                />

            {/* 🔗 Link de Acesso */}
            <View style={styles.linkContainer}>
              <View style={styles.linkHeader}>
                <Ionicons name="link-outline" size={16} color="#000" />
                <Text style={styles.linkTitle}>Link de acesso</Text>
              </View>

              <Text style={styles.linkDescricao}>
                Para mais detalhes e acesso direto às propostas, acesse diretamente no site do Brasil Participativo.
              </Text>

              <Pressable
                style={styles.linkButton}
                onPress={() => Linking.openURL(`${consulta.link}`)}
                android_ripple={{ color: '#2670E8' }}
              >
                <Text style={styles.linkButtonText}>Acesso ao site Brasil Participativo</Text>
              </Pressable>
            </View>


            {/* 📅 Etapas */}
            <EtapasCalendar etapas={etapas} conferencias={null}/>

            { consulta.sobre && (
              <View style={styles.linkContainer}>
                <View style={styles.linkHeader}>
                  <Ionicons name="link-outline" size={16} color="#000" />
                  <Text style={styles.linkTitle}>Sobre a consulta</Text>
                </View>
                <Text style={styles.description}> 
                  {consulta.sobre}
                </Text>
              </View>
            )}

            {/* 📄 Propostas */}
            { propostas && propostas.length > 0 ? (<> 
              
              <Propostas propostas={propostas} />
            
              {/* 📈 Dados */}
              <DadosPizza
                estatisticas={[]}
                total={1527}
                palavrasChave={palavrasChave}
              />
            
            </>) : (<>
              <Propostas propostas={propostas} />
            </>)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway-Regular',
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
  subinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  subinfoText: {
    fontSize: 12,
    color: '#555',
  },
  // 🔗 Link Styles
  linkContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  linkTitle: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  linkDescricao: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
    lineHeight: 18,
  },
  linkButton: {
    borderWidth: 1,
    borderColor: '#2670E8',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  linkButtonText: {
    color: '#2670E8',
    fontFamily: 'Raleway-Bold',
    fontSize: 13,
  },
});
