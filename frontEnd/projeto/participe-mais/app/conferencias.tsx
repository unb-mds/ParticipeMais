import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import EixosTematicos from '../components/conferencia/eixostematicos';
import Conferencias from '../components/conferencia/conferencias_gerais';
import Dados from '../components/conferencia/dados';
import DadosPizza from '../components/conferencia/dadosPizza';
import Propostas from '../components/conferencia/propostas_gerais';



import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ConferenciaDetalhadaScreen() {
  const router = useRouter();
  const conferencias = [
  {
    id: 1,
    titulo: '5ª Conferência Nacional do Meio Ambiente',
    origem: 'Brasília, DF',
    descricao: 'Discussão sobre mudanças climáticas e governança ambientalaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaawwwadwddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd.',
    status: 'Ativa',
    modalidade: 'Presencial',
  },
  {
    id: 2,
    titulo: 'Conferência de Desenvolvimento Sustentável',
    origem: 'São Paulo, SP',
    descricao: 'Abordagem sobre desenvolvimento sustentável e ESG.',
    status: 'Encerrada',
    modalidade: 'Online',
  },
  {
    id: 3,
    titulo: 'Conferência Global de Energias Renováveis',
    origem: 'Rio de Janeiro, RJ',
    descricao: 'Exploração de alternativas em energia limpa.',
    status: 'Ativa',
    modalidade: 'Presencial',
  },{
    id: 4,
    titulo: 'Conferência Global de Energias Renováveis',
    origem: 'Rio de Janeiro, RJ',
    descricao: 'Exploração de alternativas em energia limpa.',
    status: 'Ativa',
    modalidade: 'Presencial',
  },{
    id: 5,
    titulo: 'Conferência Global de Energias Renováveis',
    origem: 'Rio de Janeiro, RJ',
    descricao: 'Exploração de alternativas em energia limpa.',
    status: 'Ativa',
    modalidade: 'Presencial',
  },{
      id: 6,
    titulo: 'Conferência Global de Energias Renováveis',
    origem: 'Rio de Janeiro, RJ',
    descricao: 'Exploração de alternativas em energia limpa.',
    status: 'Ativa',
    modalidade: 'Presencial',
  },
];

 const etapas = [
    { nome: 'Etapa Digital', data: '2025-05-07', ativo: true },
    { nome: 'Conferências Municipais', data: '2025-01-26', ativo: true },
    { nome: 'Conferências Estaduais', data: '2025-03-15', ativo: false },
    { nome: 'Etapa Nacional', data: '2025-05-09', ativo: true },
  ];

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

  const propostas = [
  {
    id: 1,
    eixo: 'Eixo 3 - Justiça Social: Participação Popular',
    publicadoEm: '05/12/2024',
    usuario: 'MONICA',
    descricao:
      'Ampliar a participação popular de forma a implantar, consolidar e fortalecer programas de incentivo educacional e técnico em sistemas agroflorestais...',
  },
  {
    id: 2,
    eixo: 'Eixo 2 - Meio Ambiente e Sustentabilidade',
    publicadoEm: '10/01/2025',
    usuario: 'CARLOS',
    descricao:
      'Fortalecer ações de proteção ambiental com foco em resíduos sólidos e conservação da biodiversidade...',
  },
];

 return (
    <SafeAreaView style={styles.container_total}>
      <Header router={router} />

      <FlatList
        data={[]} // vazio, porque o conteúdo real está no header
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge />

            <Text style={styles.title}>
              5ª Conferência Nacional do Meio Ambiente
            </Text>

            <View style={styles.subinfo}>
              <Entypo name="location" size={14} />
              <Text style={styles.subinfoText}>1527 conferências</Text>
              <MaterialCommunityIcons name="file-document-outline" size={14} />
              <Text style={styles.subinfoText}>10794 propostas</Text>
            </View>

            <Text style={styles.description}>
              A emergência climática que vivemos, com eventos extremos cada vez mais frequentes e intensos, é o tema da 5ª Conferência Nacional do Meio Ambiente. Vamos debater a emergência climática junto com o desafio da transformação ecológica: como transitamos para um Brasil mais resiliente, menos vulnerável às mudanças climáticas e reduzimos as emissões de gases de efeito estufa, causadores do aquecimento global. Esta 5ª CNMA marca a retomada da governança participativa, depois de onze anos da última Conferência. Os debates em todo o país vão até maio.
            </Text>

            <EtapasCalendar etapas={etapas} />
            <EixosTematicos eixos={eixos} />
            <Conferencias conferencias={conferencias} />
            <Dados
                estatisticas={dadosEstatisticos}
                palavrasChave={palavrasChave}
              />
            <Propostas propostas={propostas} />

            <DadosPizza
              estatisticas={[
                { eixo: 'Eixo 1', percentual: 40, cor: '#2670E8' },
                { eixo: 'Eixo 2', percentual: 35, cor: '#4CAF50' },
                { eixo: 'Eixo 3', percentual: 25, cor: '#FFC107' },
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
