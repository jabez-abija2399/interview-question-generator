"use client";

import { InterviewQuestion } from "@/types";
import { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        <form action="" className="flex gap-3 mb-8">
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

      </div>
    </main>
  );
}
