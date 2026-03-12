function ProsCard({ item }) {
  return (
    <div className="flex gap-3 bg-green-900/30 border border-green-700/40 rounded-xl p-4 hover:bg-green-900/50 transition">
      <div className="flex-shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-white text-sm leading-relaxed">{item.point}</p>
        {item.source && (
          <p className="text-green-400/70 text-xs mt-1 font-medium">Source: {item.source}</p>
        )}
      </div>
    </div>
  );
}

function ConsCard({ item }) {
  return (
    <div className="flex gap-3 bg-red-900/30 border border-red-700/40 rounded-xl p-4 hover:bg-red-900/50 transition">
      <div className="flex-shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-white text-sm leading-relaxed">{item.point}</p>
        {item.source && (
          <p className="text-red-400/70 text-xs mt-1 font-medium">Source: {item.source}</p>
        )}
      </div>
    </div>
  );
}

export default function ProsConsPanel({ pros, cons }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-green-400 font-bold text-base uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          Pros ({pros?.length || 0})
        </h3>
        <div className="flex flex-col gap-3">
          {pros && pros.length > 0 ? (
            pros.map((item, i) => <ProsCard key={i} item={item} />)
          ) : (
            <p className="text-white/40 text-sm italic">No pros listed.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-red-400 font-bold text-base uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
          Cons ({cons?.length || 0})
        </h3>
        <div className="flex flex-col gap-3">
          {cons && cons.length > 0 ? (
            cons.map((item, i) => <ConsCard key={i} item={item} />)
          ) : (
            <p className="text-white/40 text-sm italic">No cons listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
