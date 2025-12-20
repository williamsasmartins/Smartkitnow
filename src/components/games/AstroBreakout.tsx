import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "idle" | "playing" | "paused" | "levelClear" | "gameOver" | "won";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  stuck: boolean; // stuck to paddle until launch
};

type Paddle = {
  x: number;
  y: number;
  w: number;
  h: number;
  targetX: number;
  speed: number;
};

type BrickKind = "normal" | "steel" | "power";
type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  kind: BrickKind;
  alive: boolean;
};

type PowerUpType = "expand" | "multiball" | "slow" | "life";
type PowerUp = {
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  type: PowerUpType;
  alive: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function safeRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  const anyCtx = ctx as any;
  if (typeof anyCtx.roundRect === "function") {
    anyCtx.beginPath();
    anyCtx.roundRect(x, y, w, h, rr);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
}

function rectCircleCollide(rx: number, ry: number, rw: number, rh: number, cx: number, cy: number, cr: number) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy <= cr * cr;
}

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function loadNumber(key: string, fallback: number) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function saveNumber(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

export default function AstroBreakout({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Astro Breakout";
  const pageDescription =
    description ??
    "Breakout with a cosmic vibe. Break asteroid bricks, collect power-ups, and clear all sectors. Keyboard, mouse, and touch controls supported.";

  // ====== UI State ======
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [level, setLevel] = useState(1);
  const [maxLevels] = useState(6);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endTitle, setEndTitle] = useState("");
  const [endSubtitle, setEndSubtitle] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bestKey = "skn_games_astro_breakout_best";
  const [bestScore, setBestScore] = useState(() => (typeof window !== "undefined" ? loadNumber(bestKey, 0) : 0));

  // ====== Refs / Runtime ======
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const pointerRef = useRef<{ active: boolean; x: number }>({ active: false, x: 0 });

  const worldRef = useRef<{ w: number; h: number }>({ w: 960, h: 540 });
  const ballRef = useRef<Ball[]>([]);
  const paddleRef = useRef<Paddle | null>(null);
  const bricksRef = useRef<Brick[]>([]);
  const powerRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starRef = useRef<{ x: number; y: number; z: number }[]>([]);
  const slowMoRef = useRef<number>(0); // frames remaining slow effect
  const reducedMotionRef = useRef<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Difficulty tuning
  const tuning = useMemo(() => {
    if (difficulty === "easy")
      return { ballSpeed: 420, paddleSpeed: 860, brickRows: 5, brickHpBase: 1, lives: 4, powerRate: 0.24 };
    if (difficulty === "hard")
      return { ballSpeed: 560, paddleSpeed: 760, brickRows: 7, brickHpBase: 2, lives: 3, powerRate: 0.18 };
    return { ballSpeed: 500, paddleSpeed: 800, brickRows: 6, brickHpBase: 1, lives: 3, powerRate: 0.2 };
  }, [difficulty]);

  function beep(freq: number, ms: number, type: OscillatorType = "sine", gain = 0.12) {
    if (!soundOn) return;
    try {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!Ctx) return;
      const ctx = audioCtxRef.current ?? new Ctx();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume?.();

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
      // ignore audio errors
    }
  }

  function setCanvasSizeFromContainer() {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const rect = el.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.floor(clamp(w * 0.62, 360, 640));

    worldRef.current = { w, h };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }

  function initStars() {
    const { w, h } = worldRef.current;
    const count = reducedMotionRef.current ? 60 : 140;
    starRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1,
    }));
  }

  function spawnParticles(x: number, y: number, n: number) {
    if (reducedMotionRef.current) return;
    for (let i = 0; i < n; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: rand(-180, 180),
        vy: rand(-240, 140),
        life: rand(0.35, 0.7),
        maxLife: rand(0.35, 0.7),
        size: rand(1.5, 3.5),
      });
    }
  }

  function spawnPowerUp(x: number, y: number) {
    const roll = Math.random();
    let type: PowerUpType = "expand";
    if (roll < 0.25) type = "expand";
    else if (roll < 0.5) type = "multiball";
    else if (roll < 0.75) type = "slow";
    else type = "life";

    powerRef.current.push({
      x,
      y,
      vy: rand(120, 190),
      w: 26,
      h: 18,
      type,
      alive: true,
    });
  }

  function buildLevel(lv: number) {
    const { w, h } = worldRef.current;

    const paddleW = clamp(w * 0.17, 120, 190);
    const paddleH = 14;
    paddleRef.current = {
      x: (w - paddleW) / 2,
      y: h - 46,
      w: paddleW,
      h: paddleH,
      targetX: (w - paddleW) / 2,
      speed: tuning.paddleSpeed,
    };

    const b: Ball = {
      x: w / 2,
      y: h - 46 - 10,
      vx: 0,
      vy: 0,
      r: 7,
      stuck: true,
    };
    ballRef.current = [b];

    const cols = 11;
    const rows = clamp(tuning.brickRows + Math.floor((lv - 1) / 2), 5, 8);
    const marginX = clamp(w * 0.06, 18, 36);
    const topY = clamp(h * 0.12, 54, 86);
    const gap = 8;

    const totalGapX = gap * (cols - 1);
    const bw = Math.floor((w - marginX * 2 - totalGapX) / cols);
    const bh = 22;

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const center = (cols - 1) / 2;
        const dist = Math.abs(c - center);
        const holeChance = 0.08 + dist * 0.01;
        const isHole = Math.random() < holeChance && lv >= 2 && r >= 1;
        if (isHole) continue;

        const x = marginX + c * (bw + gap);
        const y = topY + r * (bh + gap);

        let kind: BrickKind = "normal";
        let hp = tuning.brickHpBase + (lv >= 4 ? 1 : 0);
        if ((lv >= 3 && Math.random() < 0.12) || (lv >= 5 && Math.random() < 0.2)) {
          kind = "steel";
          hp += 2;
        }
        if (Math.random() < 0.14) {
          kind = "power";
        }

        bricks.push({
          x,
          y,
          w: bw,
          h: bh,
          hp,
          maxHp: hp,
          kind,
          alive: true,
        });
      }
    }

    bricksRef.current = bricks;
    powerRef.current = [];
    particlesRef.current = [];
    slowMoRef.current = 0;

    initStars();
  }

  function fullReset(newDifficulty?: Difficulty) {
    const diff = newDifficulty ?? difficulty;
    setDifficulty(diff);

    const nextLives = diff === "easy" ? 4 : diff === "hard" ? 3 : 3;
    setLives(nextLives);

    setScore(0);
    setLevel(1);
    setPhase("idle");
    setEndTitle("");
    setEndSubtitle("");
    setShowEndModal(false);

    requestAnimationFrame(() => {
      setCanvasSizeFromContainer();
      buildLevel(1);
      drawFrame();
    });
  }

  function launchBall() {
    if (phase !== "playing") return;
    const balls = ballRef.current;
    if (!balls.length) return;
    let launched = false;
    for (const b of balls) {
      if (b.stuck) {
        b.stuck = false;
        const base = tuning.ballSpeed * (1 + (level - 1) * 0.06);
        const ang = rand(-0.9, -0.3);
        b.vx = Math.cos(ang) * base;
        b.vy = Math.sin(ang) * base;
        launched = true;
      }
    }
    if (launched) beep(520, 70, "triangle", 0.11);
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;

    const doc = document as any;
    const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;

    if (!fsEl) {
      const req = (el as any).requestFullscreen || (el as any).webkitRequestFullscreen;
      req?.call(el);
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      exit?.call(doc);
    }
  }

  function updateBestIfNeeded(nextScore: number) {
    if (nextScore > bestScore) {
      setBestScore(nextScore);
      saveNumber(bestKey, nextScore);
    }
  }

  function setPhaseSafe(next: GamePhase) {
    setPhase(next);
  }

  function startGame() {
    setShowStartModal(false);
    setShowEndModal(false);

    setPhaseSafe("playing");
    setEndTitle("");
    setEndSubtitle("");

    requestAnimationFrame(() => {
      canvasRef.current?.focus();
    });

    beep(740, 70, "sine", 0.09);
  }

  function restartGame() {
    const nextLives = difficulty === "easy" ? 4 : difficulty === "hard" ? 3 : 3;
    setLives(nextLives);
    setScore(0);
    setLevel(1);
    setPhaseSafe("playing");
    setShowEndModal(false);
    setEndTitle("");
    setEndSubtitle("");

    requestAnimationFrame(() => {
      setCanvasSizeFromContainer();
      buildLevel(1);
      drawFrame();
      canvasRef.current?.focus();
    });

    beep(640, 80, "triangle", 0.1);
  }

  function pauseToggle() {
    setPhase((p) => (p === "playing" ? "paused" : p === "paused" ? "playing" : p));
    beep(320, 60, "square", 0.08);
  }

  function nextLevel() {
    if (level >= maxLevels) return;
    const next = level + 1;
    setLevel(next);
    setPhaseSafe("playing");
    setShowEndModal(false);

    requestAnimationFrame(() => {
      setCanvasSizeFromContainer();
      buildLevel(next);
      drawFrame();
      canvasRef.current?.focus();
    });

    beep(880, 90, "sine", 0.1);
  }

  // ====== Resize handling (makes the game NOT tiny) ======
  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion();

    setCanvasSizeFromContainer();
    buildLevel(1);
    drawFrame();

    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setCanvasSizeFromContainer();
      const { w, h } = worldRef.current;
      const p = paddleRef.current;
      if (p) {
        p.y = h - 46;
        p.x = clamp(p.x, 0, w - p.w);
        p.targetX = clamp(p.targetX, 0, w - p.w);
      }
      for (const b of ballRef.current) {
        b.x = clamp(b.x, b.r, w - b.r);
        b.y = clamp(b.y, b.r, h - b.r);
      }
      initStars();
      drawFrame();
    });

    ro.observe(el);

    const onFsChange = () => {
      const doc = document as any;
      const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
      setIsFullscreen(!!fsEl);
      setTimeout(() => {
        setCanvasSizeFromContainer();
        drawFrame();
      }, 60);
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange as any);

    return () => {
      ro.disconnect();
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "idle") return;
    const nextLives = difficulty === "easy" ? 4 : difficulty === "hard" ? 3 : 3;
    setLives(nextLives);
  }, [difficulty]);

  // ====== Keyboard controls ======
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = (e.key || "").toLowerCase();
      const code = e.code;

      if (code === "ArrowLeft" || code === "ArrowRight" || code === "Space") {
        e.preventDefault();
      }

      if (code === "KeyP") {
        e.preventDefault();
        if (phase === "playing" || phase === "paused") pauseToggle();
        return;
      }

      if (code === "KeyR") {
        e.preventDefault();
        restartGame();
        return;
      }

      if (code === "Escape") {
        if (showStartModal) setShowStartModal(false);
        if (showEndModal) setShowEndModal(false);
        return;
      }

      if (code === "ArrowLeft" || k === "a") keysRef.current.left = true;
      if (code === "ArrowRight" || k === "d") keysRef.current.right = true;

      if (code === "Space" || k === "enter") {
        if (phase === "idle") {
          startGame();
          return;
        }
        if (phase === "playing") launchBall();
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const k = (e.key || "").toLowerCase();
      const code = e.code;

      if (code === "ArrowLeft" || k === "a") keysRef.current.left = false;
      if (code === "ArrowRight" || k === "d") keysRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("keyup", onKeyUp as any);
    };
  }, [phase, showStartModal, showEndModal]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") {
        setPhase((p) => (p === "playing" ? "paused" : p));
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function pointerToWorldX(clientX: number) {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * worldRef.current.w;
    return clamp(x, 0, worldRef.current.w);
  }

  function setPaddleTarget(x: number) {
    const p = paddleRef.current;
    if (!p) return;
    p.targetX = clamp(x - p.w / 2, 0, worldRef.current.w - p.w);
  }

  function reflectBallFromPaddle(ball: Ball, paddle: Paddle) {
    const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    const clamped = clamp(hit, -1, 1);
    const speed = Math.hypot(ball.vx, ball.vy) || tuning.ballSpeed;
    const ang = lerp(-Math.PI * 0.82, -Math.PI * 0.18, (clamped + 1) / 2);
    ball.vx = Math.cos(ang) * speed;
    ball.vy = Math.sin(ang) * speed;
  }

  function damageBrick(br: Brick) {
    br.hp -= 1;
    if (br.hp <= 0) {
      br.alive = false;
      const dropChance = br.kind === "power" ? tuning.powerRate * 2.2 : tuning.powerRate;
      if (Math.random() < dropChance) spawnPowerUp(br.x + br.w / 2, br.y + br.h / 2);
      spawnParticles(br.x + br.w / 2, br.y + br.h / 2, br.kind === "steel" ? 10 : 16);
      beep(br.kind === "steel" ? 240 : 640, 50, "triangle", 0.08);
      return true;
    }
    beep(br.kind === "steel" ? 180 : 480, 40, "sine", 0.05);
    return false;
  }

  function applyPower(type: PowerUpType) {
    const p = paddleRef.current;
    if (!p) return;

    if (type === "expand") {
      const nw = clamp(p.w * 1.28, 120, worldRef.current.w * 0.32);
      p.w = nw;
      p.x = clamp(p.x, 0, worldRef.current.w - p.w);
      p.targetX = clamp(p.targetX, 0, worldRef.current.w - p.w);
      beep(920, 80, "sine", 0.1);
      return;
    }
    if (type === "multiball") {
      const balls = ballRef.current;
      const base = balls[0] ?? { x: worldRef.current.w / 2, y: worldRef.current.h / 2, vx: 260, vy: -260, r: 7, stuck: false };
      const sp = Math.max(320, Math.hypot(base.vx, base.vy));
      const b1: Ball = { x: base.x, y: base.y, vx: sp * 0.7, vy: -sp * 0.7, r: 7, stuck: false };
      const b2: Ball = { x: base.x, y: base.y, vx: -sp * 0.75, vy: -sp * 0.62, r: 7, stuck: false };
      ballRef.current = [...balls, b1, b2].slice(0, 4);
      beep(1040, 90, "triangle", 0.11);
      return;
    }
    if (type === "slow") {
      slowMoRef.current = 60 * 6;
      beep(420, 90, "sawtooth", 0.08);
      return;
    }
    if (type === "life") {
      setLives((v) => v + 1);
      beep(880, 110, "sine", 0.12);
      return;
    }
  }

  function update(dt: number) {
    const { w, h } = worldRef.current;
    const paddle = paddleRef.current;
    if (!paddle) return;

    const keys = keysRef.current;
    let ax = 0;
    if (keys.left) ax -= 1;
    if (keys.right) ax += 1;

    if (ax !== 0) {
      paddle.x += ax * paddle.speed * dt;
      paddle.x = clamp(paddle.x, 0, w - paddle.w);
      paddle.targetX = paddle.x;
    } else if (pointerRef.current.active) {
      paddle.x = lerp(paddle.x, paddle.targetX, clamp(dt * 14, 0, 1));
      paddle.x = clamp(paddle.x, 0, w - paddle.w);
    } else {
      paddle.x = lerp(paddle.x, paddle.targetX, clamp(dt * 8, 0, 1));
    }

    const slowFactor = slowMoRef.current > 0 ? 0.58 : 1;
    if (slowMoRef.current > 0) slowMoRef.current -= 1;

    const balls = ballRef.current;
    const bricks = bricksRef.current;
    const powers = powerRef.current;

    for (const ball of balls) {
      if (ball.stuck) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 2;
        continue;
      }

      ball.x += ball.vx * dt * slowFactor;
      ball.y += ball.vy * dt * slowFactor;

      if (ball.x - ball.r <= 0) {
        ball.x = ball.r;
        ball.vx *= -1;
        beep(220, 18, "square", 0.03);
      } else if (ball.x + ball.r >= w) {
        ball.x = w - ball.r;
        ball.vx *= -1;
        beep(220, 18, "square", 0.03);
      }
      if (ball.y - ball.r <= 0) {
        ball.y = ball.r;
        ball.vy *= -1;
        beep(240, 18, "square", 0.03);
      }

      if (rectCircleCollide(paddle.x, paddle.y, paddle.w, paddle.h, ball.x, ball.y, ball.r) && ball.vy > 0) {
        ball.y = paddle.y - ball.r - 0.5;
        reflectBallFromPaddle(ball, paddle);
        const sp = Math.hypot(ball.vx, ball.vy);
        const cap = tuning.ballSpeed * (1.35 + level * 0.06);
        const next = clamp(sp * 1.02, tuning.ballSpeed * 0.78, cap);
        const s = next / (sp || 1);
        ball.vx *= s;
        ball.vy *= s;
        beep(520, 22, "triangle", 0.05);
      }

      for (const br of bricks) {
        if (!br.alive) continue;
        if (!rectCircleCollide(br.x, br.y, br.w, br.h, ball.x, ball.y, ball.r)) continue;

        const cx = clamp(ball.x, br.x, br.x + br.w);
        const cy = clamp(ball.y, br.y, br.y + br.h);
        const dx = ball.x - cx;
        const dy = ball.y - cy;

        if (Math.abs(dx) > Math.abs(dy)) {
          ball.vx *= -1;
          ball.x += Math.sign(dx || ball.vx) * 1.5;
        } else {
          ball.vy *= -1;
          ball.y += Math.sign(dy || ball.vy) * 1.5;
        }

        const destroyed = damageBrick(br);
        if (destroyed) {
          const add = br.kind === "steel" ? 25 : br.kind === "power" ? 20 : 15;
          setScore((s) => {
            const next = s + add;
            updateBestIfNeeded(next);
            return next;
          });
        }
        break;
      }

      if (ball.y - ball.r > h + 18) {
        (ball as any).alive = false;
      }
    }

    ballRef.current = ballRef.current.filter((b: any) => (b as any).alive !== false);

    if (ballRef.current.length === 0 && phase === "playing") {
      setLives((lv) => {
        const next = lv - 1;
        if (next <= 0) {
          setPhaseSafe("gameOver");
          setEndTitle("Game Over");
          setEndSubtitle("Your ship ran out of shields. Restart to try again.");
          setShowEndModal(true);
          beep(140, 140, "sawtooth", 0.09);
        } else {
          const p = paddleRef.current!;
          ballRef.current = [
            { x: p.x + p.w / 2, y: p.y - 10, vx: 0, vy: 0, r: 7, stuck: true },
          ];
          beep(220, 90, "square", 0.06);
        }
        return next;
      });
    }

    for (const pu of powers) {
      if (!pu.alive) continue;
      pu.y += pu.vy * dt;
      if (paddle && rectCircleCollide(paddle.x, paddle.y, paddle.w, paddle.h, pu.x, pu.y, Math.max(pu.w, pu.h) / 2)) {
        pu.alive = false;
        applyPower(pu.type);
        spawnParticles(pu.x, pu.y, 12);
      }
      if (pu.y > h + 40) pu.alive = false;
    }
    powerRef.current = powerRef.current.filter((p) => p.alive);

    for (const pa of particlesRef.current) {
      pa.life -= dt;
      pa.x += pa.vx * dt;
      pa.y += pa.vy * dt;
      pa.vy += 520 * dt;
    }
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    const stars = starRef.current;
    for (const s of stars) {
      s.y += (18 + s.z * 22) * dt;
      s.x += (Math.sin((nowMs() / 1000) * 0.35 + s.z * 10) * 10) * dt;
      if (s.y > h) {
        s.y = -4;
        s.x = Math.random() * w;
        s.z = Math.random() * 1;
      }
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
    }

    const aliveBricks = bricksRef.current.filter((b) => b.alive);
    if (aliveBricks.length === 0 && (phase === "playing" || phase === "paused")) {
      if (level >= maxLevels) {
        setPhaseSafe("won");
        setEndTitle("Sector Cleared");
        setEndSubtitle("You cleared all sectors. Great flying, captain.");
        setShowEndModal(true);
        beep(920, 180, "triangle", 0.11);
      } else {
        setPhaseSafe("levelClear");
        setEndTitle(`Sector ${level} cleared`);
        setEndSubtitle("Continue to the next sector when ready.");
        setShowEndModal(true);
        beep(820, 120, "sine", 0.1);
      }
    }
  }

  function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = worldRef.current;

    ctx.clearRect(0, 0, w, h);

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#070b16");
    g.addColorStop(0.55, "#0b1430");
    g.addColorStop(1, "#070b16");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (const s of starRef.current) {
      const a = 0.25 + s.z * 0.6;
      ctx.globalAlpha = a;
      ctx.fillRect(s.x, s.y, 1.2 + s.z * 1.2, 1.2 + s.z * 1.2);
    }
    ctx.globalAlpha = 1;

    if (!reducedMotionRef.current) {
      const t = nowMs() / 1000;
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#5c82ee";
      ctx.beginPath();
      ctx.arc(w * 0.2 + Math.sin(t * 0.4) * 18, h * 0.25, w * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.35 + Math.cos(t * 0.35) * 14, w * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    for (const br of bricksRef.current) {
      if (!br.alive) continue;

      const hpRatio = br.hp / br.maxHp;
      const base = br.kind === "steel" ? "rgba(148,163,184," : br.kind === "power" ? "rgba(168,85,247," : "rgba(92,130,238,";
      const fill = `${base}${0.18 + (1 - hpRatio) * 0.12})`;
      const stroke = br.kind === "steel" ? "rgba(226,232,240,0.35)" : br.kind === "power" ? "rgba(232,121,249,0.38)" : "rgba(147,197,253,0.35)";

      ctx.fillStyle = fill;
      safeRoundRect(ctx, br.x, br.y, br.w, br.h, 10);
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.globalAlpha = 0.22;
      ctx.fillStyle = br.kind === "steel" ? "#e2e8f0" : br.kind === "power" ? "#e879f9" : "#93c5fd";
      safeRoundRect(ctx, br.x + 4, br.y + 4, br.w - 8, br.h - 8, 8);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    for (const pu of powerRef.current) {
      const label = pu.type === "expand" ? "EXPAND" : pu.type === "multiball" ? "MULTI" : pu.type === "slow" ? "SLOW" : "LIFE";
      ctx.fillStyle = "rgba(15,23,42,0.8)";
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      safeRoundRect(ctx, pu.x - pu.w / 2, pu.y - pu.h / 2, pu.w, pu.h, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = pu.type === "life" ? "#f59e0b" : pu.type === "slow" ? "#22c55e" : pu.type === "multiball" ? "#a855f7" : "#5c82ee";
      ctx.font = "bold 10px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, pu.x, pu.y + 0.5);
    }

    const paddle = paddleRef.current;
    if (paddle) {
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.strokeStyle = "rgba(147,197,253,0.35)";
      safeRoundRect(ctx, paddle.x, paddle.y, paddle.w, paddle.h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#5c82ee";
      safeRoundRect(ctx, paddle.x + 3, paddle.y + 2, paddle.w - 6, paddle.h - 4, 9);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    for (const b of ballRef.current) {
      const grad = ctx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, b.r + 6);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.4, "rgba(147,197,253,0.9)");
      grad.addColorStop(1, "rgba(92,130,238,0.15)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reducedMotionRef.current) {
      for (const p of particlesRef.current) {
        const a = clamp(p.life / p.maxLife, 0, 1);
        ctx.globalAlpha = a;
        ctx.fillStyle = "rgba(147,197,253,0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgba(226,232,240,0.9)";
    ctx.font = "600 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score ${score}`, 14, 12);
    ctx.fillText(`Lives ${lives}`, 14, 30);
    ctx.fillText(`Sector ${level}/${maxLevels}`, 14, 48);

    if (phase === "idle") {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "rgba(15,23,42,0.7)";
      const bw = Math.min(520, w - 40);
      const bh = 68;
      const bx = (w - bw) / 2;
      const by = h * 0.58;
      safeRoundRect(ctx, bx, by, bw, bh, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.stroke();

      ctx.fillStyle = "rgba(226,232,240,0.92)";
      ctx.textAlign = "center";
      ctx.font = "700 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText("Press Start to play, then Space / Tap to launch", w / 2, by + 18);
      ctx.font = "500 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText("Move: Mouse/Touch drag or Arrow Keys / A-D. Pause: P", w / 2, by + 38);
      ctx.globalAlpha = 1;
    }
  }

  function frame(t: number) {
    const last = lastRef.current || t;
    const dt = clamp((t - last) / 1000, 0, 0.02);
    lastRef.current = t;

    if (phase === "playing") {
      update(dt);
    }

    drawFrame();
    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastRef.current = 0;
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [phase, level, difficulty, soundOn, score, lives]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.code === "Escape") {
        if (showStartModal) setShowStartModal(false);
        if (showEndModal) setShowEndModal(false);
      }
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showStartModal, showEndModal]);

  const statusText = useMemo(() => {
    if (phase === "playing") return "Playing";
    if (phase === "paused") return "Paused";
    if (phase === "levelClear") return "Sector cleared";
    if (phase === "gameOver") return "Game over";
    if (phase === "won") return "All sectors cleared";
    return "Ready";
  }, [phase]);

  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{statusText}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div>Score: {score}</div>
            <div>Best: {bestScore}</div>
            <div>Lives: {lives}</div>
            <div>Sector: {level}/{maxLevels}</div>
          </div>
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
                  fullReset(d);
                }}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              if (phase === "idle") startGame();
              else pauseToggle();
            }}
          >
            {phase === "playing" ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {phase === "idle" ? "Start" : "Resume"}
              </>
            )}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={restartGame}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => setSoundOn((s) => !s)}>
            {soundOn ? (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Sound
              </>
            ) : (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                Muted
              </>
            )}
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <>
                <Minimize className="mr-2 h-4 w-4" />
                Exit
              </>
            ) : (
              <>
                <Maximize className="mr-2 h-4 w-4" />
                Full
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Quick keys</div>
          <div className="mt-1">Move: Arrow Keys / A-D • Launch: Space / Tap • Pause: P • Restart: R</div>
        </div>
      </div>
    </div>
  );

  const below = (
    <div className="space-y-10">
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Deflect the plasma ball with your ship (paddle) to break asteroid bricks. Clear the entire sector to advance.
            Grab power-ups to gain an edge.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Move</strong>: drag on the game area (mouse/touch), or use Arrow Keys / A-D.</li>
            <li><strong>Launch</strong>: Space or tap the game area (first ball starts “stuck” to the paddle).</li>
            <li><strong>Power-ups</strong>: Expand paddle, Multi-ball, Slow motion, Extra life.</li>
            <li><strong>Win</strong>: clear all sectors up to Sector {maxLevels}.</li>
          </ul>
        </div>
      </section>

      <section id="mobile" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Mobile play</h2>
        <div className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            This game is fully playable on mobile: drag your finger anywhere on the game area to move the paddle.
            Tap to launch. Use the on-screen left/right buttons if you prefer.
          </p>
        </div>
      </section>

      <section id="tips" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Tips</h2>
        <div className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <ul className="list-disc pl-6 space-y-2">
            <li>Aim the ball by hitting with the left or right side of the paddle.</li>
            <li>Multi-ball clears bricks quickly, but keeping at least one ball in play is the priority.</li>
            <li>Slow motion is strongest when the ball speed ramps up on later sectors.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  function nudge(dir: "left" | "right", active: boolean) {
    if (dir === "left") keysRef.current.left = active;
    if (dir === "right") keysRef.current.right = active;
  }

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[
        { id: "how-to-play", label: "How to play" },
        { id: "mobile", label: "Mobile play" },
        { id: "tips", label: "Tips" },
      ]}
    >
      <div className="w-full">
        <div
          ref={containerRef}
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/40 p-3 md:p-4 shadow-lg"
        >
          <div className="flex items-center justify-between gap-3 px-1 pb-3">
            <div className="text-sm text-slate-200/90">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900/40 px-3 py-1">
                <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                Astro Breakout
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => {
                  if (phase === "idle") setShowStartModal(true);
                  else pauseToggle();
                }}
              >
                {phase === "playing" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {phase === "idle" ? "Start" : "Resume"}
                  </>
                )}
              </Button>

              <Button type="button" variant="outline" className="h-9" onClick={() => launchBall()}>
                Launch
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              tabIndex={0}
              className="w-full rounded-2xl border border-slate-200/40 dark:border-slate-800 bg-slate-950 outline-none"
              onPointerDown={(e) => {
                (e.currentTarget as HTMLCanvasElement).focus();
                pointerRef.current.active = true;
                const x = pointerToWorldX(e.clientX);
                pointerRef.current.x = x;
                setPaddleTarget(x);

                if (phase === "playing") {
                  const hasStuck = ballRef.current.some((b) => b.stuck);
                  if (hasStuck) launchBall();
                }
              }}
              onPointerMove={(e) => {
                if (!pointerRef.current.active) return;
                const x = pointerToWorldX(e.clientX);
                pointerRef.current.x = x;
                setPaddleTarget(x);
              }}
              onPointerUp={() => {
                pointerRef.current.active = false;
              }}
              onPointerCancel={() => {
                pointerRef.current.active = false;
              }}
              onPointerLeave={() => {
                pointerRef.current.active = false;
              }}
            />

            <div className="mt-3 w-full grid grid-cols-2 gap-3 md:hidden">
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onPointerDown={() => nudge("left", true)}
                onPointerUp={() => nudge("left", false)}
                onPointerCancel={() => nudge("left", false)}
                onPointerLeave={() => nudge("left", false)}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Left
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onPointerDown={() => nudge("right", true)}
                onPointerUp={() => nudge("right", false)}
                onPointerCancel={() => nudge("right", false)}
                onPointerLeave={() => nudge("right", false)}
              >
                Right
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {phase === "idle" && !showStartModal ? (
              <div className="mt-4 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ready when you are</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Click Start to begin. Then press Space or tap to launch the ball.
                    </div>
                  </div>
                  <Button type="button" onClick={startGame} className="shrink-0">
                    Start
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {showStartModal ? (
          <Modal
            title="Ready to play"
            subtitle="Choose difficulty, then start. You can close this anytime."
            onClose={() => setShowStartModal(false)}
          >
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty</div>
                <div className="mt-2 flex gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={difficulty === d ? "default" : "outline"}
                      className="h-10 px-4"
                      onClick={() => {
                        setDifficulty(d);
                        fullReset(d);
                      }}
                    >
                      {d[0].toUpperCase() + d.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Controls</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  Move: drag (mouse/touch) or Arrow Keys / A-D. Launch: Space or tap. Pause: P.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button type="button" onClick={startGame} className="h-11">
                  Start Game
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => {
                    setShowStartModal(false);
                    setPhaseSafe("idle");
                    requestAnimationFrame(() => canvasRef.current?.focus());
                  }}
                >
                  Not now
                </Button>
              </div>
            </div>
          </Modal>
        ) : null}

        {showEndModal ? (
          <Modal
            title={endTitle}
            subtitle={endSubtitle}
            onClose={() => setShowEndModal(false)}
            footer={
              <div className="grid grid-cols-2 gap-2">
                {phase === "levelClear" ? (
                  <>
                    <Button type="button" className="h-11" onClick={nextLevel}>
                      Next sector
                    </Button>
                    <Button type="button" variant="outline" className="h-11" onClick={restartGame}>
                      Restart
                    </Button>
                  </>
                ) : phase === "won" ? (
                  <>
                    <Button type="button" className="h-11" onClick={restartGame}>
                      Play again
                    </Button>
                    <Button type="button" variant="outline" className="h-11" onClick={() => setShowEndModal(false)}>
                      Close
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" className="h-11" onClick={restartGame}>
                      Restart
                    </Button>
                    <Button type="button" variant="outline" className="h-11" onClick={() => setShowEndModal(false)}>
                      Close
                    </Button>
                  </>
                )}
              </div>
            }
          >
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Summary</div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
                <div>Score: {score}</div>
                <div>Best: {bestScore}</div>
                <div>Lives: {lives}</div>
                <div>Sector: {level}/{maxLevels}</div>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </GamePageLayout>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-[min(92vw,640px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-7">
        <div
          className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl pointer-events-none"
          aria-hidden
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                Astro Breakout
              </div>
              <h3 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h3>
              {subtitle ? <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
            </div>

            <Button type="button" variant="outline" className="h-10 px-3" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export const gameMeta = {
  slug: "astro-breakout",
  title: "Astro Breakout",
  description: "Breakout with a cosmic vibe. Power-ups, multiple sectors, mobile + desktop controls.",
  comingSoon: false,
};
