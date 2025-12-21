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

const CELL_SIZE = 20; // px
const CANVAS_WIDTH = 480; // px
const CANVAS_HEIGHT = 270; // px
const COLS = CANVAS_WIDTH / CELL_SIZE;
const ROWS = CANVAS_HEIGHT / CELL_SIZE;

const DIRECTIONS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("neon-snake-highscore") || "0");
    }
    return 0;
  });

  // Snake state
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");
  const foodRef = useRef<Point>({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  // Difficulty Config
  // speed = moves per second
  const config = useMemo(() => {
    return difficulty === "easy"
      ? { speed: 5 }
      : difficulty === "medium"
      ? { speed: 8 }
      : { speed: 12 };
  }, [difficulty]);

  // Audio Helper (stub)
  const playSound = (type: "score" | "hit" | "win") => {
    // Could integrate Web Audio API or play audio files here
  };

  // Initialize game state
  const initGame = useCallback(() => {
    // Start snake in center, length 5, moving right
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    snakeRef.current = [];
    for (let i = 4; i >= 0; i--) {
      snakeRef.current.push({ x: startX - i, y: startY });
    }
    directionRef.current = "right";
    nextDirectionRef.current = "right";
    placeFood();
    setScore(0);
  }, []);

  // Place food in random empty cell
  const placeFood = useCallback(() => {
    let newFood: Point;
    const snake = snakeRef.current;
    do {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Point, snake: Point[]) => {
    // Walls
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return true;
    }
    // Self collision (skip last segment because it moves forward)
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
  }, []);

  // Game Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    if (snakeRef.current.length === 0) {
      initGame();
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const speed = config.speed;
    const frameDuration = 1000 / speed;

    const drawCell = (x: number, y: number, color: string) => {
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      // Neon glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      // Reset shadow for next draw
      ctx.shadowBlur = 0;
    };

    const clearCanvas = () => {
      // Background with dark/light mode compatible color
      ctx.fillStyle = getComputedStyle(canvas).backgroundColor || "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const render = (time: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
      const delta = time - lastFrameTimeRef.current;

      if (delta > frameDuration) {
        lastFrameTimeRef.current = time - (delta % frameDuration);

        // Update direction from nextDirectionRef if valid
        const currentDir = directionRef.current;
        const nextDir = nextDirectionRef.current;

        // Prevent reversing direction
        if (
          (currentDir === "up" && nextDir !== "down") ||
          (currentDir === "down" && nextDir !== "up") ||
          (currentDir === "left" && nextDir !== "right") ||
          (currentDir === "right" && nextDir !== "left")
        ) {
          directionRef.current = nextDir;
        }

        // Move snake
        const snake = [...snakeRef.current];
        const head = snake[snake.length - 1];
        const move = DIRECTIONS[directionRef.current];
        const newHead = { x: head.x + move.x, y: head.y + move.y };

        // Check collision
        if (checkCollision(newHead, snake)) {
          playSound("hit");
          setGameState("gameover");
          // Update high score if needed
          setHighScore((prev) => {
            if (score > prev) {
              if (typeof window !== "undefined") {
                localStorage.setItem("neon-snake-highscore", score.toString());
              }
              return score;
            }
            return prev;
          });
          return;
        }

        snake.push(newHead);

        // Check if food eaten
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore((s) => s + 1);
          playSound("score");
          placeFood();
          // Don't remove tail to grow snake
        } else {
          // Remove tail
          snake.shift();
        }

        snakeRef.current = snake;
      }

      // Draw
      clearCanvas();

      // Draw food (neon pink)
      drawCell(foodRef.current.x, foodRef.current.y, "#FF2D95");

      // Draw snake (neon cyan)
      snakeRef.current.forEach((segment, i) => {
        // Head brighter
        const color = i === snakeRef.current.length - 1 ? "#00FFF7" : "#00B8B8";
        drawCell(segment.x, segment.y, color);
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, config, checkCollision, initGame, placeFood, playSound, score]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          nextDirectionRef.current = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          nextDirectionRef.current = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          nextDirectionRef.current = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          nextDirectionRef.current = "right";
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Touch controls for mobile (D-Pad)
  const onTouchDirection = (dir: Direction) => {
    if (gameState === "playing") {
      nextDirectionRef.current = dir;
    }
  };

  // Handle gameover overlay
  const GameOverOverlay = () => (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center shadow-2xl max-w-xs mx-4">
        <h2 className="text-3xl font-extrabold text-emerald-400 mb-4 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" /> Game Over
        </h2>
        <p className="text-slate-300 mb-4">Your score: <span className="font-bold text-white">{score}</span></p>
        <p className="text-slate-400 mb-6">High score: <span className="font-bold text-emerald-400">{highScore}</span></p>
        <Button
          size="lg"
          onClick={() => {
            setGameState("ready");
          }}
          className="w-full"
        >
          Play Again
        </Button>
      </div>
    </div>
  );

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
            disabled={gameState === "ready" || gameState === "gameover"}
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
          <Button variant="destructive" onClick={() => setGameState("ready")}>
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <GamePageLayout
      title="Neon Snake"
      description="A modern neon twist on the classic Snake game. Eat pellets, grow longer, and avoid hitting the walls or yourself."
      rightRail={rightRail}
      below={
        <div className="prose dark:prose-invert mt-8 max-w-none text-slate-700 dark:text-slate-300">
          <h3>How to Play</h3>
          <p>
            Use arrow keys or WASD on desktop, or the on-screen D-Pad on mobile to control the snake. Eat the neon pink pellets to grow longer. Avoid hitting the walls or yourself. Select difficulty before starting.
          </p>
        </div>
      }
    >
      <div
        className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl select-none"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full block touch-none"
          aria-label="Neon Snake game canvas"
          role="img"
        />

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

        {gameState === "gameover" && <GameOverOverlay />}
      </div>

      {/* Mobile D-Pad Controls */}
      <div className="md:hidden mt-6 flex justify-center gap-4 select-none">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <Button
            variant="outline"
            size="icon"
            aria-label="Move Up"
            onTouchStart={() => onTouchDirection("up")}
            onMouseDown={() => onTouchDirection("up")}
            className="bg-slate-200 dark:bg-slate-800"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            aria-label="Move Left"
            onTouchStart={() => onTouchDirection("left")}
            onMouseDown={() => onTouchDirection("left")}
            className="bg-slate-200 dark:bg-slate-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            aria-label="Move Right"
            onTouchStart={() => onTouchDirection("right")}
            onMouseDown={() => onTouchDirection("right")}
            className="bg-slate-200 dark:bg-slate-800"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          <div />
          <Button
            variant="outline"
            size="icon"
            aria-label="Move Down"
            onTouchStart={() => onTouchDirection("down")}
            onMouseDown={() => onTouchDirection("down")}
            className="bg-slate-200 dark:bg-slate-800"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
          <div />
        </div>
      </div>
    </GamePageLayout>
  );
}