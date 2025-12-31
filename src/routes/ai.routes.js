import express from "express";
import { analyzeSkillGap, giveCareerAdvice, generateRoadmap, resumeAnalyzer, getUserHistory, getHistoryById } from "../controllers/ai.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// POST /api/ai/career-advice
// Body: { "question": "...", "userId": "..." }
router.post("/skill-gap",verifyToken, analyzeSkillGap);
router.post("/career-advice",verifyToken, giveCareerAdvice);
router.post("/generate-roadmap",verifyToken, generateRoadmap);
router.post("/resume-analyzer", verifyToken, upload.single('file'), resumeAnalyzer);

// GET /api/ai/history - Get all AI responses for the logged-in user
router.get("/history", verifyToken, getUserHistory);

// GET /api/ai/history/:id - Get specific AI response
router.get("/history/:id", verifyToken, getHistoryById);



export default router;