import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import React from 'react';

<Stack.Screen
  options={{
    title: 'Notificações',
    headerBackTitle: 'Voltar', // ou 'Voltar', ou deixe vazio ''
  }}
/>

export default function Notificacao() {
  return (
    <View style={styles.container}>
      <Stack.Screen
      options={{
        title: 'Notificações',
        headerBackTitle: 'Voltar', // ou 'Voltar', ou deixe vazio ''
      }}
    />
      <Text style={styles.title}>Olá mundo Notificawawda</Text>
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
