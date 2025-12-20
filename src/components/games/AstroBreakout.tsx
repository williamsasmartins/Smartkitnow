import { useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import {
  Gauge,
  Maximize2,
  Minimize2,
  Rocket,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameStatus = "ready" | "playing" | "paused" | "win" | "lose";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  stuck: boolean;
  stickyCarry: boolean;
};

type Paddle = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
};

type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  points: number;
};

type PowerUpType = "multiball" | "expand" | "slow" | "sticky";
type PowerUp = {
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  type: PowerUpType;
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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function circleRectIntersect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number) {
  const nx = clamp(cx, rx, rx + rw);
  const ny = clamp(cy, ry, ry + rh);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy <= cr * cr;
}

function normalize(vx: number, vy: number) {
  const m = Math.hypot(vx, vy) || 1;
  return { x: vx / m, y: vy / m };
}

export default function AstroBreakout({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Astro Breakout";
  const pageDescription =
    description ??
    "A premium Breakout experience: power-ups, multi-ball, smooth physics, mobile controls, and full-screen theater mode.";

  // Virtual world size (we scale to fit container, so it stays big on desktop and usable on mobile)
  const WORLD_W = 960;
  const WORLD_H = 600;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const statusRef = useRef<GameStatus>("ready");

  const difficultyRef = useRef<Difficulty>("medium");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [status, setStatus] = useState<GameStatus>("ready");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);

  const [theater, setTheater] = useState(false);
  const theaterRef = useRef(false);

  const [overlayOpen, setOverlayOpen] = useState(true); // ready/pause/win/lose overlay
  const overlayOpenRef = useRef(true);

  // Overlay start options: starting difficulty and palette
  const [startDifficulty, setStartDifficulty] = useState<Difficulty>("medium");
  const [palette, setPalette] = useState<"default" | "neon" | "purple">("neon");

  const [touchControls, setTouchControls] = useState(true);

  // Power-up timers
  const slowUntilRef = useRef(0);
  const stickyUntilRef = useRef(0);
  const expandUntilRef = useRef(0);

  const ballsRef = useRef<Ball[]>([]);
  const paddleRef = useRef<Paddle>({
    x: WORLD_W / 2,
    y: WORLD_H - 44,
    w: 160,
    h: 16,
    vx: 0,
  });

  const bricksRef = useRef<Brick[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const pointerTargetXRef = useRef<number | null>(null);
  const leftHeldRef = useRef(false);
  const rightHeldRef = useRef(false);

  const scaleRef = useRef(1);
  const dprRef = useRef(1);

  const speedConfig = useMemo(() => {
    // base speed depends on difficulty
    if (difficulty === "easy") return { ball: 420, brickHpBias: 0, lives: 4 };
    if (difficulty === "hard") return { ball: 760, brickHpBias: 1, lives: 2 };
    return { ball: 640, brickHpBias: 0, lives: 3 };
  }, [difficulty]);

  // Simple synth beeps
  const audioCtxRef = useRef<AudioContext | null>(null);
  function beep(freq: number, ms: number, type: OscillatorType = "sine") {
    if (!soundOnRef.current) return;
    const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
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
    g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
    o.stop(t0 + ms / 1000);
  }

  function resetLevel(nextLevel: number, keepScore = true) {
    const baseLives = speedConfig.lives;
    setLives(baseLives);
    setLevel(nextLevel);
    if (!keepScore) setScore(0);

    slowUntilRef.current = 0;
    stickyUntilRef.current = 0;
    expandUntilRef.current = 0;

    powerUpsRef.current = [];
    particlesRef.current = [];

    paddleRef.current = {
      x: WORLD_W / 2,
      y: WORLD_H - 44,
      w: 160,
      h: 16,
      vx: 0,
    };

    // One main ball
    ballsRef.current = [
      {
        x: WORLD_W / 2,
        y: WORLD_H - 70,
        vx: 0,
        vy: 0,
        r: 8,
        stuck: true,
        stickyCarry: false,
      },
    ];

    // Bricks
    bricksRef.current = makeBricks(nextLevel, difficultyRef.current, speedConfig.brickHpBias);

    // Ready overlay
    statusRef.current = "ready";
    setStatus("ready");
    overlayOpenRef.current = true;
    setOverlayOpen(true);
  }

  function resetGame(nextDifficulty?: Difficulty) {
    const d = nextDifficulty ?? difficultyRef.current;
    difficultyRef.current = d;
    setDifficulty(d);

    // apply sound ref
    soundOnRef.current = soundOn;

    resetLevel(1, false);
  }

  function startOrResume() {
    if (statusRef.current === "win" || statusRef.current === "lose") {
      resetLevel(1, false);
      return;
    }
    statusRef.current = "playing";
    setStatus("playing");
    overlayOpenRef.current = false;
    setOverlayOpen(false);

    // Focus canvas for keyboard
    requestAnimationFrame(() => {
      canvasRef.current?.focus();
    });
  }

  function pauseToggle() {
    if (statusRef.current === "ready") return;
    if (statusRef.current === "win" || statusRef.current === "lose") return;

    if (statusRef.current === "paused") {
      statusRef.current = "playing";
      setStatus("playing");
      overlayOpenRef.current = false;
      setOverlayOpen(false);
    } else {
      statusRef.current = "paused";
      setStatus("paused");
      overlayOpenRef.current = true;
      setOverlayOpen(true);
    }
  }

  function exitOverlay() {
    // This is your “close” behavior: user can dismiss the modal and stop playing.
    overlayOpenRef.current = false;
    setOverlayOpen(false);
    if (statusRef.current === "ready") {
      // Stay ready, but no modal blocking the page
      return;
    }
    if (statusRef.current === "paused") {
      // keep paused but hide overlay
      return;
    }
  }

  function hardStop() {
    // User doesn't want to play anymore
    statusRef.current = "ready";
    setStatus("ready");
    overlayOpenRef.current = false;
    setOverlayOpen(false);

    // Put ball back on paddle
    const p = paddleRef.current;
    ballsRef.current = [
      {
        x: p.x,
        y: p.y - 22,
        vx: 0,
        vy: 0,
        r: 8,
        stuck: true,
        stickyCarry: false,
      },
    ];
  }

  function launchBallIfStuck() {
    const balls = ballsRef.current;
    if (!balls.length) return;
    for (const b of balls) {
      if (b.stuck) {
        b.stuck = false;
        b.stickyCarry = false;
        const base = speedConfig.ball;
        // Launch upward with slight random angle
        const ang = rand(-0.6, 0.6);
        b.vx = Math.sin(ang) * base;
        b.vy = -Math.cos(ang) * base;
        beep(740, 70, "triangle");
      }
    }
  }

  function applyPowerUp(t: PowerUpType) {
    const now = performance.now();
    if (t === "multiball") {
      const base = speedConfig.ball;
      const balls = ballsRef.current;
      const add: Ball[] = [];
      // Add up to 2 extra balls based on first active ball
      const src = balls.find((b) => !b.stuck) ?? balls[0];
      if (src) {
        for (let i = 0; i < 2; i++) {
          const ang = rand(-1.1, 1.1);
          add.push({
            x: src.x,
            y: src.y,
            vx: Math.cos(ang) * base,
            vy: -Math.abs(Math.sin(ang) * base),
            r: 7,
            stuck: false,
            stickyCarry: false,
          });
        }
      }
      ballsRef.current = [...balls, ...add];
      beep(1046, 90, "sawtooth");
      return;
    }
    if (t === "expand") {
      expandUntilRef.current = now + 12000;
      beep(880, 80, "triangle");
      return;
    }
    if (t === "slow") {
      slowUntilRef.current = now + 9000;
      beep(660, 80, "sine");
      return;
    }
    if (t === "sticky") {
      stickyUntilRef.current = now + 12000;
      beep(520, 90, "square");
      return;
    }
  }

  function maybeDropPowerUp(brick: Brick) {
    // chance depends on level
    const chance = clamp(0.18 + level * 0.015, 0.18, 0.34);
    if (Math.random() > chance) return;

    const roll = Math.random();
    let type: PowerUpType = "expand";
    if (roll < 0.25) type = "multiball";
    else if (roll < 0.5) type = "expand";
    else if (roll < 0.75) type = "slow";
    else type = "sticky";

    powerUpsRef.current.push({
      x: brick.x + brick.w / 2 - 14,
      y: brick.y + brick.h / 2 - 10,
      vy: 240 + level * 8,
      w: 28,
      h: 20,
      type,
    });
  }

  function spawnBreakParticles(x: number, y: number, n = 14) {
    for (let i = 0; i < n; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: rand(-220, 220),
        vy: rand(-260, 120),
        life: rand(260, 520),
        maxLife: 520,
        size: rand(1.8, 3.8),
      });
    }
  }

  // Resize handling: scale canvas to container (no “grows when scrolling” surprise)
  useEffect(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      // Use width/height to determine the largest canvas that fits inside the container
      // On mobile, use less padding to maximize game area
      const padX = isMobile ? 0 : 48; 
      const padY = isMobile ? 20 : 120; 
      
      const availableW = Math.max(300, rect.width - padX);
      // On mobile, don't constrain height as strictly by container (let it scroll if needed), 
      // but keep it reasonable.
      const availableH = isMobile ? 800 : Math.max(240, rect.height - padY);
      
      const aspect = WORLD_W / WORLD_H;

      // compute max width constrained by both available width and height (so game always fits)
      const maxW_by_height = availableH * aspect;
      const maxW = Math.min(1100, availableW, maxW_by_height);
      const h = Math.max(200, Math.floor(maxW / aspect));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;

      canvas.style.width = `${maxW}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(maxW * dpr);
      canvas.height = Math.floor(h * dpr);

      // keep scale reasonable so elements remain visible
      const scale = maxW / WORLD_W;
      scaleRef.current = Math.max(0.4, Math.min(scale, 1.0));
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Init on mount
  useEffect(() => {
    difficultyRef.current = difficulty;
    soundOnRef.current = soundOn;
    theaterRef.current = theater;
    overlayOpenRef.current = overlayOpen;
    resetGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    theaterRef.current = theater;
  }, [theater]);

  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
  }, [overlayOpen]);

  // Input: keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const st = statusRef.current;

      // Global keys
      if (e.code === "Escape") {
        if (theaterRef.current) {
          setTheater(false);
          return;
        }
        if (overlayOpenRef.current) {
          e.preventDefault();
          exitOverlay();
          return;
        }
      }

      if (e.code === "KeyP") {
        e.preventDefault();
        pauseToggle();
        return;
      }
      if (e.code === "KeyR") {
        e.preventDefault();
        resetGame();
        return;
      }
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.code === "Space" || e.code === "Enter") {
        if (st === "ready" || st === "paused") {
          e.preventDefault();
          startOrResume();
          return;
        }
        if (st === "playing") {
          e.preventDefault();
          launchBallIfStuck();
          return;
        }
      }

      // Movement keys
      const isLeft = e.code === "ArrowLeft" || e.code === "KeyA";
      const isRight = e.code === "ArrowRight" || e.code === "KeyD";
      if (isLeft || isRight) {
        e.preventDefault();
        if (isLeft) leftHeldRef.current = true;
        if (isRight) rightHeldRef.current = true;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      const isLeft = e.code === "ArrowLeft" || e.code === "KeyA";
      const isRight = e.code === "ArrowRight" || e.code === "KeyD";
      if (isLeft) leftHeldRef.current = false;
      if (isRight) rightHeldRef.current = false;
    }

    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey as any);
      window.removeEventListener("keyup", onKeyUp as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Pointer controls (mouse + touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function toWorldX(clientX: number) {
      const rect = canvas!.getBoundingClientRect();
      const px = clientX - rect.left;
      const sx = px / rect.width;
      return sx * WORLD_W;
    }

    const onPointerDown = (e: PointerEvent) => {
      canvas!.focus();
      pointerTargetXRef.current = toWorldX(e.clientX);
      // If user taps while playing: launch stuck ball
      if (statusRef.current === "playing") launchBallIfStuck();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerTargetXRef.current === null) return;
      pointerTargetXRef.current = toWorldX(e.clientX);
    };

    const onPointerUp = () => {
      pointerTargetXRef.current = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  // Fullscreen helpers
  function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;

    const doc = document as any;
    const isFs = !!doc.fullscreenElement;

    if (!isFs) {
      el.requestFullscreen?.().catch(() => {});
      setTheater(true);
    } else {
      doc.exitFullscreen?.().catch(() => {});
      setTheater(false);
    }
  }

  useEffect(() => {
    const onFs = () => {
      const doc = document as any;
      const isFs = !!doc.fullscreenElement;
      if (!isFs) setTheater(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (now: number) => {
      const st = statusRef.current;

      if (!lastRef.current) lastRef.current = now;
      const dt = Math.min(0.03, (now - lastRef.current) / 1000);
      lastRef.current = now;

      // Update only when playing
      if (st === "playing") {
        simulate(dt, now);
      }

      render(ctx, now);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
    };
    // re-run loop when difficulty or palette or theater changes so render closure uses latest palette
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, palette, theater]);

  function simulate(dt: number, nowMs: number) {
    const paddle = paddleRef.current;

    // Timers / effects
    const slow = nowMs < slowUntilRef.current;
    const sticky = nowMs < stickyUntilRef.current;
    const expand = nowMs < expandUntilRef.current;

    const baseSpeed = speedConfig.ball * (slow ? 0.68 : 1);
    const targetW = expand ? 220 : 160;
    paddle.w += (targetW - paddle.w) * clamp(dt * 10, 0, 1);

    // Paddle movement
    const accel = 2600;
    const maxV = 900;

    if (pointerTargetXRef.current !== null) {
      const tx = pointerTargetXRef.current;
      const dx = tx - paddle.x;
      paddle.vx = clamp(dx * 18, -maxV, maxV);
    } else {
      const dir = (rightHeldRef.current ? 1 : 0) - (leftHeldRef.current ? 1 : 0);
      paddle.vx += dir * accel * dt;
      if (!dir) paddle.vx *= Math.pow(0.0006, dt); // strong damping when no input
      paddle.vx = clamp(paddle.vx, -maxV, maxV);
    }

    paddle.x += paddle.vx * dt;
    paddle.x = clamp(paddle.x, paddle.w / 2 + 12, WORLD_W - paddle.w / 2 - 12);

    // Move balls
    const balls = ballsRef.current;
    const bricks = bricksRef.current;
    const powerUps = powerUpsRef.current;

    for (const b of balls) {
      if (b.stuck) {
        b.x = paddle.x;
        b.y = paddle.y - 22;
        continue;
      }

      // Normalize speed slightly toward baseSpeed to keep consistent feel
      const n = normalize(b.vx, b.vy);
      const s = Math.hypot(b.vx, b.vy);
      const ns = s + (baseSpeed - s) * clamp(dt * 1.4, 0, 1);
      b.vx = n.x * ns;
      b.vy = n.y * ns;

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Wall collisions
      if (b.x - b.r < 10) {
        b.x = 10 + b.r;
        b.vx = Math.abs(b.vx);
        beep(520, 25, "sine");
      } else if (b.x + b.r > WORLD_W - 10) {
        b.x = WORLD_W - 10 - b.r;
        b.vx = -Math.abs(b.vx);
        beep(520, 25, "sine");
      }

      if (b.y - b.r < 10) {
        b.y = 10 + b.r;
        b.vy = Math.abs(b.vy);
        beep(520, 25, "sine");
      }

      // Paddle collision
      const paddleRectX = paddle.x - paddle.w / 2;
      const paddleRectY = paddle.y - paddle.h / 2;
      if (b.vy > 0 && circleRectIntersect(b.x, b.y, b.r, paddleRectX, paddleRectY, paddle.w, paddle.h)) {
        // Reflect based on hit position
        const hit = (b.x - paddle.x) / (paddle.w / 2);
        const ang = clamp(hit, -1, 1) * 1.05;
        const sp = Math.hypot(b.vx, b.vy);
        b.vx = Math.sin(ang) * sp;
        b.vy = -Math.cos(ang) * sp;

        // Sticky mode sticks the ball
        if (sticky || b.stickyCarry) {
          b.stuck = true;
          b.stickyCarry = true;
        }

        beep(740, 18, "triangle");
      }

      // Brick collisions
      for (let i = 0; i < bricks.length; i++) {
        const br = bricks[i];
        if (!circleRectIntersect(b.x, b.y, b.r, br.x, br.y, br.w, br.h)) continue;

        // Determine collision side by comparing penetration
        const cx = clamp(b.x, br.x, br.x + br.w);
        const cy = clamp(b.y, br.y, br.y + br.h);
        const dx = b.x - cx;
        const dy = b.y - cy;

        // If we are more horizontal -> flip vx else flip vy
        if (Math.abs(dx) > Math.abs(dy)) b.vx *= -1;
        else b.vy *= -1;

        br.hp -= 1;

        if (br.hp <= 0) {
          // remove brick
          bricks.splice(i, 1);
          i--;

          setScore((s0) => {
            const ns = s0 + br.points;
            return ns;
          });

          spawnBreakParticles(br.x + br.w / 2, br.y + br.h / 2, 16);
          maybeDropPowerUp(br);
          beep(1046, 28, "sawtooth");
        } else {
          // partial hit
          spawnBreakParticles(br.x + br.w / 2, br.y + br.h / 2, 6);
          beep(880, 18, "triangle");
        }

        break;
      }

      // Ball fell
      if (b.y - b.r > WORLD_H + 20) {
        b.stuck = false;
        b.vx = 0;
        b.vy = 0;
        b.y = WORLD_H + 999; // mark
      }
    }

    // Remove dead balls
    let alive = balls.filter((b) => b.y < WORLD_H + 200);
    if (!alive.length) {
      // Lose a life
      setLives((lv) => {
        const nlv = lv - 1;
        if (nlv <= 0) {
          statusRef.current = "lose";
          setStatus("lose");
          overlayOpenRef.current = true;
          setOverlayOpen(true);
          beep(220, 220, "sawtooth");
          return 0;
        }
        // Reset to a stuck ball
        const p = paddleRef.current;
        ballsRef.current = [
          {
            x: p.x,
            y: p.y - 22,
            vx: 0,
            vy: 0,
            r: 8,
            stuck: true,
            stickyCarry: nowMs < stickyUntilRef.current,
          },
        ];
        beep(330, 120, "square");
        return nlv;
      });
    } else {
      ballsRef.current = alive;
    }

    // Update powerups
    for (let i = 0; i < powerUps.length; i++) {
      const pu = powerUps[i];
      pu.y += pu.vy * dt;

      // catch by paddle
      const p = paddleRef.current;
      const px = p.x - p.w / 2;
      const py = p.y - p.h / 2;
      if (pu.y + pu.h >= py && pu.y <= py + p.h && pu.x + pu.w >= px && pu.x <= px + p.w) {
        applyPowerUp(pu.type);
        powerUps.splice(i, 1);
        i--;
        continue;
      }

      // missed
      if (pu.y > WORLD_H + 40) {
        powerUps.splice(i, 1);
        i--;
      }
    }

    // Update particles
    const parts = particlesRef.current;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.life -= dt * 1000;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 420 * dt;
      p.vx *= Math.pow(0.08, dt);
      if (p.life <= 0) {
        parts.splice(i, 1);
        i--;
      }
    }

    // Win condition
    if (!bricksRef.current.length) {
      statusRef.current = "win";
      setStatus("win");
      overlayOpenRef.current = true;
      setOverlayOpen(true);
      beep(1318, 180, "sawtooth");

      // advance next level (user chooses via overlay)
    }
  }

  function render(ctx: CanvasRenderingContext2D, now: number) {
    const canvas = canvasRef.current!;
    const dpr = dprRef.current;
    const scale = scaleRef.current;

    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Background gradient + stars
    ctx.clearRect(0, 0, cw, ch);
    const g = ctx.createLinearGradient(0, 0, cw, ch);
    g.addColorStop(0, "#050b1d");
    g.addColorStop(0.5, "#0b1533");
    g.addColorStop(1, "#070a14");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);

    // Subtle starfield
    const t = now / 1000;
    for (let i = 0; i < 90; i++) {
      const sx = (i * 97.3) % 1;
      const sy = (i * 57.9) % 1;
      const px = (sx * cw + (t * 14 * (0.3 + (i % 7) / 10))) % cw;
      const py = (sy * ch + (t * 18 * (0.2 + (i % 5) / 10))) % ch;
      ctx.fillStyle = `rgba(147,197,253,${0.10 + (i % 9) * 0.01})`;
      ctx.fillRect(px, py, 2, 2);
    }

    // Convert world -> screen helpers
    const ox = (cw - WORLD_W * scale) / 2;
    const oy = (ch - WORLD_H * scale) / 2;
    const wx = (x: number) => ox + x * scale;
    const wy = (y: number) => oy + y * scale;
    const ww = (w: number) => w * scale;

    // Frame border
    ctx.strokeStyle = "rgba(92,130,238,0.35)";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, ox + 6, oy + 6, WORLD_W * scale - 12, WORLD_H * scale - 12, 18);
    ctx.stroke();

    // Bricks
    for (const br of bricksRef.current) {
      const hpRatio = br.hp / br.maxHp;
      const bx = wx(br.x);
      const by = wy(br.y);
      const bw = ww(br.w);
      const bh = ww(br.h);

      // palette-aware brick coloring
      if (palette === "neon") {
        const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, "#5c82ee");
        g.addColorStop(0.5, "#a855f7");
        g.addColorStop(1, "#f59e0b");
        ctx.fillStyle = g;
      } else if (palette === "purple") {
        const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g.addColorStop(0, "#7c3aed");
        g.addColorStop(1, "#a78bfa");
        ctx.fillStyle = g;
      } else {
        const hue = 210 + (1 - hpRatio) * 70; // blue -> violet
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, 0.95)`;
      }

      ctx.strokeStyle = "rgba(15,23,42,0.6)";
      ctx.lineWidth = 2;

      drawRoundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.stroke();

      // inner glow line
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      drawRoundRect(ctx, bx + 3, by + 3, bw - 6, bh - 6, 8);
      ctx.stroke();
    }

    // Paddle
    const p = paddleRef.current;
    const px = wx(p.x - p.w / 2);
    const py = wy(p.y - p.h / 2);
    const pw = ww(p.w);
    const ph = ww(p.h);

    const pg = ctx.createLinearGradient(px, py, px + pw, py + ph);
    pg.addColorStop(0, "#5c82ee");
    pg.addColorStop(1, "#a855f7");
    ctx.fillStyle = pg;
    ctx.strokeStyle = "rgba(92,130,238,0.55)";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, px, py, pw, ph, 12);
    ctx.fill();
    ctx.stroke();

    // Balls
    for (const b of ballsRef.current) {
      const bx = wx(b.x);
      const by = wy(b.y);
      const br = ww(b.r);

      const bg = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, br * 0.2, bx, by, br * 1.4);
      bg.addColorStop(0, "rgba(255,255,255,0.95)");
      bg.addColorStop(0.55, "rgba(147,197,253,0.9)");
      bg.addColorStop(1, "rgba(92,130,238,0.2)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // Power-ups
    for (const pu of powerUpsRef.current) {
      const x = wx(pu.x);
      const y = wy(pu.y);
      const w = ww(pu.w);
      const h = ww(pu.h);

      let fg = "#93c5fd";
      let bg = "rgba(92,130,238,0.18)";
      let label = "UP";
      if (pu.type === "multiball") {
        fg = "#fbbf24";
        bg = "rgba(245,158,11,0.18)";
        label = "×3";
      } else if (pu.type === "expand") {
        fg = "#34d399";
        bg = "rgba(16,185,129,0.16)";
        label = "W+";
      } else if (pu.type === "slow") {
        fg = "#a78bfa";
        bg = "rgba(167,139,250,0.16)";
        label = "S↓";
      } else if (pu.type === "sticky") {
        fg = "#fb7185";
        bg = "rgba(244,63,94,0.14)";
        label = "🧲";
      }

      ctx.fillStyle = bg;
      ctx.strokeStyle = "rgba(226,232,240,0.18)";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, x, y, w, h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = `${Math.max(10, h * 0.65)}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + w / 2, y + h / 2 + 0.5);
    }

    // Particles
    for (const p0 of particlesRef.current) {
      const a = clamp(p0.life / p0.maxLife, 0, 1);
      ctx.fillStyle = `rgba(147,197,253,${0.55 * a})`;
      ctx.beginPath();
      ctx.arc(wx(p0.x), wy(p0.y), ww(p0.size), 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD (inside canvas)
    ctx.fillStyle = "rgba(226,232,240,0.9)";
    ctx.font = `600 ${Math.max(12, 14 * scale)}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score ${score}`, ox + 16, oy + 14);
    ctx.fillText(`Lives ${lives}`, ox + 16, oy + 36);
    ctx.fillText(`Level ${level}`, ox + 16, oy + 58);

    // If ready: hint
    if (statusRef.current === "ready") {
      ctx.fillStyle = "rgba(226,232,240,0.72)";
      ctx.textAlign = "center";
      ctx.font = `700 ${Math.max(14, 18 * scale)}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.fillText("Press Start or Space to launch", ox + (WORLD_W * scale) / 2, oy + (WORLD_H * scale) - 54);
    }
  }

  // Brick generator
  function makeBricks(lv: number, diff: Difficulty, hpBias: number): Brick[] {
    const top = 70;
    const rows = clamp(6 + Math.floor(lv / 2), 6, 11);
    const cols = 12;
    const gap = 10;
    const marginX = 54;
    const bw = (WORLD_W - marginX * 2 - gap * (cols - 1)) / cols;
    const bh = 26;

    const out: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseHp =
          diff === "easy" ? 1 : diff === "hard" ? (r < 2 ? 3 : 2) : (r < 1 ? 2 : 1);
        const hp = clamp(baseHp + (r > 3 ? 1 : 0) + hpBias + (lv > 6 ? 1 : 0), 1, 4);
        out.push({
          x: marginX + c * (bw + gap),
          y: top + r * (bh + gap),
          w: bw,
          h: bh,
          hp,
          maxHp: hp,
          points: 35 + r * 10 + lv * 6,
        });
      }
    }
    return out;
  }

  const controlsContent = (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
        <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{status}</div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <Gauge className="h-4 w-4" /> Level {level}
          </span>
          <span className="inline-flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Score {score}
          </span>
          <span>Lives {lives}</span>
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
              onClick={() => resetGame(d)}
            >
              {d[0].toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="w-full" onClick={startOrResume}>
          {status === "playing" ? "Playing" : status === "paused" ? "Resume" : "Start"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={pauseToggle}>
          {status === "paused" ? "Unpause" : "Pause"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="w-full" onClick={() => resetGame()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          New game
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={hardStop}>
          Stop
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setSoundOn((s) => !s);
            soundOnRef.current = !soundOnRef.current;
          }}
        >
          {soundOn ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
          Sound
        </Button>

        <Button
          type="button"
          variant={touchControls ? "default" : "outline"}
          className="h-9 px-3"
          onClick={() => setTouchControls((v) => !v)}
        >
          {touchControls ? "Touch" : "Off"}
        </Button>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Controls: Arrow keys or A/D. Space to launch. P pause, R restart, F fullscreen. On mobile, drag on the
        game area or use the buttons.
      </div>
    </div>
  );

  const rightRail = (
    <div className="hidden lg:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Game controls</h3>
      {controlsContent}
    </div>
  );

  const below = (
    <div className="space-y-10">
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <ul className="list-disc pl-6 space-y-2">
            <li>Move the paddle with Arrow keys or A/D (desktop) or drag/touch (mobile).</li>
            <li>Press Space (or tap) to launch the ball.</li>
            <li>Break all bricks to clear the level.</li>
            <li>Catch power-ups to get special abilities (multi-ball, sticky paddle, slow motion, expand paddle).</li>
          </ul>
        </div>
      </section>

      <section id="power-ups" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Power-ups</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 text-slate-700 dark:text-slate-300">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-4">
            <div className="font-semibold text-slate-900 dark:text-slate-100">×3 Multi-ball</div>
            <div className="mt-1 text-sm">Spawns extra balls for faster clears (and more chaos).</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-4">
            <div className="font-semibold text-slate-900 dark:text-slate-100">W+ Expand</div>
            <div className="mt-1 text-sm">Wider paddle for safer returns.</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-4">
            <div className="font-semibold text-slate-900 dark:text-slate-100">S↓ Slow</div>
            <div className="mt-1 text-sm">Slows ball speed temporarily for precision.</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-4">
            <div className="font-semibold text-slate-900 dark:text-slate-100">🧲 Sticky</div>
            <div className="mt-1 text-sm">Ball sticks to paddle on hit. Press Space/tap to release.</div>
          </div>
        </div>
      </section>

      <section id="tips" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Tips</h2>
        <div className="mt-3 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Aim shots by hitting the ball off-center on the paddle. Use Slow + Sticky together to control the
            tempo and chain power-ups.
          </p>
        </div>
      </section>
    </div>
  );

  const overlayTitle =
    status === "ready"
      ? "Ready to play"
      : status === "paused"
      ? "Paused"
      : status === "win"
      ? "Level cleared"
      : "Game Over";

  const overlayBody =
    status === "ready"
      ? "Press Start to begin. Use Arrow keys or A/D to move. Space to launch."
      : status === "paused"
      ? "Press Resume to continue."
      : status === "win"
      ? "Great run. Continue to the next level or restart."
      : "You ran out of lives. Restart to try again.";

  const primaryLabel =
    status === "ready" ? "Start Game" : status === "paused" ? "Resume" : status === "win" ? "Next Level" : "Restart";

  function onPrimary() {
    if (status === "ready") {
      // apply chosen start difficulty
      resetGame(startDifficulty);
      startOrResume();
      return;
    }
    if (status === "win") {
      // next level
      resetLevel(level + 1, true);
      startOrResume();
      return;
    }
    startOrResume();
  }

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[
        { id: "how-to-play", label: "How to play" },
        { id: "power-ups", label: "Power-ups" },
        { id: "tips", label: "Tips" },
      ]}
    >
      <div className="w-full">
        <div
          ref={wrapRef}
          className={[
            "relative mx-auto w-full",
            // This is the key: DO NOT cap width too small; let it grow.
            "max-w-none",
            theater ? "z-50" : "",
          ].join(" ")}
        >
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/70 shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/20 bg-black/20 px-3 py-1 text-xs text-slate-200">
                <Rocket className="h-4 w-4 text-[#5c82ee]" />
                Astro Breakout
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="h-9" onClick={toggleFullscreen}>
                  {theater ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
                  {theater ? "Exit" : "Theater"}
                </Button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              tabIndex={0}
              className="block mx-auto rounded-xl border border-slate-200/10 bg-slate-950 outline-none"
              aria-label="Astro Breakout canvas"
            />

            {/* Mobile buttons */}
            {touchControls ? (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  onPointerDown={() => (leftHeldRef.current = true)}
                  onPointerUp={() => (leftHeldRef.current = false)}
                  onPointerCancel={() => (leftHeldRef.current = false)}
                >
                  ◀
                </Button>
                <Button type="button" onClick={() => (status === "playing" ? launchBallIfStuck() : startOrResume())}>
                  {status === "playing" ? "Launch" : "Start"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onPointerDown={() => (rightHeldRef.current = true)}
                  onPointerUp={() => (rightHeldRef.current = false)}
                  onPointerCancel={() => (rightHeldRef.current = false)}
                >
                  ▶
                </Button>
              </div>
            ) : null}

            {/* Overlay (closable) */}
            {overlayOpen ? (
              <div className="absolute inset-0 z-40 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
                <div className="relative w-[min(92vw,720px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8">
                  <div
                    className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl"
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                          <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                          Astro Breakout
                        </div>
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          {overlayTitle}
                        </h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">{overlayBody}</p>
                      </div>
                      {/* Start options: level and palette */}
                      <div className="ml-4">
                        <div className="text-xs text-slate-500 mb-2">Difficulty</div>
                        <div className="flex gap-2 mb-3">
                          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                            <Button key={d} type="button" variant={startDifficulty === d ? "default" : "outline"} className="h-8 px-3" onClick={() => setStartDifficulty(d)}>
                              {d[0].toUpperCase() + d.slice(1)}
                            </Button>
                          ))}
                        </div>
                        <div className="text-xs text-slate-500 mb-2">Brick colors</div>
                        <div className="flex gap-2">
                          <Button type="button" variant={palette === "neon" ? "default" : "outline"} className="h-8 px-2" onClick={() => setPalette("neon")}>Neon</Button>
                          <Button type="button" variant={palette === "purple" ? "default" : "outline"} className="h-8 px-2" onClick={() => setPalette("purple")}>Purple</Button>
                          <Button type="button" variant={palette === "default" ? "default" : "outline"} className="h-8 px-2" onClick={() => setPalette("default")}>Default</Button>
                        </div>
                      </div>

                      {/* Replace 'X' with textual Close button */}
                      <Button type="button" variant="outline" className="h-10 px-3" onClick={exitOverlay} aria-label="Close">
                        Close
                      </Button>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-2">
                      <Button type="button" className="w-full" onClick={onPrimary}>
                        {primaryLabel}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (status === "win") resetLevel(1, false);
                          else resetGame();
                        }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={hardStop}>
                        Stop
                      </Button>
                    </div>

                    <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                      Tip: Press <b>P</b> to pause, <b>R</b> to restart, <b>F</b> for fullscreen.
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Game controls</h3>
          {controlsContent}
        </div>
      </div>
    </GamePageLayout>
  );
}
