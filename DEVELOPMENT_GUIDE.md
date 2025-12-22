# Development Guide - Career Navigator Pro

## 🛠️ Development Setup

### Initial Setup (First Time)

```bash
# Clone/navigate to project
cd career-ai-backend

# Install backend dependencies
npm install

# Install frontend dependencies
cd career-navigator-pro-main/career-navigator-pro-main
npm install
cd ../..
```

### Create Environment Files

```bash
# Copy examples to actual .env files
copy .env.example .env                                          # Backend
copy career-navigator-pro-main\career-navigator-pro-main\.env.example career-navigator-pro-main\career-navigator-pro-main\.env  # Frontend

# Edit both .env files with your API keys
```

### Start Development Servers

```bash
# Option 1: Using startup script (Windows)
start.bat both

# Option 2: Using startup script (macOS/Linux)
bash start.sh both

# Option 3: Manual start
# Terminal 1:
npm run dev

# Terminal 2:
cd career-navigator-pro-main/career-navigator-pro-main
npm run dev
```

## 📝 Adding New Features

### Backend: Adding a New AI Feature

1. **Create the prompt template** in `src/prompts/`:
```javascript
// src/prompts/myFeature.prompt.js
export const myFeaturePrompt = ({ param1, param2 }) => `
Your prompt template here...
`;
```

2. **Add controller** in `src/controllers/ai.controllers.js`:
```javascript
const myFeatureHandler = async (req, res) => {
  try {
    const { param1, param2 } = req.body;
    const prompt = myFeaturePrompt({ param1, param2 });
    const { text: aiText } = await generateCareerAdviceRaw(prompt);
    
    // Store response
    if (req.user?.id) {
      await storeAIResponse(req.user.id, "my-feature", prompt, aiText);
    }
    
    return res.json({ success: true, data: { result: aiText } });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export { myFeatureHandler };
```

3. **Add route** in `src/routes/ai.routes.js`:
```javascript
router.post("/my-feature", verifyToken, myFeatureHandler);
```

4. **Update frontend API** in `src/lib/api.ts`:
```typescript
export const aiAPI = {
  // ... existing features
  myFeature: (param1: string, param2: string) =>
    api.post('/api/ai/my-feature', { param1, param2 }),
};
```

5. **Create frontend page** and use the API:
```typescript
import { aiAPI } from "@/lib/api";

const handleSubmit = async () => {
  try {
    const response = await aiAPI.myFeature(param1, param2);
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

### Frontend: Adding a New UI Component

1. **Create component**:
```bash
cd src/components
# Use Shadcn/UI if available
npx shadcn-ui@latest add button
```

2. **Create page**:
```typescript
// src/pages/MyFeature.tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { aiAPI } from "@/lib/api";

export default function MyFeature() {
  // Component code
  return (
    <div>
      <PageHeader title="My Feature" description="..." />
      {/* Content */}
    </div>
  );
}
```

3. **Add route**:
```typescript
// src/App.tsx
import MyFeature from "./pages/MyFeature";

// In router:
<Route path="/my-feature" element={<ProtectedRoute><MyFeature /></ProtectedRoute>} />
```

4. **Add navigation link**:
```typescript
// src/App.tsx or NavLink.tsx
<NavLink to="/my-feature">My Feature</NavLink>
```

## 🐛 Debugging

### Backend Debugging

```javascript
// Add logging
console.log("Debug info:", variable);
console.error("Error:", error);

// Use Node debugger
node --inspect src/server.js
// Then open chrome://inspect

// Check logs
// Terminal where server is running shows all console.log statements

// Test endpoints with curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### Frontend Debugging

```typescript
// Console logging
console.log("State:", state);
console.error("Error:", error);

// React DevTools
// Install React DevTools browser extension
// Inspect components, props, state

// Network DevTools
// F12 → Network tab
// See all API requests and responses
// Check Authorization header

// Storage DevTools
// F12 → Application → Local Storage
// Verify token is stored: localStorage.token
```

## 📊 Database Management

### MongoDB

```bash
# Connect to MongoDB (local)
mongo mongodb://localhost:27017/career-ai-db

# Or use MongoDB Compass GUI
# Download from: https://www.mongodb.com/try/download/compass

# Common queries:
db.users.find()                    # View all users
db.users.findOne({email: "test@test.com"})  # Find user
db.airesponses.find()              # View all AI responses
db.users.deleteOne({_id: ObjectId("...")})  # Delete user
```

## 🧪 Testing

### Manual Testing Checklist

```markdown
- [ ] Sign up with new account
- [ ] Verify email stored in database
- [ ] Password is hashed (not plain text)
- [ ] Login with correct credentials
- [ ] Login fails with incorrect password
- [ ] Token is stored in localStorage
- [ ] Token is sent in Authorization header
- [ ] Protected routes redirect to login without token
- [ ] Each feature works and gets response
- [ ] Loading states show during API calls
- [ ] Error messages display on failure
- [ ] Logout clears token and redirects
```

### API Testing with cURL

```bash
# Create account
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"pass123","education":"BS CS","experienceLevel":"intermediate"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Use token in request
TOKEN="your_token_from_login"
curl -X POST http://localhost:5000/api/ai/skill-gap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"skills":["JavaScript","React"],"targetRole":"Senior Developer"}'
```

### Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create collection for Career Navigator Pro
3. Add requests for each endpoint:
   - Auth: Login, Signup
   - AI: Career Advisor, Skill Gap, Roadmap, Resume
4. Use environment variables for token and base URL
5. Run requests and verify responses

## 🔧 Common Development Tasks

### Update API Endpoint

1. **Backend route** (`src/routes/...js`):
   - Update path if needed
   - Update validation

2. **Backend controller** (`src/controllers/...js`):
   - Update logic
   - Update response format

3. **Frontend API** (`src/lib/api.ts`):
   - Update endpoint URL
   - Update parameters
   - Update return type

4. **Frontend component** (`src/pages/...tsx`):
   - Update API call parameters
   - Update response handling
   - Update UI if needed

### Add Environment Variable

1. **Backend** (`.env`):
   - Add variable: `MY_VAR=value`
   - Use in code: `process.env.MY_VAR`
   - Add to `.env.example`

2. **Frontend** (`.env`):
   - Add variable: `VITE_MY_VAR=value`
   - Use in code: `import.meta.env.VITE_MY_VAR`
   - Add to `.env.example`

### Add Database Model

1. **Create model** in `src/models/`:
```javascript
import mongoose from "mongoose";

const MySchema = new mongoose.Schema({
  field1: String,
  field2: Number,
});

export default mongoose.model("MyModel", MySchema);
```

2. **Import and use** in controller:
```javascript
import MyModel from "../models/MyModel.js";
const result = await MyModel.create({ field1: "value" });
```

## 📈 Performance Optimization

### Backend
- Add caching for frequently accessed data
- Use pagination for large datasets
- Add rate limiting
- Implement connection pooling
- Monitor API response times

### Frontend
- Use React.memo for expensive components
- Implement pagination for lists
- Lazy load images and components
- Use production builds for deployment
- Monitor bundle size with `npm run build`

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Change JWT_SECRET before production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Implement CORS properly
- [ ] Use secure cookies (httpOnly)

## 📚 Code Style

### JavaScript/TypeScript
- Use 2-space indentation
- Use const/let instead of var
- Use arrow functions
- Use template literals
- Add comments for complex logic
- Use meaningful variable names

### File Organization
```
src/
├── controllers/    # Business logic
├── routes/        # API routes
├── models/        # Database models
├── middlewares/   # Express middleware
├── prompts/       # AI prompts
├── utils/         # Utility functions
└── config/        # Configuration
```

## 🚀 Production Deployment

Before deploying:

1. **Backend**:
   - Update JWT_SECRET
   - Set NODE_ENV=production
   - Configure MongoDB (MongoDB Atlas)
   - Set CORS_ORIGIN to production domain
   - Test all features in staging
   - Set up error logging
   - Configure backups

2. **Frontend**:
   - Run `npm run build`
   - Test production build locally
   - Update VITE_API_BASE_URL
   - Verify API endpoints work
   - Check for console errors
   - Test on different browsers

3. **Deployment Options**:
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify, GitHub Pages
   - Database: MongoDB Atlas
   - CDN: CloudFlare

## 📞 Resources

- **Express**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/docs/
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Axios**: https://axios-http.com/
- **Tailwind**: https://tailwindcss.com/
- **TypeScript**: https://www.typescriptlang.org/

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
# Get reviewed and merged

# Update local main
git checkout main
git pull origin main
```

## 🎯 Best Practices

1. **Always test before committing**
2. **Keep components small and focused**
3. **Use environment variables for config**
4. **Document complex logic**
5. **Handle errors gracefully**
6. **Use meaningful commit messages**
7. **Keep dependencies updated**
8. **Monitor API response times**
9. **Log important events**
10. **Test on multiple devices**

---

Happy developing! 🚀
