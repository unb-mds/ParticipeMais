import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 🔗 Configurando calendário em português
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

const { width } = Dimensions.get('window');

type Etapa = {
  nome: string;
  data: string;
  ativo: boolean;
};

export default function EtapasCalendar({ etapas }: { etapas: Etapa[] }) {
  const [etapasAberto, setEtapasAberto] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const toggleEtapas = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEtapasAberto(!etapasAberto);
  };

  const handleOpenCalendar = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleEtapas} style={styles.cardHeader}>
        <Ionicons name="calendar-outline" size={18} />
        <Text style={styles.cardHeaderText}>Calendário de Etapas</Text>
        <Ionicons name={etapasAberto ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>

      {etapasAberto && (
        <View style={{ maxHeight: etapas.length > 4 ? 320 : 'auto' }}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={etapas.length > 4}
          >
            <View style={styles.etapas}>
              {etapas.map((etapa, index) => (
                <TouchableOpacity
                  key={index}
                  disabled={!etapa.ativo}
                  onPress={() => etapa.ativo && handleOpenCalendar(etapa.data)}
                  style={[
                    styles.etapaItem,
                    etapa.ativo && styles.etapaAtiva,
                  ]}
                >
                  <View>
                    {etapa.ativo ? (
                      <Ionicons name="checkmark-circle" size={18} color="#2670E8" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={18} color="#555" />
                    )}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.etapaTitulo,
                        etapa.ativo && { color: '#2670E8' },
                      ]}
                    >
                      {etapa.nome}
                    </Text>
                    <Text style={styles.etapaData}>
                      Até {etapa.data.split('-').reverse().join('/')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Modal com Calendário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#000" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>
                  {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>

                <Calendar
                  current={selectedDate}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      selectedColor: '#2670E8',
                    },
                  }}
                  theme={{
                    selectedDayBackgroundColor: '#2670E8',
                    todayTextColor: '#2670E8',
                  }}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="calendar-outline" size={18} color="#2670E8" />
                  <Text style={styles.buttonText}>Marcar na agenda</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eaeaea',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
  },
  etapas: {
    marginTop: 12,
    gap: 8,
  },
  etapaItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  etapaAtiva: {
    borderColor: '#2670E8',
  },
  etapaTitulo: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#333',
  },
  etapaData: {
    fontSize: 12,
    color: '#666',
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
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2670E8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#2670E8',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },
});
