import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Pause, Share2, MessageSquare } from "lucide-react";
import StartOverlay from "@/components/games/StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "ready" | "playing" | "paused" | "gameover";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hitsLeft: number;
  color: string;
  destroyed: boolean;
}

interface Vector2 {
  x: number;
  y: number;
}

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;

const BRICK_ROWS = 5;
const BRICK_COLS = 9;
const BRICK_PADDING = 6;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 30;

const DIFFICULTY_SETTINGS = {
  easy: {
    ballSpeed: 3,
    paddleSpeed: 8,
    brickHits: 1,
  },
  medium: {
    ballSpeed: 4.5,
    paddleSpeed: 10,
    brickHits: 2,
  },
  hard: {
    ballSpeed: 6,
    paddleSpeed: 12,
    brickHits: 3,
  },
};

function randomColor() {
  // Space-themed pastel colors for bricks
  const colors = [
    "#7FDBFF", // light blue
    "#39CCCC", // teal
    "#3D9970", // green
    "#B10DC9", // purple
    "#FFDC00", // yellow
    "#FF851B", // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function AstroBreakoutCalculator() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("astroBreakoutHighScore") ?? 0);
    }
    return 0;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Game objects refs
  const paddleX = useRef(0);
  const paddleWidth = useRef(PADDLE_WIDTH);
  const paddleSpeed = useRef(DIFFICULTY_SETTINGS[difficulty].paddleSpeed);

  const ballPos = useRef<Vector2>({ x: 0, y: 0 });
  const ballVel = useRef<Vector2>({ x: 0, y: 0 });
  const ballSpeed = useRef(DIFFICULTY_SETTINGS[difficulty].ballSpeed);

  const bricks = useRef<Brick[]>([]);

  const isTouching = useRef(false);
  const touchId = useRef<number | null>(null);

  // Pause flag for animation loop
  const paused = useRef(false);

  // Initialize bricks based on difficulty
  const initBricks = useCallback(() => {
    const hits = DIFFICULTY_SETTINGS[difficulty].brickHits;
    const bricksArr: Brick[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const brickWidth =
      (canvas.width - BRICK_OFFSET_LEFT * 2 - BRICK_PADDING * (BRICK_COLS - 1)) /
      BRICK_COLS;
    const brickHeight = 20;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricksArr.push({
          x: BRICK_OFFSET_LEFT + col * (brickWidth + BRICK_PADDING),
          y: BRICK_OFFSET_TOP + row * (brickHeight + BRICK_PADDING),
          width: brickWidth,
          height: brickHeight,
          hitsLeft: hits,
          color: randomColor(),
          destroyed: false,
        });
      }
    }
    bricks.current = bricksArr;
  }, [difficulty]);

  // Reset game state
  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paddleWidth.current = PADDLE_WIDTH;
    paddleSpeed.current = DIFFICULTY_SETTINGS[difficulty].paddleSpeed;
    paddleX.current = (canvas.width - paddleWidth.current) / 2;

    ballSpeed.current = DIFFICULTY_SETTINGS[difficulty].ballSpeed;
    ballPos.current = {
      x: canvas.width / 2,
      y: canvas.height - 60,
    };

    // Start ball moving upward at a random angle between 45 and 135 degrees
    const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4;
    ballVel.current = {
      x: ballSpeed.current * Math.cos(angle),
      y: -ballSpeed.current * Math.sin(angle),
    };

    setScore(0);
    initBricks();
  }, [difficulty, initBricks]);

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem("astroBreakoutHighScore", score.toString());
      }
    }
  }, [score, highScore]);

  // Handle keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        paddleX.current -= paddleSpeed.current * 2;
        if (paddleX.current < 0) paddleX.current = 0;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        paddleX.current += paddleSpeed.current * 2;
        if (paddleX.current + paddleWidth.current > canvas.width)
          paddleX.current = canvas.width - paddleWidth.current;
      } else if (e.key === "Escape") {
        setGameState("paused");
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      // No continuous movement on keyup for now
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState]);

  // Handle touch controls for mobile
  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onTouchStart(e: TouchEvent) {
      if (isTouching.current) return;
      const touch = e.changedTouches[0];
      touchId.current = touch.identifier;
      isTouching.current = true;
      movePaddleTo(touch.clientX);
    }

    function onTouchMove(e: TouchEvent) {
      if (!isTouching.current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId.current) {
          movePaddleTo(touch.clientX);
          break;
        }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId.current) {
          isTouching.current = false;
          touchId.current = null;
          break;
        }
      }
    }

    function movePaddleTo(clientX: number) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - paddleWidth.current / 2;
      paddleX.current = Math.min(
        Math.max(0, x),
        canvas.width - paddleWidth.current
      );
    }

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [gameState]);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (paused.current || gameState !== "playing") {
      animationFrameId.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (space theme)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#000011");
    gradient.addColorStop(1, "#000022");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars (simple twinkling effect)
    for (let i = 0; i < 50; i++) {
      const x = (i * 53) % canvas.width;
      const y = (i * 97) % canvas.height;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 500 + i));
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw bricks
    bricks.current.forEach((brick) => {
      if (brick.destroyed) return;
      // Color intensity based on hits left
      const baseColor = brick.color;
      const hitsRatio = brick.hitsLeft / DIFFICULTY_SETTINGS[difficulty].brickHits;
      ctx.fillStyle = adjustColorBrightness(baseColor, hitsRatio);
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      // Brick border
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    });

    // Draw paddle
    ctx.fillStyle = "#0af"; // bright blue paddle
    ctx.shadowColor = "#0af";
    ctx.shadowBlur = 10;
    ctx.fillRect(paddleX.current, canvas.height - 40, paddleWidth.current, PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    // Draw ball (space orb)
    ctx.beginPath();
    const ball = ballPos.current;
    const gradientBall = ctx.createRadialGradient(
      ball.x,
      ball.y,
      BALL_RADIUS / 4,
      ball.x,
      ball.y,
      BALL_RADIUS
    );
    gradientBall.addColorStop(0, "#aaf");
    gradientBall.addColorStop(1, "#004");
    ctx.fillStyle = gradientBall;
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Move ball
    ballPos.current.x += ballVel.current.x;
    ballPos.current.y += ballVel.current.y;

    // Wall collisions
    if (ballPos.current.x + BALL_RADIUS > canvas.width) {
      ballPos.current.x = canvas.width - BALL_RADIUS;
      ballVel.current.x = -ballVel.current.x;
      playBounceSound();
    } else if (ballPos.current.x - BALL_RADIUS < 0) {
      ballPos.current.x = BALL_RADIUS;
      ballVel.current.x = -ballVel.current.x;
      playBounceSound();
    }
    if (ballPos.current.y - BALL_RADIUS < 0) {
      ballPos.current.y = BALL_RADIUS;
      ballVel.current.y = -ballVel.current.y;
      playBounceSound();
    }

    // Paddle collision
    const paddleTop = canvas.height - 40;
    if (
      ballPos.current.y + BALL_RADIUS >= paddleTop &&
      ballPos.current.y + BALL_RADIUS <= paddleTop + PADDLE_HEIGHT &&
      ballPos.current.x >= paddleX.current &&
      ballPos.current.x <= paddleX.current + paddleWidth.current
    ) {
      ballPos.current.y = paddleTop - BALL_RADIUS;
      ballVel.current.y = -ballVel.current.y;

      // Add spin based on where ball hits paddle
      const hitPos = (ballPos.current.x - paddleX.current) / paddleWidth.current; // 0 to 1
      const angle = (hitPos * Math.PI) / 2 + Math.PI / 4; // 45 to 135 degrees
      const speed = Math.sqrt(
        ballVel.current.x * ballVel.current.x + ballVel.current.y * ballVel.current.y
      );
      ballVel.current.x = speed * Math.cos(angle);
      ballVel.current.y = -speed * Math.sin(angle);

      playBounceSound();
    }

    // Brick collisions
    for (const brick of bricks.current) {
      if (brick.destroyed) continue;
      if (
        ballPos.current.x + BALL_RADIUS > brick.x &&
        ballPos.current.x - BALL_RADIUS < brick.x + brick.width &&
        ballPos.current.y + BALL_RADIUS > brick.y &&
        ballPos.current.y - BALL_RADIUS < brick.y + brick.height
      ) {
        // Determine collision side
        const prevX = ballPos.current.x - ballVel.current.x;
        const prevY = ballPos.current.y - ballVel.current.y;

        let collidedHorizontally = false;
        let collidedVertically = false;

        if (
          prevX + BALL_RADIUS <= brick.x ||
          prevX - BALL_RADIUS >= brick.x + brick.width
        ) {
          collidedHorizontally = true;
        }
        if (
          prevY + BALL_RADIUS <= brick.y ||
          prevY - BALL_RADIUS >= brick.y + brick.height
        ) {
          collidedVertically = true;
        }

        if (collidedHorizontally) {
          ballVel.current.x = -ballVel.current.x;
        }
        if (collidedVertically) {
          ballVel.current.y = -ballVel.current.y;
        }
        if (!collidedHorizontally && !collidedVertically) {
          ballVel.current.y = -ballVel.current.y;
        }

        brick.hitsLeft--;
        if (brick.hitsLeft <= 0) {
          brick.destroyed = true;
          setScore((s) => s + 10);
          playBrickBreakSound();
        } else {
          playBrickHitSound();
        }
        break; // only one brick collision per frame
      }
    }

    // Check for game over (ball below paddle)
    if (ballPos.current.y - BALL_RADIUS > canvas.height) {
      setGameState("gameover");
      playGameOverSound();
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [difficulty, gameState]);

  // Adjust color brightness helper
  function adjustColorBrightness(hex: string, factor: number) {
    // factor 0..1, 1 = original color, 0 = black
    const f = Math.min(Math.max(factor, 0), 1);
    const c = hex.substring(1); // remove #
    const rgb = parseInt(c, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = rgb & 0xff;
    r = Math.floor(r * f);
    g = Math.floor(g * f);
    b = Math.floor(b * f);
    return `rgb(${r},${g},${b})`;
  }

  // Sound effects (simple beeps using Web Audio API)
  const audioCtx = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  function playSound(freq: number, duration = 100, type: OscillatorType = "square") {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
  }

  function playBounceSound() {
    playSound(600, 50, "square");
  }
  function playBrickBreakSound() {
    playSound(900, 120, "triangle");
  }
  function playBrickHitSound() {
    playSound(700, 80, "sawtooth");
  }
  function playGameOverSound() {
    playSound(200, 300, "sine");
  }

  // Resize canvas to fit container with device pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      resetGame();
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resetGame]);

  // Start / pause / resume game loop
  useEffect(() => {
    if (gameState === "playing") {
      paused.current = false;
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    } else if (gameState === "paused") {
      paused.current = true;
    } else if (gameState === "ready") {
      paused.current = true;
      resetGame();
    } else if (gameState === "gameover") {
      paused.current = true;
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [gameState, gameLoop, resetGame]);

  // Difficulty buttons for StartOverlay
  const difficultyButtons = (
    <div className="flex justify-center space-x-4 mt-6">
      {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
        <Button
          key={level}
          variant={difficulty === level ? "default" : "outline"}
          onClick={() => setDifficulty(level)}
          className="capitalize min-w-[80px]"
        >
          {level}
        </Button>
      ))}
    </div>
  );

  // Right sidebar with stats and controls
  const rightRail = (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-slate-500">Score</span>
          <span className="text-2xl font-bold dark:text-white">{score}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-slate-500">High Score</span>
          <span className="text-2xl font-bold dark:text-white">{highScore}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              if (gameState === "playing") setGameState("paused");
              else if (gameState === "paused") setGameState("playing");
            }}
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
          <Button
            variant="destructive"
            onClick={() => setGameState("ready")}
            disabled={gameState === "ready"}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
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
        <Button variant="ghost" className="w-full justify-start text-slate-500" asChild>
          <a href="/contact">
            <MessageSquare className="mr-2 h-4 w-4" /> Send us a suggestion
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <GamePageLayout
      title="Astro Breakout"
      description="Classic brick-breaking action set in space. Smash through formations of blocks using your paddle and ball."
      rightRail={rightRail}
    >
      <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />
        <StartOverlay open={gameState === "ready"} onClose={() => setGameState("playing")} title="Astro Breakout">
          <p className="text-center text-slate-700 dark:text-slate-300 mt-2">
            Select Difficulty
          </p>
          {difficultyButtons}
        </StartOverlay>
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-6">
            <h2 className="text-3xl font-bold mb-4">Game Over</h2>
            <p className="mb-6">Your score: {score}</p>
            <Button onClick={() => setGameState("ready")} className="px-8 py-3">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </GamePageLayout>
  );
}