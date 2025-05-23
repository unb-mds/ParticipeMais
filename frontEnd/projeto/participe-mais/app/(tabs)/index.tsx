import { useState } from 'react';
import { Platform, StyleSheet,ScrollView, View } from 'react-native';
import Cabecalho from '@/components/cabecalho'; // ajuste o caminho se necessário
import { ThemedText } from '@/components/ThemedText';
import BlocoDinamico from '@/components/blocosdinamicos';

export default function HomeScreen() {
  const blocos = [
  { tipo: 'banner', titulo: 'Bem-vindo!' },
  { tipo: 'listaUsuarios', usuarios: 15, comentarios: 15 },
  { tipo: 'noticia', titulo: 'Nova função!', corpo: 'Foi lançada uma nova versão do app' },
  { tipo: 'evento', nome: 'Live XP', data: '2025-06-01' },
  {
    tipo: 'carrosselCategorias',
    dados: [
      { categoria: 'Meio Ambiente', totalComentarios: 10 },
      { categoria: 'Educação', totalComentarios: 7 },
    ],
  },
];


  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');

  return (
    <View style = {styles.container}>
      <Cabecalho
        user={"Giovanni"}
        xp={50}
        nivel={4}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      

      {/* aqui você renderiza o conteúdo baseado na aba selecionada */}
      {abaAtiva === 'descubra' && <ThemedText>Conteúdo da Comunidade</ThemedText>}
      {abaAtiva === 'comunidade' && (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.fundoBranco}>
          <ThemedText style = {styles.title}>Conheça a comunidade</ThemedText>
                <BlocoDinamico blocos={blocos} />

        </View>
      </ScrollView>
    )}
      {abaAtiva === 'pesquisar' && <ThemedText>Conteúdo de Pesquisa</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding:5,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 5,
  },
  fundoBranco: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 5,
    minHeight: 550,
  },
 texto: {
    fontSize: 16,
  },
item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
container: {
  flex: 1,
},

});
