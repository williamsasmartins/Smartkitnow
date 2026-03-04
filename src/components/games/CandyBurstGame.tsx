import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const GRID_SIZE = 8;
const CANDY_TYPES = 6;
const TIMER_DURATION = 30;
const HS_KEY = "hs_candy-burst";

type CandyType = 0 | 1 | 2 | 3 | 4 | 5;
type SpecialType = "none" | "striped-h" | "striped-v" | "bomb" | "wrapped";

interface Candy {
  type: CandyType;
  special: SpecialType;
  id: number;
}

type Board = (Candy | null)[][];
type GameMode = "timer" | "unlimited";
type Phase = "idle" | "playing" | "gameover";

const CANDY_COLORS: Record<number, { bg: string; shadow: string; label: string }> = {
  0: { bg: "#ef4444", shadow: "#991b1b", label: "Red" },
  1: { bg: "#f97316", shadow: "#9a3412", label: "Orange" },
  2: { bg: "#eab308", shadow: "#854d0e", label: "Yellow" },
  3: { bg: "#22c55e", shadow: "#14532d", label: "Green" },
  4: { bg: "#3b82f6", shadow: "#1e3a8a", label: "Blue" },
  5: { bg: "#a855f7", shadow: "#581c87", label: "Purple" },
};

let candyIdCounter = 1;
function makeCandy(type: CandyType, special: SpecialType = "none"): Candy {
  return { type, special, id: candyIdCounter++ };
}
function randomCandy(): Candy {
  return makeCandy((Math.floor(Math.random() * CANDY_TYPES) as CandyType));
}

function createBoard(): Board {
  const board: Board = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => randomCandy())
  );
  // ensure no initial matches
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let attempts = 0;
      while (attempts < 20) {
        const cell = board[r][c];
        if (!cell) break;
        const leftMatch =
          c >= 2 &&
          board[r][c - 1]?.type === cell.type &&
          board[r][c - 2]?.type === cell.type;
        const topMatch =
          r >= 2 &&
          board[r - 1][c]?.type === cell.type &&
          board[r - 2][c]?.type === cell.type;
        if (!leftMatch && !topMatch) break;
        board[r][c] = randomCandy();
        attempts++;
      }
    }
  }
  return board;
}

function cloneBoard(b: Board): Board {
  return b.map((row) => row.map((c) => (c ? { ...c } : null)));
}

// ─── Match Finding ─────────────────────────────────────────────────────────
interface Match {
  cells: [number, number][];
  type: "row" | "col" | "L" | "T";
  length: number;
}

function findMatches(board: Board): Match[] {
  const matched: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(false)
  );
  const matches: Match[] = [];

  // Horizontal
  for (let r = 0; r < GRID_SIZE; r++) {
    let c = 0;
    while (c < GRID_SIZE) {
      const cell = board[r][c];
      if (!cell) { c++; continue; }
      let end = c + 1;
      while (end < GRID_SIZE && board[r][end]?.type === cell.type) end++;
      if (end - c >= 3) {
        const cells: [number, number][] = [];
        for (let i = c; i < end; i++) cells.push([r, i]);
        matches.push({ cells, type: "row", length: end - c });
        for (let i = c; i < end; i++) matched[r][i] = true;
      }
      c = end;
    }
  }

  // Vertical
  for (let c = 0; c < GRID_SIZE; c++) {
    let r = 0;
    while (r < GRID_SIZE) {
      const cell = board[r][c];
      if (!cell) { r++; continue; }
      let end = r + 1;
      while (end < GRID_SIZE && board[end][c]?.type === cell.type) end++;
      if (end - r >= 3) {
        const cells: [number, number][] = [];
        for (let i = r; i < end; i++) cells.push([i, c]);
        matches.push({ cells, type: "col", length: end - r });
        for (let i = r; i < end; i++) matched[i][c] = true;
      }
      r = end;
    }
  }

  return matches;
}

function getSpecialForMatch(m: Match): SpecialType {
  if (m.length >= 5) return "bomb";
  if (m.length === 4 && m.type === "row") return "striped-h";
  if (m.length === 4 && m.type === "col") return "striped-v";
  return "none";
}

// ─── Board Processing ──────────────────────────────────────────────────────
function applyGravity(board: Board): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < GRID_SIZE; c++) {
    const col: (Candy | null)[] = [];
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (next[r][c] !== null) col.push(next[r][c]);
    }
    while (col.length < GRID_SIZE) col.push(randomCandy());
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      next[r][c] = col[GRID_SIZE - 1 - r];
    }
  }
  return next;
}

function clearMatches(board: Board, matches: Match[]): { board: Board; points: number } {
  const next = cloneBoard(board);
  let points = 0;
  const toExplode = new Set<string>();

  matches.forEach((m) => {
    m.cells.forEach(([r, c]) => {
      const cell = next[r][c];
      if (!cell) return;
      // Handle special candy effects
      if (cell.special === "striped-h") {
        for (let cc = 0; cc < GRID_SIZE; cc++) toExplode.add(`${r},${cc}`);
      } else if (cell.special === "striped-v") {
        for (let rr = 0; rr < GRID_SIZE; rr++) toExplode.add(`${rr},${c}`);
      } else if (cell.special === "bomb") {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr; const nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE)
              toExplode.add(`${nr},${nc}`);
          }
      }
      toExplode.add(`${r},${c}`);
    });
    points += m.length * 10 * (m.length - 2);
  });

  toExplode.forEach((key) => {
    const [r, c] = key.split(",").map(Number);
    next[r][c] = null;
  });

  return { board: next, points };
}

// ─── Game Board Component ──────────────────────────────────────────────────
function CandyBurstBoard() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem(HS_KEY) || "0", 10); } catch { return 0; }
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<GameMode>("unlimited");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [cascade, setCascade] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cascadeRef = useRef(0);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try { localStorage.setItem(HS_KEY, String(score)); } catch {}
    }
  }, [score, highScore]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || mode !== "timer") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, mode]);

  // Process matches cascading
  const processBoard = useCallback(async (b: Board, cascadeLevel: number) => {
    const matches = findMatches(b);
    if (matches.length === 0) {
      setBoard(b);
      setAnimating(false);
      cascadeRef.current = 0;
      setCascade(0);
      return;
    }

    // Flash matched cells
    const flashSet = new Set<string>();
    matches.forEach((m) => m.cells.forEach(([r, c]) => flashSet.add(`${r},${c}`)));
    setFlashCells(flashSet);

    await new Promise((res) => setTimeout(res, 300));
    setFlashCells(new Set());

    // Create specials for 4+ matches
    const newBoard = cloneBoard(b);
    matches.forEach((m) => {
      const special = getSpecialForMatch(m);
      if (special !== "none") {
        const [r, c] = m.cells[Math.floor(m.cells.length / 2)];
        const cell = newBoard[r][c];
        if (cell) newBoard[r][c] = { ...cell, special };
      }
    });

    const { board: cleared, points } = clearMatches(newBoard, matches);
    const multiplier = cascadeLevel + 1;
    setScore((s) => s + points * multiplier);
    setCascade(cascadeLevel);

    await new Promise((res) => setTimeout(res, 150));
    const gravityBoard = applyGravity(cleared);
    setBoard(gravityBoard);
    await new Promise((res) => setTimeout(res, 250));
    processBoard(gravityBoard, cascadeLevel + 1);
  }, []);

  function startGame() {
    const newBoard = createBoard();
    setBoard(newBoard);
    setScore(0);
    setSelected(null);
    setTimeLeft(TIMER_DURATION);
    setCascade(0);
    setFlashCells(new Set());
    setAnimating(false);
    setPhase("playing");
  }

  function handleCellClick(r: number, c: number) {
    if (phase !== "playing" || animating) return;
    if (!selected) {
      setSelected([r, c]);
      return;
    }
    const [sr, sc] = selected;
    if (sr === r && sc === c) { setSelected(null); return; }

    const isAdjacent =
      (Math.abs(sr - r) === 1 && sc === c) || (Math.abs(sc - c) === 1 && sr === r);

    if (!isAdjacent) { setSelected([r, c]); return; }

    // Swap
    setSelected(null);
    setAnimating(true);
    const newBoard = cloneBoard(board);
    const tmp = newBoard[sr][sc];
    newBoard[sr][sc] = newBoard[r][c];
    newBoard[r][c] = tmp;

    const matches = findMatches(newBoard);
    if (matches.length === 0) {
      // Revert swap
      setAnimating(false);
      setBoard(board);
      return;
    }
    processBoard(newBoard, 0);
  }

  const cellSize = "min(11vw, 52px)";

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm px-2">
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Best</div>
          <div className="text-2xl font-black text-amber-500">{highScore}</div>
        </div>
        {mode === "timer" && (
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Time</div>
            <div className={`text-2xl font-black ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-slate-700 dark:text-slate-200"}`}>{timeLeft}s</div>
          </div>
        )}
        {cascade > 1 && (
          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Chain</div>
            <div className="text-2xl font-black text-pink-500">x{cascade}</div>
          </div>
        )}
      </div>

      {/* Mode selector (idle only) */}
      {phase === "idle" && (
        <div className="flex gap-3">
          <button
            onClick={() => setMode("unlimited")}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${mode === "unlimited" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
          >Unlimited</button>
          <button
            onClick={() => setMode("timer")}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${mode === "timer" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
          >30s Timer</button>
        </div>
      )}

      {/* Grid */}
      <div
        className="relative bg-indigo-900/80 rounded-2xl p-2 shadow-2xl"
        style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize})`, gap: "3px" }}
      >
        {board.map((row, r) =>
          row.map((candy, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isFlash = flashCells.has(`${r},${c}`);
            const color = candy ? CANDY_COLORS[candy.type] : null;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{ width: cellSize, height: cellSize }}
                className={`relative rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-center
                  ${isSelected ? "scale-110 z-10" : ""}
                  ${isFlash ? "brightness-150 scale-95" : ""}
                  ${!candy ? "bg-indigo-950/50" : ""}
                `}
              >
                {candy && color && (
                  <div
                    className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${color.bg}ee, ${color.shadow})`,
                      boxShadow: isSelected
                        ? `0 0 0 3px white, 0 0 12px ${color.bg}`
                        : `inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.4)`,
                    }}
                  >
                    {/* Shine */}
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/40" />
                    {/* Special indicator */}
                    {candy.special === "striped-h" && (
                      <div className="absolute inset-0 flex flex-col justify-center gap-0.5 px-0.5">
                        <div className="h-0.5 bg-white/60 rounded" />
                        <div className="h-0.5 bg-white/60 rounded" />
                      </div>
                    )}
                    {candy.special === "striped-v" && (
                      <div className="absolute inset-0 flex flex-row justify-center gap-0.5 py-0.5">
                        <div className="w-0.5 bg-white/60 rounded" />
                        <div className="w-0.5 bg-white/60 rounded" />
                      </div>
                    )}
                    {candy.special === "bomb" && (
                      <span className="text-white font-black text-xs z-10">★</span>
                    )}
                    {candy.special === "wrapped" && (
                      <div className="absolute inset-1 rounded border-2 border-white/60" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        {/* Overlay for idle/gameover */}
        {phase !== "playing" && (
          <div className="absolute inset-0 rounded-2xl bg-black/70 flex flex-col items-center justify-center z-20 gap-4">
            {phase === "gameover" && (
              <div className="text-white text-2xl font-black mb-2">
                {mode === "timer" ? "Time's Up!" : "Game Over"}
              </div>
            )}
            {phase === "idle" && (
              <div className="text-white text-3xl font-black">Candy Burst</div>
            )}
            <button
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-lg transition-all hover:scale-105"
            >
              {phase === "gameover" ? "Play Again" : "Play"}
            </button>
            {phase === "gameover" && (
              <div className="text-indigo-200 text-lg font-bold">Score: {score}</div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-2 flex-wrap justify-center mt-1">
        <span className="text-xs text-slate-500 dark:text-slate-400">Match 4 in row = striped</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Match 5 = bomb ★</span>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────
export default function CandyBurstGame() {
  return (
    <CalculatorVerticalLayout
      title="Candy Burst - Free Match-3 Candy Crush Clone Game"
      description="Play Candy Burst, a free match-3 candy game. Swap adjacent candies to match 3 or more, trigger chain reactions, create special candies, and beat your high score!"
      canonical="https://www.smartkitnow.com/games/candy-crush-clone"
      widget={<CandyBurstBoard />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div className="space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">How to Play Candy Burst</h2>
          <p>
            Candy Burst is a classic match-3 puzzle game. Swap adjacent candies to create rows or columns
            of 3 or more matching colors. Matched candies disappear, new ones fall from the top, and chain
            reactions earn bonus multiplier points!
          </p>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Special Candies</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Striped (horizontal)</strong> — Match 4 in a row. Clears the entire row when activated.</li>
            <li><strong>Striped (vertical)</strong> — Match 4 in a column. Clears the entire column when activated.</li>
            <li><strong>Bomb ★</strong> — Match 5 in any direction. Clears a 3×3 area around it when activated.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Game Modes</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Unlimited</strong> — No time limit. Relax and strategize at your own pace.</li>
            <li><strong>30s Timer</strong> — Score as many points as possible before the clock runs out!</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Scoring</h3>
          <p>
            Longer matches score more points. Chain reactions (cascades) multiply your score — the more
            cascades in one move, the bigger the multiplier. Match 3 = 10 pts, match 4 = 40 pts, match 5 = 90 pts.
            Chain multipliers stack up to huge bonuses!
          </p>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tips &amp; Strategy</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Set up chain reactions by planning moves ahead — let gravity do the work.</li>
            <li>Aim for bottom-of-board matches; they cause more cascades as candies fall.</li>
            <li>Special candies created near each other can be swapped to trigger massive combos.</li>
            <li>In Timer Mode, prioritize quick matches over perfection — speed wins!</li>
          </ul>
        </div>
      }
    />
  );
}
