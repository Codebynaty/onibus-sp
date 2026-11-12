import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Navegacao from './src/navigation';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Navegacao />
    </NavigationContainer>
  );
}
