# Career Navigator Pro - Quick Reference Card

## 🚀 Starting the Application

### Windows
```bash
cd career-ai-backend
start.bat both
```

### macOS/Linux
```bash
cd career-ai-backend
bash start.sh both
```

### Manual (All Platforms)
**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd career-navigator-pro-main/career-navigator-pro-main
npm run dev
```

## 🌐 URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:8080 |
| Backend | http://localhost:5000 |
| API Test | http://localhost:5000/api/test |
| Health Check | http://localhost:5000/health |

## 📝 Environment Files

Create these files if they don't exist:

### Backend: `.env`
```env
MONGO_URI=mongodb://localhost:27017/career-ai-db
GEMINI_API_KEY=your_api_key_from_aistudio
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Frontend: `.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🔐 Authentication

1. Go to http://localhost:8080/signup
2. Fill in all fields (name, email, password, education, experience level)
3. Submit to create account
4. You'll be logged in automatically and redirected to dashboard
5. Token is stored in localStorage

## 🧪 Test the Features

After login:

1. **Career Advisor** (http://localhost:8080/advisor)
   - Input: Skills, Education, Interests
   - Output: Career path recommendations

2. **Skill Gap Analysis** (http://localhost:8080/skill-gap)
   - Input: Current skills, Target role
   - Output: Missing skills, Priority, Timeline

3. **Roadmap Generator** (http://localhost:8080/roadmap)
   - Input: Learning goal, Duration, Current skills
   - Output: Week-by-week learning plan

4. **Resume Analysis** (http://localhost:8080/resume)
   - Input: PDF resume file
   - Output: Analysis, Strengths, Weaknesses

## 📊 Database

### Models
- **User**: name, email, password (hashed), education, experienceLevel, skills, city
- **AIResponse**: userId, type, prompt, response, timestamp

### Accessing MongoDB
```bash
# Using MongoDB Compass GUI
# or command line:
mongo mongodb://localhost:27017/career-ai-db
```

## 🔌 API Endpoints

### Auth
```
POST /api/auth/login
POST /api/auth/signup
```

### AI Features (requires JWT token)
```
POST /api/ai/career-advice
POST /api/ai/skill-gap
POST /api/ai/generate-roadmap
POST /api/ai/resume-analyzer
```

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port 5000 already in use | Kill the process: `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| CORS error | Check frontend URL in backend CORS config |
| API 401 Unauthorized | Log in again, token might be expired |
| Gemini API error | Verify API key and quotas in aistudio.google.com |
| MongoDB connection error | Ensure MongoDB is running and connection string is correct |
| Cannot find module | Run `npm install` in both directories |

## 📁 Key Files

### Backend
- `src/app.js` - Express configuration
- `src/routes/auth.routes.js` - Auth endpoints
- `src/routes/ai.routes.js` - AI endpoints
- `src/controllers/auth.controllers.js` - JWT token logic
- `src/middlewares/auth.middleware.js` - Token verification

### Frontend
- `src/lib/api.ts` - API client (all requests go through here)
- `src/lib/auth-context.tsx` - Auth state (login/logout)
- `src/pages/*.tsx` - Feature pages

## 🔄 Request/Response Flow

```
User Input (React Component)
    ↓
API Call (src/lib/api.ts)
    ↓
Add JWT Token (Axios Interceptor)
    ↓
Backend Route Handler
    ↓
Verify Token (auth.middleware.js)
    ↓
Controller Logic
    ↓
AI Call (Gemini API)
    ↓
Store Response (MongoDB)
    ↓
Send JSON Response
    ↓
Update Frontend State
    ↓
Display Results to User
```

## 📦 Dependencies Installed

### Backend
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ORM",
  "jsonwebtoken": "JWT auth",
  "bcrypt": "Password hashing",
  "cors": "Cross-origin requests",
  "@google/genai": "Gemini AI",
  "multer": "File uploads",
  "dotenv": "Environment variables"
}
```

### Frontend
```json
{
  "react": "UI library",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "@radix-ui/*": "UI components",
  "tailwindcss": "Styling",
  "vite": "Build tool"
}
```

## 🎯 Integration Checklist

- ✅ Backend routes updated to return JSON (not EJS)
- ✅ JWT tokens generated on auth
- ✅ Frontend API client matches backend endpoints
- ✅ Login/Signup pages use real API
- ✅ AI feature pages use real API
- ✅ Auth middleware verifies tokens
- ✅ CORS configured correctly
- ✅ Environment variables set up
- ✅ Startup scripts created

## 🚀 Production Deployment

Before deploying:

1. Update JWT_SECRET to a secure random string
2. Configure MongoDB with production database
3. Update CORS_ORIGIN with production domain
4. Add HTTPS and security headers
5. Set NODE_ENV=production
6. Use environment variables manager
7. Set up logging and monitoring
8. Implement rate limiting
9. Add input validation and sanitization
10. Test thoroughly in staging

## 📞 Support Resources

- **Google Gemini API**: https://aistudio.google.com
- **MongoDB**: https://www.mongodb.com/docs
- **Express**: https://expressjs.com/
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

## 📄 Documentation Files

- `README.md` - Project overview
- `INTEGRATION_GUIDE.md` - Detailed integration steps
- `start.sh` / `start.bat` - Startup scripts
- `.env.example` - Environment variable template

---

**Everything is ready! Start your servers and begin testing!** 🎉
