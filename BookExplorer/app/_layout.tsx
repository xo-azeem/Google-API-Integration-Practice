import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '../src/theme';
import { useEffect } from 'react';
import { initializeAdMob } from '../services/admob';

export default function RootLayout() {
  const theme = useAppTheme();

  // Initialize AdMob when the app starts
  useEffect(() => {
    const setupAdMob = async () => {
      await initializeAdMob();
    };
    
    setupAdMob().catch(error => 
      console.error('Failed to initialize AdMob:', error)
    );
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}