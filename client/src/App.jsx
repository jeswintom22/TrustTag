import { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ReportCard from "./components/ReportCard";

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (productName) => {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await axios.post("/api/analyze", {
        productName,
      });
      setReport(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D1B2A]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="font-black text-white text-base sm:text-lg leading-tight">Label Compliance Checker</h1>
            <p className="text-white/40 text-xs">Real-Time Product Safety Intelligence</p>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Powered by Claude AI + Live Web Search</p>
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
          Is Your Product <span className="text-teal-400">Actually Safe?</span>
        </h2>
        <p className="text-white/50 text-base max-w-xl mx-auto mb-8">
          Enter any food, pharmaceutical, or cosmetic product to get an instant AI-generated safety report with real-time web scouting.
        </p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
          </div>
          <p className="text-white/60 text-sm animate-pulse">Scouting the web and analyzing ingredients…</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-300 font-semibold text-sm">Analysis Failed</p>
              <p className="text-red-400/80 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report */}
      {report && !loading && (
        <main className="max-w-5xl mx-auto px-4 pb-16">
          <ReportCard report={report} />
        </main>
      )}

      {/* Empty state hint */}
      {!report && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Search for a product to see its safety report here</p>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-5xl mx-auto px-4 py-5 text-center">
          <p className="text-white/25 text-xs">
            Reports are AI-generated using real-time web data. Always consult a healthcare professional before making medical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
