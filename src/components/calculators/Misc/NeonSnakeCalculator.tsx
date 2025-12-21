import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  Play,
  RotateCcw,
  Pause,
  Trophy,
  Share2,
  MessageSquare,
  Maximize2,
  Minimize2,
  Star,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import StartOverlay from "./StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const CELL_SIZE = 20; // pixels per grid cell
const GRID_WIDTH = 30; // number of cells horizontally
const GRID_HEIGHT = 20; // number of cells vertically

// Colors for neon theme
const COLORS = {
  bgLight: "#f0f0f0",
  bgDark: "#0f172a",
  snakeHead: "#0ff", // cyan neon
  snakeBody: "#06b6d4", // blue neon
  pellet: "#f0f", // magenta neon
  gridLight: "#ddd",
  gridDark: "#1e293b",
  borderLight: "#ccc",
  borderDark: "#334155",
  textLight: "#111827",
  textDark: "#f8fafc",
};

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("neon-snake-highscore") ?? 0);
    }
    return 0;
  });

  // Snake state
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const pelletRef = useRef<Point>({ x: 0, y: 0 });
  const lastUpdateTimeRef = useRef(0);
  const speedRef = useRef(0);
  const growingRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Difficulty Config
  const config = useMemo(() => {
    // Speed is updates per second
    return difficulty === "easy"
      ? { speed: 5 }
      : difficulty === "medium"
      ? { speed: 8 }
      : { speed: 12 };
  }, [difficulty]);

  // Play sound effects (simple beeps)
  const playSound = useCallback((type: "score" | "hit" | "win") => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);

      switch (type) {
        case "score":
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.1, ctx.currentTime);
          o.start();
          o.stop(ctx.currentTime + 0.1);
          break;
        case "hit":
          o.frequency.value = 220;
          g.gain.setValueAtTime(0.2, ctx.currentTime);
          o.start();
          o.stop(ctx.currentTime + 0.3);
          break;
        case "win":
          o.frequency.value = 1320;
          g.gain.setValueAtTime(0.15, ctx.currentTime);
          o.start();
          o.stop(ctx.currentTime + 0.2);
          break;
      }
    } catch {
      // AudioContext might be blocked or unavailable
    }
  }, []);

  // Initialize game state
  const resetGame = useCallback(() => {
    // Start snake in middle, length 3, moving right
    const startX = Math.floor(GRID_WIDTH / 2);
    const startY = Math.floor(GRID_HEIGHT / 2);
    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    directionRef.current = "right";
    nextDirectionRef.current = "right";
    growingRef.current = 0;
    setScore(0);
    spawnPellet();
  }, []);

  // Spawn pellet in random position not occupied by snake
  const spawnPellet = useCallback(() => {
    let pellet: Point;
    const snake = snakeRef.current;
    do {
      pellet = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snake.some((s) => s.x === pellet.x && s.y === pellet.y));
    pelletRef.current = pellet;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Point, snake: Point[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      return true;
    }
    // Self collision (ignore head)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
  }, []);

  // Update snake position
  const updateSnake = useCallback(() => {
    const snake = snakeRef.current;
    const dir = nextDirectionRef.current;
    directionRef.current = dir;

    // Calculate new head position
    const head = snake[0];
    let newHead: Point;
    switch (dir) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check collision
    if (checkCollision(newHead, snake)) {
      playSound("hit");
      setGameState("gameover");
      return;
    }

    // Add new head
    snake.unshift(newHead);

    // Check pellet eaten
    if (newHead.x === pelletRef.current.x && newHead.y === pelletRef.current.y) {
      playSound("score");
      setScore((s) => {
        const newScore = s + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
          if (typeof window !== "undefined") {
            localStorage.setItem("neon-snake-highscore", newScore.toString());
          }
        }
        return newScore;
      });
      growingRef.current += 1;
      spawnPellet();
    }

    // Remove tail if not growing
    if (growingRef.current > 0) {
      growingRef.current -= 1;
    } else {
      snake.pop();
    }
  }, [checkCollision, playSound, setGameState, spawnPellet, highScore]);

  // Draw grid, snake, pellet
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine dark mode from body class (tailwind adds 'dark' class)
    const isDark = document.documentElement.classList.contains("dark");

    // Background
    ctx.fillStyle = isDark ? COLORS.bgDark : COLORS.bgLight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (optional subtle)
    ctx.strokeStyle = isDark ? COLORS.gridDark : COLORS.gridLight;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }

    // Draw pellet
    const pellet = pelletRef.current;
    ctx.fillStyle = COLORS.pellet;
    ctx.shadowColor = COLORS.pellet;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      pellet.x * CELL_SIZE + CELL_SIZE / 2,
      pellet.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    const snake = snakeRef.current;
    snake.forEach((segment, i) => {
      if (i === 0) {
        // Head
        ctx.fillStyle = COLORS.snakeHead;
        ctx.shadowColor = COLORS.snakeHead;
        ctx.shadowBlur = 15;
      } else {
        ctx.fillStyle = COLORS.snakeBody;
        ctx.shadowColor = COLORS.snakeBody;
        ctx.shadowBlur = 10;
      }
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      ctx.shadowBlur = 0;
    });
  }, []);

  // Game loop with requestAnimationFrame
  useEffect(() => {
    if (gameState !== "playing") return;

    speedRef.current = config.speed;
    lastUpdateTimeRef.current = performance.now();

    const step = (time: number) => {
      if (gameState !== "playing") return;

      const elapsed = time - lastUpdateTimeRef.current;
      const interval = 1000 / speedRef.current;

      if (elapsed > interval) {
        updateSnake();
        draw();
        lastUpdateTimeRef.current = time;
      }

      animationFrameIdRef.current = requestAnimationFrame(step);
    };

    animationFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameState, config.speed, updateSnake, draw]);

  // Reset game when entering ready state
  useEffect(() => {
    if (gameState === "ready") {
      resetGame();
      draw();
    }
  }, [gameState, resetGame, draw]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (dir !== "down") nextDirectionRef.current = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (dir !== "up") nextDirectionRef.current = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (dir !== "right") nextDirectionRef.current = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (dir !== "left") nextDirectionRef.current = "right";
          break;
        case "Escape":
          setGameState("paused");
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Mobile touch controls (D-Pad)
  const handleDirectionChange = useCallback(
    (dir: Direction) => {
      const currentDir = directionRef.current;
      // Prevent reversing direction
      if (
        (dir === "up" && currentDir === "down") ||
        (dir === "down" && currentDir === "up") ||
        (dir === "left" && currentDir === "right") ||
        (dir === "right" && currentDir === "left")
      ) {
        return;
      }
      nextDirectionRef.current = dir;
    },
    []
  );

  // Handle gameover overlay
  const GameOverOverlay = () => (
    <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xl max-w-xs mx-4">
        <h2 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mb-4">Game Over</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300">
          Your score: <span className="font-bold">{score}</span>
        </p>
        <Button
          size="lg"
          onClick={() => {
            resetGame();
            setGameState("ready");
          }}
          className="w-full"
        >
          Restart
        </Button>
      </div>
    </div>
  );

  // Canvas size setup (responsive)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas pixel size based on grid and cell size
    canvas.width = GRID_WIDTH * CELL_SIZE;
    canvas.height = GRID_HEIGHT * CELL_SIZE;

    // Style canvas to fill container (aspect ratio 16:9)
    // This is handled by CSS class "w-full h-full block"
  }, []);

  // Right Rail UI
  const rightRail = (
    <div className="space-y-6">
      {/* Stats Card - Dark/Light Responsive */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Score</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{score}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Best</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{highScore}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={gameState === "playing" ? "outline" : "default"}
            onClick={() => setGameState(gameState === "playing" ? "paused" : "playing")}
          >
            {gameState === "playing" ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Resume
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              resetGame();
              setGameState("ready");
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Share & Suggestion - Dark/Light Responsive */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start bg-white dark:bg-slate-900 dark:text-slate-200"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Page URL copied to clipboard!");
          }}
        >
          <Share2 className="mr-2 h-4 w-4" /> Share this page
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          asChild
        >
          <a href="/contact">
            <MessageSquare className="mr-2 h-4 w-4" /> Send us a suggestion
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <GamePageLayout
      title="Neon Snake"
      description="A modern neon twist on the classic Snake game. Eat pellets, grow longer, and avoid hitting the walls or yourself."
      rightRail={rightRail}
      below={
        <div className="prose dark:prose-invert mt-8 max-w-none text-slate-700 dark:text-slate-300">
          <h3>How to Play</h3>
          <p>
            Use arrow keys (or WASD) on desktop, or the on-screen D-Pad on mobile, to control the snake.
            Eat the glowing pellets to grow longer and increase your score.
            Avoid hitting the walls or your own tail.
            Select difficulty before starting for different speeds.
          </p>
        </div>
      }
    >
      <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        {/* Start Overlay (Supports Dark/Light) */}
        <StartOverlay open={gameState === "ready"} onClose={() => setGameState("playing")} title="Neon Snake">
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">Select Difficulty:</p>
            <div className="flex gap-2 justify-center">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? "default" : "outline"}
                  onClick={() => setDifficulty(d)}
                  className="capitalize"
                >
                  {d}
                </Button>
              ))}
            </div>
            <Button size="lg" className="w-full mt-4" onClick={() => setGameState("playing")}>
              Start Game
            </Button>
          </div>
        </StartOverlay>

        {/* Paused Overlay */}
        {gameState === "paused" && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Paused</h2>
              <Button onClick={() => setGameState("playing")} size="lg">
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === "gameover" && <GameOverOverlay />}
      </div>

      {/* Mobile Controls (Visible only on touch) */}
      <div className="md:hidden mt-6 flex justify-center gap-4 select-none">
        {gameState === "playing" && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleDirectionChange("up")}
              aria-label="Move Up"
              className="rounded-full p-3"
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDirectionChange("left")}
                aria-label="Move Left"
                className="rounded-full p-3"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDirectionChange("down")}
                aria-label="Move Down"
                className="rounded-full p-3"
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleDirectionChange("right")}
                aria-label="Move Right"
                className="rounded-full p-3"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </>
        )}
      </div>
    </GamePageLayout>
  );
}