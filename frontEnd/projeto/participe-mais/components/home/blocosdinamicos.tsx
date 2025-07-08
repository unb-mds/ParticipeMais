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
const larguraQuadrado = SCREEN_WIDTH * 0.85;
const router = useRouter()
// ---------------------- INTERFACES ----------------------------

interface Categoria {
  id: number;
  nome: string;
}

interface Comentario {
  categoria: string;
  comentario: string;
  autor: string;
}

interface Enquete {
  categoria: string;
  enquete: string;
  curtidas: number;
  numeroComentario: number;
}

// ---------------------- COMPONENTE PRINCIPAL ----------------------------

export default function ComunidadePage() {
  const router = useRouter();

  const [token, setToken] = useState<string>('');
  const [usuariosAtivos, setUsuariosAtivos] = useState<number | null>(null);
  const [quantidadeChat, setQuantidadeChat] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [comentariosEnquetes, setComentariosEnquetes] = useState<Comentario[]>([]);
  const [enquetes, setEnquetes] = useState<Enquete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) setToken(tokenSalvo);
        else router.replace('/login');
      } catch {
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token) fetchComunidades();
  }, [token]);

  const fetchComunidades = async () => {
    try {
      const response = await fetch('http://localhost:8000/comunidade', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setQuantidadeChat(data.quantidade_chat ?? null);
        setCategorias(data.categorias ?? []);
        setComentariosEnquetes(data.comentarios ?? []);
        setEnquetes(data.Enquetes ?? []);
      } else {
        console.error('Erro ao buscar dadoos:', response.status);
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
      <BlocoListaDadosComunidade usuarios={usuariosAtivos} comentarios={quantidadeChat} />
      <BlocoEnqueteCategoria dados={categorias} />
      <BlocoEnqueteComentarios dados={comentariosEnquetes} />
      <BlocoEnqueteComentariosColuna dados={enquetes} />
    </View>
  );
}

// ---------------------- COMPONENTES ----------------------------

function BlocoListaDadosComunidade({
  usuarios,
  comentarios,
}: {
  usuarios: number | null;
  comentarios: number | null;
}) {
  if (usuarios === null || comentarios === null) {
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
        <Text style={styles.numero_universal_usuarios}>{usuarios}</Text>
      </View>
    </View>
  );
}

function BlocoEnqueteCategoria({ dados }: { dados: Categoria[] }) {
  if (!dados.length)
    return <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>;

  return (
    <FlatList
      data={dados}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push({
            pathname: '/comunidade/categorias',
            params: { id: item.id.toString() }
          })}>
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
  if (!dados.length)
    return <Text style={styles.emptyText}>Nenhum comentário encontrado.</Text>;

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item, index) => `${item.categoria}-${index}`}
      data={dados}
      renderItem={({ item }) => (
        <TouchableOpacity>
          <View style={[styles.bloco_comentarios, { backgroundColor: corDaCategoria(item.categoria) }]}>
            <Text style={styles.autorComentario}>{item.autor}</Text>
            <Text style={styles.comentarioTexto}>{`"${item.comentario}"`}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function BlocoEnqueteComentariosColuna({ dados }: { dados: Enquete[] }) {
  if (!dados.length)
    return <Text style={styles.emptyText}>Nenhuma enquete encontrada.</Text>;

  return (
    <View style={styles.listaVertical}>
      {dados.map((item, index) => (
        <TouchableOpacity key={`${item.categoria}-${index}`}>
          <View style={styles.cardComentario}>
            <Text style={styles.comentarioTextoEnquete}>{item.enquete}</Text>
            <Text>{item.curtidas} curtidas - {item.numeroComentario} comentários</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---------------------- ESTILOS E HELPERS ----------------------------

function corDaCategoria(categoria: string): string {
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
    'participação social': '#4682B4',
  };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}

function getIconByCategoria(categoria: string, cor: string = '#fff') {
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return <Ionicons name="leaf-outline" size={24} color={cor} />;
    case 'educação':
      return <MaterialIcons name="school" size={24} color={cor} />;
    case 'saúde':
      return <Ionicons name="medkit" size={24} color={cor} />;
    case 'infraestrutura':
      return <MaterialCommunityIcons name="wheel-barrow" size={24} color={cor} />;
    case 'direito das mulheres':
      return <Ionicons name="woman" size={24} color={cor} />;
    case 'tecnologia':
      return <FontAwesome6 name="user-gear" size={24} color={cor} />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  lista_comunidade_container: {
    flexDirection: 'row',
    gap: 16,
  },
  containerComentarios: {
    flex: 1,
    backgroundColor: '#2670E8',
    borderRadius: 8,
    padding: 16,
  },
  containerUsuarios: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  title_comentarios: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  numero_universal: {
    fontSize: 20,
    color: '#fff',
  },
  title_comentarios_usuario: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  numero_universal_usuarios: {
    fontSize: 20,
    color: '#000',
  },
  carrossel: {
    gap: 12,
    paddingHorizontal: 8,
  },
  bloco_enquete: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  titulo_carrossel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contador: {
    color: '#fff',
    fontSize: 12,
  },
  bloco_comentarios: {
    padding: 12,
    borderRadius: 10,
    minWidth: 200,
    maxWidth: 250,
  },
  autorComentario: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comentarioTexto: {
    color: '#fff',
  },
  listaVertical: {
    gap: 12,
  },
  cardComentario: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  comentarioTextoEnquete: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
