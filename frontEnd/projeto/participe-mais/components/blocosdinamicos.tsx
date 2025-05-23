import React from 'react';
import { View, StyleSheet,FlatList } from 'react-native';
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
          case 'carrosselCategorias':
            return <BlocoEnqueteCategoria key={index} dados={bloco.dados} />;
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
        <ThemedText style = {styles.numero_universal}>{comentarios}</ThemedText>
      </View>
      <View style={styles.containerUSuarios}>
        <ThemedText style = {styles.title_comentarios_usuario}> Usuários ativos</ThemedText>
        <ThemedText style = {styles.numero_universal_usuarios}>{usuarios}</ThemedText>
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

function BlocoEnqueteCategoria({ dados }: { dados: { categoria: string, totalComentarios: number }[] }) {
  const dadosFiltrados = dados.filter(item => item.totalComentarios > 0);

  if (dadosFiltrados.length === 0) return null;

  return (
    <FlatList
      data={dadosFiltrados}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item, index) => `${item.categoria}-${index}`}
      renderItem={({ item }) => (
        <View style={styles.bloco}>
          <ThemedText style={styles.titulo_carrossel}>{item.categoria}</ThemedText>
          <ThemedText style={styles.contador}>{item.totalComentarios} comentários</ThemedText>
        </View>
      )}
    />
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
    width: '40%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1, // espessura da borda
    borderColor: '#cccccc', // cor da borda
  },
    title_comentarios: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15, // adicione esta linha
    marginRight: 30
  },
  numero_universal: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 150,
    marginTop: 10, // adicione esta linha
  },
      title_comentarios_usuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 10, // adicione esta linha
    marginRight: 30
  },
    numero_universal_usuarios: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10, // adicione esta linha
    marginRight: 100,
  },
  carrossel: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bloco: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo_carrossel: {
    fontWeight: 'bold',
  },
  contador: {
    color: '#555',
    fontSize: 12,
  },
});
