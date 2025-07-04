import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  oficinas: number;
  propostas: number;
};

export default function VisaoGeral({
  oficinas,
  propostas,
}: Props) {
  return (
    <>
    <Text style={styles.modalSectionTitleOutside}>
        <Ionicons name="trending-up-outline" size={20} color="#000" /> Visão Geral
    </Text>
    
    <View style={styles.container}>
      {/* Oficinas */}
      <View style={styles.item}>
        <View style={styles.containerinterno}>
        <Ionicons name="document-text-outline" size={20} color="#000" />
        <Text style={styles.label}>Oficinas</Text>
        </View>
        <Text style={styles.numero}>{oficinas}</Text>
      </View>


      {/* Propostas */}
      <View style={styles.item}>
        <View style={styles.containerinterno}>
        <MaterialCommunityIcons name="account-voice" size={20}  color="#000"/>
        <Text style={styles.label}>Propostas</Text>
        </View>
        <Text style={styles.numero}>{propostas}</Text>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,
    gap: 16,
  },
  containerinterno:{
    flexDirection: 'row',

  },
  item: {
    width: '47%',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    textAlign: 'center',
  },
  numero: {
    fontSize: 50,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
   modalSectionTitleOutside: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginBottom: 12,
  },
});
