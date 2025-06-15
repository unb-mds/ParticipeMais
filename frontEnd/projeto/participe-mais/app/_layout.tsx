import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Carrega as variações da fonte Raleway
  const [loaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  });

  if (!loaded) {
    return null; // ou exiba uma tela de splash/loading aqui
  }

  return (
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(boas_vindas)" options={{ headerShown: false }} />
    </Stack>
    
  );
}
