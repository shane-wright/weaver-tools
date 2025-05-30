import React, { useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  AccessibilityInfo
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

/**
 * FABButton - Primary floating action button component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the FAB menu is expanded
 * @param {Function} props.onPress - Function to call when the FAB is pressed
 * @param {string} props.icon - Icon name to display (from Ionicons)
 * @param {Object} props.style - Additional styles for the FAB container
 * @param {string} props.accessibilityLabel - Accessibility label for screen readers
 */
const FABButton = ({
  isOpen = false,
  onPress,
  icon = 'add',
  style,
  accessibilityLabel = 'Floating action button'
}) => {
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Update animations when isOpen changes
  useEffect(() => {
    rotation.value = withSpring(isOpen ? 1 : 0);
    scale.value = withSpring(isOpen ? 0.9 : 1);
  }, [isOpen, rotation, scale]);

  // Handle FAB press with haptic feedback
  const handlePress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Call onPress handler
    if (onPress) {
      onPress();
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          rotate: `${rotation.value * 45}deg` 
        },
        { 
          scale: scale.value 
        }
      ]
    };
  });

  // Check if screen reader is enabled
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);
  
  useEffect(() => {
    // Get initial screen reader status
    AccessibilityInfo.isScreenReaderEnabled().then(
      screenReaderEnabled => {
        setIsScreenReaderEnabled(screenReaderEnabled);
      }
    );
    
    // Listen for screen reader status changes
    const listener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      screenReaderEnabled => {
        setIsScreenReaderEnabled(screenReaderEnabled);
      }
    );
    
    return () => {
      // Clean up listener
      listener.remove();
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.touchableArea}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={isOpen ? "Close navigation menu" : "Open navigation menu"}
        accessibilityState={{ expanded: isOpen }}
      >
        <Reanimated.View style={[styles.fabButton, animatedStyle]}>
          <MaterialIcons name={icon} size={24} color="white" />
        </Reanimated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  touchableArea: {
    width: 56, 
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});

export default FABButton;

