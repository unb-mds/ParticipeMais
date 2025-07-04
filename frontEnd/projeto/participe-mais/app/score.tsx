import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { Stack, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Nivel {
  nome: string;
  minimo: number;
}

interface ScoreData {
  pontos: number;
  usuario: string;
}

export default function ScoreScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [nivel, setNivel] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const niveis: Nivel[] = [
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
      fetchScore();
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
        const data: ScoreData = await response.json();
        setScore(data.pontos);
        setNivel(calcularNivel(data.pontos));
        setNome(data.usuario);
      } else if (response.status === 401 || response.status === 403) {
        router.replace('/login');
      } else {
        console.error('Erro ao buscar score:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      router.replace('/login');
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

  const getNivelAtualIndex = (): number => {
    return niveis.findIndex((n, i) => {
      const proximo = niveis[i + 1];
      return !proximo || score < proximo.minimo;
    });
  };

  const getProximoNivel = (): Nivel | null => {
    const nivelAtualIndex = getNivelAtualIndex();
    return niveis[nivelAtualIndex + 1] || null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const nivelAtualIndex = getNivelAtualIndex();
  const proximoNivel = getProximoNivel();
  const progresso = proximoNivel 
    ? (score / proximoNivel.minimo) * 100 
    : 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          {score}<Text style={styles.scoreOutOf}>/{proximoNivel?.minimo || score}</Text>
        </Text>
        <Text style={styles.level}>Nível atual: {nivel}</Text>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
        </View>

        <Text style={styles.sectionTitle}>Próxima recompensa:</Text>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>
            {proximoNivel 
              ? `"${proximoNivel.nome}"` 
              : "Você já está no nível máximo!"}
          </Text>
        </View>

        <View style={styles.unifiedBox}>
          <Text style={styles.missionsTitle}>Suas Missões</Text>
          <Text style={styles.missionsSubtitle}>
            Conclua as missões para avançar de nível e se tornar um cidadão nato!
          </Text>

          <MissionButton 
            title="Comente em 2 propostas" 
            xp="+20 xp" 
            completed={true} 
          />
          <MissionButton 
            title="Vote em 3 temas diferentes" 
            xp="+30 xp" 
            completed={false} 
          />
          <MissionButton 
            title="Compartilhe uma proposta" 
            xp="+50 xp" 
            completed={false} 
          />
          <MissionButton 
            title="Compartilhe o aplicativo" 
            xp="+100 xp" 
            completed={true} 
          />

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

const MissionButton = ({ title, xp, completed }: { title: string; xp: string; completed: boolean }) => (
  <TouchableOpacity style={[
    styles.missionButton, 
    completed ? styles.missionButtonFilled : styles.missionButtonGray
  ]}>
    <Text style={styles.missionText}>{title}</Text>
    <Text style={styles.missionXP}>{xp}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#267DFF',
  },
  scrollContent: {
    padding: 16,
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
  missionButton: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  missionButtonFilled: {
    backgroundColor: "#267DFF",
  },
  missionButtonGray: {
    backgroundColor: "#dcdcdc",
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