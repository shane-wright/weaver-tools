import { useState } from 'react';
import { createVetHistory } from './vetService';

const VetHistoryForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    species: '',
    name: '',
    age: '',
    history: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert age to number
      const submitData = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      const result = await createVetHistory(submitData);
      
      // Reset form
      setFormData({
        species: '',
        name: '',
        age: '',
        history: ''
      });

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }

      alert('Vet history created successfully!');
    } catch (err) {
      setError(err.message || 'Failed to create vet history');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vet-history-form">
      <h2>Add Vet History</h2>
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="species" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Species *
          </label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            placeholder="e.g., Dog, Cat, Bird"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            placeholder="Animal's name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="age" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Age *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            placeholder="Age in years"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="history" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Medical History *
          </label>
          <textarea
            id="history"
            name="history"
            value={formData.history}
            onChange={handleChange}
            required
            rows={6}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', resize: 'vertical' }}
            placeholder="Enter the animal's medical history, symptoms, treatments, etc."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Vet History'}
        </button>
      </form>
    </div>
  );
};

export default VetHistoryForm;

