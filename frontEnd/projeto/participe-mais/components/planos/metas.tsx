import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather, Octicons } from '@expo/vector-icons';

type Meta = {
  id: number;
  titulo: string;
  cidade: string;
  estado: string;
  votos: number;
};

export default function Metas({ metas }: { metas: Meta[] }) {
  const [search, setSearch] = useState('');
  const [expandido, setExpandido] = useState<number | null>(null);

  const metasFiltradas = metas.filter(
    (item) =>
      item.titulo.toLowerCase().includes(search.toLowerCase()) ||
      item.cidade.toLowerCase().includes(search.toLowerCase()) ||
      item.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.tituloComIcone}>
        <Feather name="target" size={20} color="black" />
        <Text style={styles.tituloTexto}>Metas</Text>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.pesquisaContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={20} color="#000" />
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
          {metasFiltradas.map((item) => {
            const estaExpandido = expandido === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => setExpandido(estaExpandido ? null : item.id)}
                style={styles.card}
              >
                {/* Header */}
                <View style={styles.headerCard}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Feather name="target" size={14} color="#000" />
                      <Text style={styles.tituloCard}>{item.titulo}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setExpandido(estaExpandido ? null : item.id)}
                    style={styles.expandButton}
                  >
                    <Ionicons
                      name={estaExpandido ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.linhaDentro} />

                {estaExpandido && (
                  <View style={styles.expandidoContainer}>
                    <View style={{ flex: 1 }}>
                      {/* Localização */}
                      <View style={styles.localizacaoContainer}>
                        <Octicons name="location" size={12} color="#2670E8" />
                        <Text style={styles.localizacaoTexto}>
                          {item.cidade} - {item.estado}
                        </Text>
                      </View>

                      <Text style={styles.realizadoTexto}>
                        Propostas realizadas na oficina de {item.cidade} - {item.estado}
                      </Text>
                    </View>

                    {/* Votos */}
                    <View style={styles.votosContainer}>
                      <Text style={styles.votosNumero}>{item.votos}</Text>
                      <View style={styles.votosLabelContainer}>
                        <Feather name="thumbs-up" size={14} color="#000" />
                        <Text style={styles.votosLabel}>Votos</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 20,
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
    height: 300, // 👈 altura que define o scroll interno
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tituloCard: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#000',
  },
  expandButton: {
    padding: 4,
  },
  linhaDentro: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
    marginBottom: 8,
  },
  expandidoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  localizacaoTexto: {
    fontSize: 10,
    color: '#2670E8',
  },
  realizadoTexto: {
    color: '#555',
    lineHeight: 18,
    fontSize: 13,
    flex: 1,
  },
  votosContainer: {
    alignItems: 'center',
    gap: 4,
  },
  votosNumero: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  votosLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  votosLabel: {
    fontSize: 12,
    color: '#000',
  },
});
