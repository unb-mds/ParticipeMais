import { Platform, StyleSheet, View, Text } from 'react-native';
import Cabecalho from '@/components/cabecalho'; // ajuste o caminho se necessário

export default function HomeScreen() {
  return (
    <View>
      <Cabecalho titulo={"Bem vindo"} user = {"Giovanni"}/> 
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>
      </View>
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
  },
});
