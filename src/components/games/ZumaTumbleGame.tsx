import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 600;
const H = 600;
const MARBLE_R = 14;
const COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f"];
const CHAIN_COUNT = 40;
const HOLE_X = W / 2;
const HOLE_Y = H / 2;
const BASE_SPEED = 0.4;

// Bezier path control points for curved path
const PATH_POINTS = [
  { x: W - 30, y: 30 },
  { x: W - 60, y: 150 },
  { x: W - 100, y: 220 },
  { x: W / 2 + 100, y: 160 },
  { x: W / 2 + 180, y: H / 2 - 60 },
  { x: W / 2 + 120, y: H / 2 + 40 },
  { x: W / 2 + 60, y: H / 2 + 20 },
  { x: HOLE_X, y: HOLE_Y },
];

function lerpPoints(points: { x: number; y: number }[], t: number) {
  if (points.length === 1) return points[0];
  const newPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push({
      x: points[i].x + (points[i + 1].x - points[i].x) * t,
      y: points[i].y + (points[i + 1].y - points[i].y) * t,
    });
  }
  return lerpPoints(newPoints, t);
}

function getPathPos(t: number) {
  return lerpPoints(PATH_POINTS, Math.max(0, Math.min(1, t)));
}

interface Marble {
  t: number; // 0..1 position on path
  color: string;
  id: number;
  popping: boolean;
  popFrame: number;
}

interface FlyingMarble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const HS_KEY = "hs_zuma-tumble";

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    marbles: [] as Marble[],
    flying: null as FlyingMarble | null,
    nextColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    currentColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: 0,
    lives: 3,
    score: 0,
    highScore: parseInt(localStorage.getItem(HS_KEY) || "0"),
    phase: "playing" as "playing" | "gameover" | "win",
    idCounter: 0,
    speed: BASE_SPEED,
    frame: 0,
  });
  const animRef = useRef<number>(0);
  const [display, setDisplay] = useState({ lives: 3, score: 0, highScore: parseInt(localStorage.getItem(HS_KEY) || "0"), phase: "playing" as string, currentColor: COLORS[0], nextColor: COLORS[1] });

  const initChain = useCallback(() => {
    const s = stateRef.current;
    s.marbles = [];
    s.idCounter = 0;
    for (let i = 0; i < CHAIN_COUNT; i++) {
      s.marbles.push({
        t: -(i * (MARBLE_R * 2.2)) / 1200,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        id: s.idCounter++,
        popping: false,
        popFrame: 0,
      });
    }
    s.flying = null;
    s.lives = 3;
    s.score = 0;
    s.phase = "playing";
    s.speed = BASE_SPEED;
    s.frame = 0;
    s.highScore = parseInt(localStorage.getItem(HS_KEY) || "0");
  }, []);

  useEffect(() => {
    initChain();
  }, [initChain]);

  const checkMatches = useCallback(() => {
    const s = stateRef.current;
    const alive = s.marbles.filter((m) => !m.popping);
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < alive.length - 2; i++) {
        if (alive[i].color === alive[i + 1].color && alive[i].color === alive[i + 2].color) {
          let j = i;
          while (j < alive.length && alive[j].color === alive[i].color) j++;
          const toRemove = alive.splice(i, j - i);
          toRemove.forEach((m) => { m.popping = true; m.popFrame = 0; });
          s.score += toRemove.length * 10;
          changed = true;
          break;
        }
      }
    }
    s.marbles = [...s.marbles.filter((m) => m.popping), ...alive];
  }, []);

  const fireMarble = useCallback((cx: number, cy: number, tx: number, ty: number) => {
    const s = stateRef.current;
    if (s.flying || s.phase !== "playing") return;
    const dx = tx - cx;
    const dy = ty - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const speed = 8;
    s.flying = {
      x: cx, y: cy,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      color: s.currentColor,
    };
    s.currentColor = s.nextColor;
    s.nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      const dx = mx - HOLE_X;
      const dy = my - HOLE_Y;
      stateRef.current.angle = Math.atan2(dy, dx);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      fireMarble(HOLE_X, HOLE_Y, mx, my);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      const mx = (t.clientX - rect.left) * (W / rect.width);
      const my = (t.clientY - rect.top) * (H / rect.height);
      stateRef.current.angle = Math.atan2(my - HOLE_Y, mx - HOLE_X);
      fireMarble(HOLE_X, HOLE_Y, mx, my);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [fireMarble]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;
      s.frame++;

      if (s.phase === "playing") {
        // Move chain
        s.speed = BASE_SPEED + s.score * 0.0005;
        const alive = s.marbles.filter((m) => !m.popping);
        alive.forEach((m) => { m.t += s.speed / 1000; });

        // Check if front marble reached hole
        if (alive.length > 0 && alive[alive.length - 1].t >= 0.98) {
          s.lives--;
          if (s.lives <= 0) {
            s.phase = "gameover";
            if (s.score > s.highScore) {
              s.highScore = s.score;
              try { localStorage.setItem(HS_KEY, String(s.score)); } catch {}
            }
          } else {
            // Remove last marble
            const idx = s.marbles.indexOf(alive[alive.length - 1]);
            if (idx !== -1) s.marbles.splice(idx, 1);
          }
        }

        // Pop animations
        s.marbles.forEach((m) => {
          if (m.popping) m.popFrame++;
        });
        s.marbles = s.marbles.filter((m) => !(m.popping && m.popFrame > 15));

        // Win check
        if (s.marbles.filter((m) => !m.popping).length === 0) {
          s.phase = "win";
          if (s.score > s.highScore) {
            s.highScore = s.score;
            try { localStorage.setItem(HS_KEY, String(s.score)); } catch {}
          }
        }

        // Update flying marble
        if (s.flying) {
          s.flying.x += s.flying.vx;
          s.flying.y += s.flying.vy;

          // Check collision with chain marbles
          let inserted = false;
          for (const m of alive) {
            const pos = getPathPos(m.t);
            const dx = s.flying.x - pos.x;
            const dy = s.flying.y - pos.y;
            if (Math.sqrt(dx * dx + dy * dy) < MARBLE_R * 2) {
              // Insert near this marble
              const newMarble: Marble = {
                t: m.t + 0.001,
                color: s.flying.color,
                id: s.idCounter++,
                popping: false,
                popFrame: 0,
              };
              s.marbles.push(newMarble);
              s.flying = null;
              inserted = true;
              checkMatches();
              break;
            }
          }

          if (!inserted && (s.flying.x < 0 || s.flying.x > W || s.flying.y < 0 || s.flying.y > H)) {
            s.flying = null;
          }
        }
      }

      // ─── Draw ───────────────────────────────────────────────────────
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, W, H);

      // Draw path
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = MARBLE_R * 2 + 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const startPt = getPathPos(0);
      ctx.moveTo(startPt.x, startPt.y);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const p = getPathPos(t);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Draw marbles on path
      for (const m of s.marbles) {
        const pos = getPathPos(Math.min(m.t, 0.99));
        const scale = m.popping ? 1 + m.popFrame / 8 : 1;
        const alpha = m.popping ? Math.max(0, 1 - m.popFrame / 15) : 1;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, MARBLE_R * scale, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Shine
        ctx.beginPath();
        ctx.arc(pos.x - 4, pos.y - 4, MARBLE_R * 0.35 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw hole
      ctx.beginPath();
      ctx.arc(HOLE_X, HOLE_Y, MARBLE_R * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw shooter
      const barrelLen = 35;
      ctx.save();
      ctx.translate(HOLE_X, HOLE_Y);
      ctx.rotate(s.angle);
      ctx.beginPath();
      ctx.rect(0, -6, barrelLen, 12);
      ctx.fillStyle = "#7f8c8d";
      ctx.fill();
      ctx.restore();

      // Draw current marble in shooter
      ctx.beginPath();
      ctx.arc(HOLE_X, HOLE_Y, MARBLE_R, 0, Math.PI * 2);
      ctx.fillStyle = s.currentColor;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw next marble preview
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "12px sans-serif";
      ctx.fillText("NEXT:", 10, H - 35);
      ctx.beginPath();
      ctx.arc(60, H - 30, 12, 0, Math.PI * 2);
      ctx.fillStyle = s.nextColor;
      ctx.fill();

      // Draw flying marble
      if (s.flying) {
        ctx.beginPath();
        ctx.arc(s.flying.x, s.flying.y, MARBLE_R, 0, Math.PI * 2);
        ctx.fillStyle = s.flying.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // HUD
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`Score: ${s.score}`, 10, 28);
      ctx.fillText(`Best: ${s.highScore}`, 10, 52);
      for (let i = 0; i < s.lives; i++) {
        ctx.beginPath();
        ctx.arc(W - 20 - i * 28, 20, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#e74c3c";
        ctx.fill();
      }

      // Overlays
      if (s.phase !== "playing") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = s.phase === "win" ? "#2ecc71" : "#e74c3c";
        ctx.font = "bold 48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.phase === "win" ? "YOU WIN!" : "GAME OVER", W / 2, H / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font = "22px sans-serif";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 25);
        ctx.fillText("Click to restart", W / 2, H / 2 + 60);
        ctx.textAlign = "left";
      }

      setDisplay({ lives: s.lives, score: s.score, highScore: s.highScore, phase: s.phase, currentColor: s.currentColor, nextColor: s.nextColor });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [checkMatches]);

  const handleCanvasClick = useCallback(() => {
    if (stateRef.current.phase !== "playing") {
      initChain();
    }
  }, [initChain]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex gap-6 text-white text-sm font-semibold bg-gray-900 px-4 py-2 rounded-lg flex-wrap justify-center">
        <span className="text-yellow-300">Score: {display.score}</span>
        <span className="text-purple-300">Best: {display.highScore}</span>
        <span className="text-red-400">{"♥".repeat(Math.max(0, display.lives))}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleCanvasClick}
        style={{ maxWidth: "100%", borderRadius: "12px", cursor: "crosshair", touchAction: "none" }}
      />
      <p className="text-gray-400 text-xs">Click to shoot • Match 3+ same color</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ZumaTumbleGame() {
  return (
    <CalculatorVerticalLayout
      title="Zuma Tumble - Marble Chain Shooter Game"
      description="Shoot colored marbles to match 3 or more in the chain before it reaches the hole. Free online Zuma-style marble shooter game."
      canonical="https://www.smartkitnow.com/games/zuma-tumble"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Zuma Tumble</h2>
          <p>Zuma Tumble is a marble chain shooter game inspired by the classic Zuma. A chain of colored marbles winds along a curved path toward a center hole — your job is to stop it!</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse Move:</strong> Aim the shooter in the center.</li>
            <li><strong>Click / Tap:</strong> Fire a marble toward the cursor.</li>
          </ul>
          <h3>Rules</h3>
          <ul>
            <li>Match 3 or more consecutive marbles of the same color to pop them.</li>
            <li>If the chain reaches the center hole, you lose a life.</li>
            <li>You have 3 lives. Clear all marbles to win!</li>
          </ul>
          <h3>Tips</h3>
          <ul>
            <li>Plan combos — popping one group can create chain reactions.</li>
            <li>Watch the "Next" preview to plan your shots ahead.</li>
            <li>The chain speeds up as your score increases!</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
