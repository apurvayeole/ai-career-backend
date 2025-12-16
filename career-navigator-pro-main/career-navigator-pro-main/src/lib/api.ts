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
  signup: (name: string, email: string, password: string) => 
    api.post('/api/auth/signup', { name, email, password }),
};

// AI Feature APIs
export const aiAPI = {
  skillGap: (skills: string[], targetRole: string) =>
    api.post('/api/ai/skill-gap', { skills, targetRole }),
  
  roadmap: (goal: string, duration: number, currentSkills: string[]) =>
    api.post('/api/ai/roadmap', { goal, duration, currentSkills }),
  
  careerAdvisor: (skills: string, education: string, interests: string) =>
    api.post('/api/ai/career-advisor', { skills, education, interests }),
  
  resumeAnalysis: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/api/ai/resume-analysis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  history: (userId: string) =>
    api.get(`/api/ai/history/${userId}`),
};

export default api;
