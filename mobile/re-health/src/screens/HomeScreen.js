import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Re-Health</Text>
          <Text style={styles.subtitle}>Fitness Support App</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Intake')}
        >
          <Text style={styles.cardTitle}>Autophagy Focus</Text>
          <Text style={styles.cardDescription}>
            Support cellular renewal through strategic fasting and nutrition
          </Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Go to Intake →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Output')}
        >
          <Text style={styles.cardTitle}>Animal Flow</Text>
          <Text style={styles.cardDescription}>
            Movement-based rehabilitation mimicking animals
          </Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Go to Output →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutrition Guide</Text>
          <Text style={styles.cardDescription}>
            Optimize your diet for recovery and performance
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomeScreen;

