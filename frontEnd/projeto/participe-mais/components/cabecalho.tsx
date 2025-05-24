import { View, StyleSheet, Image,TouchableOpacity} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Dispatch, SetStateAction } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import React from 'react';


const router = useRouter();


type Props = {
  user: string;
  xp: number;
  nivel: number;
  abaAtiva: 'descubra' | 'comunidade' | 'pesquisar';
  setAbaAtiva: Dispatch<SetStateAction<'comunidade' | 'descubra' | 'pesquisar'>>;
};



export default function Cabecalho({  user, xp, nivel, abaAtiva, setAbaAtiva }: Props) {
  let titulo = 'Bem-vindo(a)';
  
  if (abaAtiva === 'comunidade') {
    titulo = 'Comunidade';
  } else if (abaAtiva === 'pesquisar') {
    titulo = 'Pesquisar';
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }} edges={['top']}>    
    <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    <>
    <View style={styles.headerContainer}> {/* container principal com layout em linha */}

      {/* imagem da logo à esquerda */}
      <Image
        source={require('@/assets/images/icon.png')} // caminho da imagem local
        style={styles.logo}
        resizeMode="contain" // evita cortes na imagem
      />

      {/* bloco central com o título e o nome do usuário */}
      <View style={styles.container}>
        <ThemedText
            style={
          [
            styles.title,
            abaAtiva !== 'descubra' ? styles.title_diferente : undefined
          ] as StyleProp<TextStyle>
            }
      >
        {abaAtiva === 'comunidade'
          ? 'Comunidade'
          : abaAtiva === 'pesquisar'
          ? 'Pesquisar'
          : 'Bem-vindo(a)'}
      </ThemedText>

      {abaAtiva === 'descubra' && (
      <ThemedText
        style={styles.user}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {user}
      </ThemedText>
      )}

      </View>


      {/* botão com ícone de sino, alinhado à direita */}
      <TouchableOpacity
        style={styles.bell}
        onPress={() => router.push('/notificacoes')} // navega para a tela de notificações
      >
        <FontAwesome5 name="bell" size={25} color="black" />
      </TouchableOpacity>

    </View>

    <View style={styles.Novocontainer}><TouchableOpacity
        
        onPress={() => router.push('/score')} // navega para a tela de Score
      >
      <View style={styles.quadrado}>
            <View style={styles.linhaTextoImagem}>
              <ThemedText style={styles.textoInfo}>Seu score</ThemedText>

              <Image
                source={require('@/assets/images/medidor.png')} // substitua pelo caminho correto
                style={styles.foto}
                resizeMode="contain" // evita cortes na imagem

              />
            </View>
            <ThemedText style={styles.textoAbaixo}>Você está no nível {nivel}</ThemedText>
      <View style={styles.linhaBarra}>
            <View style={styles.barraFundo}>
              <View style={[styles.barraXp, { width: `${xp}%` }]} />
            </View>
          <ThemedText style={styles.texto_barra}>{xp} / 500 xp</ThemedText>
        </View>
      </View>
       </TouchableOpacity>
    </View>
    <View style={styles.menuAbas}>
        <TouchableOpacity onPress={() => setAbaAtiva('descubra')}>
          <ThemedText style={abaAtiva === 'descubra' ? styles.abaAtiva : styles.abaInativa}>Descubra</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('comunidade')}>
          <ThemedText style={abaAtiva === 'comunidade' ? styles.abaAtiva : styles.abaInativa}>Comunidade</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('pesquisar')}>
          <ThemedText style={abaAtiva === 'pesquisar' ? styles.abaAtiva : styles.abaInativa}>Pesquisar</ThemedText>
        </TouchableOpacity>
      </View>
        
    </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',       // coloca os elementos em linha
    alignItems: 'center',       // alinha verticalmente ao centro
    padding: 10,                // espaçamento interno
    backgroundColor: '#ffffff',// fundo branco
    borderBottomWidth: 0,       // sem linha inferior
  },
  logo: {
    width: 40,                 // largura da imagem
    height: 40,                // altura da imagem
    marginRight: 12,           // espaço entre a logo e o conteúdo central
  },
  centerContent: {
    flex: 1,                   // ocupa o espaço restante entre logo e sino
    justifyContent: 'center', // centraliza verticalmente (caso precise)
  },
  title: {
    fontSize: 20,              // tamanho do texto do título
    fontWeight: 'bold',        // texto em negrito
  },
  title_diferente: {
    fontSize: 20,              // tamanho do texto do título
    fontWeight: 'bold',
    marginLeft: 45,           // espaço entre a logo e o conteúdo central
        // texto em negrito
  },
  user: {
    fontSize: 20,
    color: '#2670E8',
    fontWeight: 'bold',
    flexShrink: 1,
    marginLeft: 4,
  },
  bell: {
    padding: 12,               // espaço interno para o botão
    backgroundColor: '#D9D9D9',// fundo cinza claro
    borderRadius: 100,         // deixa o botão redondo
    alignItems: 'center',      // centraliza horizontalmente o ícone
    justifyContent: 'center',  // centraliza verticalmente o ícone
    marginLeft: 50,           // espaço entre a logo e o conteúdo central

  },
  container:{
    flexDirection: 'row', alignItems: 'center' ,flex: 1, marginLeft: 40  // ocupa o espaço entre logo e sino
  },
   Novocontainer: {
    padding: 5,  
    backgroundColor: '#ffffff',         // cor de fundo branca
    marginBottom: 0, // empurra o próximo item para baixo
  alignItems: 'center',},

   quadrado: {
    width: 375,               // largura do quadrado
    height: 150,              // altura do quadrado (igual à largura)
    backgroundColor: '#2670E8', // azul (mesmo tom do seu texto)
    borderRadius: 16,         // bordas arredondadas
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
    backgroundColor: '#4CAF50', // verde
    borderRadius: 10,
  },
  texto_barra: {
    color: 'white',
    fontSize: 10,
    marginTop: -12, // adicione esta linha
  },
  linhaBarra: {
  flexDirection: 'row',        //  barra e texto lado a lado
  alignItems: 'center',        // alinha verticalmente no centro
  marginTop:30,               //  desce a barra dentro do quadrado
  justifyContent: 'center',    // centraliza a linha como um todo
  gap: 10,                     // espaço entre barra e texto (em versões recentes do RN)
 
},

linhaTextoImagem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // centraliza horizontalmente dentro do quadrado
  gap: 70,                  // espaço entre texto e imagem (se sua versão permitir)
},

textoInfo: {
  color: 'white',
  fontSize: 25,
  fontWeight: 'bold',
},

foto: {
  width: 140,
  height: 150,
  borderRadius: 20, // deixa a imagem redonda
  marginTop: -40, // adicione esta linha
  
},
textoAbaixo: {
  color: 'white',
  fontSize: 14,
  marginTop: -40, // espaçamento entre barra e texto
  textAlign: 'center',
  marginRight: 195,           // espaço entre a logo e o conteúdo central

},

menuAbas: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 8,
  borderBottomColor: '#fff',
},
abaAtiva: {
  fontWeight: 'bold',
  color: '#2670E8',
  borderBottomWidth: 2,
  borderBottomColor: '#2670E8',
  paddingBottom: 4,
},

abaInativa: {
  color: '#555',
  paddingBottom: 4,
},
});

