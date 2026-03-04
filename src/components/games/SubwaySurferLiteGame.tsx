import React, { useEffect, useRef, useState, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "READY" | "PLAYING" | "GAME_OVER";
type Lane = 0 | 1 | 2;
type PlayerAction = "IDLE" | "JUMPING" | "ROLLING";
type ObstacleKind = "TRAIN" | "BARRIER" | "LOW_BARRIER";

interface Player {
  lane: Lane;
  targetLane: Lane;
  laneX: number;
  y: number;
  vy: number;
  action: PlayerAction;
  actionTimer: number;
  frame: number;
  frameTimer: number;
}

interface Obstacle {
  id: number;
  lane: Lane;
  z: number;
  kind: ObstacleKind;
}

interface Coin {
  id: number;
  lane: Lane;
  z: number;
  collected: boolean;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const LANE_COUNT = 3;
const GROUND_Y_RATIO = 0.72;
const JUMP_VY = -22;
const GRAVITY = 1.1;
const ROLL_DURATION = 500;
const BASE_SPEED = 7;
const TRACK_COLORS = ["#1a1a2e", "#16213e", "#0f3460"];
const NEON_BLUE = "#00d4ff";
const NEON_YELLOW = "#ffd700";
const NEON_GREEN = "#39ff14";
const NEON_RED = "#ff3131";
const NEON_PURPLE = "#bc13fe";

// ─── Audio ────────────────────────────────────────────────────────────────────

function makeAudio(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function beep(ctx: AudioContext | null, freq: number, dur: number, type: OscillatorType = "sine", vol = 0.07) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch { /* silent */ }
}

// ─── Game Board ───────────────────────────────────────────────────────────────

function SubwaySurferBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState>("READY");
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const hiRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const idCounterRef = useRef(0);
  const bgOffsetRef = useRef(0);
  const distRef = useRef(0);

  const playerRef = useRef<Player>({
    lane: 1, targetLane: 1, laneX: 0,
    y: 0, vy: 0, action: "IDLE", actionTimer: 0,
    frame: 0, frameTimer: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsArrRef = useRef<Coin[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const spawnTimerRef = useRef(0);
  const coinTimerRef = useRef(0);
  const scaleRef = useRef(1);

  const [uiState, setUiState] = useState<GameState>("READY");
  const [uiScore, setUiScore] = useState(0);
  const [uiCoins, setUiCoins] = useState(0);
  const [uiHi, setUiHi] = useState(0);

  const getLaneXs = useCallback((W: number) => {
    const sc = scaleRef.current;
    const center = W / 2;
    const spacing = 80 * sc;
    return [center - spacing, center, center + spacing];
  }, []);

  const initGame = useCallback((W: number, H: number) => {
    const sc = scaleRef.current;
    const groundY = H * GROUND_Y_RATIO;
    const laneXs = getLaneXs(W);
    playerRef.current = {
      lane: 1, targetLane: 1,
      laneX: laneXs[1],
      y: groundY,
      vy: 0, action: "IDLE", actionTimer: 0,
      frame: 0, frameTimer: 0,
    };
    obstaclesRef.current = [];
    coinsArrRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    coinsRef.current = 0;
    speedRef.current = BASE_SPEED * sc;
    distRef.current = 0;
    spawnTimerRef.current = 0;
    coinTimerRef.current = 0;
    bgOffsetRef.current = 0;
  }, [getLaneXs]);

  const spawnParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    const sc = scaleRef.current;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = (2 + Math.random() * 4) * sc;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2 * sc,
        life: 1, maxLife: 1,
        color,
        r: (3 + Math.random() * 3) * sc,
      });
    }
  }, []);

  const endGame = useCallback(() => {
    stateRef.current = "GAME_OVER";
    setUiState("GAME_OVER");
    const s = scoreRef.current;
    if (s > hiRef.current) {
      hiRef.current = s;
      setUiHi(s);
      try { localStorage.setItem("hs_subway-surfer-lite", String(s)); } catch { /* ignore */ }
    }
    beep(audioRef.current, 150, 0.5, "sawtooth", 0.12);
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!audioRef.current) audioRef.current = makeAudio();
    if (audioRef.current?.state === "suspended") audioRef.current.resume();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    initGame(W, H);
    stateRef.current = "PLAYING";
    setUiState("PLAYING");
    setUiScore(0);
    setUiCoins(0);
    lastTimeRef.current = performance.now();
  }, [initGame]);

  const changeLane = useCallback((dir: -1 | 1) => {
    const p = playerRef.current;
    const next = Math.max(0, Math.min(2, p.targetLane + dir)) as Lane;
    if (next !== p.targetLane) {
      p.targetLane = next;
      beep(audioRef.current, 440, 0.05);
    }
  }, []);

  const jump = useCallback(() => {
    const p = playerRef.current;
    if (p.action === "IDLE") {
      const sc = scaleRef.current;
      p.action = "JUMPING";
      p.vy = JUMP_VY * sc;
      beep(audioRef.current, 600, 0.1);
    }
  }, []);

  const roll = useCallback(() => {
    const p = playerRef.current;
    if (p.action === "IDLE") {
      p.action = "ROLLING";
      p.actionTimer = ROLL_DURATION;
      beep(audioRef.current, 220, 0.15);
    }
  }, []);

  // ─── Draw helpers ─────────────────────────────────────────────────────────

  function drawTrack(ctx: CanvasRenderingContext2D, W: number, H: number, sc: number, offset: number) {
    const groundY = H * GROUND_Y_RATIO;
    const vanishY = H * 0.3;
    const vanishX = W / 2;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, vanishY + 20);
    sky.addColorStop(0, "#000814");
    sky.addColorStop(1, "#001d3d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, vanishY + 20);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137 + offset * 0.1) % W + W) % W;
      const sy = ((i * 73 + 10) % (vanishY - 20)) + 10;
      const sr = (i % 3 === 0) ? 1.5 * sc : 0.8 * sc;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    const ground = ctx.createLinearGradient(0, vanishY, 0, H);
    ground.addColorStop(0, "#1a1a2e");
    ground.addColorStop(0.5, "#16213e");
    ground.addColorStop(1, "#0a0a1a");
    ctx.fillStyle = ground;
    ctx.fillRect(0, vanishY, W, H - vanishY);

    // Track lanes perspective lines
    const laneEdges = [
      vanishX - 180 * sc, vanishX - 60 * sc, vanishX + 60 * sc, vanishX + 180 * sc
    ];
    const groundEdges = [0, W / 2 - 120 * sc, W / 2 + 120 * sc, W];

    // Fill each lane segment with alternating dark tiles
    for (let lane = 0; lane < 3; lane++) {
      const tileCount = 10;
      for (let t = 0; t < tileCount; t++) {
        const t0 = (t / tileCount);
        const t1 = ((t + 1) / tileCount);
        const tileOffset = ((offset * 0.03) % (1 / tileCount));
        const tt0 = (t0 + tileOffset) % 1;
        const tt1 = (t1 + tileOffset) % 1;

        const interp = (arr: number[], frac: number) => arr[lane] + (arr[lane + 1] - arr[lane]) * frac;
        const lx0 = interp(laneEdges, 0);
        const lx1 = interp(laneEdges, 1);
        const gx0 = interp(groundEdges, 0);
        const gx1 = interp(groundEdges, 1);

        const y0 = vanishY + (groundY - vanishY) * tt0;
        const y1 = vanishY + (groundY - vanishY) * tt1;
        const yfrac0 = tt0;
        const yfrac1 = tt1;
        const lLeft0 = lx0 + (gx0 - lx0) * yfrac0;
        const lRight0 = lx1 + (gx1 - lx1) * yfrac0;
        const lLeft1 = lx0 + (gx0 - lx0) * yfrac1;
        const lRight1 = lx1 + (gx1 - lx1) * yfrac1;

        const col = (t + lane) % 2 === 0 ? "rgba(0,212,255,0.04)" : "rgba(0,0,0,0.0)";
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(lLeft0, y0);
        ctx.lineTo(lRight0, y0);
        ctx.lineTo(lRight1, y1);
        ctx.lineTo(lLeft1, y1);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Lane dividers (neon lines)
    ctx.strokeStyle = NEON_BLUE;
    ctx.shadowColor = NEON_BLUE;
    ctx.shadowBlur = 8 * sc;
    ctx.lineWidth = 1.5 * sc;
    for (let e = 0; e < laneEdges.length; e++) {
      ctx.beginPath();
      ctx.moveTo(laneEdges[e], vanishY);
      ctx.lineTo(groundEdges[e], groundY + 20 * sc);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Ground line
    ctx.strokeStyle = NEON_BLUE;
    ctx.shadowColor = NEON_BLUE;
    ctx.shadowBlur = 12 * sc;
    ctx.lineWidth = 2 * sc;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 1 * sc);
    ctx.lineTo(W, groundY + 1 * sc);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Buildings silhouette
    ctx.fillStyle = "#0d0d1a";
    const buildingData = [
      { x: 0.02, w: 0.06, h: 0.18 }, { x: 0.09, w: 0.04, h: 0.22 },
      { x: 0.14, w: 0.07, h: 0.15 }, { x: 0.82, w: 0.05, h: 0.2 },
      { x: 0.88, w: 0.06, h: 0.17 }, { x: 0.95, w: 0.04, h: 0.25 },
    ];
    for (const b of buildingData) {
      ctx.fillRect(b.x * W, vanishY - b.h * H, b.w * W, b.h * H);
    }
    // Neon window dots on buildings
    ctx.fillStyle = NEON_YELLOW;
    for (const b of buildingData) {
      for (let row = 0; row < 4; row++) {
        for (let col2 = 0; col2 < 3; col2++) {
          if (Math.sin(b.x * 100 + row * 7 + col2 * 13) > 0.2) {
            ctx.fillRect(
              (b.x + (col2 + 0.5) * b.w / 3.5) * W,
              vanishY - (b.h * H - (row + 1) * 12 * sc),
              2 * sc, 3 * sc
            );
          }
        }
      }
    }
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, sc: number, groundY: number) {
    const x = p.laneX;
    const isRolling = p.action === "ROLLING";
    const bodyH = isRolling ? 28 * sc : 48 * sc;
    const bodyW = 26 * sc;
    const y = isRolling ? groundY - bodyH + 4 * sc : p.y - bodyH;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(x, groundY + 2 * sc, bodyW * 0.7, 6 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    ctx.shadowColor = NEON_BLUE;
    ctx.shadowBlur = 16 * sc;

    // Body
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(x - bodyW / 2, y, bodyW, bodyH);

    // Jacket stripe
    ctx.fillStyle = NEON_BLUE;
    ctx.fillRect(x - bodyW / 2, y + bodyH * 0.1, bodyW, bodyH * 0.05);
    ctx.fillRect(x - bodyW / 2, y + bodyH * 0.7, bodyW, bodyH * 0.05);

    if (!isRolling) {
      // Head
      ctx.fillStyle = "#f5c5a3";
      ctx.fillRect(x - 11 * sc, y - 20 * sc, 22 * sc, 20 * sc);
      // Hair
      ctx.fillStyle = "#3a2010";
      ctx.fillRect(x - 11 * sc, y - 20 * sc, 22 * sc, 7 * sc);
      // Eyes
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - 7 * sc, y - 13 * sc, 5 * sc, 5 * sc);
      ctx.fillRect(x + 2 * sc, y - 13 * sc, 5 * sc, 5 * sc);
      ctx.fillStyle = "#222";
      ctx.fillRect(x - 6 * sc, y - 12 * sc, 3 * sc, 3 * sc);
      ctx.fillRect(x + 3 * sc, y - 12 * sc, 3 * sc, 3 * sc);

      // Legs
      const legSwing = Math.sin(p.frame * Math.PI) * 6 * sc;
      ctx.fillStyle = "#1a2540";
      ctx.fillRect(x - bodyW / 2, y + bodyH - 2 * sc, bodyW * 0.42, 14 * sc + legSwing);
      ctx.fillRect(x + bodyW * 0.08, y + bodyH - 2 * sc, bodyW * 0.42, 14 * sc - legSwing);
      // Shoes
      ctx.fillStyle = "#ff6b35";
      ctx.fillRect(x - bodyW / 2 - 3 * sc, y + bodyH + 12 * sc + legSwing - 5 * sc, bodyW * 0.5, 7 * sc);
      ctx.fillRect(x + bodyW * 0.04, y + bodyH + 12 * sc - legSwing - 5 * sc, bodyW * 0.5, 7 * sc);
    } else {
      // Rolling: curled body
      ctx.fillStyle = "#f5c5a3";
      ctx.beginPath();
      ctx.arc(x, y + bodyH / 2, bodyH / 2 + 2 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e3a5f";
      ctx.beginPath();
      ctx.arc(x, y + bodyH / 2, bodyH / 2 - 4 * sc, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, laneXs: number[], sc: number, groundY: number) {
    const x = laneXs[obs.lane];
    ctx.shadowBlur = 14 * sc;

    if (obs.kind === "TRAIN") {
      // Neon train
      const w = 60 * sc, h = 70 * sc;
      ctx.shadowColor = NEON_RED;
      ctx.fillStyle = "#1a0000";
      ctx.fillRect(x - w / 2, groundY - h, w, h);
      ctx.fillStyle = NEON_RED;
      ctx.fillRect(x - w / 2, groundY - h, w, 6 * sc);
      ctx.fillRect(x - w / 2, groundY - h, 4 * sc, h);
      ctx.fillRect(x + w / 2 - 4 * sc, groundY - h, 4 * sc, h);
      ctx.fillRect(x - w / 2, groundY - 6 * sc, w, 6 * sc);
      // Windows
      ctx.fillStyle = NEON_YELLOW;
      ctx.fillRect(x - w / 2 + 8 * sc, groundY - h + 12 * sc, 18 * sc, 12 * sc);
      ctx.fillRect(x + w / 2 - 26 * sc, groundY - h + 12 * sc, 18 * sc, 12 * sc);
      ctx.fillRect(x - w / 2 + 8 * sc, groundY - h + 32 * sc, 18 * sc, 12 * sc);
      ctx.fillRect(x + w / 2 - 26 * sc, groundY - h + 32 * sc, 18 * sc, 12 * sc);
      // Wheels
      ctx.fillStyle = "#333";
      ctx.beginPath(); ctx.arc(x - w / 2 + 12 * sc, groundY, 8 * sc, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + w / 2 - 12 * sc, groundY, 8 * sc, 0, Math.PI * 2); ctx.fill();
    } else if (obs.kind === "BARRIER") {
      // Standing barrier
      const w = 48 * sc, h = 40 * sc;
      ctx.shadowColor = NEON_YELLOW;
      ctx.fillStyle = "#1a1400";
      ctx.fillRect(x - w / 2, groundY - h, w, h);
      ctx.strokeStyle = NEON_YELLOW;
      ctx.lineWidth = 3 * sc;
      ctx.strokeRect(x - w / 2, groundY - h, w, h);
      // Warning stripes
      ctx.fillStyle = NEON_YELLOW;
      ctx.fillRect(x - w / 2, groundY - h, w, 5 * sc);
      ctx.fillRect(x - w / 2, groundY - 5 * sc, w, 5 * sc);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - w / 2, groundY - h, w, h);
      ctx.clip();
      ctx.strokeStyle = "rgba(255,215,0,0.3)";
      ctx.lineWidth = 8 * sc;
      for (let i = -3; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(x - w / 2 + i * 16 * sc, groundY - h);
        ctx.lineTo(x - w / 2 + i * 16 * sc + 20 * sc, groundY);
        ctx.stroke();
      }
      ctx.restore();
    } else {
      // Low barrier (duck under)
      const w = 56 * sc, h = 22 * sc;
      const barY = groundY - h - 16 * sc;
      ctx.shadowColor = NEON_PURPLE;
      ctx.fillStyle = NEON_PURPLE;
      ctx.fillRect(x - w / 2, barY, w, h);
      // Side poles
      ctx.fillRect(x - w / 2 - 4 * sc, groundY - 50 * sc, 8 * sc, 50 * sc);
      ctx.fillRect(x + w / 2 - 4 * sc, groundY - 50 * sc, 8 * sc, 50 * sc);
      // Arrow indicators
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${12 * sc}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("↓ ROLL ↓", x, barY + h / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }

    ctx.shadowBlur = 0;
  }

  function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin, laneXs: number[], sc: number, groundY: number, t: number) {
    if (coin.collected) return;
    const x = laneXs[coin.lane];
    const bobY = groundY - 55 * sc + Math.sin(t / 400 + coin.id) * 5 * sc;
    const r = 10 * sc;
    ctx.shadowColor = NEON_YELLOW;
    ctx.shadowBlur = 12 * sc;
    ctx.fillStyle = NEON_YELLOW;
    ctx.beginPath();
    ctx.arc(x, bobY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8B6914";
    ctx.beginPath();
    ctx.arc(x, bobY, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = NEON_YELLOW;
    ctx.font = `bold ${9 * sc}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", x, bobY);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowBlur = 0;
  }

  // ─── Game Loop ────────────────────────────────────────────────────────────

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const sc = scaleRef.current;
    const groundY = H * GROUND_Y_RATIO;
    const laneXs = getLaneXs(W);

    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;
    const dtF = dt / 16.67;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Draw background
    bgOffsetRef.current += speedRef.current * dtF;
    drawTrack(ctx, W, H, sc, bgOffsetRef.current);

    if (stateRef.current === "PLAYING") {
      const p = playerRef.current;
      const spd = speedRef.current;

      // Move player toward target lane
      const targetX = laneXs[p.targetLane];
      const laneSpeed = 12 * sc * dtF;
      if (Math.abs(p.laneX - targetX) < laneSpeed) {
        p.laneX = targetX;
        p.lane = p.targetLane;
      } else {
        p.laneX += (targetX - p.laneX > 0 ? 1 : -1) * laneSpeed;
      }

      // Physics
      if (p.action === "JUMPING") {
        p.vy += GRAVITY * sc * dtF;
        p.y += p.vy * dtF;
        if (p.y >= groundY) {
          p.y = groundY;
          p.vy = 0;
          p.action = "IDLE";
          beep(audioRef.current, 300, 0.05);
        }
      } else if (p.action === "ROLLING") {
        p.actionTimer -= dt;
        if (p.actionTimer <= 0) {
          p.action = "IDLE";
          p.actionTimer = 0;
        }
      } else {
        p.y = groundY;
      }

      // Leg animation
      p.frameTimer += dt;
      if (p.frameTimer > 120) {
        p.frame = (p.frame + 1) % 2;
        p.frameTimer = 0;
      }

      // Spawn obstacles
      spawnTimerRef.current += spd * dtF;
      const spawnInterval = Math.max(220 * sc, 380 * sc - distRef.current * 0.01 * sc);
      if (spawnTimerRef.current >= spawnInterval) {
        spawnTimerRef.current = 0;
        const lane = Math.floor(Math.random() * 3) as Lane;
        const kinds: ObstacleKind[] = ["TRAIN", "BARRIER", "LOW_BARRIER"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        obstaclesRef.current.push({ id: idCounterRef.current++, lane, z: W + 60, kind });
      }

      // Spawn coins
      coinTimerRef.current += spd * dtF;
      if (coinTimerRef.current >= 160 * sc) {
        coinTimerRef.current = 0;
        const lane = Math.floor(Math.random() * 3) as Lane;
        coinsArrRef.current.push({ id: idCounterRef.current++, lane, z: W + 40, collected: false });
      }

      // Update + draw coins
      coinsArrRef.current = coinsArrRef.current.filter(coin => {
        coin.z -= spd * dtF;
        if (coin.z < -30) return false;

        // Collision with player
        if (!coin.collected && Math.abs(coin.z - p.laneX) < 40 * sc &&
          Math.abs(laneXs[coin.lane] - p.laneX) < 28 * sc) {
          coin.collected = true;
          coinsRef.current++;
          setUiCoins(coinsRef.current);
          spawnParticles(laneXs[coin.lane], groundY - 55 * sc, NEON_YELLOW, 6);
          beep(audioRef.current, 880, 0.08, "sine", 0.06);
        }

        // Draw
        const drawCoinLaneXs = [coin.z, coin.z, coin.z];
        drawCoin(ctx, coin, [laneXs[0], laneXs[1], laneXs[2]], sc, groundY, timestamp);
        void drawCoinLaneXs;
        return true;
      });

      // Draw coins properly based on z position
      // (redraw correctly with proper perspective)
      // Reset and redraw with actual x positions
      for (const coin of coinsArrRef.current) {
        if (coin.collected) continue;
        // Already drawn above, skip (this is just the placeholder)
      }

      // Update + draw obstacles
      const playerBodyTop = p.action === "ROLLING" ? groundY - 28 * sc + 4 * sc : p.y - 48 * sc;
      const playerBodyBot = groundY + 2 * sc;
      const playerLeft = p.laneX - 13 * sc;
      const playerRight = p.laneX + 13 * sc;

      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.z -= spd * dtF;
        if (obs.z < -80) return false;
        drawObstacle(ctx, obs, laneXs, sc, groundY);

        // Collision detection
        const obsX = laneXs[obs.lane];
        let obsLeft: number, obsRight: number, obsTop: number;
        if (obs.kind === "TRAIN") {
          obsLeft = obsX - 30 * sc; obsRight = obsX + 30 * sc; obsTop = groundY - 70 * sc;
        } else if (obs.kind === "BARRIER") {
          obsLeft = obsX - 24 * sc; obsRight = obsX + 24 * sc; obsTop = groundY - 40 * sc;
        } else {
          obsLeft = obsX - 28 * sc; obsRight = obsX + 28 * sc; obsTop = groundY - 38 * sc;
        }
        const obsBot = groundY + 2 * sc;

        const horizOverlap = Math.abs(obs.z - p.laneX) < 36 * sc &&
          playerRight > obsLeft && playerLeft < obsRight;

        if (horizOverlap) {
          if (obs.kind === "LOW_BARRIER") {
            // Only dangerous if NOT rolling
            if (p.action !== "ROLLING") {
              const headY = p.action === "JUMPING" ? p.y - 48 * sc : p.y - 48 * sc;
              if (headY < obsTop + 22 * sc && playerBodyBot > obsTop) {
                endGame();
                spawnParticles(p.laneX, p.y, NEON_RED, 15);
                return false;
              }
            }
          } else {
            // Train / Barrier: dangerous if not jumping over
            if (playerBodyTop < obsBot && playerBodyBot > obsTop) {
              endGame();
              spawnParticles(p.laneX, p.y, NEON_RED, 15);
              return false;
            }
          }
        }

        return obs.z > -80;
      });

      // Draw player
      drawPlayer(ctx, p, sc, groundY);

      // Particles
      particlesRef.current = particlesRef.current.filter(pt => {
        pt.x += pt.vx * dtF;
        pt.y += pt.vy * dtF;
        pt.vy += 0.3 * sc * dtF;
        pt.life -= dt / 600;
        if (pt.life <= 0) return false;
        ctx.globalAlpha = pt.life;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        return true;
      });

      // Score
      distRef.current += spd * dtF;
      scoreRef.current = Math.floor(distRef.current / (5 * sc));
      setUiScore(scoreRef.current);

      // Speed ramp
      speedRef.current = (BASE_SPEED + scoreRef.current / 120) * sc;

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, 36 * sc);
      ctx.fillStyle = NEON_BLUE;
      ctx.shadowColor = NEON_BLUE;
      ctx.shadowBlur = 8;
      ctx.font = `bold ${13 * sc}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${scoreRef.current}`, 10 * sc, 24 * sc);
      ctx.fillStyle = NEON_YELLOW;
      ctx.shadowColor = NEON_YELLOW;
      ctx.textAlign = "center";
      ctx.fillText(`COINS: ${coinsRef.current}`, W / 2, 24 * sc);
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 0;
      ctx.textAlign = "right";
      ctx.fillText(`BEST: ${hiRef.current}`, W - 10 * sc, 24 * sc);
      ctx.textAlign = "left";

    } else {
      // READY / GAME_OVER overlay
      ctx.fillStyle = "rgba(0,0,20,0.72)";
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";
      if (stateRef.current === "READY") {
        ctx.shadowColor = NEON_BLUE;
        ctx.shadowBlur = 24;
        ctx.fillStyle = NEON_BLUE;
        ctx.font = `bold ${22 * sc}px monospace`;
        ctx.fillText("SUBWAY SURFER LITE", W / 2, H / 2 - 40 * sc);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ccc";
        ctx.font = `${13 * sc}px monospace`;
        ctx.fillText("← → Arrow Keys / Swipe to change lane", W / 2, H / 2);
        ctx.fillText("↑ / Swipe Up: JUMP   ↓ / Swipe Down: ROLL", W / 2, H / 2 + 20 * sc);
        ctx.fillStyle = NEON_YELLOW;
        ctx.shadowColor = NEON_YELLOW;
        ctx.shadowBlur = 12;
        ctx.font = `bold ${15 * sc}px monospace`;
        ctx.fillText("TAP or SPACE to Start!", W / 2, H / 2 + 50 * sc);
        ctx.shadowBlur = 0;
      } else {
        ctx.shadowColor = NEON_RED;
        ctx.shadowBlur = 24;
        ctx.fillStyle = NEON_RED;
        ctx.font = `bold ${26 * sc}px monospace`;
        ctx.fillText("WIPEOUT!", W / 2, H / 2 - 50 * sc);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = `${14 * sc}px monospace`;
        ctx.fillText(`Score: ${scoreRef.current}   Coins: ${coinsRef.current}`, W / 2, H / 2 - 18 * sc);
        ctx.fillStyle = NEON_GREEN;
        ctx.font = `${13 * sc}px monospace`;
        ctx.fillText(`Best: ${hiRef.current}`, W / 2, H / 2 + 8 * sc);
        ctx.fillStyle = NEON_YELLOW;
        ctx.shadowColor = NEON_YELLOW;
        ctx.shadowBlur = 10;
        ctx.font = `bold ${15 * sc}px monospace`;
        ctx.fillText("TAP or SPACE to Restart", W / 2, H / 2 + 40 * sc);
        ctx.shadowBlur = 0;
      }
      ctx.textAlign = "left";
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [endGame, getLaneXs, spawnParticles]);

  // ─── Setup ────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hs_subway-surfer-lite");
      if (saved) { hiRef.current = parseInt(saved, 10); setUiHi(hiRef.current); }
    } catch { /* ignore */ }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function resize() {
      const cont = containerRef.current;
      const c = canvasRef.current;
      if (!cont || !c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cW = cont.clientWidth;
      const cH = Math.max(240, Math.min(400, cW * 0.55));
      scaleRef.current = cW / 480;
      c.width = cW * dpr;
      c.height = cH * dpr;
      c.style.width = `${cW}px`;
      c.style.height = `${cH}px`;
      if (stateRef.current !== "PLAYING") {
        initGame(cW, cH);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [gameLoop, initGame]);

  // ─── Keyboard ────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (stateRef.current !== "PLAYING") startGame();
        else jump();
      }
      if (e.code === "ArrowDown") { e.preventDefault(); if (stateRef.current === "PLAYING") roll(); }
      if (e.code === "ArrowLeft") { e.preventDefault(); if (stateRef.current === "PLAYING") changeLane(-1); }
      if (e.code === "ArrowRight") { e.preventDefault(); if (stateRef.current === "PLAYING") changeLane(1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startGame, jump, roll, changeLane]);

  // ─── Touch ────────────────────────────────────────────────────────────────

  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const dt2 = Date.now() - touchRef.current.t;
    touchRef.current = null;

    if (stateRef.current !== "PLAYING") { startGame(); return; }

    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (absDx > absDy && absDx > 25) {
      changeLane(dx > 0 ? 1 : -1);
    } else if (dy < -25 && dt2 < 400) {
      jump();
    } else if (dy > 25 && dt2 < 400) {
      roll();
    } else {
      jump();
    }
  }, [startGame, jump, roll, changeLane]);

  return (
    <div className="flex flex-col gap-3 select-none" style={{ background: "#000814", borderRadius: 16, padding: 12 }}>
      {/* HUD */}
      <div className="flex justify-between px-2">
        <span style={{ fontFamily: "monospace", color: NEON_BLUE, fontWeight: "bold", fontSize: 13 }}>
          SCORE: {uiScore}
        </span>
        <span style={{ fontFamily: "monospace", color: NEON_YELLOW, fontWeight: "bold", fontSize: 13 }}>
          COINS: {uiCoins}
        </span>
        <span style={{ fontFamily: "monospace", color: "#aaa", fontWeight: "bold", fontSize: 13 }}>
          BEST: {uiHi}
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full relative rounded-xl overflow-hidden"
        style={{ cursor: "pointer", border: `2px solid ${NEON_BLUE}`, boxShadow: `0 0 20px ${NEON_BLUE}40` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (stateRef.current !== "PLAYING") startGame(); }}
      >
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <button
          style={{ background: "#0a0a2a", border: `1px solid ${NEON_BLUE}`, color: NEON_BLUE, borderRadius: 10, padding: "10px 0", fontWeight: "bold", fontSize: 18 }}
          onTouchStart={(e) => { e.preventDefault(); if (stateRef.current === "PLAYING") changeLane(-1); }}
        >←</button>
        <div className="grid grid-rows-2 gap-2">
          <button
            style={{ background: "#0a0a2a", border: `1px solid ${NEON_GREEN}`, color: NEON_GREEN, borderRadius: 10, padding: "6px 0", fontWeight: "bold", fontSize: 13 }}
            onTouchStart={(e) => { e.preventDefault(); if (stateRef.current !== "PLAYING") startGame(); else jump(); }}
          >JUMP</button>
          <button
            style={{ background: "#0a0a2a", border: `1px solid ${NEON_PURPLE}`, color: NEON_PURPLE, borderRadius: 10, padding: "6px 0", fontWeight: "bold", fontSize: 13 }}
            onTouchStart={(e) => { e.preventDefault(); if (stateRef.current === "PLAYING") roll(); }}
          >ROLL</button>
        </div>
        <button
          style={{ background: "#0a0a2a", border: `1px solid ${NEON_BLUE}`, color: NEON_BLUE, borderRadius: 10, padding: "10px 0", fontWeight: "bold", fontSize: 18 }}
          onTouchStart={(e) => { e.preventDefault(); if (stateRef.current === "PLAYING") changeLane(1); }}
        >→</button>
      </div>

      <p style={{ textAlign: "center", color: "#666", fontSize: 11, fontFamily: "monospace" }}>
        {uiState === "PLAYING"
          ? "← → Change lane · ↑ Jump · ↓ Roll · Collect coins!"
          : uiState === "GAME_OVER"
          ? `Wipeout! Score: ${uiScore} — Press SPACE or tap to run again`
          : "Press SPACE or tap to start surfing!"}
      </p>
    </div>
  );
}

// ─── Editorial ────────────────────────────────────────────────────────────────

function HowToPlaySubway() {
  return (
    <div className="space-y-10">
      <section id="guide">
        <h2 className="text-2xl font-extrabold mb-4">How to Play Subway Surfer Lite</h2>
        <p className="mb-4">
          You are a runner dashing through a neon subway at high speed. Trains, barriers and electrified pipes block your path.
          Switch lanes, jump, and roll to stay alive and collect coins.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Change lane:</strong> Left/Right arrow keys, or swipe left/right on mobile.</li>
          <li><strong>Jump:</strong> Up arrow or Space — clears trains and standing barriers.</li>
          <li><strong>Roll:</strong> Down arrow or swipe down — ducks under low electrified beams.</li>
          <li><strong>Coins:</strong> Gold coins give you bonus score and glow effects.</li>
          <li><strong>Speed:</strong> The subway gets faster the further you run.</li>
        </ul>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-extrabold mb-4">Tips for a High Score</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Scan ahead — obstacles appear with enough time to react if you stay focused.</li>
          <li>Purple beams require rolling, not jumping. Jumping will not save you.</li>
          <li>Coins appear in lanes — a quick lane swap can score without extra risk.</li>
          <li>As speed increases, try to stay in the center lane for maximum reaction time.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-extrabold mb-4">FAQ</h2>
        <div className="space-y-4">
          <div>
            <p className="font-bold">Is my high score saved?</p>
            <p>Yes — stored locally under the key <code>hs_subway-surfer-lite</code>.</p>
          </div>
          <div>
            <p className="font-bold">Does the speed increase?</p>
            <p>Yes. Every 120 points of score adds another speed increment.</p>
          </div>
          <div>
            <p className="font-bold">Can I play on mobile?</p>
            <p>Yes — swipe left/right to change lane, up to jump, down to roll. On-screen buttons are also available.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SubwaySurferLiteGame() {
  return (
    <CalculatorVerticalLayout
      title="Subway Surfer Lite"
      description="A free browser endless runner game inspired by Subway Surfers. Dodge trains, roll under beams, collect coins, and beat your high score!"
      canonical="https://www.smartkitnow.com/games/subway-surfer-lite"
      widget={<SubwaySurferBoard />}
      editorial={<HowToPlaySubway />}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips for High Score" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-3xl"
    />
  );
}
