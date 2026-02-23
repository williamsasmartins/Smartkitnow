import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameStartOverlay from "./GameStartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

// --- Game Constants ---
const INITIAL_SPEED_MAP = {
  easy: 4,
  medium: 6,
  hard: 8,
};
const PADDLE_WIDTH_MAP = {
  easy: 120,
  medium: 100,
  hard: 80,
};
const POINTS_PER_BRICK = 10;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER" | "WON";

// --- Astro Breakout Board Component ---
function AstroBreakoutBoard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- State ---
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);

  // Game Logic Refs
  const ballRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4, radius: 8 });
  const paddleRef = useRef({ x: (CANVAS_WIDTH - 100) / 2, width: 100, height: 15 });
  const bricksRef = useRef<{ x: number; y: number; width: number; height: number; active: boolean; color: string }[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // --- Effects ---

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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem("astro-breakout-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("astro-breakout-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth } = containerRef.current;
        // Maintain aspect ratio
        const width = Math.min(clientWidth, 800);
        const height = width * (CANVAS_HEIGHT / CANVAS_WIDTH);

        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
        // Internal resolution remains constant for easier logic
        canvasRef.current.width = CANVAS_WIDTH;
        canvasRef.current.height = CANVAS_HEIGHT;
        draw();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, theme]);

  // Game Loop
  useEffect(() => {
    if (gameState === "PLAYING") {
      containerRef.current?.focus();
      const loop = () => {
        update();
        draw();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      draw(); // Draw once to show state
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, difficulty, theme]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Touch/Mouse Controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (clientX: number) => {
      if (gameState !== "PLAYING") return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const relativeX = (clientX - rect.left) * scaleX;

      let newX = relativeX - paddleRef.current.width / 2;
      newX = Math.max(0, Math.min(CANVAS_WIDTH - paddleRef.current.width, newX));
      paddleRef.current.x = newX;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      handleMove(e.touches[0].clientX);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [gameState]);


  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setLives(3);

    // Reset Paddle
    paddleRef.current = {
      x: (CANVAS_WIDTH - PADDLE_WIDTH_MAP[diff]) / 2,
      width: PADDLE_WIDTH_MAP[diff],
      height: 15
    };

    // Reset Ball
    resetBall(diff);

    // Initialize Bricks
    const rows = 5;
    const cols = 8;
    const padding = 10;
    const offsetTop = 50;
    const offsetLeft = 35;
    const brickWidth = (CANVAS_WIDTH - (offsetLeft * 2) - (padding * (cols - 1))) / cols;
    const brickHeight = 25;

    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]; // Red, Orange, Yellow, Green, Blue

    bricksRef.current = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        bricksRef.current.push({
          x: (c * (brickWidth + padding)) + offsetLeft,
          y: (r * (brickHeight + padding)) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          active: true,
          color: colors[r]
        });
      }
    }

    setGameState("PLAYING");
  };

  const resetBall = (diff: Difficulty) => {
    const speed = INITIAL_SPEED_MAP[diff];
    // Randomize start direction slightly
    const dirX = Math.random() > 0.5 ? 1 : -1;
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      dx: speed * dirX,
      dy: -speed,
      radius: 8
    };
  };

  const update = () => {
    // Keyboard Movement
    const paddleSpeed = 8;
    if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
      paddleRef.current.x = Math.max(0, paddleRef.current.x - paddleSpeed);
    }
    if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
      paddleRef.current.x = Math.min(CANVAS_WIDTH - paddleRef.current.width, paddleRef.current.x + paddleSpeed);
    }

    const ball = ballRef.current;
    const paddle = paddleRef.current;

    // Move Ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall Collisions
    if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    // Paddle Collision
    if (
      ball.y + ball.radius > CANVAS_HEIGHT - paddle.height - 10 &&
      ball.y - ball.radius < CANVAS_HEIGHT - 10 &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      // Hit paddle
      ball.dy = -Math.abs(ball.dy); // Ensure it goes up

      // Add "english" (spin) based on where it hit the paddle
      const hitPoint = ball.x - (paddle.x + paddle.width / 2);
      ball.dx = hitPoint * 0.15; // Normalize speed

      // Ensure minimum vertical speed
      // Keep total velocity somewhat constant? For now, just simplistic physics
    }

    // Floor Collision (Lose Life)
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
      if (lives > 1) {
        setLives(l => l - 1);
        resetBall(difficulty);
      } else {
        setGameState("GAME_OVER");
      }
    }

    // Brick Collision
    let activeBricks = 0;
    bricksRef.current.forEach(brick => {
      if (!brick.active) return;
      activeBricks++;

      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {
        brick.active = false;
        ball.dy = -ball.dy;
        setScore(s => s + POINTS_PER_BRICK);
      }
    });

    if (activeBricks === 0) {
      setGameState("WON");
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";

    // Colors
    const colors = {
      bg: isDark ? "#050B14" : "#1e293b", // Deeper space background
      text: "#f8fafc",
      paddle: isDark ? "#38bdf8" : "#0ea5e9",
      ball: isDark ? "#f472b6" : "#ec4899",
      grid: isDark ? "#1e293b" : "#e2e8f0",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Stars
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(i * 123) * 0.5 + 0.5) * CANVAS_WIDTH;
      const y = (Math.cos(i * 321) * 0.5 + 0.5) * CANVAS_HEIGHT;
      const radius = (Math.sin(i * 99) * 0.5 + 0.5) * 1.5;
      const alpha = Math.abs(Math.sin((Date.now() / 1000) + i));
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw Bricks
    bricksRef.current.forEach(brick => {
      if (brick.active) {
        ctx.fillStyle = brick.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = brick.color;

        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw Paddle
    ctx.fillStyle = colors.paddle;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.paddle;
    ctx.beginPath();
    ctx.roundRect(paddleRef.current.x, CANVAS_HEIGHT - paddleRef.current.height - 10, paddleRef.current.width, paddleRef.current.height, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Ball
    ctx.fillStyle = colors.ball;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.ball;
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Score & Lives (In-game UI)
    ctx.fillStyle = colors.text;
    ctx.font = "bold 20px monospace";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 100, 30);
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2 - 60, 30);

    // Game Over / Won Overlay handled by React state, but we can draw static elements here if needed
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto z-10">
      <GameStartOverlay
        isPlaying={gameState === "PLAYING"}
        isGameOver={gameState === "GAME_OVER"}
        score={score}
        highScore={highScore}
        onStart={initGame}
        onRestart={initGame}
        gameName={title}
      />
      <div
        ref={containerRef}
        className="relative w-full max-w-[800px] mx-auto aspect-[4/3] bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none"
        tabIndex={0}
      >
        {/* Fullscreen Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={`block touch-none ${isFullscreen ? "w-full h-full object-contain" : "w-full h-full"}`}
        />

        {/* Overlays */}

      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function AstroBreakoutGame({
  title = "Astro Breakout",
  description = "Classic breakout arcade action. Destroy all bricks to advance!",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I control the paddle?",
      answer: "Use the Left and Right Arrow keys on your keyboard, or simply drag the paddle with your mouse or finger on touch devices.",
    },
    {
      question: "What do the different colors mean?",
      answer: "The colors represent different rows of bricks. In classic breakout style, clearing rows is the main objective!",
    },
    {
      question: "How does the scoring work?",
      answer: "Each brick destroyed gives you 10 points. Try to clear the entire board to win!",
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
        <div className="prose prose-slate dark:prose-invert max-w-none mt-4">
          <p>
            <strong>Astro Breakout</strong> is a modern reimagining of the classic brick-breaking arcade game.
            Your mission is simple: destroy all the neon bricks at the top of the screen using your ball and paddle.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Launch the Ball:</strong> The game starts with the ball launching from the paddle.</li>
            <li><strong>Deflect:</strong> Use your paddle to bounce the ball back up towards the bricks.</li>
            <li><strong>Don't Miss:</strong> If the ball falls below your paddle, you lose a life. You have 3 lives!</li>
            <li><strong>Clear the Board:</strong> Destroy every brick to win the game.</li>
          </ul>
        </div>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-pink-500" />
          Tips & Strategies
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none mt-4">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Angle Control:</strong> Hitting the ball with the edge of the paddle will make it bounce at a sharper angle.</li>
            <li><strong>Safety First:</strong> Prioritize keeping the ball in play over hitting a specific brick.</li>
            <li><strong>Look Ahead:</strong> Watch where the ball is going, not just where it is now. Position your paddle early.</li>
          </ul>
        </div>
      </section>

      <section id="history">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-yellow-500" />
          History of Breakout
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none mt-4">
          <p>
            The original Breakout game was influenced by Pong. It was designed by Nolan Bushnell and Steve Bristow,
            and famously, the prototype was built by Steve Wozniak (co-founder of Apple) with help from Steve Jobs.
            Released in 1976, it became an instant classic and spawned countless clones and variations, establishing
            the "brick breaker" genre.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<AstroBreakoutBoard title={title} description={description} />}
      editorial={editorialContent}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "history", label: "History" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
