import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const Largura = width * 1;

const gerarSemanaAtual = () => {
  const hoje = new Date();
  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const semanaFutura = Array.from({ length: 7 }).map((_, i) => {
    const data = new Date();
    data.setDate(hoje.getDate() + i);

    return {
      diaSemana: nomesDias[data.getDay()],
      dia: data.getDate().toString(),
      dataCompleta: data.toISOString().split('T')[0], // yyyy-mm-dd
    };
  });

  return semanaFutura;
};
const formatarDataExtenso = (data: string | null | undefined) => {
  if (!data || !data.includes('-')) return '';

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const [ano, mes, dia] = data.split('-');
  const mesIndex = parseInt(mes, 10) - 1;
  const nomeMes = meses[mesIndex];

  if (isNaN(parseInt(dia)) || !nomeMes || isNaN(parseInt(ano))) {
    return '';
  }

  return `${parseInt(dia, 10)} de ${nomeMes} de ${ano}`;
};



export default function Agenda() {
  const router = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState('');
  const [marcacoes, setMarcacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    buscarMarcacoes();
  }, []);
  
useEffect(() => {
  const semana = gerarSemanaAtual();
  setDiasSemana(semana);
  if (semana.length > 0) {
    setDiaSelecionado(semana[0].dataCompleta); // dia de hoje
  }
  buscarMarcacoes();
}, []);

  const buscarMarcacoes = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setMensagem('Você não está autenticado.');
        setMarcacoes([]);
        return;
      }

      const response = await fetch('http://localhost:8000/agenda/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Resposta /agenda status:', response.status);
      console.log('Dados da agenda:', data);

      if (Array.isArray(data) && data.length > 0) {
        setMarcacoes(data);
        setMensagem('');
      } else {
        setMarcacoes([]);
        setMensagem('Nenhuma marcação salva.');
      }
    } catch (error) {
      console.error('Erro ao buscar marcações:', error);
      setMensagem('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  const adicionarEvento = async () => {
  if (!titulo || !dia || !mes || !ano) {
    alert('Preencha todos os campos.');
    return;
  }

  const diaNum = parseInt(dia);
  const mesNum = parseInt(mes);
  const anoNum = parseInt(ano);

  const dataFormatada = `${anoNum}-${mesNum.toString().padStart(2, '0')}-${diaNum.toString().padStart(2, '0')}`;

  const dataCriada = new Date(`${dataFormatada}T00:00:00`);

  if (isNaN(dataCriada.getTime())) {
    alert('Data inválida.');
    return;
  }

  const agora = new Date();
  if (dataCriada < agora) {
    alert('A data deve ser no futuro.');
    return;
  }

  const novoCompromisso = {
    nome_compromisso: titulo,
    data_compromisso: dataFormatada,
    agendado: true,
  };

  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      alert('Você não está autenticado.');
      return;
    }

    const response = await fetch('http://localhost:8081/agenda/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(novoCompromisso),
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar: ${response.status}`);
    }

    // Sucesso
    setTitulo('');
    setDia('');
    setMes('');
    setAno('');
    setModalVisible(false);
    buscarMarcacoes(); // atualiza lista
  } catch (error) {
    console.error('Erro ao adicionar compromisso:', error);
    alert('Erro ao adicionar o compromisso. Tente novamente.');
  }
};


const renderMarcacao = ({ item }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardData}>{item.data_compromisso}</Text>
    <Text style={styles.cardTexto}>◦ {item.nome_compromisso}</Text>
  </View>
);


const [diasSemana, setDiasSemana] = useState<any[]>([]);

  return (
    <View style={styles.container_total}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
        <Pressable style={styles.plusButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.line} />

      <View style={styles.container}>
        <Text style={styles.dataTexto}>
          {formatarDataExtenso(diaSelecionado)}
        </Text>

        <Text style={styles.hojeTexto}>Hoje</Text>

        {/* Dias da semana */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendario}>
          {diasSemana.map((dia) => (
            <Pressable
              key={dia.dia}
              style={[styles.diaItem, dia.dia === diaSelecionado && styles.diaSelecionado]}
              onPress={() => setDiaSelecionado(dia.dia)}
            >
              <Text style={styles.diaSemana}>{dia.diaSemana}</Text>
              <Text style={styles.diaNumero}>{dia.dia}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.marcacoesTitulo}>Marcações</Text>

        {loading ? (
          <Text>Carregando...</Text>
        ) : mensagem ? (
          <Text>{mensagem}</Text>
        ) : (
          <FlatList
            data={marcacoes}
            keyExtractor={(item) => item.id}
            renderItem={renderMarcacao}
            showsVerticalScrollIndicator={false}
          />
        )}

      </View>

      {/* Modal para adicionar evento */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitulo}>Novo Evento</Text>
                <TextInput
                  placeholder="Título"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={titulo}
                  onChangeText={setTitulo}
                />
                <View style={styles.dataRow}>
                  <TextInput
                    placeholder="Dia"
                    placeholderTextColor="#999"
                    style={styles.dataInput}
                    keyboardType="numeric"
                    value={dia}
                    onChangeText={setDia}
                  />
                  <TextInput
                    placeholder="Mês"
                    placeholderTextColor="#999"
                    style={styles.dataInput}
                    keyboardType="numeric"
                    value={mes}
                    onChangeText={setMes}
                  />
                  <TextInput
                    placeholder="Ano"
                    placeholderTextColor="#999"
                    style={styles.dataInput}
                    keyboardType="numeric"
                    value={ano}
                    onChangeText={setAno}
                  />
                </View>
                <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarEvento}>
                  <Text style={styles.botaoTexto}>Adicionar novo evento</Text>
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
  container_total: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#2670E8',
    padding: 6,
    borderRadius: 20,
  },
  line: {
    width: Largura,
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 10,
  },
  dataTexto: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
  hojeTexto: {
    fontSize: 32,
    fontFamily: 'Raleway-Bold',
    marginTop: 4,
    marginBottom: 25,
  },
  calendario: {
    flexGrow: 0,
  },
  diaItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  diaSelecionado: {
    backgroundColor: '#2670E8',
  },
  diaSemana: {
    color: '#000',
    fontSize: 14,
  },
  diaNumero: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  marcacoesTitulo: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardData: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 14,
    color: '#333',
  },
  verMais: {
    color: '#2670E8',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Raleway-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dataInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  botaoAdicionar: {
    backgroundColor: '#2670E8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
  },
});
