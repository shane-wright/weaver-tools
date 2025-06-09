require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Veterinary animal patient data
const animals = [
  {
    id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 5,
    diagnosis: 'Hip Dysplasia',
    lastVisit: '2024-06-01',
    medications: ['Carprofen', 'Glucosamine']
  },
  {
    id: 2,
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    diagnosis: 'Feline Diabetes',
    lastVisit: '2024-06-05',
    medications: ['Insulin', 'Prescription Diet']
  },
  {
    id: 3,
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador Mix',
    age: 8,
    diagnosis: 'Arthritis',
    lastVisit: '2024-06-08',
    medications: ['Rimadyl', 'Fish Oil', 'Joint Supplements']
  }
];

// Veterinary patient history data
const vetHistories = [
  {
    id: 1,
    species: 'Dog',
    name: 'Buddy',
    age: 5,
    history: 'Regular checkup. Vaccinations up to date. Mild ear infection treated with antibiotics.',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    species: 'Cat',
    name: 'Whiskers',
    age: 3,
    history: 'Spaying surgery completed successfully. Recovery going well. No complications observed.',
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: 3,
    species: 'Bird',
    name: 'Tweety',
    age: 2,
    history: 'Wing injury from fall. Treated with splint. Follow-up appointments scheduled.',
    createdAt: new Date('2024-03-10').toISOString()
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Patient Summary Backend API' });
});

// Get all animal patients
app.get('/api/animals', (req, res) => {
  res.json(animals);
});

// DEPRECATED: Legacy endpoint for backward compatibility
app.get('/api/patients', (req, res) => {
  console.warn('DEPRECATED: /api/patients endpoint is deprecated. Use /api/animals instead.');
  res.status(301).json({ 
    message: 'This endpoint is deprecated. Please use /api/animals instead.',
    redirectTo: '/api/animals',
    data: animals 
  });
});

// Get animal patient by ID
app.get('/api/animals/:id', (req, res) => {
  const animal = animals.find(a => a.id === parseInt(req.params.id));
  if (!animal) {
    return res.status(404).json({ error: 'Animal patient not found' });
  }
  res.json(animal);
});

// DEPRECATED: Legacy endpoint for backward compatibility
app.get('/api/patients/:id', (req, res) => {
  console.warn('DEPRECATED: /api/patients/:id endpoint is deprecated. Use /api/animals/:id instead.');
  const animal = animals.find(a => a.id === parseInt(req.params.id));
  if (!animal) {
    return res.status(404).json({ error: 'Animal patient not found' });
  }
  res.status(301).json({
    message: 'This endpoint is deprecated. Please use /api/animals/:id instead.',
    redirectTo: `/api/animals/${req.params.id}`,
    data: animal
  });
});

// Create new animal patient
app.post('/api/animals', (req, res) => {
  const { name, species, breed, age, diagnosis, medications } = req.body;
  
  if (!name || !species || !age || !diagnosis) {
    return res.status(400).json({ error: 'Name, species, age, and diagnosis are required' });
  }
  
  const newAnimal = {
    id: animals.length + 1,
    name,
    species,
    breed: breed || 'Unknown',
    age,
    diagnosis,
    lastVisit: new Date().toISOString().split('T')[0],
    medications: medications || []
  };
  
  animals.push(newAnimal);
  res.status(201).json(newAnimal);
});

// DEPRECATED: Legacy endpoint for backward compatibility
app.post('/api/patients', (req, res) => {
  console.warn('DEPRECATED: /api/patients POST endpoint is deprecated. Use /api/animals instead.');
  res.status(410).json({
    message: 'This endpoint is deprecated and no longer accepts new data. Please use /api/animals instead.',
    redirectTo: '/api/animals'
  });
});

// Update animal patient
app.put('/api/animals/:id', (req, res) => {
  const animalIndex = animals.findIndex(a => a.id === parseInt(req.params.id));
  
  if (animalIndex === -1) {
    return res.status(404).json({ error: 'Animal patient not found' });
  }
  
  const { name, species, breed, age, diagnosis, medications } = req.body;
  
  animals[animalIndex] = {
    ...animals[animalIndex],
    name: name || animals[animalIndex].name,
    species: species || animals[animalIndex].species,
    breed: breed || animals[animalIndex].breed,
    age: age || animals[animalIndex].age,
    diagnosis: diagnosis || animals[animalIndex].diagnosis,
    medications: medications || animals[animalIndex].medications,
    lastVisit: new Date().toISOString().split('T')[0]
  };
  
  res.json(animals[animalIndex]);
});

// DEPRECATED: Legacy endpoint for backward compatibility
app.put('/api/patients/:id', (req, res) => {
  console.warn('DEPRECATED: /api/patients PUT endpoint is deprecated. Use /api/animals instead.');
  res.status(410).json({
    message: 'This endpoint is deprecated and no longer accepts updates. Please use /api/animals instead.',
    redirectTo: '/api/animals'
  });
});

// Delete animal patient
app.delete('/api/animals/:id', (req, res) => {
  const animalIndex = animals.findIndex(a => a.id === parseInt(req.params.id));
  
  if (animalIndex === -1) {
    return res.status(404).json({ error: 'Animal patient not found' });
  }
  
  const deletedAnimal = animals.splice(animalIndex, 1)[0];
  res.json({ message: 'Animal patient deleted successfully', animal: deletedAnimal });
});

// DEPRECATED: Legacy endpoint for backward compatibility
app.delete('/api/patients/:id', (req, res) => {
  console.warn('DEPRECATED: /api/patients DELETE endpoint is deprecated. Use /api/animals instead.');
  res.status(410).json({
    message: 'This endpoint is deprecated and no longer accepts deletions. Please use /api/animals instead.',
    redirectTo: '/api/animals'
  });
});

// Create new veterinary history
app.post('/api/vet-histories', (req, res) => {
  const { species, name, age, history } = req.body;
  
  if (!species || !name || !age || !history) {
    return res.status(400).json({ error: 'Species, name, age, and history are required' });
  }
  
  const newVetHistory = {
    id: vetHistories.length + 1,
    species,
    name,
    age,
    history,
    createdAt: new Date().toISOString()
  };
  
  vetHistories.push(newVetHistory);
  res.status(201).json(newVetHistory);
});

// Get AI-powered summary of veterinary history
app.get('/api/vet-histories/:id/summary', async (req, res) => {
  try {
    const vetHistory = vetHistories.find(vh => vh.id === parseInt(req.params.id));
    
    if (!vetHistory) {
      return res.status(404).json({ error: 'Veterinary history not found' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Summarize the following veterinary patient history into key bullet points for a veterinarian:\n${vetHistory.history}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const summary = completion.choices[0].message.content;

    res.json({
      id: vetHistory.id,
      summary: summary
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Verify environment variables are loaded
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY environment variable is not set');
} else {
  console.log('OpenAI API key loaded successfully');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/animals      - Get all animal patients');
  console.log('  GET    /api/animals/:id  - Get animal patient by ID');
  console.log('  POST   /api/animals      - Create new animal patient');
  console.log('  PUT    /api/animals/:id  - Update animal patient');
  console.log('  DELETE /api/animals/:id  - Delete animal patient');
  console.log('  POST   /api/vet-histories - Create veterinary history');
  console.log('  GET    /api/vet-histories/:id/summary - Get AI summary of vet history');
  console.log('');
  console.log('DEPRECATED endpoints (still available for backward compatibility):');
  console.log('  /api/patients/* - Use /api/animals/* instead');
});

