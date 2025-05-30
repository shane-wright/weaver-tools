import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovementLibrary from './MovementLibrary';
import DailyFlowRecommendation from './DailyFlowRecommendation';
import MovementDetail from './MovementDetail';

/**
 * FlowContainer - Main container for Animal Flow movement components
 * 
 * This component manages the state for Animal Flow exercises and integrates with
 * the user's fasting status to provide appropriate recommendations. It contains
 * the MovementLibrary, DailyFlowRecommendation, and MovementDetail components.
 * 
 * @param {Object} props
 * @param {string} props.currentDay - Current day of the week to determine recommended flows
 * @param {string} props.fastingStatus - Current fasting status to adapt intensity
 * @param {boolean} props.disableInternalScrolling - Whether to disable internal scrolling (for use in nested lists)
 */
const FlowContainer = ({ 
  currentDay = 'Monday', 
  fastingStatus = 'fed',
  disableInternalScrolling = false 
}) => {
  // State management for flows
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flowHistory, setFlowHistory] = useState([]);
  const [viewMode, setViewMode] = useState('library'); // 'library', 'recommendation', 'detail'

  // Load flow history from AsyncStorage
  useEffect(() => {
    const loadFlowHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('flowHistory');
        if (storedHistory) {
          setFlowHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load flow history:', error);
      }
    };

    loadFlowHistory();
  }, []);

  // Save flow history to AsyncStorage when it changes
  useEffect(() => {
    const saveFlowHistory = async () => {
      try {
        await AsyncStorage.setItem('flowHistory', JSON.stringify(flowHistory));
      } catch (error) {
        console.error('Failed to save flow history:', error);
      }
    };

    if (flowHistory.length > 0) {
      saveFlowHistory();
    }
  }, [flowHistory]);

  // Handle flow selection - can be called with movement ID (string) or movement object
  const handleSelectFlow = (flow) => {
    // If flow is a string ID, find the corresponding flow object
    if (typeof flow === 'string') {
      const movement = MOVEMENT_DATA.find(m => m.id === flow);
      if (movement) {
        setSelectedFlow(movement);
        setViewMode('detail');
      }
    } else {
      setSelectedFlow(flow);
      setViewMode('detail');
    }
  };
  
  // Sample movement data - would be imported from MovementLibrary in a production app
  const MOVEMENT_DATA = MovementLibrary({}).props.movements;

  // Handle completing a flow
  const handleCompleteFlow = (flow, duration, intensity) => {
    const completedFlow = {
      ...flow,
      completedAt: new Date().toISOString(),
      duration,
      intensity,
    };
    
    setFlowHistory([completedFlow, ...flowHistory]);
    setViewMode('library');
  };

  // Handle back navigation from detail view
  const handleBackToLibrary = () => {
    setViewMode('library');
    setSelectedFlow(null);
  };

  // Determine recommended intensity based on fasting status
  const getRecommendedIntensity = () => {
    if (fastingStatus === 'fasting') {
      return 'low';
    } else if (fastingStatus === 'fed') {
      return 'moderate';
    }
    return 'moderate'; // default
  };

  return (
    <View style={styles.container}>
      {/* Navigation tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'library' && styles.activeTab]}
          onPress={() => setViewMode('library')}
        >
          <Text style={[styles.tabText, viewMode === 'library' && styles.activeTabText]}>Library</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, viewMode === 'recommendation' && styles.activeTab]}
          onPress={() => setViewMode('recommendation')}
        >
          <Text style={[styles.tabText, viewMode === 'recommendation' && styles.activeTabText]}>Daily Recommendation</Text>
        </TouchableOpacity>
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {viewMode === 'library' && (
          <MovementLibrary 
            onSelectMovement={handleSelectFlow} 
            disableScrolling={disableInternalScrolling}
          />
        )}

        {viewMode === 'recommendation' && (
          <DailyFlowRecommendation 
            currentDay={currentDay}
            fastingStatus={fastingStatus}
            userLevel="beginner"
            disableScrolling={disableInternalScrolling}
            onSelectMovement={handleSelectFlow}
            onCompleteWorkout={() => {
              // Add completed workout to history
              const completedWorkout = {
                date: new Date().toISOString(),
                day: currentDay,
                fastingStatus: fastingStatus,
              };
              
              setFlowHistory([completedWorkout, ...flowHistory]);
            }}
          />
        )}

        {viewMode === 'detail' && selectedFlow && (
          <MovementDetail 
            movement={selectedFlow}
            onBack={handleBackToLibrary}
            disableScrolling={disableInternalScrolling}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  }
});

export default FlowContainer;

