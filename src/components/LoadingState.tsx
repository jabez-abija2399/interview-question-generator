interface LoadingStateProps {
  jobTitle: string;
}

export function LoadingState({ jobTitle }: LoadingStateProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 py-8 text-gray-500">
      <div className="h-5 w-5 border-2 border-blue-500 
        border-t-transparent rounded-full animate-spin" />
      <span>
        Generating questions for <strong>{jobTitle}</strong>...
      </span>
    </div>
  );
}