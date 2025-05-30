import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import DailyMealList from './DailyMealList';

// Data
import DIET_PLAN from '../DietStatus/dietData';

// Storage keys (matching DietStatusContainer for consistency)
const STORAGE_KEYS = {
  CURRENT_DAY_OVERRIDE: 'current_day_override',
  LAST_CHECKED_DATE: 'last_checked_date'
};

/**
 * MealProtocolContainer - Container component that manages meal protocol display
 * 
 * This component coordinates with DietStatusContainer indirectly through
 * shared AsyncStorage values to keep the day status in sync
 */
const MealProtocolContainer = () => {
  // State
  const [currentDayData, setCurrentDayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize on mount
  useEffect(() => {
    loadCurrentDayData();
    
    // Check for changes every minute (same as DietStatusContainer)
    const interval = setInterval(() => {
      loadCurrentDayData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load current day data from AsyncStorage or current date
  const loadCurrentDayData = async () => {
    try {
      setIsLoading(true);
      
      // First, try to get day override from storage (if user manually selected a day)
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
          const dayIndex = parsedOverride.dayIndex;
          setCurrentDayData(DIET_PLAN[dayIndex]);
          setIsLoading(false);
          return;
        }
      }
      
      // If no valid override, use current day
      const today = new Date();
      const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      setCurrentDayData(DIET_PLAN[dayIndex]);
      
    } catch (error) {
      console.error('Error loading current day data', error);
      
      // Fall back to current day if there's an error
      const today = new Date();
      const dayIndex = today.getDay();
      setCurrentDayData(DIET_PLAN[dayIndex]);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // If data isn't loaded yet
  if (isLoading || !currentDayData) {
    return <View style={styles.container} />;
  }
  
  return (
    <View style={styles.container}>
      <DailyMealList
        meals={currentDayData.meals}
        note={currentDayData.note}
        fastingWindow={currentDayData.fastingWindow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default MealProtocolContainer;

