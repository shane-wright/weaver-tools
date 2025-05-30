import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';

/**
 * TimerControls - Component for controlling the fasting timer (start/end)
 * 
 * @param {Object} props
 * @param {boolean} props.isActive - Whether the fasting timer is active
 * @param {boolean} props.hasValidEndTime - Whether a valid end time has been set
 * @param {Function} props.onStartFast - Callback function when starting a fast
 * @param {Function} props.onEndFast - Callback function when ending a fast
 */
const TimerControls = ({ isActive, hasValidEndTime, onStartFast, onEndFast }) => {
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  // Start a fast
  const handleStartFast = () => {
    if (!hasValidEndTime) {
      Alert.alert(
        "No End Time Set",
        "Please set a valid fast end time before starting.",
        [{ text: "OK" }]
      );
      return;
    }
    
    onStartFast();
  };

  // Request confirmation for ending a fast
  const requestEndFast = () => {
    setShowEndConfirmation(true);
  };

  // Confirm and end the fast
  const confirmEndFast = () => {
    setShowEndConfirmation(false);
    onEndFast();
  };

  // Cancel end fast request
  const cancelEndFast = () => {
    setShowEndConfirmation(false);
  };

  return (
    <View style={styles.container}>
      {!isActive ? (
        <TouchableOpacity
          style={[
            styles.button,
            styles.startButton,
            !hasValidEndTime && styles.disabledButton
          ]}
          onPress={handleStartFast}
          disabled={!hasValidEndTime}
        >
          <Text style={styles.buttonText}>Start Fast</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.endButton]}
          onPress={requestEndFast}
        >
          <Text style={styles.buttonText}>End Fast</Text>
        </TouchableOpacity>
      )}

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEndConfirmation}
        onRequestClose={cancelEndFast}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End Fast Early?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to end your fast before the scheduled time?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelEndFast}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmEndFast}
              >
                <Text style={styles.confirmButtonText}>End Fast</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  endButton: {
    backgroundColor: '#f44336',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#f44336',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default TimerControls;

