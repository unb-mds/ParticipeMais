import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Props = {
  router: ReturnType<typeof useRouter>;
  titulo: string;
  favorito: boolean;
  onToggleFavorito: () => void;
};

export default function Header({ router, titulo, favorito, onToggleFavorito }: Props) {
    console.log('Renderizando Header - Favorito:', favorito); // ✅ TESTE AQUI

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{titulo}</Text>

      <TouchableOpacity onPress={onToggleFavorito} >

        <Ionicons
          name={favorito ? 'heart' : 'heart-outline'}
          size={28}
          color={favorito ? 'red' : '#000'}
        />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
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
});
