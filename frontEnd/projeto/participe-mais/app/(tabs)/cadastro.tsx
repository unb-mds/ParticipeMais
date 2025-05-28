import React, { useState } from 'react';
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
} from 'react-native';

export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaNovamente, setSenhaNovamente] = useState('');

  const [erroNome, setErroNome] = useState(false);
  const [erroEmail, setErroEmail] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [erroSenhaNovamente, setErroSenhaNovamente] = useState(false);

  const handleCadastrar = () => {
    let temErro = false;

    if (nome.trim() === '') {
      setErroNome(true);
      temErro = true;
    } else {
      setErroNome(false);
    }

    if (email.trim() === '') {
      setErroEmail(true);
      temErro = true;
    } else {
      setErroEmail(false);
    }

    if (senha === '') {
      setErroSenha(true);
      temErro = true;
    } else {
      setErroSenha(false);
    }

    if (senhaNovamente === '' || senhaNovamente !== senha) {
      setErroSenhaNovamente(true);
      temErro = true;
    } else {
      setErroSenhaNovamente(false);
    }

    if (temErro) {
      // Não faz nada, apenas marca os erros para o usuário corrigir
      return;
    }

    // Aqui você pode adicionar a lógica para enviar os dados para backend ou limpar os campos
    // Exemplo: limpar campos após cadastro
    setNome('');
    setEmail('');
    setSenha('');
    setSenhaNovamente('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text>Insira seu nome de usuário:</Text>
        <TextInput
          style={erroNome ? styles.inputErro : styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text>Insira seu e-mail por favor:</Text>
        <TextInput
          style={erroEmail ? styles.inputErro : styles.input}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <Text>Insira sua senha:</Text>
        <TextInput
          style={erroSenha ? styles.inputErro : styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="next"
        />

        <Text>Insira sua senha novamente:</Text>
        <TextInput
          style={erroSenhaNovamente ? styles.inputErro : styles.input}
          placeholder="Repita a senha"
          value={senhaNovamente}
          onChangeText={setSenhaNovamente}
          secureTextEntry
          returnKeyType="done"
        />

        <View style={styles.botaoContainer}>
          <Button title="Criar conta" onPress={handleCadastrar} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, justifyContent: 'center', flexGrow: 1 },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 20 },
  input: {
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  inputErro: {
    height: 40,
    backgroundColor: '#fff0f0',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'red',
    marginBottom: 16,
  },
  botaoContainer: { marginTop: 12 },
});
