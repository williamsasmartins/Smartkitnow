import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import StartOverlay from "./StartOverlay";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Gauge,
  Heart,
  Layers,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type EndState = "win" | "lose" | null;
type PowerUpType = "expand" | "slow" | "life" | "multi";

const BASE_W = 900;
const BASE_H = 600;

type Ball = { x: number; y: number; vx: number; vy: number; r: number };
type Brick = { x: number; y: number; w: number; h: number; hp: number; maxHp: number; alive: boolean };
type PowerUp = { x: number; y: number; vy: number; type: PowerUpType; alive: boolean };
type Star = { x: number; y: number; r: number; v: number; a: number };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rectCircleHit(rx: number, ry: number, rw: number, rh: number, cx: number, cy: number, cr: number) {
  const px = clamp(cx, rx, rx + rw);
  const py = clamp(cy, ry, ry + rh);
  const dx = cx - px;
  const dy = cy - py;
  return dx * dx + dy * dy <= cr * cr;
}

function tone(ctx: AudioContext, freq: number, ms: number, type: OscillatorType = "sine", gain = 0.18) {
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
}

export default function AstroBreakout({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Astro Breakout";
  const pageDescription =
    description ??
    "Break bricks in deep space. Catch power-ups, chain combos, and climb levels. Use Arrow keys or A/D — on mobile, drag the paddle.";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioRef = useRef<AudioContext | null>(null);

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState<number>(() => {
    const v = Number(localStorage.getItem("skn_astro_breakout_high") || "0");
    return Number.isFinite(v) ? v : 0;
  });

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [end, setEnd] = useState<EndState>(null);
  const [overlayOpen, setOverlayOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const keysRef = useRef({ left: false, right: false });
  const pointerRef = useRef({ active: false, x: BASE_W / 2 });

  const paddleRef = useRef({ x: BASE_W / 2, y: BASE_H - 42, w: 160, h: 16 });
  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const powerRef = useRef<PowerUp[]>([]);
  const starsRef = useRef<Star[]>([]);
  const effectRef = useRef({ expandUntil: 0, slowUntil: 0 });

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const accRef = useRef<number>(0);

  const speeds = useMemo(() => {
    if (difficulty === "easy") return { ball: 430, paddle: 900, lives: 4 };
    if (difficulty === "hard") return { ball: 560, paddle: 1050, lives: 3 };
    return { ball: 500, paddle: 980, lives: 3 };
  }, [difficulty]);

  // responsive canvas sizing (stable, not dependent on scroll position)
  const [redrawTick, setRedrawTick] = useState(0);
  useEffect(() => {
    const onResize = () => setRedrawTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => setRedrawTick((t) => t + 1));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  function ensureAudio() {
    if (!soundOn) return null;
    const ctx = audioRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
    audioRef.current = ctx;
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }

  function resetStars() {
    starsRef.current = Array.from({ length: 140 }).map(() => ({
      x: rand(0, BASE_W),
      y: rand(0, BASE_H),
      r: rand(0.6, 1.8),
      v: rand(20, 90),
      a: rand(0.15, 0.7),
    }));
  }

  function makeBricks(lv: number) {
    const cols = 10;
    const baseRows = 6;
    const rows = clamp(baseRows + (lv - 1), 6, 10);

    const padX = 60;
    const topY = 70;
    const gap = 10;

    const areaW = BASE_W - padX * 2;
    const brickW = (areaW - gap * (cols - 1)) / cols;
    const brickH = 22;

    const hpBase = lv <= 2 ? 1 : lv <= 5 ? 2 : 3;

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * (brickW + gap);
        const y = topY + r * (brickH + gap);
        const hp = clamp(hpBase + (r >= rows - 2 ? 1 : 0), 1, 4);
        bricks.push({ x, y, w: brickW, h: brickH, hp, maxHp: hp, alive: true });
      }
    }
    bricksRef.current = bricks;
  }

  function resetBallAndPaddle(lv: number) {
    const p = paddleRef.current;
    p.w = 160;
    p.h = 16;
    p.x = BASE_W / 2;
    p.y = BASE_H - 42;

    const angle = rand(-0.9, -0.35);
    const sp = speeds.ball + (lv - 1) * 20;
    const vx = Math.cos(angle) * sp;
    const vy = Math.sin(angle) * sp;

    ballsRef.current = [{ x: p.x, y: p.y - 18, vx, vy, r: 8 }];
    powerRef.current = [];
    effectRef.current = { expandUntil: 0, slowUntil: 0 };
  }

  function hardReset(nextDifficulty?: Difficulty) {
    const d = nextDifficulty ?? difficulty;
    setDifficulty(d);
    setStarted(false);
    setPaused(false);
    setEnd(null);
    setOverlayOpen(true);

    const initialLives = d === "easy" ? 4 : 3;
    setLives(initialLives);
    setScore(0);
    setLevel(1);

    resetStars();
    makeBricks(1);
    resetBallAndPaddle(1);
  }

  function startGame() {
    setOverlayOpen(false);
    setStarted(true);
    setPaused(false);
    setEnd(null);
    requestAnimationFrame(() => canvasRef.current?.focus());
  }

  function nextLevel() {
    const lv = level + 1;
    setLevel(lv);
    makeBricks(lv);
    resetBallAndPaddle(lv);
    const ctx = ensureAudio();
    if (ctx) tone(ctx, 1046, 220, "sawtooth", 0.16);
  }

  function addScore(pts: number) {
    setScore((s) => {
      const ns = s + pts;
      if (ns > high) {
        setHigh(ns);
        localStorage.setItem("skn_astro_breakout_high", String(ns));
      }
      return ns;
    });
  }

  // Keyboard controls
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const code = e.code;

      if (code === "ArrowLeft" || code === "KeyA") {
        e.preventDefault();
        keysRef.current.left = true;
      } else if (code === "ArrowRight" || code === "KeyD") {
        e.preventDefault();
        keysRef.current.right = true;
      } else if (code === "KeyP") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (code === "KeyR") {
        e.preventDefault();
        hardReset();
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const code = e.code;
      if (code === "ArrowLeft" || code === "KeyA") keysRef.current.left = false;
      if (code === "ArrowRight" || code === "KeyD") keysRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("keyup", onKeyUp as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, level, high, soundOn]);

  // Touch / pointer: drag paddle
  function bindPointerToPaddle(clientX: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width; // 0..1
    pointerRef.current.x = clamp(x * BASE_W, 0, BASE_W);
  }

  function spawnPowerUp(x: number, y: number) {
    const types: PowerUpType[] = ["expand", "slow", "life", "multi"];
    const type = pick(types);
    powerRef.current.push({ x, y, vy: 240, type, alive: true });
  }

  function applyPowerUp(type: PowerUpType, nowSec: number) {
    const p = paddleRef.current;
    const ctx = ensureAudio();
    if (ctx) tone(ctx, 880, 110, "triangle", 0.14);

    if (type === "life") {
      setLives((v) => Math.min(9, v + 1));
      return;
    }

    if (type === "expand") {
      p.w = 220;
      effectRef.current.expandUntil = nowSec + 12;
      return;
    }

    if (type === "slow") {
      effectRef.current.slowUntil = nowSec + 10;
      return;
    }

    if (type === "multi") {
      // spawn 2 extra balls with slightly different angles
      const balls = ballsRef.current;
      if (!balls.length) return;
      const b = balls[0];
      const sp = Math.hypot(b.vx, b.vy);
      const a1 = Math.atan2(b.vy, b.vx) - 0.35;
      const a2 = Math.atan2(b.vy, b.vx) + 0.35;
      balls.push({ x: b.x, y: b.y, vx: Math.cos(a1) * sp, vy: Math.sin(a1) * sp, r: b.r });
      balls.push({ x: b.x, y: b.y, vx: Math.cos(a2) * sp, vy: Math.sin(a2) * sp, r: b.r });
      ballsRef.current = balls;
    }
  }

  function update(dt: number, nowSec: number) {
    if (!started || paused || end) return;

    const p = paddleRef.current;
    const left = keysRef.current.left;
    const right = keysRef.current.right;

    // Paddle movement
    let vx = 0;
    if (left) vx -= speeds.paddle;
    if (right) vx += speeds.paddle;

    if (pointerRef.current.active) {
      // ease towards pointer x
      const target = pointerRef.current.x;
      const diff = target - p.x;
      vx = clamp(diff * 10, -speeds.paddle * 1.2, speeds.paddle * 1.2);
    }

    p.x += vx * dt;
    const half = p.w / 2;
    p.x = clamp(p.x, half + 6, BASE_W - half - 6);

    // effects expiration
    if (effectRef.current.expandUntil && nowSec > effectRef.current.expandUntil) {
      p.w = 160;
      effectRef.current.expandUntil = 0;
    }

    const slowActive = effectRef.current.slowUntil && nowSec < effectRef.current.slowUntil;

    // Balls
    const balls = ballsRef.current;
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      const slowFactor = slowActive ? 0.72 : 1;
      b.x += b.vx * dt * slowFactor;
      b.y += b.vy * dt * slowFactor;

      // Walls
      if (b.x - b.r < 8) {
        b.x = 8 + b.r;
        b.vx *= -1;
        const ctx = ensureAudio();
        if (ctx) tone(ctx, 520, 60, "square", 0.08);
      } else if (b.x + b.r > BASE_W - 8) {
        b.x = BASE_W - 8 - b.r;
        b.vx *= -1;
        const ctx = ensureAudio();
        if (ctx) tone(ctx, 520, 60, "square", 0.08);
      }
      if (b.y - b.r < 8) {
        b.y = 8 + b.r;
        b.vy *= -1;
        const ctx = ensureAudio();
        if (ctx) tone(ctx, 620, 60, "square", 0.08);
      }

      // Paddle collision
      const prx = p.x - p.w / 2;
      const pry = p.y - p.h / 2;
      if (b.vy > 0 && rectCircleHit(prx, pry, p.w, p.h, b.x, b.y, b.r)) {
        // reflect with angle based on hit position
        const hit = (b.x - p.x) / (p.w / 2);
        const ang = (-Math.PI / 2) + hit * (Math.PI / 3.2);
        const sp = Math.max(speeds.ball * 0.92, Math.hypot(b.vx, b.vy));
        b.vx = Math.cos(ang) * sp;
        b.vy = Math.sin(ang) * sp;

        b.y = pry - b.r - 0.5;

        const ctx = ensureAudio();
        if (ctx) tone(ctx, 740, 70, "triangle", 0.10);
      }

      // Brick collisions
      const bricks = bricksRef.current;
      for (const br of bricks) {
        if (!br.alive) continue;
        if (!rectCircleHit(br.x, br.y, br.w, br.h, b.x, b.y, b.r)) continue;

        // decide axis: compare penetration
        const cx = clamp(b.x, br.x, br.x + br.w);
        const cy = clamp(b.y, br.y, br.y + br.h);
        const dx = b.x - cx;
        const dy = b.y - cy;

        if (Math.abs(dx) > Math.abs(dy)) b.vx *= -1;
        else b.vy *= -1;

        br.hp -= 1;
        addScore(50);

        const ctx = ensureAudio();
        if (ctx) tone(ctx, 900, 45, "sine", 0.09);

        if (br.hp <= 0) {
          br.alive = false;
          addScore(90);

          // chance drop power-up
          if (Math.random() < 0.11) spawnPowerUp(br.x + br.w / 2, br.y + br.h / 2);
        }
        break; // avoid multiple brick hits in one step
      }

      // Ball lost
      if (b.y - b.r > BASE_H + 18) {
        balls.splice(i, 1);
      }
    }

    ballsRef.current = balls;

    if (ballsRef.current.length === 0) {
      // lose life
      setLives((lv) => {
        const next = lv - 1;
        if (next <= 0) {
          setEnd("lose");
          setStarted(false);
          setOverlayOpen(true);
          return 0;
        }
        // respawn
        resetBallAndPaddle(level);
        return next;
      });
    }

    // Power-ups falling
    const pu = powerRef.current;
    for (const pU of pu) {
      if (!pU.alive) continue;
      pU.y += pU.vy * dt;

      const prx = paddleRef.current.x - paddleRef.current.w / 2;
      const pry = paddleRef.current.y - paddleRef.current.h / 2;

      if (pU.y > BASE_H + 40) pU.alive = false;
      if (pU.alive && pU.x > prx && pU.x < prx + paddleRef.current.w && pU.y > pry && pU.y < pry + paddleRef.current.h) {
        pU.alive = false;
        applyPowerUp(pU.type, nowSec);
        addScore(120);
      }
    }
    powerRef.current = pu.filter((x) => x.alive);

    // Win check
    if (bricksRef.current.every((b) => !b.alive)) {
      setEnd("win");
      setStarted(false);
      setOverlayOpen(true);
      const ctx = ensureAudio();
      if (ctx) tone(ctx, 1046, 220, "sawtooth", 0.14);
    }

    // Stars drift
    for (const s of starsRef.current) {
      s.y += s.v * dt;
      if (s.y > BASE_H + 4) {
        s.y = -4;
        s.x = rand(0, BASE_W);
        s.v = rand(20, 90);
        s.r = rand(0.6, 1.8);
        s.a = rand(0.15, 0.7);
      }
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewportH = window.visualViewport?.height ?? window.innerHeight;

    const cw = Math.max(320, Math.floor(container.clientWidth));
    const maxW = Math.min(980, cw);
    const maxH = Math.min(740, Math.floor(viewportH * 0.62));

    // keep aspect ratio BASE_W:BASE_H
    let w = maxW;
    let h = Math.round(w * (BASE_H / BASE_W));
    if (h > maxH) {
      h = maxH;
      w = Math.round(h * (BASE_W / BASE_H));
    }

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const scale = w / BASE_W;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

    // background
    ctx.fillStyle = "#050914";
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    // nebula glow
    const neb = ctx.createRadialGradient(BASE_W * 0.25, BASE_H * 0.2, 10, BASE_W * 0.25, BASE_H * 0.2, 560);
    neb.addColorStop(0, "rgba(92,130,238,0.30)");
    neb.addColorStop(0.5, "rgba(168,85,247,0.14)");
    neb.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = neb;
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    // stars
    for (const s of starsRef.current) {
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // bricks
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      const hpRatio = b.hp / b.maxHp;

      const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
      grad.addColorStop(0, hpRatio > 0.66 ? "rgba(92,130,238,0.95)" : hpRatio > 0.33 ? "rgba(168,85,247,0.92)" : "rgba(245,158,11,0.92)");
      grad.addColorStop(1, "rgba(15,23,42,0.55)");

      ctx.fillStyle = grad;
      if ((ctx as any).roundRect) {
        ctx.beginPath();
        (ctx as any).roundRect(b.x, b.y, b.w, b.h, 8);
        ctx.fill();
      } else {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      ctx.strokeStyle = "rgba(92,130,238,0.35)";
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }

    // power-ups
    for (const pU of powerRef.current) {
      ctx.fillStyle =
        pU.type === "life"
          ? "rgba(239,68,68,0.95)"
          : pU.type === "expand"
            ? "rgba(59,130,246,0.95)"
            : pU.type === "slow"
              ? "rgba(168,85,247,0.95)"
              : "rgba(34,197,94,0.95)";
      ctx.beginPath();
      ctx.arc(pU.x, pU.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // paddle
    const p = paddleRef.current;
    const px = p.x - p.w / 2;
    const py = p.y - p.h / 2;
    const pGrad = ctx.createLinearGradient(px, py, px + p.w, py + p.h);
    pGrad.addColorStop(0, "rgba(92,130,238,0.95)");
    pGrad.addColorStop(1, "rgba(168,85,247,0.85)");
    ctx.fillStyle = pGrad;
    if ((ctx as any).roundRect) {
      ctx.beginPath();
      (ctx as any).roundRect(px, py, p.w, p.h, 10);
      ctx.fill();
    } else {
      ctx.fillRect(px, py, p.w, p.h);
    }

    // balls
    for (const b of ballsRef.current) {
      const glow = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, 26);
      glow.addColorStop(0, "rgba(245,158,11,0.9)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(245,158,11,0.98)";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD inside canvas
    ctx.fillStyle = "rgba(226,232,240,0.85)";
    ctx.font = "600 14px ui-sans-serif, system-ui, -apple-system";
    ctx.fillText(`Level ${level}`, 16, 22);
    ctx.fillText(`Lives ${lives}`, 100, 22);
    ctx.fillText(`Score ${score}`, 190, 22);

    if (!started && !end && !overlayOpen) {
      ctx.fillStyle = "rgba(226,232,240,0.70)";
      ctx.font = "600 16px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Press Start to play.", 16, BASE_H - 18);
    }
  }

  // main loop
  useEffect(() => {
    const step = 1 / 120;

    function tick(now: number) {
      if (!lastRef.current) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;

      accRef.current += dt;
      const nowSec = now / 1000;

      while (accRef.current > step) {
        update(step, nowSec);
        accRef.current -= step;
      }

      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
      accRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, paused, end, difficulty, level, lives, score, soundOn, redrawTick]);

  // init once
  useEffect(() => {
    resetStars();
    makeBricks(1);
    resetBallAndPaddle(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusText = useMemo(() => {
    if (end === "win") return "Level cleared!";
    if (end === "lose") return "Game over!";
    if (paused) return "Paused";
    if (!started) return "Ready";
    return "Playing";
  }, [end, paused, started]);

  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>

      <div className="mt-4 space-y-3">
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
                  hardReset(d);
                }}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{statusText}</div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><Layers className="h-4 w-4" /> Level {level}</span>
            <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4" /> Lives {lives}</span>
            <span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4" /> Score {score}</span>
            <span>High {high}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => setPaused((p) => !p)}>
            {paused ? <><Play className="mr-2 h-4 w-4" /> Resume</> : <><Pause className="mr-2 h-4 w-4" /> Pause</>}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => hardReset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setSoundOn((s) => !s)}
        >
          {soundOn ? <><Volume2 className="mr-2 h-4 w-4" /> Sound on</> : <><VolumeX className="mr-2 h-4 w-4" /> Sound off</>}
        </Button>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Controls: Arrow keys or A/D. P to pause. R to restart. On mobile: drag the paddle.
        </div>
      </div>
    </div>
  );

  const below = (
    <div className="space-y-10">
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>Break all bricks to clear the level. Catch power-ups to chain faster clears and higher scores.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><b>Desktop:</b> Arrow keys or A/D to move.</li>
            <li><b>Mobile:</b> drag the paddle with your finger.</li>
            <li><b>P</b> toggles pause. <b>R</b> restarts.</li>
          </ul>
        </div>
      </section>

      <section id="power-ups" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Power-ups</h2>
        <div className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          Expand paddle, Slow motion, Extra life, and Multi-ball can drop after brick breaks. Catch them with the paddle.
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
      onThisPage={[
        { id: "how-to-play", label: "How to play" },
        { id: "power-ups", label: "Power-ups" },
      ]}
    >
      <div className="flex flex-col items-center">
        <div ref={containerRef} className="w-full max-w-[980px]">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            onPointerDown={(e) => {
              pointerRef.current.active = true;
              bindPointerToPaddle(e.clientX);
              canvasRef.current?.focus();
            }}
            onPointerMove={(e) => {
              if (!pointerRef.current.active) return;
              bindPointerToPaddle(e.clientX);
            }}
            onPointerUp={() => (pointerRef.current.active = false)}
            onPointerCancel={() => (pointerRef.current.active = false)}
            className="rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-950 touch-none"
          />
        </div>

        {/* Mobile buttons (optional but useful) */}
        <div className="mt-4 flex gap-2 sm:hidden">
          <Button
            type="button"
            variant="outline"
            className="w-28"
            onPointerDown={() => (keysRef.current.left = true)}
            onPointerUp={() => (keysRef.current.left = false)}
            onPointerCancel={() => (keysRef.current.left = false)}
          >
            Left
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-28"
            onPointerDown={() => (keysRef.current.right = true)}
            onPointerUp={() => (keysRef.current.right = false)}
            onPointerCancel={() => (keysRef.current.right = false)}
          >
            Right
          </Button>
        </div>

        <div className="mt-4 flex w-full max-w-[980px] gap-2">
          <Button type="button" className="w-full" onClick={() => startGame()} disabled={started && !end}>
            Start Game
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => hardReset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Start / End overlays */}
        <StartOverlay open={overlayOpen && !started && !paused && !end} onClose={() => setOverlayOpen(false)}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="h-4 w-4 text-[#5c82ee]" />
            Astro Breakout
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ready to play</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Click Start to begin. Use Arrow keys or A/D. On mobile, drag the paddle.
          </p>

          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Difficulty</div>
            <div className="mt-2 flex gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={difficulty === d ? "default" : "outline"}
                  className="h-9 px-3"
                  onClick={() => hardReset(d)}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" className="w-full" onClick={() => startGame()}>
              Start Game
            </Button>
          </div>
        </StartOverlay>

        <StartOverlay open={overlayOpen && !started && !!end} onClose={() => setOverlayOpen(false)}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="h-4 w-4 text-[#5c82ee]" />
            {end === "win" ? "Level cleared" : "Game over"}
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {end === "win" ? "Great job!" : "Try again"}
          </h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {end === "win"
              ? "You cleared all bricks. Advance to the next level or replay."
              : "You ran out of lives. Restart to try again."}
          </p>

          <div className="mt-6 flex gap-2">
            {end === "win" ? (
              <Button type="button" className="w-full" onClick={() => { setEnd(null); nextLevel(); setStarted(true); setOverlayOpen(false); }}>
                Next Level
              </Button>
            ) : (
              <Button type="button" className="w-full" onClick={() => { setEnd(null); hardReset(); }}>
                Restart
              </Button>
            )}
            <Button type="button" variant="outline" className="w-full" onClick={() => setOverlayOpen(false)}>
              Close
            </Button>
          </div>
        </StartOverlay>
      </div>
    </GamePageLayout>
  );
}
