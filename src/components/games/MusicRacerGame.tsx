import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 480;
const H = 640;
const LANE_COUNT = 3;
const LANE_WIDTH = 100;
const LANE_START_X = (W - LANE_COUNT * LANE_WIDTH) / 2;
const CAR_W = 44;
const CAR_H = 70;
const NOTE_R = 18;
const BPM = 120;
const BEAT_MS = (60 / BPM) * 1000;
const NOTE_COLORS = ["#e74c3c", "#3498db", "#2ecc71"];

interface Note {
  id: number;
  lane: number;
  y: number;
  color: string;
  hit: boolean;
  miss: boolean;
}

// ─── Web Audio helpers ────────────────────────────────────────────────────────
function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playKick(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playHitSound(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stateRef = useRef({
    playerLane: 1,
    notes: [] as Note[],
    score: 0,
    phase: "menu" as "menu" | "playing" | "gameover",
    noteSpeed: 3,
    noteIdCounter: 0,
    lastBeatTime: 0,
    beatCount: 0,
    nextNoteSchedule: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    frameCount: 0,
    touchStartX: 0,
  });
  const animRef = useRef<number>(0);
  const [uiState, setUiState] = useState({ score: 0, phase: "menu" as string });

  const startGame = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    const s = stateRef.current;
    s.notes = [];
    s.score = 0;
    s.noteSpeed = 3;
    s.phase = "playing";
    s.beatCount = 0;
    s.frameCount = 0;
    s.particles = [];
    s.lastBeatTime = performance.now();
    s.nextNoteSchedule = 0;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.phase === "menu" || s.phase === "gameover") { startGame(); return; }
      if (e.key === "ArrowLeft") s.playerLane = Math.max(0, s.playerLane - 1);
      if (e.key === "ArrowRight") s.playerLane = Math.min(LANE_COUNT - 1, s.playerLane + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      stateRef.current.touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (s.phase !== "playing") { startGame(); return; }
      const dx = e.changedTouches[0].clientX - s.touchStartX;
      if (dx < -30) s.playerLane = Math.max(0, s.playerLane - 1);
      else if (dx > 30) s.playerLane = Math.min(LANE_COUNT - 1, s.playerLane + 1);
    };
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = (timestamp: number) => {
      const s = stateRef.current;

      if (s.phase === "playing") {
        s.frameCount++;
        s.noteSpeed = 3 + s.score * 0.005;

        // Spawn notes on beat
        if (timestamp - s.lastBeatTime >= BEAT_MS / 2) {
          s.lastBeatTime = timestamp;
          s.beatCount++;
          if (audioCtxRef.current) {
            playKick(audioCtxRef.current, audioCtxRef.current.currentTime);
          }
          if (s.beatCount % 1 === 0) {
            const lane = Math.floor(Math.random() * LANE_COUNT);
            s.notes.push({
              id: s.noteIdCounter++,
              lane,
              y: -NOTE_R,
              color: NOTE_COLORS[lane],
              hit: false,
              miss: false,
            });
          }
        }

        // Move notes
        s.notes.forEach((n) => { n.y += s.noteSpeed; });

        // Check hits - player car bottom
        const carY = H - 80;
        const carCenterX = LANE_START_X + s.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
        s.notes.forEach((n) => {
          if (n.hit || n.miss) return;
          const noteCX = LANE_START_X + n.lane * LANE_WIDTH + LANE_WIDTH / 2;
          const dy = Math.abs(n.y - carY);
          const dx = Math.abs(noteCX - carCenterX);
          if (dy < NOTE_R + CAR_H / 2 && dx < LANE_WIDTH / 2) {
            n.hit = true;
            s.score += 10;
            for (let i = 0; i < 8; i++) {
              s.particles.push({
                x: noteCX, y: n.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 1,
                color: n.color,
              });
            }
            if (audioCtxRef.current) playHitSound(audioCtxRef.current);
          }
        });

        // Remove off-screen notes
        s.notes = s.notes.filter((n) => n.y < H + NOTE_R);

        // Update particles
        s.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;
        });
        s.particles = s.particles.filter((p) => p.life > 0);
      }

      // ─── Draw ───────────────────────────────────────────────────────
      // Road background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, W, H);

      // Road
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(LANE_START_X - 10, 0, LANE_COUNT * LANE_WIDTH + 20, H);

      // Lane lines
      for (let i = 0; i <= LANE_COUNT; i++) {
        ctx.strokeStyle = i === 0 || i === LANE_COUNT ? "#e67e22" : "rgba(255,255,255,0.25)";
        ctx.lineWidth = i === 0 || i === LANE_COUNT ? 4 : 2;
        ctx.setLineDash(i === 0 || i === LANE_COUNT ? [] : [30, 20]);
        ctx.beginPath();
        ctx.moveTo(LANE_START_X + i * LANE_WIDTH, 0);
        ctx.lineTo(LANE_START_X + i * LANE_WIDTH, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw notes
      for (const n of s.notes) {
        if (n.hit) continue;
        const cx = LANE_START_X + n.lane * LANE_WIDTH + LANE_WIDTH / 2;
        ctx.beginPath();
        ctx.arc(cx, n.y, NOTE_R, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Music note symbol
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♪", cx, n.y);
      }

      // Draw particles
      for (const p of s.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw player car
      const carX = LANE_START_X + stateRef.current.playerLane * LANE_WIDTH + LANE_WIDTH / 2 - CAR_W / 2;
      const carY = H - 80 - CAR_H / 2;
      ctx.fillStyle = "#3498db";
      ctx.beginPath();
      ctx.roundRect(carX, carY, CAR_W, CAR_H, 8);
      ctx.fill();
      // Windshield
      ctx.fillStyle = "rgba(173,216,230,0.8)";
      ctx.beginPath();
      ctx.roundRect(carX + 5, carY + 8, CAR_W - 10, 20, 4);
      ctx.fill();
      // Wheels
      ctx.fillStyle = "#2c3e50";
      [[0, 10], [CAR_W - 8, 10], [0, CAR_H - 20], [CAR_W - 8, CAR_H - 20]].forEach(([wx, wy]) => {
        ctx.beginPath();
        ctx.roundRect(carX + wx, carY + wy, 8, 14, 3);
        ctx.fill();
      });
      // Headlights
      ctx.fillStyle = "#f1c40f";
      ctx.beginPath();
      ctx.arc(carX + 8, carY + 4, 4, 0, Math.PI * 2);
      ctx.arc(carX + CAR_W - 8, carY + 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, 44);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(`Score: ${stateRef.current.score}`, 12, 30);
      ctx.textAlign = "right";
      ctx.fillText(`Speed: ${stateRef.current.noteSpeed.toFixed(1)}x`, W - 12, 30);

      // Overlays
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f39c12";
        ctx.font = "bold 42px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("MUSIC RACER", W / 2, H / 2 - 60);
        ctx.fillStyle = "#fff";
        ctx.font = "18px sans-serif";
        ctx.fillText("Dodge into music notes!", W / 2, H / 2 - 20);
        ctx.fillText("← → Arrow keys or Swipe", W / 2, H / 2 + 20);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Click / Tap to Start", W / 2, H / 2 + 70);
        ctx.textAlign = "left";
      }

      setUiState({ score: s.score, phase: s.phase });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleCanvasClick = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "menu" || s.phase === "gameover") startGame();
  }, [startGame]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleCanvasClick}
        style={{ maxWidth: "100%", borderRadius: "12px", cursor: "pointer", touchAction: "none" }}
      />
      <div className="flex gap-4 text-sm text-gray-400">
        <span>← → to change lanes</span>
        <span>Hit the music notes!</span>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function MusicRacerGame() {
  return (
    <CalculatorVerticalLayout
      title="Music Racer - Rhythm Road Game Online"
      description="Drive through 3 lanes and collect falling music notes in sync with a 120BPM beat. Free online music racing rhythm game."
      canonical="https://www.smartkitnow.com/games/music-racer"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Music Racer</h2>
          <p>Music Racer combines driving with rhythm gameplay. Your car races down a 3-lane road while colored music notes fall from above. Steer into them to score points!</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Arrow Left / Right:</strong> Switch lanes on desktop.</li>
            <li><strong>Swipe Left / Right:</strong> Switch lanes on mobile.</li>
          </ul>
          <h3>Scoring</h3>
          <ul>
            <li>Each music note you collect is worth 10 points.</li>
            <li>The road speed increases as your score grows.</li>
            <li>Notes fall in sync with a 120 BPM kick drum beat.</li>
          </ul>
          <h3>Tips</h3>
          <ul>
            <li>Listen to the beat — notes appear on rhythm subdivisions.</li>
            <li>Stay in the center lane when unsure; it gives maximum flexibility.</li>
            <li>As speed increases, anticipate notes earlier.</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
