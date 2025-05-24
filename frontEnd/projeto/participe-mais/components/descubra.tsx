import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');
const GRID_SIZE = 2;
const QUADRADO_GRANDE_SIZE = width - 40;
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE;

const QuadradoProposta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#aaf' }]}>
    <ThemedText style={styles.textoQuadrado}>Proposta</ThemedText>
  </View>
);
type Item = {
  id: string;
  tipo: 'proposta' | 'botao' | 'pergunta';
};

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
    <ThemedText style={styles.textoQuadrado}>Pergunta</ThemedText>
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

export default function DescubraSection() {
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

const renderItem = ({ item }: { item: Item }) => {
  if (item.tipo === 'proposta') return <QuadradoProposta />;
  if (item.tipo === 'botao') return <QuadradoBotao />;
  if (item.tipo === 'pergunta') return <QuadradoPergunta />;
  return null;
};


  return (
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
  );
}

const styles = StyleSheet.create({
  conteiner_quadrado: {
    backgroundColor: 'white',
    margin: 7,
    minHeight: QUADRADO_GRANDE_SIZE,
    width: QUADRADO_GRANDE_SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  gridContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerStyle: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    marginBottom: 12,
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
});
