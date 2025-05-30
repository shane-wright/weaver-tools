import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableWithoutFeedback, 
  StyleSheet, 
  Dimensions,
  BackHandler as RNBackHandler,
  Platform
} from 'react-native';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import components
import FABButton from './FABButton';
import NavigationOptions from './NavigationOptions';

const { width, height } = Dimensions.get('window');

/**
 * FABNavigator - Main navigation component that combines the FAB button and navigation options
 */
const FABNavigator = () => {
  // State for menu expansion
  const [isOpen, setIsOpen] = useState(false);
  
  // Get safe area insets for proper positioning
  const insets = useSafeAreaInsets();
  
  // Animation value for background overlay
  const overlayOpacity = useSharedValue(0);
  
  // Toggle menu state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu
  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };
  
  // Handle back button press to close menu if open (Android only)
  useEffect(() => {
    // Only set up back button handler on Android
    if (Platform.OS === 'android') {
      const handleBackPress = () => {
        if (isOpen) {
          closeMenu();
          return true; // Prevent default back action
        }
        return false; // Allow default back action
      };
      
      // Add back button handler for Android
      const backHandler = RNBackHandler.addEventListener('hardwareBackPress', handleBackPress);
      
      // Return cleanup function that uses the subscription
      return () => backHandler.remove();
    }
  }, [isOpen, closeMenu]);
  
  // Update overlay opacity when menu state changes
  useEffect(() => {
    overlayOpacity.value = withTiming(
      isOpen ? 0.5 : 0, 
      { 
        duration: 300,
        easing: Easing.inOut(Easing.quad)
      }
    );
  }, [isOpen, overlayOpacity]);
  
  // Animated style for background overlay
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
      // Only receive touches when visible
      // This prevents touches from being blocked when the overlay is invisible
      pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none'
    };
  });
  
  return (
    <>
      {/* Background overlay/scrim */}
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Reanimated.View 
          style={[
            styles.overlay,
            overlayStyle
          ]} 
        />
      </TouchableWithoutFeedback>
      
      {/* Main container positioned with safe area insets */}
      <View
        style={[
          styles.container,
          {
            bottom: Math.max(insets.bottom, 16),
            right: Math.max(insets.right, 16)
          }
        ]}
        pointerEvents="box-none"
      >
        {/* Navigation options (menu items) */}
        <NavigationOptions 
          isOpen={isOpen} 
          onOptionPress={closeMenu}
        />
        
        {/* Main FAB button */}
        <FABButton 
          isOpen={isOpen}
          onPress={toggleMenu}
          icon="menu"
          accessibilityLabel="Navigation menu"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
  }
});

export default FABNavigator;

