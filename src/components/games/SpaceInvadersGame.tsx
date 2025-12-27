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
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 8;
const PROJECTILE_SPEED = 7;

const INITIAL_SPEED_MAP = {
  easy: 1,
  medium: 2,
  hard: 3,
};

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER" | "WON";

interface Projectile {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  fromPlayer: boolean;
}

interface Alien {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  row: number;
  col: number;
}

// --- Space Invaders Board Component ---
function SpaceInvadersBoard({
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
  const playerRef = useRef({ x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 40, active: true });
  const aliensRef = useRef<Alien[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const alienDirectionRef = useRef(1); // 1 = right, -1 = left
  const alienMoveTimerRef = useRef(0);
  const alienShootTimerRef = useRef(0);
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
    const saved = localStorage.getItem("space-invaders-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("space-invaders-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth } = containerRef.current;
        const width = Math.min(clientWidth, 600);
        const height = width; // Square aspect ratio
        
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
      
      const speed = 15;
      
      if (e.key === "ArrowLeft" || e.key === "a") {
        playerRef.current.x = Math.max(0, playerRef.current.x - speed);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        playerRef.current.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, playerRef.current.x + speed);
      } else if (e.key === " " || e.key === "ArrowUp") {
        // Shoot
        firePlayerProjectile();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Touch Controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      // Also shoot on tap? Maybe separate button or just tap anywhere
      firePlayerProjectile();
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      const diff = touchX - touchStartX;
      touchStartX = touchX;
      
      let newX = playerRef.current.x + diff;
      newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, newX));
      playerRef.current.x = newX;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [gameState]);


  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setLives(3);
    setGameState("PLAYING");
    
    playerRef.current = { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 40, active: true };
    projectilesRef.current = [];
    alienDirectionRef.current = 1;
    alienMoveTimerRef.current = 0;
    
    // Initialize Aliens
    const aliens: Alien[] = [];
    for (let r = 0; r < ALIEN_ROWS; r++) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        aliens.push({
          x: 50 + c * (ALIEN_WIDTH + 15),
          y: 50 + r * (ALIEN_HEIGHT + 15),
          width: ALIEN_WIDTH,
          height: ALIEN_HEIGHT,
          active: true,
          row: r,
          col: c
        });
      }
    }
    aliensRef.current = aliens;
  };

  const firePlayerProjectile = () => {
    // Limit player fire rate?
    // Check if there is already a player projectile active?
    // For now, allow rapid fire but maybe limit count
    const activePlayerShots = projectilesRef.current.filter(p => p.fromPlayer && p.active).length;
    if (activePlayerShots < 3) {
       projectilesRef.current.push({
         x: playerRef.current.x + PLAYER_WIDTH / 2 - 2,
         y: playerRef.current.y,
         width: 4,
         height: 10,
         active: true,
         fromPlayer: true
       });
    }
  };

  const update = () => {
    // Move Projectiles
    projectilesRef.current.forEach(p => {
      if (!p.active) return;
      if (p.fromPlayer) {
        p.y -= PROJECTILE_SPEED;
      } else {
        p.y += PROJECTILE_SPEED / 2; // Alien shots slower
      }
      
      // Deactivate off-screen
      if (p.y < 0 || p.y > CANVAS_HEIGHT) p.active = false;
    });

    // Move Aliens
    alienMoveTimerRef.current++;
    const moveThreshold = 60 / INITIAL_SPEED_MAP[difficulty]; // 60fps / speed
    
    if (alienMoveTimerRef.current > moveThreshold) {
      alienMoveTimerRef.current = 0;
      let shouldDrop = false;
      
      // Check edges
      const activeAliens = aliensRef.current.filter(a => a.active);
      if (activeAliens.length === 0) {
        setGameState("WON");
        return;
      }

      const leftEdge = Math.min(...activeAliens.map(a => a.x));
      const rightEdge = Math.max(...activeAliens.map(a => a.x + a.width));
      
      if ((rightEdge >= CANVAS_WIDTH - 10 && alienDirectionRef.current === 1) || 
          (leftEdge <= 10 && alienDirectionRef.current === -1)) {
        shouldDrop = true;
        alienDirectionRef.current *= -1;
      }
      
      aliensRef.current.forEach(a => {
        if (shouldDrop) {
          a.y += 20;
          // Check game over if aliens reach player level
          if (a.y + a.height >= playerRef.current.y && a.active) {
            setGameState("GAME_OVER");
          }
        } else {
          a.x += 10 * alienDirectionRef.current;
        }
      });
    }

    // Alien Shooting
    alienShootTimerRef.current++;
    if (alienShootTimerRef.current > 120 / INITIAL_SPEED_MAP[difficulty]) { // Shoot every ~2s adjusted by difficulty
       alienShootTimerRef.current = 0;
       const activeAliens = aliensRef.current.filter(a => a.active);
       if (activeAliens.length > 0) {
         // Pick random shooter
         const shooter = activeAliens[Math.floor(Math.random() * activeAliens.length)];
         projectilesRef.current.push({
           x: shooter.x + shooter.width / 2,
           y: shooter.y + shooter.height,
           width: 4,
           height: 10,
           active: true,
           fromPlayer: false
         });
       }
    }

    // Collisions
    projectilesRef.current.forEach(p => {
      if (!p.active) return;
      
      if (p.fromPlayer) {
        // Check Alien Hit
        aliensRef.current.forEach(a => {
          if (!a.active) return;
          if (
            p.x < a.x + a.width &&
            p.x + p.width > a.x &&
            p.y < a.y + a.height &&
            p.y + p.height > a.y
          ) {
            a.active = false;
            p.active = false;
            setScore(s => s + 10);
          }
        });
      } else {
        // Check Player Hit
        const pl = playerRef.current;
        if (
          p.x < pl.x + PLAYER_WIDTH &&
          p.x + p.width > pl.x &&
          p.y < pl.y + PLAYER_HEIGHT &&
          p.y + p.height > pl.y
        ) {
          p.active = false;
          // Lose life
          if (lives > 1) {
            setLives(l => l - 1);
            // Respawn delay? Or just flash?
            // For simplicity, instant continue
          } else {
            setGameState("GAME_OVER");
          }
        }
      }
    });

    // Cleanup inactive projectiles
    projectilesRef.current = projectilesRef.current.filter(p => p.active);
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
      player: isDark ? "#22c55e" : "#16a34a",
      alien: isDark ? "#a855f7" : "#9333ea",
      projectilePlayer: isDark ? "#38bdf8" : "#0284c7",
      projectileAlien: isDark ? "#ef4444" : "#dc2626",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Player
    ctx.fillStyle = colors.player;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.player;
    // Simple ship shape
    ctx.beginPath();
    ctx.moveTo(playerRef.current.x + PLAYER_WIDTH / 2, playerRef.current.y);
    ctx.lineTo(playerRef.current.x + PLAYER_WIDTH, playerRef.current.y + PLAYER_HEIGHT);
    ctx.lineTo(playerRef.current.x, playerRef.current.y + PLAYER_HEIGHT);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Aliens
    ctx.fillStyle = colors.alien;
    aliensRef.current.forEach(a => {
      if (a.active) {
        ctx.fillRect(a.x, a.y, a.width, a.height);
      }
    });

    // Draw Projectiles
    projectilesRef.current.forEach(p => {
      ctx.fillStyle = p.fromPlayer ? colors.projectilePlayer : colors.projectileAlien;
      ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw UI
    ctx.fillStyle = colors.text;
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 100, 30);
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
        className="block w-full h-full touch-none"
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
export default function SpaceInvadersGame({
  title = "Space Invaders Remix",
  description = "Defend Earth from the neon alien invasion!",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I move and shoot?",
      answer: "Use Left/Right arrows to move, and Spacebar or Up arrow to shoot. On touch devices, drag to move and tap to shoot.",
    },
    {
      question: "How do I win?",
      answer: "Destroy all the aliens before they reach your ship or destroy you.",
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
            <strong>Space Invaders Remix</strong> puts you in command of Earth's last defense ship. 
            Waves of aliens are descending from the sky, and you must destroy them all.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Move:</strong> Dodge incoming alien fire.</li>
            <li><strong>Shoot:</strong> Fire back to destroy the invaders.</li>
            <li><strong>Survive:</strong> You have 3 lives. Don't let the aliens land!</li>
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
            <li><strong>Focus Fire:</strong> Clearing a column helps you create a safe zone.</li>
            <li><strong>Keep Moving:</strong> A moving target is harder to hit.</li>
            <li><strong>Prioritize:</strong> The bottom row aliens are the biggest threat as they are closest.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<SpaceInvadersBoard title={title} description={description} />}
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
