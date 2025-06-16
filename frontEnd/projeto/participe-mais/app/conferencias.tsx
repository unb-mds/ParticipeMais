import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Ativa animação de layout para Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Conferencias {
  id: number;
  titulo: string;
  descricao: string;
  sobre: string;
  status: boolean;
  data_subconferencia: string;
  qtd_propostas: number;
}

interface Propostas {
  titulo_proposta: string;
  autor: string;
  descricao_proposta: string;
  qtd_votos: number;
}

interface Etapas {
  titulo_etapa: string;
  descricao_etapa: string;
  statusetapa: string;
  regiao_etapa: string;
  duracao_etapa: string;
  qtd_propostas_etapa: number;
  qtd_inscritos_etapa: number;
  propostas_relacionadas: string;
}

export default function ConferenciaDetalhadaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [token, setToken] = useState<string>('');
  const [conferencias, setConferencias] = useState<Conferencias | null>(null);
  const [etapas, setEtapas] = useState<Etapas[]>([]);
  const [propostas, setPropostas] = useState<Propostas[]>([]);

  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [dadosConferenciasAberto, setDadosConferenciasAberto] = useState(false);
  const [dadosPropostasAberto, setDadosPropostasAberto] = useState(false);

  // Recupera token async
  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          console.warn('Token não encontrado');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Erro ao recuperar token:', error);
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  // Busca dados da conferência quando token e id estiverem disponíveis
  useEffect(() => {
    if (token && id) {
      fetchConferencias();
    }
  }, [token, id]);

  const fetchConferencias = async () => {
    try {
      const response = await fetch(`http://localhost:8000/conferencias/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        setConferencias(data.conferencias);
        setPropostas(data.propostas);
        setEtapas(data.etapas);
        
      } else if (response.status === 401 || response.status === 403) {
        router.replace('/login');
      } else {
        console.error('Erro ao buscar conferências:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      router.replace('/login');
    }
  };

  // Função para alternar a abertura das seções com animação
  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };

  // Exibe loading enquanto dados não chegam
  if (!conferencias) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.status}>🟢 {conferencias.status ? 'Ativo' : 'Inativo'}</Text>
      <Text style={styles.title}>{conferencias.titulo}</Text>
      <Text style={styles.subinfo}>📅 {etapas?.length || 0} conferências   📄{propostas?.length} propostas</Text>

      <Text style={styles.description}>
        {conferencias.descricao?.trim() ? conferencias.descricao : 'Não informado'}
      </Text>

      {/* Calendário de Etapas */}
      <TouchableOpacity onPress={() => toggleSection(setCalendarioAberto, calendarioAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🗓️ Calendário de Etapas</Text>
        <Ionicons name={calendarioAberto ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
      </TouchableOpacity>
      {calendarioAberto && (
      <View style={styles.card}>
        {JSON.parse(conferencias.data_subconferencia.replace(/'/g, '"')).map((texto: string, index: number) => (
          <Text key={index} style={styles.item}>
            🟢 {texto}
          </Text>
        ))}
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
