import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';
import Cabecalho from '@/components/cabecalho';
import BlocoDinamico from '@/components/blocosdinamicos';
import DescubraSection from '@/components/descubra';
import PesquisaSection from '@/components/pesquisar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        const usuarioSalvo = await AsyncStorage.getItem('usuario');

        if (!tokenSalvo) {
          console.error("Token não encontrado");
          router.push('/login');
          return;
        }

        setToken(tokenSalvo);

        if (usuarioSalvo) {
          const userObj = JSON.parse(usuarioSalvo);
          setNomeUsuario(userObj.nome);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao recuperar token ou usuário:", error);
        router.replace('/login');
      }
    };

    obterToken();
  }, [token]);

  const filtros = ['Saúde', 'Infraestrutura', 'Meio Ambiente', 'Cultura'];

  const blocos = [
    { tipo: 'listaUsuarios', usuarios: 15, comentarios: 15 },
    { tipo: 'evento', nome: 'Live XP', data: '2025-06-01' },
    {
      tipo: 'carrosselCategorias',
      dados: [
        { categoria: 'Meio Ambiente', totalComentarios: 10 },
        { categoria: 'Educação', totalComentarios: 7 },
        { categoria: 'Infraestrutura', totalComentarios: 9 },
        { categoria: 'Educação', totalComentarios: 7 },
        { categoria: 'Educação', totalComentarios: 7 },
      ],
    },
    {
      tipo: 'carroselComentarios',
      dados: [
        {
          categoria: 'Meio Ambiente',
          comentario: 'Na minha cidade começaram ha cortar várias árvores...',
          autor: 'joaozin',
        },
        { categoria: 'Infraestrutura', comentario: 'Oi eu sou tantantantan', autor: 'joaozin' },
        { categoria: 'Educação', comentario: 'Oi eu sou tantantantan', autor: 'joaozin' },
      ],
    },
    {
      tipo: 'carroselComentariosEnquentes',
      dados: [
        {
          categoria: 'Infraestrutura',
          enquete: 'Oi eu sou Arborização nas cidades: mais sombra e menos calor?',
          curtidas: 5,
          numeroComentario: 10,
        },
        {
          categoria: 'Saúde',
          enquete: 'Oi eu sou Arborização nas cidades: mais sombra e menos calor?',
          curtidas: 5,
          numeroComentario: 10,
        },
        {
          categoria: 'Meio Ambiente',
          enquete: 'Oi eu Arborização nas cidades: mais sombra e menos llllllllll lllllllllll l  lllllllll lll',
          curtidas: 5,
          numeroComentario: 10,
        },
      ],
    },
  ];

  if (loading) {
    return (
      <View style={styles.conteudoCentralizado}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho
        user={nomeUsuario || 'usuario'}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      <View style={styles.contentArea}>
        {abaAtiva === 'descubra' && <DescubraSection />}
        {abaAtiva === 'comunidade' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fundoBranco}>
              <Text style={styles.title}>Conheça a comunidade!</Text>
              <BlocoDinamico blocos={blocos} />
            </View>
          </ScrollView>
        )}
        {abaAtiva === 'pesquisar' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fundoBranco}>
              <Text style={styles.title}>Inicie sua pesquisa!</Text>
              <PesquisaSection filtros={filtros} />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#f1f2f2',
  },
  conteudoCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
  },
  fundoBranco: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    minHeight: 550,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
  },
  textoNormal: {
    fontSize: 16,
    fontFamily: 'Raleway_400Regular',
  },
});
