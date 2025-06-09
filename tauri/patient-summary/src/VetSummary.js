import { useState, useEffect } from 'react';
import { getVetHistorySummary } from './vetService';

const VetSummary = ({ id }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setSummary(null);
      setError(null);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const summaryData = await getVetHistorySummary(id);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message || 'Failed to fetch summary');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  const handleRefresh = () => {
    if (id) {
      const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const summaryData = await getVetHistorySummary(id);
          setSummary(summaryData);
        } catch (err) {
          setError(err.message || 'Failed to fetch summary');
          setSummary(null);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSummary();
    }
  };

  if (!id) {
    return (
      <div className="vet-summary">
        <h2>Vet History Summary</h2>
        <p style={{ color: '#666' }}>No vet history selected. Create a vet history first to see the summary.</p>
      </div>
    );
  }

  return (
    <div className="vet-summary">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Vet History Summary</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading summary...</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {summary && !loading && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Patient Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>Name:</strong> {summary.name || 'N/A'}
              </div>
              <div>
                <strong>Species:</strong> {summary.species || 'N/A'}
              </div>
              <div>
                <strong>Age:</strong> {summary.age ? `${summary.age} years` : 'N/A'}
              </div>
              <div>
                <strong>Record ID:</strong> {summary.id || id}
              </div>
            </div>
          </div>

          {summary.summary && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>AI Summary</h3>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1rem', 
                borderRadius: '4px', 
                border: '1px solid #e9ecef',
                lineHeight: '1.6'
              }}>
                {summary.summary.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index} style={{ margin: '0 0 1rem 0' }}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {summary.history && (
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Original Medical History</h3>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1rem', 
                borderRadius: '4px', 
                border: '1px solid #e9ecef',
                lineHeight: '1.6',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                {summary.history}
              </div>
            </div>
          )}

          {summary.createdAt && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
              <strong>Created:</strong> {new Date(summary.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VetSummary;

