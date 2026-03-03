import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ───────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type GameState = "SETUP" | "PLAYING" | "PAUSED" | "GAME_OVER";
type ViewMode = "EMBEDDED" | "THEATER" | "FULLSCREEN";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 20;

// Tetrominoes: [rotations][cells as [row,col] offsets]
const TETROMINOES: { shape: number[][][]; color: string }[] = [
  // I — cyan
  {
    shape: [
      [[0,0],[0,1],[0,2],[0,3]],
      [[0,0],[1,0],[2,0],[3,0]],
      [[0,0],[0,1],[0,2],[0,3]],
      [[0,0],[1,0],[2,0],[3,0]],
    ],
    color: "#00bcd4",
  },
  // O — yellow
  {
    shape: [
      [[0,0],[0,1],[1,0],[1,1]],
      [[0,0],[0,1],[1,0],[1,1]],
      [[0,0],[0,1],[1,0],[1,1]],
      [[0,0],[0,1],[1,0],[1,1]],
    ],
    color: "#ffeb3b",
  },
  // T — purple
  {
    shape: [
      [[0,1],[1,0],[1,1],[1,2]],
      [[0,0],[1,0],[1,1],[2,0]],
      [[1,0],[1,1],[1,2],[2,1]],
      [[0,1],[1,0],[1,1],[2,1]],
    ],
    color: "#9c27b0",
  },
  // S — green
  {
    shape: [
      [[0,1],[0,2],[1,0],[1,1]],
      [[0,0],[1,0],[1,1],[2,1]],
      [[0,1],[0,2],[1,0],[1,1]],
      [[0,0],[1,0],[1,1],[2,1]],
    ],
    color: "#4caf50",
  },
  // Z — red
  {
    shape: [
      [[0,0],[0,1],[1,1],[1,2]],
      [[0,1],[1,0],[1,1],[2,0]],
      [[0,0],[0,1],[1,1],[1,2]],
      [[0,1],[1,0],[1,1],[2,0]],
    ],
    color: "#f44336",
  },
  // J — blue
  {
    shape: [
      [[0,0],[1,0],[1,1],[1,2]],
      [[0,0],[0,1],[1,0],[2,0]],
      [[1,0],[1,1],[1,2],[2,2]],
      [[0,1],[1,1],[2,0],[2,1]],
    ],
    color: "#1565c0",
  },
  // L — orange
  {
    shape: [
      [[0,2],[1,0],[1,1],[1,2]],
      [[0,0],[1,0],[2,0],[2,1]],
      [[1,0],[1,1],[1,2],[2,0]],
      [[0,0],[0,1],[1,1],[2,1]],
    ],
    color: "#ff9800",
  },
];

const BASE_SPEEDS: Record<Difficulty, number> = { easy: 800, medium: 500, hard: 300 };
const LINE_POINTS = [0, 100, 300, 500, 800];
const LEVEL_LINES = 10;

function clampDpr(dpr: number) { return Math.min(Math.max(dpr || 1, 1), 2); }

function randomPieceIndex() { return Math.floor(Math.random() * TETROMINOES.length); }

type Board = (string | null)[][];

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

interface Piece {
  typeIdx: number;
  rotation: number;
  row: number;
  col: number;
}

function pieceBlocks(p: Piece): [number, number][] {
  const def = TETROMINOES[p.typeIdx];
  return def.shape[p.rotation].map(([dr, dc]) => [p.row + dr, p.col + dc]);
}

function isValid(board: Board, p: Piece): boolean {
  return pieceBlocks(p).every(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS && !board[r][c]);
}

function lockPiece(board: Board, p: Piece): Board {
  const color = TETROMINOES[p.typeIdx].color;
  const next: Board = board.map(row => [...row]);
  pieceBlocks(p).forEach(([r, c]) => { next[r][c] = color; });
  return next;
}

function clearLines(board: Board): { board: Board; lines: number } {
  const remaining = board.filter(row => row.some(cell => !cell));
  const lines = ROWS - remaining.length;
  const newBoard: Board = [
    ...Array.from({ length: lines }, () => Array(COLS).fill(null)),
    ...remaining,
  ];
  return { board: newBoard, lines };
}

function spawnPiece(typeIdx: number): Piece {
  return { typeIdx, rotation: 0, row: 0, col: Math.floor(COLS / 2) - 2 };
}

// ─── Board Component ──────────────────────────────────────────────────────────
function TetrisBoardInner({ title }: { title: string }) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("EMBEDDED");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Mutable game refs
  const boardRef = useRef<Board>(emptyBoard());
  const pieceRef = useRef<Piece>(spawnPiece(randomPieceIndex()));
  const nextIdxRef = useRef(randomPieceIndex());
  const holdIdxRef = useRef<number | null>(null);
  const holdUsedRef = useRef(false);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesClearedRef = useRef(0);
  const difficultyRef = useRef<Difficulty>("medium");

  // sizing
  const sizeRef = useRef<{ cellW: number; cellH: number; dpr: number }>({ cellW: 0, cellH: 0, dpr: 1 });

  // swipe
  const pointerStartRef = useRef<{ x: number; y: number; id: number } | null>(null);

  const inBigMode = viewMode === "THEATER" || viewMode === "FULLSCREEN";

  useEffect(() => {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const touch = "ontouchstart" in window || (navigator as any).maxTouchPoints > 0;
    setIsTouchDevice(coarse || touch);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("tetris-blocks-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const saveHighScore = useCallback((s: number) => {
    if (s > parseInt(localStorage.getItem("tetris-blocks-highscore") || "0", 10)) {
      localStorage.setItem("tetris-blocks-highscore", String(s));
      setHighScore(s);
    }
  }, []);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { cellW, cellH, dpr } = sizeRef.current;
    if (!cellW) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = cellW * COLS;
    const H = cellH * ROWS;

    // background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(W, r * cellH); ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, H); ctx.stroke();
    }

    // locked cells
    const board = boardRef.current;
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) drawCell(ctx, r, c, cell, cellW, cellH, false);
      });
    });

    // ghost piece
    const p = pieceRef.current;
    let ghost = { ...p };
    while (isValid(boardRef.current, { ...ghost, row: ghost.row + 1 })) ghost = { ...ghost, row: ghost.row + 1 };
    if (ghost.row !== p.row) {
      pieceBlocks(ghost).forEach(([r, c]) => {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
      });
    }

    // current piece
    const color = TETROMINOES[p.typeIdx].color;
    pieceBlocks(p).forEach(([r, c]) => {
      if (r >= 0) drawCell(ctx, r, c, color, cellW, cellH, true);
    });
  }, []);

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    r: number, c: number, color: string,
    cellW: number, cellH: number, glow: boolean
  ) => {
    const x = c * cellW + 1;
    const y = r * cellH + 1;
    const w = cellW - 2;
    const h = cellH - 2;
    if (glow) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    // highlight
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x, y, w, 3);
    ctx.fillRect(x, y, 3, h);
    ctx.shadowBlur = 0;
  };

  const drawPreview = useCallback((idx: number | null, canvasEl: HTMLCanvasElement | null) => {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const dpr = clampDpr(window.devicePixelRatio || 1);
    const size = canvasEl.width / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, size, size);
    if (idx === null) return;
    const def = TETROMINOES[idx];
    const blocks = def.shape[0];
    const rows = Math.max(...blocks.map(b => b[0])) + 1;
    const cols = Math.max(...blocks.map(b => b[1])) + 1;
    const cellSize = Math.floor(size / 5);
    const offsetX = Math.floor((size - cols * cellSize) / 2);
    const offsetY = Math.floor((size - rows * cellSize) / 2);
    blocks.forEach(([r, c]) => {
      const x = offsetX + c * cellSize + 1;
      const y = offsetY + r * cellSize + 1;
      const w = cellSize - 2;
      const h = cellSize - 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = def.color;
      ctx.fillStyle = def.color;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(x, y, w, 3);
      ctx.fillRect(x, y, 3, h);
      ctx.shadowBlur = 0;
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const wrap = boardWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    let availH = Math.floor(rect.height || window.innerHeight * 0.6);
    let availW = Math.floor(rect.width);

    if (viewMode === "EMBEDDED") {
      availH = Math.min(availH, 500);
      availW = Math.min(availW, 300);
    }
    availH = Math.max(availH, 200);
    availW = Math.max(availW, 120);

    // maintain 1:2 aspect (10:20 = 1:2)
    const cellH = Math.floor(Math.min(availH / ROWS, (availW / COLS)));
    const cellW = cellH; // square cells
    const W = cellW * COLS;
    const H = cellH * ROWS;

    const dpr = clampDpr(window.devicePixelRatio || 1);
    sizeRef.current = { cellW, cellH, dpr };

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    // preview
    const prev = previewRef.current;
    if (prev) {
      const ps = cellW * 4;
      prev.width = ps * dpr;
      prev.height = ps * dpr;
      prev.style.width = `${ps}px`;
      prev.style.height = `${ps}px`;
    }

    drawBoard();
    drawPreview(nextIdxRef.current, previewRef.current);
  }, [drawBoard, drawPreview, viewMode]);

  useEffect(() => {
    resizeCanvas();
    const wrap = boardWrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(wrap);
    window.addEventListener("resize", resizeCanvas);
    return () => { ro.disconnect(); window.removeEventListener("resize", resizeCanvas); };
  }, [resizeCanvas]);

  const stopLoop = useCallback(() => {
    if (loopRef.current != null) { clearInterval(loopRef.current); loopRef.current = null; }
  }, []);

  const getSpeed = useCallback((lvl: number, diff: Difficulty) => {
    const base = BASE_SPEEDS[diff];
    return Math.max(50, base - (lvl - 1) * 40);
  }, []);

  const startLoop = useCallback((diff: Difficulty, lvl: number) => {
    stopLoop();
    const speed = getSpeed(lvl, diff);
    loopRef.current = setInterval(() => {
      const p = pieceRef.current;
      const moved = { ...p, row: p.row + 1 };
      if (isValid(boardRef.current, moved)) {
        pieceRef.current = moved;
        drawBoard();
      } else {
        // lock
        boardRef.current = lockPiece(boardRef.current, p);
        const { board: cleared, lines } = clearLines(boardRef.current);
        boardRef.current = cleared;

        if (lines > 0) {
          const pts = LINE_POINTS[lines] * levelRef.current;
          scoreRef.current += pts;
          linesClearedRef.current += lines;
          const newLevel = Math.floor(linesClearedRef.current / LEVEL_LINES) + 1;
          if (newLevel !== levelRef.current) {
            levelRef.current = newLevel;
            setLevel(newLevel);
            // restart loop with new speed
            startLoop(difficultyRef.current, newLevel);
          }
          setScore(scoreRef.current);
          setLinesCleared(linesClearedRef.current);
          saveHighScore(scoreRef.current);
        }

        holdUsedRef.current = false;
        const nextP = spawnPiece(nextIdxRef.current);
        nextIdxRef.current = randomPieceIndex();
        if (!isValid(boardRef.current, nextP)) {
          stopLoop();
          setGameState("GAME_OVER");
          saveHighScore(scoreRef.current);
          drawBoard();
          return;
        }
        pieceRef.current = nextP;
        drawBoard();
        drawPreview(nextIdxRef.current, previewRef.current);
      }
    }, speed);
  }, [drawBoard, drawPreview, getSpeed, saveHighScore, stopLoop]);

  const resetGame = useCallback((diff: Difficulty) => {
    difficultyRef.current = diff;
    boardRef.current = emptyBoard();
    scoreRef.current = 0;
    levelRef.current = 1;
    linesClearedRef.current = 0;
    holdIdxRef.current = null;
    holdUsedRef.current = false;
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    const p = spawnPiece(randomPieceIndex());
    pieceRef.current = p;
    nextIdxRef.current = randomPieceIndex();
    drawBoard();
    drawPreview(nextIdxRef.current, previewRef.current);
  }, [drawBoard, drawPreview]);

  const startGame = useCallback(() => {
    stopLoop();
    resetGame(difficulty);
    difficultyRef.current = difficulty;
    setGameState("PLAYING");
    startLoop(difficulty, 1);
  }, [difficulty, resetGame, startLoop, stopLoop]);

  const pauseGame = useCallback(() => {
    if (gameState !== "PLAYING") return;
    stopLoop();
    setGameState("PAUSED");
  }, [gameState, stopLoop]);

  const resumeGame = useCallback(() => {
    if (gameState !== "PAUSED") return;
    setGameState("PLAYING");
    startLoop(difficultyRef.current, levelRef.current);
  }, [gameState, startLoop]);

  const movePiece = useCallback((dr: number, dc: number) => {
    if (gameState !== "PLAYING") return;
    const p = pieceRef.current;
    const moved = { ...p, row: p.row + dr, col: p.col + dc };
    if (isValid(boardRef.current, moved)) {
      pieceRef.current = moved;
      drawBoard();
    }
  }, [drawBoard, gameState]);

  const rotatePiece = useCallback(() => {
    if (gameState !== "PLAYING") return;
    const p = pieceRef.current;
    const rotated = { ...p, rotation: (p.rotation + 1) % 4 };
    // wall kick attempts
    const kicks = [[0,0],[0,-1],[0,1],[0,-2],[0,2]];
    for (const [dr, dc] of kicks) {
      const test = { ...rotated, row: rotated.row + dr, col: rotated.col + dc };
      if (isValid(boardRef.current, test)) {
        pieceRef.current = test;
        drawBoard();
        return;
      }
    }
  }, [drawBoard, gameState]);

  const hardDrop = useCallback(() => {
    if (gameState !== "PLAYING") return;
    const p = pieceRef.current;
    let dropped = { ...p };
    while (isValid(boardRef.current, { ...dropped, row: dropped.row + 1 })) {
      dropped = { ...dropped, row: dropped.row + 1 };
    }
    pieceRef.current = dropped;
    drawBoard();
    // Force lock immediately
    boardRef.current = lockPiece(boardRef.current, dropped);
    const { board: cleared, lines } = clearLines(boardRef.current);
    boardRef.current = cleared;
    if (lines > 0) {
      const pts = LINE_POINTS[lines] * levelRef.current;
      scoreRef.current += pts;
      linesClearedRef.current += lines;
      const newLevel = Math.floor(linesClearedRef.current / LEVEL_LINES) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
      }
      setScore(scoreRef.current);
      setLinesCleared(linesClearedRef.current);
      saveHighScore(scoreRef.current);
    }
    holdUsedRef.current = false;
    const nextP = spawnPiece(nextIdxRef.current);
    nextIdxRef.current = randomPieceIndex();
    if (!isValid(boardRef.current, nextP)) {
      stopLoop();
      setGameState("GAME_OVER");
      saveHighScore(scoreRef.current);
      drawBoard();
      return;
    }
    pieceRef.current = nextP;
    drawBoard();
    drawPreview(nextIdxRef.current, previewRef.current);
    // restart loop to reset timer
    startLoop(difficultyRef.current, levelRef.current);
  }, [drawBoard, drawPreview, gameState, saveHighScore, startLoop, stopLoop]);

  const holdPiece = useCallback(() => {
    if (gameState !== "PLAYING" || holdUsedRef.current) return;
    holdUsedRef.current = true;
    const currentIdx = pieceRef.current.typeIdx;
    if (holdIdxRef.current === null) {
      holdIdxRef.current = currentIdx;
      pieceRef.current = spawnPiece(nextIdxRef.current);
      nextIdxRef.current = randomPieceIndex();
    } else {
      const saved = holdIdxRef.current;
      holdIdxRef.current = currentIdx;
      pieceRef.current = spawnPiece(saved);
    }
    drawBoard();
    drawPreview(nextIdxRef.current, previewRef.current);
  }, [drawBoard, drawPreview, gameState]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewMode === "THEATER" || document.fullscreenElement) {
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
          setViewMode("EMBEDDED");
          return;
        }
      }
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        if (gameState === "PLAYING") { pauseGame(); return; }
        if (gameState === "PAUSED") { resumeGame(); return; }
      }
      if (gameState !== "PLAYING") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); movePiece(0, -1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); movePiece(0, 1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); movePiece(1, 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); rotatePiece(); }
      else if (e.key === " ") { e.preventDefault(); hardDrop(); }
      else if (e.key === "c" || e.key === "C") { holdPiece(); }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
  }, [gameState, hardDrop, holdPiece, movePiece, pauseGame, resumeGame, rotatePiece, viewMode]);

  // Visibility auto-pause
  useEffect(() => {
    const onVis = () => { if (document.hidden && gameState === "PLAYING") pauseGame(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [gameState, pauseGame]);

  // Fullscreen tracking
  useEffect(() => {
    const onFs = () => {
      if (document.fullscreenElement) setViewMode("FULLSCREEN");
      else if (viewMode === "FULLSCREEN") setViewMode("EMBEDDED");
    };
    document.addEventListener("fullscreenchange", onFs);
    const lock = viewMode === "THEATER" || viewMode === "FULLSCREEN";
    if (lock) document.documentElement.classList.add("overflow-hidden");
    else document.documentElement.classList.remove("overflow-hidden");
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [viewMode]);

  const toggleTheater = useCallback(async () => {
    if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); setViewMode("EMBEDDED"); return; }
    if (viewMode === "THEATER") { setViewMode("EMBEDDED"); return; }
    try {
      const el = rootRef.current;
      if (el?.requestFullscreen) { await el.requestFullscreen(); setViewMode("FULLSCREEN"); }
      else setViewMode("THEATER");
    } catch { setViewMode("THEATER"); }
  }, [viewMode]);

  // Pointer swipe for mobile
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (gameState !== "PLAYING") return;
    if (e.pointerType === "mouse") return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    e.preventDefault();
  }, [gameState]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const start = pointerStartRef.current;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    pointerStartRef.current = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 20;
    if (absX < threshold && absY < threshold) { rotatePiece(); return; }
    if (absX > absY) {
      if (dx > 0) movePiece(0, 1);
      else movePiece(0, -1);
    } else {
      if (dy > 0) hardDrop();
    }
    e.preventDefault();
  }, [hardDrop, movePiece, rotatePiece]);

  const exitToGames = useCallback(() => {
    stopLoop();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setViewMode("EMBEDDED");
    navigate("/games");
  }, [navigate, stopLoop]);

  const diffCardClass = (d: Difficulty, selected: boolean) => {
    const base = "text-left p-3 rounded-xl border transition select-none focus:outline-none";
    const palette = d === "easy" ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/15"
      : d === "medium" ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15"
      : "border-red-500/30 bg-red-500/10 hover:bg-red-500/15";
    const ring = d === "easy" ? "ring-2 ring-green-500/40" : d === "medium" ? "ring-2 ring-yellow-500/40" : "ring-2 ring-red-500/40";
    return [base, palette, selected ? ring : ""].join(" ");
  };

  return (
    <div
      ref={rootRef}
      className={[
        "relative w-full mx-auto overflow-x-hidden",
        inBigMode ? "fixed inset-0 z-50 bg-gray-950 p-3 flex flex-col" : "max-w-5xl",
      ].join(" ")}
      style={{ touchAction: "none" }}
    >
      {/* HUD */}
      <div className="w-full flex items-center justify-between mb-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Score</p>
            <p className="text-xl font-mono font-bold leading-none text-slate-900 dark:text-white">{score}</p>
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Level</p>
            <p className="text-xl font-mono font-bold leading-none text-slate-900 dark:text-white">{level}</p>
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Lines</p>
            <p className="text-xl font-mono font-bold leading-none text-slate-900 dark:text-white">{linesCleared}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Best</p>
            <p className="text-base font-mono font-bold leading-none text-slate-900 dark:text-white">{highScore}</p>
          </div>
          {gameState === "PLAYING" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={pauseGame}><Pause className="h-4 w-4" /></Button>
          )}
          {gameState === "PAUSED" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resumeGame}><Play className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheater}>
            {inBigMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          {inBigMode && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode("EMBEDDED")}><X className="h-4 w-4" /></Button>
          )}
        </div>
      </div>

      {/* Controls panel */}
      <div className="w-full mx-auto mb-2 max-w-[760px]">
        <Card className="p-3 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur">
          <div className="flex flex-col gap-2">
            {!inBigMode && (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Arrow keys to move/rotate. Space = hard drop. C = hold.</div>
                </div>
                <Button variant="outline" size="sm" onClick={exitToGames} className="gap-1 shrink-0"><X className="h-3.5 w-3.5" />Exit</Button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button key={d} type="button" onClick={() => { setDifficulty(d); if (gameState !== "PLAYING") resetGame(d); }}
                  className={diffCardClass(d, d === difficulty)} disabled={gameState === "PLAYING"} aria-pressed={d === difficulty}>
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 capitalize">{d}</div>
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {gameState !== "PLAYING" ? (
                <Button className="flex-1 h-9 text-sm" onClick={startGame}>
                  {gameState === "SETUP" ? "Start Game" : gameState === "PAUSED" ? "Resume" : "Play Again"}
                </Button>
              ) : (
                <Button className="flex-1 h-9 text-sm" variant="secondary" onClick={pauseGame}><Pause className="h-3.5 w-3.5 mr-2" />Pause</Button>
              )}
              <Button className="flex-1 h-9 text-sm" variant="outline" onClick={() => { stopLoop(); resetGame(difficulty); setGameState("SETUP"); }}>
                <RotateCcw className="h-3.5 w-3.5 mr-2" />Reset
              </Button>
              {gameState === "PAUSED" && (
                <Button className="flex-1 h-9 text-sm" onClick={resumeGame}><Play className="h-3.5 w-3.5 mr-2" />Resume</Button>
              )}
            </div>
            {gameState === "GAME_OVER" && (
              <div className="text-xs text-center text-red-500 dark:text-red-400 font-semibold">
                Game Over! Score: {score}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Game area */}
      <div className={["w-full flex justify-center gap-4", inBigMode ? "flex-1 min-h-0" : ""].join(" ")}>
        {/* Hold piece */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hold</p>
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-slate-700">
            <canvas ref={previewRef} className="block" />
          </div>
        </div>

        {/* Main board */}
        <div ref={boardWrapRef} className={["flex items-center justify-center", inBigMode ? "flex-1 min-h-0" : ""].join(" ")}>
          <Card className="relative bg-gray-950 border-slate-700 shadow-2xl overflow-hidden select-none" style={{ touchAction: "none" }}>
            <canvas ref={canvasRef} className="block" onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
            {gameState === "PAUSED" && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <p className="text-white text-2xl font-bold">PAUSED</p>
              </div>
            )}
            {gameState === "GAME_OVER" && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
                <p className="text-red-400 text-2xl font-bold">GAME OVER</p>
                <p className="text-white text-lg">Score: {score}</p>
                <Button onClick={startGame} size="sm">Play Again</Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Mobile D-pad */}
      {isTouchDevice && (gameState === "PLAYING" || gameState === "PAUSED") && (
        <div className="mt-3 w-full max-w-[400px] mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => rotatePiece()} className="col-start-2 h-12"><ArrowUp className="h-5 w-5" /></Button>
            <Button variant="secondary" onClick={() => movePiece(0, -1)} className="col-start-1 h-12"><ArrowLeft className="h-5 w-5" /></Button>
            <Button variant="secondary" onClick={() => movePiece(1, 0)} className="h-12"><ArrowDown className="h-5 w-5" /></Button>
            <Button variant="secondary" onClick={() => movePiece(0, 1)} className="h-12"><ArrowRight className="h-5 w-5" /></Button>
            <Button variant="secondary" onClick={hardDrop} className="col-span-3 h-10 text-xs font-bold">HARD DROP (Space)</Button>
          </div>
        </div>
      )}

      <div className="mt-3 text-center text-slate-500 text-xs">
        <p className="hidden md:block">Arrow Keys: move/rotate | Space: hard drop | C: hold | P: pause</p>
        <p className="md:hidden">Swipe left/right to move | Swipe down to hard drop | Tap to rotate</p>
      </div>
    </div>
  );
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function TetrisBlocksGame({
  title = "Tetris Blocks",
  description = "Classic Tetris with all 7 tetrominoes! Stack blocks, clear lines, and level up in this iconic puzzle game.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    { question: "How do I rotate a piece?", answer: "Press the Up arrow key (or W) to rotate clockwise. On mobile, tap the canvas to rotate." },
    { question: "What is a hard drop?", answer: "Press Space to instantly drop the piece to the lowest valid position. This locks the piece immediately." },
    { question: "How does the hold feature work?", answer: "Press C to save the current piece in the hold slot. You can swap back once per piece." },
    { question: "How is the score calculated?", answer: "Single line: 100 × level. Double: 300 × level. Triple: 500 × level. Tetris (4 lines): 800 × level." },
    { question: "Does the game speed up?", answer: "Yes. Every 10 lines cleared increases the level, which increases the drop speed." },
  ];

  const editorialContent = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-indigo-500" />How to Play Tetris Blocks</h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          Tetris Blocks is the classic falling-block puzzle game. Tetrominoes — geometric shapes made of four blocks — fall from the top of the board. Your goal is to arrange them to form complete horizontal lines, which disappear and earn you points.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Move left/right:</strong> Arrow Left / Arrow Right</li>
          <li><strong>Rotate:</strong> Arrow Up (or tap on mobile)</li>
          <li><strong>Soft drop:</strong> Arrow Down (faster fall)</li>
          <li><strong>Hard drop:</strong> Spacebar (instant drop)</li>
          <li><strong>Hold piece:</strong> C key</li>
          <li><strong>Pause:</strong> P or Spacebar from pause state</li>
        </ul>
      </section>

      <section id="tetrominoes">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Lightbulb className="w-6 h-6 text-yellow-500" />The 7 Tetrominoes</h2>
        <div className="grid gap-3 mt-4 sm:grid-cols-2">
          {[
            { name: "I-Piece (Cyan)", tip: "The only piece that can clear 4 lines at once (Tetris!). Save your I-pieces." },
            { name: "O-Piece (Yellow)", tip: "A 2×2 square. Rotation doesn't change its shape. Good for filling gaps." },
            { name: "T-Piece (Purple)", tip: "Versatile T-shape. Great for filling awkward gaps with T-spins." },
            { name: "S & Z Pieces (Green/Red)", tip: "Tricky S and Z shapes. Avoid stacking them together — they create holes." },
            { name: "J & L Pieces (Blue/Orange)", tip: "Corner pieces that work well for filling floor edges." },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold mb-1">{t.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{t.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Lightbulb className="w-6 h-6 text-yellow-500" />Strategies & Tips</h2>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Keep It Flat</h3>
            <p className="text-slate-600 dark:text-slate-400">Maintain a flat surface. Bumpy stacks create holes that are hard to fill later.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Reserve the Right Column</h3>
            <p className="text-slate-600 dark:text-slate-400">Keep one column open on the right side for I-pieces to score Tetrises.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Use the Ghost Piece</h3>
            <p className="text-slate-600 dark:text-slate-400">The transparent ghost shows where your piece will land. Plan placements without guessing.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Use Hold Wisely</h3>
            <p className="text-slate-600 dark:text-slate-400">Hold inconvenient pieces and swap in a better match. Save the I-piece for the perfect Tetris opportunity.</p>
          </div>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="w-6 h-6 text-blue-500" />Frequently Asked Questions</h2>
        <div className="mt-6 space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-semibold">References</h2>
        <ul className="list-disc pl-5 mt-4 space-y-4 text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a href="https://en.wikipedia.org/wiki/Tetris" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg">Tetris — Wikipedia</a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">History and mechanics of the original Tetris game.</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<TetrisBoardInner title={title} />}
      editorial={editorialContent}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tetrominoes", label: "The 7 Tetrominoes" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
