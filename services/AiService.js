import axios from "axios";
import config from "../utils/config/config.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateContent = async (prompt) => {
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": config.aiApiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);

    // Return a properly structured error response that matches expected format
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text: "I encountered an error processing your request. Please try again later.",
              },
            ],
            role: "model",
          },
          finishReason: "ERROR",
        },
      ],
    };
  }
};
