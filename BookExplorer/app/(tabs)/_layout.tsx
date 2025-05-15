import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: { 
          elevation: 2,
          shadowOpacity: 0.1,
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={size+4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-search" size={size+4} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}