import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
  Modal,
  ScrollView,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SessionLog - Interface for logging workout details
 * 
 * This component allows users to record details about their workout sessions,
 * including duration, movements performed, and notes. It also provides 
 * capabilities to view, edit, and save session data.
 * 
 * @param {Object} props
 * @param {Function} props.onLogSession - Handler for saving session data
 * @param {Array} props.sessionHistory - Array of past workout sessions
 * @param {Object} props.currentSession - Data for active workout session
 * @param {Function} props.updateNotes - Handler for updating session notes
 * @param {Function} props.addMovement - Handler for adding movement to session
 */
const SessionLog = ({ 
  onLogSession, 
  sessionHistory = [],
  currentSession = null,
  updateNotes,
  addMovement
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionData, setSessionData] = useState({
    notes: '',
    intensity: 'moderate', // 'low', 'moderate', 'high'
    movements: []
  });
  const [modalVisible, setModalVisible] = useState(false);

  // Reset session data when currentSession changes
  useEffect(() => {
    if (currentSession) {
      setSessionData({
        notes: currentSession.notes || '',
        intensity: currentSession.intensity || 'moderate',
        movements: currentSession.movements || []
      });
    }
  }, [currentSession]);

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

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? `${hours}:` : '',
      `${minutes < 10 ? '0' : ''}${minutes}:`,
      `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    ].join('');
  };

  // Handle saving session notes
  const handleSaveNotes = () => {
    if (updateNotes) {
      updateNotes(sessionData.notes);
    }
    
    // If we're in edit mode for a past session, handle update differently
    if (isEditing && selectedSession) {
      const updatedSession = {
        ...selectedSession,
        notes: sessionData.notes,
        intensity: sessionData.intensity
      };
      
      // Find and update the session in history
      const updatedHistory = sessionHistory.map(session => 
        session.id === selectedSession.id ? updatedSession : session
      );
      
      // Save updated history
      AsyncStorage.setItem('sessionHistory', JSON.stringify(updatedHistory))
        .then(() => {
          Alert.alert('Success', 'Session updated successfully');
          setIsEditing(false);
          setSelectedSession(null);
          setModalVisible(false);
          
          // Refresh session history (this would be handled by the parent component)
          if (onLogSession) {
            onLogSession(updatedHistory);
          }
        })
        .catch(error => {
          console.error('Failed to update session:', error);
          Alert.alert('Error', 'Failed to update session');
        });
    } else {
      // Close modal for current session notes
      setModalVisible(false);
    }
  };

  // Handle selecting a session for editing
  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setSessionData({
      notes: session.notes || '',
      intensity: session.intensity || 'moderate',
      movements: session.movements || []
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  // Render movement item
  const renderMovementItem = ({ item }) => (
    <View style={styles.movementItem}>
      <Text style={styles.movementName}>{item.name || 'Unknown Movement'}</Text>
      <Text style={styles.movementTimestamp}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  // Render session detail modal
  const renderSessionModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Session' : 'Current Session'}
          </Text>
          
          {selectedSession && (
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionLabel}>Date:</Text>
              <Text style={styles.sessionValue}>{formatDate(selectedSession.startTime)}</Text>
            </View>
          )}
          
          {selectedSession && selectedSession.duration && (
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionLabel}>Duration:</Text>
              <Text style={styles.sessionValue}>{formatTime(selectedSession.duration)}</Text>
            </View>
          )}
          
          <Text style={styles.inputLabel}>Notes:</Text>
          <TextInput
            style={styles.notesInput}
            value={sessionData.notes}
            onChangeText={(text) => setSessionData(prev => ({ ...prev, notes: text }))}
            placeholder="Add notes about your session..."
            multiline
            textAlignVertical="top"
          />
          
          <Text style={styles.inputLabel}>Intensity:</Text>
          <View style={styles.intensitySelector}>
            <TouchableOpacity 
              style={[
                styles.intensityOption,
                sessionData.intensity === 'low' && styles.selectedIntensity
              ]}
              onPress={() => setSessionData(prev => ({ ...prev, intensity: 'low' }))}
            >
              <Text style={[
                styles.intensityText,
                sessionData.intensity === 'low' && styles.selectedIntensityText
              ]}>Low</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.intensityOption,
                sessionData.intensity === 'moderate' && styles.selectedIntensity
              ]}
              onPress={() => setSessionData(prev => ({ ...prev, intensity: 'moderate' }))}
            >
              <Text style={[
                styles.intensityText,
                sessionData.intensity === 'moderate' && styles.selectedIntensityText
              ]}>Moderate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.intensityOption,
                sessionData.intensity === 'high' && styles.selectedIntensity
              ]}
              onPress={() => setSessionData(prev => ({ ...prev, intensity: 'high' }))}
            >
              <Text style={[
                styles.intensityText,
                sessionData.intensity === 'high' && styles.selectedIntensityText
              ]}>High</Text>
            </TouchableOpacity>
          </View>
          
          {sessionData.movements && sessionData.movements.length > 0 ? (
            <>
              <Text style={styles.inputLabel}>Movements:</Text>
              <FlatList
                data={sessionData.movements}
                renderItem={renderMovementItem}
                keyExtractor={(item, index) => `${item.id || 'movement'}-${index}`}
                style={styles.movementsList}
              />
            </>
          ) : (
            <Text style={styles.noMovementsText}>No movements logged for this session.</Text>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveNotes}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Current session UI */}
      {currentSession && (
        <View style={styles.currentSessionContainer}>
          <View style={styles.currentSessionHeader}>
            <Text style={styles.currentSessionTitle}>Current Session</Text>
            <Text style={styles.currentSessionDuration}>
              Duration: {formatTime(currentSession.duration || 0)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addNotesButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addNotesButtonText}>
              {sessionData.notes ? 'Edit Notes' : 'Add Notes'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.currentSessionPrompt}>
            Recording workout session. End your session to save it to history.
          </Text>
        </View>
      )}
      
      {/* Session history */}
      <Text style={styles.sectionTitle}>Session History</Text>
      
      {sessionHistory.length > 0 ? (
        <FlatList
          data={sessionHistory}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.sessionCard}
              onPress={() => handleSelectSession(item)}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
                <Text style={styles.sessionDuration}>{formatTime(item.duration)}</Text>
              </View>
              <View style={styles.sessionDetails}>
                <Text style={styles.sessionMovements}>
                  Movements: {item.movements ? item.movements.length : 0}
                </Text>
                {item.intensity && (
                  <View style={[
                    styles.intensityBadge,
                    item.intensity === 'low' && styles.lowIntensity,
                    item.intensity === 'moderate' && styles.moderateIntensity,
                    item.intensity === 'high' && styles.highIntensity
                  ]}>
                    <Text style={styles.intensityBadgeText}>
                      {item.intensity.charAt(0).toUpperCase() + item.intensity.slice(1)}
                    </Text>
                  </View>
                )}
                {item.notes ? (
                  <Text style={styles.sessionNotes} numberOfLines={2}>
                    {item.notes}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.sessionList}
        />
      ) : (
        <Text style={styles.emptyStateText}>
          No workout sessions recorded yet. Start a session to begin tracking!
        </Text>
      )}
      
      {/* Session modal for editing/viewing session details */}
      {renderSessionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  currentSessionContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  currentSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentSessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  currentSessionDuration: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  addNotesButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  addNotesButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  currentSessionPrompt: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
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
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  intensityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 4,
  },
  lowIntensity: {
    backgroundColor: '#E8F5E9',
  },
  moderateIntensity: {
    backgroundColor: '#FFF3E0',
  },
  highIntensity: {
    backgroundColor: '#FFEBEE',
  },
  intensityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sessionLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  sessionValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  intensitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  intensityOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  selectedIntensity: {
    backgroundColor: '#007AFF',
  },
  intensityText: {
    fontSize: 14,
    color: '#666',
  },
  selectedIntensityText: {
    color: 'white',
    fontWeight: '600',
  },
  movementsList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  movementName: {
    fontSize: 14,
    color: '#333',
  },
  movementTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  noMovementsText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginVertical: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  }
});

export default SessionLog;

