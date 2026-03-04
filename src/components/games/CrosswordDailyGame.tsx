import { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ================================================================
// TYPES
// ================================================================
interface CellData {
  letter: string;
  isBlack: boolean;
  number?: number;
  acrossWord?: number;
  downWord?: number;
}

interface Clue {
  id: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  length: number;
}

interface PuzzleDefinition {
  title: string;
  grid: string[];
  clues: { across: Clue[]; down: Clue[] };
}

// ================================================================
// PUZZLE DATA (3 complete puzzles)
// ================================================================
const PUZZLES: PuzzleDefinition[] = [
  {
    title: "Puzzle #1 - Nature",
    grid: [
      "##STAR#MOON##",
      "#RIVER#NIGHT#",
      "EARTH#FOREST##",
      "#WATER#STORM#",
      "##WIND#CLOUD##",
      "#####OCEAN###",
    ],
    clues: {
      across: [
        { id: 1, direction: "across", clue: "Celestial body that shines at night", answer: "STAR", startRow: 0, startCol: 2, length: 4 },
        { id: 2, direction: "across", clue: "Earth's natural satellite", answer: "MOON", startRow: 0, startCol: 7, length: 4 },
        { id: 3, direction: "across", clue: "Flowing body of water", answer: "RIVER", startRow: 1, startCol: 1, length: 5 },
        { id: 4, direction: "across", clue: "Time after sunset", answer: "NIGHT", startRow: 1, startCol: 7, length: 5 },
        { id: 5, direction: "across", clue: "Our home planet", answer: "EARTH", startRow: 2, startCol: 0, length: 5 },
        { id: 6, direction: "across", clue: "Large wooded area", answer: "FOREST", startRow: 2, startCol: 6, length: 6 },
        { id: 7, direction: "across", clue: "H2O in liquid form", answer: "WATER", startRow: 3, startCol: 1, length: 5 },
        { id: 8, direction: "across", clue: "Violent weather event", answer: "STORM", startRow: 3, startCol: 7, length: 5 },
        { id: 9, direction: "across", clue: "Moving air", answer: "WIND", startRow: 4, startCol: 2, length: 4 },
        { id: 10, direction: "across", clue: "Water vapor in the sky", answer: "CLOUD", startRow: 4, startCol: 7, length: 5 },
        { id: 11, direction: "across", clue: "Vast body of saltwater", answer: "OCEAN", startRow: 5, startCol: 5, length: 5 },
      ],
      down: [
        { id: 12, direction: "down", clue: "Dirt and soil", answer: "EARTH", startRow: 2, startCol: 0, length: 3 },
        { id: 13, direction: "down", clue: "Bright light source", answer: "STAR", startRow: 0, startCol: 2, length: 4 },
      ],
    },
  },
  {
    title: "Puzzle #2 - Animals",
    grid: [
      "##LION##WOLF##",
      "#TIGER#BEAR##",
      "EAGLE#HORSE###",
      "#SHARK#FOXES#",
      "##DEER#WHALE##",
      "###OTTER#####",
    ],
    clues: {
      across: [
        { id: 1, direction: "across", clue: "King of the jungle", answer: "LION", startRow: 0, startCol: 2, length: 4 },
        { id: 2, direction: "across", clue: "Wild canine predator", answer: "WOLF", startRow: 0, startCol: 7, length: 4 },
        { id: 3, direction: "across", clue: "Striped big cat", answer: "TIGER", startRow: 1, startCol: 1, length: 5 },
        { id: 4, direction: "across", clue: "Large omnivore mammal", answer: "BEAR", startRow: 1, startCol: 7, length: 4 },
        { id: 5, direction: "across", clue: "Bird of prey with keen sight", answer: "EAGLE", startRow: 2, startCol: 0, length: 5 },
        { id: 6, direction: "across", clue: "Domesticated riding animal", answer: "HORSE", startRow: 2, startCol: 6, length: 5 },
        { id: 7, direction: "across", clue: "Apex ocean predator", answer: "SHARK", startRow: 3, startCol: 1, length: 5 },
        { id: 8, direction: "across", clue: "Cunning red mammals (plural)", answer: "FOXES", startRow: 3, startCol: 7, length: 5 },
        { id: 9, direction: "across", clue: "Graceful antlered animal", answer: "DEER", startRow: 4, startCol: 2, length: 4 },
        { id: 10, direction: "across", clue: "Largest ocean mammal", answer: "WHALE", startRow: 4, startCol: 7, length: 5 },
        { id: 11, direction: "across", clue: "Playful semi-aquatic mammal", answer: "OTTER", startRow: 5, startCol: 3, length: 5 },
      ],
      down: [
        { id: 12, direction: "down", clue: "Large bird symbol of America", answer: "EAGLE", startRow: 2, startCol: 0, length: 3 },
        { id: 13, direction: "down", clue: "Mane-bearing cat", answer: "LION", startRow: 0, startCol: 2, length: 4 },
      ],
    },
  },
  {
    title: "Puzzle #3 - Technology",
    grid: [
      "##CODE#DATA###",
      "#CLOUD#BYTE##",
      "PIXEL#INPUT###",
      "#QUERY#LOGIC#",
      "##NODE#ARRAY##",
      "###CACHE#####",
    ],
    clues: {
      across: [
        { id: 1, direction: "across", clue: "Programming instructions", answer: "CODE", startRow: 0, startCol: 2, length: 4 },
        { id: 2, direction: "across", clue: "Information stored digitally", answer: "DATA", startRow: 0, startCol: 7, length: 4 },
        { id: 3, direction: "across", clue: "Internet-based storage", answer: "CLOUD", startRow: 1, startCol: 1, length: 5 },
        { id: 4, direction: "across", clue: "8 bits of data", answer: "BYTE", startRow: 1, startCol: 7, length: 4 },
        { id: 5, direction: "across", clue: "Smallest unit of an image", answer: "PIXEL", startRow: 2, startCol: 0, length: 5 },
        { id: 6, direction: "across", clue: "Data entered into a system", answer: "INPUT", startRow: 2, startCol: 6, length: 5 },
        { id: 7, direction: "across", clue: "Database search request", answer: "QUERY", startRow: 3, startCol: 1, length: 5 },
        { id: 8, direction: "across", clue: "Reasoning process in computing", answer: "LOGIC", startRow: 3, startCol: 7, length: 5 },
        { id: 9, direction: "across", clue: "JavaScript runtime environment", answer: "NODE", startRow: 4, startCol: 2, length: 4 },
        { id: 10, direction: "across", clue: "Collection of indexed items", answer: "ARRAY", startRow: 4, startCol: 7, length: 5 },
        { id: 11, direction: "across", clue: "Temporary fast storage", answer: "CACHE", startRow: 5, startCol: 3, length: 5 },
      ],
      down: [
        { id: 12, direction: "down", clue: "Smallest visible element", answer: "PIXEL", startRow: 2, startCol: 0, length: 3 },
        { id: 13, direction: "down", clue: "Programming instructions", answer: "CODE", startRow: 0, startCol: 2, length: 4 },
      ],
    },
  },
];

// ================================================================
// MINI CROSSWORD GRID (simplified 13x6 approach for better UX)
// ================================================================

// Build a real crossword using a flat word list approach
interface FlatClue {
  id: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
}

const SIMPLE_PUZZLES: { title: string; size: number; clues: FlatClue[] }[] = [
  {
    title: "Nature",
    size: 10,
    clues: [
      { id: 1, direction: "across", clue: "Our home planet", answer: "EARTH", row: 0, col: 0 },
      { id: 2, direction: "across", clue: "Flowing body of water", answer: "RIVER", row: 2, col: 1 },
      { id: 3, direction: "across", clue: "Large body of salt water", answer: "OCEAN", row: 4, col: 0 },
      { id: 4, direction: "across", clue: "Moving air outside", answer: "WIND", row: 6, col: 2 },
      { id: 5, direction: "across", clue: "Earth's natural satellite", answer: "MOON", row: 8, col: 3 },
      { id: 6, direction: "down", clue: "Bright point in night sky", answer: "EROSION", row: 0, col: 0 },
      { id: 7, direction: "down", clue: "Tall woody plant", answer: "TREE", row: 0, col: 4 },
      { id: 8, direction: "down", clue: "Atmospheric water drops", answer: "RAIN", row: 2, col: 1 },
      { id: 9, direction: "down", clue: "King of the jungle", answer: "LION", row: 4, col: 3 },
      { id: 10, direction: "down", clue: "White flakes from sky", answer: "SNOW", row: 4, col: 0 },
    ],
  },
];

// ================================================================
// REAL SIMPLE CROSSWORD STATE
// ================================================================
const REAL_PUZZLE = {
  title: "Daily Crossword",
  rows: 9,
  cols: 11,
  clues: [
    { id: 1, direction: "across" as const, clue: "Our home planet", answer: "EARTH", row: 0, col: 0 },
    { id: 2, direction: "across" as const, clue: "Large body of salt water", answer: "OCEAN", row: 2, col: 0 },
    { id: 3, direction: "across" as const, clue: "Opposite of night", answer: "DAY", row: 4, col: 2 },
    { id: 4, direction: "across" as const, clue: "Hot glowing gas ball in sky", answer: "SUN", row: 6, col: 4 },
    { id: 5, direction: "across" as const, clue: "Moving air", answer: "WIND", row: 8, col: 1 },
    { id: 6, direction: "down" as const, clue: "Worn on head", answer: "HAT", row: 0, col: 0 },
    { id: 7, direction: "down" as const, clue: "Tall woody plant", answer: "TREE", row: 0, col: 4 },
    { id: 8, direction: "down" as const, clue: "Atmospheric precipitation", answer: "RAIN", row: 2, col: 2 },
    { id: 9, direction: "down" as const, clue: "Earth's natural satellite", answer: "MOON", row: 4, col: 6 },
    { id: 10, direction: "down" as const, clue: "White sky flakes", answer: "SNOW", row: 4, col: 4 },
  ],
};

const PUZZLES_SET = [
  {
    title: "Nature World",
    rows: 9,
    cols: 11,
    clues: [
      { id: 1, direction: "across" as const, clue: "Our home planet", answer: "EARTH", row: 0, col: 0 },
      { id: 2, direction: "across" as const, clue: "Large body of salt water", answer: "OCEAN", row: 2, col: 0 },
      { id: 3, direction: "across" as const, clue: "Opposite of night", answer: "DAY", row: 4, col: 2 },
      { id: 4, direction: "across" as const, clue: "Hot glowing ball in sky", answer: "SUN", row: 6, col: 4 },
      { id: 5, direction: "across" as const, clue: "Moving air", answer: "WIND", row: 8, col: 1 },
      { id: 6, direction: "down" as const, clue: "Worn on head", answer: "EAR", row: 0, col: 0 },
      { id: 7, direction: "down" as const, clue: "Tall woody plant", answer: "TREE", row: 0, col: 4 },
      { id: 8, direction: "down" as const, clue: "Atmospheric precipitation", answer: "RAIN", row: 2, col: 0 },
      { id: 9, direction: "down" as const, clue: "Earth's natural satellite", answer: "MOON", row: 4, col: 6 },
      { id: 10, direction: "down" as const, clue: "White sky flakes", answer: "SNOW", row: 4, col: 4 },
    ],
  },
  {
    title: "Animals",
    rows: 9,
    cols: 11,
    clues: [
      { id: 1, direction: "across" as const, clue: "King of the jungle", answer: "LION", row: 0, col: 0 },
      { id: 2, direction: "across" as const, clue: "Striped big cat", answer: "TIGER", row: 2, col: 0 },
      { id: 3, direction: "across" as const, clue: "Largest land animal", answer: "ELEPHANT", row: 4, col: 0 },
      { id: 4, direction: "across" as const, clue: "Man's best friend", answer: "DOG", row: 6, col: 2 },
      { id: 5, direction: "across" as const, clue: "Fast spotted feline", answer: "CHEETAH", row: 8, col: 0 },
      { id: 6, direction: "down" as const, clue: "First letter; meal start", answer: "LUNCH", row: 0, col: 0 },
      { id: 7, direction: "down" as const, clue: "Ocean apex predator", answer: "TIGER", row: 0, col: 4 },
      { id: 8, direction: "down" as const, clue: "Apes' relative", answer: "IGUANA", row: 2, col: 2 },
      { id: 9, direction: "down" as const, clue: "Slow shelled reptile", answer: "NEWT", row: 4, col: 7 },
      { id: 10, direction: "down" as const, clue: "Nocturnal flying mammal", answer: "EAR", row: 4, col: 0 },
    ],
  },
  {
    title: "Technology",
    rows: 9,
    cols: 11,
    clues: [
      { id: 1, direction: "across" as const, clue: "Programming instructions", answer: "CODE", row: 0, col: 0 },
      { id: 2, direction: "across" as const, clue: "Internet-based storage", answer: "CLOUD", row: 2, col: 0 },
      { id: 3, direction: "across" as const, clue: "Database search command", answer: "QUERY", row: 4, col: 0 },
      { id: 4, direction: "across" as const, clue: "Set of indexed items", answer: "ARRAY", row: 6, col: 0 },
      { id: 5, direction: "across" as const, clue: "Temporary fast storage", answer: "CACHE", row: 8, col: 0 },
      { id: 6, direction: "down" as const, clue: "Smallest image unit", answer: "PIXEL", row: 0, col: 0 },
      { id: 7, direction: "down" as const, clue: "8 bits", answer: "BYTE", row: 0, col: 3 },
      { id: 8, direction: "down" as const, clue: "JS runtime environment", answer: "NODE", row: 2, col: 2 },
      { id: 9, direction: "down" as const, clue: "Reasoning in computing", answer: "LOGIC", row: 4, col: 4 },
      { id: 10, direction: "down" as const, clue: "Data entered to system", answer: "INPUT", row: 4, col: 0 },
    ],
  },
];

// ================================================================
// BUILD GRID FROM CLUES
// ================================================================
function buildGrid(rows: number, cols: number, clues: typeof PUZZLES_SET[0]["clues"]) {
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const numbers: (number | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const cellToClues: Map<string, number[]> = new Map();

  // Place letters
  for (const clue of clues) {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === "across" ? clue.row : clue.row + i;
      const c = clue.direction === "across" ? clue.col + i : clue.col;
      if (r < rows && c < cols) {
        grid[r][c] = clue.answer[i];
      }
    }
  }

  // Number cells
  for (const clue of clues) {
    const r = clue.row;
    const c = clue.col;
    if (r < rows && c < cols) {
      numbers[r][c] = clue.id;
    }
  }

  // Map cells to clue ids
  for (const clue of clues) {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === "across" ? clue.row : clue.row + i;
      const c = clue.direction === "across" ? clue.col + i : clue.col;
      const key = `${r},${c}`;
      const existing = cellToClues.get(key) ?? [];
      if (!existing.includes(clue.id)) {
        cellToClues.set(key, [...existing, clue.id]);
      }
    }
  }

  return { grid, numbers, cellToClues };
}

// ================================================================
// CROSSWORD GAME WIDGET
// ================================================================
function CrosswordWidget() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<"across" | "down">("across");
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [checkedCells, setCheckedCells] = useState<Map<string, boolean>>(new Map());
  const [score, setScore] = useState(1000);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const puzzle = PUZZLES_SET[puzzleIndex];
  const { grid: answerGrid, numbers, cellToClues } = buildGrid(puzzle.rows, puzzle.cols, puzzle.clues);

  const initGame = useCallback(() => {
    setUserGrid(Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill("")));
    setSelectedCell(null);
    setRevealedCells(new Set());
    setCheckedCells(new Map());
    setScore(1000);
    setTimer(0);
    setGameOver(false);
    setShowCongrats(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  }, [puzzle.rows, puzzle.cols]);

  useEffect(() => {
    initGame();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [puzzleIndex]);

  const isWhiteCell = (r: number, c: number) => answerGrid[r][c] !== null;

  const getActiveClueId = () => {
    if (!selectedCell) return null;
    const [r, c] = selectedCell;
    const key = `${r},${c}`;
    const clueIds = cellToClues.get(key) ?? [];
    const clue = puzzle.clues.find((cl) => clueIds.includes(cl.id) && cl.direction === selectedDirection);
    return clue?.id ?? null;
  };

  const getActiveCells = (): Set<string> => {
    const activeId = getActiveClueId();
    if (activeId === null) return new Set();
    const clue = puzzle.clues.find((cl) => cl.id === activeId);
    if (!clue) return new Set();
    const cells = new Set<string>();
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === "across" ? clue.row : clue.row + i;
      const c = clue.direction === "across" ? clue.col + i : clue.col;
      cells.add(`${r},${c}`);
    }
    return cells;
  };

  const handleCellClick = (r: number, c: number) => {
    if (!isWhiteCell(r, c)) return;
    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      setSelectedDirection((d) => (d === "across" ? "down" : "across"));
    } else {
      setSelectedCell([r, c]);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell || gameOver) return;
    const [r, c] = selectedCell;
    const key = e.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
      const next = userGrid.map((row) => [...row]);
      next[r][c] = key;
      setUserGrid(next);
      const newChecked = new Map(checkedCells);
      newChecked.delete(`${r},${c}`);
      setCheckedCells(newChecked);
      // Advance cursor
      if (selectedDirection === "across" && c + 1 < puzzle.cols && isWhiteCell(r, c + 1)) {
        setSelectedCell([r, c + 1]);
      } else if (selectedDirection === "down" && r + 1 < puzzle.rows && isWhiteCell(r + 1, c)) {
        setSelectedCell([r + 1, c]);
      }
    } else if (key === "BACKSPACE") {
      e.preventDefault();
      const next = userGrid.map((row) => [...row]);
      if (next[r][c] === "") {
        if (selectedDirection === "across" && c - 1 >= 0 && isWhiteCell(r, c - 1)) {
          next[r][c - 1] = "";
          setSelectedCell([r, c - 1]);
        } else if (selectedDirection === "down" && r - 1 >= 0 && isWhiteCell(r - 1, c)) {
          next[r - 1][c] = "";
          setSelectedCell([r - 1, c]);
        }
      } else {
        next[r][c] = "";
      }
      setUserGrid(next);
    } else if (key === "ARROWRIGHT") setSelectedCell([r, Math.min(c + 1, puzzle.cols - 1)]);
    else if (key === "ARROWLEFT") setSelectedCell([r, Math.max(c - 1, 0)]);
    else if (key === "ARROWDOWN") setSelectedCell([Math.min(r + 1, puzzle.rows - 1), c]);
    else if (key === "ARROWUP") setSelectedCell([Math.max(r - 1, 0), c]);
  }, [selectedCell, userGrid, selectedDirection, puzzle, checkedCells, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCheck = () => {
    const newChecked = new Map<string, boolean>();
    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        if (isWhiteCell(r, c) && userGrid[r]?.[c]) {
          const correct = userGrid[r][c] === answerGrid[r][c];
          newChecked.set(`${r},${c}`, correct);
          if (!correct) setScore((s) => Math.max(0, s - 10));
        }
      }
    }
    setCheckedCells(newChecked);
  };

  const handleReveal = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const ans = answerGrid[r][c];
    if (!ans) return;
    const next = userGrid.map((row) => [...row]);
    next[r][c] = ans;
    setUserGrid(next);
    setRevealedCells((prev) => new Set([...prev, `${r},${c}`]));
    setScore((s) => Math.max(0, s - 50));
  };

  const handleRevealAll = () => {
    const next: string[][] = [];
    for (let r = 0; r < puzzle.rows; r++) {
      next[r] = [];
      for (let c = 0; c < puzzle.cols; c++) {
        next[r][c] = answerGrid[r][c] ?? "";
      }
    }
    setUserGrid(next);
    setScore(0);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const checkCompletion = () => {
    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        if (isWhiteCell(r, c) && userGrid[r]?.[c] !== answerGrid[r][c]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (userGrid.length > 0 && checkCompletion()) {
      setShowCongrats(true);
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [userGrid]);

  const activeCells = getActiveCells();
  const activeClueId = getActiveClueId();
  const activeClue = puzzle.clues.find((cl) => cl.id === activeClueId);
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <select
            value={puzzleIndex}
            onChange={(e) => setPuzzleIndex(Number(e.target.value))}
            className="text-sm border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          >
            {PUZZLES_SET.map((p, i) => (
              <option key={i} value={i}>{p.title}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{formatTime(timer)}</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Score: {score}</span>
        </div>
      </div>

      {/* Active Clue Display */}
      <div className="w-full mb-3 min-h-[2.5rem] px-4 py-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl border border-indigo-200 dark:border-indigo-800">
        {activeClue ? (
          <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
            <span className="font-black">{activeClue.id} {activeClue.direction === "across" ? "Across" : "Down"}:</span> {activeClue.clue}
          </p>
        ) : (
          <p className="text-sm text-slate-400">Click a cell to see the clue</p>
        )}
      </div>

      {/* Grid */}
      <div
        className="inline-grid border-2 border-slate-800 dark:border-slate-300 mb-4"
        style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 36px)` }}
      >
        {Array.from({ length: puzzle.rows }).map((_, r) =>
          Array.from({ length: puzzle.cols }).map((_, c) => {
            const white = isWhiteCell(r, c);
            const key = `${r},${c}`;
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isActive = activeCells.has(key);
            const isRevealed = revealedCells.has(key);
            const checkResult = checkedCells.get(key);
            const userLetter = userGrid[r]?.[c] ?? "";
            const num = numbers[r][c];

            let bgClass = "bg-slate-900 dark:bg-slate-950";
            if (white) {
              if (isSelected) bgClass = "bg-blue-400 dark:bg-blue-500";
              else if (isActive) bgClass = "bg-blue-100 dark:bg-blue-900";
              else if (checkResult === true) bgClass = "bg-emerald-100 dark:bg-emerald-900";
              else if (checkResult === false) bgClass = "bg-red-100 dark:bg-red-900";
              else bgClass = "bg-white dark:bg-slate-800";
            }

            return (
              <div
                key={key}
                onClick={() => handleCellClick(r, c)}
                className={`relative w-9 h-9 border border-slate-300 dark:border-slate-600 flex items-end justify-center pb-0.5 cursor-pointer transition-colors ${bgClass}`}
              >
                {num && (
                  <span className="absolute top-0 left-0.5 text-[8px] font-bold text-slate-600 dark:text-slate-300 leading-none">
                    {num}
                  </span>
                )}
                {white && (
                  <span className={`text-sm font-bold leading-none ${isRevealed ? "text-indigo-600 dark:text-indigo-400" : isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                    {userLetter}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={handleCheck}
          className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Check Answers
        </button>
        <button
          onClick={handleReveal}
          className="px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          title="Reveal selected cell (-50 pts)"
        >
          Reveal Letter (-50)
        </button>
        <button
          onClick={handleRevealAll}
          className="px-4 py-2 text-sm font-bold bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Reveal All
        </button>
        <button
          onClick={initGame}
          className="px-4 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Clue Lists */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["across", "down"] as const).map((dir) => (
          <div key={dir}>
            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
              {dir === "across" ? "Across" : "Down"}
            </h3>
            <ul className="space-y-1">
              {puzzle.clues.filter((cl) => cl.direction === dir).map((cl) => (
                <li
                  key={cl.id}
                  onClick={() => {
                    setSelectedCell([cl.row, cl.col]);
                    setSelectedDirection(dir);
                  }}
                  className={`text-xs cursor-pointer px-2 py-1 rounded transition-colors ${activeClueId === cl.id ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <span className="font-bold mr-1">{cl.id}.</span> {cl.clue}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Congrats Overlay */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-black text-emerald-600 mb-2">Puzzle Solved!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-2">Time: {formatTime(timer)}</p>
            <p className="text-2xl font-black text-indigo-600 mb-6">Score: {score}</p>
            <button
              onClick={() => { setPuzzleIndex((i) => (i + 1) % PUZZLES_SET.length); }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              Next Puzzle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================================
// EDITORIAL
// ================================================================
function CrosswordEditorial() {
  return (
    <div className="space-y-6">
      <section id="how-to-play">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">How to Play Crossword Daily</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Click any white cell to select it. The highlighted row or column shows the active word. Type letters using your keyboard to fill in answers. Press Backspace to delete. Click the same cell again to toggle between Across and Down directions.
        </p>
      </section>
      <section id="scoring">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">Scoring System</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>Start with 1000 points</li>
          <li>Wrong letters checked: -10 points each</li>
          <li>Reveal Letter: -50 points</li>
          <li>Complete the puzzle without reveals for maximum score</li>
        </ul>
      </section>
      <section id="tips">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">Crossword Tips</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Start with clues you are confident about to fill in crossing letters. Short words (3 letters) are often the easiest entry points. Use Check Answers frequently to confirm correct letters before building on them.
        </p>
      </section>
    </div>
  );
}

// ================================================================
// PAGE EXPORT
// ================================================================
export default function CrosswordDailyGame() {
  return (
    <CalculatorVerticalLayout
      title="Crossword Daily"
      description="Play free daily crossword puzzles online. Classic crossword with multiple themed puzzles, clue navigation, score tracking, and reveal assistance. Challenge your vocabulary every day."
      canonical="https://www.smartkitnow.com/games/crossword-daily"
      widget={<CrosswordWidget />}
      editorial={<CrosswordEditorial />}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
