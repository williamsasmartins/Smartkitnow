import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type GamePhase = "setup" | "playing" | "won";

interface TangramPiece {
  id: number;
  name: string;
  points: [number, number][];
  color: string;
  x: number;
  y: number;
  rotation: number; // degrees, multiples of 45
  placed: boolean;
}

interface PuzzleTarget {
  id: number;
  name: string;
  silhouette: string; // SVG path string
  viewBox: string;
  solution: { id: number; x: number; y: number; rotation: number }[];
}

interface DragState {
  pieceId: number;
  startMouseX: number;
  startMouseY: number;
  startPieceX: number;
  startPieceY: number;
}

const LS_KEY = "hs_tangram-master";

// ─────────────────────────────────────────────────────────────────────────────
// Tangram piece definitions (normalized to 100x100 unit space)
// ─────────────────────────────────────────────────────────────────────────────
// Classic 7-piece tangram:
// - 2 large right triangles
// - 1 medium right triangle
// - 2 small right triangles
// - 1 square
// - 1 parallelogram

const INITIAL_PIECES: Omit<TangramPiece, "x" | "y" | "rotation" | "placed">[] = [
  {
    id: 0,
    name: "Large Triangle 1",
    points: [[0, 0], [100, 0], [50, 50]],
    color: "#EF4444",
  },
  {
    id: 1,
    name: "Large Triangle 2",
    points: [[0, 0], [100, 0], [50, 50]],
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Medium Triangle",
    points: [[0, 0], [70, 0], [35, 35]],
    color: "#10B981",
  },
  {
    id: 3,
    name: "Small Triangle 1",
    points: [[0, 0], [50, 0], [25, 25]],
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Small Triangle 2",
    points: [[0, 0], [50, 0], [25, 25]],
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Square",
    points: [[0, 0], [40, 0], [40, 40], [0, 40]],
    color: "#EC4899",
  },
  {
    id: 6,
    name: "Parallelogram",
    points: [[20, 0], [70, 0], [50, 30], [0, 30]],
    color: "#06B6D4",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Puzzle target silhouettes (SVG paths on 300x300 canvas)
// ─────────────────────────────────────────────────────────────────────────────
const PUZZLES: PuzzleTarget[] = [
  {
    id: 0,
    name: "House",
    viewBox: "0 0 300 300",
    silhouette: "M150 40 L260 130 L260 260 L40 260 L40 130 Z",
    solution: [
      { id: 0, x: 70, y: 40, rotation: 0 },
      { id: 1, x: 160, y: 40, rotation: 90 },
      { id: 2, x: 80, y: 130, rotation: 0 },
      { id: 3, x: 40, y: 200, rotation: 0 },
      { id: 4, x: 170, y: 200, rotation: 180 },
      { id: 5, x: 120, y: 200, rotation: 0 },
      { id: 6, x: 160, y: 130, rotation: 0 },
    ],
  },
  {
    id: 1,
    name: "Arrow",
    viewBox: "0 0 300 300",
    silhouette: "M150 30 L260 140 L210 140 L210 260 L90 260 L90 140 L40 140 Z",
    solution: [
      { id: 0, x: 40, y: 30, rotation: 0 },
      { id: 1, x: 150, y: 30, rotation: 90 },
      { id: 2, x: 90, y: 140, rotation: 0 },
      { id: 3, x: 40, y: 200, rotation: 0 },
      { id: 4, x: 190, y: 200, rotation: 180 },
      { id: 5, x: 130, y: 180, rotation: 0 },
      { id: 6, x: 150, y: 140, rotation: 0 },
    ],
  },
  {
    id: 2,
    name: "Fish",
    viewBox: "0 0 300 300",
    silhouette: "M40 150 L100 80 L200 80 L260 150 L200 220 L100 220 Z M40 150 L80 110 L80 190 Z",
    solution: [
      { id: 0, x: 80, y: 80, rotation: 0 },
      { id: 1, x: 160, y: 80, rotation: 90 },
      { id: 2, x: 100, y: 150, rotation: 0 },
      { id: 3, x: 40, y: 110, rotation: 315 },
      { id: 4, x: 40, y: 150, rotation: 45 },
      { id: 5, x: 180, y: 160, rotation: 0 },
      { id: 6, x: 130, y: 155, rotation: 0 },
    ],
  },
  {
    id: 3,
    name: "Mountain",
    viewBox: "0 0 300 300",
    silhouette: "M150 30 L260 240 L40 240 Z",
    solution: [
      { id: 0, x: 50, y: 100, rotation: 0 },
      { id: 1, x: 150, y: 100, rotation: 90 },
      { id: 2, x: 90, y: 160, rotation: 0 },
      { id: 3, x: 50, y: 200, rotation: 0 },
      { id: 4, x: 200, y: 200, rotation: 180 },
      { id: 5, x: 140, y: 190, rotation: 0 },
      { id: 6, x: 160, y: 160, rotation: 0 },
    ],
  },
  {
    id: 4,
    name: "Rocket",
    viewBox: "0 0 300 300",
    silhouette: "M150 20 L210 100 L210 240 L180 270 L150 240 L120 270 L90 240 L90 100 Z",
    solution: [
      { id: 0, x: 60, y: 20, rotation: 0 },
      { id: 1, x: 150, y: 20, rotation: 90 },
      { id: 2, x: 90, y: 100, rotation: 0 },
      { id: 3, x: 90, y: 200, rotation: 315 },
      { id: 4, x: 190, y: 200, rotation: 225 },
      { id: 5, x: 130, y: 150, rotation: 0 },
      { id: 6, x: 150, y: 100, rotation: 0 },
    ],
  },
  {
    id: 5,
    name: "Star",
    viewBox: "0 0 300 300",
    silhouette: "M150 20 L180 100 L260 100 L200 150 L220 240 L150 190 L80 240 L100 150 L40 100 L120 100 Z",
    solution: [
      { id: 0, x: 50, y: 60, rotation: 45 },
      { id: 1, x: 190, y: 60, rotation: 135 },
      { id: 2, x: 110, y: 100, rotation: 0 },
      { id: 3, x: 60, y: 180, rotation: 315 },
      { id: 4, x: 210, y: 180, rotation: 225 },
      { id: 5, x: 130, y: 160, rotation: 0 },
      { id: 6, x: 140, y: 100, rotation: 0 },
    ],
  },
  {
    id: 6,
    name: "Duck",
    viewBox: "0 0 300 300",
    silhouette: "M80 200 L80 140 Q100 80 160 80 Q210 80 230 120 L260 120 L240 150 L220 150 Q220 200 160 200 Z",
    solution: [
      { id: 0, x: 80, y: 130, rotation: 0 },
      { id: 1, x: 160, y: 80, rotation: 90 },
      { id: 2, x: 110, y: 160, rotation: 0 },
      { id: 3, x: 220, y: 120, rotation: 180 },
      { id: 4, x: 60, y: 170, rotation: 270 },
      { id: 5, x: 155, y: 160, rotation: 0 },
      { id: 6, x: 160, y: 130, rotation: 0 },
    ],
  },
  {
    id: 7,
    name: "Bridge",
    viewBox: "0 0 300 300",
    silhouette: "M30 230 L30 150 Q150 50 270 150 L270 230 Z",
    solution: [
      { id: 0, x: 30, y: 100, rotation: 0 },
      { id: 1, x: 170, y: 100, rotation: 90 },
      { id: 2, x: 100, y: 150, rotation: 0 },
      { id: 3, x: 40, y: 185, rotation: 0 },
      { id: 4, x: 210, y: 185, rotation: 180 },
      { id: 5, x: 130, y: 185, rotation: 0 },
      { id: 6, x: 160, y: 150, rotation: 0 },
    ],
  },
  {
    id: 8,
    name: "Boat",
    viewBox: "0 0 300 300",
    silhouette: "M50 240 L50 130 L150 50 L150 130 L250 130 L250 240 Z M50 240 L250 240",
    solution: [
      { id: 0, x: 50, y: 50, rotation: 0 },
      { id: 1, x: 150, y: 130, rotation: 90 },
      { id: 2, x: 90, y: 150, rotation: 0 },
      { id: 3, x: 50, y: 200, rotation: 0 },
      { id: 4, x: 200, y: 200, rotation: 180 },
      { id: 5, x: 130, y: 180, rotation: 0 },
      { id: 6, x: 155, y: 150, rotation: 0 },
    ],
  },
  {
    id: 9,
    name: "Crown",
    viewBox: "0 0 300 300",
    silhouette: "M30 240 L30 160 L80 100 L130 160 L150 100 L170 160 L220 100 L270 160 L270 240 Z",
    solution: [
      { id: 0, x: 30, y: 130, rotation: 45 },
      { id: 1, x: 190, y: 130, rotation: 135 },
      { id: 2, x: 110, y: 140, rotation: 0 },
      { id: 3, x: 60, y: 190, rotation: 0 },
      { id: 4, x: 200, y: 190, rotation: 180 },
      { id: 5, x: 130, y: 190, rotation: 0 },
      { id: 6, x: 150, y: 145, rotation: 45 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function loadProgress(): { solved: number[] } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { solved: [] };
    return JSON.parse(raw);
  } catch {
    return { solved: [] };
  }
}

function saveProgress(puzzleId: number): void {
  try {
    const prog = loadProgress();
    if (!prog.solved.includes(puzzleId)) {
      prog.solved.push(puzzleId);
      localStorage.setItem(LS_KEY, JSON.stringify(prog));
    }
  } catch {
    // ignore
  }
}

function pointsToSvgPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";
}

function getBoundingBox(pts: [number, number][]): { minX: number; minY: number; maxX: number; maxY: number } {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function createInitialPieces(): TangramPiece[] {
  // Arrange pieces in a column to the left of the target area
  return INITIAL_PIECES.map((def, i) => ({
    ...def,
    x: 20 + (i % 3) * 90,
    y: 20 + Math.floor(i / 3) * 80,
    rotation: 0,
    placed: false,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Piece SVG component
// ─────────────────────────────────────────────────────────────────────────────
interface PieceSvgProps {
  piece: TangramPiece;
  scale: number;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}

function PieceSvgEl({ piece, scale, isSelected, isDragging, onPointerDown }: PieceSvgProps) {
  const bb = getBoundingBox(piece.points);
  const w = (bb.maxX - bb.minX) * scale;
  const h = (bb.maxY - bb.minY) * scale;
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;

  return (
    <g
      transform={`translate(${piece.x * scale}, ${piece.y * scale}) rotate(${piece.rotation}, ${cx * scale}, ${cy * scale})`}
      style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
      onPointerDown={onPointerDown}
    >
      <polygon
        points={piece.points.map((p) => `${p[0] * scale},${p[1] * scale}`).join(" ")}
        fill={piece.color}
        stroke={isSelected ? "#FFF" : "rgba(255,255,255,0.4)"}
        strokeWidth={isSelected ? 3 : 1.5}
        opacity={piece.placed ? 0.9 : 1}
        style={{
          filter: isSelected ? `drop-shadow(0 0 8px ${piece.color})` : isDragging ? "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" : "none",
          transition: isDragging ? "none" : "filter 0.2s",
        }}
      />
      {isSelected && !piece.placed && (
        <polygon
          points={piece.points.map((p) => `${p[0] * scale},${p[1] * scale}`).join(" ")}
          fill="none"
          stroke="white"
          strokeWidth={1}
          opacity={0.4}
          strokeDasharray="4 2"
        />
      )}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Game UI
// ─────────────────────────────────────────────────────────────────────────────
function TangramGame() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleTarget>(PUZZLES[0]);
  const [pieces, setPieces] = useState<TangramPiece[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [won, setWon] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;
  const piecesRef = useRef(pieces);
  piecesRef.current = pieces;

  const SVG_W = 300;
  const SVG_H = 300;
  const SCALE = 1;
  const SNAP_DIST = 25;

  useEffect(() => {
    const prog = loadProgress();
    setSolvedPuzzles(prog.solved);
  }, []);

  const startPuzzle = useCallback((puzzle: PuzzleTarget) => {
    setCurrentPuzzle(puzzle);
    setPieces(createInitialPieces());
    setSelectedId(null);
    setDragging(null);
    setShowHint(false);
    setMoveCount(0);
    setWon(false);
    setPhase("playing");
  }, []);

  // Check win: all pieces close to their solution positions
  const checkWin = useCallback((currentPieces: TangramPiece[], puzzle: PuzzleTarget) => {
    const allPlaced = currentPieces.every((piece) => {
      const sol = puzzle.solution.find((s) => s.id === piece.id);
      if (!sol) return false;
      const dx = piece.x - sol.x;
      const dy = piece.y - sol.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rotDiff = Math.abs(((piece.rotation - sol.rotation) % 360 + 360) % 360);
      return dist < SNAP_DIST && (rotDiff < 30 || rotDiff > 330);
    });
    return allPlaced;
  }, [SNAP_DIST]);

  // Pointer event handlers on SVG
  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    const scaleY = SVG_H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [SVG_W, SVG_H]);

  const handlePiecePointerDown = useCallback((e: React.PointerEvent, pieceId: number) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const pt = getSvgPoint(e.clientX, e.clientY);
    const piece = piecesRef.current.find((p) => p.id === pieceId);
    if (!piece) return;

    setSelectedId(pieceId);
    setDragging({
      pieceId,
      startMouseX: pt.x,
      startMouseY: pt.y,
      startPieceX: piece.x,
      startPieceY: piece.y,
    });
  }, [getSvgPoint]);

  const handleSvgPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const pt = getSvgPoint(e.clientX, e.clientY);
    const { pieceId, startMouseX, startMouseY, startPieceX, startPieceY } = draggingRef.current;
    const dx = pt.x - startMouseX;
    const dy = pt.y - startMouseY;

    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, x: startPieceX + dx, y: startPieceY + dy } : p
      )
    );
  }, [getSvgPoint]);

  const handleSvgPointerUp = useCallback((_e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { pieceId } = draggingRef.current;
    setDragging(null);
    setMoveCount((c) => c + 1);

    // Check snap to solution
    setPieces((prev) => {
      const sol = currentPuzzle.solution.find((s) => s.id === pieceId);
      if (!sol) return prev;

      const piece = prev.find((p) => p.id === pieceId);
      if (!piece) return prev;

      const dx = piece.x - sol.x;
      const dy = piece.y - sol.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rotDiff = Math.abs(((piece.rotation - sol.rotation) % 360 + 360) % 360);
      const rotOk = rotDiff < 30 || rotDiff > 330;

      let newPieces: TangramPiece[];
      if (dist < SNAP_DIST && rotOk) {
        newPieces = prev.map((p) =>
          p.id === pieceId ? { ...p, x: sol.x, y: sol.y, rotation: sol.rotation, placed: true } : p
        );
      } else {
        newPieces = prev;
      }

      if (checkWin(newPieces, currentPuzzle)) {
        setWon(true);
        saveProgress(currentPuzzle.id);
        setSolvedPuzzles((s) => [...new Set([...s, currentPuzzle.id])]);
      }
      return newPieces;
    });
  }, [currentPuzzle, SNAP_DIST, checkWin]);

  const rotatePiece = useCallback((pieceId: number) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, rotation: (p.rotation + 45) % 360, placed: false } : p
      )
    );
    setMoveCount((c) => c + 1);
  }, []);

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    // Deselect if clicking empty space
    if ((e.target as Element) === svgRef.current) {
      setSelectedId(null);
    }
  }, []);

  // ─── SETUP SCREEN ──────────────────────────────────────────────────────────
  if (phase === "setup") {
    const prog = loadProgress();
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">🔷</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Tangram Master</h2>
          <p className="text-slate-500 dark:text-slate-400">Arrange 7 pieces to match the silhouette</p>
          <p className="text-sm text-slate-400 mt-1">{prog.solved.length}/{PUZZLES.length} puzzles solved</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-2xl">
          {PUZZLES.map((puzzle) => {
            const isSolved = solvedPuzzles.includes(puzzle.id);
            return (
              <button
                key={puzzle.id}
                onClick={() => startPuzzle(puzzle)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                  isSolved
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400"
                }`}
              >
                <svg viewBox={puzzle.viewBox} className="w-16 h-16">
                  <path d={puzzle.silhouette} fill="#6366f1" opacity="0.7" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{puzzle.name}</span>
                {isSolved && (
                  <span className="absolute top-1 right-1 text-xs bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── WON OVERLAY ───────────────────────────────────────────────────────────
  // ─── PLAYING SCREEN ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 py-4 px-2 select-none">
      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">{currentPuzzle.name}</span>
          <span className="text-sm text-slate-500">{moveCount} moves</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-all ${
              showHint
                ? "bg-indigo-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            {showHint ? "Hide Hint" : "Hint"}
          </button>
          <button
            onClick={() => startPuzzle(currentPuzzle)}
            className="px-3 py-1.5 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-semibold hover:bg-amber-200 transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Puzzles
          </button>
        </div>
      </div>

      {/* Instruction when piece selected */}
      {selectedId !== null && !won && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2 text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-3">
          <span>Piece selected: <strong>{pieces.find((p) => p.id === selectedId)?.name}</strong></span>
          <button
            onClick={() => rotatePiece(selectedId)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all"
          >
            Rotate 45°
          </button>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full max-w-sm rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 touch-none"
          style={{ cursor: dragging ? "grabbing" : "default" }}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onClick={handleSvgClick}
        >
          {/* Target silhouette */}
          <path
            d={currentPuzzle.silhouette}
            fill={showHint ? "#6366f1" : "#e2e8f0"}
            opacity={showHint ? 0.4 : 0.8}
            className="dark:fill-slate-700"
          />
          <path
            d={currentPuzzle.silhouette}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Solution ghost (when hint active) */}
          {showHint &&
            currentPuzzle.solution.map((sol) => {
              const pDef = INITIAL_PIECES.find((p) => p.id === sol.id);
              if (!pDef) return null;
              const bb = getBoundingBox(pDef.points);
              const cx = (bb.minX + bb.maxX) / 2;
              const cy = (bb.minY + bb.maxY) / 2;
              return (
                <g
                  key={sol.id}
                  transform={`translate(${sol.x * SCALE}, ${sol.y * SCALE}) rotate(${sol.rotation}, ${cx * SCALE}, ${cy * SCALE})`}
                  opacity="0.25"
                >
                  <polygon
                    points={pDef.points.map((p) => `${p[0] * SCALE},${p[1] * SCALE}`).join(" ")}
                    fill={pDef.color}
                  />
                </g>
              );
            })}

          {/* Pieces */}
          {pieces.map((piece) => (
            <PieceSvgEl
              key={piece.id}
              piece={piece}
              scale={SCALE}
              isSelected={selectedId === piece.id}
              isDragging={dragging?.pieceId === piece.id}
              onPointerDown={(e) => handlePiecePointerDown(e, piece.id)}
            />
          ))}

          {/* Win overlay */}
          {won && (
            <g>
              <rect width={SVG_W} height={SVG_H} fill="rgba(0,0,0,0.6)" rx="16" />
              <text x={SVG_W / 2} y={SVG_H / 2 - 20} textAnchor="middle" fill="#10B981" fontSize="28" fontWeight="bold">
                Solved!
              </text>
              <text x={SVG_W / 2} y={SVG_H / 2 + 15} textAnchor="middle" fill="white" fontSize="14">
                {moveCount} moves
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Rotate instruction */}
      <p className="text-xs text-slate-400 text-center">
        Click a piece to select it, then click <strong>Rotate 45°</strong> to rotate. Drag to move.
      </p>

      {/* Won actions */}
      {won && (
        <div className="flex gap-3">
          <button
            onClick={() => {
              const nextId = (currentPuzzle.id + 1) % PUZZLES.length;
              startPuzzle(PUZZLES[nextId]);
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            Next Puzzle
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl transition-all active:scale-95"
          >
            All Puzzles
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Editorial
// ─────────────────────────────────────────────────────────────────────────────
function TangramEditorial() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">How to Play Tangram Master</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Tangram is a 4,000-year-old Chinese dissection puzzle. Your goal is to arrange all 7 geometric pieces to exactly match the target silhouette shown in the center of the board.
        </p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">The 7 Pieces</h3>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
          <li>2 large right triangles</li>
          <li>1 medium right triangle</li>
          <li>2 small right triangles</li>
          <li>1 small square</li>
          <li>1 parallelogram</li>
        </ul>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">All 7 pieces must be used — no overlapping allowed.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Controls</h3>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
          <li>Click a piece to select it (it will highlight)</li>
          <li>Drag a piece to move it across the board</li>
          <li>Click the "Rotate 45°" button to rotate the selected piece</li>
          <li>Pieces snap into place when close to the correct position and angle</li>
          <li>Use the Hint button to see the solution outline</li>
        </ul>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tips</h3>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
          <li>Start with the large triangles — they occupy the most space</li>
          <li>The parallelogram can be flipped by rotating 180°</li>
          <li>Look at the silhouette corners to determine which triangle fits</li>
          <li>All 10 puzzles are unlocked from the start — try them in any order</li>
        </ul>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Export
// ─────────────────────────────────────────────────────────────────────────────
export default function TangramMasterGame() {
  return (
    <CalculatorVerticalLayout
      title="Tangram Master"
      description="Play free Tangram puzzles online. Arrange 7 classic geometric pieces to match silhouettes of houses, animals, and more. 10 puzzles with touch and mouse support."
      canonical="https://www.smartkitnow.com/games/tangram-master"
      widget={<TangramGame />}
      editorial={<TangramEditorial />}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
