import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import DayIndicator from './DayIndicator';
import NextDayPreview from './NextDayPreview';
import ProgressTracker from './ProgressTracker';

// Data
import DIET_PLAN from './dietData';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_DAY_OVERRIDE: 'current_day_override',
  LAST_CHECKED_DATE: 'last_checked_date'
};

/**
 * DietStatusContainer - Container component that manages diet day tracking
 * and provides data to child components
 */
const DietStatusContainer = () => {
  // State
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [nextDayData, setNextDayData] = useState(null);
  const [hasOverride, setHasOverride] = useState(false);
  
  // Initialize on mount
  useEffect(() => {
    initializeDayData();
    
    // Set up a listener to check for day changes
    const dayCheckInterval = setInterval(() => {
      checkForDayChange();
    }, 60000); // Check every minute
    
    return () => clearInterval(dayCheckInterval);
  }, []);
  
  // Update day data when currentDayIndex changes
  useEffect(() => {
    if (currentDayIndex !== null) {
      setCurrentDayData(DIET_PLAN[currentDayIndex]);
      
      // Calculate next day index (wrap around to Sunday if it's Saturday)
      const nextIndex = (currentDayIndex + 1) % 7;
      setNextDayData(DIET_PLAN[nextIndex]);
    }
  }, [currentDayIndex]);
  
  // Initialize day data from current date or saved override
  const initializeDayData = async () => {
    try {
      // Check for saved override
      const savedOverride = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_DAY_OVERRIDE);
      
      if (savedOverride) {
        const parsedOverride = JSON.parse(savedOverride);
        const savedDate = new Date(parsedOverride.date);
        const today = new Date();
        
        // Only use the override if it's from today
        if (
          savedDate.getDate() === today.getDate() &&
          savedDate.getMonth() === today.getMonth() &&
          savedDate.getFullYear() === today.getFullYear()
        ) {
          setCurrentDayIndex(parsedOverride.dayIndex);
          setHasOverride(true);
          return;
        }
      }
      
      // Otherwise use the current day
      const today = new Date();
      const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      setCurrentDayIndex(dayIndex);
      setHasOverride(false);
      
      // Save last checked date
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_CHECKED_DATE, 
        JSON.stringify({
          date: today.toISOString(),
          dayIndex
        })
      );
    } catch (error) {
      console.error('Error initializing day data', error);
      
      // Fall back to current day if there's an error
      const today = new Date();
      setCurrentDayIndex(today.getDay());
    }
  };
  
  // Check if the day has changed and update if needed
  const checkForDayChange = async () => {
    try {
      // Don't check for day changes if there's a manual override
      if (hasOverride) return;
      
      const savedDateString = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CHECKED_DATE);
      
      if (savedDateString) {
        const savedData = JSON.parse(savedDateString);
        const savedDate = new Date(savedData.date);
        const today = new Date();
        
        // Check if the date has changed
        if (
          savedDate.getDate() !== today.getDate() ||
          savedDate.getMonth() !== today.getMonth() ||
          savedDate.getFullYear() !== today.getFullYear()
        ) {
          // Day has changed, update
          const newDayIndex = today.getDay();
          setCurrentDayIndex(newDayIndex);
          
          // Save new date
          await AsyncStorage.setItem(
            STORAGE_KEYS.LAST_CHECKED_DATE, 
            JSON.stringify({
              date: today.toISOString(),
              dayIndex: newDayIndex
            })
          );
        }
      }
    } catch (error) {
      console.error('Error checking for day change', error);
    }
  };
  
  // Override the current day (for testing or user preference)
  const overrideCurrentDay = async (dayIndex) => {
    try {
      if (dayIndex >= 0 && dayIndex <= 6) {
        setCurrentDayIndex(dayIndex);
        setHasOverride(true);
        
        // Save override
        await AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_DAY_OVERRIDE,
          JSON.stringify({
            date: new Date().toISOString(),
            dayIndex
          })
        );
      }
    } catch (error) {
      console.error('Error overriding current day', error);
    }
  };
  
  // Clear a day override
  const clearDayOverride = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_DAY_OVERRIDE);
      setHasOverride(false);
      
      // Reset to current day
      const today = new Date();
      setCurrentDayIndex(today.getDay());
    } catch (error) {
      console.error('Error clearing day override', error);
    }
  };
  
  // Handle day selection from ProgressTracker
  const handleDaySelect = (dayIndex) => {
    // If clicking current day and we have an override, clear it
    if (dayIndex === currentDayIndex && hasOverride) {
      clearDayOverride();
    } else {
      // Otherwise set override to selected day
      overrideCurrentDay(dayIndex);
    }
  };
  
  // If data isn't loaded yet
  if (!currentDayData || !nextDayData) {
    return <View style={styles.container} />;
  }
  
  return (
    <View style={styles.container}>
      <DayIndicator
        dayName={currentDayData.name}
        fastingWindow={currentDayData.fastingWindow}
        primaryFocus={currentDayData.primaryFocus}
        note={currentDayData.note}
      />
      
      <NextDayPreview
        dayName={nextDayData.name}
        fastingWindow={nextDayData.fastingWindow}
        primaryFocus={nextDayData.primaryFocus}
      />
      
      <ProgressTracker
        currentDayIndex={currentDayIndex}
        dietPlan={DIET_PLAN}
        onDaySelect={handleDaySelect}
      />
      
      {/* Override indicator - only show if there's a day override active */}
      {hasOverride && (
        <TouchableOpacity 
          style={styles.overrideIndicator}
          onPress={clearDayOverride}
        >
          <Text style={styles.overrideText}>
            Custom day selected - tap to reset to today
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  overrideIndicator: {
    backgroundColor: '#ffe0b2',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcc80',
  },
  overrideText: {
    fontSize: 12,
    color: '#e65100',
    textAlign: 'center',
  }
});

export default DietStatusContainer;

