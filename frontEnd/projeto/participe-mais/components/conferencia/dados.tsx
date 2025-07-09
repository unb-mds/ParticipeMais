import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';

type DadosProps = {
  estatisticas: {
    eixo: string;
    andamento: number;
    encerradas: number;
  };
  palavrasChave: string[];
};

export default function Dados({ estatisticas, palavrasChave }: DadosProps) {
  const { total, andamento, encerradas } = estatisticas;

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.titulo}>
        <Ionicons name="document-text-outline" size={16} color="#2670E8" />{' '}
        <Text style={{ color: '#2670E8' }}>DADOS</Text> - Conferências Gerais
      </Text>

      {/* Dados Estatísticos */}
      <View style={styles.innerCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart-outline" size={16} color="#000" />
          <Text style={styles.sectionTitle}>Dados estatísticos</Text>
        </View>

        {/* Barra proporcional */}
        <View style={styles.barraContainer}>
          <View style={[styles.barraBase]}>
            <View
              style={[
                styles.barraAndamento,
                { width: `${andamento}%` },
              ]}
            />
            <View
              style={[
                styles.barraEncerradas,
                { width: `${encerradas}%` },
              ]}
            />
          </View>
        </View>

        {/* Labels */}
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            <Text style={{ color: '#4CAF50' }}>●</Text> {andamento}% Conferências planejadas
          </Text>
          <Text style={styles.label}>
          </Text>
        </View>

        <Text style={styles.totalText}>Total: {total} conferências</Text>
      </View>

      {/* Palavras-chave */}
      <View style={styles.innerCard}>
        <View style={styles.sectionHeader}>
        <MaterialIcons name="abc" size={16} color="black" />      
    <Text style={styles.sectionTitle}>Palavras-chave</Text>
        </View>

        <View style={styles.tags}>
          {palavrasChave.map((tag, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { backgroundColor: cores[index % cores.length] },
              ]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const cores = ['#2670E8', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#00BCD4'];

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 16,
  },
  innerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 8,
  },
  titulo: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
    color: '#000',
  },
  barraContainer: {
    marginTop: 4,
  },
  barraBase: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  barraAndamento: {
    backgroundColor: '#4CAF50',
    height: 8,
  },
  barraEncerradas: {
    backgroundColor: '#FFC107',
    height: 8,
  },
  labelContainer: {
    gap: 4,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: '#000',
  },
  totalText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Raleway-Bold',
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
});
