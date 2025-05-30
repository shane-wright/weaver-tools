import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

/**
 * TimeInput - Component for setting the fasting end time
 * 
 * @param {Object} props
 * @param {string} props.currentEndTime - The current end time in HH:MM format
 * @param {Function} props.onEndTimeChange - Callback function when end time changes
 */
const TimeInput = ({ currentEndTime, onEndTimeChange }) => {
  const [hours, setHours] = useState(currentEndTime ? currentEndTime.split(':')[0] : '');
  const [minutes, setMinutes] = useState(currentEndTime ? currentEndTime.split(':')[1] : '');
  
  // Handle hours input change
  const handleHoursChange = (text) => {
    // Ensure input is numeric and within range
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '' || (parseInt(numericValue, 10) >= 0 && parseInt(numericValue, 10) <= 23)) {
      setHours(numericValue);
      updateEndTime(numericValue, minutes);
    }
  };

  // Handle minutes input change
  const handleMinutesChange = (text) => {
    // Ensure input is numeric and within range
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '' || (parseInt(numericValue, 10) >= 0 && parseInt(numericValue, 10) <= 59)) {
      setMinutes(numericValue);
      updateEndTime(hours, numericValue);
    }
  };

  // Update the end time and call the callback
  const updateEndTime = (hrs, mins) => {
    // Only call callback when we have valid hours and minutes
    if (hrs && mins) {
      const formattedHours = hrs.padStart(2, '0');
      const formattedMinutes = mins.padStart(2, '0');
      onEndTimeChange(`${formattedHours}:${formattedMinutes}`);
    }
  };

  // Handle quick time buttons (add hours)
  const addHours = (hoursToAdd) => {
    const now = new Date();
    const newTime = new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000));
    
    const newHours = newTime.getHours().toString();
    const newMinutes = newTime.getMinutes().toString();
    
    setHours(newHours);
    setMinutes(newMinutes);
    updateEndTime(newHours, newMinutes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fast End Time:</Text>
      
      <View style={styles.timeInputContainer}>
        <TextInput
          style={styles.timeInput}
          value={hours}
          onChangeText={handleHoursChange}
          placeholder="HH"
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TextInput
          style={styles.timeInput}
          value={minutes}
          onChangeText={handleMinutesChange}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      <View style={styles.quickButtonsContainer}>
        <Text style={styles.quickTimeLabel}>Quick Add:</Text>
        <View style={styles.quickButtons}>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => addHours(16)}
          >
            <Text style={styles.quickButtonText}>+16h</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => addHours(18)}
          >
            <Text style={styles.quickButtonText}>+18h</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => addHours(24)}
          >
            <Text style={styles.quickButtonText}>+24h</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => addHours(36)}
          >
            <Text style={styles.quickButtonText}>+36h</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    width: 80,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 10,
    color: '#333',
  },
  quickButtonsContainer: {
    marginTop: 8,
  },
  quickTimeLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quickButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default TimeInput;

