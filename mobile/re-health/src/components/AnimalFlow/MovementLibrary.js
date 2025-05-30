import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';

// Sample movement data based on re-health.md
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
  },
  {
    id: 'ape-swing',
    name: 'Ape Swing',
    category: 'foundational',
    difficulty: 2,
    description: 'From squat, swing arms explosively to one side, land softly.',
    musclesTargeted: ['Adductors', 'Obliques', 'Shoulders'],
    benefits: ['Dynamic hip mobility', 'Core tension', 'Rotational power'],
    commonErrors: ['Landing heavily', 'Incomplete arm swing'],
    imageUrl: 'placeholder.jpg',
    videoUrl: 'https://www.example.com/ape-swing',
    formCues: [
      'Maintain deep squat throughout',
      'Use arms for momentum and balance',
      'Land softly and quietly'
    ],
    complementaryMovements: ['beast-hold', 'frogger-jump'],
    progressions: ['traveling-ape', 'ape-to-beast-transition'],
    regressions: ['stationary-deep-squat', 'controlled-step-out']
  }
];

/**
 * MovementLibrary - Repository of all Animal Flow movements with search/filter functionality
 * 
 * This component displays a searchable and filterable list of Animal Flow movements, 
 * allowing users to select individual movements for detailed view.
 * 
 * @param {Object} props
 * @param {Array} props.movements - Array of movement data including videos and descriptions
 * @param {Function} props.onSelectMovement - Handler for selecting a movement
 * @param {boolean} props.disableScrolling - Whether to disable scrolling and render movements in a flat view
 */
const MovementLibrary = ({ 
  movements = MOVEMENT_DATA, 
  onSelectMovement,
  disableScrolling = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovements, setFilteredMovements] = useState(movements);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter movements when search query or category changes
  useEffect(() => {
    let filtered = movements;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(movement => movement.category === selectedCategory);
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movement => 
        movement.name.toLowerCase().includes(query) || 
        movement.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredMovements(filtered);
  }, [searchQuery, selectedCategory, movements]);

  // Render a single movement card
  const renderMovementCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onSelectMovement && onSelectMovement(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[
          styles.difficultyBadge, 
          item.difficulty === 1 ? styles.beginnerBadge : 
          item.difficulty === 2 ? styles.intermediateBadge : 
          styles.advancedBadge
        ]}>
          <Text style={styles.difficultyText}>
            {item.difficulty === 1 ? 'Beginner' : 
             item.difficulty === 2 ? 'Intermediate' : 'Advanced'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {/* Placeholder for actual images */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{item.name[0]}</Text>
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.categoryLabel}>
            Category: <Text style={styles.categoryText}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
          </Text>
          <Text style={styles.benefitsLabel}>
            Benefits: <Text style={styles.benefitsText}>{item.benefits.join(', ')}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movements..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="always"
      />
      
      {/* Category filter */}
      <View style={styles.categoryFilters}>
        {['all', 'foundational', 'advanced', 'warmup', 'cooldown'].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryFilter,
              selectedCategory === category && styles.selectedCategoryFilter
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryFilterText,
              selectedCategory === category && styles.selectedCategoryFilterText
            ]}>
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Movement list */}
      {filteredMovements.length > 0 ? (
        disableScrolling ? (
          // When scrolling is disabled, render items in a regular View
          <View style={styles.staticListContainer}>
            {filteredMovements.map((item) => (
              <View key={item.id} style={{ width: '100%' }}>
                {renderMovementCard({ item })}
              </View>
            ))}
          </View>
        ) : (
          // When scrolling is enabled (default), use FlatList
          <FlatList
            data={filteredMovements}
            renderItem={renderMovementCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            // Add these props to help avoid nesting issues
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No movements found</Text>
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
            <Text style={styles.resetFiltersText}>Reset filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  categoryFilters: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryFilter: {
    backgroundColor: '#007AFF',
  },
  categoryFilterText: {
    fontSize: 12,
    color: '#666',
  },
  selectedCategoryFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 16,
  },
  staticListContainer: {
    paddingBottom: 16,
    width: '100%',
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
  descriptionContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoryText: {
    color: '#333',
  },
  benefitsLabel: {
    fontSize: 12,
    color: '#666',
  },
  benefitsText: {
    color: '#333',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resetFiltersText: {
    fontSize: 14,
    color: '#007AFF',
  }
});

export default MovementLibrary;

