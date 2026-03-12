export default function IngredientsTable({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <p className="text-white/40 text-sm italic">No ingredient data available.</p>
    );
  }

  const getSafetyColor = (note) => {
    if (!note) return "text-white/60";
    const lower = note.toLowerCase();
    if (lower.includes("safe") || lower.includes("beneficial") || lower.includes("approved")) return "text-green-400";
    if (lower.includes("caution") || lower.includes("limited") || lower.includes("moderate") || lower.includes("may")) return "text-yellow-400";
    if (lower.includes("harmful") || lower.includes("toxic") || lower.includes("banned") || lower.includes("danger") || lower.includes("risk")) return "text-red-400";
    return "text-white/70";
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="text-left px-4 py-3 text-white/60 font-semibold uppercase tracking-wider text-xs">Ingredient</th>
            <th className="text-left px-4 py-3 text-white/60 font-semibold uppercase tracking-wider text-xs">Safety Note</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing, i) => (
            <tr
              key={i}
              className={`border-b border-white/5 hover:bg-white/5 transition ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
            >
              <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{ing.name}</td>
              <td className={`px-4 py-3 leading-relaxed ${getSafetyColor(ing.safetyNote)}`}>{ing.safetyNote || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
