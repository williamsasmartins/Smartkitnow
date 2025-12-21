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
// ⚠️ CORRECT IMPORT PATH
import StartOverlay from "@/components/games/StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const CELL_SIZE = 20; // size of each snake segment and pellet in pixels

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("neon-snake-highscore") ?? "0");
    }
    return 0;
  });

  // Snake state refs for game loop
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const pelletRef = useRef<Point>({ x: 0, y: 0 });
  const lastFrameTimeRef = useRef(0);
  const speedRef = useRef(8); // cells per second
  const gameOverRef = useRef(false);

  // Canvas size in cells (will be calculated dynamically)
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Difficulty Config
  const config = useMemo(() => {
    return difficulty === "easy"
      ? { speed: 5 }
      : difficulty === "medium"
      ? { speed: 8 }
      : { speed: 12 };
  }, [difficulty]);

  // Play sound stub (can be enhanced)
  const playSound = (type: "score" | "hit" | "win") => {
    // Placeholder for sound effects
    // Could integrate Web Audio API or Howler.js here
  };

  // Initialize game state when game starts or resets
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate number of cells based on canvas size and CELL_SIZE
    const width = Math.floor(canvas.width / CELL_SIZE);
    const height = Math.floor(canvas.height / CELL_SIZE);
    setCanvasSize({ width, height });

    // Start snake in center, length 5, moving right
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height / 2);
    snakeRef.current = [];
    for (let i = 0; i < 5; i++) {
      snakeRef.current.push({ x: startX - i, y: startY });
    }
    directionRef.current = "right";
    nextDirectionRef.current = "right";

    // Place pellet randomly
    placePellet(width, height, snakeRef.current);

    setScore(0);
    gameOverRef.current = false;
    speedRef.current = config.speed;
  }, [config.speed]);

  // Place pellet in a random free cell
  const placePellet = (width: number, height: number, snake: Point[]) => {
    let pellet: Point;
    while (true) {
      pellet = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
      // Ensure pellet is not on snake
      if (!snake.some((seg) => seg.x === pellet.x && seg.y === pellet.y)) break;
    }
    pelletRef.current = pellet;
  };

  // Handle keyboard input for desktop
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
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
      }
    },
    [gameState]
  );

  // Game loop and rendering
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container size * devicePixelRatio for sharpness
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize game if starting fresh
    if (snakeRef.current.length === 0 || gameOverRef.current) {
      initGame();
    }

    speedRef.current = config.speed;

    let animationFrameId: number;

    const drawBackground = () => {
      // Dark/Light mode background gradient neon style
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (document.documentElement.classList.contains("dark")) {
        gradient.addColorStop(0, "#0f172a"); // slate-900
        gradient.addColorStop(1, "#1e293b"); // slate-800
      } else {
        gradient.addColorStop(0, "#e0e7ff"); // indigo-100
        gradient.addColorStop(1, "#c7d2fe"); // indigo-200
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawGrid = () => {
      // Optional: subtle grid lines for style
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvasSize.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvasSize.height * CELL_SIZE);
        ctx.stroke();
      }
      for (let y = 0; y <= canvasSize.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvasSize.width * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
      }
    };

    const drawSnake = () => {
      const snake = snakeRef.current;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Neon glow style for snake
      ctx.shadowColor = "#0ff";
      ctx.shadowBlur = 10;

      // Draw snake body
      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        const x = seg.x * CELL_SIZE;
        const y = seg.y * CELL_SIZE;

        // Head is brighter
        if (i === 0) {
          ctx.fillStyle = "#0ff";
          ctx.shadowColor = "#0ff";
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = "#06b6d4"; // cyan-500
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 10;
        }
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
      ctx.shadowBlur = 0;
    };

    const drawPellet = () => {
      const pellet = pelletRef.current;
      const x = pellet.x * CELL_SIZE + CELL_SIZE / 2;
      const y = pellet.y * CELL_SIZE + CELL_SIZE / 2;

      // Neon glowing pellet
      ctx.beginPath();
      ctx.shadowColor = "#f0f";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#d946ef"; // violet-500
      ctx.strokeStyle = "#ec4899"; // pink-500
      ctx.lineWidth = 2;
      ctx.arc(x, y, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Check collision with walls or self
    const checkCollision = (head: Point, snake: Point[]) => {
      // Walls
      if (
        head.x < 0 ||
        head.x >= canvasSize.width ||
        head.y < 0 ||
        head.y >= canvasSize.height
      ) {
        return true;
      }
      // Self collision (skip head)
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
      }
      return false;
    };

    // Move snake forward
    const moveSnake = () => {
      const snake = snakeRef.current;
      const dir = nextDirectionRef.current;
      directionRef.current = dir;

      const head = snake[0];
      let newHead: Point = { x: head.x, y: head.y };
      switch (dir) {
        case "up":
          newHead.y -= 1;
          break;
        case "down":
          newHead.y += 1;
          break;
        case "left":
          newHead.x -= 1;
          break;
        case "right":
          newHead.x += 1;
          break;
      }

      // Check collision
      if (checkCollision(newHead, snake)) {
        gameOverRef.current = true;
        playSound("hit");
        setGameState("gameover");
        return;
      }

      // Add new head
      snake.unshift(newHead);

      // Check pellet eaten
      if (newHead.x === pelletRef.current.x && newHead.y === pelletRef.current.y) {
        // Increase score
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
        playSound("score");
        // Place new pellet
        placePellet(canvasSize.width, canvasSize.height, snake);
      } else {
        // Remove tail
        snake.pop();
      }
    };

    const gameLoop = (timestamp: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
      const elapsed = (timestamp - lastFrameTimeRef.current) / 1000; // seconds
      const interval = 1 / speedRef.current;

      if (elapsed > interval) {
        moveSnake();
        lastFrameTimeRef.current = timestamp;
      }

      // Draw everything
      drawBackground();
      drawGrid();
      drawPellet();
      drawSnake();

      if (!gameOverRef.current && gameState === "playing") {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, config.speed, canvasSize.width, canvasSize.height, highScore, playSound, initGame]);

  // Setup keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset game when state changes to ready
  useEffect(() => {
    if (gameState === "ready") {
      initGame();
    }
  }, [gameState, initGame]);

  // Mobile touch controls handlers
  const onTouchDirection = (dir: Direction) => {
    if (gameState !== "playing") return;
    const currentDir = directionRef.current;
    // Prevent reversing
    if (
      (dir === "up" && currentDir !== "down") ||
      (dir === "down" && currentDir !== "up") ||
      (dir === "left" && currentDir !== "right") ||
      (dir === "right" && currentDir !== "left")
    ) {
      nextDirectionRef.current = dir;
    }
  };

  // UI Components
  const rightRail = (
    <div className="space-y-6">
      {/* Stats Card */}
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
              setGameState("ready");
              setScore(0);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Share & Suggestion */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start bg-white dark:bg-slate-900 dark:text-slate-200"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
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
            Use arrow keys or WASD on desktop to control the snake. On mobile, use the on-screen buttons.
            Eat the glowing pellets to grow longer and increase your score. Avoid hitting the walls or your own tail.
            Select difficulty before starting to adjust the snake's speed.
          </p>
        </div>
      }
    >
      <div
        className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl"
        style={{ touchAction: "none" }}
      >
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        <StartOverlay
          open={gameState === "ready"}
          onClose={() => setGameState("playing")}
          title="Neon Snake"
        >
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

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center shadow-2xl max-w-xs mx-4">
              <h2 className="text-3xl font-extrabold text-pink-500 mb-4">Game Over</h2>
              <p className="text-slate-300 mb-6">Your Score: {score}</p>
              <Button
                size="lg"
                onClick={() => {
                  setGameState("ready");
                  setScore(0);
                }}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Restart
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden mt-6 flex justify-center gap-4 select-none">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <Button
            variant="outline"
            onTouchStart={() => onTouchDirection("up")}
            onMouseDown={() => onTouchDirection("up")}
            aria-label="Up"
            className="aspect-square flex items-center justify-center"
          >
            <ArrowUp />
          </Button>
          <div />
          <Button
            variant="outline"
            onTouchStart={() => onTouchDirection("left")}
            onMouseDown={() => onTouchDirection("left")}
            aria-label="Left"
            className="aspect-square flex items-center justify-center"
          >
            <ArrowLeft />
          </Button>
          <div />
          <Button
            variant="outline"
            onTouchStart={() => onTouchDirection("right")}
            onMouseDown={() => onTouchDirection("right")}
            aria-label="Right"
            className="aspect-square flex items-center justify-center"
          >
            <ArrowRight />
          </Button>
          <div />
          <Button
            variant="outline"
            onTouchStart={() => onTouchDirection("down")}
            onMouseDown={() => onTouchDirection("down")}
            aria-label="Down"
            className="aspect-square flex items-center justify-center"
          >
            <ArrowDown />
          </Button>
          <div />
        </div>
      </div>
    </GamePageLayout>
  );
}