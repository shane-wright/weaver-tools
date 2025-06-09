import { useState } from 'react';
import './App.css';
import VetHistoryForm from './VetHistoryForm';
import VetSummary from './VetSummary';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [selectedVetHistoryId, setSelectedVetHistoryId] = useState(null);

  const handleFormSubmitSuccess = (result) => {
    setSelectedVetHistoryId(result.id);
    setCurrentView('summary');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="App">
      <header style={{ 
        backgroundColor: '#282c34', 
        padding: '1rem', 
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0 }}>Veterinary Patient Summary System</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>
          Create vet histories and generate AI-powered summaries
        </p>
      </header>

      <div style={{ padding: '0 2rem' }}>
        {/* Navigation */}
        <nav style={{ 
          marginBottom: '2rem', 
          borderBottom: '1px solid #dee2e6', 
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => handleViewChange('form')}
            style={{
              backgroundColor: currentView === 'form' ? '#007bff' : '#6c757d',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              marginRight: '1rem',
              cursor: 'pointer'
            }}
          >
            Add Vet History
          </button>
          <button
            onClick={() => handleViewChange('summary')}
            disabled={!selectedVetHistoryId}
            style={{
              backgroundColor: currentView === 'summary' && selectedVetHistoryId ? '#007bff' : '#6c757d',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedVetHistoryId ? 'pointer' : 'not-allowed',
              opacity: selectedVetHistoryId ? 1 : 0.6
            }}
          >
            View Summary
          </button>
          {selectedVetHistoryId && (
            <span style={{ marginLeft: '1rem', color: '#6c757d' }}>
              Current record: {selectedVetHistoryId}
            </span>
          )}
        </nav>

        {/* Main Content */}
        <main>
          {currentView === 'form' && (
            <VetHistoryForm onSubmitSuccess={handleFormSubmitSuccess} />
          )}
          
          {currentView === 'summary' && (
            <VetSummary id={selectedVetHistoryId} />
          )}
        </main>

        {/* Instructions */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>How to use:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Fill out the vet history form with animal details and medical history</li>
            <li>Submit the form to create a new vet history record</li>
            <li>The system will automatically generate an AI summary</li>
            <li>View the summary in the "View Summary" tab</li>
          </ol>
          <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#6c757d' }}>
            Make sure the backend server is running on http://localhost:3001
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

