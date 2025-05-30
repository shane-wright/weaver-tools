import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import IntakeScreen from './src/screens/IntakeScreen';
import OutputScreen from './src/screens/OutputScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Re-Health' }} 
          />
          <Stack.Screen 
            name="Intake" 
            component={IntakeScreen} 
            options={{ title: 'Intake' }} 
          />
          <Stack.Screen 
            name="Output" 
            component={OutputScreen} 
            options={{ title: 'Output' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

