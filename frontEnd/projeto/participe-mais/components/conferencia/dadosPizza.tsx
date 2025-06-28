import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Circle, G, Path } from 'react-native-svg';

type DadosPizzaProps = {
  estatisticas: {
    eixo: string;
    percentual: number;
    cor: string;
  }[];
  total: number;
  palavrasChave: string[];
};

export default function DadosPizza({ estatisticas, total, palavrasChave }: DadosPizzaProps) {
  const radius = 60;
  const innerRadius = 40;
  const center = 60;

  const totalPercentual = estatisticas.reduce((acc, item) => acc + item.percentual, 0);

  let startAngle = 0;

  const arcs = estatisticas.map((item) => {
    const angle = (item.percentual / totalPercentual) * 2 * Math.PI;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(startAngle + angle);
    const y2 = center + radius * Math.sin(startAngle + angle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const path = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    startAngle += angle;

    return { path, color: item.cor, percentual: item.percentual, eixo: item.eixo };
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.titulo}>
        <Ionicons name="document-text-outline" size={16} color="#2670E8" />{' '}
        <Text style={{ color: '#2670E8' }}>DADOS</Text> - Propostas Gerais
      </Text>

      {/* Dados Estatísticos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart-outline" size={16} color="#000" />
          <Text style={styles.sectionTitle}>Dados estatísticos</Text>
        </View>

        <View style={styles.estatisticasContainer}>
          {/* Labels */}
          <View style={{ flex: 1, gap: 4 }}>
            {estatisticas.map((item, index) => (
              <Text key={index} style={styles.label}>
                <Text style={{ color: item.cor }}>●</Text> {item.percentual}% {item.eixo}
              </Text>
            ))}
          </View>

          {/* Gráfico Doughnut */}
          <View style={{ alignItems: 'center' }}>
            <Svg width={120} height={120}>
              <G>
                {arcs.map((arc, index) => (
                  <Path key={index} d={arc.path} fill={arc.color} />
                ))}
                {/* Circulo do meio (furo) */}
                <Circle cx={center} cy={center} r={innerRadius} fill="#fff" />
              </G>
            </Svg>
            <MaterialCommunityIcons
              name="account-voice"
              size={24}
              color="#000"
              style={styles.iconCenter}
            />
            <Text style={styles.totalText}>Total: {total} propostas</Text>
          </View>
        </View>
      </View>

      {/* Palavras-chave */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="tag-outline" size={16} color="#000" />
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
    marginTop: 0,
  },
  titulo: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    marginBottom: 4,
  },
  section: {
    gap: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
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
  estatisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
    label: {
    fontSize: 14,  // aumenta o tamanho
    color: '#000', // deixa mais forte, preto
    fontWeight: 'bold', // deixa negrito
    },

  totalText: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
  },
  iconCenter: {
    position: 'absolute',
    top: 48,
    left: 48,
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
