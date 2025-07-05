import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons,FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CategoriaDescricao from '../components/categoria/categoriadescricao';
import CategoriaIcone from '../components/categoria/categoriaIcon'; // ajuste o caminho se necessário
import NuvemDePalavras from '../components/categoria/nuvem'; // ajuste o caminho se necessário

export default function Categoria() {
  const router = useRouter();
const dados = [
  { categoria: 'Meio Ambiente', comentario: 'Devíamos ter mais árvores nas cidades!', autor: 'João Silva' },
  { categoria: 'Meio Ambiente', comentario: 'Postos de saúde precisam de mais médicos.', autor: 'Maria Souza' },
  { categoria: 'Meio Ambiente', comentario: 'A escola do bairro precisa de reforma.', autor: 'Carlos Lima' },
];

   const imagensConferencias = [
    { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWNUQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0d4ae56b4559862a8cceaccc2fd05e246d014f27/Banner_1480x220_v2.png'},
    { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVFZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae2ac5eb7b598677a07a7cfb586471c82e45e30/BANNER%20-%201480%20X%20220%20PX.png' },
    { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png' },
    { id: '4', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMFVKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--53067aa5dd91b310913546e76d89bc83b53ef872/Banner%20-%20Brasil%20Participativo%20(ConCidades).png' },

];
const imagensPlanos = [
  { id: '1', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMFVKQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--53067aa5dd91b310913546e76d89bc83b53ef872/Banner%20-%20Brasil%20Participativo%20(ConCidades).png' },
  { id: '2', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVFZQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bae2ac5eb7b598677a07a7cfb586471c82e45e30/BANNER%20-%201480%20X%20220%20PX.png' },
  { id: '3', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaVdoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5575efef3e0c5439e6dbdad64ad59069e23a17ab/banner_5_cnma_1480x220px_fcolor.png' },
  { id: '4', imagem: 'https://ns-dtp-prd-df.s3-df-govcloud.dataprev.gov.br/gcc-decidim/gcc-decidim/s8z5gafv6jveenp7mtgozp290jwd?response-content-disposition=inline%3B%20filename%3D"Banner_Plano_Clima_Participativo_DESKTOP_%25281480-px-720-px%2529%20%25281%2529.png"%3B%20filename%2A%3DUTF-8%27%27Banner_Plano_Clima_Participativo_DESKTOP_%25281480-px-720-px%2529%2520%25281%2529.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=user_dec_prd_df%2F20250610%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250610T003330Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=d96fe11a81ff2624b90ee0bdb38ecbe97883f3e07f84e119d3a6a4adb665cd9e' },
  { id: '5', imagem: 'https://brasilparticipativo.presidencia.gov.br/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWNUQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--0d4ae56b4559862a8cceaccc2fd05e246d014f27/Banner_1480x220_v2.png' },
];
  const imagensConsultas = [
    { id: '1', imagem: 'https://via.placeholder.com/250x120.png?text=Consulta+1' },
  ];

  const enquetes = [
    { categoria: 'Meio Ambiente', enquete: 'Arborização nas cidades: mais sombra e menos calor?', curtidas: 40, numeroComentario: 15 },
    { categoria: 'Meio Ambiente', enquete: 'A preservação de nascentes em áreas urbanas', curtidas: 22, numeroComentario: 8 },
    { categoria: 'Meio Ambiente', enquete: 'Uso de energia renovável em espaços públicos', curtidas: 30, numeroComentario: 12 },
    { categoria: 'Meio Ambiente', enquete: 'Redução do consumo de plásticos nas cidades', curtidas: 28, numeroComentario: 10 },
  ];

  const listaPalavras = [
  'sustentabilidade',
  'ambiental',
  'universidade',
  'campus',
  'questão',
  'resíduo',
  'diversão',
  'ação',
  'preservação',
  'pesquisa',
  'área',
  'ambiente',
    'ambiente',
      'ambiente',
        'ambiente',
          'ambiente',
];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Meio Ambiente</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={styles.container}>
        <View>
        <CategoriaDescricao categoria="meio ambiente" />
        </View>
        {/* Conferências */}
        <Text style={styles.tituloSecao}>Conferências</Text>
        <FlatList
          data={imagensConferencias}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.imagem }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Planos */}
        <Text style={styles.tituloSecao}>Planos</Text>
        <FlatList
          data={imagensPlanos}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.imagem }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Consultas */}
        <Text style={styles.tituloSecao}>Consultas</Text>
        <FlatList
          data={imagensConsultas}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ImageBackground
                source={{ uri: item.imagem }}
                style={[styles.cardImagem, { borderColor: corAleatoria() }]}
                imageStyle={{ borderRadius: 12 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Enquetes */}
        <Text style={styles.tituloSecao}>Acesse as discussões por aqui!</Text>
        <View style={styles.quadroEnquete}>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {enquetes.map((item, index) => (
              <TouchableOpacity key={`${item.categoria}-${index}`}>
                <View style={styles.cardEnquete}>
                <View style={styles.linha_icon}>
                  <CategoriaIcone categoria={item.categoria} tamanho={35} />
                  <Text style={styles.textoEnquete}>{item.enquete}</Text>
                </View>
                <View style={styles.linha}>
                  
                  <MaterialCommunityIcons name="cards-heart-outline" size={14} color="#000" />
                  <Text style={styles.infoEnquete}>{item.curtidas} curtidas</Text>
                  <MaterialIcons name="chat-bubble-outline" size={12} color="#000" style={{ marginLeft: 12 }} />
                  <Text style={styles.infoEnquete}>{item.numeroComentario} comentários</Text>
                </View>
              </View>

              </TouchableOpacity>
            ))}
          </ScrollView>
          </View>
      <View style={styles.viewAlinhador}>
        <Text style={styles.titulo_enquete}>Acesse as enquetes pelos comentários!</Text>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carrossel}
          keyExtractor={(item, index) => `${item.categoria}-${index}`}
          data={dados} // <- você precisa ter `const dados = [...]` no mesmo arquivo
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={[styles.bloco_comentarios, { backgroundColor: corDaCategoria(item.categoria) }]}>
                <View style={styles.dados_comentarios}>
                  {/* Ícone + nome do autor alinhados à esquerda */}
                  <View style={styles.autorHeader}>
                    <FontAwesome5 name="user-circle" size={14} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.autorComentario}>{item.autor}</Text>
                  </View>

                  {/* Comentário */}
                  <Text style={styles.comentarioTexto}>
                    {`"${item.comentario}"`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <NuvemDePalavras palavras={listaPalavras} />

      </ScrollView>
    </SafeAreaView>
  );
}


// 🟩 Função para borda aleatória
function corAleatoria(): string {
  const cores = ['#2670E8', '#4CAF50', '#FF9800', '#ce93d8', '#F44336'];
  return cores[Math.floor(Math.random() * cores.length)];
}

function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',
    'infraestrutura': '#FF9800',
    'saúde': '#2670E8',
    'educação': '#ce93d8',
    'cultura': '#F44336',
  };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}

// 🎨 Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tituloHeader: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  tituloSecao: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },
  listaHorizontal: {
    marginBottom: 20,
    gap: 8,
  },
  cardImagem: {
    width: 250,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#ccc',
    borderWidth: 2,
  },
  quadroEnquete: {
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 12,
    maxHeight: 300,
  },
  cardEnquete: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft:10
  },
  textoEnquete: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    fontFamily: 'Raleway-Bold',
  },
  infoEnquete: {
    fontSize: 12,
    color: '#555',
    
  },
   linha_icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    
  }, 
    viewAlinhador: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop:20,
  },
  titulo_enquete: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
  carrossel: {
    marginTop:20,
    paddingHorizontal: 16,
    gap: 6,
  },
  bloco_comentarios: {
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    minWidth: 200,
    maxWidth: 240,
    minHeight: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginRight: 5,
  },
  dados_comentarios: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  autorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 6,
  },
  autorComentario: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Raleway_400Regular',
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Raleway_400Regular',
    width: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
