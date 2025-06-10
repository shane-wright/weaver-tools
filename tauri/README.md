# Veterinary Patient Summary System

**A Tauri Desktop Application for Veterinary Patient Management and AI-Powered Medical Summarization**

---

**Quick Start**

Start the frontend:
Navigate to patient-summary

```bash
npm run tauri:dev
```

Start the backend:
Navigate to patient-summary

```bash
npm start
```

---

## 🎯 Project Overview

The Veterinary Patient Summary System is a modern desktop application built with Tauri that combines React frontend technology with Rust-based native desktop capabilities. The system allows veterinary professionals to browse patient records, view detailed medical histories, and generate AI-powered summaries using OpenAI's GPT model.

### Key Features

- 🖥️ **Native Desktop App** - Built with Tauri for macOS (cross-platform capable)
- 📊 **Patient Database** - Browse and manage veterinary patient records
- 🔍 **Detailed Views** - Expand patient records to see full medical histories
- 🤖 **AI Summarization** - Generate intelligent summaries using OpenAI GPT-4o-mini
- 🔄 **Dual Data Sources** - Switch between hardcoded sample data and live API integration
- 🌐 **RESTful Backend** - Node.js/Express API with OpenAI integration

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TAURI DESKTOP APPLICATION                        │
├─────────────────────────────────────────────────────────────────────────┤
│                         CLIENT LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                               │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │  │
│  │  │      App.js     │  │ PatientHistory  │  │   VetSummary    │ │  │
│  │  │  (Navigation)   │  │    List.js      │  │     .js         │ │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │  │
│  │           │                     │                     │         │  │
│  │           └─────────────────────┼─────────────────────┘         │  │
│  │                                 │                               │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │                  vetService.js                              │ │  │
│  │  │            (HTTP Client Service Layer)                     │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│                        TAURI RUST LAYER                                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     src-tauri/                                  │  │
│  │  • Native window management                                     │  │
│  │  • System integration                                           │  │
│  │  • Security layer                                               │  │
│  │  • Cross-platform compatibility                                 │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────────────┘
                          │ HTTP/REST API Calls
                          │ (JSON over HTTP)
                          │
┌─────────────────────────┼───────────────────────────────────────────────┐
│                     BACKEND SERVICES                                   │
├─────────────────────────┼───────────────────────────────────────────────┤
│             Node.js/Express Backend (Port 3001)                        │
│                         │                                               │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     server.js                                   │  │
│  │                                                                 │  │
│  │  REST API Endpoints:                                            │  │
│  │  • GET    /api/animals          (patient records)              │  │
│  │  • GET    /api/animals/:id      (individual patient)           │  │
│  │  • POST   /api/animals          (create patient)               │  │
│  │  • PUT    /api/animals/:id      (update patient)               │  │
│  │  • DELETE /api/animals/:id      (delete patient)               │  │
│  │  • GET    /api/vet-histories    (medical histories)             │  │
│  │  • POST   /api/vet-histories    (create history)               │  │
│  │  • GET    /api/vet-histories/:id/summary (AI summary)           │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────────────┘
                          │ OpenAI API Integration
                          │ (HTTPS/JSON)
                          │
┌─────────────────────────┼───────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                   │
├─────────────────────────┼───────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     OpenAI API                                  │  │
│  │                   (gpt-4o-mini model)                          │  │
│  │                                                                 │  │
│  │  • Veterinary-focused prompt engineering                       │  │
│  │  • Medical text summarization                                   │  │
│  │  • Structured bullet-point output                              │  │
│  │  • Temperature: 0.3 (focused responses)                        │  │
│  │  • Max tokens: 300 (concise summaries)                         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA STORAGE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                     In-Memory Arrays (Server)                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  animals[] Array:                                               │  │
│  │  • Animal patient records (id, name, species, breed, age)      │  │
│  │  • Medical data (diagnosis, medications, last visit)           │  │
│  │  • Sample data: Max, Luna, Charlie                             │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  vetHistories[] Array:                                          │  │
│  │  • Detailed medical histories (id, species, name, age)         │  │
│  │  • Narrative records with timestamps                           │  │
│  │  • Sample data: Buddy, Whiskers, Tweety                       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  SAMPLE_PATIENT_DATA[] (Frontend):                             │  │
│  │  • Hardcoded fallback data                                     │  │
│  │  • 5 sample patients with full medical histories               │  │
│  │  • Used when API is unavailable or disabled                    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v16 or higher)
- **Rust** (for Tauri development)
- **OpenAI API Key** (for AI summarization)

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd patient-summary-backend

# Install dependencies
npm install

# Configure environment variables
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "PORT=3001" >> .env

# Start the server
npm start
```

**Expected Output:**

```
OpenAI API key loaded successfully
Server running on http://localhost:3001
Available endpoints:
  GET    /api/animals      - Get all animal patients
  GET    /api/animals/:id  - Get animal patient by ID
  POST   /api/animals      - Create new animal patient
  PUT    /api/animals/:id  - Update animal patient
  DELETE /api/animals/:id  - Delete animal patient
  GET    /api/vet-histories - Get all veterinary histories
  POST   /api/vet-histories - Create veterinary history
  GET    /api/vet-histories/:id/summary - Get AI summary of vet history
```

### 2. Start the Tauri Desktop Application

```bash
# Navigate to frontend directory (new terminal)
cd patient-summary

# Install dependencies
npm install

# Start the Tauri desktop app
npm run tauri:dev
```

**Expected Output:**

```
> patient-summary@0.1.0 tauri:dev
> tauri dev

    Info Watching /Users/shane/dev/weaver-tools/tauri/patient-summary/src-tauri for changes...
    Info Starting application...
    Info Application started successfully!
```

The native desktop application will automatically open.

### 3. Alternative: Browser Development

If you prefer browser-based development:

```bash
cd patient-summary
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 💻 User Interface Guide

### Main Navigation

The application has two main views accessible via the top navigation:

1. **"Patient History"** - Browse and manage patient records
2. **"View Summary"** - Display AI-generated summaries (enabled after generating summaries)

### Patient History Tab

#### Data Source Toggle

- **Checkbox: "Use API data"** - Switch between hardcoded sample data and live API
  - ✅ **Checked**: Fetches data from the backend API (`/api/vet-histories`)
  - ❌ **Unchecked**: Uses hardcoded sample patient data (default)
  - **Refresh Data** button appears when API mode is enabled

#### Patient Records Table

Displays a comprehensive table with the following columns:

- **Name** - Patient's name
- **Species/Breed** - Animal type and breed information
- **Age** - Age in years
- **Owner** - Owner's name
- **Last Visit** - Date of most recent visit
- **Status** - Health status with color coding:
  - 🟢 **Healthy** (Green)
  - 🟡 **Under Treatment** (Yellow)
  - 🟠 **Chronic Condition** (Orange)
  - 🔵 **Recovering** (Blue)

#### Action Buttons

Each patient record has two action buttons:

1. **"View Details"** / **"Hide Details"**

   - Expands/collapses detailed patient information
   - Shows comprehensive medical history
   - Displays organized patient data in cards

2. **"Summarize"** / **"Summarizing..."**
   - Generates AI-powered summary using OpenAI
   - Button shows loading state during processing
   - Creates summary that appears in dedicated section

### Detailed Patient View

When "View Details" is clicked, a detailed card appears showing:

#### Basic Information Card

- Species, Breed, Age

#### Contact & Status Card

- Owner information
- Last visit date
- Current health status (color-coded badge)

#### Medical History Card

- Complete medical narrative
- Formatted text display

### AI Generated Summaries Section

After clicking "Summarize" on any patient:

- A dedicated green-themed section appears
- Shows summaries for all patients that have been processed
- Each summary includes:
  - Patient name header
  - Bullet-pointed AI analysis
  - Professional veterinary focus

### Sample Data

#### Hardcoded Sample Patients

1. **Buddy** (Dog, Golden Retriever, 5 years) - Regular checkup with weight management
2. **Whiskers** (Cat, Persian, 3 years) - Ear infection treatment
3. **Max** (Dog, German Shepherd, 7 years) - Arthritis management
4. **Luna** (Cat, Siamese, 2 years) - Post-spay recovery
5. **Charlie** (Dog, Labrador, 4 years) - Routine dental cleaning

---

## 🔧 API Integration

### Backend Endpoints

#### Animal Patients

```bash
# Get all animal patients
GET /api/animals

# Get specific animal patient
GET /api/animals/:id

# Create new animal patient
POST /api/animals
Content-Type: application/json
{
  "name": "Buddy",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 5,
  "diagnosis": "Healthy",
  "medications": ["Vitamins"]
}

# Update animal patient
PUT /api/animals/:id

# Delete animal patient
DELETE /api/animals/:id
```

#### Veterinary Histories

```bash
# Get all vet histories
GET /api/vet-histories

# Create new vet history
POST /api/vet-histories
Content-Type: application/json
{
  "species": "Dog",
  "name": "Buddy",
  "age": 5,
  "history": "Regular checkup. Vaccinations up to date. Slight weight gain noticed."
}

# Get AI summary of vet history
GET /api/vet-histories/:id/summary
```

### Frontend API Service (`vetService.js`)

The frontend communicates with the backend through a dedicated service layer:

```javascript
// Key functions available:
createVetHistory(vetData); // Create new medical record
getPatientSummary(patient); // Generate AI summary
getVetHistorySummary(id); // Fetch existing summary
getAllVetHistories(); // Fetch all medical histories
processPatientHistoryPayload(); // Process complex medical data
```

---

## 🤖 AI Summarization

### OpenAI Integration

**Model**: GPT-4o-mini  
**Temperature**: 0.3 (focused, consistent responses)  
**Max Tokens**: 300 (concise summaries)

### Prompt Engineering

The system uses veterinary-specific prompts designed to produce professional medical summaries:

```
You are a veterinary assistant. Summarize the following patient history into clear,
professional bullet points for veterinary review. Focus on:
- Chief complaint/reason for visit
- Key findings from examination
- Diagnostic results (if any)
- Treatment provided or recommended
- Current status/prognosis
- Follow-up care required
```

### Example AI Summary Output

**Input**: "Regular checkup. Vaccinations up to date. Slight weight gain noticed. Owner advised on diet management."

**AI Summary**:
• **Chief complaint**: Routine wellness examination
• **Vaccination status**: Current and up to date
• **Physical findings**: Mild weight gain observed
• **Treatment**: Dietary counseling provided to owner
• **Recommendations**: Implement weight management plan
• **Follow-up**: Monitor weight progress at next visit

---

## 🛠️ Development

### Project Structure

```
/Users/shane/dev/weaver-tools/tauri/
├── patient-summary/                    # Tauri Desktop Application
│   ├── src/                           # React Frontend Source
│   │   ├── App.js                     # Main app with navigation
│   │   ├── PatientHistoryList.js      # Patient management component
│   │   ├── VetHistoryForm.js          # Form for creating histories
│   │   ├── VetSummary.js              # AI summary display
│   │   ├── vetService.js              # API communication layer
│   │   ├── App.css                    # Styling
│   │   └── index.js                   # React entry point
│   ├── src-tauri/                     # Tauri Rust Backend
│   │   ├── src/main.rs                # Tauri main entry point
│   │   ├── tauri.conf.json            # Tauri configuration
│   │   ├── Cargo.toml                 # Rust dependencies
│   │   └── icons/                     # Application icons
│   ├── public/                        # Static assets
│   ├── build/                         # Production build output
│   ├── .env                           # Frontend environment variables
│   └── package.json                   # Frontend dependencies & scripts
│
└── patient-summary-backend/            # Node.js Backend API
    ├── server.js                      # Main Express server
    ├── .env                           # Backend environment variables
    ├── package.json                   # Backend dependencies
    └── docs/                          # Additional documentation
```

### Technology Stack

#### Frontend

- **React** 19.1.0 - UI library
- **Tauri** 2.5.0 - Desktop application framework
- **React Scripts** 5.0.1 - Build tooling
- **CSS-in-JS** - Inline styling approach
- **Fetch API** - HTTP client

#### Desktop Layer

- **Rust** - Tauri backend language
- **Tauri** - Cross-platform desktop framework
- **WebView** - Native web rendering

#### Backend

- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **OpenAI SDK** 5.2.0 - AI integration
- **CORS** 2.8.5 - Cross-origin support
- **dotenv** 16.5.0 - Environment management

#### AI/ML

- **OpenAI GPT-4o-mini** - Language model
- **Custom veterinary prompts** - Domain-specific AI

### Development Commands

#### Tauri Desktop Development

```bash
cd patient-summary
npm run tauri:dev          # Start desktop app in dev mode
npm run tauri:build        # Build production desktop app
```

#### React Web Development

```bash
cd patient-summary
npm run dev                # Start React dev server
npm run build              # Build for production
npm test                   # Run tests
```

#### Backend Development

```bash
cd patient-summary-backend
npm start                  # Start production server
npm run dev                # Start with nodemon (if configured)
```

### Building for Production

#### Desktop Application

```bash
cd patient-summary
npm run tauri:build
```

Creates native app bundle in `src-tauri/target/release/bundle/`

#### Web Application

```bash
cd patient-summary
npm run build
```

Creates optimized build in `build/` directory

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```bash
# OpenAI Integration
OPENAI_API_KEY=sk-proj-...

# Server Configuration
PORT=3001
```

#### Frontend (.env)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001
```

### Tauri Configuration

**File**: `src-tauri/tauri.conf.json`

```json
{
  "productName": "patient-summary",
  "version": "0.1.0",
  "identifier": "com.tauri.dev",
  "build": {
    "frontendDist": "../build",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "patient-summary",
        "width": 800,
        "height": 600,
        "resizable": true
      }
    ]
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Desktop App Won't Start

```bash
# Check Rust installation
rustc --version

# Install Tauri CLI if missing
npm install -g @tauri-apps/cli

# Reinstall dependencies
cd patient-summary
npm install
```

#### 2. Backend Connection Failed

- ✅ Verify backend is running on port 3001
- ✅ Check `REACT_APP_API_URL` in frontend `.env`
- ✅ Ensure CORS is enabled (already configured)
- ✅ Verify no firewall blocking localhost:3001

#### 3. OpenAI API Errors

```bash
# 401 Unauthorized
# → Check API key validity in backend .env

# 429 Rate Limit Exceeded
# → Check usage at platform.openai.com/account/usage
# → Add credits or upgrade plan

# 500 Internal Server Error
# → Check server logs for detailed error messages
```

#### 4. Data Not Loading

- **Hardcoded Mode**: Should always work with sample data
- **API Mode**: Check backend server status and network connectivity
- **Fallback**: App automatically falls back to hardcoded data if API fails

#### 5. Port Conflicts

```bash
# Kill processes on conflicting ports
lsof -ti:3000 | xargs kill -9  # Frontend port
lsof -ti:3001 | xargs kill -9  # Backend port
```

### Debug Information

The application provides debugging information:

- **Data Source Indicator**: Shows whether using API or hardcoded data
- **Error Messages**: Displayed in red alert boxes
- **Loading States**: Visual feedback during API operations
- **Console Logs**: Check browser/desktop app developer tools

---

## 🎯 Usage Scenarios

### Scenario 1: Quick Demo with Sample Data

1. Start desktop app: `npm run tauri:dev`
2. Keep "Use API data" unchecked
3. Browse 5 hardcoded patient records
4. Click "View Details" on any patient
5. Click "Summarize" to see AI summary (requires backend + OpenAI)

### Scenario 2: Full API Integration

1. Start backend: `npm start` (in backend directory)
2. Start desktop app: `npm run tauri:dev`
3. Check "Use API data" checkbox
4. Browse live data from backend
5. Create new records via API
6. Generate AI summaries with OpenAI integration

### Scenario 3: Development Mode

1. Start backend in dev mode
2. Start frontend in browser: `npm run dev`
3. Open browser to http://localhost:3000
4. Develop with hot reload
5. Use browser dev tools for debugging

---

## 🔮 Future Enhancements

### ✅ Implemented Features

- ✅ Native desktop application (Tauri)
- ✅ Patient record browsing
- ✅ Detailed patient views
- ✅ AI-powered summarization
- ✅ Dual data sources (hardcoded/API)
- ✅ RESTful backend API
- ✅ Error handling and fallbacks
- ✅ Responsive UI design

### 🚧 Potential Enhancements

#### Data & Storage

- 💾 **Database Integration** (PostgreSQL/MongoDB)
- 🔄 **Data Persistence** (save summaries, user preferences)
- 📤 **Data Export** (PDF reports, CSV exports)
- 🔍 **Search & Filter** (patient search, date filtering)

#### AI & Intelligence

- 🧠 **Advanced AI Features** (diagnostic suggestions, treatment recommendations)
- 📊 **Analytics Dashboard** (patient statistics, trend analysis)
- 🔔 **Smart Notifications** (appointment reminders, follow-up alerts)

#### User Experience

- 👥 **User Authentication** (vet login, role-based access)
- 🎨 **Themes & Customization** (dark mode, clinic branding)
- 📱 **Mobile Companion** (React Native app)
- 🔧 **Settings Panel** (API configuration, preferences)

#### Native Features

- 📁 **File System Access** (import/export patient files)
- 🖨️ **Native Printing** (patient reports, summaries)
- 💬 **System Notifications** (appointment alerts)
- 🔄 **Auto-Updates** (Tauri updater integration)
- 🍎 **System Tray** (quick access, background operation)

#### Cross-Platform

- 🖥️ **Windows Build** (Windows executable)
- 🐧 **Linux Build** (AppImage/Snap packages)
- 🌐 **Web Deployment** (hosted version)

---

## 📚 Documentation Links

- **[Tauri Documentation](https://tauri.app/v1/guides/)** - Desktop app framework
- **[React Documentation](https://react.dev/)** - Frontend library
- **[OpenAI API Docs](https://platform.openai.com/docs)** - AI integration
- **[Express.js Guide](https://expressjs.com/)** - Backend framework

---

## 📞 Support & Development

For issues, questions, or contributions:

1. **Check Troubleshooting** section above
2. **Verify Environment** variables are correctly set
3. **Check Logs** in browser console and server output
4. **Test API Endpoints** using curl or Postman
5. **Restart Services** (backend and frontend)

### System Status Indicators

- 🟢 **Backend**: Running on http://localhost:3001
- 🟢 **Desktop App**: Tauri window opened
- 🟡 **OpenAI**: API quota dependent
- 🔵 **Data**: Dual source (API + hardcoded fallback)

---

**Last Updated**: June 10, 2024  
**Version**: 1.0.0  
**Platform**: macOS (cross-platform capable)  
**Status**: ✅ Production Ready

---

_Built with ❤️ using Tauri, React, Node.js, and OpenAI_
