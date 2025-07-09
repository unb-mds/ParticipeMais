import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Propostas from './propostas_gerais';
import { Etapas, Proposta } from '../../app/conferencias';

type Props = {
  visible: boolean;
  onClose: () => void;
  etapa: Etapas | null;    // vai receber uma ETAPA selecionada
  propostas: Proposta[];
};

export default function ConferenciaModal({
  visible,
  onClose,
  etapa,
  propostas,
}: Props) {
  if (!etapa) return null;

const propostasFiltradas = propostas.filter(
  (proposta) => proposta.etapa === etapa.id
);


  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose} />

        <View style={styles.bottomSheet}>
          <View style={styles.modalHeader} />

          <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Text style={styles.modalTitulo}>{etapa.descricao_etapa}</Text>

            <View style={styles.modalInfoHeader}>
              <View style={styles.modalInfoLocal}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={14}
                  color="#2670E8"
                />
                <Text style={styles.modalInfoLocalText}>{etapa.id}</Text>
              </View>

              <View style={styles.modalTagsContainer}>
                <View style={styles.modalTagStatus}>
                  <Text style={styles.modalTagText}>{etapa.status}</Text>
                </View>
                <View style={styles.modalTagModalidade}>
                  <Text style={styles.modalTagText}>{etapa.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalLinhaSeparadora} />

            <Text style={styles.modalDescricao}>{etapa.descricao_etapa}</Text>

            {/* Visão Geral */}
            <Text style={styles.modalSectionTitleOutside}>
              <Ionicons name="trending-up-outline" size={20} color="#000" /> Visão Geral
            </Text>

            <View style={styles.modalVisaoGeralContainer}>
              <View style={styles.modalVisaoItem}>
                <View style={styles.modalVisaoLabel}>
                  <Ionicons name="people-outline" size={18} color="#000" />
                  <Text style={styles.modalVisaoTexto}>Inscritos</Text>
                </View>
                <Text style={styles.modalVisaoNumero}>30</Text>
              </View>

              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={28}
                color="#aaa"
              />

              <View style={styles.modalVisaoItem}>
                <View style={styles.modalVisaoLabel}>
                  <Ionicons name="document-text-outline" size={18} color="#000" />
                  <Text style={styles.modalVisaoTexto}>Propostas</Text>
                </View>
                <Text style={styles.modalVisaoNumero}>{propostasFiltradas.length}</Text>
              </View>
            </View>

            {/* Objetivo Geral */}
            <View style={styles.modalSection}>
              <View style={styles.modalSectionHeader}>
                <Feather name="target" size={16} color="black" />
                <Text style={styles.modalSectionTitle}>Objetivo Geral</Text>
              </View>
              <Text style={styles.modalDescricao}>
                Este é o objetivo geral da conferência. Aqui você pode colocar qualquer texto específico para o objetivo, separado da descrição inicial.
              </Text>
            </View>

            {/* Período de Inscrição */}
            <View style={styles.periodoContainer}>
              <View style={styles.periodoHeader}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={styles.periodoTitulo}>Período de Inscrição</Text>
              </View>

              <View style={styles.periodoConteudo}>
                <View style={styles.periodoLinha}>
                  <View style={styles.periodoItem}>
                    <Ionicons name="flag-outline" size={14} color="#fff" />
                    <Text style={styles.periodoItemText}>Início</Text>
                  </View>

                  <MaterialCommunityIcons name="walk" size={14} color="#fff" />

                  <View style={styles.periodoItem}>
                    <Text style={styles.periodoItemText}>Fim</Text>
                    <Ionicons name="flag-outline" size={14} color="#fff" />
                  </View>
                </View>

                <View style={styles.periodoLinha}>
                  <Text style={styles.periodoDataText}>13/02/2025</Text>
                  <Text style={styles.periodoDataText}>13/03/2025</Text>
                </View>
              </View>
            </View>


            {/* Propostas associadas */}  
            <Propostas propostas={propostasFiltradas} />

            {/* Link de acesso */}
            <View style={styles.linkContainer}>
              <View style={styles.linkHeader}>
                <Ionicons name="link-outline" size={16} color="#000" />
                <Text style={styles.linkTitle}>Link de acesso</Text>
              </View>
              <Text style={styles.linkDescricao}>
                Para mais detalhes e acesso direto às propostas, acesse diretamente o site do Brasil Participativo.
              </Text>
              <Pressable
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://brasilparticipativo.gov.br')}
              >
                <Text style={styles.linkButtonText}>Acesso ao site Brasil Participativo</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTitulo: {
    fontSize: 25,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginBottom: 8,
  },
  modalInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalInfoLocal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalInfoLocalText: {
    fontSize: 12,
    color: '#2670E8',
    fontFamily: 'Raleway-Bold',
  },
  modalTagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modalTagStatus: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalTagModalidade: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalTagText: {
    fontSize: 12,
    color: '#333',
  },
  modalLinhaSeparadora: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  modalDescricao: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalSectionTitleOutside: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginBottom: 12,
  },
  modalVisaoGeralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 24,
    marginBottom: 24,
  },
  modalVisaoItem: {
    alignItems: 'center',
    gap: 6,
  },
  modalVisaoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalVisaoTexto: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  modalVisaoNumero: {
    fontSize: 60,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  modalSection: {
    gap: 8,
    marginBottom: 16,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalSectionTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#000',
  },
  periodoContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    marginBottom: 5,
  },
  periodoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodoTitulo: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },
  periodoConteudo: {
    padding: 16,
    gap: 12,
  },
  periodoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodoItemText: {
    color: '#fff',
    fontSize: 12,
  },
  periodoDataText: {
    color: '#fff',
    fontSize: 12,
  },
  linkContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  linkTitle: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  linkDescricao: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
    lineHeight: 18,
  },
  linkButton: {
    borderWidth: 1,
    borderColor: '#2670E8',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  linkButtonText: {
    color: '#2670E8',
    fontFamily: 'Raleway-Bold',
    fontSize: 13,
  },
});
