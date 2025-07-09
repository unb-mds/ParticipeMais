import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  palavras: string[];
}

export default function NuvemDePalavras({ palavras }: Props) {
  const gerarPeso = () => Math.floor(Math.random() * 5) + 1;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.titulo}>Nuvem de palavras</Text>
      <Text style={styles.subtitulo}>
        Veja as principais palavras que têm a ver com o tema de meio ambiente!
      </Text>

      <View style={styles.container}>
        {palavras.map((palavra, index) => {
          const peso = gerarPeso();

          return (
            <View
              key={`${palavra}-${index}`}
              style={styles.itemWrapper}
            >
              <Text
                style={[
                  styles.palavra,
                  {
                    fontSize: 10 + peso * 2, 
                    opacity: 0.85 + peso * 0.06,
                  },
                ]}
              >
                {palavra}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
    color: '#555',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  itemWrapper: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
    minHeight: 18,
  },
  palavra: {
    fontFamily: 'Raleway_700Bold',
    color: '#000',
    textAlign: 'center',
  },
});
