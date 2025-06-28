import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  objetivos: string[];
};

export default function Objetivos({ objetivos }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Objetivos</Text>
      {objetivos.map((item, index) => (
        <View key={index} style={styles.objetivoItem}>
          <Text style={styles.objetivoText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2670E8',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    marginBottom: 4,
  },
  objetivoItem: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  objetivoText: {
    color: '#2670E8',
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
  },
});
