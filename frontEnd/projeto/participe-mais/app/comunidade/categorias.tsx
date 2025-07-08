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
      const response = await fetch(`http://localhost:8000/comunidade/categorias/${id}/`, {
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tituloHeader: { fontSize: 18, fontFamily: 'Raleway-Bold', color: '#000' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  tituloSecao: { fontSize: 18, fontFamily: 'Raleway-Bold', marginBottom: 8 },
  cardImagem: {
    width: 250, height: 120, borderRadius: 12, overflow: 'hidden', marginRight: 14,
    backgroundColor: '#ccc', borderWidth: 2,
  },
  quadroEnquete: { backgroundColor: '#F1F1F1', borderRadius: 12, padding: 12, maxHeight: 300 },
  cardEnquete: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, marginLeft: 10 },
  textoEnquete: { fontSize: 14, color: '#000', flex: 1, fontFamily: 'Raleway-Bold' },
  infoEnquete: { fontSize: 12, color: '#555' },
  linha_icon: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  caixaCriarEnquete: { backgroundColor: '#F1F1F1', borderRadius: 12, padding: 16, marginVertical: 20 },
  tituloCriarEnquete: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Raleway_700Bold', color: '#000' },
  criarEnqueteBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  inputEnquete: {
    flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 14,
    fontFamily: 'Raleway_400Regular', color: '#000', backgroundColor: '#fff',
  },
  botaoCriar: { backgroundColor: '#267DFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  textoBotaoCriar: { color: '#fff', fontWeight: 'bold', fontSize: 14, fontFamily: 'Raleway_700Bold' },
  titulo_enquete: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, fontFamily: 'Raleway_700Bold' },
  carrossel: { marginTop: 20, paddingHorizontal: 16, gap: 6 },
  bloco_comentarios: {
    borderRadius: 5, padding: 12, elevation: 2, minWidth: 200, maxWidth: 240, minHeight: 120,
    alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', marginRight: 5,
  },
  dados_comentarios: { width: '100%', flexDirection: 'column', alignItems: 'flex-start' },
  autorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginBottom: 6 },
  autorComentario: { fontSize: 14, color: '#fff', fontFamily: 'Raleway_400Regular' },
  comentarioTexto: { fontSize: 14, color: '#fff', fontFamily: 'Raleway_400Regular', width: '100%' },
});