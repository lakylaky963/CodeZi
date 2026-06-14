import { useCallback, useEffect, useRef, useState } from "react";
import { createUser, getUser, getUsers, updateUser } from "../api/user";
import Icon from "../components/Icon.jsx";
import Toast from "../components/Toast.jsx";
import RunnerCanvas from "../components/game/RunnerCanvas.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { formatScoreProfile, getScoreUsers } from "../utils/scoreboard.js";

export default function Game() {
  const { theme } = useTheme();
  const runningRef = useRef(false);
  const savedRoundRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [scoreboard, setScoreboard] = useState([]);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingScores, setIsLoadingScores] = useState(true);

  const refreshScoreboard = useCallback(async () => {
    setIsLoadingScores(true);
    try {
      const { data } = await getUsers();
      setScoreboard(getScoreUsers(data?.users || []).slice(0, 10));
    } catch {
      setToast({ type: "error", message: "Could not load the live scoreboard." });
    } finally {
      setIsLoadingScores(false);
    }
  }, []);

  useEffect(() => {
    refreshScoreboard();
  }, [refreshScoreboard]);

  const startGame = useCallback(() => {
    setResetKey((value) => value + 1);
    runningRef.current = true;
    savedRoundRef.current = false;
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setToast(null);
  }, []);

  const handleGameOver = useCallback((finalScore) => {
    setScore(finalScore);
    setGameOver(true);
    setIsPlaying(false);
    runningRef.current = false;
  }, []);

  const saveScore = useCallback(async () => {
    const name = playerName.trim() || "StudioPlayer";
    const payload = { firstName: name, lastName: formatScoreProfile(score) };
    setIsSaving(true);

    try {
      const existing = await getUser({ id: name }).catch(() => null);

      if (existing?.data?.user?._id) {
        const current = getScoreUsers([existing.data.user])[0];
        if (!current || score >= current.score) {
          await updateUser({ id: existing.data.user._id, ...payload });
        }
      } else {
        await createUser(payload);
      }

      await refreshScoreboard();
      setToast({ type: "success", message: `Score saved for ${name}.` });
    } catch {
      setToast({ type: "error", message: "Score could not be saved. Check the backend connection." });
    } finally {
      setIsSaving(false);
    }
  }, [playerName, refreshScoreboard, score]);

  useEffect(() => {
    if (gameOver && !savedRoundRef.current) {
      savedRoundRef.current = true;
      saveScore();
    }
  }, [gameOver, saveScore]);

  useEffect(() => {
    const handler = (event) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (!runningRef.current && !gameOver) startGame();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameOver, startGame]);

  return (
    <section className="space-y-8">
      <Toast toast={toast} />

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
            <Icon name="game" size={15} />
            Live Score Mode
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Runner
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Jump incoming obstacles. Finished runs are saved through the existing user API without changing the MongoDB schema.
          </p>
        </div>

        <button
          type="button"
          onClick={startGame}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:translate-y-0"
        >
          <Icon name={isPlaying ? "refresh" : "spark"} size={18} />
          {isPlaying ? "Restart Run" : "Start Run"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(180px,260px)_1fr_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Player name
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="StudioPlayer"
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Distance", `${score} m`],
                ["Status", isPlaying ? "Running" : gameOver ? "Crashed" : "Ready"],
                ["Save", isSaving ? "Saving" : "Auto"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <RunnerCanvas
              isDark={theme === "dark"}
              running={isPlaying}
              resetKey={resetKey}
              onGameOver={handleGameOver}
            />

            {!isPlaying && !gameOver ? (
              <div className="absolute inset-0 grid place-items-center bg-white/80 p-6 text-center backdrop-blur-sm dark:bg-slate-950/78">
                <div>
                  <button
                    type="button"
                    onClick={startGame}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:translate-y-0"
                  >
                    <Icon name="spark" size={18} />
                    Start Run
                  </button>
                  <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Press Space, ArrowUp, or tap the track to jump.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {gameOver ? (
            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100 sm:flex-row sm:items-center sm:justify-between">
              <strong>You crashed at {score} m.</strong>
              <span className="text-sm font-semibold">{isSaving ? "Saving score..." : "Score saved when eligible."}</span>
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Live Scoreboard</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Read from MongoDB user records.</p>
            </div>
            <button
              type="button"
              onClick={refreshScoreboard}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-95 dark:border-slate-800 dark:text-slate-300"
              aria-label="Refresh scoreboard"
            >
              <Icon name="refresh" size={17} />
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingScores ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))
            ) : scoreboard.length ? (
              scoreboard.map((entry, index) => (
                <div
                  key={entry.id || `${entry.name}-${index}`}
                  className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-black text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950 dark:text-white">{entry.name}</p>
                    <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {entry.playedAt ? new Date(entry.playedAt).toLocaleString() : "Recent run"}
                    </p>
                  </div>
                  <strong className="text-slate-950 dark:text-white">{entry.score}</strong>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <Icon name="database" className="mx-auto text-slate-400" size={26} />
                <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No saved scores yet. Play a round to seed the board.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
