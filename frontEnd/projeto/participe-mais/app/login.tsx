import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState(false);

  const handleLogin = () => {
    // Substitua com sua lógica real de login
    if (email !== 'usuario@email.com' || senha !== '123456') {
      setErroLogin(true);
    } else {
      setErroLogin(false);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      // Redirecionar para próxima tela aqui
    }
  };

  return (
    <View style={styles.container}>
      {/* Alerta de erro */}
      {erroLogin && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>E-mail ou senha incorretos</Text>
        </View>
      )}

      {/* Logo (substitua por imagem se quiser) */}
      <Text style={styles.logo}>🤝</Text>

      <Text style={styles.title}>Entre na sua conta</Text>

      <TextInput
        placeholder="Insira seu e-mail por favor:"
        style={[styles.input, erroLogin && styles.inputError]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErroLogin(false);
        }}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Insira sua senha por favor:"
        style={[styles.input, erroLogin && styles.inputError]}
        value={senha}
        onChangeText={(text) => {
          setSenha(text);
          setErroLogin(false);
        }}
        secureTextEntry
      />

      <Text style={styles.termsText}>
        Aceito termos e serviços de uso
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Ainda não possui uma conta?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#E53935',
    backgroundColor: '#fff0f0',
  },
  loginButton: {
    backgroundColor: '#999',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: '#1976D2',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  errorBox: {
    backgroundColor: '#E53935',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});