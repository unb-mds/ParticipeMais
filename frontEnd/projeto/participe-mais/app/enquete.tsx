import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Enquete() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id do chat
  const [token, setToken] = useState('');
  const [titulo, setTitulo] = useState('');
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [autor, setAutor] = useState('');
  const [total_curtidas, setTotal_curtidas] = useState('');

 useEffect(() => {
  const obterToken = async () => {
    const t = await AsyncStorage.getItem('accessToken');
    if (t) {
      setToken(t);
    }
  };
    obterToken();
  }, []);

  useEffect(() => {
    if (token && id) {
      buscarChat();
    }
  }, [token, id]);

  const buscarChat = async () => {
    try {
      const res = await fetch(`https://14becbe8f935.ngrok-free.app/comunidade/chat/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();
      console.log(json)
      if (res.ok) {
      setTitulo(json.pergunta || 'Discussão');
        setComentarios(json.comentarios || []);
        setAutor(json.autor_nome || 'Anônimo'); // 👈 aqui
        setTotal_curtidas(json.total_curtidas)
      } else {
        console.warn('Erro ao buscar chat:', json);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };


  const [novoComentario, setNovoComentario] = useState('');

const handlePostar = async () => {
  if (novoComentario.trim() === '') return;

  try {
    const res = await fetch(`https://14becbe8f935.ngrok-free.app/comunidade/chat/${id}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conteudo: novoComentario.trim() }),
    });

    const json = await res.json();

    if (res.ok) {
      // Atualiza a lista de comentários com o novo no topo
      setComentarios(prev => [json.data, ...prev]);
      setNovoComentario('');
      Keyboard.dismiss();
    } else {
      alert(json.message || 'Erro ao postar comentário.');
    }
  } catch (err) {
    console.error('Erro ao postar comentário:', err);
    alert('Erro ao postar comentário.');
  }
};

const handleCurtir = async (comentarioId: number) => {
  try {
    const res = await fetch(`https://14becbe8f935.ngrok-free.app/comunidade/chat/${id}/comentarios/${comentarioId}/curtir/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setComentarios((prevComentarios) =>
        prevComentarios.map((comentario) => {
          if (comentario.id === comentarioId) {
            return {
              ...comentario,
              curtido: !comentario.curtido,
              quantidade_curtidas: comentario.quantidade_curtidas + (comentario.curtido ? -1 : 1),
            };
          }
          return comentario;
        })
      );
    } else {
      const json = await res.json();
      console.warn('Erro ao curtir comentário:', json);
    }
  } catch (error) {
    console.error('Erro ao curtir comentário:', error);
  }
};


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comunidade</Text>
          <TouchableOpacity>
            <Feather name="share-2" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>{titulo}</Text>


        {/* Info */}
        <View style={styles.info}>
          <Ionicons name="heart-outline" size={16} color="#000" />
          <Text style={styles.infoText}>{total_curtidas}</Text>
          <MaterialIcons
            name="chat-bubble-outline"
            size={16}
            color="#000"
            style={{ marginLeft: 16 }}
          />
          <Text style={styles.infoText}>{comentarios.length} Comentários</Text>
        </View>

        {/* Criador */}
        <View style={styles.criador}>
          <View style={styles.bolaCriador} />
            <Text style={styles.criadorText}>{autor}</Text>
          <Text style={styles.criadorSub}>Criador da discussão</Text>
        </View>

        {/* Input de comentário */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comente algo</Text>
          <TextInput
            placeholder="Digite seu comentário aqui..."
            placeholderTextColor="#999"
            style={styles.input}
            value={novoComentario}
            onChangeText={setNovoComentario}
            multiline
          />
          <Text style={styles.subLabel}>Aperte enter para publicar</Text>
          <View style={styles.botoesInput}>
            <TouchableOpacity
              style={styles.cancelar}
              onPress={() => setNovoComentario('')}
            >
              <Text style={{ color: '#2670E8' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postar} onPress={handlePostar}>
              <Text style={{ color: '#fff' }}>Postar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Título comentários */}
        <Text style={styles.comentariosTitulo}>Comentários</Text>

        {/* Lista de comentários */}
        <FlatList
  data={comentarios}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
  renderItem={({ item }) => (
    <View style={styles.cardComentario}>
      <View style={styles.headerComentario}>
        <View style={[styles.bolaComentario, { backgroundColor: item.cor || '#ccc' }]} />
        <Text style={styles.nome}>{item.nome_autor || 'Anônimo'}</Text>
        <Text style={styles.papel}>{item.autor_papel || 'Usuário'}</Text>
      </View>
      <Text style={styles.textoComentario}>{item.conteudo}</Text>
      <View style={styles.footerComentario}>
      <TouchableOpacity onPress={() => handleCurtir(item.id)}>
        <Ionicons
          name={item.curtido ? 'heart' : 'heart-outline'}
          size={20}
          color={item.curtido ? '#E91E63' : '#000'}
        />
      </TouchableOpacity>
      <Text style={styles.infoText}>{item.quantidade_curtidas} Curtidas</Text>

      </View>
    </View>
  )}
/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
  },
  titulo: {
    marginRight: 30,
    fontSize: 26,
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  criador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  bolaCriador: {
    width: 12,
    height: 12,
    backgroundColor: 'orange',
    borderRadius: 6,
  },
  criadorText: {
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  criadorSub: {
    fontSize: 12,
    color: '#555',
  },

  // 🔵 Caixa de comentário
  inputContainer: {
    backgroundColor: '#fff', // agora fundo branco
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,

  },
  label: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Raleway-Bold',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 10,
    color: '#777',
    marginBottom: 8,
  },

  // 🔵 Box onde digita o texto
  input: {
    backgroundColor: '#F1F1F1', // agora cinza
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    minHeight: 40,
    textAlignVertical: 'top',
  },

  botoesInput: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  postar: {
    flex: 1,
    backgroundColor: '#2670E8',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },

  comentariosTitulo: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },

  // 🔳 Cards dos comentários
  cardComentario: {
    borderRadius: 6, // menos arredondado
    padding: 12,
    backgroundColor: '#F2f2f2',
  },
  headerComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  bolaComentario: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nome: {
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  papel: {
    fontSize: 12,
    color: '#2670E8',
    marginLeft: 'auto',
    fontFamily: 'Raleway-Bold',

  },
  textoComentario: {
    fontSize: 13,
    color: '#000',
    marginBottom: 8,
  },
  footerComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
