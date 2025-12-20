import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  Palette,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Pause,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import StartOverlay from "./StartOverlay";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "idle" | "ready" | "playing" | "paused" | "over" | "won";

type ThemeKey = "neon" | "aurora" | "ember" | "mono" | "solar";

type Vec = { x: number; y: number };

type Ball = {
  id: number;
  pos: Vec;
  vel: Vec;
  r: number;
  speed: number;
};

type Paddle = {
  x: number; // center x in world units
  y: number;
  w: number;
  h: number;
};

type Brick = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number; // 1..3
  solid?: boolean; // indestructible
  colorIndex: number;
};

type PowerUpType = "expand" | "multiball" | "slow" | "life";
type PowerUp = {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  vy: number;
  size: number;
};

const THEMES: Record<
  ThemeKey,
  {
    name: string;
    bgA: string;
    bgB: string;
    grid: string;
    star: string;
    ball: string;
    paddleA: string;
    paddleB: string;
    brick: string[];
    accent: string;
  }
> = {
  neon: {
    name: "Neon",
    bgA: "#050b17",
    bgB: "#0b1b3a",
    grid: "rgba(92,130,238,0.08)",
    star: "rgba(203,213,225,0.8)",
    ball: "#f59e0b",
    paddleA: "#5c82ee",
    paddleB: "#a855f7",
    brick: ["#5c82ee", "#a855f7", "#f59e0b", "#22c55e", "#06b6d4"],
    accent: "#5c82ee",
  },
  aurora: {
    name: "Aurora",
    bgA: "#04111a",
    bgB: "#0b2a2d",
    grid: "rgba(34,197,94,0.08)",
    star: "rgba(226,232,240,0.75)",
    ball: "#22c55e",
    paddleA: "#06b6d4",
    paddleB: "#22c55e",
    brick: ["#22c55e", "#06b6d4", "#a855f7", "#5c82ee", "#f59e0b"],
    accent: "#22c55e",
  },
  ember: {
    name: "Ember",
    bgA: "#12060a",
    bgB: "#2a0f14",
    grid: "rgba(244,63,94,0.10)",
    star: "rgba(253,230,138,0.8)",
    ball: "#f97316",
    paddleA: "#ef4444",
    paddleB: "#f97316",
    brick: ["#ef4444", "#f97316", "#f59e0b", "#a855f7", "#5c82ee"],
    accent: "#f97316",
  },
  mono: {
    name: "Mono",
    bgA: "#070a10",
    bgB: "#111827",
    grid: "rgba(148,163,184,0.10)",
    star: "rgba(226,232,240,0.65)",
    ball: "#e2e8f0",
    paddleA: "#94a3b8",
    paddleB: "#e2e8f0",
    brick: ["#94a3b8", "#cbd5e1", "#64748b", "#e2e8f0", "#475569"],
    accent: "#cbd5e1",
  },
  solar: {
    name: "Solar",
    bgA: "#0a0b18",
    bgB: "#151b3a",
    grid: "rgba(250,204,21,0.10)",
    star: "rgba(250,204,21,0.75)",
    ball: "#facc15",
    paddleA: "#f59e0b",
    paddleB: "#facc15",
    brick: ["#facc15", "#f59e0b", "#a855f7", "#5c82ee", "#22c55e"],
    accent: "#facc15",
  },
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function nowMs() {
  return performance.now();
}

// Safer roundRect helper (avoids relying on ctx.roundRect support)
function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function hasFullscreenAPI(el: HTMLElement | null) {
  return !!el && typeof (el as any).requestFullscreen === "function";
}

export default function AstroBreakout({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Astro Breakout";
  const pageDescription =
    description ??
    "A premium Breakout experience: power-ups, multi-ball, smooth physics, mobile controls, and a full-screen theater mode. Break all bricks to win.";

  // UI states
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [state, setState] = useState<GameState>("idle");
  const [muted, setMuted] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("skn_astro_breakout_theme") : null;
    return (saved as ThemeKey) || "neon";
  });

  const theme = THEMES[themeKey];

  // “Closeable” start overlay (user can dismiss)
  const [startOverlayOpen, setStartOverlayOpen] = useState(true);

  // Fullscreen: use native API when available; otherwise “theater mode” (CSS fixed overlay)
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [theater, setTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const immersive = theater || isFullscreen;

  // World sizing
  // We run physics in “world units” where the playfield width is fixed, then scale to canvas.
  // This keeps the game consistent while still filling the available space.
  const WORLD_W = 960; // world width
  const WORLD_H = 540; // base world height (scaled on canvas)
  const PADDLE_Y = 500;

  // Refs for game data (avoid React re-render every frame)
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const scaleRef = useRef<number>(1);
  const canvasSizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });

  const nextIdRef = useRef<number>(1);

  const paddleRef = useRef<Paddle>({
    x: WORLD_W / 2,
    y: PADDLE_Y,
    w: 150,
    h: 18,
  });

  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const livesRef = useRef<number>(3);
  const scoreRef = useRef<number>(0);
  const levelRef = useRef<number>(1);

  const slowUntilRef = useRef<number>(0);

  // HUD state for React (updated occasionally)
  const [hud, setHud] = useState(() => ({
    score: 0,
    lives: 3,
    level: 1,
    combo: 0,
    status: "Ready",
  }));
  const comboRef = useRef<number>(0);
  const lastBrickHitAtRef = useRef<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const difficultyCfg = useMemo(() => {
    if (difficulty === "easy") {
      return { paddleW: 170, ballSpeed: 360, brickHPBias: 0, powerChance: 0.18 };
    }
    if (difficulty === "hard") {
      return { paddleW: 130, ballSpeed: 460, brickHPBias: 1, powerChance: 0.12 };
    }
    return { paddleW: 150, ballSpeed: 410, brickHPBias: 0, powerChance: 0.15 };
  }, [difficulty]);

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!haptics) return;
      if (typeof navigator === "undefined") return;
      if (typeof navigator.vibrate !== "function") return;
      navigator.vibrate(pattern);
    },
    [haptics]
  );

  const playTone = useCallback(
    (freq: number, ms: number, type: OscillatorType = "sine", gain = 0.12) => {
      if (muted) return;
      try {
        const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
        const ctx = audioCtxRef.current ?? new Ctx();
        audioCtxRef.current = ctx;
        if (ctx.state === "suspended" && ctx.resume) ctx.resume();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        const t0 = ctx.currentTime;
        g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
        o.stop(t0 + ms / 1000);
      } catch {
        // ignore audio errors (autoplay policies, etc.)
      }
    },
    [muted]
  );

  const setHudSafe = useCallback(() => {
    setHud({
      score: scoreRef.current,
      lives: livesRef.current,
      level: levelRef.current,
      combo: comboRef.current,
      status:
        state === "playing"
          ? "Playing"
          : state === "paused"
            ? "Paused"
            : state === "won"
              ? "You won!"
              : state === "over"
                ? "Game over"
                : "Ready",
    });
  }, [state]);

  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Available space
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const wrapW = wrap.clientWidth || vw;
    const wrapH = wrap.clientHeight || vh;

    // In normal mode, keep it large but within layout.
    // In immersive mode, fill the viewport.
    const maxW = immersive ? vw : Math.min(1100, wrapW);
    const maxH = immersive ? Math.floor(vh * 0.88) : Math.min(720, Math.floor(vh * 0.62));

    // Keep 16:9 playfield feel
    const targetAspect = WORLD_W / WORLD_H;

    let w = maxW;
    let h = Math.floor(w / targetAspect);

    if (h > maxH) {
      h = maxH;
      w = Math.floor(h * targetAspect);
    }

    w = Math.max(320, w);
    h = Math.max(220, h);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    canvasSizeRef.current = { w, h, dpr };
    scaleRef.current = w / WORLD_W;
  }, [immersive]);

  const resetBallToPaddle = useCallback(() => {
    const paddle = paddleRef.current;
    const speed = difficultyCfg.ballSpeed;
    const ball: Ball = {
      id: nextIdRef.current++,
      pos: { x: paddle.x, y: paddle.y - 26 },
      vel: { x: 0, y: 0 },
      r: 9,
      speed,
    };
    ballsRef.current = [ball];
  }, [difficultyCfg.ballSpeed]);

  const buildLevel = useCallback(() => {
    const level = levelRef.current;
    const cols = 12;
    const rows = 7;

    const marginX = 60;
    const topY = 70;
    const gap = 8;

    const totalW = WORLD_W - marginX * 2;
    const brickW = Math.floor((totalW - gap * (cols - 1)) / cols);
    const brickH = 22;

    const bricks: Brick[] = [];
    let id = 1;

    // Patterns vary by level
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginX + c * (brickW + gap);
        const y = topY + r * (brickH + gap);

        // some gaps for variety
        const hole =
          (level % 2 === 0 && (c === 5 || c === 6) && r === 2) ||
          (level % 3 === 0 && (c === 0 || c === cols - 1) && r < 2);

        if (hole) continue;

        const baseHp = 1 + Math.floor(r / 3);
        const hp = clamp(baseHp + difficultyCfg.brickHPBias, 1, 3);

        // a few indestructible “asteroids” on higher levels
        const solid =
          level >= 4 && ((r === 0 && (c === 2 || c === 9)) || (r === 3 && (c === 1 || c === 10)));

        bricks.push({
          id: id++,
          x,
          y,
          w: brickW,
          h: brickH,
          hp: solid ? 999 : hp,
          solid,
          colorIndex: (r + c) % theme.brick.length,
        });
      }
    }

    bricksRef.current = bricks;
    powerupsRef.current = [];
    comboRef.current = 0;
    lastBrickHitAtRef.current = 0;

    // Paddle & ball setup
    paddleRef.current.w = difficultyCfg.paddleW;
    paddleRef.current.x = WORLD_W / 2;
    paddleRef.current.y = PADDLE_Y;

    resetBallToPaddle();
  }, [difficultyCfg.brickHPBias, difficultyCfg.paddleW, resetBallToPaddle, theme.brick.length]);

  const hardReset = useCallback(
    (nextDifficulty?: Difficulty) => {
      if (nextDifficulty) setDifficulty(nextDifficulty);

      livesRef.current = 3;
      scoreRef.current = 0;
      levelRef.current = 1;
      slowUntilRef.current = 0;

      buildLevel();
      setState("ready");
      setStartOverlayOpen(false);
      setHudSafe();
    },
    [buildLevel, setHudSafe]
  );

  const startGame = useCallback(() => {
    // Start from overlay
    livesRef.current = 3;
    scoreRef.current = 0;
    levelRef.current = 1;
    slowUntilRef.current = 0;

    buildLevel();
    setState("ready");
    setStartOverlayOpen(false);
    setHudSafe();

    // focus canvas so keyboard works immediately
    requestAnimationFrame(() => canvasRef.current?.focus());
  }, [buildLevel, setHudSafe]);

  const togglePause = useCallback(() => {
    setState((s) => (s === "playing" ? "paused" : s === "paused" ? "playing" : s));
  }, []);

  const nextLevel = useCallback(() => {
    levelRef.current += 1;
    buildLevel();
    setState("ready");
    setHudSafe();
    playTone(1046, 160, "triangle", 0.14);
    vibrate([18, 22, 18]);
    requestAnimationFrame(() => canvasRef.current?.focus());
  }, [buildLevel, playTone, setHudSafe, vibrate]);

  const tryLaunch = useCallback(() => {
    if (state !== "ready") return;
    const balls = ballsRef.current;
    if (balls.length === 0) return;
    const b = balls[0];
    if (b.vel.x !== 0 || b.vel.y !== 0) return;

    // Launch with a slight random angle
    const angle = lerp(-Math.PI * 0.8, -Math.PI * 0.2, Math.random());
    b.vel.x = Math.cos(angle) * b.speed;
    b.vel.y = Math.sin(angle) * b.speed;
    setState("playing");
    playTone(660, 70, "square", 0.09);
    vibrate(15);
  }, [playTone, state, vibrate]);

  const spawnPowerUp = useCallback(
    (x: number, y: number) => {
      const chance = difficultyCfg.powerChance;
      if (Math.random() > chance) return;

      const types: PowerUpType[] = ["expand", "multiball", "slow", "life"];
      const type = types[Math.floor(Math.random() * types.length)];
      powerupsRef.current.push({
        id: nextIdRef.current++,
        type,
        x,
        y,
        vy: 160,
        size: 16,
      });
    },
    [difficultyCfg.powerChance]
  );

  const applyPowerUp = useCallback(
    (p: PowerUp) => {
      if (p.type === "expand") {
        const pad = paddleRef.current;
        pad.w = clamp(pad.w + 36, 110, 220);
        playTone(784, 120, "triangle", 0.12);
        vibrate([10, 20, 10]);
        return;
      }
      if (p.type === "life") {
        livesRef.current = clamp(livesRef.current + 1, 1, 9);
        playTone(988, 140, "sine", 0.13);
        vibrate([15, 30, 15]);
        return;
      }
      if (p.type === "slow") {
        slowUntilRef.current = nowMs() + 9000;
        playTone(440, 140, "sine", 0.1);
        vibrate(20);
        return;
      }
      if (p.type === "multiball") {
        const balls = ballsRef.current;
        if (balls.length === 0) return;

        const base = balls[0];
        const mk = (sign: number): Ball => ({
          id: nextIdRef.current++,
          pos: { x: base.pos.x, y: base.pos.y },
          vel: {
            x: base.vel.x * 0.85 + sign * 120,
            y: base.vel.y * 0.95,
          },
          r: base.r,
          speed: base.speed,
        });
        ballsRef.current = [...balls, mk(-1), mk(1)];
        playTone(880, 120, "sawtooth", 0.11);
        vibrate([12, 18, 12, 18, 12]);
      }
    },
    [playTone, vibrate]
  );

  // Fullscreen / Theater mode toggles
  const exitImmersive = useCallback(async () => {
    setTheater(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      // ignore
    }
  }, []);

  const toggleImmersive = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;

    // If native fullscreen is available, prefer it.
    if (hasFullscreenAPI(el)) {
      try {
        if (!document.fullscreenElement) {
          await (el as any).requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
        return;
      } catch {
        // fallback to theater mode
      }
    }
    setTheater((v) => !v);
  }, []);

  // Keep isFullscreen in sync
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Lock scroll during immersive
  useEffect(() => {
    if (!immersive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [immersive]);

  // Initial sizing + resize
  useEffect(() => {
    fitCanvas();
    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitCanvas]);

  // Re-fit when mode changes
  useEffect(() => {
    fitCanvas();
  }, [fitCanvas, immersive]);

  // Save theme
  useEffect(() => {
    window.localStorage.setItem("skn_astro_breakout_theme", themeKey);
  }, [themeKey]);

  // Input (keyboard)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don’t steal input if user is typing in an input
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const code = e.code;

      if (code === "KeyF") {
        e.preventDefault();
        toggleImmersive();
        return;
      }

      if (code === "Escape") {
        // Escape should close theater mode too (native fullscreen already exits by default)
        if (theater) {
          e.preventDefault();
          setTheater(false);
        }
        return;
      }

      if (code === "Space") {
        e.preventDefault();
        tryLaunch();
        return;
      }

      if (code === "KeyP") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (code === "KeyR") {
        e.preventDefault();
        hardReset();
        return;
      }

      // Movement (Arrows / A-D)
      const moveLeft = code === "ArrowLeft" || code === "KeyA";
      const moveRight = code === "ArrowRight" || code === "KeyD";

      if (!moveLeft && !moveRight) return;

      e.preventDefault();

      // Small “nudge” movement (keyboard) — pointer dragging is smoother.
      const pad = paddleRef.current;
      const step = 26;
      pad.x = clamp(pad.x + (moveRight ? step : -step), pad.w / 2, WORLD_W - pad.w / 2);
    };

    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
  }, [hardReset, theater, toggleImmersive, togglePause, tryLaunch]);

  // Pointer controls (mouse/touch/pen): drag to move paddle, tap/click to launch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dragging = false;

    const getWorldX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width;
      return clamp(nx * WORLD_W, 0, WORLD_W);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      const wx = getWorldX(e.clientX);
      const pad = paddleRef.current;
      pad.x = clamp(wx, pad.w / 2, WORLD_W - pad.w / 2);
      canvas.focus();
      // launch if ready and user taps
      if (state === "ready") tryLaunch();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const wx = getWorldX(e.clientX);
      const pad = paddleRef.current;
      pad.x = clamp(wx, pad.w / 2, WORLD_W - pad.w / 2);
    };

    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [state, tryLaunch]);

  // Background stars
  const starsRef = useRef<{ x: number; y: number; r: number; s: number }[]>([]);
  useEffect(() => {
    const count = 160;
    starsRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * WORLD_W,
      y: Math.random() * WORLD_H,
      r: 0.6 + Math.random() * 1.8,
      s: 8 + Math.random() * 22,
    }));
  }, []);

  const tick = useCallback(
    (dt: number) => {
      const balls = ballsRef.current;
      const bricks = bricksRef.current;
      const powerups = powerupsRef.current;
      const pad = paddleRef.current;

      // If ready: ball follows paddle
      if (state === "ready" && balls.length > 0) {
        balls[0].pos.x = pad.x;
        balls[0].pos.y = pad.y - 26;
      }

      if (state !== "playing") {
        // powerups still fall a bit for visual continuity? we keep it paused
        return;
      }

      const slow = nowMs() < slowUntilRef.current;
      const slowFactor = slow ? 0.72 : 1;

      // Move balls
      for (const b of balls) {
        b.pos.x += b.vel.x * dt * slowFactor;
        b.pos.y += b.vel.y * dt * slowFactor;

        // Walls
        if (b.pos.x - b.r < 0) {
          b.pos.x = b.r;
          b.vel.x *= -1;
          playTone(420, 35, "sine", 0.06);
        } else if (b.pos.x + b.r > WORLD_W) {
          b.pos.x = WORLD_W - b.r;
          b.vel.x *= -1;
          playTone(420, 35, "sine", 0.06);
        }
        if (b.pos.y - b.r < 0) {
          b.pos.y = b.r;
          b.vel.y *= -1;
          playTone(520, 40, "sine", 0.06);
        }

        // Bottom out
        if (b.pos.y - b.r > WORLD_H + 40) {
          // lose one life only once per “drop event” — easiest: if any ball fell, remove it
          // keep other balls (multiball) alive
          b.vel.x = 0;
          b.vel.y = 0;
        }
      }

      // Remove “dead” balls
      const aliveBalls = balls.filter((b) => !(b.vel.x === 0 && b.vel.y === 0 && b.pos.y - b.r > WORLD_H));
      if (aliveBalls.length !== balls.length) {
        ballsRef.current = aliveBalls;
      }

      // If no balls left => lose life
      if (ballsRef.current.length === 0) {
        livesRef.current -= 1;
        vibrate([40, 30, 40]);
        playTone(220, 180, "sawtooth", 0.11);

        if (livesRef.current <= 0) {
          setState("over");
          setHudSafe();
          return;
        }

        // Reset to ready
        resetBallToPaddle();
        setState("ready");
        setHudSafe();
        return;
      }

      // Paddle collision
      for (const b of ballsRef.current) {
        const px0 = pad.x - pad.w / 2;
        const px1 = pad.x + pad.w / 2;
        const py0 = pad.y - pad.h / 2;
        const py1 = pad.y + pad.h / 2;

        const hit =
          b.pos.x + b.r >= px0 &&
          b.pos.x - b.r <= px1 &&
          b.pos.y + b.r >= py0 &&
          b.pos.y - b.r <= py1 &&
          b.vel.y > 0;

        if (hit) {
          // place ball above paddle
          b.pos.y = py0 - b.r - 0.5;

          // angle based on hit position
          const t = (b.pos.x - pad.x) / (pad.w / 2);
          const angle = lerp(-Math.PI * 0.82, -Math.PI * 0.18, (t + 1) / 2);

          const sp = b.speed * (0.98 + Math.min(comboRef.current, 12) * 0.008);
          b.vel.x = Math.cos(angle) * sp;
          b.vel.y = Math.sin(angle) * sp;

          comboRef.current = 0; // combo resets on paddle hit
          playTone(740, 55, "square", 0.07);
          vibrate(8);
        }
      }

      // Bricks collision
      const hitNow = nowMs();
      for (const b of ballsRef.current) {
        for (const brick of bricks) {
          if (brick.hp <= 0) continue;

          const bx0 = brick.x;
          const bx1 = brick.x + brick.w;
          const by0 = brick.y;
          const by1 = brick.y + brick.h;

          const overlap =
            b.pos.x + b.r > bx0 &&
            b.pos.x - b.r < bx1 &&
            b.pos.y + b.r > by0 &&
            b.pos.y - b.r < by1;

          if (!overlap) continue;

          // determine penetration direction
          const cx = clamp(b.pos.x, bx0, bx1);
          const cy = clamp(b.pos.y, by0, by1);
          const dx = b.pos.x - cx;
          const dy = b.pos.y - cy;

          // Reflect based on larger penetration axis
          if (Math.abs(dx) > Math.abs(dy)) {
            b.vel.x *= -1;
            b.pos.x += dx > 0 ? 2 : -2;
          } else {
            b.vel.y *= -1;
            b.pos.y += dy > 0 ? 2 : -2;
          }

          if (!brick.solid) {
            brick.hp -= 1;

            // Combo window: hits within 900ms increase combo
            if (hitNow - lastBrickHitAtRef.current <= 900) comboRef.current += 1;
            else comboRef.current = 1;

            lastBrickHitAtRef.current = hitNow;

            const base = 80;
            const comboBonus = Math.min(comboRef.current, 10) * 10;
            scoreRef.current += base + comboBonus;

            playTone(880 + comboRef.current * 12, 40, "triangle", 0.08);
            vibrate(6);

            if (brick.hp <= 0) {
              spawnPowerUp(brick.x + brick.w / 2, brick.y + brick.h / 2);
              playTone(1046, 35, "sine", 0.05);
              vibrate(10);
            }
          } else {
            playTone(300, 45, "sine", 0.07);
            vibrate(8);
          }

          break;
        }
      }

      // Remove dead bricks
      const remain = bricksRef.current.filter((br) => br.hp > 0 || br.solid);
      bricksRef.current = remain;

      // Win condition: all destructible bricks cleared
      const destructibleLeft = bricksRef.current.some((br) => !br.solid && br.hp > 0);
      if (!destructibleLeft) {
        if (levelRef.current >= 5) {
          setState("won");
          setHudSafe();
          playTone(1318, 220, "sawtooth", 0.15);
          vibrate([20, 30, 20, 30, 40]);
        } else {
          // proceed
          nextLevel();
        }
        return;
      }

      // Powerups fall & catch
      for (const p of powerups) {
        p.y += p.vy * dt;
      }

      // Catch check
      const catched: PowerUp[] = [];
      const still: PowerUp[] = [];
      for (const p of powerups) {
        const px0 = pad.x - pad.w / 2;
        const px1 = pad.x + pad.w / 2;
        const py0 = pad.y - pad.h / 2;
        const py1 = pad.y + pad.h / 2;

        const hit =
          p.x + p.size > px0 &&
          p.x - p.size < px1 &&
          p.y + p.size > py0 &&
          p.y - p.size < py1;

        if (hit) catched.push(p);
        else if (p.y < WORLD_H + 40) still.push(p);
      }
      powerupsRef.current = still;

      for (const p of catched) {
        applyPowerUp(p);
      }

      // Update HUD sometimes (cheap)
      setHudSafe();
    },
    [applyPowerUp, nextLevel, playTone, resetBallToPaddle, setHudSafe, spawnPowerUp, state, vibrate]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h, dpr } = canvasSizeRef.current;
    if (!w || !h) return;

    // Setup transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const s = scaleRef.current;

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, theme.bgA);
    g.addColorStop(1, theme.bgB);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Grid glow (subtle)
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    const grid = Math.max(28, Math.floor(48 * s));
    for (let x = 0; x < w; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
    ctx.restore();

    // Stars (parallax)
    const stars = starsRef.current;
    ctx.save();
    ctx.fillStyle = theme.star;
    const t = (nowMs() / 1000) % 1000;
    for (const st of stars) {
      const x = ((st.x + t * st.s) % WORLD_W) * s;
      const y = st.y * s;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Playfield border
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "rgba(92,130,238,0.25)";
    ctx.lineWidth = 2;
    roundRectPath(ctx, 12, 12, w - 24, h - 24, 22);
    ctx.stroke();
    ctx.restore();

    // Bricks
    const bricks = bricksRef.current;
    for (const br of bricks) {
      if (br.hp <= 0) continue;
      const x = br.x * s;
      const y = br.y * s;
      const bw = br.w * s;
      const bh = br.h * s;

      const idx = br.colorIndex % theme.brick.length;
      const base = theme.brick[idx];

      // Solid bricks are darker and have a “metal” sheen
      const fill = ctx.createLinearGradient(x, y, x + bw, y + bh);
      fill.addColorStop(0, br.solid ? "rgba(148,163,184,0.65)" : base);
      fill.addColorStop(1, br.solid ? "rgba(71,85,105,0.85)" : "rgba(255,255,255,0.08)");

      ctx.save();
      ctx.fillStyle = fill;
      roundRectPath(ctx, x, y, bw, bh, 10);
      ctx.fill();

      // HP overlay
      if (!br.solid) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#000";
        for (let i = 1; i < br.hp; i++) {
          roundRectPath(ctx, x + i * 3, y + i * 2, bw - i * 6, bh - i * 4, 10);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      roundRectPath(ctx, x + 0.5, y + 0.5, bw - 1, bh - 1, 10);
      ctx.stroke();
      ctx.restore();
    }

    // Paddle
    const pad = paddleRef.current;
    const px = (pad.x - pad.w / 2) * s;
    const py = (pad.y - pad.h / 2) * s;
    const pw = pad.w * s;
    const ph = pad.h * s;

    const pg = ctx.createLinearGradient(px, py, px + pw, py + ph);
    pg.addColorStop(0, theme.paddleA);
    pg.addColorStop(1, theme.paddleB);

    ctx.save();
    ctx.fillStyle = pg;
    roundRectPath(ctx, px, py, pw, ph, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, px + 0.5, py + 0.5, pw - 1, ph - 1, 14);
    ctx.stroke();
    ctx.restore();

    // Balls
    const balls = ballsRef.current;
    for (const b of balls) {
      const bx = b.pos.x * s;
      const by = b.pos.y * s;
      const br = b.r * s;

      const bg = ctx.createRadialGradient(bx - br * 0.25, by - br * 0.25, br * 0.2, bx, by, br);
      bg.addColorStop(0, "rgba(255,255,255,0.95)");
      bg.addColorStop(0.35, theme.ball);
      bg.addColorStop(1, "rgba(0,0,0,0.35)");

      ctx.save();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Powerups
    const pws = powerupsRef.current;
    for (const p of pws) {
      const x = p.x * s;
      const y = p.y * s;

      const color =
        p.type === "expand"
          ? "#5c82ee"
          : p.type === "multiball"
            ? "#a855f7"
            : p.type === "slow"
              ? "#22c55e"
              : "#f59e0b";

      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = color;
      roundRectPath(ctx, x - 14, y - 14, 28, 28, 10);
      ctx.fill();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#fff";
      roundRectPath(ctx, x - 12, y - 12, 24, 24, 10);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0b1220";
      ctx.font = `${Math.max(12, Math.floor(14 * s))}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        p.type === "expand" ? "E" : p.type === "multiball" ? "M" : p.type === "slow" ? "S" : "+",
        x,
        y + 0.5
      );
      ctx.restore();
    }

    // Mini overlay text
    ctx.save();
    ctx.fillStyle = "rgba(226,232,240,0.85)";
    ctx.font = `${Math.max(12, Math.floor(14 * s))}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const lines = [
      `Score ${scoreRef.current}`,
      `Lives ${livesRef.current}`,
      `Level ${levelRef.current}`,
      comboRef.current > 1 ? `Combo x${comboRef.current}` : "",
    ].filter(Boolean);

    let ty = 18;
    for (const line of lines) {
      ctx.fillText(line, 22, ty);
      ty += 18;
    }
    ctx.restore();

    // If paused / won / over: draw center label (subtle)
    if (state === "paused" || state === "won" || state === "over") {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.max(22, Math.floor(30 * s))}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.fillText(state === "paused" ? "Paused" : state === "won" ? "You won!" : "Game Over", w / 2, h / 2 - 10);

      ctx.font = `500 ${Math.max(12, Math.floor(14 * s))}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.fillStyle = "rgba(226,232,240,0.9)";
      ctx.fillText("Press P to resume · Press R to restart · Press F for fullscreen", w / 2, h / 2 + 26);
      ctx.restore();
    }
  }, [state, theme]);

  // Main loop
  useEffect(() => {
    // Ensure game is initialized at least once
    if (state === "idle") {
      setHudSafe();
      resetBallToPaddle();
      buildLevel();
      setState("ready");
      setStartOverlayOpen(true);
    }

    let running = true;
    const loop = (t: number) => {
      if (!running) return;

      if (!lastRef.current) lastRef.current = t;
      const dt = Math.min(0.022, (t - lastRef.current) / 1000);
      lastRef.current = t;

      // fit canvas can change as layout changes
      // (cheap and avoids “small until scroll” problems)
      fitCanvas();

      tick(dt);
      draw();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
    };
  }, [buildLevel, draw, fitCanvas, resetBallToPaddle, setHudSafe, state, tick]);

  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Arrow keys or A/D. Space launches. P pauses. F fullscreen.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => setHaptics((v) => !v)}
            aria-label={haptics ? "Disable haptics" : "Enable haptics"}
            title={haptics ? "Disable haptics" : "Enable haptics"}
          >
            <Vibrate className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{hud.status}</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-2 py-2">
              <div className="text-[10px] uppercase tracking-wide">Score</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{hud.score}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-2 py-2">
              <div className="text-[10px] uppercase tracking-wide">Lives</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{hud.lives}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-2 py-2">
              <div className="text-[10px] uppercase tracking-wide">Level</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{hud.level}</div>
            </div>
          </div>
          {hud.combo > 1 ? (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Combo: <span className="font-semibold">x{hud.combo}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Difficulty</div>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <Button
                key={d}
                type="button"
                variant={difficulty === d ? "default" : "outline"}
                className="h-9 px-3"
                onClick={() => {
                  setDifficulty(d);
                  setTimeout(() => hardReset(d), 0);
                }}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <Palette className="h-4 w-4" /> Theme
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
              <Button
                key={k}
                type="button"
                variant={themeKey === k ? "default" : "outline"}
                className="h-9 px-3"
                onClick={() => setThemeKey(k)}
              >
                {THEMES[k].name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => togglePause()}
            disabled={state === "over" || state === "won" || state === "idle"}
          >
            {state === "paused" ? (
              <>
                <Play className="mr-2 h-4 w-4" /> Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            )}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={() => hardReset()}>
            <RotateCcw className="mr-2 h-4 w-4" /> New game
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" className="w-full" onClick={() => toggleImmersive()}>
            {immersive ? (
              <>
                <Minimize2 className="mr-2 h-4 w-4" /> Exit
              </>
            ) : (
              <>
                <Maximize2 className="mr-2 h-4 w-4" /> Fullscreen
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Power-ups: <span className="font-semibold">E</span> Expand, <span className="font-semibold">M</span> Multi-ball,{" "}
          <span className="font-semibold">S</span> Slow, <span className="font-semibold">+</span> Extra life
        </div>
      </div>
    </div>
  );

  const below = (
    <div>
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Break all destructible bricks to clear the level. Keep the ball in play by bouncing it off your paddle. Collect
            power-ups for big advantages.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Move:</strong> Arrow keys or A/D. On mobile, drag on the playfield.</li>
            <li><strong>Launch:</strong> Space, click/tap the playfield, or press Start.</li>
            <li><strong>Pause:</strong> Press P (or use the Pause button).</li>
            <li><strong>Fullscreen:</strong> Press F (or use Fullscreen). If native fullscreen is blocked, Theater Mode is used.</li>
          </ul>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tip: Aim the ball by hitting it with the left/right side of the paddle. Fast brick streaks build a combo bonus.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[{ id: "how-to-play", label: "How to play" }]}
    >
      <div
        ref={wrapRef}
        className={[
          "relative flex flex-col items-center justify-center",
          // Theater mode is CSS-based fullscreen fallback (works on mobile/iOS)
          theater ? "fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm p-4" : "",
        ].join(" ")}
      >
        {/* Small top bar when immersive */}
        {immersive ? (
          <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between rounded-xl border border-slate-200/20 bg-slate-950/60 px-3 py-2 text-slate-100 backdrop-blur">
            <div className="inline-flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
              <span className="font-semibold">Astro Breakout</span>
              <span className="text-slate-300">· Score {scoreRef.current}</span>
              <span className="text-slate-300">· Lives {livesRef.current}</span>
              <span className="text-slate-300">· Level {levelRef.current}</span>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="h-9" onClick={() => togglePause()}>
                {state === "paused" ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {state === "paused" ? "Resume" : "Pause"}
              </Button>
              <Button type="button" variant="outline" className="h-9" onClick={() => hardReset()}>
                <RotateCcw className="mr-2 h-4 w-4" /> Restart
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => {
                  exitImmersive();
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            className="rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-950 outline-none"
            onPointerDown={() => canvasRef.current?.focus()}
          />

          {/* Inline Start Button (works even if overlay is dismissed) */}
          {!startOverlayOpen && state === "ready" ? (
            <div className="mt-5">
              <Button type="button" onClick={() => tryLaunch()}>
                Start / Launch
              </Button>
            </div>
          ) : null}
        </div>

        {/* Start overlay: closeable, click outside closes, ESC closes */}
        <StartOverlay open={startOverlayOpen} onClose={() => setStartOverlayOpen(false)}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
            Astro Breakout
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ready to play
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Drag or use Arrow keys / A-D to move. Click/tap or press Space to launch. Break all bricks to win.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-300">Difficulty</div>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={difficulty === d ? "default" : "outline"}
                  className="h-9 px-3"
                  onClick={() => setDifficulty(d)}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-700 dark:text-slate-300">Theme</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                <Button
                  key={k}
                  type="button"
                  variant={themeKey === k ? "default" : "outline"}
                  className="h-9 px-3"
                  onClick={() => setThemeKey(k)}
                >
                  {THEMES[k].name}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                // apply difficulty then start
                setTimeout(() => startGame(), 0);
              }}
            >
              Start Game
            </Button>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Tip: Press <span className="font-semibold">F</span> for fullscreen. If iOS blocks it, Theater Mode will still fill the screen.
          </div>
        </StartOverlay>

        {/* End overlays */}
        <StartOverlay open={state === "over"} onClose={() => setState("ready")}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
            Game Over
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Game over
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Final score: <span className="font-semibold">{scoreRef.current}</span>. Want another run?
          </p>
          <div className="mt-6">
            <Button type="button" className="w-full" onClick={() => hardReset()}>
              Restart
            </Button>
          </div>
        </StartOverlay>

        <StartOverlay open={state === "won"} onClose={() => setState("ready")}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="h-4 w-4" style={{ color: theme.accent }} />
            Victory
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            You won!
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Final score: <span className="font-semibold">{scoreRef.current}</span>. Great run.
          </p>
          <div className="mt-6">
            <Button type="button" className="w-full" onClick={() => hardReset()}>
              Play again
            </Button>
          </div>
        </StartOverlay>
      </div>
    </GamePageLayout>
  );
}
