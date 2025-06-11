import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function TelaBoasVindas() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Splash grande com ícone centralizado por cima */}
      <View style={styles.splashContainer}>
        <Image
          source={require('@/assets/images/splash.png')}
          style={styles.splash}
          resizeMode="contain"
        />
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.iconSobreSplash}
          resizeMode="contain"
        />
      </View>

      {/* Texto e botão */}
      <Text style={styles.titulo}>Bem vindo ao</Text>
      <Text style={styles.subtitulo}>Participe+</Text>
      <Text style={styles.descricao}>
        Todas as propostas, conferências e ações do governo reunidas em um só lugar para você se informar e interagir.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={async () => {
          await AsyncStorage.setItem('boasVindasVisto', 'true');
          router.replace('/');
        }}
      >
        <Text style={styles.textoBotao}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2670E8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  splashContainer: {
    position: 'relative',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 0.45, // ocupa 45% da altura da tela
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  splash: {
    width: '100%',
    height: '100%',
  },

  iconSobreSplash: {
    position: 'absolute',
    width: 100,
    height: 100,
  },

  titulo: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Raleway_400Regular',
  },
  subtitulo: {
    fontSize: 28,
    fontFamily: 'Raleway_700Bold',
    color: '#fff',
    marginBottom: 12,
  },
  descricao: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    marginBottom: 40,
    fontFamily: 'Raleway_400Regular',
  },
  botao: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 24,
  },
  textoBotao: {
    color: '#2670E8',
    fontSize: 16,
    fontFamily: 'Raleway_700Bold',
  },
});
