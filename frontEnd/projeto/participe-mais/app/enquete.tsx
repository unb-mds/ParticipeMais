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

export default function Enquete() {
  const router = useRouter();

  const [comentarios, setComentarios] = useState([
    {
      id: '1',
      nome: 'Charlie',
      papel: 'Cidadão Participante',
      cor: '#4CAF50',
      texto: 'Na minha cidade começaram a cortar várias árvores antigas alegando risco de queda, mas não plantaram outras no lugar. Isso só aumentou o calor nos bairros. Arborização urbana não deveria ser prioridade?',
      curtidas: 42,
      curtido: false,
    },
    {
      id: '2',
      nome: 'Luísa',
      papel: 'Ativador de Temas',
      cor: '#2196F3',
      texto: 'Concordo, @Charlie. Aqui na Asa Norte o que salvou foi um projeto comunitário que plantou árvores nativas nos canteiros. A prefeitura precisa ouvir mais a população nessas decisões.',
      curtidas: 30,
      curtido: false,
    },
    {
      id: '3',
      nome: 'Gabriel',
      papel: 'Guardião do Debate',
      cor: '#9C27B0',
      texto: 'A questão é que muitas árvores estão mal cuidadas, em poda sem plano. O ideal seria um plano municipal de arborização com participação dos moradores.',
      curtidas: 15,
      curtido: false,
    },
  ]);

  const [novoComentario, setNovoComentario] = useState('');

  const handlePostar = () => {
    if (novoComentario.trim() === '') return;
    const novo = {
      id: Date.now().toString(),
      nome: 'Você',
      papel: 'Cidadão Participante',
      cor: '#FF9800',
      texto: novoComentario.trim(),
      curtidas: 0,
      curtido: false,
    };
    setComentarios([novo, ...comentarios]);
    setNovoComentario('');
    Keyboard.dismiss();
  };

  const handleCurtir = (id: string) => {
    setComentarios((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              curtido: !item.curtido,
              curtidas: item.curtido ? item.curtidas - 1 : item.curtidas + 1,
            }
          : item
      )
    );
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
        <Text style={styles.titulo}>
          Arborização nas cidades: mais sombra e menos calor?
        </Text>

        {/* Info */}
        <View style={styles.info}>
          <Ionicons name="heart-outline" size={16} color="#000" />
          <Text style={styles.infoText}>42 Curtidas</Text>
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
          <Text style={styles.criadorText}>Francisco</Text>
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.cardComentario}>
              <View style={styles.headerComentario}>
                <View
                  style={[styles.bolaComentario, { backgroundColor: item.cor }]}
                />
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.papel}>{item.papel}</Text>
              </View>
              <Text style={styles.textoComentario}>{item.texto}</Text>
              <View style={styles.footerComentario}>
                <TouchableOpacity onPress={() => handleCurtir(item.id)}>
                  <Ionicons
                    name={item.curtido ? 'heart' : 'heart-outline'}
                    size={16}
                    color={item.curtido ? 'red' : '#000'}
                  />
                </TouchableOpacity>
                <Text style={styles.infoText}>{item.curtidas} Curtidas</Text>
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
