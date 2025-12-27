import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Trophy, Settings2, X, Gamepad2, Lightbulb, History, HelpCircle, Share2, Mail, BookOpen, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import GameStartOverlay from "./GameStartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";

// --- Game Constants ---
const GRID_SIZE = 20;
const INITIAL_SPEED_MAP = {
  easy: 250, // Slower speed as requested
  medium: 100,
  hard: 60,
};
const POINTS_MAP = {
  easy: 10,
  medium: 20,
  hard: 30,
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER";

// --- Neon Snake Board Component ---
function NeonSnakeBoard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- State ---
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game Logic Refs (mutable without re-render)
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // --- Effects ---

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Small delay to allow layout to settle before resizing canvas
      setTimeout(() => {
        if (containerRef.current && canvasRef.current) {
           const { clientWidth, clientHeight } = containerRef.current;
           // If fullscreen, use more height, otherwise keep square-ish
           const isFull = !!document.fullscreenElement;
           const size = isFull 
             ? Math.min(clientWidth, clientHeight - 100) 
             : Math.min(clientWidth, 500);
           
           canvasRef.current.width = size;
           canvasRef.current.height = size;
           draw();
        }
      }, 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [gameState, theme]);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem("neon-snake-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("neon-snake-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const isFull = !!document.fullscreenElement;
        const size = isFull 
             ? Math.min(clientWidth, clientHeight - 100) 
             : Math.min(clientWidth, 500);

        canvasRef.current.width = size;
        canvasRef.current.height = size;
        draw();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing

    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, theme]); // Re-run on game state or theme change

  // Game Loop
  useEffect(() => {
    if (gameState === "PLAYING") {
      // Focus container for keyboard events
      containerRef.current?.focus();
      
      const speed = INITIAL_SPEED_MAP[difficulty];
      gameLoopRef.current = setInterval(tick, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, difficulty, theme]); // Include theme to redraw on change

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (dirRef.current !== "DOWN") nextDirRef.current = "UP";
          e.preventDefault(); // Prevent scrolling
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (dirRef.current !== "UP") nextDirRef.current = "DOWN";
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (dirRef.current !== "RIGHT") nextDirRef.current = "LEFT";
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (dirRef.current !== "LEFT") nextDirRef.current = "RIGHT";
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    setScore(0);
    placeFood();
    setGameState("PLAYING");
  };

  const placeFood = () => {
    // Random position avoiding snake body
    let valid = false;
    let newFood = { x: 0, y: 0 };
    const maxCells = 20; // 20x20 grid

    while (!valid) {
      newFood = {
        x: Math.floor(Math.random() * maxCells),
        y: Math.floor(Math.random() * maxCells),
      };
      // Check collision
      const collision = snakeRef.current.some(
        (seg) => seg.x === newFood.x && seg.y === newFood.y
      );
      if (!collision) valid = true;
    }
    foodRef.current = newFood;
  };

  const tick = () => {
    const snake = snakeRef.current;
    const head = { ...snake[0] };
    const dir = nextDirRef.current;
    dirRef.current = dir; // Commit direction

    // Move head
    if (dir === "UP") head.y -= 1;
    if (dir === "DOWN") head.y += 1;
    if (dir === "LEFT") head.x -= 1;
    if (dir === "RIGHT") head.x += 1;

    // Check Wall Collision
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      gameOver();
      return;
    }

    // Check Self Collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head); // Add new head

    // Check Food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      // Ate food
      setScore((s) => s + POINTS_MAP[difficulty]);
      placeFood();
      // Don't pop tail (grow)
    } else {
      snake.pop(); // Remove tail
    }

    draw();
  };

  const gameOver = () => {
    setGameState("GAME_OVER");
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  // --- Rendering ---
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / 20; // 20x20 grid
    const isDark = theme === "dark";

    // Colors based on theme
    const colors = {
      bg: isDark ? "#0f172a" : "#f8fafc", // slate-950 : slate-50
      grid: isDark ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
      food: isDark ? "#ef4444" : "#dc2626", // red-500 : red-600
      snakeHead: isDark ? "#22c55e" : "#16a34a", // green-500 : green-600
      snakeBody: isDark ? "#4ade80" : "#86efac", // green-400 : green-300
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size, size);

    // Grid (optional, subtle)
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    const food = foodRef.current;
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.food;
    ctx.fillStyle = colors.food;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? colors.snakeHead : colors.snakeBody;
      
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.snakeHead;
      } else {
        ctx.shadowBlur = 0;
      }

      const x = seg.x * cellSize + 1;
      const y = seg.y * cellSize + 1;
      const w = cellSize - 2;
      const h = cellSize - 2;

      // Rounded rects for snake segments
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, isHead ? 4 : 2);
      ctx.fill();
    });
  };

  // --- Touch Controls ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal
      if (Math.abs(dx) > 30) { // Threshold
        if (dx > 0 && dirRef.current !== "LEFT") nextDirRef.current = "RIGHT";
        else if (dx < 0 && dirRef.current !== "RIGHT") nextDirRef.current = "LEFT";
      }
    } else {
      // Vertical
      if (Math.abs(dy) > 30) {
        if (dy > 0 && dirRef.current !== "UP") nextDirRef.current = "DOWN";
        else if (dy < 0 && dirRef.current !== "DOWN") nextDirRef.current = "UP";
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full mx-auto ${isFullscreen ? 'h-screen p-4' : 'max-w-4xl'}`}
      ref={containerRef}
    >
      {/* Header / Stats */}
      <div className="w-full max-w-[500px] flex items-center justify-between mb-4 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Score</p>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white leading-none">{score}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">High Score</p>
            <p className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300 leading-none">{highScore}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Game Board */}
      <Card 
        className="relative bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          className="block mx-auto cursor-pointer"
        />

        <GameStartOverlay
          isPlaying={gameState === "PLAYING"}
          isGameOver={gameState === "GAME_OVER"}
          score={score}
          highScore={highScore}
          onStart={initGame}
          onRestart={initGame}
          gameName={title}
        />
      </Card>

      {/* Controls Hint */}
      <div className="mt-6 text-center text-slate-500 text-sm">
        <p className="hidden md:block">Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</p>
        <p className="md:hidden">Swipe to control direction</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function NeonSnakeGame({
  title = "Neon Snake",
  description = "Classic snake game with a neon twist. Collect food, grow longer, and avoid hitting the walls or yourself!",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I control the snake?",
      answer: "On desktop, use the Arrow keys or WASD to change direction. On mobile or tablet, simply swipe on the game board in the direction you want to move.",
    },
    {
      question: "Does the speed increase as I play?",
      answer: "Currently, the speed is determined by the difficulty level you choose at the start (Easy, Medium, or Hard). It remains constant throughout the session to let you focus on strategy.",
    },
    {
      question: "How is the score calculated?",
      answer: "Each piece of food you eat awards points based on the difficulty level: Easy (10 pts), Medium (20 pts), and Hard (30 pts). Try harder modes for higher scores!",
    },
    {
      question: "Is there an end to the game?",
      answer: "Neon Snake is an endless arcade game. The goal is to survive as long as possible and achieve the highest score before you crash into a wall or yourself.",
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
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          The goal of <strong>Neon Snake</strong> is simple yet addictive: navigate the glowing snake to eat the red food pellets that appear on the grid.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Eat & Grow:</strong> Every time you eat a pellet, your snake grows longer.</li>
          <li><strong>Avoid Collisions:</strong> Don't hit the walls or your own tail, or it's Game Over!</li>
          <li><strong>Score High:</strong> Compete against yourself to beat your local high score.</li>
        </ul>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Tips & Strategies
        </h2>
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Look Ahead</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Don't just watch the head of the snake. Plan your path to ensure you don't trap yourself in a corner as you get longer.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">Use the Grid</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Visualize the empty space. Zig-zag patterns can help you pack your long tail efficiently without running out of room.
            </p>
          </div>
        </div>
      </section>

      <section id="history">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-purple-500" />
          A Bit of History
        </h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          The concept of "Snake" originated in the 1976 arcade game <em>Blockade</em>. However, it gained massive global popularity in the late 1990s when it was pre-loaded on Nokia mobile phones. It has since become one of the most recognized video game genres in history, inspiring countless variations—like this neon-styled version!
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-semibold">References & Additional Resources</h2>
        <ul className="list-disc pl-5 mt-4 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://en.wikipedia.org/wiki/Snake_(video_game_genre)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Snake (video game genre) - Wikipedia
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive history and variations of the Snake video game genre.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.guinnessworldrecords.com/news/2023/11/history-of-snake-how-the-nokia-game-became-a-global-phenomenon-760777" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                History of Snake - Guinness World Records
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                How the Nokia game became a global phenomenon and its impact on mobile gaming.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<NeonSnakeBoard title={title} description={description} />}
      editorial={editorialContent}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "history", label: "History" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
