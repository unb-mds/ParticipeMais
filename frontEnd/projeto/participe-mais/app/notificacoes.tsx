import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar } from 'react-native';

interface Notificacao {
  id: number;
  titulo: string;
  message: string;
  created_at: string;
}

export default function Notificacoes() {
  const router = useRouter();

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [token, setToken] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);

  // Obter token ao iniciar
  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          console.error("Token não encontrado");
          router.replace('/login');
        }
      } catch (error) {
        console.error("Erro ao recuperar token:", error);
        router.replace('/login');
      }
    };

    obterToken();
  }, []);

  // Buscar dados após obter token
  useEffect(() => {
    if (token) {
      fetchScore();
      fetchNotificacoes();
    }
  }, [token]);

  const fetchScore = async () => {
    try {
      const response = await fetch('http://localhost:8000/comunidade/score/', {
        // caso queira rodar pelo celular, troque o campo pelo seu ipv4 e adicionei no settings do django no ALLOWED_HOSTS ['seu ip']
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNome(data.usuario);
      } else if (response.status === 401 || response.status === 403) {
        router.replace('/login');
      } else {
        console.error('Erro ao buscar score:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição do score:', error);
      router.replace('/login');
    }
  };

  const fetchNotificacoes = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotificacoes(data);
      } else {
        console.error('Erro ao buscar notificações:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição de notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notificações</Text>
            <View style={{ width: 28 }} />
          </View>

          <FlatList
            data={notificacoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={styles.notificacao}>
                  <Text style={styles.notificacaoTitulo}>{item.titulo}</Text>
                  <Text>{item.message}</Text>
                  <Text style={styles.data}>{item.created_at}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center' }}>
                Nenhuma notificação encontrada.
              </Text>
            }
          />
        </View>
      </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificacao: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notificacaoTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: 'gray',
    marginTop: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
  width: '100%',
  paddingHorizontal: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 15,
  marginBottom: 10,
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
},
safeArea: {
  flex: 1,
  backgroundColor: '#fff',
},

});
