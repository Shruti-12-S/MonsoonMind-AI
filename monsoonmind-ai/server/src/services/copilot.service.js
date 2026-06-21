import axios from "axios";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const agricultureKeywords = [
  "monsoon",
  "rain",
  "rainfall",
  "crop",
  "sowing",
  "seed",
  "irrigation",
  "fertilizer",
  "soil",
  "farm",
  "yield",
  "drought",
  "weather",
  "harvest",
  "pest",
  "water",
  "agriculture"
];

const toGeminiError = (error) => {
  if (!axios.isAxiosError(error)) {
    return error;
  }

  const upstreamStatus = error.response?.status;
  const upstreamError = error.response?.data?.error;
  const upstreamMessage = upstreamError?.message || error.message;
  const details = {
    provider: "gemini",
    upstreamStatus: upstreamStatus || null,
    upstreamCode: upstreamError?.status || error.code || null,
    upstreamMessage
  };

  if (upstreamStatus === 400 || upstreamStatus === 401 || upstreamStatus === 403) {
    return new ApiError(
      503,
      "Gemini rejected the copilot request. Check GEMINI_API_KEY and GEMINI_MODEL in .env.",
      details
    );
  }

  if (upstreamStatus === 404) {
    return new ApiError(
      503,
      "Gemini model was not found. Check GEMINI_MODEL in .env.",
      details
    );
  }

  if (upstreamStatus === 429) {
    return new ApiError(
      503,
      "Gemini rate limit reached. Try the copilot again in a little while.",
      details
    );
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError(
      504,
      "Gemini took too long to answer. Try the copilot again.",
      details
    );
  }

  if (!upstreamStatus) {
    return new ApiError(
      503,
      "Could not reach Gemini from the API server. Check internet access, proxy settings, or firewall rules.",
      details
    );
  }

  return new ApiError(
    502,
    `Gemini API returned ${upstreamStatus}. Try the copilot again later.`,
    details
  );
};

export const isAgricultureQuestion = (question = "") => {
  const lower = question.toLowerCase();
  return agricultureKeywords.some((keyword) => lower.includes(keyword));
};

export const askAgricultureCopilot = async ({ question, context }) => {
  if (!isAgricultureQuestion(question)) {
    return {
      guarded: true,
      answer:
        "I can help only with agriculture, monsoon, crop risk, sowing, irrigation, and farm finance decisions. Ask me a farming decision question and I will focus there."
    };
  }

  if (!env.geminiApiKey) {
    throw new ApiError(
      503,
      "GEMINI_API_KEY is not configured. Add it to the server environment to enable the agriculture copilot."
    );
  }

  const prompt = `
You are MonsoonMind AI, a domain-specific agriculture decision copilot.
Only answer questions about monsoon farming decisions, crop risk, sowing timing,
irrigation, rainfall, farm input timing, or financial impact.

Use the provided farm and decision context when available.
Keep advice practical, concise, and explain why.
Never claim to replace local agronomists or official advisories.

Context:
${JSON.stringify(context || {}, null, 2)}

Farmer question:
${question}
`;

  try {
    const modelPath = env.geminiModel.startsWith("models/")
      ? env.geminiModel
      : `models/${env.geminiModel}`;

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 700
        }
      },
      {
        params: { key: env.geminiApiKey },
        timeout: 20000
      }
    );

    const answer =
      data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") ||
      "I could not generate a response from Gemini. Please try again.";

    return {
      guarded: false,
      answer
    };
  } catch (error) {
    throw toGeminiError(error);
  }
};