import { View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

type Props = {
  titulo: string;
  user: string
};
const router = useRouter();

export default function Cabecalho({ titulo, user }: Props) {
  return (
      <>
    <View style={styles.headerContainer}>
        <Image
  source={require('@/assets/images/icon.png')} // ou './assets/images/logo.png'
  style={styles.logo}
 resizeMode="contain" 

/>
      <Text style={styles.title}>{titulo}</Text> <Text style={styles.user} numberOfLines={1} adjustsFontSizeToFit> {user}</Text> <TouchableOpacity style={styles.bell} onPress={() => router.push('/notificacoes')}><FontAwesome5 name="bell" size={30} color="black" /> </TouchableOpacity>      
    </View>
    <View style={styles.Novocontainer}>
        <Text>OI</Text>
    </View>
    </>

  );
}

const styles = StyleSheet.create({
  headerContainer: {
  padding: 16,  
  marginTop: 20,                       // aplica espaçamento interno em todos os lados
  backgroundColor: '#ffffff',         // cor de fundo branca
  borderBottomWidth: 0,               // adiciona uma borda na parte inferior
  marginBottom: 0, // empurra o próximo item para baixo
flexDirection: 'row',
alignItems: 'center',
    },

  title: {
    fontSize: 25,  // define o tamanho da fonte
    fontWeight: 'bold', // define o peso da fonte como negrito
    marginLeft: 65,
    marginTop: 10
  },
   logo: {
    width: 40,
    height: 40,
    marginTop: 10
  },
  user: {
  fontSize: 25,
  fontWeight: 'bold',
  marginTop: 10,
  marginLeft: 5,
  color: '#2670E8',
  flexShrink: 1
},
  bell: {
    marginRight: 10,
    marginTop: 10,
    marginLeft: 60},

    Novocontainer: {
  padding: 16,  
  backgroundColor: '#ffffff',         // cor de fundo branca
  borderBottomWidth: 1,               // adiciona uma borda na parte inferior
  borderBottomColor: '#ccc',          // define a cor da borda inferior (cinza claro)
  marginBottom: 0, // empurra o próximo item para baixo
  paddingTop: 20, // cria espaço interno acima dos elementos
paddingBottom: 65, // cria espaço interno abaixo dos elementos
alignItems: 'center',
    },

});
