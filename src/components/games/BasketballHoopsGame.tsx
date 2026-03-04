import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "IDLE" | "PLAYING" | "GAME_OVER";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  inFlight: boolean;
}

interface Hoop {
  x: number;
  y: number;
  width: number;
  rimRadius: number;
  vy: number;
  direction: number;
}

interface DragState {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_W = 600;
const CANVAS_H = 400;
const GRAVITY = 0.4;
const BALL_RADIUS = 14;
const GROUND_Y = CANVAS_H - 60;
const PLAYER_X = 90;
const HOOP_X = 490;
const RIM_RADIUS = 5;
const HOOP_WIDTH = 50;
const GAME_DURATION = 60;

// ─── Helper functions ─────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function computeArcPoints(
  startX: number,
  startY: number,
  vx: number,
  vy: number,
  steps: number
): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  let x = startX;
  let y = startY;
  let cvx = vx;
  let cvy = vy;
  for (let i = 0; i < steps; i++) {
    pts.push({ x, y });
    x += cvx;
    y += cvy;
    cvy += GRAVITY;
    if (y > GROUND_Y) break;
  }
  return pts;
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
): void {
  ctx.save();
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  grad.addColorStop(0, "#ff8c00");
  grad.addColorStop(1, "#b84a00");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // seam lines
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.lineTo(x + r, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI + 0.2, -0.2);
  ctx.stroke();
  ctx.restore();
}

function drawHoop(ctx: CanvasRenderingContext2D, hoop: Hoop): void {
  ctx.save();
  // backboard
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.fillRect(hoop.x + hoop.width + 10, hoop.y - 60, 14, 90);
  ctx.strokeRect(hoop.x + hoop.width + 10, hoop.y - 60, 14, 90);
  // inner square
  ctx.strokeStyle = "#e00";
  ctx.strokeRect(hoop.x + hoop.width + 12, hoop.y - 30, 10, 26);

  // support arm
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hoop.x + hoop.width + 17, hoop.y);
  ctx.lineTo(hoop.x + hoop.width, hoop.y);
  ctx.stroke();

  // rim (left + right)
  ctx.strokeStyle = "#e05000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(hoop.x, hoop.y);
  ctx.lineTo(hoop.x + hoop.width, hoop.y);
  ctx.stroke();

  // left rim end
  ctx.fillStyle = "#e05000";
  ctx.beginPath();
  ctx.arc(hoop.x, hoop.y, RIM_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  // right rim end
  ctx.beginPath();
  ctx.arc(hoop.x + hoop.width, hoop.y, RIM_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // net
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1;
  const netLines = 6;
  const netDepth = 30;
  const netBottomW = hoop.width * 0.5;
  const cx = hoop.x + hoop.width / 2;
  for (let i = 0; i <= netLines; i++) {
    const t = i / netLines;
    const topX = lerp(hoop.x, hoop.x + hoop.width, t);
    const botX = cx + lerp(-netBottomW / 2, netBottomW / 2, t);
    ctx.beginPath();
    ctx.moveTo(topX, hoop.y);
    ctx.lineTo(botX, hoop.y + netDepth);
    ctx.stroke();
  }
  for (let row = 1; row <= 3; row++) {
    const t = row / 4;
    const rowY = hoop.y + netDepth * t;
    const rowW = lerp(hoop.width, netBottomW, t);
    const rowX = lerp(hoop.x, cx - netBottomW / 2, t);
    ctx.beginPath();
    ctx.moveTo(rowX, rowY);
    ctx.lineTo(rowX + rowW, rowY);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, hasBall: boolean): void {
  ctx.save();
  const px = PLAYER_X;
  const py = GROUND_Y;

  // body
  ctx.fillStyle = "#e63946";
  ctx.fillRect(px - 12, py - 55, 24, 30);
  // shorts
  ctx.fillStyle = "#1d3557";
  ctx.fillRect(px - 13, py - 28, 26, 18);
  // legs
  ctx.fillStyle = "#e0b090";
  ctx.fillRect(px - 10, py - 12, 8, 14);
  ctx.fillRect(px + 2, py - 12, 8, 14);
  // shoes
  ctx.fillStyle = "#333";
  ctx.fillRect(px - 12, py, 10, 6);
  ctx.fillRect(px + 2, py, 12, 6);
  // head
  ctx.fillStyle = "#e0b090";
  ctx.beginPath();
  ctx.arc(px, py - 65, 13, 0, Math.PI * 2);
  ctx.fill();
  // arm holding ball
  if (hasBall) {
    ctx.strokeStyle = "#e0b090";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px + 10, py - 45);
    ctx.lineTo(px + 22, py - 35);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  // court
  const courtGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  courtGrad.addColorStop(0, "#87ceeb");
  courtGrad.addColorStop(0.65, "#87ceeb");
  courtGrad.addColorStop(0.65, "#c8860a");
  courtGrad.addColorStop(1, "#a06008");
  ctx.fillStyle = courtGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // floor lines
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 6);
  ctx.lineTo(CANVAS_W, GROUND_Y + 6);
  ctx.stroke();

  // three-point arc
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(PLAYER_X, GROUND_Y + 6, 170, Math.PI, 2 * Math.PI);
  ctx.stroke();
}

// ─── Game Component ───────────────────────────────────────────────────────────

function BasketballGame(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    gameState: GameState;
    ball: Ball;
    hoop: Hoop;
    score: number;
    timeLeft: number;
    level: number;
    drag: DragState;
    animId: number;
    lastTime: number;
    timerTick: number;
    scored: boolean;
    scoredAnim: number;
    shotResult: string;
  }>({
    gameState: "IDLE",
    ball: { x: PLAYER_X + 22, y: GROUND_Y - 35, vx: 0, vy: 0, radius: BALL_RADIUS, inFlight: false },
    hoop: { x: HOOP_X, y: 180, width: HOOP_WIDTH, rimRadius: RIM_RADIUS, vy: 0, direction: 1 },
    score: 0,
    timeLeft: GAME_DURATION,
    level: 1,
    drag: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 },
    animId: 0,
    lastTime: 0,
    timerTick: 0,
    scored: false,
    scoredAnim: 0,
    shotResult: "",
  });

  const [uiScore, setUiScore] = useState(0);
  const [uiTime, setUiTime] = useState(GAME_DURATION);
  const [uiState, setUiState] = useState<GameState>("IDLE");
  const [uiLevel, setUiLevel] = useState(1);

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.ball = {
      x: PLAYER_X + 22,
      y: GROUND_Y - 35,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      inFlight: false,
    };
  }, []);

  const checkBasket = useCallback((): boolean => {
    const s = stateRef.current;
    const { ball, hoop } = s;
    const rimLeft = hoop.x;
    const rimRight = hoop.x + hoop.width;
    const rimY = hoop.y;
    const ballPassingThrough =
      ball.vy > 0 &&
      ball.y >= rimY - 4 &&
      ball.y <= rimY + 12 &&
      ball.x > rimLeft + ball.radius * 0.5 &&
      ball.x < rimRight - ball.radius * 0.5;
    return ballPassingThrough;
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const s = stateRef.current;
    if (s.gameState !== "PLAYING") return;

    const dt = Math.min(timestamp - s.lastTime, 32);
    s.lastTime = timestamp;
    s.timerTick += dt;
    if (s.timerTick >= 1000) {
      s.timerTick -= 1000;
      s.timeLeft = Math.max(0, s.timeLeft - 1);
      setUiTime(s.timeLeft);
      if (s.timeLeft === 0) {
        s.gameState = "GAME_OVER";
        setUiState("GAME_OVER");
        cancelAnimationFrame(s.animId);
        return;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // hoop movement
    if (s.level >= 2) {
      const speed = s.level === 2 ? 0.8 : s.level === 3 ? 1.4 : 2.0;
      s.hoop.y += speed * s.hoop.direction;
      if (s.hoop.y < 100 || s.hoop.y > GROUND_Y - 80) {
        s.hoop.direction *= -1;
      }
    }

    // ball physics
    if (s.ball.inFlight) {
      s.ball.vy += GRAVITY;
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      if (checkBasket()) {
        s.score += 2;
        s.scored = true;
        s.scoredAnim = 60;
        s.shotResult = "+2";
        setUiScore(s.score);
        // level up every 10 points
        const newLevel = Math.min(4, Math.floor(s.score / 10) + 1);
        if (newLevel !== s.level) {
          s.level = newLevel;
          setUiLevel(newLevel);
        }
        resetBall();
      } else if (s.ball.y > GROUND_Y + 40 || s.ball.x > CANVAS_W + 50) {
        resetBall();
      }
      // wall bounce left
      if (s.ball.x - s.ball.radius < 0) {
        s.ball.x = s.ball.radius;
        s.ball.vx = Math.abs(s.ball.vx) * 0.6;
      }
    }

    if (s.scoredAnim > 0) s.scoredAnim--;

    // draw
    drawBackground(ctx);
    drawPlayer(ctx, !s.ball.inFlight);
    drawHoop(ctx, s.hoop);

    // aim preview
    if (s.drag.active && !s.ball.inFlight) {
      const dx = s.drag.startX - s.drag.currentX;
      const dy = s.drag.startY - s.drag.currentY;
      const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 60, 1);
      const vx = (dx / 60) * 14 * power;
      const vy = (dy / 60) * 14 * power;
      const arcPts = computeArcPoints(s.ball.x, s.ball.y, vx, vy, 40);
      ctx.save();
      ctx.setLineDash([5, 6]);
      ctx.strokeStyle = "rgba(255,200,0,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      arcPts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      // power indicator
      const barX = 10;
      const barY = CANVAS_H - 30;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(barX, barY, 100, 14);
      ctx.fillStyle = power > 0.7 ? "#e63946" : "#2ecc71";
      ctx.fillRect(barX, barY, 100 * power, 14);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, 100, 14);
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText("POWER", barX + 2, barY - 2);
      ctx.restore();
    }

    drawBall(ctx, s.ball.x, s.ball.y, s.ball.radius);

    // score popup
    if (s.scoredAnim > 0) {
      ctx.save();
      ctx.globalAlpha = s.scoredAnim / 60;
      ctx.font = `bold ${28 + (60 - s.scoredAnim) / 3}px sans-serif`;
      ctx.fillStyle = "#ffd700";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(s.shotResult, s.hoop.x - 10, s.hoop.y - 20 - (60 - s.scoredAnim) * 0.5);
      ctx.fillText(s.shotResult, s.hoop.x - 10, s.hoop.y - 20 - (60 - s.scoredAnim) * 0.5);
      ctx.restore();
    }

    // HUD
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, CANVAS_W, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`Score: ${s.score}`, 12, 26);
    ctx.textAlign = "center";
    ctx.fillText(`Time: ${s.timeLeft}s`, CANVAS_W / 2, 26);
    ctx.textAlign = "right";
    ctx.fillText(`Level ${s.level}`, CANVAS_W - 12, 26);
    ctx.restore();

    s.animId = requestAnimationFrame(gameLoop);
  }, [checkBasket, resetBall]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    cancelAnimationFrame(s.animId);
    s.gameState = "PLAYING";
    s.score = 0;
    s.timeLeft = GAME_DURATION;
    s.level = 1;
    s.timerTick = 0;
    s.hoop = { x: HOOP_X, y: 180, width: HOOP_WIDTH, rimRadius: RIM_RADIUS, vy: 0, direction: 1 };
    s.scoredAnim = 0;
    resetBall();
    setUiScore(0);
    setUiTime(GAME_DURATION);
    setUiState("PLAYING");
    setUiLevel(1);
    s.lastTime = performance.now();
    s.animId = requestAnimationFrame(gameLoop);
  }, [gameLoop, resetBall]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current;
    if (s.gameState !== "PLAYING" || s.ball.inFlight) return;
    const pos = getCanvasPos(e);
    s.drag = { active: true, startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current;
    if (!s.drag.active) return;
    const pos = getCanvasPos(e);
    s.drag.currentX = pos.x;
    s.drag.currentY = pos.y;
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current;
    if (!s.drag.active || s.ball.inFlight) return;
    const pos = getCanvasPos(e);
    s.drag.active = false;
    const dx = s.drag.startX - pos.x;
    const dy = s.drag.startY - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) return;
    const power = Math.min(dist / 60, 1);
    s.ball.vx = (dx / dist) * 14 * power;
    s.ball.vy = (dy / dist) * 14 * power;
    s.ball.inFlight = true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawBackground(ctx);
    drawPlayer(ctx, true);
    const hoop = stateRef.current.hoop;
    drawHoop(ctx, hoop);
    drawBall(ctx, PLAYER_X + 22, GROUND_Y - 35, BALL_RADIUS);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Basketball Hoops", CANVAS_W / 2, CANVAS_H / 2 - 30);
    ctx.font = "18px sans-serif";
    ctx.fillText("Click & Drag to aim, Release to shoot!", CANVAS_W / 2, CANVAS_H / 2 + 10);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("Score as many baskets as you can in 60 seconds", CANVAS_W / 2, CANVAS_H / 2 + 45);
    ctx.textAlign = "left";
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(stateRef.current.animId);
  }, []);

  const widget = (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[600px] border-2 border-orange-400 rounded-xl cursor-crosshair touch-none"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="flex gap-4 items-center">
        <button
          onClick={startGame}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-lg transition-colors"
        >
          {uiState === "IDLE" ? "Start Game" : uiState === "GAME_OVER" ? "Play Again" : "Restart"}
        </button>
        {uiState === "PLAYING" && (
          <div className="flex gap-6 text-lg font-bold">
            <span className="text-orange-300">Score: {uiScore}</span>
            <span className="text-yellow-300">Time: {uiTime}s</span>
            <span className="text-green-300">Level {uiLevel}</span>
          </div>
        )}
        {uiState === "GAME_OVER" && (
          <div className="text-2xl font-bold text-yellow-400">
            Final Score: {uiScore}
          </div>
        )}
      </div>
    </div>
  );

  const editorial = (
    <div>
      <h2 className="text-2xl font-bold mb-4">How to Play Basketball Hoops</h2>
      <p className="mb-3">
        Basketball Hoops is a fun physics-based shooting game. Aim carefully, account for gravity, and
        sink as many baskets as possible before the clock runs out!
      </p>
      <h3 className="text-xl font-semibold mb-2">Controls</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Click and hold on the canvas to start aiming</li>
        <li>Drag away from the ball to set power and direction</li>
        <li>Release to shoot — the dotted arc shows your trajectory</li>
        <li>On mobile, use touch drag in the same way</li>
      </ul>
      <h3 className="text-xl font-semibold mb-2">Scoring & Levels</h3>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Each basket scores 2 points</li>
        <li>You have 60 seconds to score as many as possible</li>
        <li>Every 10 points, the hoop starts moving up and down — harder to hit!</li>
        <li>Level 1: static hoop | Level 2-4: increasing hoop speed</li>
      </ul>
      <h3 className="text-xl font-semibold mb-2">Tips</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Aim slightly above the hoop to account for ball drop</li>
        <li>Use medium power for most shots — too much and the ball flies past</li>
        <li>Watch the power bar in the bottom-left as you drag</li>
        <li>At higher levels, lead the moving hoop with your shot</li>
      </ul>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basketball Hoops"
      description="Play Basketball Hoops — click and drag to aim, release to shoot! Physics-based basketball game with moving hoops, 60-second timer, and increasing difficulty levels."
      canonical="https://www.smartkitnow.com/games/basketball-hoops"
      widget={widget}
      editorial={editorial}
      contentMaxWidth="max-w-5xl"
    />
  );
}

export default function BasketballHoopsGame(): React.ReactElement {
  return <BasketballGame />;
}
