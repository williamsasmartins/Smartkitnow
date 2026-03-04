import React, { useCallback, useEffect, useRef, useState } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
type CellColor = string | null;
type Board = CellColor[][];
type PieceShape = [number, number][];

interface Piece {
  shape: PieceShape;
  color: string;
  gemType: number;
}

interface DragState {
  pieceIndex: number;
  offsetX: number;
  offsetY: number;
  currentCol: number;
  currentRow: number;
  active: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID_SIZE = 10;
const HS_KEY = "hs_block-puzzle-jewel";

const JEWEL_COLORS = [
  "#e53e3e", // ruby red
  "#3182ce", // sapphire blue
  "#38a169", // emerald green
  "#d69e2e", // topaz gold
  "#805ad5", // amethyst purple
  "#dd6b20", // amber orange
  "#00b5d8", // aquamarine
];

const GEM_SHAPES: PieceShape[] = [
  // 1x1
  [[0, 0]],
  // 2x1 horizontal
  [[0, 0], [0, 1]],
  // 1x2 vertical
  [[0, 0], [1, 0]],
  // 2x2 square
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  // 3x1 horizontal
  [[0, 0], [0, 1], [0, 2]],
  // 1x3 vertical
  [[0, 0], [1, 0], [2, 0]],
  // L shape
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  // J shape
  [[0, 1], [1, 1], [2, 1], [2, 0]],
  // T shape
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  // S shape
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  // Z shape
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  // Plus shape
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  // 2x3 block
  [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]],
  // Corner
  [[0, 0], [1, 0], [1, 1]],
  // Reverse corner
  [[0, 1], [1, 0], [1, 1]],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function emptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function randomPiece(): Piece {
  const shapeIdx = Math.floor(Math.random() * GEM_SHAPES.length);
  const colorIdx = Math.floor(Math.random() * JEWEL_COLORS.length);
  return {
    shape: GEM_SHAPES[shapeIdx],
    color: JEWEL_COLORS[colorIdx],
    gemType: colorIdx,
  };
}

function generateThreePieces(): Piece[] {
  return [randomPiece(), randomPiece(), randomPiece()];
}

function canPlacePiece(board: Board, piece: Piece, row: number, col: number): boolean {
  for (const [dr, dc] of piece.shape) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (board[r][c] !== null) return false;
  }
  return true;
}

function placePiece(board: Board, piece: Piece, row: number, col: number): Board {
  const next: Board = board.map(r => [...r]);
  for (const [dr, dc] of piece.shape) {
    next[row + dr][col + dc] = piece.color;
  }
  return next;
}

function clearCompletedLines(board: Board): { board: Board; cleared: number } {
  const completedRows = new Set<number>();
  const completedCols = new Set<number>();

  for (let r = 0; r < GRID_SIZE; r++) {
    if (board[r].every(cell => cell !== null)) completedRows.add(r);
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    if (board.every(row => row[c] !== null)) completedCols.add(c);
  }

  const cleared = completedRows.size + completedCols.size;
  if (cleared === 0) return { board, cleared: 0 };

  const next: Board = board.map((row, r) =>
    row.map((cell, c) =>
      completedRows.has(r) || completedCols.has(c) ? null : cell
    )
  );
  return { board: next, cleared };
}

function anyPieceFits(board: Board, pieces: (Piece | null)[]): boolean {
  for (const piece of pieces) {
    if (!piece) continue;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlacePiece(board, piece, r, c)) return true;
      }
    }
  }
  return false;
}

function getPieceSize(shape: PieceShape): { rows: number; cols: number } {
  const maxR = Math.max(...shape.map(([r]) => r));
  const maxC = Math.max(...shape.map(([, c]) => c));
  return { rows: maxR + 1, cols: maxC + 1 };
}

// ─── Gem SVG renderer ─────────────────────────────────────────────────────────
function GemCell({ color, size }: { color: string; size: number }) {
  const s = size;
  const pad = 2;
  const inner = s - pad * 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: "block" }}>
      <defs>
        <radialGradient id={`gem-${color.replace("#", "")}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </radialGradient>
        <filter id={`glow-${color.replace("#", "")}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={`${pad + inner / 2},${pad} ${pad + inner},${pad + inner * 0.35} ${pad + inner},${pad + inner * 0.65} ${pad + inner / 2},${pad + inner} ${pad},${pad + inner * 0.65} ${pad},${pad + inner * 0.35}`}
        fill={`url(#gem-${color.replace("#", "")})`}
        filter={`url(#glow-${color.replace("#", "")})`}
        stroke={color}
        strokeWidth="0.5"
        opacity="0.95"
      />
      <polygon
        points={`${pad + inner / 2},${pad + 2} ${pad + inner - 4},${pad + inner * 0.35} ${pad + inner / 2},${pad + inner * 0.5}`}
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
}

// ─── Piece Preview ─────────────────────────────────────────────────────────────
function PiecePreview({
  piece,
  cellSize,
  dim,
}: {
  piece: Piece | null;
  cellSize: number;
  dim: boolean;
}) {
  if (!piece) {
    return (
      <div
        style={{ width: cellSize * 5, height: cellSize * 5 }}
        className="flex items-center justify-center text-slate-500 text-xs"
      >
        Used
      </div>
    );
  }

  const { rows, cols } = getPieceSize(piece.shape);
  const w = cols * cellSize;
  const h = rows * cellSize;

  return (
    <div
      style={{
        width: cellSize * 5,
        height: cellSize * 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: dim ? 0.4 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ position: "relative", width: w, height: h }}>
        {piece.shape.map(([r, c], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * cellSize,
              top: r * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          >
            <GemCell color={piece.color} size={cellSize} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Game Component ───────────────────────────────────────────────────────
function BlockPuzzleJewelUI() {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [pieces, setPieces] = useState<(Piece | null)[]>(generateThreePieces());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [cellSize, setCellSize] = useState(36);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(HS_KEY);
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Responsive cell size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const availW = containerRef.current.clientWidth - 32;
        const size = Math.max(24, Math.min(40, Math.floor(availW / GRID_SIZE)));
        setCellSize(size);
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const saveHighScore = useCallback((s: number) => {
    const current = parseInt(localStorage.getItem(HS_KEY) || "0", 10);
    if (s > current) {
      localStorage.setItem(HS_KEY, String(s));
      setHighScore(s);
    }
  }, []);

  const tryPlacePiece = useCallback(
    (pieceIndex: number, row: number, col: number) => {
      const piece = pieces[pieceIndex];
      if (!piece) return;
      if (!canPlacePiece(board, piece, row, col)) return;

      const newBoard = placePiece(board, piece, row, col);
      const { board: clearedBoard, cleared } = clearCompletedLines(newBoard);

      const newPieces = pieces.map((p, i) => (i === pieceIndex ? null : p));

      // Flash cleared lines
      if (cleared > 0) {
        const flashing = new Set<string>();
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newBoard[r][c] !== null && clearedBoard[r][c] === null) {
              flashing.add(`${r}-${c}`);
            }
          }
        }
        setFlashCells(flashing);
        setTimeout(() => setFlashCells(new Set()), 400);
      }

      const lineScore = cleared * 100 * (cleared > 1 ? cleared : 1);
      const newCombo = cleared > 0 ? combo + 1 : 0;
      const comboBonus = newCombo > 1 ? newCombo * 50 : 0;
      const totalScore = score + piece.shape.length * 10 + lineScore + comboBonus;

      setBoard(clearedBoard);
      setScore(totalScore);
      setCombo(newCombo);
      saveHighScore(totalScore);
      setSelectedPiece(null);
      setHoverCell(null);

      // Replenish pieces if all used
      const finalPieces = newPieces.every(p => p === null)
        ? generateThreePieces()
        : newPieces;

      setPieces(finalPieces);

      // Check game over
      const activePieces = finalPieces.filter(Boolean) as Piece[];
      if (!anyPieceFits(clearedBoard, activePieces)) {
        setGameOver(true);
        saveHighScore(totalScore);
      }
    },
    [board, pieces, score, combo, saveHighScore]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameOver || selectedPiece === null) return;
      tryPlacePiece(selectedPiece, row, col);
    },
    [gameOver, selectedPiece, tryPlacePiece]
  );

  const handleCellEnter = useCallback(
    (row: number, col: number) => {
      if (selectedPiece === null) return;
      setHoverCell({ row, col });
    },
    [selectedPiece]
  );

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, pieceIndex: number) => {
      e.dataTransfer.effectAllowed = "move";
      setSelectedPiece(pieceIndex);
      setDragState({
        pieceIndex,
        offsetX: 0,
        offsetY: 0,
        currentCol: -1,
        currentRow: -1,
        active: true,
      });
    },
    []
  );

  const handleBoardDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!boardRef.current || dragState === null) return;
      const rect = boardRef.current.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / cellSize);
      const row = Math.floor((e.clientY - rect.top) / cellSize);
      setHoverCell({ row, col });
    },
    [cellSize, dragState]
  );

  const handleBoardDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!boardRef.current || dragState === null) return;
      const rect = boardRef.current.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / cellSize);
      const row = Math.floor((e.clientY - rect.top) / cellSize);
      tryPlacePiece(dragState.pieceIndex, row, col);
      setDragState(null);
    },
    [cellSize, dragState, tryPlacePiece]
  );

  // Touch support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, pieceIndex: number) => {
      e.preventDefault();
      setSelectedPiece(pieceIndex);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!boardRef.current || selectedPiece === null) return;
      const touch = e.touches[0];
      const rect = boardRef.current.getBoundingClientRect();
      const col = Math.floor((touch.clientX - rect.left) / cellSize);
      const row = Math.floor((touch.clientY - rect.top) / cellSize);
      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        setHoverCell({ row, col });
      }
    },
    [cellSize, selectedPiece]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!boardRef.current || selectedPiece === null || !hoverCell) return;
      tryPlacePiece(selectedPiece, hoverCell.row, hoverCell.col);
    },
    [selectedPiece, hoverCell, tryPlacePiece]
  );

  const resetGame = useCallback(() => {
    setBoard(emptyBoard());
    setPieces(generateThreePieces());
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setSelectedPiece(null);
    setHoverCell(null);
    setFlashCells(new Set());
  }, []);

  // Build hover overlay
  const hoverCells = new Set<string>();
  const hoverValid =
    hoverCell !== null && selectedPiece !== null && pieces[selectedPiece];
  if (hoverValid && hoverCell) {
    const piece = pieces[selectedPiece!]!;
    for (const [dr, dc] of piece.shape) {
      hoverCells.add(`${hoverCell.row + dr}-${hoverCell.col + dc}`);
    }
  }

  const isHoverValid =
    hoverCell !== null &&
    selectedPiece !== null &&
    pieces[selectedPiece] !== null &&
    canPlacePiece(board, pieces[selectedPiece]!, hoverCell.row, hoverCell.col);

  return (
    <div ref={containerRef} className="w-full select-none">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Score</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{score}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Best</div>
            <div className="text-2xl font-mono font-bold text-yellow-500">{highScore}</div>
          </div>
          {combo > 1 && (
            <div className="flex items-center">
              <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold animate-bounce">
                {combo}x Combo!
              </div>
            </div>
          )}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Game Over overlay */}
      {gameOver && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-center">
          <div className="text-xl font-bold text-red-500 mb-2">No More Moves!</div>
          <div className="text-slate-600 dark:text-slate-300 mb-3">
            Final Score: <span className="font-bold text-slate-900 dark:text-white">{score}</span>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Board */}
      <div className="flex justify-center mb-6">
        <div
          ref={boardRef}
          onDragOver={handleBoardDragOver}
          onDrop={handleBoardDrop}
          onMouseLeave={() => setHoverCell(null)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gap: "1px",
            background: "#1a1a2e",
            padding: "4px",
            borderRadius: "12px",
            border: "2px solid #2d2d5a",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
            cursor: selectedPiece !== null ? "crosshair" : "default",
          }}
        >
          {Array.from({ length: GRID_SIZE }, (_, row) =>
            Array.from({ length: GRID_SIZE }, (_, col) => {
              const key = `${row}-${col}`;
              const cellColor = board[row][col];
              const isHover = hoverCells.has(key);
              const isFlash = flashCells.has(key);

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(row, col)}
                  onMouseEnter={() => handleCellEnter(row, col)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: isFlash
                      ? "#ffffff"
                      : isHover
                      ? isHoverValid
                        ? "rgba(99,102,241,0.4)"
                        : "rgba(239,68,68,0.3)"
                      : cellColor
                      ? "transparent"
                      : "#16213e",
                    borderRadius: "3px",
                    transition: isFlash ? "none" : "background 0.1s",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: isHover
                      ? isHoverValid
                        ? "inset 0 0 0 2px rgba(99,102,241,0.8)"
                        : "inset 0 0 0 2px rgba(239,68,68,0.8)"
                      : "none",
                  }}
                >
                  {cellColor && !isFlash && (
                    <GemCell color={cellColor} size={cellSize} />
                  )}
                  {isHover && isHoverValid && pieces[selectedPiece!] && (
                    <GemCell color={pieces[selectedPiece!]!.color} size={cellSize} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Piece tray */}
      <div className="mt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
          {selectedPiece !== null
            ? "Click the board to place"
            : "Select a piece to place"}
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {pieces.map((piece, i) => (
            <div
              key={i}
              draggable={!!piece && !gameOver}
              onDragStart={e => piece && handleDragStart(e, i)}
              onTouchStart={e => piece && handleTouchStart(e, i)}
              onClick={() => {
                if (!piece || gameOver) return;
                setSelectedPiece(selectedPiece === i ? null : i);
              }}
              style={{
                background:
                  selectedPiece === i
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.05)",
                border:
                  selectedPiece === i
                    ? "2px solid rgba(99,102,241,0.8)"
                    : "2px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "8px",
                cursor: piece && !gameOver ? "grab" : "not-allowed",
                transition: "all 0.15s",
                boxShadow:
                  selectedPiece === i
                    ? "0 0 15px rgba(99,102,241,0.4)"
                    : "none",
                touchAction: "none",
              }}
            >
              <PiecePreview
                piece={piece}
                cellSize={Math.min(cellSize, 30)}
                dim={!piece || gameOver}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-4">
        Select a gem piece, then click the board — or drag &amp; drop. Complete rows/columns to clear and score!
      </p>
    </div>
  );
}

// ─── Editorial ────────────────────────────────────────────────────────────────
function HowToPlayBlockPuzzle() {
  return (
    <div className="space-y-10">
      <section id="how-to-play">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Play Block Puzzle Jewel</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Block Puzzle Jewel is a relaxing yet strategic puzzle game. You have a 10x10 jewel grid and must place gem-shaped pieces to complete rows and columns.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Three gem pieces are shown at the bottom of the board</li>
          <li>Click a piece to select it, then click the grid to place it</li>
          <li>Alternatively, drag and drop pieces directly onto the board</li>
          <li>When a full row <strong>or</strong> column is completed, it clears and scores points</li>
          <li>All three pieces must be placed before new ones appear</li>
          <li>The game ends when no remaining piece can fit anywhere on the board</li>
        </ul>
      </section>

      <section id="scoring">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Scoring System</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Placing a cell", points: "+10 per cell" },
            { label: "Clearing 1 line", points: "+100 points" },
            { label: "Clearing 2 lines at once", points: "+400 points" },
            { label: "Clearing 3+ lines", points: "Multiplied bonus" },
            { label: "Combo bonus", points: "+50 per combo level" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.points}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="strategy">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Strategy Tips</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Plan for both rows and columns", tip: "Always look for opportunities to clear lines in both directions simultaneously for big score multipliers." },
            { title: "Keep the center open", tip: "Pieces near the center give you the most flexibility for future placements in all directions." },
            { title: "Prioritize larger pieces first", tip: "Place big pieces while you have space, as the board fills up, large pieces become hard to fit." },
            { title: "Watch for combos", tip: "Clearing multiple lines in consecutive turns builds combo multipliers for massive bonus points." },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Does this game have a time limit?", a: "No! Block Puzzle Jewel is a relaxing, untimed experience. Take as long as you need to plan the perfect placement." },
            { q: "Can I undo a placement?", a: "Currently there is no undo feature — every placement is final, so think carefully before placing!" },
            { q: "When do I get new pieces?", a: "Once all three pieces in the tray have been placed, a fresh set of three random gem pieces appears automatically." },
            { q: "Is my high score saved?", a: "Yes! Your high score is saved locally in your browser and persists between sessions." },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.q}</h3>
              <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function BlockPuzzleJewelGame() {
  return (
    <CalculatorVerticalLayout
      title="Block Puzzle Jewel"
      description="Place jewel-shaped gem pieces on a 10x10 grid. Complete full rows and columns to clear them and score points. A relaxing, strategic block puzzle game with no time pressure."
      canonical="https://www.smartkitnow.com/games/block-puzzle-jewel"
      widget={<BlockPuzzleJewelUI />}
      editorial={<HowToPlayBlockPuzzle />}
      onThisPage={[
        { id: "how-to-play", label: "How to Play" },
        { id: "scoring", label: "Scoring System" },
        { id: "strategy", label: "Strategy Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
