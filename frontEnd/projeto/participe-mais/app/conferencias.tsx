import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ConferenciaDetalhadaScreen() {
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [dadosConferenciasAberto, setDadosConferenciasAberto] = useState(false);
  const [dadosPropostasAberto, setDadosPropostasAberto] = useState(false);

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.status}>🟢 Ativo</Text>
      <Text style={styles.title}>5ª Conferência Nacional do Meio Ambiente</Text>
      <Text style={styles.subinfo}>📅 1527 conferências   📄 10794 propostas</Text>

      <Text style={styles.description}>
        A emergência climática que vivemos, com eventos extremos cada vez mais frequentes e intensos, é o tema da 5ª Conferência Nacional do Meio Ambiente. Vamos debater a emergência climática junto com o desafio da transformação ecológica: como transitamos para um Brasil mais resiliente, menos vulnerável às mudanças climáticas e reduzimos as emissões de gases de efeito estufa, causadores do aquecimento global. Esta 5ª CNMA marca a retomada da governança participativa, depois de onze anos da última Conferência. Os debates em todo o país vão até maio.
      </Text>

      {/* Calendário de Etapas */}
      <TouchableOpacity onPress={() => toggleSection(setCalendarioAberto, calendarioAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🗓️ Calendário de Etapas</Text>
        <Ionicons name={calendarioAberto ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
      </TouchableOpacity>
      {calendarioAberto && (
        <View style={styles.card}>
         <Text style={styles.item}>
          ✅ Etapa Digital{'\n'}Até 7 de maio de 2025
        </Text>

          <Text style={styles.item}>🟢 Conferências Municipais ou Intermunicipais\nAté 26 de janeiro de 2025</Text>
          <Text style={styles.item}>📌 Conferências Estaduais e Distrital\n5 de janeiro a 15 de março de 2025</Text>
          <Text style={styles.item}>📍 Etapa Nacional\n06 a 09 de maio de 2025</Text>
        </View>
      )}

      {/* Eixos Temáticos */}
      <Text style={styles.sectionTitle}>📎 Eixos Temáticos</Text>
      <View style={styles.blueCard}>
        <Text style={styles.blueCardTitle}>Eixos Temáticos</Text>
        <Text style={styles.blueCardSubtitle}>– 1. Mitigação:</Text>
        <Text style={styles.blueCardText}>
          "Exploração de estratégias e políticas para reduzir as emissões de gases de efeito estufa, promovendo práticas sustentáveis e inovadoras em diversos setores."
        </Text>
      </View>

      {/* Conferências Gerais */}
      <Text style={styles.sectionTitle}>📍 Conferências Gerais</Text>
      <TextInput placeholder="🔍 Buscar..." style={styles.input} />
      <Text style={styles.filterText}>Data: todos  |  Região: todos  |  Tipo: todos</Text>
      <View style={styles.card}>
        <Text style={styles.itemTitle}>01ª Conferência Intermunicipal de Jaguaré e Alto Rio Novo/ES</Text>
        <Text style={styles.itemDesc}>A 1ª Conferência Intermunicipal de Jaguaré, em conjunto com o município de Alto Rio Novo/ES, terá como tema central...</Text>
        <Text style={styles.itemTag}>🟡 Encerrada</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.itemTitle}>01ª Conferência Intermunicipal de Meio Ambiente de Alto Rio</Text>
        <Text style={styles.itemDesc}>A 1ª Conferência Intermunicipal de Jaguaré, em conjunto com o município de Alto Rio Novo/ES, terá como tema central...</Text>
        <Text style={styles.itemTag}>🟡 Encerrada</Text>
      </View>
      <Text style={styles.link}>Ver mais +</Text>

      {/* Dados estatísticos - Conferências Gerais */}
      <TouchableOpacity onPress={() => toggleSection(setDadosConferenciasAberto, dadosConferenciasAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 DADOS - Conferências Gerais</Text>
        <Ionicons name={dadosConferenciasAberto ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
      </TouchableOpacity>
      {dadosConferenciasAberto && (
        <View style={styles.card}>
          <Text style={styles.item}>✅ 87% Em andamento</Text>
          <Text style={styles.item}>🟡 23% Encerradas</Text>
        </View>
      )}

      {/* Propostas Gerais */}
      <Text style={styles.sectionTitle}>📍 Propostas gerais</Text>
      <TextInput placeholder="🔍 Buscar..." style={styles.input} />
      <Text style={styles.filterText}>Data: todos  |  Região: todos  |  Eixo: todos</Text>

      <View style={styles.card}>
        <Text style={styles.itemSubtitle}>Publicado em 05/12/2024</Text>
        <Text style={styles.itemTitle}>Eixo 3 - Justiça Social: Participação Popular.</Text>
        <Text style={styles.itemDesc}>Ampliar a participação popular por meio do fortalecimento e controle.</Text>
        <Text style={styles.itemTag}>Por NONCA</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.itemSubtitle}>Publicado em 08/12/2024</Text>
        <Text style={styles.itemTitle}>Eixo 1 - Mitigação: Garantia de Planos Municipais de Conservação e Recuperação da Mata Atlântica.</Text>
        <Text style={styles.itemDesc}>Garantir a elaboração dos Planos Municipais de Conservação e Recuperação da Mata Atlântica.</Text>
        <Text style={styles.itemTag}>Por Rafael</Text>
      </View>

      {/* Dados estatísticos - Propostas Gerais */}
      <TouchableOpacity onPress={() => toggleSection(setDadosPropostasAberto, dadosPropostasAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 DADOS - Propostas Gerais</Text>
        <Ionicons name={dadosPropostasAberto ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
      </TouchableOpacity>
      {dadosPropostasAberto && (
        <View style={styles.card}>
          <Text style={styles.item}>🟥 24% Eixo 1</Text>
          <Text style={styles.item}>🟦 13% Eixo 2</Text>
          <Text style={styles.item}>🟨 33% Eixo 3</Text>
          <Text style={styles.item}>🟩 10% Eixo 4</Text>
          <Text style={styles.item}>🟪 10% Eixo 5</Text>
          <Text style={styles.itemSubtitle}>Total: 10794 propostas</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  status: {
    backgroundColor: '#ccf5d4',
    padding: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Raleway_700Bold',
  },
  subinfo: {
    fontSize: 12,
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Raleway_400Regular',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Raleway_700Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  item: {
    marginBottom: 6,
    color: '#333',
    fontFamily: 'Raleway_400Regular',
  },
  itemSelected: {
    marginBottom: 6,
    color: '#267DFF',
    fontFamily: 'Raleway_700Bold',
  },
  itemTitle: {
    fontSize: 14,
    marginBottom: 2,
    fontFamily: 'Raleway_700Bold',
  },
  itemDesc: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Raleway_400Regular',
  },
  itemTag: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Raleway_400Regular',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
    fontFamily: 'Raleway_400Regular',
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    fontFamily: 'Raleway_400Regular',
  },
  filterText: {
    fontSize: 12,
    marginBottom: 8,
    color: '#666',
    fontFamily: 'Raleway_400Regular',
  },
  link: {
    color: '#267DFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Raleway_400Regular',
  },
  blueCard: {
    backgroundColor: '#267DFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  blueCardTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
  blueCardSubtitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway_700Bold',
  },
  blueCardText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Raleway_400Regular',
  },
});
