import React, { useEffect, useRef, useState, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "READY" | "PLAYING" | "GAME_OVER";

interface Dino {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  ducking: boolean;
  grounded: boolean;
  legFrame: number;
  legTimer: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus_single" | "cactus_double" | "ptero";
}

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

// ─── Audio helpers ────────────────────────────────────────────────────────────

function createAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playBeep(ctx: AudioContext | null, freq: number, duration: number, type: OscillatorType = "square") {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* silent */ }
}

// ─── Main Board ───────────────────────────────────────────────────────────────

function DinoRunBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState>("READY");
  const scoreRef = useRef(0);
  const hiRef = useRef(0);
  const speedRef = useRef(6);
  const distanceRef = useRef(0);
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTimeRef = useRef<number>(0);
  const nightRef = useRef(0); // 0=day, 1=night
  const cycleTimerRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const groundYRef = useRef(0);

  const [displayState, setDisplayState] = useState<GameState>("READY");
  const [displayScore, setDisplayScore] = useState(0);
  const [displayHi, setDisplayHi] = useState(0);

  // Dino state
  const dinoRef = useRef<Dino>({
    x: 0, y: 0, width: 0, height: 0, vy: 0, ducking: false, grounded: true,
    legFrame: 0, legTimer: 0,
  });

  // Obstacles
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstacleDistRef = useRef(300);
  const spawnedDistRef = useRef(0);

  // Canvas scale
  const scaleRef = useRef(1);

  const initGame = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.width / window.devicePixelRatio;
    const H = canvas.height / window.devicePixelRatio;
    const scale = scaleRef.current;

    groundYRef.current = H - 40 * scale;

    const dH = 50 * scale;
    const dW = 44 * scale;
    dinoRef.current = {
      x: 80 * scale,
      y: groundYRef.current - dH,
      width: dW,
      height: dH,
      vy: 0,
      ducking: false,
      grounded: true,
      legFrame: 0,
      legTimer: 0,
    };
    obstaclesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = 6 * scale;
    distanceRef.current = 0;
    spawnedDistRef.current = 0;
    nextObstacleDistRef.current = 250 * scale;
    nightRef.current = 0;
    cycleTimerRef.current = 0;
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (H * 0.55),
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
    }));
  }, []);

  const jump = useCallback(() => {
    const dino = dinoRef.current;
    if (!dino.grounded) return;
    dino.ducking = false;
    const scale = scaleRef.current;
    dino.vy = -18 * scale;
    dino.grounded = false;
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    playBeep(audioCtxRef.current, 660, 0.12);
  }, []);

  const duck = useCallback((active: boolean) => {
    const dino = dinoRef.current;
    if (!dino.grounded) return;
    dino.ducking = active;
    const scale = scaleRef.current;
    dino.height = active ? 28 * scale : 50 * scale;
    dino.y = groundYRef.current - dino.height;
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx();
    initGame(canvas);
    stateRef.current = "PLAYING";
    setDisplayState("PLAYING");
    lastTimeRef.current = performance.now();
  }, [initGame]);

  const endGame = useCallback(() => {
    stateRef.current = "GAME_OVER";
    setDisplayState("GAME_OVER");
    const s = scoreRef.current;
    if (s > hiRef.current) {
      hiRef.current = s;
      setDisplayHi(s);
      try { localStorage.setItem("dino-run-highscore", String(s)); } catch { /* ignore */ }
    }
    playBeep(audioCtxRef.current, 200, 0.3, "sawtooth");
  }, []);

  // ─── Draw helpers ────────────────────────────────────────────────────────────

  function drawDino(ctx: CanvasRenderingContext2D, dino: Dino, isDark: boolean) {
    const { x, y, width: W, height: H, ducking, legFrame } = dino;
    const col = isDark ? "#e7e7e7" : "#535353";
    const eyeCol = isDark ? "#111" : "#fff";
    ctx.fillStyle = col;

    if (ducking) {
      // Body
      ctx.fillRect(x, y + H * 0.15, W, H * 0.6);
      // Head
      ctx.fillRect(x + W * 0.55, y, W * 0.45, H * 0.5);
      // Eye
      ctx.fillStyle = eyeCol;
      ctx.fillRect(x + W * 0.88, y + H * 0.08, W * 0.08, W * 0.08);
      ctx.fillStyle = col;
      // Legs
      const lw = W * 0.15;
      ctx.fillRect(x + W * 0.2, y + H * 0.7, lw, H * 0.3);
      ctx.fillRect(x + W * 0.45, y + H * 0.7, lw, H * 0.3);
    } else {
      // Body
      ctx.fillRect(x + W * 0.1, y + H * 0.12, W * 0.8, H * 0.55);
      // Neck + head
      ctx.fillRect(x + W * 0.45, y, W * 0.5, H * 0.35);
      // Jaw
      ctx.fillRect(x + W * 0.5, y + H * 0.25, W * 0.48, H * 0.12);
      // Eye
      ctx.fillStyle = eyeCol;
      ctx.fillRect(x + W * 0.78, y + H * 0.05, W * 0.1, W * 0.1);
      ctx.fillStyle = col;
      // Arm stub
      ctx.fillRect(x + W * 0.55, y + H * 0.45, W * 0.12, H * 0.12);
      // Tail
      ctx.fillRect(x, y + H * 0.45, W * 0.18, H * 0.1);
      // Legs
      const lw = W * 0.17;
      const lh = H * 0.32;
      const legAnim = legFrame === 0 ? 0 : H * 0.1;
      ctx.fillRect(x + W * 0.25, y + H * 0.63, lw, lh - legAnim);
      ctx.fillRect(x + W * 0.52, y + H * 0.63 + legAnim, lw, lh - legAnim);
    }
  }

  function drawCactus(ctx: CanvasRenderingContext2D, obs: Obstacle, isDark: boolean) {
    const col = isDark ? "#4ade80" : "#535353";
    ctx.fillStyle = col;
    const { x, y, width: W, height: H } = obs;
    if (obs.type === "cactus_single") {
      // Stem
      ctx.fillRect(x + W * 0.35, y, W * 0.3, H);
      // Left arm
      ctx.fillRect(x, y + H * 0.3, W * 0.38, H * 0.18);
      ctx.fillRect(x, y + H * 0.15, W * 0.12, H * 0.32);
      // Right arm
      ctx.fillRect(x + W * 0.62, y + H * 0.4, W * 0.38, H * 0.18);
      ctx.fillRect(x + W * 0.88, y + H * 0.25, W * 0.12, H * 0.32);
    } else {
      // Double cactus: two cacti side by side
      const half = W / 2;
      ctx.fillRect(x + half * 0.35, y, half * 0.3, H);
      ctx.fillRect(x, y + H * 0.35, half * 0.38, H * 0.16);
      ctx.fillRect(x, y + H * 0.2, half * 0.12, H * 0.28);
      ctx.fillRect(x + half, y + half * 0.35, half * 0.3, H * 0.95);
      ctx.fillRect(x + half, y + H * 0.4, half * 0.38, H * 0.16);
      ctx.fillRect(x + half * 1.88, y + H * 0.22, half * 0.12, H * 0.28);
    }
  }

  function drawPtero(ctx: CanvasRenderingContext2D, obs: Obstacle, isDark: boolean) {
    const col = isDark ? "#c084fc" : "#535353";
    ctx.fillStyle = col;
    const { x, y, width: W, height: H } = obs;
    const frame = Math.floor(performance.now() / 200) % 2;
    // Body
    ctx.fillRect(x + W * 0.3, y + H * 0.3, W * 0.4, H * 0.4);
    // Head
    ctx.fillRect(x + W * 0.65, y + H * 0.1, W * 0.28, H * 0.35);
    // Beak
    ctx.fillRect(x + W * 0.9, y + H * 0.18, W * 0.1, H * 0.1);
    // Wing up or down
    if (frame === 0) {
      ctx.fillRect(x, y, W * 0.35, H * 0.2);
      ctx.fillRect(x + W * 0.65, y, W * 0.35, H * 0.2);
    } else {
      ctx.fillRect(x, y + H * 0.4, W * 0.35, H * 0.2);
      ctx.fillRect(x + W * 0.65, y + H * 0.4, W * 0.35, H * 0.2);
    }
  }

  // ─── Game loop ────────────────────────────────────────────────────────────────

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const scale = scaleRef.current;

    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;
    const dtFactor = dt / 16.67;

    // Background color from day/night cycle
    const nightFrac = nightRef.current;
    const bgDay = { r: 247, g: 247, b: 247 };
    const bgNight = { r: 20, g: 24, b: 40 };
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    const bgR = Math.round(lerp(bgDay.r, bgNight.r, nightFrac));
    const bgG = Math.round(lerp(bgDay.g, bgNight.g, nightFrac));
    const bgB = Math.round(lerp(bgDay.b, bgNight.b, nightFrac));
    const isDark = nightFrac > 0.5;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
    ctx.fillRect(0, 0, W, H);

    if (stateRef.current === "PLAYING") {
      // Update cycle
      cycleTimerRef.current += dt;
      const cycleLen = 15000;
      const t = (cycleTimerRef.current % (cycleLen * 2)) / cycleLen;
      nightRef.current = t < 1 ? t : 2 - t;

      const spd = speedRef.current;

      // Stars (night)
      if (nightRef.current > 0.1) {
        starsRef.current.forEach(star => {
          ctx.globalAlpha = star.alpha * nightRef.current;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Ground
      ctx.strokeStyle = isDark ? "#4b5563" : "#535353";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, groundYRef.current + dinoRef.current.height);
      ctx.lineTo(W, groundYRef.current + dinoRef.current.height);
      ctx.stroke();

      // Ground pebbles
      ctx.fillStyle = isDark ? "#374151" : "#aaa";
      for (let i = 0; i < 8; i++) {
        const px = ((i * 140 * scale) - (distanceRef.current * 0.3) % (W + 100)) % W;
        ctx.fillRect(px, groundYRef.current + dinoRef.current.height + 3 * scale, 4 * scale, 2 * scale);
      }

      // Update dino
      const dino = dinoRef.current;
      const gravity = 1.1 * scale;
      dino.vy += gravity * dtFactor;
      dino.y += dino.vy * dtFactor;

      if (dino.y >= groundYRef.current - dino.height) {
        dino.y = groundYRef.current - dino.height;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Leg animation
      dino.legTimer += dt;
      if (dino.legTimer > 180) {
        dino.legFrame = (dino.legFrame + 1) % 2;
        dino.legTimer = 0;
      }

      // Spawn obstacles
      spawnedDistRef.current += spd * dtFactor;
      if (spawnedDistRef.current >= nextObstacleDistRef.current) {
        spawnedDistRef.current = 0;
        const rng = Math.random();
        let type: Obstacle["type"];
        const isPtero = rng > 0.65;
        if (isPtero) {
          type = "ptero";
        } else if (rng > 0.35) {
          type = "cactus_double";
        } else {
          type = "cactus_single";
        }

        let obsH: number, obsW: number, obsY: number;
        if (type === "ptero") {
          obsW = 46 * scale; obsH = 36 * scale;
          const pteroHeights = [groundYRef.current - 70 * scale, groundYRef.current - 110 * scale];
          obsY = pteroHeights[Math.floor(Math.random() * pteroHeights.length)];
        } else if (type === "cactus_single") {
          obsW = 28 * scale; obsH = 56 * scale;
          obsY = groundYRef.current - obsH;
        } else {
          obsW = 56 * scale; obsH = 52 * scale;
          obsY = groundYRef.current - obsH;
        }

        obstaclesRef.current.push({ x: W + 20, y: obsY, width: obsW, height: obsH, type });
        const gap = lerp(220, 400, Math.random()) * scale;
        const speedBonus = Math.max(0, (speedRef.current / scale - 6) * 10);
        nextObstacleDistRef.current = Math.max(180 * scale, gap - speedBonus * scale);
      }

      // Move + draw obstacles, check collision
      const margin = 6 * scale;
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.x -= spd * dtFactor;

        // Collision
        const dx = obs.x + margin;
        const dy = obs.y + margin;
        const dw = obs.width - margin * 2;
        const dh = obs.height - margin * 2;
        const dinoHit = (
          dino.x + margin < dx + dw &&
          dino.x + dino.width - margin > dx &&
          dino.y + margin < dy + dh &&
          dino.y + dino.height - margin > dy
        );
        if (dinoHit) {
          endGame();
          return false;
        }

        if (obs.type === "ptero") drawPtero(ctx, obs, isDark);
        else drawCactus(ctx, obs, isDark);

        return obs.x + obs.width > -10;
      });

      // Draw dino
      drawDino(ctx, dino, isDark);

      // Score
      distanceRef.current += spd * dtFactor;
      scoreRef.current = Math.floor(distanceRef.current / (5 * scale));
      setDisplayScore(scoreRef.current);

      // Speed increase
      speedRef.current = (6 + scoreRef.current / 200) * scale;

      // HUD
      const hiScore = Math.max(hiRef.current, scoreRef.current);
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)";
      ctx.font = `bold ${13 * scale}px monospace`;
      ctx.textAlign = "right";
      ctx.fillText(`HI ${String(hiScore).padStart(5, "0")}`, W - 10 * scale, 28 * scale);
      ctx.fillText(String(scoreRef.current).padStart(5, "0"), W - 80 * scale, 28 * scale);
      ctx.textAlign = "left";

    } else {
      // Stars always show on non-playing states
      starsRef.current.forEach(star => {
        ctx.globalAlpha = star.alpha * 0.3;
        ctx.fillStyle = isDark ? "#fff" : "#999";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Ground
      ctx.strokeStyle = "#535353";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, groundYRef.current + dinoRef.current.height);
      ctx.lineTo(W, groundYRef.current + dinoRef.current.height);
      ctx.stroke();

      // Draw idle dino
      drawDino(ctx, dinoRef.current, false);

      // Message
      ctx.fillStyle = "#535353";
      ctx.font = `bold ${16 * scale}px monospace`;
      ctx.textAlign = "center";
      if (stateRef.current === "READY") {
        ctx.fillText("Press SPACE or TAP to Start", W / 2, H / 2 - 20 * scale);
      } else {
        ctx.fillText("GAME OVER", W / 2, H / 2 - 40 * scale);
        ctx.font = `${13 * scale}px monospace`;
        ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 - 10 * scale);
        ctx.fillText("Press SPACE or TAP to Restart", W / 2, H / 2 + 20 * scale);
      }
      ctx.textAlign = "left";
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [endGame]);

  // ─── Setup ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Load high score
    try {
      const saved = localStorage.getItem("dino-run-highscore");
      if (saved) { hiRef.current = parseInt(saved, 10); setDisplayHi(hiRef.current); }
    } catch { /* ignore */ }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    function resize() {
      const c = canvasRef.current;
      const cont = containerRef.current;
      if (!c || !cont) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cW = cont.clientWidth;
      const cH = Math.max(180, Math.min(280, cW * 0.38));
      scaleRef.current = cW / 600;
      c.width = cW * dpr;
      c.height = cH * dpr;
      c.style.width = `${cW}px`;
      c.style.height = `${cH}px`;
      if (stateRef.current !== "PLAYING") {
        const canvas2 = canvasRef.current;
        if (canvas2) initGame(canvas2);
      } else {
        // Re-init to rescale
        initGame(c);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop, initGame]);

  // ─── Input handling ───────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (stateRef.current === "READY" || stateRef.current === "GAME_OVER") startGame();
        else jump();
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        if (stateRef.current === "PLAYING") duck(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") duck(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame, jump, duck]);

  // Touch handlers
  const touchStartRef = useRef<{ y: number; t: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { y: touch.clientY, t: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.t;
    touchStartRef.current = null;

    if (stateRef.current === "READY" || stateRef.current === "GAME_OVER") {
      startGame();
      return;
    }
    if (dy > 30 && dt < 400) {
      duck(true);
      setTimeout(() => duck(false), 400);
    } else {
      jump();
    }
  }, [startGame, jump, duck]);

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Score display */}
      <div className="flex items-center justify-between px-2">
        <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">
          Score: <span className="text-slate-900 dark:text-white">{displayScore}</span>
        </span>
        <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">
          Best: <span className="text-amber-500">{Math.max(displayHi, displayScore)}</span>
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (stateRef.current === "READY" || stateRef.current === "GAME_OVER") startGame();
          else jump();
        }}
      >
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Mobile controls */}
      <div className="flex gap-3 justify-center sm:hidden">
        <button
          onTouchStart={(e) => { e.preventDefault(); if (stateRef.current === "READY" || stateRef.current === "GAME_OVER") startGame(); else jump(); }}
          className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg active:bg-indigo-700"
        >
          Jump
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); duck(true); }}
          onTouchEnd={(e) => { e.preventDefault(); duck(false); }}
          className="flex-1 py-4 rounded-xl bg-slate-600 text-white font-bold text-lg active:bg-slate-700"
        >
          Duck
        </button>
      </div>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
        {displayState === "PLAYING"
          ? "SPACE / ArrowUp = Jump · ArrowDown = Duck"
          : displayState === "GAME_OVER"
          ? `Game Over! Score: ${displayScore} — Press SPACE or tap to restart`
          : "Press SPACE or tap to start running!"}
      </p>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function DinoRunGame({
  title = "Dino Run 3D",
  description = "The endless runner — jump over cacti, dodge pterodactyls, and survive as long as possible. How far can you go?",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-extrabold mb-4">How to Play</h2>
        <p className="mb-4">
          Dino Run is an endless runner where your pixelated dinosaur sprints automatically. Your only job is to keep it alive by
          jumping over ground obstacles and ducking under flying pterodactyls.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Start:</strong> Press <kbd>Space</kbd> / <kbd>↑</kbd> on desktop, or tap the canvas on mobile.</li>
          <li><strong>Jump:</strong> <kbd>Space</kbd> or <kbd>↑</kbd> — arc over cacti and low pterodactyls.</li>
          <li><strong>Duck:</strong> <kbd>↓</kbd> — shrink under high-flying pterodactyls while still running.</li>
          <li><strong>Touch:</strong> Swipe up to jump, swipe down to duck; or use the on-screen Jump/Duck buttons.</li>
          <li><strong>Speed:</strong> The game gradually accelerates the longer you survive, making timing harder.</li>
        </ul>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-extrabold mb-4">Tips for a High Score</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Short jumps:</strong> Tap quickly for a low arc over single cacti — you land faster and are ready for the next obstacle.</li>
          <li><strong>Watch the horizon:</strong> Pterodactyls appear at two heights. A low pterodactyl requires jumping; a high one just means duck.</li>
          <li><strong>Stay calm at high speed:</strong> Obstacles start spawning closer together after score 500. Relax and react early.</li>
          <li><strong>Day/Night cycles:</strong> The background gradually darkens, then lightens — pure style, not a trap.</li>
          <li><strong>Double cacti:</strong> These are wider. Jump early and land cleanly.</li>
          <li><strong>High score is saved:</strong> Your best run is stored locally so you can always chase your record.</li>
        </ul>
      </section>

      <section id="history">
        <h2 className="text-2xl font-extrabold mb-4">The Chrome Dino — A Brief History</h2>
        <p className="mb-4">
          Google's "Dinosaur Game" (internally called "Project Bolan" after Marc Bolan of T. Rex) debuted in Chrome 35 in 2014. Originally a simple
          Easter egg that appeared on the "No Internet" error page, it became one of the most-played browser games in the world — with an estimated
          270 million plays per month at its peak.
        </p>
        <p>
          The game was designed by Chrome UX designer Sebastien Gabriel. The pixel-art style was chosen to evoke the prehistoric era — a metaphor for
          being "offline" and out of the digital age. Over the years Google added pterodactyls, a day/night cycle, and a hidden maximum score of 99,999.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-extrabold mb-4">FAQ</h2>
        <div className="space-y-4">
          <div>
            <p className="font-bold">Is my high score saved?</p>
            <p>Yes — your best score is stored in your browser's localStorage under the key <code>dino-run-highscore</code>. It persists between sessions.</p>
          </div>
          <div>
            <p className="font-bold">Does the game get faster?</p>
            <p>Yes. Speed increases gradually as your score grows, making obstacle timing progressively harder.</p>
          </div>
          <div>
            <p className="font-bold">Can I play on mobile?</p>
            <p>Absolutely. Tap to jump, swipe down to duck, or use the on-screen Jump/Duck buttons for full touch support.</p>
          </div>
          <div>
            <p className="font-bold">What do the day/night cycles do?</p>
            <p>They are purely visual — the background transitions from light gray (day) to deep navy (night) and back every 15 seconds, adding atmosphere without affecting gameplay.</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<DinoRunBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips for High Score" },
        { id: "history", label: "Chrome Dino History" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
      contentMaxWidth="max-w-3xl"
    />
  );
}
