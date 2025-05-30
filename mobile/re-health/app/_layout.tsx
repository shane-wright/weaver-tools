// Import Reanimated first to ensure proper initialization
import 'react-native-reanimated';
// For debugging Reanimated initialization
console.log('[Reanimated] Initializing Reanimated plugin');

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import FABNavigator from '../src/components/navigation/FABNavigator';

export default function RootLayout() {
  // Log platform information for debugging
  useEffect(() => {
    console.log('[App] Initializing RootLayout');
    console.log('[App] Platform:', Platform.OS, Platform.Version);
    console.log('[App] Running in', __DEV__ ? 'development' : 'production', 'mode');
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  const pathname = usePathname();
  
  // Debug logging for navigation state changes
  useEffect(() => {
    console.log('[Navigation] Current route:', pathname);
    
    // Log when navigation occurs
    const handleRouteChange = () => {
      console.log('[Navigation] Route changed to:', pathname);
    };
    
    // This effect runs whenever pathname changes
    handleRouteChange();
    
    return () => {
      console.log('[Navigation] Leaving route:', pathname);
    };
  }, [pathname]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: true, // Show headers for each screen
            // Add animation for transitions
            animation: 'slide_from_right',
          }}
          // Add navigation state change logging
          onStateChange={(state) => {
            console.log('[Navigation] Stack state changed:', state?.routes[state.index]?.name);
          }}
        >
          {/* Note: Stack.Screen name must match the file name in the app directory */}
          {/* The 'index' route corresponds to the root '/' path */}
          <Stack.Screen name="index" options={{ title: 'Re-Health' }} />
          
          {/* The 'intake' route matches app/intake.js */}
          <Stack.Screen name="intake" options={{ title: 'Intake' }} />
          
          {/* The 'output' route matches app/output.js */}
          <Stack.Screen name="output" options={{ title: 'Output' }} />
          
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
        <FABNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
