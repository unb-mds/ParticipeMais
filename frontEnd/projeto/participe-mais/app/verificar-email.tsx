import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import React, { useState } from 'react';

export default function VerificarEmail() {
  const [codigo, setCodigo] = useState(['', '', '', '']);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Alterar e-mail",
          headerBackTitle: "Voltar",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.titulo}>Verificar e-mail</Text>
        <Text style={styles.subtitulo}>
          Agora que enviamos o código de autenticação, basta inseri-lo no campo abaixo!
        </Text>

        <View style={styles.codigoContainer}>
          {codigo.map((char, index) => (
            <TextInput
              key={index}
              value={char}
              onChangeText={(text) => {
                const novo = [...codigo];
                novo[index] = text;
                setCodigo(novo);
              }}
              keyboardType="numeric"
              maxLength={1}
              style={styles.caixaCodigo}
            />
          ))}
        </View>

        <Text style={styles.timer}>05:00</Text>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>Alterar e-mail</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Raleway_400Regular',
    marginBottom: 24,
  },
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  caixaCodigo: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Raleway_700Bold',
  },
  timer: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#2670E8',
    fontSize: 14,
  },
  botao: {
    backgroundColor: '#2670E8',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway_700Bold',
  },
});
