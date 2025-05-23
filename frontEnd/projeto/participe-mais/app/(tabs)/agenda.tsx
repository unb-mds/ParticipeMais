import { View, Text, StyleSheet } from 'react-native';

export default function AgendaUsuario() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá mundo agenda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',     // organiza em linha
    alignItems: 'center',     // centraliza verticalmente
    gap: 8,                   // espaço entre elementos
    padding: 16,              // espaçamento interno
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
