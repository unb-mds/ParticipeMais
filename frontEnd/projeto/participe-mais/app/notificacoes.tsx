import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import React from "react";

type Notificacao = {
  id: number;
  titulo: string;
  data: string;
  conteudo: string;
};

const notificacoes: Notificacao[] = [
  {
    id: 1,
    titulo: "Bem-vindo!",
    data: "10 de Julho",
    conteudo: "Conta criada com sucesso.",
  },
  {
    id: 2,
    titulo: "Atenção",
    data: "12 de Julho",
    conteudo: "Verifique seu e-mail.",
  },
  {
    id: 3,
    titulo: "Erro",
    data: "13 de Julho",
    conteudo: "Não foi possível carregar dados.",
  },
  {
    id: 4,
    titulo: "Bem-vindo!",
    data: "10 de Julho",
    conteudo: "Conta criada com sucesso.",
  },
  {
    id: 5,
    titulo: "Atenção",
    data: "12 de Julho",
    conteudo: "Verifique seu e-mail.",
  },
  {
    id: 6,
    titulo: "Erro",
    data: "13 de Julho",
    conteudo: "Não foi possível carregar dados.",
  },
  {
    id: 7,
    titulo: "Bem-vindo!",
    data: "10 de Julho",
    conteudo: "Conta criada com sucesso.",
  },
  {
    id: 8,
    titulo: "Atenção",
    data: "12 de Julho",
    conteudo: "Verifique seu e-mail.",
  },
  {
    id: 9,
    titulo: "Erro",
    data: "13 de Julho",
    conteudo: "Não foi possível carregar dados.",
  },
];

export default function Notificacao() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Notificações",
          headerBackTitle: "Voltar",
        }}
      />

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

          return (
            <View style={[styles.card]}>
              <View style={styles.header}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardData}>{item.data}</Text>
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
