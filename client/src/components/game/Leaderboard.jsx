export default function Leaderboard({ entries, loading, error }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        Top 10 High Scores
      </h3>

      {loading && (
        <p className="text-sm text-slate-400">Loading leaderboard...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="text-sm text-slate-400">No scores yet. Be the first!</p>
      )}

      <ol className="space-y-2">
        {entries.map((entry, i) => (
          <li
            key={entry.id || i}
            className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800/60"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center font-bold text-sm ${
                  i === 0
                    ? "text-amber-400"
                    : i === 1
                    ? "text-slate-400"
                    : i === 2
                    ? "text-amber-700"
                    : "text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {entry.name}
              </span>
            </div>
            <span className="font-mono text-sm font-semibold text-indigo-500 dark:text-cyan-400">
              {entry.score} m
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}