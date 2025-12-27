import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

// --- Game Constants ---
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const BUBBLE_RADIUS = 20;
const ROWS = 14;
const COLS = 15;
const SHOOT_SPEED = 15;

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER" | "WON";

const DIFFICULTY_SETTINGS = {
  easy: { speed: 10, rows: 4 },
  medium: { speed: 15, rows: 5 },
  hard: { speed: 20, rows: 6 },
};

interface Bubble {
  r: number;
  c: number;
  x: number;
  y: number;
  color: string;
  active: boolean;
}

interface Projectile {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  active: boolean;
}

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"]; // Red, Blue, Green, Yellow, Purple

// --- Bubble Shooter Board Component ---
function BubbleShooterBoard({
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

  // Game Logic Refs
  const gridRef = useRef<(Bubble | null)[][]>([]);
  const projectileRef = useRef<Projectile | null>(null);
  const nextBubbleColorRef = useRef<string>(COLORS[0]);
  const currentBubbleColorRef = useRef<string>(COLORS[1]);
  const angleRef = useRef(-Math.PI / 2); // Pointing up
  const shotsFiredRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

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
    const saved = localStorage.getItem("bubble-shooter-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("bubble-shooter-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth } = containerRef.current;
        const width = Math.min(clientWidth, 600);
        const height = width;
        
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

  // Input Controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleInput = (clientX: number, clientY: number) => {
      if (gameState !== "PLAYING") return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      
      // Calculate angle from shooter (bottom center) to mouse
      const shooterX = CANVAS_WIDTH / 2;
      const shooterY = CANVAS_HEIGHT - 30;
      
      const dx = x - shooterX;
      const dy = y - shooterY;
      angleRef.current = Math.atan2(dy, dx);
      
      // Clamp angle (don't shoot down or too flat)
      if (angleRef.current > -0.2) angleRef.current = -0.2;
      if (angleRef.current < -Math.PI + 0.2) angleRef.current = -Math.PI + 0.2;
    };

    const handleClick = () => {
      if (gameState === "PLAYING" && !projectileRef.current) {
        fireBubble();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handleInput(e.clientX, e.clientY);
    };
    
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleInput(e.touches[0].clientX, e.touches[0].clientY);
    };
    
    const onMouseDown = (e: MouseEvent) => {
       handleClick();
    };

    const onTouchEnd = (e: TouchEvent) => {
       handleClick();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [gameState]);


  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setGameState("PLAYING");
    shotsFiredRef.current = 0;
    
    // Init Grid
    // Staggered grid
    // Even rows (0, 2...): offset 0
    // Odd rows (1, 3...): offset BUBBLE_RADIUS
    
    const newGrid: (Bubble | null)[][] = [];
    const rows = DIFFICULTY_SETTINGS[diff].rows; 
    
    for (let r = 0; r < ROWS; r++) {
      const row: (Bubble | null)[] = [];
      for (let c = 0; c < COLS; c++) {
        if (r < rows) {
          row.push({
            r,
            c,
            x: getBubbleX(r, c),
            y: getBubbleY(r),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            active: true
          });
        } else {
          row.push(null);
        }
      }
      newGrid.push(row);
    }
    gridRef.current = newGrid;
    pickNextColors();
  };
  
  const getBubbleX = (r: number, c: number) => {
    const offset = (r % 2) * BUBBLE_RADIUS;
    return c * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS + offset;
  };
  
  const getBubbleY = (r: number) => {
    return r * (BUBBLE_RADIUS * 2 * 0.866) + BUBBLE_RADIUS; // hex height
  };

  const pickNextColors = () => {
    currentBubbleColorRef.current = nextBubbleColorRef.current;
    nextBubbleColorRef.current = COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const fireBubble = () => {
    projectileRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      dx: Math.cos(angleRef.current) * SHOOT_SPEED,
      dy: Math.sin(angleRef.current) * SHOOT_SPEED,
      color: currentBubbleColorRef.current,
      active: true
    };
    pickNextColors();
    shotsFiredRef.current++;
    
    // Add row periodically?
    // Every 5-10 shots based on difficulty
    const threshold = difficulty === "easy" ? 10 : difficulty === "medium" ? 8 : 6;
    if (shotsFiredRef.current % threshold === 0) {
      addRow();
    }
  };
  
  const addRow = () => {
    // Shift down
    // If any bubble hits bottom, game over
    for (let r = ROWS - 1; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        const b = gridRef.current[r][c];
        if (b && r === ROWS - 1) {
          setGameState("GAME_OVER");
          return;
        }
        if (r > 0) {
          const prev = gridRef.current[r - 1][c];
          if (prev) {
             gridRef.current[r][c] = { ...prev, r, y: getBubbleY(r) };
          } else {
             gridRef.current[r][c] = null;
          }
        }
      }
    }
    // New top row
    for (let c = 0; c < COLS; c++) {
      gridRef.current[0][c] = {
        r: 0,
        c,
        x: getBubbleX(0, c),
        y: getBubbleY(0),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        active: true
      };
    }
  };

  const update = () => {
    const p = projectileRef.current;
    if (!p || !p.active) return;
    
    p.x += p.dx;
    p.y += p.dy;
    
    // Wall bounce
    if (p.x < BUBBLE_RADIUS || p.x > CANVAS_WIDTH - BUBBLE_RADIUS) {
      p.dx = -p.dx;
      p.x = Math.max(BUBBLE_RADIUS, Math.min(CANVAS_WIDTH - BUBBLE_RADIUS, p.x));
    }
    
    // Ceiling snap
    if (p.y < BUBBLE_RADIUS) {
      snapBubble(p);
      return;
    }
    
    // Grid collision
    let collided = false;
    if (gridRef.current.length > 0) {
      for (let r = 0; r < ROWS; r++) {
        if (!gridRef.current[r]) continue;
        for (let c = 0; c < COLS; c++) {
          const b = gridRef.current[r][c];
          if (b && b.active) {
            const dist = Math.hypot(p.x - b.x, p.y - b.y);
            if (dist < BUBBLE_RADIUS * 1.8) { // Slightly less than 2*radius for overlap feel
              collided = true;
              break;
            }
          }
        }
        if (collided) break;
      }
    }
    
    if (collided) {
      snapBubble(p);
    }
  };
  
  const snapBubble = (p: Projectile) => {
    p.active = false;
    projectileRef.current = null;
    
    // Find nearest grid slot
    // This logic is complex for hex grids.
    // Simplified: Iterate all empty slots and find closest center
    
    let closestDist = Infinity;
    let targetR = -1;
    let targetC = -1;
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!gridRef.current[r][c]) {
          const bx = getBubbleX(r, c);
          const by = getBubbleY(r);
          const dist = Math.hypot(p.x - bx, p.y - by);
          if (dist < closestDist) {
            closestDist = dist;
            targetR = r;
            targetC = c;
          }
        }
      }
    }
    
    if (targetR !== -1) {
      // Place bubble
      const newBubble: Bubble = {
        r: targetR,
        c: targetC,
        x: getBubbleX(targetR, targetC),
        y: getBubbleY(targetR),
        color: p.color,
        active: true
      };
      gridRef.current[targetR][targetC] = newBubble;
      
      // Check matches
      const matches = findMatches(targetR, targetC, p.color);
      if (matches.length >= 3) {
        matches.forEach(m => {
          gridRef.current[m.r][m.c] = null;
          setScore(s => s + 10);
        });
        
        // Check floating clusters
        removeFloating();
      }
      
      // Check Game Over (Bottom reached)
      if (targetR >= ROWS - 1) {
        setGameState("GAME_OVER");
      }
    }
  };
  
  const findMatches = (r: number, c: number, color: string) => {
    const visited = new Set<string>();
    const matches: {r: number, c: number}[] = [];
    const queue = [{r, c}];
    
    while (queue.length > 0) {
      const {r: cr, c: cc} = queue.pop()!;
      const key = `${cr},${cc}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      matches.push({r: cr, c: cc});
      
      const neighbors = getNeighbors(cr, cc);
      neighbors.forEach(n => {
        const nb = gridRef.current[n.r][n.c];
        if (nb && nb.color === color && !visited.has(`${n.r},${n.c}`)) {
          queue.push(n);
        }
      });
    }
    
    return matches;
  };
  
  const getNeighbors = (r: number, c: number) => {
    const offsets = (r % 2 === 0) 
      ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
      : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
      
    const neighbors: {r: number, c: number}[] = [];
    offsets.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        neighbors.push({r: nr, c: nc});
      }
    });
    return neighbors;
  };
  
  const removeFloating = () => {
    // Safety check
    if (!gridRef.current || gridRef.current.length === 0) return;

    // BFS from top row to mark connected bubbles
    const visited = new Set<string>();
    const queue: {r: number, c: number}[] = [];
    
    // Add all top row bubbles
    for (let c = 0; c < COLS; c++) {
      if (gridRef.current[0] && gridRef.current[0][c]) {
        queue.push({r: 0, c});
      }
    }
    
    while (queue.length > 0) {
      const {r, c} = queue.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      
      const neighbors = getNeighbors(r, c);
      neighbors.forEach(n => {
        if (gridRef.current[n.r] && gridRef.current[n.r][n.c]) {
          queue.push(n);
        }
      });
    }
    
    // Remove anything not visited
    for (let r = 0; r < ROWS; r++) {
      if (!gridRef.current[r]) continue;
      for (let c = 0; c < COLS; c++) {
        if (gridRef.current[r][c] && !visited.has(`${r},${c}`)) {
          gridRef.current[r][c] = null;
          setScore(s => s + 20); // Bonus points for drops
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
      text: isDark ? "#f8fafc" : "#0f172a",
      line: isDark ? "#334155" : "#cbd5e1",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Grid Bubbles
    if (gridRef.current.length > 0) {
      for (let r = 0; r < ROWS; r++) {
        if (!gridRef.current[r]) continue;
        for (let c = 0; c < COLS; c++) {
          const b = gridRef.current[r][c];
          if (b) {
            drawBubble(ctx, b.x, b.y, b.color);
          }
        }
      }
    }
    
    // Draw Projectile
    if (projectileRef.current && projectileRef.current.active) {
      drawBubble(ctx, projectileRef.current.x, projectileRef.current.y, projectileRef.current.color);
    }
    
    // Draw Shooter
    const shooterX = CANVAS_WIDTH / 2;
    const shooterY = CANVAS_HEIGHT - 30;
    
    // Aim line
    ctx.strokeStyle = colors.line;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(shooterX, shooterY);
    ctx.lineTo(
      shooterX + Math.cos(angleRef.current) * 100,
      shooterY + Math.sin(angleRef.current) * 100
    );
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Current Bubble
    drawBubble(ctx, shooterX, shooterY, currentBubbleColorRef.current);
    
    // Next Bubble Preview
    drawBubble(ctx, shooterX + 60, shooterY, nextBubbleColorRef.current, 10);
    ctx.fillStyle = colors.text;
    ctx.font = "12px Arial";
    ctx.fillText("Next", shooterX + 45, shooterY + 20);

    // Draw UI
    ctx.fillStyle = colors.text;
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 150, 30);
  };
  
  const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, radius = BUBBLE_RADIUS) => {
    ctx.beginPath();
    ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Shine
    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fill();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] mx-auto aspect-square bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none"
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
        className="block w-full h-full touch-none cursor-crosshair"
      />
      
      {/* Overlays */}
      <GameStartOverlay
        isPlaying={gameState === "PLAYING"}
        isGameOver={gameState === "GAME_OVER"}
        score={score}
        highScore={highScore}
        onStart={initGame}
        onRestart={initGame}
        gameName={title}
      />
    </div>
  );
}

// --- Main Page Component ---
export default function BubbleShooterGame({
  title = "Bubble Shooter Nova",
  description = "Match 3 bubbles to pop them in this neon space adventure.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I aim?",
      answer: "Move your mouse or drag your finger to aim the shooter at the bottom.",
    },
    {
      question: "How to clear bubbles?",
      answer: "Shoot to create groups of 3 or more bubbles of the same color. They will pop!",
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
            <strong>Bubble Shooter Nova</strong> is a relaxing puzzle game.
            Clear the board by matching colorful bubbles.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Match 3:</strong> Connect 3 or more same-colored bubbles to pop them.</li>
            <li><strong>Drop:</strong> Popping bubbles can cause others hanging underneath to drop for bonus points.</li>
            <li><strong>Watch the Ceiling:</strong> The roof lowers periodically. Don't let the bubbles reach the bottom!</li>
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
            <li><strong>Bank Shots:</strong> Bounce bubbles off the walls to reach tricky spots.</li>
            <li><strong>Aim High:</strong> Try to pop bubbles higher up to drop large clusters at once.</li>
            <li><strong>Plan Ahead:</strong> Look at the "Next" bubble to plan your shots.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<BubbleShooterBoard title={title} description={description} />}
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
