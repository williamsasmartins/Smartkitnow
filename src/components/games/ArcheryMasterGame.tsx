import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 400;
const H = 400;
const TARGET_CX = W / 2;
const TARGET_CY = H / 2;

const RING_SCORES = [10, 9, 8, 7, 6, 0];
const RING_RADII = [18, 36, 54, 72, 90, 120];
const RING_COLORS = ["#f5c518", "#ff3333", "#3399ff", "#333", "#fff", "transparent"];

const DISTANCE_LEVELS = [
  { label: "10m", wobble: 1.2, noise: 0.5 },
  { label: "20m", wobble: 2.0, noise: 1.0 },
  { label: "30m", wobble: 3.0, noise: 1.8 },
  { label: "50m", wobble: 4.5, noise: 2.8 },
];

interface Arrow {
  x: number;
  y: number;
  score: number;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const crosshairRef = useRef({ x: TARGET_CX, y: TARGET_CY });
  const timeRef = useRef(0);
  const holdRef = useRef(0);
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [arrowsLeft, setArrowsLeft] = useState(10);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("hs_archery-master") || "0"));
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isSteadying, setIsSteadying] = useState(false);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDir, setWindDir] = useState(1);
  const [lastShot, setLastShot] = useState<number | null>(null);

  const arrowsRef = useRef<Arrow[]>([]);
  const arrowsLeftRef = useRef(10);
  const totalScoreRef = useRef(0);
  const levelRef = useRef(0);
  const gameOverRef = useRef(false);
  const windSpeedRef = useRef(0);
  const windDirRef = useRef(1);

  const initWind = useCallback(() => {
    const speed = Math.random() * 3;
    const dir = Math.random() > 0.5 ? 1 : -1;
    windSpeedRef.current = speed;
    windDirRef.current = dir;
    setWindSpeed(speed);
    setWindDir(dir);
  }, []);

  useEffect(() => { initWind(); }, [initWind]);

  const getWobble = useCallback(() => {
    const lvl = DISTANCE_LEVELS[levelRef.current];
    const steady = isHoldingRef.current ? 0.3 : 1.0;
    return lvl.wobble * steady;
  }, []);

  const getNoise = useCallback(() => {
    const lvl = DISTANCE_LEVELS[levelRef.current];
    const steady = isHoldingRef.current ? 0.3 : 1.0;
    return lvl.noise * steady;
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#87CEEB");
    bgGrad.addColorStop(0.6, "#90EE90");
    bgGrad.addColorStop(1, "#556B2F");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    for (let i = RING_RADII.length - 1; i >= 0; i--) {
      if (RING_COLORS[i] === "transparent") continue;
      ctx.beginPath();
      ctx.arc(TARGET_CX, TARGET_CY, RING_RADII[i], 0, Math.PI * 2);
      ctx.fillStyle = RING_COLORS[i];
      ctx.fill();
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    for (const arrow of arrowsRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(arrow.x, arrow.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#f00";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(arrow.score), arrow.x + 8, arrow.y - 6);
      ctx.restore();
    }

    if (!gameOverRef.current) {
      const ch = crosshairRef.current;
      const alpha = isHoldingRef.current ? 0.95 : 0.75;
      ctx.save();
      ctx.strokeStyle = `rgba(255,50,50,${alpha})`;
      ctx.lineWidth = isHoldingRef.current ? 1.5 : 2;
      const sz = isHoldingRef.current ? 12 : 18;
      ctx.beginPath();
      ctx.moveTo(ch.x - sz, ch.y);
      ctx.lineTo(ch.x + sz, ch.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ch.x, ch.y - sz);
      ctx.lineTo(ch.x, ch.y + sz);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ch.x, ch.y, sz * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,50,50,${alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      if (isHoldingRef.current) {
        const progress = Math.min((Date.now() - holdStartRef.current) / 3000, 1);
        ctx.save();
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, sz + 6, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    const wind = windSpeedRef.current;
    const wDir = windDirRef.current;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(10, 10, 120, 34);
    ctx.fillStyle = "#fff";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Wind: ${wind.toFixed(1)} m/s ${wDir > 0 ? "→" : "←"}`, 16, 24);
    const barLen = (wind / 3) * 80;
    ctx.fillStyle = wind > 2 ? "#f55" : wind > 1 ? "#fa0" : "#0f5";
    ctx.fillRect(16, 30, barLen, 6);
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(W - 110, 10, 100, 34);
    ctx.fillStyle = "#fff";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(DISTANCE_LEVELS[levelRef.current].label, W - 14, 24);
    ctx.fillText(`Arrows: ${arrowsLeftRef.current}`, W - 14, 38);
    ctx.textAlign = "left";

    if (isHoldingRef.current) {
      ctx.save();
      ctx.fillStyle = "rgba(0,200,0,0.85)";
      ctx.fillRect(W / 2 - 50, H - 28, 100, 20);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Steadying breath...", W / 2, H - 14);
      ctx.restore();
    }
  }, []);

  const updateCrosshair = useCallback(() => {
    const t = (timeRef.current += 0.04);
    const wobble = getWobble();
    const noise = getNoise();
    const wind = windSpeedRef.current * windDirRef.current;
    crosshairRef.current = {
      x: TARGET_CX + Math.sin(t * 0.7) * wobble * 25 + (Math.random() - 0.5) * noise * 12 + wind * 4,
      y: TARGET_CY + Math.cos(t * 0.5) * wobble * 20 + (Math.random() - 0.5) * noise * 10,
    };
  }, [getWobble, getNoise]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      updateCrosshair();
      drawScene();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [updateCrosshair, drawScene]);

  const shoot = useCallback(() => {
    if (gameOverRef.current || arrowsLeftRef.current <= 0) return;
    const ch = crosshairRef.current;
    const dx = ch.x - TARGET_CX;
    const dy = ch.y - TARGET_CY;
    const dist = Math.hypot(dx, dy);
    let pts = 0;
    for (let i = 0; i < RING_RADII.length; i++) {
      if (dist <= RING_RADII[i]) { pts = RING_SCORES[i]; break; }
    }
    const newArrow = { x: ch.x, y: ch.y, score: pts };
    arrowsRef.current = [...arrowsRef.current, newArrow];
    setArrows([...arrowsRef.current]);
    const remaining = arrowsLeftRef.current - 1;
    arrowsLeftRef.current = remaining;
    setArrowsLeft(remaining);
    const newTotal = totalScoreRef.current + pts;
    totalScoreRef.current = newTotal;
    setTotalScore(newTotal);
    setLastShot(pts);
    initWind();

    if (remaining <= 0) {
      gameOverRef.current = true;
      setGameOver(true);
      setHighScore(hs => {
        const ns = totalScoreRef.current > hs ? totalScoreRef.current : hs;
        if (totalScoreRef.current > hs) try { localStorage.setItem("hs_archery-master", String(ns)); } catch {}
        return ns;
      });
    }
  }, [initWind]);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isHoldingRef.current = true;
    holdStartRef.current = Date.now();
    holdRef.current = 0;
    setIsSteadying(true);
  }, []);

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isHoldingRef.current = false;
    setIsSteadying(false);
    shoot();
  }, [shoot]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!isHoldingRef.current) {
        isHoldingRef.current = true;
        holdStartRef.current = Date.now();
        setIsSteadying(true);
      }
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      isHoldingRef.current = false;
      setIsSteadying(false);
      shoot();
    }
  }, [shoot]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const resetGame = useCallback(() => {
    arrowsRef.current = [];
    arrowsLeftRef.current = 10;
    totalScoreRef.current = 0;
    setArrows([]);
    setArrowsLeft(10);
    setTotalScore(0);
    setLastShot(null);
    setGameOver(false);
    gameOverRef.current = false;
    initWind();
  }, [initWind]);

  const changeLevel = (l: number) => {
    levelRef.current = l;
    setLevel(l);
    resetGame();
  };

  const maxScore = 10 * 10;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex gap-3 flex-wrap justify-center text-sm font-mono bg-gray-900 text-white px-3 py-1 rounded-full">
        <span>Score: <span className="text-yellow-400 font-bold">{totalScore}</span>/<span className="text-gray-400">{maxScore}</span></span>
        <span>Best: <span className="text-purple-400 font-bold">{highScore}</span></span>
        <span>Arrows: <span className="text-green-400 font-bold">{arrowsLeft}</span></span>
        {lastShot !== null && <span>Last: <span className={`font-bold ${lastShot === 10 ? "text-yellow-400" : lastShot >= 7 ? "text-green-400" : lastShot >= 4 ? "text-blue-400" : "text-gray-400"}`}>{lastShot === 0 ? "MISS" : `+${lastShot}`}</span></span>}
      </div>

      <div className="flex gap-1 mb-1">
        {DISTANCE_LEVELS.map((d, i) => (
          <button
            key={i}
            onClick={() => changeLevel(i)}
            className={`px-2 py-0.5 rounded text-xs font-bold border ${level === i ? "bg-blue-600 text-white border-blue-400" : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="border-2 border-gray-600 rounded cursor-crosshair touch-none"
          style={{ maxWidth: "100%", aspectRatio: "1/1" }}
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded">
            <div className="text-yellow-400 text-2xl font-bold">Round Complete!</div>
            <div className="text-white text-xl mt-1">{totalScore} / {maxScore} pts</div>
            <div className="text-gray-300 text-sm mt-1">
              {totalScore >= 90 ? "Legendary Archer!" : totalScore >= 70 ? "Expert Archer!" : totalScore >= 50 ? "Good Archer!" : "Keep Practicing!"}
            </div>
            <button onClick={resetGame} className="mt-3 px-4 py-2 bg-green-700 text-white rounded font-bold hover:bg-green-600">
              Shoot Again
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {isSteadying ? "Holding breath - steadying aim..." : "Click/tap and hold to steady breath (reduces wobble). Release to shoot!"}
      </p>
      <p className="text-xs text-gray-500 text-center">Or: Hold Space bar to steady, release to fire.</p>
    </div>
  );
}

export default function ArcheryMasterGame() {
  return (
    <CalculatorVerticalLayout
      title="Archery Master - Precision Shooting Game"
      description="Master the wobbling crosshair! Hold your breath to steady your aim, then release to fire. Score 10 bulls-eyes across 4 distances!"
      canonical="https://www.smartkitnow.com/games/archery-master"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Archery Master</h2>
          <p>
            Your crosshair wobbles due to breathing and wind. You have 10 arrows per round. Click (or hold Space)
            to steady your breath — this dramatically reduces wobble. Release to shoot!
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Click/Tap and Hold:</strong> Steady your breath (reduces wobble by 70%)</li>
            <li><strong>Release:</strong> Fire the arrow at the crosshair position</li>
            <li><strong>Space Bar Hold/Release:</strong> Same steady + shoot mechanic</li>
          </ul>
          <h3>Scoring</h3>
          <ul>
            <li><strong>Gold (center):</strong> 10 points</li>
            <li><strong>Red:</strong> 9 points</li>
            <li><strong>Blue:</strong> 8 points</li>
            <li><strong>Black:</strong> 7 points</li>
            <li><strong>White:</strong> 6 points</li>
            <li><strong>Outside all rings:</strong> Miss (0 points)</li>
          </ul>
          <h3>Distance Levels</h3>
          <p>
            Choose from 10m, 20m, 30m, and 50m distances. Greater distances increase crosshair wobble
            and random noise, making precision shots much harder. Wind also drifts the crosshair sideways.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
