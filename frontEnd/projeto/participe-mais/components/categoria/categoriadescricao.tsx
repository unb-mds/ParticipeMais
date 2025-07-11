import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  categoria: string;
};

export default function CategoriaDescricao({ categoria }: Props) {
  const { corFundo } = definirCorETexto(categoria);

  return (
    <View style={[styles.container, { backgroundColor: corFundo }]}>
      <Text style={styles.texto}>Tudo sobre {categoria} em um só lugar. Propostas, planos e as discussões das conferências feitas pela população.</Text>
    </View>
  );
}


// 🎨 Função para definir cor e texto por categoria
function definirCorETexto(categoria: string) {
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return {
        corFundo: '#4CAF50',
      };
    case 'infraestrutura':
      return {
        corFundo: '#FF9800',
      };
    case 'participação social':
      return {
        corFundo: '#F44336',
      };
    case 'igualdade racial':
      return {
        corFundo: '#CE93D8',
      };
    case 'direito das mulheres':
      return {
        corFundo: '#FF1493',
      };
    case 'direitos da pessoa idosa':
      return {
        corFundo: '#FF9800',
      };
    case 'desenvolvimento rural':
      return {
        corFundo: '#90CAF9',
      };
    case 'tecnologia':
      return {
        corFundo: '#CE93D8',
      };
      case 'saúde':
      return {
        corFundo: '#2670E8',
      };

    default:
      return {
        corFundo: '#E0E0E0',
      };
  }
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  texto: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Raleway-Regular',
  },
});
