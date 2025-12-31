import { createRequire } from "module";
const require = createRequire(import.meta.url);

import dotenv from "dotenv";
import AIResponse from "../models/AIResponse.js";
import { GoogleGenAI } from "@google/genai";
const pdf = require("pdf-parse");

import { skillGapPrompt } from "../prompts/skillGap.prompt.js";
import { roadmapPrompt } from "../prompts/roadmap.prompt.js";
import { resumePrompt } from "../prompts/resume.prompt.js";
import { careerPathPrompt } from "../prompts/careerPath.prompt.js";
import { cleanAIJson } from "../utils/cleanAIJson.js";

dotenv.config();

// -----------------------------------------------------------
// INIT GEMINI CLIENT
// -----------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const ai = new GoogleGenAI({ apiKey });

// -----------------------------------------------------------
// UNIVERSAL AI CALLER
// -----------------------------------------------------------
const callGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      response?.text?.trim() ||
      response?.output_text?.trim() ||
      response?.candidates?.[0]?.content?.map(c => c.text).join("\n") ||
      JSON.stringify(response);

    return text;

  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("AI model failed to generate a response.");
  }
};

// -----------------------------------------------------------
// SAVE RESPONSE
// -----------------------------------------------------------
const saveAIResponse = async (req, type, input, output) => {
  try {
    await AIResponse.create({
      userId: req.user?.id,
      type,
      input,
      response: output,
    });
  } catch (err) {
    console.error("Failed saving AI response:", err);
  }
};

// -----------------------------------------------------------
// 1. SKILL GAP
// -----------------------------------------------------------
export const analyzeSkillGap = async (req, res) => {
  try {
    const { skills, targetRole } = req.body;

    const prompt = skillGapPrompt({ skills, targetRole });
    const aiText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(cleanAIJson(aiText));
    } catch {
      parsed = aiText;
    }

    await saveAIResponse(req, "skill-gap", req.body, parsed);

    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("analyzeSkillGap error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// 2. ROADMAP
// -----------------------------------------------------------
export const generateRoadmap = async (req, res) => {
  try {
    const { skills, targetRole, experienceLevel } = req.body;

    if (!targetRole || !experienceLevel) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const prompt = roadmapPrompt({ skills, targetRole, experienceLevel });
    const aiText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(cleanAIJson(aiText));
    } catch (err) {
      console.log("Roadmap JSON Error:", err.message);
      return res.status(500).json({
        error: "AI returned invalid roadmap JSON.",
        raw: aiText,
      });
    }

    await saveAIResponse(req, "roadmap", req.body, parsed);

    return res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("generateRoadmap error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// 3. CAREER ADVICE
// -----------------------------------------------------------
export const giveCareerAdvice = async (req, res) => {
  try {
    const { skills, education, interests, experienceLevel } = req.body;

    const prompt = careerPathPrompt({
      skills,
      education,
      interests,
      experienceLevel,
    });

    const aiText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(cleanAIJson(aiText));
    } catch {
      parsed = aiText;
    }

    await saveAIResponse(req, "career-advice", req.body, parsed);

    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("giveCareerAdvice error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// 4. RESUME ANALYZER
// -----------------------------------------------------------
export const resumeAnalyzer = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Resume PDF required." });
    }

    const pdfData = await pdf(file.buffer);
    const resumeText = pdfData.text;

    const { targetRole, experienceLevel } = req.body;

    const prompt = resumePrompt({
      resumeText,
      targetRole,
      experienceLevel,
    });

    const aiText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(cleanAIJson(aiText));
    } catch {
      parsed = aiText;
    }

    await saveAIResponse(req, "resume-analysis", req.body, parsed);

    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error("resumeAnalyzer error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// 5. HISTORY LIST
// -----------------------------------------------------------
export const getUserHistory = async (req, res) => {
  try {
    const history = await AIResponse.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: history });
  } catch (err) {
    console.error("getUserHistory error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// 6. HISTORY ITEM BY ID
// -----------------------------------------------------------
export const getHistoryById = async (req, res) => {
  try {
    const entry = await AIResponse.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ error: "Not found." });
    }

    return res.json({ success: true, data: entry });

  } catch (err) {
    console.error("getHistoryById error:", err);
    return res.status(500).json({ error: err.message });
  }
};
