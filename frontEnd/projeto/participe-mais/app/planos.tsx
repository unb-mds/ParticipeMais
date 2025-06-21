import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '../components/conferencia/header';
import StatusBadge from '../components/conferencia/statusbagde';
import EtapasCalendar from '../components/conferencia/etapascalendar';
import LinkAcesso from '../components/planos/linkacesso';
import Objetivos from '../components/planos/objetivos';

export default function PlanoScreen() {
  const router = useRouter();

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

  return (
    <SafeAreaView style={styles.container_total}>
      <Header router={router} titulo="Plano Nacional" />

      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.container}>
            <StatusBadge status="Ativa" />

            <Text style={styles.title}>Plano Nacional de Desenvolvimento</Text>

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
                  <Text style={styles.dadoNumero}>312</Text>
                  <Text style={styles.dadoText}>Propostas</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>
              O Plano Nacional de Desenvolvimento visa orientar políticas públicas de longo prazo,
              definindo metas, ações e estratégias para o desenvolvimento sustentável do Brasil.
            </Text>

            <LinkAcesso
              titulo="O que Brasil queremos nos próximos 25 anos?"
              descricao="Para responder a essa pergunta, acesse diretamente o questionário na seção 'Planos' do site Brasil Participativo."
              textoBotao="Acesse o questionário"
              onPress={() => {}}
            />

            <EtapasCalendar etapas={etapas} />

            <Objetivos objetivos={objetivos} />
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
