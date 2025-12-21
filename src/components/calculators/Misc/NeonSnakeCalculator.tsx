import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  Play,
  RotateCcw,
  Pause,
  Trophy,
  Zap,
  Shield as ShieldIcon,
} from "lucide-react";
import StartOverlay from "@/components/games/StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

type Lane = number; // 0-based lane index

// Constants for game config per difficulty
const DIFFICULTY_CONFIG = {
  easy: {
    lanes: 3,
    baseSpeed: 1.5,
    speedIncreaseRate: 0.0003,
    brickSpawnInterval: 900,
    powerUpSpawnInterval: 8000,
  },
  medium: {
    lanes: 4,
    baseSpeed: 2.2,
    speedIncreaseRate: 0.0005,
    brickSpawnInterval: 700,
    powerUpSpawnInterval: 7000,
  },
  hard: {
    lanes: 5,
    baseSpeed: 3,
    speedIncreaseRate: 0.0007,
    brickSpawnInterval: 500,
    powerUpSpawnInterval: 6000,
  },
};

type Brick = {
  id: number;
  lane: Lane;
  y: number;
  size: number;
  speed: number;
  color: string;
};

type PowerUpType = "shield" | "multiplier";

type PowerUp = {
  id: number;
  lane: Lane;
  y: number;
  size: number;
  speed: number;
  type: PowerUpType;
  color: string;
};

type Player = {
  lane: Lane;
  width: number;
  height: number;
  y: number;
  color: string;
  shieldActive: boolean;
  shieldTimer: number;
  multiplierActive: boolean;
  multiplierTimer: number;
};

const POWERUP_DURATION = 7000; // ms
const SHIELD_COLOR = "#7f5af0"; // neon purple
const MULTIPLIER_COLOR = "#ff49db"; // neon pink
const BRICK_COLOR = "#3b82f6"; // neon blue
const PLAYER_COLOR = "#ff49db"; // neon pink

// Utility for random int in [min, max]
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamp helper
function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export default function NeonSnakeCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Game entities refs to avoid re-creating on each render
  const bricks = useRef<Brick[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const player = useRef<Player>({
    lane: 0,
    width: 0,
    height: 0,
    y: 0,
    color: PLAYER_COLOR,
    shieldActive: false,
    shieldTimer: 0,
    multiplierActive: false,
    multiplierTimer: 0,
  });

  // Timing refs
  const lastBrickSpawn = useRef(0);
  const lastPowerUpSpawn = useRef(0);
  const gameStartTime = useRef(0);
  const lastFrameTime = useRef(0);
  const speedMultiplier = useRef(1);

  // Input state
  const inputState = useRef({
    leftPressed: false,
    rightPressed: false,
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
  });

  // Canvas size and lane width
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const laneCount = useRef(3);
  const laneWidth = useRef(0);

  // Score multiplier state
  const scoreMultiplier = useRef(1);

  // Used to generate unique IDs for bricks and power-ups
  const entityIdCounter = useRef(0);
  function nextEntityId() {
    entityIdCounter.current += 1;
    return entityIdCounter.current;
  }

  // Load High Score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("brick-dash-best");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Save High Score when score updates
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("brick-dash-best", score.toString());
    }
  }, [score, highScore]);

  // Reset game state when difficulty or gameState changes to ready
  useEffect(() => {
    if (gameState === "ready") {
      bricks.current = [];
      powerUps.current = [];
      scoreMultiplier.current = 1;
      speedMultiplier.current = 1;

      const config = DIFFICULTY_CONFIG[difficulty];
      laneCount.current = config.lanes;

      // Reset player to middle lane
      player.current = {
        lane: Math.floor(config.lanes / 2),
        width: 0,
        height: 0,
        y: 0,
        color: PLAYER_COLOR,
        shieldActive: false,
        shieldTimer: 0,
        multiplierActive: false,
        multiplierTimer: 0,
      };

      setScore(0);
      lastBrickSpawn.current = 0;
      lastPowerUpSpawn.current = 0;
      gameStartTime.current = 0;
      lastFrameTime.current = 0;
    }
  }, [gameState, difficulty]);

  // Handle window resize and setup canvas size and player size
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      // Use devicePixelRatio for sharpness
      const dpr = window.devicePixelRatio || 1;
      canvasWidth.current = rect.width * dpr;
      canvasHeight.current = rect.height * dpr;

      canvas.width = canvasWidth.current;
      canvas.height = canvasHeight.current;

      laneWidth.current = canvasWidth.current / laneCount.current;

      // Setup player size and position
      player.current.width = laneWidth.current * 0.6;
      player.current.height = laneWidth.current * 0.4;
      player.current.y = canvasHeight.current - player.current.height - 10 * dpr;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [difficulty, gameState]);

  // Input handlers
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameState !== "playing") return;
      if (e.repeat) return;

      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        inputState.current.leftPressed = true;
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        inputState.current.rightPressed = true;
      } else if (e.key === " " || e.key === "Spacebar") {
        // Space toggles pause/play
        setGameState((gs) => {
          if (gs === "playing") return "paused";
          if (gs === "paused") return "playing";
          return gs;
        });
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        inputState.current.leftPressed = false;
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        inputState.current.rightPressed = false;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState]);

  // Touch handlers for mobile controls (tap left/right or swipe)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onTouchStart(e: TouchEvent) {
      if (gameState !== "playing") return;
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      inputState.current.touchStartX = touch.clientX;
      inputState.current.touchStartY = touch.clientY;
      inputState.current.touchEndX = touch.clientX;
      inputState.current.touchEndY = touch.clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (gameState !== "playing") return;
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      inputState.current.touchEndX = touch.clientX;
      inputState.current.touchEndY = touch.clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (gameState !== "playing") return;

      const dx = inputState.current.touchEndX - inputState.current.touchStartX;
      const dy = inputState.current.touchEndY - inputState.current.touchStartY;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Swipe detection threshold
      const swipeThreshold = 30;

      if (absDx > absDy && absDx > swipeThreshold) {
        // Horizontal swipe
        if (dx > 0) {
          // Swipe right
          movePlayerRight();
        } else {
          // Swipe left
          movePlayerLeft();
        }
      } else {
        // Tap detection: tap left or right half of canvas
        const rect = canvas.getBoundingClientRect();
        const tapX = inputState.current.touchStartX - rect.left;
        if (tapX < rect.width / 2) {
          movePlayerLeft();
        } else {
          movePlayerRight();
        }
      }
    }

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [gameState]);

  // Player movement helpers
  const movePlayerLeft = useCallback(() => {
    if (gameState !== "playing") return;
    player.current.lane = clamp(player.current.lane - 1, 0, laneCount.current - 1);
  }, [gameState]);

  const movePlayerRight = useCallback(() => {
    if (gameState !== "playing") return;
    player.current.lane = clamp(player.current.lane + 1, 0, laneCount.current - 1);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize game start time and last frame time
    if (!gameStartTime.current) {
      gameStartTime.current = performance.now();
      lastFrameTime.current = performance.now();
    }

    // Setup player initial lane if not set
    if (player.current.lane < 0 || player.current.lane >= laneCount.current) {
      player.current.lane = Math.floor(laneCount.current / 2);
    }

    // Clear input flags for keys (left/right) - we will use continuous movement on key hold
    // But player moves only one lane per key press, so we handle keydown only once (already done)

    // Game config for current difficulty
    const config = DIFFICULTY_CONFIG[difficulty];

    // Sizes for bricks and power-ups
    const brickSize = laneWidth.current * 0.7;
    const powerUpSize = laneWidth.current * 0.5;

    // Speed base and increase over time
    const now = performance.now();
    const elapsed = now - gameStartTime.current;
    const speed =
      config.baseSpeed + elapsed * config.speedIncreaseRate * speedMultiplier.current;

    // Spawn bricks
    if (now - lastBrickSpawn.current > config.brickSpawnInterval) {
      lastBrickSpawn.current = now;

      // Spawn brick in random lane
      const lane = randInt(0, laneCount.current - 1);

      // Avoid spawning brick exactly on player lane with high chance to keep fairness
      // But allow sometimes to increase difficulty
      const avoidPlayerLaneChance = 0.7;
      let spawnLane = lane;
      if (
        Math.random() < avoidPlayerLaneChance &&
        lane === player.current.lane &&
        laneCount.current > 1
      ) {
        // Pick a different lane
        const otherLanes = [];
        for (let i = 0; i < laneCount.current; i++) {
          if (i !== player.current.lane) otherLanes.push(i);
        }
        spawnLane =
          otherLanes[randInt(0, otherLanes.length - 1)] ?? player.current.lane;
      }

      bricks.current.push({
        id: nextEntityId(),
        lane: spawnLane,
        y: -brickSize,
        size: brickSize,
        speed,
        color: BRICK_COLOR,
      });
    }

    // Spawn power-ups occasionally
    if (now - lastPowerUpSpawn.current > config.powerUpSpawnInterval) {
      lastPowerUpSpawn.current = now;

      // Random lane
      const lane = randInt(0, laneCount.current - 1);

      // Random power-up type
      const type: PowerUpType = Math.random() < 0.5 ? "shield" : "multiplier";

      powerUps.current.push({
        id: nextEntityId(),
        lane,
        y: -powerUpSize,
        size: powerUpSize,
        speed,
        type,
        color: type === "shield" ? SHIELD_COLOR : MULTIPLIER_COLOR,
      });
    }

    // Update entities positions
    function updateEntities(deltaTime: number) {
      // Update bricks
      bricks.current = bricks.current
        .map((b) => ({
          ...b,
          y: b.y + b.speed * deltaTime,
          speed,
        }))
        .filter((b) => b.y < canvasHeight.current + b.size);

      // Update power-ups
      powerUps.current = powerUps.current
        .map((p) => ({
          ...p,
          y: p.y + p.speed * deltaTime,
          speed,
        }))
        .filter((p) => p.y < canvasHeight.current + p.size);

      // Update power-up timers on player
      if (player.current.shieldActive) {
        player.current.shieldTimer -= deltaTime * 1000;
        if (player.current.shieldTimer <= 0) {
          player.current.shieldActive = false;
          player.current.shieldTimer = 0;
        }
      }
      if (player.current.multiplierActive) {
        player.current.multiplierTimer -= deltaTime * 1000;
        if (player.current.multiplierTimer <= 0) {
          player.current.multiplierActive = false;
          player.current.multiplierTimer = 0;
          scoreMultiplier.current = 1;
        }
      }
    }

    // Collision detection helper
    function checkCollision(
      lane1: Lane,
      y1: number,
      size1: number,
      lane2: Lane,
      y2: number,
      size2: number
    ) {
      if (lane1 !== lane2) return false;
      // Check vertical overlap (simple AABB)
      const half1 = size1 / 2;
      const half2 = size2 / 2;
      const center1 = y1 + half1;
      const center2 = y2 + half2;
      return Math.abs(center1 - center2) < half1 + half2;
    }

    // Handle collisions
    function handleCollisions() {
      const pLane = player.current.lane;
      const pY = player.current.y;
      const pW = player.current.width;
      const pH = player.current.height;

      // Check bricks collisions
      for (let i = 0; i < bricks.current.length; i++) {
        const b = bricks.current[i];
        if (
          checkCollision(
            pLane,
            pY,
            pH,
            b.lane,
            b.y,
            b.size
          )
        ) {
          if (player.current.shieldActive) {
            // Destroy brick, consume shield
            bricks.current.splice(i, 1);
            player.current.shieldActive = false;
            player.current.shieldTimer = 0;
            // Play shield hit effect (optional)
            break;
          } else {
            // Game over
            setGameState("gameover");
            return;
          }
        }
      }

      // Check power-ups collisions
      for (let i = 0; i < powerUps.current.length; i++) {
        const p = powerUps.current[i];
        if (
          checkCollision(
            pLane,
            pY,
            pH,
            p.lane,
            p.y,
            p.size
          )
        ) {
          // Collect power-up
          if (p.type === "shield") {
            player.current.shieldActive = true;
            player.current.shieldTimer = POWERUP_DURATION;
          } else if (p.type === "multiplier") {
            player.current.multiplierActive = true;
            player.current.multiplierTimer = POWERUP_DURATION;
            scoreMultiplier.current = 2;
          }
          powerUps.current.splice(i, 1);
          // Play power-up collect effect (optional)
          break;
        }
      }
    }

    // Update score based on elapsed time and multiplier
    function updateScore(deltaTime: number) {
      // Increase score by speed * multiplier * deltaTime
      // We scale score so it increments visibly
      const increment = speed * scoreMultiplier.current * deltaTime * 10;
      setScore((s) => s + Math.floor(increment));
    }

    // Draw neon styled rounded rect helper
    function drawNeonRect(
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
      ctx: CanvasRenderingContext2D,
      glow = true,
      radius = 6
    ) {
      ctx.save();
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
      }
      ctx.fillStyle = color;
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      // Rounded rect path
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Draw player ship (simple triangle with neon glow)
    function drawPlayer(ctx: CanvasRenderingContext2D) {
      const laneX = player.current.lane * laneWidth.current;
      const centerX = laneX + laneWidth.current / 2;
      const y = player.current.y;
      const width = player.current.width;
      const height = player.current.height;

      ctx.save();
      ctx.shadowColor = player.current.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = player.current.color;

      ctx.beginPath();
      // Triangle pointing up
      ctx.moveTo(centerX, y);
      ctx.lineTo(centerX - width / 2, y + height);
      ctx.lineTo(centerX + width / 2, y + height);
      ctx.closePath();
      ctx.fill();

      // Shield glow
      if (player.current.shieldActive) {
        ctx.strokeStyle = SHIELD_COLOR;
        ctx.lineWidth = 4;
        ctx.shadowColor = SHIELD_COLOR;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(centerX, y + height / 2, width * 0.75, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Draw bricks
    function drawBricks(ctx: CanvasRenderingContext2D) {
      bricks.current.forEach((b) => {
        const laneX = b.lane * laneWidth.current;
        const x = laneX + (laneWidth.current - b.size) / 2;
        const y = b.y;

        drawNeonRect(x, y, b.size, b.size * 0.5, b.color, ctx);
      });
    }

    // Draw power-ups
    function drawPowerUps(ctx: CanvasRenderingContext2D) {
      powerUps.current.forEach((p) => {
        const laneX = p.lane * laneWidth.current;
        const x = laneX + (laneWidth.current - p.size) / 2;
        const y = p.y;

        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = p.color;

        // Draw circle with icon inside
        ctx.beginPath();
        ctx.arc(x + p.size / 2, y + p.size / 2, p.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw icon shape inside circle
        ctx.fillStyle = "#111";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#111";

        if (p.type === "shield") {
          // Draw shield icon (simplified)
          ctx.beginPath();
          const cx = x + p.size / 2;
          const cy = y + p.size / 2;
          ctx.moveTo(cx, cy - p.size * 0.15);
          ctx.lineTo(cx - p.size * 0.15, cy);
          ctx.lineTo(cx, cy + p.size * 0.15);
          ctx.lineTo(cx + p.size * 0.15, cy);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "multiplier") {
          // Draw "x2" text
          ctx.font = `${p.size * 0.5}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("x2", x + p.size / 2, y + p.size / 2);
        }

        ctx.restore();
      });
    }

    // Draw score and power-up timers on canvas top-left corner (optional)
    function drawHUD(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.font = "18px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      ctx.fillStyle = "#7f5af0"; // neon purple
      if (player.current.shieldActive) {
        ctx.fillText(
          `Shield: ${(player.current.shieldTimer / 1000).toFixed(1)}s`,
          10,
          10
        );
      }

      ctx.fillStyle = "#ff49db"; // neon pink
      if (player.current.multiplierActive) {
        ctx.fillText(
          `x2 Multiplier: ${(player.current.multiplierTimer / 1000).toFixed(1)}s`,
          10,
          30
        );
      }
      ctx.restore();
    }

    // Clear canvas with dark background
    function clearCanvas(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "#0f172a"; // bg-slate-950 dark blue/black
      ctx.fillRect(0, 0, canvasWidth.current, canvasHeight.current);
    }

    // Main loop function
    function loop(time: number) {
      if (gameState !== "playing") {
        animationFrameId.current = null;
        return;
      }

      const deltaTime = (time - lastFrameTime.current) / 1000; // seconds
      lastFrameTime.current = time;

      // Update player lane from input keys (one lane per key press)
      if (inputState.current.leftPressed) {
        movePlayerLeft();
        inputState.current.leftPressed = false; // prevent continuous move
      }
      if (inputState.current.rightPressed) {
        movePlayerRight();
        inputState.current.rightPressed = false;
      }

      updateEntities(deltaTime);
      handleCollisions();
      updateScore(deltaTime);

      // Draw frame
      clearCanvas(ctx);
      drawBricks(ctx);
      drawPowerUps(ctx);
      drawPlayer(ctx);
      drawHUD(ctx);

      animationFrameId.current = requestAnimationFrame(loop);
    }

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [gameState, difficulty, movePlayerLeft, movePlayerRight]);

  // Right rail UI
  const rightRail = (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-slate-500 text-sm">Score</span>
          <span className="text-2xl font-bold dark:text-white">{score}</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-slate-500 text-sm">Best</span>
          <span className="text-xl font-bold text-emerald-500">{highScore}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() =>
              setGameState(gameState === "playing" ? "paused" : "playing")
            }
            variant="outline"
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
      {/* Instructions */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
        <p className="font-semibold mb-2">Controls:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Arrow Keys or A/D to Move</li>
          <li>Space to Start/Pause</li>
          <li>Touch/Swipe on Mobile</li>
        </ul>
      </div>
    </div>
  );

  return (
    <GamePageLayout
      title="Brick Dash"
      description="Dash between lanes, dodge falling bricks, grab power-ups, and chase a new high score."
      rightRail={rightRail}
    >
      <div className="relative w-full max-w-3xl mx-auto aspect-[3/4] md:aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        <StartOverlay
          open={gameState === "ready"}
          onClose={() => setGameState("playing")}
          title="Brick Dash"
        >
          <div className="space-y-4">
            <p className="text-slate-400">Select Difficulty:</p>
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
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-500 mt-4"
              onClick={() => setGameState("playing")}
            >
              Start Game
            </Button>
          </div>
        </StartOverlay>

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50">
            <h2 className="text-4xl font-bold mb-2 text-red-500">Game Over</h2>
            <p className="text-xl mb-6">Final Score: {score}</p>
            <Button onClick={() => setGameState("ready")} size="lg">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </GamePageLayout>
  );
}