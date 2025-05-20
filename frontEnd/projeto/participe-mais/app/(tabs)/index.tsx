import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Cabecalho from '@/components/cabecalho'; // ajuste o caminho se necessário
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  
  const [abaAtiva, setAbaAtiva] = useState<'descubra' | 'comunidade' | 'pesquisar'>('descubra');

  return (
    <View>
      <Cabecalho
        user={"Giovanni"}
        xp={50}
        nivel={4}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      

      {/* aqui você renderiza o conteúdo baseado na aba selecionada */}
      {abaAtiva === 'descubra' && <ThemedText>Conteúdo da Comunidade</ThemedText>}
      {abaAtiva === 'comunidade' && <ThemedText>Conteúdo do Descubra</ThemedText>}
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
  },
});
