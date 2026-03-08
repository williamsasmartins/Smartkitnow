import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "READY" | "PLAYING" | "DEAD";

interface Character {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  grounded: boolean;
  rotation: number; // degrees, spins while airborne
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "spike" | "platform";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAR_SIZE = 36;
const GRAVITY = 0.6;
const JUMP_VEL = -12.5;
const HOLD_JUMP_VEL = -9;          // secondary velocity boost while holding
const HOLD_JUMP_MAX_FRAMES = 12;   // how many frames hold-jump applies
const BASE_SPEED = 5;
const GROUND_RATIO = 0.8;          // groundY = canvasH * GROUND_RATIO
const LEVEL_LENGTH = 5000;         // "px" units for progress bar
const HS_KEY = "geodash-best-pct";
const SPIKE_W = 34;
const SPIKE_H = 34;
const PLATFORM_W = 70;
const PLATFORM_H = 22;
const OBSTACLE_ID_START = 1;

// ─── Level pattern ────────────────────────────────────────────────────────────

// A "chunk" is a list of obstacles relative to chunk start X (in game units)
interface ObstacleDef { type: "spike" | "platform"; relX: number; relY: number; }

const CHUNKS: ObstacleDef[][] = [
  // chunk 0: single spike
  [{ type: "spike", relX: 0, relY: 0 }],
  // chunk 1: double spike
  [{ type: "spike", relX: 0, relY: 0 }, { type: "spike", relX: SPIKE_W + 4, relY: 0 }],
  // chunk 2: platform then spike
  [{ type: "platform", relX: 0, relY: -PLATFORM_H - 30 }, { type: "spike", relX: PLATFORM_W + 30, relY: 0 }],
  // chunk 3: triple spike
  [{ type: "spike", relX: 0, relY: 0 }, { type: "spike", relX: SPIKE_W + 4, relY: 0 }, { type: "spike", relX: (SPIKE_W + 4) * 2, relY: 0 }],
  // chunk 4: platform gap
  [{ type: "platform", relX: 0, relY: -40 }, { type: "platform", relX: PLATFORM_W + 60, relY: -55 }],
  // chunk 5: spike-platform-spike
  [{ type: "spike", relX: 0, relY: 0 }, { type: "platform", relX: 80, relY: -35 }, { type: "spike", relX: 200, relY: 0 }],
];

const CHUNK_SPACING = 400; // pixels between chunk starts (game coords)

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getBestPct(): number {
  try { return parseFloat(localStorage.getItem(HS_KEY) ?? "0"); } catch { return 0; }
}
function saveBestPct(pct: number): void {
  try { if (pct > getBestPct()) localStorage.setItem(HS_KEY, String(pct)); } catch { /* silent */ }
}

// ─── AABB collision ───────────────────────────────────────────────────────────

function aabbOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ─── Generate obstacles from level position ───────────────────────────────────

const _nextId = OBSTACLE_ID_START;

function generateObstaclesForWindow(
  cameraX: number,
  windowW: number,
  groundY: number,
  existingIds: Set<number>
): Obstacle[] {
  const result: Obstacle[] = [];
  // How many chunks fit in view + buffer
  const startChunk = Math.max(0, Math.floor((cameraX - windowW) / CHUNK_SPACING));
  const endChunk = Math.ceil((cameraX + windowW * 2) / CHUNK_SPACING);

  for (let ci = startChunk; ci <= endChunk; ci++) {
    const chunkX = ci * CHUNK_SPACING + 200; // first chunk starts at x=200
    const chunkDef = CHUNKS[ci % CHUNKS.length];
    for (const def of chunkDef) {
      const worldX = chunkX + def.relX;
      const worldY = groundY + def.relY - (def.type === "spike" ? SPIKE_H : PLATFORM_H);
      result.push({
        id: ci * 100 + chunkDef.indexOf(def),
        x: worldX,
        y: worldY,
        w: def.type === "spike" ? SPIKE_W : PLATFORM_W,
        h: def.type === "spike" ? SPIKE_H : PLATFORM_H,
        type: def.type,
      });
    }
  }
  return result;
}

// ─── Main Board ───────────────────────────────────────────────────────────────

function GeometryDashBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable game state in refs
  const stateRef = useRef<GameState>("READY");
  const charRef = useRef<Character>({
    x: 80, y: 0, w: CHAR_SIZE, h: CHAR_SIZE,
    vy: 0, grounded: true, rotation: 0,
  });
  const cameraXRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const distanceRef = useRef(0);
  const attemptRef = useRef(0);
  const bestPctRef = useRef(getBestPct());
  const jumpHeldRef = useRef(false);
  const jumpHeldFramesRef = useRef(0);
  const rafRef = useRef<number>(0);
  const groundYRef = useRef(0);
  const canvasWRef = useRef(400);
  const canvasHRef = useRef(220);
  const dprRef = useRef(1);
  const flashRef = useRef(0); // red flash frames on death

  // Display state
  const [displayState, setDisplayState] = useState<GameState>("READY");
  const [displayAttempt, setDisplayAttempt] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [displayBest, setDisplayBest] = useState(getBestPct());

  // ── Canvas sizing ──────────────────────────────────────────────────────────

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.clientWidth;
    const h = Math.min(Math.round(w * 0.55), 320);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvasWRef.current = w;
    canvasHRef.current = h;
    dprRef.current = dpr;
    groundYRef.current = Math.round(h * GROUND_RATIO);
    // Keep character on ground if ready
    if (stateRef.current === "READY") {
      charRef.current = { ...charRef.current, y: groundYRef.current - CHAR_SIZE };
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  // ── Draw ───────────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;
    const W = canvasWRef.current;
    const H = canvasHRef.current;
    const groundY = groundYRef.current;
    const char = charRef.current;
    const camX = cameraXRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Background stars
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    const seed = Math.floor(camX / 3);
    for (let i = 0; i < 30; i++) {
      const sx = ((seed + i * 137) % W);
      const sy = ((i * 97 + seed * 3) % (groundY - 20));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Ground
    ctx.fillStyle = "#0f3460";
    ctx.fillRect(0, groundY, W, H - groundY);
    // Ground top highlight
    ctx.fillStyle = "#16447a";
    ctx.fillRect(0, groundY, W, 4);

    // Grid lines on ground
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    const gSpacing = 60;
    const gOffset = camX % gSpacing;
    for (let gx = -gOffset; gx < W; gx += gSpacing) {
      ctx.beginPath();
      ctx.moveTo(gx, groundY);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }

    // Obstacles
    const obstacles = generateObstaclesForWindow(camX, W, groundY, new Set());
    for (const obs of obstacles) {
      const screenX = obs.x - camX;
      if (screenX + obs.w < -10 || screenX > W + 10) continue;

      if (obs.type === "spike") {
        // Draw triangle spike
        ctx.fillStyle = "#e94560";
        ctx.shadowColor = "#e94560";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(screenX + obs.w / 2, obs.y);
        ctx.lineTo(screenX + obs.w, obs.y + obs.h);
        ctx.lineTo(screenX, obs.y + obs.h);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Platform
        ctx.fillStyle = "#16213e";
        ctx.strokeStyle = "#533ae4";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#533ae4";
        ctx.shadowBlur = 8;
        ctx.fillRect(screenX, obs.y, obs.w, obs.h);
        ctx.strokeRect(screenX, obs.y, obs.w, obs.h);
        ctx.shadowBlur = 0;
      }
    }

    // Character
    ctx.save();
    const cx = char.x;
    const cy = char.y;
    ctx.translate(cx + char.w / 2, cy + char.h / 2);
    ctx.rotate((char.rotation * Math.PI) / 180);
    // Body
    ctx.fillStyle = "#e94560";
    ctx.shadowColor = "#e94560";
    ctx.shadowBlur = 12;
    ctx.fillRect(-char.w / 2, -char.h / 2, char.w, char.h);
    // Inner detail
    ctx.fillStyle = "#ff6b6b";
    ctx.shadowBlur = 0;
    ctx.fillRect(-char.w / 2 + 6, -char.h / 2 + 6, char.w - 12, char.h - 12);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Progress bar
    const pct = Math.min(distanceRef.current / LEVEL_LENGTH, 1);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(8, 8, W - 16, 10);
    const progressGrad = ctx.createLinearGradient(8, 0, W - 16, 0);
    progressGrad.addColorStop(0, "#533ae4");
    progressGrad.addColorStop(1, "#e94560");
    ctx.fillStyle = progressGrad;
    ctx.fillRect(8, 8, (W - 16) * pct, 10);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, W - 16, 10);

    // Pct text
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.round(11 * (W / 400))}px system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(pct * 100)}%`, W / 2, 8 + 9);

    // Attempt counter
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${Math.round(12 * (W / 400))}px system-ui`;
    ctx.fillText(`Attempt ${attemptRef.current}`, 10, H - 10);

    // Best %
    ctx.textAlign = "right";
    ctx.fillText(`Best: ${bestPctRef.current.toFixed(1)}%`, W - 10, H - 10);

    // Red flash on death
    if (flashRef.current > 0) {
      ctx.fillStyle = `rgba(233,69,96,${flashRef.current / 12 * 0.5})`;
      ctx.fillRect(0, 0, W, H);
      flashRef.current -= 1;
    }

    // READY overlay
    if (stateRef.current === "READY") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(20 * (W / 400))}px system-ui`;
      ctx.textAlign = "center";
      ctx.fillText("Tap or Press Space to Start", W / 2, H / 2 - 8);
      ctx.font = `${Math.round(13 * (W / 400))}px system-ui`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("Hold to jump higher", W / 2, H / 2 + 18);
    }

    // DEAD overlay
    if (stateRef.current === "DEAD") {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, W, H);
    }
  }, []);

  // ── Reset to start ─────────────────────────────────────────────────────────

  const resetToStart = useCallback(() => {
    const groundY = groundYRef.current;
    charRef.current = {
      x: 80,
      y: groundY - CHAR_SIZE,
      w: CHAR_SIZE,
      h: CHAR_SIZE,
      vy: 0,
      grounded: true,
      rotation: 0,
    };
    cameraXRef.current = 0;
    speedRef.current = BASE_SPEED;
    distanceRef.current = 0;
    jumpHeldRef.current = false;
    jumpHeldFramesRef.current = 0;
    flashRef.current = 0;
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────

  const gameLoop = useCallback(() => {
    if (stateRef.current !== "PLAYING") return;

    const groundY = groundYRef.current;
    const W = canvasWRef.current;
    const char = charRef.current;
    const speed = speedRef.current;

    // Advance distance
    distanceRef.current += speed;
    cameraXRef.current = distanceRef.current;

    // Apply gravity
    char.vy += GRAVITY;

    // Hold jump boost (only for limited frames)
    if (jumpHeldRef.current && !char.grounded && jumpHeldFramesRef.current < HOLD_JUMP_MAX_FRAMES) {
      char.vy = Math.min(char.vy, HOLD_JUMP_VEL);
      jumpHeldFramesRef.current++;
    }

    char.y += char.vy;

    // Ground collision
    const targetGroundY = groundY - char.h;
    if (char.y >= targetGroundY) {
      char.y = targetGroundY;
      char.vy = 0;
      char.grounded = true;
      char.rotation = Math.round(char.rotation / 90) * 90; // snap rotation
    } else {
      char.grounded = false;
    }

    // Rotation when airborne
    if (!char.grounded) {
      char.rotation = (char.rotation + 6) % 360;
    }

    // Obstacle collision
    const charWorldX = char.x + cameraXRef.current - 80; // char is fixed at x=80 on screen
    const obstacles = generateObstaclesForWindow(cameraXRef.current, W, groundY, new Set());

    for (const obs of obstacles) {
      if (aabbOverlap(
        charWorldX + 3, char.y + 3, char.w - 6, char.h - 6,
        obs.x, obs.y, obs.w, obs.h
      )) {
        if (obs.type === "spike") {
          // Death
          const pct = (distanceRef.current / LEVEL_LENGTH) * 100;
          saveBestPct(pct);
          bestPctRef.current = getBestPct();
          flashRef.current = 12;
          stateRef.current = "DEAD";
          setDisplayState("DEAD");
          setDisplayPct(pct);
          setDisplayBest(bestPctRef.current);
          draw();
          return;
        } else {
          // Platform — land on top
          if (char.vy > 0 && char.y + char.h < obs.y + obs.h / 2 + 8) {
            char.y = obs.y - char.h;
            char.vy = 0;
            char.grounded = true;
          }
        }
      }
    }

    // Increase speed every 20% of level
    const progress = distanceRef.current / LEVEL_LENGTH;
    speedRef.current = BASE_SPEED + Math.floor(progress * 5) * 0.8;
    // Loop level
    if (distanceRef.current >= LEVEL_LENGTH) {
      distanceRef.current = 0;
    }

    setDisplayPct(Math.round((distanceRef.current / LEVEL_LENGTH) * 100));
    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  // ── Jump ───────────────────────────────────────────────────────────────────

  const jump = useCallback(() => {
    if (stateRef.current === "READY") {
      stateRef.current = "PLAYING";
      attemptRef.current = 1;
      setDisplayState("PLAYING");
      setDisplayAttempt(1);
      resetToStart();
      // Give initial jump
      charRef.current.vy = JUMP_VEL;
      charRef.current.grounded = false;
      jumpHeldFramesRef.current = 0;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (stateRef.current === "DEAD") {
      // Restart
      stateRef.current = "PLAYING";
      attemptRef.current++;
      setDisplayState("PLAYING");
      setDisplayAttempt(attemptRef.current);
      resetToStart();
      charRef.current.vy = JUMP_VEL;
      charRef.current.grounded = false;
      jumpHeldFramesRef.current = 0;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (stateRef.current === "PLAYING" && charRef.current.grounded) {
      charRef.current.vy = JUMP_VEL;
      charRef.current.grounded = false;
      jumpHeldFramesRef.current = 0;
    }
  }, [gameLoop, resetToStart]);

  const startHold = useCallback(() => {
    jumpHeldRef.current = true;
    jump();
  }, [jump]);

  const endHold = useCallback(() => {
    jumpHeldRef.current = false;
  }, []);

  // ── Keyboard ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jumpHeldRef.current = true;
        jump();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        jumpHeldRef.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [jump]);

  // ── Initial draw + cleanup ─────────────────────────────────────────────────

  useEffect(() => {
    resizeCanvas();
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [resizeCanvas, draw]);

  useEffect(() => {
    draw();
  });

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
        <span>Attempt: <span className="text-indigo-600 dark:text-indigo-400 font-black">{displayAttempt}</span></span>
        <span>{displayPct}% <span className="text-slate-400 dark:text-slate-500 font-normal">of level</span></span>
        <span>Best: <span className="text-amber-500 font-black">{displayBest.toFixed(1)}%</span></span>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full relative">
        <canvas
          ref={canvasRef}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          className="block w-full touch-none rounded-xl overflow-hidden cursor-pointer"
          style={{ background: "#1a1a2e" }}
        />

        {/* DEAD overlay with restart button */}
        {displayState === "DEAD" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl">
            <div className="text-center text-white">
              <p className="text-2xl font-black">Crashed!</p>
              <p className="text-slate-300 text-sm">Reached {displayPct.toFixed(1)}%</p>
              {displayPct >= displayBest && displayPct > 0 && (
                <p className="text-amber-400 font-bold mt-1">New Best!</p>
              )}
            </div>
            <button
              onPointerDown={startHold}
              onPointerUp={endHold}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors select-none"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Tap canvas / Press Space to jump. Hold for higher jump.
      </p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function GeometryDashGame({
  title = "Geometry Dash Lite",
  description = "One-button rhythm platformer! Tap or press Space to jump over spikes and obstacles. Hold for a higher jump. How far can you get?",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p>
          Geometry Dash Lite is a one-button platformer inspired by the original Geometry Dash.
          Your colored square runs automatically — your only control is jumping.
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Tap the canvas or press Space / Arrow Up to start and jump.</li>
          <li>Hold the tap/key for a higher jump arc.</li>
          <li>Avoid the red spike triangles — touching one is instant death.</li>
          <li>Platforms can be jumped onto; use them to navigate elevated obstacles.</li>
          <li>The progress bar at the top shows how far through the level you are.</li>
          <li>Each death increments the attempt counter. The level loops endlessly.</li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips for Progress</h2>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Tap, don't mash:</strong> A single tap gives a consistent short jump. Mashing can cause mistimed jumps when you don't expect an obstacle.</li>
          <li><strong>Learn the pattern:</strong> The level repeats in predictable chunks. After a few runs, you'll start to recognize what's coming and pre-jump.</li>
          <li><strong>Hold for double spikes:</strong> Double and triple spikes require a longer jump arc. Hold the button as you approach them.</li>
          <li><strong>Use platforms:</strong> Elevated platforms give you more room to maneuver. Land on them to avoid ground-level spike clusters below.</li>
          <li><strong>Watch speed increases:</strong> The game gets faster every 20% of the level. Stay alert as you approach those thresholds.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Does the level repeat?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — the level is a fixed-length loop. When you reach 100%, it wraps back to the start and continues. The progress bar shows your position within the current loop.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">What does the best percentage represent?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              It's the furthest point in the level (as a percentage) you've reached before dying. 100% means you completed a full loop. It's saved in localStorage between sessions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Can I play on mobile?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — tap anywhere on the game canvas to jump. Hold your finger down for a higher jump arc. The canvas resizes responsively to fit your screen width.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Why does the character rotate in the air?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The character spins while airborne, just like in the original Geometry Dash. It snaps to the nearest 90° angle when landing, giving a clean visual reset.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<GeometryDashBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
