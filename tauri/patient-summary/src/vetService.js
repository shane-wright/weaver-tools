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
 * Generates an AI summary for a patient's history
 * @param {Object} patient - The patient object containing history
 * @param {boolean} [usePreloadedData=false] - Whether to use preloaded data instead of creating new record
 * @returns {Promise<Object>} The AI-generated summary
 */
export const getPatientSummary = async (patient, usePreloadedData = false) => {
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
      const summary = await getVetHistorySummary(tempId, patientData);
      
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
    const summary = await getVetHistorySummary(createdHistory.id);
    
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
 * Fetches the summary for a specific vet history or processes preloaded data
 * @param {string} id - The vet history ID
 * @param {Object} [preloadedData] - Optional preloaded patient history data
 * @returns {Promise<Object>} The vet history summary
 */
export const getVetHistorySummary = async (id, preloadedData = null) => {
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
          data: preloadedData
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

