import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  categoria: string;
};

export default function CategoriaDescricao({ categoria }: Props) {
  const { corFundo, textoDescricao } = definirCorETexto(categoria);

  return (
    <View style={[styles.container, { backgroundColor: corFundo }]}>
      <Text style={styles.texto}>{textoDescricao}</Text>
    </View>
  );
}


// 🎨 Função para definir cor e texto por categoria
function definirCorETexto(categoria: string) {
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return {
        corFundo: '#4CAF50',
        textoDescricao: 'Tudo sobre meio ambiente em um só lugar. Propostas, planos e as discussões das conferências feitas pela população.',
      };
    case 'infraestrutura':
      return {
        corFundo: '#FF9800',
        textoDescricao: 'Tudo sobre infraestrutura, obras, mobilidade e desenvolvimento urbano. Acompanhe planos e discussões relevantes.',
      };
    case 'saúde':
      return {
        corFundo: '#90CAF9',
        textoDescricao: 'Informações sobre saúde pública, bem-estar e qualidade de vida. Veja planos, propostas e participe das discussões.',
      };
    case 'educação':
      return {
        corFundo: '#CE93D8',
        textoDescricao: 'Espaço dedicado à educação. Acompanhe planos, propostas e debates sobre o futuro da educação no país.',
      };
    default:
      return {
        corFundo: '#E0E0E0',
        textoDescricao: 'Acompanhe propostas, planos e discussões desta categoria.',
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
