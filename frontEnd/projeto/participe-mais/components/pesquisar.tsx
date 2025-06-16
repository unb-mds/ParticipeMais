import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, Dimensions, StyleSheet, ImageBackground  } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons, MaterialCommunityIcons,EvilIcons } from '@expo/vector-icons';
import { routePatternToRegex } from 'expo-router/build/fork/getStateFromPath-forks';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const Largura = SCREEN_WIDTH * 0.85;

type PesquisaSectionProps = {
  filtros: string[];
};

function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336']; // azul, verde, laranja, roxo, vermelho
  return cores[Math.floor(Math.random() * cores.length)];
}

export default function PesquisaSection({ filtros }: PesquisaSectionProps) {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          console.error("Token não encontrado");
          router.replace('/login');
        }
      } catch (error) {
        console.error("Erro ao recuperar token:", error);
        router.replace('/login');
      }
    };

    obterToken();
  }, []);

  
  
  interface Conferencias {
    id: number;
    image_url: string;
    titulo: string;
  }
  interface Planos {
    id: number;
    image_url: string;
    nome: string;
  }
  interface Consultas {
    id: number;
    image_url: string;
    nome: string;
  }
  
  const [conferencias, setConferencias] = useState<Conferencias[]>([])
  const [planos, setPlanos] = useState<Planos[]>([])
  const [consultas, setConsultas] = useState<Consultas[]>([])

  useEffect(() => {
    fetchConferenciasLista();
  }, []);

  const fetchConferenciasLista = async () => {
    try {
      const response = await fetch('http://172.20.10.9:8000/pesquisar/lista', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        setConferencias(data.conferencias);  // <-- AQUI
        setPlanos(data.planos);  // <-- AQUI
        setConsultas(data.consultas);  // <-- AQUI

      } else if (response.status === 401 || response.status === 403) {
        router.replace('/login');
      } else {
        console.error('Erro ao buscar conferências:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      router.replace('/login');
    }
  };



//     const imagensConferencias = [
//     { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWNUQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0d4ae56b4559862a8cceaccc2fd05e246d014f27/Banner_1480x220_v2.png'},
//     { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVFZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae2ac5eb7b598677a07a7cfb586471c82e45e30/BANNER%20-%201480%20X%20220%20PX.png' },
//     { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png' },
//     { id: '4', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMFVKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--53067aa5dd91b310913546e76d89bc83b53ef872/Banner%20-%20Brasil%20Participativo%20(ConCidades).png' },

// ];
// const imagensPlanos = [
//   { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMFVKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--53067aa5dd91b310913546e76d89bc83b53ef872/Banner%20-%20Brasil%20Participativo%20(ConCidades).png' },
//   { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVFZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae2ac5eb7b598677a07a7cfb586471c82e45e30/BANNER%20-%201480%20X%20220%20PX.png' },
//   { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png' },
//   { id: '4', imagem: 'https://ns-dtp-prd-df.s3-df-govcloud.dataprev.gov.br/gcc-decidim/gcc-decidim/s8z5gafv6jveenp7mtgozp290jwd?response-content-disposition=inline%3B%20filename%3D"Banner_Plano_Clima_Participativo_DESKTOP_%25281480-px-720-px%2529%20%25281%2529.png"%3B%20filename%2A%3DUTF-8%27%27Banner_Plano_Clima_Participativo_DESKTOP_%25281480-px-720-px%2529%2520%25281%2529.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=user_dec_prd_df%2F20250610%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250610T003330Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=d96fe11a81ff2624b90ee0bdb38ecbe97883f3e07f84e119d3a6a4adb665cd9e' },
//   { id: '5', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWNUQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0d4ae56b4559862a8cceaccc2fd05e246d014f27/Banner_1480x220_v2.png' },
// ];
// const imagensConsultas = [
//   { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOE1ZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b7fa03d28c577e53ec4d9b381251a2dc84df0788/banner%20consulta%20p%C3%BAblica%20mobile.png' },
//   { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOGNWQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--aa080fa96a4d87cb600fa928b676d17f6c62a753/Banner_site_mobile.png' },
//   { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNG9QQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--2c570e81d7fd4f074255b599c622b9025db71235/Design%20sem%20nome.png' },
//   { id: '4', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2NJQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--a5f506ba49de6dc9edca0a011ae59ae6924b167d/ENPP-Mobile-1.png' },
//   { id: '5', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaUxDIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--9baedf8dd6768599fc421a7f2f6191c70ff15bf7/ASSBAG-BIO-0002-bannerMobile-359x220px.jpg' },
//   { id: '6', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBb0hBIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d79d38770a199f8daacfe4c16bb0e2f2825b382e/Banner_banner%20f%C3%B3runs.jpg' },
//   { id: '7', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcWl5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2626375ef15b5376a8b8ecc7794027b8113b0863/sinpas_banners-v2_1480x220.png' },
//   { id: '8', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbnF6IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7def247e40876c9b6df6a2e31b2d9f270cafb8e4/AZUL%20ESCURO%20(5).png' },
//   { id: '9', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcEt3IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8973fd85bc8b161c30af898c8416059c9c3c26c1/Banner-G20-Social-Participativo-(1480px220px)-Desktop_2%20(2).png' },
//   { id: '10', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbEc4IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c9f665f5e436dbe4b06b34c6ce568499d2118c1f/banner-consulta-telefone.png' },
//   { id: '11', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBc1FxIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e26e08f48e34d4fecc0e87d8003b217607831cbb/engd.png' },
// ];


  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <EvilIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Pesquise tudo que desejar!!"
          placeholderTextColor="#aaa"
          value={busca}
          onChangeText={setBusca}
        />
        <TouchableOpacity>
          <Ionicons name="filter-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Botões de filtro */}
      <FlatList
        data={filtros}
        horizontal
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaFiltros}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.botaoFiltro}>
            <Text style={styles.textoFiltro}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Carrossel de bolinhas com ícones */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Acesse as temáticas</Text>
        <TouchableOpacity onPress={() => console.log('Veja mais clicado')}>
            <Text style={styles.vejaMais}>Veja mais</Text>
        </TouchableOpacity>
        </View>
      <FlatList
        data={filtros}
        horizontal
        keyExtractor={(item, index) => `bolinha-${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaBolinhas}
        renderItem={({ item }) => (
          <View style={[styles.bolinha, { backgroundColor: corDaCategoria(item) }]}>
            {getIconByCategoria(item, '#fff')}
          </View>
        )}
      />
{/*  conferencias */}
      <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Conferências</Text>
        <TouchableOpacity onPress={() => console.log('Veja mais clicado')}>
            <Text style={styles.vejaMais}>Veja mais</Text>
        </TouchableOpacity>
        </View>

        <FlatList
        data={conferencias}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaConferencias}
        renderItem={({ item }) => (
           <TouchableOpacity onPress={() => router.push({
            pathname: '/conferencias',
            params: { id: item.id.toString() },
          })}>
        <ImageBackground
          source={{ uri: item.image_url }}
          style={[styles.cardConferencia, { borderWidth: 2, borderColor: corAleatoria() }]}
          imageStyle={{ borderRadius: 12 }}
        />
      </TouchableOpacity>
    
  )}
/>
        {/* planos */}
        <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Planos</Text>
        <TouchableOpacity onPress={() => console.log('Veja mais planos')}>
            <Text style={styles.vejaMais}>Veja mais</Text>
        </TouchableOpacity>
        </View>

        <FlatList
        data={planos}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaConferencias}
        renderItem={({ item }) => (
            <TouchableOpacity>
            <ImageBackground
  source={{ uri: item.image_url }}
  style={[styles.cardPlano, { borderWidth: 2, borderColor: corAleatoria() }]}
  imageStyle={{ borderRadius: 12 }}
/>
            </TouchableOpacity>
        )}
        />
{/* consultas */}
        <View style={styles.headerTematicas}>
        <Text style={styles.textoTematicas}>Consultas</Text>
        <TouchableOpacity onPress={() => console.log('Veja mais consultas')}>
            <Text style={styles.vejaMais}>Veja mais</Text>
        </TouchableOpacity>
        </View>

        <FlatList
        data={consultas}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listaConferencias, {   paddingBottom: 100}]} 
        renderItem={({ item }) => (
            <TouchableOpacity>
            <ImageBackground
  source={{ uri: item.image_url }}
  style={[styles.cardConsulta, { borderWidth: 2, borderColor: corAleatoria() }]}
  imageStyle={{ borderRadius: 12 }}
/>
            </TouchableOpacity>
        )}
        />

    </View>
  );
}

// Função auxiliar para cor de fundo da categoria
function corDaCategoria(categoria: string): string {
    const mapaCores: Record<string, string> = {
        'meio ambiente': '#4CAF50',     // verde claro
        'infraestrutura': '#FF9800',   // amarelo claro
        'saúde': '#2670E8',            // azul claro
        'educação': '#ce93d8',  
        'cultura': '#F44336',          // roxo claro (exemplo extra)
    };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}

// Função auxiliar para ícone da categoria
function getIconByCategoria(categoria: string, cor: string = "#fff") {
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return <Ionicons name="leaf-outline" size={24} color={cor} />;
    case 'educação':
      return <MaterialIcons name="school" size={24} color={cor} />;
    case 'saúde':
      return <Ionicons name="medkit" size={24} color={cor} />;
    case 'infraestrutura':
      return <MaterialCommunityIcons name="wheel-barrow" size={24} color={cor} />;
    case 'cultura':
      return <FontAwesome name="group" size={24} color={cor} />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: Largura,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Raleway_400Regular',
  },
  listaFiltros: {
    paddingVertical: 6,
  },
  botaoFiltro: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
  },
  textoFiltro: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Raleway_700Bold',
  },
  listaBolinhas: {
    paddingVertical: 10,
  },
  bolinha: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30,
  },
  headerTematicas: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 4,
  marginTop: 12,
  marginBottom: 4,
},
textoTematicas: {
  fontSize: 16,
  fontFamily: 'Raleway_700Bold',
  color: '#333',
},
vejaMais: {
  fontSize: 14,
  color: '#2670E8',
  fontFamily: 'Raleway_400Regular',
},
listaConferencias: {
  paddingVertical: 10,
  paddingLeft: 4,
},
cardConferencia: {
  width: 250,
  height: 120,
  borderRadius: 12,
  overflow: 'hidden',
  marginRight: 14,
  backgroundColor: '#ccc', // fallback se imagem não carregar
},
cardPlano: {
  width: 180,              // menor comprimento que o cardConferencia
  height: 120,
  borderRadius: 12,
  overflow: 'hidden',
  marginRight: 14,
  backgroundColor: '#ccc',
},
cardConsulta: {
  width: 240,
  height: 140,
  borderRadius: 12,
  overflow: 'hidden',
  marginRight: 14,
  backgroundColor: '#ccc',

},


});
