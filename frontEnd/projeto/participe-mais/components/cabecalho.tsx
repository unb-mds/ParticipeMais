import { View, StyleSheet, Image, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const router = useRouter();

type Props = {
  user: string;
  xp: number;
  nivel: number;
  abaAtiva: 'descubra' | 'comunidade' | 'pesquisar';
  setAbaAtiva: React.Dispatch<React.SetStateAction<'comunidade' | 'descubra' | 'pesquisar'>>;
};

export default function Cabecalho({ user, xp, nivel, abaAtiva, setAbaAtiva }: Props) {
  let titulo = 'Bem-vindo(a)';

  if (abaAtiva === 'comunidade') {
    titulo = 'Comunidade';
  } else if (abaAtiva === 'pesquisar') {
    titulo = 'Pesquisar';
  }

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.headerContainer}>
  {/* imagem da logo à esquerda */}
  <Image
    source={require('@/assets/images/icon.png')}
    style={styles.logo}
    resizeMode="contain"
  />

  {/* bloco central com o título e o nome do usuário */}
  <View style={styles.container}>
    <Text
      style={[
        styles.title,
        abaAtiva !== 'descubra' ? styles.title_diferente : undefined,
      ]}
    >
      {abaAtiva === 'comunidade'
        ? 'Comunidade'
        : abaAtiva === 'pesquisar'
        ? 'Pesquisar'
        : 'Bem-vindo(a)'}
    </Text>

    {abaAtiva === 'descubra' && (
      <Text style={styles.user} numberOfLines={1} adjustsFontSizeToFit>
        {user}
      </Text>
    )}
  </View>

  {/* botão com ícone de sino, alinhado à direita */}
  <TouchableOpacity
    style={styles.bell}
    onPress={() => router.push('/notificacoes')}
  >
    <FontAwesome5 name="bell" size={25} color="black" />
  </TouchableOpacity>
</View>

<View style={styles.Novocontainer}>
  <TouchableOpacity onPress={() => router.push('/score')}>
    <View style={styles.quadrado}>
      <View style={styles.linhaTextoImagem}>
        <Text style={styles.textoInfo}>Seu score</Text>

        <Image
          source={require('@/assets/images/medidor.png')}
          style={styles.foto}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.textoAbaixo}>Você está no nível {nivel}</Text>

      <View style={styles.linhaBarra}>
        <View style={styles.barraFundo}>
          <View style={[styles.barraXp, { width: `${xp}%` }]} />
        </View>
        <Text style={styles.texto_barra}>{xp} / 500 xp</Text>
      </View>
    </View>
  </TouchableOpacity>
</View>
<View style={styles.menuAbas}>
  <TouchableOpacity onPress={() => setAbaAtiva('descubra')}>
    <Text style={abaAtiva === 'descubra' ? styles.abaAtiva : styles.abaInativa}>
      Descubra
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setAbaAtiva('comunidade')}>
    <Text style={abaAtiva === 'comunidade' ? styles.abaAtiva : styles.abaInativa}>
      Comunidade
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setAbaAtiva('pesquisar')}>
    <Text style={abaAtiva === 'pesquisar' ? styles.abaAtiva : styles.abaInativa}>
      Pesquisar
    </Text>
  </TouchableOpacity>
</View>



      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    paddingTop: -30,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    marginBottom: 15,
  },

  logo: {
    width: 40,
    height: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
  },
  title_diferente: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
  },
  user: {
    fontSize: 20,
    color: '#2670E8',
    fontWeight: 'bold',
    flexShrink: 1,
    marginLeft: 4,
    fontFamily: 'Raleway_700Bold',
  },
  bell: {
    padding: 12,
    backgroundColor: '#D9D9D9',
    width: 50,
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  Novocontainer: {
    padding: 5,
backgroundColor: '#ffffff', // branco
    marginBottom: 0,
    alignItems: 'center',
  },
  quadrado: {
    width: 375,
    height: 150,
    backgroundColor: '#2670E8',
    borderRadius: 16,
  },
  barraFundo: {
    width: '60%',
    height: 15,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    alignSelf: 'center',
  },
  barraXp: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  texto_barra: {
    color: 'white',
    fontSize: 10,
    marginTop: -12,
    fontFamily: 'Raleway_400Regular',
  },
  linhaBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
    gap: 10,
  },
  linhaTextoImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 70,
  },
  textoInfo: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
  },
  foto: {
    width: 140,
    height: 150,
    borderRadius: 20,
    marginTop: -40,
  },
  textoAbaixo: {
    color: 'white',
    fontSize: 14,
    marginTop: -40,
    textAlign: 'center',
    marginRight: 195,
    fontFamily: 'Raleway_400Regular',
  },
  menuAbas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomColor: '#fff',
  },
  abaAtiva: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2670E8',
    borderBottomWidth: 2,
    borderBottomColor: '#2670E8',
    paddingBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
  abaInativa: {
    fontSize: 16,
    color: '#555',
    paddingBottom: 4,
    fontFamily: 'Raleway_400Regular',
  },
});
