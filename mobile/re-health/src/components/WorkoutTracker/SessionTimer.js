import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

/**
 * SessionTimer - Timer for tracking workout duration
 * 
 * This component provides a timer for tracking workout duration with start, pause, 
 * and reset functionality. It also supports interval tracking for different workout phases.
 * 
 * @param {Object} props
 * @param {Function} props.onTimerComplete - Handler for timer completion
 * @param {boolean} props.isActive - Whether the timer is currently active
 * @param {Function} props.onTimeUpdate - Handler called when timer updates
 * @param {number} props.initialTime - Initial time value in seconds
 */
const SessionTimer = ({ 
  onTimerComplete, 
  isActive = false, 
  onTimeUpdate,
  initialTime = 0
}) => {
  // States for timer
  const [isRunning, setIsRunning] = useState(isActive);
  const [elapsedTime, setElapsedTime] = useState(initialTime);
  const [intervals, setIntervals] = useState([]);
  const [currentIntervalName, setCurrentIntervalName] = useState('');
  const [customIntervalDuration, setCustomIntervalDuration] = useState('');
  const [showIntervalsList, setShowIntervalsList] = useState(false);

  // References
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Effect for timer control
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - (elapsedTime * 1000);
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsedTime = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(newElapsedTime);
        
        if (onTimeUpdate) {
          onTimeUpdate(newElapsedTime);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Effect to sync with external isActive prop
  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? `${hours}:` : '',
      `${minutes < 10 ? '0' : ''}${minutes}:`,
      `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    ].join('');
  };

  // Toggle timer state (start/pause)
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // Reset timer
  const resetTimer = () => {
    if (isRunning) {
      Alert.alert(
        'Timer Running',
        'Do you want to stop the timer and reset?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset', 
            style: 'destructive', 
            onPress: () => {
              setIsRunning(false);
              setElapsedTime(0);
              setIntervals([]);
              
              if (onTimeUpdate) {
                onTimeUpdate(0);
              }
            } 
          }
        ]
      );
    } else {
      setElapsedTime(0);
      setIntervals([]);
      
      if (onTimeUpdate) {
        onTimeUpdate(0);
      }
    }
  };

  // Mark current interval
  const markInterval = () => {
    if (currentIntervalName.trim() === '') {
      Alert.alert('Name Required', 'Please enter a name for the interval');
      return;
    }
    
    const newInterval = {
      name: currentIntervalName,
      timestamp: elapsedTime,
      formattedTime: formatTime(elapsedTime)
    };
    
    setIntervals([...intervals, newInterval]);
    setCurrentIntervalName('');
  };

  // Predefined interval options
  const intervalOptions = [
    { name: 'Warm Up', duration: 120 }, // 2 min
    { name: 'Core Flow Round', duration: 240 }, // 4 min
    { name: 'Rest', duration: 60 }, // 1 min
    { name: 'Cooldown', duration: 60 } // 1 min
  ];

  // Start a preset interval countdown
  const startIntervalCountdown = (name, duration) => {
    if (isRunning) {
      Alert.alert(
        'Timer Running',
        'Do you want to mark the current interval and start a new one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Start New', 
            onPress: () => {
              // Mark current interval if there is one
              if (currentIntervalName) {
                markInterval();
              }
              
              // Add interval start marker
              const startInterval = {
                name: `${name} Start`,
                timestamp: elapsedTime,
                formattedTime: formatTime(elapsedTime)
              };
              
              setIntervals([...intervals, startInterval]);
              setCurrentIntervalName(name);
              
              // After the specified duration, alert user
              setTimeout(() => {
                Alert.alert(
                  'Interval Complete',
                  `${name} (${formatTime(duration)}) has completed!`,
                  [{ text: 'OK' }]
                );
                
                // Add interval end marker
                const endInterval = {
                  name: `${name} End`,
                  timestamp: elapsedTime + duration,
                  formattedTime: formatTime(elapsedTime + duration)
                };
                
                setIntervals(prevIntervals => [...prevIntervals, endInterval]);
              }, duration * 1000);
            } 
          }
        ]
      );
    } else {
      Alert.alert('Timer Not Running', 'Please start the timer first');
    }
  };

  return (
    <View style={styles.container}>
      {/* Main timer display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
        
        <View style={styles.timerControls}>
          <TouchableOpacity 
            style={[styles.timerButton, isRunning ? styles.pauseButton : styles.startButton]}
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.timerButton, styles.resetButton]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Current interval input */}
      <View style={styles.intervalInputContainer}>
        <Text style={styles.sectionTitle}>Mark Interval</Text>
        
        <View style={styles.intervalInput}>
          <View style={styles.intervalNameInput}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TouchableOpacity 
              style={styles.textInput}
              onPress={() => setShowIntervalsList(!showIntervalsList)}
            >
              <Text style={currentIntervalName ? styles.inputText : styles.inputPlaceholder}>
                {currentIntervalName || 'Tap to select or enter name'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.markButton, !currentIntervalName && styles.disabledButton]}
            onPress={markInterval}
            disabled={!currentIntervalName}
          >
            <Text style={styles.markButtonText}>Mark</Text>
          </TouchableOpacity>
        </View>
        
        {showIntervalsList && (
          <View style={styles.intervalsList}>
            {intervalOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.intervalOption}
                onPress={() => {
                  setCurrentIntervalName(option.name);
                  setShowIntervalsList(false);
                  startIntervalCountdown(option.name, option.duration);
                }}
              >
                <Text style={styles.intervalOptionText}>
                  {option.name} ({formatTime(option.duration)})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {/* Intervals history */}
      <View style={styles.intervalsContainer}>
        <Text style={styles.sectionTitle}>Intervals</Text>
        
        {intervals.length > 0 ? (
          <ScrollView style={styles.intervalsList}>
            {intervals.map((interval, index) => (
              <View key={index} style={styles.intervalItem}>
                <Text style={styles.intervalName}>{interval.name}</Text>
                <Text style={styles.intervalTime}>{interval.formattedTime}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyStateText}>
            No intervals marked yet. Use the form above to mark intervals during your workout.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  intervalInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  intervalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intervalNameInput: {
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  inputText: {
    fontSize: 14,
    color: '#333',
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#aaa',
  },
  markButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 'auto',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  markButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  intervalsList: {
    maxHeight: 200,
  },
  intervalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  intervalOptionText: {
    fontSize: 14,
    color: '#333',
  },
  intervalsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
  },
  intervalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  intervalName: {
    fontSize: 14,
    color: '#333',
  },
  intervalTime: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  }
});

export default SessionTimer;

