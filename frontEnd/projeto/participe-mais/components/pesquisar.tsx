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
      const response = await fetch('http://192.168.0.16:8000/pesquisar/lista', {
        headers: {
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
      // Não redireciona, apenas exibe erro
    }
  };

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
