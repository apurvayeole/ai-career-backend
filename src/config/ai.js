// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get the directory of the current file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables from .env file (2 levels up from config/)
// dotenv.config({ path: path.join(__dirname, "../../.env") });

// // Get API key from environment variable
// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   throw new Error("GEMINI_API_KEY not found in .env file");
// }

// // Initialize with API key
// const ai = new GoogleGenAI({
//   apiKey: apiKey
// });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main().catch(error => {
//   console.error("Error:", error.message);
// });
// export default main;