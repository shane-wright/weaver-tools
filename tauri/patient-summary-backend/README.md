# Patient Summary Backend API

A simple Express.js API for managing patient summaries.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3001`

## API Endpoints

### Base URL
`http://localhost:3001`

### Endpoints

- **GET /** - API status message
- **GET /api/patients** - Get all patients
- **GET /api/patients/:id** - Get patient by ID
- **POST /api/patients** - Create new patient
- **PUT /api/patients/:id** - Update patient
- **DELETE /api/patients/:id** - Delete patient

### Sample Patient Object
```json
{
  "id": 1,
  "name": "John Doe",
  "age": 45,
  "diagnosis": "Hypertension",
  "lastVisit": "2024-06-01",
  "medications": ["Lisinopril", "Metformin"]
}
```

### Creating a New Patient
```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Brown",
    "age": 28,
    "diagnosis": "Asthma",
    "medications": ["Albuterol"]
  }'
```

### Frontend Integration

This API is configured with CORS enabled, so you can call it directly from your frontend application running on a different port.

Example fetch call:
```javascript
// Get all patients
fetch('http://localhost:3001/api/patients')
  .then(response => response.json())
  .then(data => console.log(data));

// Create new patient
fetch('http://localhost:3001/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Patient',
    age: 30,
    diagnosis: 'Common Cold'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Features

- ✅ Simple Express.js server
- ✅ CORS enabled for frontend integration
- ✅ JSON request/response handling
- ✅ Full CRUD operations for patients
- ✅ Sample patient data included
- ✅ Input validation
- ✅ Error handling
- ✅ No TypeScript (pure JavaScript)
- ✅ No complex build process

