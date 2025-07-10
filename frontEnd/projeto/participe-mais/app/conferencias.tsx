import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import EixosTematicos from '../components/conferencia/eixostematicos';
import Conferencias from '../components/conferencia/conferencias_gerais';
import Dados from '../components/conferencia/dados';
import DadosPizza from '../components/conferencia/dadosPizza';
import Propostas from '../components/conferencia/propostas_gerais';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export interface Conferencia {
  id: number;
  titulo: string;
  descricao: string;
  sobre: string;
  status: boolean;
  data_subconferencia: string[] | string;
  qtd_propostas: number;
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

export interface Etapas {
  id: number;
  titulo_etapa: string;
  descricao_etapa: string;
  status: string;
  regiao_etapa: string;
  duracao_etapa: string;
  qtd_propostas_etapa: number;
  qtd_inscritos_etapa: number;
  propostas_relacionadas: string;
}

export default function ConferenciaDetalhadaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>('');
  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  const [etapas, setEtapas] = useState<Etapas[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [estatisticas, setEstatisticas] = useState<any[]>([]);
  const [estatisticasEtapas, setEstatisticasEtapas] = useState<number>(0);
  const [totalPropostas, setTotalPropostas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorito, setFavorito] = useState<boolean>(false);

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) setToken(tokenSalvo);
        else router.replace('/login');
      } catch {
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token && id) {
      fetchConferencias();
      verificarFavorito();
      fetchPropostas();
    }
  }, [token, id]);

  const fetchConferencias = async () => {
    try {
      const res = await fetch(`http://172.20.10.9:8000/conferencias/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setConferencias(Array.isArray(data.conferencias) ? data.conferencias : [data.conferencias]);
        setEtapas(data.etapas || []);
        setEstatisticasEtapas(data.estatisticasEtapas || 0);
        setLoading(false);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Erro ao carregar conferências:', error);
      router.replace('/login');
    }
  };

  const fetchPropostas = async () => {    
    try {
      const response = await fetch(
        `http://172.20.10.9:8000/conferencias/${id}/propostas/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar mais propostass');
      }

      const json = await response.json();
      
      if (Array.isArray(json.propostas)) {
        setPropostas(json.propostas || []);
        setTotalPropostas(json.total_propostas);
        setEstatisticas(json.estatisticas || []);

        console.log(json)
      }
    } catch (error) {
      console.error('Erro ao carregar mais propostas:', error);
    }};

  const verificarFavorito = async () => {
    try {
      const res = await fetch(`http://172.20.10.9:8000/conferencias/favoritas/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorito(data.favoritos.includes(Number(id)));
    } catch (err) {
      console.error('Erro ao verificar favorito', err);
    }
  };

  const toggleFavorito = async () => {
    try {
      const res = await fetch(`http://172.20.10.9:8000/conferencias/toggle/${id}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setFavorito(prev => !prev);
    } catch (err) {
      console.error('Erro ao atualizar favorito', err);
    }
  };

  const conferencia = conferencias[0];

  const palavrasChave = conferencia?.palavras_chaves
  ? conferencia.palavras_chaves
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .slice(0, 12)
  : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2670E8" />
        <Text style={styles.loadingText}>Carregando conferência...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container_total}>
      <Header router={router} titulo="Conferências" favorito={favorito} onToggleFavorito={toggleFavorito} />
      <FlatList
        data={[]}
        keyExtractor={(_, i) => `dummy-${i}`}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge status={conferencia?.status ? 'Ativa' : 'Inativa'} />
            <Text style={styles.title}>{conferencia?.titulo || 'Não informado'}</Text>
            <View style={styles.subinfo}>
              <Entypo name="location" size={14} />
              <Text style={styles.subinfoText}>{etapas.length} conferências</Text>
              <MaterialCommunityIcons name="file-document-outline" size={14} />
              <Text style={styles.subinfoText}>{totalPropostas} propostas</Text>
            </View>
            
            {conferencia?.descricao && conferencia.descricao.trim().toLowerCase() !== 'nan'
              ? <Text style={styles.description}>{conferencia.descricao.trim()}</Text>
              : <Text style={styles.description}>Descrição não informada</Text>}


            <EtapasCalendar etapas={etapas} conferencias={conferencias} />
            {/* <EixosTematicos eixos={eixos} /> */}
            <Conferencias etapas={etapas} conferencias={conferencias} propostas={propostas} />
            {etapas.length > 0 && <Dados estatistica={estatisticasEtapas} palavrasChave={palavrasChave} />}
            
            { propostas && propostas.length > 0 ? (<> 
              
              <Propostas propostas={propostas} />
            
              {/* 📈 Dados */}
              <DadosPizza
                estatisticas={estatisticas}
                total={totalPropostas}
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
  errorContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2670E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});