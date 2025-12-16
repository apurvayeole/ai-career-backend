import express from "express";
import { generateCareerAdviceRaw, storeAIResponse, analyzeSkillGap, giveCareerAdvice, generateRoadmap, resumeAnalyzer } from "../controllers/ai.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// POST /api/ai/career-advice
// Body: { "question": "...", "userId": "..." }
router.post("/skill-gap",verifyToken, analyzeSkillGap);
router.post("/career-advice",verifyToken, giveCareerAdvice);
router.post("/generate-roadmap",verifyToken, generateRoadmap);
router.post("/resume-analyzer", verifyToken, upload.single('file'), resumeAnalyzer);
// router.post("/generate-career-advice",verifyToken, generateCareerAdvice);



export default router;