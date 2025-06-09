# OpenAI Backend Documentation

## Overview

The Patient Summary Backend is a Node.js Express API that provides veterinary patient management and AI-powered medical history summarization using OpenAI's GPT-3.5-turbo model.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Sample AI Summaries](#sample-ai-summaries)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Navigate to the backend directory:
   ```bash
   cd /Users/shane/dev/weaver-tools/tauri/patient-summary-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Setup](#environment-setup))

4. Start the server:
   ```bash
   npm start
   ```

## Environment Setup

### Required Environment Variables

Create a `.env` file in the backend root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration (optional)
PORT=3001
```

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

**⚠️ Important:** Never commit your API key to version control. The `.env` file should be in your `.gitignore`.

## Running the Server

### Development Mode

```bash
npm start
# or
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

### Production Mode

```bash
node server.js
```

### Server Startup Output

When successfully started, you'll see:

```
OpenAI API key loaded successfully
Server running on http://localhost:3001
Available endpoints:
  GET    /api/animals      - Get all animal patients
  GET    /api/animals/:id  - Get animal patient by ID
  POST   /api/animals      - Create new animal patient
  PUT    /api/animals/:id  - Update animal patient
  DELETE /api/animals/:id  - Delete animal patient
  POST   /api/vet-histories - Create veterinary history
  GET    /api/vet-histories/:id/summary - Get AI summary of vet history

DEPRECATED endpoints (still available for backward compatibility):
  /api/patients/* - Use /api/animals/* instead
```

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check

#### GET `/`
Returns basic API information.

**Response:**
```json
{
  "message": "Patient Summary Backend API"
}
```

### Animal Patients

#### GET `/api/animals`
Retrieve all animal patients.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Max",
    "species": "Dog",
    "breed": "Golden Retriever",
    "age": 5,
    "diagnosis": "Hip Dysplasia",
    "lastVisit": "2024-06-01",
    "medications": ["Carprofen", "Glucosamine"]
  }
]
```

#### GET `/api/animals/:id`
Retrieve specific animal patient by ID.

**Parameters:**
- `id` (integer): Animal patient ID

**Response:**
```json
{
  "id": 1,
  "name": "Max",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 5,
  "diagnosis": "Hip Dysplasia",
  "lastVisit": "2024-06-01",
  "medications": ["Carprofen", "Glucosamine"]
}
```

#### POST `/api/animals`
Create a new animal patient.

**Request Body:**
```json
{
  "name": "Buddy",
  "species": "Dog",
  "breed": "Labrador",
  "age": 3,
  "diagnosis": "Ear infection",
  "medications": ["Antibiotics"]
}
```

**Required fields:** `name`, `species`, `age`, `diagnosis`

**Response:**
```json
{
  "id": 4,
  "name": "Buddy",
  "species": "Dog",
  "breed": "Labrador",
  "age": 3,
  "diagnosis": "Ear infection",
  "lastVisit": "2024-06-09",
  "medications": ["Antibiotics"]
}
```

#### PUT `/api/animals/:id`
Update an existing animal patient.

**Parameters:**
- `id` (integer): Animal patient ID

**Request Body:** (all fields optional)
```json
{
  "name": "Max Updated",
  "diagnosis": "Hip Dysplasia - Improving",
  "medications": ["Carprofen", "Glucosamine", "Physical Therapy"]
}
```

#### DELETE `/api/animals/:id`
Delete an animal patient.

**Parameters:**
- `id` (integer): Animal patient ID

**Response:**
```json
{
  "message": "Animal patient deleted successfully",
  "animal": {
    "id": 1,
    "name": "Max",
    // ... deleted animal data
  }
}
```

### Veterinary Histories

#### POST `/api/vet-histories`
Create a new veterinary history record.

**Request Body:**
```json
{
  "species": "Dog",
  "name": "Buddy",
  "age": 5,
  "history": "Regular checkup. Vaccinations up to date. Mild ear infection treated with antibiotics. Patient responding well to treatment."
}
```

**Required fields:** `species`, `name`, `age`, `history`

**Response:**
```json
{
  "id": 4,
  "species": "Dog",
  "name": "Buddy",
  "age": 5,
  "history": "Regular checkup. Vaccinations up to date. Mild ear infection treated with antibiotics. Patient responding well to treatment.",
  "createdAt": "2024-06-09T22:27:15.000Z"
}
```

#### GET `/api/vet-histories/:id/summary`
Generate AI-powered summary of veterinary history.

**Parameters:**
- `id` (integer): Veterinary history ID

**Response:**
```json
{
  "id": 1,
  "summary": "• Regular wellness examination completed\n• Vaccination status: Current and up to date\n• Diagnosed with mild ear infection\n• Treatment: Antibiotic therapy initiated\n• Prognosis: Good response to treatment expected"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Name, species, age, and diagnosis are required"
}
```

#### 404 Not Found
```json
{
  "error": "Animal patient not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "OpenAI API key not configured"
}
```

## Example Requests

### Using curl

#### Create a new vet history:
```bash
curl -X POST http://localhost:3001/api/vet-histories \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Cat",
    "name": "Whiskers",
    "age": 4,
    "history": "Annual checkup. Patient presented with minor dental tartar buildup. Dental cleaning recommended. Overall health excellent. Weight stable at 4.2kg. No behavioral concerns reported by owner."
  }'
```

#### Get AI summary:
```bash
curl http://localhost:3001/api/vet-histories/1/summary
```

#### Get all animals:
```bash
curl http://localhost:3001/api/animals
```

#### Create new animal patient:
```bash
curl -X POST http://localhost:3001/api/animals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rex",
    "species": "Dog",
    "breed": "German Shepherd",
    "age": 7,
    "diagnosis": "Arthritis",
    "medications": ["Rimadyl", "Glucosamine"]
  }'
```

### Using JavaScript (fetch)

```javascript
// Create vet history
const createVetHistory = async () => {
  const response = await fetch('http://localhost:3001/api/vet-histories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      species: 'Dog',
      name: 'Buddy',
      age: 3,
      history: 'Routine vaccination visit. All vaccines administered successfully. No adverse reactions observed.'
    })
  });
  
  const result = await response.json();
  console.log('Created:', result);
  return result;
};

// Get AI summary
const getSummary = async (id) => {
  const response = await fetch(`http://localhost:3001/api/vet-histories/${id}/summary`);
  const summary = await response.json();
  console.log('Summary:', summary);
  return summary;
};
```

## Sample AI Summaries

### Example 1: Routine Checkup

**Input History:**
```
Regular checkup. Vaccinations up to date. Mild ear infection treated with antibiotics. Patient responding well to treatment.
```

**AI Summary:**
```
• Regular wellness examination completed
• Vaccination status: Current and up to date
• Diagnosed with mild ear infection
• Treatment: Antibiotic therapy initiated
• Prognosis: Good response to treatment expected
```

### Example 2: Surgical Case

**Input History:**
```
Spaying surgery completed successfully. Pre-operative bloodwork normal. Surgery performed under general anesthesia. No complications during procedure. Post-operative recovery going well. Sutures intact. Pain management with prescribed medication. Follow-up in 10 days for suture removal.
```

**AI Summary:**
```
• Spaying surgery successfully completed
• Pre-operative bloodwork: Within normal limits
• Anesthesia and surgical procedure: No complications
• Post-operative status: Recovery progressing well
• Current treatment: Pain management protocol
• Follow-up scheduled: Suture removal in 10 days
```

### Example 3: Complex Case

**Input History:**
```
Patient presented with limping and reluctance to bear weight on left hind leg. Physical examination revealed swelling and pain in the stifle joint. Radiographs taken showing signs of cruciate ligament injury. Discussed surgical options with owner. Conservative management initiated with strict rest and anti-inflammatory medication. Recheck scheduled in 2 weeks.
```

**AI Summary:**
```
• Chief complaint: Lameness and weight-bearing difficulty (left hind limb)
• Physical findings: Stifle joint swelling and pain
• Diagnostic imaging: Radiographs confirm cruciate ligament injury
• Treatment plan: Conservative management approach
• Current therapy: Rest restriction and anti-inflammatory medication
• Follow-up: Recheck examination in 2 weeks
```

## Troubleshooting

### Common Issues

#### 1. Server won't start

**Error:** `Error: Cannot find module 'express'`
**Solution:** Install dependencies
```bash
npm install
```

#### 2. OpenAI API errors

**Error:** `OpenAI API key not configured`
**Solution:** 
- Check that `.env` file exists
- Verify `OPENAI_API_KEY` is set correctly
- Ensure no extra spaces or quotes around the key

**Error:** `HTTP 401 - Unauthorized`
**Solution:**
- Verify your OpenAI API key is valid
- Check if you have available credits on your OpenAI account

**Error:** `HTTP 429 - Rate Limit/Quota Exceeded`
**Solution:**
- You've exceeded your OpenAI API quota or rate limit
- Check your OpenAI account billing and usage at [platform.openai.com](https://platform.openai.com/account/usage)
- Consider upgrading your OpenAI plan if needed
- For development/testing, you may need to add credit to your account

#### 3. CORS errors in browser

**Error:** `Access to fetch blocked by CORS policy`
**Solution:** The server includes CORS middleware, but ensure you're making requests to the correct port (3001, not 3000)

#### 4. Port already in use

**Error:** `EADDRINUSE: address already in use :::3001`
**Solution:**
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
echo "PORT=3002" >> .env
```

### Debug Mode

To enable detailed logging, start the server with:
```bash
DEBUG=* npm start
```

### Testing API Endpoints

Use a tool like [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) for VS Code to test endpoints interactively.

## Development

### Project Structure

```
patient-summary-backend/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .gitignore        # Git ignore rules
├── README.md         # Project overview
└── docs/
    └── open-ai-backend.md  # This documentation
```

### Adding New Endpoints

1. Add route handler in `server.js`:
```javascript
app.get('/api/new-endpoint', (req, res) => {
  res.json({ message: 'New endpoint' });
});
```

2. Update the startup console output to include the new endpoint

3. Add documentation to this file

### Data Storage

Currently, the application uses in-memory arrays for data storage:
- `animals[]` - Animal patients
- `vetHistories[]` - Veterinary histories

For production use, consider implementing a proper database (PostgreSQL, MongoDB, etc.).

### OpenAI Integration

The application uses the OpenAI JavaScript SDK v5.2.0. The AI summary generation:

- Model: `gpt-3.5-turbo`
- Max tokens: 300
- Temperature: 0.3 (for consistent, focused summaries)

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `PORT` | No | 3001 | Server port number |

### Security Considerations

- API key is loaded from environment variables
- CORS is enabled for frontend integration
- Input validation on required fields
- Error handling prevents sensitive information leakage

---

**Last Updated:** June 9, 2024  
**Version:** 1.0.0

