import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import FastingTimerContainer from '../components/FastingTimer/FastingTimerContainer';
import DietStatusContainer from '../components/DietStatus/DietStatusContainer';
import MealProtocolContainer from '../components/MealProtocol/MealProtocolContainer';

/**
 * IntakeScreen - Central hub for managing fasting schedules and viewing daily diet protocols
 * 
 * This screen combines the fasting timer, diet status, and meal protocol components
 * to provide a comprehensive view of the user's daily intake requirements.
 */
const IntakeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Intake</Text>
        
        {/* Fasting Timer Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fasting Timer</Text>
          <FastingTimerContainer />
        </View>
        
        {/* Diet Status Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Current Diet Day</Text>
          <DietStatusContainer />
        </View>
        
        {/* Meal Protocol Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <MealProtocolContainer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  placeholderContainer: {
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
  }
});

export default IntakeScreen;

