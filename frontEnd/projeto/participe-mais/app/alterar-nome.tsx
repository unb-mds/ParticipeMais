import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraBotao = SCREEN_WIDTH * 1.15;

export default function AlterarNome() {
  const [novoNome, setNovoNome] = useState('');

  const handleSalvar = () => {
    // Aqui você pode integrar com backend, contexto ou AsyncStorage
    console.log('Novo nome salvo:', novoNome);
    alert('Nome alterado com sucesso!');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Alterar nome',
          headerBackTitle: 'Voltar',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.titulo}>Alterar nome</Text>
        <Text style={styles.subtitulo}>
          Digite o novo nome que deseja exibir em seu perfil.
        </Text>

        <View style={styles.campoContainer}>
          <Text style={styles.label}>Novo nome:</Text>
          <TextInput
            value={novoNome}
            onChangeText={setNovoNome}
            placeholder="Digite seu novo nome"
            placeholderTextColor="#bbb"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar</Text>
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
    fontFamily: 'Raleway_700Bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 28,
    fontFamily: 'Raleway_400Regular',
  },
  campoContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#000',
    fontFamily: 'Raleway_700Regular',

  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
    fontFamily: 'Raleway_400Regular',
    paddingVertical:10
  },
  botao: {
    marginTop: larguraBotao,
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
