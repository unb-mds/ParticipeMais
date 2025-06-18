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
  status: string;
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

  const [mostrarMaisEtapas, setMostrarMaisEtapas] = useState(false);
  const [mostrarMaisPropostas, setMostrarMaisPropostas] = useState(false);

  useEffect(() => {
    const obterToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('accessToken');
        if (tokenSalvo) {
          setToken(tokenSalvo);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    };
    obterToken();
  }, []);

  useEffect(() => {
    if (token && id) {
      fetchConferencias();
    }
  }, [token, id]);

  const fetchConferencias = async () => {
    try {
      const response = await fetch(`http://172.20.10.9:8000/conferencias/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        setConferencias(data.conferencias);
        setEtapas(data.etapas);
        setPropostas(data.propostas);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    }
  };

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };

  if (!conferencias) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Status e título */}
      <Text style={styles.status}>🟢 {conferencias.status ? 'Ativo' : 'Inativo'}</Text>
      <Text style={styles.title}>{conferencias.titulo}</Text>
      <Text style={styles.subinfo}>📅 {etapas.length} conferências   📄 {propostas.length} propostas</Text>

      <Text style={styles.description}>
        {conferencias.descricao?.trim() || 'Descrição não informada'}
      </Text>

      {/* Calendário */}
      <TouchableOpacity onPress={() => toggleSection(setCalendarioAberto, calendarioAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🗓️ Calendário de Etapas</Text>
        <Ionicons name={calendarioAberto ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>
      {calendarioAberto && (
        <View style={styles.card}>
          {JSON.parse(conferencias.data_subconferencia.replace(/'/g, '"')).map((texto: string, i: number) => (
            <Text key={i} style={styles.item}>🟢 {texto}</Text>
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

      {/* Etapas */}
      <Text style={styles.sectionTitle}>📍 Conferências Gerais</Text>
      <TextInput placeholder="🔍 Buscar..." style={styles.input} />
      <Text style={styles.filterText}>Data: todos  |  Região: todos  |  Tipo: todos</Text>

      {/* Etapas */}
      <Text style={styles.sectionTitle}>📍 Conferências Gerais</Text>
      <TextInput placeholder="🔍 Buscar..." style={styles.input} />
      <Text style={styles.filterText}>Data: todos  |  Região: todos  |  Tipo: todos</Text>

      {(mostrarMaisEtapas ? etapas : etapas.slice(0, 3)).map((etapa, i) => (
        <View key={`etapa-${i}`} style={styles.card}>
          <Text style={styles.itemTitle}>{etapa.titulo_etapa}</Text>
          <Text style={styles.itemDesc}>{etapa.descricao_etapa}</Text>
          <Text style={styles.itemTag}>{etapa.status}</Text>
        </View>
      ))}

      {etapas.length > 3 && (
        <TouchableOpacity onPress={() => setMostrarMaisEtapas(!mostrarMaisEtapas)}>
          <Text style={styles.link}>{mostrarMaisEtapas ? 'Ver menos -' : 'Ver mais +'}</Text>
        </TouchableOpacity>
      )}

      {/* Dados Etapas */}
      <TouchableOpacity onPress={() => toggleSection(setDadosConferenciasAberto, dadosConferenciasAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 DADOS - Conferências Gerais</Text>
        <Ionicons name={dadosConferenciasAberto ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>
      {dadosConferenciasAberto && (
        <View style={styles.card}>
          <Text style={styles.item}>✅ 87% Em andamento</Text>
          <Text style={styles.item}>🟡 23% Encerradas</Text>
        </View>
      )}

      {/* Propostas */}
      <Text style={styles.sectionTitle}>📍 Propostas gerais</Text>
      <TextInput placeholder="🔍 Buscar..." style={styles.input} />
      <Text style={styles.filterText}>Data: todos  |  Região: todos  |  Eixo: todos</Text>

      {(mostrarMaisPropostas ? propostas : propostas.slice(0, 3)).map((proposta, i) => (
        <View key={`proposta-${i}`} style={styles.card}>
          <Text style={styles.itemSubtitle}>Publicado em 05/12/2024</Text>
          <Text style={styles.itemTitle}>{proposta.titulo_proposta}</Text>
          <Text style={styles.itemDesc}>{proposta.descricao_proposta}</Text>
          <Text style={styles.itemTag}>Por {proposta.autor}</Text>
        </View>
      ))}

      {propostas.length > 3 && (
        <TouchableOpacity onPress={() => setMostrarMaisPropostas(!mostrarMaisPropostas)}>
          <Text style={styles.link}>{mostrarMaisPropostas ? 'Ver menos -' : 'Ver mais +'}</Text>
        </TouchableOpacity>
      )}

      {/* Dados Propostas */}
      <TouchableOpacity onPress={() => toggleSection(setDadosPropostasAberto, dadosPropostasAberto)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 DADOS - Propostas Gerais</Text>
        <Ionicons name={dadosPropostasAberto ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>
      {dadosPropostasAberto && (
        <View style={styles.card}>
          <Text style={styles.item}>🟥 24% Eixo 1</Text>
          <Text style={styles.item}>🟦 13% Eixo 2</Text>
          <Text style={styles.item}>🟨 33% Eixo 3</Text>
          <Text style={styles.item}>🟩 10% Eixo 4</Text>
          <Text style={styles.item}>🟪 10% Eixo 5</Text>
          <Text style={styles.itemSubtitle}>Total: {propostas.length} propostas</Text>
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
