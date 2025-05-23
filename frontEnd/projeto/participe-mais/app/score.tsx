import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import React from 'react';

<Stack.Screen
  options={{
    title: 'Score',
    headerBackTitle: 'Voltar', // ou 'Voltar', ou deixe vazio ''
  }}
/>

export default function Score() {
  return (
    <View style={styles.container}>
      <Stack.Screen
      options={{
        title: 'Score',
        headerBackTitle: 'Voltar', // ou 'Voltar', ou deixe vazio ''
      }}
    />
      <Text style={styles.title}>Olá mundo Score</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',     // organiza em linha
    alignItems: 'center',     // centraliza verticalmente
    gap: 8,                   // espaço entre elementos
    padding: 16,              // espaçamento interno
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
