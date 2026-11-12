import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme';

import BuscaScreen from '../screens/BuscaScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import LinhaScreen from '../screens/LinhaScreen';
import ParadaScreen from '../screens/ParadaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icones = { Buscar: 'search', Favoritos: 'star', Histórico: 'time' };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: '#fff',
        tabBarActiveTintColor: cores.primaria,
        tabBarIcon: ({ color, size }) => <Ionicons name={icones[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Buscar" component={BuscaScreen} options={{ title: 'Buscar linha' }} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Histórico" component={HistoricoScreen} />
    </Tab.Navigator>
  );
}

export default function Navegacao() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Linha" component={LinhaScreen} options={{ title: 'Linha' }} />
      <Stack.Screen name="Parada" component={ParadaScreen} options={{ title: 'Previsão de chegada' }} />
    </Stack.Navigator>
  );
}
