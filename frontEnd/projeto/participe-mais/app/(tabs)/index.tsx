import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import Cabecalho from '@/components/cabecalho';
import { ThemedText } from '@/components/ThemedText';
import BlocoDinamico from '@/components/blocosdinamicos';
import { useRouter } from 'expo-router';

const router = useRouter();

const { width } = Dimensions.get('window');
const GRID_SIZE = 2;
const QUADRADO_GRANDE_SIZE = width - 40;
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE;

const QuadradoProposta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#aaf' }]}>
    <Text style={styles.textoQuadrado}>Proposta</Text>
  </View>
);
const QuadradoBotao = () => (
  <View style={[styles.quadrado, { backgroundColor: '#faa' }]}>
    <ThemedText style={styles.textoQuadrado}> Qual tema você se interessa mais?</ThemedText>
    <TouchableOpacity style={styles.botao_retangular}> </TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
  </View>
);
const QuadradoPergunta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#afa' }]}>
    <Text style={styles.textoQuadrado}>Pergunta</Text>
  </View>
);

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}




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

  const propostas = 9;
  const botoes = 1;
  const perguntas = 3;

  const data = useMemo(() => {
    const arr = [
      ...Array.from({ length: propostas }, (_, i) => ({ id: `proposta-${i}`, tipo: 'proposta' })),
      ...Array.from({ length: perguntas }, (_, i) => ({ id: `pergunta-${i}`, tipo: 'pergunta' })),
    ];
    const arrShuffle = shuffle(arr);
    arrShuffle[0] = { id: `botao-${botoes}`, tipo: 'botao' };
    return [...arrShuffle];
  }, []);

  const renderItem = ({ item }: { item: { tipo: string } }) => {
    if (item.tipo === 'proposta') return <QuadradoProposta />;
    if (item.tipo === 'botao') return <QuadradoBotao />;
    if (item.tipo === 'pergunta') return <QuadradoPergunta />;
    return null;
  };

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
        {abaAtiva === 'descubra' && (
          <View style={styles.conteiner_quadrado}>
            <FlatList
              data={data}
              renderItem={renderItem}
              numColumns={GRID_SIZE}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<ThemedText style={styles.titulo}>Descubra!</ThemedText>}
              ListHeaderComponentStyle={styles.headerStyle}
            />
          </View>
        )}

        {abaAtiva === 'comunidade' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fundoBranco}>
              <ThemedText style={styles.title}>Conheça a comunidade</ThemedText>
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
    backgroundColor: '#f2f2f2',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  conteiner_quadrado: {
    backgroundColor: 'white',
    margin: 7,
    minHeight: QUADRADO_GRANDE_SIZE,
    width: QUADRADO_GRANDE_SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  headerStyle: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  gridContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  quadrado: {
    width: taman_quadrado,
    height: taman_quadrado,
    borderRadius: 12,
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoQuadrado: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    padding: 5,
  },
  botao_retangular: {
    width: 125,
    height: 15,
    borderRadius: 12,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    backgroundColor: '#ccc',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 5,
  },
  fundoBranco: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 5,
    minHeight: 550,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
