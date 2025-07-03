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
import Oficinas from '../components/planos/oficinas';
import Dados from '../components/conferencia/dados';
import Eventos from '../components/planos/eventos';
import { UrlObject } from 'expo-router/build/global-state/routeInfo';


type Oficina = {
  id: number;
  cidade: string;
  estado: string;
  dataInicio: string;
  dataTermino: string;
  status: 'Ativa' | 'Encerrada';
  modalidade: 'Presencial' | 'Online';
};

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

type Evento = {
  id: number;
  estado: string;
  data?: string;
  status: 'Inscrições em breve' | 'Finalizado';
};

export default function PlanoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>('');
  const [planos, setPlanos] = useState<Planos[]>([]);
  const [proposta, setProposta] = useState<Propostas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      const response = await fetch(`http://172.20.10.9:8000/planos/${id}/`, {
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

        setLoading(false);
      } else {
        console.log('erro ao receber dados da API');
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    }
  };

  
  // const propostas = [
  //   {
  //     id: 1,
  //     eixo: 'Eixo 1 - Desenvolvimento Sustentável',
  //     publicadoEm: '05/06/2025',
  //     usuario: 'ANA',
  //     descricao: 'Fomentar ações de desenvolvimento sustentável nas regiões Norte e Nordeste...',
  //   },
  //   {
  //     id: 2,
  //     eixo: 'Eixo 2 - Justiça Climática',
  //     publicadoEm: '15/07/2025',
  //     usuario: 'JOÃO',
  //     descricao: 'Fortalecer políticas de justiça climática através de programas de educação ambiental...',
  //   },
  //       {
  //     id: 3,
  //     eixo: 'Eixo 1 - Desenvolvimento Sustentável',
  //     publicadoEm: '05/06/2025',
  //     usuario: 'ANA',
  //     descricao: 'Fomentar ações de desenvolvimento sustentável nas regiões Norte e Nordeste...',
  //   },
  //   {
  //     id: 4,
  //     eixo: 'Eixo 2 - Justiça Climática',
  //     publicadoEm: '15/07/2025',
  //     usuario: 'JOÃO',
  //     descricao: 'Fortalecer políticas de justiça climática através de programas de educação ambiental...',
  //   },
  // ];


  const eventos: Evento[] = [
    {
      id: 1,
      estado: 'Distrito Federal',
      data: '15/06/2025',
      status: 'Inscrições em breve', // ou 'Finalizado' se desejar
    },
    {
      id: 2,
      estado: 'São Paulo',
      status: 'Inscrições em breve', // Sem data, aparece "Inscrições em breve"
    },
    {
      id: 3,
      estado: 'Bahia',
      status: 'Finalizado', // Sem data, aparece "Finalizado"
    },
        {
      id: 4,
      estado: 'Distrito Federal',
      data: '15/06/2025',
      status: 'Inscrições em breve', // ou 'Finalizado' se desejar
    },
    {
      id: 5,
      estado: 'São Paulo',
      status: 'Inscrições em breve', // Sem data, aparece "Inscrições em breve"
    },
    {
      id: 6,
      estado: 'Bahia',
      status: 'Finalizado', // Sem data, aparece "Finalizado"
    },
  ];


const oficinas: Oficina[] = [
  {
    id: 1,
    cidade: 'Brasília',
    estado: 'DIstritoF',
    dataInicio: '15/06/2025',
    dataTermino: '17/06/2025',
    status: 'Ativa',
    modalidade: 'Presencial',
  },
  {
    id: 2,
    cidade: 'São Paulo',
    estado: 'SP',
    dataInicio: '20/07/2025',
    dataTermino: '22/07/2025',
    status: 'Encerrada',
    modalidade: 'Online',
  },
  {
    id: 3,
    cidade: 'Salvador',
    estado: 'BA',
    dataInicio: '10/08/2025',
    dataTermino: '12/08/2025',
    status: 'Ativa',
    modalidade: 'Presencial',
  },
];

  const objetivos = [
    'Reduzir desigualdades sociais e regionais',
    'Enfrentar as mudanças climáticas',
    'Preparar o país para a transição demográfica',
    'Promover o aumento dos investimentos e garantir crescimento econômico',
    'Promover sustentabilidade macroeconômica',
  ];

  const etapas = [
    { nome: 'Elaboração', data: '2025-01-15', ativo: true },
    { nome: 'Consulta Pública', data: '2025-02-10', ativo: true },
    { nome: 'Oficinas Regionais', data: '2025-03-05', ativo: false },
    { nome: 'Finalização', data: '2025-04-20', ativo: true },
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
      <Header router={router} titulo="Planos" />

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
                  <Entypo name="calendar" size={14} color="#000" />
                  <Text style={styles.dadoNumero}>12</Text>
                  <Text style={styles.dadoText}>Eventos</Text>
                </View>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons name="target" size={14} color="#000" />
                  <Text style={styles.dadoNumero}>25</Text>
                  <Text style={styles.dadoText}>Metas</Text>
                </View>
              </View>
              <View style={styles.dadosLinha}>
                <View style={styles.dadoItem}>
                  <MaterialCommunityIcons name="account-group-outline" size={14} color="#000" />
                  <Text style={styles.dadoNumero}>5</Text>
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
            <Metas
              metas={[
                { id: 1, titulo: 'Reduzir emissão de carbono', cidade: 'São Paulo', estado: 'SP', votos: 150 },
                { id: 2, titulo: 'Aumentar áreas verdes', cidade: 'Salvador', estado: 'BA', votos: 89 },
                { id: 3, titulo: 'Educação ambiental', cidade: 'Manaus', estado: 'AM', votos: 112 },
                 { id: 4, titulo: 'Reduzir emissão de carbono', cidade: 'São Paulo', estado: 'SP', votos: 150 },
                { id: 5, titulo: 'Aumentar áreas verdes', cidade: 'Salvador', estado: 'BA', votos: 89 },
                { id: 6, titulo: 'Educação ambiental', cidade: 'Manaus', estado: 'AM', votos: 112 },
              ]}
            />
            <Oficinas oficinas={oficinas} propostas={proposta} />
               <Dados
                  estatisticas={dadosEstatisticos}
                  palavrasChave={palavrasChave}
                />
                <Eventos eventos={eventos} />

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
