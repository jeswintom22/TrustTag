export default function SafetyBadge({ score }) {
  const getColor = (s) => {
    if (s >= 7) return "bg-green-600 text-white";
    if (s >= 4) return "bg-yellow-400 text-gray-900";
    return "bg-red-600 text-white";
  };

  const getLabel = (s) => {
    if (s >= 7) return "Safe";
    if (s >= 4) return "Moderate";
    return "Unsafe";
  };

  const getBarColor = (s) => {
    if (s >= 7) return "bg-green-500";
    if (s >= 4) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-lg shadow-lg ${getColor(score)}`}
      >
        <span className="text-2xl font-black">{score}</span>
        <span className="text-sm font-semibold uppercase tracking-wider">/10 — {getLabel(score)}</span>
      </div>
      <div className="w-48 bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(score)}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
