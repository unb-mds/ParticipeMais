import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Largura = width * 1;
const Altura = width * 0.4;


const diasSemana = [
  { diaSemana: 'Seg', dia: '5' },
  { diaSemana: 'Ter', dia: '6' },
  { diaSemana: 'Qua', dia: '7' },
  { diaSemana: 'Qui', dia: '8' },
  { diaSemana: 'Sex', dia: '9' },
  { diaSemana: 'Sáb', dia: '10' },
  { diaSemana: 'Dom', dia: '11' },
];

const marcacoes = [
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

  return (
    <View style={styles.container_total}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
      </View>
      <View style={styles.line} />
    <View style={styles.container}>
      {/* Header */}
     

      {/* Data e Hoje */}
      <Text style={styles.dataTexto}>5 de maio de 2025</Text>
      <Text style={styles.hojeTexto}>Hoje</Text>

      {/* Calendário horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendario}>
        {diasSemana.map((dia) => (
          <Pressable
            key={dia.dia}
            style={[
              styles.diaItem,
              dia.dia === diaSelecionado && styles.diaSelecionado,
            ]}
            onPress={() => setDiaSelecionado(dia.dia)}
          >
            <Text style={styles.diaSemana}>{dia.diaSemana}</Text>
            <Text style={styles.diaNumero}>{dia.dia}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Lista de marcações */}
      <Text style={styles.marcacoesTitulo}>Marcações</Text>
      <FlatList
        data={marcacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderMarcacao}
        showsVerticalScrollIndicator={false}
      />

      {/* Ver mais */}
      <Text style={styles.verMais}>ver mais +</Text>
    </View>
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
  backButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
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
    marginTop: 20, // Aumenta espaçamento do topo
  },

  hojeTexto: {
    fontSize: 32, // Aumenta tamanho
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
  paddingVertical: 20, // Aumenta altura
  paddingHorizontal: 20, // Aumenta largura
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
});
