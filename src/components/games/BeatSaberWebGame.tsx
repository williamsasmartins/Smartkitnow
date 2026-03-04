import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 600;
const H = 500;
const LANE_COUNT = 4;
const LANE_W = W / LANE_COUNT;
const BPM = 128;
const BEAT_MS = (60 / BPM) * 1000;
const MAX_HEALTH = 100;
const BLOCK_SPAWN_Z = 0.01;
const BLOCK_HIT_Z = 0.85;
const HS_KEY = "hs_beat-saber-web";

type BlockType = "red" | "blue";
type Dir = "left" | "right";
interface Block {
  id: number;
  lane: number;
  type: BlockType;
  dir: Dir;
  z: number; // 0..1, 1 = closest
  hit: boolean;
  miss: boolean;
}
interface SlashTrail {
  x1: number; y1: number;
  x2: number; y2: number;
  life: number;
  color: string;
}

// ─── Audio helpers ────────────────────────────────────────────────────────────
function getAudioCtx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function playBeat(ctx: AudioContext, time: number, beat: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  const freq = beat % 4 === 0 ? 120 : beat % 2 === 0 ? 90 : 70;
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  osc.start(time);
  osc.stop(time + 0.2);
}

function playSlashSound(ctx: AudioContext, success: boolean) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = success ? "sine" : "sawtooth";
  osc.frequency.setValueAtTime(success ? 660 : 220, ctx.currentTime);
  if (success) osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const stateRef = useRef({
    phase: "menu" as "menu" | "playing" | "gameover",
    blocks: [] as Block[],
    slash: null as SlashTrail | null,
    slashStart: null as { x: number; y: number } | null,
    health: MAX_HEALTH,
    score: 0,
    combo: 0,
    maxCombo: 0,
    bestScore: 0,
    difficulty: "normal" as "easy" | "normal" | "hard",
    blockSpeed: 0.0012,
    baseBlockSpeed: 0.0012,
    idCounter: 0,
    beatCount: 0,
    lastBeatTime: 0,
    gameStartTime: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });
  const animRef = useRef<number>(0);
  const [uiState, setUiState] = useState({ score: 0, combo: 0, health: MAX_HEALTH, phase: "menu" as string, bestScore: 0 });

  // Load best score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(HS_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) stateRef.current.bestScore = parsed;
    }
  }, []);

  const difficultySettings = {
    easy: { blockSpeed: 0.0008, spawnRate: 2 },
    normal: { blockSpeed: 0.0012, spawnRate: 1.5 },
    hard: { blockSpeed: 0.0018, spawnRate: 1 },
  };

  const startGame = useCallback((diff: "easy" | "normal" | "hard" = "normal") => {
    if (!audioRef.current) audioRef.current = getAudioCtx();
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    const s = stateRef.current;
    s.phase = "playing";
    s.blocks = [];
    s.health = MAX_HEALTH;
    s.score = 0;
    s.combo = 0;
    s.maxCombo = 0;
    s.difficulty = diff;
    s.blockSpeed = difficultySettings[diff].blockSpeed;
    s.baseBlockSpeed = difficultySettings[diff].blockSpeed;
    s.beatCount = 0;
    s.lastBeatTime = performance.now();
    s.gameStartTime = performance.now();
    s.particles = [];
    s.slash = null;
    s.slashStart = null;
  }, []);

  const processSlash = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const s = stateRef.current;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 20) return;

    const slashDir: Dir = dx < 0 ? "left" : "right";
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    let hit = false;
    for (const block of s.blocks) {
      if (block.hit || block.miss) continue;
      if (block.z < BLOCK_HIT_Z - 0.1 || block.z > BLOCK_HIT_Z + 0.15) continue;

      const bx = LANE_W * block.lane + LANE_W / 2;
      const by = H * 0.65;
      const bSize = 30 + block.z * 50;

      if (Math.abs(midX - bx) < bSize * 1.5 && Math.abs(midY - by) < bSize * 1.5) {
        if (slashDir === block.dir) {
          block.hit = true;
          s.combo++;
          s.maxCombo = Math.max(s.maxCombo, s.combo);
          s.score += 100 * s.combo;
          hit = true;
          if (audioRef.current) playSlashSound(audioRef.current, true);
          for (let i = 0; i < 12; i++) {
            s.particles.push({
              x: bx, y: by,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.8) * 8,
              life: 1,
              color: block.type === "red" ? "#e74c3c" : "#3498db",
            });
          }
        } else {
          block.miss = true;
          s.combo = 0;
          s.health = Math.max(0, s.health - 15);
          if (audioRef.current) playSlashSound(audioRef.current, false);
        }
        break;
      }
    }

    const color = hit ? "#f1c40f" : "#ff6b6b";
    s.slash = { x1: start.x, y1: start.y, x2: end.x, y2: end.y, life: 1, color };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = (timestamp: number) => {
      const s = stateRef.current;

      if (s.phase === "playing") {
        // Difficulty ramp: increase speed every 15 seconds, up to 2x base speed
        const elapsed = (timestamp - s.gameStartTime) / 1000;
        const rampFactor = Math.min(2.0, 1 + elapsed / 90);
        s.blockSpeed = s.baseBlockSpeed * rampFactor;

        // Beat scheduling
        if (timestamp - s.lastBeatTime >= BEAT_MS / 2) {
          s.lastBeatTime = timestamp;
          s.beatCount++;
          if (audioRef.current) playBeat(audioRef.current, audioRef.current.currentTime, s.beatCount);

          const diff = difficultySettings[s.difficulty];
          // Spawn rate also increases with ramp: at 2x ramp, spawn ~1.5x more blocks
          const effectiveRate = Math.max(1, diff.spawnRate / rampFactor);
          if (s.beatCount % Math.round(effectiveRate) === 0) {
            const lane = Math.floor(Math.random() * LANE_COUNT);
            const type: BlockType = Math.random() < 0.5 ? "red" : "blue";
            s.blocks.push({
              id: s.idCounter++,
              lane, type,
              dir: type === "red" ? "left" : "right",
              z: BLOCK_SPAWN_Z,
              hit: false, miss: false,
            });
          }
        }

        // Move blocks
        s.blocks.forEach((b) => { b.z += s.blockSpeed * 16; });

        // Miss detection
        s.blocks.forEach((b) => {
          if (!b.hit && !b.miss && b.z > BLOCK_HIT_Z + 0.2) {
            b.miss = true;
            s.combo = 0;
            s.health = Math.max(0, s.health - 10);
          }
        });

        // Remove old blocks
        s.blocks = s.blocks.filter((b) => b.z < 1.2);

        // Particles
        s.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.04; });
        s.particles = s.particles.filter((p) => p.life > 0);

        // Slash fade
        if (s.slash) { s.slash.life -= 0.08; if (s.slash.life <= 0) s.slash = null; }

        if (s.health <= 0) {
          s.phase = "gameover";
          // Persist best score
          if (s.score > s.bestScore) {
            s.bestScore = s.score;
            localStorage.setItem(HS_KEY, String(s.score));
          }
        }
      }

      // ─── Draw ───────────────────────────────────────────────────────
      ctx.fillStyle = "#0d0d1a";
      ctx.fillRect(0, 0, W, H);

      // Perspective grid
      const vp = { x: W / 2, y: H * 0.3 };
      ctx.strokeStyle = "rgba(100,100,255,0.3)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= LANE_COUNT; i++) {
        const x = LANE_W * i;
        ctx.beginPath();
        ctx.moveTo(x, H);
        ctx.lineTo(vp.x + (x - W / 2) * 0.2, vp.y);
        ctx.stroke();
      }
      for (let i = 0; i < 10; i++) {
        const t = i / 10;
        const y = vp.y + (H - vp.y) * t;
        const scaleX = 0.2 + t * 0.8;
        ctx.beginPath();
        ctx.moveTo(W / 2 - (W / 2) * scaleX, y);
        ctx.lineTo(W / 2 + (W / 2) * scaleX, y);
        ctx.stroke();
      }

      // Draw blocks (back-to-front)
      const sorted = [...s.blocks].sort((a, b) => a.z - b.z);
      for (const block of sorted) {
        if (block.hit) continue;
        const bx = LANE_W * block.lane + LANE_W / 2;
        const by = H * 0.65;
        const scale = 0.2 + block.z * 0.9;
        const bSize = 18 * scale;
        const alpha = Math.min(1, block.z * 2);
        const col = block.miss ? "#666" : (block.type === "red" ? "#e74c3c" : "#3498db");
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.roundRect(bx - bSize, by - bSize, bSize * 2, bSize * 2, 6);
        ctx.fill();
        // Arrow direction indicator
        ctx.fillStyle = "white";
        ctx.font = `bold ${bSize * 0.9}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(block.dir === "left" ? "←" : "→", bx, by);
        // Glow
        ctx.shadowColor = col;
        ctx.shadowBlur = 15 * block.z;
        ctx.beginPath();
        ctx.roundRect(bx - bSize, by - bSize, bSize * 2, bSize * 2, 6);
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      // Particles
      for (const p of s.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Slash trail
      if (s.slash && s.slash.life > 0) {
        ctx.beginPath();
        ctx.moveTo(s.slash.x1, s.slash.y1);
        ctx.lineTo(s.slash.x2, s.slash.y2);
        ctx.strokeStyle = s.slash.color;
        ctx.lineWidth = 5 * s.slash.life;
        ctx.globalAlpha = s.slash.life;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineCap = "butt";
      }

      // HUD background
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, W, 56);

      // Health bar
      ctx.fillStyle = "#333";
      ctx.fillRect(10, 10, 180, 16);
      const hColor = s.health > 60 ? "#2ecc71" : s.health > 30 ? "#f39c12" : "#e74c3c";
      ctx.fillStyle = hColor;
      ctx.fillRect(10, 10, 180 * (s.health / MAX_HEALTH), 16);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 180, 16);
      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.fillText("HP", 14, 23);

      // Best score label
      ctx.fillStyle = "#f1c40f";
      ctx.font = "11px sans-serif";
      ctx.fillText(`BEST: ${s.bestScore}`, 10, 44);

      // Score (top right)
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${s.score}`, W - 10, 26);

      // Combo multiplier (prominent, color-coded)
      if (s.combo >= 2) {
        const comboColor = s.combo >= 20 ? "#e74c3c" : s.combo >= 10 ? "#e67e22" : s.combo >= 5 ? "#f1c40f" : "#2ecc71";
        ctx.fillStyle = comboColor;
        ctx.font = `bold ${s.combo >= 10 ? 16 : 14}px sans-serif`;
        ctx.fillText(`×${s.combo} COMBO`, W - 10, 46);
      } else {
        ctx.fillStyle = "#aaa";
        ctx.font = "13px sans-serif";
        ctx.fillText(`×1`, W - 10, 46);
      }
      ctx.textAlign = "left";

      // Red/Blue legend
      ctx.fillStyle = "#e74c3c";
      ctx.font = "13px sans-serif";
      ctx.fillText("← Red: swipe left", 10, H - 20);
      ctx.fillStyle = "#3498db";
      ctx.fillText("→ Blue: swipe right", 10, H - 6);

      // Overlays
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.82)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BEAT SABER", W / 2, 110);
        ctx.fillStyle = "#3498db";
        ctx.fillText("WEB", W / 2, 155);

        // Best score on menu
        if (s.bestScore > 0) {
          ctx.fillStyle = "#f1c40f";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(`Best Score: ${s.bestScore}`, W / 2, 185);
        }

        ctx.fillStyle = "#ccc";
        ctx.font = "14px sans-serif";
        ctx.fillText("Swipe/drag to slash approaching blocks", W / 2, 220);
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("← swipe LEFT for RED blocks", W / 2, 242);
        ctx.fillStyle = "#3498db";
        ctx.fillText("→ swipe RIGHT for BLUE blocks", W / 2, 264);

        // Difficulty buttons — drawn as clickable rects
        // Y ranges: Easy 318-358, Normal 358-398, Hard 398-438
        const difficulties: Array<"easy" | "normal" | "hard"> = ["easy", "normal", "hard"];
        const btnColors = ["#2ecc71", "#f39c12", "#e74c3c"];
        difficulties.forEach((d, i) => {
          const btnY = 318 + i * 40;
          const btnH = 36;
          ctx.fillStyle = btnColors[i] + "33"; // semi-transparent bg
          ctx.beginPath();
          ctx.roundRect(W / 2 - 90, btnY, 180, btnH, 8);
          ctx.fill();
          ctx.strokeStyle = btnColors[i];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(W / 2 - 90, btnY, 180, btnH, 8);
          ctx.stroke();
          ctx.fillStyle = btnColors[i];
          ctx.font = "bold 18px sans-serif";
          ctx.fillText(d.toUpperCase(), W / 2, btnY + 24);
        });

        ctx.fillStyle = "#888";
        ctx.font = "13px sans-serif";
        ctx.fillText("Tap / click a difficulty to start", W / 2, 462);
        ctx.textAlign = "left";
      } else if (s.phase === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.78)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 60);
        ctx.fillStyle = "#fff";
        ctx.font = "22px sans-serif";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 - 15);
        ctx.fillText(`Max Combo: ×${s.maxCombo}`, W / 2, H / 2 + 18);
        // Best score line
        if (s.score >= s.bestScore && s.score > 0) {
          ctx.fillStyle = "#f1c40f";
          ctx.font = "bold 18px sans-serif";
          ctx.fillText("NEW BEST!", W / 2, H / 2 + 48);
        } else if (s.bestScore > 0) {
          ctx.fillStyle = "#f1c40f";
          ctx.font = "16px sans-serif";
          ctx.fillText(`Best: ${s.bestScore}`, W / 2, H / 2 + 48);
        }
        ctx.fillStyle = "#2ecc71";
        ctx.font = "18px sans-serif";
        ctx.fillText("Tap / click to restart", W / 2, H / 2 + 85);
        ctx.textAlign = "left";
      }

      setUiState({ score: s.score, combo: s.combo, health: s.health, phase: s.phase, bestScore: s.bestScore });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [processSlash]);

  const handleMenuClick = useCallback((y: number) => {
    if (y >= 318 && y < 358) startGame("easy");
    else if (y >= 358 && y < 398) startGame("normal");
    else if (y >= 398 && y < 438) startGame("hard");
    // No fallback — only clicking a button starts the game
  }, [startGame]);

  // Mouse/touch slash detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent | Touch): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e as any).clientX - rect.left) * (W / rect.width),
        y: ((e as any).clientY - rect.top) * (H / rect.height),
      };
    };

    const onDown = (e: MouseEvent) => {
      stateRef.current.slashStart = getPos(e);
    };
    const onUp = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.slashStart || s.phase !== "playing") { s.slashStart = null; return; }
      const end = getPos(e);
      processSlash(s.slashStart, end);
      s.slashStart = null;
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const pos = getPos(e.touches[0]);
      stateRef.current.slashStart = pos;
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      const pos = getPos(e.changedTouches[0]);
      if (s.phase === "menu") {
        handleMenuClick(pos.y);
        s.slashStart = null;
        return;
      }
      if (s.phase === "gameover") {
        startGame(s.difficulty);
        s.slashStart = null;
        return;
      }
      if (!s.slashStart) { s.slashStart = null; return; }
      processSlash(s.slashStart, pos);
      s.slashStart = null;
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [processSlash, startGame, handleMenuClick]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (s.phase === "menu") {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const y = (e.clientY - rect.top) * (H / rect.height);
      handleMenuClick(y);
    } else if (s.phase === "gameover") {
      startGame(s.difficulty);
    }
  }, [startGame, handleMenuClick]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        style={{ maxWidth: "100%", borderRadius: "12px", cursor: "crosshair", touchAction: "none" }}
      />
      <p className="text-xs text-gray-400">Drag to slash • Red = left swipe • Blue = right swipe</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function BeatSaberWebGame() {
  return (
    <CalculatorVerticalLayout
      title="Beat Saber Web - Rhythm Slash Game Online"
      description="Slash incoming blocks to the beat! Red blocks need left swipe, blue need right swipe. Free browser-based rhythm game inspired by Beat Saber."
      canonical="https://www.smartkitnow.com/games/beat-saber-web"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Beat Saber Web</h2>
          <p>Beat Saber Web brings the thrill of rhythm-slashing to your browser. Colored blocks fly toward you — slash them with the correct direction to score points and keep your combo alive!</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse Drag Left:</strong> Slash red blocks (← arrow).</li>
            <li><strong>Mouse Drag Right:</strong> Slash blue blocks (→ arrow).</li>
            <li><strong>Touch Swipe:</strong> Works the same on mobile.</li>
          </ul>
          <h3>Difficulty Levels</h3>
          <ul>
            <li><strong>Easy:</strong> Slower blocks, less frequent spawns.</li>
            <li><strong>Normal:</strong> Standard pace at 128 BPM.</li>
            <li><strong>Hard:</strong> Fast blocks, rapid spawn rate.</li>
          </ul>
          <h3>Scoring</h3>
          <ul>
            <li>Each correct slash earns 100 points × your current combo multiplier.</li>
            <li>Wrong direction or missed blocks break your combo and reduce health.</li>
            <li>Health reaches 0 = game over.</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
