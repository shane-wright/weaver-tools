import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { View, Text, BackHandler, AppState } from 'react-native';
import OutputScreen from '../src/screens/OutputScreen';

// Static flag to prevent duplicate mounting
let isOutputMounted = false;

/**
 * ErrorBoundary to catch and display errors in the component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Output] Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong in Output Screen
          </Text>
          <Text style={{ marginBottom: 10 }}>{this.state.error?.toString()}</Text>
          <Text>{JSON.stringify(this.state.errorInfo?.componentStack).slice(0, 500)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

/**
 * Output route - Animal Flow and physical regimen
 * 
 * This route renders the OutputScreen component from our src/screens directory
 * that provides exercise routines, movement tracking, and physical guides.
 * Route name 'output' matches the file name output.js
 */
export default function Output() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  
  // Prevent duplicate mounting
  useEffect(() => {
    // Check if we're already mounted elsewhere
    if (isOutputMounted) {
      console.log('[Output] Preventing duplicate mount');
      return;
    }
    
    // Set mount flags
    mountedRef.current = true;
    isOutputMounted = true;
    
    console.log('[Output] Screen mounted');
    console.log('[Output] Current pathname:', pathname);
    console.log('[Output] Params:', params);
    
    // Register app state change listener to handle background/foreground transitions
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      console.log('[Output] App state changed:', appStateRef.current, '->', nextAppState);
      appStateRef.current = nextAppState;
    });
    
    // Register back handler for Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('[Output] Back button pressed in Output screen');
      return false; // Let default handler take over
    });
    
    // Set a small delay to ensure we're properly initialized
    const readyTimer = setTimeout(() => {
      setIsReady(true);
      console.log('[Output] Screen ready');
    }, 50);
    
    // Cleanup function
    return () => {
      console.log('[Output] Screen unmounting');
      
      // Clean up all subscriptions and listeners
      appStateSubscription.remove();
      backHandler.remove();
      clearTimeout(readyTimer);
      
      // Reset mount flags
      mountedRef.current = false;
      isOutputMounted = false;
      
      console.log('[Output] Screen unmounted and cleaned up');
    };
  }, []);
  
  // Handle pathname changes separately to avoid full remounts
  useEffect(() => {
    if (mountedRef.current) {
      console.log('[Output] Path changed to:', pathname);
    }
  }, [pathname]);
  
  // Handle params changes separately
  useEffect(() => {
    if (mountedRef.current) {
      console.log('[Output] Params changed:', params);
    }
  }, [params]);

  // Safely check if we should render based on mount state
  const shouldRender = mountedRef.current && isReady;
  
  return (
    <ErrorBoundary>
      {shouldRender ? (
        <OutputScreen 
          route={{ params, name: 'output', path: pathname }} 
          navigation={{ 
            navigate: router.push,
            goBack: () => router.back(),
            addListener: (event, callback) => {
              console.log('[Output] Navigation listener added:', event);
              // Return dummy cleanup function
              return { remove: () => console.log('[Output] Navigation listener removed:', event) };
            }
          }} 
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading Output Screen...</Text>
        </View>
      )}
    </ErrorBoundary>
  );
}
