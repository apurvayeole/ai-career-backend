# Integration Setup Guide

## Project Structure

```
career-ai-backend/
├── .env                          # Backend environment variables
├── src/
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── config/
│   │   ├── db.js               # Database configuration
│   │   └── ai.js               # AI/Gemini configuration
│   ├── controllers/
│   │   ├── auth.controllers.js  # Authentication (login/signup with JWT)
│   │   └── ai.controllers.js    # AI features (career advisor, roadmap, etc.)
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth/login, /api/auth/signup
│   │   └── ai.routes.js         # /api/ai/* routes
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── AIResponse.js         # AI Response storage
│   │   └── Resume.js             # Resume model
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification
│   │   └── upload.middleware.js # File upload handling
│   ├── prompts/                 # AI prompts
│   └── utils/                   # Utilities
│
└── career-navigator-pro-main/
    └── career-navigator-pro-main/
        ├── .env                       # Frontend environment variables
        ├── vite.config.ts             # Vite configuration
        ├── src/
        │   ├── lib/
        │   │   ├── api.ts             # API client (axios instance)
        │   │   ├── auth-context.tsx   # Auth state management
        │   │   └── utils.ts           # Utilities
        │   ├── pages/
        │   │   ├── Login.tsx          # Login page (uses API)
        │   │   ├── Signup.tsx         # Signup page (uses API)
        │   │   ├── Dashboard.tsx      # Dashboard
        │   │   ├── CareerAdvisor.tsx  # Career advisor feature
        │   │   ├── SkillGap.tsx       # Skill gap analysis
        │   │   ├── Roadmap.tsx        # Roadmap generator
        │   │   ├── ResumeAnalysis.tsx # Resume analyzer
        │   │   └── HistoryPage.tsx    # History of analyses
        │   └── components/            # React components
        └── package.json
```

## API Endpoints Integration

### Authentication Endpoints

**POST /api/auth/login**
- Request: `{ email: string, password: string }`
- Response: `{ success: true, token: string, user: { id, name, email } }`
- Frontend: `authAPI.login(email, password)` in Login.tsx

**POST /api/auth/signup**
- Request: `{ name, email, password, education, experienceLevel, skills[], city }`
- Response: `{ success: true, token: string, user: { id, name, email } }`
- Frontend: `authAPI.signup(...)` in Signup.tsx

### AI Feature Endpoints

**POST /api/ai/career-advice**
- Request: `{ skills: string[], education: string, interests: string }`
- Response: `{ success: true, data: { roles: [...] } }`
- Frontend: `aiAPI.careerAdvisor(skills, education, interests)` in CareerAdvisor.tsx
- Requires: JWT token in Authorization header

**POST /api/ai/skill-gap**
- Request: `{ skills: string[], targetRole: string }`
- Response: `{ success: true, data: { missingSkills: [...], priority: [...] } }`
- Frontend: `aiAPI.skillGap(skills, targetRole)` in SkillGap.tsx
- Requires: JWT token

**POST /api/ai/generate-roadmap**
- Request: `{ goal: string, duration: number, currentSkills: string[] }`
- Response: `{ success: true, data: { weeks: [...] } }`
- Frontend: `aiAPI.roadmap(goal, duration, currentSkills)` in Roadmap.tsx
- Requires: JWT token

**POST /api/ai/resume-analyzer**
- Request: FormData with `file` (PDF), optional `targetRole`, `experienceLevel`
- Response: `{ success: true, data: { strengths, weaknesses, improvements } }`
- Frontend: `aiAPI.resumeAnalysis(file, targetRole, experienceLevel)` in ResumeAnalysis.tsx
- Requires: JWT token

## Setup Instructions

### 1. Backend Setup

```bash
cd career-ai-backend

# Install dependencies
npm install

# Ensure .env file has:
# - GEMINI_API_KEY (from https://aistudio.google.com/app/apikeys)
# - MONGODB_URI (MongoDB connection string)
# - JWT_SECRET (your secret key)

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd career-navigator-pro-main/career-navigator-pro-main

# Install dependencies
npm install
# or
bun install

# Ensure .env file has:
# VITE_API_BASE_URL=http://localhost:5000

# Start the development server
npm run dev
# Frontend runs on http://localhost:8080 or http://localhost:5173
```

## CORS Configuration

The backend is configured with CORS enabled. Frontend requests from `localhost:5173` and `localhost:8080` are allowed.

If you change ports, update:
- Backend: `src/app.js` CORS configuration
- Frontend: `career-navigator-pro-main/.env` VITE_API_BASE_URL

## Authentication Flow

1. User signs up/logs in
2. Backend verifies credentials
3. Backend generates JWT token
4. Token stored in localStorage
5. Token automatically sent in all subsequent requests via Authorization header
6. Backend verifies token on protected routes using auth middleware

## Database Models

### User Model (User.js)
- name, email, password (hashed with bcrypt)
- city, education, experienceLevel
- skills (array)
- createdAt, updatedAt

### AIResponse Model (AIResponse.js)
- userId, type, prompt, response, inputText
- Stores AI-generated responses for history/logging

### Resume Model (Resume.js)
- userId, fileName, filePath, analysis
- Stores uploaded resumes and their analysis

## Key Integration Points

1. **Auth Context** (`auth-context.tsx`): Manages user session and token
2. **API Client** (`api.ts`): Handles all API calls with token injection
3. **Protected Routes** (`ProtectedRoute.tsx`): Requires authentication
4. **Auth Middleware** (`auth.middleware.js`): Verifies JWT on backend

## Troubleshooting

### "Invalid token" Error
- Ensure JWT_SECRET in backend .env matches across auth.controllers.js and auth.middleware.js
- Check token is properly stored in localStorage

### CORS Errors
- Verify backend CORS configuration includes frontend URL
- Check Content-Type headers are application/json

### API Endpoint Not Found
- Verify routes are prefixed with `/api/auth` and `/api/ai`
- Check imports in app.js: `app.use('/api/auth', authRoutes)` and `app.use('/api/ai', aiRoutes)`

### Gemini API Errors
- Verify GEMINI_API_KEY is valid and has proper API quotas
- Check API format matches GoogleGenAI requirements

## Running Both Servers

Terminal 1 - Backend:
```bash
cd career-ai-backend
npm start
```

Terminal 2 - Frontend:
```bash
cd career-navigator-pro-main/career-navigator-pro-main
npm run dev
```

Both should now work together seamlessly!
