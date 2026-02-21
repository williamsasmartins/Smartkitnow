import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Gamepad2,
  HelpCircle,
  History,
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
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";

/**
 * Neon Snake — SKN-grade (Inline setup UI)
 * - Difficulty selection + Start inline (no overlay modal)
 * - Slower playable speeds
 * - Soft color difficulty cards: green/yellow/red
 * - Responsive canvas via ResizeObserver + DPR cap (<=2)
 * - Mobile: swipe via Pointer Events + optional D-pad controls
 * - Pause/Resume + auto pause when tab hidden
 * - Theater mode (works everywhere) + Fullscreen when supported
 */

const GRID_SIZE = 20;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "easy" | "medium" | "hard";
type GameState = "SETUP" | "PLAYING" | "PAUSED" | "GAME_OVER";
type ViewMode = "EMBEDDED" | "THEATER" | "FULLSCREEN";

// Slower, more playable defaults
const SPEED_MS: Record<Difficulty, number> = {
  easy: 340,
  medium: 200,
  hard: 130,
};

const POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

function clampDpr(dpr: number) {
  return Math.min(Math.max(dpr || 1, 1), 2);
}

function isOpposite(a: Direction, b: Direction) {
  return (
    (a === "UP" && b === "DOWN") ||
    (a === "DOWN" && b === "UP") ||
    (a === "LEFT" && b === "RIGHT") ||
    (a === "RIGHT" && b === "LEFT")
  );
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  const anyCtx = ctx as any;
  if (anyCtx.roundRect) {
    anyCtx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function formatDifficulty(diff: Difficulty) {
  if (diff === "easy") return "Easy";
  if (diff === "medium") return "Medium";
  return "Hard";
}

function NeonSnakeBoard({ title }: { title: string }) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const rootRef = useRef<HTMLDivElement>(null);
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [viewMode, setViewMode] = useState<ViewMode>("EMBEDDED");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // mutable game state
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const loopRef = useRef<number | null>(null);

  // swipe
  const pointerStartRef = useRef<{ x: number; y: number; id: number } | null>(null);

  // sizing
  const sizeRef = useRef<{ cssSize: number; dpr: number }>({ cssSize: 0, dpr: 1 });

  const colors = useMemo(() => {
    const isDark = theme === "dark";
    return {
      bg: isDark ? "#0b1222" : "#f8fafc",
      grid: isDark ? "#16233b" : "#e2e8f0",
      food: isDark ? "#ef4444" : "#dc2626",
      snakeHead: isDark ? "#22c55e" : "#16a34a",
      snakeBody: isDark ? "#4ade80" : "#86efac",
      hudBg: isDark ? "bg-slate-900/50" : "bg-white/80",
      hudBorder: isDark ? "border-slate-800" : "border-slate-200",
      hudText: isDark ? "text-slate-200" : "text-slate-800",
      hudMuted: isDark ? "text-slate-400" : "text-slate-500",
    };
  }, [theme]);

  useEffect(() => {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const touch = "ontouchstart" in window || (navigator as any).maxTouchPoints > 0;
    setIsTouchDevice(coarse || touch);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("neon-snake-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("neon-snake-highscore", String(score));
    }
  }, [score, highScore]);

  const stopLoop = useCallback(() => {
    if (loopRef.current != null) {
      window.clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }, []);

  const exitToGames = useCallback(() => {
    stopLoop();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => void 0);
    }
    setViewMode("EMBEDDED");
    navigate("/games");
  }, [navigate, stopLoop]);

  const placeFood = useCallback(() => {
    const snake = snakeRef.current;
    for (let attempt = 0; attempt < 400; attempt++) {
      const nf = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some((seg) => seg.x === nf.x && seg.y === nf.y)) {
        foodRef.current = nf;
        return;
      }
    }
    foodRef.current = { x: 0, y: 0 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cssSize, dpr } = sizeRef.current;
    if (!cssSize) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = cssSize;
    const cell = size / GRID_SIZE;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size, size);

    // grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(size, i * cell);
      ctx.stroke();
    }

    // food
    const food = foodRef.current;
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = colors.food;
    ctx.fillStyle = colors.food;
    ctx.beginPath();
    ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // snake
    const snake = snakeRef.current;
    snake.forEach((seg, idx) => {
      const isHead = idx === 0;
      ctx.save();
      ctx.fillStyle = isHead ? colors.snakeHead : colors.snakeBody;
      if (isHead) {
        ctx.shadowBlur = 14;
        ctx.shadowColor = colors.snakeHead;
      }
      const x = seg.x * cell + 1;
      const y = seg.y * cell + 1;
      const w = cell - 2;
      const h = cell - 2;

      ctx.beginPath();
      roundedRectPath(ctx, x, y, w, h, isHead ? 6 : 3);
      ctx.fill();
      ctx.restore();
    });
  }, [colors]);

  const resizeCanvas = useCallback(() => {
    const wrap = boardWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    let cssSize = Math.floor(Math.min(rect.width, rect.height));

    // embedded cap; theater/fullscreen uses more space
    if (viewMode === "EMBEDDED") cssSize = Math.min(cssSize, 560);
    cssSize = Math.max(260, cssSize);

    const dpr = clampDpr(window.devicePixelRatio || 1);
    sizeRef.current = { cssSize, dpr };

    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;

    draw();
  }, [draw, viewMode]);

  useEffect(() => {
    resizeCanvas();
    const wrap = boardWrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(wrap);

    window.addEventListener("resize", resizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  const resetGame = useCallback(
    (diff: Difficulty) => {
      setDifficulty(diff);
      setScore(0);

      snakeRef.current = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      dirRef.current = "RIGHT";
      nextDirRef.current = "RIGHT";
      placeFood();
      draw();
    },
    [draw, placeFood]
  );

  const startGame = useCallback(() => {
    stopLoop();
    resetGame(difficulty);
    setGameState("PLAYING");
  }, [difficulty, resetGame, stopLoop]);

  const restartGame = useCallback(() => {
    stopLoop();
    resetGame(difficulty);
    setGameState("PLAYING");
  }, [difficulty, resetGame, stopLoop]);

  const pauseGame = useCallback(() => {
    if (gameState !== "PLAYING") return;
    stopLoop();
    setGameState("PAUSED");
  }, [gameState, stopLoop]);

  const resumeGame = useCallback(() => {
    if (gameState !== "PAUSED") return;
    setGameState("PLAYING");
  }, [gameState]);

  const gameOver = useCallback(() => {
    stopLoop();
    setGameState("GAME_OVER");
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
  }, [stopLoop]);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const head = { ...snake[0] };

    const requested = nextDirRef.current;
    if (!isOpposite(dirRef.current, requested)) {
      dirRef.current = requested;
    }
    const committed = dirRef.current;

    if (committed === "UP") head.y -= 1;
    if (committed === "DOWN") head.y += 1;
    if (committed === "LEFT") head.x -= 1;
    if (committed === "RIGHT") head.x += 1;

    // wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      gameOver();
      return;
    }

    // self collision (check against current body)
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((s) => s + POINTS[difficulty]);
      placeFood();
      if (navigator.vibrate) navigator.vibrate(12);
    } else {
      snake.pop();
    }

    draw();
  }, [difficulty, draw, gameOver, placeFood]);

  // main loop
  useEffect(() => {
    stopLoop();
    if (gameState === "PLAYING") {
      loopRef.current = window.setInterval(tick, SPEED_MS[difficulty]);
    }
    return () => stopLoop();
  }, [difficulty, gameState, stopLoop, tick]);

  // auto-pause when tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && gameState === "PLAYING") pauseGame();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [gameState, pauseGame]);

  // keyboard controls + Esc closes theater/fullscreen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc closes theater/fullscreen (does NOT exit page)
      if (e.key === "Escape" && (viewMode === "THEATER" || document.fullscreenElement)) {
        e.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen().catch(() => void 0);
        setViewMode("EMBEDDED");
        return;
      }

      if (e.key === " " || e.key === "p" || e.key === "P") {
        if (gameState === "PLAYING") {
          e.preventDefault();
          pauseGame();
          return;
        }
        if (gameState === "PAUSED") {
          e.preventDefault();
          resumeGame();
          return;
        }
      }

      if (gameState !== "PLAYING") return;

      const key = e.key;
      if (key === "ArrowUp" || key === "w" || key === "W") {
        e.preventDefault();
        if (dirRef.current !== "DOWN") nextDirRef.current = "UP";
      } else if (key === "ArrowDown" || key === "s" || key === "S") {
        e.preventDefault();
        if (dirRef.current !== "UP") nextDirRef.current = "DOWN";
      } else if (key === "ArrowLeft" || key === "a" || key === "A") {
        e.preventDefault();
        if (dirRef.current !== "RIGHT") nextDirRef.current = "LEFT";
      } else if (key === "ArrowRight" || key === "d" || key === "D") {
        e.preventDefault();
        if (dirRef.current !== "LEFT") nextDirRef.current = "RIGHT";
      }
    };

    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
  }, [gameState, pauseGame, resumeGame, viewMode]);

  // fullscreen tracking + scroll lock in theater/fullscreen
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

  const inBigMode = viewMode === "THEATER" || viewMode === "FULLSCREEN";

  const toggleTheaterOrFullscreen = useCallback(async () => {
    // if fullscreen -> exit
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => void 0);
      setViewMode("EMBEDDED");
      return;
    }
    // if theater -> exit
    if (viewMode === "THEATER") {
      setViewMode("EMBEDDED");
      return;
    }
    // try fullscreen; fallback to theater if blocked (iOS Safari)
    try {
      const el = rootRef.current;
      if (el?.requestFullscreen) {
        await el.requestFullscreen();
        setViewMode("FULLSCREEN");
      } else {
        setViewMode("THEATER");
      }
    } catch {
      setViewMode("THEATER");
    }
  }, [viewMode]);

  // pointer swipe for mobile
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.pointerType === "mouse") return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      pointerStartRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      e.preventDefault();
    },
    [gameState]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (gameState !== "PLAYING") return;
      const start = pointerStartRef.current;
      if (!start || start.id !== e.pointerId) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      pointerStartRef.current = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const threshold = 22;
      if (absX < threshold && absY < threshold) return;

      if (absX > absY) {
        if (dx > 0 && dirRef.current !== "LEFT") nextDirRef.current = "RIGHT";
        else if (dx < 0 && dirRef.current !== "RIGHT") nextDirRef.current = "LEFT";
      } else {
        if (dy > 0 && dirRef.current !== "UP") nextDirRef.current = "DOWN";
        else if (dy < 0 && dirRef.current !== "DOWN") nextDirRef.current = "UP";
      }

      e.preventDefault();
    },
    [gameState]
  );

  const setDir = useCallback(
    (d: Direction) => {
      if (gameState !== "PLAYING") return;
      if (isOpposite(dirRef.current, d)) return;
      nextDirRef.current = d;
    },
    [gameState]
  );

  const diffCardClass = (d: Difficulty, selected: boolean) => {
    const base =
      "text-left p-4 rounded-xl border transition select-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950";
    const palette =
      d === "easy"
        ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/15"
        : d === "medium"
          ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15"
          : "border-red-500/30 bg-red-500/10 hover:bg-red-500/15";

    const ring =
      d === "easy"
        ? "ring-green-500/40"
        : d === "medium"
          ? "ring-yellow-500/40"
          : "ring-red-500/40";

    return [base, palette, selected ? `ring-2 ${ring}` : ""].join(" ");
  };

  // Ensure we have a clean preview board in SETUP
  useEffect(() => {
    if (gameState === "SETUP") {
      stopLoop();
      resetGame(difficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div
      ref={rootRef}
      className={[
        "relative w-full mx-auto overflow-x-hidden",
        inBigMode ? "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-2 flex flex-col" : "max-w-5xl",
      ].join(" ")}
      style={{ touchAction: "none" }}
    >
      {/* Top HUD */}
      <div
        className={[
          "w-full flex items-center justify-between mb-2 p-2 rounded-xl border backdrop-blur-sm shadow-sm",
          colors.hudBg,
          colors.hudBorder,
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <p className={["text-[10px] uppercase font-bold tracking-wider", colors.hudMuted].join(" ")}>Score</p>
            <p className={["text-xl font-mono font-bold leading-none", colors.hudText].join(" ")}>{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className={["text-[10px] uppercase font-bold tracking-wider", colors.hudMuted].join(" ")}>High</p>
            <p className={["text-base font-mono font-bold leading-none", colors.hudText].join(" ")}>
              {highScore}
            </p>
          </div>

          {gameState === "PLAYING" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={pauseGame} aria-label="Pause">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {gameState === "PAUSED" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resumeGame} aria-label="Resume">
              <Play className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheaterOrFullscreen} aria-label="Theater/Fullscreen">
            {inBigMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {inBigMode && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode("EMBEDDED")} aria-label="Close theater">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Inline setup + actions */}
      <div className={["w-full mx-auto mb-2", inBigMode ? "max-w-[400px]" : "max-w-[760px]"].join(" ")}>
        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur">
          <div className={["flex flex-col", inBigMode ? "gap-2" : "gap-3"].join(" ")}>
            {!inBigMode && (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Choose difficulty, then start. On mobile: swipe or use the arrows.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={exitToGames} className="gap-2">
                    <X className="h-4 w-4" />
                    Exit
                  </Button>
                </div>
              </div>
            )}

            <div className={["grid gap-2", inBigMode ? "grid-cols-3" : "gap-3 sm:grid-cols-3"].join(" ")}>
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                const selected = d === difficulty;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficulty(d);
                      if (gameState !== "PLAYING") resetGame(d);
                    }}
                    className={[
                      diffCardClass(d, selected),
                      inBigMode ? "p-2 text-center" : "", // Compact padding
                    ].join(" ")}
                    disabled={gameState === "PLAYING"}
                    aria-pressed={selected}
                  >
                    <div className={["font-semibold text-slate-900 dark:text-slate-100", inBigMode ? "text-xs" : ""].join(" ")}>
                      {formatDifficulty(d)}
                    </div>
                    {!inBigMode && (
                      <>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Speed: {SPEED_MS[d]}ms / step
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Points: {POINTS[d]} / food
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {gameState !== "PLAYING" ? (
                <Button className="flex-1 h-9 text-sm" onClick={startGame}>
                  {gameState === "SETUP" ? "Start game" : "Play again"}
                </Button>
              ) : (
                <Button className="flex-1 h-9 text-sm" variant="secondary" onClick={pauseGame}>
                  <Pause className="h-3.5 w-3.5 mr-2" />
                  Pause
                </Button>
              )}

              <Button className="flex-1 h-9 text-sm" variant="outline" onClick={restartGame}>
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Restart
              </Button>

              {gameState === "PAUSED" && (
                <Button className="flex-1 h-9 text-sm" onClick={resumeGame}>
                  <Play className="h-3.5 w-3.5 mr-2" />
                  Resume
                </Button>
              )}
            </div>

            {gameState === "GAME_OVER" && (
              <div className="text-xs text-center text-slate-700 dark:text-slate-300">
                Game over. Score: <strong>{score}</strong>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Board area (ResizeObserver measures this square box) */}
      <div className={["w-full flex justify-center", inBigMode ? "flex-1 min-h-0" : ""].join(" ")}>
        <div
          ref={boardWrapRef}
          className={[
            "w-full aspect-square flex items-center justify-center mx-auto",
            inBigMode ? "max-w-none h-full" : "max-w-full sm:max-w-[min(90vw,65vh)]",
          ].join(" ")}
        >
          <Card
            className="relative bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden select-none"
            style={{ touchAction: "none" }}
          >
            <canvas ref={canvasRef} className="block mx-auto max-w-full" onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
          </Card>
        </div>
      </div>

      {/* Touch D-pad */}
      {isTouchDevice && (gameState === "PLAYING" || gameState === "PAUSED") && (
        <div className="mt-4 w-full max-w-[620px] mx-auto flex items-center justify-between gap-3">
          <Button className="flex-1" variant="secondary" onClick={() => setDir("LEFT")} aria-label="Left">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={() => setDir("UP")} aria-label="Up">
              <ArrowUp className="h-5 w-5" />
            </Button>
            <Button variant="secondary" onClick={() => setDir("DOWN")} aria-label="Down">
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
          <Button className="flex-1" variant="secondary" onClick={() => setDir("RIGHT")} aria-label="Right">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Hints */}
      <div className="mt-4 text-center text-slate-500 text-sm">
        <p className="hidden md:block">
          Use <strong>Arrow Keys</strong> or <strong>WASD</strong>. Press <strong>Space</strong> to pause.
        </p>
        <p className="md:hidden">Swipe on the board, or use the on-screen arrows.</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function NeonSnakeGame({
  title = "Neon Snake",
  description = "Classic snake game with a neon twist. Collect food, grow longer, and avoid hitting the walls or yourself!",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I control the snake?",
      answer:
        "On desktop, use Arrow keys or WASD. On mobile/tablet, swipe on the board or use the on-screen directional buttons.",
    },
    {
      question: "Why doesn’t Fullscreen work on some phones?",
      answer:
        "Some mobile browsers (notably iOS Safari) limit Fullscreen. Neon Snake includes Theater Mode as a reliable alternative.",
    },
    {
      question: "How is the score calculated?",
      answer:
        "Each food pellet adds points based on difficulty: Easy (10), Medium (20), Hard (30). Higher difficulty also moves faster.",
    },
    {
      question: "Can I pause the game?",
      answer: "Yes. On desktop press Space (or P). You can also use the Pause button in the game header.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const editorialContent = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-indigo-500" />
          How to Play
        </h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          In <strong>Neon Snake</strong>, guide the snake to eat glowing pellets, grow longer, and avoid walls or your own body.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Eat & Grow:</strong> Each pellet increases your length.
          </li>
          <li>
            <strong>Avoid Collisions:</strong> Walls or your own body end the run.
          </li>
          <li>
            <strong>Stay Smooth:</strong> Avoid sharp reversals and plan lanes.
          </li>
        </ul>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Tips & Strategies
        </h2>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Plan Your Space</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Think about where your tail will be in a few moves. Avoid trapping yourself near corners.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Use Lanes</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Create consistent “lanes” to keep exit routes open as the snake grows.
            </p>
          </div>
        </div>
      </section>

      <section id="history">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-purple-500" />
          A Bit of History
        </h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          Snake-style games trace back to early arcade designs and became iconic on late-90s mobile phones. The loop remains timeless:
          risk management, path planning, and escalating self-imposed pressure.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
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
        <h2 className="text-2xl font-semibold">References & Additional Resources</h2>
        <ul className="list-disc pl-5 mt-4 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://en.wikipedia.org/wiki/Snake_(video_game_genre)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Snake (video game genre) - Wikipedia
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Background on Snake-style game mechanics and variations.
              </p>
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
      widget={<NeonSnakeBoard title={title} />}
      editorial={editorialContent}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "history", label: "History" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
