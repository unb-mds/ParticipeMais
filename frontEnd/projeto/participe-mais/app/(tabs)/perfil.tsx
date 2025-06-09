import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { useFonts, Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';

const PerfilScreen = () => {
  const router = useRouter();

  const campos = ["nome", "email", "senha", "nascimento"] as const;
  type Campo = typeof campos[number];

  const [dados, setDados] = useState({
    nome: "Fulanin de Souza Pires",
    email: "Fulanin@gmail.com",
    senha: "*************",
    nascimento: "10/08/2004",
  });

  const [editando, setEditando] = useState({
    nome: false,
    email: false,
    senha: false,
    nascimento: false,
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
      nascimento: false,
    });
    setFormEditado(false);
    Alert.alert("Sucesso", "Dados salvos com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>

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
        <Text style={styles.username}>Fulanin123</Text>
        <Text style={styles.level}>Nível 4 - Cidadão Ativo</Text>
      </View>

      <View style={styles.xpCard}>
        <Text style={styles.xpText}>Nível 4: Cidadão Ativo</Text>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: "48%" }]} />
        </View>
        <Text style={styles.xpAmount}>240 / 500 xp</Text>
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
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={dados[campo]}
              editable={editando[campo]}
              secureTextEntry={campo === "senha" && !editando[campo]}
              onChangeText={(text) => handleChange(campo, text)}
            />
            <TouchableOpacity onPress={() => handleEdit(campo)}>
              <Feather name="edit-2" size={16} color="#000" />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Raleway_700Bold",
  },
  profileSection: { alignItems: "center", marginBottom: 20 },
  avatarWrapper: { position: "relative" },
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
    fontSize: 18,
    marginTop: 8,
    fontFamily: "Raleway_700Bold",
  },
  level: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Raleway_400Regular",
  },
  xpCard: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  xpText: {
    color: "#fff",
    fontFamily: "Raleway_700Bold",
  },
  xpBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
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
});

export default PerfilScreen;
