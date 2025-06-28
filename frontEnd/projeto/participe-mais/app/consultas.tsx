import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import EixosTematicos from '../components/conferencia/eixostematicos';
import Propostas from '../components/conferencia/propostas_gerais';
import VisaoGeral from '../components/consultas/visaogeral';
import DadosPizza from '../components/conferencia/dadosPizza';

import { Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function ConsultaScreen() {
  const router = useRouter();

  const etapas = [
    { nome: 'Etapa Digital', data: '2025-05-07', ativo: true },
    { nome: 'Audiências Públicas', data: '2025-06-01', ativo: true },
    { nome: 'Análise Técnica', data: '2025-06-15', ativo: false },
    { nome: 'Encerramento', data: '2025-07-01', ativo: false },
  ];

  const eixos = [
    { titulo: 'Eixo 1 – Saúde', descricao: 'Ações voltadas à saúde pública.' },
    { titulo: 'Eixo 2 – Educação', descricao: 'Fortalecer a educação básica e superior.' },
    { titulo: 'Eixo 3 – Meio Ambiente', descricao: 'Sustentabilidade e proteção ambiental.' },
  ];

  const dadosEstatisticos = {
    total: 789,
    andamento: 65,
    encerradas: 35,
  };

  const propostas = [
    {
      id: 1,
      eixo: 'Eixo 1 – Saúde',
      publicadoEm: '05/12/2024',
      usuario: 'MONICA',
      descricao:
        'Ampliar a cobertura do SUS para regiões isoladas, com mais unidades móveis e atendimento digital...',
    },
    {
      id: 2,
      eixo: 'Eixo 2 – Educação',
      publicadoEm: '10/01/2025',
      usuario: 'CARLOS',
      descricao:
        'Fortalecer o ensino técnico e profissionalizante em comunidades periféricas...',
    },
  ];

  return (
    <SafeAreaView style={styles.container_total}>
      <Header router={router} titulo="Consultas Públicas" />

      <FlatList
        data={[]} // vazio, pois todo conteúdo está no HeaderComponent
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge status="Encerrada" />

            <Text style={styles.title}>Consulta Pública Nacional sobre Saúde</Text>

            <Text style={styles.description}>
              A consulta pública tem como objetivo ouvir a população sobre as prioridades na área da saúde. Sua
              participação é fundamental para definir políticas públicas mais eficientes e inclusivas.
            </Text>
           <VisaoGeral
                participantes={1254}
                respostas={854}
                comentarios={321}
                propostas={487}
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
                onPress={() => Linking.openURL('https://brasilparticipativo.gov.br')}
              >
                <Text style={styles.linkButtonText}>Acesso ao site Brasil Participativo</Text>
              </Pressable>
            </View>


            {/* 📅 Etapas */}
            <EtapasCalendar etapas={etapas} />

            {/* 🎯 Eixos Temáticos */}
            <EixosTematicos eixos={eixos} />

            {/* 📄 Propostas */}
            <Propostas propostas={propostas} />

            {/* 📈 Dados */}
            <DadosPizza
              estatisticas={[
                { eixo: 'Eixo 1', percentual: 50, cor: '#2670E8' },
                { eixo: 'Eixo 2', percentual: 30, cor: '#4CAF50' },
                { eixo: 'Eixo 3', percentual: 20, cor: '#FFC107' },
              ]}
              total={1527}
              palavrasChave={['Saúde', 'Educação', 'Meio Ambiente', 'Justiça']}
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
