import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

const { width } = Dimensions.get('window');

const Largura = width * 1;

const diasSemana = [
  { diaSemana: 'Seg', dia: '5' },
  { diaSemana: 'Ter', dia: '6' },
  { diaSemana: 'Qua', dia: '7' },
  { diaSemana: 'Qui', dia: '8' },
  { diaSemana: 'Sex', dia: '9' },
  { diaSemana: 'Sáb', dia: '10' },
  { diaSemana: 'Dom', dia: '11' },
];

const initialMarcacoes = [
  {
    id: '1',
    data: '7 de Maio',
    eventos: ['5ª Conferência Nacional do Meio Ambiente', 'Fim da Etapa Digital'],
  },
  {
    id: '2',
    data: '10 de Junho',
    eventos: ['5ª Conferência Nacional do Meio Ambiente', 'Etapa Nacional'],
  },
  {
    id: '3',
    data: '14 de Julho',
    eventos: ['5ª Conferência Nacional do Meio Ambiente', 'Fim da Conferência'],
  },
];

export default function Agenda() {
  const router = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState('5');
  const [marcacoes, setMarcacoes] = useState(initialMarcacoes);

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  const renderMarcacao = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardData}>{item.data}</Text>
      {item.eventos.map((evento: string, index: number) => (
        <Text key={index} style={styles.cardTexto}>
          ◦ {evento}
        </Text>
      ))}
    </View>
  );


const adicionarEvento = () => {
  if (!titulo || !dia || !mes || !ano) return;

  const diaNum = parseInt(dia);
  const mesNum = parseInt(mes) - 1; // meses vão de 0 a 11
  const anoNum = parseInt(ano);

  const dataCriada = new Date(anoNum, mesNum, diaNum);

  if (
    isNaN(dataCriada.getTime()) ||
    dataCriada.getDate() !== diaNum ||
    dataCriada.getMonth() !== mesNum ||
    dataCriada.getFullYear() !== anoNum
  ) {
    alert('Data inválida. Verifique o dia, mês e ano.');
    return;
  }

  const agora = new Date();
  if (dataCriada < agora) {
    alert('A data deve ser no futuro.');
    return;
  }

  const nomeMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const novaMarcacao = {
    id: (marcacoes.length + 1).toString(),
    data: `${diaNum} de ${nomeMeses[mesNum]} de ${anoNum}`,
    eventos: [titulo],
  };

  setMarcacoes([...marcacoes, novaMarcacao]);
  setTitulo('');
  setDia('');
  setMes('');
  setAno('');
  setModalVisible(false);
};


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
        <Text style={styles.dataTexto}>5 de maio de 2025</Text>
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

        {/* Marcações */}
        <Text style={styles.marcacoesTitulo}>Marcações</Text>
        <FlatList
          data={marcacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderMarcacao}
          showsVerticalScrollIndicator={false}
        />

        <Text style={styles.verMais}>ver mais +</Text>
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
