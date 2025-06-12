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
  Alert,
} from 'react-native';

export default function TelaCadastro() {
  const [email, setEmail] = useState('');
  let estiloAtual;

  const handleEmail = () => {

    if (!email) {
        Alert.alert('Preencha o campo acima');
        estiloAtual = styles.inputErro
        return;
    } else {
        Alert.alert('Sucesso')
        //router.push('/')
    }
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
    
        <Text>Esqueceu sua senha?</Text>
        <Text>Não se preocupe, nós enviaremos um código/token para seu email:</Text>

        <Text>Insira seu e-mail por favor:</Text>
        <TextInput
          style={estiloAtual}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.botaoContainer}>
          <Button title="Criar conta" onPress={handleEmail} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular', // fonte aplicada
  },
  inputErro: {
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'red',
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular', // fonte aplicada
  },
  botaoContainer: {
    marginTop: 12,
  },
});

