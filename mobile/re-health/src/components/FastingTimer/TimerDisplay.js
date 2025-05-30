import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * TimerDisplay - Component that displays a countdown timer for fasting
 * 
 * @param {Object} props
 * @param {boolean} props.isActive - Whether the fasting timer is active
 * @param {string} props.endTime - End time in HH:MM format
 * @param {Date} props.startDate - Date object for when fast started
 * @param {Date} props.endDate - Date object for when fast will end
 */
const TimerDisplay = ({ isActive, endTime, startDate, endDate }) => {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [timerState, setTimerState] = useState('not-started'); // 'not-started', 'in-progress', 'completed'
  
  // Calculate time differences and progress
  useEffect(() => {
    if (!isActive) {
      setTimerState('not-started');
      return;
    }
    
    // Setup interval to update countdown
    const interval = setInterval(() => {
      const now = new Date();
      
      if (!endDate || isNaN(endDate.getTime())) {
        clearInterval(interval);
        return;
      }
      
      // Calculate time difference
      const diff = endDate.getTime() - now.getTime();
      
      // Update timer state based on diff
      if (diff <= 0) {
        setTimerState('completed');
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(1);
        clearInterval(interval);
        return;
      }
      
      // Timer is in progress
      setTimerState('in-progress');
      
      // Calculate remaining hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ hours, minutes, seconds });
      
      // Calculate progress if we have start and end dates
      if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        const calculatedProgress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
        setProgress(calculatedProgress);
      }
    }, 1000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [isActive, startDate, endDate]);
  
  // Get display content based on timer state
  const getDisplayContent = () => {
    switch (timerState) {
      case 'not-started':
        return (
          <View style={styles.notStartedContainer}>
            <Text style={styles.notStartedText}>Set a time and start your fast</Text>
          </View>
        );
      
      case 'in-progress':
        return (
          <View style={styles.inProgressContainer}>
            <Text style={styles.timerValue}>
              {String(timeRemaining.hours).padStart(2, '0')}:
              {String(timeRemaining.minutes).padStart(2, '0')}:
              {String(timeRemaining.seconds).padStart(2, '0')}
            </Text>
            <Text style={styles.timerLabel}>Remaining</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.timeInfoContainer}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeInfoLabel}>Started</Text>
                <Text style={styles.timeInfoValue}>
                  {startDate ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeInfoLabel}>Ends</Text>
                <Text style={styles.timeInfoValue}>
                  {endDate ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </Text>
              </View>
            </View>
          </View>
        );
      
      case 'completed':
        return (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Fast Completed!</Text>
            <Text style={styles.completedSubtext}>You can now enjoy your meal</Text>
          </View>
        );
      
      default:
        return <ActivityIndicator size="large" />;
    }
  };

  return (
    <View style={styles.container}>
      {getDisplayContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  // Not Started Styles
  notStartedContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  notStartedText: {
    fontSize: 18,
    color: '#666',
  },
  // In Progress Styles
  inProgressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  // Completed Styles
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  completedSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default TimerDisplay;

