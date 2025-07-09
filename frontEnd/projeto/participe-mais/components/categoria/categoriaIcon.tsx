// components/categoria/CategoriaIcone.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome, FontAwesome6,FontAwesome5 } from '@expo/vector-icons';

interface Props {
  categoria: string;
  tamanho?: number; // tamanho opcional
  corIcone?: string; // cor do ícone
}

export default function CategoriaIcone({ categoria, tamanho = 24, corIcone = '#fff' }: Props) {
  const corFundo = corDaCategoria(categoria);

  const getIconByCategoria = () => {
    switch (categoria.toLowerCase()) {
      case 'meio ambiente':
        return <Ionicons name="leaf-outline" size={tamanho * 0.7} color={corIcone} />;
      case 'educação':
        return <MaterialIcons name="school" size={tamanho * 0.7} color={corIcone} />;
      case 'saúde':
        return <Ionicons name="medkit" size={tamanho * 0.7} color={corIcone} />;
      case 'infraestrutura':
        return <MaterialCommunityIcons name="wheel-barrow" size={tamanho * 0.7} color={corIcone} />;
      case 'participação social':
        return <FontAwesome name="group" size={tamanho * 0.7} color={corIcone} />;
      case 'direito das mulheres':
        return <Ionicons name="woman" size={tamanho * 0.7} color={corIcone} />;
      case 'tecnologia':
        return <FontAwesome6 name="user-gear" size={tamanho * 0.7} color={corIcone} />;
      case 'desenvolvimento rural':
        return <FontAwesome6 name="cow" size={tamanho * 0.7} color={corIcone} />;
      case 'direitos da pessoa idosa':
        return <MaterialIcons name="elderly" size={tamanho * 0.7} color={corIcone} />;
      case 'igualdade racial':
        return <FontAwesome5 name="equals" size={tamanho * 0.7} color={corIcone} />;
      default:
        return <Ionicons name="alert-circle-outline" size={tamanho * 0.7} color={corIcone} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: corFundo, width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
      {getIconByCategoria()}
    </View>
  );
}

function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',
    'infraestrutura': '#FF9800',
    'saúde': '#2670E8',
    'educação': '#ce93d8',
    "direito das mulheres": "#FF1493",
    "igualdade racial" : "#CD853F",
    "direitos da pessoa idosa": "#F0E68C",
    "desenvolvimento rural":"#006400",
    "tecnologia": "#8B008B"
  };
  return mapaCores[categoria.toLowerCase()] || '#e0e0e0';
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
