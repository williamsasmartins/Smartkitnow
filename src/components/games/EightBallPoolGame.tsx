import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 560;
const H = 320;
const BALL_R = 10;
const FRICTION = 0.985;
const POCKET_R = 16;
const MAX_POWER = 200;

interface BallObj {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pocketed: boolean;
  color: string;
  stripe: boolean;
  label: string;
}

const BALL_COLORS = [
  "#fff",
  "#f5c518", "#1a50b5", "#c0392b", "#8e44ad",
  "#e67e22", "#27ae60", "#922b21", "#1a1a1a",
  "#f5c518", "#1a50b5", "#c0392b", "#8e44ad",
  "#e67e22", "#27ae60", "#922b21",
];

const POCKET_POSITIONS = [
  { x: POCKET_R, y: POCKET_R },
  { x: W / 2, y: POCKET_R - 4 },
  { x: W - POCKET_R, y: POCKET_R },
  { x: POCKET_R, y: H - POCKET_R },
  { x: W / 2, y: H - POCKET_R + 4 },
  { x: W - POCKET_R, y: H - POCKET_R },
];

function buildRack(): BallObj[] {
  const balls: BallObj[] = [];
  const startX = W * 0.65;
  const startY = H / 2;
  const positions = [
    [0, 0], [-1, 1], [1, 1],
    [-2, 2], [0, 2], [2, 2],
    [-3, 3], [-1, 3], [1, 3], [3, 3],
    [-4, 4], [-2, 4], [0, 4], [2, 4], [4, 4],
  ];
  const racked8 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  positions.forEach(([col, row], i) => {
    const id = racked8[i];
    balls.push({
      id,
      x: startX + col * (BALL_R + 0.5) + row * (BALL_R + 0.5),
      y: startY + row * (BALL_R * 1.74),
      vx: 0,
      vy: 0,
      pocketed: false,
      color: BALL_COLORS[id] ?? "#aaa",
      stripe: id > 8,
      label: String(id),
    });
  });
  return balls;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<BallObj[]>([]);
  const cueRef = useRef<BallObj>({ id: 0, x: W * 0.25, y: H / 2, vx: 0, vy: 0, pocketed: false, color: "#fff", stripe: false, label: "0" });
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [message, setMessage] = useState("Your turn. Drag from cue ball to shoot.");
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem("hs_8-ball-pool-lite") || "0"));
  const winsRef = useRef(parseInt(localStorage.getItem("hs_8-ball-pool-lite") || "0"));
  const turnRef = useRef<"player" | "ai">("player");
  const movingRef = useRef(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoresRef = useRef({ player: 0, ai: 0 });
  const gameOverRef = useRef(false);

  const resetGame = useCallback(() => {
    ballsRef.current = buildRack();
    cueRef.current = { id: 0, x: W * 0.25, y: H / 2, vx: 0, vy: 0, pocketed: false, color: "#fff", stripe: false, label: "0" };
    movingRef.current = false;
    turnRef.current = "player";
    setTurn("player");
    setMessage("Your turn. Drag from cue ball to shoot.");
    setScores({ player: 0, ai: 0 });
    scoresRef.current = { player: 0, ai: 0 };
    setGameOver(false);
    gameOverRef.current = false;
    setWinner("");
    dragStartRef.current = null;
  }, []);

  useEffect(() => { ballsRef.current = buildRack(); }, []);

  const drawBall = useCallback((ctx: CanvasRenderingContext2D, b: BallObj) => {
    if (b.pocketed) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = b.stripe ? "#fff" : b.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (b.stripe) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x - BALL_R, b.y - BALL_R * 0.45, BALL_R * 2, BALL_R * 0.9);
      ctx.restore();
    }

    if (b.id > 0) {
      ctx.fillStyle = b.stripe ? "#000" : (b.id === 8 ? "#fff" : "#000");
      ctx.font = `bold ${BALL_R * 0.9}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x, b.y);
    }

    const grad = ctx.createRadialGradient(b.x - BALL_R * 0.3, b.y - BALL_R * 0.3, 0, b.x, b.y, BALL_R);
    grad.addColorStop(0, "rgba(255,255,255,0.4)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a6b2a";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(POCKET_R, POCKET_R, W - POCKET_R * 2, H - POCKET_R * 2);
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 30, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W * 0.25, POCKET_R);
    ctx.lineTo(W * 0.25, H - POCKET_R);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (const pocket of POCKET_POSITIONS) {
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, POCKET_R, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (const b of ballsRef.current) drawBall(ctx, b);
    if (!cueRef.current.pocketed) drawBall(ctx, cueRef.current);

    const cue = cueRef.current;
    if (!movingRef.current && !cue.pocketed && turnRef.current === "player") {
      const mouse = mouseRef.current;
      const dx = cue.x - mouse.x;
      const dy = cue.y - mouse.y;
      const len = Math.hypot(dx, dy);
      if (len > 5) {
        const ux = dx / len;
        const uy = dy / len;
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cue.x + ux * BALL_R * 1.5, cue.y + uy * BALL_R * 1.5);
        ctx.lineTo(cue.x + ux * Math.min(len + 20, 100), cue.y + uy * Math.min(len + 20, 100));
        ctx.stroke();
        ctx.strokeStyle = "rgba(139,90,43,0.9)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cue.x + ux * BALL_R * 1.5, cue.y + uy * BALL_R * 1.5);
        ctx.lineTo(cue.x + ux * Math.min(len + 60, 120), cue.y + uy * Math.min(len + 60, 120));
        ctx.stroke();
        ctx.restore();

        if (dragStartRef.current) {
          const power = Math.min(len, MAX_POWER);
          ctx.fillStyle = "#f0f";
          ctx.fillRect(10, H - 20, (power / MAX_POWER) * 100, 8);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.strokeRect(10, H - 20, 100, 8);
          ctx.fillStyle = "#fff";
          ctx.font = "10px monospace";
          ctx.textAlign = "left";
          ctx.fillText(`Power: ${Math.floor((power / MAX_POWER) * 100)}%`, 115, H - 13);
        }
      }
    }
  }, [drawBall]);

  const ballBallCollide = useCallback((a: BallObj, b: BallObj) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < BALL_R * 2 && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = BALL_R * 2 - dist;
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;
      const dv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (dv > 0) {
        a.vx -= dv * nx;
        a.vy -= dv * ny;
        b.vx += dv * nx;
        b.vy += dv * ny;
      }
    }
  }, []);

  const updatePhysics = useCallback(() => {
    const allBalls = [cueRef.current, ...ballsRef.current].filter(b => !b.pocketed);
    let anyMoving = false;

    for (const b of allBalls) {
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= FRICTION;
      b.vy *= FRICTION;
      if (Math.abs(b.vx) < 0.02) b.vx = 0;
      if (Math.abs(b.vy) < 0.02) b.vy = 0;
      if (Math.abs(b.vx) > 0 || Math.abs(b.vy) > 0) anyMoving = true;

      const lim = { left: POCKET_R + BALL_R, right: W - POCKET_R - BALL_R, top: POCKET_R + BALL_R, bottom: H - POCKET_R - BALL_R };
      if (b.x < lim.left) { b.x = lim.left; b.vx = Math.abs(b.vx) * 0.85; }
      if (b.x > lim.right) { b.x = lim.right; b.vx = -Math.abs(b.vx) * 0.85; }
      if (b.y < lim.top) { b.y = lim.top; b.vy = Math.abs(b.vy) * 0.85; }
      if (b.y > lim.bottom) { b.y = lim.bottom; b.vy = -Math.abs(b.vy) * 0.85; }

      for (const pocket of POCKET_POSITIONS) {
        if (Math.hypot(b.x - pocket.x, b.y - pocket.y) < POCKET_R) {
          b.pocketed = true;
          b.vx = 0;
          b.vy = 0;
          if (b.id === 0) {
            setTimeout(() => {
              cueRef.current.pocketed = false;
              cueRef.current.x = W * 0.25;
              cueRef.current.y = H / 2;
              cueRef.current.vx = 0;
              cueRef.current.vy = 0;
            }, 800);
          } else if (!gameOverRef.current) {
            const pocketing = turnRef.current;
            if (b.id === 8) {
              const solids = ballsRef.current.filter(x => !x.stripe && x.id !== 8);
              const stripes = ballsRef.current.filter(x => x.stripe);
              const playerSolids = scoresRef.current.player > 0;
              const allDown = playerSolids
                ? solids.every(x => x.pocketed)
                : stripes.every(x => x.pocketed);
              if (allDown) {
                gameOverRef.current = true;
                setGameOver(true);
                if (pocketing === "player") {
                  winsRef.current++;
                  try { localStorage.setItem("hs_8-ball-pool-lite", String(winsRef.current)); } catch {}
                  setWins(winsRef.current);
                  setWinner("You Win!");
                } else {
                  setWinner("AI Wins!");
                }
              } else {
                gameOverRef.current = true;
                setGameOver(true);
                if (pocketing === "ai") {
                  winsRef.current++;
                  try { localStorage.setItem("hs_8-ball-pool-lite", String(winsRef.current)); } catch {}
                  setWins(winsRef.current);
                  setWinner("You Win! (AI 8-ball early)");
                } else {
                  setWinner("AI Wins! (8-ball early)");
                }
              }
            } else {
              const newScores = { ...scoresRef.current };
              if (pocketing === "player") newScores.player += 1;
              else newScores.ai += 1;
              scoresRef.current = newScores;
              setScores({ ...newScores });
            }
          }
        }
      }
    }

    for (let i = 0; i < allBalls.length; i++) {
      for (let j = i + 1; j < allBalls.length; j++) {
        ballBallCollide(allBalls[i], allBalls[j]);
      }
    }

    movingRef.current = anyMoving;
    if (!anyMoving && !gameOverRef.current) {
      if (turnRef.current === "ai") {
        turnRef.current = "player";
        setTurn("player");
        setMessage("Your turn.");
      }
    }
  }, [ballBallCollide]);

  const aiShoot = useCallback(() => {
    if (gameOverRef.current) return;
    const cue = cueRef.current;
    const targets = ballsRef.current.filter(b => !b.pocketed && b.id !== 8);
    if (targets.length === 0) return;
    const target = targets.sort((a, b) => Math.hypot(a.x - cue.x, a.y - cue.y) - Math.hypot(b.x - cue.x, b.y - cue.y))[0];
    const dx = target.x - cue.x;
    const dy = target.y - cue.y;
    const len = Math.hypot(dx, dy);
    const power = Math.min(len * 0.06, 8) + (Math.random() - 0.5) * 1.5;
    cue.vx = (dx / len) * power;
    cue.vy = (dy / len) * power;
    movingRef.current = true;
    setMessage("AI is shooting...");
  }, []);

  useEffect(() => {
    if (turn === "ai" && !movingRef.current && !gameOver) {
      aiTimerRef.current = setTimeout(aiShoot, 1200);
    }
    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [turn, gameOver, aiShoot]);

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

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    mouseRef.current = getPos(e);
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (movingRef.current || turnRef.current !== "player" || gameOverRef.current) return;
    dragStartRef.current = getPos(e);
    mouseRef.current = dragStartRef.current;
  };

  const handleUp = () => {
    if (!dragStartRef.current || movingRef.current || turnRef.current !== "player" || gameOverRef.current) return;
    const cue = cueRef.current;
    const mouse = mouseRef.current;
    const dx = cue.x - mouse.x;
    const dy = cue.y - mouse.y;
    const len = Math.hypot(dx, dy);
    if (len > 8) {
      const power = Math.min(len, MAX_POWER);
      cue.vx = (dx / len) * (power / MAX_POWER) * 14;
      cue.vy = (dy / len) * (power / MAX_POWER) * 14;
      movingRef.current = true;
      turnRef.current = "ai";
      setTurn("ai");
      setMessage("AI's turn...");
    }
    dragStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex gap-4 text-sm font-mono bg-gray-900 text-white px-4 py-1 rounded-full">
        <span>You: <span className="text-yellow-400 font-bold">{scores.player}</span></span>
        <span className={`text-xs ${turn === "player" ? "text-green-400" : "text-red-400"}`}>
          {turn === "player" ? "YOUR TURN" : "AI TURN"}
        </span>
        <span>AI: <span className="text-red-400 font-bold">{scores.ai}</span></span>
        <span>Wins: <span className="text-purple-400 font-bold">{wins}</span></span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="border-4 border-yellow-900 rounded cursor-crosshair touch-none"
          style={{ maxWidth: "100%", aspectRatio: `${W}/${H}` }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
          onTouchStart={handleDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleUp}
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
            <div className="text-yellow-400 text-2xl font-bold">{winner}</div>
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-green-700 text-white rounded font-bold hover:bg-green-600">
              New Game
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-300 text-center">{message}</p>
      <p className="text-xs text-gray-500 text-center">Drag from the area near the cue ball (top-left) away from it, then release.</p>
    </div>
  );
}

export default function EightBallPoolGame() {
  return (
    <CalculatorVerticalLayout
      title="8-Ball Pool Lite - Billiards Game"
      description="Play 8-ball pool against an AI opponent. Drag the cue, release to shoot. Pocket your group of balls, then the 8-ball to win!"
      canonical="https://www.smartkitnow.com/games/8-ball-pool-lite"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play 8-Ball Pool Lite</h2>
          <p>
            Classic 8-ball billiards on a digital table. Take turns with the AI. Move your mouse near the cue ball,
            then drag away to set the shot direction and power. Release to strike.
          </p>
          <h3>Rules</h3>
          <ul>
            <li>Balls 1-7 are solids, balls 9-15 are stripes.</li>
            <li>The first ball pocketed determines your group.</li>
            <li>Pocket all your group, then sink the 8-ball to win.</li>
            <li>Pocket the 8-ball before clearing your group means you lose.</li>
            <li>Sinking the cue ball (scratch) respots it at the center-left.</li>
          </ul>
          <h3>Physics</h3>
          <p>
            Balls use elastic collision physics with velocity decomposition. Friction gradually slows all balls.
            Wall bounces preserve most kinetic energy.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
