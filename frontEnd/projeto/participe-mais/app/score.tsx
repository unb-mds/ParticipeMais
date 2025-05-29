import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Stack } from "expo-router";


export default function ScoreScreen() {
  return (
    <>
    <View style={styles.container_maior}>
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: "Score",
          headerBackTitle: "Voltar",
        }}
      />

      <View style={styles.welcomeBox}>
        <ThemedText style={styles.welcomeText}>
          Bem-vindo à aba de Score! Aqui você se desafia a se tornar um cidadão mais atento, engajado e consciente das propostas públicas.
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Seus dados</ThemedText>
      <ThemedText style={styles.scoreNumber}>
        240<ThemedText style={styles.scoreOutOf}>/500</ThemedText>
      </ThemedText>
      <ThemedText style={styles.level}>Nível atual: 4 – Cidadão Participativo</ThemedText>

      <View style={styles.progressBarBackground}>
        <View style={styles.progressBarFill} />
      </View>

      <ThemedText style={styles.sectionTitle}>Próxima recompensa:</ThemedText>
      <View style={styles.rewardBox}>
        <ThemedText style={styles.rewardText}>Nível 5{"\n"}"Explorador de Temas"</ThemedText>
      </View>

      <View style={styles.unifiedBox}>
        <ThemedText style={styles.missionsTitle}>Suas Missões</ThemedText>
        <ThemedText style={styles.missionsSubtitle}>
          Conclua as missões para avançar de nível e se tornar um cidadão nato!
        </ThemedText>


        <TouchableOpacity style={styles.missionButtonFilled}>
          <ThemedText style={styles.missionText}>Comente em 2 propostas</ThemedText>
          <ThemedText style={styles.missionXP}>+20 xp</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.missionButtonGray}>
          <ThemedText style={styles.missionText}>Vote em 3 temas diferentes</ThemedText>
          <ThemedText style={styles.missionXP}>+30 xp</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.missionButtonGray}>
          <ThemedText style={styles.missionText}>Compartilhe uma proposta</ThemedText>
          <ThemedText style={styles.missionXP}>+50 xp</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.missionButtonFilled}>
          <ThemedText style={styles.missionText}>Compartilhe o aplicativo</ThemedText>
          <ThemedText style={styles.missionXP}>+100 xp</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.linkText}>Ver todas</ThemedText>

        <ThemedText style={styles.sectionTitleBlack}>Níveis</ThemedText>
        <ThemedText style={styles.levelsDescBlack}>
          Veja os níveis que você partiu e onde você pode chegar!
        </ThemedText>


        <View style={styles.levelsListBlack}>
          <ThemedText style={styles.levelItemBlack}>Nível 1: Iniciante Cívico</ThemedText>
          <ThemedText style={styles.levelItemBlack}>Nível 2: Votante Iniciante</ThemedText>
          <ThemedText style={styles.levelItemBlack}>Nível 3: Ativador de Temas</ThemedText>
          <ThemedText style={styles.levelCurrentBlack}>Nível 4: Cidadão Participativo</ThemedText>
          <ThemedText style={styles.levelLockedBlack}>🔒 Nível 6: Construtor de Vozes</ThemedText>
          <ThemedText style={styles.levelLockedBlack}>🔒 Nível 7: Guardião do Debate</ThemedText>
          <ThemedText style={styles.levelLockedBlack}>🔒 Nível 8: Conselheiro Político</ThemedText>
          <ThemedText style={styles.levelLockedBlack}>🔒 Nível 9: Líder Comunitário</ThemedText>
          <ThemedText style={styles.levelLockedBlack}>🔒 Nível 10: Mestre Cívico</ThemedText>


        </View>
      </View>
    </ScrollView>
    </View>
    </>
  );
}


const styles = StyleSheet.create({
  container_maior:{
 flex: 1,
  backgroundColor: '#267DFF',
  }
,  container: {
    padding: 16,
    backgroundColor: "#267DFF",
  },
  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 16,
  },
  welcomeBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
  },
  sectionTitleBlack: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  scoreOutOf: {
    fontSize: 24,
    fontWeight: "normal",
  },
  level: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBarBackground: {
    backgroundColor: "#b0d6b0",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  rewardBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  rewardText: {
    color: "#267DFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  unifiedBox: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  missionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  missionsSubtitle: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },
  missionButtonFilled: {
    backgroundColor: "#267DFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  missionButtonGray: {
    backgroundColor: "#dcdcdc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  missionText: {
    color: "#000",
    fontWeight: "bold",
  },
  missionXP: {
    color: "#555",
  },
  linkText: {
    textAlign: "center",
    color: "#267DFF",
    marginTop: 8,
    fontWeight: "bold",
  },
  levelsDescBlack: {
    color: "#333",
    marginVertical: 8,
  },
  levelsListBlack: {
    borderLeftWidth: 2,
    borderLeftColor: "#267DFF",
    paddingLeft: 8,
  },
  levelItemBlack: {
    color: "#333",
    marginBottom: 4,
  },
  levelCurrentBlack: {
    color: "#000",
    fontWeight: "bold",
    marginBottom: 4,
  },
  levelLockedBlack: {
    color: "#999",
    marginBottom: 4,
  },
});
