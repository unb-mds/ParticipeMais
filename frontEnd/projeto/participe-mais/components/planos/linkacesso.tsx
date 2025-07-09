import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  titulo: string;
  descricao: string;
  textoBotao: string;
  onPress: () => void;
};

export default function LinkAcesso({ titulo, descricao, textoBotao, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="link-outline" size={16} color="#000" />
        <Text style={styles.title}>{titulo}</Text>
      </View>

      <Text style={styles.descricao}>{descricao}</Text>

      <Pressable style={styles.botao} onPress={onPress}>
        <Text style={styles.textoBotao}>{textoBotao}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  descricao: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
    lineHeight: 18,
  },
  botao: {
    borderWidth: 1,
    borderColor: '#2670E8',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    backgroundColor: '#2670E8',
  },
  textoBotao: {
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    fontSize: 13,
  },
});
