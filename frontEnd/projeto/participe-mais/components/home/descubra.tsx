import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window');
const GRID_SIZE = 2;
const QUADRADO_GRANDE_SIZE = width - 20;
const tamanhoQuadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE;

interface Conferencia { id: number; image_url: string; titulo: string; }
interface Plano { id: number; image_url: string; nome: string; }
interface Consulta { id: number; image_url: string; nome: string; }
interface Proposta { id: number; titulo_proposta: string; autor: string; }

type ItemType = 'proposta' | 'botao' | 'comentario' | 'enquete' | 'conferencia' | 'forum' | 'plano' | 'consulta';

const CORES_QUADRADOS = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
const gerarCorAleatoria = () => CORES_QUADRADOS[Math.floor(Math.random() * CORES_QUADRADOS.length)];

interface Item {
  id: string;
  tipo: ItemType;
  imagemUrl?: string;
  pergunta?: string;
  titulo_proposta?: string;
  autor?: string;
  comentario_usuario?: string;
  alternativas?: string[]; // ✅ adicionado aqui!
};

type PropsQuadradoProposta = {
  titulo_proposta?: string;
  autor?: string;
  cor?: string;
};

// Versão final combinada do QuadradoProposta
const QuadradoProposta = ({
  titulo_proposta = 'Proposta',
  autor = '',
  cor,
}: PropsQuadradoProposta) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', "#F44336"];
  const corFinal = cor || cores[Math.floor(Math.random() * cores.length)];

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={[styles.quadrado, { backgroundColor: corFinal }]}>
        <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
        {autor !== '' && <Text style={styles.nomeCantoProp}>{autor}</Text>}
        <Text style={[styles.textoComentario, { fontSize: getTamanhoFonte(titulo_proposta) }]}>
          {titulo_proposta}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Quadrado especial com botões de resposta
const QuadradoBotao = ({ alternativas, pergunta }: { alternativas: string[], pergunta: string }) => {
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [corSelecionada, setCorSelecionada] = useState<string>('');
  const coresAleatorias = ['#2670E8', '#4CAF50', '#FF9800', '#F44336', '#ce93d8'];

  const votar = (index: number) => {
    setRespostaSelecionada(index);
    setCorSelecionada(coresAleatorias[Math.floor(Math.random() * coresAleatorias.length)]);
  };

  return (
    <View style={styles.quadradoBotao}>
      <Text style={styles.textoQuadrado}>{pergunta}</Text>
      {alternativas.map((alt, i) => {
        const selecionado = respostaSelecionada === i;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.botao_retangular,
              selecionado && { backgroundColor: corSelecionada },
            ]}
            onPress={() => votar(i)}
            disabled={respostaSelecionada !== null}
          >
            <Text style={[styles.textoQuadradoForum, { color: selecionado ? '#fff' : '#000' }]}>
              {alt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const QuadradoComentario = ({ comentario, autor }: { comentario: string; autor: string }) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria }]}>
        <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
        <Text style={styles.nomeCantocomentario}>{autor}</Text>
        <Text style={[styles.Comentario, { fontSize: getTamanhoFonte(comentario) }]}>
          {`"${comentario}"`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const QuadradoEnquete = ({ pergunta }: { pergunta: string }) => {
  const [resposta, setResposta] = useState<'sim' | 'nao' | null>(null);

  return (
    <View style={[styles.quadrado, { backgroundColor: '#ffd', padding: 10 }]}>
      <Text style={[styles.textoQuadrado, { marginBottom: 10 }]}>{pergunta}</Text>
      <View style={styles.botoesAvaliacao}>
        {resposta !== 'nao' && (
          <TouchableOpacity
            style={[
              styles.botaoSim,
              resposta === 'sim' && { paddingHorizontal: 30, paddingVertical: 12 },
            ]}
            onPress={() => setResposta('sim')}
          >
            <Text style={[styles.textoSim, resposta === 'sim' && { fontSize: 16 }]}>Sim</Text>
          </TouchableOpacity>
        )}
        {resposta !== 'sim' && (
          <TouchableOpacity
            style={[
              styles.botaoNao,
              resposta === 'nao' && { paddingHorizontal: 30, paddingVertical: 12 },
            ]}
            onPress={() => setResposta('nao')}
          >
            <Text style={[styles.textoNao, resposta === 'nao' && { fontSize: 16 }]}>Não</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const QuadradoComentario = ({ comentario, autor, cor }: { comentario: string; autor: string; cor: string }) => (
  <TouchableOpacity activeOpacity={0.7}>
    <View style={[styles.quadrado, { backgroundColor: cor }]}>      
      <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
      <Text style={styles.nomeCantoComentario}>{autor}</Text>
      <Text style={[styles.textoComentario, { fontSize: getTamanhoFonte(comentario) }]}>
        {`"${comentario}"`}
      </Text>
    </View>
  </TouchableOpacity>
);

const QuadradoForum = ({ pergunta, autor, cor }: { pergunta: string; autor: string; cor: string }) => (
  <TouchableOpacity activeOpacity={0.7}>
    <View style={[styles.quadrado, { backgroundColor: cor, padding: 10 }]}>      
      <Text style={[styles.textoQuadradoForum, { fontSize: getTamanhoFonte(pergunta) }]}>{pergunta}</Text>
      <View style={styles.viewForum}>
        <AntDesign name="user" size={24} color="white" />
        <Text style={styles.textoAutorForum}>{autor} compartilhou</Text>
      </View>
    </View>
  </TouchableOpacity>
);

function getTamanhoFonte(texto: string = ''): number {
  if (!texto) return 14;
  if (texto.length <= 90) return 16;
  if (texto.length <= 110) return 14;
  if (texto.length <= 130) return 12;
  return 10;
}

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Componente principal
export default function DescubraSection() {
// Dentro do componente DescubraSection

const [data, setData] = useState<Item[]>([]);
const [refreshing, setRefreshing] = useState(false);
const [conferencias, setConferencias] = useState<Conferencia[]>([]);
const [planos, setPlanos] = useState<Plano[]>([]);
const [consultas, setConsultas] = useState<Consulta[]>([]);
const [propostas, setPropostas] = useState<Proposta[]>([]);
const [loadingToken, setLoadingToken] = useState(true);
const [token, setToken] = useState('');
const [error, setError] = useState<string | null>(null);
const router = useRouter();

// Obter token
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
      console.error('Erro ao recuperar token:', error);
      router.replace('/login');
    } finally {
      setLoadingToken(false);
    }
  };

  obterToken();
}, []);

// Buscar dados quando o token estiver disponível
useEffect(() => {
  if (token) {
    fetchDescubra();
  }
}, [token]);

// Atualizar dados quando as listas forem alteradas
useEffect(() => {
  atualizarDados();
}, [conferencias, planos, consultas, propostas]);

// Buscar dados da API
const fetchDescubra = useCallback(async () => {
  try {
    setRefreshing(true);
    setError(null);

    const response = await fetch('http://172.20.10.9:8000/descubra/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      setConferencias(json.data.conferencias || []);
      setPlanos(json.data.planos || []);
      setConsultas(json.data.consultas || []);
      setPropostas(json.data.propostas || []);
    } else if (response.status === 401 || response.status === 403) {
      router.replace('/login');
    } else {
      setError('Erro ao carregar dados');
      console.error('Erro ao buscar dados:', response.status);
    }
  } catch (error) {
    setError('Erro na conexão');
    console.error('Erro na requisição:', error);
  } finally {
    setRefreshing(false);
  }
}, [token]);

// Atualizar os dados locais combinando todos os blocos
const atualizarDados = useCallback(() => {
  const comentariosMock: Item[] = Array.from({ length: 5 }, (_, i) => ({
    id: `comentario-${i}`,
    tipo: 'comentario',
    comentario_usuario: 'Exemplo de comentário',
    autor: 'UsuárioX',
    cor: gerarCorAleatoria(),
  }));

  const enquetesMock: Item[] = Array.from({ length: 2 }, (_, i) => ({
    id: `enquete-${i}`,
    tipo: 'enquete',
  }));

  const forunsMock: Item[] = Array.from({ length: 1 }, (_, i) => ({
    id: `forum-${i}`,
    tipo: 'forum',
    pergunta: 'O que você acha da arborização urbana?',
    autor: 'ForistaX',
    cor: gerarCorAleatoria(),
  }));

  const propostasData: Item[] = propostas.map((item, i) => ({
    id: `proposta-${i}`,
    tipo: 'proposta' as const,
    titulo_proposta: item.titulo_proposta,
    autor: item.autor,
    cor: gerarCorAleatoria(),
  }));

  const imagensData: Item[] = [
    ...conferencias.map(item => ({
      id: `conferencia-${item.id}`,
      tipo: 'conferencia' as const,
      imagemUrl: item.image_url,
    })),
    ...planos.map(item => ({
      id: `plano-${item.id}`,
      tipo: 'plano' as const,
      imagemUrl: item.image_url,
    })),
    ...consultas.map(item => ({
      id: `consulta-${item.id}`,
      tipo: 'consulta' as const,
      imagemUrl: item.image_url,
    })),
  ];

  const blocos: Item[] = shuffle([
    {
      id: 'botao-0',
      tipo: 'botao',
      pergunta: 'Qual tema você se interessa mais?',
      alternativas: ['Educação', 'Meio Ambiente', 'Saúde'],
    },
    ...propostasData,
    ...comentariosMock,
    ...enquetesMock,
    ...forunsMock,
    ...imagensData,
  ]);

  setData(blocos);
}, [conferencias, planos, consultas, propostas]);

// Atualizar manualmente
const handleRefresh = useCallback(() => {
  setRefreshing(true);
  fetchDescubra().finally(() => setRefreshing(false));
}, [fetchDescubra]);


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchDescubra} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
              
const renderItem = ({ item }: { item: Item }) => {
  if (item.tipo === 'proposta') return <QuadradoProposta />;
  if (item.tipo === 'botao')
    return <QuadradoBotao alternativas={item.alternativas ?? []} pergunta={item.pergunta ?? ''} />;

  if (item.tipo === 'comentario')
    return (
      <QuadradoComentario
        comentario={
          item.comentario_usuario ??
          'Gostaria de ver mais oficinas extracurriculares nas escolas públicas, como música e programação.'
        }
        autor={item.autor ?? 'Joao'}
      />
    );

  if (item.tipo === 'enquete') return <QuadradoEnquete pergunta={item.pergunta ?? 'Você se interessa por infraestrutura?'} />;
  if (item.tipo === 'conferencia') return <QuadradoConferencia imagemUrl={item.imagemUrl!} />;
  if (item.tipo === 'forum') {
    return <QuadradoForum pergunta={item.pergunta ?? 'Arborização?'} autor={item.autor ?? 'Joao'} />;
  }

  return null;
};
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={GRID_SIZE}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.titulo}>Descubra!</Text>}
        ListHeaderComponentStyle={styles.headerStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2670E8']}
            tintColor={'#2670E8'}
          />
        }
      />
    </View>
  );
}

// Estilos (mantidos iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: QUADRADO_GRANDE_SIZE,
    width: QUADRADO_GRANDE_SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2670E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  gridContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Raleway_700Bold',
  },
  headerStyle: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    marginBottom: 12,
  },
  quadrado: {
    width: tamanhoQuadrado,
    height: tamanhoQuadrado,
    borderRadius: 12,
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoQuadrado: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway_700Bold',
    textAlign: 'center',
  },
  botaoRetangular: {
    width: 150,
    height: 25,
    borderRadius: 12,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  quadradoBotao: {
    width: tamanhoQuadrado,
    height: tamanhoQuadrado,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ccc',
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoQuadradoForum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Raleway_700Bold',
    padding: 6,
  },
  viewForum: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  textoAutorForum: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4
  },
  iconeCanto: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  nomeCantoComentario: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Raleway_700Bold',
  },
  nomeCantoProp: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Raleway_700Bold',
  },
  textoComentario: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
    padding: 6,
  },
  botoesAvaliacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  botaoSim: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8BC34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  botaoNao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoSim: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Raleway_700Bold',
  },
  textoNao: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Raleway_700Bold',
  },
});
