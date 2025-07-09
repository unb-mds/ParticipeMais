import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  status: 'Ativa' | 'Inativa';
};

export default function StatusBadge({ status }: Props) {
  const isAtiva = status === 'Ativa';

  const backgroundColor = isAtiva ? '#ccf5d4' : '#ffd6d6';
  const color = isAtiva ? '#4CAF50' : '#FF5252';
  const icon = isAtiva ? 'loading1' : 'closecircleo';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AntDesign name={icon} size={14} color={color} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
  },
});
