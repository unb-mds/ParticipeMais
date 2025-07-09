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
import { Oficinas, Proposta } from '../../app/planos';

export default function Oficina({
  oficinas,
  propostas,
}: {
  oficinas: Oficinas[];
  propostas: Proposta[];
}) {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [oficinaSelecionada, setOficinaSelecionada] = useState<Oficinas | null>(null);

  const abrirModal = (item: Oficinas) => {
    setOficinaSelecionada(item);
    setModalVisible(true);
  };

  const oficinasFiltradas = oficinas.filter((item) => {
    const regiao = item.regiao_oficina ?? '';
    return regiao.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Octicons name="location" size={24} color="black" />
        <Text style={styles.tituloTexto}>Oficinas</Text>
      </View>



      {oficinasFiltradas.length === 0 ? (
          <>
          {/* Linha de separação */}
          <View style={styles.linha} />
          
          <Text style={{ textAlign: 'center', color: '#999' }}>
            Nenhuma oficina encontrada.
          </Text>
            
          </>
          
      ) : (
        
        <View style={styles.listaContainer}>
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

          <View style={styles.linha} />

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
                    {item.titulo_oficina || 'Oficina sem título'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#000" />
                </View>

                {/* Datas */}
                <View style={styles.datasContainer}>
                  <Ionicons name="calendar-outline" size={14} color="#2670E8" />
                  <Text style={styles.datasTexto}>
                    {/* {item.dataInicio} ➝ {item.dataTermino} */}
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
      )}

      {/* Modal */}
      <OficinaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        oficina={oficinaSelecionada}
        propostas={propostas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 7,
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
    maxHeight: 300,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
