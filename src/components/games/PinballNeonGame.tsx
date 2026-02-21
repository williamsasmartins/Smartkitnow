import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "../ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";

// Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.2;
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.7;

const PINBALL_WALLS = [
  { x1: 0, y1: 450, x2: 115, y2: 560 }, // Left slingshot
  { x1: 360, y1: 450, x2: 245, y2: 560 }, // Right slingshot
  { x1: 0, y1: 150, x2: 100, y2: 0 }, // Top left curve
  { x1: 360, y1: 150, x2: 260, y2: 0 }, // Top right curve
  { x1: 360, y1: 0, x2: 360, y2: 600 } // Shooter lane inner wall
];

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Flipper {
  x: number;
  y: number;
  length: number;
  angle: number;
  restAngle: number;
  activeAngle: number;
  side: 'left' | 'right';
  active: boolean;
}

interface Bumper {
  x: number;
  y: number;
  radius: number;
  score: number;
  color: string;
  activeTime?: number;
}

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER";

function PinballBoard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game State
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Physics State (Mutable)
  const physicsRef = useRef({
    ball: { x: 380, y: 500, vx: 0, vy: 0, radius: 8 } as Ball,
    flippers: [
      { x: 115, y: 560, length: 60, angle: 30 * Math.PI / 180, restAngle: 30 * Math.PI / 180, activeAngle: -35 * Math.PI / 180, side: 'left', active: false },
      { x: 245, y: 560, length: 60, angle: 150 * Math.PI / 180, restAngle: 150 * Math.PI / 180, activeAngle: 215 * Math.PI / 180, side: 'right', active: false }
    ] as Flipper[],
    bumpers: [
      { x: 200, y: 150, radius: 25, score: 100, color: "#ff00ff" },
      { x: 120, y: 250, radius: 20, score: 50, color: "#00ffff" },
      { x: 280, y: 250, radius: 20, score: 50, color: "#00ffff" },
      { x: 200, y: 350, radius: 15, score: 25, color: "#ffff00" },
    ] as Bumper[],
    inPlay: false,
  });

  const requestRef = useRef<number>();

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem("pinball-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("pinball-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        if (document.fullscreenElement && containerRef.current === document.fullscreenElement) {
          canvasRef.current.style.width = "100%";
          canvasRef.current.style.height = "100%";
          return;
        }

        // In normal mode, let CSS handle the size with aspect-ratio
        canvasRef.current.style.width = "100%";
        canvasRef.current.style.height = "100%";
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    // Small delay to ensure layout is settled
    setTimeout(handleResize, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, isFullscreen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Game Logic
  const initGame = (difficulty: Difficulty) => {
    setScore(0);
    // Difficulty settings
    const balls = difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 2;
    setBallsLeft(balls);

    setGameState("PLAYING");
    resetBall();
  };

  const resetBall = () => {
    physicsRef.current.ball = { x: 380, y: 500, vx: 0, vy: 0, radius: 8 };
    physicsRef.current.inPlay = false;
  };

  const launchBall = () => {
    if (!physicsRef.current.inPlay && gameState === "PLAYING") {
      physicsRef.current.ball.vy = -15 - Math.random() * 5;
      physicsRef.current.ball.vx = -2 + Math.random() * 4;
      physicsRef.current.inPlay = true;
    }
  };

  const update = useCallback((time: number) => {
    if (gameState !== "PLAYING") return;

    const state = physicsRef.current;

    // Physics
    if (state.inPlay) {
      const ball = state.ball;

      // Gravity
      ball.vy += GRAVITY;
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;

      // Update Position
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Outer boundaries
      if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx = Math.abs(ball.vx) * BOUNCE_DAMPING; }
      if (ball.x > CANVAS_WIDTH - ball.radius) { ball.x = CANVAS_WIDTH - ball.radius; ball.vx = -Math.abs(ball.vx) * BOUNCE_DAMPING; }
      if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy = Math.abs(ball.vy) * BOUNCE_DAMPING; }

      // Internal sloped walls & shooter lane wall
      PINBALL_WALLS.forEach(w => {
        const lineLenSq = (w.x2 - w.x1) ** 2 + (w.y2 - w.y1) ** 2;
        if (lineLenSq === 0) return;
        const dot = ((ball.x - w.x1) * (w.x2 - w.x1) + (ball.y - w.y1) * (w.y2 - w.y1)) / lineLenSq;
        let closestX, closestY;
        if (dot < 0) { closestX = w.x1; closestY = w.y1; }
        else if (dot > 1) { closestX = w.x2; closestY = w.y2; }
        else { closestX = w.x1 + dot * (w.x2 - w.x1); closestY = w.y1 + dot * (w.y2 - w.y1); }

        const distX = ball.x - closestX;
        const distY = ball.y - closestY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < ball.radius) {
          if (distance === 0) return;
          const normalX = distX / distance;
          const normalY = distY / distance;
          const dotVel = ball.vx * normalX + ball.vy * normalY;

          if (dotVel < 0) {
            ball.vx -= (1 + BOUNCE_DAMPING) * dotVel * normalX;
            ball.vy -= (1 + BOUNCE_DAMPING) * dotVel * normalY;
            ball.x += normalX * (ball.radius - distance);
            ball.y += normalY * (ball.radius - distance);
          }
        }
      });

      // Bottom / Game Over
      if (ball.y > CANVAS_HEIGHT + 50) {
        setBallsLeft(prev => {
          const newBalls = prev - 1;
          if (newBalls <= 0) {
            setGameState("GAME_OVER");
            return 0;
          }
          resetBall();
          return newBalls;
        });
        return;
      }

      // Flipper Collision
      state.flippers.forEach(flipper => {
        const target = flipper.active ? flipper.activeAngle : flipper.restAngle;
        const diff = target - flipper.angle;
        flipper.angle += diff * 0.2;

        const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
        const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;

        // Optimization: simple box check
        if (ball.x > Math.min(flipper.x, endX) - 20 && ball.x < Math.max(flipper.x, endX) + 20 &&
          ball.y > Math.min(flipper.y, endY) - 20 && ball.y < Math.max(flipper.y, endY) + 20) {

          const lineLen = flipper.length;
          const dot = ((ball.x - flipper.x) * (endX - flipper.x) + (ball.y - flipper.y) * (endY - flipper.y)) / (lineLen * lineLen);
          const clampedDot = Math.max(0, Math.min(1, dot));
          const closestX = flipper.x + (clampedDot * (endX - flipper.x));
          const closestY = flipper.y + (clampedDot * (endY - flipper.y));

          const distX = ball.x - closestX;
          const distY = ball.y - closestY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < ball.radius + 5) {
            const normalAngle = flipper.angle - Math.PI / 2;
            const pushX = Math.cos(normalAngle);
            const pushY = Math.sin(normalAngle);
            const boost = flipper.active ? 15 : 2;

            const dotVel = ball.vx * pushX + ball.vy * pushY;
            if (dotVel < 0 || flipper.active) {
              ball.vx += pushX * boost + (Math.random() - 0.5);
              ball.vy += pushY * boost;
              ball.x += pushX * (ball.radius + 5 - distance + 1);
              ball.y += pushY * (ball.radius + 5 - distance + 1);
            }
          }
        }
      });

      // Bumper Collision
      state.bumpers.forEach(bumper => {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < bumper.radius + ball.radius) {
          const angle = Math.atan2(dy, dx);
          const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          ball.vx = Math.cos(angle) * (speed + 2);
          ball.vy = Math.sin(angle) * (speed + 2);

          ball.x = bumper.x + Math.cos(angle) * (bumper.radius + ball.radius + 1);
          ball.y = bumper.y + Math.sin(angle) * (bumper.radius + ball.radius + 1);

          setScore(s => s + bumper.score);
          bumper.activeTime = time;
        }
      });

    } else {
      // Reset Ball Pos
      state.ball.x = 380;
      state.ball.y = 500;
      state.ball.vx = 0;
      state.ball.vy = 0;
    }

  }, [gameState]);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = physicsRef.current;
    const isDark = theme === "dark";

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background
    ctx.fillStyle = isDark ? "#111" : "#222";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Walls
    ctx.strokeStyle = isDark ? "#8b5cf6" : "#a855f7"; // Neon purple walls
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.strokeStyle;

    PINBALL_WALLS.forEach(w => {
      ctx.beginPath();
      ctx.moveTo(w.x1, w.y1);
      ctx.lineTo(w.x2, w.y2);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    // Bumpers
    state.bumpers.forEach(bumper => {
      const isActive = bumper.activeTime && (time - bumper.activeTime < 200);
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "#fff" : bumper.color;
      ctx.fill();
      ctx.strokeStyle = isActive ? bumper.color : "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (isActive) {
        ctx.shadowColor = bumper.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Flippers
    state.flippers.forEach(flipper => {
      ctx.save();
      ctx.translate(flipper.x, flipper.y);
      ctx.rotate(flipper.angle);
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(0, -5, flipper.length, 10);
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [theme]);

  // Loop
  useEffect(() => {
    const loop = (time: number) => {
      update(time);
      draw(time);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update, draw]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.key === "ArrowLeft") physicsRef.current.flippers[0].active = true;
      if (e.key === "ArrowRight") physicsRef.current.flippers[1].active = true;
      if (e.code === "Space") launchBall();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") physicsRef.current.flippers[0].active = false;
      if (e.key === "ArrowRight") physicsRef.current.flippers[1].active = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);



  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center w-full max-w-md mx-auto ${isFullscreen ? "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 max-w-none justify-center p-4" : ""
        }`}
    >
      {/* Stats */}
      <div className="flex justify-between w-full mb-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">Score</span>
          <span className="text-xl font-bold font-mono">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase">Balls</span>
          <span className="text-xl font-bold font-mono text-blue-500">{'●'.repeat(ballsLeft)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 uppercase">High Score</span>
          <span className="text-xl font-bold font-mono text-yellow-600">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className={`relative bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800 aspect-[2/3] ${isFullscreen ? "h-full max-h-[80vh] w-auto" : "h-[65vh] max-h-[600px] max-w-full w-auto mx-auto"
        }`}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full object-contain touch-none absolute inset-0 pointer-events-none"
        />

        {/* Mobile multi-touch zones overlay */}
        <div className="absolute inset-0 z-0 flex touch-none">
          <div
            className="w-1/2 h-full"
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => { e.preventDefault(); physicsRef.current.flippers[0].active = true; if (!physicsRef.current.inPlay && gameState === "PLAYING") launchBall(); }}
            onPointerUp={(e) => { e.preventDefault(); physicsRef.current.flippers[0].active = false; }}
            onPointerLeave={(e) => { e.preventDefault(); physicsRef.current.flippers[0].active = false; }}
            onPointerCancel={(e) => { e.preventDefault(); physicsRef.current.flippers[0].active = false; }}
          />
          <div
            className="w-1/2 h-full"
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => { e.preventDefault(); physicsRef.current.flippers[1].active = true; if (!physicsRef.current.inPlay && gameState === "PLAYING") launchBall(); }}
            onPointerUp={(e) => { e.preventDefault(); physicsRef.current.flippers[1].active = false; }}
            onPointerLeave={(e) => { e.preventDefault(); physicsRef.current.flippers[1].active = false; }}
            onPointerCancel={(e) => { e.preventDefault(); physicsRef.current.flippers[1].active = false; }}
          />
        </div>

        {/* Fullscreen Toggle */}
        {!isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white/50 hover:text-white hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-6 h-6" />
          </Button>
        )}

        {isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white/50 hover:text-white hover:bg-white/10"
            onClick={toggleFullscreen}
          >
            <Minimize2 className="w-8 h-8" />
          </Button>
        )}

        <GameStartOverlay
          isPlaying={gameState === "PLAYING"}
          isGameOver={gameState === "GAME_OVER"}
          score={score}
          highScore={highScore}
          onStart={initGame}
          onRestart={initGame}
          gameName="Neon Pinball"
        />
      </div>

      {/* Controls Help */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Desktop: Arrows to flip, Space to launch • Mobile: Tap sides to flip
      </div>
    </div>
  );
}

export default function PinballNeonGame({
  title = "Neon Pinball",
  description = "Classic arcade pinball with a neon twist. Keep the ball flying!",
}: {
  title?: string;
  description?: string;
}) {
  const faqJsonLd = useFaqJsonLd([
    {
      question: "How do I control the flippers?",
      answer: "Use the Left and Right Arrow keys on your keyboard, or tap the left and right sides of the screen on mobile devices."
    },
    {
      question: "How do I launch the ball?",
      answer: "Press the Spacebar or tap the screen to launch the ball into play."
    }
  ]);

  const editorialContent = (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      <section id="guide">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">How to Play</h3>
        <p>
          Neon Pinball brings the classic arcade machine experience to your screen.
          Keep the ball in play using the flippers and aim for the high score bumpers!
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Left Flipper:</strong> Left Arrow Key or Tap Left Side.</li>
          <li><strong>Right Flipper:</strong> Right Arrow Key or Tap Right Side.</li>
          <li><strong>Launch:</strong> Spacebar or Tap Screen (when ball is ready).</li>
        </ul>
      </section>

      <section id="tips">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Tips for High Scores</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Timing is Key:</strong> Hit the ball with the tip of the flipper for maximum speed and angle.</li>
          <li><strong>Aim for Bumpers:</strong> The colorful circles give the most points. Keep the ball bouncing between them.</li>
          <li><strong>Don't Panic:</strong> Rapidly flipping won't help. Wait for the ball to come to the flipper.</li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<PinballBoard title={title} description={description} />}
      editorial={editorialContent}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
