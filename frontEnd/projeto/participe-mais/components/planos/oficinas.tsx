import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import OficinaModal from './oficinamodal';

type Oficina = {
  id: number;
  cidade: string;
  estado: string;
  dataInicio: string;
  dataTermino: string;
  status: 'Ativa' | 'Encerrada';
  modalidade: 'Presencial' | 'Online';
};

type Proposta = {
  id: number;
  eixo: string;
  publicadoEm: string;
  usuario: string;
  descricao: string;
};

export default function Oficinas({
  oficinas,
  propostas,
}: {
  oficinas: Oficina[];
  propostas: Proposta[];
}) {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [oficinaSelecionada, setOficinaSelecionada] = useState<Oficina | null>(null);

  const abrirModal = (item: Oficina) => {
    setOficinaSelecionada(item);
    setModalVisible(true);
  };

  const oficinasFiltradas = oficinas.filter(
    (item) =>
      item.cidade.toLowerCase().includes(search.toLowerCase()) ||
      item.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Octicons name="location" size={24} color="black" />
        <Text style={styles.tituloTexto}>Oficinas</Text>
      </View>

      {/* Search + Filtro */}
      <View style={styles.pesquisaContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#000" />
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

      {/* Linha de separação */}
      <View style={styles.linha} />

      {/* Lista */}
      <View style={styles.listaContainer}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        >
          {oficinasFiltradas.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => abrirModal(item)}
              activeOpacity={0.8}
            >
              {/* Header com título e seta */}
              <View style={styles.headerCard}>
                <Text style={styles.tituloCard}>
                  {item.cidade} - {item.estado}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#000" />
              </View>

              {/* Datas */}
              <View style={styles.datasContainer}>
                <Ionicons name="calendar-outline" size={14} color="#2670E8" />
                <Text style={styles.datasTexto}>
                  {item.dataInicio} ➝ {item.dataTermino}
                </Text>
              </View>

              {/* Tags */}
              <View style={styles.tags}>
                <View style={[styles.tagStatus, { backgroundColor: '#E0E0E0' }]}>
                  <Text style={styles.tagText}>{item.status}</Text>
                </View>
                <View
                  style={[
                    styles.tagModalidade,
                    {
                      backgroundColor:
                        item.modalidade === 'Presencial' ? '#FFA726' : '#E0E0E0',
                    },
                  ]}
                >
                  <Text style={styles.tagText}>{item.modalidade}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <OficinaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        oficina={oficinaSelecionada}
        propostas={propostas} // 🔥 Passando propostas para o modal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
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
    height: 300,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloCard: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#000',
  },
  datasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  datasTexto: {
    fontSize: 12,
    color: '#2670E8',
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  tagStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagModalidade: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
});
