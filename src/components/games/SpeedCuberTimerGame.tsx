import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ============================================================
// TYPES
// ============================================================

interface SolveTime {
  id: string;
  ms: number;
  scramble: string;
  timestamp: number;
  dnf?: boolean;
  plus2?: boolean;
}

type TimerState = "idle" | "holding" | "armed" | "running" | "stopped";

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = "speedcuber_times";
const HOLD_DURATION_MS = 500;

const MOVES_BY_FACE: Record<string, string[]> = {
  U: ["U", "U'", "U2"],
  D: ["D", "D'", "D2"],
  L: ["L", "L'", "L2"],
  R: ["R", "R'", "R2"],
  F: ["F", "F'", "F2"],
  B: ["B", "B'", "B2"],
};

const ALL_FACES = ["U", "D", "L", "R", "F", "B"];

// ============================================================
// SCRAMBLE GENERATOR
// ============================================================

function generateScramble(length = 20): string {
  const moves: string[] = [];
  let lastFace = "";
  let secondLastFace = "";

  while (moves.length < length) {
    const availableFaces = ALL_FACES.filter(f => {
      if (f === lastFace) return false;
      // Avoid opposite face repeated (U/D, L/R, F/B)
      const opposites: Record<string, string> = { U: "D", D: "U", L: "R", R: "L", F: "B", B: "F" };
      if (f === secondLastFace && opposites[f] === lastFace) return false;
      return true;
    });

    const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
    const faceMovesArr = MOVES_BY_FACE[face];
    const move = faceMovesArr[Math.floor(Math.random() * faceMovesArr.length)];
    moves.push(move);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves.join(" ");
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function msToDisplay(ms: number): string {
  if (ms < 0) return "0.000";
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
  }
  return `${seconds}.${String(millis).padStart(3, "0")}`;
}

function effectiveMs(t: SolveTime): number {
  if (t.dnf) return Infinity;
  return t.ms + (t.plus2 ? 2000 : 0);
}

function effectiveDisplay(t: SolveTime): string {
  if (t.dnf) return "DNF";
  const ms = t.ms + (t.plus2 ? 2000 : 0);
  return msToDisplay(ms) + (t.plus2 ? "+" : "");
}

function calcAvg(times: SolveTime[], n: number): string {
  if (times.length < n) return "-";
  const last = times.slice(-n);
  // Trim best and worst for ao5/ao12
  if (n >= 5) {
    const sorted = [...last].sort((a, b) => effectiveMs(a) - effectiveMs(b));
    const trimmed = sorted.slice(1, sorted.length - 1);
    if (trimmed.some(t => t.dnf)) return "DNF";
    const avg = trimmed.reduce((sum, t) => sum + effectiveMs(t), 0) / trimmed.length;
    return msToDisplay(avg);
  }
  if (last.some(t => t.dnf)) return "DNF";
  const avg = last.reduce((sum, t) => sum + effectiveMs(t), 0) / last.length;
  return msToDisplay(avg);
}

function loadTimes(): SolveTime[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SolveTime[];
  } catch {
    return [];
  }
}

function saveTimes(times: SolveTime[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(times));
  } catch { /* ignore */ }
}

// ============================================================
// STAT DISPLAY COMPONENT
// ============================================================

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded-xl px-4 py-3 text-center min-w-[80px]">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
      <div className="text-lg font-extrabold font-mono text-white">{value}</div>
    </div>
  );
}

// ============================================================
// MAIN SPEEDCUBER TIMER COMPONENT
// ============================================================

function SpeedCuberTimer() {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [scramble, setScramble] = useState(() => generateScramble());
  const [times, setTimes] = useState<SolveTime[]>(loadTimes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const currentScrambleRef = useRef(scramble);

  useEffect(() => {
    currentScrambleRef.current = scramble;
  }, [scramble]);

  // RAF loop for running timer
  useEffect(() => {
    if (timerState === "running") {
      const tick = () => {
        setElapsedMs(performance.now() - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [timerState]);

  const armTimer = useCallback(() => {
    setTimerState("armed");
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  }, []);

  const startHolding = useCallback(() => {
    if (timerState === "idle" || timerState === "stopped") {
      setTimerState("holding");
      holdTimerRef.current = setTimeout(() => {
        armTimer();
      }, HOLD_DURATION_MS);
    } else if (timerState === "running") {
      // Stop timer
      cancelAnimationFrame(rafRef.current);
      const finalMs = performance.now() - startTimeRef.current;
      setElapsedMs(finalMs);
      setTimerState("stopped");

      const newTime: SolveTime = {
        id: `${Date.now()}-${Math.random()}`,
        ms: Math.round(finalMs),
        scramble: currentScrambleRef.current,
        timestamp: Date.now(),
      };

      setTimes(prev => {
        const updated = [...prev, newTime];
        saveTimes(updated);
        return updated;
      });

      setScramble(generateScramble());
    }
  }, [timerState, armTimer]);

  const stopHolding = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (timerState === "holding") {
      setTimerState("idle");
    } else if (timerState === "armed") {
      // Start running
      startTimeRef.current = performance.now();
      setElapsedMs(0);
      setTimerState("running");
    }
  }, [timerState]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        startHolding();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        stopHolding();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startHolding, stopHolding]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startHolding();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopHolding();
  };

  const deleteTime = (id: string) => {
    setTimes(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTimes(updated);
      return updated;
    });
    setShowDeleteConfirm(null);
  };

  const clearAllTimes = () => {
    setTimes([]);
    saveTimes([]);
    setShowDeleteConfirm(null);
  };

  const toggleDNF = (id: string) => {
    setTimes(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, dnf: !t.dnf, plus2: false } : t
      );
      saveTimes(updated);
      return updated;
    });
  };

  const togglePlus2 = (id: string) => {
    setTimes(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, plus2: !t.plus2, dnf: false } : t
      );
      saveTimes(updated);
      return updated;
    });
  };

  // Derived stats
  const validTimes = times.filter(t => !t.dnf);
  const bestTime = validTimes.length > 0
    ? validTimes.reduce((best, t) => effectiveMs(t) < effectiveMs(best) ? t : best)
    : null;
  const worstTime = validTimes.length > 0
    ? validTimes.reduce((worst, t) => effectiveMs(t) > effectiveMs(worst) ? t : worst)
    : null;

  const ao5 = calcAvg(times, 5);
  const ao12 = calcAvg(times, 12);

  // Timer display color
  let timerColor = "text-white";
  if (timerState === "holding") timerColor = "text-red-400";
  if (timerState === "armed") timerColor = "text-yellow-400";
  if (timerState === "running") timerColor = "text-green-400";

  const displayTime = timerState === "idle" && times.length > 0
    ? effectiveDisplay(times[times.length - 1])
    : msToDisplay(elapsedMs);

  return (
    <div className="bg-slate-950 rounded-2xl text-white min-h-[500px] flex flex-col">
      {/* Scramble */}
      <div className="p-4 md:p-6 border-b border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Scramble
            </div>
            <div className="font-mono text-base md:text-lg text-slate-100 leading-relaxed break-all">
              {scramble}
            </div>
          </div>
          <button
            onClick={() => setScramble(generateScramble())}
            className="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            title="New scramble"
          >
            New
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer py-10 px-4"
        onMouseDown={() => startHolding()}
        onMouseUp={() => stopHolding()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        <div className={`font-mono font-black text-center transition-colors duration-150 ${timerColor}`}
          style={{ fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 1 }}
        >
          {displayTime}
        </div>

        <div className="mt-6 text-slate-500 text-sm text-center">
          {timerState === "idle" && (
            <span>Hold <kbd className="bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 font-mono text-xs">Space</kbd> or press &amp; hold screen to start</span>
          )}
          {timerState === "holding" && (
            <span className="text-red-400 font-semibold">Keep holding...</span>
          )}
          {timerState === "armed" && (
            <span className="text-yellow-400 font-bold">Release to start!</span>
          )}
          {timerState === "running" && (
            <span className="text-green-400">Press Space or tap to stop</span>
          )}
          {timerState === "stopped" && (
            <span className="text-slate-400">Hold Space or press &amp; hold to start next solve</span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 md:px-6 pb-4">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <StatBox label="Best" value={bestTime ? effectiveDisplay(bestTime) : "-"} />
          <StatBox label="Worst" value={worstTime ? effectiveDisplay(worstTime) : "-"} />
          <StatBox label="Ao5" value={ao5} />
          <StatBox label="Ao12" value={ao12} />
          <StatBox label="Count" value={String(times.length)} />
        </div>
      </div>

      {/* Times List */}
      {times.length > 0 && (
        <div className="border-t border-slate-800 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Session Times
            </h3>
            {showDeleteConfirm === "all" ? (
              <div className="flex gap-2">
                <button
                  onClick={clearAllTimes}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-3 py-1 font-bold"
                >
                  Confirm Clear All
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm("all")}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {[...times].reverse().map((t, idx) => {
              const num = times.length - idx;
              const isShowingConfirm = showDeleteConfirm === t.id;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 text-sm group"
                >
                  <span className="text-slate-600 w-7 text-right font-mono text-xs flex-shrink-0">
                    {num}.
                  </span>
                  <span className={`font-mono font-bold flex-1 ${t.dnf ? "text-red-400" : t.plus2 ? "text-yellow-400" : "text-white"}`}>
                    {effectiveDisplay(t)}
                  </span>

                  {/* Penalty buttons */}
                  <button
                    onClick={() => togglePlus2(t.id)}
                    className={`text-xs px-1.5 py-0.5 rounded font-bold transition-colors ${
                      t.plus2 ? "bg-yellow-600 text-white" : "bg-slate-700 text-slate-400 hover:text-yellow-400"
                    }`}
                    title="+2 penalty"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => toggleDNF(t.id)}
                    className={`text-xs px-1.5 py-0.5 rounded font-bold transition-colors ${
                      t.dnf ? "bg-red-700 text-white" : "bg-slate-700 text-slate-400 hover:text-red-400"
                    }`}
                    title="DNF"
                  >
                    DNF
                  </button>

                  {/* Delete */}
                  {isShowingConfirm ? (
                    <>
                      <button
                        onClick={() => deleteTime(t.id)}
                        className="text-xs bg-red-700 hover:bg-red-600 text-white rounded px-2 py-0.5 font-bold"
                      >
                        Del
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="text-xs text-slate-500 hover:text-slate-300"
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(t.id)}
                      className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete this time"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="m19 6-.867 14.142A2 2 0 0 1 16.138 22H7.862a2 2 0 0 1-1.995-1.858L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  )}

                  {/* Scramble tooltip indicator */}
                  <span
                    className="text-slate-700 hover:text-slate-400 cursor-help flex-shrink-0"
                    title={`Scramble: ${t.scramble}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE EXPORT
// ============================================================

export default function SpeedCuberTimerGame() {
  return (
    <CalculatorVerticalLayout
      title="Speed Cuber Timer"
      description="Free online Rubik's Cube speedsolving timer with WCA-style scrambles, ao5, ao12 averages, DNF and +2 penalty support. Track your session times and beat your personal best."
      canonical="https://www.smartkitnow.com/games/speed-cuber-timer"
      widget={<SpeedCuberTimer />}
      editorial={
        <div>
          <h2>How to Use the Speed Cuber Timer</h2>
          <p>
            This timer is designed for speedcubers who want to practice and track their
            solve times. It generates WCA-style random-state scrambles and records your
            session history with full average statistics.
          </p>

          <h3>Starting a Solve</h3>
          <ol>
            <li>
              A random 20-move scramble is displayed at the top. Apply it to your cube.
            </li>
            <li>
              Press and <strong>hold the Spacebar</strong> (or press and hold the timer
              area on mobile). The display turns red while you hold.
            </li>
            <li>
              After 0.5 seconds the display turns <strong>yellow</strong>, indicating the
              timer is armed and ready.
            </li>
            <li>
              <strong>Release</strong> the key or finger. The timer starts immediately and
              turns green.
            </li>
            <li>
              Press <strong>Space again</strong> (or tap) to stop the timer and record
              your solve.
            </li>
          </ol>

          <h3>Penalties</h3>
          <ul>
            <li>
              <strong>+2</strong>: Add a 2-second penalty to the solve. Click the +2
              button next to any time in the session list.
            </li>
            <li>
              <strong>DNF</strong> (Did Not Finish): Mark the solve as invalid. DNF times
              are excluded from averages.
            </li>
          </ul>

          <h3>Statistics Explained</h3>
          <ul>
            <li>
              <strong>Ao5</strong> (Average of 5): The mean of your last 5 solves after
              removing the best and worst time.
            </li>
            <li>
              <strong>Ao12</strong> (Average of 12): The mean of your last 12 solves after
              removing the best and worst time.
            </li>
            <li>
              <strong>Best / Worst</strong>: Your fastest and slowest non-DNF solve in the
              current session.
            </li>
          </ul>

          <h3>Scramble Notation</h3>
          <p>
            Moves use standard WCA notation: <strong>U, D, L, R, F, B</strong> for the
            six faces. A plain letter means a 90° clockwise turn, an apostrophe (') means
            counter-clockwise, and 2 means a 180° turn. No same-face consecutive moves or
            redundant opposite-face sequences are generated.
          </p>

          <h3>Data Storage</h3>
          <p>
            All session times are saved to your browser's localStorage under the key{" "}
            <code>speedcuber_times</code>. They persist across page reloads. You can clear
            all times using the "Clear All" button in the session list.
          </p>
        </div>
      }
      contentMaxWidth="max-w-3xl"
      hideLegalDisclaimer={true}
    />
  );
}
