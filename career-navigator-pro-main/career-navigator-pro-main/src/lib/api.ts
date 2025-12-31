import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  signup: (name: string, email: string, password: string, education: string, experienceLevel: string, skills?: string[], city?: string) => 
    api.post('/api/auth/signup', { name, email, password, education, experienceLevel, skills, city }),
};

// AI Feature APIs
export const aiAPI = {
  skillGap: (skills: string[], targetRole: string) =>
    api.post('/api/ai/skill-gap', { skills, targetRole }),
  
roadmap: (skills: string[], targetRole: string, experienceLevel: string) =>
  api.post('/api/ai/generate-roadmap', { skills, targetRole, experienceLevel }),

  
  careerAdvisor: (skills: string[], education: string, interests: string) =>
    api.post('/api/ai/career-advice', { skills, education, interests }),
  
  resumeAnalysis: (file: File, targetRole?: string, experienceLevel?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) formData.append('targetRole', targetRole);
    if (experienceLevel) formData.append('experienceLevel', experienceLevel);
    return api.post('/api/ai/resume-analyzer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // History APIs
  history: () =>
    api.get('/api/ai/history'),

  historyItem: (id: string) =>
    api.get(`/api/ai/history/${id}`),
};

export default api;
