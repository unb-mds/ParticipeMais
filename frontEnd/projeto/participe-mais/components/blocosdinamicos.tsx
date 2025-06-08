import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text,  TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraQuadrado = SCREEN_WIDTH * 0.85; // 95% da tela


const { width } = Dimensions.get('window'); // obtém a largura da tela

// Componente principal que recebe um array de blocos dinâmicos e renderiza diferentes componentes com base no tipo
export default function BlocoDinamico({ blocos }: { blocos: any[] }) {
  return (
    <View style={styles.container}>
      {blocos.map((bloco, index) => {
        switch (bloco.tipo) {
          case 'listaUsuarios':
            return (
              <BlocoListaDadosComunidade
                key={index}
                usuarios={bloco.usuarios}
                comentarios={bloco.comentarios}
              />
            );
          case 'carrosselCategorias':
            return <BlocoEnqueteCategoria key={index} dados={bloco.dados} />;
          case 'carroselComentarios':
            return <BlocoEnqueteComentarios key={index} dados={bloco.dados} />;
          case 'carroselComentariosEnquentes':
              return <BlocoEnqueteComentariosColuna key={index} dados={bloco.dados} />;
          default:
            return null; // se o tipo não for reconhecido, não renderiza nada
        }
      })}
    </View>
  );
}


// Bloco para mostrar quantidade de usuários e comentários
function BlocoListaDadosComunidade({ usuarios, comentarios }: { usuarios: string[], comentarios: number }) {
  return (
    <View style={styles.lista_comunidade_container}>
      <View style={styles.containerComentarios}>
        <Text style={styles.title_comentarios}> Total de comentários</Text>
        <Text style={styles.numero_universal}>{comentarios}</Text>
      </View>
      <View style={styles.containerUSuarios}>
        <Text style={styles.title_comentarios_usuario}> Usuários ativos</Text>
        <Text style={styles.numero_universal_usuarios}>{usuarios}</Text>
      </View>
    </View>
  );
}

// Bloco para exibir uma notícia ou corpo de texto com título

// Bloco carrossel horizontal que exibe categorias com comentários abertos
function BlocoEnqueteCategoria({ dados }: { dados: { categoria: string, totalComentarios: number }[] }) {
  // Filtra apenas categorias com comentários (> 0)
  const dadosFiltrados = dados.filter(item => item.totalComentarios > 0);

  if (dadosFiltrados.length === 0) return null; // se não houver dados, não renderiza

  return (
    <>
    <View style={styles.viewAlinhador}>
      <Text style={styles.titulo_enquete}>Acesse diretamente pelas categorias!</Text>
    </View>
    <FlatList
      data={dadosFiltrados}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item, index) => `${item.categoria}-${index}`} // chave única
      renderItem={({ item }) => ( 
        <TouchableOpacity>
        <View style={[styles.bloco_enquente, { backgroundColor: corDaCategoria(item.categoria) }]}>
          <View style={styles.logo_estilo}>{getIconByCategoria(item.categoria)}</View>
          <View style={styles.dados_enquete}>
        
            <Text style={styles.titulo_carrossel}>{item.categoria}</Text>
            <View style={styles.dados_enquete_comentarios}>
              <View style={styles.logo_pequeno}>
                <MaterialIcons name="chat-bubble-outline" size={12} color="#fff" />
              </View>
              <Text style={styles.contador}>{item.totalComentarios} chats abertos</Text>
            </View>
          </View>
        </View>
       </TouchableOpacity>
      )}
    />
    </>
  );
}



function BlocoEnqueteComentarios({ dados }: { dados: { categoria: string, comentario: string, autor: string }[] }) {
  return (
    <>
    <View style={styles.viewAlinhador}>
      <Text style={styles.titulo_enquete}>Acesse as enquetes pelos comentários!</Text>
    </View>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrossel}
      keyExtractor={(item, index) => `${item.categoria}-${index}`}
      data={dados}
      renderItem={({ item }) => (
        <TouchableOpacity>
        <View style={[styles.bloco_comentarios, { backgroundColor: corDaCategoria(item.categoria) }]}>
          <View style={styles.dados_comentarios}>
            
            {/* Ícone + nome do autor alinhados à esquerda */}
            <View style={styles.autorHeader}>
              <FontAwesome5 name="user-circle" size={14} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.autorComentario}>{item.autor}</Text>
            </View>

            {/* Comentário */}
            <Text style={styles.comentarioTexto}>"{item.comentario}"</Text>
          </View>
        </View>
        </TouchableOpacity>
      )}

    />
    </>
  );
}

function BlocoEnqueteComentariosColuna({
  dados,
}: {
  dados: {
    categoria: string;
    enquete: string;
    curtidas: number;
    numeroComentario: number;
  }[];
}) {
  return (
    <>
      <View style={styles.viewAlinhador}>
        <Text style={styles.titulo_enquete}>Todas as enquetes</Text>
      </View>

      <View style={styles.listaVertical}>
        {dados.slice(0, 10).map((item, index) => (
          <TouchableOpacity key={`${item.categoria}-${index}`}>
            <View style={styles.cardComentario}> 
              <View style={styles.dados_enquete}>
                <View style={styles.container_view_enquentes}>
                  <BolinhasCategoria categoria={item.categoria}/>

                  <Text style={styles.comentarioTextoEnquete}>{item.enquete}</Text>
                </View>
                <View style={styles.container_view_enquentes}>
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={14}                 // mesmo tamanho da fonte
                    color="black"
                    style={styles.iconInline}
                  />
                  <Text style={styles.statusTexto}>{item.curtidas} curtidas</Text>
                  <MaterialIcons name="chat-bubble-outline" size={12} color="#black" style={styles.iconInline} />

                  <Text style={styles.statusTexto}>{item.numeroComentario} comentários</Text>
                </View>
                
              </View>
              
            </View>
          </TouchableOpacity>
         
        ))}
      </View>
       <TouchableOpacity onPress={() => {/* sua ação aqui */}}>
              <Text style={styles.linkVerMais}>Ver mais</Text>
        </TouchableOpacity>
      
    </>
  );
}








// Função auxiliar para retornar a cor com base na categoria
function corDaCategoria(categoria: string): string {
  const mapaCores: Record<string, string> = {
    'meio ambiente': '#4CAF50',     // verde claro
    'infraestrutura': '#FF9800',   // amarelo claro
    'saúde': '#90caf9',            // azul claro
    'educação': '#ce93d8',         // roxo claro (exemplo extra)
  };

  return mapaCores[categoria.toLowerCase()] || '#e0e0e0'; // cor padrão se não houver correspondência
}

// Função auxiliar para retornar um ícone baseado na categoria
function getIconByCategoria(categoria: string, cor: string = "#fff") {
  switch (categoria.toLowerCase()) {
    case 'meio ambiente':
      return <Ionicons name="leaf-outline" size={24} color={cor} />;
    case 'educação':
      return <MaterialIcons name="school" size={24} color={cor} />;
    case 'saúde':
      return <Ionicons name="medkit" size={24} color={cor} />;
    case 'infraestrutura':
      return <MaterialCommunityIcons name="wheel-barrow" size={24} color={cor} />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color={cor} />;
  }
}

// Função principal que renderiza a bolinha da categoria
function BolinhasCategoria({ categoria }: { categoria: string }) {
  const corFundo = corDaCategoria(categoria);
  const icone = getIconByCategoria(categoria, "#black"); // força ícone cinza

  return (
    <View style={[styles.bolinha, { backgroundColor: corFundo }]}>
      {icone}
    </View>
  );
}



const styles = StyleSheet.create({
  viewAlinhador: {
  width: '100%',
  alignSelf: 'stretch',
},

  container: {
    gap: 20,
    marginTop: 10,
    alignItems: 'center',
    overflow: 'scroll',
  },
  banner: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    width: '100%',
    fontFamily: 'Raleway_400Regular',
  },
  lista_comunidade_container: {
    backgroundColor: '#fff',
    padding: 5,
    margin: 5,
    minHeight: 100,
    flexDirection: 'row',
    gap: 10,
  },

  evento: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
titulo_enquete: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 4,
  fontFamily: 'Raleway_700Bold',
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
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  title_comentarios: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginRight: 30,
    fontFamily: 'Raleway_700Bold',
  },
  numero_universal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 150,
    marginTop: 10,
    fontFamily: 'Raleway_700Bold',
  },
  title_comentarios_usuario: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 10,
    fontFamily: 'Raleway_700Bold',
  },
  numero_universal_usuarios: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    marginRight: 80,
    fontFamily: 'Raleway_700Bold',
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
    flexDirection: 'row',
  },

  dados_enquete: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 50,
  },
  dados_enquete_comentarios: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  titulo_carrossel: {
    color: "#ffffff",
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Raleway_700Bold',
  },
  contador: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway_400Regular',
  },
  logo_estilo: {
    marginRight: 50,
  },
  logo_pequeno: {
    marginTop: 2,
  },

bloco_comentarios: {
  borderRadius: 5,
  padding: 12,                    // aumenta o espaço interno
  elevation: 2,
  minWidth: 200,
  maxWidth: 220,              // <-- define limite horizontal
  minHeight: 120,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  marginRight: 5,
},


dados_comentarios: {
  width: '100%',            // garante limite de largura
  flexDirection: 'column',
  alignItems: 'flex-start',
},

comentarioTexto: {
  fontSize: 14,
  color: '#fff',
  fontFamily: 'Raleway_400Regular',
  width: '100%',            // força a largura
  flexShrink: 1,            // permite encolher se necessário
  flexWrap: 'wrap',
},



autorComentario: {
  fontSize: 14,
  color: '#fff',
  fontFamily: 'Raleway_400Regular',
},
autorHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  marginBottom: 6,
},
  listaVertical: {
    paddingHorizontal: 12,
  },

cardComentario: {
  backgroundColor: '#fff',
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  padding: 16,
  width: larguraQuadrado,
  alignSelf: 'center',
  minHeight: 100,
  marginBottom: 12,
  alignItems: 'flex-start', // novo
  
},


dados_enquetes: {
  width: '100%',            // garante limite de largura
  flexDirection: 'column',
  alignItems: 'flex-start',
},
comentarioTextoEnquete: {
  fontSize: 16,
  color: '#000',
  fontFamily: 'Raleway_700Regular',
  fontWeight: 'bold',
  flex: 1,              // <- PERMITE ocupar o espaço restante
  marginTop: 4,
  flexWrap: 'wrap',
},

container_view_enquentes: {
  flexDirection: 'row',
  alignItems: 'flex-start',     // garante topo alinhado
  justifyContent: 'flex-start',
  width: '100%',
},


bolinha: {
  width: 42,
  height: 42,
  borderRadius: 21,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
  marginTop: 2, // pequeno ajuste opcional
},


statusTexto: {
  fontSize: 12,
  color: '#333',
  fontFamily: 'Raleway_700Regular',
  marginLeft: 5,
  marginTop:5,
},
iconInline: {
  marginLeft: 8,
  marginTop:5,
  alignSelf: 'center',      // alinha verticalmente com o texto
},
linkVerMais: {
  color: '#1E90FF', // azul estilo link (você pode usar também '#007AFF' ou '#0645AD')
  fontSize: 14,
  textDecorationLine: 'underline',
  fontFamily: 'Raleway_400Regular',
  marginTop: 8,
  paddingBottom: 100, // espaço extra ao fim

},


});
