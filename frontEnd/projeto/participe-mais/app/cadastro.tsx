import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';


export default function TelaCadastro() {
  const router = useRouter();
  const [isVerificandoLogin, setIsVerificandoLogin] = useState(true);
  // Estados para armazenar os valores dos campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaNovamente, setSenhaNovamente] = useState('');

  // Estado para controlar quais campos estão com erro para aplicar o estilo correto
  const [erros, setErros] = useState({
    nome: false,
    email: false,
    senha: false,
    senhaNovamente: false,
  });

  
  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          router.replace('/perfil');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      } finally {
        setIsVerificandoLogin(false); // só renderiza depois disso
      }
    };

    verificarLogin();
  }, []);

  if (isVerificandoLogin) {
    return null; 
  }

  /**
   * Função que valida os campos e realiza o cadastro
   */
  const handleCadastrar = async () => {
  const novosErros = {
    nome: nome.trim() === '',
    email: email.trim() === '',
    senha: senha === '',
    senhaNovamente: senhaNovamente === '' || senhaNovamente !== senha,
  };

  setErros(novosErros);

  if (Object.values(novosErros).some(Boolean)) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente e verifique as senhas.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/auth/cadastro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        email,
        password: senha,
        data_nascimento: '2000-01-01' 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.');

      // Se quiser, pode salvar o token de acesso aqui para autenticação futura
      // Exemplo:
      // await AsyncStorage.setItem('token', data.access);

      router.push('/login'); 

      setNome('');
      setEmail('');
      setSenha('');
      setSenhaNovamente('');
    } else {
      Alert.alert('Erro', 'Falha no cadastro: ' + JSON.stringify(data.errors || data.message));
    }
  } catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  Alert.alert('Erro', 'Erro na requisição: ' + errorMessage);
  }
};

  /**
   * Retorna o estilo do input baseado no estado de erro do campo
   * @param {string} campo - Nome do campo para verificar erro
   * @returns {object} - Estilo a ser aplicado
   */
  const estiloInput = (campo: keyof typeof erros) =>
  erros[campo] ? styles.inputErro : styles.input;


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Logo do app */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Campo Nome */}
        <Text>Insira seu nome de usuário:</Text>
        <TextInput
          style={estiloInput('nome')}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Campo Email */}
        <Text>Insira seu e-mail por favor:</Text>
        <TextInput
          style={estiloInput('email')}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Campo Senha */}
        <Text>Insira sua senha:</Text>
        <TextInput
          style={estiloInput('senha')}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="next"
        />

        {/* Campo Repetir Senha */}
        <Text>Insira sua senha novamente:</Text>
        <TextInput
          style={estiloInput('senhaNovamente')}
          placeholder="Repita a senha"
          value={senhaNovamente}
          onChangeText={setSenhaNovamente}
          secureTextEntry
          returnKeyType="done"
        />

        {/* Botão para enviar o formulário */}
        <View style={styles.botaoContainer}>
          <Button title="Criar conta" onPress={handleCadastrar} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#E6E6E6', // fundo cinza claro
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular', // <- fonte aplicada
  },
  inputErro: {
    height: 40,
    backgroundColor: '#E6E6E6',
    borderWidth: 2,
    borderColor: 'red', // borda vermelha para erro
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular', // <- fonte aplicada
  },
  botaoContainer: {
    marginTop: 12,
  },
});

