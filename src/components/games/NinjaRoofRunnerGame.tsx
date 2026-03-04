import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 480;
const H = 320;
const GRAVITY = 0.5;
const GROUND_Y = H - 40;
const NINJA_W = 24;
const NINJA_H = 34;
const NINJA_X = 90;
const SCROLL_BASE = 3.5;
const PLATFORM_H = 16;

type ObstacleType = "chimney" | "sign" | "guard";
type ParticleType = "star" | "dust" | "hit";

interface Platform {
  x: number;
  y: number;
  w: number;
  id: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: ObstacleType;
  alive: boolean;
}

interface Star {
  x: number;
  y: number;
  collected: boolean;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  type: ParticleType;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const ninjaRef = useRef({ x: NINJA_X, y: GROUND_Y - NINJA_H, vy: 0, onGround: false, ducking: false, jumpsLeft: 2, invincible: 0, frameTimer: 0, frame: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bgStarsRef = useRef<{ x: number; y: number; r: number; twinkle: number }[]>([]);
  const scrollRef = useRef(SCROLL_BASE);
  const distanceRef = useRef(0);
  const nextPlatformRef = useRef(W);
  const nextObstacleRef = useRef(W + 200);
  const nextStarRef = useRef(W + 100);
  const frameCountRef = useRef(0);
  const platformIdRef = useRef(0);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [stars, setStars] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead" | "over">("idle");
  const livesRef = useRef(3);
  const starsCountRef = useRef(0);
  const gameStateRef = useRef<"idle" | "playing" | "dead" | "over">("idle");

  const initBgStars = useCallback(() => {
    bgStarsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (H * 0.55),
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => { initBgStars(); }, [initBgStars]);

  const spawnParticle = useCallback((x: number, y: number, type: ParticleType) => {
    const count = type === "hit" ? 8 : type === "star" ? 6 : 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const spd = type === "hit" ? 2 + Math.random() * 3 : 1.5 + Math.random() * 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - (type === "star" ? 2 : 1),
        alpha: 1,
        color: type === "hit" ? "#f55" : type === "star" ? "#ffd700" : "#aaf",
        size: type === "hit" ? 4 : 3,
        type,
      });
    }
  }, []);

  const spawnPlatform = useCallback(() => {
    const prevPlatforms = platformsRef.current.filter(p => p.x + p.w > 0);
    const lastPlat = prevPlatforms.sort((a, b) => b.x - a.x)[0];
    const gap = 60 + Math.random() * 80;
    const minY = GROUND_Y - 120;
    const maxY = GROUND_Y - 20;
    const newY = lastPlat ? Math.max(minY, Math.min(maxY, lastPlat.y + (Math.random() - 0.5) * 80)) : GROUND_Y - 20;
    const w = 120 + Math.random() * 100;
    const x = (lastPlat ? lastPlat.x + lastPlat.w + gap : W + 20);
    platformsRef.current.push({ x, y: newY, w, id: platformIdRef.current++ });
    nextPlatformRef.current = x + w;
  }, []);

  const spawnObstacle = useCallback((platX: number, platY: number, platW: number) => {
    if (Math.random() > 0.55) return;
    const types: ObstacleType[] = ["chimney", "sign", "guard"];
    const type = types[Math.floor(Math.random() * types.length)];
    const dims = { chimney: { w: 24, h: 42 }, sign: { w: 38, h: 28 }, guard: { w: 20, h: 36 } };
    const d = dims[type];
    const ox = platX + 30 + Math.random() * (platW - 60 - d.w);
    obstaclesRef.current.push({ x: ox, y: platY - d.h, w: d.w, h: d.h, type, alive: true });
  }, []);

  const spawnStar = useCallback((platX: number, platY: number, platW: number) => {
    if (Math.random() > 0.6) return;
    starsRef.current.push({
      x: platX + 20 + Math.random() * (platW - 40),
      y: platY - 30 - Math.random() * 30,
      collected: false,
      angle: Math.random() * Math.PI * 2,
    });
  }, []);

  const resetGame = useCallback(() => {
    ninjaRef.current = { x: NINJA_X, y: GROUND_Y - NINJA_H, vy: 0, onGround: true, ducking: false, jumpsLeft: 2, invincible: 0, frameTimer: 0, frame: 0 };
    platformsRef.current = [
      { x: 0, y: GROUND_Y, w: W + 100, id: 0 },
      { x: W + 120, y: GROUND_Y - 40, w: 180, id: 1 },
      { x: W + 320, y: GROUND_Y - 70, w: 150, id: 2 },
    ];
    obstaclesRef.current = [];
    starsRef.current = [];
    particlesRef.current = [];
    scrollRef.current = SCROLL_BASE;
    distanceRef.current = 0;
    nextPlatformRef.current = W + 500;
    nextObstacleRef.current = W + 300;
    nextStarRef.current = W + 200;
    frameCountRef.current = 0;
    platformIdRef.current = 3;
    livesRef.current = 3;
    starsCountRef.current = 0;
    setLives(3);
    setStars(0);
    setScore(0);
    setGameState("playing");
    gameStateRef.current = "playing";
  }, []);

  const drawNinja = useCallback((ctx: CanvasRenderingContext2D) => {
    const n = ninjaRef.current;
    const ny = n.ducking ? n.y + NINJA_H * 0.3 : n.y;
    const nh = n.ducking ? NINJA_H * 0.65 : NINJA_H;
    const inv = n.invincible > 0 && Math.floor(frameCountRef.current / 4) % 2 === 0;
    if (inv) return;

    ctx.save();
    ctx.fillStyle = "#111";
    ctx.fillRect(n.x, ny, NINJA_W, nh);

    ctx.fillStyle = "#333";
    ctx.fillRect(n.x + 2, ny + 2, NINJA_W - 4, nh * 0.45);

    ctx.fillStyle = "#444";
    ctx.fillRect(n.x + 6, ny, 12, nh * 0.38);

    ctx.fillStyle = "#c8a882";
    ctx.beginPath();
    ctx.ellipse(n.x + NINJA_W / 2, ny + nh * 0.18, 7, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e00";
    ctx.fillRect(n.x + 2, ny + nh * 0.14, NINJA_W - 4, 5);

    const legPhase = Math.sin(frameCountRef.current * 0.3) * (n.onGround ? 6 : 0);
    ctx.fillStyle = "#222";
    ctx.fillRect(n.x + 2, ny + nh * 0.7, 8, nh * 0.3 + legPhase * 0.5);
    ctx.fillRect(n.x + NINJA_W - 10, ny + nh * 0.7, 8, nh * 0.3 - legPhase * 0.5);

    ctx.fillStyle = "#666";
    const armPhase = Math.sin(frameCountRef.current * 0.3 + 1) * (n.onGround ? 4 : 0);
    ctx.fillRect(n.x - 4, ny + nh * 0.3 + armPhase, 8, 5);
    ctx.fillRect(n.x + NINJA_W - 4, ny + nh * 0.3 - armPhase, 8, 5);

    if (n.onGround && !n.ducking) {
      spawnParticle(n.x + NINJA_W / 2, n.y + NINJA_H, "dust");
    }

    ctx.restore();
  }, [spawnParticle]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, "#050515");
    skyGrad.addColorStop(0.6, "#0a0a2a");
    skyGrad.addColorStop(1, "#1a1030");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    for (const star of bgStarsRef.current) {
      star.twinkle += 0.04;
      const alpha = 0.5 + 0.5 * Math.sin(star.twinkle);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const moonX = W * 0.82;
    const moonY = 45;
    ctx.save();
    ctx.fillStyle = "#fffde0";
    ctx.beginPath();
    ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8e4a0";
    ctx.beginPath();
    ctx.arc(moonX + 8, moonY - 5, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const cityColors = ["#1a1a3a", "#12122a", "#202040"];
    for (let i = 0; i < 12; i++) {
      const bx = (i * 45 + (frameCountRef.current * scrollRef.current * 0.15) % 45 * -1 + 540 * 2) % (W + 50) - 25;
      const bh = 60 + (i * 37 % 80);
      ctx.fillStyle = cityColors[i % 3];
      ctx.fillRect(bx, H - 40 - bh, 40, bh);
      for (let wy = H - 40 - bh + 8; wy < H - 48; wy += 14) {
        for (let wx = bx + 5; wx < bx + 35; wx += 10) {
          ctx.fillStyle = Math.random() > 0.7 ? "#ffd" : "rgba(255,240,100,0.12)";
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
      const neonColors = ["#f0f", "#0ff", "#f80"];
      ctx.fillStyle = neonColors[i % 3];
      ctx.font = "bold 7px sans-serif";
      ctx.fillText("HOTEL", bx + 4, H - 40 - bh + 16);
    }

    for (const p of platformsRef.current) {
      const platGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + PLATFORM_H);
      platGrad.addColorStop(0, "#5a5a7a");
      platGrad.addColorStop(1, "#3a3a5a");
      ctx.fillStyle = platGrad;
      ctx.fillRect(p.x, p.y, p.w, PLATFORM_H);
      ctx.fillStyle = "#6a6a8a";
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = "#2a2a3a";
      ctx.fillRect(p.x, p.y + PLATFORM_H - 2, p.w, 2);
      for (let tx = p.x + 5; tx < p.x + p.w - 5; tx += 20) {
        ctx.fillStyle = "#4a4a6a";
        ctx.fillRect(tx, p.y + 4, 14, 3);
      }
    }

    for (const obs of obstaclesRef.current) {
      if (!obs.alive) continue;
      ctx.save();
      if (obs.type === "chimney") {
        ctx.fillStyle = "#6a4a3a";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = "#8a6a5a";
        ctx.fillRect(obs.x - 2, obs.y, obs.w + 4, 6);
        ctx.fillStyle = "rgba(180,180,180,0.3)";
        for (let si = 0; si < 3; si++) {
          const sy = obs.y - si * 12 - (frameCountRef.current * 0.5 + si * 4) % 15;
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, sy, 4 + si * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (obs.type === "sign") {
        ctx.fillStyle = "#222";
        ctx.fillRect(obs.x + obs.w / 2 - 2, obs.y + obs.h, 4, 8);
        ctx.fillStyle = "#ff4488";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        const neonPulse = 0.7 + 0.3 * Math.sin(frameCountRef.current * 0.15);
        ctx.globalAlpha = neonPulse;
        ctx.fillStyle = "#ff88cc";
        ctx.fillRect(obs.x + 2, obs.y + 2, obs.w - 4, 4);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("NEON", obs.x + obs.w / 2, obs.y + obs.h / 2 + 3);
      } else {
        ctx.fillStyle = "#3a4a8a";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = "#c8a882";
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.w / 2, obs.y + 8, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a3a7a";
        ctx.fillRect(obs.x + 2, obs.y + 16, obs.w - 4, obs.h - 16);
      }
      ctx.restore();
    }

    for (const s of starsRef.current) {
      if (s.collected) continue;
      s.angle += 0.06;
      ctx.save();
      ctx.translate(s.x, s.y + Math.sin(s.angle * 2) * 3);
      ctx.rotate(s.angle);
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const ir = (i % 2 === 0) ? 8 : 4;
        ctx.lineTo(Math.cos(ang) * ir, Math.sin(ang) * ir);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#ffaa00";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawNinja(ctx);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, W, 28);
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`Dist: ${Math.floor(distanceRef.current)}m`, 8, 14);
    ctx.fillStyle = "#ff8";
    ctx.fillText(`Stars: ${starsCountRef.current}`, 140, 14);
    ctx.fillStyle = "#f88";
    ctx.textAlign = "right";
    ctx.fillText(`Lives: ${"♥".repeat(Math.max(0, livesRef.current))}`, W - 8, 14);
    ctx.textAlign = "left";

    if (gameStateRef.current === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(40, H / 2 - 70, W - 80, 145);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("NINJA ROOF RUNNER", W / 2, H / 2 - 48);
      ctx.fillStyle = "#aaf";
      ctx.font = "12px sans-serif";
      ctx.fillText("Space / Up Arrow / Tap: Jump (double jump!)", W / 2, H / 2 - 18);
      ctx.fillText("Down Arrow / Swipe Down: Duck", W / 2, H / 2);
      ctx.fillText("Avoid chimneys, signs & guards!", W / 2, H / 2 + 18);
      ctx.fillText("Collect throwing stars for bonus!", W / 2, H / 2 + 36);
      ctx.fillStyle = "#ffd700";
      ctx.font = "14px sans-serif";
      ctx.fillText("Click or press any key to start!", W / 2, H / 2 + 62);
      ctx.textAlign = "left";
    }

    if (gameStateRef.current === "over") {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(50, H / 2 - 60, W - 100, 128);
      ctx.fillStyle = "#f55";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 30);
      ctx.fillStyle = "#ffd700";
      ctx.font = "16px monospace";
      ctx.fillText(`${Math.floor(distanceRef.current)}m | ${starsCountRef.current} stars`, W / 2, H / 2 + 5);
      ctx.fillStyle = "#aaf";
      ctx.font = "13px sans-serif";
      ctx.fillText("Click or press any key to retry", W / 2, H / 2 + 40);
      ctx.textAlign = "left";
    }
  }, [drawNinja]);

  const updatePhysics = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    frameCountRef.current++;
    const keys = keysRef.current;
    const ninja = ninjaRef.current;

    const jumpPressed = keys.has(" ") || keys.has("ArrowUp") || keys.has("w") || keys.has("W");
    const duckPressed = keys.has("ArrowDown") || keys.has("s") || keys.has("S");

    ninja.ducking = duckPressed && ninja.onGround;
    if (jumpPressed && ninja.jumpsLeft > 0) {
      ninja.vy = -11.5;
      ninja.jumpsLeft--;
      ninja.onGround = false;
      spawnParticle(ninja.x + NINJA_W / 2, ninja.y + NINJA_H, "dust");
      keys.delete(" "); keys.delete("ArrowUp"); keys.delete("w"); keys.delete("W");
    }

    ninja.vy += GRAVITY;
    ninja.y += ninja.vy;

    const ninjaH = ninja.ducking ? NINJA_H * 0.65 : NINJA_H;
    const ninjaBottom = ninja.y + ninjaH;

    ninja.onGround = false;
    for (const p of platformsRef.current) {
      if (ninja.x + NINJA_W > p.x && ninja.x < p.x + p.w) {
        if (ninjaBottom >= p.y && ninjaBottom <= p.y + PLATFORM_H + Math.abs(ninja.vy) + 2 && ninja.vy >= 0) {
          ninja.y = p.y - ninjaH;
          ninja.vy = 0;
          ninja.onGround = true;
          ninja.jumpsLeft = 2;
        }
      }
    }

    if (ninja.invincible > 0) ninja.invincible--;

    if (ninja.invincible === 0) {
      for (const obs of obstaclesRef.current) {
        if (!obs.alive) continue;
        const ninjaY = ninja.y;
        const ninjaRight = ninja.x + NINJA_W - 4;
        const ninjaLeft = ninja.x + 4;
        const colX = ninjaRight > obs.x + 2 && ninjaLeft < obs.x + obs.w - 2;
        const colY = ninjaY + ninjaH > obs.y + 4 && ninjaY < obs.y + obs.h;
        if (colX && colY) {
          if (obs.type === "guard" && ninja.vy > 0 && ninjaY < obs.y) {
            obs.alive = false;
            ninja.vy = -8;
            spawnParticle(obs.x + obs.w / 2, obs.y, "hit");
            starsCountRef.current += 2;
            setStars(starsCountRef.current);
          } else {
            ninja.invincible = 90;
            const newLives = livesRef.current - 1;
            livesRef.current = newLives;
            setLives(newLives);
            ninja.vy = -7;
            spawnParticle(ninja.x + NINJA_W / 2, ninja.y + NINJA_H / 2, "hit");
            if (newLives <= 0) {
              gameStateRef.current = "over";
              setGameState("over");
            }
          }
        }
      }
    }

    for (const s of starsRef.current) {
      if (s.collected) continue;
      if (Math.abs(ninja.x + NINJA_W / 2 - s.x) < 18 && Math.abs(ninja.y + NINJA_H / 2 - s.y) < 18) {
        s.collected = true;
        starsCountRef.current += 1;
        setStars(starsCountRef.current);
        spawnParticle(s.x, s.y, "star");
      }
    }

    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.alpha -= 0.035;
    }
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

    if (ninja.y > H + 60) {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      if (newLives <= 0) {
        gameStateRef.current = "over";
        setGameState("over");
      } else {
        ninja.y = GROUND_Y - NINJA_H - 20;
        ninja.vy = 0;
        ninja.onGround = false;
        ninja.invincible = 90;
      }
    }

    const speed = scrollRef.current;
    for (const p of platformsRef.current) p.x -= speed;
    for (const o of obstaclesRef.current) o.x -= speed;
    for (const s of starsRef.current) s.x -= speed;

    platformsRef.current = platformsRef.current.filter(p => p.x + p.w > -50);
    obstaclesRef.current = obstaclesRef.current.filter(o => o.x + o.w > -50);
    starsRef.current = starsRef.current.filter(s => s.x > -30);

    const farthestPlatX = Math.max(...platformsRef.current.map(p => p.x + p.w));
    while (farthestPlatX < W + 300) {
      spawnPlatform();
      const plats = platformsRef.current;
      const last = plats[plats.length - 1];
      if (last && Math.random() > 0.4) spawnObstacle(last.x, last.y, last.w);
      if (last && Math.random() > 0.4) spawnStar(last.x, last.y, last.w);
    }

    distanceRef.current += speed / 30;
    setScore(Math.floor(distanceRef.current));
    scrollRef.current = SCROLL_BASE + Math.floor(distanceRef.current / 50) * 0.3;
    scrollRef.current = Math.min(scrollRef.current, 8);
  }, [spawnParticle, spawnPlatform, spawnObstacle, spawnStar]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      updatePhysics();
      drawScene();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [updatePhysics, drawScene]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["Space", " ", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      if (gameStateRef.current === "idle" || gameStateRef.current === "over") {
        resetGame();
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [resetGame]);

  const lastTouchYRef = useRef<number | null>(null);

  const handleCanvasClick = () => {
    if (gameStateRef.current === "idle" || gameStateRef.current === "over") { resetGame(); return; }
    keysRef.current.add(" ");
    setTimeout(() => keysRef.current.delete(" "), 80);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    lastTouchYRef.current = e.touches[0].clientY;
    if (gameStateRef.current === "idle" || gameStateRef.current === "over") { resetGame(); return; }
    keysRef.current.add(" ");
    setTimeout(() => keysRef.current.delete(" "), 80);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (lastTouchYRef.current !== null) {
      const dy = e.touches[0].clientY - lastTouchYRef.current;
      if (dy > 30) keysRef.current.add("ArrowDown");
      else keysRef.current.delete("ArrowDown");
    }
  };

  const handleTouchEnd = () => {
    keysRef.current.delete("ArrowDown");
    lastTouchYRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-2 border-gray-700 rounded cursor-pointer touch-none"
        style={{ maxWidth: "100%", aspectRatio: `${W}/${H}` }}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onPointerDown={() => { keysRef.current.add(" "); }}
          onPointerUp={() => { keysRef.current.delete(" "); }}
          onPointerLeave={() => keysRef.current.delete(" ")}
          className="px-5 py-2 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-700 active:bg-blue-900"
        >
          Jump / Double-Jump
        </button>
        <button
          onPointerDown={() => keysRef.current.add("ArrowDown")}
          onPointerUp={() => keysRef.current.delete("ArrowDown")}
          onPointerLeave={() => keysRef.current.delete("ArrowDown")}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 active:bg-gray-900"
        >
          Duck
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Space / Up Arrow to jump (double jump!). Down Arrow to duck. Jump on guards to defeat them!
      </p>
    </div>
  );
}

export default function NinjaRoofRunnerGame() {
  return (
    <CalculatorVerticalLayout
      title="Ninja Roof Runner - City Parkour Game"
      description="Sprint across neon-lit city rooftops as a ninja! Jump over chimneys, duck under signs, stomp guards. Collect throwing stars. How far can you run?"
      canonical="https://www.smartkitnow.com/games/ninja-roof-runner"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Ninja Roof Runner</h2>
          <p>
            Your ninja automatically sprints to the right across city rooftops at night. Jump between
            platforms, avoid obstacles, and collect throwing stars for bonus points. The pace increases
            the farther you run!
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Space / Up Arrow / Tap:</strong> Jump (press again in the air for double-jump!)</li>
            <li><strong>Down Arrow / Swipe Down:</strong> Duck under obstacles</li>
          </ul>
          <h3>Obstacles</h3>
          <ul>
            <li><strong>Chimneys:</strong> Jump over these tall brick structures</li>
            <li><strong>Neon Signs:</strong> Jump over or duck under these glowing signs</li>
            <li><strong>Guards:</strong> Land on their heads to defeat them and earn 2 bonus stars!</li>
          </ul>
          <h3>Collectibles</h3>
          <p>
            Golden throwing stars spin on the rooftops. Run through them to collect — each one adds to
            your star count and earns bonus score. Stars are scattered across platforms with gaps, so use
            your double-jump wisely!
          </p>
          <h3>Difficulty</h3>
          <p>
            The ninja runs faster every 50 meters. At 150+ meters, the gaps between platforms grow wider
            and obstacles appear more frequently. Only the most skilled ninjas survive 300 meters!
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
