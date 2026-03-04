import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 480;
const H = 360;
const G = 0.4;
const BALL_RADIUS = 12;
const RIM_WIDTH = 50;
const RIM_HEIGHT = 6;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  scored: boolean;
}

interface Hoop {
  x: number;
  y: number;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("hs_basketball-hoops") || "0"));

  const scoreRef = useRef(0);
  const timeRef = useRef(60);
  const gameActiveRef = useRef(false);
  const gameOverRef = useRef(false);
  const ballRef = useRef<Ball>({ x: 80, y: H - 60, vx: 0, vy: 0, active: false, scored: false });
  const hoopRef = useRef<Hoop>({ x: W - 100, y: H / 2 - 20 });
  const hoopDirRef = useRef(1);
  const hoopSpeedRef = useRef(0);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const playerBaseY = H - 60;
  const playerX = 80;

  const arcPoints = useCallback((sx: number, sy: number, vx: number, vy: number, steps = 20) => {
    const pts: { x: number; y: number }[] = [];
    for (let t = 0; t < steps; t++) {
      pts.push({ x: sx + vx * t, y: sy + vy * t + 0.5 * G * t * t });
    }
    return pts;
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#1a1a3e");
    gradient.addColorStop(1, "#2d1b0e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, H - 30, W, 30);
    ctx.fillStyle = "#D2691E";
    for (let i = 0; i < W; i += 40) {
      ctx.fillRect(i, H - 30, 38, 28);
    }

    const hoop = hoopRef.current;
    ctx.fillStyle = "#555";
    ctx.fillRect(hoop.x + RIM_WIDTH / 2, hoop.y, 8, H - hoop.y - 30);

    ctx.fillStyle = "#fff";
    ctx.fillRect(hoop.x + RIM_WIDTH / 2 - 2, hoop.y - 60, 14, 80);

    ctx.fillStyle = "#e65c00";
    ctx.fillRect(hoop.x, hoop.y, RIM_WIDTH, RIM_HEIGHT);

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    const netY = hoop.y + RIM_HEIGHT;
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(hoop.x + (i / 6) * RIM_WIDTH, netY);
      ctx.lineTo(hoop.x + RIM_WIDTH / 2 + ((i / 6) - 0.5) * RIM_WIDTH * 0.4, netY + 22);
      ctx.stroke();
    }
    for (let row = 0; row < 3; row++) {
      ctx.beginPath();
      const y0 = netY + row * 7;
      ctx.moveTo(hoop.x, y0);
      for (let i = 0; i <= 6; i++) {
        ctx.lineTo(hoop.x + (i / 6) * RIM_WIDTH, y0 + (i % 2 === 0 ? 0 : 5));
      }
      ctx.stroke();
    }

    ctx.fillStyle = "#4a4a8a";
    ctx.fillRect(playerX - 15, playerBaseY - 40, 30, 50);
    ctx.fillStyle = "#6a6aaa";
    ctx.beginPath();
    ctx.arc(playerX, playerBaseY - 50, 18, 0, Math.PI * 2);
    ctx.fill();

    const ball = ballRef.current;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#e85d04";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ball.x - BALL_RADIUS, ball.y);
    ctx.lineTo(ball.x + BALL_RADIUS, ball.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS * 0.85, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS * 0.85, Math.PI - 0.6, Math.PI + 0.6);
    ctx.stroke();
    ctx.restore();

    if (!ball.active && dragStartRef.current && dragCurrentRef.current && gameActiveRef.current) {
      const dx = dragStartRef.current.x - dragCurrentRef.current.x;
      const dy = dragStartRef.current.y - dragCurrentRef.current.y;
      const power = Math.min(Math.sqrt(dx * dx + dy * dy), 200);
      const vx = (dx / 200) * 12;
      const vy = (dy / 200) * 14;
      const pts = arcPoints(playerX, playerBaseY - 20, vx, vy);
      ctx.strokeStyle = "rgba(255,255,100,0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ff0";
      ctx.font = "12px monospace";
      ctx.fillText(`Power: ${Math.floor((power / 200) * 100)}%`, 10, 20);
    }

    if (!gameActiveRef.current && !gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Basketball Hoops", W / 2, H / 2 - 30);
      ctx.font = "15px sans-serif";
      ctx.fillText("Click & drag backward to aim", W / 2, H / 2 + 5);
      ctx.fillText("Release to shoot!", W / 2, H / 2 + 28);
      ctx.fillText("Tap / click to start", W / 2, H / 2 + 58);
      ctx.textAlign = "left";
    }

    if (gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", W / 2, H / 2 - 40);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2);
      ctx.font = "15px sans-serif";
      ctx.fillText("Click / tap to play again", W / 2, H / 2 + 40);
      ctx.textAlign = "left";
    }
  }, [arcPoints, playerBaseY, playerX]);

  const checkScore = useCallback(() => {
    const ball = ballRef.current;
    const hoop = hoopRef.current;
    const rimLeft = hoop.x;
    const rimRight = hoop.x + RIM_WIDTH;
    const rimY = hoop.y + RIM_HEIGHT / 2;

    if (
      ball.vy > 0 &&
      ball.y >= rimY - 6 &&
      ball.y <= rimY + 10 &&
      ball.x > rimLeft + BALL_RADIUS * 0.6 &&
      ball.x < rimRight - BALL_RADIUS * 0.6 &&
      !ball.scored
    ) {
      ball.scored = true;
      const newScore = scoreRef.current + 2;
      scoreRef.current = newScore;
      setScore(newScore);
      hoopSpeedRef.current = Math.min(0.5 + Math.floor(newScore / 6) * 0.4, 3.5);
    }
  }, []);

  const updatePhysics = useCallback(() => {
    const ball = ballRef.current;
    const hoop = hoopRef.current;

    if (ball.active) {
      ball.vy += G;
      ball.x += ball.vx;
      ball.y += ball.vy;

      const rimLeft = hoop.x;
      const rimRight = hoop.x + RIM_WIDTH;
      const rimY = hoop.y;
      const dl = Math.hypot(ball.x - rimLeft, ball.y - rimY);
      const dr = Math.hypot(ball.x - rimRight, ball.y - rimY);
      if (dl < BALL_RADIUS + 3) { ball.vx = Math.abs(ball.vx) * 0.65; ball.vy *= 0.65; }
      if (dr < BALL_RADIUS + 3) { ball.vx = -Math.abs(ball.vx) * 0.65; ball.vy *= 0.65; }

      checkScore();

      if (ball.y > H + 50) {
        ball.active = false;
        ball.x = playerX;
        ball.y = playerBaseY - 20;
        ball.vx = 0;
        ball.vy = 0;
        ball.scored = false;
      }
      if (ball.x < BALL_RADIUS) { ball.x = BALL_RADIUS; ball.vx = Math.abs(ball.vx) * 0.8; }
      if (ball.x > W - BALL_RADIUS) { ball.x = W - BALL_RADIUS; ball.vx = -Math.abs(ball.vx) * 0.8; }
    }

    if (gameActiveRef.current && hoopSpeedRef.current > 0) {
      hoop.y += hoopDirRef.current * hoopSpeedRef.current;
      if (hoop.y < 80 || hoop.y > H - 160) hoopDirRef.current *= -1;
    }
  }, [checkScore, playerBaseY, playerX]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      updatePhysics();
      drawScene();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [updatePhysics, drawScene]);

  useEffect(() => {
    if (!gameActive || gameOver) return;
    const interval = setInterval(() => {
      const newTime = timeRef.current - 1;
      timeRef.current = newTime;
      setTimeLeft(newTime);
      if (newTime <= 0) {
        gameOverRef.current = true;
        gameActiveRef.current = false;
        setGameOver(true);
        setGameActive(false);
        setHighScore(prev => {
          const ns = Math.max(prev, scoreRef.current);
          if (scoreRef.current > prev) try { localStorage.setItem("hs_basketball-hoops", String(ns)); } catch {}
          return ns;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, gameOver]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOverRef.current) {
      scoreRef.current = 0;
      timeRef.current = 60;
      setScore(0);
      setTimeLeft(60);
      setGameOver(false);
      gameOverRef.current = false;
      hoopSpeedRef.current = 0;
      hoopRef.current = { x: W - 100, y: H / 2 - 20 };
      ballRef.current = { x: playerX, y: playerBaseY - 20, vx: 0, vy: 0, active: false, scored: false };
    }
    if (!gameActiveRef.current) {
      gameActiveRef.current = true;
      setGameActive(true);
    }
    if (!ballRef.current.active) {
      dragStartRef.current = getCanvasPos(e);
      dragCurrentRef.current = getCanvasPos(e);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartRef.current && !ballRef.current.active) {
      dragCurrentRef.current = getCanvasPos(e);
    }
  };

  const handleEnd = () => {
    if (dragStartRef.current && dragCurrentRef.current && !ballRef.current.active && gameActiveRef.current) {
      const dx = dragStartRef.current.x - dragCurrentRef.current.x;
      const dy = dragStartRef.current.y - dragCurrentRef.current.y;
      const power = Math.hypot(dx, dy);
      if (power > 10) {
        ballRef.current.vx = (dx / 200) * 12;
        ballRef.current.vy = (dy / 200) * 14;
        ballRef.current.active = true;
        ballRef.current.scored = false;
      }
    }
    dragStartRef.current = null;
    dragCurrentRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex gap-6 text-sm font-mono bg-gray-900 text-white px-4 py-1 rounded-full">
        <span>Score: <span className="text-yellow-400 font-bold">{score}</span></span>
        <span>Time: <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-green-400"}`}>{timeLeft}s</span></span>
        {highScore > 0 && <span>Best: <span className="text-cyan-400">{highScore}</span></span>}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-2 border-gray-600 rounded cursor-crosshair touch-none"
        style={{ maxWidth: "100%", aspectRatio: `${W}/${H}` }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
      <p className="text-xs text-gray-400 text-center">
        Click and drag backward from the player to aim. Release to shoot!
      </p>
    </div>
  );
}

export default function BasketballHoopsGame() {
  return (
    <CalculatorVerticalLayout
      title="Basketball Hoops - Shooting Game"
      description="Drag to aim, release to shoot! Score as many baskets as possible in 60 seconds. The hoop moves faster as your score climbs!"
      canonical="https://www.smartkitnow.com/games/basketball-hoops"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Basketball Hoops</h2>
          <p>
            Aim and shoot the basketball into the hoop. Click or tap and drag backward from the player figure to
            set direction and power, then release to launch the ball along the dotted arc preview.
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Click/Tap and Drag:</strong> Set shot angle and power</li>
            <li><strong>Release:</strong> Shoot the ball toward the hoop</li>
          </ul>
          <h3>Scoring</h3>
          <p>
            Each successful basket scores 2 points. As your score grows the hoop starts moving vertically,
            getting faster with each set of baskets you score.
          </p>
          <h3>Physics</h3>
          <p>
            The ball follows realistic parabolic trajectory physics. Gravity pulls it downward at a constant
            acceleration. The dotted yellow arc preview shows the predicted path before you release. Ball
            bounces off the rim edges, so aim for the center of the hoop.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
