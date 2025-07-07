import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ImageBackground, ScrollView,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CategoriaDescricao from '../components/categoria/categoriadescricao';
import CategoriaIcone from '../components/categoria/categoriaIcon';
import NuvemDePalavras from '../components/categoria/nuvem';

export default function Categoria() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // obtém o id da categoria via rota
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [conferencias, setConferencias] = useState<ItemComImagem[]>([]);
  const [planos, setPlanos] = useState<ItemComImagem[]>([]);
  const [consultas, setConsultas] = useState<ItemComImagem[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
const [nomeCategoria, setNomeCategoria] = useState('Categoria');
  const [listaNuvem, setListaNuvem] = useState<string[]>([]);


  type ItemComImagem = {
  id: number;
  image_url: string;
};

  useEffect(() => {
      const obterToken = async () => {
        try {
          const tokenSalvo = await AsyncStorage.getItem('accessToken');
          console.log('Token recuperado3:', tokenSalvo); // 👈 veja se está vindo

          if (tokenSalvo) {
            setToken(tokenSalvo);
          } else {
            console.log('Token não encontrado, redirecionando...');
            router.replace('/login');
          }
        } catch (error) {
          console.log('Erro ao buscar token:', error);
          router.replace('/login');
        }
      };
    obterToken();
  }, []);



 const fetchCategoria = async () => {
  try {
     const response = await fetch(`http://localhost:8000/comunidade/categorias/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });


    if (response.ok) {
      const json = await response.json();

      setNomeCategoria(json.nome || 'Categoria');

      setConferencias(json.conferencias || []);
      setPlanos(json.planos || []);
      setConsultas(json.consultas || []);
      setComentarios(json.comentarios || []);
      setChats(json.chats || []); // <- 🟩 Adicione ISSO
      setListaNuvem(json.lista_nuvem || []);
      setLoading(false);
      console.log('JSON recebido:', json);

    } else {
      router.replace('/login');
    }
  } catch (error) {
    console.error('Erro na chamada da categoria:', error);

    router.replace('/');
  }
};

useEffect(() => {
  if (token && id) {
    fetchCategoria();
  }
}, [token, id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container_total}>
        <ActivityIndicator size="large" color="#2670E8" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>{nomeCategoria}</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={styles.container}>
        <View>
        <CategoriaDescricao categoria={nomeCategoria.toLowerCase()} />
        </View>
        {/* Conferências */}
        <Text style={styles.tituloSecao}>Conferências</Text>
          <FlatList
          data={conferencias}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Planos */}
        <Text style={styles.tituloSecao}>Planos</Text>
        <FlatList
          data={planos}
          horizontal
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Consultas */}
        <Text style={styles.tituloSecao}>Consultas</Text>
        <FlatList
          data={consultas}
          horizontal
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Enquetes */}
        <Text style={styles.tituloSecao}>Acesse as discussões por aqui!</Text>
        <View style={styles.quadroEnquete}>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {chats.map((item, index) => (
              <TouchableOpacity key={`${item.categoria}-${index}`}>
                <View style={styles.cardEnquete}>
                <View style={styles.linha_icon}>
                  <CategoriaIcone categoria={item.categoria} tamanho={35} />
                  <Text style={styles.textoEnquete}>{item.enquete}</Text>
                </View>
                <View style={styles.linha}>
                  
                  <MaterialCommunityIcons name="cards-heart-outline" size={14} color="#000" />
                  <Text style={styles.infoEnquete}>{item.curtidas} curtidas</Text>
                  <MaterialIcons name="chat-bubble-outline" size={12} color="#000" style={{ marginLeft: 12 }} />
                  <Text style={styles.infoEnquete}>{item.numeroComentario} comentários</Text>
                </View>
              </View>

              </TouchableOpacity>
            ))}
          </ScrollView>
          </View>
      <View style={styles.viewAlinhador}>
        <Text style={styles.titulo_enquete}>Acesse as enquetes pelos comentários!</Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carrossel}
          keyExtractor={(item, index) => `${item.categoria}-${index}`}
          data={comentarios} // <- você precisa ter `const dados = [...]` no mesmo arquivo
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={[styles.bloco_comentarios, { backgroundColor: corDaCategoria(item.categoria) }]}>
                <View style={styles.dados_comentarios}>
                  {/* Ícone + nome do autor alinhados à esquerda */}
                  <View style={styles.autorHeader}>
                    <FontAwesome5 name="user-circle" size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.autorComentario}>{item.autor}</Text>
                  </View>

                  {/* Comentário */}
                  <Text style={styles.comentarioTexto}>
                    {`"${item.comentario}"`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <NuvemDePalavras palavras={listaNuvem} />

      </ScrollView>
    </SafeAreaView>
  );
}


// 🟩 Função para borda aleatória
function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336'];
  return cores[Math.floor(Math.random() * cores.length)];
}

function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',
    'infraestrutura': '#FF9800',
    'saúde': '#2670E8',
    'educação': '#ce93d8',
    'cultura': '#F44336',
  };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}

// 🎨 Styles
const styles = StyleSheet.create({
  
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tituloHeader: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  tituloSecao: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },
  listaHorizontal: {
    marginBottom: 20,
    gap: 8,
  },
  cardImagem: {
    width: 250,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#ccc',
    borderWidth: 2,
  },
  quadroEnquete: {
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 12,
    maxHeight: 300,
  },
  cardEnquete: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft:10
  },
  textoEnquete: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontFamily: 'Raleway-Bold',
  },
  infoEnquete: {
    fontSize: 12,
    color: '#555',
    
  },
   linha_icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    
  }, 
    viewAlinhador: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop:20,
  },
  titulo_enquete: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
  carrossel: {
    marginTop:20,
    paddingHorizontal: 16,
    gap: 6,
  },
  bloco_comentarios: {
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    minWidth: 200,
    maxWidth: 240,
    minHeight: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginRight: 5,
  },
  dados_comentarios: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  autorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 6,
  },
  autorComentario: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Raleway_400Regular',
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Raleway_400Regular',
    width: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
    container_total: {
    flex: 1,
    backgroundColor: '#fff',}
    
});
