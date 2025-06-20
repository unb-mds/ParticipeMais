import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function StatusBadge() {
  return (
    <View style={styles.statusContainer}>
      <AntDesign name="checkcircleo" size={14} color="#4CAF50" />
      <Text style={styles.status}>Ativo</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ccf5d4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  status: {
    color: '#4CAF50',
    fontSize: 12,
  },
});
