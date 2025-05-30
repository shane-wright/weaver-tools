import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

/**
 * ProgressStats - Visual representation of workout progress
 * 
 * This component displays visualization of workout statistics, trends, and progress
 * over time to help users track their physical activity.
 * 
 * @param {Object} props
 * @param {Array} props.sessionHistory - Array of past workout sessions
 * @param {string} props.dateRange - Time period to display (week, month, year, all)
 */
const ProgressStats = ({ 
  sessionHistory = [],
  dateRange = 'week'
}) => {
  const [selectedMetric, setSelectedMetric] = useState('frequency'); // 'frequency', 'duration', 'intensity'
  const [selectedRange, setSelectedRange] = useState(dateRange);
  
  // Filter sessions based on date range
  const getFilteredSessions = () => {
    const now = new Date();
    const filtered = sessionHistory.filter(session => {
      const sessionDate = new Date(session.startTime);
      if (selectedRange === 'week') {
        // Last 7 days
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return sessionDate >= weekAgo;
      } else if (selectedRange === 'month') {
        // Last 30 days
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 30);
        return sessionDate >= monthAgo;
      } else if (selectedRange === 'year') {
        // Last 365 days
        const yearAgo = new Date(now);
        yearAgo.setDate(now.getDate() - 365);
        return sessionDate >= yearAgo;
      }
      // All time
      return true;
    });
    
    return filtered;
  };
  
  const filteredSessions = getFilteredSessions();
  
  // Calculate summary statistics
  const totalSessions = filteredSessions.length;
  const totalDuration = filteredSessions.reduce((total, session) => 
    total + (session.duration || 0), 0);
  const avgDuration = totalSessions > 0 
    ? Math.round(totalDuration / totalSessions) 
    : 0;
  
  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? `${hours}h ` : '',
      `${minutes}m `,
      `${remainingSeconds}s`
    ].join('');
  };
  
  // Get sessions by day for frequency chart
  const getSessionsByDay = () => {
    const dayCount = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    
    filteredSessions.forEach(session => {
      const date = new Date(session.startTime);
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      dayCount[day]++;
    });
    
    // Convert to array for easier rendering
    return Object.entries(dayCount).map(([day, count]) => ({ day, count }));
  };
  
  // Get duration by day for duration chart
  const getDurationByDay = () => {
    const dayDuration = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    
    filteredSessions.forEach(session => {
      const date = new Date(session.startTime);
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      dayDuration[day] += (session.duration || 0);
    });
    
    // Convert to array for easier rendering
    return Object.entries(dayDuration).map(([day, duration]) => ({ day, duration }));
  };
  
  // Get intensity distribution
  const getIntensityDistribution = () => {
    const intensityCount = { low: 0, moderate: 0, high: 0 };
    
    filteredSessions.forEach(session => {
      const intensity = session.intensity || 'moderate';
      intensityCount[intensity]++;
    });
    
    // Convert to array for easier rendering
    return Object.entries(intensityCount).map(([intensity, count]) => ({ intensity, count }));
  };
  
  // Calculate max values for charts
  const maxFrequency = Math.max(...getSessionsByDay().map(item => item.count), 1);
  const maxDuration = Math.max(...getDurationByDay().map(item => item.duration), 1);
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    if (filteredSessions.length === 0) return 0;
    
    // Sort sessions by date
    const sortedSessions = [...filteredSessions].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    let currentStreak = 1;
    let longestStreak = 1;
    let previousDate = new Date(sortedSessions[0].startTime);
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const currentDate = new Date(sortedSessions[i].startTime);
      const diffDays = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      
      previousDate = currentDate;
    }
    
    return longestStreak;
  };
  
  // Get current streak
  const calculateCurrentStreak = () => {
    if (filteredSessions.length === 0) return 0;
    
    // Sort sessions by date (newest first)
    const sortedSessions = [...filteredSessions].sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
    
    let currentStreak = 1;
    let previousDate = new Date(sortedSessions[0].startTime);
    const today = new Date();
    
    // Check if most recent session is today or yesterday
    const diffFromToday = Math.floor((today - previousDate) / (1000 * 60 * 60 * 24));
    if (diffFromToday > 1) return 0; // Streak broken
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const currentDate = new Date(sortedSessions[i].startTime);
      const diffDays = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        break;
      }
      
      previousDate = currentDate;
    }
    
    return currentStreak;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Summary statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalSessions}</Text>
          <Text style={styles.summaryLabel}>Sessions</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatTime(totalDuration)}</Text>
          <Text style={styles.summaryLabel}>Total Time</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatTime(avgDuration)}</Text>
          <Text style={styles.summaryLabel}>Avg Duration</Text>
        </View>
      </View>
      
      {/* Streaks */}
      <View style={styles.streaksContainer}>
        <View style={styles.streakCard}>
          <Text style={styles.streakValue}>{calculateCurrentStreak()}</Text>
          <Text style={styles.streakLabel}>Current Streak</Text>
        </View>
        
        <View style={styles.streakCard}>
          <Text style={styles.streakValue}>{calculateLongestStreak()}</Text>
          <Text style={styles.streakLabel}>Longest Streak</Text>
        </View>
      </View>
      
      {/* Date range selector */}
      <View style={styles.rangeSelector}>
        <TouchableOpacity
          style={[styles.rangeOption, selectedRange === 'week' && styles.selectedRange]}
          onPress={() => setSelectedRange('week')}
        >
          <Text style={[styles.rangeText, selectedRange === 'week' && styles.selectedRangeText]}>Week</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.rangeOption, selectedRange === 'month' && styles.selectedRange]}
          onPress={() => setSelectedRange('month')}
        >
          <Text style={[styles.rangeText, selectedRange === 'month' && styles.selectedRangeText]}>Month</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.rangeOption, selectedRange === 'year' && styles.selectedRange]}
          onPress={() => setSelectedRange('year')}
        >
          <Text style={[styles.rangeText, selectedRange === 'year' && styles.selectedRangeText]}>Year</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.rangeOption, selectedRange === 'all' && styles.selectedRange]}
          onPress={() => setSelectedRange('all')}
        >
          <Text style={[styles.rangeText, selectedRange === 'all' && styles.selectedRangeText]}>All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Metric selector */}
      <View style={styles.metricSelector}>
        <TouchableOpacity
          style={[styles.metricOption, selectedMetric === 'frequency' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('frequency')}
        >
          <Text style={[styles.metricText, selectedMetric === 'frequency' && styles.selectedMetricText]}>Frequency</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.metricOption, selectedMetric === 'duration' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('duration')}
        >
          <Text style={[styles.metricText, selectedMetric === 'duration' && styles.selectedMetricText]}>Duration</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.metricOption, selectedMetric === 'intensity' && styles.selectedMetric]}
          onPress={() => setSelectedMetric('intensity')}
        >
          <Text style={[styles.metricText, selectedMetric === 'intensity' && styles.selectedMetricText]}>Intensity</Text>
        </TouchableOpacity>
      </View>
      
      {/* Charts */}
      <View style={styles.chartsContainer}>
        {selectedMetric === 'frequency' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Workouts by Day</Text>
            
            {totalSessions > 0 ? (
              <View style={styles.barChart}>
                {getSessionsByDay().map(({ day, count }) => (
                  <View key={day} style={styles.barItem}>
                    <Text style={styles.barLabel}>{day}</Text>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.barFill, 
                          { height: `${(count / maxFrequency) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.barValue}>{count}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No workout data to display</Text>
            )}
          </View>
        )}
        
        {selectedMetric === 'duration' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Duration by Day</Text>
            
            {totalSessions > 0 ? (
              <View style={styles.barChart}>
                {getDurationByDay().map(({ day, duration }) => (
                  <View key={day} style={styles.barItem}>
                    <Text style={styles.barLabel}>{day}</Text>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.barFill, 
                          styles.durationBar,
                          { height: `${(duration / maxDuration) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.barValue}>{Math.floor(duration / 60)}m</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No workout data to display</Text>
            )}
          </View>
        )}
        
        {selectedMetric === 'intensity' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Intensity Distribution</Text>
            
            {totalSessions > 0 ? (
              <View style={styles.pieChartContainer}>
                {getIntensityDistribution().map(({ intensity, count }) => {
                  const percentage = (count / totalSessions) * 100;
                  return (
                    <View key={intensity} style={styles.pieItem}>
                      <View style={styles.pieLabel}>
                        <View style={[
                          styles.colorIndicator, 
                          intensity === 'low' ? styles.lowColor :
                          intensity === 'moderate' ? styles.moderateColor :
                          styles.highColor
                        ]} />
                        <Text style={styles.pieLabelText}>
                          {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                        </Text>
                      </View>
                      <View style={styles.pieBar}>
                        <View 
                          style={[
                            styles.pieFill,
                            intensity === 'low' ? styles.lowColor :
                            intensity === 'moderate' ? styles.moderateColor :
                            styles.highColor,
                            { width: `${percentage}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.pieValue}>{count} ({Math.round(percentage)}%)</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.noDataText}>No workout data to display</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  streaksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#1976D2',
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  rangeOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  selectedRange: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  rangeText: {
    fontSize: 12,
    color: '#666',
  },
  selectedRangeText: {
    fontWeight: '600',
    color: '#333',
  },
  metricSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedMetric: {
    backgroundColor: '#007AFF',
  },
  metricText: {
    fontSize: 14,
    color: '#666',
  },
  selectedMetricText: {
    color: 'white',
    fontWeight: '600',
  },
  chartsContainer: {
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
    marginBottom: 8,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  barContainer: {
    height: 150,
    width: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  durationBar: {
    backgroundColor: '#4CAF50',
  },
  barValue: {
    fontSize: 12,
    color: '#666',
  },
  pieChartContainer: {
    marginBottom: 16,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pieLabel: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLabelText: {
    fontSize: 12,
    color: '#666',
  },
  pieBar: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  pieFill: {
    height: '100%',
    borderRadius: 8,
  },
  pieValue: {
    width: 70,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  lowColor: {
    backgroundColor: '#4CAF50',
  },
  moderateColor: {
    backgroundColor: '#FFC107',
  },
  highColor: {
    backgroundColor: '#F44336',
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 24,
  }
});

export default ProgressStats;

