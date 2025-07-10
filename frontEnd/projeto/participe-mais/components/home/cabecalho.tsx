import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  user: string;
  abaAtiva: 'descubra' | 'comunidade' | 'pesquisar';
  setAbaAtiva: React.Dispatch<React.SetStateAction<'comunidade' | 'descubra' | 'pesquisar'>>;
};

const niveis = [
  { nome: "Iniciante Cívico", minimo: 0 },
  { nome: "Votante Iniciante", minimo: 50 },
  { nome: "Ativador de Temas", minimo: 100 },
  { nome: "Cidadão Participativo", minimo: 150 },
  { nome: "Explorador de Temas", minimo: 250 },
  { nome: "Construtor de Vozes", minimo: 350 },
  { nome: "Guardião do Debate", minimo: 450 },
  { nome: "Conselheiro Político", minimo: 550 },
  { nome: "Líder Comunitário", minimo: 650 },
  { nome: "Mestre Cívico", minimo: 800 },
];

export default function Cabecalho({ user, abaAtiva, setAbaAtiva }: Props) {
  const router = useRouter();
  const [score, setScore] = useState<{ xp: number; nivel: number } | null>(null);
  
  const [nome, setNome] = useState<string>('Usuário');
  const [loading, setLoading] = useState(true);

  const nivelAtualIndex = niveis.findLastIndex(n => (score?.xp ?? 0) >= n.minimo);
  const nivelNome = niveis[nivelAtualIndex]?.nome || 'Desconhecido';
  const proximoMinimo = niveis[nivelAtualIndex + 1]?.minimo || (score?.xp ?? 0) + 1;
  const progressoXP = Math.min(100, ((score?.xp ?? 0) / proximoMinimo) * 100);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/comunidade/score/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        // aqui usamos o mesmo formato da ScoreScreen
        if (data?.pontos !== undefined) {
          setScore({ xp: data.pontos, nivel: 1 }); // nivel opcional
          setNome(data.usuario);
        } else {
          console.warn('Resposta inesperada:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar score:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  const titulo =
    abaAtiva === 'comunidade'
      ? 'Comunidade'
      : abaAtiva === 'pesquisar'
      ? 'Pesquisar'
      : 'Bem-vindo(a)';

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.container}>
            <Text style={styles.title}>{titulo}</Text>
            {abaAtiva === 'descubra' && (
              <Text style={styles.user} numberOfLines={1} adjustsFontSizeToFit>
                {user}
              </Text>
            )}
          </View>

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

              <Text style={styles.textoAbaixo}>
                Nível {nivelAtualIndex + 1} - {nivelNome}
              </Text>

              <View style={styles.linhaBarra}>
                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraXp,
                      { width: `${progressoXP}%` }
                    ]}
                  />
                </View>
                <Text style={styles.texto_barra}>
                  {score?.xp ?? 0} / {proximoMinimo} xp
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.menuAbas}>
          <TouchableOpacity onPress={() => setAbaAtiva('descubra')}>
            <Text
              style={
                abaAtiva === 'descubra' ? styles.abaAtiva : styles.abaInativa
              }
            >
              Descubra
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAbaAtiva('comunidade')}>
            <Text
              style={
                abaAtiva === 'comunidade' ? styles.abaAtiva : styles.abaInativa
              }
            >
              Comunidade
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAbaAtiva('pesquisar')}>
            <Text
              style={
                abaAtiva === 'pesquisar' ? styles.abaAtiva : styles.abaInativa
              }
            >
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
    paddingTop: -40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
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
  Novocontainer: {
    padding: 5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  quadrado: {
    width: 375,
    height: 150,
    backgroundColor: '#2670E8',
    borderRadius: 16,
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
  linhaBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
    gap: 10,
  },
  barraFundo: {
    width: '60%',
    height: 15,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    overflow: 'hidden',
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
  menuAbas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
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
