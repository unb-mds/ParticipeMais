import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons"; 

const PerfilScreen = () => {
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

  const handleEdit = (campo: string) => {
    setEditando((prev) => ({ ...prev, [campo]: true }));
  };

  const handleChange = (campo: string, valor: string) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    setFormEditado(true);
  };

  const handleSalvar = () => {
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

      {/* Foto e nome */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: "https://i.imgur.com/your-profile-image.png" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Feather name="edit-2" size={14} color="#fff" /> {/* ⬅️ Ícone corrigido */}
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>Fulanin123</Text>
        <Text style={styles.level}>Nível 4 - Cidadão Ativo</Text>
      </View>

      {/* XP */}
      <View style={styles.xpCard}>
        <Text style={styles.xpText}>Nível 4: Cidadão Ativo</Text>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: "48%" }]} />
        </View>
        <Text style={styles.xpAmount}>240 / 500 xp</Text>
      </View>

      <Text style={styles.sectionTitle}>Seus dados</Text>

      {/* Campos */}
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
              <Feather name="edit-2" size={16} color="#000" /> {/* ⬅️ Ícone corrigido */}
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botão de Salvar */}
      {formEditado && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Raleway_700Bold", // título principal
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
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
    fontFamily: "Raleway_700Bold", // nome do usuário
  },
  level: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Raleway_400Regular", // nível do usuário
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
    fontFamily: "Raleway_700Bold", // XP em destaque
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
    fontFamily: "Raleway_400Regular", // valor do XP
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#666",
    fontFamily: "Raleway_700Bold", // título de seção
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    fontFamily: "Raleway_400Regular", // rótulo de campo
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
    fontFamily: "Raleway_400Regular", // texto de input
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
    fontFamily: "Raleway_700Bold", // texto do botão
  },
});


export default PerfilScreen;