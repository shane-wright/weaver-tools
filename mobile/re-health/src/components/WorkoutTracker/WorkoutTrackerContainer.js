import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * WorkoutTrackerContainer - Main container for tracking workout sessions
 * 
 * This component manages workout session tracking, logging, and displaying progress statistics.
 * It also provides a timer for tracking workout duration.
 * 
 * @param {Object} props
 * @param {Object} props.userData - User profile data including history
 */
const WorkoutTrackerContainer = ({ userData }) => {
  // State for current session and history
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('log'); // 'log', 'stats', 'timer'
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Load session history from AsyncStorage
  useEffect(() => {
    const loadSessionHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('sessionHistory');
        if (storedHistory) {
          setSessionHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load session history:', error);
      }
    };

    loadSessionHistory();
  }, []);

  // Save session history to AsyncStorage when it changes
  useEffect(() => {
    const saveSessionHistory = async () => {
      try {
        await AsyncStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
      } catch (error) {
        console.error('Failed to save session history:', error);
      }
    };

    if (sessionHistory.length > 0) {
      saveSessionHistory();
    }
  }, [sessionHistory]);

  // Start a new workout session
  const startSession = () => {
    if (currentSession) {
      Alert.alert('Session in Progress', 'Please end your current session before starting a new one.');
      return;
    }

    const newSession = {
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      movements: [],
      notes: '',
    };

    setCurrentSession(newSession);
    setElapsedTime(0);
    
    // Start the timer
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // End the current workout session
  const endSession = () => {
    if (!currentSession) return;

    // Clear the timer interval
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Update the session with end time and duration
    const endedSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      duration: elapsedTime,
    };

    // Add to history and reset current session
    setSessionHistory([endedSession, ...sessionHistory]);
    setCurrentSession(null);
    setElapsedTime(0);
  };

  // Add movement to current session
  const addMovement = (movement) => {
    if (!currentSession) return;

    setCurrentSession(prev => ({
      ...prev,
      movements: [...prev.movements, {
        ...movement,
        timestamp: new Date().toISOString()
      }]
    }));
  };

  // Update session notes
  const updateNotes = (notes) => {
    if (!currentSession) return;

    setCurrentSession(prev => ({
      ...prev,
      notes
    }));
  };

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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total workout time from session history
  const getTotalWorkoutTime = () => {
    return sessionHistory.reduce((total, session) => total + (session.duration || 0), 0);
  };

  // Get session counts by day of week
  const getSessionsByDay = () => {
    const dayCount = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    
    sessionHistory.forEach(session => {
      const date = new Date(session.startTime);
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      dayCount[day]++;
    });
    
    return dayCount;
  };

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'log' && styles.activeTab]}
        onPress={() => setActiveTab('log')}
      >
        <Text style={[styles.tabText, activeTab === 'log' && styles.activeTabText]}>
          Session Log
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
        onPress={() => setActiveTab('stats')}
      >
        <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
          Progress Stats
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'timer' && styles.activeTab]}
        onPress={() => setActiveTab('timer')}
      >
        <Text style={[styles.tabText, activeTab === 'timer' && styles.activeTabText]}>
          Session Timer
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'log':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Workout History</Text>
            
            {sessionHistory.length > 0 ? (
              <FlatList
                data={sessionHistory}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
                      <Text style={styles.sessionDuration}>{formatTime(item.duration)}</Text>
                    </View>
                    <View style={styles.sessionDetails}>
                      <Text style={styles.sessionMovements}>
                        Movements: {item.movements ? item.movements.length : 0}
                      </Text>
                      {item.notes ? (
                        <Text style={styles.sessionNotes}>Notes: {item.notes}</Text>
                      ) : null}
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.sessionList}
              />
            ) : (
              <Text style={styles.emptyStateText}>
                No workout sessions recorded yet. Start a session to begin tracking!
              </Text>
            )}
          </View>
        );
        
      case 'stats':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Workout Statistics</Text>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Sessions</Text>
              <Text style={styles.statValue}>{sessionHistory.length}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Workout Time</Text>
              <Text style={styles.statValue}>{formatTime(getTotalWorkoutTime())}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Average Session Duration</Text>
              <Text style={styles.statValue}>
                {sessionHistory.length > 0 
                  ? formatTime(Math.round(getTotalWorkoutTime() / sessionHistory.length))
                  : '0:00'}
              </Text>
            </View>
            
            <Text style={[styles.sectionTitle, {marginTop: 16}]}>Sessions by Day</Text>
            {Object.entries(getSessionsByDay()).map(([day, count]) => (
              <View key={day} style={styles.dayStatRow}>
                <Text style={styles.dayName}>{day}</Text>
                <View style={styles.dayBar}>
                  <View 
                    style={[
                      styles.dayBarFill, 
                      { width: `${Math.min(count * 20, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.dayCount}>{count}</Text>
              </View>
            ))}
          </View>
        );
        
      case 'timer':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>
                {currentSession ? 'Current Session' : 'Ready to Start'}
              </Text>
              <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
              
              {!currentSession ? (
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={startSession}
                >
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.activeSessionControls}>
                  <TouchableOpacity 
                    style={styles.endButton}
                    onPress={endSession}
                  >
                    <Text style={styles.endButtonText}>End Session</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addMovementButton}
                    onPress={() => Alert.alert(
                      'Feature Coming Soon', 
                      'Adding specific movements to session will be available in a future update.'
                    )}
                  >
                    <Text style={styles.addMovementButtonText}>Log Movement</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {currentSession && (
              <View style={styles.sessionInfoContainer}>
                <Text style={styles.sessionInfoText}>
                  Session started: {formatDate(currentSession.startTime)}
                </Text>
                {currentSession.movements.length > 0 && (
                  <Text style={styles.sessionInfoText}>
                    Movements logged: {currentSession.movements.length}
                  </Text>
                )}
              </View>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderTabs()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  sessionList: {
    paddingBottom: 16,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  sessionMovements: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  sessionNotes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dayStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  dayName: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dayBar: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  dayBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  dayCount: {
    width: 24,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeSessionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  endButton: {
    backgroundColor: '#F44336',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMovementButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  addMovementButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionInfoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  sessionInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  }
});

export default WorkoutTrackerContainer;

