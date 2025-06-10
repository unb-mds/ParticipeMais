import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";

const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraBotao = SCREEN_WIDTH * 0.5; // 95% da tela
const larguraCaixa = SCREEN_WIDTH * 0.05; // 95% da tela


export default function AlterarSenha() {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const alternarVisibilidadeSenha = () => setMostrarSenha(!mostrarSenha);

  return (
    <>
    <Stack.Screen
            options={{
              title: "Alterar senha",
              headerBackTitle: "Voltar",
            }}
          />
    <View style={styles.container}>
      {/* Título do body da tela */}
      <Text style={styles.titulo}>Alterar Senha</Text>
      <Text style={styles.subtitulo}>
        Vamos alterar sua senha! Digite a senha atual, depois escolha uma nova e confirme-a para continuar.
      </Text>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Insira sua antiga senha:</Text>
        <View style={styles.inputComIcone}>
          <TextInput
            value={senhaAntiga}
            onChangeText={setSenhaAntiga}
            secureTextEntry={!mostrarSenha}
            placeholder="••••••••••••••••"
            placeholderTextColor="#bbb"
            style={styles.input}
          />
          <TouchableOpacity onPress={alternarVisibilidadeSenha}>
            <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Insira sua nova senha:</Text>
        <View style={styles.inputComIcone}>
          <TextInput
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={!mostrarSenha}
            placeholder="••••••••••••••••"
            placeholderTextColor="#bbb"
            style={styles.input}
          />
          <TouchableOpacity onPress={alternarVisibilidadeSenha}>
            <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Confirme sua senha nova!</Text>
        <View style={styles.inputComIcone}>
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!mostrarSenha}
            placeholder="••••••••••••••••"
            placeholderTextColor="#bbb"
            style={styles.input}
          />
          <TouchableOpacity onPress={alternarVisibilidadeSenha}>
            <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.textoBotao}>Alterar</Text>
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
    paddingTop: 60, // <--- margem do topo
  },
  titulo: {
    fontSize: 22,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 8,
    marginTop: larguraCaixa,

  },
  subtitulo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 28,
    fontFamily: 'Raleway_400Regular',
  },
  campoContainer: {
    marginBottom: 28, // <--- mais espaço entre campos
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color:"#000000",
    fontFamily: 'Raleway_700Regular',
  },
  inputComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingRight: 8,
    fontFamily: 'Raleway_400Regular',
    marginVertical:10
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
