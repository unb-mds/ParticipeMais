import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Cabecalho from '@/components/cabecalho';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');
const GRID_SIZE = 2;
const QUADRADO_GRANDE_SIZE = width - 40;
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE;

// Componentes de exemplo para cada tipo de quadrado
const QuadradoProposta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#aaf' }]}>

    <Text style={styles.textoQuadrado}>Proposta</Text>
  </View>
);
const QuadradoBotao = () => (
  <View style={[styles.quadrado, { backgroundColor: '#faa' }]}>
    <ThemedText style={styles.textoQuadrado}> Qual tema você se interessa mais?</ThemedText>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
  </View>
);
const QuadradoPergunta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#afa' }]}>
    <Text style={styles.textoQuadrado}>Pergunta</Text>
  </View>
);

// Função para embaralhar array (Fisher-Yates) Ia veio clutch :P
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
  // Estado para controlar qual aba está ativa
  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');

  // Quantidades desejadas de cada tipo de quadrado
  const propostas = 9;
  const botoes = 1;
  const perguntas =3;

  // useMemo para gerar e randomizar os dados apenas uma vez por montagem do componente
  const data = useMemo(() => {
    // Cria arrays de objetos para cada tipo, cada um com id único e tipo correspondente
    const arr = [
      ...Array.from({ length: propostas }, (_, i) => ({ id: `proposta-${i}`, tipo: 'proposta' })),
      ...Array.from({ length: perguntas }, (_, i) => ({ id: `pergunta-${i}`, tipo: 'pergunta' })),
    ];
    
    // Randomiza o array
    const arrShuffle = shuffle(arr);

    // Seta a primeira posicao do array como botao
    arrShuffle[0] = ({ id: `botao-${botoes}`, tipo: 'botao' })
    
    // Junta as propostas (prioridade) seguidas dos outros tipos embaralhados
    return [...arrShuffle];
  }, []);

  // Função que renderiza o componente correto de acordo com o tipo do item
  const renderItem = ({ item }: { item: { tipo: string } }) => {
    if (item.tipo === 'proposta') return <QuadradoProposta />;
    if (item.tipo === 'botao') return <QuadradoBotao />;
    if (item.tipo === 'pergunta') return <QuadradoPergunta />;
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho fixo no topo da tela */}
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
              ListHeaderComponent={
                <ThemedText style={styles.titulo}>Descubra!</ThemedText>
              }
              ListHeaderComponentStyle={styles.headerStyle}
            />
          </View>
        )}

        {abaAtiva === 'comunidade' && (
          <View style={styles.conteudoCentralizado}>
            <ThemedText>Conteúdo da Comunidade</ThemedText>
          </View>
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
  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
