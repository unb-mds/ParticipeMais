import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';

type Evento = {
  id: number;
  estado: string;
  data?: string;
  status: 'Inscrições em breve' | 'Finalizado';
};

export default function Eventos({ eventos }: { eventos: Evento[] }) {
  const [search, setSearch] = useState('');

  const eventosFiltrados = eventos.filter((item) =>
    item.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Octicons name="calendar" size={24} color="black" />
        <Text style={styles.tituloTexto}>Eventos</Text>
      </View>

      {/* Search + Filtro */}
      <View style={styles.pesquisaContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={24} color="#000" />
          <TextInput
            placeholder="Buscar..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filtroButton}>
          <Ionicons name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Linha de separação */}
      <View style={styles.linha} />

      {/* Lista */}
      <View style={styles.listaContainer}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        >
          {eventosFiltrados.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Título */}
              <Text style={styles.tituloCard}>{item.estado}</Text>

              {/* Data ou Status */}
              <View style={styles.datasContainer}>
                <Ionicons name="calendar-outline" size={14} color="#2670E8" />
                <Text style={styles.datasTexto}>
                  {item.data ? item.data : item.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    backgroundColor: '#fff',
    marginTop : 20,
  },
  tituloComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tituloTexto: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  pesquisaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  filtroButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linha: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  listaContainer: {
    height: 300,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  tituloCard: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  datasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  datasTexto: {
    fontSize: 12,
    color: '#2670E8',
  },
});
