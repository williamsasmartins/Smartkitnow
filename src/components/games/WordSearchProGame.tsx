import React, { useState, useCallback, useRef, useEffect } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";
type Direction = "H" | "V" | "D"; // horizontal, vertical, diagonal

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  dir: Direction;
  found: boolean;
  color: string;
}

interface CellState {
  letter: string;
  highlight: string | null; // color if found
}

type SelectionState = {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
} | null;

// ─── Word banks ───────────────────────────────────────────────────────────────

const WORD_BANKS: Record<string, string[]> = {
  Animals: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "ZEBRA", "PENGUIN", "DOLPHIN", "EAGLE", "SHARK", "WOLF", "PANDA", "KOALA", "JAGUAR", "RABBIT", "FALCON"],
  Countries: ["FRANCE", "JAPAN", "BRAZIL", "CANADA", "INDIA", "EGYPT", "MEXICO", "ITALY", "CHINA", "SPAIN", "PERU", "CUBA", "GHANA", "CHILE", "KENYA"],
  Fruits: ["APPLE", "MANGO", "BANANA", "GRAPE", "ORANGE", "LEMON", "PEACH", "CHERRY", "MELON", "PLUM", "KIWI", "PAPAYA", "GUAVA", "LYCHEE", "FIG"],
  Sports: ["SOCCER", "TENNIS", "GOLF", "HOCKEY", "BOXING", "ROWING", "RUGBY", "SKIING", "SURFING", "DIVING", "CYCLING", "FENCING", "ARCHERY", "POLO", "JUDO"],
  Tech: ["PYTHON", "REACT", "LINUX", "SERVER", "ROUTER", "CURSOR", "PIXEL", "CACHE", "BINARY", "CLOUD", "TOKEN", "ARRAY", "SCRIPT", "SOCKET", "KERNEL"],
};

const CATEGORY_COLORS: Record<string, string> = {
  Animals: "#6366f1",
  Countries: "#f59e0b",
  Fruits: "#10b981",
  Sports: "#ef4444",
  Tech: "#3b82f6",
};

const DIFFICULTY_SIZES: Record<Difficulty, number> = {
  easy: 10,
  medium: 12,
  hard: 15,
};

const WORDS_PER_PUZZLE = 8;

// ─── Grid generation ──────────────────────────────────────────────────────────

function makeEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function randomLetter(): string {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
}

function tryPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dir: Direction,
  size: number
): boolean {
  const dr = dir === "V" || dir === "D" ? 1 : 0;
  const dc = dir === "H" || dir === "D" ? 1 : 0;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dir: Direction
): void {
  const dr = dir === "V" || dir === "D" ? 1 : 0;
  const dc = dir === "H" || dir === "D" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i];
  }
}

function generatePuzzle(difficulty: Difficulty): { grid: CellState[][]; words: PlacedWord[]; category: string } {
  const size = DIFFICULTY_SIZES[difficulty];
  const categories = Object.keys(WORD_BANKS);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const pool = [...WORD_BANKS[category]].sort(() => Math.random() - 0.5);
  const color = CATEGORY_COLORS[category];

  const rawGrid = makeEmptyGrid(size);
  const placed: PlacedWord[] = [];
  const dirs: Direction[] = ["H", "V", "D"];

  for (const word of pool) {
    if (placed.length >= WORDS_PER_PUZZLE) break;
    if (word.length > size) continue;

    let success = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const maxRow = dir === "H" ? size - 1 : size - word.length;
      const maxCol = dir === "V" ? size - 1 : size - word.length;
      if (maxRow < 0 || maxCol < 0) continue;
      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));

      if (tryPlace(rawGrid, word, row, col, dir, size)) {
        placeWord(rawGrid, word, row, col, dir);
        placed.push({ word, row, col, dir, found: false, color });
        success = true;
        break;
      }
    }
  }

  // Fill blanks
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (rawGrid[r][c] === "") rawGrid[r][c] = randomLetter();
    }
  }

  const grid: CellState[][] = rawGrid.map((row) => row.map((letter) => ({ letter, highlight: null })));
  return { grid, words: placed, category };
}

// ─── Selection helpers ────────────────────────────────────────────────────────

function getSelectedCells(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Array<{ row: number; col: number }> {
  const dr = endRow - startRow;
  const dc = endCol - startCol;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return [{ row: startRow, col: startCol }];
  // Must be straight line (H, V, or D)
  const isDiag = Math.abs(dr) === Math.abs(dc);
  const isH = dr === 0;
  const isV = dc === 0;
  if (!isH && !isV && !isDiag) return [];

  const stepR = len === 0 ? 0 : dr / len;
  const stepC = len === 0 ? 0 : dc / len;
  // Only allow exact step values
  if (!Number.isInteger(stepR) || !Number.isInteger(stepC)) return [];

  const cells: Array<{ row: number; col: number }> = [];
  for (let i = 0; i <= len; i++) {
    cells.push({ row: startRow + i * stepR, col: startCol + i * stepC });
  }
  return cells;
}

function cellsToWord(grid: CellState[][], cells: Array<{ row: number; col: number }>): string {
  return cells.map(({ row, col }) => grid[row]?.[col]?.letter ?? "").join("");
}

// ─── Main Board ───────────────────────────────────────────────────────────────

function WordSearchBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<{ grid: CellState[][]; words: PlacedWord[]; category: string } | null>(null);
  const [selStart, setSelStart] = useState<{ row: number; col: number } | null>(null);
  const [selEnd, setSelEnd] = useState<{ row: number; col: number } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const newPuzzle = useCallback((diff: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const p = generatePuzzle(diff);
    setPuzzle(p);
    setSelStart(null);
    setSelEnd(null);
    setElapsedMs(0);
    setWon(false);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);
  }, []);

  useEffect(() => {
    newPuzzle(difficulty);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    newPuzzle(d);
  };

  // Selection completion
  const finalizeSelection = useCallback(
    (endRow: number, endCol: number) => {
      if (!selStart || !puzzle) return;
      const cells = getSelectedCells(selStart.row, selStart.col, endRow, endCol);
      if (cells.length === 0) { setSelStart(null); setSelEnd(null); return; }

      const word = cellsToWord(puzzle.grid, cells);
      const wordRev = word.split("").reverse().join("");

      const matchIndex = puzzle.words.findIndex(
        (w) => !w.found && (w.word === word || w.word === wordRev)
      );

      if (matchIndex >= 0) {
        const matched = puzzle.words[matchIndex];
        // Highlight cells
        const newGrid = puzzle.grid.map((row) => row.map((cell) => ({ ...cell })));
        cells.forEach(({ row, col }) => {
          newGrid[row][col] = { ...newGrid[row][col], highlight: matched.color };
        });
        const newWords = puzzle.words.map((w, i) => i === matchIndex ? { ...w, found: true } : w);
        const newPuzzleState = { ...puzzle, grid: newGrid, words: newWords };
        setPuzzle(newPuzzleState);

        if (newWords.every((w) => w.found)) {
          setWon(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }

      setSelStart(null);
      setSelEnd(null);
    },
    [selStart, puzzle]
  );

  const handlePointerDown = useCallback(
    (row: number, col: number, e: React.PointerEvent) => {
      e.preventDefault();
      setSelStart({ row, col });
      setSelEnd({ row, col });
    },
    []
  );

  const handlePointerEnter = useCallback(
    (row: number, col: number, e: React.PointerEvent) => {
      if (!selStart) return;
      if (e.buttons === 0) { setSelStart(null); return; }
      setSelEnd({ row, col });
    },
    [selStart]
  );

  const handlePointerUp = useCallback(
    (row: number, col: number) => {
      finalizeSelection(row, col);
    },
    [finalizeSelection]
  );

  if (!puzzle) return <div className="text-center p-8 text-slate-500">Generating puzzle...</div>;

  const size = puzzle.grid.length;
  const foundCount = puzzle.words.filter((w) => w.found).length;
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const elapsedStr = `${Math.floor(elapsedSec / 60).toString().padStart(2, "0")}:${(elapsedSec % 60).toString().padStart(2, "0")}`;

  // Compute selected cells for preview highlight
  const selCells = selStart && selEnd
    ? new Set(getSelectedCells(selStart.row, selStart.col, selEnd.row, selEnd.col).map(c => `${c.row}-${c.col}`))
    : new Set<string>();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all capitalize ${
                difficulty === d
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
              }`}
            >
              {d} ({DIFFICULTY_SIZES[d]}×{DIFFICULTY_SIZES[d]})
            </button>
          ))}
        </div>
        <button
          onClick={() => newPuzzle(difficulty)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          New Puzzle
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-slate-600 dark:text-slate-400">
          Category: <span style={{ color: CATEGORY_COLORS[puzzle.category] }} className="font-bold">{puzzle.category}</span>
        </span>
        <span className="font-semibold text-slate-600 dark:text-slate-400">
          {foundCount}/{puzzle.words.length} found &nbsp;|&nbsp; {elapsedStr}
        </span>
      </div>

      {/* Win banner */}
      {won && (
        <div className="bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-400 rounded-xl p-4 text-center">
          <p className="text-emerald-700 dark:text-emerald-300 font-black text-xl">All words found!</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">Time: {elapsedStr}</p>
          <button
            onClick={() => newPuzzle(difficulty)}
            className="mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        className="select-none touch-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: "2px",
          width: "100%",
        }}
      >
        {puzzle.grid.map((row, ri) =>
          row.map((cell, ci) => {
            const key = `${ri}-${ci}`;
            const isSelected = selCells.has(key);
            const bg = cell.highlight
              ? cell.highlight
              : isSelected
              ? "#6366f1"
              : undefined;

            return (
              <div
                key={key}
                onPointerDown={(e) => handlePointerDown(ri, ci, e)}
                onPointerEnter={(e) => handlePointerEnter(ri, ci, e)}
                onPointerUp={() => handlePointerUp(ri, ci)}
                className={`
                  aspect-square flex items-center justify-center
                  rounded font-bold text-[clamp(8px,2.5vw,15px)]
                  transition-colors duration-100 cursor-pointer
                  ${bg ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"}
                  hover:opacity-90
                `}
                style={{ backgroundColor: bg }}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>

      {/* Word list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {puzzle.words.map((w) => (
          <div
            key={w.word}
            className={`text-sm font-semibold px-2 py-1 rounded transition-all ${
              w.found
                ? "line-through opacity-50"
                : "text-slate-800 dark:text-slate-200"
            }`}
            style={w.found ? { color: w.color } : {}}
          >
            {w.word}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function WordSearchProGame({
  title = "Word Search Pro",
  description = "Find all the hidden words in the letter grid! Words are hidden horizontally, vertically, and diagonally. Choose your difficulty and category.",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p>
          Word Search Pro challenges you to find 8 hidden words in a grid of letters. Words can be placed
          horizontally (left to right), vertically (top to bottom), or diagonally (down-right).
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Choose a difficulty: Easy (10×10), Medium (12×12), or Hard (15×15).</li>
          <li>A random category is selected — Animals, Countries, Fruits, Sports, or Tech.</li>
          <li>Click and drag from the first letter to the last letter of a word.</li>
          <li>Release when you've highlighted the complete word.</li>
          <li>Found words are highlighted and struck through in the word list.</li>
          <li>Find all 8 words to win!</li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips & Strategies</h2>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Scan first letters:</strong> Pick one word and scan the grid for its first letter. Then check all directions from that letter.</li>
          <li><strong>Look for uncommon letters:</strong> Letters like Q, X, Z, and J are rare. If a word contains one, it's easy to spot in the grid.</li>
          <li><strong>Work systematically:</strong> Go row by row looking for the first letter of each word rather than randomly scanning.</li>
          <li><strong>Start with Easy:</strong> Easy grids are 10×10, making words easier to spot. Build your strategy before moving up.</li>
          <li><strong>Use the word list:</strong> The word list is always visible below the grid. Check it often to remember which words you still need to find.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Can words appear backwards?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              In this version, words are placed left-to-right horizontally, top-to-bottom vertically, and top-left to bottom-right diagonally. Backwards placement is not used, keeping the game accessible.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">How do I select on mobile?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Touch the first letter of the word and drag your finger to the last letter, then release. The selection highlights in real time as you drag.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Does the category change each game?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — a random category (Animals, Countries, Fruits, Sports, or Tech) is chosen for each new puzzle. The category is shown above the grid. Click "New Puzzle" to get a different category.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">What is the elapsed time for?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The timer counts up from zero so you can track how long it takes to solve each puzzle. There's no penalty for taking longer — it's there to challenge yourself to beat your personal best.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<WordSearchBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
