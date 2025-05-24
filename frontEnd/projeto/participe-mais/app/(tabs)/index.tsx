import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Cabecalho from '@/components/cabecalho';
import { ThemedText } from '@/components/ThemedText';
import BlocoDinamico from '@/components/blocosdinamicos';
import DescubraSection from '@/components/descubra'; 



export default function HomeScreen() {
  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');
  const blocos = [
    { tipo: 'banner', titulo: 'Bem-vindo!' },
    { tipo: 'listaUsuarios', usuarios: 15, comentarios: 15 },
    { tipo: 'noticia', titulo: 'Nova função!', corpo: 'Foi lançada uma nova versão do app' },
    { tipo: 'evento', nome: 'Live XP', data: '2025-06-01' },
    {
      tipo: 'carrosselCategorias',
      dados: [
        { categoria: 'Meio Ambiente', totalComentarios: 10 },
        { categoria: 'Educação', totalComentarios: 7 },
        { categoria: 'infraestutura', totalComentarios: 7 },
        { categoria: 'Educação', totalComentarios: 7 },
        { categoria: 'Educação', totalComentarios: 7 },
      ],
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho
        user="Giovanni"
        xp={50}
        nivel={4}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      <View style={styles.contentArea}>
        {abaAtiva === 'descubra' && <DescubraSection />}

        {abaAtiva === 'comunidade' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fundoBranco}>
              <ThemedText style={styles.title}>Conheça a comunidade!</ThemedText>
              <BlocoDinamico blocos={blocos} />
            </View>
          </ScrollView>
        )}

        {abaAtiva === 'pesquisar' && (
          <View style={styles.conteudoCentralizado}>
            <ThemedText>Conteúdo de Pesquisa</ThemedText>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#f1f2f2',

  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
  },
  fundoBranco: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 5,
    minHeight: 550,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
  },
});
