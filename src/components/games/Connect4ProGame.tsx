import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Trophy, Play } from "lucide-react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Cell = 0 | 1 | 2; // 0=empty, 1=Red, 2=Yellow
type Board = Cell[][];
type GameMode = "pvp" | "ai-easy" | "ai-hard";
type GamePhase = "setup" | "playing" | "over";

interface DropAnim {
  col: number;
  row: number;
  player: 1 | 2;
  key: number;
}

const ROWS = 6;
const COLS = 7;
const LS_KEY = "connect4-wins";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

function dropDisc(board: Board, col: number, player: Cell): { board: Board; row: number } | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      const next = board.map((row, ri) =>
        ri === r ? row.map((c, ci) => (ci === col ? player : c)) : [...row]
      ) as Board;
      return { board: next, row: r };
    }
  }
  return null;
}

function checkWin(board: Board, player: Cell): [number, number][] | null {
  const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      for (const [dr, dc] of dirs) {
        const cells: [number, number][] = [[r, c]];
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return cells;
      }
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board[0].every((c) => c !== 0);
}

function getAvailableRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

// ─── Minimax ──────────────────────────────────────────────────────────────────
function scoreWindow(window: Cell[], player: Cell): number {
  const opp = player === 1 ? 2 : 1;
  const p = window.filter((c) => c === player).length;
  const e = window.filter((c) => c === 0).length;
  const o = window.filter((c) => c === opp).length;
  if (p === 4) return 100;
  if (p === 3 && e === 1) return 5;
  if (p === 2 && e === 2) return 2;
  if (o === 3 && e === 1) return -4;
  return 0;
}

function scoreBoard(board: Board, player: Cell): number {
  let score = 0;
  const centerCol = Math.floor(COLS / 2);
  const center = board.map((r) => r[centerCol]);
  score += center.filter((c) => c === player).length * 3;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++)
      score += scoreWindow([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]], player);
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++)
      score += scoreWindow([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]], player);
  }
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++)
      score += scoreWindow([board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]], player);
    for (let c = 3; c < COLS; c++)
      score += scoreWindow([board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]], player);
  }
  return score;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean, aiPlayer: Cell): number {
  const opp: Cell = aiPlayer === 2 ? 1 : 2;
  if (checkWin(board, aiPlayer)) return 100000 + depth;
  if (checkWin(board, opp)) return -(100000 + depth);
  if (isBoardFull(board) || depth === 0) return scoreBoard(board, aiPlayer);
  const cols = Array.from({ length: COLS }, (_, i) => i).filter((c) => getAvailableRow(board, c) !== -1);
  if (maximizing) {
    let value = -Infinity;
    for (const col of cols) {
      const result = dropDisc(board, col, aiPlayer);
      if (!result) continue;
      value = Math.max(value, minimax(result.board, depth - 1, alpha, beta, false, aiPlayer));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const col of cols) {
      const result = dropDisc(board, col, opp);
      if (!result) continue;
      value = Math.min(value, minimax(result.board, depth - 1, alpha, beta, true, aiPlayer));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

function getBestMove(board: Board, aiPlayer: Cell, depth: number): number {
  const cols = Array.from({ length: COLS }, (_, i) => i).filter((c) => getAvailableRow(board, c) !== -1);
  let best = -Infinity;
  let bestCol = cols[Math.floor(Math.random() * cols.length)];
  for (const col of cols) {
    const result = dropDisc(board, col, aiPlayer);
    if (!result) continue;
    const score = minimax(result.board, depth - 1, -Infinity, Infinity, false, aiPlayer);
    if (score > best) { best = score; bestCol = col; }
  }
  return bestCol;
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Board Component
// ─────────────────────────────────────────────────────────────────────────────
function Connect4Board() {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [current, setCurrent] = useState<1 | 2>(1);
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [mode, setMode] = useState<GameMode>("pvp");
  const [winner, setWinner] = useState<Cell>(0);
  const [winCells, setWinCells] = useState<[number, number][]>([]);
  const [scores, setScores] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
  const [dropping, setDropping] = useState<DropAnim | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const animKeyRef = useRef(0);
  const aiThinking = useRef(false);

  // Load scores from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setScores(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveScores = useCallback((s: { 1: number; 2: number }) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, []);

  const resetGame = useCallback(() => {
    setBoard(emptyBoard());
    setCurrent(1);
    setWinner(0);
    setWinCells([]);
    setDropping(null);
    setIsDraw(false);
    setPhase("playing");
    aiThinking.current = false;
  }, []);

  const handleDrop = useCallback((col: number) => {
    if (phase !== "playing" || dropping) return;
    if (mode !== "pvp" && current === 2) return; // AI's turn
    const result = dropDisc(board, col, current);
    if (!result) return;

    animKeyRef.current += 1;
    setDropping({ col, row: result.row, player: current, key: animKeyRef.current });

    setTimeout(() => {
      setBoard(result.board);
      setDropping(null);
      const win = checkWin(result.board, current);
      if (win) {
        setWinner(current);
        setWinCells(win);
        const newScores = { ...scores, [current]: scores[current] + 1 };
        setScores(newScores);
        saveScores(newScores);
        setPhase("over");
      } else if (isBoardFull(result.board)) {
        setIsDraw(true);
        setPhase("over");
      } else {
        setCurrent(current === 1 ? 2 : 1);
      }
    }, 350);
  }, [phase, dropping, mode, current, board, scores, saveScores]);

  // AI move
  useEffect(() => {
    if (phase !== "playing" || current !== 2 || mode === "pvp" || dropping || aiThinking.current) return;
    aiThinking.current = true;
    const delay = setTimeout(() => {
      const depth = mode === "ai-hard" ? 5 : 2;
      let col: number;
      if (mode === "ai-easy") {
        // Easy: mostly random, sometimes smart
        const rng = Math.random();
        if (rng < 0.4) {
          const available = Array.from({ length: COLS }, (_, i) => i).filter(c => getAvailableRow(board, c) !== -1);
          col = available[Math.floor(Math.random() * available.length)];
        } else {
          col = getBestMove(board, 2, 2);
        }
      } else {
        col = getBestMove(board, 2, depth);
      }

      const result = dropDisc(board, col, 2);
      if (!result) { aiThinking.current = false; return; }

      animKeyRef.current += 1;
      setDropping({ col, row: result.row, player: 2, key: animKeyRef.current });

      setTimeout(() => {
        setBoard(result.board);
        setDropping(null);
        aiThinking.current = false;
        const win = checkWin(result.board, 2);
        if (win) {
          setWinner(2);
          setWinCells(win);
          const newScores = { ...scores, 2: scores[2] + 1 };
          setScores(newScores);
          saveScores(newScores);
          setPhase("over");
        } else if (isBoardFull(result.board)) {
          setIsDraw(true);
          setPhase("over");
        } else {
          setCurrent(1);
        }
      }, 350);
    }, 500);
    return () => clearTimeout(delay);
  }, [phase, current, mode, board, dropping, scores, saveScores]);

  const winCellSet = new Set(winCells.map(([r, c]) => `${r}-${c}`));

  const playerLabel = (p: 1 | 2) =>
    mode === "pvp" ? (p === 1 ? "Red" : "Yellow") : p === 1 ? "You" : "AI";

  if (phase === "setup") {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto p-4 gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🔴🟡</div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Connect 4 Pro</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Drop discs. Connect four. Win!</p>
        </div>
        <div className="w-full space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Select Mode</p>
          {(["pvp", "ai-easy", "ai-hard"] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); resetGame(); }}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
                m === "pvp"
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500"
                  : m === "ai-easy"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                  : "bg-rose-500 hover:bg-rose-600 text-white border-rose-500"
              }`}
            >
              {m === "pvp" ? "Player vs Player" : m === "ai-easy" ? "vs AI (Easy)" : "vs AI (Hard)"}
            </button>
          ))}
        </div>
        <div className="flex gap-4 text-center w-full mt-2">
          <div className="flex-1 bg-red-50 dark:bg-red-950/30 rounded-xl p-3 border border-red-200 dark:border-red-800">
            <div className="text-2xl font-black text-red-500">{scores[1]}</div>
            <div className="text-xs text-slate-500 font-semibold">Red Wins</div>
          </div>
          <div className="flex-1 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl font-black text-yellow-500">{scores[2]}</div>
            <div className="text-xs text-slate-500 font-semibold">Yellow Wins</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto select-none touch-manipulation">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-3 px-1">
        <div className="flex gap-3">
          <div className="bg-red-100 dark:bg-red-950/40 rounded-lg px-3 py-1 border border-red-200 dark:border-red-800">
            <span className="text-xs text-slate-500 font-medium">{playerLabel(1)}</span>
            <span className="text-lg font-black text-red-500 ml-1">{scores[1]}</span>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-950/40 rounded-lg px-3 py-1 border border-yellow-200 dark:border-yellow-800">
            <span className="text-xs text-slate-500 font-medium">{playerLabel(2)}</span>
            <span className="text-lg font-black text-yellow-500 ml-1">{scores[2]}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetGame} title="New Game">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setPhase("setup")}>
            Menu
          </Button>
        </div>
      </div>

      {/* Turn indicator */}
      {phase === "playing" && (
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-4 h-4 rounded-full ${current === 1 ? "bg-red-500" : "bg-yellow-400"} shadow-md`} />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {current === 2 && mode !== "pvp" ? "AI thinking..." : `${playerLabel(current)}'s turn`}
          </span>
        </div>
      )}

      {/* Column drop indicators */}
      <div className="grid gap-1 w-full mb-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: COLS }).map((_, c) => (
          <button
            key={c}
            className={`h-6 flex items-center justify-center rounded-t-full transition-all ${
              hoveredCol === c && phase === "playing" && !(mode !== "pvp" && current === 2)
                ? current === 1
                  ? "bg-red-400/60"
                  : "bg-yellow-400/60"
                : "bg-transparent"
            }`}
            onClick={() => handleDrop(c)}
            onMouseEnter={() => setHoveredCol(c)}
            onMouseLeave={() => setHoveredCol(null)}
            aria-label={`Drop in column ${c + 1}`}
          >
            {hoveredCol === c && phase === "playing" && !(mode !== "pvp" && current === 2) && (
              <div className={`w-3 h-3 rounded-full ${current === 1 ? "bg-red-400" : "bg-yellow-400"}`} />
            )}
          </button>
        ))}
      </div>

      {/* Board */}
      <div
        className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-2 shadow-2xl w-full relative"
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        <div
          className="grid gap-1.5 h-full w-full"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        >
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => {
              const cell = board[r][c];
              const isWin = winCellSet.has(`${r}-${c}`);
              const isDropping = dropping && dropping.col === c && dropping.row === r;
              return (
                <button
                  key={`${r}-${c}`}
                  className="relative flex items-center justify-center rounded-full bg-blue-800/50 dark:bg-blue-900/50 cursor-pointer focus:outline-none"
                  onClick={() => r === 0 ? handleDrop(c) : handleDrop(c)}
                  onMouseEnter={() => setHoveredCol(c)}
                  onMouseLeave={() => setHoveredCol(null)}
                  aria-label={`Row ${r + 1}, Column ${c + 1}`}
                >
                  {/* Hole background */}
                  <div className="absolute inset-0 rounded-full bg-slate-900 dark:bg-slate-950" />
                  {/* Disc */}
                  {cell !== 0 && (
                    <div
                      className={`absolute inset-[8%] rounded-full shadow-inner transition-transform
                        ${cell === 1 ? "bg-gradient-to-br from-red-400 to-red-600" : "bg-gradient-to-br from-yellow-300 to-yellow-500"}
                        ${isWin ? "ring-4 ring-white ring-offset-1 ring-offset-blue-600 scale-105" : ""}
                        ${isDropping ? "animate-drop-disc" : ""}
                      `}
                      style={isWin ? { animation: "winPulse 0.6s ease-in-out infinite alternate" } : {}}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Game Over overlay */}
      {phase === "over" && (
        <div className="mt-4 w-full">
          <Card className="p-5 text-center border-2 border-indigo-200 dark:border-indigo-800 bg-white/95 dark:bg-slate-900/95">
            <Trophy className={`w-10 h-10 mx-auto mb-2 ${isDraw ? "text-slate-400" : winner === 1 ? "text-red-500" : "text-yellow-500"}`} />
            <h3 className="text-2xl font-black mb-1">
              {isDraw ? "It's a Draw!" : `${playerLabel(winner as 1 | 2)} Wins!`}
            </h3>
            <p className="text-slate-500 text-sm mb-4">{isDraw ? "The board is full." : "Four in a row!"}</p>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={resetGame}>
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setPhase("setup")}>
                Change Mode
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes dropDisc {
          from { transform: translateY(-300%) scale(0.8); opacity: 0.5; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-drop-disc { animation: dropDisc 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes winPulse {
          from { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          to { transform: scale(1.08); box-shadow: 0 0 12px 4px rgba(255,255,255,0.4); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Component (with CalculatorVerticalLayout)
// ─────────────────────────────────────────────────────────────────────────────
export default function Connect4ProGame({
  title = "Connect 4 Pro",
  description = "Drop discs to connect four in a row — horizontally, vertically, or diagonally. Play against a friend or challenge the AI!",
}: {
  title?: string;
  description?: string;
}) {
  const editorialContent = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">How to Play Connect 4</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Connect 4 is a two-player strategy game played on a 6-row, 7-column vertical grid. Players take turns dropping colored discs (Red and Yellow) into any column. Discs fall to the lowest available row in that column.
        </p>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">1.</span> Click or tap a column to drop your disc into it.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">2.</span> Your disc will fall to the lowest empty cell in that column.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">3.</span> The first player to connect four discs in a straight line wins.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">4.</span> Lines can be horizontal, vertical, or diagonal.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">5.</span> If the board fills up without a winner, the game is a draw.</li>
        </ul>
      </section>

      <section id="strategy">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Winning Strategies</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Control the Center", tip: "Placing discs in the center column (column 4) gives you the most connection opportunities — horizontally, vertically, and diagonally." },
            { title: "Build Threats", tip: "Create multiple simultaneous threats so your opponent cannot block all of them at once. A fork (two winning threats) is nearly unbeatable." },
            { title: "Block Diagonals", tip: "Diagonal wins are the hardest to spot. Always watch for diagonal sequences forming on both directions before making your move." },
            { title: "Don't Give Free Wins", tip: "Avoid filling a column if it would let your opponent complete a four-in-a-row directly above your disc." },
          ].map(({ title: t, tip }) => (
            <div key={t} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ai">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">About the AI</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          The <strong>Easy AI</strong> plays mostly random moves with occasional smart plays — great for beginners learning the game.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The <strong>Hard AI</strong> uses the Minimax algorithm with alpha-beta pruning at depth 5, evaluating millions of future positions to find the best move. It will consistently challenge experienced players.
        </p>
      </section>

      <section id="history">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">History of Connect 4</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Connect Four was first sold under the name "Captain's Mistress" and was later commercially published by Milton Bradley in February 1974. The game was solved by James Dow Allen in 1988: the first player can always win with perfect play by starting in the center column.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Despite being mathematically solved, the game remains extraordinarily popular because human players rarely play perfectly — leaving plenty of room for exciting, unpredictable gameplay.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Are my scores saved?", a: "Yes! Win counts for Red and Yellow are automatically saved to your browser's local storage and persist between sessions." },
            { q: "Can I play on mobile?", a: "Absolutely. The game is fully touch-optimized. Tap any column to drop a disc." },
            { q: "How hard is the Hard AI?", a: "Very challenging. It uses Minimax with alpha-beta pruning at depth 5, which means it looks several moves ahead and plays near-optimally." },
            { q: "What happens when the board is full?", a: "If all 42 cells are filled and no player has connected four, the game ends as a draw." },
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
      widget={<Connect4Board />}
      editorial={editorialContent}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "strategy", label: "Winning Strategies" },
        { id: "ai", label: "About the AI" },
        { id: "history", label: "History" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
