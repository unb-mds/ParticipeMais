import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Octicons,Feather } from '@expo/vector-icons';
import ConferenciaModal from './conferenciamodal';
import { Conferencia, Etapas, Proposta } from '../../app/conferencias';

interface ConferenciasProps {
  etapas: Etapas[];
  conferencias: Conferencia[];
  propostas: Proposta[]; 
}

export default function Conferencias({ etapas, conferencias, propostas }: ConferenciasProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [etapaSelecionada, setEtapaSelecionada] = useState<Etapas | null>(null);
  const [search, setSearch] = useState('');
  const [expandido, setExpandido] = useState<number | null>(null);

  const abrirModal = (item: Etapas) => {
    setEtapaSelecionada(item);
    setModalVisible(true);
  };

  const conferenciasFiltradas = etapas.filter((item) =>
    item.titulo_etapa.includes(search)
  );

  return (
<>
  {conferenciasFiltradas.length > 0 ? (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Octicons name="location" size={24} color="black" />
        <Text style={styles.tituloTexto}>Conferências Gerais</Text>
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

      {/* Lista com altura fixa e scroll interno */}
      <View style={styles.listaContainer}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        >
            <View>
              {conferenciasFiltradas.map((item) => {
                const estaExpandido = expandido === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => {
                      if (estaExpandido) abrirModal(item);
                    }}
                    style={styles.card}
                  >
                    <View style={styles.headerCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tituloCard}>{item.titulo_etapa}</Text>
                        <View style={styles.origemContainer}>
                          <MaterialCommunityIcons
                            name="office-building"
                            size={14}
                            color="#2670E8"
                          />
                          <Text style={styles.origemCard}>{item.titulo_etapa}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => setExpandido(estaExpandido ? null : item.id)}
                        style={styles.expandButton}
                      >
                        <Ionicons
                          name={estaExpandido ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.linhaDentro} />

                    {estaExpandido && (
                      <>
                        <Text style={styles.descricao}>
                          {item.descricao_etapa.length > 90
                            ? item.descricao_etapa.slice(0, 90) + '...'
                            : item.descricao_etapa}
                        </Text>

                        <View style={styles.tags}>
                          <View style={styles.tagStatus}>
                            <Text style={styles.tagText}>
                              {item.status ? 'Ativa' : 'Inativa'}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
        </ScrollView>

      </View>

      <ConferenciaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        etapa={etapaSelecionada}
        propostas={propostas}
      />
    </View>
  ) : (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Octicons name="location" size={24} color="black" />
        <Text style={styles.tituloTexto}>Conferências Gerais</Text>
      </View>
      
      <View style={styles.linha} />

      <Text style={{ textAlign: 'center', color: '#999' }}>
        Não há conferências disponíveis no momento.
      </Text>
    </View>
  )}
</>
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
  linhaDentro: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 8,
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
  expandButton: {
    padding: 4,
  },
  tituloCard: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  origemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  origemCard: {
    fontSize: 12,
    color: '#2670E8',
  },
  descricao: {
    color: '#555',
    lineHeight: 18,
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  tagStatus: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagModalidade: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
});
