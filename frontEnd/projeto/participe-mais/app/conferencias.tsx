import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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
  data_subconferencia: string[] | string; // ajustado para array de strings
  qtd_propostas: number;
}

export interface Proposta {
  id: number;
  titulo_proposta: string;
  autor: string;
  descricao_proposta: string;
  qtd_votos: number;
  data_criacao: string; //não tem...
  total_palavras_chave: number
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
  propostas_relacionadas: string;
}

export default function ConferenciaDetalhadaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>('');
  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  const [etapas, setEtapas] = useState<Etapas[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      fetchConferencias();
    }
  }, [token, id]);

  const fetchConferencias = async () => {
    try {
      const response = await fetch(`http://192.168.0.15:8000/conferencias/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        // ajusta se vier um objeto, coloca em array
        setConferencias(Array.isArray(data.conferencias) ? data.conferencias : [data.conferencias]);
        setEtapas(data.etapas || []);
        setPropostas(data.propostas || []);
        setLoading(false);

      } else {
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    }
  };

  const eixos = [
    {
      titulo: 'I – Mitigação',
      descricao: 'Exploração de estratégias para reduzir emissões de gases de efeito estufa.',
    },
    {
      titulo: 'II – Adaptação',
      descricao: 'Fortalecer a resiliência às mudanças climáticas.',
    },
    {
      titulo: 'III – Financiamento',
      descricao: 'Mobilizar recursos financeiros públicos e privados para ações climáticas.',
    },
    {
      titulo: 'IV – Governança',
      descricao: 'Promover uma governança climática participativa.',
    },
  ];

  const dadosEstatisticos = {
    total: conferencias.length,
    andamento: 57,
    encerradas: 43,
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

  const conferencia = conferencias[0];
  console.log('Acessando conferência:');
  console.log('Conferências:', conferencias);
  // console.log('Etapas:', etapas);
  // console.log('Propostas:', propostas);


  return (
    
    <SafeAreaView style={styles.container_total}>
      <Header router={router} titulo="Conferências" />

      <FlatList
        data={[]} // conteudo renderizado só no header
        keyExtractor={(_, index) => `dummy-${index}`}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge status={conferencia?.status ? "Ativa" : "Inativa"} />

            <Text style={styles.title}>
              {conferencia?.titulo || 'Não informado'}
            </Text>

            <View style={styles.subinfo}>
              <Entypo name="location" size={14} />
              <Text style={styles.subinfoText}>{etapas.length} conferências</Text>
              <MaterialCommunityIcons name="file-document-outline" size={14} />
              <Text style={styles.subinfoText}>{propostas.length} propostas</Text>
            </View>

            <Text style={styles.description}>
              {conferencia.descricao && conferencia.descricao.trim().toLowerCase() !== 'nan' ? conferencia.descricao?.trim() : 'Descrição não informada'}
            </Text>

            <EtapasCalendar etapas={etapas} conferencias={conferencias} />
            <EixosTematicos eixos={eixos} />
            <Conferencias
              etapas={etapas}
              conferencias={conferencias}
              propostas={propostas}
            />
            <Dados estatisticas={dadosEstatisticos} palavrasChave={palavrasChave} />
            <Propostas propostas={propostas} />
            <DadosPizza
              estatisticas={[
                { eixo: 'Eixo 1', percentual: 40, cor: '#2670E8' },
                { eixo: 'Eixo 2', percentual: 35, cor: '#4CAF50' },
                { eixo: 'Eixo 3', percentual: 10, cor: '#FFC107' },
                { eixo: 'Eixo 4', percentual: 15, cor: '#000' },
              ]}
              total={10794}
              palavrasChave={[
                'Sustentabilidade',
                'Inovação',
                'Energia',
                'Clima',
                'Justiça',
                'Biodiversidade',
              ]}
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
});
