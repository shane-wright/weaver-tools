import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import TimeInput from './TimeInput';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

// Storage keys
const STORAGE_KEYS = {
  FASTING_STATE: 'fasting_state',
  END_TIME: 'fast_end_time',
  START_TIMESTAMP: 'fast_start_timestamp'
};

/**
 * FastingTimerContainer - Container component that manages fasting timer state
 * and coordinates between child components
 */
const FastingTimerContainer = () => {
  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Load saved state on component mount
  useEffect(() => {
    loadSavedState();
  }, []);
  
  // Load saved state from AsyncStorage
  const loadSavedState = async () => {
    try {
      const savedIsActive = await AsyncStorage.getItem(STORAGE_KEYS.FASTING_STATE);
      const savedEndTime = await AsyncStorage.getItem(STORAGE_KEYS.END_TIME);
      const savedStartTimestamp = await AsyncStorage.getItem(STORAGE_KEYS.START_TIMESTAMP);
      
      if (savedIsActive === 'true' && savedEndTime && savedStartTimestamp) {
        setIsActive(true);
        setEndTime(savedEndTime);
        
        // Parse saved timestamps
        const startTimestamp = parseInt(savedStartTimestamp, 10);
        const parsedStartDate = new Date(startTimestamp);
        setStartDate(parsedStartDate);
        
        // Calculate end date from saved end time
        const [hours, minutes] = savedEndTime.split(':');
        const endDateObj = new Date(parsedStartDate);
        endDateObj.setHours(parseInt(hours, 10));
        endDateObj.setMinutes(parseInt(minutes, 10));
        endDateObj.setSeconds(0);
        
        // If end time is before start time, add a day
        if (endDateObj < parsedStartDate) {
          endDateObj.setDate(endDateObj.getDate() + 1);
        }
        
        setEndDate(endDateObj);
        
        // Check if the fast has already ended
        if (endDateObj < new Date()) {
          // Fast has already ended, reset state
          resetTimerState();
        }
      }
    } catch (error) {
      console.error('Error loading fasting state', error);
    }
  };
  
  // Save state to AsyncStorage
  const saveState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FASTING_STATE, isActive.toString());
      if (isActive) {
        await AsyncStorage.setItem(STORAGE_KEYS.END_TIME, endTime);
        if (startDate) {
          await AsyncStorage.setItem(STORAGE_KEYS.START_TIMESTAMP, startDate.getTime().toString());
        }
      } else {
        // Clear values if not active
        await AsyncStorage.removeItem(STORAGE_KEYS.END_TIME);
        await AsyncStorage.removeItem(STORAGE_KEYS.START_TIMESTAMP);
      }
    } catch (error) {
      console.error('Error saving fasting state', error);
    }
  };
  
  // Handler for end time changes
  const handleEndTimeChange = (newEndTime) => {
    setEndTime(newEndTime);
  };
  
  // Handler for starting a fast
  const handleStartFast = () => {
    if (!endTime) return;
    
    const now = new Date();
    setStartDate(now);
    
    // Calculate end date based on current date and end time
    const [hours, minutes] = endTime.split(':');
    const calculatedEndDate = new Date(now);
    calculatedEndDate.setHours(parseInt(hours, 10));
    calculatedEndDate.setMinutes(parseInt(minutes, 10));
    calculatedEndDate.setSeconds(0);
    
    // If end time is before current time, add a day
    if (calculatedEndDate < now) {
      calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
    }
    
    setEndDate(calculatedEndDate);
    setIsActive(true);
  };
  
  // Handler for ending a fast
  const handleEndFast = () => {
    resetTimerState();
  };
  
  // Reset timer state
  const resetTimerState = () => {
    setIsActive(false);
    setStartDate(null);
    setEndDate(null);
  };
  
  // Save state when relevant state changes
  useEffect(() => {
    saveState();
  }, [isActive, endTime, startDate]);
  
  return (
    <View style={styles.container}>
      {!isActive && (
        <TimeInput 
          currentEndTime={endTime} 
          onEndTimeChange={handleEndTimeChange} 
        />
      )}
      
      <TimerDisplay 
        isActive={isActive}
        endTime={endTime}
        startDate={startDate}
        endDate={endDate}
      />
      
      <TimerControls 
        isActive={isActive} 
        hasValidEndTime={!!endTime}
        onStartFast={handleStartFast}
        onEndFast={handleEndFast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
});

export default FastingTimerContainer;

