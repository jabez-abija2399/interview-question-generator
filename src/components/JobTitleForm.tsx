"use client";

interface JobTitleFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function JobTitleForm({
  value,
  onChange,
  onSubmit,
  loading,
}: JobTitleFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3 mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Customer Success Manager"
        disabled={loading}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
        text-gray-900 placeholder-gray-400 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 bg-white"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-3 bg-blue-600 text-white font-semibold 
        rounded-lg hover:bg-blue-700 disabled:opacity-50 
        disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}