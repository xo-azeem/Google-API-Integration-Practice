import React, { createContext, useContext, useState, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

// Light theme colors
const lightThemeColors = {
  primary: '#2E5A88',        // Deep blue
  onPrimary: '#FFFFFF',
  primaryContainer: '#D6E3FF',
  onPrimaryContainer: '#001A42',
  secondary: '#535F70',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D6E3F7',
  onSecondaryContainer: '#101C2B',
  tertiary: '#6E5676',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F5D9FF',
  onTertiaryContainer: '#251431',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#F8FAFF',
  onBackground: '#1A1C1E',
  surface: '#FDFCFF',
  onSurface: '#1A1C1E',
  outline: '#73777F',
  surfaceVariant: '#E0E2EC',
  onSurfaceVariant: '#43474E',
};

// Dark theme colors
const darkThemeColors = {
  primary: '#ADC7FF',        // Light blue
  onPrimary: '#002E6A',
  primaryContainer: '#19427B',
  onPrimaryContainer: '#D6E3FF',
  secondary: '#B9C8DA',
  onSecondary: '#253141',
  secondaryContainer: '#3C4858',
  onSecondaryContainer: '#D6E3F7',
  tertiary: '#D9BDE1',
  onTertiary: '#3C2947',
  tertiaryContainer: '#543E5C',
  onTertiaryContainer: '#F5D9FF',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#1A1C1E',
  onBackground: '#E3E2E6',
  surface: '#121315',
  onSurface: '#E3E2E6',
  outline: '#8C9198',
  surfaceVariant: '#43474E',
  onSurfaceVariant: '#C4C6D0',
};

// Create light and dark themes
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightThemeColors,
  },
  roundness: 8,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkThemeColors,
  },
  roundness: 8,
};

// Create context for theme management
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Update theme based on system changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Get current theme based on mode
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};