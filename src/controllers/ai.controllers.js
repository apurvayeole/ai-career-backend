import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import AIResponse from "../models/AIResponse.js";
import mongoose from "mongoose";
import { skillGapPrompt } from "../prompts/skillGap.prompt.js";
import { careerPathPrompt } from "../prompts/careerPath.prompt.js";
import { roadmapPrompt } from "../prompts/roadmap.prompt.js";
import { resumePrompt } from "../prompts/resume.prompt.js";
import { createRequire } from "module";
import { PDFParse } from 'pdf-parse';
// import { extractTextFromPDF } from "../utils/ocrFromPdf.js";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Get API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in .env file");
}

console.log("✓ API Key loaded successfully (length:", apiKey.length, ")");

// Initialize AI client
const ai = new GoogleGenAI({ apiKey });

const resumeAnalyzer = async (req, res) => {
  try {

    const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });
    const result = await parser.getText();

    await parser.destroy();
    const resumeText = result.text;
    const { targetRole, experienceLevel } = req.body;

    // 1. Create prompt using template
    const prompt = resumePrompt({resumeText, targetRole, experienceLevel  });

    // 2. Call AI API (use the same Gemini client)
    const { text: aiText, raw } = await generateCareerAdviceRaw(prompt);

    // 3. Store AI response (if user present)
    try {
      const userId = req.user?.id || req.user?._id;
      if (userId) {
        await storeAIResponse(userId, "resume-analyzer", prompt, aiText);
      }
    } catch (dbErr) {
      console.warn("resumeAnalyzer: failed saving AI response:", dbErr.message || dbErr);
    }

    // 4. Return parsed data when possible, otherwise raw text
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = aiText;
    }

    return res.json({ success: true, data: parsed, raw });
  } catch (err) {
    console.error("resumeAnalyzer error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};

const generateRoadmap = async (req, res) => {
  try {
    const { goal, duration, currentSkills } = req.body;

    // 1. Create prompt using template
    const prompt = roadmapPrompt({ goal, duration, currentSkills });

    // 2. Call AI API (use the same Gemini client)
    const { text: aiText, raw } = await generateCareerAdviceRaw(prompt);

    // 3. Store AI response (if user present)
    try {
      const userId = req.user?.id || req.user?._id;
      if (userId) {
        await storeAIResponse(userId, "generate-roadmap", prompt, aiText);
      }
    } catch (dbErr) {
      console.warn("generateRoadmap: failed saving AI response:", dbErr.message || dbErr);
    }

    // 4. Return parsed data when possible, otherwise raw text
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = aiText;
    }

    return res.json({ success: true, data: parsed, raw });
  } catch (err) {
    console.error("generateRoadmap error:", {
      message: err.message,
      status: err.status,
      code: err.code,
      details: err.error?.details || err.details,
      fullError: err
    });
    return res.status(500).json({ error: err.message || String(err) });
  }
};

const analyzeSkillGap = async (req, res) => {
  try {
    const { skills, targetRole } = req.body;

    // 1. Create prompt using template
    const prompt = skillGapPrompt({ skills, targetRole });

    // 2. Call AI API (use the same Gemini client)
    const { text: aiText, raw } = await generateCareerAdviceRaw(prompt);

    // 3. Store AI response (if user present)
    try {
      const userId = req.user?.id || req.user?._id;
      if (userId) {
        await storeAIResponse(userId, "skill-gap", prompt, aiText);
      }
    } catch (dbErr) {
      console.warn("analyzeSkillGap: failed saving AI response:", dbErr.message || dbErr);
    }

    // 4. Return parsed data when possible, otherwise raw text
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = aiText;
    }

    return res.json({ success: true, data: parsed, raw });
  } catch (err) {
    console.error("analyzeSkillGap error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};

const giveCareerAdvice = async (req, res) => {
  try {
    const {education, skills, interests } = req.body;

    // 1. Create prompt using template
    const prompt = careerPathPrompt({ education, skills, interests });

    // 2. Call AI API (use the same Gemini client)
    const { text: aiText, raw } = await generateCareerAdviceRaw(prompt);

    // 3. Store AI response (if user present)
    try {
      const userId = req.user?.id || req.user?._id;
      if (userId) {
        await storeAIResponse(userId, "careere-advice", prompt, aiText);
      }
    } catch (dbErr) {
      console.warn("giveCareerAdvice: failed saving AI response:", dbErr.message || dbErr);
    }

    // 4. Return parsed data when possible, otherwise raw text
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = aiText;
    }

    return res.json({ success: true, data: parsed, raw });
  } catch (err) {
    console.error("careeradvice error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};



const generateCareerAdviceRaw = async (question) => {
  if (!question || typeof question !== "string") {
    throw new Error("question (string) is required");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });

    // Try to extract human-readable text from known response shapes
    const extractText = (resp) => {
      if (!resp) return null;
      if (typeof resp === "string") return resp;
      if (typeof resp.text === "string" && resp.text.trim()) return resp.text.trim();
      if (typeof resp.output_text === "string" && resp.output_text.trim()) return resp.output_text.trim();

      try {
        const cand = resp.candidates?.[0];
        if (cand) {
          if (Array.isArray(cand.content)) {
            const parts = cand.content.map((c) => c.text || JSON.stringify(c)).filter(Boolean);
            if (parts.length) return parts.join("\n");
          }
          if (typeof cand.output === "string") return cand.output;
        }
      } catch (e) {}

      try {
        const out = resp.output?.[0]?.content?.[0]?.text;
        if (typeof out === "string" && out.trim()) return out.trim();
      } catch (e) {}

      try {
        return JSON.stringify(resp);
      } catch (e) {
        return String(resp);
      }
    };

    const aiText = extractText(response);

    if (!aiText || aiText === "{}") {
      console.warn("generateCareerAdviceRaw: extracted empty text, raw response:", JSON.stringify(response, null, 2));
    }

    return { text: aiText, raw: response };
  } catch (err) {
    console.error("generateCareerAdvice error:", {
      message: err.message,
      status: err.status,
      code: err.code,
      details: err.error?.details || err.details,
      fullError: err
    });
    throw err;
  }
};

// const generateCareerAdvice = async (question) => {
//   const { text } = await generateCareerAdviceRaw(question);
//   return text;
// };

// Store AI response in database
// Supports: userId (optional), type (required), prompt (optional), aiText/response (required, mixed type)
const storeAIResponse = async (userId, type, prompt, aiText, inputText) => {
  try {
    // Validate required fields
    if (!type) {
      throw new Error("storeAIResponse: 'type' is required (e.g., 'skill-gap', 'career-advice')");
    }
    if (!aiText) {
      throw new Error("storeAIResponse: 'aiText' (response) is required");
    }

    const doc = {
      type: String(type).trim(),
      prompt: prompt ? String(prompt).trim() : "",
      response: aiText, // Mixed type: can be string, object, or JSON
    };

    // Attach the extracted input text if provided (do NOT store PDF binary)
    if (inputText && typeof inputText === 'string') {
      doc.inputText = inputText;
    }

    // Parse response if it's a JSON string; otherwise store as-is
    if (typeof aiText === "string") {
      try {
        doc.response = JSON.parse(aiText);
      } catch (e) {
        // Not JSON — store as plain string
        doc.response = aiText;
      }
    }

    // Attach userId only if provided and valid
    if (userId) {
      if (mongoose.isValidObjectId(userId)) {
        doc.userId = userId;
      } else {
        console.warn("storeAIResponse: supplied userId is invalid, saving without userId:", userId);
      }
    }

    const record = await AIResponse.create(doc);
    console.log("AI response stored:", record._id);
    return record;
  } catch (err) {
    console.error("storeAIResponse error:", err.message || String(err));
    throw err;
  }
};

// Get user's AI response history
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const history = await AIResponse.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ 
      success: true, 
      data: history,
      count: history.length 
    });
  } catch (err) {
    console.error("getUserHistory error:", err.message || String(err));
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};

// Get specific history item
const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const item = await AIResponse.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ error: "History item not found" });
    }

    return res.json({ success: true, data: item });
  } catch (err) {
    console.error("getHistoryById error:", err.message || String(err));
    return res.status(500).json({ error: "Failed to fetch history item" });
  }
};



export { generateCareerAdviceRaw, storeAIResponse, analyzeSkillGap, giveCareerAdvice, generateRoadmap, resumeAnalyzer, getUserHistory, getHistoryById };