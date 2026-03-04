import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Trophy, Play } from "lucide-react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────
type Difficulty = "beginner" | "intermediate" | "expert";
type CellState = "hidden" | "revealed" | "flagged" | "question";
type GamePhase = "setup" | "idle" | "playing" | "won" | "lost";
type FaceState = "normal" | "pressing" | "won" | "lost";

interface Cell {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
}

const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number; label: string }> = {
  beginner: { rows: 9, cols: 9, mines: 10, label: "Beginner" },
  intermediate: { rows: 16, cols: 16, mines: 40, label: "Intermediate" },
  expert: { rows: 16, cols: 30, mines: 99, label: "Expert" },
};

const LS_BEST_KEY = "minesweeper-best";

const NUM_COLORS: Record<number, string> = {
  1: "text-blue-600 dark:text-blue-400",
  2: "text-green-600 dark:text-green-400",
  3: "text-red-600 dark:text-red-400",
  4: "text-navy-700 text-[#000080]",
  5: "text-[#800000]",
  6: "text-teal-600 dark:text-teal-400",
  7: "text-black dark:text-white",
  8: "text-gray-500 dark:text-gray-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// Board Generation
// ─────────────────────────────────────────────────────────────────────────────
function makeEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      state: "hidden" as CellState,
      adjacentMines: 0,
    }))
  );
}

function placeMines(board: Cell[][], rows: number, cols: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const forbidden = new Set<string>();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr, nc = safeC + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
        forbidden.add(`${nr},${nc}`);
    }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;
    if (!newBoard[r][c].isMine && !forbidden.has(key)) {
      newBoard[r][c] = { ...newBoard[r][c], isMine: true };
      placed++;
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine)
            count++;
        }
      newBoard[r][c] = { ...newBoard[r][c], adjacentMines: count };
    }
  }
  return newBoard;
}

function floodReveal(board: Cell[][], rows: number, cols: number, r: number, c: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const queue: [number, number][] = [[r, c]];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (newBoard[cr][cc].state !== "hidden") continue;
    newBoard[cr][cc] = { ...newBoard[cr][cc], state: "revealed" };
    if (newBoard[cr][cc].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`))
            queue.push([nr, nc]);
        }
    }
  }
  return newBoard;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minesweeper Board Component
// ─────────────────────────────────────────────────────────────────────────────
function MinesweeperBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [minesLeft, setMinesLeft] = useState(0);
  const [timer, setTimer] = useState(0);
  const [face, setFace] = useState<FaceState>("normal");
  const [flagMode, setFlagMode] = useState(false); // mobile flag toggle
  const [bestTimes, setBestTimes] = useState<Partial<Record<Difficulty, number>>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_BEST_KEY);
      if (saved) setBestTimes(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveBest = useCallback((diff: Difficulty, t: number) => {
    setBestTimes(prev => {
      const next = { ...prev };
      if (!next[diff] || t < (next[diff] as number)) {
        next[diff] = t;
        try { localStorage.setItem(LS_BEST_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      }
      return next;
    });
  }, []);

  const startGame = useCallback((diff: Difficulty = difficulty) => {
    const { rows, cols, mines } = DIFFICULTIES[diff];
    setDifficulty(diff);
    setBoard(makeEmptyBoard(rows, cols));
    setPhase("idle");
    setMinesLeft(mines);
    setTimer(0);
    setFace("normal");
    setFlagMode(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [difficulty]);

  useEffect(() => { startGame(); }, []); // eslint-disable-line

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleReveal = useCallback((r: number, c: number) => {
    if (phase !== "idle" && phase !== "playing") return;
    if (board[r]?.[c]?.state !== "hidden") {
      // Chord: if revealed and flag count matches adjacentMines, reveal neighbors
      if (board[r]?.[c]?.state === "revealed" && board[r][c].adjacentMines > 0) {
        const { rows, cols } = DIFFICULTIES[difficulty];
        let flagCount = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].state === "flagged")
              flagCount++;
          }
        if (flagCount === board[r][c].adjacentMines) {
          let newBoard = board.map(row => row.map(cell => ({ ...cell })));
          let hitMine = false;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].state === "hidden") {
                if (board[nr][nc].isMine) { hitMine = true; newBoard[nr][nc] = { ...newBoard[nr][nc], state: "revealed" }; }
                else newBoard = floodReveal(newBoard, rows, cols, nr, nc);
              }
            }
          if (hitMine) {
            setBoard(newBoard); setPhase("lost"); setFace("lost"); return;
          }
          setBoard(newBoard);
          const unrevealed = newBoard.flat().filter(cell => cell.state !== "revealed").length;
          const flagged = newBoard.flat().filter(cell => cell.state === "flagged").length;
          if (unrevealed === flagged + DIFFICULTIES[difficulty].mines - flagged) {
            // Check win
            const allNonMineRevealed = newBoard.flat().every(cell => cell.isMine || cell.state === "revealed");
            if (allNonMineRevealed) { setPhase("won"); setFace("won"); saveBest(difficulty, timer); }
          }
        }
      }
      return;
    }

    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    let currentBoard = board;

    // First click: place mines
    if (phase === "idle") {
      currentBoard = placeMines(makeEmptyBoard(rows, cols), rows, cols, mines, r, c);
      setPhase("playing");
    }

    if (currentBoard[r][c].isMine) {
      // Reveal all mines
      const revealedBoard = currentBoard.map(row =>
        row.map(cell => cell.isMine ? { ...cell, state: "revealed" as CellState } : { ...cell })
      );
      setBoard(revealedBoard);
      setPhase("lost");
      setFace("lost");
      return;
    }

    const newBoard = floodReveal(currentBoard, rows, cols, r, c);
    setBoard(newBoard);

    const allNonMineRevealed = newBoard.flat().every(cell => cell.isMine || cell.state === "revealed");
    if (allNonMineRevealed) {
      setPhase("won");
      setFace("won");
      saveBest(difficulty, timer);
    }
  }, [phase, board, difficulty, timer, saveBest]);

  const handleFlag = useCallback((r: number, c: number) => {
    if (phase !== "idle" && phase !== "playing") return;
    const cell = board[r]?.[c];
    if (!cell || cell.state === "revealed") return;
    const next = cell.state === "hidden" ? "flagged" : cell.state === "flagged" ? "question" : "hidden";
    const newBoard = board.map((row, ri) =>
      row.map((c2, ci) => ri === r && ci === c ? { ...c2, state: next as CellState } : c2)
    );
    setBoard(newBoard);
    const flagCount = newBoard.flat().filter(c2 => c2.state === "flagged").length;
    setMinesLeft(DIFFICULTIES[difficulty].mines - flagCount);
  }, [phase, board, difficulty]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (flagMode) handleFlag(r, c);
    else handleReveal(r, c);
  }, [flagMode, handleFlag, handleReveal]);

  const handleContextMenu = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    handleFlag(r, c);
  }, [handleFlag]);

  const handleLongPressStart = useCallback((r: number, c: number) => {
    longPressRef.current = setTimeout(() => { handleFlag(r, c); }, 500);
  }, [handleFlag]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  }, []);

  const { rows, cols } = DIFFICULTIES[difficulty];
  const displayTimer = Math.min(timer, 999);
  const displayMines = Math.max(Math.min(minesLeft, 999), -99);

  const cellSize = difficulty === "expert"
    ? "min-w-[28px] min-h-[28px] text-xs"
    : difficulty === "intermediate"
    ? "min-w-[32px] min-h-[32px] text-sm"
    : "min-w-[36px] min-h-[36px] text-base";

  if (phase === "setup") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto p-4 gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">💣</div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Minesweeper Pro</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Find all mines without triggering one!</p>
        </div>
        <div className="w-full space-y-3">
          {(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES[Difficulty]][]).map(([key, d]) => (
            <button
              key={key}
              onClick={() => startGame(key as Difficulty)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 text-left flex justify-between items-center ${
                key === "beginner"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                  : key === "intermediate"
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                  : "bg-rose-500 hover:bg-rose-600 text-white border-rose-500"
              }`}
            >
              <span>{d.label}</span>
              <span className="text-xs opacity-80">{d.cols}×{d.rows} · {d.mines} mines</span>
            </button>
          ))}
        </div>
        {Object.entries(bestTimes).length > 0 && (
          <div className="w-full mt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-2">Best Times</p>
            {(Object.entries(bestTimes) as [Difficulty, number][]).map(([d, t]) => (
              <div key={d} className="flex justify-between text-sm px-2 py-1">
                <span className="text-slate-600 dark:text-slate-400 capitalize">{d}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{t}s</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full select-none touch-manipulation">
      {/* Header bar */}
      <div className="flex items-center justify-between w-full max-w-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-2 mb-3 gap-2">
        {/* Mine counter */}
        <div className="bg-black rounded px-2 py-1 font-mono font-bold text-red-500 text-lg min-w-[52px] text-center tracking-wider">
          {String(Math.abs(displayMines)).padStart(3, "0")}
        </div>

        {/* Face button */}
        <button
          onClick={() => startGame()}
          className="text-2xl w-10 h-10 flex items-center justify-center rounded border-2 border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
          onMouseDown={() => phase === "playing" && setFace("pressing")}
          onMouseUp={() => phase === "playing" && setFace("normal")}
          title="New game"
        >
          {face === "won" ? "😎" : face === "lost" ? "😵" : face === "pressing" ? "😮" : "🙂"}
        </button>

        {/* Timer */}
        <div className="bg-black rounded px-2 py-1 font-mono font-bold text-red-500 text-lg min-w-[52px] text-center tracking-wider">
          {String(displayTimer).padStart(3, "0")}
        </div>
      </div>

      {/* Mobile flag toggle */}
      <div className="flex gap-2 mb-3 w-full max-w-sm">
        <button
          onClick={() => setFlagMode(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
            !flagMode
              ? "bg-indigo-500 border-indigo-500 text-white"
              : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
          }`}
        >
          Reveal Mode
        </button>
        <button
          onClick={() => setFlagMode(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
            flagMode
              ? "bg-rose-500 border-rose-500 text-white"
              : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
          }`}
        >
          🚩 Flag Mode
        </button>
      </div>

      {/* Board */}
      <div className="overflow-auto max-w-full">
        <div
          className="inline-grid gap-0.5 bg-slate-400 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-600 rounded-lg p-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isRevealed = cell.state === "revealed";
              const isFlagged = cell.state === "flagged";
              const isQuestion = cell.state === "question";
              const isLostMine = phase === "lost" && cell.isMine && cell.state !== "flagged";
              const isWrongFlag = phase === "lost" && cell.state === "flagged" && !cell.isMine;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleContextMenu(e, r, c)}
                  onTouchStart={() => handleLongPressStart(r, c)}
                  onTouchEnd={handleLongPressEnd}
                  onTouchMove={handleLongPressEnd}
                  className={`
                    ${cellSize} flex items-center justify-center font-bold transition-colors rounded-sm
                    ${isRevealed || isLostMine
                      ? isLostMine && (phase === "lost")
                        ? "bg-red-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      : "bg-slate-300 dark:bg-slate-500 hover:bg-slate-200 dark:hover:bg-slate-400 active:bg-slate-100 border border-t-slate-100 border-l-slate-100 border-b-slate-500 border-r-slate-500 dark:border-t-slate-400 dark:border-l-slate-400 dark:border-b-slate-700 dark:border-r-slate-700"
                    }
                    ${isWrongFlag ? "bg-rose-200 dark:bg-rose-900" : ""}
                  `}
                  disabled={isRevealed || phase === "won" || phase === "lost"}
                  aria-label={`Cell ${r},${c}`}
                >
                  {isFlagged && !isLostMine ? "🚩" :
                   isWrongFlag ? "❌" :
                   isQuestion ? "❓" :
                   isLostMine ? "💣" :
                   isRevealed && cell.isMine ? "💣" :
                   isRevealed && cell.adjacentMines > 0 ? (
                     <span className={`${NUM_COLORS[cell.adjacentMines] || "text-slate-800 dark:text-slate-200"} font-black`}>
                       {cell.adjacentMines}
                     </span>
                   ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Game over message */}
      {(phase === "won" || phase === "lost") && (
        <Card className="mt-4 p-4 text-center border-2 border-indigo-200 dark:border-indigo-800 w-full max-w-sm">
          <div className="text-3xl mb-2">{phase === "won" ? "😎" : "😵"}</div>
          <h3 className="text-xl font-black mb-1">
            {phase === "won" ? "You cleared the board!" : "Boom! You hit a mine."}
          </h3>
          {phase === "won" && (
            <p className="text-slate-500 text-sm mb-3">Time: {timer}s</p>
          )}
          <div className="flex gap-2">
            <Button className="flex-1 gap-1" onClick={() => startGame()}>
              <RotateCcw className="w-4 h-4" /> Play Again
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setPhase("setup")}>
              Change Level
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MinesweeperProGame({
  title = "Minesweeper Pro",
  description = "The classic mine-sweeping puzzle game. Reveal all safe cells without triggering a mine. Three difficulty levels with a timer and best times tracker.",
}: {
  title?: string;
  description?: string;
}) {
  const editorialContent = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">How to Play Minesweeper</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Minesweeper challenges you to reveal all cells on a grid that do not contain mines. The board starts completely hidden. Your job is to deduce which cells are safe using number clues.
        </p>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">1.</span> Click (or tap in Reveal Mode) any cell to reveal it. Your first click is always safe.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">2.</span> Numbers show how many mines are in the 8 adjacent cells.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">3.</span> Right-click (or switch to Flag Mode) to place a flag on a suspected mine cell.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">4.</span> Clicking a blank cell (zero adjacent mines) automatically reveals surrounding safe cells.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">5.</span> Win by revealing every non-mine cell. Lose if you click a mine.</li>
        </ul>
      </section>

      <section id="numbers">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Understanding the Numbers</h2>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { n: 1, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
            { n: 2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
            { n: 3, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
            { n: 4, color: "text-[#000080]", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
          ].map(({ n, color, bg }) => (
            <div key={n} className={`${bg} rounded-xl p-3 text-center border border-slate-200 dark:border-slate-800`}>
              <span className={`text-2xl font-black ${color}`}>{n}</span>
              <p className="text-xs text-slate-500 mt-1">{n} adjacent mine{n > 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-700 dark:text-slate-300 mt-4 text-sm">
          Higher numbers (5–8) are increasingly rare but follow the same pattern. Each number tells you exactly how many mines are touching that cell.
        </p>
      </section>

      <section id="strategy">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Strategies</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Use the 1-2-1 Pattern", tip: "When you see 1-2-1 in a row along an edge, the mines are always on the two outer cells. You can safely click the center neighbors." },
            { title: "Chord Clicking", tip: "Once you've flagged all mines around a number, click the number again (chord) to instantly reveal all remaining hidden neighbors." },
            { title: "Corner Openings", tip: "Starting clicks from corners or edges tends to open up larger blank areas, giving you more information to work with." },
            { title: "Count Constraints", tip: "If a cell shows '3' and only 3 hidden cells remain around it, they must ALL be mines. Flag them immediately." },
          ].map(({ title: t, tip }) => (
            <div key={t} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="history">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">History of Minesweeper</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Minesweeper originated from mainframe games of the 1960s and 1970s. The most famous version was included with Microsoft Windows starting with Windows 3.1 in 1990, making it one of the best-known computer games ever created.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The game was designed by Curt Johnson and Robert Donner, who adapted an earlier program called "Mined-Out" (1983). It was bundled with Windows primarily to help users practice mouse skills. The world record for the Expert level (30×16, 99 mines) stands at under 33 seconds.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Is the first click always safe?", a: "Yes! Mines are placed after your first click, guaranteeing it will always open a blank area." },
            { q: "How do I flag on mobile?", a: "Switch to Flag Mode using the button above the board, then tap any hidden cell to place or remove a flag." },
            { q: "What is chord clicking?", a: "If you've flagged the right number of mines around a revealed number, clicking that number again will automatically reveal all unflagged neighbors." },
            { q: "Are best times saved?", a: "Yes, your best completion time for each difficulty is saved in your browser's local storage." },
            { q: "Can the game be unsolvable?", a: "Occasionally a random mine layout may require guessing. This is a known limitation of standard Minesweeper generation without constraint solving." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{q}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<MinesweeperBoard />}
      editorial={editorialContent}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "numbers", label: "Understanding Numbers" },
        { id: "strategy", label: "Strategies" },
        { id: "history", label: "History" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
