import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);

export { model, fileManager };
