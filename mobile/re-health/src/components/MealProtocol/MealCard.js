import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * MealCard - Component for displaying individual meal information
 * 
 * @param {Object} props
 * @param {string} props.title - Meal title (e.g., "Meal 1", "Breakfast")
 * @param {string} props.content - Meal content (e.g., "Eggs + Avocado")
 * @param {string} props.timing - Optional timing information (e.g., "2 PM")
 * @param {boolean} props.isFasting - Whether this is a fasting period
 */
const MealCard = ({ title, content, timing, isFasting }) => {
  // Determine if this meal is a fasting period by checking the content
  const determineFasting = () => {
    return (
      isFasting || 
      content.includes('Fast') || 
      content.includes('Fasted') || 
      content.startsWith('(') // Typically fasting periods are in parentheses
    );
  };
  
  const isFastingPeriod = determineFasting();
  
  return (
    <View style={[
      styles.container, 
      isFastingPeriod ? styles.fastingContainer : styles.mealContainer
    ]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        {timing && <Text style={styles.timing}>{timing}</Text>}
      </View>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.content, 
            isFastingPeriod && styles.fastingContent
          ]}
        >
          {content}
        </Text>
      </View>
      
      {isFastingPeriod && (
        <View style={styles.fastingBadge}>
          <Text style={styles.fastingBadgeText}>Fasting</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  mealContainer: {
    backgroundColor: 'white',
  },
  fastingContainer: {
    backgroundColor: '#f3f8ff', // Light blue for fasting periods
    borderWidth: 1,
    borderColor: '#e1f5fe',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timing: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  contentContainer: {
    marginVertical: 4,
  },
  content: {
    fontSize: 15,
    color: '#333',
  },
  fastingContent: {
    fontStyle: 'italic',
    color: '#1976d2', // Blue for fasting content
  },
  fastingBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#1976d2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  fastingBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default MealCard;

