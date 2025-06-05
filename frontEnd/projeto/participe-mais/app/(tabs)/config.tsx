import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function Perfil() {
  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com nome */}
      <View style={styles.header}>
        <View>
          <Text style={styles.nome}>Usuário</Text>
          <Text style={styles.subtitulo}>Conta pessoal</Text>
        </View>
        <View style={styles.avatar} />
      </View>

      {/* Seção: Perfil */}
      <Text style={styles.secao}>Perfil</Text>
      <Item texto="Acessar perfil" icon="person-outline" />
      <Item texto="Notificações" icon="notifications-outline" />
      <Item texto="Favoritos" icon="star-outline" />
      <Item texto="Agenda" icon="calendar-outline" />

      {/* Seção: Preferências */}
      <Text style={styles.secao}>Preferências</Text>
      <Item texto="Tema escuro/claro" icon="settings-outline" switchOption />
      <Item texto="Layout de interface" icon="help-circle-outline" />

      {/* Seção: Aplicativo */}
      <Text style={styles.secao}>Aplicativo</Text>
      <Item texto="Central de ajuda" icon="help-circle-outline" />
      <Item texto="Nos envie um feedback" icon="chatbox-ellipses-outline" />
      <Item texto="Privacidade" icon="lock-closed-outline" />

      {/* Sair da conta */}
      <TouchableOpacity style={styles.logout}>
        <Ionicons name="exit-outline" size={20} color="#e60000" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      {/* Rodapé */}
      <Text style={styles.footer}>Todos os direitos reservados{'\n'}para Participe+</Text>
    </ScrollView>
  );
}

type ItemProps = {
  texto: string;
  icon: keyof typeof Ionicons.glyphMap;
  switchOption?: boolean;
};

function Item({ texto, icon, switchOption }: ItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color="#333" style={{ marginRight: 12 }} />
        <Text style={styles.texto}>{texto}</Text>
      </View>
      {switchOption ? (
        <Switch />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  nome: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitulo: {
    fontSize: 14,
    color: '#777',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff4500',
  },
  secao: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoutText: {
    color: '#e60000',
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 24,
  },
});