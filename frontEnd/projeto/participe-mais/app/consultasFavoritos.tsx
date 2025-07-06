import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones de seta
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Largura = width * 0.85;
const Altura = width * 0.4;

function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336']; // azul, verde, laranja, roxo, vermelho
  return cores[Math.floor(Math.random() * cores.length)];
}



export default function ConsultasFavoritos({ navigation }: any) {
    const router = useRouter();
    const handlePress = (item: any) => {
      router.push(`/consultas/?id=${item.id}` as any);
    };


    const renderItem = ({ item }: any) => {
    const borderColor = corAleatoria();

    return (
        <TouchableOpacity style={[styles.item, { borderColor }]} onPress={() => handlePress(item)}>
          <ImageBackground
            source={{ uri: item.image_url }}
            style={styles.image}
            imageStyle={styles.imageBorder}
          />
        </TouchableOpacity>
    );
    };

const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const buscarFavoritos = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
          console.log('Token recuperado:', token);

      if (!token) return;

      const resFavoritos = await fetch('http://localhost:8000/consultas/favoritas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataFavoritos = await resFavoritos.json();
      const idsFavoritos = Array.isArray(dataFavoritos.favoritos) ? dataFavoritos.favoritos : [];
      
      console.log('Resposta /favoritas status:', resFavoritos.status);
      console.log('DATA FAVORITOS:', dataFavoritos);

      const resConsultas = await fetch('http://localhost:8000/consultas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const todasResponse = await resConsultas.json();
      console.log('RES CONSULTAS:', todasResponse);

      // Verifica se a chave Consultas existe e é um array
      const todas = Array.isArray(todasResponse.Consultas)
        ? todasResponse.Consultas
        : [];

      console.log('TODAS CONSULTAS:', todas);

      // Filtra apenas as que estão nos favoritos
      const filtradas = todas.filter((c: any) => idsFavoritos.includes(c.id));
      setFavoritos(filtradas);


    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarFavoritos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header topo com botão de voltar e título Favoritos */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Favoritos</Text>
        
      </View>
      <View style={styles.line} />
      {/* Título da página */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Consultas</Text>
      </View>

      {/* Lista */}
      {loading ? (
        <Text style={styles.emptyText}>Carregando...</Text>
      ) : !Array.isArray(favoritos) || favoritos.length === 0 ? (
        <Text style={styles.emptyText}>Você não tem itens salvos.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
  },
  titleContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    textAlign: 'left',
    margin:15,
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
    item: {
    width: Largura,
    height: Altura,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3, // Adiciona a borda visível
    },

  image: {
    width: '100%',
    height: '100%',
  },
  imageBorder: {
    borderRadius: 0,
  },
  emptyText: {
    marginTop: 50,
    fontSize: 16,
    color: '#777',
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
  },
});
