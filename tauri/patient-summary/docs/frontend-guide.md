# Frontend Documentation - Veterinary Patient Summary System

## Overview

The frontend is a React application that provides a user-friendly interface for veterinary professionals to create patient histories and generate AI-powered summaries. Built with React 19.1.0 and React Scripts 5.0.1.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Running the Frontend](#running-the-frontend)
- [Application Structure](#application-structure)
- [Features](#features)
- [API Integration](#api-integration)
- [Components](#components)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend documentation)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd /Users/shane/dev/weaver-tools/tauri/patient-summary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Setup](#environment-setup))

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Setup

### Environment Variables

Create a `.env` file in the frontend root directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001

# Optional: Enable development features
REACT_APP_ENV=development
```

### Important Notes

- The backend server should be running on port 3001 (default)
- Environment variables must be prefixed with `REACT_APP_` to be accessible in React
- The `.env` file is already configured in this project

## Running the Frontend

### Development Mode

```bash
npm start
# or
npm run dev
```

The application will start in development mode:
- Opens at [http://localhost:3000](http://localhost:3000)
- Hot reloading enabled
- Error overlay in browser
- React Developer Tools support

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder:
- Optimized React build
- Minified and bundled assets
- Ready for deployment

### Testing

```bash
npm test
```

Runs the test suite using Jest and React Testing Library.

### Tauri Development (Desktop App)

```bash
npm run tauri:dev
```

Runs the app as a desktop application using Tauri.

## Application Structure

### Project Layout

```
patient-summary/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── index.js            # React entry point
│   ├── VetHistoryForm.js   # Form for creating vet histories
│   ├── VetSummary.js       # Component for displaying AI summaries
│   ├── vetService.js       # API service layer
│   ├── reportWebVitals.js  # Performance monitoring
│   └── setupTests.js       # Test configuration
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── docs/
    └── frontend-guide.md   # This documentation
```

### Key Files

- **`App.js`**: Main application component with navigation and state management
- **`VetHistoryForm.js`**: Form component for creating veterinary histories
- **`VetSummary.js`**: Component that displays AI-generated summaries
- **`vetService.js`**: Service module for API communication

## Features

### 1. Veterinary History Form

- **Species Selection**: Dropdown with common animal species
- **Patient Information**: Name and age input fields
- **Medical History**: Large text area for detailed history
- **Form Validation**: Ensures all required fields are completed
- **Success Feedback**: Shows confirmation when history is created

### 2. AI Summary Generation

- **Automatic Processing**: Generates summary immediately after form submission
- **Formatted Display**: Shows bullet-pointed summaries
- **Loading States**: Indicates when summary is being generated
- **Error Handling**: Displays helpful error messages

### 3. Navigation

- **Tab-based Interface**: Switch between form and summary views
- **Smart Navigation**: Summary tab only enabled after creating a history
- **Current Record Indicator**: Shows which record is currently selected

### 4. User Experience

- **Responsive Design**: Works on desktop and mobile devices
- **Clean Interface**: Professional veterinary application styling
- **Intuitive Workflow**: Guided process from history creation to summary
- **Helpful Instructions**: Built-in usage guide

## API Integration

### Service Architecture

The frontend uses a service layer (`vetService.js`) to communicate with the backend API:

```javascript
// Create new vet history
const result = await createVetHistory({
  species: 'Dog',
  name: 'Buddy',
  age: 5,
  history: 'Patient history details...'
});

// Get AI summary
const summary = await getVetHistorySummary(result.id);
```

### API Endpoints Used

1. **POST `/api/vet-histories`** - Create new veterinary history
2. **GET `/api/vet-histories/:id/summary`** - Get AI-generated summary

### Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Connection issues with backend
- **API Errors**: Server-side errors (400, 404, 500)
- **Validation Errors**: Form validation feedback
- **Loading States**: User feedback during API calls

## Components

### App.js

**Purpose**: Main application component with state management and navigation.

**Key Features**:
- State management for current view and selected history ID
- Navigation between form and summary views
- Success handling for form submissions
- Application layout and styling

**State Variables**:
```javascript
const [currentView, setCurrentView] = useState('form');        // 'form' or 'summary'
const [selectedVetHistoryId, setSelectedVetHistoryId] = useState(null);
```

### VetHistoryForm.js

**Purpose**: Form component for creating new veterinary histories.

**Key Features**:
- Form validation and submission
- Species dropdown with common animals
- Text area for medical history
- Success and error state handling
- Integration with vetService API

**Form Fields**:
- `species` (required): Animal species
- `name` (required): Animal name  
- `age` (required): Animal age
- `history` (required): Medical history details

**Example Usage**:
```jsx
<VetHistoryForm onSubmitSuccess={(result) => {
  setSelectedVetHistoryId(result.id);
  setCurrentView('summary');
}} />
```

### VetSummary.js

**Purpose**: Displays AI-generated summaries of veterinary histories.

**Key Features**:
- Fetches summary from API based on history ID
- Loading state during AI generation
- Formatted display of bullet-pointed summaries
- Error handling for API failures
- Automatic refresh capabilities

**Props**:
- `id`: The veterinary history ID to summarize

**Example Usage**:
```jsx
<VetSummary id={selectedVetHistoryId} />
```

### vetService.js

**Purpose**: Service layer for API communication.

**Functions**:

#### `createVetHistory(vetData)`
Creates a new veterinary history record.

**Parameters**:
```javascript
{
  species: 'Dog',
  name: 'Buddy', 
  age: 5,
  history: 'Medical history details...'
}
```

**Returns**: Promise resolving to created history with ID

#### `getVetHistorySummary(id)`
Fetches AI-generated summary for a specific history.

**Parameters**: 
- `id`: Veterinary history ID

**Returns**: Promise resolving to summary object

#### `getAllVetHistories()`
Fetches all veterinary histories (for future use).

**Returns**: Promise resolving to array of histories

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | No | `http://localhost:3001` | Backend API base URL |

### Package.json Scripts

```json
{
  "start": "react-scripts start",      // Development server
  "dev": "react-scripts start",        // Alias for start
  "build": "react-scripts build",      // Production build
  "test": "react-scripts test",        // Run tests
  "eject": "react-scripts eject",      // Eject from Create React App
  "tauri": "tauri",                    // Tauri CLI
  "tauri:dev": "tauri dev",            // Tauri development
  "tauri:build": "tauri build"         // Tauri production build
}
```

### Dependencies

**Core Dependencies**:
- `react: ^19.1.0` - React library
- `react-dom: ^19.1.0` - React DOM rendering
- `react-scripts: 5.0.1` - Create React App build tools
- `web-vitals: ^2.1.4` - Performance monitoring

**Testing Dependencies**:
- `@testing-library/react: ^16.3.0` - React testing utilities
- `@testing-library/jest-dom: ^6.6.3` - Jest DOM matchers
- `@testing-library/user-event: ^13.5.0` - User interaction simulation
- `@testing-library/dom: ^10.4.0` - DOM testing utilities

**Development Dependencies**:
- `@tauri-apps/cli: ^2.5.0` - Tauri CLI for desktop app development

## Troubleshooting

### Common Issues

#### 1. Frontend won't start

**Error**: `Error: Cannot find module 'react-scripts'`
**Solution**: 
```bash
npm install
```

#### 2. API Connection Errors

**Error**: `Failed to fetch` or CORS errors
**Solutions**:
- Ensure backend server is running on port 3001
- Check `.env` file has correct `REACT_APP_API_URL`
- Verify backend has CORS enabled

```bash
# Check if backend is running
curl http://localhost:3001/
```

#### 3. Environment Variables Not Working

**Error**: API calls going to wrong URL
**Solutions**:
- Ensure environment variables start with `REACT_APP_`
- Restart development server after changing `.env`
- Check for typos in variable names

#### 4. Build Failures

**Error**: Build optimization warnings/errors
**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React Scripts cache
npm start -- --reset-cache
```

#### 5. Port Already in Use

**Error**: `Something is already running on port 3000`
**Solutions**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Development Debugging

#### React Developer Tools

Install React Developer Tools browser extension for debugging:
- Component state inspection
- Props debugging
- Performance profiling

#### Console Debugging

Check browser console for:
- API call responses
- Error messages
- Network requests in Network tab

#### Service Worker Issues

If experiencing caching issues:
```bash
# Clear service worker cache
# In browser: Application > Storage > Clear Storage
```

## Development

### Adding New Features

#### 1. New Components

Create new component in `src/` directory:
```javascript
// src/NewComponent.js
import React from 'react';

function NewComponent() {
  return (
    <div>
      <h2>New Component</h2>
    </div>
  );
}

export default NewComponent;
```

#### 2. New API Endpoints

Add new functions to `vetService.js`:
```javascript
export const newApiFunction = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/new-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

#### 3. New Routes

For additional pages, consider adding React Router:
```bash
npm install react-router-dom
```

### Code Style

The project follows standard React conventions:
- Functional components with hooks
- ES6+ JavaScript features
- CSS-in-JS for styling (inline styles)
- Descriptive component and variable names

### Testing

Add tests for new components:
```javascript
// src/NewComponent.test.js
import { render, screen } from '@testing-library/react';
import NewComponent from './NewComponent';

test('renders new component', () => {
  render(<NewComponent />);
  const heading = screen.getByText(/new component/i);
  expect(heading).toBeInTheDocument();
});
```

### Performance Optimization

- Use React.memo for expensive components
- Implement lazy loading for large components
- Optimize bundle size with code splitting
- Monitor performance with Web Vitals

### Deployment

#### Static Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy `build/` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

#### Tauri Desktop App

1. Build desktop application:
   ```bash
   npm run tauri:build
   ```

2. Find distributable in `src-tauri/target/release/bundle/`

### Browser Compatibility

**Supported Browsers**:
- Chrome (last 2 versions)
- Firefox (last 2 versions) 
- Safari (last 2 versions)
- Edge (last 2 versions)

**Note**: Internet Explorer is not supported due to React 19 requirements.

---

## Integration with Backend

### Complete Workflow

1. **Start Backend Server**:
   ```bash
   cd /Users/shane/dev/weaver-tools/tauri/patient-summary-backend
   npm start
   ```

2. **Start Frontend Server**:
   ```bash
   cd /Users/shane/dev/weaver-tools/tauri/patient-summary
   npm start
   ```

3. **Test Complete Flow**:
   - Open http://localhost:3000
   - Fill out vet history form
   - Submit and wait for AI summary
   - View generated summary

### API Communication Flow

```
User fills form → VetHistoryForm → vetService.createVetHistory() 
     ↓
Backend creates record → Returns ID → Frontend updates state
     ↓
User clicks summary → VetSummary → vetService.getVetHistorySummary()
     ↓
Backend calls OpenAI → Returns summary → Frontend displays result
```

---

**Last Updated**: June 9, 2024  
**Version**: 1.0.0  
**React Version**: 19.1.0

