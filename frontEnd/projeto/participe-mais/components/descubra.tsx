import React, { useMemo, useEffect, useState } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, StyleSheet, Text, ImageBackground } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obtém a largura da tela para cálculo dos tamanhos dos quadrados
const { width } = Dimensions.get('window');
const GRID_SIZE = 2;
const QUADRADO_GRANDE_SIZE = width - 40;
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE;

const getTamanhoFonte = (texto: string) => {
  if (texto.length <= 90) return 16;
  if (texto.length <= 110) return 14;
  if (texto.length <= 130) return 12;
  if (texto.length >= 130) return 12;
  return 10;
};

//items/dados em que os quadrados vao receber
type Item = {
  id: string;
  tipo: 'proposta' | 'botao' | 'comentario' | 'enquete' | 'conferencia' | 'forum' | 'plano' | 'consulta';
  imagemUrl?: string;
  pergunta?: string;
  titulo_proposta?: string;
  autor?: string;
  comentario_usuario?: string;
};

//tipos de quadrados

const QuadradoProposta = ({ titulo_proposta, autor }: { titulo_proposta: string, autor: string }) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', "#F44336"];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria }]}>
        <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
        <Text style={styles.nomeCantocomentario}>{autor}</Text>
        <Text style={[styles.Comentario, { fontSize: getTamanhoFonte(titulo_proposta) }]}>{titulo_proposta}</Text>
      </View>
    </TouchableOpacity>
  );
};


const QuadradoBotao = () => (
  <View style={styles.quadradoBotao}>
    <Text style={styles.textoQuadrado}>Qual tema você se interessa mais?</Text>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
  </View>
);

const QuadradoComentario = ({ comentario, autor }: { comentario: string; autor: string }) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria }]}>
        <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
        <Text style={styles.nomeCantocomentario}>{autor}</Text>
        <Text style={[styles.Comentario, { fontSize: getTamanhoFonte(comentario) }]}>
          "{comentario}"
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const QuadradoEnquete = () => (
  <TouchableOpacity>
    <View style={[styles.quadrado, { backgroundColor: '#ffd' }]}>
      <Text style={styles.textoQuadrado}>Enquete</Text>
    </View>
  </TouchableOpacity>
);

const QuadradoConferencia = ({ imagemUrl }: { imagemUrl: string }) => (
  <TouchableOpacity>
    <ImageBackground
      source={{ uri: imagemUrl }}
      style={styles.quadrado}
      imageStyle={{ borderRadius: 12 }}
    />
  </TouchableOpacity>
);

const QuadradoForum = ({ pergunta, autor }: { pergunta: string; autor: string }) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria, padding: 10 }]}>
        <Text style={[styles.textoQuadradoForum, { fontSize: getTamanhoFonte(pergunta) }]}>
          {pergunta}
        </Text>
        <View style={styles.viewForum}>
          <AntDesign name="user" size={24} color="white" />
          <Text style={{ fontSize: 12, color: '#fff', marginTop: 4 }}>{autor} compartilhou</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

export default function DescubraSection() {
  const [token, setToken] = useState('');
  const router = useRouter();

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

  useEffect(() => {
    if (token) {
      // Exemplo: buscar dados reais com token
      fetchDescubra();
    }
  }, [token]);

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
  interface Propostas {
    id: number;
    titulo_proposta: string;
    autor: string;
  }

const [conferencia, setConferencias] = useState<Conferencias[]>([])
const [planos, setPlanos] = useState<Planos[]>([])
const [consultas, setConsultas] = useState<Consultas[]>([])
const [propostas, setPropostas] = useState<Propostas[]>([])


  const fetchDescubra = async ()=> {
    try{
      const response = await fetch('http://localhost:8000/descubra/', {
        headers: {
           'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if(response.ok) {
        const json = await response.json();
        const data = json.data;

        setConferencias(data.conferencias)
        setPlanos(data.planos)
        setConsultas(data.consultas)
        setPropostas(data.propostas)
        
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


// gerar dados e por na lista array
const [data, setData] = useState<Item[]>([]);
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = () => {
  setRefreshing(true);

  setTimeout(()=> {
    const nova_ordem = shuffle([...data]); // Embaralha uma cópia do array atual
    setData(nova_ordem);
    setRefreshing(false);
  }, 1000) // tempo de loading
};

useEffect(() => {
  const botoes = 1;
  const comentarios = 5;
  const enquetes = 2;
  const foruns = 1;

  const comentariosMock = Array.from({ length: comentarios }, (_, i) => ({
    id: `comentario-${i}`,
    tipo: 'comentario' as const,
    comentario_usuario: 'comentarios',
    autor: 'autor',
  }));

  const enquetesMock = Array.from({ length: enquetes }, (_, i) => ({
    id: `enquete-${i}`,
    tipo: 'enquete' as const,
  }));

  const forunsMock = Array.from({ length: foruns }, (_, i) => ({
    id: `forum-${i}`,
    tipo: 'forum' as const,
    pergunta: 'O que você acha da arborização da sua cidade?',
    autor: 'foruns autor',
  }));

  const propostasData = propostas.map((item, i) => ({
    id: `proposta-${i}`,
    tipo: 'proposta' as const,
    titulo_proposta: item.titulo_proposta,
    autor: item.autor,
  }));

  const conferenciasData = conferencia.map((item, i) => ({
    id: `conferencia-${i}`,
    tipo: 'conferencia' as const,
    imagemUrl: item.image_url,
  }));

  const planosData = planos.map((item, i) => ({
    id: `plano-${i}`,
    tipo: 'conferencia' as const,
    imagemUrl: item.image_url,
  }));

  const consultasData = consultas.map((item, i) => ({
    id: `consulta-${i}`,
    tipo: 'conferencia' as const,
    imagemUrl: item.image_url,
  }));

  const arr = [
    ...propostasData,
    ...comentariosMock,
    ...enquetesMock,
    ...forunsMock,
    ...conferenciasData,
    ...planosData,
    ...consultasData,
  ];

  const arrShuffle = shuffle(arr);
  const dataComBotao = [{ id: `botao-${botoes}`, tipo: 'botao' as const }, ...arrShuffle];

  setData(dataComBotao);
}, [conferencia, planos, consultas]);


  const renderItem = ({ item }: { item: Item }) => {
    if (item.tipo === 'proposta') return (
    <QuadradoProposta titulo_proposta={item.titulo_proposta!} autor={item.autor!} />
  );
    if (item.tipo === 'botao') return <QuadradoBotao />;
    if (item.tipo === 'comentario') return (
      <QuadradoComentario comentario={item.comentario_usuario!} autor={item.autor!} />
    );
    if (item.tipo === 'enquete') return <QuadradoEnquete />;
    if (item.tipo === 'conferencia') return <QuadradoConferencia imagemUrl={item.imagemUrl!} />;
    if (item.tipo === 'forum') return <QuadradoForum pergunta={item.pergunta!} autor={item.autor!} />;
    return null;
  };

  return (
    <View style={styles.conteiner_quadrado}>
      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={GRID_SIZE}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.titulo}>Descubra!</Text>}
        ListHeaderComponentStyle={styles.headerStyle}
        refreshing={refreshing}              // <- indicador de carregamento
        onRefresh={handleRefresh}            // <- executa quando puxa pra cima
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner_quadrado: {
    backgroundColor: 'white',
    margin: 10,
    minHeight: QUADRADO_GRANDE_SIZE,
    width: QUADRADO_GRANDE_SIZE,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  gridContent: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Raleway_700Bold',
  },
  headerStyle: {
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    marginBottom: 12,
  },
  quadrado: {
    width: taman_quadrado,
    height: taman_quadrado,
    borderRadius: 12,
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoQuadrado: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    fontFamily: 'Raleway_700Bold',
    textAlign: 'center',
  },
  botao_retangular: {
    width: 150,
    height: 25,
    borderRadius: 12,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  quadradoBotao: {
    width: taman_quadrado,
    height: taman_quadrado,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ccc',
    margin: 7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textoQuadradoForum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Raleway_700Bold',
    padding: 6,
  },
  viewForum: {
    flexDirection: 'row',
    gap: 10,
  },
  iconeCanto: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  nomeCantocomentario: {
    right: 50,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Raleway_700Bold',
  },
  Comentario: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Raleway_400Bold',
    padding: 6,
  },
});
