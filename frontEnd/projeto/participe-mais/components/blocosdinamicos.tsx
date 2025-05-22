import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function BlocoDinamico({ blocos }: { blocos: any[] }) {
  return (
    <View style={styles.container}>
      {blocos.map((bloco, index) => {
        switch (bloco.tipo) {
          case 'banner':
            return <BlocoCategoria key={index} titulo={bloco.titulo} />;
          case 'listaUsuarios':
            return <BlocoListaDadosComunidade key={index} usuarios={bloco.usuarios} comentarios={bloco.comentarios} />;
          case 'noticia':
            return <BlocoComentariosEnquetes key={index} titulo={bloco.titulo} corpo={bloco.corpo} />;
          case 'evento':
            return <BlocoEnquete key={index} nome={bloco.nome} data={bloco.data} />;
          default:
            return null;
        }
      })}
    </View>
  );
}

function BlocoCategoria({ titulo }: { titulo: string }) {
  return <View style={styles.banner}><ThemedText>{titulo}</ThemedText></View>;
}

function BlocoListaDadosComunidade({ usuarios, comentarios }: { usuarios: string[], comentarios: number }) {
  return (
    <View style={styles.lista_comunidade_container}>
        <View style={styles.containerComentarios}>
        <ThemedText style = {styles.title_comentarios}> Total de comentários</ThemedText>
      </View>
      <View style={styles.containerUSuarios}>
        {usuarios.map((u, i) => <ThemedText key={`u-${i}`}>👤 {u}</ThemedText>)}

      </View>
    </View>
  );
}


function BlocoComentariosEnquetes({ titulo, corpo }: { titulo: string, corpo: string }) {
  return (
    <View style={styles.noticia}>
      <ThemedText style={styles.titulo}>{titulo}</ThemedText>
      <ThemedText>{corpo}</ThemedText>
    </View>
  );
}

function BlocoEnquete({ nome, data }: { nome: string, data: string }) {
  return (
    <View style={styles.evento}>
      <ThemedText>📅 {nome} - {data}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  banner: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
  },
  lista_comunidade_container: {
    backgroundColor: '#fff',
    padding: 5,
    margin: 5,
    minHeight: 100,
    flexDirection: 'row',
    gap: 10,
  },
  noticia: {
    backgroundColor: '#f3e5f5',
    padding: 16,
    borderRadius: 8,
  },
  evento: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
   containerComentarios: {
    width: '60%',
    backgroundColor: '#2670E8',
    borderRadius: 8,
    alignItems: 'center',
  },
   containerUSuarios: {
    width: '35%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
    title_comentarios: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
});
