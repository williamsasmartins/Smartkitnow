import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_W = 700;
const CANVAS_H = 320;
const GROUND_Y = 250;  // y-coordinate of ground surface
const PLAYER_W = 36;
const PLAYER_H = 52;
const PLAYER_X = 100;
const GRAVITY = 0.55;
const JUMP_VY = -13.5;
const DUCK_H = 28;
const DUCK_Y_OFFSET = PLAYER_H - DUCK_H;

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase = "READY" | "PLAYING" | "DEAD" | "GAME_OVER";
type ObstacleKind = "pit" | "log" | "boulder";

interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
  alpha: number;
}

interface Torch {
  x: number;
  frame: number;
}

interface Obstacle {
  id: number;
  kind: ObstacleKind;
  x: number;
  w: number;
  h: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  r: number;
}

interface GameState {
  phase: GamePhase;
  playerY: number;
  playerVY: number;
  ducking: boolean;
  grounded: boolean;
  animFrame: number;
  animTimer: number;
  score: number;
  lives: number;
  speed: number;
  frame: number;
  invincible: number;
  obstacles: Obstacle[];
  particles: Particle[];
  clouds: Cloud[];
  torches: Torch[];
  nextId: number;
  spawnTimer: number;
  bgX: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initialState(): GameState {
  return {
    phase: "READY",
    playerY: GROUND_Y,
    playerVY: 0,
    ducking: false,
    grounded: true,
    animFrame: 0,
    animTimer: 0,
    score: 0,
    lives: 3,
    speed: 4.5,
    frame: 0,
    invincible: 0,
    obstacles: [],
    particles: [],
    clouds: Array.from({ length: 5 }, (_, i) => ({
      x: (i * CANVAS_W) / 4 + Math.random() * 100,
      y: 30 + Math.random() * 60,
      w: 80 + Math.random() * 60,
      speed: 0.5 + Math.random() * 0.5,
      alpha: 0.15 + Math.random() * 0.2,
    })),
    torches: [
      { x: 200, frame: 0 },
      { x: 500, frame: 4 },
    ],
    nextId: 1,
    spawnTimer: 80,
    bgX: 0,
  };
}

function rectOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function emitDustParticles(x: number, y: number): Particle[] {
  return Array.from({ length: 8 }, () => ({
    x: x + Math.random() * PLAYER_W,
    y,
    vx: (Math.random() - 0.5) * 3,
    vy: -Math.random() * 2 - 0.5,
    life: 20 + Math.floor(Math.random() * 10),
    maxLife: 30,
    color: "#c8a96e",
    r: 2 + Math.random() * 3,
  }));
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D, bgX: number, clouds: Cloud[], torches: Torch[], frame: number) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  sky.addColorStop(0, "#1a0e00");
  sky.addColorStop(0.5, "#3d2200");
  sky.addColorStop(1, "#5c3300");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Clouds (fog)
  for (const cl of clouds) {
    ctx.globalAlpha = cl.alpha;
    ctx.fillStyle = "#c8a96e";
    ctx.beginPath();
    ctx.ellipse(cl.x, cl.y, cl.w / 2, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Temple wall tiles (scrolling)
  const tileW = 60;
  const tileH = 40;
  const wallTop = GROUND_Y - 10;
  ctx.fillStyle = "#4a3000";
  for (let row = 0; row * tileH < wallTop; row++) {
    for (let col = -1; col < CANVAS_W / tileW + 2; col++) {
      const tx = (col * tileW - (bgX % tileW)) + (row % 2 === 0 ? 0 : tileW / 2);
      const ty = row * tileH;
      ctx.strokeStyle = "#2a1a00";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, tileW - 1, tileH - 1);
    }
  }

  // Pillars
  for (let p = 0; p < 4; p++) {
    const px = ((p * 180) - (bgX % 180) + CANVAS_W) % CANVAS_W - 20;
    ctx.fillStyle = "#5c3d00";
    ctx.fillRect(px, 60, 28, wallTop - 60);
    ctx.fillStyle = "#7a5500";
    ctx.fillRect(px - 6, 55, 40, 16);
    ctx.fillRect(px - 4, wallTop - 16, 36, 22);
  }

  // Torches
  for (const torch of torches) {
    const tx = ((torch.x - (bgX % CANVAS_W)) + CANVAS_W * 2) % CANVAS_W;
    const ty = GROUND_Y - 80;
    // Bracket
    ctx.fillStyle = "#7a5500";
    ctx.fillRect(tx - 4, ty, 8, 24);
    // Flame
    const fAlpha = 0.7 + 0.3 * Math.sin(frame * 0.25 + torch.frame);
    ctx.globalAlpha = fAlpha;
    ctx.fillStyle = "#ff6d00";
    ctx.beginPath();
    ctx.moveTo(tx, ty - 2);
    ctx.lineTo(tx - 8, ty + 20);
    ctx.lineTo(tx + 8, ty + 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(tx, ty + 2);
    ctx.lineTo(tx - 4, ty + 16);
    ctx.lineTo(tx + 4, ty + 16);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // Glow
    const glow = ctx.createRadialGradient(tx, ty + 8, 2, tx, ty + 8, 28);
    glow.addColorStop(0, "rgba(255,150,0,0.18)");
    glow.addColorStop(1, "rgba(255,150,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(tx, ty + 8, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground
  const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
  groundGrad.addColorStop(0, "#7a5500");
  groundGrad.addColorStop(0.15, "#5c3d00");
  groundGrad.addColorStop(1, "#2a1a00");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

  // Ground tiles
  ctx.strokeStyle = "#4a2e00";
  ctx.lineWidth = 1;
  for (let g = -1; g < CANVAS_W / 40 + 2; g++) {
    const gx = (g * 40 - (bgX % 40));
    ctx.beginPath();
    ctx.moveTo(gx, GROUND_Y);
    ctx.lineTo(gx, GROUND_Y + 6);
    ctx.stroke();
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  playerY: number,
  ducking: boolean,
  animFrame: number,
  invincible: number
) {
  const alpha = invincible > 0 ? (Math.floor(invincible / 5) % 2 === 0 ? 0.3 : 1) : 1;
  const h = ducking ? DUCK_H : PLAYER_H;
  const y = ducking ? playerY + DUCK_Y_OFFSET : playerY;
  const x = PLAYER_X;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Hat / fedora
  if (!ducking) {
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x + 4, y - 14, PLAYER_W - 8, 10);
    ctx.fillRect(x - 2, y - 6, PLAYER_W + 4, 5);
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(x + 4, y - 14, PLAYER_W - 8, 3);
  }

  // Body (jacket)
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x + 4, y + (ducking ? 0 : 18), PLAYER_W - 8, h - (ducking ? 0 : 18));

  // Head
  if (!ducking) {
    ctx.fillStyle = "#d4a76a";
    ctx.fillRect(x + 6, y, PLAYER_W - 12, 20);
    // Eyes
    ctx.fillStyle = "#222";
    ctx.fillRect(x + 9, y + 5, 4, 4);
    ctx.fillRect(x + 20, y + 5, 4, 4);
    // Whip hint
    ctx.strokeStyle = "#c8a96e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + PLAYER_W, y + 14);
    ctx.quadraticCurveTo(x + PLAYER_W + 20, y + 20, x + PLAYER_W + 30, y + 30);
    ctx.stroke();
  }

  // Legs (animated)
  const leg1X = ducking ? x + 4 : x + 6 + (animFrame % 2 === 0 ? -4 : 4);
  const leg2X = ducking ? x + 14 : x + 18 + (animFrame % 2 === 0 ? 4 : -4);
  ctx.fillStyle = "#5d4037";
  if (ducking) {
    ctx.fillRect(x + 4, y + DUCK_H - 12, 12, 12);
    ctx.fillRect(x + 18, y + DUCK_H - 12, 12, 12);
  } else {
    ctx.fillRect(leg1X, y + h - 14, 10, 14);
    ctx.fillRect(leg2X, y + h - 14, 10, 14);
  }

  ctx.restore();
}

function drawPit(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const pitX = obs.x;
  // Dark hole in ground
  ctx.fillStyle = "#0d0700";
  ctx.fillRect(pitX, GROUND_Y, obs.w, CANVAS_H - GROUND_Y);
  // Edge highlights
  ctx.fillStyle = "#3d2200";
  ctx.fillRect(pitX, GROUND_Y, 4, 8);
  ctx.fillRect(pitX + obs.w - 4, GROUND_Y, 4, 8);
  // Warning line
  ctx.strokeStyle = "#ffd600";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(pitX, GROUND_Y - 2);
  ctx.lineTo(pitX + obs.w, GROUND_Y - 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLog(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const logY = GROUND_Y - 10;
  ctx.fillStyle = "#6d4c41";
  ctx.fillRect(obs.x, logY, obs.w, obs.h);
  // Wood grain
  ctx.strokeStyle = "#4e342e";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(obs.x + 8 + i * 12, logY + 4);
    ctx.lineTo(obs.x + 8 + i * 12, logY + obs.h - 4);
    ctx.stroke();
  }
  // End caps
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 2;
  ctx.strokeRect(obs.x, logY, obs.w, obs.h);
}

function drawBoulder(ctx: CanvasRenderingContext2D, obs: Obstacle, frame: number) {
  const cx = obs.x + obs.w / 2;
  const cy = GROUND_Y - obs.h / 2 + 4;
  const r = obs.w / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((frame * 0.08) % (Math.PI * 2));
  ctx.fillStyle = "#8d6e63";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.stroke();
  // Crack details
  ctx.strokeStyle = "#4e342e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, -r * 0.5);
  ctx.lineTo(0, r * 0.2);
  ctx.lineTo(r * 0.4, -r * 0.3);
  ctx.stroke();
  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TempleEscapeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState());
  const rafRef = useRef<number>(0);
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);
  const [display, setDisplay] = useState<{ phase: GamePhase; score: number; lives: number }>({
    phase: "READY", score: 0, lives: 3,
  });

  const doJump = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "PLAYING") return;
    if (s.grounded) {
      stateRef.current = { ...s, playerVY: JUMP_VY, grounded: false };
    }
  }, []);

  const startDuck = useCallback(() => {
    duckPressedRef.current = true;
  }, []);

  const stopDuck = useCallback(() => {
    duckPressedRef.current = false;
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = { ...initialState(), phase: "PLAYING" };
    setDisplay({ phase: "PLAYING", score: 0, lives: 3 });
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (s.phase !== "PLAYING") { startGame(); return; }
      doJump();
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      startDuck();
    }
  }, [doJump, startDuck, startGame]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "ArrowDown") stopDuck();
  }, [stopDuck]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKey, handleKeyUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function spawnObstacle(s: GameState): { obstacles: Obstacle[]; nextId: number } {
      const kinds: ObstacleKind[] = ["pit", "pit", "log", "log", "boulder"];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const obs: Obstacle = {
        id: s.nextId,
        kind,
        x: CANVAS_W + 30,
        w: kind === "pit" ? 60 + Math.random() * 40
          : kind === "log" ? 40 + Math.random() * 20
          : 50,
        h: kind === "pit" ? 0
          : kind === "log" ? 30 + Math.random() * 20
          : 52,
      };
      return { obstacles: [...s.obstacles, obs], nextId: s.nextId + 1 };
    }

    function tick() {
      const s = stateRef.current;
      if (s.phase !== "PLAYING") {
        draw(s);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const ducking = duckPressedRef.current;
      const speedBoost = Math.floor(s.frame / 400) * 0.5;
      const speed = Math.min(12, 4.5 + speedBoost);

      // Physics
      let playerVY = s.playerVY + GRAVITY;
      let playerY = s.playerY + playerVY;
      let grounded = false;
      if (playerY >= GROUND_Y) {
        playerY = GROUND_Y;
        playerVY = 0;
        grounded = true;
      }

      // Animation
      let animTimer = s.animTimer + 1;
      let animFrame = s.animFrame;
      if (animTimer >= 8) { animTimer = 0; animFrame = (animFrame + 1) % 4; }

      // Scrolling
      const bgX = s.bgX + speed;

      // Move clouds
      const newClouds = s.clouds.map((cl) => {
        const nx = cl.x - cl.speed;
        return { ...cl, x: nx < -cl.w ? CANVAS_W + cl.w : nx };
      });

      // Move torches
      const newTorches = s.torches.map((t) => {
        const nx = t.x - speed;
        return { ...t, x: nx < -40 ? CANVAS_W + 40 : nx };
      });

      // Move obstacles
      let newObstacles = s.obstacles
        .map((o) => ({ ...o, x: o.x - speed }))
        .filter((o) => o.x + o.w > -40);

      // Spawn
      let spawnTimer = s.spawnTimer - 1;
      let { nextId } = s;
      if (spawnTimer <= 0) {
        const interval = Math.max(50, 100 - Math.floor(s.frame / 300) * 5);
        spawnTimer = interval;
        const result = spawnObstacle({ ...s, obstacles: newObstacles, nextId });
        newObstacles = result.obstacles;
        nextId = result.nextId;
      }

      // Particles
      let newParticles = s.particles
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.1, life: p.life - 1 }))
        .filter((p) => p.life > 0);

      // Collision detection
      const duckingNow = ducking;
      const curH = duckingNow ? DUCK_H : PLAYER_H;
      const curY = duckingNow ? s.playerY + DUCK_Y_OFFSET : s.playerY;
      let newLives = s.lives;
      let newInvincible = Math.max(0, s.invincible - 1);
      let newScore = s.score + 1;

      if (newInvincible === 0) {
        for (const obs of newObstacles) {
          if (obs.kind === "pit") {
            // Pit: player falls in if over it and not jumping
            if (
              PLAYER_X + PLAYER_W * 0.6 > obs.x &&
              PLAYER_X + PLAYER_W * 0.4 < obs.x + obs.w &&
              grounded
            ) {
              newLives -= 1;
              newInvincible = 100;
              newParticles = [...newParticles, ...emitDustParticles(PLAYER_X, GROUND_Y)];
              break;
            }
          } else {
            // Solid obstacles
            const obsY = obs.kind === "boulder"
              ? GROUND_Y - obs.h / 2 + 4 - obs.h / 2
              : GROUND_Y - obs.h - 10;
            const hit = rectOverlap(
              PLAYER_X + 6, curY + 4, PLAYER_W - 12, curH - 8,
              obs.x + 4, obsY + 4, obs.w - 8, obs.h - 8
            );
            if (hit) {
              newLives -= 1;
              newInvincible = 100;
              newParticles = [...newParticles, ...emitDustParticles(PLAYER_X, curY)];
              break;
            }
          }
        }
      }

      let newPhase: GamePhase = "PLAYING";
      if (newLives <= 0) {
        newPhase = "DEAD";
        setTimeout(() => {
          stateRef.current = { ...stateRef.current, phase: "GAME_OVER" };
          setDisplay((d) => ({ ...d, phase: "GAME_OVER" }));
        }, 900);
      }

      const next: GameState = {
        ...s,
        phase: newPhase,
        playerY,
        playerVY,
        ducking: duckingNow,
        grounded,
        animFrame,
        animTimer,
        speed,
        frame: s.frame + 1,
        invincible: newInvincible,
        score: newScore,
        lives: Math.max(0, newLives),
        obstacles: newObstacles,
        particles: newParticles,
        clouds: newClouds,
        torches: newTorches,
        bgX,
        spawnTimer,
        nextId,
      };

      stateRef.current = next;
      setDisplay({ phase: next.phase, score: next.score, lives: next.lives });
      draw(next);
      rafRef.current = requestAnimationFrame(tick);
    }

    function draw(s: GameState) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawBackground(ctx, s.bgX, s.clouds, s.torches, s.frame);

      // Obstacles
      for (const obs of s.obstacles) {
        if (obs.kind === "pit") drawPit(ctx, obs);
        else if (obs.kind === "log") drawLog(ctx, obs);
        else drawBoulder(ctx, obs, s.frame);
      }

      // Particles
      drawParticles(ctx, s.particles);

      // Player
      if (s.phase !== "DEAD") {
        drawPlayer(ctx, s.playerY, s.ducking, s.animFrame, s.invincible);
      }

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, CANVAS_W, 42);
      ctx.fillStyle = "#ffd600";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`DIST  ${Math.floor(s.score / 10)}m`, 16, 26);

      // Lives hearts
      for (let i = 0; i < 3; i++) {
        ctx.font = "20px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(i < s.lives ? "❤️" : "🖤", CANVAS_W / 2 - 30 + i * 30, 26);
      }

      ctx.fillStyle = "#ffd600";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`SPD ${s.speed.toFixed(1)}`, CANVAS_W - 16, 26);

      // Overlays
      if (s.phase === "READY") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#ffd600";
        ctx.font = "bold 40px serif";
        ctx.textAlign = "center";
        ctx.fillText("TEMPLE ESCAPE", CANVAS_W / 2, CANVAS_H / 2 - 44);
        ctx.fillStyle = "#f5deb3";
        ctx.font = "17px monospace";
        ctx.fillText("SPACE / TAP JUMP to start", CANVAS_W / 2, CANVAS_H / 2 + 8);
        ctx.fillText("JUMP over pits & boulders  |  DUCK under logs", CANVAS_W / 2, CANVAS_H / 2 + 36);
      }

      if (s.phase === "GAME_OVER" || s.phase === "DEAD") {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#ef5350";
        ctx.font = "bold 38px serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU WERE CAUGHT!", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.fillStyle = "#ffd600";
        ctx.font = "22px monospace";
        ctx.fillText(`Distance: ${Math.floor(s.score / 10)}m`, CANVAS_W / 2, CANVAS_H / 2 + 16);
        if (s.phase === "GAME_OVER") {
          ctx.fillStyle = "#f5deb3";
          ctx.font = "bold 18px monospace";
          ctx.fillText("Press SPACE or tap JUMP to retry", CANVAS_W / 2, CANVAS_H / 2 + 54);
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const widget = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: "100%",
          maxWidth: CANVAS_W,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(255,180,0,0.2)",
          border: "2px solid rgba(200,140,50,0.4)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", width: "100%", height: "auto", cursor: "pointer" }}
          onClick={() => {
            const s = stateRef.current;
            if (s.phase !== "PLAYING") startGame();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const s = stateRef.current;
            if (s.phase !== "PLAYING") { startGame(); return; }
            // Touch top 60% = jump, bottom 40% = duck
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const touch = e.touches[0];
            const relY = touch.clientY - rect.top;
            if (relY < rect.height * 0.6) doJump();
            else startDuck();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDuck();
          }}
        />
      </div>

      {/* On-screen buttons */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button
          onMouseDown={doJump}
          onTouchStart={(e) => { e.preventDefault(); doJump(); }}
          style={{
            padding: "16px 40px",
            background: "rgba(255,214,0,0.15)",
            border: "2px solid #ffd600",
            borderRadius: 8,
            color: "#ffd600",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label="Jump"
        >
          JUMP
        </button>
        <button
          onMouseDown={startDuck}
          onMouseUp={stopDuck}
          onTouchStart={(e) => { e.preventDefault(); startDuck(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopDuck(); }}
          style={{
            padding: "16px 40px",
            background: "rgba(200,140,50,0.15)",
            border: "2px solid #c8a96e",
            borderRadius: 8,
            color: "#c8a96e",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            userSelect: "none",
          }}
          aria-label="Duck"
        >
          DUCK
        </button>
        {display.phase !== "PLAYING" && (
          <button
            onClick={startGame}
            style={{
              padding: "16px 30px",
              background: "rgba(255,100,0,0.15)",
              border: "2px solid #ff6d00",
              borderRadius: 8,
              color: "#ff6d00",
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
        SPACE / JUMP button to jump &nbsp;|&nbsp; Hold DOWN / DUCK button to duck under obstacles
      </div>
    </div>
  );

  const editorial = (
    <div>
      <h2>How to Play Temple Escape</h2>
      <p>
        Temple Escape is a side-scrolling runner game inspired by classic endless runners.
        Your explorer is sprinting through an ancient temple corridor — and the traps never
        stop coming. Jump over pits and boulders, duck under spinning logs, and survive as
        long as possible to maximize your distance score.
      </p>

      <h3>Controls</h3>
      <ul>
        <li><strong>Spacebar or Arrow Up</strong> — jump (hold briefly then release).</li>
        <li><strong>Arrow Down</strong> — duck (hold to stay low).</li>
        <li><strong>Tap upper 60% of screen</strong> — jump on mobile.</li>
        <li><strong>Tap lower 40% of screen</strong> — duck on mobile.</li>
        <li>Use the on-screen JUMP and DUCK buttons for touch devices.</li>
      </ul>

      <h3>Obstacles</h3>
      <ul>
        <li>
          <strong>Pit (dark gap with yellow warning line)</strong> — a gap in the floor.
          You must jump before reaching the edge to clear it safely.
        </li>
        <li>
          <strong>Log (brown horizontal beam)</strong> — a low-hanging trap. Duck under it
          by pressing and holding down. Standing height will collide with the beam.
        </li>
        <li>
          <strong>Rolling Boulder (large spinning rock)</strong> — a classic temple trap.
          Jump over the boulder before it rolls into you.
        </li>
      </ul>

      <h3>Scoring</h3>
      <p>
        Your score is measured in meters — the farther you run, the higher your distance.
        Every obstacle you clear safely adds to your total. The temple speeds up as you
        progress, shortening your reaction window for every trap.
      </p>

      <h3>Lives</h3>
      <p>
        You start with 3 lives shown as hearts in the HUD. Each collision with a trap costs
        one life and grants a brief invincibility period (the explorer flickers). Lose all
        3 lives and the game ends.
      </p>

      <h3>Tips</h3>
      <ul>
        <li>Pits are the most dangerous early — jump as soon as you see the yellow warning line.</li>
        <li>Logs require a long duck — hold the button the entire time you pass underneath.</li>
        <li>Boulders grow faster as speed increases. React early to high-speed segments.</li>
        <li>At high speeds, pit + boulder combos require a quick jump followed by an immediate landing.</li>
        <li>Torch flicker gives a visual heartbeat cue to help with rhythm — use it to stay focused.</li>
      </ul>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Temple Escape"
      description="Play Temple Escape — a free browser endless runner game. Sprint through an ancient temple, jump over pits and boulders, duck under logs, and survive as long as possible."
      canonical="https://www.smartkitnow.com/games/temple-escape"
      widget={widget}
      editorial={editorial}
      contentMaxWidth="max-w-5xl"
    />
  );
}
