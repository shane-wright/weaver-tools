import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MealCard from './MealCard';

/**
 * DailyMealList - Component that displays all meals for the current day
 * 
 * @param {Object} props
 * @param {Array} props.meals - Array of meal objects for the current day
 * @param {string} props.note - Day-specific note
 * @param {string} props.fastingWindow - Current day's fasting window
 */
const DailyMealList = ({ meals, note, fastingWindow }) => {
  if (!meals || meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No meal data available for today</Text>
      </View>
    );
  }

  // Helper to determine if a meal is during a fasting period
  const isFastingMeal = (mealContent) => {
    return (
      mealContent.includes('Fast') ||
      mealContent.includes('Fasted') ||
      mealContent.startsWith('(')
    );
  };

  // Generate meal timing suggestions based on fasting window
  const getMealTimings = () => {
    // Simple timings based on fasting windows
    if (fastingWindow.includes('16/8')) {
      return ['', '2 PM', '7 PM'];
    } else if (fastingWindow.includes('18/6')) {
      return ['2 PM', '7 PM'];
    } else if (fastingWindow.includes('24h')) {
      return ['', '2 PM', '7 PM'];
    } else if (fastingWindow.includes('12h')) {
      return ['9 AM', '2 PM'];
    } else {
      // Default case
      return Array(meals.length).fill('');
    }
  };

  const timings = getMealTimings();

  return (
    <View style={styles.container}>
      {/* Display fasting protocol info */}
      <View style={styles.fastingInfoContainer}>
        <Text style={styles.fastingInfoText}>
          <Text style={styles.boldText}>Today's Protocol:</Text> {fastingWindow}
        </Text>
      </View>
      
      {/* Display all meals */}
      {meals.map((meal, index) => (
        <MealCard
          key={index}
          title={meal.title}
          content={meal.content}
          timing={timings[index] || ''}
          isFasting={isFastingMeal(meal.content)}
        />
      ))}
      
      {/* Display note if available */}
      {note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}
      
      {/* General guidance */}
      <View style={styles.guidanceContainer}>
        <Text style={styles.guidanceTitle}>General Reminders</Text>
        <View style={styles.guidanceItem}>
          <Text style={styles.guidanceText}>• Drink plenty of water throughout the day</Text>
        </View>
        <View style={styles.guidanceItem}>
          <Text style={styles.guidanceText}>• Take electrolytes during fasting periods</Text>
        </View>
        <View style={styles.guidanceItem}>
          <Text style={styles.guidanceText}>• Avoid processed foods and seed oils</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  fastingInfoContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  fastingInfoText: {
    fontSize: 14,
    color: '#555',
  },
  boldText: {
    fontWeight: '600',
  },
  noteContainer: {
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff8e1', // Light yellow
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffca28', // Amber
  },
  noteLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    color: '#f57c00', // Orange
  },
  noteText: {
    fontSize: 14,
    color: '#555',
  },
  guidanceContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  guidanceTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  guidanceItem: {
    marginBottom: 6,
  },
  guidanceText: {
    fontSize: 14,
    color: '#555',
  },
});

export default DailyMealList;

