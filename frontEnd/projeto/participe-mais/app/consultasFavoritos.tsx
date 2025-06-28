import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones de seta
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Largura = width * 0.85;
const Altura = width * 0.4;

function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336']; // azul, verde, laranja, roxo, vermelho
  return cores[Math.floor(Math.random() * cores.length)];
}


const imagensConsultas = [
 { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOE1ZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b7fa03d28c577e53ec4d9b381251a2dc84df0788/banner%20consulta%20p%C3%BAblica%20mobile.png' },
  { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOGNWQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--aa080fa96a4d87cb600fa928b676d17f6c62a753/Banner_site_mobile.png' },
  { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNG9QQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--2c570e81d7fd4f074255b599c622b9025db71235/Design%20sem%20nome.png' },
  { id: '4', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2NJQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--a5f506ba49de6dc9edca0a011ae59ae6924b167d/ENPP-Mobile-1.png' },
  { id: '5', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaUxDIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--9baedf8dd6768599fc421a7f2f6191c70ff15bf7/ASSBAG-BIO-0002-bannerMobile-359x220px.jpg' },
  { id: '6', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb0hBIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d79d38770a199f8daacfe4c16bb0e2f2825b382e/Banner_banner%20f%C3%B3runs.jpg' },
  { id: '7', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcWl5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2626375ef15b5376a8b8ecc7794027b8113b0863/sinpas_banners-v2_1480x220.png' },
  { id: '8', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbnF6IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7def247e40876c9b6df6a2e31b2d9f270cafb8e4/AZUL%20ESCURO%20(5).png' },
  { id: '9', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcEt3IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8973fd85bc8b161c30af898c8416059c9c3c26c1/Banner-G20-Social-Participativo-(1480px220px)-Desktop_2%20(2).png' },
  { id: '10', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbEc4IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c9f665f5e436dbe4b06b34c6ce568499d2118c1f/banner-consulta-telefone.png' },
  ];

export default function ConsultasFavoritos({ navigation }: any) {
    const router = useRouter();
  const handlePress = (item: any) => {
    console.log('Clicou em:', item);
  };

    const renderItem = ({ item }: any) => {
    const borderColor = corAleatoria();

    return (
        <TouchableOpacity style={[styles.item, { borderColor }]} onPress={() => handlePress(item)}>
        <ImageBackground
            source={{ uri: item.imagem }}
            style={styles.image}
            imageStyle={styles.imageBorder}
        />
        </TouchableOpacity>
    );
    };


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
      {imagensConsultas.length === 0 ? (
        <Text style={styles.emptyText}>Você não tem itens salvos.</Text>
      ) : (
        <FlatList
          data={imagensConsultas}
          keyExtractor={(item) => item.id}
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
