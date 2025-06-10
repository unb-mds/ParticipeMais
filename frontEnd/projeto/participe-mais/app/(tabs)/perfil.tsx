import {View,Text,StyleSheet,TouchableOpacity,TextInput,Image,Alert,Dimensions, ScrollView} 
from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { useFonts, Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';

const SCREEN_WIDTH = Dimensions.get('window').width;
const larguraTela = SCREEN_WIDTH * 1; // 95% da tela

export default function PerfilScreen() {

  const router = useRouter();

  const campos = ["nome", "email", "senha"] as const;
  type Campo = typeof campos[number];

  const [dados, setDados] = useState({
    nome: "Fulanin de Souza Pires",
    email: "Fulanin@gmail.com",
    senha: "*************",
  });

  const [editando, setEditando] = useState({
    nome: false,
    email: false,
    senha: false,
  });

  const [formEditado, setFormEditado] = useState(false);

  const handleEdit = (campo: Campo) => {
    console.log("Editando campo:", campo);
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  const handleChange = (campo: Campo, valor: string) => {
    console.log(`Alterando ${campo}: ${valor}`);
    setDados((prev) => ({ ...prev, [campo]: valor }));
    setFormEditado(true);
  };

  const handleSalvar = () => {
    console.log("Salvando dados:", dados);
    setEditando({
      nome: false,
      email: false,
      senha: false,
    });
    setFormEditado(false);
    Alert.alert("Sucesso", "Dados salvos com sucesso!");
  };

  return (
    <ScrollView style={styles.estiloTUdo}>
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>
      <View style={styles.linhaCinza} />


      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: "https://i.imgur.com/0y8Ftya.png" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => console.log("Editar foto")}>
            <Feather name="edit-2" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>Fulanin123</Text>
          <Text style={styles.level}>Nível 4 - Cidadão Ativo</Text>
        </View>
      </View>


      <View style={styles.xpCard}>
        <Text style={styles.textoAbaixo}>Nivel 4: Cidadão Ativo</Text>

        <View style={styles.linhaXp}>
          <View style={styles.barraFundo}>
            <View style={[styles.barraXp, { width: '50%' }]} /> 
          </View>
          <Text style={styles.texto_barra}>240 / 500 xp</Text>
        </View>
      </View>



      <Text style={styles.sectionTitle}>Seus dados</Text>

          {campos.map((campo: Campo) => (
            <View key={campo} style={styles.field}>
              <Text style={styles.label}>
                {campo === "nome"
                  ? "Nome completo"
                  : campo === "email"
                  ? "E-mail"
                  : campo === "senha"
                  ? "Senha"
                  : "Data de nascimento"}
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputRow}>
                  <Text style={styles.input}>
                    {campo === 'senha' ? '*************' : dados[campo]}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.editIconOutside}
                  onPress={() => {
                    if (campo === 'nome') router.push('/alterar-nome');
                    else if (campo === 'email') router.push('/alterar-email');
                    else if (campo === 'senha') router.push('/alterarSenha');
                  }}
                >
              <Octicons name="pencil" size={24} color="black" />  
              </TouchableOpacity>
              </View>
            </View>
          ))}




      {formEditado && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  estiloTUdo:{
    backgroundColor: "#fff"
  },
  container: { flex: 1,
     padding: 20, 
     backgroundColor: "#fff" },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Raleway_700Bold",
      marginTop: 40, // <--- adicionado
      

  },
  linhaCinza: {
  height: 1,
  backgroundColor: '#ccc',
  marginBottom: 12,
  width: larguraTela,
  alignSelf: 'center',
},

  profileSection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  gap: 40, // ou use marginLeft no avatar, se preferir
  marginTop: 15
  
},
  userInfo: {
    
  flexDirection: 'column',
  justifyContent: 'center',
},

avatarWrapper: {
  position: 'relative',
},

  avatar: { width: 80, height: 80, borderRadius: 40 },

  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 4,
  },
  username: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: "Raleway_400Bold",
    paddingHorizontal: 5,     // espaço lateral interno
    color:"#3A3A3A"

  },
level: {
  marginTop: 10,
  fontSize: 14,
  color: "#333",
  borderColor: "#ccc",       // cor da borda
  borderWidth: 1,            // <-- necessário para exibir a borda
  borderRadius: 12,
  paddingHorizontal: 5,     // espaço lateral interno
  paddingVertical: 4,        // espaço vertical interno
  fontFamily: "Raleway_400Regular",
  alignSelf: 'flex-start',
},


xpCard: {
  backgroundColor: "#1976D2",
  borderRadius: 30,
  padding: 20,
  alignItems: "flex-start", // <-- alinhamento à esquerda
  marginBottom: 20,
  gap:10,

},
textoAbaixo: {
  color: '#fff',
  fontSize: 14,
  fontFamily: 'Raleway_400Regular',
  marginBottom: 8,
},
linhaXp: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
},
barraFundo: {
  flex: 1,
  height: 15,
  backgroundColor: '#8BC34A',
  borderRadius: 10,
  overflow: 'hidden',
  marginRight: 8,   // espaço entre barra e o texto ao lado
},
  xpText: {
    color: "#fff",
    fontFamily: "Raleway_700Bold",
  },
  xpBarBackground: {

    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  xpAmount: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#666",
    fontFamily: "Raleway_700Bold",
  },
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    fontFamily: "Raleway_400Regular",
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },

barraXp: {
  height: '100%',
  backgroundColor: '#4CAF50',
  borderRadius: 10,
},

texto_barra: {
  color: '#fff',
  fontSize: 12,
  fontFamily: 'Raleway_400Regular',
},
inputFieldRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

editIconWrapper: {
  marginLeft: 10,
  padding: 6,
},

input: {
  flex: 1,
  fontSize: 16,
  fontFamily: 'Raleway_400Regular',
  color: '#333',
},


lapisIcon: {
  padding: 6,
},
inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

inputRow: {
  flex: 1,
  backgroundColor: "#eee",
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 15,
  justifyContent: 'center',
},

editIconOutside: {
  marginLeft: 12,
  padding: 8,
},

});

