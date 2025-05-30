import React, { useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Navigation options configuration - using exact file names for routes
const MENU_ITEMS = [
  {
    id: 'home',
    label: 'Home', 
    icon: 'home',
    href: 'index' // matches app/index.tsx (root route)
  },
  {
    id: 'intake',
    label: 'Intake',
    icon: 'restaurant',
    href: 'intake' // matches app/intake.js
  },
  {
    id: 'output',
    label: 'Output',
    icon: 'fitness-center',
    href: 'output' // matches app/output.js
  }
];

/**
 * NavigationOptions - Expandable menu items for the floating action button
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is expanded
 * @param {Function} props.onOptionPress - Callback when an option is selected
 */
const NavigationOptions = ({ 
  isOpen = false,
  onOptionPress
}) => {
  const router = useRouter();
  
  // Navigate to the selected screen
  const handleNavigate = (href) => {
    // Add detailed debug logging
    console.log('[FAB Navigation] Navigating to:', href);
    console.log('[FAB Navigation] Current route structure:', MENU_ITEMS.map(item => item.href).join(', '));
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Close the menu via callback
    if (onOptionPress) {
      console.log('[FAB Navigation] Closing menu');
      onOptionPress();
    }
    
    try {
      // Special handling for index route (home)
      if (href === 'index') {
        console.log('[FAB Navigation] Replacing with home route');
        router.replace('/');
      } else {
        // For other routes, use the href directly
        console.log('[FAB Navigation] Replacing route with router.replace:', href);
        router.replace(href);
      }
      console.log('[FAB Navigation] Navigation successful');
    } catch (error) {
      console.error('[FAB Navigation] Navigation error:', error);
      
      // Attempt multiple navigation formats as fallback
      try {
        console.log('[FAB Navigation] Attempting alternative navigation methods');
        
        // Try different path formats based on the route
        if (href === 'index' || href === '/') {
          console.log('[FAB Navigation] Trying root path formats');
          // Try multiple variations of the home route
          const homeVariations = ['/', '/index', 'index'];
          for (const variation of homeVariations) {
            try {
              console.log('[FAB Navigation] Trying:', variation);
              router.replace(variation);
              console.log('[FAB Navigation] Success with:', variation);
              return; // Exit if successful
            } catch (e) {
              console.log('[FAB Navigation] Failed with:', variation, e.message);
            }
          }
        } else {
          // For other routes, try with and without leading slash
          const variations = [
            href,                   // As is (e.g., 'output')
            '/' + href,             // With leading slash (e.g., '/output')
            '/' + href + '/index',  // Deep path format (e.g., '/output/index')
            href + '/index'         // Alternative deep path (e.g., 'output/index')
          ];
          
          for (const variation of variations) {
            try {
              console.log('[FAB Navigation] Trying:', variation);
              router.replace(variation);
              console.log('[FAB Navigation] Success with:', variation);
              return; // Exit if successful
            } catch (e) {
              console.log('[FAB Navigation] Failed with:', variation, e.message);
            }
          }
        }
        
        // If we get here, all variations failed
        console.error('[FAB Navigation] All navigation attempts failed');
      } catch (fallbackError) {
        console.error('[FAB Navigation] Fallback navigation failed:', fallbackError);
      }
    }
  };
  
  // Special debug handler for the Output option
  const handleOutputPress = () => {
    console.log('[FAB Navigation] Output button pressed');
    console.log('[FAB Navigation] Attempting direct navigation to output');
    
    // Try different paths for output navigation
    try {
      router.replace('output');
      console.log('[FAB Navigation] Direct output navigation succeeded');
    } catch (error) {
      console.error('[FAB Navigation] Direct output navigation failed:', error);
      try {
        console.log('[FAB Navigation] Trying with slash');
        router.replace('/output');
      } catch (error2) {
        console.error('[FAB Navigation] Slash navigation failed too:', error2);
      }
    }
  };
  
  // Log menu items as they're being created
  useEffect(() => {
    console.log('[FAB Navigation] Menu items initialized:', 
      MENU_ITEMS.map(item => `${item.id}(${item.href})`).join(', '));
  }, []);
  
  // Add logging for touch events to debug hit testing
  const logTouchEvent = (event, name) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    console.log(`[FAB Navigation] Touch ${name}: loc(${locationX.toFixed(0)},${locationY.toFixed(0)}) page(${pageX.toFixed(0)},${pageY.toFixed(0)})`);
  };
  
  return (
    <View 
      style={styles.container}
      onStartShouldSetResponder={() => {
        console.log('[FAB Navigation] Container responding to touch');
        return false; // Let touches pass through
      }}
    >
      {/* Render regular menu items */}
      {MENU_ITEMS.filter(item => item.id !== 'output').map((item, index) => {
        console.log(`[FAB Navigation] Rendering regular menu item: ${item.id} (${index})`);
        
        return (
          <MenuItem 
            key={item.id}
            item={item}
            index={index}
            isOpen={isOpen}
            onPress={() => handleNavigate(item.href)}
            debugId={item.id} 
          />
        );
      })}
      
      {/* Render Output button separately with special handling */}
      {MENU_ITEMS.find(item => item.id === 'output') && (
        <View 
          style={[
            styles.outputButtonContainer,
            { transform: [{ translateY: isOpen ? -180 : 0 }] }
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={[
              styles.outputTouchable,
              { opacity: isOpen ? 1 : 0 } // Only visible when menu is open
            ]}
            activeOpacity={0.6}
            onPress={() => {
              console.log('[FAB Navigation] Output button pressed directly');
              handleOutputPress();
              if (onOptionPress) onOptionPress();
            }}
            onPressIn={(e) => logTouchEvent(e, 'pressIn')}
            onPressOut={(e) => logTouchEvent(e, 'pressOut')}
            pressRetentionOffset={{ top: 30, left: 30, bottom: 30, right: 30 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            accessibilityRole="button"
            accessibilityLabel="Navigate to Output"
            testID="fab-menu-item-output"
          >
            <View style={styles.outputButtonContent}>
              <View style={styles.outputIconContainer}>
                <MaterialIcons name="fitness-center" size={24} color="white" />
              </View>
              <Text style={styles.outputMenuText}>Output</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/**
 * MenuItem - Individual menu option with animation
 */
const MenuItem = ({ item, index, isOpen, onPress, debugId }) => {
  // Log mounting of component
  useEffect(() => {
    console.log(`[FAB Navigation] MenuItem mounted: ${debugId || item.id} (index: ${index})`);
    return () => {
      console.log(`[FAB Navigation] MenuItem unmounted: ${debugId || item.id}`);
    };
  }, []);
  
  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  // Update animations when isOpen changes
  useEffect(() => {
    const delay = 50 * (MENU_ITEMS.length - index - 1);
    
    if (isOpen) {
      translateY.value = withDelay(
        delay, 
        withSpring(-60 - (index * 60), { damping: 12 })
      );
      opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
      scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
    } else {
      // Reverse the animation order when closing
      translateY.value = withDelay(
        index * 50, 
        withTiming(0, { duration: 200 })
      );
      opacity.value = withDelay(index * 50, withTiming(0, { duration: 150 }));
      scale.value = withDelay(index * 50, withTiming(0.8, { duration: 150 }));
    }
  }, [isOpen, index, translateY, opacity, scale]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });
  
  // Handler with extra logging
  const handleMenuItemPress = () => {
    console.log(`[FAB Navigation] MenuItem pressed: ${debugId || item.id} (index: ${index})`);
    // Call the original onPress handler
    onPress && onPress();
  };
  
  // Get special styles for output button if needed
  const extraStyles = debugId === 'output' ? { zIndex: 1000 } : {};
  
  return (
    <Reanimated.View 
      style={[
        styles.menuItemContainer, 
        animatedStyle, 
        extraStyles,
        { elevation: 5 + index } // Increase elevation for each menu item
      ]}
    >
      <TouchableOpacity
        style={[styles.menuItem, { minHeight: 44, minWidth: 44 }]} // Increase touch target size
        activeOpacity={0.6} // Make more responsive
        onPress={handleMenuItemPress}
        pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }} // Extend touch area
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Additional hit slop
        accessibilityRole="button"
        accessibilityLabel={`Navigate to ${item.label}`}
        testID={`fab-menu-item-${item.id}`} // Add testID for testing
      >
        <View style={[styles.iconContainer, debugId === 'output' ? { backgroundColor: '#3A80D2' } : {}]}>
          <MaterialIcons name={item.icon} size={20} color="white" />
        </View>
        <Text style={styles.menuText}>{item.label}</Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingBottom: 80, // Space for main FAB
    zIndex: 100, // Ensure menu is above other elements
    elevation: 10, // Android elevation
  },
  outputButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 160,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Higher than other menu items
    elevation: 50, // Much higher elevation for Android
  },
  outputTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly visible for debugging
  },
  outputButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  outputIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A80D2', // Different color to distinguish
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  outputMenuText: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker for visibility
    color: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  menuItemContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 140,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 100, // Ensure each item is above others
    elevation: 5, // Base elevation for Android
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 5, // Add padding to increase touch area
    zIndex: 100, // Ensure the touchable area is accessible
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  menuText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default NavigationOptions;

