import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Raleway_400Regular,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PerfilScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });

  const campos = ['nome', 'email', 'senha'] as const;
  type Campo = typeof campos[number];

  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const [formEditado, setFormEditado] = useState(false);
  const [token, setToken] = useState('');

  // Obter token e dados do usuário
  useEffect(() => {
    const carregarInformacoes = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        const usuarioSalvo = await AsyncStorage.getItem('usuario');

        if (!tokenSalvo) {
          router.replace('/login');
          return;
        }

        setToken(tokenSalvo);

        if (usuarioSalvo) {
          const userObj = JSON.parse(usuarioSalvo);
          setDados({
            nome: userObj.nome || '',
            email: userObj.email || '',
            senha: '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        router.replace('/login');
      }
    };

    carregarInformacoes();
  }, []);

  const handleChange = (campo: Campo, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    setFormEditado(true);
  };

  const handleSalvar = () => {
    setFormEditado(false);
    Alert.alert('Sucesso', 'Dados salvos com sucesso!');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://172.20.10.9:8000/auth/logout/', {
        // caso queira rodar pelo celular, troque o campo pelo seu ipv4 e adicionei no settings do django no ALLOWED_HOSTS ['seu ip']
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await AsyncStorage.multiRemove(['usuario', 'accessToken']);
        Alert.alert('Você saiu da conta com sucesso!');
        router.push('/login');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro ao sair da conta', errorData.detail || 'Erro inesperado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível se desconectar.');
    }
  };

  const [score, setScore] = useState<{
    xp: number;
    nivel: number;
  } | null> (null)

  useEffect(() => {
      const fetchScore = async () => {
        try {
          const response = await fetch('http://172.20.10.9:8000/comunidade/score', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
          const json = await response.json();
  
          if (json?.data?.score) {
            setScore(json.data.score);
          } else {
            console.warn('Estrutura inesperada na resposta:', json);
            setScore({ xp: 0, nivel: 1 }); // ou null, dependendo do que for melhor
          }
        }
        } catch (error) {
          console.error('Erro na requisição:', error);
        }
      };
  
      fetchScore();
    }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Perfil</Text>
        <View style={styles.linhaCinza} />

        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.imgur.com/0y8Ftya.png' }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => console.log('Editar foto')}
            >
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{dados.nome}</Text>
            <Text style={styles.level}>Nível {score?.nivel}- Cidadão Ativo</Text>
          </View>
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.textoAbaixo}>Nivel {score?.nivel}: Cidadão Ativo</Text>
          <View style={styles.linhaXp}>
            <View style={styles.barraFundo}>
              <View style={[styles.barraXp, { width: `${((score?.xp ?? 0) / 500) * 100}%` }]} />
            </View>
            <Text style={styles.texto_barra}>{score?.xp} / 500 xp</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seus dados</Text>

        {campos.map((campo) => (
          <View key={campo} style={styles.field}>
            <Text style={styles.label}>
              {campo === 'nome'
                ? 'Nome completo'
                : campo === 'email'
                ? 'E-mail'
                : 'Senha'}
            </Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <Text style={styles.input}>
                  {campo === 'senha' ? '*************' : dados[campo]}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editIconOutside}
                onPress={() => {
                  if (campo === 'nome') router.push('/alterar-nome');
                  else if (campo === 'email') router.push('/alterar-email');
                  else if (campo === 'senha') router.push('/alterarSenha');
                }}
              >
                <Octicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: 'red', fontSize: 16 }}>Sair da conta</Text>
        </TouchableOpacity>

        {formEditado && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: { backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: 'Raleway_700Bold',
    marginTop: 40,
  },
  linhaCinza: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 12,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 40,
    marginTop: 15,
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 4,
  },
  userInfo: { flexDirection: 'column', justifyContent: 'center' },
  username: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: 'Raleway_400Bold',
    paddingHorizontal: 5,
    color: '#3A3A3A',
  },
  level: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 4,
    fontFamily: 'Raleway_400Regular',
    alignSelf: 'flex-start',
  },
  xpCard: {
    backgroundColor: '#1976D2',
    borderRadius: 30,
    padding: 20,
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 10,
  },
  textoAbaixo: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
    marginBottom: 8,
  },
  linhaXp: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  barraFundo: {
    flex: 1,
    height: 15,
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  barraXp: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  texto_barra: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway_400Regular',
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#666',
    fontFamily: 'Raleway_700Bold',
  },
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
    fontFamily: 'Raleway_400Regular',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontFamily: 'Raleway_400Regular',
    color: '#333',
  },
  editIconOutside: {
    marginLeft: 12,
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Raleway_700Bold',
  },
});
