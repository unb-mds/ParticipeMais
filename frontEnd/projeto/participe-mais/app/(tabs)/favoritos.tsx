import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

// Pegando a largura da tela
const { width } = Dimensions.get('window');

// Tamanho dos botões (quadrados)
const Altura = width * 0.65; // 80% da largura da tela
const Largura = width * 0.4; // 80% da largura da tela


export default function FavoritosUsuario() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <View style={styles.line} />

      <View style={styles.buttonsContainer}>
        {/* Botão Conferências */}
        <TouchableOpacity style={styles.button}
         onPress={() => router.push('../conferenciasFavoritos')}>
          <ImageBackground
            source={require('../../assets/images/favoritos/conferencias.png')}
            style={styles.image}
            imageStyle={styles.imageBorder}
          />
        </TouchableOpacity>

        {/* Botão Planos */}
        <TouchableOpacity style={styles.button}
          onPress={() => router.push('../planosFavoritos')}>
          <ImageBackground
            source={require('../../assets/images/favoritos/planos.png')}
            style={styles.image}
            imageStyle={styles.imageBorder}
          />
        </TouchableOpacity>

        {/* Botão Consultas */}
        <TouchableOpacity style={styles.button}
          onPress={() => router.push('../consultasFavoritos')}>
          <ImageBackground
            source={require('../../assets/images/favoritos/consultas.png')}
            style={styles.image}
            imageStyle={styles.imageBorder}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    marginTop: 60, // Espaço do topo
    fontSize: 24,
    fontFamily: 'Raleway-Bold', // Raleway 700
  },
   line: {
    width: width * 1, // 90% da tela
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
  },
  buttonsContainer: {
    marginTop: 50,
    gap: 40,
    alignItems: 'center',
  },
  button: {
    width: Altura,
    height: Largura,
    borderRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  imageBorder: {
    borderRadius: 30,
  },
});
