import React, { useState, useEffect } from 'react';
import { getAllVetHistories, getPatientSummary } from './vetService';

/**
 * PromptModal - A modal component for custom AI prompt input
 * 
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Callback function to close the modal
 * @param {function} onSend - Callback function to send the custom prompt for AI processing
 * @param {string} patientName - Name of the patient for display in modal title
 * 
 * This modal allows users to enter custom prompts for AI-powered patient summary generation.
 * The AI will use the custom prompt instead of the default summarization prompt to generate
 * specialized summaries based on specific veterinary requirements.
 */
const PromptModal = ({ visible, onClose, onSend, patientName }) => {
  const [promptValue, setPromptValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setPromptValue('');
      setError('');
      setIsLoading(false);
      // Focus the modal for keyboard accessibility
      const timer = setTimeout(() => {
        const modalElement = document.querySelector('[data-modal="prompt-modal"]');
        if (modalElement) {
          modalElement.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSend = async () => {
    const trimmedPrompt = promptValue.trim();
    if (!trimmedPrompt) {
      setError('Please enter a prompt before sending.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onSend(trimmedPrompt);
      onClose();
    } catch (err) {
      setError('Failed to send prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPromptValue('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (promptValue.trim() && !isLoading) {
        handleSend();
      }
    }
  };

  const handleTextareaKeyDown = (e) => {
    // Allow normal Enter in textarea, but still handle Ctrl+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (promptValue.trim() && !isLoading) {
        handleSend();
      }
    }
  };

  if (!visible) return null;

  const isPromptEmpty = !promptValue.trim();

  return (
    <div 
      data-modal="prompt-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        backdropFilter: 'blur(2px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#495057',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 
            id="modal-title"
            style={{ 
              margin: 0, 
              color: '#495057',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}
          >
            Custom Prompt for {patientName}
          </h3>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6c757d',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              opacity: isLoading ? 0.5 : 1,
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.color = '#495057')}
            onMouseOut={(e) => !isLoading && (e.target.style.color = '#6c757d')}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <p 
          id="modal-description"
          style={{ 
            margin: '0 0 1rem 0', 
            color: '#6c757d',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}
        >
          Enter a custom prompt to generate a specialized summary for this patient.
        </p>

        {error && (
          <div style={{ 
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="prompt-textarea"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#495057',
              fontSize: '0.95rem'
            }}
          >
            Prompt:
          </label>
          <textarea 
            id="prompt-textarea"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Enter your prompt here... (Press Ctrl+Enter to send)"
            disabled={isLoading}
            autoFocus
            style={{ 
              width: '100%', 
              height: '120px',
              padding: '0.75rem',
              border: '2px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '80px',
              maxHeight: '200px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: isLoading ? '#f8f9fa' : 'white',
              cursor: isLoading ? 'not-allowed' : 'text',
              borderColor: error ? '#dc3545' : (promptValue.trim() ? '#28a745' : '#dee2e6')
            }}
            onFocus={(e) => !isLoading && (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => !isLoading && (e.target.style.borderColor = error ? '#dc3545' : (promptValue.trim() ? '#28a745' : '#dee2e6'))}
          />
          <small style={{ 
            color: '#6c757d', 
            fontSize: '0.85rem',
            display: 'block',
            marginTop: '0.25rem'
          }}>
            Tip: Use Ctrl+Enter to send quickly, or Esc to close.
          </small>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={handleCancel} 
            disabled={isLoading}
            style={{
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: '2px solid #dee2e6',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.5 : 1,
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => !isLoading && (
              e.target.style.backgroundColor = '#f8f9fa',
              e.target.style.borderColor = '#adb5bd'
            )}
            onMouseOut={(e) => !isLoading && (
              e.target.style.backgroundColor = 'transparent',
              e.target.style.borderColor = '#dee2e6'
            )}
          >
            Cancel
          </button>
          <button 
            onClick={handleSend} 
            disabled={isLoading || isPromptEmpty}
            style={{
              backgroundColor: (isLoading || isPromptEmpty) ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: (isLoading || isPromptEmpty) ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: (isLoading || isPromptEmpty) ? 0.6 : 1,
              fontFamily: 'inherit',
              minWidth: '100px',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => !isLoading && !isPromptEmpty && (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !isLoading && !isPromptEmpty && (e.target.style.backgroundColor = '#007bff')}
          >
            {isLoading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Hardcoded sample data as fallback
const SAMPLE_PATIENT_DATA = [
  {
    id: '1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 5,
    owner: 'John Smith',
    lastVisit: '2024-01-15',
    status: 'Healthy',
    visits: [
      {
        id: 'v1-1',
        date: '2024-01-15',
        reason: 'Annual Checkup',
        diagnosis: 'Healthy with minor weight gain',
        treatment: 'Vaccinations updated, diet recommendations provided',
        notes: 'Weight increased by 3 lbs since last visit. Recommend reducing daily food intake by 10% and increasing exercise. All vital signs normal.',
        veterinarian: 'Dr. Smith',
        weight: '68 lbs',
        temperature: '101.2°F',
        medications: ['Heartgard Plus', 'NexGard'],
        followUpRequired: false
      },
      {
        id: 'v1-2',
        date: '2023-01-10',
        reason: 'Annual Checkup',
        diagnosis: 'Healthy',
        treatment: 'Routine vaccinations, dental cleaning',
        notes: 'Overall excellent health. Good dental hygiene. Owner very attentive to care.',
        veterinarian: 'Dr. Smith',
        weight: '65 lbs',
        temperature: '101.1°F',
        medications: ['Heartgard Plus', 'NexGard'],
        followUpRequired: false
      },
      {
        id: 'v1-3',
        date: '2022-06-15',
        reason: 'Injury - Cut Paw',
        diagnosis: 'Minor laceration on left front paw',
        treatment: 'Wound cleaning, antibiotics, protective bandaging',
        notes: 'Small cut from broken glass during walk. Cleaned and bandaged. Prescribed antibiotics to prevent infection.',
        veterinarian: 'Dr. Johnson',
        weight: '64 lbs',
        temperature: '101.0°F',
        medications: ['Amoxicillin', 'Pain relief'],
        followUpRequired: true,
        followUpDate: '2022-06-22'
      }
    ]
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    owner: 'Sarah Johnson',
    lastVisit: '2024-01-10',
    status: 'Under Treatment',
    visits: [
      {
        id: 'v2-1',
        date: '2024-01-10',
        reason: 'Ear Infection',
        diagnosis: 'Bacterial ear infection (Otitis externa)',
        treatment: 'Ear cleaning, antibiotic drops, pain medication',
        notes: 'Severe ear infection with discharge. Started on antibiotic ear drops. Owner instructed on proper administration. Follow-up in 2 weeks.',
        veterinarian: 'Dr. Wilson',
        weight: '9.2 lbs',
        temperature: '102.1°F',
        medications: ['Otomax ear drops', 'Metacam'],
        followUpRequired: true,
        followUpDate: '2024-01-24'
      },
      {
        id: 'v2-2',
        date: '2023-12-05',
        reason: 'Routine Checkup',
        diagnosis: 'Healthy',
        treatment: 'Vaccinations, dental examination',
        notes: 'Annual wellness exam. All vaccinations up to date. Slight tartar buildup noted - recommend dental treats.',
        veterinarian: 'Dr. Wilson',
        weight: '9.0 lbs',
        temperature: '101.5°F',
        medications: ['Monthly flea prevention'],
        followUpRequired: false
      }
    ]
  },
  {
    id: '3',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 7,
    owner: 'Mike Davis',
    lastVisit: '2024-01-08',
    status: 'Chronic Condition',
    visits: [
      {
        id: 'v3-1',
        date: '2024-01-08',
        reason: 'Arthritis Management',
        diagnosis: 'Osteoarthritis - stable condition',
        treatment: 'Pain medication adjustment, joint supplement',
        notes: 'Arthritis well-managed with current medication. Adjusted Rimadyl dosage. Added glucosamine supplement. Patient showing good mobility.',
        veterinarian: 'Dr. Brown',
        weight: '78 lbs',
        temperature: '101.3°F',
        medications: ['Rimadyl', 'Glucosamine', 'Fish oil'],
        followUpRequired: true,
        followUpDate: '2024-04-08'
      },
      {
        id: 'v3-2',
        date: '2023-10-15',
        reason: 'Arthritis Follow-up',
        diagnosis: 'Osteoarthritis progression',
        treatment: 'Started pain management protocol',
        notes: 'Initial diagnosis of arthritis. Started on anti-inflammatory medication. Discussed weight management and exercise modification.',
        veterinarian: 'Dr. Brown',
        weight: '80 lbs',
        temperature: '101.2°F',
        medications: ['Rimadyl', 'Joint supplement'],
        followUpRequired: true,
        followUpDate: '2024-01-15'
      },
      {
        id: 'v3-3',
        date: '2023-07-20',
        reason: 'Limping',
        diagnosis: 'Hip discomfort, suspected arthritis',
        treatment: 'X-rays, pain relief, rest',
        notes: 'Owner reported limping after long walks. X-rays show early signs of hip arthritis. Prescribed rest and pain management.',
        veterinarian: 'Dr. Brown',
        weight: '81 lbs',
        temperature: '101.1°F',
        medications: ['Metacam'],
        followUpRequired: true,
        followUpDate: '2023-08-03'
      }
    ]
  },
  {
    id: '4',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    owner: 'Emily Wilson',
    lastVisit: '2024-01-12',
    status: 'Recovering',
    visits: [
      {
        id: 'v4-1',
        date: '2024-01-12',
        reason: 'Post-Surgery Follow-up',
        diagnosis: 'Spay surgery recovery - excellent progress',
        treatment: 'Incision check, pain management',
        notes: 'Post-operative check after spay surgery. Incision healing perfectly. No signs of infection. Pain well-controlled.',
        veterinarian: 'Dr. Taylor',
        weight: '7.8 lbs',
        temperature: '101.0°F',
        medications: ['Metacam (tapering dose)'],
        followUpRequired: true,
        followUpDate: '2024-01-19'
      },
      {
        id: 'v4-2',
        date: '2024-01-05',
        reason: 'Spay Surgery',
        diagnosis: 'Routine spay procedure',
        treatment: 'Ovariohysterectomy performed',
        notes: 'Routine spay surgery completed successfully. No complications during procedure. Patient recovering well from anesthesia.',
        veterinarian: 'Dr. Taylor',
        weight: '8.0 lbs',
        temperature: '100.8°F',
        medications: ['Metacam', 'Antibiotics'],
        followUpRequired: true,
        followUpDate: '2024-01-12'
      },
      {
        id: 'v4-3',
        date: '2023-12-20',
        reason: 'Pre-Surgery Consultation',
        diagnosis: 'Healthy - cleared for surgery',
        treatment: 'Pre-operative examination and bloodwork',
        notes: 'Pre-surgical exam for spay procedure. All bloodwork normal. Patient cleared for surgery. Discussed post-operative care with owner.',
        veterinarian: 'Dr. Taylor',
        weight: '8.1 lbs',
        temperature: '101.2°F',
        medications: [],
        followUpRequired: false
      }
    ]
  },
  {
    id: '5',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 4,
    owner: 'Robert Brown',
    lastVisit: '2024-01-14',
    status: 'Healthy',
    visits: [
      {
        id: 'v5-1',
        date: '2024-01-14',
        reason: 'Dental Cleaning',
        diagnosis: 'Good dental health',
        treatment: 'Professional dental cleaning and scaling',
        notes: 'Annual dental cleaning performed under anesthesia. All teeth in excellent condition. No extractions needed. Recommend dental treats for maintenance.',
        veterinarian: 'Dr. Anderson',
        weight: '72 lbs',
        temperature: '101.0°F',
        medications: ['Post-anesthesia monitoring'],
        followUpRequired: false,
        nextDentalCleaning: '2025-01-14'
      },
      {
        id: 'v5-2',
        date: '2023-08-10',
        reason: 'Annual Wellness',
        diagnosis: 'Excellent health',
        treatment: 'Vaccinations, heartworm test, fecal exam',
        notes: 'Annual wellness exam. All vaccines updated. Heartworm test negative. Fecal exam clear. Owner doing excellent job with preventive care.',
        veterinarian: 'Dr. Anderson',
        weight: '70 lbs',
        temperature: '101.2°F',
        medications: ['Heartgard Plus', 'NexGard', 'Annual vaccines'],
        followUpRequired: false
      },
      {
        id: 'v5-3',
        date: '2023-03-22',
        reason: 'Stomach Upset',
        diagnosis: 'Mild gastroenteritis',
        treatment: 'Bland diet, probiotics, monitoring',
        notes: 'Owner reported vomiting and diarrhea for 2 days. Likely dietary indiscretion. Prescribed bland diet and probiotics. Resolved within 3 days.',
        veterinarian: 'Dr. Anderson',
        weight: '69 lbs',
        temperature: '101.8°F',
        medications: ['Probiotics', 'Anti-nausea medication'],
        followUpRequired: false
      }
    ]
  }
];

/**
 * PatientHistoryList - Main component for displaying and managing patient histories
 * 
 * @param {boolean} [useApi=false] - Controls data source for patient records
 *   - true: Attempts to fetch data from the existing vet histories API endpoint
 *   - false: Uses hardcoded sample data for development/testing
 * 
 * Features:
 * - Displays patient records in a responsive table format
 * - Supports both API and hardcoded data sources with automatic fallback
 * - Patient detail view with comprehensive medical history display
 * - AI-powered summary generation with custom prompt support
 * - Real-time loading states and error handling
 * - Custom prompt modal for specialized AI summarization
 * 
 * The component integrates with vetService.js to generate AI summaries using:
 * - getPatientSummary() for default summaries
 * - Custom prompts through the PromptModal for specialized veterinary analysis
 * 
 * Expected data format for patient histories:
 * {
 *   id: string,
 *   name: string,
 *   species: string,
 *   breed: string,
 *   age: number,
 *   owner: string,
 *   lastVisit: string (YYYY-MM-DD),
 *   status: string ('Healthy', 'Under Treatment', 'Chronic Condition', 'Recovering'),
 *   history: string (detailed medical history text),
 *   visits?: [{
 *     id: string,
 *     date: string,
 *     reason: string,
 *     diagnosis: string,
 *     treatment: string,
 *     notes: string,
 *     veterinarian: string,
 *     medications: string[]
 *   }]
 * }
 */
const PatientHistoryList = ({ useApi = false }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const [summaries, setSummaries] = useState({}); // Store summaries by patient ID
  const [loadingSummaries, setLoadingSummaries] = useState({}); // Track loading state per patient

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!useApi) {
        // Use hardcoded data
        setTimeout(() => {
          setPatients(SAMPLE_PATIENT_DATA);
          setDataSource('hardcoded');
          setLoading(false);
        }, 500); // Simulate loading delay
        return;
      }

      try {
        // Try to fetch from existing vet histories API
        // Note: This adapts the existing API to work with patient list format
        const data = await getAllVetHistories();
        
        // Transform the vet history data to patient format
        const transformedData = data.map((item, index) => ({
          id: item.id || `${index + 1}`,
          name: item.name || 'Unknown',
          species: item.species || 'Unknown',
          breed: item.breed || 'Mixed',
          age: item.age || 0,
          owner: `Owner ${index + 1}`, // This would come from a different API in real scenario
          lastVisit: new Date().toISOString().split('T')[0], // Current date as placeholder
          history: item.history || 'No history available',
          status: 'Healthy' // Default status
        }));
        
        setPatients(transformedData.length > 0 ? transformedData : SAMPLE_PATIENT_DATA);
        setDataSource(transformedData.length > 0 ? 'api' : 'fallback');
      } catch (err) {
        console.warn('API failed, falling back to hardcoded data:', err.message);
        setPatients(SAMPLE_PATIENT_DATA);
        setDataSource('fallback');
        setError('API unavailable, showing sample data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [useApi]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(selectedPatient?.id === patient.id ? null : patient);
  };

  const handleSendPrompt = async (promptText) => {
    // Close the modal
    setModalVisible(false);
    
    // Set loading state for selectedPatient.id
    setLoadingSummaries(prev => ({ ...prev, [selectedPatient.id]: true }));
    
    try {
      // Call getPatientSummary with selectedPatient and promptText
      const result = await getPatientSummary(selectedPatient, promptText);
      
      // Update summaries[selectedPatient.id] with result
      setSummaries(prev => ({ 
        ...prev, 
        [selectedPatient.id]: result.summary 
      }));
    } catch (error) {
      console.error('Error generating custom summary:', error);
      setSummaries(prev => ({ 
        ...prev, 
        [selectedPatient.id]: 'Error generating custom summary. Please try again.' 
      }));
    } finally {
      // Clear selectedPatient and set loading false
      setSelectedPatient(null);
      setLoadingSummaries(prev => ({ ...prev, [selectedPatient.id]: false }));
    }
  };

  const handleRefresh = () => {
    if (useApi) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await getAllVetHistories();
          const transformedData = data.map((item, index) => ({
            id: item.id || `${index + 1}`,
            name: item.name || 'Unknown',
            species: item.species || 'Unknown',
            breed: item.breed || 'Mixed',
            age: item.age || 0,
            owner: `Owner ${index + 1}`,
            lastVisit: new Date().toISOString().split('T')[0],
            history: item.history || 'No history available',
            status: 'Healthy'
          }));
          
          setPatients(transformedData.length > 0 ? transformedData : SAMPLE_PATIENT_DATA);
          setDataSource(transformedData.length > 0 ? 'api' : 'fallback');
        } catch (err) {
          setError(`Failed to refresh: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  // Handle summarization with OpenAI API
  const handleSummarize = async (patient) => {
    setLoadingSummaries(prev => ({ ...prev, [patient.id]: true }));
    
    try {
      // Call the real OpenAI API service
      const result = await getPatientSummary(patient);
      
      setSummaries(prev => ({ 
        ...prev, 
        [patient.id]: result.summary 
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaries(prev => ({ 
        ...prev, 
        [patient.id]: 'Error generating summary. Please try again.' 
      }));
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [patient.id]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#28a745';
      case 'Under Treatment': return '#ffc107';
      case 'Chronic Condition': return '#fd7e14';
      case 'Recovering': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading patient records...</div>
        <div style={{ color: '#6c757d' }}>Please wait while we fetch the data</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Patient History List</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={useApi}
              onChange={(e) => window.location.reload()} // Simple refresh for demo
              style={{ marginRight: '0.25rem' }}
            />
            Use API data
          </label>
          {useApi && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '0.875rem'
              }}
            >
              Refresh Data
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: '#6c757d', margin: 0 }}>
          {patients.length} patient records found
        </p>
        <span style={{
          fontSize: '0.875rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          backgroundColor: dataSource === 'api' ? '#d4edda' : dataSource === 'hardcoded' ? '#cce5ff' : '#fff3cd',
          color: dataSource === 'api' ? '#155724' : dataSource === 'hardcoded' ? '#004085' : '#856404',
          border: `1px solid ${dataSource === 'api' ? '#c3e6cb' : dataSource === 'hardcoded' ? '#b3d7ff' : '#ffeeba'}`
        }}>
          Data source: {dataSource === 'api' ? 'Live API' : dataSource === 'fallback' ? 'API Fallback' : 'Hardcoded Sample'}
        </span>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Table View */}
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Species/Breed</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Age</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Owner</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Last Visit</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id} style={{ 
                borderBottom: index === patients.length - 1 ? 'none' : '1px solid #dee2e6',
                '&:hover': { backgroundColor: '#f8f9fa' }
              }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#495057' }}>{patient.name}</td>
                <td style={{ padding: '1rem', color: '#6c757d' }}>{patient.species} - {patient.breed}</td>
                <td style={{ padding: '1rem', color: '#6c757d' }}>{patient.age} years</td>
                <td style={{ padding: '1rem', color: '#6c757d' }}>{patient.owner}</td>
                <td style={{ padding: '1rem', color: '#6c757d' }}>{patient.lastVisit}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(patient.status)
                  }}>
                    {patient.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handlePatientSelect(patient)}
                      style={{
                        backgroundColor: selectedPatient?.id === patient.id ? '#dc3545' : '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (selectedPatient?.id === patient.id) {
                          e.target.style.backgroundColor = '#c82333';
                        } else {
                          e.target.style.backgroundColor = '#0056b3';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedPatient?.id === patient.id) {
                          e.target.style.backgroundColor = '#dc3545';
                        } else {
                          e.target.style.backgroundColor = '#007bff';
                        }
                      }}
                    >
                      {selectedPatient?.id === patient.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setModalVisible(true);
                      }}
                      disabled={loadingSummaries[patient.id]}
                      style={{
                        backgroundColor: loadingSummaries[patient.id] ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: loadingSummaries[patient.id] ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                        opacity: loadingSummaries[patient.id] ? 0.6 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!loadingSummaries[patient.id]) {
                          e.target.style.backgroundColor = '#218838';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!loadingSummaries[patient.id]) {
                          e.target.style.backgroundColor = '#28a745';
                        }
                      }}
                    >
                      {loadingSummaries[patient.id] ? 'Summarizing...' : 'Summarize'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed View */}
      {selectedPatient && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#495057', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
            Patient Details: {selectedPatient.name}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#495057' }}>Basic Information</h4>
              <div style={{ lineHeight: '1.6' }}>
                <strong>Species:</strong> {selectedPatient.species}<br/>
                <strong>Breed:</strong> {selectedPatient.breed}<br/>
                <strong>Age:</strong> {selectedPatient.age} years
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#495057' }}>Contact & Status</h4>
              <div style={{ lineHeight: '1.6' }}>
                <strong>Owner:</strong> {selectedPatient.owner}<br/>
                <strong>Last Visit:</strong> {selectedPatient.lastVisit}<br/>
                <strong>Status:</strong> <span style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '3px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: getStatusColor(selectedPatient.status)
                }}>
                  {selectedPatient.status}
                </span>
              </div>
            </div>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#495057' }}>Medical History</h4>
            <p style={{ 
              margin: 0, 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              lineHeight: '1.6',
              color: '#495057'
            }}>
              {selectedPatient.history}
            </p>
          </div>
        </div>
      )}

      {/* AI Summaries Section */}
      {Object.keys(summaries).length > 0 && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#155724' }}>AI Generated Summaries</h3>
          {Object.entries(summaries).map(([patientId, summary]) => {
            const patient = patients.find(p => p.id === patientId);
            return (
              <div key={patientId} style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #c3e6cb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
                  Summary for {patient?.name || `Patient ${patientId}`}
                </h4>
                <div style={{
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6',
                  color: '#495057',
                  fontSize: '0.95rem'
                }}>
                  {summary}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        border: '1px solid #ced4da'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>How to use this component:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6', color: '#6c757d' }}>
          <li><strong>Hardcoded Data:</strong> Uncheck "Use API data" to see sample patient records</li>
          <li><strong>API Integration:</strong> Check "Use API data" to fetch from the existing vet histories API</li>
          <li><strong>View Details:</strong> Click "View Details" on any patient to see their full medical history</li>
          <li><strong>AI Summarize:</strong> Click "Summarize" to generate an AI-powered summary of the patient's history</li>
          <li><strong>Refresh:</strong> Use the "Refresh Data" button to reload API data</li>
          <li><strong>Error Handling:</strong> The component falls back to sample data if the API is unavailable</li>
        </ul>
      </div>

      <PromptModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSend={handleSendPrompt}
        patientName={selectedPatient?.name}
      />
    </div>
  );
};

export default PatientHistoryList;
export { PromptModal };

