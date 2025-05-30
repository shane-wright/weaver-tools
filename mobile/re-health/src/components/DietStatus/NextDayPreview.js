import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

/**
 * NextDayPreview - Component that displays a preview of the next day's diet protocol
 * 
 * @param {Object} props
 * @param {string} props.dayName - Next day name (e.g., "Tuesday")
 * @param {string} props.fastingWindow - Next day's fasting protocol (e.g., "18/6")
 * @param {string} props.primaryFocus - Next day's primary focus (e.g., "Strength + Mobility")
 */
const NextDayPreview = ({ dayName, fastingWindow, primaryFocus }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandAnimation] = useState(new Animated.Value(0));
  
  // Toggle expanded state
  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    Animated.timing(expandAnimation, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };
  
  // Calculate the height for the expanded details
  const expandedHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50] // Approximate height of the expanded content
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.previewHeader}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.upcomingText}>Coming Up</Text>
          <Text style={styles.dayName}>{dayName}</Text>
        </View>
        
        <View style={styles.fastingBadge}>
          <Text style={styles.fastingText}>{fastingWindow}</Text>
        </View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.expandedContainer, { height: expandedHeight }]}>
        <View style={styles.expandedContent}>
          <Text style={styles.focusLabel}>Focus:</Text>
          <Text style={styles.focusValue}>{primaryFocus}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fastingBadge: {
    backgroundColor: '#777',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  fastingText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  expandedContainer: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  expandedContent: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 6,
  },
  focusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default NextDayPreview;

