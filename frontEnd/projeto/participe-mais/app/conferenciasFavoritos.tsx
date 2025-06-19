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


const imagensConferencias = [
 { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWNUQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0d4ae56b4559862a8cceaccc2fd05e246d014f27/Banner_1480x220_v2.png'},
    { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVFZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae2ac5eb7b598677a07a7cfb586471c82e45e30/BANNER%20-%201480%20X%20220%20PX.png' },
    { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png' },
    { id: '4', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMFVKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--53067aa5dd91b310913546e76d89bc83b53ef872/Banner%20-%20Brasil%20Participativo%20(ConCidades).png' },
];

export default function ConferenciasFavoritos({ navigation }: any) {
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
        <Text style={styles.title}>Conferências</Text>
      </View>

      {/* Lista */}
      {imagensConferencias.length === 0 ? (
        <Text style={styles.emptyText}>Você não tem itens salvos.</Text>
      ) : (
        <FlatList
          data={imagensConferencias}
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
