import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 480;
const H = 400;
const PADDLE_H = 12;
const BALL_R = 7;
const BRICK_ROWS = 8;
const BRICK_COLS = 10;
const BRICK_W = Math.floor(W / BRICK_COLS) - 2;
const BRICK_H = 18;
const BRICK_PADDING = 2;
const BRICK_TOP = 40;

const ROW_COLORS = [
  "#ff3333", "#ff6633", "#ffaa00", "#ffdd00",
  "#aaff00", "#00dd66", "#00aaff", "#aa66ff",
];

type PowerUpType = "wide" | "multi" | "slow" | "laser";

interface Brick {
  x: number;
  y: number;
  alive: boolean;
  color: string;
  hp: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  type: PowerUpType;
  active: boolean;
}

interface LaserShot {
  x: number;
  y: number;
  active: boolean;
}

function buildBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: c * (BRICK_W + BRICK_PADDING) + BRICK_PADDING,
        y: BRICK_TOP + r * (BRICK_H + BRICK_PADDING),
        alive: true,
        color: ROW_COLORS[r % ROW_COLORS.length],
        hp: r < 2 ? 2 : 1,
      });
    }
  }
  return bricks;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const paddleXRef = useRef(W / 2 - 40);
  const paddleWRef = useRef(80);
  const bricksRef = useRef<Brick[]>(buildBricks());
  const ballsRef = useRef<Ball[]>([{ x: W / 2, y: H - 60, vx: 3, vy: -4 }]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const laserShotsRef = useRef<LaserShot[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [activeEffects, setActiveEffects] = useState<Set<PowerUpType>>(new Set());

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameStateRef = useRef<"idle" | "playing" | "won" | "lost">("idle");
  const effectTimersRef = useRef<Partial<Record<PowerUpType, ReturnType<typeof setTimeout>>>>({});
  const laserCooldownRef = useRef(0);
  const touchXRef = useRef<number | null>(null);
  const mouseXRef = useRef<number>(W / 2);

  const applyEffect = useCallback((type: PowerUpType) => {
    if (effectTimersRef.current[type]) clearTimeout(effectTimersRef.current[type]);
    setActiveEffects(prev => new Set([...prev, type]));

    if (type === "wide") {
      paddleWRef.current = Math.min(paddleWRef.current + 30, 140);
    } else if (type === "slow") {
      ballsRef.current = ballsRef.current.map(b => {
        const spd = Math.hypot(b.vx, b.vy);
        const factor = 0.6;
        return { ...b, vx: b.vx * factor, vy: b.vy * factor };
      });
    } else if (type === "multi") {
      const existing = [...ballsRef.current];
      const newBalls: Ball[] = [];
      for (const b of existing) {
        newBalls.push({ x: b.x, y: b.y, vx: -b.vx * 0.9, vy: b.vy });
        if (existing.length + newBalls.length < 6) {
          newBalls.push({ x: b.x, y: b.y, vx: b.vy * 0.8, vy: -b.vx * 0.8 });
        }
      }
      ballsRef.current = [...existing, ...newBalls];
    }

    effectTimersRef.current[type] = setTimeout(() => {
      setActiveEffects(prev => { const s = new Set(prev); s.delete(type); return s; });
      if (type === "wide") paddleWRef.current = 80;
      if (type === "slow") {
        ballsRef.current = ballsRef.current.map(b => {
          const spd = Math.hypot(b.vx, b.vy);
          const target = 4;
          const f = spd > 0 ? target / spd : 1;
          return { ...b, vx: b.vx * f, vy: b.vy * f };
        });
      }
    }, 8000);
  }, []);

  const resetRound = useCallback(() => {
    ballsRef.current = [{ x: W / 2, y: H - 80, vx: 3.5, vy: -4.5 }];
    paddleXRef.current = W / 2 - 40;
    paddleWRef.current = 80;
    powerUpsRef.current = [];
    laserShotsRef.current = [];
  }, []);

  const resetGame = useCallback(() => {
    bricksRef.current = buildBricks();
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setActiveEffects(new Set());
    setGameState("playing");
    gameStateRef.current = "playing";
    Object.values(effectTimersRef.current).forEach(t => t && clearTimeout(t));
    effectTimersRef.current = {};
    laserCooldownRef.current = 0;
    resetRound();
  }, [resetRound]);

  const spawnPowerUp = useCallback((x: number, y: number) => {
    if (Math.random() > 0.25) return;
    const types: PowerUpType[] = ["wide", "multi", "slow", "laser"];
    const type = types[Math.floor(Math.random() * types.length)];
    powerUpsRef.current.push({ x, y, vy: 2, type, active: true });
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < H; i += 4) {
      ctx.fillStyle = `rgba(0,0,0,${0.12 + (i % 8 === 0 ? 0.12 : 0)})`;
      ctx.fillRect(0, i, W, 2);
    }

    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      const dimmed = b.hp === 1 && bricksRef.current.some(x => x.color === b.color && x.hp === 2);
      const alpha = dimmed ? 0.55 : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(b.x, b.y, BRICK_W, 4);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(b.x, b.y + BRICK_H - 4, BRICK_W, 4);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.restore();
    }

    for (const pu of powerUpsRef.current) {
      if (!pu.active) continue;
      const colors: Record<PowerUpType, string> = { wide: "#0af", multi: "#f0a", slow: "#0fa", laser: "#f50" };
      const labels: Record<PowerUpType, string> = { wide: "W", multi: "+", slow: "S", laser: "L" };
      ctx.save();
      ctx.fillStyle = colors[pu.type];
      ctx.beginPath();
      ctx.roundRect(pu.x - 12, pu.y - 10, 24, 20, 4);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[pu.type], pu.x, pu.y);
      ctx.restore();
    }

    for (const ls of laserShotsRef.current) {
      if (!ls.active) continue;
      ctx.save();
      ctx.fillStyle = "#f50";
      ctx.fillRect(ls.x - 2, ls.y - 8, 4, 16);
      ctx.fillStyle = "#fff";
      ctx.fillRect(ls.x - 1, ls.y - 8, 2, 16);
      ctx.restore();
    }

    const pw = paddleWRef.current;
    const px = paddleXRef.current;
    const paddleGrad = ctx.createLinearGradient(px, H - 30, px, H - 30 + PADDLE_H);
    paddleGrad.addColorStop(0, "#88f");
    paddleGrad.addColorStop(1, "#44a");
    ctx.fillStyle = paddleGrad;
    ctx.beginPath();
    ctx.roundRect(px, H - 30, pw, PADDLE_H, 6);
    ctx.fill();
    ctx.strokeStyle = "#aaf";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (const b of ballsRef.current) {
      const grad = ctx.createRadialGradient(b.x - BALL_R * 0.3, b.y - BALL_R * 0.3, 0, b.x, b.y, BALL_R);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#88f");
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${scoreRef.current}`, 8, 6);
    ctx.textAlign = "right";
    ctx.fillText(`Lives: ${"❤".repeat(livesRef.current)}`, W - 8, 6);
    ctx.textAlign = "left";

    if (gameStateRef.current === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(60, H / 2 - 60, W - 120, 130);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 22px monospace";
      ctx.textAlign = "center";
      ctx.fillText("BREAKOUT RETRO", W / 2, H / 2 - 40);
      ctx.fillStyle = "#aaf";
      ctx.font = "13px sans-serif";
      ctx.fillText("Move mouse/touch to control paddle", W / 2, H / 2 - 10);
      ctx.fillText("Power-ups: W=Wide  +=Multi  S=Slow  L=Laser", W / 2, H / 2 + 10);
      ctx.fillStyle = "#ffd700";
      ctx.font = "14px sans-serif";
      ctx.fillText("Click to start!", W / 2, H / 2 + 42);
      ctx.textAlign = "left";
    }

    if (gameStateRef.current === "won") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(60, H / 2 - 50, W - 120, 110);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("YOU WIN!", W / 2, H / 2 - 15);
      ctx.fillStyle = "#aaf";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 + 15);
      ctx.font = "13px sans-serif";
      ctx.fillText("Click to play again", W / 2, H / 2 + 42);
      ctx.textAlign = "left";
    }

    if (gameStateRef.current === "lost") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(60, H / 2 - 50, W - 120, 110);
      ctx.fillStyle = "#f55";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 15);
      ctx.fillStyle = "#aaf";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 + 15);
      ctx.font = "13px sans-serif";
      ctx.fillText("Click to play again", W / 2, H / 2 + 42);
      ctx.textAlign = "left";
    }
  }, []);

  const updatePhysics = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const mx = touchXRef.current ?? mouseXRef.current;
    paddleXRef.current = Math.max(0, Math.min(W - paddleWRef.current, mx - paddleWRef.current / 2));

    const activeLaser = activeEffects.has("laser");
    if (activeLaser && laserCooldownRef.current <= 0) {
      const cx = paddleXRef.current + paddleWRef.current / 2;
      laserShotsRef.current.push({ x: cx - 15, y: H - 30, active: true });
      laserShotsRef.current.push({ x: cx + 15, y: H - 30, active: true });
      laserCooldownRef.current = 18;
    }
    if (laserCooldownRef.current > 0) laserCooldownRef.current--;

    for (const ls of laserShotsRef.current) {
      if (!ls.active) continue;
      ls.y -= 9;
      if (ls.y < 0) { ls.active = false; continue; }
      for (const b of bricksRef.current) {
        if (!b.alive) continue;
        if (ls.x >= b.x && ls.x <= b.x + BRICK_W && ls.y >= b.y && ls.y <= b.y + BRICK_H) {
          ls.active = false;
          b.hp--;
          if (b.hp <= 0) {
            b.alive = false;
            scoreRef.current += 15;
            setScore(scoreRef.current);
            spawnPowerUp(b.x + BRICK_W / 2, b.y + BRICK_H / 2);
          }
          break;
        }
      }
    }
    laserShotsRef.current = laserShotsRef.current.filter(ls => ls.active);

    for (const pu of powerUpsRef.current) {
      if (!pu.active) continue;
      pu.y += pu.vy;
      const px = paddleXRef.current;
      const pw = paddleWRef.current;
      if (pu.y >= H - 35 && pu.y <= H - 18 && pu.x >= px && pu.x <= px + pw) {
        pu.active = false;
        applyEffect(pu.type);
      }
      if (pu.y > H) pu.active = false;
    }
    powerUpsRef.current = powerUpsRef.current.filter(pu => pu.active);

    const toRemove: number[] = [];
    ballsRef.current = ballsRef.current.map((ball, idx) => {
      let { x, y, vx, vy } = ball;
      const spd = Math.hypot(vx, vy);
      const maxSpd = 9;
      if (spd > maxSpd) { vx = vx / spd * maxSpd; vy = vy / spd * maxSpd; }
      x += vx;
      y += vy;
      if (x < BALL_R) { x = BALL_R; vx = Math.abs(vx); }
      if (x > W - BALL_R) { x = W - BALL_R; vx = -Math.abs(vx); }
      if (y < BALL_R) { y = BALL_R; vy = Math.abs(vy); }

      const px = paddleXRef.current;
      const pw = paddleWRef.current;
      const paddleTop = H - 30;
      if (y + BALL_R >= paddleTop && y + BALL_R <= paddleTop + PADDLE_H + 4 && x >= px && x <= px + pw && vy > 0) {
        y = paddleTop - BALL_R;
        const hitPos = (x - px) / pw;
        const angle = (hitPos - 0.5) * 2.2;
        const speed = Math.max(Math.hypot(vx, vy), 4.5);
        vx = Math.sin(angle) * speed;
        vy = -Math.abs(Math.cos(angle) * speed);
        if (Math.abs(vy) < 2) vy = -2;
      }

      for (const b of bricksRef.current) {
        if (!b.alive) continue;
        const bRight = b.x + BRICK_W;
        const bBottom = b.y + BRICK_H;
        const overlapL = x + BALL_R - b.x;
        const overlapR = bRight - (x - BALL_R);
        const overlapT = y + BALL_R - b.y;
        const overlapB = bBottom - (y - BALL_R);
        if (overlapL > 0 && overlapR > 0 && overlapT > 0 && overlapB > 0) {
          b.hp--;
          if (b.hp <= 0) {
            b.alive = false;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            spawnPowerUp(b.x + BRICK_W / 2, b.y + BRICK_H / 2);
          } else {
            scoreRef.current += 5;
            setScore(scoreRef.current);
          }
          const minOverlap = Math.min(overlapL, overlapR, overlapT, overlapB);
          if (minOverlap === overlapL || minOverlap === overlapR) vx = -vx;
          else vy = -vy;
          break;
        }
      }

      if (y > H + 20) { toRemove.push(idx); return ball; }
      return { x, y, vx, vy };
    });

    if (toRemove.length > 0) {
      ballsRef.current = ballsRef.current.filter((_, i) => !toRemove.includes(i));
      if (ballsRef.current.length === 0) {
        const remaining = livesRef.current - 1;
        livesRef.current = remaining;
        setLives(remaining);
        if (remaining <= 0) {
          gameStateRef.current = "lost";
          setGameState("lost");
        } else {
          resetRound();
        }
      }
    }

    if (bricksRef.current.every(b => !b.alive)) {
      gameStateRef.current = "won";
      setGameState("won");
    }
  }, [activeEffects, spawnPowerUp, applyEffect, resetRound]);

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

  const getCanvasX = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    if ("touches" in e) return (e.touches[0].clientX - rect.left) * scaleX;
    return ((e as React.MouseEvent).clientX - rect.left) * scaleX;
  };

  const handleMouseMove = (e: React.MouseEvent) => { mouseXRef.current = getCanvasX(e); };
  const handleTouchMove = (e: React.TouchEvent) => { touchXRef.current = getCanvasX(e); e.preventDefault(); };
  const handleTouchEnd = () => { touchXRef.current = null; };

  const handleClick = () => {
    if (gameStateRef.current === "idle" || gameStateRef.current === "won" || gameStateRef.current === "lost") {
      resetGame();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex gap-4 text-xs text-gray-400">
        {["wide", "multi", "slow", "laser"].map(eff => (
          <span key={eff} className={`px-2 py-0.5 rounded font-bold ${activeEffects.has(eff as PowerUpType) ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"}`}>
            {eff === "wide" ? "W Wide" : eff === "multi" ? "+ Multi" : eff === "slow" ? "S Slow" : "L Laser"}
          </span>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-2 border-gray-700 rounded cursor-none touch-none"
        style={{ maxWidth: "100%", aspectRatio: `${W}/${H}`, imageRendering: "pixelated" }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      />
      <p className="text-xs text-gray-400 text-center">Move mouse or touch to control paddle. Collect power-ups for bonuses!</p>
    </div>
  );
}

export default function BreakoutRetroGame() {
  return (
    <CalculatorVerticalLayout
      title="Breakout Retro - Classic Brick Breaker"
      description="Classic Breakout with a retro CRT feel! Collect power-ups for wide paddle, multi-ball, slow motion, and laser cannon. Break all the bricks!"
      canonical="https://www.smartkitnow.com/games/breakout-retro"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Breakout Retro</h2>
          <p>
            Move your paddle to keep the ball in play and destroy all the bricks above. Collect falling
            power-ups to gain special abilities. You have 3 lives — don't let the ball fall off the bottom!
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse Movement / Touch:</strong> Move the paddle left and right</li>
            <li><strong>Click:</strong> Start the game / restart after game over</li>
          </ul>
          <h3>Power-ups</h3>
          <ul>
            <li><strong>W (Wide):</strong> Makes the paddle wider for 8 seconds</li>
            <li><strong>+ (Multi-ball):</strong> Splits existing balls into more balls</li>
            <li><strong>S (Slow):</strong> Slows all balls for 8 seconds</li>
            <li><strong>L (Laser):</strong> Fires auto-aiming lasers from the paddle for 8 seconds</li>
          </ul>
          <h3>Ball Angle</h3>
          <p>
            Where the ball hits the paddle affects its return angle. Hit with the center for a straight
            shot, or the edges for sharp angled returns — great for reaching stubborn bricks!
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
