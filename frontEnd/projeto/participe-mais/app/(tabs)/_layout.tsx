import { Tabs } from 'expo-router';
import React from 'react';
import { Platform,StyleSheet  } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();  // detecta se o tema é claro ou escuro


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,  // cor ativa da tab
        headerShown: false, //esconde o cabeçalho padrão
        tabBarBackground: TabBarBackground, // fundo personalizado para a tab bar
        tabBarStyle: Platform.select({
          ios: { // deixa o fundo transparente no iOS para blur
            
          bottom: 0,
          height: 125,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#ffffffff',
          paddingBottom: 10,
          paddingTop: 35,
          overflow: 'hidden',
          position: 'absolute',
          },
          
          default: {}, // em outras plataformas, usa padrão
        }),
      }}>
        {/* primeira aba: carrega o index.tsx */}
      <Tabs.Screen 
        name="index"
        options={{
          title: '', //nome exibido na aba
          tabBarIcon: ({ color }) => <Octicons name="home" size={29} color="black" />,
        }}
      />
       {/* segunda aba: você ainda não tem o explore.tsx criado, mas está previsto aqui */}
     
      <Tabs.Screen
        name="agenda"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-text-outline" size={29} color="black" />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cards-heart-outline" size={29} color="black" />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={28} color="black" />,
        }}
      />
    </Tabs>
  );
}


