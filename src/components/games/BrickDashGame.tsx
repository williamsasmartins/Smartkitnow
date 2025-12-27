import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "../ui/button";
import { Play, RotateCcw, Pause, Maximize, Minimize } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";

// Game Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500; // Reduced height to fit better
const PLAYER_SIZE = 30;
const OBSTACLE_HEIGHT = 20;

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_SETTINGS = {
  easy: { speed: 3, spawnRate: 1800 },
  medium: { speed: 5, spawnRate: 1400 },
  hard: { speed: 7, spawnRate: 1000 },
};

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  passed: boolean;
}

export default function BrickDashGame({
  title = "Brick Dash",
  description = "Dodge the falling bricks! fast-paced arcade action.",
}: {
  title?: string;
  description?: string;
}) {
  // Game State
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU");
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for game loop
  const gameLoopRef = useRef<{
    playerX: number;
    obstacles: Obstacle[];
    lastSpawnTime: number;
    speed: number;
    spawnRate: number;
    score: number;
    keys: { left: false; right: false };
    touchX: number | null;
  }>({
    playerX: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
    obstacles: [],
    lastSpawnTime: 0,
    speed: DIFFICULTY_SETTINGS.medium.speed,
    spawnRate: DIFFICULTY_SETTINGS.medium.spawnRate,
    score: 0,
    keys: { left: false, right: false },
    touchX: null,
  });

  const requestRef = useRef<number>();

  // Initialize Game
  const initGame = (diff: Difficulty) => {
    setDifficulty(diff);
    const settings = DIFFICULTY_SETTINGS[diff];
    
    gameLoopRef.current = {
      playerX: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
      obstacles: [],
      lastSpawnTime: performance.now(),
      speed: settings.speed,
      spawnRate: settings.spawnRate,
      score: 0,
      keys: { left: false, right: false },
      touchX: null,
    };
    
    setScore(0);
    setIsPaused(false);
    setGameState("PLAYING");
  };

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
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
         // In fullscreen, we might want to scale up differently
         // For now, let's keep the aspect ratio logic simple or rely on CSS object-contain
         // The CSS class `object-contain` on the canvas handles the visual scaling nicely.
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Game Loop
  const update = useCallback((time: number) => {
    if (gameState !== "PLAYING" || isPaused) {
       requestRef.current = requestAnimationFrame(update);
       return;
    }

    const state = gameLoopRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Background
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    // Vertical lines
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    // Horizontal lines (moving)
    for (let i = (time * state.speed * 0.1) % 40; i < CANVAS_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Move Player
    const moveSpeed = 5 + (state.speed * 0.5); // Player speed scales slightly with game speed
    if (state.keys.left && state.playerX > 0) {
      state.playerX -= moveSpeed;
    }
    if (state.keys.right && state.playerX < CANVAS_WIDTH - PLAYER_SIZE) {
      state.playerX += moveSpeed;
    }
    
    // Touch movement
    if (state.touchX !== null) {
      const targetX = state.touchX - PLAYER_SIZE / 2;
      const dx = targetX - state.playerX;
      if (Math.abs(dx) > moveSpeed) {
        state.playerX += Math.sign(dx) * moveSpeed;
      } else {
        state.playerX = targetX;
      }
      state.playerX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, state.playerX));
    }

    // Spawn Obstacles
    if (time - state.lastSpawnTime > state.spawnRate) {
      const gapWidth = PLAYER_SIZE * 3; // Slightly wider gap
      const gapX = Math.random() * (CANVAS_WIDTH - gapWidth);
      
      if (gapX > 0) {
        state.obstacles.push({
          x: 0,
          y: -OBSTACLE_HEIGHT,
          width: gapX,
          height: OBSTACLE_HEIGHT,
          color: "#ef4444", // Red
          passed: false,
        });
      }
      if (gapX + gapWidth < CANVAS_WIDTH) {
        state.obstacles.push({
          x: gapX + gapWidth,
          y: -OBSTACLE_HEIGHT,
          width: CANVAS_WIDTH - (gapX + gapWidth),
          height: OBSTACLE_HEIGHT,
          color: "#ef4444",
          passed: false,
        });
      }

      state.lastSpawnTime = time;
      
      // Progressive Difficulty
      // Cap speed at 12
      if (state.speed < 12) state.speed += 0.05;
      // Cap spawn rate at 400ms
      if (state.spawnRate > 400) state.spawnRate -= 5;
    }

    // Update Obstacles
    state.obstacles.forEach((obs) => {
      obs.y += state.speed;
    });

    // Remove off-screen obstacles
    state.obstacles = state.obstacles.filter((obs) => obs.y < CANVAS_HEIGHT);

    // Collision & Scoring
    const playerRect = {
      x: state.playerX,
      y: CANVAS_HEIGHT - PLAYER_SIZE - 20,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };

    let hit = false;
    state.obstacles.forEach((obs) => {
      if (
        playerRect.x < obs.x + obs.width &&
        playerRect.x + playerRect.width > obs.x &&
        playerRect.y < obs.y + obs.height &&
        playerRect.y + playerRect.height > obs.y
      ) {
        hit = true;
      }
    });

    // Score based on time/survival
    state.score += 1;
    if (state.score % 10 === 0) {
       setScore(Math.floor(state.score / 10));
    }
    
    if (hit) {
      setGameState("GAME_OVER");
      if (Math.floor(state.score / 10) > highScore) {
        setHighScore(Math.floor(state.score / 10));
        localStorage.setItem("brick-dash-highscore", Math.floor(state.score / 10).toString());
      }
      return;
    }

    // Draw Player
    ctx.fillStyle = "#22c55e"; // Green
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#22c55e";
    ctx.fillRect(playerRect.x, playerRect.y, playerRect.width, playerRect.height);
    ctx.shadowBlur = 0;

    // Draw Obstacles
    state.obstacles.forEach((obs) => {
      ctx.fillStyle = obs.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, isPaused, highScore]);

  useEffect(() => {
    const saved = localStorage.getItem("brick-dash-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;
      if (e.key === "ArrowLeft") gameLoopRef.current.keys.left = true;
      if (e.key === "ArrowRight") gameLoopRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") gameLoopRef.current.keys.left = false;
      if (e.key === "ArrowRight") gameLoopRef.current.keys.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Touch Handling
  const handleTouch = (e: React.TouchEvent) => {
    if (gameState !== "PLAYING") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = CANVAS_WIDTH / rect.width;
    gameLoopRef.current.touchX = (touch.clientX - rect.left) * scaleX;
  };
  
  const handleTouchEnd = () => {
    gameLoopRef.current.touchX = null;
  };

  // SEO Content
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I play Brick Dash?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the Left and Right Arrow keys or touch and drag on the screen to move your neon block. Avoid the falling red bricks and survive as long as possible to achieve a high score."
        }
      },
      {
        "@type": "Question",
        "name": "Does the game get harder?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! As you survive longer, the bricks fall faster and the gaps become trickier to navigate, testing your reflexes."
        }
      }
    ]
  };

  const editorialContent = (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      <section id="guide">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">How to Play</h3>
        <p>
          Brick Dash is a fast-paced infinite runner. You control a neon block at the bottom of the screen.
          Your goal is to dodge the relentless waves of falling red bricks.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Move Left/Right:</strong> Use Arrow Keys or Swipe/Drag on screen.</li>
          <li><strong>Dodge:</strong> Don't let the red bricks touch you.</li>
          <li><strong>Score:</strong> Survive longer to increase your score.</li>
        </ul>
      </section>

      <section id="tips">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Tips & Strategies</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Look Ahead:</strong> Don't just watch your block; scan the top of the screen to anticipate upcoming gaps.</li>
          <li><strong>Stay Central:</strong> Whenever possible, try to return to the center. It gives you equal opportunity to move left or right quickly.</li>
          <li><strong>Smooth Movements:</strong> Sudden jerks might make you overshoot. Keep your movements controlled.</li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {/* Game Stats Bar */}
          <div className="flex justify-between w-full mb-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-bold">Score</span>
              <span className="text-xl font-bold font-mono text-primary">{score}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 uppercase font-bold">High Score</span>
              <span className="text-xl font-bold font-mono text-yellow-600">{highScore}</span>
            </div>
          </div>

          {/* Canvas Container */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-[4/5] bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800 group"
          >
             <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-full object-contain cursor-crosshair touch-none"
              onTouchStart={handleTouch}
              onTouchMove={handleTouch}
              onTouchEnd={handleTouchEnd}
            />
            
            {/* Start/Game Over Overlay */}
            <GameStartOverlay
              isPlaying={gameState === "PLAYING"}
              isGameOver={gameState === "GAME_OVER"}
              score={score}
              highScore={highScore}
              onStart={initGame}
              onRestart={initGame}
              gameName="Brick Dash"
            />
            
            {/* Pause Overlay */}
            {isPaused && gameState === "PLAYING" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-4 neon-text">PAUSED</h2>
                  <Button 
                    onClick={() => setIsPaused(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all hover:scale-105"
                  >
                    <Play className="mr-2 h-6 w-6" /> RESUME
                  </Button>
                </div>
              </div>
            )}

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white/50 hover:text-white hover:bg-white/20 z-10"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
          </div>

          {/* Controls */}
          <div className="w-full mt-4 grid grid-cols-2 gap-2">
             <Button
              variant={gameState === "PLAYING" && !isPaused ? "secondary" : "default"}
              onClick={() => {
                if (gameState === "MENU" || gameState === "GAME_OVER") {
                    // Trigger default start
                    initGame(difficulty); 
                } else {
                    setIsPaused(!isPaused);
                }
              }}
              className="w-full"
              disabled={gameState !== "PLAYING" && gameState !== "MENU"} // Disable if game over (must use overlay)
            >
              {gameState === "PLAYING" && !isPaused ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> {gameState === "PLAYING" ? "Resume" : "Start"}</>}
            </Button>
            <Button variant="outline" onClick={() => initGame(difficulty)} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          
           {/* Mobile Controls Hint */}
           <div className="mt-2 text-xs text-gray-500 text-center">
             Touch and drag to move • Keyboard arrows supported
           </div>
        </div>
      }
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
