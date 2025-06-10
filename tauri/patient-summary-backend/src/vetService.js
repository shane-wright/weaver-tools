// Service module for vet history API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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

