import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);
import aiRoutes from './routes/ai.routes.js';
app.use('/api/ai', aiRoutes);

app.get("/api/test", (req, res) =>{
    res.json({ message: "Test endpoint working!" });
});

// health check
app.get('/health', (req, res) => res.send('OK'));

// log mounted routes for debugging
console.log('Mounting routes: /api/auth and /api/ai');

export default app;