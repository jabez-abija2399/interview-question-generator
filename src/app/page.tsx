"use client";

import { ApiResponse, InterviewQuestion } from "@/types";
import { FormEvent, useState } from "react";

async function generateInterviewQuestions(jobTitle: string): Promise<ApiResponse> {
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

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim()) return;

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const data = await generateInterviewQuestions(jobTitle.trim());
      setQuestions(data.questions)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
      
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 ">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Interview Question Generator
          </h1>
          <p className="mt-2 text-gray-500">
            Enter a job title to generate 3 thoughtful, role-specific interview questions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Customer Success Manager"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
          text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <button 
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
           transition-colors cursor-pointer"
          >Generate</button>
        </form>

        {/* Loading State */}
        {loading && (
          <div>
            <div />
            <span>Generating questions for <strong>{jobTitle}</strong></span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {questions.length > 0 && (
          <div>
            <h2>Interview questions for <strong>{jobTitle}</strong></h2>
            {questions.map((item, index) => (
              <div key={index}>
                <p>{item.question}</p>

                {item.rationale && (
                  <p className="mt-1 text-sm text-gray-500 italic">{item.rationale}</p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
