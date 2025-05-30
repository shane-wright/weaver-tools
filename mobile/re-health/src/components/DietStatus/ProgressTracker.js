import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * ProgressTracker - Component that displays weekly diet progress
 * 
 * @param {Object} props
 * @param {number} props.currentDayIndex - Index of current day (0-6)
 * @param {Object} props.dietPlan - Diet plan data for all days
 * @param {Function} props.onDaySelect - Callback when a day is selected (for override)
 */
const ProgressTracker = ({ currentDayIndex, dietPlan, onDaySelect }) => {
  // Helper function to get color based on fasting intensity
  const getFastingIntensityColor = (fastingWindow) => {
    if (fastingWindow.includes('24h') || fastingWindow.includes('36h')) {
      return '#1976d2'; // Blue for intense fasting days
    } else if (fastingWindow.includes('18/6')) {
      return '#388e3c'; // Green for moderate fasting 
    } else if (fastingWindow.includes('16/8')) {
      return '#7cb342'; // Light green for common intermittent fasting
    } else {
      return '#fb8c00'; // Orange for lighter fasting days
    }
  };
  
  // Generate the day dots
  const renderDayDots = () => {
    const dayDots = [];
    
    // Loop through Sunday to Saturday (0-6)
    for (let i = 0; i < 7; i++) {
      const dayData = dietPlan[i];
      const isCurrentDay = i === currentDayIndex;
      const isPastDay = (i < currentDayIndex) || (currentDayIndex === 0 && i > 0); // Handle Sunday edge case
      const dayInitial = dayData.name.charAt(0); // First letter of day name
      
      dayDots.push(
        <TouchableOpacity 
          key={i} 
          style={styles.dayDotContainer}
          onPress={() => onDaySelect(i)}
          activeOpacity={0.7}
        >
          <View 
            style={[
              styles.dayDot,
              { backgroundColor: getFastingIntensityColor(dayData.fastingWindow) },
              isCurrentDay && styles.currentDayDot,
              isPastDay && styles.pastDayDot
            ]}
          >
            <Text 
              style={[
                styles.dayInitial,
                isCurrentDay && styles.currentDayInitial
              ]}
            >
              {dayInitial}
            </Text>
          </View>
          {isCurrentDay && <Text style={styles.currentDayLabel}>Today</Text>}
        </TouchableOpacity>
      );
    }
    
    return dayDots;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress</Text>
      <View style={styles.progressContainer}>
        {renderDayDots()}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#1976d2' }]} />
          <Text style={styles.legendText}>Extended Fast (24h+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#388e3c' }]} />
          <Text style={styles.legendText}>18/6 Fast</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7cb342' }]} />
          <Text style={styles.legendText}>16/8 Fast</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#fb8c00' }]} />
          <Text style={styles.legendText}>Light Fast</Text>
        </View>
      </View>
      
      <Text style={styles.helperText}>Tap any day to override</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dayDotContainer: {
    alignItems: 'center',
    width: 40,
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentDayDot: {
    borderWidth: 3,
    borderColor: '#333',
  },
  pastDayDot: {
    opacity: 0.6,
  },
  dayInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentDayInitial: {
    color: 'white',
  },
  currentDayLabel: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    width: '45%', // Approximately half the width, with some space in between
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  helperText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ProgressTracker;

