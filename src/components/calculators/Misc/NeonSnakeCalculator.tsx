import { useEffect, useRef, useState, useMemo } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Pause, Share2, MessageSquare } from "lucide-react";
import StartOverlay from "@/components/games/StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

type Point = { x: number; y: number };

const CELL_SIZE = 20; // size of each cell in pixels
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const COLS = CANVAS_WIDTH / CELL_SIZE; // 32
const ROWS = CANVAS_HEIGHT / CELL_SIZE; // 18

const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const NEON_COLORS = [
  "#39FF14",
  "#0FF0FC",
  "#FF2079",
  "#FF8C00",
  "#FF00FF",
  "#00FFFF",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return NEON_COLORS[randomInt(0, NEON_COLORS.length - 1)];
}

function drawNeonRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
}

function drawNeonCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state refs to avoid re-renders on every frame
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const pelletRef = useRef<Point>({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const lastUpdateTime = useRef<number>(0);
  const speedRef = useRef<number>(0); // moves per second
  const gameOverRef = useRef<boolean>(false);

  // Initialize game state on start or reset
  function initGame() {
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    pelletRef.current = spawnPellet(snakeRef.current);
    setScore(0);
    gameOverRef.current = false;

    switch (difficulty) {
      case "easy":
        speedRef.current = 5;
        break;
      case "medium":
        speedRef.current = 8;
        break;
      case "hard":
        speedRef.current = 12;
        break;
    }
  }

  // Spawn pellet in a free cell
  function spawnPellet(snake: Point[]) {
    let pellet: Point;
    while (true) {
      pellet = {
        x: randomInt(0, COLS - 1),
        y: randomInt(0, ROWS - 1),
      };
      if (!snake.some((s) => s.x === pellet.x && s.y === pellet.y)) break;
    }
    return pellet;
  }

  // Check collision with walls or self
  function checkCollision(head: Point, snake: Point[]) {
    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)
      return true;
    // Self collision (skip head at index 0)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
  }

  // Handle keyboard input for direction
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameState !== "playing") return;
      if (!(e.key in DIRECTIONS)) return;

      const newDir = DIRECTIONS[e.key];
      const currDir = directionRef.current;

      // Prevent reversing direction
      if (newDir.x === -currDir.x && newDir.y === -currDir.y) return;

      nextDirectionRef.current = newDir;
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === "ready") {
      initGame();
      drawInitialCanvas();
      return;
    }
    if (gameState === "gameover") {
      cancelAnimationFrame(animationFrameId.current!);
      return;
    }
    if (gameState === "paused") {
      cancelAnimationFrame(animationFrameId.current!);
      return;
    }
    if (gameState === "playing") {
      lastUpdateTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, [gameState, difficulty]);

  // Draw initial canvas with black background and grid lines faintly
  function drawInitialCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // faint grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
  }

  // Draw the entire game frame
  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid faintly
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
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

    // Draw pellet as neon circle
    const pellet = pelletRef.current;
    const pelletColor = "#FF2079";
    drawNeonCircle(
      ctx,
      pellet.x * CELL_SIZE + CELL_SIZE / 2,
      pellet.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      pelletColor
    );

    // Draw snake with gradient neon colors
    const snake = snakeRef.current;
    for (let i = 0; i < snake.length; i++) {
      const segment = snake[i];
      // Color gradient from head to tail
      const colorIndex = Math.floor(
        (i / snake.length) * (NEON_COLORS.length - 1)
      );
      const color = NEON_COLORS[colorIndex];
      drawNeonRect(
        ctx,
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        color
      );
    }
  }

  // Game loop function
  function gameLoop(timestamp: number) {
    if (gameState !== "playing") return;

    const elapsed = (timestamp - lastUpdateTime.current) / 1000;
    const interval = 1 / speedRef.current;

    if (elapsed > interval) {
      lastUpdateTime.current = timestamp;

      // Update direction
      directionRef.current = nextDirectionRef.current;

      // Move snake
      const snake = snakeRef.current;
      const head = snake[0];
      const dir = directionRef.current;
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Check collisions
      if (checkCollision(newHead, snake)) {
        gameOverRef.current = true;
        setGameState("gameover");
        if (score > highScore) setHighScore(score);
        return;
      }

      // Add new head
      snake.unshift(newHead);

      // Check pellet eaten
      const pellet = pelletRef.current;
      if (newHead.x === pellet.x && newHead.y === pellet.y) {
        // Increase score
        setScore((s) => s + 1);
        // Spawn new pellet
        pelletRef.current = spawnPellet(snake);
      } else {
        // Remove tail
        snake.pop();
      }
    }

    drawFrame();

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }

  // Difficulty selector JSX for StartOverlay
  const difficultySelector = (
    <div className="flex flex-col space-y-3 mt-4">
      <span className="text-sm font-semibold text-slate-400 mb-1">
        Select Difficulty
      </span>
      <div className="flex space-x-3 justify-center">
        {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
          <Button
            key={level}
            variant={difficulty === level ? "default" : "outline"}
            onClick={() => setDifficulty(level)}
            className="capitalize"
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  );

  const rightRail = (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex justify-between mb-4">
          <span className="text-slate-500">Score</span>
          <span className="text-2xl font-bold dark:text-white">{score}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-slate-500">High Score</span>
          <span className="text-2xl font-bold dark:text-white">{highScore}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() =>
              setGameState(gameState === "playing" ? "paused" : "playing")
            }
            disabled={gameState === "ready" || gameState === "gameover"}
          >
            {gameState === "playing" ? "Pause" : "Resume"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setGameState("ready")}
            disabled={gameState === "ready"}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start dark:text-slate-200"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <Share2 className="mr-2 h-4 w-4" /> Share this page
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500"
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
    >
      <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full block touch-none"
        />
        <StartOverlay
          open={gameState === "ready"}
          onClose={() => setGameState("playing")}
          title="Neon Snake"
        >
          {difficultySelector}
        </StartOverlay>
      </div>
    </GamePageLayout>
  );
}