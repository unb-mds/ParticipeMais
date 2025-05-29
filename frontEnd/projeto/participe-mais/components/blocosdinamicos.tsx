import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');



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
        <View style={[styles.bloco_enquente, { backgroundColor: corDaCategoria(item.categoria) }]}>
            <View style={styles.logo_estilo}>{getIconByCategoria(item.categoria)}</View>
            <View style={styles.dados_enquete}>
            <ThemedText style={styles.titulo_carrossel}>{item.categoria}</ThemedText>
                <View style={styles.dados_enquete_comentarios}>
                    <View style={styles.logo_pequeno}><MaterialIcons name="chat-bubble-outline" size={12} color="#fff"/> </View>
                    <ThemedText style={styles.contador}>{item.totalComentarios} chats abertos</ThemedText>
                </View>
            </View>
        </View>
        )}

    />
  );
}


function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',     // verde claro
    'infraestrutura': '#fff59d',   // amarelo claro
    'saúde': '#90caf9',            // azul claro
    'educação': '#ce93d8',         // roxo claro (exemplo extra)
  };

  return mapaCores[categoria.toLowerCase()] || '#e0e0e0'; // cor padrão se não encontrar
}
function getIconByCategoria(categoria: string) {
  switch (categoria) {
    case 'Meio Ambiente':
      return<Ionicons name="leaf-outline" size={24} color="#FFFFFF" />
    case 'Educação':
      return <MaterialIcons name="school" size={24} color="#fff" />;
    case 'Saúde':
      return <Ionicons name="medkit" size={24} color="#fff" />;
    case "Infraestrutura":
        return <MaterialCommunityIcons name="wheel-barrow" size={24} color="#fff" />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color="#fff" />;
  }
}
const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginTop: 10,
    alignItems: 'center',
    height: 100,
    overflow: 'scroll',
  },
  banner: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    width: '100%',
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
    width: '100%',
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
  },
    numero_universal_usuarios: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10, // adicione esta linha
    marginRight: 80,
  },
  carrossel: {
    paddingHorizontal: 16,
    gap: 6,
  },
bloco_enquente: {
  borderRadius: 20,
  padding: 8,
  elevation: 2,
  minWidth: 250,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row', // ícone + dados lado a lado // espaçamento entre ícone e texto
},

dados_enquete: {
  flexDirection: 'column', // força quebra em coluna
  justifyContent: 'center',
  marginRight: 50
},
dados_enquete_comentarios: {
  flexDirection: 'row', // força quebra em coluna
  justifyContent: 'center',
  gap:5,
},
  titulo_carrossel: {
    color: "#ffffff",
    fontWeight: 'bold',
    fontSize: 15
  },
  contador: {
    color: '#fff',
    fontSize: 12,
  },
  logo_estilo:{
    marginRight: 50,
  },
  logo_pequeno:{
    marginTop:  2
  }

});
