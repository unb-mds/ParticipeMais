import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome6,
} from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Categoria {
  id: number;
  nome: string;
}

interface Comentario {
  id: number;
  chat_id: number;
  autor_nome: string;
  pergunta: string;
  conteudo: string;
}

interface Enquete {
  id: number;
  pergunta: string;
  categoria: string;
  data_criacao: string;
  autor_nome: string;
  comentarios: Comentario[];
  total_curtidas: number;
}

interface Usuarios {
  id: number;
  nome: string;
}

export default function ComunidadePage() {
  const router = useRouter();

  const [token, setToken] = useState<string>('');
  const [quantidadeChat, setQuantidadeChat] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [comentariosEnquetes, setComentariosEnquetes] = useState<Comentario[]>([]);
  const [enquetes, setEnquetes] = useState<Enquete[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchComunidades();
      fetchComentarios();
    }
  }, [token]);

  const fetchComunidades = async () => {
    try {
      const response = await fetch('http://localhost:8000/comunidade/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setUsuarios(data.usuarios_ativos ?? []);
        setQuantidadeChat(data.quantidade_chat ?? null);
        setCategorias(data.categorias ?? []);
        setEnquetes(data.enquetes ?? []);
      } else {
        console.error('Erro ao buscar dados:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComentarios = async () => {
    try {
      const response = await fetch('http://localhost:8000/comunidade/carrosel/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComentariosEnquetes(data.comentarios ?? []);
      } else {
        console.error('Erro ao buscar dados:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <BlocoListaDadosComunidade usuarios={usuarios} comentarios={quantidadeChat} />
      <BlocoEnqueteCategoria dados={categorias} />
      <BlocoEnqueteComentarios dados={comentariosEnquetes} />
      <BlocoEnqueteComentariosColuna dados={enquetes} />
    </View>
  );
}

function BlocoListaDadosComunidade({
  usuarios,
  comentarios,
}: {
  usuarios: Usuarios[];
  comentarios: number | null;
}) {
  if (!usuarios || comentarios === null) {
    return <Text style={styles.emptyText}>Dados de usuários ou comentários não encontrados.</Text>;
  }

  return (
    <View style={styles.lista_comunidade_container}>
      <View style={styles.containerComentarios}>
        <Text style={styles.title_comentarios}>Total de comentários</Text>
        <Text style={styles.numero_universal}>{comentarios}</Text>
      </View>
      <View style={styles.containerUsuarios}>
        <Text style={styles.title_comentarios_usuario}>Usuários ativos</Text>
        <Text style={styles.numero_universal_usuarios}>{usuarios.length}</Text>
        {usuarios.slice(0, 5).map((usuario, idx) => (
          <Text key={idx} style={{ color: '#333', fontSize: 12 }}>
            {usuario.nome}
          </Text>
        ))}
        {usuarios.length > 5 && (
          <Text style={{ color: '#555', fontSize: 12 }}>e mais {usuarios.length - 5}...</Text>
        )}
      </View>
    </View>
  );
}

function BlocoEnqueteCategoria({ dados }: { dados: Categoria[] }) {
  const router = useRouter();

  if (!dados.length) return <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>;

  return (
    <FlatList
      data={dados}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/comunidade/categorias',
              params: { id: item.id.toString() },
            })
          }
        >
          <View style={[styles.bloco_enquete, { backgroundColor: corDaCategoria(item.nome) }]}>
            {getIconByCategoria(item.nome)}
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.titulo_carrossel}>{item.nome}</Text>
              <Text style={styles.contador}>Sem dados de chat</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function BlocoEnqueteComentarios({ dados }: { dados: Comentario[] }) {
  const router = useRouter();

  if (!dados.length) return <Text style={styles.emptyText}>Nenhum comentário encontrado.</Text>;

  return (
    <>
      <View style={styles.viewAlinhador}>
        <Text style={styles.titulo_enquete}>Acesse as enquetes pelos comentários!</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carrossel}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        data={dados}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/enquete',
                params: { id: item.id },
              })
            }
          >
            <View style={[styles.bloco_comentarios, { backgroundColor: '#fff' }]}>
              <Text style={styles.autorComentario}>{item.autor_nome}</Text>
              <Text style={styles.comentarioTexto}>{`"${item.conteudo}"`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

function BlocoEnqueteComentariosColuna({ dados }: { dados: Enquete[] }) {
  const router = useRouter();

  if (!dados.length) return <Text style={styles.emptyText}>Nenhuma enquete encontrada.</Text>;

  return (
    <>
      <View style={styles.viewAlinhador}>
        <Text style={styles.titulo_enquete}>Todas as enquetes</Text>
      </View>
      <FlatList
        data={dados}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carrosselEnquete}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={`${item.categoria}-${index}`}
            onPress={() =>
              router.push({
                pathname: '/enquete',
                params: { id: item.id },
              })
            }
          >
            <View
              style={[
                styles.cardComentarioHorizontal,
                { backgroundColor: corDaCategoriaNumero(item.categoria) },
              ]}
            >
              <View style={styles.dados_enquete}>
                <View style={styles.container_view_enquentes}>
                  <Text style={styles.comentarioTextoEnquete}>{item.pergunta}</Text>
                </View>
                <View style={styles.container_view_enquentes}>
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={14}
                    color="black"
                    style={styles.iconInline}
                  />
                  <Text> {item.total_curtidas} curtidas</Text>
                  <Text> - </Text>
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={12}
                    color="#black"
                    style={styles.iconInline}
                  />
                  <Text> {item.comentarios.length} comentários</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}

// ---------------------- ESTILOS E HELPERS ----------------------------

function corDaCategoria(categoria: string): string {
  if (!categoria) return '#e0e0e0';
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',
    infraestrutura: '#FF9800',
    saúde: '#2670E8',
    educação: '#ce93d8',
    'direito das mulheres': '#FF1493',
    'igualdade racial': '#CD853F',
    'direitos da pessoa idosa': '#F0E68C',
    'desenvolvimento rural': '#006400',
    tecnologia: '#8B008B',
    'participação social': '#F44336',
  };
  return mapaCores[categoria?.toLowerCase?.() || ''] || '#e0e0e0';
}

function corDaCategoriaNumero(categoria: string): string {
  if (!categoria) return '#e0e0e0';
  const mapaCores: Record<string, string> = {
    '5': '#4CAF50',
    '9': '#FF9800',
    '7': '#2670E8',
    '8': '#ce93d8',
    '1': '#FF1493',
    '2': '#CD853F',
    '3': '#F0E68C',
    '4': '#006400',
    '10': '#8B008B',
    '6': '#F44336',
  };
  return mapaCores[categoria || ''] || '#e0e0e0';
}

function getIconByCategoria(categoria: string, cor: string = '#fff') {
  if (!categoria) {
    return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return <Ionicons name="leaf-outline" size={24} color={cor} />;
    case 'educação':
      return <MaterialIcons name="school" size={24} color={cor} />;
    case 'saúde':
      return <Ionicons name="medkit" size={24} color={cor} />;
    case 'infraestrutura':
      return <MaterialCommunityIcons name="wheel-barrow" size={24} color={cor} />;
    case 'participação social':
      return <FontAwesome name="group" size={24} color={cor} />;
    case 'direito das mulheres':
      return <Ionicons name="woman" size={24} color={cor} />;
    case 'tecnologia':
      return <FontAwesome6 name="user-gear" size={24} color={cor} />;
    case 'desenvolvimento rural':
      return <FontAwesome6 name="cow" size={24} color={cor} />;
    case 'direitos da pessoa idosa':
      return <MaterialIcons name="elderly" size={24} color={cor} />;
    case 'igualdade racial':
      return <FontAwesome5 name="equals" size={24} color={cor} />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: '#F9F9F9',
    gap: 32,
  },
  viewAlinhador: {
    width: '100%',
    paddingHorizontal: 8,
  },
  titulo_enquete: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 12,
  },

  // Bloco total de dados (comentários e usuários)
  lista_comunidade_container: {
    flexDirection: 'row',
    gap: 16,
  },
  containerComentarios: {
    flex: 1,
    backgroundColor: '#2670E8',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
  },
  containerUsuarios: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  title_comentarios: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  title_comentarios_usuario: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  numero_universal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  numero_universal_usuarios: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  // Categorias (carrossel horizontal)
  carrossel: {
    gap: 12,
    paddingHorizontal: 8,
  },
  bloco_enquete: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    minWidth: 180,
    gap: 10,
  },
  titulo_carrossel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  contador: {
    color: '#fff',
    fontSize: 12,
  },

  // Comentários das enquetes (carrossel horizontal)
  bloco_comentarios: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    minWidth: 220,
    maxWidth: 260,
    marginVertical: 4,
  },
  autorComentario: {
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  comentarioTexto: {
    color: '#000',
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 18,
  },

  // Carrossel horizontal para enquetes
  carrosselEnquete: {
    paddingHorizontal: 8,
    gap: 12,
  },

  // Card de enquete no carrossel horizontal
  cardComentarioHorizontal: {
    padding: 16,
    borderRadius: 12,
    width: SCREEN_WIDTH * 0.8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  // Lista vertical foi substituída pelo carrossel horizontal, mas mantive para referência
  listaVertical: {
    gap: 16,
  },
  comentarioTextoEnquete: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  dados_enquete: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 50,
  },
  container_view_enquentes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  iconInline: {
    marginHorizontal: 4,
  },
});
