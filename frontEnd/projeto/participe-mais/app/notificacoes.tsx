import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import axios from 'axios';
import { useEffect, useState } from "react";
import React from "react";

interface Notificacao {
  id: number;
  titulo: string;
  conteudo: string;
  data: string;
}


export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/auth/notificacoes/') // ou seu IP real
      .then((response) => {
        setNotificacoes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar notificações:', error);
      });
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Se quiser formatar a data:
          const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

          return (
            <View style={[styles.card]}>
              <View style={styles.header}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardData}>{dataFormatada}</Text>
              </View>
              <Text style={styles.cardConteudo}>{item.conteudo}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffffff",
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#D9D9D9",
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardConteudo: {
    fontSize: 16,
  },
  cardData: {
    fontSize: 12,
    // left: 280,
    // marginTop: 20,
  },
});
