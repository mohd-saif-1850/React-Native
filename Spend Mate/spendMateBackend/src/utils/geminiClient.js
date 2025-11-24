import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
