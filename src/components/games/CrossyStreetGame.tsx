import React, { useState, useEffect, useRef } from "react";
import { Gamepad2 } from "lucide-react";
import StartOverlay from "./StartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";

// --- Game Constants ---
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 40;
const ROWS = CANVAS_HEIGHT / GRID_SIZE; // 15
const COLS = CANVAS_WIDTH / GRID_SIZE; // 15

const INITIAL_SPEED_MAP = {
  easy: 1,
  medium: 2,
  hard: 3,
};

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER";

type LaneType = "safe" | "road" | "water";

interface Lane {
  type: LaneType;
  y: number;
  speed: number; // 0 for safe
  direction: 1 | -1;
  objects: GameObject[];
  color: string;
}

interface GameObject {
  x: number;
  width: number;
  type: "car" | "log";
}

// --- Crossy Street Board Component ---
function CrossyStreetBoard({
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
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game Logic Refs
  const playerRef = useRef({ x: 7, y: 14 }); // Grid coordinates
  const lanesRef = useRef<Lane[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const scrollOffsetRef = useRef(0);

  // --- Effects ---

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem("crossy-street-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("crossy-street-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth } = containerRef.current;
        const width = Math.min(clientWidth, 600);
        const height = width; // Square
        
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
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
      draw();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, difficulty, theme]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      
      const p = playerRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          p.y--;
          setScore(s => Math.max(s, 14 - p.y)); // Simple scoring based on max distance
          break;
        case "ArrowDown":
        case "s":
          if (p.y < ROWS - 1) p.y++;
          break;
        case "ArrowLeft":
        case "a":
          if (p.x > 0) p.x--;
          break;
        case "ArrowRight":
        case "d":
          if (p.x < COLS - 1) p.x++;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Touch Controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState !== "PLAYING") return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      const p = playerRef.current;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal
        if (Math.abs(diffX) > 30) { // Threshold
          if (diffX > 0 && p.x < COLS - 1) p.x++;
          else if (diffX < 0 && p.x > 0) p.x--;
        }
      } else {
        // Vertical
        if (Math.abs(diffY) > 30) {
          if (diffY < 0) {
             p.y--;
             setScore(s => Math.max(s, 14 - p.y));
          }
          else if (diffY > 0 && p.y < ROWS - 1) p.y++;
        } else {
          // Tap = Forward
           p.y--;
           setScore(s => Math.max(s, 14 - p.y));
        }
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState]);


  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    playerRef.current = { x: 7, y: 14 };
    setGameState("PLAYING");
    generateLevel(diff);
  };

  const generateLevel = (diff: Difficulty) => {
    const lanes: Lane[] = [];
    const baseSpeed = INITIAL_SPEED_MAP[diff];
    
    for (let i = 0; i < ROWS; i++) {
      // Bottom lanes are safe
      if (i >= 13) {
        lanes.push({ type: "safe", y: i, speed: 0, direction: 1, objects: [], color: "" });
        continue;
      }
      
      // Randomly assign types
      // 0-4: Water
      // 5: Safe
      // 6-10: Road
      // 11-12: Safe
      
      // Fixed layout for consistency or random? Let's do fixed pattern
      // 14: Safe (Start)
      // 13: Safe
      // 9-12: Road
      // 8: Safe
      // 4-7: Water
      // 3: Safe
      // 0-2: Road
      
      let type: LaneType = "safe";
      let speed = 0;
      let objects: GameObject[] = [];
      
      if ((i >= 9 && i <= 12) || (i >= 0 && i <= 2)) {
        type = "road";
        speed = (baseSpeed + Math.random() * 2) * (i % 2 === 0 ? 1 : 1.5);
      } else if (i >= 4 && i <= 7) {
        type = "water";
        speed = (baseSpeed + Math.random() * 1.5) * (i % 2 === 0 ? 1 : 1.2);
      }
      
      const direction = i % 2 === 0 ? 1 : -1;
      
      if (type === "road") {
        // Add cars
        const numCars = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numCars; j++) {
           objects.push({ x: j * 200 + Math.random() * 50, width: 40, type: "car" });
        }
      } else if (type === "water") {
        // Add logs
        const numLogs = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numLogs; j++) {
           objects.push({ x: j * 220 + Math.random() * 50, width: 80 + Math.random() * 40, type: "log" });
        }
      }
      
      lanes.push({
        type,
        y: i,
        speed: type === "safe" ? 0 : speed,
        direction,
        objects,
        color: type === "safe" ? "#22c55e" : type === "road" ? "#334155" : "#3b82f6"
      });
    }
    lanesRef.current = lanes;
  };

  const update = () => {
    const player = playerRef.current;
    
    // Check Win (Top reached)
    if (player.y < 0) {
      // Just respawn at bottom for infinite loop or win?
      // Let's do infinite scrolling style but simplistic: Reset to bottom, increase score, harder?
      // Or just win.
      // Let's just win for now.
      setGameState("MENU"); // Actually maybe just "WON" overlay?
      // Re-using start overlay, let's just trigger high score update and reset
      setScore(s => s + 50); // Bonus
      player.y = 14; // Reset
      // Ideally we generate new terrain but static for now
    }

    // Move Objects
    lanesRef.current.forEach(lane => {
      if (lane.speed === 0) return;
      
      lane.objects.forEach(obj => {
        obj.x += lane.speed * lane.direction;
        
        // Wrap
        if (lane.direction === 1 && obj.x > CANVAS_WIDTH) obj.x = -obj.width;
        if (lane.direction === -1 && obj.x < -obj.width) obj.x = CANVAS_WIDTH;
      });
    });

    // Collisions
    const currentLane = lanesRef.current.find(l => l.y === player.y);
    if (currentLane) {
      const playerRect = {
        x: player.x * GRID_SIZE + 5,
        y: player.y * GRID_SIZE + 5,
        w: GRID_SIZE - 10,
        h: GRID_SIZE - 10
      };

      if (currentLane.type === "road") {
        // Check Car hit
        const hit = currentLane.objects.some(obj => {
          return (
            playerRect.x < obj.x + obj.width &&
            playerRect.x + playerRect.w > obj.x
          );
        });
        if (hit) setGameState("GAME_OVER");
      } else if (currentLane.type === "water") {
        // Check Log ride
        const onLog = currentLane.objects.some(obj => {
          return (
            playerRect.x + playerRect.w / 2 > obj.x &&
            playerRect.x + playerRect.w / 2 < obj.x + obj.width
          );
        });
        
        if (onLog) {
          // Move player with log
          player.x += (currentLane.speed * currentLane.direction) / GRID_SIZE;
          // Clamp
          if (player.x < 0 || player.x >= COLS) setGameState("GAME_OVER");
        } else {
          // Drown
          setGameState("GAME_OVER");
        }
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
      safe: isDark ? "#166534" : "#86efac",
      road: isDark ? "#1e293b" : "#94a3b8",
      water: isDark ? "#1e40af" : "#93c5fd",
      player: isDark ? "#facc15" : "#eab308",
      car: isDark ? "#ef4444" : "#dc2626",
      log: isDark ? "#78350f" : "#92400e",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Lanes
    lanesRef.current.forEach(lane => {
      ctx.fillStyle = lane.type === "safe" ? colors.safe : lane.type === "road" ? colors.road : colors.water;
      ctx.fillRect(0, lane.y * GRID_SIZE, CANVAS_WIDTH, GRID_SIZE);
      
      // Draw Objects
      lane.objects.forEach(obj => {
        ctx.fillStyle = obj.type === "car" ? colors.car : colors.log;
        // Simple shadows
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 4;
        ctx.fillRect(obj.x, lane.y * GRID_SIZE + 5, obj.width, GRID_SIZE - 10);
        ctx.shadowBlur = 0;
      });
    });

    // Draw Player
    ctx.fillStyle = colors.player;
    ctx.shadowColor = colors.player;
    ctx.shadowBlur = 10;
    const px = playerRef.current.x * GRID_SIZE;
    const py = playerRef.current.y * GRID_SIZE;
    ctx.fillRect(px + 5, py + 5, GRID_SIZE - 10, GRID_SIZE - 10);
    ctx.shadowBlur = 0;

    // Draw UI
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Score: ${score}`, 20, 30);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] mx-auto aspect-square bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none"
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />
      
      {/* Overlays */}
      {(gameState === "MENU" || gameState === "GAME_OVER") && (
        <StartOverlay
          onStart={initGame}
          currentDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
          score={score}
          highScore={highScore}
          title={title}
          isGameOver={gameState === "GAME_OVER"}
        />
      )}
    </div>
  );
}

// --- Main Page Component ---
export default function CrossyStreetGame({
  title = "Crossy Street",
  description = "Cross the neon streets without getting hit by traffic.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I move?",
      answer: "Use arrow keys or tap the screen to hop forward. Swipe left/right/down to move in other directions.",
    },
    {
      question: "What kills me?",
      answer: "Getting hit by a car or falling into the water (unless you're on a log).",
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
            <strong>Crossy Street</strong> is an endless hopper game. 
            The goal is simple: get as far as you can across busy roads and treacherous rivers.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Hop:</strong> Move forward one lane at a time.</li>
            <li><strong>Timing:</strong> Wait for a gap in traffic.</li>
            <li><strong>Ride Logs:</strong> In the river, you must land on floating logs to survive.</li>
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
            <li><strong>Look Ahead:</strong> Plan your next few moves, don't just react to the lane in front of you.</li>
            <li><strong>Don't Rush:</strong> Sometimes waiting is better than jumping into danger.</li>
            <li><strong>Drift:</strong> Remember that logs move you sideways! Be ready to correct your position.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<CrossyStreetBoard title={title} description={description} />}
      editorial={editorialContent}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
