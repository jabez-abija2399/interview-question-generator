"use client";

import { InterviewQuestion } from "@/types";
import { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <main>
      <div>
        
        {/* Header */}
        <div>
          <h1>
            Interview Question Generator
          </h1>
          <p>
            Enter a job title to generate 3 thoughtful, role-specific interview questions.
          </p>
        </div>

        {/* Form */}
        <form action="">
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Customer Success Manager" />
          <button type="submit">Generate</button>
        </form>

      </div>
    </main>
  );
}
