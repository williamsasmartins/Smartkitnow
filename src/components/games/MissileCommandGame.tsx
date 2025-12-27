import React, { useState, useEffect, useRef } from "react";
import { Gamepad2 } from "lucide-react";
import StartOverlay from "./StartOverlay";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import useFaqJsonLd from "../../hooks/useFaqJsonLd";
import { useTheme } from "next-themes";

// --- Game Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GROUND_HEIGHT = 50;
const CITY_WIDTH = 40;
const CITY_HEIGHT = 20;
const EXPLOSION_MAX_RADIUS = 40;
const PLAYER_MISSILE_SPEED = 15;

const DIFFICULTY_MAP = {
  easy: { speed: 1, rate: 100, ammo: 30 },
  medium: { speed: 2, rate: 60, ammo: 20 },
  hard: { speed: 3, rate: 40, ammo: 15 },
};

type Difficulty = "easy" | "medium" | "hard";
type GameState = "MENU" | "PLAYING" | "GAME_OVER" | "WON";

interface Point {
  x: number;
  y: number;
}

interface Missile {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  speed: number;
  active: boolean;
  isEnemy: boolean;
  targetCityIndex?: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  growing: boolean;
  active: boolean;
}

interface City {
  x: number;
  y: number;
  active: boolean;
}

// --- Missile Command Board Component ---
function MissileCommandBoard({
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
  const [ammo, setAmmo] = useState(0);
  const [level, setLevel] = useState(1);

  // Game Logic Refs
  const missilesRef = useRef<Missile[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const citiesRef = useRef<City[]>([]);
  const frameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const nextMissileId = useRef(0);

  // --- Effects ---

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem("missile-command-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("missile-command-highscore", score.toString());
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

  // Input Controls (Mouse/Touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleInput = (clientX: number, clientY: number) => {
      if (gameState !== "PLAYING" || ammo <= 0) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      
      // Don't fire too low
      if (y > CANVAS_HEIGHT - GROUND_HEIGHT) return;

      firePlayerMissile(x, y);
    };

    const onMouseDown = (e: MouseEvent) => {
      handleInput(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleInput(e.touches[0].clientX, e.touches[0].clientY);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, [gameState, ammo]);


  // --- Game Logic ---

  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setLevel(1);
    startLevel(1, diff);
    
    // Init Cities
    const citySpacing = CANVAS_WIDTH / 7;
    const newCities: City[] = [];
    for (let i = 1; i <= 6; i++) {
       newCities.push({
         x: i * citySpacing - CITY_WIDTH / 2,
         y: CANVAS_HEIGHT - GROUND_HEIGHT - CITY_HEIGHT,
         active: true
       });
    }
    citiesRef.current = newCities;
    
    setGameState("PLAYING");
  };

  const startLevel = (lvl: number, diff: Difficulty) => {
    setAmmo(DIFFICULTY_MAP[diff].ammo + (lvl - 1) * 5);
    missilesRef.current = [];
    explosionsRef.current = [];
    frameRef.current = 0;
  };

  const firePlayerMissile = (targetX: number, targetY: number) => {
    setAmmo(a => a - 1);
    const startX = CANVAS_WIDTH / 2;
    const startY = CANVAS_HEIGHT - GROUND_HEIGHT;
    
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    
    missilesRef.current.push({
      id: nextMissileId.current++,
      startX,
      startY,
      endX: targetX,
      endY: targetY,
      currentX: startX,
      currentY: startY,
      speed: PLAYER_MISSILE_SPEED,
      active: true,
      isEnemy: false
    });
  };

  const spawnEnemyMissile = () => {
    const activeCities = citiesRef.current.filter(c => c.active);
    if (activeCities.length === 0) return; // Game over check elsewhere

    const targetCity = activeCities[Math.floor(Math.random() * activeCities.length)];
    const startX = Math.random() * CANVAS_WIDTH;
    const startY = 0;
    
    // Add speed based on level
    const speed = DIFFICULTY_MAP[difficulty].speed + (level * 0.2);
    
    missilesRef.current.push({
      id: nextMissileId.current++,
      startX,
      startY,
      endX: targetCity.x + CITY_WIDTH / 2,
      endY: targetCity.y + CITY_HEIGHT / 2,
      currentX: startX,
      currentY: startY,
      speed,
      active: true,
      isEnemy: true
    });
  };

  const createExplosion = (x: number, y: number) => {
    explosionsRef.current.push({
      id: nextMissileId.current++,
      x,
      y,
      radius: 1,
      maxRadius: EXPLOSION_MAX_RADIUS,
      growing: true,
      active: true
    });
  };

  const update = () => {
    frameRef.current++;
    
    // Spawn Enemies
    const spawnRate = Math.max(20, DIFFICULTY_MAP[difficulty].rate - (level * 2));
    if (frameRef.current % Math.floor(spawnRate) === 0) {
      spawnEnemyMissile();
    }

    // Update Missiles
    missilesRef.current.forEach(m => {
      if (!m.active) return;
      
      const dx = m.endX - m.startX;
      const dy = m.endY - m.startY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      
      m.currentX += Math.cos(angle) * m.speed;
      m.currentY += Math.sin(angle) * m.speed;
      
      // Check reached destination
      const currentDist = Math.hypot(m.currentX - m.startX, m.currentY - m.startY);
      if (currentDist >= dist) {
        m.active = false;
        createExplosion(m.endX, m.endY);
        
        // If enemy, check city hit
        if (m.isEnemy) {
          citiesRef.current.forEach(c => {
            if (c.active && 
                Math.abs(c.x + CITY_WIDTH / 2 - m.endX) < 30 &&
                Math.abs(c.y + CITY_HEIGHT / 2 - m.endY) < 20) {
              c.active = false;
            }
          });
        }
      }
    });

    // Update Explosions
    explosionsRef.current.forEach(e => {
      if (!e.active) return;
      
      if (e.growing) {
        e.radius += 1; // Expand speed
        if (e.radius >= e.maxRadius) e.growing = false;
      } else {
        e.radius -= 0.5; // Shrink speed
        if (e.radius <= 0) e.active = false;
      }
    });

    // Collisions: Explosion vs Enemy Missile
    explosionsRef.current.forEach(e => {
      if (!e.active) return;
      missilesRef.current.forEach(m => {
        if (!m.active || !m.isEnemy) return;
        
        const dist = Math.hypot(m.currentX - e.x, m.currentY - e.y);
        if (dist < e.radius) {
          m.active = false;
          setScore(s => s + 50);
          createExplosion(m.currentX, m.currentY); // Chain reaction
        }
      });
    });

    // Check Game Over
    if (citiesRef.current.every(c => !c.active)) {
      setGameState("GAME_OVER");
    }

    // Cleanup
    missilesRef.current = missilesRef.current.filter(m => m.active);
    explosionsRef.current = explosionsRef.current.filter(e => e.active);
    
    // Level Up logic (simplified: infinite play, getting harder)
    if (frameRef.current > 3000) { // Approx 50s per level
      frameRef.current = 0;
      setLevel(l => l + 1);
      // Refill ammo partially?
      setAmmo(a => a + 10);
      // Restore one city?
      const deadCity = citiesRef.current.find(c => !c.active);
      if (deadCity) deadCity.active = true;
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
      ground: isDark ? "#1e293b" : "#cbd5e1",
      city: isDark ? "#38bdf8" : "#0284c7",
      enemyTrail: isDark ? "#ef4444" : "#dc2626",
      playerTrail: isDark ? "#22c55e" : "#16a34a",
      explosion: isDark ? "#f59e0b" : "#d97706",
    };

    // Clear
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Ground
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

    // Draw Cities
    ctx.fillStyle = colors.city;
    citiesRef.current.forEach(c => {
      if (c.active) {
        ctx.fillRect(c.x, c.y, CITY_WIDTH, CITY_HEIGHT);
      }
    });

    // Draw Missiles
    missilesRef.current.forEach(m => {
      ctx.strokeStyle = m.isEnemy ? colors.enemyTrail : colors.playerTrail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.startX, m.startY);
      ctx.lineTo(m.currentX, m.currentY);
      ctx.stroke();
      
      // Warhead
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(m.currentX - 2, m.currentY - 2, 4, 4);
    });

    // Draw Explosions
    explosionsRef.current.forEach(e => {
      ctx.fillStyle = colors.explosion;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Draw UI
    ctx.fillStyle = colors.text;
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Ammo: ${ammo}`, CANVAS_WIDTH - 120, 30);
    ctx.fillText(`Level: ${level}`, CANVAS_WIDTH / 2 - 40, 30);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[800px] mx-auto aspect-[4/3] bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none"
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none cursor-crosshair"
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
export default function MissileCommandGame({
  title = "Missile Command Grid",
  description = "Protect your cities from incoming missile attacks.",
}: {
  title?: string;
  description?: string;
}) {
  const faqs = [
    {
      question: "How do I play?",
      answer: "Tap or click on the screen to fire a counter-missile. The explosion will destroy any enemy missiles it touches.",
    },
    {
      question: "Why can't I shoot?",
      answer: "You have limited ammo! Use your shots wisely. You get more ammo as you progress.",
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
            <strong>Missile Command Grid</strong> is a tactical defense game. 
            Enemy warheads are raining down on your six cities. You command the central defense battery.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Intercept:</strong> Click ahead of the incoming missiles to catch them in the explosion radius.</li>
            <li><strong>Chain Reactions:</strong> One explosion can destroy multiple missiles.</li>
            <li><strong>Conserve Ammo:</strong> You don't have infinite shots. Make them count.</li>
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
            <li><strong>Lead Your Targets:</strong> Missiles take time to travel. Aim where the enemy will be, not where they are.</li>
            <li><strong>Create Walls:</strong> Fire a line of explosions to create a defensive barrier.</li>
            <li><strong>Prioritize:</strong> Save the cities. Ignore missiles that are going to hit empty ground or already destroyed cities.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<MissileCommandBoard title={title} description={description} />}
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
