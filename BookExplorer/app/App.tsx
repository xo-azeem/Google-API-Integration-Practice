import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '../src/theme';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

// Screens
import ExploreScreen from './(tabs)/explore';

export default function App() {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer>
          <ExploreScreen />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}