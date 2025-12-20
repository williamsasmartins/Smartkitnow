import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Expand, Minimize, Pause, Play, RotateCcw, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "menu" | "playing" | "paused" | "gameover";

type Brick = {
  id: string;
  lane: number;
  y: number; // px
  kind: "normal" | "heavy";
};

type Pickup = {
  id: string;
  lane: number;
  y: number; // px
  kind: "star" | "shield" | "slow";
};

const LANES = 6;

const DIFF: Record<
  Difficulty,
  {
    spawnEveryMs: number;
    baseSpeedPxPerSec: number;
    rampPerSec: number;
  }
> = {
  easy: { spawnEveryMs: 820, baseSpeedPxPerSec: 230, rampPerSec: 7 },
  medium: { spawnEveryMs: 680, baseSpeedPxPerSec: 270, rampPerSec: 10 },
  hard: { spawnEveryMs: 560, baseSpeedPxPerSec: 315, rampPerSec: 13 },
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function randInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function BrickDash({ title, description }: { title?: string; description?: string }) {
  const navigate = useNavigate();

  const pageTitle = title ?? "Brick Dash";
  const pageDescription =
    description ??
    "Dash between lanes, dodge falling bricks, grab power-ups, and chase a new high score. Built for keyboard and mobile touch controls.";

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const difficultyRef = useRef<Difficulty>("medium");

  // World refs (avoid rerender 60fps)
  const stateRef = useRef<GameState>("menu");
  const startedAtRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const playerLaneRef = useRef<number>(Math.floor(LANES / 2));
  const playerXRef = useRef<number>(0);
  const playerTargetXRef = useRef<number>(0);

  const bricksRef = useRef<Brick[]>([]);
  const pickupsRef = useRef<Pickup[]>([]);

  const spawnAccRef = useRef<number>(0);
  const speedRef = useRef<number>(DIFF.medium.baseSpeedPxPerSec);

  const scoreRef = useRef<number>(0);
  const bestRef = useRef<number>(0);

  const shieldHitsRef = useRef<number>(0);
  const slowUntilRef = useRef<number>(0);

  const shakeRef = useRef<number>(0);

  // UI state (throttled)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [shieldHits, setShieldHits] = useState(0);
  const [theater, setTheater] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const stageSizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const controlsHint = useMemo(
    () => "Keyboard: ←/→ or A/D. Pause: P. Restart: R. Mobile: swipe or tap buttons.",
    []
  );

  // Load best score
  useEffect(() => {
    const k = "skn_game_brick_dash_best";
    const v = Number(localStorage.getItem(k) || "0");
    bestRef.current = Number.isFinite(v) ? v : 0;
    setBest(bestRef.current);
  }, []);

  // Resize observer: update internal render resolution ONLY
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      // Guard (avoid resize loops)
      if (stageSizeRef.current.w === w && stageSizeRef.current.h === h && stageSizeRef.current.dpr === dpr) return;
      stageSizeRef.current = { w, h, dpr };
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fullscreen listeners
  useEffect(() => {
    const onFs = () => {
      const fsEl = document.fullscreenElement;
      setIsFs(Boolean(fsEl));
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function setState(next: GameState) {
    stateRef.current = next;
    setGameState(next);
  }

  function resetWorld(nextDifficulty?: Difficulty) {
    const d = nextDifficulty ?? difficultyRef.current;

    difficultyRef.current = d;
    setDifficulty(d);

    playerLaneRef.current = Math.floor(LANES / 2);
    playerXRef.current = 0;
    playerTargetXRef.current = 0;

    bricksRef.current = [];
    pickupsRef.current = [];

    spawnAccRef.current = 0;
    speedRef.current = DIFF[d].baseSpeedPxPerSec;

    scoreRef.current = 0;
    shieldHitsRef.current = 0;
    slowUntilRef.current = 0;
    shakeRef.current = 0;

    startedAtRef.current = performance.now();
    elapsedRef.current = 0;

    setScore(0);
    setShieldHits(0);

    setState("menu");
  }

  function startGame() {
    // Initialize target X based on current stage width
    const { w } = stageSizeRef.current;
    const laneW = w / LANES;
    const lane = playerLaneRef.current;
    const x = laneW * (lane + 0.5);

    playerXRef.current = x;
    playerTargetXRef.current = x;

    startedAtRef.current = performance.now();
    elapsedRef.current = 0;

    setState("playing");
  }

  function gameOver() {
    setState("gameover");

    // best score persist
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(bestRef.current);
      localStorage.setItem("skn_game_brick_dash_best", String(bestRef.current));
    }
  }

  function moveLane(delta: -1 | 1) {
    if (stateRef.current !== "playing") return;

    const lane = clamp(playerLaneRef.current + delta, 0, LANES - 1);
    playerLaneRef.current = lane;

    const { w } = stageSizeRef.current;
    const laneW = w / LANES;
    playerTargetXRef.current = laneW * (lane + 0.5);
  }

  async function toggleFullscreen() {
    const el = stageRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // If fullscreen fails (iOS/Safari limitations), user still has Theater mode
      setTheater(true);
    }
  }

  // Keyboard input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const st = stateRef.current;

      // Let user always exit overlays safely
      if (e.code === "Escape") {
        if (theater) setTheater(false);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        return;
      }

      // Pause/Resume
      if (e.code === "KeyP") {
        e.preventDefault();
        if (st === "playing") setState("paused");
        else if (st === "paused") setState("playing");
        return;
      }

      // Restart
      if (e.code === "KeyR") {
        e.preventDefault();
        resetWorld();
        return;
      }

      // Start from menu
      if (st === "menu" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        startGame();
        return;
      }

      if (st !== "playing") return;

      // Movement (arrow + WASD)
      const code = e.code;

      if (code === "ArrowLeft" || code === "KeyA") {
        e.preventDefault();
        moveLane(-1);
      } else if (code === "ArrowRight" || code === "KeyD") {
        e.preventDefault();
        moveLane(1);
      }
    }

    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
  }, [theater]);

  // Touch controls: swipe on stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let startX = 0;
    let active = false;

    const onDown = (ev: PointerEvent) => {
      active = true;
      startX = ev.clientX;
      (ev.target as HTMLElement)?.setPointerCapture?.(ev.pointerId);
    };

    const onMove = (ev: PointerEvent) => {
      if (!active) return;
      const dx = ev.clientX - startX;
      if (Math.abs(dx) < 26) return;

      if (dx > 0) moveLane(1);
      else moveLane(-1);

      startX = ev.clientX; // allow multiple lane steps in one swipe
    };

    const onUp = () => {
      active = false;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // Main loop
  useEffect(() => {
    function ensureCanvasResolution() {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const { w, h, dpr } = stageSizeRef.current;
      if (!w || !h) return null;

      const nextW = Math.max(1, Math.floor(w * dpr));
      const nextH = Math.max(1, Math.floor(h * dpr));

      if (canvas.width !== nextW) canvas.width = nextW;
      if (canvas.height !== nextH) canvas.height = nextH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Set transform for drawing in CSS pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { ctx, w, h };
    }

    function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number) {
      // Background
      ctx.clearRect(0, 0, w, h);

      // subtle vignette
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, w, h);

      // stars
      const t = elapsedRef.current;
      for (let i = 0; i < 60; i++) {
        const x = (i * 173) % w;
        const y = ((i * 97 + t * 60) % h + h) % h;
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(x, y, 2, 2);
      }

      // lanes grid
      const laneW = w / LANES;
      for (let i = 1; i < LANES; i++) {
        const x = i * laneW;
        ctx.strokeStyle = "rgba(92,130,238,0.10)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // bricks
      const bricks = bricksRef.current;
      for (const b of bricks) {
        const x = b.lane * laneW + laneW * 0.12;
        const bw = laneW * 0.76;
        const bh = b.kind === "heavy" ? 34 : 28;

        const y = b.y;
        const grad = ctx.createLinearGradient(x, y, x + bw, y + bh);
        if (b.kind === "heavy") {
          grad.addColorStop(0, "rgba(245,158,11,0.95)");
          grad.addColorStop(1, "rgba(249,115,22,0.95)");
        } else {
          grad.addColorStop(0, "rgba(92,130,238,0.95)");
          grad.addColorStop(1, "rgba(168,85,247,0.95)");
        }
        ctx.fillStyle = grad;
        roundRect(ctx, x, y, bw, bh, 10);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1;
        roundRect(ctx, x + 0.5, y + 0.5, bw - 1, bh - 1, 10);
        ctx.stroke();
      }

      // pickups
      const pickups = pickupsRef.current;
      for (const p of pickups) {
        const cx = p.lane * laneW + laneW * 0.5;
        const cy = p.y;

        if (p.kind === "star") {
          ctx.fillStyle = "rgba(245,158,11,0.95)";
          glowCircle(ctx, cx, cy, 10, "rgba(245,158,11,0.25)");
          ctx.beginPath();
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "shield") {
          ctx.fillStyle = "rgba(59,130,246,0.95)";
          glowCircle(ctx, cx, cy, 11, "rgba(59,130,246,0.25)");
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // slow
          ctx.fillStyle = "rgba(236,72,153,0.95)";
          glowCircle(ctx, cx, cy, 11, "rgba(236,72,153,0.25)");
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Player
      const py = h - Math.max(58, h * 0.14);
      const px = playerXRef.current || (playerTargetXRef.current || w / 2);

      // shake
      const shake = shakeRef.current;
      const sx = shake ? (Math.random() - 0.5) * shake : 0;
      const sy = shake ? (Math.random() - 0.5) * shake : 0;

      const shipW = Math.max(34, laneW * 0.42);
      const shipH = 22;

      const shipX = px - shipW / 2 + sx;
      const shipY = py - shipH / 2 + sy;

      const shipGrad = ctx.createLinearGradient(shipX, shipY, shipX + shipW, shipY + shipH);
      shipGrad.addColorStop(0, "#5c82ee");
      shipGrad.addColorStop(1, "#a855f7");
      ctx.fillStyle = shipGrad;
      roundRect(ctx, shipX, shipY, shipW, shipH, 12);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      roundRect(ctx, shipX + 0.5, shipY + 0.5, shipW - 1, shipH - 1, 12);
      ctx.stroke();

      // shield halo
      if (shieldHitsRef.current > 0) {
        ctx.strokeStyle = "rgba(59,130,246,0.40)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px + sx, py + sy, Math.max(26, shipW * 0.55), 0, Math.PI * 2);
        ctx.stroke();
      }

      // HUD (inside canvas)
      ctx.fillStyle = "rgba(255,255,255,0.86)";
      ctx.font = "600 13px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText(`Score: ${scoreRef.current}`, 14, 22);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(`Best: ${bestRef.current}`, 14, 40);

      if (slowUntilRef.current > performance.now()) {
        ctx.fillStyle = "rgba(236,72,153,0.80)";
        ctx.fillText("SLOW-MO", 14, 58);
      }
    }

    function stepWorld(dt: number, w: number, h: number) {
      const st = stateRef.current;
      if (st !== "playing") return;

      elapsedRef.current += dt;

      const now = performance.now();
      const slow = slowUntilRef.current > now;

      const d = difficultyRef.current;
      const cfg = DIFF[d];

      // speed ramps over time
      speedRef.current = cfg.baseSpeedPxPerSec + cfg.rampPerSec * elapsedRef.current;

      const laneW = w / LANES;
      const py = h - Math.max(58, h * 0.14);

      // Smooth player
      if (!playerXRef.current) {
        playerXRef.current = laneW * (playerLaneRef.current + 0.5);
        playerTargetXRef.current = playerXRef.current;
      }
      const tx = playerTargetXRef.current || laneW * (playerLaneRef.current + 0.5);
      playerXRef.current += (tx - playerXRef.current) * clamp(12 * dt, 0, 1);

      // Spawn
      spawnAccRef.current += dt * 1000;
      while (spawnAccRef.current >= cfg.spawnEveryMs) {
        spawnAccRef.current -= cfg.spawnEveryMs;

        const lane = randInt(0, LANES - 1);
        const heavy = Math.random() < 0.12;
        bricksRef.current.push({
          id: uid("b"),
          lane,
          y: -40,
          kind: heavy ? "heavy" : "normal",
        });

        // pickups: rarer, and not always same lane
        const roll = Math.random();
        if (roll < 0.10) {
          const kind = roll < 0.06 ? "star" : roll < 0.085 ? "shield" : "slow";
          pickupsRef.current.push({
            id: uid("p"),
            lane: clamp(lane + pick([-1, 1]), 0, LANES - 1),
            y: -24,
            kind,
          });
        }
      }

      const speed = speedRef.current * (slow ? 0.55 : 1);

      // Move bricks
      for (const b of bricksRef.current) b.y += speed * dt;

      // Move pickups
      for (const p of pickupsRef.current) p.y += (speed * 0.92) * dt;

      // Collisions
      const px = playerXRef.current;
      const shipW = Math.max(34, laneW * 0.42);
      const shipH = 22;
      const shipX = px - shipW / 2;
      const shipY = py - shipH / 2;

      // Bricks collision only if same lane and overlaps
      const newBricks: Brick[] = [];
      for (const b of bricksRef.current) {
        const x = b.lane * laneW + laneW * 0.12;
        const bw = laneW * 0.76;
        const bh = b.kind === "heavy" ? 34 : 28;
        const y = b.y;

        const overlaps =
          rectsOverlap(shipX, shipY, shipW, shipH, x, y, bw, bh);

        if (overlaps) {
          if (shieldHitsRef.current > 0) {
            shieldHitsRef.current -= 1;
            shakeRef.current = 9;
            // remove brick, keep playing
          } else {
            shakeRef.current = 14;
            gameOver();
            break;
          }
        } else if (b.y < h + 60) {
          newBricks.push(b);
        } else {
          // brick passed: score small
          scoreRef.current += b.kind === "heavy" ? 3 : 2;
        }
      }
      bricksRef.current = newBricks;

      // Pickup collision
      const newPickups: Pickup[] = [];
      for (const p of pickupsRef.current) {
        const cx = p.lane * laneW + laneW * 0.5;
        const cy = p.y;
        const rr = 14;

        const hit =
          cx > shipX - rr &&
          cx < shipX + shipW + rr &&
          cy > shipY - rr &&
          cy < shipY + shipH + rr;

        if (hit) {
          if (p.kind === "star") scoreRef.current += 35;
          if (p.kind === "shield") shieldHitsRef.current = Math.min(shieldHitsRef.current + 1, 3);
          if (p.kind === "slow") slowUntilRef.current = performance.now() + 3500;
        } else if (p.y < h + 60) {
          newPickups.push(p);
        }
      }
      pickupsRef.current = newPickups;

      // Decay shake
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - 22 * dt);

      // Throttle UI updates (about ~10/s)
      if (Math.floor(elapsedRef.current * 10) !== Math.floor((elapsedRef.current - dt) * 10)) {
        setScore(scoreRef.current);
        setShieldHits(shieldHitsRef.current);
      }
    }

    function tick(ts: number) {
      const out = ensureCanvasResolution();
      if (!out) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { ctx, w, h } = out;

      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = clamp((ts - lastTsRef.current) / 1000, 0, 0.05);
      lastTsRef.current = ts;

      stepWorld(dt, w, h);
      drawScene(ctx, w, h);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
  }, []);

  // Keep refs in sync with UI state
  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    // Sync gameState ref is done via setState(), but ensure initial sync too
    stateRef.current = gameState;
  }, [gameState]);

  // UI: right rail
  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Controls</h3>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300 capitalize">{gameState}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Score {score}</span>
            <span>Best {best}</span>
            <span>Shield {shieldHits}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <Button
              key={d}
              type="button"
              variant={difficulty === d ? "default" : "outline"}
              className="h-9 px-3"
              onClick={() => {
                resetWorld(d);
                difficultyRef.current = d;
              }}
            >
              {d[0].toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {gameState === "playing" ? (
            <Button type="button" variant="outline" className="w-full" onClick={() => setState("paused")}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                if (gameState === "menu") startGame();
                else if (gameState === "paused") setState("playing");
                else if (gameState === "gameover") {
                  resetWorld();
                }
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              {gameState === "menu" ? "Start" : gameState === "paused" ? "Resume" : "New"}
            </Button>
          )}

          <Button type="button" variant="outline" className="w-full" onClick={() => resetWorld()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => setTheater((v) => !v)}>
            {theater ? <Minimize className="mr-2 h-4 w-4" /> : <Expand className="mr-2 h-4 w-4" />}
            Theater
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={toggleFullscreen}>
            {isFs ? <Minimize className="mr-2 h-4 w-4" /> : <Expand className="mr-2 h-4 w-4" />}
            Fullscreen
          </Button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{controlsHint}</div>
      </div>
    </div>
  );

  const below = (
    <div>
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Move left/right between lanes to dodge bricks. Grab stars for points and power-ups to survive longer.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Arrow keys or A/D to switch lanes.</li>
            <li>Press P to pause/resume. Press R to restart.</li>
            <li>Shield blocks a hit (max 3). Slow-mo lasts a few seconds.</li>
            <li>On mobile, swipe or use the on-screen buttons.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  // Overlays (menu + gameover)
  const showMenu = gameState === "menu";
  const showGameOver = gameState === "gameover";

  // IMPORTANT: This container prevents any horizontal growth/overflow loops
  const stageWrapClass = theater
    ? "fixed inset-0 z-[60] bg-black/70 p-4 md:p-8 overflow-auto"
    : "";

  const stageCardClass = theater
    ? "mx-auto w-full max-w-[1100px]"
    : "mx-auto w-full max-w-[980px]";

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[{ id: "how-to-play", label: "How to play" }]}
    >
      <div className={stageWrapClass}>
        <div className={stageCardClass}>
          {theater && (
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-white/80">
                Theater mode (ESC to close)
              </div>
              <Button type="button" variant="outline" onClick={() => setTheater(false)} className="bg-white/10 text-white border-white/20 hover:bg-white/15">
                <X className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          )}

          <div
            className="w-full overflow-hidden"
            // Safety: never allow horizontal expansion
            style={{ maxWidth: "100%" }}
          >
            <div
              ref={stageRef}
              tabIndex={0}
              className="relative w-full aspect-[16/9] md:aspect-[3/2] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden touch-none"
            >
              <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

              {/* Top HUD (HTML) */}
              <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-black/40 text-white/90 text-xs px-3 py-1 border border-white/10">
                  Score <span className="font-semibold">{score}</span>
                </span>
                <span className="rounded-full bg-black/40 text-white/70 text-xs px-3 py-1 border border-white/10">
                  Best <span className="font-semibold">{best}</span>
                </span>
                <span className="rounded-full bg-black/40 text-white/70 text-xs px-3 py-1 border border-white/10">
                  Shield <span className="font-semibold">{shieldHits}</span>
                </span>
              </div>

              {/* Menu overlay */}
              {showMenu && (
                <div
                  className="absolute inset-0 z-20 grid place-items-center bg-black/45"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="relative w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          Ready to dash
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/games")}
                          className="shrink-0"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Exit
                        </Button>
                      </div>

                      <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Choose a difficulty, then press Start. Swipe or use A/D to dodge bricks.
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                          <Button
                            key={d}
                            type="button"
                            variant={difficulty === d ? "default" : "outline"}
                            onClick={() => setDifficulty(d)}
                            className="h-11"
                          >
                            {d[0].toUpperCase() + d.slice(1)}
                          </Button>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          className="w-full h-11"
                          onClick={() => {
                            resetWorld(difficulty);
                            startGame();
                          }}
                        >
                          Start Game
                        </Button>
                      </div>

                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Tip: Press P to pause. Press R to restart.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paused overlay */}
              {gameState === "paused" && (
                <div className="absolute inset-0 z-20 grid place-items-center bg-black/45" role="dialog" aria-modal="true">
                  <div className="w-[min(92vw,520px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Paused</h3>
                      <Button type="button" variant="outline" onClick={() => navigate("/games")}>
                        <X className="mr-2 h-4 w-4" />
                        Exit
                      </Button>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button type="button" className="w-full" onClick={() => setState("playing")}>
                        Resume
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => resetWorld()}>
                        Restart
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Game over overlay */}
              {showGameOver && (
                <div className="absolute inset-0 z-30 grid place-items-center bg-black/45" role="dialog" aria-modal="true">
                  <div className="relative w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          Game Over
                        </h3>
                        <Button type="button" variant="outline" onClick={() => navigate("/games")}>
                          <X className="mr-2 h-4 w-4" />
                          Exit
                        </Button>
                      </div>

                      <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Final score: <span className="font-semibold">{score}</span>. Best:{" "}
                        <span className="font-semibold">{best}</span>.
                      </p>

                      <div className="mt-6 flex gap-2">
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => {
                            resetWorld(difficulty);
                            startGame();
                          }}
                        >
                          Play Again
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => resetWorld()}>
                          Restart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile controls */}
            <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
              <Button type="button" variant="outline" onClick={() => moveLane(-1)} className="h-12">
                ←
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (gameState === "menu") {
                    resetWorld(difficulty);
                    startGame();
                  } else if (gameState === "paused") {
                    setState("playing");
                  } else if (gameState === "playing") {
                    setState("paused");
                  } else {
                    resetWorld(difficulty);
                    startGame();
                  }
                }}
                className="h-12"
              >
                {gameState === "playing" ? "Pause" : gameState === "paused" ? "Resume" : gameState === "menu" ? "Start" : "Play"}
              </Button>
              <Button type="button" variant="outline" onClick={() => moveLane(1)} className="h-12">
                →
              </Button>
            </div>

            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {controlsHint}
            </div>
          </div>
        </div>
      </div>
    </GamePageLayout>
  );
}

/** Helpers */
function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function glowCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, glow: string) {
  ctx.save();
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
