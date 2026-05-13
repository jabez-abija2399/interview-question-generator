import { ApiResponse } from "@/types";

export async function generateInterviewQuestions(jobTitle: string): Promise<ApiResponse> {
  const response = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate questions");
  }

  return response.json();
}