import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  View,
  ActivityIndicator
} from "react-native";

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    nome: string;
    [key: string]: any;
  };
  message?: string;
}

interface ErrorResponse {
  detail?: string;
  [key: string]: any;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isVerificandoLogin, setIsVerificandoLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        // Descomente se quiser redirecionar automaticamente usuários logados
        // if (token) {
        //   router.replace('/perfil');
        // }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      } finally {
        setIsVerificandoLogin(false);
      }
    };

    verificarLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://172.20.10.9:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const data: LoginResponse | ErrorResponse = await response.json();

      if (response.ok) {
        const successData = data as LoginResponse;
        
        // Armazena os tokens e dados do usuário
        await Promise.all([
          AsyncStorage.setItem('accessToken', successData.access),
          AsyncStorage.setItem('refreshToken', successData.refresh),
          AsyncStorage.setItem('nomeUsuario', successData.user.nome),
          AsyncStorage.setItem('usuario', JSON.stringify(successData.user)),
        ]);

        Alert.alert('Sucesso', successData.message || 'Login realizado com sucesso');
        router.replace('/');
      } else {
        const errorData = data as ErrorResponse;
        const mensagemErro = errorData.detail || 'Credenciais inválidas';
        Alert.alert('Erro', mensagemErro);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificandoLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Entre na sua conta</Text>

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.termos}>Ao continuar, você concorda com nossos Termos de Serviço</Text>

      <TouchableOpacity 
        style={styles.botao} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push('/esqueci')}>
          <Text style={styles.link}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.link}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 22,
    marginBottom: 24,
    fontFamily: "Raleway_700Bold",
    color: "#1a1a1a",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Raleway_600SemiBold",
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontFamily: "Raleway_400Regular",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  termos: {
    fontSize: 12,
    color: "#666",
    marginVertical: 16,
    textAlign: "center",
    fontFamily: "Raleway_400Regular",
    maxWidth: '80%',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginVertical: 8,
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
  botao: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
});