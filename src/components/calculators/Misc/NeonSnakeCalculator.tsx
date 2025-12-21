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
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import StartOverlay from "@/components/games/StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const CELL_SIZE = 20;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;

const COLORS = {
  backgroundLight: "#f0f0f0",
  backgroundDark: "#0f111a",
  snakeHead: "#39ff14",
  snakeBody: "#0aff9d",
  pellet: "#ff2d95",
  gridLight: "#e0e0e0",
  gridDark: "#222831",
  neonGlow: "rgba(57,255,20,0.7)",
};

function playSound(type: "score" | "hit" | "win") {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    switch (type) {
      case "score":
        oscillator.frequency.value = 880;
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.type = "square";
        break;
      case "hit":
        oscillator.frequency.value = 220;
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        oscillator.type = "sawtooth";
        break;
      case "win":
        oscillator.frequency.value = 1320;
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        oscillator.type = "triangle";
        break;
    }

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
  } catch {
    // AudioContext not supported or blocked
  }
}

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("neonSnakeHighScore") ?? "0");
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const lastFrameTime = useRef<number>(0);

  // Game state refs to avoid stale closures in animation frame
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const pelletRef = useRef<Point>({ x: 0, y: 0 });
  const speedRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(gameState);

  // Difficulty Config
  const config = useMemo(() => {
    return difficulty === "easy"
      ? { speed: 5 }
      : difficulty === "medium"
      ? { speed: 8 }
      : { speed: 12 };
  }, [difficulty]);

  // Helpers
  const cellsX = CANVAS_WIDTH / CELL_SIZE;
  const cellsY = CANVAS_HEIGHT / CELL_SIZE;

  // Initialize game state
  const initGame = useCallback(() => {
    const startX = Math.floor(cellsX / 2);
    const startY = Math.floor(cellsY / 2);
    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    directionRef.current = "right";
    nextDirectionRef.current = "right";
    speedRef.current = config.speed;
    placePellet();
    setScore(0);
    gameStateRef.current = "playing";
  }, [cellsX, cellsY, config.speed]);

  // Place pellet in random free cell
  const placePellet = useCallback(() => {
    let newPellet: Point;
    const snake = snakeRef.current;
    do {
      newPellet = {
        x: Math.floor(Math.random() * cellsX),
        y: Math.floor(Math.random() * cellsY),
      };
    } while (snake.some((segment) => segment.x === newPellet.x && segment.y === newPellet.y));
    pelletRef.current = newPellet;
  }, [cellsX, cellsY]);

  // Check collision with walls or self
  const checkCollision = useCallback(
    (head: Point, snake: Point[]) => {
      if (head.x < 0 || head.x >= cellsX || head.y < 0 || head.y >= cellsY) return true;
      // Check self collision (skip head)
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
      }
      return false;
    },
    [cellsX, cellsY]
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameStateRef.current !== "playing") return;
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
        case " ":
        case "Escape":
          // Pause toggle
          setGameState((gs) => (gs === "playing" ? "paused" : gs === "paused" ? "playing" : gs));
          break;
      }
    },
    []
  );

  // Touch controls for mobile
  const handleTouchDirection = useCallback(
    (dir: Direction) => {
      if (gameStateRef.current !== "playing") return;
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
    },
    []
  );

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    gameStateRef.current = "playing";
    lastFrameTime.current = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size and scale for sharpness
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const drawGrid = () => {
      ctx.strokeStyle = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? COLORS.gridDark
        : COLORS.gridLight;
      ctx.lineWidth = 1;
      for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    };

    const drawPellet = (pos: Point) => {
      const cx = pos.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = pos.y * CELL_SIZE + CELL_SIZE / 2;
      const radius = CELL_SIZE * 0.35;

      // Neon glow
      ctx.shadowColor = COLORS.pellet;
      ctx.shadowBlur = 15;
      ctx.fillStyle = COLORS.pellet;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright circle
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ff5cc8";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSnake = (snake: Point[]) => {
      for (let i = snake.length - 1; i >= 0; i--) {
        const segment = snake[i];
        const cx = segment.x * CELL_SIZE + CELL_SIZE / 2;
        const cy = segment.y * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE * 0.45;

        if (i === 0) {
          // Head with neon glow
          ctx.shadowColor = COLORS.neonGlow;
          ctx.shadowBlur = 20;
          ctx.fillStyle = COLORS.snakeHead;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Eye
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#000";
          const eyeOffset = CELL_SIZE * 0.15;
          let eyeX = cx;
          let eyeY = cy;
          switch (directionRef.current) {
            case "up":
              eyeX -= eyeOffset;
              eyeY -= eyeOffset;
              break;
            case "down":
              eyeX += eyeOffset;
              eyeY += eyeOffset;
              break;
            case "left":
              eyeX -= eyeOffset;
              eyeY += eyeOffset;
              break;
            case "right":
              eyeX += eyeOffset;
              eyeY -= eyeOffset;
              break;
          }
          ctx.beginPath();
          ctx.arc(eyeX, eyeY, radius * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body segment with smaller glow
          ctx.shadowColor = COLORS.snakeBody;
          ctx.shadowBlur = 10;
          ctx.fillStyle = COLORS.snakeBody;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };

    const clearCanvas = () => {
      const bgColor = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? COLORS.backgroundDark
        : COLORS.backgroundLight;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    const update = (deltaTime: number) => {
      // Move snake based on speed (cells per second)
      // We accumulate time and move snake when enough time passed
      const moveInterval = 1000 / speedRef.current;
      if (!lastFrameTime.current) lastFrameTime.current = performance.now();

      if (deltaTime >= moveInterval) {
        // Update direction
        directionRef.current = nextDirectionRef.current;

        // Calculate new head position
        const head = snakeRef.current[0];
        let newHead: Point = { x: head.x, y: head.y };
        switch (directionRef.current) {
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
        if (checkCollision(newHead, snakeRef.current)) {
          playSound("hit");
          setGameState("gameover");
          gameStateRef.current = "gameover";
          return false;
        }

        // Add new head
        snakeRef.current = [newHead, ...snakeRef.current];

        // Check pellet eaten
        if (newHead.x === pelletRef.current.x && newHead.y === pelletRef.current.y) {
          playSound("score");
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              if (typeof window !== "undefined") {
                localStorage.setItem("neonSnakeHighScore", newScore.toString());
              }
            }
            return newScore;
          });
          placePellet();
        } else {
          // Remove tail
          snakeRef.current.pop();
        }

        lastFrameTime.current = performance.now();
      }
      return true;
    };

    const render = (time: number) => {
      if (gameStateRef.current !== "playing") return;

      const deltaTime = time - lastFrameTime.current;

      clearCanvas();
      drawGrid();
      drawPellet(pelletRef.current);
      drawSnake(snakeRef.current);

      if (update(deltaTime)) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [checkCollision, placePellet, config.speed, highScore, gameState]);

  // Start game when gameState changes to playing from ready or gameover
  useEffect(() => {
    if (gameState === "playing") {
      initGame();
    }
    gameStateRef.current = gameState;
  }, [gameState, initGame]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Touch controls UI buttons
  const touchControls = (
    <div className="flex gap-4">
      <Button
        variant="outline"
        aria-label="Move Up"
        onClick={() => handleTouchDirection("up")}
        className="p-4 rounded-full"
      >
        <ArrowUp />
      </Button>
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          aria-label="Move Left"
          onClick={() => handleTouchDirection("left")}
          className="p-4 rounded-full"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          aria-label="Move Down"
          onClick={() => handleTouchDirection("down")}
          className="p-4 rounded-full"
        >
          <ArrowDown />
        </Button>
      </div>
      <Button
        variant="outline"
        aria-label="Move Right"
        onClick={() => handleTouchDirection("right")}
        className="p-4 rounded-full"
      >
        <ArrowRight />
      </Button>
    </div>
  );

  // Right rail UI
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
          onClick={() => navigator.clipboard.writeText(window.location.href)}
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
        <div className="prose dark:prose-invert mt-8">
          <h3>How to Play</h3>
          <p>
            Use arrow keys or WASD to control the snake. Eat the neon pellets to grow longer and increase your score.
            Avoid hitting the walls or yourself. Pause the game anytime with the pause button or space/escape keys.
          </p>
          <p>On mobile, use the touch controls below to move the snake.</p>
        </div>
      }
    >
      <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl select-none">
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

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
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 rounded-xl z-50">
            <h2 className="text-4xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">Game Over</h2>
            <p className="text-lg text-slate-300 mb-6">Your score: {score}</p>
            <Button
              size="lg"
              onClick={() => {
                setGameState("ready");
                setScore(0);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Restart
            </Button>
          </div>
        )}
      </div>

      <div className="md:hidden mt-6 flex justify-center">{touchControls}</div>
    </GamePageLayout>
  );
}