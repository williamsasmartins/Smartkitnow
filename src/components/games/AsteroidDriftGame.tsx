import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

// --- Game Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SIZE = 20;
const BULLET_SPEED = 5;
const ROTATION_SPEED = 0.1;
const THRUST = 0.1;
const FRICTION = 0.99;

const INITIAL_SPEED_MAP = {
  easy: 1,
  medium: 2,
  hard: 3,
};

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER";

interface Point {
  x: number;
  y: number;
}

interface Asteroid {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  vertices: number[]; // offsets for irregular shape
  active: boolean;
  size: "large" | "medium" | "small";
}

interface Bullet {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  active: boolean;
}

// --- Asteroid Drift Board Component ---
function AsteroidDriftBoard({
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
  const shipRef = useRef({ 
    x: CANVAS_WIDTH / 2, 
    y: CANVAS_HEIGHT / 2, 
    dx: 0, 
    dy: 0, 
    angle: -Math.PI / 2, 
    thrusting: false,
    rotatingLeft: false,
    rotatingRight: false,
    invulnerable: 0 // frames
  });
  
  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
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
    const saved = localStorage.getItem("asteroid-drift-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("asteroid-drift-highscore", score.toString());
    }
  }, [score, highScore]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth } = containerRef.current;
        const width = Math.min(clientWidth, 800);
        const height = width * (CANVAS_HEIGHT / CANVAS_WIDTH);
        
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
      
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          shipRef.current.rotatingLeft = true;
          break;
        case "ArrowRight":
        case "d":
          shipRef.current.rotatingRight = true;
          break;
        case "ArrowUp":
        case "w":
          shipRef.current.thrusting = true;
          break;
        case " ":
          fireBullet();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          shipRef.current.rotatingLeft = false;
          break;
        case "ArrowRight":
        case "d":
          shipRef.current.rotatingRight = false;
          break;
        case "ArrowUp":
        case "w":
          shipRef.current.thrusting = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Touch Controls (Simple overlay buttons could be better, but implementing basic tap regions)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Left side: Rotate Left, Right side: Rotate Right, Top: Thrust, Bottom: Fire?
    // Let's keep it simple: Drag for thrust/rotate? 
    // Actually, for Asteroids on mobile, on-screen controls are best. 
    // Since we don't have on-screen controls UI, we'll map touch areas:
    // Left half: Rotate Left
    // Right half: Rotate Right
    // Both: Thrust? 
    // Tap center: Fire
    
    // This is tricky without UI buttons. 
    // Let's implement a simple "Follow finger" approach for movement and tap to shoot?
    // No, classic asteroids physics is hard with follow finger.
    
    // Fallback: Tap left/right side of screen to rotate.
    // Tap top to thrust.
    // Double tap to shoot?
    
    // For now, let's stick to keyboard as primary, but maybe add basic touch support later if requested.
    // The user asked for "responsiveness", so touch is needed.
    // Let's use: 
    // Tap left 1/3: Rotate Left
    // Tap right 1/3: Rotate Right
    // Tap bottom center: Thrust
    // Tap top center: Fire

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      if (y < h * 0.3) {
        fireBullet();
      } else if (y > h * 0.7) {
        shipRef.current.thrusting = true;
      } else if (x < w * 0.5) {
        shipRef.current.rotatingLeft = true;
      } else {
        shipRef.current.rotatingRight = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      // Stop everything on lift
      shipRef.current.thrusting = false;
      shipRef.current.rotatingLeft = false;
      shipRef.current.rotatingRight = false;
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
    setLives(3);
    setGameState("PLAYING");
    
    resetShip();
    
    asteroidsRef.current = [];
    bulletsRef.current = [];
    
    // Create initial asteroids
    const count = diff === "easy" ? 4 : diff === "medium" ? 6 : 8;
    for (let i = 0; i < count; i++) {
      spawnAsteroid("large");
    }
  };

  const resetShip = () => {
    shipRef.current = { 
      x: CANVAS_WIDTH / 2, 
      y: CANVAS_HEIGHT / 2, 
      dx: 0, 
      dy: 0, 
      angle: -Math.PI / 2, 
      thrusting: false,
      rotatingLeft: false,
      rotatingRight: false,
      invulnerable: 180 // 3 seconds at 60fps
    };
  };

  const spawnAsteroid = (size: "large" | "medium" | "small", x?: number, y?: number) => {
    const radius = size === "large" ? 40 : size === "medium" ? 20 : 10;
    
    // If x,y not provided, random edge position
    let spawnX = x;
    let spawnY = y;
    
    if (spawnX === undefined || spawnY === undefined) {
      if (Math.random() < 0.5) {
        spawnX = Math.random() < 0.5 ? 0 : CANVAS_WIDTH;
        spawnY = Math.random() * CANVAS_HEIGHT;
      } else {
        spawnX = Math.random() * CANVAS_WIDTH;
        spawnY = Math.random() < 0.5 ? 0 : CANVAS_HEIGHT;
      }
    }

    const speed = INITIAL_SPEED_MAP[difficulty] * (size === "large" ? 1 : size === "medium" ? 1.5 : 2);
    const angle = Math.random() * Math.PI * 2;

    // Generate random vertices
    const vertices = [];
    const numVerts = 8 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numVerts; i++) {
      vertices.push(0.8 + Math.random() * 0.4); // scale factor 0.8-1.2
    }

    asteroidsRef.current.push({
      x: spawnX,
      y: spawnY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      radius,
      vertices,
      active: true,
      size
    });
  };

  const fireBullet = () => {
    if (shipRef.current.invulnerable > 0 && gameState !== "PLAYING") return;
    
    const ship = shipRef.current;
    bulletsRef.current.push({
      x: ship.x + Math.cos(ship.angle) * SHIP_SIZE,
      y: ship.y + Math.sin(ship.angle) * SHIP_SIZE,
      dx: Math.cos(ship.angle) * BULLET_SPEED,
      dy: Math.sin(ship.angle) * BULLET_SPEED,
      life: 60, // frames
      active: true
    });
  };

  const update = () => {
    const ship = shipRef.current;

    // Ship Physics
    if (ship.rotatingLeft) ship.angle -= ROTATION_SPEED;
    if (ship.rotatingRight) ship.angle += ROTATION_SPEED;
    
    if (ship.thrusting) {
      ship.dx += Math.cos(ship.angle) * THRUST;
      ship.dy += Math.sin(ship.angle) * THRUST;
    }

    ship.dx *= FRICTION;
    ship.dy *= FRICTION;
    ship.x += ship.dx;
    ship.y += ship.dy;

    // Screen Wrap Ship
    if (ship.x < 0) ship.x += CANVAS_WIDTH;
    if (ship.x > CANVAS_WIDTH) ship.x -= CANVAS_WIDTH;
    if (ship.y < 0) ship.y += CANVAS_HEIGHT;
    if (ship.y > CANVAS_HEIGHT) ship.y -= CANVAS_HEIGHT;

    // Invulnerability
    if (ship.invulnerable > 0) ship.invulnerable--;

    // Bullets
    bulletsRef.current.forEach(b => {
      b.x += b.dx;
      b.y += b.dy;
      b.life--;
      if (b.life <= 0) b.active = false;
      
      // Screen Wrap Bullets
      if (b.x < 0) b.x += CANVAS_WIDTH;
      if (b.x > CANVAS_WIDTH) b.x -= CANVAS_WIDTH;
      if (b.y < 0) b.y += CANVAS_HEIGHT;
      if (b.y > CANVAS_HEIGHT) b.y -= CANVAS_HEIGHT;
    });
    bulletsRef.current = bulletsRef.current.filter(b => b.active);

    // Asteroids
    asteroidsRef.current.forEach(a => {
      a.x += a.dx;
      a.y += a.dy;

      // Screen Wrap Asteroids
      if (a.x < -a.radius) a.x += CANVAS_WIDTH + a.radius * 2;
      if (a.x > CANVAS_WIDTH + a.radius) a.x -= CANVAS_WIDTH + a.radius * 2;
      if (a.y < -a.radius) a.y += CANVAS_HEIGHT + a.radius * 2;
      if (a.y > CANVAS_HEIGHT + a.radius) a.y -= CANVAS_HEIGHT + a.radius * 2;
    });

    // Collisions: Bullet vs Asteroid
    bulletsRef.current.forEach(b => {
      if (!b.active) return;
      asteroidsRef.current.forEach(a => {
        if (!a.active) return;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < a.radius) {
          b.active = false;
          a.active = false;
          setScore(s => s + (a.size === "large" ? 20 : a.size === "medium" ? 50 : 100));
          
          // Split
          if (a.size === "large") {
            spawnAsteroid("medium", a.x, a.y);
            spawnAsteroid("medium", a.x, a.y);
          } else if (a.size === "medium") {
            spawnAsteroid("small", a.x, a.y);
            spawnAsteroid("small", a.x, a.y);
          }
        }
      });
    });

    // Collisions: Ship vs Asteroid
    if (ship.invulnerable === 0) {
      asteroidsRef.current.forEach(a => {
        if (!a.active) return;
        const dist = Math.hypot(ship.x - a.x, ship.y - a.y);
        if (dist < a.radius + SHIP_SIZE / 2) {
          // Crash
          if (lives > 1) {
            setLives(l => l - 1);
            resetShip();
          } else {
            setGameState("GAME_OVER");
          }
        }
      });
    }

    // Cleanup
    asteroidsRef.current = asteroidsRef.current.filter(a => a.active);
    
    // Level Up? (Respawn asteroids if all gone)
    if (asteroidsRef.current.length === 0) {
      const count = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
      for (let i = 0; i < count + Math.floor(score / 1000); i++) {
        spawnAsteroid("large");
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
      ship: isDark ? "#38bdf8" : "#0284c7",
      asteroid: isDark ? "#94a3b8" : "#475569",
      bullet: isDark ? "#ef4444" : "#dc2626",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Ship
    if (shipRef.current.invulnerable % 10 < 5) { // Flicker if invulnerable
      ctx.strokeStyle = colors.ship;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(shipRef.current.x, shipRef.current.y);
      ctx.rotate(shipRef.current.angle);
      ctx.beginPath();
      ctx.moveTo(SHIP_SIZE, 0);
      ctx.lineTo(-SHIP_SIZE / 2, SHIP_SIZE / 2);
      ctx.lineTo(-SHIP_SIZE / 2, -SHIP_SIZE / 2);
      ctx.closePath();
      ctx.stroke();
      if (shipRef.current.thrusting) {
        ctx.beginPath();
        ctx.moveTo(-SHIP_SIZE / 2, 0);
        ctx.lineTo(-SHIP_SIZE, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Asteroids
    ctx.strokeStyle = colors.asteroid;
    ctx.lineWidth = 2;
    asteroidsRef.current.forEach(a => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.beginPath();
      const numVerts = a.vertices.length;
      const angleStep = (Math.PI * 2) / numVerts;
      a.vertices.forEach((scale, i) => {
        const angle = i * angleStep;
        const r = a.radius * scale;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Draw Bullets
    ctx.fillStyle = colors.bullet;
    bulletsRef.current.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
      ctx.fill();
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
export default function AsteroidDriftGame({
  title = "Asteroid Drift",
  description = "Navigate through the asteroid field and blast your way to survival.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I control the ship?",
      answer: "Use Arrow keys or WASD to rotate and thrust. Spacebar fires your weapon.",
    },
    {
      question: "What happens when I shoot a big asteroid?",
      answer: "It breaks into smaller pieces! You have to destroy the smaller ones too.",
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
            <strong>Asteroid Drift</strong> challenges your reflexes and physics control. 
            You are adrift in a dangerous asteroid belt. Survival depends on your ability to pilot and shoot.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Thrust:</strong> Be careful with momentum! You drift in space.</li>
            <li><strong>Shoot:</strong> Break rocks into smaller pieces.</li>
            <li><strong>Screen Wrap:</strong> Flying off one edge brings you back on the other. Use this to escape!</li>
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
            <li><strong>Don't Stop Shooting:</strong> Keep the area clear.</li>
            <li><strong>Stay Center:</strong> Edges can be dangerous if an asteroid wraps around unexpectedly.</li>
            <li><strong>Control:</strong> Tap thrust lightly. Don't hold it down or you'll lose control.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<AsteroidDriftBoard title={title} description={description} />}
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
