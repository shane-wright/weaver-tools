import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Will need to install and import:
// import { Video } from 'expo-av';

/**
 * MovementDetail - Detailed view of a specific movement with video instructions
 * 
 * This component displays comprehensive information about a selected movement,
 * including video demonstrations, form cues, and progress tracking.
 * 
 * @param {Object} props
 * @param {Object} props.movement - Movement data object
 * @param {Function} props.onBack - Handler for navigating back
 */
const MovementDetail = ({ movement, onBack }) => {
  // State for tracking which section is currently being viewed
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [practiceNotes, setPracticeNotes] = useState('');
  const [practiceHistory, setPracticeHistory] = useState([]);

  // Load practice history from AsyncStorage
  useEffect(() => {
    const loadPracticeHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(`practice_${movement.id}`);
        if (storedHistory) {
          setPracticeHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load practice history:', error);
      }
    };

    if (movement?.id) {
      loadPracticeHistory();
    }
  }, [movement?.id]);

  // Save practice notes
  const savePracticeNotes = async () => {
    if (!practiceNotes.trim()) {
      Alert.alert('Note Required', 'Please enter notes about your practice');
      return;
    }

    try {
      const newPracticeEntry = {
        date: new Date().toISOString(),
        notes: practiceNotes,
      };

      const updatedHistory = [newPracticeEntry, ...practiceHistory];
      
      await AsyncStorage.setItem(
        `practice_${movement.id}`,
        JSON.stringify(updatedHistory)
      );
      
      setPracticeHistory(updatedHistory);
      setPracticeNotes('');
      
      Alert.alert('Success', 'Practice notes saved successfully');
    } catch (error) {
      console.error('Failed to save practice notes:', error);
      Alert.alert('Error', 'Failed to save practice notes');
    }
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

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
          Overview
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'technique' && styles.activeTab]}
        onPress={() => setActiveTab('technique')}
      >
        <Text style={[styles.tabText, activeTab === 'technique' && styles.activeTabText]}>
          Technique
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'progression' && styles.activeTab]}
        onPress={() => setActiveTab('progression')}
      >
        <Text style={[styles.tabText, activeTab === 'progression' && styles.activeTabText]}>
          Progressions
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'practice' && styles.activeTab]}
        onPress={() => setActiveTab('practice')}
      >
        <Text style={[styles.tabText, activeTab === 'practice' && styles.activeTabText]}>
          My Practice
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{movement.description}</Text>
            
            <Text style={styles.sectionTitle}>Primary Benefits</Text>
            <View style={styles.benefitsList}>
              {movement.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Muscles Targeted</Text>
            <Text style={styles.musclesText}>{movement.musclesTargeted.join(', ')}</Text>
            
            {/* Video player placeholder - would use Expo Video component */}
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>
                  Video demonstration would be displayed here
                </Text>
                <TouchableOpacity
                  style={styles.videoButton}
                  onPress={() => setIsVideoPlaying(!isVideoPlaying)}
                >
                  <Text style={styles.videoButtonText}>
                    {isVideoPlaying ? 'Pause Video' : 'Play Video'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.videoCaption}>
                Video URL: {movement.videoUrl}
              </Text>
            </View>
          </View>
        );
        
      case 'technique':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Form Cues</Text>
            <View style={styles.cuesList}>
              {movement.formCues.map((cue, index) => (
                <View key={index} style={styles.cueItem}>
                  <Text style={styles.cueNumber}>{index + 1}</Text>
                  <Text style={styles.cueText}>{cue}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Common Errors to Avoid</Text>
            <View style={styles.errorsList}>
              {movement.commonErrors.map((error, index) => (
                <View key={index} style={styles.errorItem}>
                  <Text style={styles.errorText}>❌ {error}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Tips for Optimal Execution</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>
                • Focus on quality over quantity
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>
                • Breathe naturally throughout the movement
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>
                • Move at a controlled pace, especially when learning
              </Text>
            </View>
          </View>
        );
        
      case 'progression':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Complementary Movements</Text>
            <View style={styles.movementsList}>
              {movement.complementaryMovements.map((movementId, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.linkedMovement}
                  // This would need to be connected to find and display the selected movement
                  onPress={() => Alert.alert('Feature Coming Soon', 'Viewing linked movements will be available in a future update.')}
                >
                  <Text style={styles.linkedMovementText}>
                    {movementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Easier Variations</Text>
            <View style={styles.movementsList}>
              {movement.regressions.map((movementId, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.linkedMovement}
                  onPress={() => Alert.alert('Feature Coming Soon', 'Viewing linked movements will be available in a future update.')}
                >
                  <Text style={styles.linkedMovementText}>
                    {movementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Advanced Progressions</Text>
            <View style={styles.movementsList}>
              {movement.progressions.map((movementId, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.linkedMovement}
                  onPress={() => Alert.alert('Feature Coming Soon', 'Viewing linked movements will be available in a future update.')}
                >
                  <Text style={styles.linkedMovementText}>
                    {movementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'practice':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Track Your Practice</Text>
            <View style={styles.notesInputContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter notes about your practice session..."
                value={practiceNotes}
                onChangeText={setPracticeNotes}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={savePracticeNotes}
              >
                <Text style={styles.saveButtonText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionTitle}>Practice History</Text>
            {practiceHistory.length > 0 ? (
              practiceHistory.map((entry, index) => (
                <View key={index} style={styles.historyEntry}>
                  <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.historyNotes}>{entry.notes}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noHistoryText}>No practice history recorded yet.</Text>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };

  // If no movement is provided, show an error
  if (!movement) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>No movement details available</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with movement name and difficulty */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View>
          <Text style={styles.title}>{movement.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{movement.category.charAt(0).toUpperCase() + movement.category.slice(1)}</Text>
            <View style={[
              styles.difficultyBadge,
              movement.difficulty === 1 ? styles.beginnerBadge : 
              movement.difficulty === 2 ? styles.intermediateBadge : 
              styles.advancedBadge
            ]}>
              <Text style={styles.difficultyText}>
                {movement.difficulty === 1 ? 'Beginner' : 
                 movement.difficulty === 2 ? 'Intermediate' : 'Advanced'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Tabs navigation */}
      {renderTabs()}
      
      {/* Content based on active tab */}
      <ScrollView style={styles.contentScroll}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
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
    color: 'white',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
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
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 4,
  },
  musclesText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  videoContainer: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  videoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  videoButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  videoCaption: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  cuesList: {
    marginBottom: 16,
  },
  cueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cueNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
    fontWeight: 'bold',
  },
  cueText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  errorsList: {
    marginBottom: 16,
  },
  errorItem: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  movementsList: {
    marginBottom: 16,
  },
  linkedMovement: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  linkedMovementText: {
    fontSize: 14,
    color: '#333',
  },
  notesInputContainer: {
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  historyEntry: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: '#333',
  },
  noHistoryText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  }
});

export default MovementDetail;

