import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
  Heart,
  Trophy,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "menu" | "playing" | "paused" | "gameover";

type Vec = { x: number; y: number };

type Brick = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  hue: number;
};

type Orb = {
  id: string;
  x: number;
  y: number;
  r: number;
  kind: "energy" | "score";
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  hue: number;
  a: number;
};

const LS_BEST = "skn_game_brick_dash_best_v1";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function aabb(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

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

function safeRequestFullscreen(el: HTMLElement | null) {
  if (!el) return false;
  const anyEl = el as any;
  if (anyEl.requestFullscreen) {
    anyEl.requestFullscreen();
    return true;
  }
  if (anyEl.webkitRequestFullscreen) {
    anyEl.webkitRequestFullscreen();
    return true;
  }
  return false;
}

function safeExitFullscreen() {
  const d: any = document;
  if (document.fullscreenElement) return document.exitFullscreen();
  if (d.webkitFullscreenElement && d.webkitExitFullscreen) return d.webkitExitFullscreen();
}

export default function BrickDash({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Brick Dash";
  const pageDescription =
    description ??
    "Dodge falling brick walls and dash through tight gaps. Build combos, collect energy orbs, and survive as the speed ramps up. Fully playable on desktop and mobile.";

  // World dimensions (fixed). We scale/letterbox into the canvas.
  const WORLD_W = 900;
  const WORLD_H = 560;

  const COLS = 14;
  const CELL_W = WORLD_W / COLS;
  const ROW_H = 34;

  const DASH_COST = 35;
  const DASH_TIME = 0.22; // seconds
  const IFRAME_TIME = 1.0; // seconds

  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioRef = useRef<AudioContext | null>(null);

  const inputRef = useRef({
    left: false,
    right: false,
    dash: false,
    pointerActive: false,
    pointerTargetX: 0,
  });

  const viewRef = useRef({
    cssW: 900,
    cssH: 560,
    dpr: 1,
    scale: 1,
    offX: 0,
    offY: 0,
  });

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [menuOpen, setMenuOpen] = useState(true);
  const [theater, setTheater] = useState(false);

  const [soundOn, setSoundOn] = useState(true);

  const [scoreUI, setScoreUI] = useState(0);
  const [bestUI, setBestUI] = useState(0);
  const [livesUI, setLivesUI] = useState(3);
  const [levelUI, setLevelUI] = useState(1);
  const [energyUI, setEnergyUI] = useState(100);
  const [comboUI, setComboUI] = useState(1);

  const [hint, setHint] = useState<string | null>(null);

  const best = useMemo(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(LS_BEST) : null;
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  }, []);

  useEffect(() => {
    setBestUI(best);
  }, [best]);

  const cfg = useMemo(() => {
    // tuning per difficulty
    if (difficulty === "easy") {
      return {
        baseSpeed: 150,
        speedRamp: 10,
        orbRate: 0.16,
        energyRegen: 26,
        comboDecay: 0.65,
        lives: 4,
      };
    }
    if (difficulty === "hard") {
      return {
        baseSpeed: 210,
        speedRamp: 16,
        orbRate: 0.10,
        energyRegen: 18,
        comboDecay: 0.9,
        lives: 3,
      };
    }
    return {
      baseSpeed: 180,
      speedRamp: 13,
      orbRate: 0.13,
      energyRegen: 22,
      comboDecay: 0.75,
      lives: 3,
    };
  }, [difficulty]);

  const gameRef = useRef({
    t: 0,
    speed: 180,
    score: 0,
    best: best,
    level: 1,
    lives: 3,

    combo: 1,
    comboHold: 0, // seconds remaining before combo decays

    energy: 100,
    dashT: 0,
    iframes: 0,

    player: {
      x: WORLD_W / 2,
      y: WORLD_H - 70,
      w: 54,
      h: 22,
      vx: 0,
    },

    bricks: [] as Brick[],
    orbs: [] as Orb[],
    particles: [] as Particle[],

    spawnY: -200,
    nextRowAt: 0,
    starfield: Array.from({ length: 80 }).map(() => ({
      x: Math.random() * WORLD_W,
      y: Math.random() * WORLD_H,
      s: 0.6 + Math.random() * 1.8,
      a: 0.25 + Math.random() * 0.6,
    })),

    lastSafeGapCol: 6,
  });

  function ensureAudio() {
    if (!soundOn) return null;
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as any;
    if (!Ctx) return null;
    const ctx = audioRef.current ?? new Ctx();
    audioRef.current = ctx;
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx as AudioContext;
  }

  function beep(freq: number, ms: number, type: OscillatorType = "sine", gain = 0.16) {
    const ctx = ensureAudio();
    if (!ctx) return;
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

  function setHintTemp(text: string, ms = 1400) {
    setHint(text);
    window.setTimeout(() => setHint(null), ms);
  }

  function resetGame(nextDifficulty?: Difficulty) {
    const g = gameRef.current;
    if (nextDifficulty) setDifficulty(nextDifficulty);

    g.t = 0;
    g.speed = cfg.baseSpeed;
    g.score = 0;
    g.best = bestUI || g.best || 0;
    g.level = 1;
    g.lives = cfg.lives;

    g.combo = 1;
    g.comboHold = 0;

    g.energy = 100;
    g.dashT = 0;
    g.iframes = 0;

    g.player.x = WORLD_W / 2;
    g.player.y = WORLD_H - 70;
    g.player.vx = 0;

    g.bricks = [];
    g.orbs = [];
    g.particles = [];

    g.spawnY = -220;
    g.nextRowAt = 0;
    g.lastSafeGapCol = 6;

    setScoreUI(0);
    setLivesUI(cfg.lives);
    setLevelUI(1);
    setEnergyUI(100);
    setComboUI(1);

    setPhase("menu");
    setMenuOpen(true);
  }

  function startGame() {
    const g = gameRef.current;
    g.lives = cfg.lives;
    setLivesUI(cfg.lives);

    setPhase("playing");
    setMenuOpen(false);

    // user gesture -> unlock audio
    beep(660, 60, "triangle", 0.12);

    setHintTemp("Tip: Drag on the playfield on mobile. Space / W / ↑ to dash.", 1700);
  }

  function pauseToggle() {
    setPhase((p) => (p === "playing" ? "paused" : p === "paused" ? "playing" : p));
  }

  function tryDash() {
    const g = gameRef.current;
    if (phase !== "playing") return;
    if (g.dashT > 0) return;
    if (g.energy < DASH_COST) {
      setHintTemp("Not enough energy for dash.", 900);
      beep(180, 70, "sine", 0.08);
      return;
    }
    g.energy = clamp(g.energy - DASH_COST, 0, 100);
    g.dashT = DASH_TIME;

    // Dash boosts combo timer too
    g.comboHold = Math.max(g.comboHold, 0.7);

    beep(880, 90, "square", 0.14);
  }

  function updateCanvasSize() {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const rect = stage.getBoundingClientRect();
    const cssW = Math.max(320, rect.width);
    const cssH = Math.max(300, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // compute world scale + letterbox
    const s = Math.min(cssW / WORLD_W, cssH / WORLD_H);
    const offX = (cssW - WORLD_W * s) / 2;
    const offY = (cssH - WORLD_H * s) / 2;

    viewRef.current = { cssW, cssH, dpr, scale: s, offX, offY };
  }

  useEffect(() => {
    updateCanvasSize();
    const ro = new ResizeObserver(() => updateCanvasSize());
    if (stageRef.current) ro.observe(stageRef.current);
    const onResize = () => updateCanvasSize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theater]);

  useEffect(() => {
    function onFsChange() {
      const fs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!fs && theater) {
        // if user exits fullscreen via system UI, keep theater false as well
        setTheater(false);
      }
      updateCanvasSize();
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange" as any, onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange" as any, onFsChange);
    };
  }, [theater]);

  function toggleFullscreen() {
    const wrap = stageWrapRef.current;
    const fs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);

    // Prefer native Fullscreen API when available
    if (!fs) {
      const ok = safeRequestFullscreen(wrap);
      if (!ok) {
        // fallback: theater mode CSS
        setTheater(true);
      }
    } else {
      safeExitFullscreen();
      setTheater(false);
    }

    window.setTimeout(() => updateCanvasSize(), 60);
  }

  // Keyboard input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = (e.key || "").toLowerCase();
      const code = e.code;

      const using =
        code === "ArrowLeft" ||
        code === "ArrowRight" ||
        code === "ArrowUp" ||
        code === "Space" ||
        code === "KeyA" ||
        code === "KeyD" ||
        code === "KeyW" ||
        key === "a" ||
        key === "d" ||
        key === "w" ||
        key === " " ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "arrowup";

      if (using) e.preventDefault();

      if (code === "ArrowLeft" || code === "KeyA" || key === "a" || key === "arrowleft") inputRef.current.left = true;
      if (code === "ArrowRight" || code === "KeyD" || key === "d" || key === "arrowright") inputRef.current.right = true;

      if (code === "Space" || code === "ArrowUp" || code === "KeyW" || key === "w" || key === "arrowup") {
        if (!e.repeat) tryDash();
      }

      if (code === "KeyP" || key === "p") {
        e.preventDefault();
        if (phase === "playing" || phase === "paused") pauseToggle();
      }

      if (code === "Escape") {
        // Close overlays / exit theater
        if (menuOpen) setMenuOpen(false);
        if (phase === "gameover") {
          setMenuOpen(true);
          setPhase("menu");
        }
        const fs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
        if (fs) safeExitFullscreen();
        setTheater(false);
      }

      if (code === "Enter") {
        if (phase === "menu") startGame();
        if (phase === "gameover") {
          resetGame();
        }
      }

      if (code === "KeyR" || key === "r") {
        if (phase === "playing" || phase === "paused" || phase === "gameover") {
          e.preventDefault();
          resetGame();
        }
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const key = (e.key || "").toLowerCase();
      const code = e.code;

      if (code === "ArrowLeft" || code === "KeyA" || key === "a" || key === "arrowleft") inputRef.current.left = false;
      if (code === "ArrowRight" || code === "KeyD" || key === "d" || key === "arrowright") inputRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("keyup", onKeyUp as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, menuOpen, soundOn, difficulty]);

  function spawnRow(y: number) {
    const g = gameRef.current;

    // Create a row with a guaranteed safe gap (2-3 cells)
    const gapW = Math.random() < 0.65 ? 2 : 3;
    const gapCenterBias = 0.7; // pull gaps toward last safe gap
    const target = g.lastSafeGapCol + (Math.random() < 0.5 ? -1 : 1) * Math.floor(rand(0, 2));
    let gapStart = Math.round(clamp(target * gapCenterBias + rand(2, COLS - 3) * (1 - gapCenterBias), 1, COLS - gapW - 1));

    // occasionally force a tighter gap for excitement (still doable with dash)
    if (Math.random() < 0.18) gapW === 3 ? (gapStart += 0) : (gapStart += 0);

    g.lastSafeGapCol = gapStart + Math.floor(gapW / 2);

    const hueBase = rand(210, 300);
    const bricks: Brick[] = [];
    for (let c = 0; c < COLS; c++) {
      if (c >= gapStart && c < gapStart + gapW) continue;

      // sparsify corners sometimes
      const keep = Math.random() < 0.92;
      if (!keep) continue;

      const x = c * CELL_W + 2;
      const w = CELL_W - 4;
      bricks.push({
        id: uid("b"),
        x,
        y,
        w,
        h: ROW_H,
        hp: Math.random() < 0.08 ? 2 : 1,
        hue: hueBase + rand(-18, 18),
      });
    }
    g.bricks.push(...bricks);

    // spawn an orb sometimes (energy / score) inside the gap corridor or nearby
    if (Math.random() < cfg.orbRate) {
      const kind: Orb["kind"] = Math.random() < 0.7 ? "energy" : "score";
      const cx = (gapStart + gapW / 2) * CELL_W + CELL_W / 2 + rand(-CELL_W * 0.35, CELL_W * 0.35);
      const orb: Orb = { id: uid("o"), x: clamp(cx, 22, WORLD_W - 22), y: y + ROW_H / 2, r: kind === "energy" ? 11 : 10, kind };
      g.orbs.push(orb);
    }
  }

  function addParticles(x: number, y: number, hue: number, count: number, strength = 1) {
    const g = gameRef.current;
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: rand(-180, 180) * strength,
        vy: rand(-240, 120) * strength,
        life: rand(0.35, 0.75),
        maxLife: 1,
        r: rand(1.2, 3.2),
        hue: hue + rand(-20, 20),
        a: rand(0.65, 0.95),
      });
    }
  }

  function step(dt: number) {
    const g = gameRef.current;

    if (phase !== "playing") return;

    g.t += dt;

    // speed & level
    g.level = 1 + Math.floor(g.score / 650);
    g.speed = cfg.baseSpeed + g.level * cfg.speedRamp;

    // combo timer (soft decay)
    g.comboHold = Math.max(0, g.comboHold - dt * cfg.comboDecay);
    if (g.comboHold <= 0 && g.combo > 1) {
      g.combo = Math.max(1, g.combo - 1);
      g.comboHold = 0.35;
    }

    // dash / iframes
    g.dashT = Math.max(0, g.dashT - dt);
    g.iframes = Math.max(0, g.iframes - dt);

    // energy regen
    const regen = g.dashT > 0 ? cfg.energyRegen * 0.2 : cfg.energyRegen;
    g.energy = clamp(g.energy + regen * dt, 0, 100);

    // player movement
    const maxSpeed = 420;
    const accel = 2200;
    const friction = 1600;

    let axis = 0;
    if (inputRef.current.left) axis -= 1;
    if (inputRef.current.right) axis += 1;

    // pointer control has priority when active
    if (inputRef.current.pointerActive) {
      const targetX = inputRef.current.pointerTargetX;
      const dx = targetX - g.player.x;
      axis = clamp(dx / 120, -1, 1);
    }

    if (axis !== 0) {
      g.player.vx += axis * accel * dt;
    } else {
      // friction toward 0
      const s = Math.sign(g.player.vx);
      const m = Math.abs(g.player.vx);
      const nm = Math.max(0, m - friction * dt);
      g.player.vx = nm * s;
    }

    g.player.vx = clamp(g.player.vx, -maxSpeed, maxSpeed);
    g.player.x += g.player.vx * dt;

    const pxMin = 18;
    const pxMax = WORLD_W - g.player.w - 18;
    g.player.x = clamp(g.player.x, pxMin, pxMax);

    // spawn brick rows
    g.nextRowAt -= dt * g.speed;
    if (g.nextRowAt <= 0) {
      const y = -ROW_H - rand(0, 60);
      spawnRow(y);
      g.nextRowAt = ROW_H + rand(10, 30);
    }

    // move bricks/orbs down
    const dy = g.speed * dt;
    for (const b of g.bricks) b.y += dy;
    for (const o of g.orbs) o.y += dy;
    for (const p of g.particles) {
      p.vy += 520 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }

    g.particles = g.particles.filter((p) => p.life > 0);

    // scoring: time + bonus for higher level
    g.score += (18 + g.level * 2) * dt;

    // collisions
    const player = g.player;
    const dashOn = g.dashT > 0;

    // Orbs
    for (let i = g.orbs.length - 1; i >= 0; i--) {
      const o = g.orbs[i];
      const hit = aabb(player.x, player.y, player.w, player.h, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      if (hit) {
        if (o.kind === "energy") {
          g.energy = clamp(g.energy + 45, 0, 100);
          g.score += 40 * g.combo;
          g.combo = clamp(g.combo + 1, 1, 6);
          g.comboHold = 1.0;
          beep(1046, 70, "triangle", 0.14);
        } else {
          g.score += 120 * g.combo;
          g.combo = clamp(g.combo + 1, 1, 8);
          g.comboHold = 1.1;
          beep(1318, 70, "sine", 0.14);
        }
        addParticles(o.x, o.y, o.kind === "energy" ? 55 : 200, 18, 1.2);
        g.orbs.splice(i, 1);
      }
    }

    // Bricks
    let hitNonDash = false;
    for (let i = g.bricks.length - 1; i >= 0; i--) {
      const b = g.bricks[i];
      const hit = aabb(player.x, player.y, player.w, player.h, b.x, b.y, b.w, b.h);
      if (!hit) continue;

      if (dashOn) {
        b.hp -= 1;
        g.score += 35 * g.combo;
        g.combo = clamp(g.combo + 1, 1, 10);
        g.comboHold = 1.2;
        addParticles(player.x + player.w / 2, player.y + player.h / 2, b.hue, 22, 1.35);
        beep(520 + b.hue, 45, "square", 0.10);
        if (b.hp <= 0) g.bricks.splice(i, 1);
      } else if (g.iframes <= 0) {
        hitNonDash = true;
        g.iframes = IFRAME_TIME;
        g.lives -= 1;
        g.combo = 1;
        g.comboHold = 0;
        addParticles(player.x + player.w / 2, player.y + player.h / 2, 0, 28, 1.6);
        beep(140, 120, "sawtooth", 0.14);
        break;
      }
    }

    if (hitNonDash) {
      if (g.lives <= 0) {
        // game over
        setPhase("gameover");
        setMenuOpen(true);

        const finalScore = Math.floor(g.score);
        if (finalScore > (bestUI || 0)) {
          window.localStorage.setItem(LS_BEST, String(finalScore));
          setBestUI(finalScore);
        }
        return;
      }
    }

    // cleanup offscreen
    g.bricks = g.bricks.filter((b) => b.y < WORLD_H + 120);
    g.orbs = g.orbs.filter((o) => o.y < WORLD_H + 120);

    // UI snapshot (lightweight)
    setScoreUI(Math.floor(g.score));
    setLivesUI(g.lives);
    setLevelUI(g.level);
    setEnergyUI(Math.floor(g.energy));
    setComboUI(g.combo);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const v = viewRef.current;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(v.dpr, v.dpr);

    // background
    const bg = ctx.createLinearGradient(0, 0, v.cssW, v.cssH);
    bg.addColorStop(0, "rgba(10, 18, 32, 1)");
    bg.addColorStop(1, "rgba(9, 10, 20, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, v.cssW, v.cssH);

    // subtle glow blobs
    ctx.save();
    ctx.globalAlpha = 0.35;
    const g1 = ctx.createRadialGradient(v.cssW * 0.18, v.cssH * 0.15, 10, v.cssW * 0.18, v.cssH * 0.15, v.cssW * 0.42);
    g1.addColorStop(0, "rgba(92,130,238,0.30)");
    g1.addColorStop(1, "rgba(92,130,238,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, v.cssW, v.cssH);

    const g2 = ctx.createRadialGradient(v.cssW * 0.78, v.cssH * 0.2, 10, v.cssW * 0.78, v.cssH * 0.2, v.cssW * 0.46);
    g2.addColorStop(0, "rgba(168,85,247,0.24)");
    g2.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, v.cssW, v.cssH);
    ctx.restore();

    // world transform
    ctx.save();
    ctx.translate(v.offX, v.offY);
    ctx.scale(v.scale, v.scale);

    const g = gameRef.current;

    // starfield
    for (const s of g.starfield) {
      s.y += (g.speed * 0.18 + s.s * 22) * (1 / 60);
      if (s.y > WORLD_H) {
        s.y = -10;
        s.x = Math.random() * WORLD_W;
      }
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }

    // playfield frame
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "rgba(92,130,238,0.35)";
    ctx.lineWidth = 2;
    roundRectPath(ctx, 10, 10, WORLD_W - 20, WORLD_H - 20, 18);
    ctx.stroke();

    // orbs
    for (const o of g.orbs) {
      const hue = o.kind === "energy" ? 55 : 200;
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = `hsla(${hue}, 95%, 60%, 0.6)`;
      ctx.fillStyle = `hsla(${hue}, 95%, 60%, 0.95)`;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = `hsla(${hue}, 95%, 70%, 0.55)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // bricks
    for (const b of g.bricks) {
      const glow = b.hp > 1 ? 0.85 : 0.55;
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = `hsla(${b.hue}, 90%, 60%, ${glow})`;
      const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
      grad.addColorStop(0, `hsla(${b.hue}, 95%, 55%, 0.95)`);
      grad.addColorStop(1, `hsla(${b.hue + 25}, 95%, 50%, 0.92)`);
      ctx.fillStyle = grad;
      roundRectPath(ctx, b.x, b.y, b.w, b.h, 10);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, b.x + 1, b.y + 1, b.w - 2, b.h - 2, 9);
      ctx.stroke();

      if (b.hp > 1) {
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillRect(b.x + 10, b.y + 8, b.w - 20, 4);
      }
    }

    // particles
    for (const p of g.particles) {
      const t = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = t * p.a;
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, 1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // player
    const dashOn = g.dashT > 0;
    const blink = g.iframes > 0 && Math.floor(g.t * 16) % 2 === 0;
    if (!blink) {
      if (dashOn) {
        // trail
        ctx.save();
        ctx.globalAlpha = 0.35;
        for (let i = 1; i <= 5; i++) {
          const tx = g.player.x - g.player.vx * (i * 0.012);
          const ty = g.player.y + i * 2.2;
          const hue = 225 + i * 8;
          ctx.fillStyle = `hsla(${hue}, 95%, 62%, 0.9)`;
          roundRectPath(ctx, tx, ty, g.player.w, g.player.h, 12);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.shadowBlur = dashOn ? 26 : 18;
      ctx.shadowColor = dashOn ? "rgba(92,130,238,0.95)" : "rgba(92,130,238,0.65)";
      const pg = ctx.createLinearGradient(g.player.x, g.player.y, g.player.x + g.player.w, g.player.y + g.player.h);
      pg.addColorStop(0, dashOn ? "rgba(168,85,247,0.95)" : "rgba(92,130,238,0.95)");
      pg.addColorStop(1, dashOn ? "rgba(245,158,11,0.95)" : "rgba(168,85,247,0.85)");
      ctx.fillStyle = pg;
      roundRectPath(ctx, g.player.x, g.player.y, g.player.w, g.player.h, 12);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, g.player.x + 1, g.player.y + 1, g.player.w - 2, g.player.h - 2, 11);
      ctx.stroke();
      ctx.restore();

      // dash aura
      if (dashOn) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = "rgba(245,158,11,0.65)";
        ctx.lineWidth = 3;
        roundRectPath(ctx, g.player.x - 6, g.player.y - 6, g.player.w + 12, g.player.h + 12, 16);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Animation loop: always draw, only step when playing.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = clamp((now - last) / 1000, 0, 0.033);
      last = now;

      if (phase === "playing") step(dt);

      // keep tiny "idle motion" even in menu (stars)
      gameRef.current.t += dt * 0.25;

      draw();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, difficulty, soundOn]);

  // Pointer controls (mobile-friendly): drag inside stage
  function pointerToWorldX(clientX: number) {
    const stage = stageRef.current;
    if (!stage) return WORLD_W / 2;
    const r = stage.getBoundingClientRect();
    const v = viewRef.current;
    const x = clientX - r.left;
    const wx = (x - v.offX) / v.scale;
    return clamp(wx - gameRef.current.player.w / 2, 18, WORLD_W - gameRef.current.player.w - 18);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (phase !== "playing") return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    inputRef.current.pointerActive = true;
    inputRef.current.pointerTargetX = pointerToWorldX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!inputRef.current.pointerActive) return;
    inputRef.current.pointerTargetX = pointerToWorldX(e.clientX);
  }
  function onPointerUp(e: React.PointerEvent) {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    inputRef.current.pointerActive = false;
  }

  // Right rail
  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Score
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{scoreUI}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#5c82ee]" />
              Best
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{bestUI}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              Lives
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{livesUI}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Level
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{levelUI}</span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Dash Energy
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{energyUI}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5c82ee] via-fuchsia-500 to-amber-400"
                style={{ width: `${energyUI}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Combo</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">×{comboUI}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => setSoundOn((s) => !s)} className="justify-start">
            {soundOn ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            {soundOn ? "Sound: On" : "Sound: Off"}
          </Button>

          <Button type="button" variant="outline" onClick={toggleFullscreen} className="justify-start">
            {document.fullscreenElement || (document as any).webkitFullscreenElement || theater ? (
              <Minimize2 className="mr-2 h-4 w-4" />
            ) : (
              <Maximize2 className="mr-2 h-4 w-4" />
            )}
            Fullscreen / Theater
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                if (phase === "playing" || phase === "paused") pauseToggle();
              }}
              disabled={phase !== "playing" && phase !== "paused"}
            >
              {phase === "paused" ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
              {phase === "paused" ? "Resume" : "Pause"}
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={() => resetGame()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => {
              if (phase === "menu") startGame();
              if (phase === "gameover") resetGame();
              if (phase === "paused") setPhase("playing");
            }}
          >
            {phase === "menu" ? "Start Game" : phase === "gameover" ? "New Game" : phase === "paused" ? "Resume" : "Playing"}
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Keyboard</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Move: Arrow Left/Right or A/D</li>
            <li>Dash: Space or W or ↑</li>
            <li>Pause: P</li>
            <li>Reset: R</li>
          </ul>
          <div className="mt-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile</div>
          <div>Drag inside the playfield, or use the on-screen buttons.</div>
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
            Brick walls fall from above. Your goal is to survive as the speed increases. You can <strong>dash</strong> through bricks when you have enough energy.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Move</strong> left/right to line up with the gap.</li>
            <li><strong>Dash</strong> (Space / W / ↑) to break through tight spots and score combo points.</li>
            <li>Collect <strong>energy orbs</strong> to refill dash energy and boost combos.</li>
            <li>Hitting a brick without dashing costs a life. Lose all lives = game over.</li>
          </ul>
        </div>
      </section>

      <section id="tips" className="scroll-mt-28 mt-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Tips</h2>
        <div className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Save your dash for when the gap shifts suddenly. Dashing through bricks increases your combo multiplier fast — but energy is limited, so collect orbs.
          </p>
          <p>
            On mobile, drag your finger across the playfield to position precisely. Fullscreen/Theater mode is recommended for the best experience.
          </p>
        </div>
      </section>
    </div>
  );

  const isFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
  const showTheater = theater && !isFs;

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[
        { id: "how-to-play", label: "How to play" },
        { id: "tips", label: "Tips" },
      ]}
    >
      <div
        ref={stageWrapRef}
        className={[
          "relative",
          showTheater ? "fixed inset-0 z-[60] bg-black/95 p-3 md:p-6" : "",
        ].join(" ")}
      >
        {/* Top mini toolbar (inside the play card) */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              {difficulty.toUpperCase()} · Level {levelUI}
            </span>

            {hint ? (
              <span className="hidden md:inline-flex rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
                {hint}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="h-9 px-3" onClick={() => setSoundOn((s) => !s)}>
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Button type="button" variant="outline" className="h-9 px-3" onClick={toggleFullscreen}>
              {isFs || showTheater ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => {
                if (phase === "playing" || phase === "paused") pauseToggle();
              }}
              disabled={phase !== "playing" && phase !== "paused"}
              title="Pause (P)"
            >
              {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>

            <Button type="button" variant="outline" className="h-9 px-3" onClick={() => resetGame()} title="Reset (R)">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Playfield */}
        <div
          ref={stageRef}
          className={[
            "relative w-full",
            // Make it big on desktop and mobile
            "h-[min(72vh,640px)] min-h-[360px]",
            "rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-lg overflow-hidden",
            "touch-none", // important for mobile drag
          ].join(" ")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* HUD overlay */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 text-xs text-white backdrop-blur">
              <Trophy className="h-4 w-4" />
              <span className="tabular-nums">{scoreUI}</span>
              <span className="mx-1 text-white/40">•</span>
              <Heart className="h-4 w-4 text-rose-400" />
              <span className="tabular-nums">{livesUI}</span>
              <span className="mx-1 text-white/40">•</span>
              <Zap className="h-4 w-4 text-amber-300" />
              <span className="tabular-nums">{energyUI}%</span>
              <span className="mx-1 text-white/40">•</span>
              <span className="tabular-nums">×{comboUI}</span>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="absolute inset-x-0 bottom-3 px-3 md:hidden">
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-white/80"
                onPointerDown={() => (inputRef.current.left = true)}
                onPointerUp={() => (inputRef.current.left = false)}
                onPointerCancel={() => (inputRef.current.left = false)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Left
              </Button>

              <Button type="button" className="h-12" onClick={tryDash}>
                <Zap className="mr-2 h-4 w-4" />
                Dash
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 bg-white/80"
                onPointerDown={() => (inputRef.current.right = true)}
                onPointerUp={() => (inputRef.current.right = false)}
                onPointerCancel={() => (inputRef.current.right = false)}
              >
                Right
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* MENU / GAMEOVER overlay (closable) */}
          {menuOpen ? (
            <div className="absolute inset-0 z-40 grid place-items-center bg-black/45 backdrop-blur-[2px]" role="dialog" aria-modal="true">
              <div className="relative w-[min(92vw,720px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-7 md:p-9">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                  aria-label="Close"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />

                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-200">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Brick Dash
                  </div>

                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {phase === "gameover" ? "Game Over" : "Ready to play"}
                  </h3>

                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {phase === "gameover"
                      ? "Pick a difficulty and start again. Tip: Save dash for emergencies."
                      : "Choose your difficulty. Arrow keys or A/D to move. Space/W/↑ to dash. Drag on mobile."}
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDifficulty("easy");
                        setHintTemp("Easy: slower walls, more forgiveness.");
                        beep(520, 50, "triangle", 0.10);
                      }}
                      className={[
                        "w-full rounded-xl px-5 py-4 text-left transition-all",
                        "border border-slate-200 dark:border-slate-800",
                        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
                        difficulty === "easy" ? "ring-2 ring-emerald-300" : "opacity-90 hover:opacity-100",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold">Easy</div>
                      <div className="text-xs text-white/90 mt-1">Smooth ramp, extra life</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDifficulty("medium");
                        setHintTemp("Medium: balanced speed and scoring.");
                        beep(660, 50, "triangle", 0.10);
                      }}
                      className={[
                        "w-full rounded-xl px-5 py-4 text-left transition-all",
                        "border border-slate-200 dark:border-slate-800",
                        "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
                        difficulty === "medium" ? "ring-2 ring-amber-300" : "opacity-90 hover:opacity-100",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold">Medium</div>
                      <div className="text-xs text-white/90 mt-1">Classic Brick Dash</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDifficulty("hard");
                        setHintTemp("Hard: faster walls, tighter energy.");
                        beep(820, 50, "triangle", 0.10);
                      }}
                      className={[
                        "w-full rounded-xl px-5 py-4 text-left transition-all",
                        "border border-slate-200 dark:border-slate-800",
                        "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-lg",
                        difficulty === "hard" ? "ring-2 ring-rose-300" : "opacity-90 hover:opacity-100",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold">Hard</div>
                      <div className="text-xs text-white/90 mt-1">High risk, high score</div>
                    </button>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row gap-2">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        // Ensure a clean state for current difficulty
                        resetGame(difficulty);
                        startGame();
                      }}
                    >
                      {phase === "gameover" ? "Play Again" : "Start Game"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMenuOpen(false);
                        if (phase === "menu") {
                          setHintTemp("Menu closed. Click Start on the sidebar to begin.");
                        }
                      }}
                    >
                      Close menu
                    </Button>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    Best score: <span className="font-semibold tabular-nums">{bestUI}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Quick “start” hint if menu is closed but not playing */}
          {phase === "menu" && !menuOpen ? (
            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black/40 px-5 py-3 text-sm text-white backdrop-blur">
              Menu closed. Use the sidebar “Start Game”.
            </div>
          ) : null}

          {/* If paused, show a subtle overlay */}
          {phase === "paused" ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/35">
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-white backdrop-blur">
                <div className="text-lg font-semibold">Paused</div>
                <div className="mt-1 text-xs text-white/80">Press P to resume</div>
              </div>
            </div>
          ) : null}
        </div>

        {/* For theater fallback: show a close button */}
        {showTheater ? (
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="bg-white/90"
              onClick={() => {
                setTheater(false);
                updateCanvasSize();
              }}
            >
              <Minimize2 className="mr-2 h-4 w-4" />
              Exit Theater
            </Button>
          </div>
        ) : null}
      </div>
    </GamePageLayout>
  );
}
