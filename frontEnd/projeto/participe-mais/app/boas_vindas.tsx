import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const radius = SCREEN_WIDTH * 0.38;

const icons = [
  require('@/assets/images/splash/bolsa.png'),
  require('@/assets/images/splash/escola.png'),
  require('@/assets/images/splash/ferramentas.png'),
  require('@/assets/images/splash/folha.png'),
  require('@/assets/images/splash/gov.png'),
  require('@/assets/images/splash/justica.png'),
  require('@/assets/images/splash/saude.png'),
];

export default function TelaBoasVindas() {

  const router = useRouter();

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Iniciando animação');
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

    const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  return (
    <View style={styles.container}>
      <View style={styles.splashContainer}>
        <Image
          source={require('@/assets/images/splash.png')}
          style={styles.splash}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              left: SCREEN_WIDTH / 1.35 - radius,

              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          {icons.map((icon, index) => {
            const angle = (index / icons.length) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <Animated.Image
                key={index}
                source={icon}
                style={[
                  {
                    width: 60,
                    height: 60,
                    position: 'absolute',
                    transform: [
                  { translateX: x },
                  { translateY: y },
                  { rotate: rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-360deg'],
                    }
                  )}// ➖ Contra-rotação
                    ],
                  },
                ]}
              />
            );
          })}
        </Animated.View>


        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.iconSobreSplash}
          resizeMode="contain"
        />
      </View>
      

      <Text style={styles.titulo}>Bem vindo ao</Text>
      <Text style={styles.subtitulo}>Participe+</Text>
      <Text style={styles.descricao}>
        Todas as propostas, conferências e ações do governo reunidas em um só lugar para você se informar e interagir.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={async () => {
          router.replace('/login');
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
    width: SCREEN_HEIGHT * 0.15,
    height: SCREEN_HEIGHT * 0.15,
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
