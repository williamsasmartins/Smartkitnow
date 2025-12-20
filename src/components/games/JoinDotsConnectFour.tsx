// src/components/games/JoinDotsConnectFour.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Cpu, RotateCcw, Sparkles, User, X } from "lucide-react";
import StartOverlay from "./StartOverlay";

type Cell = "R" | "Y" | null;
type Difficulty = "easy" | "medium" | "hard";

type Pos = { r: number; c: number };
type WinnerResult = { winner: "R" | "Y" | "draw" | null; cells: Pos[] };

const ROWS = 6;
const COLS = 7;

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
}

function cloneBoard(b: Cell[][]): Cell[][] {
  return b.map((row) => row.slice());
}

function getDropRow(b: Cell[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!b[r][col]) return r;
  }
  return -1;
}

function validMoves(b: Cell[][]): number[] {
  const moves: number[] = [];
  for (let c = 0; c < COLS; c++) if (getDropRow(b, c) !== -1) moves.push(c);
  return moves;
}

function applyMove(b: Cell[][], col: number, piece: "R" | "Y"): { next: Cell[][]; row: number } | null {
  const r = getDropRow(b, col);
  if (r === -1) return null;
  const next = cloneBoard(b);
  next[r][col] = piece;
  return { next, row: r };
}

function isFull(b: Cell[][]): boolean {
  return validMoves(b).length === 0;
}

function winnerScan(b: Cell[][]): WinnerResult {
  // Returns winner + the 4 cells (or more) of the winning line.
  const dirs: Array<[number, number]> = [
    [0, 1], // →
    [1, 0], // ↓
    [1, 1], // ↘
    [1, -1], // ↙
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = b[r][c];
      if (!p) continue;

      for (const [dr, dc] of dirs) {
        const cells: Pos[] = [{ r, c }];
        let rr = r + dr;
        let cc = c + dc;
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && b[rr][cc] === p) {
          cells.push({ r: rr, c: cc });
          rr += dr;
          cc += dc;
        }
        if (cells.length >= 4) {
          return { winner: p, cells };
        }
      }
    }
  }

  if (isFull(b)) return { winner: "draw", cells: [] };
  return { winner: null, cells: [] };
}

function scoreWindow(window: Cell[], ai: "R" | "Y", human: "R" | "Y"): number {
  const aiCount = window.filter((x) => x === ai).length;
  const huCount = window.filter((x) => x === human).length;
  const empties = window.filter((x) => x === null).length;

  // Terminal-ish patterns
  if (aiCount === 4) return 100000;
  if (huCount === 4) return -100000;

  // Strong threats & blocks
  if (aiCount === 3 && empties === 1) return 120;
  if (aiCount === 2 && empties === 2) return 18;
  if (huCount === 3 && empties === 1) return -140;
  if (huCount === 2 && empties === 2) return -22;

  return 0;
}

function evaluateBoard(b: Cell[][], ai: "R" | "Y"): number {
  const human: "R" | "Y" = ai === "R" ? "Y" : "R";
  let score = 0;

  // Center control
  const centerCol = 3;
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) if (b[r][centerCol] === ai) centerCount++;
  score += centerCount * 10;

  // Score all 4-windows
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const w = [b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3]];
      score += scoreWindow(w, ai, human);
    }
  }
  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const w = [b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c]];
      score += scoreWindow(w, ai, human);
    }
  }
  // Diagonal ↘
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const w = [b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3]];
      score += scoreWindow(w, ai, human);
    }
  }
  // Diagonal ↙
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const w = [b[r][c], b[r + 1][c - 1], b[r + 2][c - 2], b[r + 3][c - 3]];
      score += scoreWindow(w, ai, human);
    }
  }

  return score;
}

function findImmediateWinningMoves(b: Cell[][], piece: "R" | "Y"): number[] {
  const moves = validMoves(b);
  const wins: number[] = [];
  for (const col of moves) {
    const res = applyMove(b, col, piece);
    if (!res) continue;
    const w = winnerScan(res.next);
    if (w.winner === piece) wins.push(col);
  }
  return wins;
}

function orderedMoves(moves: number[]): number[] {
  // Prefer center-first ordering for better pruning
  const preference = [3, 2, 4, 1, 5, 0, 6];
  return moves.slice().sort((a, b) => preference.indexOf(a) - preference.indexOf(b));
}

type MinimaxResult = { col: number; score: number };

function minimax(
  b: Cell[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  ai: "R" | "Y",
  memo: Map<string, MinimaxResult>
): MinimaxResult {
  const human: "R" | "Y" = ai === "R" ? "Y" : "R";
  const key = `${depth}|${maximizing ? "1" : "0"}|${b.map((r) => r.map((c) => c ?? ".").join("")).join("/")}`;
  const cached = memo.get(key);
  if (cached) return cached;

  const w = winnerScan(b);
  if (w.winner === ai) return { col: -1, score: 1000000 + depth };
  if (w.winner === human) return { col: -1, score: -1000000 - depth };
  if (w.winner === "draw") return { col: -1, score: 0 };
  if (depth === 0) return { col: -1, score: evaluateBoard(b, ai) };

  const moves = orderedMoves(validMoves(b));
  if (moves.length === 0) return { col: -1, score: 0 };

  let best: MinimaxResult = { col: moves[0], score: maximizing ? -Infinity : Infinity };

  for (const col of moves) {
    const movePiece = maximizing ? ai : human;
    const res = applyMove(b, col, movePiece);
    if (!res) continue;

    const child = minimax(res.next, depth - 1, alpha, beta, !maximizing, ai, memo);
    const candidate: MinimaxResult = { col, score: child.score };

    if (maximizing) {
      if (candidate.score > best.score) best = candidate;
      alpha = Math.max(alpha, best.score);
      if (beta <= alpha) break;
    } else {
      if (candidate.score < best.score) best = candidate;
      beta = Math.min(beta, best.score);
      if (beta <= alpha) break;
    }
  }

  memo.set(key, best);
  return best;
}

function difficultyDepth(d: Difficulty): number {
  if (d === "easy") return 1;
  if (d === "medium") return 3;
  return 5;
}

function labelDifficulty(d: Difficulty): string {
  if (d === "easy") return "Easy";
  if (d === "medium") return "Medium";
  return "Hard";
}

function pieceLabel(p: "R" | "Y"): string {
  return p === "R" ? "Red" : "Yellow";
}

function colLabel(c: number): string {
  return `${c + 1}`;
}

type Props = {
  title?: string;
  description?: string;
};

export default function JoinDotsConnectFour({ title, description }: Props) {
  const pageTitle = title ?? "Join Dots (Connect Four)";
  const pageDescription =
    description ??
    "Play Connect Four against a smart AI with three difficulty levels. Drop your dots, control the center, and connect four to win.";

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [turn, setTurn] = useState<"human" | "ai">("human");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [winner, setWinner] = useState<WinnerResult>(() => ({ winner: null, cells: [] }));
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<Pos | null>(null);

  const [started, setStarted] = useState(false);
  const [startOverlayOpen, setStartOverlayOpen] = useState(true);

  const [aiThinking, setAiThinking] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [aiTopMoves, setAiTopMoves] = useState<Array<{ col: number; score: number; reason: string }>>([]);
  const [autoRestartSec, setAutoRestartSec] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const aiTimer = useRef<number | null>(null);

  const humanPiece: "R" | "Y" = "R";
  const aiPiece: "R" | "Y" = "Y";

  const winningSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of winner.cells) s.add(`${p.r}:${p.c}`);
    return s;
  }, [winner.cells]);

  const statusText = useMemo(() => {
    if (winner.winner === "draw") return "Draw — no more moves.";
    if (winner.winner === "R") return "You win!";
    if (winner.winner === "Y") return "AI wins!";
    return turn === "human" ? "Your turn" : "AI is thinking…";
  }, [winner.winner, turn]);

  const overlayText = useMemo(() => {
    if (winner.winner === "R") return "You won!";
    if (winner.winner === "Y") return "The AI won!";
    if (winner.winner === "draw") return "Draw!";
    return "";
  }, [winner.winner]);

  function playVictorySound(kind: "R" | "Y" | "draw") {
    const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = kind === "R" ? 880 : kind === "Y" ? 660 : 520;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    let t = 0;
    const step = () => {
      t += 1;
      g.gain.exponentialRampToValueAtTime(0.0001 * Math.pow(1.25, t), ctx.currentTime + 0.05);
      if (t > 10) {
        o.stop();
      } else {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  useEffect(() => {
    if (!winner.winner) return;
    setShowConfetti(true);
    setAutoRestartSec(8);
    playVictorySound(winner.winner);
    const id = window.setInterval(() => {
      setAutoRestartSec((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          resetGame();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
     
  }, [winner.winner]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (winner.winner) return;
      const map: Record<string, number> = {
        Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Digit7: 6,
        Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5, Numpad7: 6,
      };
      if (e.code in map) {
        handleDrop(map[e.code]);
      } else if (e.code === "KeyR") {
        resetGame();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, winner.winner, turn]);

  function resetGame(nextDifficulty?: Difficulty) {
    if (aiTimer.current) {
      window.clearTimeout(aiTimer.current);
      aiTimer.current = null;
    }
    setBoard(emptyBoard());
    setTurn("human");
    setWinner({ winner: null, cells: [] });
    setHoverCol(null);
    setLastMove(null);
    setAiThinking(false);
    setAiInsights([]);
    setAiTopMoves([]);
    setShowConfetti(false);
    setAutoRestartSec(0);
    // Return to not-started so user must click Start again
    setStarted(false);
    setStartOverlayOpen(true);
    if (nextDifficulty) setDifficulty(nextDifficulty);
  }

  function startGame() {
    setStarted(true);
    setStartOverlayOpen(false);
  }

  function handleDrop(col: number) {
    if (winner.winner) return;
    if (turn !== "human") return;

    const res = applyMove(board, col, humanPiece);
    if (!res) return;

    const nextWinner = winnerScan(res.next);
    setBoard(res.next);
    setLastMove({ r: res.row, c: col });
    setWinner(nextWinner);

    if (!nextWinner.winner) setTurn("ai");
  }

  function computeAiMove(b: Cell[][], d: Difficulty): { col: number; insights: string[]; top: Array<{ col: number; score: number; reason: string }> } {
    const moves = validMoves(b);

    const aiWins = findImmediateWinningMoves(b, aiPiece);
    const humanWins = findImmediateWinningMoves(b, humanPiece);

    // Easy: always block immediate loss, often take immediate win, otherwise mildly center-biased random.
    if (d === "easy") {
      if (aiWins.length > 0) {
        const chosen = orderedMoves(aiWins)[0];
        return {
          col: chosen,
          insights: [`Immediate win available — playing column ${colLabel(chosen)}.`],
          top: aiWins.map((c) => ({ col: c, score: 999999, reason: "Immediate win" })),
        };
      }

      if (humanWins.length > 0) {
        const chosen = orderedMoves(humanWins)[0];
        return {
          col: chosen,
          insights: [`Must block your win — blocking column ${colLabel(chosen)}.`],
          top: humanWins.map((c) => ({ col: c, score: 999998, reason: "Block immediate loss" })),
        };
      }

      const preferred = orderedMoves(moves);
      const centerBias = preferred.slice(0, Math.min(3, preferred.length));
      const pickFrom = Math.random() < 0.7 ? centerBias : preferred;
      const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)] ?? preferred[0] ?? 3;

      return {
        col: chosen,
        insights: [
          `No forced win/block. Choosing a reasonable move (center-biased).`,
          `Selected column ${colLabel(chosen)}.`,
        ],
        top: preferred.slice(0, 3).map((c, i) => ({ col: c, score: 0 - i, reason: c === 3 ? "Center control" : "Playable move" })),
      };
    }

    // Medium/Hard: minimax with alpha-beta + show top move candidates
    // Always take immediate wins first, then blocks.
    if (aiWins.length > 0) {
      const chosen = orderedMoves(aiWins)[0];
      return {
        col: chosen,
        insights: [`Immediate win available — playing column ${colLabel(chosen)}.`],
        top: aiWins.map((c) => ({ col: c, score: 999999, reason: "Immediate win" })),
      };
    }
    if (humanWins.length > 0) {
      const chosen = orderedMoves(humanWins)[0];
      return {
        col: chosen,
        insights: [`You have an immediate threat — blocking column ${colLabel(chosen)}.`],
        top: humanWins.map((c) => ({ col: c, score: 999998, reason: "Block immediate loss" })),
      };
    }

    const depth = difficultyDepth(d);
    const memo = new Map<string, MinimaxResult>();
    const candidates = orderedMoves(moves).map((col) => {
      const res = applyMove(b, col, aiPiece);
      if (!res) return { col, score: -Infinity };
      const r = minimax(res.next, depth - 1, -Infinity, Infinity, false, aiPiece, memo);
      return { col, score: r.score };
    });

    const sorted = candidates.slice().sort((a, b2) => b2.score - a.score);
    const best = sorted[0] ?? { col: orderedMoves(moves)[0] ?? 3, score: 0 };

    const top = sorted.slice(0, 4).map((x) => {
      const reason =
        x.col === 3 ? "Center control" : x.score > 150 ? "Creates strong threats" : x.score < -150 ? "Avoided if possible" : "Best evaluated line";
      return { col: x.col, score: x.score, reason };
    });

    const insights: string[] = [
      `${labelDifficulty(d)} AI searches ahead ~${depth} ply (minimax).`,
      `Candidate moves: ${top.map((t) => `${colLabel(t.col)} (${Math.round(t.score)})`).join(", ")}.`,
      `Chosen move: column ${colLabel(best.col)}.`,
    ];

    return { col: best.col, insights, top };
  }

  useEffect(() => {
    if (winner.winner) return;
    if (turn !== "ai") return;

    setAiThinking(true);

    // Simulate thinking for UX (and to avoid “instant” feel)
    aiTimer.current = window.setTimeout(() => {
      const { col, insights, top } = computeAiMove(board, difficulty);

      setAiInsights(insights);
      setAiTopMoves(top);

      const res = applyMove(board, col, aiPiece);
      if (!res) {
        // fallback: first valid move
        const fallback = validMoves(board)[0];
        if (typeof fallback === "number") {
          const res2 = applyMove(board, fallback, aiPiece);
          if (res2) {
            const w2 = winnerScan(res2.next);
            setBoard(res2.next);
            setLastMove({ r: res2.row, c: fallback });
            setWinner(w2);
            setTurn(w2.winner ? "human" : "human");
          }
        }
        setAiThinking(false);
        setTurn("human");
        return;
      }

      const w = winnerScan(res.next);
      setBoard(res.next);
      setLastMove({ r: res.row, c: col });
      setWinner(w);
      setAiThinking(false);

      if (!w.winner) setTurn("human");
    }, 450);

    return () => {
      if (aiTimer.current) {
        window.clearTimeout(aiTimer.current);
        aiTimer.current = null;
      }
    };
     
  }, [turn, winner.winner, board, difficulty]);

  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Difficulty</div>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <Button
                key={d}
                type="button"
                variant={difficulty === d ? "default" : "outline"}
                className="h-9 px-3"
                onClick={() => resetGame(d)}
              >
                {labelDifficulty(d)}
              </Button>
            ))}
          </div>
        </div>

        {!started && !winner.winner && !startOverlayOpen ? (
          <div className="mt-4 flex justify-center">
            <Button type="button" onClick={() => setStartOverlayOpen(true)}>
              Start Game
            </Button>
          </div>
        ) : null}

        <StartOverlay open={startOverlayOpen && !started && !winner.winner} onClose={() => setStartOverlayOpen(false)}>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <Sparkles className="h-4 w-4 text-[#5c82ee]" />
              Join Dots
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ready to play</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Choose difficulty and press Start to begin.</p>
            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Difficulty</div>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={difficulty === d ? "default" : "outline"}
                      className="h-9 px-3"
                      onClick={() => setDifficulty(d)}
                    >
                      {d[0].toUpperCase() + d.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button type="button" className="w-full" onClick={startGame}>
                Start Game
              </Button>
            </div>
          </div>
        </StartOverlay>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1 text-slate-700 dark:text-slate-300">
            <User className="h-4 w-4" /> You: {pieceLabel(humanPiece)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1 text-slate-700 dark:text-slate-300">
            <Cpu className="h-4 w-4" /> AI: {pieceLabel(aiPiece)}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{statusText}</div>
          {lastMove ? (
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Last move: row {lastMove.r + 1}, col {lastMove.c + 1}
            </div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => resetGame()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New game
          </Button>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Sparkles className="h-4 w-4 text-[#5c82ee]" />
            AI analysis
          </div>

          {aiThinking ? (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Thinking…</div>
          ) : aiInsights.length > 0 ? (
            <div className="mt-2 space-y-2">
              <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {aiInsights.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>

              {aiTopMoves.length > 0 ? (
                <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-3">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Top candidates</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {aiTopMoves.map((m) => (
                      <li key={m.col} className="flex items-center justify-between gap-2">
                        <span>
                          Col {colLabel(m.col)} — <span className="text-slate-500 dark:text-slate-400">{m.reason}</span>
                        </span>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{Math.round(m.score)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Make a move to see the AI’s evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const below = (
    <div>
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            This is classic <strong>Connect Four</strong>. You (Red) and the AI (Yellow) take turns dropping a dot into a column.
            The dot falls to the lowest available spot. The first player to connect four dots in a line wins.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Click a column to drop your dot.</li>
            <li>Win by connecting four in a row: horizontal, vertical, or diagonal.</li>
            <li>If the board fills up with no winner, the game is a draw.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[
        { id: "how-to-play", label: "How to play" },
      ]}
    >
      <div className="flex flex-col items-center">
        <div className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          Click a column to drop your dot.
        </div>
        <div className="flex gap-2">
          {Array.from({ length: COLS }).map((_, c) => {
            const dropAvailable = getDropRow(board, c) !== -1;
            const isHover = hoverCol === c && turn === "human" && dropAvailable && !winner.winner;
            return (
              <div
                key={c}
                className="flex flex-col items-center gap-2"
                onMouseEnter={() => setHoverCol(c)}
                onMouseLeave={() => setHoverCol(null)}
              >
                <button
                  type="button"
                  className={`h-8 w-8 rounded-full border ${isHover ? "border-[#5c82ee] bg-[#5c82ee]/10" : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"}`}
                  onClick={() => handleDrop(c)}
                  aria-label={`Drop in column ${c + 1}`}
                  disabled={!dropAvailable || !!winner.winner || turn !== "human"}
                />
                {Array.from({ length: ROWS }).map((_, r) => {
                  const cell = board[r][c];
                  const isLast = lastMove && lastMove.r === r && lastMove.c === c;
                  const isWinCell = winningSet.has(`${r}:${c}`);
                  const base = "h-10 w-10 rounded-full border transition-colors";
                  const empty = "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800";
                  const red = `border-red-400 bg-gradient-to-br from-red-400 to-red-600 ${isWinCell ? "ring-2 ring-red-300 animate-pulse" : ""}`;
                  const yellow = `border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 ${isWinCell ? "ring-2 ring-yellow-300 animate-pulse" : ""}`;
                  const cls = cell === "R" ? red : cell === "Y" ? yellow : empty;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`${base} ${cls} ${isLast ? "outline outline-2 outline-[#5c82ee]" : ""}`}
                    />
                  );
                })}
                </div>
            );
          })}
        </div>
        {winner.winner ? (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/40"
            role="alertdialog"
            aria-modal="true"
            aria-live="assertive"
          >
            {showConfetti ? (
              <ConfettiLayer kind={winner.winner as "R" | "Y" | "draw"} />
            ) : null}
            <div className="relative z-20 w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                  <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                  Victory
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {overlayText}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {winner.winner === "draw"
                    ? "The board is full and nobody connected four. Click Restart to play again."
                    : "Four dots of the same color connected. Click Restart to play again."}
                </p>
                {autoRestartSec > 0 ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Auto restart in {autoRestartSec}s</p>
                ) : null}
                <div className="mt-6">
                  <Button type="button" className="w-full" onClick={() => resetGame()}>
                    Restart Game
                  </Button>
                </div>
              </div>
              {showConfetti ? (
                <ConfettiLayer kind={winner.winner as "R" | "Y" | "draw"} />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </GamePageLayout>
  );
}

function ConfettiLayer({ kind }: { kind: "R" | "Y" | "draw" }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctx2 = ctx as CanvasRenderingContext2D;
    const colors =
      kind === "R"
        ? ["#ef4444", "#fca5a5", "#f87171"]
        : kind === "Y"
        ? ["#f59e0b", "#fde68a", "#fbbf24"]
        : ["#64748b", "#93c5fd", "#5c82ee"];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);
    const particles = Array.from({ length: 220 }).map(() => ({
      x: Math.random() * w,
      y: -40 - Math.random() * 220,
      vx: -1.25 + Math.random() * 2.5,
      vy: 2.25 + Math.random() * 2.75,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }));
    let running = true;
    const start = performance.now();
    function tick(now: number) {
      if (!running) return;
      const t = now - start;
      ctx2.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.vy += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        ctx2.fillStyle = p.color;
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx2.fill();
        if (p.y > h + 12 || p.x < -12 || p.x > w + 12) {
          p.y = -40 - Math.random() * 220;
          p.x = Math.random() * w;
          p.vx = -1.25 + Math.random() * 2.5;
          p.vy = 2.25 + Math.random() * 2.75;
          p.size = 2 + Math.random() * 4;
          p.life = 0;
        }
      });
      if (t < 3000) requestAnimationFrame(tick);
    }
    const id = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(id);
      running = false;
    };
  }, [kind]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-10" />;
}
