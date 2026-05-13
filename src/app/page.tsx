"use client";

import { JobTitleForm } from "@/components/JobTitleForm";
import { generateInterviewQuestions } from "@/lib/api";
import { InterviewQuestion } from "@/types";
import { FormEvent, useState } from "react";


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
        <JobTitleForm
          value={jobTitle}
          onChange={setJobTitle}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 animate-pulse">
              Generating expert questions for <strong>{jobTitle}</strong>...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}

        {/* Results */}
        {questions.length > 0 && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Interview Questions
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                3 Questions Generated
              </span>
            </div>

            {questions.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-gray-900 leading-relaxed">
                      {item.question}
                    </p>
                    
                    {item.rationale && (
                      <div className="pl-4 border-l-2 border-gray-100">
                        <p className="text-sm text-gray-500 leading-relaxed italic">
                          <span className="font-semibold text-gray-400 not-italic uppercase text-[10px] tracking-widest mr-2">Rationale:</span>
                          {item.rationale}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
