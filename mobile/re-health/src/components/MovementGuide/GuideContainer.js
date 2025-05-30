import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the movement data from the Animal Flow section to avoid duplication
// In a real application, this would likely come from a shared data source
// For this prototype, we'll include it directly
const MOVEMENT_DATA = [
  {
    id: 'bear-crawl',
    name: 'Bear Crawl',
    category: 'foundational',
    difficulty: 1,
    description: 'Quadrupedal movement with knees hovering off ground.',
    musclesTargeted: ['Shoulders', 'Core', 'Wrists'],
    benefits: ['Cross-body coordination', 'Shoulder stability'],
    commonErrors: ['Allowing hips to rise too high', 'Sagging in lower back'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=qpaxI2m75RY',
    formCues: [
      'Keep knees hovering 1-2 inches off the ground',
      'Maintain a neutral spine',
      'Move contralaterally (opposite hand/foot)'
    ],
    complementaryMovements: ['beast-hold', 'lateral-undulation'],
    progressions: ['loaded-bear-crawl', 'bear-crawl-reaches'],
    regressions: ['quadruped-position', 'hand-knee-crawl']
  },
  {
    id: 'crab-reach',
    name: 'Crab Reach',
    category: 'foundational',
    difficulty: 1,
    description: 'From reverse tabletop, reach one hand to opposite foot.',
    musclesTargeted: ['Thoracic spine', 'Triceps', 'Glutes'],
    benefits: ['Opens anterior chain', 'Reverses hunched posture'],
    commonErrors: ['Collapsing through supporting shoulder', 'Not reaching fully'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rsBVxRzMMik',
    formCues: [
      'Keep hips high throughout the movement',
      'Reach hand all the way to opposite foot',
      'Open chest toward ceiling during reach'
    ],
    complementaryMovements: ['beast-hold', 'scorpion-reach'],
    progressions: ['slow-eccentric-crab', 'crab-walk-reaches'],
    regressions: ['seated-spinal-twist', 'bridge-pose']
  },
  {
    id: 'beast-hold',
    name: 'Beast Hold',
    category: 'foundational',
    difficulty: 2,
    description: 'Quadrupedal static hold with knees hovering.',
    musclesTargeted: ['Deep core', 'Quads', 'Shoulders'],
    benefits: ['Anti-extension core strength', 'Protects spine under load'],
    commonErrors: ['Allowing lower back to sag', 'Holding breath'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=bLGd7ZzvjVo',
    formCues: [
      'Tuck ribs to engage core',
      'Keep knees 1" off the ground',
      'Distribute weight evenly through hands'
    ],
    complementaryMovements: ['bear-crawl', 'crab-reach'],
    progressions: ['beast-shoulder-taps', 'beast-leg-lifts'],
    regressions: ['bear-position-hold', 'quadruped-core-engagement']
  },
  {
    id: 'scorpion-reach',
    name: 'Scorpion Reach',
    category: 'foundational',
    difficulty: 2,
    description: 'Lying prone, reach heel to opposite hand behind.',
    musclesTargeted: ['Rotator cuff', 'Thoracic spine', 'Hip flexors'],
    benefits: ['Rotational mobility', 'Counters sedentary stiffness'],
    commonErrors: ['Lifting hips off ground', 'Forcing rotation beyond capacity'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=bmENm-7Ut_Y',
    formCues: [
      'Keep chest on the ground',
      'Use controlled movement throughout',
      'Focus on thoracic rotation rather than lumbar'
    ],
    complementaryMovements: ['crab-reach', 'lateral-undulation'],
    progressions: ['loaded-scorpion', 'active-scorpion-lifts'],
    regressions: ['supine-spinal-twist', 'thread-the-needle']
  },
  {
    id: 'lateral-undulation',
    name: 'Lateral Undulation',
    category: 'advanced',
    difficulty: 3,
    description: 'Sideways Bear Crawl with rib cage leading.',
    musclesTargeted: ['Obliques', 'Serratus', 'Hip abductors'],
    benefits: ['Trains lateral fascial lines', 'Enhances thoracic mobility'],
    commonErrors: ['Moving too quickly', 'Losing core engagement'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.youtube.com/shorts/0U47qlHGmog',
    formCues: [
      'Allow ribcage to lead the movement',
      'Move slowly and with control',
      'Maintain 1" hover of knees throughout'
    ],
    complementaryMovements: ['bear-crawl', 'beast-hold'],
    progressions: ['side-kickthrough', 'lateral-traveling-ape'],
    regressions: ['seated-side-bend', 'quadruped-thoracic-rotation']
  }
];

/**
 * ExerciseCard - Card display for individual exercises
 * 
 * This component displays information about a single exercise in a card format.
 * 
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data object
 * @param {Function} props.onSelect - Handler for selecting the exercise
 * @param {boolean} props.isExpanded - Whether the card is in expanded view
 */
const ExerciseCard = ({ exercise, onSelect, isExpanded = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isExpanded && styles.expandedCard]}
      onPress={() => onSelect(exercise)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{exercise.name}</Text>
        <View style={[
          styles.difficultyBadge,
          exercise.difficulty === 1 ? styles.beginnerBadge : 
          exercise.difficulty === 2 ? styles.intermediateBadge : 
          styles.advancedBadge
        ]}>
          <Text style={styles.difficultyText}>
            {exercise.difficulty === 1 ? 'Beginner' : 
             exercise.difficulty === 2 ? 'Intermediate' : 'Advanced'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {/* Placeholder for actual images */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{exercise.name[0]}</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.description}>{exercise.description}</Text>
          
          {isExpanded && (
            <>
              <Text style={styles.subheading}>Primary Benefits:</Text>
              <View style={styles.bulletList}>
                {exercise.benefits.map((benefit, index) => (
                  <Text key={index} style={styles.bulletItem}>• {benefit}</Text>
                ))}
              </View>
              
              <Text style={styles.subheading}>Muscles Targeted:</Text>
              <Text style={styles.musclesText}>{exercise.musclesTargeted.join(', ')}</Text>
            </>
          )}
        </View>
      </View>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.subheading}>Form Cues:</Text>
          <View style={styles.cuesList}>
            {exercise.formCues.map((cue, index) => (
              <View key={index} style={styles.cueItem}>
                <Text style={styles.cueNumber}>{index + 1}</Text>
                <Text style={styles.cueText}>{cue}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.subheading}>Common Errors to Avoid:</Text>
          <View style={styles.bulletList}>
            {exercise.commonErrors.map((error, index) => (
              <Text key={index} style={styles.errorItem}>❌ {error}</Text>
            ))}
          </View>
          
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>Video Player Placeholder</Text>
            <Text style={styles.videoUrl}>{exercise.videoUrl}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * GuideContainer - Main container for exercise guides and tutorials
 * 
 * This component serves as a central location for curated guides and tutorials
 * on Animal Flow exercises.
 * 
 * @param {Object} props
 * @param {Array} props.movements - Array of movement data
 */
const GuideContainer = ({ movements = MOVEMENT_DATA }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [favoriteMovements, setFavoriteMovements] = useState([]);

  // Load favorite movements from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteMovements');
        if (storedFavorites) {
          setFavoriteMovements(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorite movements:', error);
      }
    };

    loadFavorites();
  }, []);

  // Filter movements based on selected category
  const filteredMovements = selectedCategory === 'all'
    ? movements
    : selectedCategory === 'favorites'
      ? movements.filter(movement => favoriteMovements.includes(movement.id))
      : movements.filter(movement => movement.category === selectedCategory);

  // Toggle a movement as favorite
  const toggleFavorite = async (movementId) => {
    const isCurrentlyFavorite = favoriteMovements.includes(movementId);
    const updatedFavorites = isCurrentlyFavorite
      ? favoriteMovements.filter(id => id !== movementId)
      : [...favoriteMovements, movementId];
      
    setFavoriteMovements(updatedFavorites);
    
    try {
      await AsyncStorage.setItem('favoriteMovements', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Failed to save favorite movements:', error);
    }
  };

  // Handle movement selection
  const handleSelectMovement = (movement) => {
    if (selectedMovement && selectedMovement.id === movement.id) {
      setSelectedMovement(null); // Collapse if already expanded
    } else {
      setSelectedMovement(movement); // Expand the selected movement
    }
  };

  // Render category filters
  const renderCategoryFilters = () => (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {['all', 'favorites', 'foundational', 'advanced', 'warmup', 'cooldown'].map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterChip,
            selectedCategory === category && styles.selectedFilterChip
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.filterChipText,
            selectedCategory === category && styles.selectedFilterChipText
          ]}>
            {category === 'all' ? 'All Movements' :
             category === 'favorites' ? 'Favorites' :
             `${category.charAt(0).toUpperCase()}${category.slice(1)}`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render view type selector
  const renderViewTypeSelector = () => (
    <View style={styles.viewTypeSelector}>
      <TouchableOpacity
        style={[styles.viewTypeOption, viewType === 'grid' && styles.selectedViewType]}
        onPress={() => setViewType('grid')}
      >
        <Text style={[
          styles.viewTypeText,
          viewType === 'grid' && styles.selectedViewTypeText
        ]}>Grid</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.viewTypeOption, viewType === 'list' && styles.selectedViewType]}
        onPress={() => setViewType('list')}
      >
        <Text style={[
          styles.viewTypeText,
          viewType === 'list' && styles.selectedViewTypeText
        ]}>List</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderCategoryFilters()}
        {renderViewTypeSelector()}
      </View>
      
      <ScrollView style={styles.content}>
        {filteredMovements.length > 0 ? (
          <>
            {filteredMovements.map(movement => (
              <ExerciseCard 
                key={movement.id}
                exercise={movement}
                onSelect={handleSelectMovement}
                isExpanded={selectedMovement && selectedMovement.id === movement.id}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No movements found in this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  filtersContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedFilterChip: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterChipText: {
    color: 'white',
    fontWeight: '600',
  },
  viewTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginRight: 4,
  },
  viewTypeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  selectedViewType: {
    backgroundColor: '#f0f0f0',
  },
  viewTypeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedViewTypeText: {
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  expandedCard: {
    borderColor: '#90CAF9',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beginnerBadge: {
    backgroundColor: '#4CAF50',
  },
  intermediateBadge: {
    backgroundColor: '#FFC107',
  },
  advancedBadge: {
    backgroundColor: '#F44336',
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 24,
    color: '#999',
  },
  contentContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  bulletList: {
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  musclesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  expandedContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cuesList: {
    marginBottom: 12,
  },
  cueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cueNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    textAlign: 'center',
    lineHeight: 24,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  cueText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  errorItem: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 4,
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  videoUrl: {
    fontSize: 12,
    color: '#007AFF',
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default GuideContainer;

