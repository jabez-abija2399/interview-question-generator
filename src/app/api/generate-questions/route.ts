import { NextRequest, NextResponse } from "next/server";


const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildPrompt(jobTitle: string): string {
  return `
expert hiring manager and interviewer with 15+ years of experience.
Generate exactly 3 thoughtful, insightful interview questions for a "${jobTitle}" role.

Requirements for each question:
- Be specific to the "${jobTitle}" role, not generic
- Test for real skills, judgment, or mindset relevant to this role
- Avoid yes/no questions — ask for examples, decisions, or thinking processes
- Include a brief rationale explaining what this question reveals about the candidate

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "questions": [
    {
      "question": "Your interview question here",
      "rationale": "What this question reveals about the candidate"
    },
    {
      "question": "Your interview question here", 
      "rationale": "What this question reveals about the candidate"
    },
    {
      "question": "Your interview question here",
      "rationale": "What this question reveals about the candidate"
    }
  ]
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle } = body;

    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { message: "Job title is required" },
        { status: 400 }
      );
    }
    
    // sanitize job title - only allow reasonable length job titles
    const sanitizedTitle = jobTitle.trim().slice(0, 100);

    const apiKey = process.env.GEMINI_API_KEY;

    if(!apiKey) {
      return NextResponse.json(
        {message: "API key not configured"},
        {status: 500}
      )
    }

    // Call the Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(sanitizedTitle)}],
          },
        ],
        generationConfig: {
          temperature: 0.7, // Some creativity but not too random
          maxOutputTokens: 1024, // More than enough for 3 questions
          response_mime_type: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { message: "Failed to generate questions. Please try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract the text content from Gemini's response structure
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if(!rawText) {
      return NextResponse.json(
        {message: "No response received from AI. Please try again."},
        {status: 502}
      );
    }
    
    // Parse the JSON response from Gemini sometimes wraps in markdown code blocks
    let parsed: any;
    try {
      // Strip markdown code blocks if present
      const cleaned = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse JSON from Gemini:", rawText);
      return NextResponse.json(
        { message: "Received invalid response format. Please try again." },
        { status: 502 }
      );
    }
    
    // Validate the parsed response has the expected shape
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { message: "Unexpected response format. Please try again." },
        { status: 502 }
      );
    }
    
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Unexpected error in /api/generate-questions:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}