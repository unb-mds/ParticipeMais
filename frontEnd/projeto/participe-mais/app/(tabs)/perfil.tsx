import { View, Text, StyleSheet } from 'react-native';

export default function PerfilUser() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá mundo, perfil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
