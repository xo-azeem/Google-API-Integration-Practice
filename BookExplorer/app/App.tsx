import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../src/theme';
import { StatusBar } from 'expo-status-bar';

// Screens
import ExploreScreen from './(tabs)/explore';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, isDarkMode } = React.useContext(require('../src/theme').ThemeContext);
  
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <NavigationContainer>
          <ExploreScreen />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}