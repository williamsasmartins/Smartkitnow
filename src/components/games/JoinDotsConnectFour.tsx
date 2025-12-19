import React, { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Cpu, RotateCcw, Sparkles, User } from "lucide-react";

type Cell = "red" | "yellow" | null;
type Difficulty = "easy" | "medium" | "hard";
type GameState = "menu" | "playing" | "gameOver";
type Player = "human" | "ai";

type Props = {
  title?: string;
  description?: string;
};

const ROWS = 6;
const COLS = 7;

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((r) => [...r]);
}

function getAvailableRow(board: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) return r;
  }
  return -1;
}

function getValidMoves(board: Cell[][]): number[] {
  const moves: number[] = [];
  for (let c = 0; c < COLS; c++) if (getAvailableRow(board, c) !== -1) moves.push(c);
  return moves;
}

function isBoardFull(board: Cell[][]): boolean {
  return board[0].every((c) => c !== null);
}

function boardToASCII(board: Cell[][]): string {
  return board
    .map((row) => row.map((cell) => (cell === "red" ? "R" : cell === "yellow" ? "Y" : ".")).join(" "))
    .join("\n");
}

function checkWinnerPure(board: Cell[][], row: number, col: number): { winner: Cell; cells: [number, number][] } {
  const player = board[row][col];
  if (!player) return { winner: null, cells: [] };

  const dirs: Array<[[number, number], [number, number]]> = [
    [
      [0, 1],
      [0, -1],
    ],
    [
      [1, 0],
      [-1, 0],
    ],
    [
      [1, 1],
      [-1, -1],
    ],
    [
      [1, -1],
      [-1, 1],
    ],
  ];

  for (const [d1, d2] of dirs) {
    const cells: [number, number][] = [[row, col]];
    for (const [dr, dc] of [d1, d2]) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    if (cells.length >= 4) return { winner: player, cells };
  }

  return { winner: null, cells: [] };
}

function applyMove(board: Cell[][], col: number, player: Exclude<Cell, null>) {
  const row = getAvailableRow(board, col);
  if (row === -1) return null;
  const next = cloneBoard(board);
  next[row][col] = player;
  return { next, row };
}

function immediateWinningMoves(board: Cell[][], player: Exclude<Cell, null>): number[] {
  return getValidMoves(board).filter((col) => {
    const res = applyMove(board, col, player);
    if (!res) return false;
    return checkWinnerPure(res.next, res.row, col).winner === player;
  });
}

function orderedMoves(moves: number[]): number[] {
  const priority = [3, 2, 4, 1, 5, 0, 6];
  return priority.filter((c) => moves.includes(c));
}

function evaluateBoard(board: Cell[][]): number {
  // Positive favors Yellow (AI)
  const AI: Exclude<Cell, null> = "yellow";
  const HU: Exclude<Cell, null> = "red";
  let score = 0;

  // Center preference
  const centerCol = 3;
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) if (board[r][centerCol] === AI) centerCount++;
  score += centerCount * 6;

  const scoreWindow = (cells: Cell[]) => {
    const a = cells.filter((c) => c === AI).length;
    const h = cells.filter((c) => c === HU).length;
    const e = cells.filter((c) => c === null).length;

    if (a === 4) return 100000;
    if (h === 4) return -100000;

    if (a === 3 && e === 1) return 120;
    if (a === 2 && e === 2) return 15;

    if (h === 3 && e === 1) return -140;
    if (h === 2 && e === 2) return -12;

    return 0;
  };

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]]);
    }
  }
  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      score += scoreWindow([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]]);
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]]);
    }
  }
  // Diagonal up-right
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]]);
    }
  }

  return score;
}

function minimaxAlphaBeta(params: {
  board: Cell[][];
  depth: number;
  alpha: number;
  beta: number;
  maximizing: boolean;
  startMs: number;
  timeLimitMs: number;
  lastMove?: { row: number; col: number; player: Exclude<Cell, null> } | null;
}): { col: number; score: number } {
  const { board, depth, maximizing, startMs, timeLimitMs } = params;
  let { alpha, beta } = params;

  if (performance.now() - startMs > timeLimitMs) {
    return { col: -1, score: evaluateBoard(board) };
  }

  if (params.lastMove) {
    const w = checkWinnerPure(board, params.lastMove.row, params.lastMove.col).winner;
    if (w === "yellow") return { col: -1, score: 1_000_000_000 };
    if (w === "red") return { col: -1, score: -1_000_000_000 };
  }

  if (depth === 0 || isBoardFull(board)) {
    return { col: -1, score: evaluateBoard(board) };
  }

  const moves = orderedMoves(getValidMoves(board));
  if (!moves.length) return { col: -1, score: 0 };

  const AI: Exclude<Cell, null> = "yellow";
  const HU: Exclude<Cell, null> = "red";

  if (maximizing) {
    let best = { col: moves[0], score: -Infinity };
    for (const col of moves) {
      const res = applyMove(board, col, AI);
      if (!res) continue;
      const child = minimaxAlphaBeta({
        board: res.next,
        depth: depth - 1,
        alpha,
        beta,
        maximizing: false,
        startMs,
        timeLimitMs,
        lastMove: { row: res.row, col, player: AI },
      });
      if (child.score > best.score) best = { col, score: child.score };
      alpha = Math.max(alpha, best.score);
      if (alpha >= beta) break;
      if (performance.now() - startMs > timeLimitMs) break;
    }
    return best;
  } else {
    let best = { col: moves[0], score: Infinity };
    for (const col of moves) {
      const res = applyMove(board, col, HU);
      if (!res) continue;
      const child = minimaxAlphaBeta({
        board: res.next,
        depth: depth - 1,
        alpha,
        beta,
        maximizing: true,
        startMs,
        timeLimitMs,
        lastMove: { row: res.row, col, player: HU },
      });
      if (child.score < best.score) best = { col, score: child.score };
      beta = Math.min(beta, best.score);
      if (alpha >= beta) break;
      if (performance.now() - startMs > timeLimitMs) break;
    }
    return best;
  }
}

export default function JoinDotsConnectFour({
  title = "Join Dots (Connect Four)",
  description = "Play Connect Four against a smart local AI opponent. No external APIs, no per-play costs.",
}: Props) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("human");
  const [winner, setWinner] = useState<Cell | "draw" | null>(null);

  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiThoughts, setAiThoughts] = useState<Array<{ round: number; text: string }>>([]);
  const [aiMoveHistory, setAiMoveHistory] = useState<Array<{ round: number; col: number; label: string }>>([]);

  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const [animKey, setAnimKey] = useState<string | null>(null);
  const aiTurnGuard = useRef(0);

  const moveCount = useMemo(() => board.flat().filter(Boolean).length, [board]);
  const busy = gameState !== "playing" || isAIThinking || !!animKey;

  const howToPlay = (
    <div className="space-y-3">
      <p>
        You play as <strong>Red</strong>. ChatGPT AI plays as <strong>Yellow</strong>. Connect four pieces in a row
        (horizontal, vertical, or diagonal).
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Click a column to drop your piece.</li>
        <li>The last move is highlighted with a ring.</li>
        <li>Winning pieces pulse.</li>
        <li>
          Difficulty:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Easy</strong>: casual + occasional random moves; may miss blocks.</li>
            <li><strong>Medium</strong>: plays well but sometimes misses opportunities.</li>
            <li><strong>Hard</strong>: win/block priority + deeper lookahead (minimax).</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const startGame = (d: Difficulty) => {
    setDifficulty(d);
    setGameState("playing");
    setBoard(emptyBoard());
    setCurrentPlayer("human");
    setWinner(null);
    setAiThoughts([]);
    setAiMoveHistory([]);
    setLastMove(null);
    setWinningCells([]);
    setHoveredCol(null);
    setAnimKey(null);
    setIsAIThinking(false);
    aiTurnGuard.current = 0;
  };

  const resetToMenu = () => {
    setGameState("menu");
    setBoard(emptyBoard());
    setCurrentPlayer("human");
    setWinner(null);
    setAiThoughts([]);
    setAiMoveHistory([]);
    setLastMove(null);
    setWinningCells([]);
    setHoveredCol(null);
    setAnimKey(null);
    setIsAIThinking(false);
    aiTurnGuard.current = 0;
  };

  const endIfTerminal = (nextBoard: Cell[][], last: { row: number; col: number }) => {
    const w = checkWinnerPure(nextBoard, last.row, last.col);
    if (w.winner) {
      setWinner(w.winner);
      setWinningCells(w.cells);
      setGameState("gameOver");
      return true;
    }
    if (isBoardFull(nextBoard)) {
      setWinner("draw");
      setGameState("gameOver");
      return true;
    }
    return false;
  };

  const placePiece = (col: number, who: Exclude<Cell, null>, round: number) => {
    const row = getAvailableRow(board, col);
    if (row === -1) return false;

    // dynamic drop speed (faster later)
    const speedScalar = Math.max(0.65, 1 - (moveCount * 0.01));
    const dur = Math.round((180 + (row + 1) * 45) * speedScalar);

    const next = cloneBoard(board);
    next[row][col] = who;

    setAnimKey(`${row}-${col}-${who}-${round}`);
    setBoard(next);
    setLastMove({ row, col });

    window.setTimeout(() => {
      setAnimKey(null);
      const ended = endIfTerminal(next, { row, col });
      if (!ended) setCurrentPlayer(who === "red" ? "ai" : "human");
    }, dur + 30);

    return true;
  };

  const onHumanClick = (col: number) => {
    if (busy) return;
    if (currentPlayer !== "human") return;

    const round = moveCount + 1;
    const ok = placePiece(col, "red", round);
    if (!ok) return;
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    if (currentPlayer !== "ai") return;
    if (isAIThinking || animKey) return;

    aiTurnGuard.current += 1;
    const turnId = aiTurnGuard.current;

    const run = async () => {
      setIsAIThinking(true);
      setAiThoughts([]);

      const round = moveCount + 1;
      const ascii = boardToASCII(board);
      const valid = orderedMoves(getValidMoves(board));
      const winNow = immediateWinningMoves(board, "yellow");
      const blockNow = immediateWinningMoves(board, "red");

      const push = async (text: string, paceMs = 170) => {
        setAiThoughts((prev) => [...prev, { round, text }]);
        await new Promise((r) => setTimeout(r, paceMs));
      };

      await push(`Board (ASCII)\n${ascii}`, 140);
      await push(`Valid moves: [${valid.join(", ")}]`, 140);
      await push(`Immediate wins: [${winNow.length ? winNow.join(", ") : "none"}]`, 140);
      await push(`Must block: [${blockNow.length ? blockNow.join(", ") : "none"}]`, 140);

      // Decide move (LOCAL AI)
      const decide = () => {
        // mistake behavior
        const missWinChance = difficulty === "easy" ? 0.22 : difficulty === "medium" ? 0.08 : 0;
        const missBlockChance = difficulty === "easy" ? 0.30 : difficulty === "medium" ? 0.12 : 0;

        if (winNow.length && Math.random() >= missWinChance) return { col: winNow[0], label: "Win now" };
        if (blockNow.length && Math.random() >= missBlockChance) return { col: blockNow[0], label: "Block threat" };

        if (difficulty === "easy") {
          // casual/random often
          if (Math.random() < 0.45) {
            const rcol = valid[Math.floor(Math.random() * valid.length)];
            return { col: rcol, label: "Casual random" };
          }
          return { col: valid[0] ?? 3, label: "Center control" };
        }

        // Medium/Hard: minimax with time budget
        const startMs = performance.now();
        const timeLimitMs = difficulty === "hard" ? 260 : 140;
        const depth = difficulty === "hard" ? 7 : 4;

        const scored: Array<{ col: number; score: number }> = [];
        for (const c of valid) {
          const a = applyMove(board, c, "yellow");
          if (!a) continue;
          const child = minimaxAlphaBeta({
            board: a.next,
            depth: depth - 1,
            alpha: -Infinity,
            beta: Infinity,
            maximizing: false,
            startMs,
            timeLimitMs,
            lastMove: { row: a.row, col: c, player: "yellow" },
          });
          scored.push({ col: c, score: child.score });
          if (performance.now() - startMs > timeLimitMs) break;
        }

        scored.sort((x, y) => y.score - x.score);
        const best = scored[0] ?? { col: valid[0] ?? 3, score: 0 };

        // Medium sometimes picks #2/#3
        if (difficulty === "medium" && scored.length > 1 && Math.random() < 0.16) {
          const idx = 1 + Math.floor(Math.random() * Math.min(2, scored.length - 1));
          return { col: scored[idx].col, label: "Slight imperfection" };
        }

        return { col: best.col, label: "Strategic search" };
      };

      const decision = decide();
      await push(`Decision: column ${decision.col} (${decision.label})`, 220);

      // Abort if state changed mid-think
      if (turnId !== aiTurnGuard.current) {
        setIsAIThinking(false);
        return;
      }

      // Execute move
      const ok = placePiece(decision.col, "yellow", round);
      if (ok) setAiMoveHistory((prev) => [{ round, col: decision.col, label: decision.label }, ...prev]);

      setIsAIThinking(false);
    };

    run().catch(() => setIsAIThinking(false));
    // Intentionally exclude "board" from deps to prevent double AI turns; guarded by turnId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, gameState, difficulty, animKey]);

  return (
    <GamePageLayout
      title={title}
      description={description}
      onThisPage={[{ id: "how-to-play", label: "How to play" }]}
      howToPlay={howToPlay}
      showTopBanner={false}
      showSidebar={false}
      showBottomBanner={false}
      showFooterBlocks={true}
    >
      <style>{`
        .jd-drop { animation: jdDrop var(--dur, 320ms) cubic-bezier(.16,.84,.22,1.05) both; }
        @keyframes jdDrop { from { transform: translateY(calc(var(--drop, 1) * -120%)); } to { transform: translateY(0%); } }
        .jd-win { animation: jdWin 1.05s ease-in-out infinite; }
        @keyframes jdWin { 0%,100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.05); filter: brightness(1.18); } }
        .jd-ring { animation: jdRing 1.15s ease-out infinite; }
        @keyframes jdRing { 0% { transform: scale(.92); opacity: .55; } 70% { transform: scale(1.22); opacity: 0; } 100% { transform: scale(1.22); opacity: 0; } }
      `}</style>

      {/* GAME CARD */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-7">
          {/* MENU */}
          {gameState === "menu" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                Select difficulty
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Local AI runs in the browser. No external API calls.
              </p>

              <div className="grid gap-3">
                <button
                  onClick={() => startGame("easy")}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-950/60 transition px-4 py-3 text-left"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Easy</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Casual play, sometimes random.</div>
                </button>

                <button
                  onClick={() => startGame("medium")}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-950/60 transition px-4 py-3 text-left"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Medium</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Plays well, occasional mistakes.</div>
                </button>

                <button
                  onClick={() => startGame("hard")}
                  className="rounded-xl border border-slate-900 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 text-white transition px-4 py-3 text-left"
                >
                  <div className="font-semibold">Hard</div>
                  <div className="text-sm text-slate-200">Blocks wins and thinks ahead.</div>
                </button>
              </div>
            </div>
          )}

          {/* PLAY */}
          {(gameState === "playing" || gameState === "gameOver") && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* LEFT: BOARD */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "px-3 py-1.5 rounded-full text-sm font-semibold border",
                        currentPlayer === "human" && gameState === "playing"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-300"
                          : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400",
                      ].join(" ")}
                    >
                      <User className="inline h-4 w-4 mr-2" />
                      Your turn
                    </div>

                    <div
                      className={[
                        "px-3 py-1.5 rounded-full text-sm font-semibold border",
                        currentPlayer === "ai" && gameState === "playing"
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400",
                      ].join(" ")}
                    >
                      <Cpu className="inline h-4 w-4 mr-2" />
                      AI turn
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    Mode: <span className="font-semibold">{difficulty}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/40 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800/70 p-3 shadow-inner">
                  <div className="grid grid-cols-7 gap-2 select-none">
                    {Array.from({ length: COLS }).map((_, col) => {
                      const hoverActive = hoveredCol === col && currentPlayer === "human" && !busy;
                      const dropRow = getAvailableRow(board, col);

                      return (
                        <div
                          key={col}
                          className="relative rounded-xl p-1"
                          onMouseEnter={() => setHoveredCol(col)}
                          onMouseLeave={() => setHoveredCol(null)}
                          onClick={() => onHumanClick(col)}
                        >
                          {hoverActive && <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none" />}

                          {/* Ghost indicator */}
                          {hoverActive && dropRow !== -1 && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border border-white/25 bg-rose-400/15 pointer-events-none" />
                          )}

                          {board.map((rowArr, rowIdx) => {
                            const cell = rowArr[col];
                            const isLast = lastMove?.row === rowIdx && lastMove?.col === col;
                            const isWin = winningCells.some(([r, c]) => r === rowIdx && c === col);
                            const isAnimating = !!animKey && animKey.startsWith(`${rowIdx}-${col}-`);

                            const speedScalar = Math.max(0.65, 1 - (moveCount * 0.01));
                            const dur = Math.round((180 + (rowIdx + 1) * 45) * speedScalar);
                            const drop = rowIdx + 1;

                            return (
                              <div
                                key={`${col}-${rowIdx}`}
                                className="relative aspect-square rounded-full border-4 border-slate-700/70 bg-slate-900/40 overflow-hidden"
                              >
                                {cell && (
                                  <div
                                    className={[
                                      "absolute inset-0",
                                      cell === "red"
                                        ? "bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                                        : "bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.35)]",
                                      isWin ? "jd-win" : "",
                                      isAnimating ? "jd-drop" : "",
                                    ].join(" ")}
                                    style={
                                      isAnimating
                                        ? ({
                                            ["--dur" as any]: `${dur}ms`,
                                            ["--drop" as any]: drop,
                                          } as React.CSSProperties)
                                        : undefined
                                    }
                                  />
                                )}

                                {isLast && !isWin && <div className="absolute inset-0 rounded-full ring-4 ring-white/30 jd-ring" />}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {gameState === "gameOver" && (
                  <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                      {winner === "draw" ? "It’s a draw!" : winner === "red" ? "You win!" : "AI wins!"}
                    </div>

                    <button
                      onClick={resetToMenu}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 transition shadow-lg shadow-indigo-600/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Play again
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT: AI PANEL */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">AI thoughts</div>
                  <div className="ml-auto text-xs text-slate-600 dark:text-slate-400">
                    Move {moveCount + (currentPlayer === "ai" ? 1 : 0)}
                  </div>
                </div>

                {isAIThinking && (
                  <div className="mb-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300 animate-pulse">
                    Analyzing board…
                  </div>
                )}

                <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
                  {aiThoughts.length === 0 && !isAIThinking ? (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      AI analysis will appear here after the first computer move.
                    </div>
                  ) : (
                    aiThoughts
                      .slice()
                      .reverse()
                      .map((t, idx) => (
                        <div
                          key={`${t.round}-${idx}`}
                          className="rounded-lg border border-slate-200/60 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/30 p-3"
                          style={{ opacity: Math.max(0.42, 1 - idx * 0.12) }}
                        >
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Move {t.round}</div>
                          <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                            {t.text}
                          </pre>
                        </div>
                      ))
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI move history</div>
                  </div>
                  <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                    {aiMoveHistory.length === 0 ? (
                      <div className="text-sm text-slate-600 dark:text-slate-400">No AI moves yet.</div>
                    ) : (
                      aiMoveHistory.map((m) => (
                        <div key={`m-${m.round}`} className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">#{m.round}</span> → column <span className="font-semibold">{m.col}</span>{" "}
                          <span className="text-slate-500 dark:text-slate-400">({m.label})</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Local AI only. No APIs. No cost per play.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GamePageLayout>
  );
}
