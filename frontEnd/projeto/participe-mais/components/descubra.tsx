import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, StyleSheet, Text, ImageBackground } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';


// Obtém a largura da tela para cálculo dos tamanhos dos quadrados
const { width } = Dimensions.get('window');
const GRID_SIZE = 2; // número de colunas no grid
const QUADRADO_GRANDE_SIZE = width - 40; // tamanho total horizontal do container
const taman_quadrado = (QUADRADO_GRANDE_SIZE - (GRID_SIZE + 1) * 14) / GRID_SIZE; // tamanho de cada quadrado com margens
const getTamanhoFonte = (texto: string) => {
  if (texto.length <= 90) return 16;
  if (texto.length <= 110) return 14;
  if (texto.length <= 130) return 12;
  return 10; // bem longo
};

// Tipo dos dados que serão usados na FlatList
type Item = {
  id: string;
  tipo: 'proposta' | 'botao' | 'comentario' | 'enquete' | 'conferencia' | 'forum';
  imagemUrl?: string;
  pergunta?: string;
  autor?: string;
  comentario_usuario?: string; // nome do ícone (ex: 'chat', 'help-circle', etc)
};

// Quadrado com cor aleatória de fundo representando uma proposta
const QuadradoProposta = () => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', "#F44336"]; // paleta de cores
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)]; // sorteia uma

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria }]}>
        <Text style={styles.textoQuadrado}>Proposta</Text>
      </View>
    </TouchableOpacity>
  );
};

// Quadrado especial com três botões de resposta
const QuadradoBotao = () => (
  <View style={[styles.quadradoBotao]}>
    <Text style={styles.textoQuadrado}> Qual tema você se interessa mais?</Text>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
    <TouchableOpacity style={styles.botao_retangular}></TouchableOpacity>
  </View>
);

// Quadrado com rótulo de "Comentário"}
const QuadradoComentario = ({comentario, autor} : { comentario: string; autor: string}) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
  const precisaReduzirFonte = comentario.length > 90;

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria }]}>
        <FontAwesome name="book" size={24} color="#fff" style={styles.iconeCanto} />
        <Text style={styles.nomeCantocomentario}>{autor}</Text>
        <Text style={[styles.Comentario, { fontSize: getTamanhoFonte(comentario) }]}>"{comentario}"</Text>
      </View>
    </TouchableOpacity>
  );
};



// Quadrado com rótulo de "Enquete"
const QuadradoEnquete = () => (
  <TouchableOpacity>
    
    <View style={[styles.quadrado, { backgroundColor: '#ffd' }]}>
      <Text style={styles.textoQuadrado}>Enquete</Text>
    </View>
  </TouchableOpacity>
);

// Quadrado com imagem de fundo vinda de uma URL
const QuadradoConferencia = ({ imagemUrl }: { imagemUrl: string }) => (
  <TouchableOpacity>
    <ImageBackground
      source={{ uri: imagemUrl }}
      style={styles.quadrado}
      imageStyle={{ borderRadius: 12 }}
    >
    </ImageBackground>
  </TouchableOpacity>
);

const QuadradoForum = ({ pergunta, autor }: { pergunta: string; autor: string }) => {
  const cores = ['#2670E8', '#4CAF50', '#FF5722', '#FFC700', '#F44336'];
  const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
  const precisaReduzirFonte = pergunta.length > 90;

  return (
    <TouchableOpacity>
      <View style={[styles.quadrado, { backgroundColor: corAleatoria, padding: 10 }]}>
        <Text style={[styles.textoQuadradoForum, { fontSize: getTamanhoFonte(pergunta) }]}>
          {pergunta}
        </Text>

        <View  style={styles.viewForum}>
        <AntDesign name="user" size={24} color="white" />  

        <Text style={{ fontSize: 12, color: '#fff', marginTop: 4 }} >{autor} compartilhou</Text> 
        </View>
      </View>
    </TouchableOpacity>
  );
};




// Função para embaralhar os elementos do array
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

// Componente principal que renderiza a grade de quadrados
export default function DescubraSection() {
  // quantidade de cada tipo de item
  const propostas = 1;
  const botoes = 1;
  const comentarios = 5;
  const enquetes = 2;
  const conferencias = 3;
  const foruns = 1;

  // memoiza o array de dados da FlatList com embaralhamento e inclusão do botão no topo
  const data = useMemo(() => {
    const arr = [
      ...Array.from({ length: propostas }, (_, i) => ({ id: `proposta-${i}`, tipo: 'proposta' })),
      ...Array.from({ length: comentarios }, (_, i) => ({ id: `comentario-${i}`, tipo: 'comentario' })),
      ...Array.from({ length: enquetes }, (_, i) => ({ id: `enquete-${i}`, tipo: 'enquete' })),
      ...Array.from({ length: conferencias }, (_, i) => ({
        id: `conferencia-${i}`,
        tipo: 'conferencia',
        imagemUrl: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png'
      })),
      ...Array.from({ length: foruns }, (_, i) => ({ id: `forum-${i}`, tipo: 'forum' }))
    ];

    const arrShuffle = shuffle(arr); // embaralha
    const dataComBotao = [{ id: `botao-${botoes}`, tipo: 'botao' }, ...arrShuffle]; // insere botão no topo

    return dataComBotao;
  }, []);

  // Função que escolhe qual quadrado renderizar com base no tipo
  const renderItem = ({ item }: { item: Item }) => {
    if (item.tipo === 'proposta') return <QuadradoProposta />;
    if (item.tipo === 'botao') return <QuadradoBotao />;
    if (item.tipo === 'comentario') return (
          <QuadradoComentario
          comentario={item.comentario_usuario ?? 'Gostaria de ver mais oficinas extracurriculares nas escolas “Gostaria de ver mais oficinas e como música e programação.”públicas, como música e programação. fo ?'}
          autor={item.autor ?? 'Joao'}/>);

    if (item.tipo === 'enquete') return <QuadradoEnquete />;
    if (item.tipo === 'conferencia') return <QuadradoConferencia imagemUrl={item.imagemUrl!} />;
    if (item.tipo === 'forum') {
          return (
          <QuadradoForum
          pergunta={item.pergunta ?? 'Arborização ?'}
          autor={item.autor ?? 'Joao'}
          />);}

    return null;
  };

  // renderiza o componente
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
    fontFamily: 'Raleway_700Bold', // título principal
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
    textAlign: 'center', // <--- centraliza horizontalmente
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
  backgroundColor: '#fff',       // fundo branco
  borderWidth: 1.5,              // define espessura da borda
  borderColor: '#ccc',           // cinza médio para o contorno

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
  color: '#fff',              // branco para contraste com o fundo colorido
  textAlign: 'center',
  fontFamily: 'Raleway_700Bold',
  padding: 6,
},
viewForum: {
  flexDirection: 'row',
  gap: 10
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
  color: '#fff',              // branco para contraste com o fundo colorido
  textAlign: 'center',
  fontFamily: 'Raleway_400Bold',
  padding: 6,
},
});

