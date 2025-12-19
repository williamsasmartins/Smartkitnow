import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Cpu, RotateCcw, Sparkles, User } from "lucide-react";

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
  for (let r = ROWS - 1; r >= 0; r--) if (!b[r][col]) return r;
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
  const dirs: Array<[number, number]> = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
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
        if (cells.length >= 4) return { winner: p, cells };
      }
    }
  }
  if (isFull(b)) return { winner: "draw", cells: [] };
  return { winner: null, cells: [] };
}
function orderedMoves(moves: number[]): number[] {
  const preference = [3, 2, 4, 1, 5, 0, 6];
  return moves.slice().sort((a, b) => preference.indexOf(a) - preference.indexOf(b));
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
function pickAiMove(b: Cell[][], difficulty: Difficulty, ai: "R" | "Y", human: "R" | "Y"): number {
  const moves = validMoves(b);
  const aiWins = findImmediateWinningMoves(b, ai);
  if (aiWins.length > 0) return orderedMoves(aiWins)[0];
  const humanWins = findImmediateWinningMoves(b, human);
  if (humanWins.length > 0) return orderedMoves(humanWins)[0];
  const preferred = orderedMoves(moves);
  if (difficulty === "easy") {
    const centerBias = preferred.slice(0, Math.min(3, preferred.length));
    const pickFrom = Math.random() < 0.7 ? centerBias : preferred;
    return pickFrom[Math.floor(Math.random() * pickFrom.length)] ?? preferred[0] ?? 3;
  }
  if (difficulty === "medium") return preferred[0] ?? 3;
  return preferred[0] ?? 3;
}

type Props = { title?: string; description?: string };
export default function JoinDotsConnectFourView({ title, description }: Props) {
  const pageTitle = title ?? "Join Dots (Connect Four)";
  const pageDescription =
    description ??
    "Play Connect Four against a smart AI. Drop your dots, control the center, and connect four to win.";

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard());
  const [turn, setTurn] = useState<"human" | "ai">("human");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [winner, setWinner] = useState<WinnerResult>(() => ({ winner: null, cells: [] }));
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<Pos | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
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
    if (nextDifficulty) setDifficulty(nextDifficulty);
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

  useEffect(() => {
    if (winner.winner) return;
    if (turn !== "ai") return;
    setAiThinking(true);
    aiTimer.current = window.setTimeout(() => {
      const col = pickAiMove(board, difficulty, aiPiece, humanPiece);
      const res = applyMove(board, col, aiPiece);
      if (res) {
        const w = winnerScan(res.next);
        setBoard(res.next);
        setLastMove({ r: res.row, c: col });
        setWinner(w);
        setAiThinking(false);
        if (!w.winner) setTurn("human");
      } else {
        setAiThinking(false);
        setTurn("human");
      }
    }, 400);
    return () => {
      if (aiTimer.current) {
        window.clearTimeout(aiTimer.current);
        aiTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {d[0].toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{statusText}</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => resetGame()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New game
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <User className="h-4 w-4" /> You: Red
          <Cpu className="h-4 w-4" /> AI: Yellow
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
      onThisPage={[{ id: "how-to-play", label: "How to play" }]}
    >
      <div className="flex flex-col items-center">
        <div className="mb-3 text-sm text-slate-700 dark:text-slate-300">Click a column to drop your dot.</div>
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
                  const red = `border-red-400 bg-gradient-to-br from-red-400 to-red-600 ${isWinCell ? "ring-2 ring-red-300" : ""}`;
                  const yellow = `border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 ${isWinCell ? "ring-2 ring-yellow-300" : ""}`;
                  const cls = cell === "R" ? red : cell === "Y" ? yellow : empty;
                  return (
                    <div key={`${r}-${c}`} className={`${base} ${cls} ${isLast ? "outline outline-2 outline-[#5c82ee]" : ""}`} />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </GamePageLayout>
  );
}
