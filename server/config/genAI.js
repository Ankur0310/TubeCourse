import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
