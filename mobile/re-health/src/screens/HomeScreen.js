import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Re-Health</Text>
          <Text style={styles.subtitle}>Fitness Support App</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Autophagy Focus</Text>
          <Text style={styles.cardDescription}>
            Support cellular renewal through strategic fasting and nutrition
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Animal Flow</Text>
          <Text style={styles.cardDescription}>
            Movement-based rehabilitation mimicking animals
          </Text>
        </View>

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
  },
});

export default HomeScreen;

