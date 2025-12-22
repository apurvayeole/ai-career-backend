# Career Navigator Pro - AI-Powered Career Guidance Platform

A full-stack web application that uses AI to provide personalized career advice, resume analysis, skill gap identification, and learning roadmaps.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one](https://aistudio.google.com/app/apikeys))

### Setup & Run

#### Windows:
```bash
# Clone and navigate
cd career-ai-backend

# Run both servers
start.bat both

# Or run individually
start.bat backend
start.bat frontend
```

#### macOS/Linux:
```bash
bash start.sh both
```

#### Manual Setup:
```bash
# Terminal 1 - Backend
npm install
npm run dev

# Terminal 2 - Frontend
cd career-navigator-pro-main/career-navigator-pro-main
npm install
npm run dev
```

**Access:** 
- Frontend: http://localhost:8080
- Backend: http://localhost:5000

## 📋 Project Structure

```
├── src/                          # Backend code
│   ├── controllers/              # Request handlers
│   ├── routes/                   # API routes (/api/auth, /api/ai)
│   ├── models/                   # Database schemas (User, AIResponse)
│   ├── middlewares/              # JWT verification
│   └── prompts/                  # AI prompt templates
│
└── career-navigator-pro-main/    # React frontend
    └── src/
        ├── pages/                # Page components
        ├── lib/                  # API client (api.ts)
        └── components/           # UI components
```

## ✨ Features

- **🔐 Authentication**: Register, login with JWT tokens
- **💼 Career Advisor**: AI-powered career recommendations
- **📊 Skill Gap Analysis**: Identify missing skills with resources
- **📚 Learning Roadmap**: Week-by-week learning plans
- **📄 Resume Analysis**: AI-powered resume review
- **🎨 Modern UI**: Responsive design with Tailwind CSS

## 🔗 API Integration

All features are fully integrated:

| Feature | Endpoint | Frontend |
|---------|----------|----------|
| Login | `POST /api/auth/login` | Login.tsx |
| Signup | `POST /api/auth/signup` | Signup.tsx |
| Career Advice | `POST /api/ai/career-advice` | CareerAdvisor.tsx |
| Skill Gap | `POST /api/ai/skill-gap` | SkillGap.tsx |
| Roadmap | `POST /api/ai/generate-roadmap` | Roadmap.tsx |
| Resume | `POST /api/ai/resume-analyzer` | ResumeAnalysis.tsx |

## 🔧 Configuration

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/career-ai-db
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key
PORT=5000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📚 Documentation

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Detailed setup and integration guide
- **[API Reference](./INTEGRATION_GUIDE.md#api-endpoints-integration)** - Complete API documentation

## 🐛 Troubleshooting

- **Port in use**: Kill process on port 5000/8080
- **CORS errors**: Check backend CORS configuration in `src/app.js`
- **API errors**: Verify GEMINI_API_KEY and MongoDB connection
- **Token issues**: Clear localStorage and log in again

## 🚀 Tech Stack

**Backend**: Node.js, Express, MongoDB, Gemini AI, JWT, Multer
**Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn/UI

## 📝 Key Files

**Backend Integration**:
- `src/app.js` - Express setup with CORS
- `src/routes/auth.routes.js` - Auth endpoints
- `src/routes/ai.routes.js` - AI endpoints
- `src/controllers/auth.controllers.js` - JWT token generation

**Frontend Integration**:
- `src/lib/api.ts` - API client with token injection
- `src/lib/auth-context.tsx` - Auth state management
- `src/pages/Login.tsx` - Real API login
- `src/pages/Signup.tsx` - Real API signup

## 🎯 Next Steps

1. ✅ Both servers are running and integrated
2. 📱 Visit http://localhost:8080 to test the application
3. 🔑 Sign up with test credentials
4. 🎨 Customize UI as needed
5. 🚀 Deploy to production

---

For detailed information, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)