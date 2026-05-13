import { InterviewQuestion } from "@/types";

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="shrink-0 h-7 w-7 bg-blue-100 text-blue-700 
          rounded-full flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <div>
          <p className="font-medium text-gray-900">{question.question}</p>
          {question.rationale && (
            <p className="mt-1 text-sm text-gray-500 italic">
              {question.rationale}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}