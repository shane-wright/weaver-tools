import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  SectionList, 
  Switch, 
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FlowContainer from '../components/AnimalFlow/FlowContainer';
import WorkoutTrackerContainer from '../components/WorkoutTracker/WorkoutTrackerContainer';
import GuideContainer from '../components/MovementGuide/GuideContainer';
/**
 * Screen options for Output screen in tab navigation
 * 
 * @typedef {Object} OutputScreenOptions
 * @property {string} headerTitle - The title displayed in the header
 * @property {Object} headerStyle - Style object for the header
 * @property {string} headerTintColor - Color for the header text and icons
 * @property {Object} headerTitleStyle - Style object for the header title
 * @property {boolean} headerShown - Whether to show the header
 * 
 * @type {OutputScreenOptions}
 */
export const screenOptions = {
  headerTitle: 'Output',
  headerStyle: {
    backgroundColor: '#4A90E2',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  // In tab navigation, we typically want the tab bar's header to show
  headerShown: true, 
};
/**
 * OutputScreen - Hub for Animal Flow movement practice and physical regimen components
 * 
 * This screen combines Animal Flow exercises, workout tracking, and movement guides
 * to help users complete their daily physical regimen according to the re-health protocol.
 * 
 * @typedef {Object} NavigationProp
 * @property {function} navigate - Function to navigate to a new screen
 * @property {function} goBack - Function to go back to the previous screen
 * @property {Object} state - Current navigation state
 * 
 * @typedef {Object} RouteProp
 * @property {string} key - Unique key for the route
 * @property {string} name - Name of the route
 * @property {Object} params - Parameters passed to the route
 * 
 * @typedef {Object} OutputScreenProps
 * @property {NavigationProp} navigation - React Navigation navigation object
 * @property {RouteProp} route - React Navigation route object
 * 
 * @param {OutputScreenProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const OutputScreen = ({ navigation, route }) => {
  // Get safe area insets to handle padding properly
  const insets = useSafeAreaInsets();
  
  // State for current day and fasting status
  const [currentDay, setCurrentDay] = useState('Monday');
  const [fastingStatus, setFastingStatus] = useState('fed'); // 'fed' or 'fasting'
  
  // Determine current day of week on component mount
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    setCurrentDay(days[today]);
  }, []);

  // TODO: In a production app, we would get the fasting status from the Intake screen
  // This is a temporary toggle for demonstration purposes
  const toggleFastingStatus = () => {
    setFastingStatus(prev => prev === 'fed' ? 'fasting' : 'fed');
  };
  
  // Prepare sections data for SectionList
  const sections = [
    {
      title: 'Animal Flow',
      key: 'animalFlow',
      data: [{}], // We only need one item for this section
      renderItem: () => (
        <View>
          <FlowContainer 
            currentDay={currentDay}
            fastingStatus={fastingStatus}
            disableInternalScrolling={true} // Tell component to avoid internal scrolling
          />
        </View>
      ),
      renderHeader: () => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Animal Flow</Text>
          <View style={styles.fastingStatusContainer}>
            <Text style={styles.fastingLabel}>Fasting Status: </Text>
            <Text style={[
              styles.fastingStatus,
              fastingStatus === 'fasting' ? styles.fastingActive : styles.fastingInactive
            ]}>
              {fastingStatus.charAt(0).toUpperCase() + fastingStatus.slice(1)}
            </Text>
            <Switch
              value={fastingStatus === 'fasting'}
              onValueChange={toggleFastingStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={fastingStatus === 'fasting' ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>
      )
    },
    {
      title: 'Workout Tracker',
      key: 'workoutTracker',
      data: [{}], // We only need one item for this section
      renderItem: () => (
        <View>
          <WorkoutTrackerContainer 
            userData={{ 
              name: 'User',
              level: 'beginner',
              preferences: {
                defaultIntensity: 'moderate',
                showTimer: true
              }
            }}
            disableInternalScrolling={true} // Tell component to avoid internal scrolling
          />
        </View>
      ),
      renderHeader: () => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workout Tracker</Text>
        </View>
      )
    },
    {
      title: 'Movement Guide',
      key: 'movementGuide',
      data: [{}], // We only need one item for this section
      renderItem: () => (
        <View>
          <GuideContainer 
            disableInternalScrolling={true} // Tell component to avoid internal scrolling
          />
        </View>
      ),
      renderHeader: () => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movement Guide</Text>
        </View>
      )
    }
  ];
  // Render section item based on section type
  const renderItem = ({ item, section }) => {
    return section.renderItem();
  };

  // Render section header
  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionContainer}>
        {section.renderHeader()}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `section-${index}`}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: insets.top > 0 ? 8 : 16 } // Adjust top padding based on safe area
          ]}
          showsVerticalScrollIndicator={true}
          initialNumToRender={3} // Render all sections initially
          maxToRenderPerBatch={3}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    // paddingTop is now set dynamically based on insets
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8, // Add space between sections
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  fastingStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fastingLabel: {
    fontSize: 14,
    color: '#666',
  },
  fastingStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  fastingActive: {
    color: '#007AFF',
  },
  fastingInactive: {
    color: '#4CAF50',
  },
  placeholderContainer: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#888',
    textAlign: 'center',
  }
});

export default OutputScreen;

