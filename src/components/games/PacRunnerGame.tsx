import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 700;
const H = 340;
const GROUND_Y = H - 60;
const PAC_R = 18;
const PAC_X = 110;
const GRAVITY = 0.55;
const JUMP_VY = -13;
const HS_KEY = "hs_pac-runner";

// ─── Web Audio ────────────────────────────────────────────────────────────────
function mkAudio() {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
}
function playTone(ctx: AudioContext | null, freq: number, dur: number, type: OscillatorType = "square", vol = 0.15) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + dur);
}
function playJump(ctx: AudioContext | null) { playTone(ctx, 440, 0.12, "square", 0.1); }
function playCollect(ctx: AudioContext | null) { playTone(ctx, 880, 0.08, "sine", 0.12); }
function playPower(ctx: AudioContext | null) {
  if (!ctx) return;
  [660, 880, 1100].forEach((f, i) => setTimeout(() => playTone(ctx, f, 0.1, "sine", 0.1), i * 60));
}
function playHit(ctx: AudioContext | null) {
  if (!ctx) return;
  [200, 150, 100].forEach((f, i) => setTimeout(() => playTone(ctx, f, 0.1, "sawtooth", 0.15), i * 50));
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "menu" | "playing" | "over";

interface Ghost {
  id: number;
  x: number;
  y: number;
  vy: number;
  color: string;
  kind: "ground" | "float" | "swoop";
  swoopPhase: number;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  big: boolean;
  collected: boolean;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; r: number;
}

interface GameState {
  phase: Phase;
  pacY: number;
  pacVY: number;
  jumpsLeft: number;
  mouthAngle: number;
  invincible: number;
  powered: number;
  score: number;
  highScore: number;
  speed: number;
  frame: number;
  lives: number;
  ghosts: Ghost[];
  dots: Dot[];
  particles: Particle[];
  nextId: number;
  spawnTimer: number;
  dotTimer: number;
  scrollX: number;
  bgStars: { x: number; y: number; r: number }[];
}

const GHOST_COLORS = ["#ef4444", "#ec4899", "#60a5fa", "#fb923c"];

function mkState(): GameState {
  const hs = parseInt(localStorage.getItem(HS_KEY) || "0");
  return {
    phase: "menu",
    pacY: GROUND_Y - PAC_R,
    pacVY: 0,
    jumpsLeft: 2,
    mouthAngle: 0,
    invincible: 0,
    powered: 0,
    score: 0,
    highScore: hs,
    speed: 4,
    frame: 0,
    lives: 3,
    ghosts: [],
    dots: [],
    particles: [],
    nextId: 0,
    spawnTimer: 60,
    dotTimer: 30,
    scrollX: 0,
    bgStars: Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (GROUND_Y - 40),
      r: Math.random() * 1.5 + 0.3,
    })),
  };
}

function burst(x: number, y: number, color: string, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 5,
    vy: (Math.random() - 0.5) * 5,
    life: 30 + Math.random() * 20,
    maxLife: 50,
    color,
    r: Math.random() * 4 + 2,
  }));
}

// ─── Game UI ──────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stRef = useRef<GameState>(mkState());
  const audioRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const jumpedRef = useRef(false);

  const [display, setDisplay] = useState({
    phase: "menu" as Phase,
    score: 0,
    highScore: parseInt(localStorage.getItem(HS_KEY) || "0"),
    lives: 3,
    powered: 0,
  });

  const doJump = useCallback(() => {
    const s = stRef.current;
    if (s.phase !== "playing") return;
    if (s.jumpsLeft > 0) {
      s.pacVY = JUMP_VY;
      s.jumpsLeft--;
      playJump(audioRef.current);
      s.particles.push(...burst(PAC_X, s.pacY, "#facc15", 6));
    }
  }, []);

  const startGame = useCallback(() => {
    if (!audioRef.current) audioRef.current = mkAudio();
    const ns = mkState();
    ns.phase = "playing";
    stRef.current = ns;
    setDisplay({ phase: "playing", score: 0, highScore: ns.highScore, lives: 3, powered: 0 });
  }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") && !jumpedRef.current) {
        jumpedRef.current = true;
        const s = stRef.current;
        if (s.phase === "menu" || s.phase === "over") startGame();
        else doJump();
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") jumpedRef.current = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [doJump, startGame]);

  // ── Draw ───────────────────────────────────────────────────────────────────
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, s: GameState) => {
    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Stars
    s.bgStars.forEach(st => {
      ctx.globalAlpha = 0.4 + Math.sin(s.frame * 0.03 + st.x) * 0.3;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Ground
    const grdX = -(s.scrollX % 80);
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.strokeStyle = "#2563eb44";
    ctx.lineWidth = 1;
    for (let x = grdX; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, GROUND_Y); ctx.lineTo(x, H); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(W, GROUND_Y); ctx.stroke();

    // Dots
    s.dots.forEach(d => {
      if (d.big) {
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#a855f7";
        ctx.fillStyle = "#c084fc";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 12 + Math.sin(s.frame * 0.15) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#facc15";
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Ghosts
    s.ghosts.forEach(g => {
      const frightened = s.powered > 0;
      const gc = frightened
        ? (s.powered < 90 && s.frame % 20 < 10 ? "#fff" : "#3b82f6")
        : g.color;
      ctx.fillStyle = gc;
      ctx.shadowBlur = 10;
      ctx.shadowColor = gc;
      ctx.beginPath();
      ctx.arc(g.x, g.y - 10, 18, Math.PI, 0);
      ctx.lineTo(g.x + 18, g.y + 14);
      ctx.lineTo(g.x + 10, g.y + 7);
      ctx.lineTo(g.x + 2, g.y + 14);
      ctx.lineTo(g.x - 6, g.y + 7);
      ctx.lineTo(g.x - 14, g.y + 14);
      ctx.lineTo(g.x - 18, g.y + 14);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(g.x - 6, g.y - 12, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(g.x + 6, g.y - 12, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = frightened ? "#fff" : "#1e40af";
      ctx.beginPath(); ctx.arc(g.x - 5, g.y - 12, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(g.x + 7, g.y - 12, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Pac-Man
    const flashOff = s.invincible > 0 && s.frame % 10 < 5;
    if (!flashOff) {
      const powered = s.powered > 0;
      ctx.save();
      if (powered) { ctx.shadowBlur = 20; ctx.shadowColor = "#a855f7"; }
      ctx.fillStyle = powered ? "#c084fc" : "#facc15";
      ctx.beginPath();
      ctx.moveTo(PAC_X, s.pacY);
      ctx.arc(PAC_X, s.pacY, PAC_R, s.mouthAngle, Math.PI * 2 - s.mouthAngle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(PAC_X + 4, s.pacY - 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles
    s.particles.forEach(p => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Overlays
    if (s.phase === "menu") {
      ctx.fillStyle = "rgba(15,23,42,0.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#facc15";
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAC-RUNNER", W / 2, H / 2 - 48);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "15px monospace";
      ctx.fillText("Press SPACE, TAP, or ▶ Start", W / 2, H / 2 + 8);
      ctx.fillStyle = "#64748b";
      ctx.font = "12px monospace";
      ctx.fillText("SPACE / ↑ = Jump  •  Double-jump in the air!", W / 2, H / 2 + 36);
      ctx.textAlign = "left";
    }
    if (s.phase === "over") {
      ctx.fillStyle = "rgba(15,23,42,0.82)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 30px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 38);
      ctx.fillStyle = "#facc15";
      ctx.font = "20px monospace";
      ctx.fillText(`Score: ${Math.floor(s.score)}`, W / 2, H / 2 + 2);
      ctx.fillStyle = "#a855f7";
      ctx.font = "16px monospace";
      ctx.fillText(`Best: ${s.highScore}`, W / 2, H / 2 + 30);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px monospace";
      ctx.fillText("TAP or click ▶ Restart", W / 2, H / 2 + 60);
      ctx.textAlign = "left";
    }
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const s = stRef.current;
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(tick); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }

    if (s.phase === "playing") {
      s.frame++;
      s.speed = 4 + Math.min(6, s.score / 400);

      // Physics
      s.pacVY += GRAVITY;
      s.pacY += s.pacVY;
      if (s.pacY >= GROUND_Y - PAC_R) {
        s.pacY = GROUND_Y - PAC_R;
        s.pacVY = 0;
        s.jumpsLeft = 2;
      }
      if (s.pacY < PAC_R) { s.pacY = PAC_R; s.pacVY = 0; }

      if (s.invincible > 0) s.invincible--;
      if (s.powered > 0) s.powered--;
      s.mouthAngle = (Math.sin(s.frame * 0.25) + 1) * 0.3;
      s.scrollX += s.speed;

      // Spawn dots
      s.dotTimer--;
      if (s.dotTimer <= 0) {
        const big = Math.random() < 0.12;
        const yOpts = [GROUND_Y - PAC_R, GROUND_Y - PAC_R - 55, GROUND_Y - PAC_R - 105];
        s.dots.push({ id: s.nextId++, x: W + 20, y: yOpts[Math.floor(Math.random() * yOpts.length)], big, collected: false });
        s.dotTimer = big ? 80 + Math.random() * 50 : 18 + Math.random() * 28;
      }
      s.dots.forEach(d => { d.x -= s.speed; });
      s.dots = s.dots.filter(d => d.x > -30);

      // Dot collection
      s.dots.forEach(d => {
        if (d.collected) return;
        const dist = Math.hypot(PAC_X - d.x, s.pacY - d.y);
        if (dist < PAC_R + (d.big ? 14 : 8)) {
          d.collected = true;
          if (d.big) {
            s.powered = 300;
            s.score += 50;
            playPower(audioRef.current);
            s.particles.push(...burst(d.x, d.y, "#a855f7", 14));
          } else {
            s.score += 10;
            playCollect(audioRef.current);
            s.particles.push(...burst(d.x, d.y, "#facc15", 4));
          }
        }
      });
      s.dots = s.dots.filter(d => !d.collected);

      // Spawn ghosts
      s.spawnTimer--;
      if (s.spawnTimer <= 0) {
        const kinds: Ghost["kind"][] = ["ground", "float", "swoop"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        let y: number;
        if (kind === "ground") y = GROUND_Y - 22;
        else if (kind === "float") y = GROUND_Y - 80 - Math.random() * 80;
        else y = 70 + Math.random() * 60;
        s.ghosts.push({
          id: s.nextId++, x: W + 30, y,
          vy: kind === "float" ? (Math.random() * 0.7 - 0.35) : 1.8,
          color: GHOST_COLORS[Math.floor(Math.random() * GHOST_COLORS.length)],
          kind,
          swoopPhase: Math.random() * Math.PI * 2,
        });
        s.spawnTimer = Math.max(48, 110 - s.score / 40) + Math.random() * 40;
      }

      // Move ghosts
      s.ghosts.forEach(g => {
        g.x -= s.speed + 1;
        if (g.kind === "float") {
          g.y += g.vy;
          if (g.y < GROUND_Y - 160 || g.y > GROUND_Y - 26) g.vy *= -1;
        } else if (g.kind === "swoop") {
          g.swoopPhase += 0.04;
          g.y += (s.pacY - g.y) * 0.04 + Math.sin(g.swoopPhase) * 2;
        }
      });
      s.ghosts = s.ghosts.filter(g => g.x > -50);

      // Ghost collision
      if (s.invincible === 0) {
        for (let i = s.ghosts.length - 1; i >= 0; i--) {
          const g = s.ghosts[i];
          if (Math.hypot(PAC_X - g.x, s.pacY - g.y) < PAC_R + 16) {
            if (s.powered > 0) {
              s.score += 200;
              playCollect(audioRef.current);
              s.particles.push(...burst(g.x, g.y, "#60a5fa", 10));
              s.ghosts.splice(i, 1);
            } else {
              s.lives--;
              s.invincible = 120;
              playHit(audioRef.current);
              s.particles.push(...burst(PAC_X, s.pacY, "#ef4444", 12));
              if (s.lives <= 0) {
                s.phase = "over";
                if (s.score > s.highScore) {
                  s.highScore = s.score;
                  localStorage.setItem(HS_KEY, String(Math.floor(s.score)));
                }
              }
              break;
            }
          }
        }
      }

      // Passive score (per frame)
      s.score += 0.05;

      // Particles
      s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; });
      s.particles = s.particles.filter(p => p.life > 0);

      if (s.frame % 6 === 0) {
        setDisplay({ phase: s.phase, score: Math.floor(s.score), highScore: s.highScore, lives: s.lives, powered: s.powered });
      }
    }

    drawFrame(ctx, s);
    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const { phase } = display;
  const isAction = phase === "menu" || phase === "over";

  return (
    <div className="flex flex-col items-center gap-3 p-4 select-none">
      {/* HUD */}
      <div className="flex flex-wrap gap-4 text-sm font-mono items-center justify-center">
        <span className="text-yellow-400">⭐ {display.score}</span>
        <span className="text-purple-400">🏆 Best: {display.highScore}</span>
        <span className="text-red-400">{"❤️ ".repeat(Math.max(0, display.lives)).trim()}</span>
        {display.powered > 0 && (
          <span className="text-purple-300 animate-pulse font-bold">⚡ POWERED {Math.ceil(display.powered / 60)}s</span>
        )}
      </div>

      {/* Canvas */}
      <div className="relative w-full" style={{ maxWidth: W }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full rounded-xl border border-slate-700 cursor-pointer touch-none"
          style={{ display: "block" }}
          onClick={() => { if (isAction) startGame(); else doJump(); }}
          onTouchStart={(e) => { e.preventDefault(); if (isAction) startGame(); else doJump(); }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onPointerDown={() => { if (isAction) startGame(); else doJump(); }}
          className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black font-bold rounded-xl text-lg shadow-lg transition-transform"
        >
          {isAction ? "▶ " + (phase === "over" ? "Restart" : "Start") : "⬆ Jump"}
        </button>
      </div>

      <p className="text-xs text-slate-500">SPACE / ↑ = Jump • Tap anywhere • Double-jump in mid-air!</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function PacRunnerGame() {
  return (
    <CalculatorVerticalLayout
      title="Pac-Runner"
      description="Play Pac-Runner — a free endless runner inspired by Pac-Man. Eat dots, grab power pellets, dodge three ghost types, and double-jump to a new high score!"
      canonical="https://www.smartkitnow.com/games/pac-runner"
      widget={<GameUI />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Pac-Runner</h2>
          <p>You are Pac-Man sprinting through a neon city! Ghosts come from the right — dodge them or eat them after grabbing a power pellet.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Jump:</strong> SPACE, ↑ Arrow, W, or tap the screen.</li>
            <li><strong>Double Jump:</strong> Press jump again while airborne for extra height!</li>
            <li><strong>Yellow Dots:</strong> +10 points each. They float at different heights — some require a jump!</li>
            <li><strong>Purple Power Pellet:</strong> +50 pts. Makes you glow — eat ghosts for +200 each!</li>
          </ul>
          <h3 className="font-bold mt-2">Ghost Types</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Ground Ghost:</strong> Walks along the floor — jump over it.</li>
            <li><strong>Floating Ghost:</strong> Bobs up and down through the air — time your jump!</li>
            <li><strong>Swooping Ghost:</strong> Dives from above tracking your position — jump or stay very low.</li>
          </ul>
          <p>You have 3 lives. Speed increases as your score grows. High score is saved automatically!</p>
        </div>
      }
      contentMaxWidth="max-w-3xl"
    />
  );
}
