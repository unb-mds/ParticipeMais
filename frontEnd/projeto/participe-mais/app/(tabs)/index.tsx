import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import Cabecalho from '@/components/cabecalho';
import { ThemedText } from '@/components/ThemedText';
import BlocoDinamico from '@/components/blocosdinamicos';

const { width } = Dimensions.get('window');
const GRID_SIZE = 2; // colunas do descubra
const QUADRADO_GRANDE_SIZE = width - 30; // quadrado branco dos box de opções
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE; // tamanho das caixinhas descubra

// Definição de tipo para itens do FlatList
type ItemTipo = {
  id: string;
  tipo: 'proposta' | 'botao' | 'pergunta';
};

// trocar de componente e botar a cor azul nos ativados
export default function HomeScreen() {
  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');


// Componentes quadrados do descubra
const QuadradoProposta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#aaf' }]}>
    <Text style={styles.textoQuadrado}>Proposta</Text>
  </View>
);

const QuadradoVotacao = () => (
  <View style={[styles.quadrado, { backgroundColor: '#faa' }]}>
    <ThemedText style={styles.textoQuadrado}> Qual tema você se interessa mais?</ThemedText>
    <TouchableOpacity style={styles.botao_retangular} />
    <TouchableOpacity style={styles.botao_retangular} />
    <TouchableOpacity style={styles.botao_retangular} />
  </View>
);

const QuadradoPergunta = () => (
  <View style={[styles.quadrado, { backgroundColor: '#afa' }]}>
    <Text style={styles.textoQuadrado}>Pergunta</Text>
  </View>
);

// Função para embaralhar array
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex],
    ];
  }

  return array;
}


// Comunidade

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

// Fim da comunidade

  const propostas = 9;
  const botoes = 1;
  const perguntas = 3;

  // Criar dados com ids únicos e embaralhar
    const data = useMemo(() => {
  const arr: ItemTipo[] = [
    ...Array.from({ length: propostas }, (_, i) => ({ id: `proposta-${i}`, tipo: 'proposta' } as ItemTipo)),
    ...Array.from({ length: perguntas }, (_, i) => ({ id: `pergunta-${i}`, tipo: 'pergunta' } as ItemTipo)),
  ];

  const arrShuffle = shuffle(arr);

  // Substitui o primeiro item por um botão — botao também está no tipo ItemTipo
  arrShuffle[0] = { id: `botao-${botoes}`, tipo: 'botao' };

  return arrShuffle;
}, []);


  const renderItem = ({ item }: { item: ItemTipo }) => {
    // Só para debug, remova em produção
    // console.log('renderItem:', item);

    switch (item.tipo) {
      case 'proposta':
        return <QuadradoProposta />;
      case 'botao':
        return <QuadradoVotacao />;
      case 'pergunta':
        return <QuadradoPergunta />;
      default:
        return null;
    }
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

      <View style={styles.conteiner_quadrado}>
        {abaAtiva === 'descubra' && (
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
        )}

        {abaAtiva === 'comunidade' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fundoBranco}>
              <ThemedText style={styles.titulo}>Conheça a comunidade</ThemedText>
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
    
  }, // fundo das caixas 
  conteiner_quadrado: {
    backgroundColor: 'white',
    margin: 0,
    padding: 2,
    minHeight: QUADRADO_GRANDE_SIZE + 30,
    height: 'auto',
    width: QUADRADO_GRANDE_SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
    top: -30,
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
    height: 20,
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
});
