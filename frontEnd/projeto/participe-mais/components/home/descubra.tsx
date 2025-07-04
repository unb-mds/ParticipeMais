import React, { useEffect, useState, useCallback } from 'react';
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
  cor?: string;
}

const QuadradoProposta = ({ titulo_proposta, autor, cor }: { titulo_proposta: string, autor: string, cor: string }) => (
  <TouchableOpacity activeOpacity={0.7}>
    <View style={[styles.quadrado, { backgroundColor: cor }]}>      
      <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
      <Text style={styles.nomeCantoProp}>{autor}</Text>
      <Text style={[styles.textoComentario, { fontSize: getTamanhoFonte(titulo_proposta) }]}> {titulo_proposta} </Text>
    </View>
  </TouchableOpacity>
);

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

  // Atualizar dados quando os dados da API mudarem
  useEffect(() => {
    // console.log('Dados atualizados:', { conferencias, planos, consultas, propostas });
    atualizarDados();
  }, [conferencias, planos, consultas, propostas]);

  // Buscar dados da API

  const fetchDescubra = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/descubra/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

  // Atualizar dados locais
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
    ...conferencias
      .filter(item => item.id !== undefined && item.id !== null)
      .map(item => ({
        id: `conferencia-${item.id}`,
        tipo: 'conferencia' as const, // as const garante que o tipo seja literal
        imagemUrl: item.image_url,
      })),
    ...planos
      .filter(item => item.id !== undefined && item.id !== null)
      .map(item => ({
        id: `plano-${item.id}`,
        tipo: 'plano' as const,
        imagemUrl: item.image_url,
      })),
    ...consultas
      .filter(item => item.id !== undefined && item.id !== null)
      .map(item => ({
        id: `consulta-${item.id}`,
        tipo: 'consulta' as const, // adicionado as const aqui também
        imagemUrl: item.image_url,
      })),
  ];

    const blocos: Item[] = shuffle([
      { id: 'botao-0', tipo: 'botao' },
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

  // Renderizar os itens
  const renderItem = useCallback(({ item }: { item: Item }) => {
    const idNumerico = (item.id ?? '').toString().replace(/^\D+/g, '');

    switch (item.tipo) {
      case 'proposta': 
        return <QuadradoProposta titulo_proposta={item.titulo_proposta || ''} autor={item.autor || ''} cor={item.cor || '#ccc'} />;

      case 'comentario': 
        return <QuadradoComentario comentario={item.comentario_usuario || ''} autor={item.autor || ''} cor={item.cor || '#ccc'} />;

      case 'forum': 
        return <QuadradoForum pergunta={item.pergunta || ''} autor={item.autor || ''} cor={item.cor || '#ccc'} />;

      case 'enquete': 
        return (
          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.quadrado, { backgroundColor: '#ffd' }]}> 
              <Text style={styles.textoQuadrado}>Enquete</Text>
            </View>
          </TouchableOpacity>
        );

      case 'botao': 
        return (
          <View style={styles.quadradoBotao}>
            <Text style={styles.textoQuadrado}>Qual tema você se interessa mais?</Text>
            {[...Array(3)].map((_, i) => (
              <TouchableOpacity key={i} style={styles.botaoRetangular} />
            ))}
          </View>
        );

      case 'conferencia':
        return (
          <TouchableOpacity
            onPress={() => {
              if (idNumerico) {
                router.push({ pathname: '../conferencias', params: { id: idNumerico } });
              } else {
                console.warn('ID numérico inválido:', item.id);
              }
            }}
          >
            <ImageBackground
              source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150' }}
              style={styles.quadrado}
              imageStyle={{ borderRadius: 12 }}
            />
          </TouchableOpacity>
        );

      case 'plano':
        return (
          <TouchableOpacity
            onPress={() => {
              if (idNumerico) {
                router.push({ pathname: '../planos', params: { id: idNumerico } });
              } else {
                console.warn('ID numérico inválido:', item.id);
              }
            }}
          >
            <ImageBackground
              source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150' }}
              style={styles.quadrado}
              imageStyle={{ borderRadius: 12 }}
            />
          </TouchableOpacity>
        );
      case 'consulta':
        return (
          <TouchableOpacity
            onPress={() => {
              if (idNumerico) {
                router.push({ pathname: '../consultas', params: { id: idNumerico } });
              } else {
                console.warn('ID numérico inválido:', item.id);
              }
            }}
          >
            <ImageBackground
              source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150' }}
              style={styles.quadrado}
              imageStyle={{ borderRadius: 12 }}
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  }, [router]);

  if (loadingToken) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2670E8" />
      </View>
    );
  }

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
});