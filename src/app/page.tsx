"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import { JobTitleForm } from "@/components/JobTitleForm";
import { LoadingState } from "@/components/LoadingState";
import { QuestionCard } from "@/components/QuestionCard";
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
          <LoadingState jobTitle={jobTitle} />
        )}

        {/* Error state */}
        {error && (
          <ErrorMessage message={error} />
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
              <QuestionCard question={item} index={index} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
