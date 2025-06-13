import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';

const router = useRouter();

export default function TelaCadastro() {
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
    const response = await fetch('http://localhost:8000/auth/cadastro/', {
      // caso queira rodar pelo celular, troque o campo pelo seu ipv4 e adicionei no settings do django no ALLOWED_HOSTS ['seu ip']
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

      router.push('/'); // Navega para a tela inicial ou login

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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo do app */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.titulo}>Crie sua conta!</Text>

        {/* Campo Nome */}
        <Text style={styles.label}>Insira seu nome de usuário:</Text>
        <TextInput
          style={estiloInput('nome')}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Campo Email */}
        <Text style={styles.label}>Insira seu e-mail por favor:</Text>
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
        <Text style={styles.label}>Insira sua senha:</Text>
        <TextInput
          style={estiloInput('senha')}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="next"
        />

        {/* Campo Repetir Senha */}
        <Text style={styles.label}>Insira sua senha novamente:</Text>
        <TextInput
          style={estiloInput('senhaNovamente')}
          placeholder="Repita a senha"
          value={senhaNovamente}
          onChangeText={setSenhaNovamente}
          secureTextEntry
          returnKeyType="done"
        />

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
            <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: "contain",
  },
    titulo: {
    fontSize: 20,
    marginBottom: 24,
    fontFamily: "Raleway_700Bold", // título em negrito
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Raleway_400Regular", // rótulo padrão
  },

  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: "Raleway_400Regular", // entrada de texto
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
    botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    marginTop: 24,
    width: "100%",
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold", // texto do botão com destaque
  },
});

