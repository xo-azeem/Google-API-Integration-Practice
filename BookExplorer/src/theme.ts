import { MD3LightTheme } from 'react-native-paper';

// Enhanced light theme colors - more pleasing to the eye
const lightThemeColors = {
  primary: '#4285F4',         // Google blue - pleasing and familiar
  onPrimary: '#FFFFFF',
  primaryContainer: '#E8F0FE', // Lighter blue container
  onPrimaryContainer: '#0D2C76',
  secondary: '#34A853',       // Google green
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E6F4EA', // Light green container
  onSecondaryContainer: '#0D5F2D',
  tertiary: '#EA4335',        // Google red for accent
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FCEAE9', // Light red container
  onTertiaryContainer: '#7E1E15',
  error: '#EA4335',           // Google red for error
  onError: '#FFFFFF',
  errorContainer: '#FCEAE9',
  onErrorContainer: '#7E1E15',
  background: '#FFFFFF',      // Pure white background
  onBackground: '#202124',    // Dark gray for text
  surface: '#FFFFFF',         // Pure white for surfaces
  onSurface: '#202124',       // Dark gray for text on surfaces
  outline: '#DADCE0',         // Light gray outline
  surfaceVariant: '#F8F9FA',  // Very light gray surface variant
  onSurfaceVariant: '#5F6368', // Medium gray for secondary text
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',        // Pure white
    level2: '#F8F9FA',        // Very light gray
    level3: '#F1F3F4',        // Light gray
    level4: '#ECEFF1',        // Slightly darker light gray
    level5: '#E8EAED',        // Medium light gray
  },
};

export const useAppTheme = () => {
  // Always return light theme because dark mode is not supported as there is no dark mode in the app
  // and the app is designed to be light-themed.
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...lightThemeColors,
    },
    roundness: 14, // Increased roundness for softer UI
    animation: {
      scale: 1.0,
    },
    fonts: {
      ...MD3LightTheme.fonts,
      // Enhance typography
      bodyLarge: { 
        ...MD3LightTheme.fonts.bodyLarge, 
        fontWeight: '400',
        letterSpacing: 0.15,
      },
      bodyMedium: { 
        ...MD3LightTheme.fonts.bodyMedium,
        fontWeight: '400',
        letterSpacing: 0.25,
      },
      titleLarge: {
        ...MD3LightTheme.fonts.titleLarge,
        fontWeight: '500',
        letterSpacing: 0,
      },
      titleMedium: {
        ...MD3LightTheme.fonts.titleMedium,
        fontWeight: '500',
        letterSpacing: 0.15,
      },
    },
  };
};