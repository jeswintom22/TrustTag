import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Please enter a product name.");
      return;
    }
    setError("");
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. Children's Mineral Sunscreen SPF 50"
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition disabled:opacity-50"
          aria-label="Product name"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl font-semibold text-base bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[130px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              Analyze
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-sm font-medium" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
