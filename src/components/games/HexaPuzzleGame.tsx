import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ============================================================
// CONSTANTS & TYPES
// ============================================================

const GRID_COLS = 7;
const GRID_ROWS = 6;
const HEX_SIZE = 34; // radius of hex (center to vertex)
const HEX_W = HEX_SIZE * 2;
const HEX_H = Math.sqrt(3) * HEX_SIZE;
const PIECE_PREVIEW_SIZE = 26;

type HexCoord = [number, number]; // [col, row]

interface HexPiece {
  id: number;
  cells: HexCoord[]; // relative offsets from anchor [0,0]
  color: string;
}

type GridState = (string | null)[][];

// Color palette for pieces
const PIECE_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ef4444", // red
  "#06b6d4", // cyan
];

// ============================================================
// PIECE SHAPE DEFINITIONS (offsets as [col, row])
// ============================================================
const PIECE_SHAPES: HexCoord[][] = [
  // Single
  [[0, 0]],
  // Pair
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1]],
  // Triple line
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2]],
  // L-shape
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [0, 1]],
  [[0, 1], [1, 0], [1, 1]],
  // T-shape
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, -1]],
  // Z-shape
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 1], [1, 1], [1, 0], [2, 0]],
  // 4-straight
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  // Diamond (5)
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  // Plus (5)
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  // 3 diagonal
  [[0, 0], [1, 1], [2, 2]],
  // 2+1
  [[0, 0], [1, 0], [0, 2]],
];

let pieceIdCounter = 1;

function createPiece(): HexPiece {
  const shapeIdx = Math.floor(Math.random() * PIECE_SHAPES.length);
  const colorIdx = Math.floor(Math.random() * PIECE_COLORS.length);
  return {
    id: pieceIdCounter++,
    cells: PIECE_SHAPES[shapeIdx],
    color: PIECE_COLORS[colorIdx],
  };
}

function createInitialGrid(): GridState {
  return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
}

// ============================================================
// HEX MATH (pointy-top offset coordinates)
// ============================================================
function hexToPixel(col: number, row: number, size: number): [number, number] {
  const w = size * 2;
  const h = Math.sqrt(3) * size;
  const x = col * w * 0.75 + size;
  const y = row * h + (col % 2 === 1 ? h / 2 : 0) + h / 2;
  return [x, y];
}

function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(" ");
}

function getCellsOnGrid(piece: HexPiece, anchorCol: number, anchorRow: number): HexCoord[] {
  return piece.cells.map(([dc, dr]) => [anchorCol + dc, anchorRow + dr]);
}

function isValidPlacement(grid: GridState, piece: HexPiece, anchorCol: number, anchorRow: number): boolean {
  const cells = getCellsOnGrid(piece, anchorCol, anchorRow);
  return cells.every(([c, r]) =>
    r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS && grid[r][c] === null
  );
}

function placePiece(grid: GridState, piece: HexPiece, anchorCol: number, anchorRow: number): GridState {
  const newGrid: GridState = grid.map(row => [...row]);
  const cells = getCellsOnGrid(piece, anchorCol, anchorRow);
  cells.forEach(([c, r]) => {
    newGrid[r][c] = piece.color;
  });
  return newGrid;
}

function clearFullRows(grid: GridState): { newGrid: GridState; cleared: number } {
  let cleared = 0;
  const newGrid: GridState = grid.map(row => {
    if (row.every(cell => cell !== null)) {
      cleared++;
      return Array(GRID_COLS).fill(null);
    }
    return [...row];
  });
  return { newGrid, cleared };
}

function canAnyPieceFit(grid: GridState, pieces: (HexPiece | null)[]): boolean {
  return pieces.some(piece => {
    if (!piece) return false;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (isValidPlacement(grid, piece, c, r)) return true;
      }
    }
    return false;
  });
}

// ============================================================
// SVG PIECE PREVIEW (small, for the tray)
// ============================================================
function PiecePreview({
  piece,
  size,
  selected,
  onClick,
  disabled,
}: {
  piece: HexPiece | null;
  size: number;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  if (!piece) {
    return (
      <div
        className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700"
        style={{ width: 110, height: 110 }}
      />
    );
  }

  const w = size * 2;
  const h = Math.sqrt(3) * size;
  const allPoints = piece.cells.map(([dc, dr]) => hexToPixel(dc, dr, size));
  const minX = Math.min(...allPoints.map(p => p[0])) - size;
  const minY = Math.min(...allPoints.map(p => p[1])) - h / 2;
  const maxX = Math.max(...allPoints.map(p => p[0])) + size;
  const maxY = Math.max(...allPoints.map(p => p[1])) + h / 2;
  const svgW = maxX - minX + 4;
  const svgH = maxY - minY + 4;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border-2 flex items-center justify-center transition-all duration-150 p-1 ${
        selected
          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950 shadow-lg scale-105"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ width: 110, height: 110 }}
      aria-label={`Select piece ${piece.id}`}
    >
      <svg
        viewBox={`${minX - 2} ${minY - 2} ${svgW} ${svgH}`}
        style={{ width: "90%", height: "90%" }}
      >
        {piece.cells.map(([dc, dr], i) => {
          const [cx, cy] = hexToPixel(dc, dr, size);
          return (
            <polygon
              key={i}
              points={hexPoints(cx, cy, size - 1)}
              fill={piece.color}
              stroke="#fff"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </button>
  );
}

// ============================================================
// MAIN GAME COMPONENT
// ============================================================
function HexaPuzzle() {
  const [grid, setGrid] = useState<GridState>(createInitialGrid);
  const [pieces, setPieces] = useState<(HexPiece | null)[]>(() => [createPiece(), createPiece(), createPiece()]);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [hoverCell, setHoverCell] = useState<HexCoord | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("hs_hexa-puzzle") || "0", 10); } catch { return 0; }
  });
  const [gameOver, setGameOver] = useState(false);
  const [lastCleared, setLastCleared] = useState(0);

  const selectedPiece = selectedPieceIdx !== null ? pieces[selectedPieceIdx] : null;

  // Replenish pieces when all slots are empty
  useEffect(() => {
    if (pieces.every(p => p === null)) {
      const newPieces: (HexPiece | null)[] = [createPiece(), createPiece(), createPiece()];
      setPieces(newPieces);
      setSelectedPieceIdx(null);
    }
  }, [pieces]);

  // Check game over
  useEffect(() => {
    if (!gameOver && !canAnyPieceFit(grid, pieces)) {
      setGameOver(true);
    }
  }, [grid, pieces, gameOver]);

  const handleCellClick = useCallback((col: number, row: number) => {
    if (!selectedPiece || selectedPieceIdx === null || gameOver) return;
    if (!isValidPlacement(grid, selectedPiece, col, row)) return;

    const placed = placePiece(grid, selectedPiece, col, row);
    const { newGrid, cleared } = clearFullRows(placed);

    const rowScore = cleared * 100 + selectedPiece.cells.length * 10;
    const newScore = score + rowScore;

    setGrid(newGrid);
    setLastCleared(cleared);
    setScore(newScore);

    if (newScore > highScore) {
      setHighScore(newScore);
      try { localStorage.setItem("hs_hexa-puzzle", String(newScore)); } catch { /* ignore */ }
    }

    const newPieces: (HexPiece | null)[] = pieces.map((p, i) =>
      i === selectedPieceIdx ? null : p
    );
    setPieces(newPieces);
    setSelectedPieceIdx(null);
    setHoverCell(null);
  }, [grid, selectedPiece, selectedPieceIdx, score, highScore, pieces, gameOver]);

  const handleRestart = () => {
    setGrid(createInitialGrid());
    setPieces([createPiece(), createPiece(), createPiece()]);
    setSelectedPieceIdx(null);
    setHoverCell(null);
    setScore(0);
    setGameOver(false);
    setLastCleared(0);
  };

  // Compute SVG dimensions
  const svgWidth = GRID_COLS * HEX_W * 0.75 + HEX_W * 0.25 + 8;
  const svgHeight = GRID_ROWS * HEX_H + HEX_H / 2 + 8;

  // Compute preview cells
  const previewCells: Set<string> = new Set();
  let previewValid = false;
  if (selectedPiece && hoverCell) {
    const [hc, hr] = hoverCell;
    previewValid = isValidPlacement(grid, selectedPiece, hc, hr);
    if (previewValid) {
      getCellsOnGrid(selectedPiece, hc, hr).forEach(([c, r]) => {
        previewCells.add(`${c},${r}`);
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none py-4">
      {/* Score Bar */}
      <div className="flex gap-6 items-center flex-wrap justify-center">
        <div className="bg-indigo-600 text-white rounded-xl px-6 py-3 text-center shadow-lg">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80">Score</div>
          <div className="text-3xl font-extrabold font-mono">{score}</div>
        </div>
        <div className="bg-slate-800 text-white rounded-xl px-6 py-3 text-center shadow-lg">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80">Best</div>
          <div className="text-3xl font-extrabold font-mono">{highScore}</div>
        </div>
        {lastCleared > 0 && (
          <div className="bg-emerald-500 text-white rounded-xl px-4 py-3 text-center shadow-lg animate-pulse">
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Rows</div>
            <div className="text-3xl font-extrabold">+{lastCleared}</div>
          </div>
        )}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="w-full max-w-md bg-slate-900 border-2 border-indigo-500 rounded-2xl p-6 text-center shadow-2xl">
          <div className="text-3xl font-extrabold text-white mb-2">Game Over</div>
          <div className="text-slate-400 mb-1">No more moves available</div>
          <div className="text-xl text-indigo-400 font-bold mb-4">Final Score: {score}</div>
          <button
            onClick={handleRestart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-colors text-lg"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Hex Grid */}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: "block", cursor: selectedPiece ? "pointer" : "default" }}
          onMouseLeave={() => setHoverCell(null)}
        >
          {Array.from({ length: GRID_ROWS }, (_, row) =>
            Array.from({ length: GRID_COLS }, (_, col) => {
              const [cx, cy] = hexToPixel(col, row, HEX_SIZE);
              const key = `${col},${row}`;
              const isPreview = previewCells.has(key);
              const cellColor = grid[row][col];
              const isHoverAnchor = hoverCell && hoverCell[0] === col && hoverCell[1] === row;

              let fill = "#1e293b"; // default dark cell
              if (cellColor) fill = cellColor;
              else if (isPreview) fill = "#4ade80";

              let stroke = "#334155";
              if (isPreview) stroke = "#16a34a";
              if (cellColor) stroke = "rgba(255,255,255,0.15)";

              return (
                <polygon
                  key={key}
                  points={hexPoints(cx, cy, HEX_SIZE - 1.5)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isPreview ? 2 : 1}
                  style={{ transition: "fill 0.1s" }}
                  onClick={() => handleCellClick(col, row)}
                  onMouseEnter={() => setHoverCell([col, row])}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Piece Tray */}
      <div className="flex gap-4 items-center flex-wrap justify-center">
        {pieces.map((piece, idx) => (
          <PiecePreview
            key={idx}
            piece={piece}
            size={PIECE_PREVIEW_SIZE}
            selected={selectedPieceIdx === idx}
            onClick={() => {
              if (!piece || gameOver) return;
              setSelectedPieceIdx(prev => prev === idx ? null : idx);
            }}
            disabled={gameOver || !piece}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
        {selectedPiece
          ? "Hover over the grid to preview placement, then click to place."
          : "Select a piece below to begin placing it on the grid."}
      </p>

      {!gameOver && (
        <button
          onClick={handleRestart}
          className="text-xs text-slate-400 hover:text-red-400 underline transition-colors"
        >
          Restart
        </button>
      )}
    </div>
  );
}

// ============================================================
// PAGE EXPORT
// ============================================================
export default function HexaPuzzleGame() {
  return (
    <CalculatorVerticalLayout
      title="Hexa Puzzle"
      description="Free online hexagonal block puzzle game. Place hex-shaped pieces on a honeycomb grid, complete rows to score, and beat your high score in this endless puzzle challenge."
      canonical="https://www.smartkitnow.com/games/hexa-puzzle"
      widget={<HexaPuzzle />}
      editorial={
        <div>
          <h2>How to Play Hexa Puzzle</h2>
          <p>
            Hexa Puzzle is an addictive hexagonal block-placement game inspired by classic
            grid puzzlers. Your goal is to place hex-shaped pieces onto the honeycomb grid
            to complete full horizontal rows and score points.
          </p>

          <h3>Game Rules</h3>
          <ul>
            <li>
              <strong>Select a piece</strong> from the tray at the bottom by clicking it.
            </li>
            <li>
              <strong>Hover over the grid</strong> to see a green preview of where the piece
              will land. If placement is valid, the cells glow green.
            </li>
            <li>
              <strong>Click on the grid</strong> to place the selected piece.
            </li>
            <li>
              When an entire horizontal row is filled, it clears and you earn bonus points.
            </li>
            <li>
              Three new pieces appear in the tray only after all current pieces have been placed.
            </li>
            <li>
              The game ends when none of the available pieces can fit anywhere on the grid.
            </li>
          </ul>

          <h3>Scoring</h3>
          <ul>
            <li>Each cell placed: <strong>+10 points</strong></li>
            <li>Each row cleared: <strong>+100 points</strong></li>
            <li>Multiple rows cleared at once earn multiplied row bonuses.</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>
              Keep the center columns clear to allow longer pieces to fit more easily.
            </li>
            <li>
              Try to complete rows with each piece placement rather than filling random gaps.
            </li>
            <li>
              Odd-column hexagons are offset vertically due to the honeycomb layout — plan
              ahead for the stagger when positioning multi-cell pieces.
            </li>
            <li>
              Avoid creating isolated empty cells surrounded by filled hexagons, as no piece
              can fill a single isolated gap.
            </li>
          </ul>

          <h3>About the Hex Grid</h3>
          <p>
            The game uses pointy-top offset hexagonal coordinates. Each cell's pixel
            position is computed via the formula: <code>x = col × width × 0.75</code> and{" "}
            <code>y = row × height + (offset if odd column)</code>. This produces the
            characteristic honeycomb stagger. Pieces are defined as arrays of relative
            [column, row] offsets from an anchor cell.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
      hideLegalDisclaimer={true}
    />
  );
}
