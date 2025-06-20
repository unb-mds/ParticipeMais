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
  TouchableOpacity,
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
      const response = await fetch('http://192.168.0.16:8000/auth/cadastro/', {
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

  const estiloInput = (campo: keyof typeof erros) =>
    erros[campo] ? styles.inputErro : styles.input;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo do app */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.titulo}>Crie sua conta!</Text>

        {/* Campo Nome */}
        <Text style={styles.label}>Nome de usuário</Text>
        <TextInput
          style={estiloInput('nome')}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Campo Email */}
        <Text style={styles.label}>E-mail</Text>
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
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={estiloInput('senha')}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="next"
        />

        {/* Campo Repetir Senha */}
        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput
          style={estiloInput('senhaNovamente')}
          placeholder="Repita a senha"
          value={senhaNovamente}
          onChangeText={setSenhaNovamente}
          secureTextEntry
          returnKeyType="done"
        />

        {/* Botão Cadastrar */}
        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        {/* Link para Login */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.rodapeLink}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
    color: "#1e293b",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 8,
    color: "#475569",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  inputErro: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  rodape: {
    flexDirection: "row",
    marginTop: 24,
    gap: 4,
  },
  rodapeTexto: {
    color: "#64748b",
  },
  rodapeLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});