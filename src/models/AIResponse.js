import mongoose from "mongoose";

const AIResponseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },  // skill-gap, roadmap, resume, etc.
    prompt: String,
    inputText: String,
    response: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AIResponse", AIResponseSchema);
