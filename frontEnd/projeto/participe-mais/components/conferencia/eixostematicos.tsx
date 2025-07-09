import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Eixo = {
  titulo: string;
  descricao: string;
};

export default function EixosTematicos({ eixos }: { eixos: Eixo[] }) {
  const scrollRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View>
      {/* 🔥 Título com foguete */}
      <View style={styles.tituloComIcone}>
        <Ionicons name="rocket-outline" size={20} color="#000" />
        <Text style={styles.tituloTexto}>Eixos Temáticos</Text>
      </View>

      <View style={styles.cardAzul}>
        <Text style={styles.cardHeaderTextBranco}>Eixos Temáticos</Text>

        <FlatList
          data={eixos}
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
          {eixos.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                scrollRef.current?.scrollToOffset({
                  offset: index * (width - 32),
                  animated: true,
                });
                setCurrentIndex(index);
              }}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardAzul: {
    backgroundColor: '#2670E8',
    borderRadius: 20,
    padding: 16,
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
    padding: 16,
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
    maxWidth: '100%',
  },
  eixoDescricao: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Raleway-Regular',
    maxWidth: '100%',
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
