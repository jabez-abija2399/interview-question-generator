export interface InterviewQuestion {
    question: string;
    rationale: string;
}

export interface ApiResponse {
    questions: InterviewQuestion[];
}