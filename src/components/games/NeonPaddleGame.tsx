import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// --- Game Constants ---
const INITIAL_SPEED_MAP = {
  easy: 5,
  medium: 8,
  hard: 12,
};
const AI_SPEED_MAP = {
  easy: 0.05, // AI moves 5% of distance to ball
  medium: 0.08,
  hard: 0.15,
};
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 15;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const WIN_SCORE = 5;

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER";

// --- Neon Paddle Board Component ---
function NeonPaddleBoard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [winner, setWinner] = useState<"PLAYER" | "AI" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game Logic Refs
  const ballRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 5, radius: 8 });
  const playerYRef = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const aiYRef = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const playerScoreRef = useRef(0);
  const aiScoreRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // --- Effects ---

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        // If fullscreen, use window dimensions directly
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
    // Call immediately to set initial size
    handleResize();
    // Also call after a slight delay to ensure container is rendered
    setTimeout(handleResize, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, theme, isFullscreen]);

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
      draw();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, difficulty, theme]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "w" || e.key === "s") {
        e.preventDefault();
      }
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
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

    const handleMove = (clientY: number) => {
      if (gameState !== "PLAYING") return;
      const rect = canvas.getBoundingClientRect();
      const scaleY = CANVAS_HEIGHT / rect.height;
      const relativeY = (clientY - rect.top) * scaleY;

      let newY = relativeY - PADDLE_HEIGHT / 2;
      newY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, newY));
      playerYRef.current = newY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Only move if mouse is inside canvas roughly
      handleMove(e.clientY);
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
    setPlayerScore(0);
    setAiScore(0);
    playerScoreRef.current = 0;
    aiScoreRef.current = 0;
    setWinner(null);
    playerYRef.current = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    aiYRef.current = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    resetBall(diff);
    setGameState("PLAYING");
  };

  const resetBall = (diff: Difficulty) => {
    const speed = INITIAL_SPEED_MAP[diff];
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = (Math.random() * 2 - 1); // -1 to 1

    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: speed * dirX,
      dy: speed * dirY,
      radius: 8
    };
  };

  const update = () => {
    // Keyboard Movement
    const speed = 10;
    if (keysRef.current["ArrowUp"] || keysRef.current["w"]) {
      playerYRef.current = Math.max(0, playerYRef.current - speed);
    }
    if (keysRef.current["ArrowDown"] || keysRef.current["s"]) {
      playerYRef.current = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, playerYRef.current + speed);
    }

    const ball = ballRef.current;

    // Move Ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall Collisions (Top/Bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > CANVAS_HEIGHT) {
      ball.dy = -ball.dy;
    }

    // AI Movement
    const aiCenter = aiYRef.current + PADDLE_HEIGHT / 2;
    const aiSpeed = AI_SPEED_MAP[difficulty];
    if (aiCenter < ball.y - 35) {
      aiYRef.current += (ball.y - aiCenter) * aiSpeed;
    } else if (aiCenter > ball.y + 35) {
      aiYRef.current -= (aiCenter - ball.y) * aiSpeed;
    }
    // Clamp AI
    aiYRef.current = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, aiYRef.current));

    // Paddle Collisions
    // Player (Left)
    if (
      ball.x - ball.radius < PADDLE_WIDTH + 10 &&
      ball.y > playerYRef.current &&
      ball.y < playerYRef.current + PADDLE_HEIGHT
    ) {
      ball.dx = Math.abs(ball.dx); // Bounce right
      const deltaY = ball.y - (playerYRef.current + PADDLE_HEIGHT / 2);
      ball.dy = deltaY * 0.3; // Add spin
    }

    // AI (Right)
    if (
      ball.x + ball.radius > CANVAS_WIDTH - PADDLE_WIDTH - 10 &&
      ball.y > aiYRef.current &&
      ball.y < aiYRef.current + PADDLE_HEIGHT
    ) {
      ball.dx = -Math.abs(ball.dx); // Bounce left
      const deltaY = ball.y - (aiYRef.current + PADDLE_HEIGHT / 2);
      ball.dy = deltaY * 0.3;
    }

    // Scoring
    if (ball.x < 0) {
      // AI Score
      aiScoreRef.current += 1;
      setAiScore(aiScoreRef.current);
      if (aiScoreRef.current >= WIN_SCORE) {
        setWinner("AI");
        setGameState("GAME_OVER");
      } else {
        resetBall(difficulty);
      }
    } else if (ball.x > CANVAS_WIDTH) {
      // Player Score
      playerScoreRef.current += 1;
      setPlayerScore(playerScoreRef.current);
      if (playerScoreRef.current >= WIN_SCORE) {
        setWinner("PLAYER");
        setGameState("GAME_OVER");
      } else {
        resetBall(difficulty);
      }
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
      bg: isDark ? "#0f172a" : "#f8fafc",
      text: isDark ? "#f8fafc" : "#0f172a",
      paddle: isDark ? "#22c55e" : "#16a34a",
      ball: isDark ? "#eab308" : "#ca8a04",
      centerLine: isDark ? "#334155" : "#cbd5e1",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Center Line
    ctx.strokeStyle = colors.centerLine;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Paddles
    ctx.fillStyle = colors.paddle;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.paddle;
    // Player
    ctx.fillRect(10, playerYRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    // AI
    ctx.fillRect(CANVAS_WIDTH - 10 - PADDLE_WIDTH, aiYRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.shadowBlur = 0;

    // Draw Ball
    ctx.fillStyle = colors.ball;
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Score
    ctx.fillStyle = colors.text;
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(aiScore.toString(), (CANVAS_WIDTH / 4) * 3, 60);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto z-10">
      <GameStartOverlay
              isPlaying={gameState === "PLAYING"}
              isGameOver={gameState === "GAME_OVER"}
              score={playerScore}
              highScore={WIN_SCORE}
              onStart={initGame}
              onRestart={initGame}
              gameName={title}
            />
      <div
      ref={containerRef}
      className={`relative w-full max-w-[800px] mx-auto bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none ${isFullscreen ? "flex items-center justify-center h-screen max-w-none rounded-none border-0" : "aspect-[16/10]"
        }`}
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block w-full h-full touch-none"
      />

      {/* Fullscreen Toggle */}
      {!isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="w-6 h-6" />
        </Button>
      )}

      {isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white/50 hover:text-white hover:bg-white/10"
          onClick={toggleFullscreen}
        >
          <Minimize2 className="w-8 h-8" />
        </Button>
      )}

      {/* Overlays */}
      
    </div>
    </div>
  );
}

// --- Main Page Component ---
export default function NeonPaddleGame({
  title = "Neon Paddle",
  description = "The classic Pong game reimagined with neon visuals.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I move my paddle?",
      answer: "Use the Up and Down arrow keys on your keyboard. On touch screens, simply drag your finger up and down anywhere on the game board.",
    },
    {
      question: "How many points to win?",
      answer: `The first player to reach ${WIN_SCORE} points wins the match.`,
    },
    {
      question: "Does the ball speed up?",
      answer: "Yes, the ball speed can increase depending on how you hit it, and higher difficulty settings start with a faster ball.",
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
            <strong>Neon Paddle</strong> is a tribute to the very first arcade video game.
            You control the paddle on the left side of the screen. Your goal is to hit the ball past your opponent (the AI) on the right.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Defend:</strong> Don't let the ball pass your paddle!</li>
            <li><strong>Attack:</strong> Try to angle your shots to get past the AI's defense.</li>
            <li><strong>Win:</strong> Score {WIN_SCORE} points to win the match.</li>
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
            <li><strong>Spin:</strong> Hitting the ball while your paddle is moving can change its angle.</li>
            <li><strong>Watch the AI:</strong> The AI isn't perfect. Look for patterns in its movement.</li>
            <li><strong>Corners:</strong> Aiming for the corners is often the best way to score.</li>
          </ul>
        </div>
      </section>

      <section id="history">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-yellow-500" />
          History of Pong
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none mt-4">
          <p>
            Pong was one of the earliest arcade video games, released in 1972 by Atari.
            It was a simple tennis sports game featuring two-dimensional graphics.
            Its immense popularity helped launch the video game industry as we know it today.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<NeonPaddleBoard title={title} description={description} />}
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
