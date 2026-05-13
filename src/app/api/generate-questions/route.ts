import { NextRequest, NextResponse } from "next/server";
import { generateQuestions } from "@/lib/gemini";

// API ROUTE: /api/generate-questions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle } = body;

    // 1. Validation
    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { message: "Job title is required" },
        { status: 400 }
      );
    }
    
    // 2. Call the AI Service
    const questions = await generateQuestions(jobTitle.trim().slice(0, 100));
    
    // 3. Success Response
    return NextResponse.json(questions);

  } catch (error: any) {
    console.error("Error in /api/generate-questions:", error);

    // 4. Specific Error Handling for User Feedback
    if (error.message === "QUOTA_EXCEEDED") {
      return NextResponse.json(
        { message: "AI Quota exceeded. Please wait 60 seconds and try again." },
        { status: 429 }
      );
    }

    if (error.message === "AI_SERVICE_ERROR") {
      return NextResponse.json(
        { message: "The AI service is temporarily unavailable." },
        { status: 502 }
      );
    }

    // Fallback for unexpected errors
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}