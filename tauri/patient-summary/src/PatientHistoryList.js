import { useState, useEffect } from 'react';
import { getAllVetHistories, getPatientSummary } from './vetService';

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
    history: 'Regular checkup. Vaccinations up to date. Slight weight gain noticed. Owner advised on diet management.',
    status: 'Healthy'
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    owner: 'Sarah Johnson',
    lastVisit: '2024-01-10',
    history: 'Treated for ear infection. Prescribed antibiotics. Follow-up needed in 2 weeks to check healing progress.',
    status: 'Under Treatment'
  },
  {
    id: '3',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 7,
    owner: 'Mike Davis',
    lastVisit: '2024-01-08',
    history: 'Arthritis management. Pain medication adjusted. Doing well with current treatment plan.',
    status: 'Chronic Condition'
  },
  {
    id: '4',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    owner: 'Emily Wilson',
    lastVisit: '2024-01-12',
    history: 'Spay surgery completed successfully. Recovery going well. No complications observed.',
    status: 'Recovering'
  },
  {
    id: '5',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 4,
    owner: 'Robert Brown',
    lastVisit: '2024-01-14',
    history: 'Routine dental cleaning performed. All teeth healthy. Next cleaning recommended in 12 months.',
    status: 'Healthy'
  }
];

const PatientHistoryList = ({ useApi = false }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
                      onClick={() => handleSummarize(patient)}
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
    </div>
  );
};

export default PatientHistoryList;

