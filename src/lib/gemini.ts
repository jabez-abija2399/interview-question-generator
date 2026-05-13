import { ApiResponse } from "@/types";

/**
 * GEMINI AI SERVICE
 * Handles all logic related to interacting with the Google Gemini API.
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Structured Output Schema
 * Forces the AI to return data in the exact format our frontend expects.
 */
const QUESTION_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          rationale: { 
            type: "string",
            description: "A brief explanation of what this question reveals about the candidate."
          }
        },
        required: ["question", "rationale"]
      }
    }
  },
  required: ["questions"]
};

/**
 * Builds the creative prompt for the AI.
 */
function buildPrompt(jobTitle: string): string {
  return `Act as an expert hiring manager and interviewer with 15+ years of experience.
Generate exactly 3 thoughtful, insightful interview questions for a "${jobTitle}" role .

Requirements:
- Be specific to the "${jobTitle}" role, not generic.
- Test for real skills, judgment, or mindset relevant to this role.
- Avoid yes/no questions — ask for examples or thinking processes.
- For each question, provide a brief rationale explaining what the answer reveals about the candidate's suitability for the role.`;
}

/**
 * Core service function to generate questions.
 */
export async function generateQuestions(jobTitle: string): Promise<ApiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt(jobTitle) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        response_mime_type: "application/json",
        response_schema: QUESTION_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    // Handle 429 specifically for quota management
    if (response.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    }
    const errorData = await response.json();
    console.error("Gemini API Error:", errorData);
    throw new Error("AI_SERVICE_ERROR");
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("EMPTY_RESPONSE");
  }

  return JSON.parse(rawText);
}
