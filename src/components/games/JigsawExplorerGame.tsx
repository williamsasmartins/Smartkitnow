import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "setup" | "playing" | "won";

interface PieceState {
  id: number;
  col: number;
  row: number;
  x: number;
  y: number;
  placed: boolean;
  trayIndex: number;
}

interface DragState {
  pieceId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { cols: number; rows: number; label: string }> = {
  easy: { cols: 4, rows: 4, label: "Easy (4×4)" },
  medium: { cols: 5, rows: 5, label: "Medium (5×5)" },
  hard: { cols: 6, rows: 6, label: "Hard (6×6)" },
};

const LS_KEY = "hs_jigsaw-explorer";

// ─────────────────────────────────────────────────────────────────────────────
// Abstract SVG art generator
// ─────────────────────────────────────────────────────────────────────────────
function generateAbstractSVG(seed: number): string {
  const shapes: string[] = [];
  const colors = [
    "#FF6B6B", "#FF8E53", "#FFD93D", "#6BCB77", "#4ECDC4",
    "#45B7D1", "#A855F7", "#EC4899", "#F97316", "#06B6D4",
    "#84CC16", "#EF4444", "#3B82F6", "#8B5CF6", "#F59E0B",
  ];

  const rng = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  // Background gradient
  const c1 = colors[Math.floor(rng(0) * colors.length)];
  const c2 = colors[Math.floor(rng(1) * colors.length)];
  shapes.push(`<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="rg1" cx="30%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:${colors[Math.floor(rng(2) * colors.length)]};stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
    </radialGradient>
    <radialGradient id="rg2" cx="70%" cy="70%" r="50%">
      <stop offset="0%" style="stop-color:${colors[Math.floor(rng(3) * colors.length)]};stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
    </radialGradient>
  </defs>`);

  shapes.push(`<rect width="400" height="400" fill="url(#bg)"/>`);
  shapes.push(`<rect width="400" height="400" fill="url(#rg1)"/>`);
  shapes.push(`<rect width="400" height="400" fill="url(#rg2)"/>`);

  // Circles
  for (let i = 0; i < 8; i++) {
    const cx = rng(10 + i) * 400;
    const cy = rng(20 + i) * 400;
    const r = 20 + rng(30 + i) * 80;
    const color = colors[Math.floor(rng(40 + i) * colors.length)];
    const opacity = 0.3 + rng(50 + i) * 0.5;
    shapes.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`);
  }

  // Polygons / triangles
  for (let i = 0; i < 5; i++) {
    const x1 = rng(60 + i) * 400;
    const y1 = rng(70 + i) * 400;
    const x2 = x1 + (rng(80 + i) - 0.5) * 200;
    const y2 = y1 + (rng(90 + i) - 0.5) * 200;
    const x3 = x1 + (rng(100 + i) - 0.5) * 200;
    const y3 = y1 + (rng(110 + i) - 0.5) * 200;
    const color = colors[Math.floor(rng(120 + i) * colors.length)];
    const opacity = 0.2 + rng(130 + i) * 0.4;
    shapes.push(`<polygon points="${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`);
  }

  // Rectangles
  for (let i = 0; i < 6; i++) {
    const x = rng(140 + i) * 350;
    const y = rng(150 + i) * 350;
    const w = 30 + rng(160 + i) * 120;
    const h = 30 + rng(170 + i) * 120;
    const color = colors[Math.floor(rng(180 + i) * colors.length)];
    const opacity = 0.15 + rng(190 + i) * 0.35;
    const rx = rng(200 + i) * 20;
    shapes.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${shapes.join("")}</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadHighScore(diff: Difficulty): number | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data[diff] ?? null;
  } catch {
    return null;
  }
}

function saveHighScore(diff: Difficulty, time: number): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const prev = data[diff];
    if (prev === undefined || time < prev) {
      data[diff] = time;
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    }
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Game UI
// ─────────────────────────────────────────────────────────────────────────────
function JigsawGame() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [time, setTime] = useState(0);
  const [svgSeed, setSvgSeed] = useState(42);
  const [placedCount, setPlacedCount] = useState(0);
  const [won, setWon] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const piecesRef = useRef(pieces);
  piecesRef.current = pieces;
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;

  const config = DIFFICULTY_CONFIG[difficulty];
  const totalPieces = config.cols * config.rows;

  // Cell size for the board
  const BOARD_SIZE = 360;
  const CELL_W = BOARD_SIZE / config.cols;
  const CELL_H = BOARD_SIZE / config.rows;
  const SNAP_THRESHOLD = Math.min(CELL_W, CELL_H) * 0.55;

  // Timer
  useEffect(() => {
    if (phase === "playing" && !won) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, won]);

  const startGame = useCallback((diff: Difficulty) => {
    const cfg = DIFFICULTY_CONFIG[diff];
    const total = cfg.cols * cfg.rows;
    const seed = Math.floor(Math.random() * 10000);
    setSvgSeed(seed);
    setDifficulty(diff);
    setBestTime(loadHighScore(diff));
    setNewRecord(false);
    setTime(0);
    setWon(false);
    setPlacedCount(0);

    // Shuffle tray indices
    const indices = Array.from({ length: total }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const newPieces: PieceState[] = Array.from({ length: total }, (_, id) => ({
      id,
      col: id % cfg.cols,
      row: Math.floor(id / cfg.cols),
      x: 0,
      y: 0,
      placed: false,
      trayIndex: indices[id],
    }));

    setPieces(newPieces);
    setPhase("playing");
  }, []);

  // Drag handlers
  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent, pieceId: number) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const piece = piecesRef.current.find((p) => p.id === pieceId);
    if (!piece || piece.placed) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    // Current piece screen position
    let pieceScreenX: number;
    let pieceScreenY: number;

    if (piece.placed) {
      pieceScreenX = boardRect.left + piece.col * CELL_W;
      pieceScreenY = boardRect.top + piece.row * CELL_H;
    } else {
      // Compute tray position
      const trayRect = trayRef.current?.getBoundingClientRect();
      if (!trayRect) return;
      const trayPerRow = Math.floor(trayRect.width / CELL_W) || 3;
      const trayCol = piece.trayIndex % trayPerRow;
      const trayRow = Math.floor(piece.trayIndex / trayPerRow);
      pieceScreenX = trayRect.left + trayCol * CELL_W;
      pieceScreenY = trayRect.top + trayRow * CELL_H;
    }

    setDragging({
      pieceId,
      startX: clientX,
      startY: clientY,
      offsetX: clientX - pieceScreenX,
      offsetY: clientY - pieceScreenY,
    });
  }, [CELL_W, CELL_H]);

  const onMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const { pieceId, offsetX, offsetY } = draggingRef.current;
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const x = clientX - offsetX - boardRect.left;
    const y = clientY - offsetY - boardRect.top;

    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, x, y } : p))
    );
  }, []);

  const onMouseUp = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggingRef.current) return;
    const { pieceId } = draggingRef.current;
    setDragging(null);

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    setPieces((prev) => {
      const piece = prev.find((p) => p.id === pieceId);
      if (!piece) return prev;

      // Target board position for this piece
      const targetX = piece.col * CELL_W;
      const targetY = piece.row * CELL_H;
      const dx = piece.x - targetX;
      const dy = piece.y - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let newPieces: PieceState[];
      if (dist < SNAP_THRESHOLD) {
        // Snap
        newPieces = prev.map((p) =>
          p.id === pieceId ? { ...p, x: targetX, y: targetY, placed: true } : p
        );
        const newPlaced = newPieces.filter((p) => p.placed).length;
        setPlacedCount(newPlaced);
        if (newPlaced === totalPieces) {
          setWon(true);
          setPhase("won");
          if (timerRef.current) clearInterval(timerRef.current);
          const currentTime = piecesRef.current.length; // time is in state
          // We use a callback form to get current time
          setTime((t) => {
            saveHighScore(difficulty, t);
            const prev2 = loadHighScore(difficulty);
            if (prev2 === null || t <= prev2) setNewRecord(true);
            return t;
          });
        }
      } else {
        newPieces = prev;
      }
      return newPieces;
    });
  }, [CELL_W, CELL_H, SNAP_THRESHOLD, totalPieces, difficulty]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onMouseMove, { passive: false });
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const svgString = generateAbstractSVG(svgSeed);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  // ─── SETUP SCREEN ───────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🧩</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Jigsaw Explorer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Drag pieces to reconstruct the abstract artwork</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => {
            const hs = loadHighScore(diff);
            const cfg = DIFFICULTY_CONFIG[diff];
            return (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-lg flex items-center justify-between ${
                  diff === "easy"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    : diff === "medium"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                }`}
              >
                <span>{cfg.label}</span>
                {hs !== null && (
                  <span className="text-sm font-medium opacity-80">Best: {formatTime(hs)}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── WON SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "won") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 px-4 text-center">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">Puzzle Complete!</h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-xs">
          <p className="text-slate-500 mb-2 text-sm uppercase font-semibold tracking-wider">Your Time</p>
          <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatTime(time)}</p>
          {newRecord && (
            <p className="text-emerald-600 font-bold mt-2 text-sm">New Personal Record!</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => startGame(difficulty)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            Play Again
          </button>
          <button
            onClick={() => setPhase("setup")}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold rounded-xl transition-all active:scale-95"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAYING SCREEN ─────────────────────────────────────────────────────────
  // Tray pieces (unplaced), sorted by trayIndex
  const trayPieces = pieces.filter((p) => !p.placed).sort((a, b) => a.trayIndex - b.trayIndex);
  const trayItemWidth = CELL_W;
  const trayItemHeight = CELL_H;

  // Find dragged piece
  const draggedPiece = dragging ? pieces.find((p) => p.id === dragging.pieceId) : null;

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-2 select-none touch-none">
      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-[800px] px-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{formatTime(time)}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{placedCount}/{totalPieces} placed</span>
        </div>
        <div className="flex items-center gap-2">
          {bestTime !== null && (
            <span className="text-sm text-amber-600 dark:text-amber-400 font-semibold">Best: {formatTime(bestTime)}</span>
          )}
          <button
            onClick={() => setPhase("setup")}
            className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Quit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[800px] h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(placedCount / totalPieces) * 100}%` }}
        />
      </div>

      {/* Main game area */}
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-center w-full max-w-[800px]">
        {/* Board */}
        <div
          ref={boardRef}
          className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0"
          style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
        >
          {/* Grid lines */}
          {Array.from({ length: config.rows }).map((_, r) =>
            Array.from({ length: config.cols }).map((_, c) => (
              <div
                key={`cell-${r}-${c}`}
                className="absolute border border-slate-200/60 dark:border-slate-600/60"
                style={{
                  left: c * CELL_W,
                  top: r * CELL_H,
                  width: CELL_W,
                  height: CELL_H,
                  backgroundImage: `url("${svgDataUrl}")`,
                  backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                  backgroundPosition: `-${c * CELL_W}px -${r * CELL_H}px`,
                  opacity: 0.25,
                }}
              />
            ))
          )}

          {/* Placed pieces */}
          {pieces
            .filter((p) => p.placed)
            .map((piece) => (
              <div
                key={piece.id}
                className="absolute pointer-events-none border border-white/30"
                style={{
                  left: piece.col * CELL_W,
                  top: piece.row * CELL_H,
                  width: CELL_W,
                  height: CELL_H,
                  backgroundImage: `url("${svgDataUrl}")`,
                  backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                  backgroundPosition: `-${piece.col * CELL_W}px -${piece.row * CELL_H}px`,
                  zIndex: 2,
                }}
              />
            ))}

          {/* Dragged piece on board */}
          {draggedPiece && (
            <div
              className="absolute pointer-events-none shadow-2xl border-2 border-indigo-400 z-50"
              style={{
                left: draggedPiece.x,
                top: draggedPiece.y,
                width: CELL_W,
                height: CELL_H,
                backgroundImage: `url("${svgDataUrl}")`,
                backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                backgroundPosition: `-${draggedPiece.col * CELL_W}px -${draggedPiece.row * CELL_H}px`,
                transform: "scale(1.08)",
              }}
            />
          )}
        </div>

        {/* Tray */}
        <div
          ref={trayRef}
          className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-3 min-h-[120px]"
          style={{ width: Math.min(BOARD_SIZE, 3 * trayItemWidth + 24) }}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Pieces Tray</p>
          <div
            className="flex flex-wrap gap-0"
          >
            {trayPieces.map((piece) => (
              <div
                key={piece.id}
                className="cursor-grab active:cursor-grabbing border border-white/50 hover:border-indigo-400 transition-all hover:scale-105 hover:z-10 relative"
                style={{
                  width: trayItemWidth,
                  height: trayItemHeight,
                  backgroundImage: `url("${svgDataUrl}")`,
                  backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                  backgroundPosition: `-${piece.col * CELL_W}px -${piece.row * CELL_H}px`,
                  visibility: dragging?.pieceId === piece.id ? "hidden" : "visible",
                }}
                onMouseDown={(e) => startDrag(e, piece.id)}
                onTouchStart={(e) => startDrag(e, piece.id)}
              />
            ))}
          </div>
          {trayPieces.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">All pieces placed!</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Editorial
// ─────────────────────────────────────────────────────────────────────────────
function JigsawEditorial() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">How to Play Jigsaw Explorer</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Jigsaw Explorer challenges you to reconstruct a unique abstract artwork from scrambled pieces. Each game generates a brand-new colorful image, so no two puzzles are ever the same.
        </p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Controls</h3>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
          <li>Click and drag pieces from the tray on the right</li>
          <li>Drop a piece near its correct position on the board to snap it in place</li>
          <li>Placed pieces lock permanently — only unplaced pieces can be moved</li>
          <li>Touch and drag is fully supported on mobile devices</li>
        </ul>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Difficulty Levels</h3>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
          <li><strong>Easy (4×4):</strong> 16 pieces — great for beginners</li>
          <li><strong>Medium (5×5):</strong> 25 pieces — a satisfying challenge</li>
          <li><strong>Hard (6×6):</strong> 36 pieces — test your patience and spatial memory</li>
        </ul>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Scoring</h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Your completion time is recorded for each difficulty level. Beat your personal best to earn a new record! High scores are saved locally in your browser.
        </p>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Export
// ─────────────────────────────────────────────────────────────────────────────
export default function JigsawExplorerGame() {
  return (
    <CalculatorVerticalLayout
      title="Jigsaw Explorer"
      description="Play a free online jigsaw puzzle game with beautiful abstract artwork. Choose from 3 difficulty levels and challenge your best time. No downloads required."
      canonical="https://www.smartkitnow.com/games/jigsaw-explorer"
      widget={<JigsawGame />}
      editorial={<JigsawEditorial />}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
