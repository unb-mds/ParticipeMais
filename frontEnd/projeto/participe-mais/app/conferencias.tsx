import React, { useState,useRef  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configurando o calendário para português
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';
const eixosFromBackend = [
  {
    titulo: 'I – Mitigação',
    descricao:
      'Exploração de estratégias e políticas para reduzir as emissões de gases de efeito estufa, promovendo práticas sustentáveis e inovadoras em diversos setores.',
  },
  {
    titulo: 'II – Adaptação',
    descricao:
      'Fortalecimento da resiliência e capacidade de adaptação aos impactos das mudanças climáticas.',
  },
  {
    titulo: 'III – Financiamento',
    descricao:
      'Mobilização de recursos financeiros públicos e privados para ações climáticas.',
  },
  {
    titulo: 'IV – Governança',
    descricao:
      'Promoção de uma governança climática efetiva e participativa.',
  },
];

const etapasFromBackend = [
  { nome: 'Etapa Digital', data: '2025-05-07', ativo: true },
  { nome: 'Etapa Digital', data: '2025-05-07', ativo: true },
  { nome: 'Etapa Digital', data: '2025-05-07', ativo: true },
  { nome: 'Conferências Municipais ou Intermunicipais', data: '2025-01-26', ativo: true },
  { nome: 'Conferências Estaduais e Distrital', data: '2025-03-15', ativo: false },
  { nome: 'Etapa Nacional', data: '2025-05-09', ativo: true },
  { nome: 'Conferências Estaduais e Distrital', data: '2025-03-15', ativo: false },
  { nome: 'Conferências Estaduais e Distrital', data: '2025-03-15', ativo: false },
];
const { width } = Dimensions.get('window');

export default function ConferenciaDetalhadaScreen() {
  const scrollRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();
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
    <SafeAreaView style={styles.container_total}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conferências</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Status */}
        <View style={styles.statusContainer}>
          <AntDesign name="checkcircleo" size={14} color="#4CAF50" />
          <Text style={styles.status}>Ativo</Text>
        </View>

        <Text style={styles.title}>5ª Conferência Nacional do Meio Ambiente</Text>

        <View style={styles.subinfo}>
          <Entypo name="location" size={14} />
          <Text style={styles.subinfoText}>1527 conferências</Text>
          <MaterialCommunityIcons name="file-document-outline" size={14} />
          <Text style={styles.subinfoText}>10794 propostas</Text>
        </View>

        <Text style={styles.description}>
          A emergência climática que vivemos, com eventos extremos cada vez mais frequentes e intensos, é o tema da 5ª Conferência Nacional do Meio Ambiente. Vamos debater a emergência climática junto com o desafio da transformação ecológica: como transitamos para um Brasil mais resiliente, menos vulnerável às mudanças climáticas e reduzimos as emissões de gases de efeito estufa, causadores do aquecimento global. Esta 5ª CNMA marca a retomada da governança participativa, depois de onze anos da última Conferência. Os debates em todo o país vão até maio.
        </Text>

        {/* Card de Etapas */}
      <View style={styles.card}>
        <TouchableOpacity onPress={toggleEtapas} style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={18} />
          <Text style={styles.cardHeaderText}>Calendário de Etapas</Text>
          <Ionicons name={etapasAberto ? 'chevron-up' : 'chevron-down'} size={20} />
        </TouchableOpacity>

        {etapasAberto && (
          <View
            style={{
              maxHeight: etapasFromBackend.length > 4 ? 320 : 'auto',
              minHeight: etapasFromBackend.length < 4 ? 320 : 'auto',
            }}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={etapasFromBackend.length > 4}
              scrollEnabled={etapasFromBackend.length > 4}
            >
              <View style={styles.etapas}>
                {etapasFromBackend.map((etapa, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={!etapa.ativo}
                    onPress={() => etapa.ativo && handleOpenCalendar(etapa.data)}
                    style={[
                      styles.etapaItem,
                      etapa.ativo && styles.etapaAtiva,
                    ]}
                  >
                    <View style={styles.etapaIcon}>
                      {etapa.ativo ? (
                        <Ionicons name="checkmark-circle" size={18} color="#2670E8" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={18} color="#555" />
                      )}
                    </View>
                    <View>
                      <Text style={[
                        styles.etapaTitulo,
                        etapa.ativo && { color: '#2670E8' }
                      ]}>
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
      </View>
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
      {/* Eixos Temáticos */}
      {/* Título com foguete antes dos Eixos Temáticos */}
      <View style={styles.tituloComIcone}>
        <Ionicons name="rocket-outline" size={20} color="#000" />
        <Text style={styles.tituloTexto}>Eixos Temáticos</Text>
      </View>


          <View style={styles.cardAzul}>
      <Text style={styles.cardHeaderTextBranco}>Eixos Temáticos</Text>

        <FlatList
        data={eixosFromBackend}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        snapToInterval={width - 32}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const slide = Math.round(
            e.nativeEvent.contentOffset.x / (width - 32)
          );
          setCurrentIndex(slide);
        }}
        renderItem={({ item }) => (
          <View style={{ width: width - 32 }}>
            <View style={styles.eixoCard}>
              <Text style={styles.eixoTitulo}>{item.titulo}</Text>
              <Text style={styles.eixoDescricao}>{item.descricao}</Text>
            </View>
          </View>
        )}
      />


      <View style={styles.pagination}>
        {eixosFromBackend.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              scrollRef.current?.scrollToOffset({
                offset: index * (width - 32),
                animated: true,
              });
            }}
            style={[
              styles.dot,
              currentIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>


        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_total: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'Raleway-Bold',
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginBottom: 10,
  },
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ccf5d4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  status: {
    color: '#4CAF50',
    fontSize: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    marginBottom: 8,
  },
  subinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  subinfoText: {
    fontSize: 12,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
    marginTop: 10,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etapaIcon: {},
  etapaInfo: {},
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
cardAzul: {
  backgroundColor: '#2670E8',
  borderRadius: 20,
  padding: 16, // ✅ padding só aqui controla margem interna geral
  marginBottom: 20,
},

cardHeaderTextBranco: {
  fontSize: 16,
  fontFamily: 'Raleway-Bold',
  color: '#fff',
  marginBottom: 12,
},

eixoCard: {
  backgroundColor: '#2670E8',
  borderRadius: 12,
  padding: 16, // ✅ padding interno do card
  justifyContent: 'center',
},

eixoTitulo: {
  backgroundColor: '#fff',
  color: '#2670E8',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  alignSelf: 'flex-start',
  fontSize: 16,
  fontFamily: 'Raleway-Bold',
  marginBottom: 8,
  maxWidth: '100%', // ✅ garante que não ultrapasse
},

eixoDescricao: {
  color: '#fff',
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Raleway-Regular',
  maxWidth: '100%', // ✅ garante que não ultrapasse
},

pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 8,
  gap: 6,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.4)',
},

dotActive: {
  backgroundColor: '#fff',
  width: 16,
},
tituloComIcone: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
},

tituloTexto: {
  fontSize: 18,
  fontFamily: 'Raleway-Bold',
  color: '#000',
},

});
