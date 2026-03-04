import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_W = 700;
const CANVAS_H = 360;
const LANES = [80, 180, 280]; // Y centers for top / mid / bottom lanes
const SHIP_W = 54;
const SHIP_H = 26;
const SHIP_X = 80;
const HS_KEY = "hs_cosmic-dash";

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase = "READY" | "PLAYING" | "DEAD" | "GAME_OVER";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  alpha: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

type ObstacleKind = "asteroid" | "enemy" | "laser";

interface Obstacle {
  id: number;
  x: number;
  lane: number;
  kind: ObstacleKind;
  w: number;
  h: number;
  phase: number; // for laser animation
}

interface GameState {
  phase: GamePhase;
  lane: number;
  laneTarget: number;
  laneY: number;
  score: number;
  highScore: number;
  lives: number;
  speed: number;
  frame: number;
  invincible: number; // countdown frames
  stars: Star[];
  obstacles: Obstacle[];
  collectibles: Collectible[];
  nextId: number;
  spawnTimer: number;
  collectSpawnTimer: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadHS(): number {
  try {
    return parseInt(localStorage.getItem(HS_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveHS(score: number): void {
  try {
    localStorage.setItem(HS_KEY, String(score));
  } catch {
    // ignore
  }
}

function buildStars(): Star[] {
  return Array.from({ length: 120 }, () => ({
    x: Math.random() * CANVAS_W,
    y: Math.random() * CANVAS_H,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.7 + 0.3,
  }));
}

function initialState(): GameState {
  return {
    phase: "READY",
    lane: 1,
    laneTarget: 1,
    laneY: LANES[1],
    score: 0,
    highScore: loadHS(),
    lives: 3,
    speed: 4,
    frame: 0,
    invincible: 0,
    stars: buildStars(),
    obstacles: [],
    collectibles: [],
    nextId: 1,
    spawnTimer: 60,
    collectSpawnTimer: 90,
  };
}

function rectOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawSpaceship(ctx: CanvasRenderingContext2D, x: number, y: number, invincible: number) {
  const alpha = invincible > 0 ? (Math.floor(invincible / 5) % 2 === 0 ? 0.3 : 1) : 1;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Body
  ctx.fillStyle = "#00e5ff";
  ctx.beginPath();
  ctx.ellipse(x + SHIP_W / 2, y + SHIP_H / 2, SHIP_W / 2, SHIP_H / 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit
  ctx.fillStyle = "#b3f0ff";
  ctx.beginPath();
  ctx.ellipse(x + SHIP_W * 0.62, y + SHIP_H / 2, SHIP_W * 0.2, SHIP_H * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing bottom
  ctx.fillStyle = "#0097a7";
  ctx.beginPath();
  ctx.moveTo(x + SHIP_W * 0.25, y + SHIP_H);
  ctx.lineTo(x, y + SHIP_H + 14);
  ctx.lineTo(x + SHIP_W * 0.4, y + SHIP_H);
  ctx.closePath();
  ctx.fill();

  // Engine glow
  const grad = ctx.createRadialGradient(x + 6, y + SHIP_H / 2, 1, x + 6, y + SHIP_H / 2, 14);
  grad.addColorStop(0, "rgba(255,200,50,0.9)");
  grad.addColorStop(1, "rgba(255,80,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x + 6, y + SHIP_H / 2, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawAsteroid(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const cx = obs.x + obs.w / 2;
  const cy = LANES[obs.lane];
  const r = obs.w / 2;
  ctx.save();
  ctx.fillStyle = "#9e9e9e";
  ctx.strokeStyle = "#616161";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // craters
  ctx.fillStyle = "#616161";
  ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.25, r * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r * 0.2, cy + r * 0.3, r * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const x = obs.x;
  const y = LANES[obs.lane] - obs.h / 2;
  ctx.save();
  ctx.fillStyle = "#ef5350";
  ctx.beginPath();
  ctx.ellipse(x + obs.w / 2, y + obs.h / 2, obs.w / 2, obs.h / 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff1744";
  ctx.beginPath();
  ctx.ellipse(x + obs.w * 0.35, y + obs.h / 2, obs.w * 0.18, obs.h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.fillStyle = "#b71c1c";
  ctx.beginPath();
  ctx.moveTo(x + obs.w * 0.6, y + obs.h);
  ctx.lineTo(x + obs.w, y + obs.h + 12);
  ctx.lineTo(x + obs.w * 0.75, y + obs.h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLaser(ctx: CanvasRenderingContext2D, obs: Obstacle, frame: number) {
  const y = LANES[obs.lane];
  const pulseAlpha = 0.6 + 0.4 * Math.sin(frame * 0.3 + obs.phase);
  ctx.save();
  ctx.globalAlpha = pulseAlpha;
  ctx.strokeStyle = "#ff1744";
  ctx.lineWidth = 5;
  ctx.shadowColor = "#ff4444";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(obs.x, y);
  ctx.lineTo(obs.x + obs.w, y);
  ctx.stroke();
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, col: Collectible) {
  const cx = col.x;
  const cy = col.y;
  const r = 10;
  ctx.save();
  ctx.fillStyle = "#ffd600";
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outer = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const inner = outer + Math.PI / 5;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(outer), cy + r * Math.sin(outer));
    else ctx.lineTo(cx + r * Math.cos(outer), cy + r * Math.sin(outer));
    ctx.lineTo(cx + r * 0.45 * Math.cos(inner), cy + r * 0.45 * Math.sin(inner));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CosmicDashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState());
  const rafRef = useRef<number>(0);
  const [display, setDisplay] = useState<{
    phase: GamePhase;
    score: number;
    highScore: number;
    lives: number;
  }>({ phase: "READY", score: 0, highScore: loadHS(), lives: 3 });

  // ─── Input handling ──────────────────────────────────────────────

  const changeLane = useCallback((dir: -1 | 1) => {
    const s = stateRef.current;
    if (s.phase !== "PLAYING") return;
    const next = Math.max(0, Math.min(2, s.laneTarget + dir));
    stateRef.current = { ...s, laneTarget: next };
  }, []);

  const startGame = useCallback(() => {
    const hs = loadHS();
    stateRef.current = { ...initialState(), highScore: hs, phase: "PLAYING" };
    setDisplay({ phase: "PLAYING", score: 0, highScore: hs, lives: 3 });
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (e.code === "ArrowUp") { e.preventDefault(); changeLane(-1); }
    if (e.code === "ArrowDown") { e.preventDefault(); changeLane(1); }
    if ((e.code === "Space" || e.code === "Enter") && s.phase !== "PLAYING") { startGame(); }
  }, [changeLane, startGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Touch: tap top half = up, bottom half = down
  const handleCanvasTap = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const s = stateRef.current;
    if (s.phase !== "PLAYING") { startGame(); return; }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0] || e.changedTouches[0];
    const relY = touch.clientY - rect.top;
    if (relY < rect.height / 2) changeLane(-1);
    else changeLane(1);
  }, [changeLane, startGame]);

  // ─── Game loop ───────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function spawnObstacle(s: GameState): { obstacles: Obstacle[]; nextId: number } {
      const lane = Math.floor(Math.random() * 3);
      const kinds: ObstacleKind[] = ["asteroid", "asteroid", "enemy", "laser"];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const obs: Obstacle = {
        id: s.nextId,
        x: CANVAS_W + 20,
        lane,
        kind,
        w: kind === "laser" ? 120 + Math.random() * 80 : kind === "asteroid" ? 36 + Math.random() * 20 : 50,
        h: kind === "laser" ? 10 : kind === "asteroid" ? 36 + Math.random() * 20 : 24,
        phase: Math.random() * Math.PI * 2,
      };
      return { obstacles: [...s.obstacles, obs], nextId: s.nextId + 1 };
    }

    function spawnCollectible(s: GameState): { collectibles: Collectible[]; nextId: number } {
      const lane = Math.floor(Math.random() * 3);
      return {
        collectibles: [...s.collectibles, { id: s.nextId, x: CANVAS_W + 20, y: LANES[lane], collected: false }],
        nextId: s.nextId + 1,
      };
    }

    function tick() {
      const s = stateRef.current;
      if (s.phase !== "PLAYING") {
        draw(s);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Increase speed every 300 frames
      const speedBoost = Math.floor(s.frame / 300) * 0.4;
      const speed = Math.min(14, 4 + speedBoost);

      // Smooth lane transition
      const targetY = LANES[s.laneTarget];
      const dy = targetY - s.laneY;
      const newLaneY = Math.abs(dy) < 2 ? targetY : s.laneY + dy * 0.18;

      // Move stars
      const newStars = s.stars.map((st) => {
        const nx = st.x - st.speed * (speed / 4);
        return { ...st, x: nx < 0 ? CANVAS_W : nx };
      });

      // Move obstacles
      let newObstacles = s.obstacles
        .map((o) => ({ ...o, x: o.x - speed }))
        .filter((o) => o.x + o.w > -20);

      // Move collectibles
      let newCollectibles = s.collectibles
        .map((c) => ({ ...c, x: c.x - speed }))
        .filter((c) => !c.collected && c.x > -20);

      // Spawn
      let { nextId } = s;
      let spawnTimer = s.spawnTimer - 1;
      if (spawnTimer <= 0) {
        const interval = Math.max(45, 90 - Math.floor(s.frame / 200) * 3);
        spawnTimer = interval;
        const spawnResult = spawnObstacle({ ...s, obstacles: newObstacles, nextId });
        newObstacles = spawnResult.obstacles;
        nextId = spawnResult.nextId;
      }

      let collectSpawnTimer = s.collectSpawnTimer - 1;
      if (collectSpawnTimer <= 0) {
        collectSpawnTimer = 100 + Math.floor(Math.random() * 60);
        const collectResult = spawnCollectible({ ...s, collectibles: newCollectibles, nextId });
        newCollectibles = collectResult.collectibles;
        nextId = collectResult.nextId;
      }

      // Collision detection
      const shipY = newLaneY - SHIP_H / 2;
      let newLives = s.lives;
      let newInvincible = Math.max(0, s.invincible - 1);
      let newScore = s.score;

      if (newInvincible === 0) {
        for (const obs of newObstacles) {
          const obsY = LANES[obs.lane] - obs.h / 2;
          const hit = obs.kind === "laser"
            ? rectOverlap(SHIP_X, shipY, SHIP_W, SHIP_H, obs.x, LANES[obs.lane] - 4, obs.w, 8)
            : rectOverlap(SHIP_X + 6, shipY + 4, SHIP_W - 12, SHIP_H - 8, obs.x + 4, obsY + 4, obs.w - 8, obs.h - 8);
          if (hit) {
            newLives -= 1;
            newInvincible = 90;
            break;
          }
        }
      }

      // Collect stars
      for (const col of newCollectibles) {
        if (rectOverlap(SHIP_X, shipY, SHIP_W, SHIP_H, col.x - 10, col.y - 10, 20, 20)) {
          col.collected = true;
          newScore += 10;
        }
      }

      newScore += 1;

      let newPhase: GamePhase = "PLAYING";
      let newHighScore = s.highScore;
      if (newLives <= 0) {
        newPhase = "DEAD";
        if (newScore > s.highScore) {
          newHighScore = newScore;
          saveHS(newScore);
        }
        setTimeout(() => {
          stateRef.current = { ...stateRef.current, phase: "GAME_OVER" };
          setDisplay((d) => ({ ...d, phase: "GAME_OVER", highScore: newHighScore }));
        }, 800);
      }

      const next: GameState = {
        ...s,
        phase: newPhase,
        laneY: newLaneY,
        lane: s.laneTarget,
        speed,
        frame: s.frame + 1,
        invincible: newInvincible,
        stars: newStars,
        obstacles: newObstacles,
        collectibles: newCollectibles.filter((c) => !c.collected),
        score: newScore,
        highScore: newHighScore,
        lives: Math.max(0, newLives),
        spawnTimer,
        collectSpawnTimer,
        nextId,
      };

      stateRef.current = next;
      setDisplay({ phase: next.phase, score: next.score, highScore: next.highScore, lives: next.lives });

      draw(next);
      rafRef.current = requestAnimationFrame(tick);
    }

    function draw(s: GameState) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      ctx.fillStyle = "#050a1a";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars
      for (const st of s.stars) {
        ctx.globalAlpha = st.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Lane guides (subtle)
      ctx.strokeStyle = "rgba(0,229,255,0.06)";
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 16]);
      for (const ly of LANES) {
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(CANVAS_W, ly); ctx.stroke();
      }
      ctx.setLineDash([]);

      // Collectibles
      for (const col of s.collectibles) {
        drawStar(ctx, col);
      }

      // Obstacles
      for (const obs of s.obstacles) {
        if (obs.kind === "asteroid") drawAsteroid(ctx, obs);
        else if (obs.kind === "enemy") drawEnemy(ctx, obs);
        else drawLaser(ctx, obs, s.frame);
      }

      // Spaceship
      if (s.phase !== "DEAD") {
        drawSpaceship(ctx, SHIP_X, s.laneY - SHIP_H / 2, s.invincible);
      }

      // HUD
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE  ${s.score}`, 16, 28);
      ctx.textAlign = "right";
      ctx.fillText(`BEST  ${s.highScore}`, CANVAS_W - 16, 28);

      // Lives
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < s.lives ? "#00e5ff" : "#333";
        ctx.beginPath();
        ctx.arc(CANVAS_W / 2 + (i - 1) * 26, 22, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Overlays
      if (s.phase === "READY") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#00e5ff";
        ctx.font = "bold 42px monospace";
        ctx.textAlign = "center";
        ctx.fillText("COSMIC DASH", CANVAS_W / 2, CANVAS_H / 2 - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px monospace";
        ctx.fillText("Arrow keys or tap to switch lanes", CANVAS_W / 2, CANVAS_H / 2 + 10);
        ctx.fillStyle = "#ffd600";
        ctx.font = "bold 20px monospace";
        ctx.fillText("Press SPACE / ENTER or tap to start", CANVAS_W / 2, CANVAS_H / 2 + 50);
      }

      if (s.phase === "GAME_OVER" || s.phase === "DEAD") {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#ef5350";
        ctx.font = "bold 40px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px monospace";
        ctx.fillText(`Score: ${s.score}   Best: ${s.highScore}`, CANVAS_W / 2, CANVAS_H / 2 + 15);
        if (s.phase === "GAME_OVER") {
          ctx.fillStyle = "#ffd600";
          ctx.font = "bold 18px monospace";
          ctx.fillText("Press SPACE / ENTER or tap to retry", CANVAS_W / 2, CANVAS_H / 2 + 55);
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────

  const widget = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: CANVAS_W,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,229,255,0.25)",
          border: "2px solid rgba(0,229,255,0.3)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", width: "100%", height: "auto", cursor: "pointer" }}
          onTouchStart={handleCanvasTap}
          onClick={() => {
            const s = stateRef.current;
            if (s.phase !== "PLAYING") startGame();
          }}
        />
      </div>

      {/* Mobile controls */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button
          onTouchStart={(e) => { e.preventDefault(); changeLane(-1); }}
          onClick={() => changeLane(-1)}
          style={{
            padding: "14px 32px",
            background: "rgba(0,229,255,0.15)",
            border: "2px solid #00e5ff",
            borderRadius: 8,
            color: "#00e5ff",
            fontSize: 22,
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label="Move Up"
        >
          ▲
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); changeLane(1); }}
          onClick={() => changeLane(1)}
          style={{
            padding: "14px 32px",
            background: "rgba(0,229,255,0.15)",
            border: "2px solid #00e5ff",
            borderRadius: 8,
            color: "#00e5ff",
            fontSize: 22,
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label="Move Down"
        >
          ▼
        </button>
        {display.phase !== "PLAYING" && (
          <button
            onClick={startGame}
            style={{
              padding: "14px 28px",
              background: "rgba(255,214,0,0.15)",
              border: "2px solid #ffd600",
              borderRadius: 8,
              color: "#ffd600",
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {display.phase === "READY" ? "START" : "RETRY"}
          </button>
        )}
      </div>

      <div style={{ color: "#aaa", fontSize: 13, textAlign: "center" }}>
        Arrow keys or ▲▼ buttons to switch lanes &nbsp;|&nbsp; Collect yellow stars for bonus points
      </div>
    </div>
  );

  const editorial = (
    <div>
      <h2>How to Play Cosmic Dash</h2>
      <p>
        Cosmic Dash is a fast-paced side-scrolling space runner where you pilot a spacecraft
        through an asteroid field. Your ship flies through one of three horizontal lanes — top,
        middle, or bottom — and your goal is to survive as long as possible while collecting
        golden stars for bonus points.
      </p>

      <h3>Controls</h3>
      <ul>
        <li><strong>Arrow Up / Arrow Down</strong> — switch lanes on desktop.</li>
        <li><strong>Tap top half of screen</strong> — move up one lane.</li>
        <li><strong>Tap bottom half of screen</strong> — move down one lane.</li>
        <li><strong>Space or Enter</strong> — start or restart the game.</li>
        <li>Use the on-screen ▲ / ▼ buttons on touch devices.</li>
      </ul>

      <h3>Obstacles</h3>
      <ul>
        <li><strong>Asteroids (gray)</strong> — rocky debris flying in from the right. Switch lanes to avoid.</li>
        <li><strong>Enemy Ships (red)</strong> — hostile craft that mirror your silhouette. Dodge carefully.</li>
        <li><strong>Laser Beams (pulsing red)</strong> — long horizontal beams spanning an entire lane. Switch away immediately.</li>
      </ul>

      <h3>Scoring</h3>
      <p>
        You earn 1 point per frame survived. Each yellow star collected adds 10 bonus points.
        The game speed increases over time, making obstacle patterns harder to predict.
        Your best score is saved automatically in your browser.
      </p>

      <h3>Lives</h3>
      <p>
        You start with 3 lives shown as cyan circles at the top of the screen. Each collision
        removes a life and grants brief invincibility (the ship flickers). Losing all 3 lives
        ends the game.
      </p>

      <h3>Tips</h3>
      <ul>
        <li>Stay in the middle lane when possible — you can react to either direction quickly.</li>
        <li>Laser beams are easy to spot from a distance. React early.</li>
        <li>Enemy ships are worth dodging even if it means missing a star.</li>
        <li>Watch for obstacle clusters — two obstacles in adjacent lanes can force you into a corner.</li>
      </ul>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cosmic Dash"
      description="Play Cosmic Dash — a free browser space runner game. Pilot your spaceship through 3 lanes, dodge asteroids, enemy ships, and laser beams while collecting stars. How long can you survive?"
      canonical="https://www.smartkitnow.com/games/cosmic-dash"
      widget={widget}
      editorial={editorial}
      contentMaxWidth="max-w-5xl"
    />
  );
}
