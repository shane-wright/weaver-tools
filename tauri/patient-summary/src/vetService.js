// Service module for vet history API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Creates a new vet history record
 * @param {Object} vetData - The vet history data
 * @param {string} vetData.species - The animal species
 * @param {string} vetData.name - The animal name
 * @param {number} vetData.age - The animal age
 * @param {string} vetData.history - The medical history
 * @returns {Promise<Object>} The created vet history with ID
 */
export const createVetHistory = async (vetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vet-histories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vetData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating vet history:', error);
    throw error;
  }
};

/**
 * Generates an AI summary for a patient's history with custom prompt support
 * 
 * This function serves as the main interface for AI-powered patient summarization,
 * supporting both default and custom prompt-based analysis. It can work with
 * preloaded patient data or create temporary records for summarization.
 * 
 * @param {Object} patient - The patient object containing comprehensive history data
 * @param {string} patient.id - Unique patient identifier
 * @param {string} patient.name - Patient name
 * @param {string} patient.species - Animal species (Dog, Cat, etc.)
 * @param {number} patient.age - Patient age in years
 * @param {string} patient.history - Detailed medical history text
 * @param {string} [customPrompt] - Custom AI prompt for specialized analysis
 *   - If provided, overrides the default summarization prompt
 *   - Allows for specific veterinary analysis (e.g., "Focus on behavioral issues",
 *     "Summarize only vaccination history", "Analyze pain management effectiveness")
 *   - Should be clear and specific to get best AI results
 * @param {boolean} [usePreloadedData=false] - Data handling mode
 *   - true: Uses patient data directly without creating API records
 *   - false: Creates temporary vet history record for traditional API flow
 * 
 * @returns {Promise<Object>} AI-generated summary response
 * @returns {string} returns.patientId - Original patient ID
 * @returns {string} returns.patientName - Patient name for reference
 * @returns {string} returns.summary - AI-generated summary text
 * 
 * @example
 * // Default summarization
 * const summary = await getPatientSummary(patient);
 * 
 * // Custom prompt for behavioral analysis
 * const behaviorSummary = await getPatientSummary(
 *   patient, 
 *   "Analyze behavioral patterns and provide recommendations for training"
 * );
 * 
 * // Using preloaded data with custom prompt
 * const quickSummary = await getPatientSummary(
 *   patient, 
 *   "Provide a brief overview of recent health trends", 
 *   true
 * );
 */
export const getPatientSummary = async (patient, customPrompt, usePreloadedData = false) => {
  try {
    if (usePreloadedData) {
      // Use preloaded data directly for summarization without creating a new record
      const patientData = {
        species: patient.species,
        name: patient.name,
        age: patient.age,
        history: patient.history
      };
      
      // Generate a temporary ID for tracking
      const tempId = `temp_${Date.now()}`;
      
      // Get summary using preloaded data
      const summary = await getVetHistorySummary(tempId, patientData, { prompt: customPrompt });
      
      return {
        patientId: patient.id,
        patientName: patient.name,
        summary: summary.summary
      };
    }
    
    // Original behavior - create a temporary vet history for summarization
    const vetHistoryData = {
      species: patient.species,
      name: patient.name,
      age: patient.age,
      history: patient.history
    };

    // First create the vet history to get an ID
    const createdHistory = await createVetHistory(vetHistoryData);
    
    // Then get the summary using the ID
    const summary = await getVetHistorySummary(createdHistory.id, null, { prompt: customPrompt });
    
    return {
      patientId: patient.id,
      patientName: patient.name,
      summary: summary.summary
    };
  } catch (error) {
    console.error('Error generating patient summary:', error);
    throw error;
  }
};

/**
 * Fetches AI summary for vet history with support for custom prompts and preloaded data
 * 
 * This function handles both traditional ID-based summary fetching and direct
 * data processing for immediate summarization without database storage.
 * 
 * @param {string} id - The vet history ID or temporary identifier
 * @param {Object} [preloadedData=null] - Optional preloaded patient history data
 * @param {string} preloadedData.species - Animal species
 * @param {string} preloadedData.name - Animal name
 * @param {number} preloadedData.age - Animal age
 * @param {string} preloadedData.history - Medical history text
 * @param {Object} [options={}] - Additional options for summarization
 * @param {string} [options.prompt] - Custom AI prompt for specialized analysis
 *   - Overrides default summarization behavior
 *   - Examples: "Focus on behavioral issues", "Analyze vaccination compliance"
 *   - Should be specific and veterinary-focused for best results
 * 
 * @returns {Promise<Object>} AI-generated summary response
 * @returns {string} returns.summary - The AI-generated summary text
 * @returns {string} [returns.id] - History ID (if applicable)
 * 
 * @example
 * // Fetch summary by ID with default prompt
 * const summary = await getVetHistorySummary('hist_123');
 * 
 * // Process preloaded data with custom prompt
 * const customSummary = await getVetHistorySummary(
 *   'temp_id', 
 *   { species: 'Dog', name: 'Buddy', age: 5, history: '...' },
 *   { prompt: 'Focus on chronic conditions and management' }
 * );
 */
export const getVetHistorySummary = async (id, preloadedData = null, options = {}) => {
  try {
    // If preloaded data is provided, use it for summarization
    if (preloadedData) {
      const response = await fetch(`${API_BASE_URL}/api/vet-histories/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          data: preloadedData,
          prompt: options.prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // Fallback to original behavior - fetch summary by ID
    const response = await fetch(`${API_BASE_URL}/api/vet-histories/${id}/summary`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vet history summary:', error);
    throw error;
  }
};

/**
 * Fetches all vet histories
 * @returns {Promise<Array>} Array of vet histories
 */
export const getAllVetHistories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vet-histories`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vet histories:', error);
    throw error;
  }
};

/**
 * Processes arbitrary patient history data for summarization
 * @param {Object} historyPayload - The patient history payload
 * @param {string} historyPayload.species - The animal species
 * @param {string} historyPayload.name - The animal name
 * @param {number} historyPayload.age - The animal age
 * @param {string} historyPayload.history - The medical history
 * @param {Array} [historyPayload.visits] - Optional array of visit records
 * @param {Array} [historyPayload.medications] - Optional array of medication records
 * @param {Array} [historyPayload.diagnostics] - Optional array of diagnostic records
 * @returns {Promise<Object>} The processed summary
 */
export const processPatientHistoryPayload = async (historyPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vet-histories/process-payload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing patient history payload:', error);
    throw error;
  }
};

