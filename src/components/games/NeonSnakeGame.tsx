import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  Gamepad2,
  Lightbulb,
  History,
  HelpCircle,
  BookOpen,
  Maximize2,
  Minimize2,
  X,
  Pause,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";
import StartOverlay from "./StartOverlay";

/**
 * Neon Snake — SKN-grade
 * - Menu: select difficulty + explicit Start button
 * - Exit button: always available
 * - Theater mode (works everywhere) + Fullscreen when supported
 * - ResizeObserver + DPR cap <= 2
 * - Pointer Events for swipe + optional D-pad on touch devices
 * - Pause/Resume + auto-pause on tab hidden
 */

const GRID_SIZE = 20;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "COUNTDOWN" | "PLAYING" | "PAUSED" | "GAME_OVER";
type ViewMode = "EMBEDDED" | "THEATER" | "FULLSCREEN";

const SPEED_MS: Record<Difficulty, number> = {
  easy: 220,
  medium: 110,
  hard: 70,
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
  if ((ctx as any).roundRect) {
    // modern browsers
    (ctx as any).roundRect(x, y, w, h, radius);
    return;
  }
  // fallback (Safari older)
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

  const [gameState, setGameState] = useState<GameState>("MENU");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [viewMode, setViewMode] = useState<ViewMode>("EMBEDDED");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [countdown, setCountdown] = useState(3);

  // game mutable state
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
      bg: isDark ? "#0f172a" : "#f8fafc",
      grid: isDark ? "#1e293b" : "#e2e8f0",
      food: isDark ? "#ef4444" : "#dc2626",
      snakeHead: isDark ? "#22c55e" : "#16a34a",
      snakeBody: isDark ? "#4ade80" : "#86efac",
      hudBg: isDark ? "bg-slate-900/50" : "bg-white",
      hudBorder: isDark ? "border-slate-800" : "border-slate-200",
      hudText: isDark ? "text-slate-200" : "text-slate-700",
      hudMuted: isDark ? "text-slate-400" : "text-slate-500",
    };
  }, [theme]);

  // detect touch device once
  useEffect(() => {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const touch = "ontouchstart" in window || (navigator as any).maxTouchPoints > 0;
    setIsTouchDevice(coarse || touch);
  }, []);

  // high score
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

  const gameOver = useCallback(() => {
    stopLoop();
    setGameState("GAME_OVER");
    // light haptics if available
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
  }, [stopLoop]);

  const placeFood = useCallback(() => {
    const maxCells = GRID_SIZE;
    const snake = snakeRef.current;
    // avoid infinite loops if very full
    for (let attempt = 0; attempt < 400; attempt++) {
      const nf = {
        x: Math.floor(Math.random() * maxCells),
        y: Math.floor(Math.random() * maxCells),
      };
      const collision = snake.some((seg) => seg.x === nf.x && seg.y === nf.y);
      if (!collision) {
        foodRef.current = nf;
        return;
      }
    }
    // fallback: if too full, just set something (should be rare)
    foodRef.current = { x: 0, y: 0 };
  }, []);

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
      draw(); // render initial board
    },
    [placeFood]
  );

  const startCountdownAndPlay = useCallback(
    (diff: Difficulty) => {
      stopLoop();
      resetGame(diff);
      setCountdown(3);
      setGameState("COUNTDOWN");
    },
    [resetGame, stopLoop]
  );

  const pauseGame = useCallback(() => {
    if (gameState !== "PLAYING") return;
    stopLoop();
    setGameState("PAUSED");
  }, [gameState, stopLoop]);

  const resumeGame = useCallback(() => {
    if (gameState !== "PAUSED") return;
    setGameState("PLAYING");
  }, [gameState]);

  const exitToGames = useCallback(() => {
    stopLoop();
    // If fullscreen, exit first
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => void 0);
    }
    setViewMode("EMBEDDED");
    navigate("/games");
  }, [navigate, stopLoop]);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const head = { ...snake[0] };

    const dir = nextDirRef.current;
    if (!isOpposite(dirRef.current, dir)) {
      dirRef.current = dir;
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

    // self collision (ignore last tail cell if it will move? we keep it simple and strict)
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((s) => s + POINTS[difficulty]);
      placeFood();
      if (navigator.vibrate) navigator.vibrate(15);
    } else {
      snake.pop();
    }

    draw();
  }, [difficulty, gameOver, placeFood]);

  // countdown logic
  useEffect(() => {
    if (gameState !== "COUNTDOWN") return;

    let alive = true;
    const id = window.setInterval(() => {
      if (!alive) return;
      setCountdown((c) => {
        const next = c - 1;
        if (next <= 0) {
          window.clearInterval(id);
          setGameState("PLAYING");
          return 0;
        }
        return next;
      });
    }, 700);

    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [gameState]);

  // main loop
  useEffect(() => {
    stopLoop();

    if (gameState === "PLAYING") {
      const speed = SPEED_MS[difficulty];
      loopRef.current = window.setInterval(tick, speed);
    }

    return () => stopLoop();
  }, [difficulty, gameState, stopLoop, tick]);

  // auto-pause on tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && gameState === "PLAYING") pauseGame();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [gameState, pauseGame]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // close with Esc in theater
      if (e.key === "Escape" && (viewMode === "THEATER" || document.fullscreenElement)) {
        e.preventDefault();
        // exit theater/fullscreen first, not the page
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => void 0);
        }
        setViewMode("EMBEDDED");
        return;
      }

      if (gameState !== "PLAYING" && gameState !== "PAUSED") return;

      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        if (gameState === "PLAYING") pauseGame();
        else if (gameState === "PAUSED") resumeGame();
        return;
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

  // fullscreen tracking + body scroll lock on theater/fullscreen
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const resizeCanvas = useCallback(() => {
    const wrap = boardWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // Compute available size
    // Embedded: cap at 520
    // Theater/Fullscreen: use as much as possible but keep safe header space
    const rect = wrap.getBoundingClientRect();
    let cssSize = Math.floor(Math.min(rect.width, rect.height));
    if (viewMode === "EMBEDDED") cssSize = Math.min(cssSize, 520);

    // Guard
    cssSize = Math.max(260, cssSize);

    const dpr = clampDpr(window.devicePixelRatio || 1);
    sizeRef.current = { cssSize, dpr };

    // Set canvas physical pixels
    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);

    // Set canvas CSS size
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;

    draw();
  }, [viewMode]);

  // ResizeObserver on board wrap
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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cssSize, dpr } = sizeRef.current;
    if (!cssSize) return;

    // draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = cssSize;
    const cell = size / GRID_SIZE;

    // background
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

    // food (glow)
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

  // pointer swipe (more reliable than touch events)
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.pointerType === "mouse") return; // keep mouse for click-free play
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

  const setDir = useCallback((d: Direction) => {
    if (gameState !== "PLAYING") return;
    if (isOpposite(dirRef.current, d)) return;
    nextDirRef.current = d;
  }, [gameState]);

  const toggleTheaterOrFullscreen = useCallback(async () => {
    // If already in fullscreen -> exit
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => void 0);
      setViewMode("EMBEDDED");
      return;
    }

    // If in theater -> exit theater
    if (viewMode === "THEATER") {
      setViewMode("EMBEDDED");
      return;
    }

    // Try fullscreen; if fails, fallback to theater (iOS)
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

  // UI helpers
  const showHud = true;
  const inBigMode = viewMode === "THEATER" || viewMode === "FULLSCREEN";

  return (
    <div
      ref={rootRef}
      className={[
        "relative flex flex-col items-center justify-center w-full mx-auto",
        inBigMode ? "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-hidden" : "max-w-4xl",
      ].join(" ")}
      style={{ touchAction: "none" }}
    >
      {/* Top bar / stats */}
      {showHud && (
        <div
          className={[
            "w-full flex items-center justify-between mb-4 p-4 rounded-xl border backdrop-blur-sm shadow-sm",
            colors.hudBg,
            colors.hudBorder,
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className={["text-xs uppercase font-bold tracking-wider", colors.hudMuted].join(" ")}>Score</p>
              <p className={["text-2xl font-mono font-bold leading-none", colors.hudText].join(" ")}>{score}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <p className={["text-xs uppercase font-bold tracking-wider", colors.hudMuted].join(" ")}>High</p>
              <p className={["text-lg font-mono font-bold leading-none", colors.hudText].join(" ")}>
                {highScore}
              </p>
            </div>

            {/* Pause / Resume */}
            {gameState === "PLAYING" && (
              <Button variant="ghost" size="icon" onClick={pauseGame} aria-label="Pause">
                <Pause className="h-5 w-5" />
              </Button>
            )}
            {gameState === "PAUSED" && (
              <Button variant="ghost" size="icon" onClick={resumeGame} aria-label="Resume">
                <Play className="h-5 w-5" />
              </Button>
            )}

            {/* Theater/Fullscreen toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheaterOrFullscreen} aria-label="Theater/Fullscreen">
              {inBigMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {/* Close button visible in theater/fullscreen */}
            {inBigMode && (
              <Button variant="ghost" size="icon" onClick={() => setViewMode("EMBEDDED")} aria-label="Close overlay">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Board wrap: gives ResizeObserver a stable box */}
      <div
        ref={boardWrapRef}
        className={[
          "w-full flex items-center justify-center",
          inBigMode ? "flex-1 min-h-0" : "",
        ].join(" ")}
      >
        <Card
          className="relative bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden select-none"
          style={{ touchAction: "none" }}
        >
          <canvas
            ref={canvasRef}
            className="block mx-auto"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          />
        </Card>
      </div>

      {/* Mobile D-pad (optional) */}
      {isTouchDevice && gameState === "PLAYING" && (
        <div className="mt-4 w-full max-w-[520px] flex items-center justify-between gap-3">
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

      {/* Controls hint */}
      <div className="mt-4 text-center text-slate-500 text-sm">
        <p className="hidden md:block">
          Use <strong>Arrow Keys</strong> or <strong>WASD</strong>. Press <strong>Space</strong> to pause.
        </p>
        <p className="md:hidden">Swipe on the board, or use the on-screen controls.</p>
      </div>

      {/* MENU overlay */}
      <StartOverlay
        open={gameState === "MENU"}
        title={title}
        subtitle="Pick a difficulty, then press Start."
        onClose={exitToGames}
        closeLabel="Exit"
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const selected = d === difficulty;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={[
                    "text-left p-4 rounded-xl border transition",
                    selected
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50",
                  ].join(" ")}
                >
                  <div className="font-semibold">{formatDifficulty(d)}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Speed: {Math.round(1000 / SPEED_MS[d])} moves/sec
                  </div>
                  <div className="text-sm text-slate-500">Points: {POINTS[d]} / food</div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" onClick={() => startCountdownAndPlay(difficulty)}>
              Start game
            </Button>
            <Button className="flex-1" variant="secondary" onClick={exitToGames}>
              Exit
            </Button>
          </div>
        </div>
      </StartOverlay>

      {/* COUNTDOWN overlay */}
      <StartOverlay
        open={gameState === "COUNTDOWN"}
        title="Get ready"
        subtitle="Starting in..."
        onClose={pauseGame}
        closeLabel="Pause"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-6xl font-mono font-bold">{countdown}</div>
        </div>
      </StartOverlay>

      {/* PAUSED overlay */}
      <StartOverlay
        open={gameState === "PAUSED"}
        title="Paused"
        subtitle="Resume when you're ready."
        onClose={exitToGames}
        closeLabel="Exit"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={resumeGame}>
            Resume
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => startCountdownAndPlay(difficulty)}>
            Restart
          </Button>
          <Button className="flex-1" variant="outline" onClick={exitToGames}>
            Exit
          </Button>
        </div>
      </StartOverlay>

      {/* GAME OVER overlay */}
      <StartOverlay
        open={gameState === "GAME_OVER"}
        title="Game over"
        subtitle={`Score: ${score}  •  High: ${highScore}`}
        onClose={exitToGames}
        closeLabel="Exit"
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const selected = d === difficulty;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={[
                    "text-left p-4 rounded-xl border transition",
                    selected
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50",
                  ].join(" ")}
                >
                  <div className="font-semibold">{formatDifficulty(d)}</div>
                  <div className="text-sm text-slate-500 mt-1">Points: {POINTS[d]} / food</div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" onClick={() => startCountdownAndPlay(difficulty)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Play again
            </Button>
            <Button className="flex-1" variant="secondary" onClick={() => setGameState("MENU")}>
              Change settings
            </Button>
            <Button className="flex-1" variant="outline" onClick={exitToGames}>
              Exit
            </Button>
          </div>
        </div>
      </StartOverlay>
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
        "Some mobile browsers (notably iOS Safari) limit Fullscreen for canvases. Neon Snake includes Theater Mode, which works reliably on all devices.",
    },
    {
      question: "How is the score calculated?",
      answer:
        "Each food pellet adds points based on difficulty: Easy (10), Medium (20), Hard (30). Higher difficulty also moves faster.",
    },
    {
      question: "Can I pause the game?",
      answer:
        "Yes. On desktop, press Space (or P). On any device, use the Pause button in the top bar.",
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
          <li><strong>Eat & Grow:</strong> Each pellet increases your length.</li>
          <li><strong>Avoid Collisions:</strong> Walls or your own body end the run.</li>
          <li><strong>Pause Smart:</strong> Use pause to reset your thinking before tight turns.</li>
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
              Think about where your tail will be in 3–5 moves. Avoid creating dead-ends near corners.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Use Smooth Lines</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Gentle “S” routes reduce panic turns and keep exit paths open when you get long.
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
          Snake-style games trace back to early arcade designs and became globally iconic on late-90s mobile phones. The core loop remains timeless:
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
