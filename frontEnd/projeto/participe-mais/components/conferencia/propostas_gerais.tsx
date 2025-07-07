import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons, Octicons, Feather } from '@expo/vector-icons';
import { Proposta } from '../../app/conferencias';

type PropostasProps = {
  propostas: Proposta[];
};

export default function Propostas({ propostas }: PropostasProps) {
  const [search, setSearch] = useState('');
  const [expandido, setExpandido] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);

  const propostasFiltradas = useMemo(() => {
  const query = search.trim().toLowerCase();
  if (!query) return propostas;

  return propostas.filter((item) => {
    const titulo = item?.titulo_proposta ?? '';
    const autor = item?.autor ?? '';
    return (
      titulo.toLowerCase().includes(query) ||
      autor.toLowerCase().includes(query)
    );
  });
}, [search, propostas]);


  const abrirModal = (proposta: Proposta) => {
    setPropostaSelecionada(proposta);
    setModalVisible(true);
  };

  return propostasFiltradas.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.tituloComIcone}>
        <Octicons name="light-bulb" size={20} color="black" />
        <Text style={styles.tituloTexto}>Propostas Gerais</Text>
      </View>

      <View style={styles.pesquisaContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={20} color="#000" />
          <TextInput
            placeholder="Buscar..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filtroButton}>
          <Ionicons name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.linha} />


    <View style={{ maxHeight: 300 }}>
      <ScrollView
        showsVerticalScrollIndicator
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
      >
        {propostasFiltradas.map((item) => {
          const estaExpandido = expandido === item.id;
          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setExpandido(estaExpandido ? null : item.id)}
                style={styles.headerCard}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.publicadoEm}>
                    <Ionicons name="calendar-outline" size={12} color="#2670E8" />{' '}
                    Publicado em {item.data_criacao || 'Data não informada'}
                  </Text>
                  <Text style={styles.tituloCard}>{item.titulo_proposta}</Text>
                  <Text style={styles.por}>
                    <Text style={{ color: '#2670E8' }}>Por </Text>
                    {item.autor || 'Não informado'}
                  </Text>
                </View>
                <Ionicons
                  name={estaExpandido ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>

              <View style={styles.linhaDentro} />

              {estaExpandido && (
                <>
                  <Text style={styles.descricao}>{item.descricao_proposta}</Text>
                  <Text style={styles.avaliacaoTexto}>Você gostou da proposta?</Text>
                  <View style={styles.botoesAvaliacao}>
                    <TouchableOpacity
                      style={styles.botaoSim}
                      onPress={() => abrirModal(item)}
                    >
                      <Feather name="thumbs-up" size={16} color="#4CAF50" />
                      <Text style={styles.textoSim}> Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botaoNao}
                      onPress={() => abrirModal(item)}
                    >
                      <Feather name="thumbs-down" size={16} color="#F44336" />
                      <Text style={styles.textoNao}> Não</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>
      </View>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitulo}>{propostaSelecionada?.titulo_proposta}</Text>
              <Text style={styles.modalOrigem}>{propostaSelecionada?.autor}</Text>
              <Text style={styles.modalOrigem}>{propostaSelecionada?.url_proposta}</Text>
              <Text style={styles.modalDescricao}>{propostaSelecionada?.descricao_proposta}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalFechar} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#2670E8' }}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.tituloComIcone}>
        <Octicons name="light-bulb" size={20} color="black" />
        <Text style={styles.tituloTexto}>Propostas Gerais</Text>
      </View>
      <View style={styles.linha} />
      <Text style={{ textAlign: 'center', color: '#999' }}>Nenhuma proposta encontrada.</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  tituloComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tituloTexto: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  pesquisaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  filtroButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linha: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  listaContainer: {
    height: 350,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  publicadoEm: {
    fontSize: 10,
    color: '#2670E8',
    marginBottom: 4,
  },
  tituloCard: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  por: {
    fontSize: 10,
    color: '#000',
  },
  expandButton: {
    padding: 4,
  },
  linhaDentro: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 8,
  },
  descricao: {
    color: '#555',
    lineHeight: 18,
    fontSize: 13,
  },
  avaliacaoTexto: {
    fontSize: 12,
    color: '#000',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  botoesAvaliacao: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  botaoSim: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoNao: {
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoSim: {
    color: '#4CAF50',
    fontSize: 12,
  },
  textoNao: {
    color: '#F44336',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    marginBottom: 4,
  },
  modalOrigem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  modalDescricao: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalFechar: {
    marginTop: 16,
    alignItems: 'center',
  },
});
