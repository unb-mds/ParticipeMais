import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ImageBackground,
  ScrollView, StyleSheet, TextInput
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CategoriaDescricao from '../../components/categoria/categoriadescricao';
import CategoriaIcone from '../../components/categoria/categoriaIcon';
import NuvemDePalavras from '../../components/categoria/nuvem';

export default function Categoria() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [token, setToken] = useState('');
  const [conferencias, setConferencias] = useState<ItemComImagem[]>([]);
  const [planos, setPlanos] = useState<ItemComImagem[]>([]);
  const [consultas, setConsultas] = useState<ItemComImagem[]>([]);
  const [chats, setChats] = useState<Enquete[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [listaNuvem, setListaNuvem] = useState<string[]>([]);
  const [titulo, setTitulo] = useState('');
  const [novaEnquete, setNovaEnquete] = useState('');

  // Tipagens
  type ItemComImagem = {
    id: number;
    image_url: string;
  };

  interface Enquete {
    enquete: string;
    categoria: string;
    curtidas: number;
    numeroComentario: number;
  }

  interface Comentario {
    id: number;
    autor: string;
    comentario: string;
    categoria: string;
  }

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (id && token) fetchCategoria();
  }, [id, token]);

  const fetchCategoria = async () => {
    try {
      const response = await fetch(`http://172.20.10.9:8000/comunidade/categorias/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();

        setTitulo(json.titulo || 'Não informado');
        setConferencias(json.conferencias || []);
        setPlanos(json.planos || []);
        setConsultas(json.consultas || []);
        setComentarios(json.comentarios || []);
        setChats(json.chats || []);
        setListaNuvem(json.lista_nuvem || []);
      } else {
        const text = await response.text();
        console.warn("Erro ao buscar categoria:", response.status, text);
        router.replace('/');
      }
    } catch (error) {
      console.error('Erro na chamada da categoria:', error);
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>{titulo}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <CategoriaDescricao categoria={titulo.toLowerCase()} />

        {/* Conferências */}
        <Text style={styles.tituloSecao}>Conferências</Text>
        <FlatList
          data={conferencias}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({
            pathname: '/conferencias',
            params: { id: item.id.toString() }
          })}>
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({
            pathname: '/planos',
            params: { id: item.id.toString() }
          })}>
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({
            pathname: '/consultas',
            params: { id: item.id.toString() }
          })}>
              <ImageBackground
                source={{ uri: item.image_url }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Enquetes / Chats */}
        <Text style={styles.tituloSecao}>Discussões</Text>
        <View style={styles.quadroEnquete}>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {chats.map((item, index) => (
              <TouchableOpacity key={`${item.enquete}-${index}`}>
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

        {/* Criar nova enquete */}
        <View style={styles.caixaCriarEnquete}>
          <Text style={styles.tituloCriarEnquete}>Crie sua enquete</Text>
          <View style={styles.criarEnqueteBox}>
            <TextInput
              style={styles.inputEnquete}
              placeholder="Digite o título da enquete"
              value={novaEnquete}
              onChangeText={setNovaEnquete}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.botaoCriar}>
              <Text style={styles.textoBotaoCriar}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comentários */}
        <Text style={styles.titulo_enquete}>Acesse as enquetes pelos comentários!</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carrossel}
          keyExtractor={(item, index) => `${item.autor}-${index}`}
          data={comentarios}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={[styles.bloco_comentarios, { backgroundColor: corDaCategoria(item.categoria) }]}>
                <View style={styles.dados_comentarios}>
                  <View style={styles.autorHeader}>
                    <FontAwesome5 name="user-circle" size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.autorComentario}>{item.autor}</Text>
                  </View>
                  <Text style={styles.comentarioTexto}>{`"${item.comentario}"`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Nuvem de Palavras */}
        <NuvemDePalavras palavras={listaNuvem} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔧 Funções auxiliares
function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336', "#8B008B"];
  return cores[Math.floor(Math.random() * cores.length)];
}

function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',
    'infraestrutura': '#FF9800',
    'saúde': '#2670E8',
    'educação': '#ce93d8',
    'participação social': '#F44336',
    "direito das mulheres": "#FF1493",
    "igualdade racial" : "#CD853F",
    "direitos da pessoa idosa": "#F0E68C",
    "desenvolvimento rural":"#006400",
    "tecnologia": "#8B008B"
  };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}
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
    gap: 24,
  },

  tituloSecao: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    marginBottom: 12,
    color: '#000',
  },

  cardImagem: {
    width: 240,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    backgroundColor: '#ddd',
  },

  quadroEnquete: {
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 16,
    maxHeight: 300,
  },

  cardEnquete: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },

  linha_icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  textoEnquete: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    flex: 1,
    flexWrap: 'wrap',
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 6,
    gap: 10,
  },

  infoEnquete: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Raleway-Regular',
  },

  caixaCriarEnquete: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },

  tituloCriarEnquete: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    marginBottom: 10,
    color: '#000',
  },

  criarEnqueteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  inputEnquete: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    color: '#000',
  },

  botaoCriar: {
    backgroundColor: '#267DFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  textoBotaoCriar: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },

  titulo_enquete: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    marginTop: 16,
    marginBottom: 10,
    color: '#000',
  },

  carrossel: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    gap: 10,
  },

  bloco_comentarios: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    minWidth: 220,
    maxWidth: 260,
    minHeight: 120,
    justifyContent: 'flex-start',
  },

  dados_comentarios: {
    flexDirection: 'column',
    gap: 6,
  },

  autorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  autorComentario: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },

  comentarioTexto: {
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    color: '#fff',
  },
});
