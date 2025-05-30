import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * DayIndicator - Component that displays the current day's diet protocol
 * 
 * @param {Object} props
 * @param {string} props.dayName - Current day name (Monday, Tuesday, etc.)
 * @param {string} props.fastingWindow - Fasting protocol for the day (e.g., "16/8", "24h")
 * @param {string} props.primaryFocus - Primary focus for the day (e.g., "Metabolic Reset")
 * @param {string} props.note - Optional additional note for the day
 */
const DayIndicator = ({ dayName, fastingWindow, primaryFocus, note }) => {
  // Get background color based on fasting intensity
  const getBgColor = () => {
    if (fastingWindow.includes('24h') || fastingWindow.includes('36h')) {
      return styles.intenseFastBg; // Darker for longer fasts
    } else if (fastingWindow.includes('18/6') || fastingWindow.includes('16/8')) {
      return styles.moderateFastBg; // Medium for intermediate fasts
    } else {
      return styles.lightFastBg; // Light for shorter fasts
    }
  };

  return (
    <View style={[styles.container, getBgColor()]}>
      <View style={styles.dayContainer}>
        <Text style={styles.dayName}>{dayName || 'Today'}</Text>
        <View style={styles.fastingBadge}>
          <Text style={styles.fastingText}>{fastingWindow}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.focusContainer}>
          <Text style={styles.focusLabel}>Primary Focus:</Text>
          <Text style={styles.focusValue}>{primaryFocus}</Text>
        </View>
        
        {note && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  intenseFastBg: {
    backgroundColor: '#e1f5fe', // Light blue for intense fasting days
  },
  moderateFastBg: {
    backgroundColor: '#e8f5e9', // Light green for moderate fasting
  },
  lightFastBg: {
    backgroundColor: '#fff8e1', // Light yellow for lighter fasting
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fastingBadge: {
    backgroundColor: '#555',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  fastingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsContainer: {
    padding: 16,
  },
  focusContainer: {
    marginBottom: 8,
  },
  focusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  focusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noteContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default DayIndicator;

