import SafetyBadge from "./SafetyBadge";
import ProsConsPanel from "./ProsConsPanel";
import IngredientsTable from "./IngredientsTable";

function Section({ title, icon, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <span className="text-teal-400">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ReportCard({ report }) {
  const getRegulatoryBg = (status) => {
    if (!status) return "bg-gray-700/50 border-gray-600";
    const lower = status.toLowerCase();
    if (lower.includes("approved") || lower.includes("compliant") || lower.includes("safe")) return "bg-green-900/40 border-green-600";
    if (lower.includes("Under Review") || lower.includes("restricted") || lower.includes("warning")) return "bg-yellow-900/40 border-yellow-600";
    if (lower.includes("banned") || lower.includes("recalled") || lower.includes("prohibited")) return "bg-red-900/40 border-red-600";
    return "bg-blue-900/30 border-blue-600";
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
        <div>
          <h1 className="text-white font-black text-2xl sm:text-3xl">{report.product}</h1>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-teal-900/60 text-teal-300 border border-teal-700/40">
            {report.category}
          </span>
        </div>
        <SafetyBadge score={report.overallSafetyScore} />
      </div>

      {/* Regulatory Status Banner */}
      <div className={`rounded-2xl border p-4 flex items-start gap-3 ${getRegulatoryBg(report.regulatoryStatus)}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-0.5">Regulatory Status</p>
          <p className="text-white text-sm leading-relaxed">{report.regulatoryStatus || "Not available."}</p>
        </div>
      </div>

      {/* Pros & Cons */}
      <Section title="Pros & Cons Analysis" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      }>
        <ProsConsPanel pros={report.pros} cons={report.cons} />
      </Section>

      {/* Key Ingredients */}
      <Section title="Key Ingredients" icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      }>
        <IngredientsTable ingredients={report.keyIngredients} />
      </Section>

      {/* Recommendation */}
      <div className="bg-gradient-to-r from-teal-900/40 to-blue-900/30 border border-teal-700/40 rounded-2xl p-5">
        <h2 className="text-teal-300 font-bold text-base uppercase tracking-wider mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Final Recommendation
        </h2>
        <p className="text-white/90 text-sm leading-relaxed">{report.recommendation || "No recommendation provided."}</p>
      </div>
    </div>
  );
}
