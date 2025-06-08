import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text} from 'react-native';
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
            <Text style={styles.welcomeText}>
              Bem-vindo à aba de Score! Aqui você se desafia a se tornar um cidadão mais atento, engajado e consciente das propostas públicas.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Seus dados</Text>
          <Text style={styles.scoreNumber}>
            240<Text style={styles.scoreOutOf}>/500</Text>
          </Text>
          <Text style={styles.level}>Nível atual: 4 – Cidadão Participativo</Text>

          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>

          <Text style={styles.sectionTitle}>Próxima recompensa:</Text>
          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>Nível 5{"\n"}"Explorador de Temas"</Text>
          </View>

          <View style={styles.unifiedBox}>
            <Text style={styles.missionsTitle}>Suas Missões</Text>
            <Text style={styles.missionsSubtitle}>
              Conclua as missões para avançar de nível e se tornar um cidadão nato!
            </Text>

            <TouchableOpacity style={styles.missionButtonFilled}>
              <Text style={styles.missionText}>Comente em 2 propostas</Text>
              <Text style={styles.missionXP}>+20 xp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.missionButtonGray}>
              <Text style={styles.missionText}>Vote em 3 temas diferentes</Text>
              <Text style={styles.missionXP}>+30 xp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.missionButtonGray}>
              <Text style={styles.missionText}>Compartilhe uma proposta</Text>
              <Text style={styles.missionXP}>+50 xp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.missionButtonFilled}>
              <Text style={styles.missionText}>Compartilhe o aplicativo</Text>
              <Text style={styles.missionXP}>+100 xp</Text>
            </TouchableOpacity>

            <Text style={styles.linkText}>Ver todas</Text>

            <Text style={styles.sectionTitleBlack}>Níveis</Text>
            <Text style={styles.levelsDescBlack}>
              Veja os níveis que você partiu e onde você pode chegar!
            </Text>

            <View style={styles.levelsListBlack}>
              <Text style={styles.levelItemBlack}>Nível 1: Iniciante Cívico</Text>
              <Text style={styles.levelItemBlack}>Nível 2: Votante Iniciante</Text>
              <Text style={styles.levelItemBlack}>Nível 3: Ativador de Temas</Text>
              <Text style={styles.levelCurrentBlack}>Nível 4: Cidadão Participativo</Text>
              <Text style={styles.levelLockedBlack}>🔒 Nível 6: Construtor de Vozes</Text>
              <Text style={styles.levelLockedBlack}>🔒 Nível 7: Guardião do Debate</Text>
              <Text style={styles.levelLockedBlack}>🔒 Nível 8: Conselheiro Político</Text>
              <Text style={styles.levelLockedBlack}>🔒 Nível 9: Líder Comunitário</Text>
              <Text style={styles.levelLockedBlack}>🔒 Nível 10: Mestre Cívico</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container_maior: {
    flex: 1,
    backgroundColor: '#267DFF',
  },
  container: {
    padding: 16,
    backgroundColor: "#267DFF",
  },
  title: {
    fontSize: 22,
    color: "white",
    alignSelf: "center",
    marginBottom: 16,
    fontFamily: 'Raleway_700Bold',
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
    fontFamily: 'Raleway_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    color: "white",
    marginTop: 16,
    fontFamily: 'Raleway_700Bold',
  },
  sectionTitleBlack: {
    fontSize: 18,
    color: "#000",
    marginTop: 16,
    fontFamily: 'Raleway_700Bold',
  },
  scoreNumber: {
    fontSize: 48,
    color: "white",
    fontFamily: 'Raleway_700Bold',
  },
  scoreOutOf: {
    fontSize: 24,
    fontFamily: 'Raleway_400Regular',
  },
  level: {
    color: "white",
    marginBottom: 8,
    fontFamily: 'Raleway_700Bold',
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
    fontSize: 16,
    textAlign: "center",
    fontFamily: 'Raleway_700Bold',
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
    color: "#333",
    fontFamily: 'Raleway_700Bold',
  },
  missionsSubtitle: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
    fontFamily: 'Raleway_400Regular',
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
    fontFamily: 'Raleway_700Bold',
  },
  missionXP: {
    color: "#555",
    fontFamily: 'Raleway_400Regular',
  },
  linkText: {
    textAlign: "center",
    color: "#267DFF",
    marginTop: 8,
    fontFamily: 'Raleway_700Bold',
  },
  levelsDescBlack: {
    color: "#333",
    marginVertical: 8,
    fontFamily: 'Raleway_400Regular',
  },
  levelsListBlack: {
    borderLeftWidth: 2,
    borderLeftColor: "#267DFF",
    paddingLeft: 8,
  },
  levelItemBlack: {
    color: "#333",
    marginBottom: 4,
    fontFamily: 'Raleway_400Regular',
  },
  levelCurrentBlack: {
    color: "#000",
    marginBottom: 4,
    fontFamily: 'Raleway_700Bold',
  },
  levelLockedBlack: {
    color: "#999",
    marginBottom: 4,
    fontFamily: 'Raleway_400Regular',
  },
});

