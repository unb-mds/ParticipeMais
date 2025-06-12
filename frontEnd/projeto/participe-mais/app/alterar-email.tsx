import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack,useRouter  } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraBotao = SCREEN_WIDTH * 1.05;

export default function AlterarEmail() {
  const [novoEmail, setNovoEmail] = useState('');
  const router = useRouter();

    const handleSalvar = () => {
    if (!novoEmail.includes('@')) {
        alert('Digite um e-mail válido.');
        return;
    }

    // Aqui você pode chamar uma API de envio de código, se desejar

    // Redireciona para a tela de verificação
    router.push('/verificar-email');
    };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Alterar e-mail',
          headerBackTitle: 'Voltar',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.titulo}>Alterar E-mail</Text>
        <Text style={styles.subtitulo}>
          Para alterar seu e-mail cadastrado, insira-o no campo abaixo. Em seguida, enviaremos um código de autenticação para confirmar sua identidade.
        </Text>

        <View style={styles.campoContainer}>
          <Text style={styles.label}>Insira o seu e-mail novo:</Text>
          <TextInput
            value={novoEmail}
            onChangeText={setNovoEmail}
            placeholder="Digite seu novo e-mail"
            placeholderTextColor="#bbb"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Avançar</Text>
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
    paddingVertical:10,
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
