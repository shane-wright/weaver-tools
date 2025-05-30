import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import PropTypes from 'prop-types';

// Workout structure data based on re-health.md flowchart
const WORKOUT_STRUCTURE = {
  warmUp: {
    name: 'Dynamic Warm-Up',
    duration: 120, // 2 minutes in seconds
    exercises: [
      { id: 'wrist-circles', name: 'Wrist Circles + Bear Hold Rocks', duration: 30 },
      { id: 'cat-cow', name: 'Cat-Cow + Lateral Shifts', duration: 30 },
      { id: 'scapular-pushup', name: 'Scapular Push-Up → Down Dog', duration: 30 },
      { id: 'hip-circles', name: 'Hip Circles in Deep Squat', duration: 30 }
    ]
  },
  coreFlow: {
    name: 'Core Flow',
    rounds: 3,
    duration: 240, // 4 minutes per round in seconds
    exercises: [
      { id: 'beast-flow', name: 'Beast → Crab Reach → Ape → Scorpion', duration: 60, 
        detail: 'Beast Hold (10 sec) → Crab Reach x3/side → Ape Swing → Scorpion Hold/side' },
      { id: 'bear-flow', name: 'Bear → Lateral Undulation → Frogger', duration: 60,
        detail: 'Bear Crawl Fwd/Bwd (10 sec) → Lateral Undulation (10 sec) → Frogger Jump x3' },
      { id: 'loaded-beast', name: 'Loaded Beast → Crab Walk', duration: 60,
        detail: 'Beast Pull-Through x5 → Crab Walk 5 steps' },
      { id: 'freestyle', name: 'Freestyle Primal Play', duration: 60,
        detail: 'Free exploration of movements' }
    ]
  },
  cooldown: {
    name: 'Cooldown',
    duration: 60, // 1 minute in seconds
    exercises: [
      { id: 'scorpion-reaches', name: 'Slow Scorpion Reaches', duration: 30 },
      { id: 'dead-hang', name: 'Dead Hang + Leg Swings', duration: 30 }
    ]
  }
};

// Daily recommendations based on day of week and fasting status
const getDailyRecommendation = (day, fastingStatus, userLevel = 'beginner') => {
  // Scale intensity based on fasting status and user level
  let intensityModifier = 1;
  if (fastingStatus === 'fasting') {
    intensityModifier = 0.7; // Reduce intensity when fasting
  }
  
  // Scale based on user level
  if (userLevel === 'intermediate') {
    intensityModifier *= 1.2;
  } else if (userLevel === 'advanced') {
    intensityModifier *= 1.5;
  }

  // Specific day recommendations
  const recommendations = {
    Monday: {
      focus: 'Metabolic Reset',
      description: 'Gentle flows with focus on form. Perfect for starting the week.',
      intensityModifier: intensityModifier,
      recommended: ['bear-crawl', 'crab-reach', 'beast-hold']
    },
    Tuesday: {
      focus: 'Strength + Mobility',
      description: 'Focus on loaded movements and holds for strength development.',
      intensityModifier: intensityModifier * 1.1,
      recommended: ['beast-hold', 'crab-reach', 'lateral-undulation']
    },
    Wednesday: {
      focus: 'Power/Explosiveness',
      description: 'Incorporate dynamic movements and transitions.',
      intensityModifier: intensityModifier * 1.2,
      recommended: ['ape-swing', 'bear-crawl', 'lateral-undulation']
    },
    Thursday: {
      focus: 'Deep Autophagy',
      description: 'Gentle, restorative flows during your 24h fast.',
      intensityModifier: intensityModifier * 0.6, // Significantly reduced for fasting day
      recommended: ['beast-hold', 'scorpion-reach', 'crab-reach']
    },
    Friday: {
      focus: 'Refeed + Rebuild',
      description: 'Progressive intensity as you break your fast and rebuild.',
      intensityModifier: intensityModifier * 0.9, // Slightly reduced post-fast
      recommended: ['bear-crawl', 'crab-reach', 'beast-hold']
    },
    Saturday: {
      focus: 'Feast + Play',
      description: 'Playful, creative flows with higher intensity.',
      intensityModifier: intensityModifier * 1.3,
      recommended: ['ape-swing', 'lateral-undulation', 'bear-crawl']
    },
    Sunday: {
      focus: 'Recharge',
      description: 'Restorative flows focused on recovery and preparation.',
      intensityModifier: intensityModifier * 0.8,
      recommended: ['scorpion-reach', 'crab-reach', 'beast-hold']
    }
  };

  return recommendations[day] || recommendations['Monday'];
};

/**
 * DailyFlowRecommendation - Display recommended flows based on current day and fasting state
 * 
 * This component shows day-specific workout routines based on re-health protocol and
 * includes a timer for workout sections.
 * 
 * @typedef {Object} Exercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} name - Display name of the exercise
 * @property {number} duration - Duration of the exercise in seconds
 * @property {string} [detail] - Optional detailed description
 * 
 * @typedef {Object} ActiveExercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} name - Display name of the exercise
 * @property {number} duration - Duration of the exercise in seconds
 * @property {string} [detail] - Optional detailed description
 * 
 * @typedef {Object} DailyFlowRecommendationProps
 * @property {string} [currentDay="Monday"] - Day of the week
 * @property {string} [fastingStatus="fed"] - Current fasting status ('fed' or 'fasting')
 * @property {string} [userLevel="beginner"] - User's experience level ('beginner', 'intermediate', 'advanced')
 * @property {Function} [onSelectMovement] - Handler for selecting a movement to view details
 * @property {Function} [onCompleteWorkout] - Handler called when workout is completed
 * @property {boolean} [disableScrolling=false] - Whether to disable scrolling (for use in nested lists)
 * 
 * @param {DailyFlowRecommendationProps} props - Component props
 * @returns {React.ReactElement} The rendered component
 */
const DailyFlowRecommendation = ({ 
  currentDay = 'Monday', 
  fastingStatus = 'fed',
  userLevel = 'beginner',
  onSelectMovement,
  onCompleteWorkout,
  disableScrolling = false
}) => {
  // States for timer and workout progress
  const [activeSection, setActiveSection] = useState(null); // 'warmUp', 'coreFlow', 'cooldown'
  const [activeExercise, setActiveExercise] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [completedExercises, setCompletedExercises] = useState([]);

  // Get daily recommendation
  const dailyRecommendation = getDailyRecommendation(currentDay, fastingStatus, userLevel);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeRemaining === 0) {
      // Exercise completed
      if (activeExercise) {
        setCompletedExercises(prev => [...prev, activeExercise]);
        
        // Find next exercise in section
        const currentSectionExercises = activeSection === 'warmUp' 
          ? WORKOUT_STRUCTURE.warmUp.exercises
          : activeSection === 'coreFlow' 
            ? WORKOUT_STRUCTURE.coreFlow.exercises
            : WORKOUT_STRUCTURE.cooldown.exercises;
        
        const currentExerciseIndex = currentSectionExercises.findIndex(ex => ex.id === activeExercise.id);
        
        if (currentExerciseIndex < currentSectionExercises.length - 1) {
          // Move to next exercise in section
          const nextExercise = currentSectionExercises[currentExerciseIndex + 1];
          setActiveExercise(nextExercise);
          setTimeRemaining(nextExercise.duration);
        } else {
          // Section completed
          
          if (activeSection === 'coreFlow' && currentRound < WORKOUT_STRUCTURE.coreFlow.rounds) {
            // Move to next round in core flow
            setCurrentRound(prev => prev + 1);
            const firstCoreExercise = WORKOUT_STRUCTURE.coreFlow.exercises[0];
            setActiveExercise(firstCoreExercise);
            setTimeRemaining(firstCoreExercise.duration);
            Alert.alert('Round Completed', `Starting round ${currentRound + 1} of 3`);
          } else if (activeSection === 'warmUp') {
            // Move from warm-up to core flow
            setActiveSection('coreFlow');
            setCurrentRound(1);
            const firstCoreExercise = WORKOUT_STRUCTURE.coreFlow.exercises[0];
            setActiveExercise(firstCoreExercise);
            setTimeRemaining(firstCoreExercise.duration);
            Alert.alert('Warm-up Complete', 'Starting Core Flow rounds');
          } else if (activeSection === 'coreFlow') {
            // Move from core flow to cooldown
            setActiveSection('cooldown');
            const firstCooldownExercise = WORKOUT_STRUCTURE.cooldown.exercises[0];
            setActiveExercise(firstCooldownExercise);
            setTimeRemaining(firstCooldownExercise.duration);
            Alert.alert('Core Flow Complete', 'Starting Cooldown');
          } else {
            // Workout completed
            setIsTimerRunning(false);
            setActiveSection(null);
            setActiveExercise(null);
            Alert.alert('Workout Complete', 'Great job! You\'ve completed today\'s workout.');
            if (onCompleteWorkout) {
              onCompleteWorkout();
            }
          }
        }
      }
    }
    
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeRemaining, activeExercise, activeSection, currentRound, onCompleteWorkout]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Start workout
  const startWorkout = () => {
    setActiveSection('warmUp');
    const firstExercise = WORKOUT_STRUCTURE.warmUp.exercises[0];
    setActiveExercise(firstExercise);
    setTimeRemaining(firstExercise.duration);
    setIsTimerRunning(true);
    setCompletedExercises([]);
    setCurrentRound(1);
  };

  // Pause/resume timer
  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  // Skip current exercise
  const skipExercise = () => {
    setTimeRemaining(0);
  };

  // Render the component content - can be used in both scrolling and non-scrolling modes
  const renderContent = () => (
    <>
      {/* Daily recommendation header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {currentDay}'s Workout: {dailyRecommendation.focus}
        </Text>
        <Text style={styles.headerDescription}>
          {dailyRecommendation.description}
        </Text>
        <Text style={styles.intensityText}>
          Recommended Intensity: {fastingStatus === 'fasting' ? 'Low' : 'Moderate'}
          {userLevel !== 'beginner' ? ` (${userLevel})` : ''}
        </Text>
      </View>

      {/* Workout structure */}
      <View style={styles.workoutStructure}>
        <Text style={styles.sectionTitle}>Today's Workout Structure</Text>
        
        <View style={[
          styles.sectionCard, 
          activeSection === 'warmUp' && styles.activeSectionCard
        ]}>
          <Text style={styles.sectionName}>1. {WORKOUT_STRUCTURE.warmUp.name} ({formatTime(WORKOUT_STRUCTURE.warmUp.duration)})</Text>
          {WORKOUT_STRUCTURE.warmUp.exercises.map(exercise => (
            <View key={exercise.id} style={[
              styles.exerciseItem,
              activeExercise?.id === exercise.id && styles.activeExerciseItem,
              completedExercises.some(ex => ex.id === exercise.id) && styles.completedExerciseItem
            ]}>
              <Text style={styles.exerciseName}>• {exercise.name} ({formatTime(exercise.duration)})</Text>
            </View>
          ))}
        </View>
        
        <View style={[
          styles.sectionCard, 
          activeSection === 'coreFlow' && styles.activeSectionCard
        ]}>
          <Text style={styles.sectionName}>
            2. {WORKOUT_STRUCTURE.coreFlow.name} ({WORKOUT_STRUCTURE.coreFlow.rounds} Rounds x {formatTime(WORKOUT_STRUCTURE.coreFlow.duration)})
            {activeSection === 'coreFlow' && ` - Round ${currentRound}/${WORKOUT_STRUCTURE.coreFlow.rounds}`}
          </Text>
          {WORKOUT_STRUCTURE.coreFlow.exercises.map(exercise => (
            <View key={exercise.id} style={[
              styles.exerciseItem,
              activeExercise?.id === exercise.id && styles.activeExerciseItem,
              activeSection === 'coreFlow' && 
              completedExercises.some(ex => ex.id === exercise.id && 
                                      completedExercises.filter(ce => ce.id === exercise.id).length >= currentRound) && 
              styles.completedExerciseItem
            ]}>
              <Text style={styles.exerciseName}>• {exercise.name} ({formatTime(exercise.duration)})</Text>
              <Text style={styles.exerciseDetail}>{exercise.detail}</Text>
            </View>
          ))}
        </View>
        
        <View style={[
          styles.sectionCard, 
          activeSection === 'cooldown' && styles.activeSectionCard
        ]}>
          <Text style={styles.sectionName}>3. {WORKOUT_STRUCTURE.cooldown.name} ({formatTime(WORKOUT_STRUCTURE.cooldown.duration)})</Text>
          {WORKOUT_STRUCTURE.cooldown.exercises.map(exercise => (
            <View key={exercise.id} style={[
              styles.exerciseItem,
              activeExercise?.id === exercise.id && styles.activeExerciseItem,
              completedExercises.some(ex => ex.id === exercise.id) && styles.completedExerciseItem
            ]}>
              <Text style={styles.exerciseName}>• {exercise.name} ({formatTime(exercise.duration)})</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recommended movements */}
      <View style={styles.recommendedMovements}>
        <Text style={styles.sectionTitle}>Recommended Movements for Today</Text>
        <Text style={styles.recommendedIntro}>
          Focus on these movements in your practice today:
        </Text>
        {dailyRecommendation.recommended.map(movementId => (
          <TouchableOpacity 
            key={movementId}
            style={styles.recommendedItem}
            onPress={() => onSelectMovement && onSelectMovement(movementId)}
          >
            <Text style={styles.recommendedName}>• {movementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer and controls */}
      {activeExercise ? (
        <View style={styles.timerContainer}>
          <Text style={styles.currentExerciseText}>
            {activeExercise.name}
            {activeSection === 'coreFlow' && ` (Round ${currentRound}/${WORKOUT_STRUCTURE.coreFlow.rounds})`}
          </Text>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <View style={styles.timerControls}>
            <TouchableOpacity 
              style={styles.timerButton} 
              onPress={toggleTimer}
            >
              <Text style={styles.buttonText}>
                {isTimerRunning ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timerButton, styles.skipButton]} 
              onPress={skipExercise}
            >
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.startButton}
          onPress={startWorkout}
        >
          <Text style={styles.startButtonText}>Start Today's Workout</Text>
        </TouchableOpacity>
      )}
    </>
  );

  // Render either a ScrollView or a View based on the disableScrolling prop
  return disableScrolling ? (
    <View style={[styles.container, styles.staticContainer]}>
      {renderContent()}
    </View>
  ) : (
    <ScrollView style={styles.container}>
      {renderContent()}
    </ScrollView>
  );
};

// PropTypes validation for runtime type checking
DailyFlowRecommendation.propTypes = {
  currentDay: PropTypes.string,
  fastingStatus: PropTypes.oneOf(['fed', 'fasting']),
  userLevel: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']),
  onSelectMovement: PropTypes.func,
  onCompleteWorkout: PropTypes.func,
  disableScrolling: PropTypes.bool
};

// Default props
DailyFlowRecommendation.defaultProps = {
  currentDay: 'Monday',
  fastingStatus: 'fed',
  userLevel: 'beginner',
  disableScrolling: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  staticContainer: {
    paddingBottom: 16,
  },
  headerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  intensityText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  workoutStructure: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeSectionCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  sectionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exerciseItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#f9f9f9',
  },
  activeExerciseItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  completedExerciseItem: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  exerciseName: {
    fontSize: 14,
    color: '#333',
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  recommendedMovements: {
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
  recommendedIntro: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recommendedItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recommendedName: {
    fontSize: 14,
    color: '#333',
  },
  timerContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  currentExerciseText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default DailyFlowRecommendation;

