import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ScoreScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [nivel, setNivel] = useState('');
  const [token, setToken] = useState('');
  const [nome, setNome] = useState('');

  useEffect(() => {
  const obterToken = async () => {
    try {
      const tokenSalvo = await AsyncStorage.getItem('accessToken');
      if (tokenSalvo) {
        setToken(tokenSalvo);
      } else {
        console.error("Token não encontrado");
        router.replace('/login');
      }
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      router.replace('/login');
    }
  };

  obterToken();
}, []);

useEffect(() => {
  if (token) {
    fetchScore(); // Só chama quando o token estiver disponível
  }
}, [token]);

const fetchScore = async () => {
  try {
    const response = await fetch('http://localhost:8000/comunidade/score/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      const data = await response.json();
      setScore(data.pontos);
      setNivel(calcularNivel(data.pontos));
      setNome(data.usuario);
    } else if (response.status === 401 || response.status === 403) {
        // Token inválido ou expirado
        router.replace('/login');
      } else {
      console.error('Erro ao buscar score:', response.status);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    router.replace('/login'); // Erros genéricos também levam à tela de login
  } finally {
    setLoading(false);
  }
};

  const calcularNivel = (pontos: number): string => {
  if (pontos < 50) return "1 – Iniciante Cívico";
  if (pontos < 100) return "2 – Votante Iniciante";
  if (pontos < 150) return "3 – Ativador de Temas";
  if (pontos < 250) return "4 – Cidadão Participativo";
  if (pontos < 350) return "5 – Explorador de Temas";
  return "6 – Construtor de Vozes";
};

  if (loading) {
    return (
      <View style={styles.container_maior}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const niveis = [
  { nome: "Nível 1: Iniciante Cívico", minimo: 0 },
  { nome: "Nível 2: Votante Iniciante", minimo: 50 },
  { nome: "Nível 3: Ativador de Temas", minimo: 100 },
  { nome: "Nível 4: Cidadão Participativo", minimo: 150 },
  { nome: "Nível 5: Explorador de Temas", minimo: 250 },
  { nome: "Nível 6: Construtor de Vozes", minimo: 350 },
  { nome: "Nível 7: Guardião do Debate", minimo: 450 },
  { nome: "Nível 8: Conselheiro Político", minimo: 550 },
  { nome: "Nível 9: Líder Comunitário", minimo: 650 },
  { nome: "Nível 10: Mestre Cívico", minimo: 800 },
];

const nivelAtualIndex = niveis.findIndex((n, i) => {
  const proximo = niveis[i + 1];
  return !proximo || score < proximo.minimo;
});

const getProximoNivel = (pontos: number) => {
  for (let i = 0; i < niveis.length; i++) {
    const nivelAtual = niveis[i];
    const proximoNivel = niveis[i + 1];

    if (proximoNivel && pontos < proximoNivel.minimo) {
      return proximoNivel;
    }
  }
  return null; // Já está no nível máximo
};


  return (
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
            Bem-vindo à aba de Score{nome ? `, ${nome}` : ""}! Aqui você se desafia a se tornar um cidadão mais atento, engajado e consciente das propostas públicas.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Seus dados</Text>
        
        <Text style={styles.scoreNumber}>
          {score}<Text style={styles.scoreOutOf}>/500</Text>
        </Text>
        <Text style={styles.level}>Nível atual: {nivel}</Text>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${(score / 500) * 100}%` }]} />
        </View>

        <Text style={styles.sectionTitle}>Próxima recompensa:</Text>
          {getProximoNivel(score) ? (
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>
            Nível {getProximoNivel(score)?.nome}"
          </Text>
        </View>
      ) : (
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>Você já está no nível máximo!</Text>
        </View>
      )}

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
              {niveis.map((n, i) => {
                if (i < nivelAtualIndex) {
                  return <Text key={i} style={styles.levelItemBlack}>{n.nome}</Text>;
                } else if (i === nivelAtualIndex) {
                  return <Text key={i} style={styles.levelCurrentBlack}>{n.nome}</Text>;
                } else {
                  return <Text key={i} style={styles.levelLockedBlack}>🔒 {n.nome}</Text>;
                }
              })}
            </View>
          </View>
      </ScrollView>
    </View>

    
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

