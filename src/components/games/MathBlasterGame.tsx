import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Op = "+" | "-" | "×" | "÷";

interface Equation {
  text: string;
  answer: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  value: number;
  correct: boolean;
  color: string;
  radius: number;
  speed: number;
  popping: boolean;
  popProgress: number;
  opacity: number;
}

interface GameState {
  status: "idle" | "playing" | "gameover";
  score: number;
  lives: number;
  timeLeft: number;
  equation: Equation | null;
  bubbles: Bubble[];
  highScore: number;
  level: number;
  combo: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CANVAS_W = 480;
const CANVAS_H = 420;
const BUBBLE_RADIUS = 34;
const BUBBLE_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];
const TOTAL_TIME = 60;
const MAX_LIVES = 3;

let bubbleIdCounter = 0;

function nextId() { return ++bubbleIdCounter; }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation(level: number): Equation {
  const ops: Op[] = ["+", "-", "×", "÷"];
  const opIndex = randomInt(0, Math.min(level - 1, 3));
  const op = ops[opIndex];
  let a: number, b: number, answer: number;

  const maxVal = Math.min(5 + level * 3, 20);

  switch (op) {
    case "+":
      a = randomInt(1, maxVal);
      b = randomInt(1, maxVal);
      answer = a + b;
      break;
    case "-":
      a = randomInt(2, maxVal);
      b = randomInt(1, a);
      answer = a - b;
      break;
    case "×":
      a = randomInt(1, Math.min(maxVal, 12));
      b = randomInt(1, Math.min(maxVal, 12));
      answer = a * b;
      break;
    case "÷":
      b = randomInt(1, Math.min(maxVal, 10));
      answer = randomInt(1, Math.min(maxVal, 10));
      a = b * answer;
      break;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrongs = new Set<number>();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    const delta = randomInt(1, 10) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = correct + delta;
    if (candidate !== correct && candidate >= 0) wrongs.add(candidate);
    attempts++;
  }
  // Fallback
  let fallback = correct + 1;
  while (wrongs.size < count) {
    if (fallback !== correct) wrongs.add(fallback);
    fallback++;
  }
  return Array.from(wrongs).slice(0, count);
}

function spawnBubbles(eq: Equation, level: number): Bubble[] {
  const wrongAnswers = generateWrongAnswers(eq.answer, 3);
  const allValues = [eq.answer, ...wrongAnswers];
  // Shuffle
  for (let i = allValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
  }

  const positions = [80, 180, 300, 400];
  const baseSpeed = 0.4 + level * 0.15;

  return allValues.map((val, i) => ({
    id: nextId(),
    x: positions[i],
    y: -(BUBBLE_RADIUS + i * 30),
    value: val,
    correct: val === eq.answer,
    color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
    radius: BUBBLE_RADIUS,
    speed: baseSpeed + Math.random() * 0.2,
    popping: false,
    popProgress: 0,
    opacity: 1,
  }));
}

// ---------------------------------------------------------------------------
// Canvas renderer
// ---------------------------------------------------------------------------
function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
  const scale = b.popping ? 1 + b.popProgress * 0.6 : 1;
  const alpha = b.popping ? Math.max(0, 1 - b.popProgress) : b.opacity;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(b.x, b.y);
  ctx.scale(scale, scale);

  // Shadow
  ctx.shadowColor = b.color;
  ctx.shadowBlur = 12;

  // Bubble circle
  ctx.beginPath();
  ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
  ctx.fillStyle = b.color;
  ctx.fill();

  // Shine highlight
  ctx.beginPath();
  ctx.arc(-b.radius * 0.3, -b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();

  ctx.shadowBlur = 0;

  // Number text
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${b.radius > 30 ? 20 : 16}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(b.value), 0, 0);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Game Widget
// ---------------------------------------------------------------------------
function MathBlasterWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>({
    status: "idle",
    score: 0,
    lives: MAX_LIVES,
    timeLeft: TOTAL_TIME,
    equation: null,
    bubbles: [],
    highScore: (() => { try { return parseInt(localStorage.getItem("hs_math-blaster") ?? "0", 10) || 0; } catch { return 0; } })(),
    level: 1,
    combo: 0,
  });

  const [displayState, setDisplayState] = useState<{
    status: "idle" | "playing" | "gameover";
    score: number;
    lives: number;
    timeLeft: number;
    equation: string;
    highScore: number;
    level: number;
    combo: number;
  }>({
    status: "idle",
    score: 0,
    lives: MAX_LIVES,
    timeLeft: TOTAL_TIME,
    equation: "",
    highScore: stateRef.current.highScore,
    level: 1,
    combo: 0,
  });

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const timerAccRef = useRef<number>(0);
  const flashRef = useRef<{ text: string; x: number; y: number; ttl: number; color: string }[]>([]);

  const syncDisplay = useCallback(() => {
    const s = stateRef.current;
    setDisplayState({
      status: s.status,
      score: s.score,
      lives: s.lives,
      timeLeft: s.timeLeft,
      equation: s.equation?.text ?? "",
      highScore: s.highScore,
      level: s.level,
      combo: s.combo,
    });
  }, []);

  const loadNewEquation = useCallback(() => {
    const s = stateRef.current;
    const eq = generateEquation(s.level);
    s.equation = eq;
    s.bubbles = spawnBubbles(eq, s.level);
    syncDisplay();
  }, [syncDisplay]);

  const handleBubbleClick = useCallback((bx: number, by: number) => {
    const s = stateRef.current;
    if (s.status !== "playing") return;

    for (const b of s.bubbles) {
      if (b.popping) continue;
      const dist = Math.sqrt((bx - b.x) ** 2 + (by - b.y) ** 2);
      if (dist <= b.radius) {
        if (b.correct) {
          b.popping = true;
          s.combo += 1;
          const pts = 10 + (s.combo > 1 ? (s.combo - 1) * 5 : 0);
          s.score += pts;
          flashRef.current.push({ text: `+${pts}`, x: b.x, y: b.y, ttl: 60, color: "#22c55e" });
        } else {
          s.lives -= 1;
          s.combo = 0;
          b.popping = true;
          flashRef.current.push({ text: "-1 ♥", x: b.x, y: b.y, ttl: 60, color: "#ef4444" });
          if (s.lives <= 0) {
            s.status = "gameover";
            const newHS = Math.max(s.score, s.highScore);
            s.highScore = newHS;
            try { localStorage.setItem("hs_math-blaster", String(newHS)); } catch { /* noop */ }
            cancelAnimationFrame(rafRef.current);
            syncDisplay();
            return;
          }
        }
        syncDisplay();
        break;
      }
    }
  }, [syncDisplay]);

  const gameLoop = useCallback((timestamp: number) => {
    const s = stateRef.current;
    if (s.status !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dt = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
    lastTimeRef.current = timestamp;

    // Timer
    timerAccRef.current += dt;
    if (timerAccRef.current >= 1000) {
      timerAccRef.current -= 1000;
      s.timeLeft = Math.max(0, s.timeLeft - 1);
      if (s.timeLeft <= 0) {
        s.status = "gameover";
        const newHS = Math.max(s.score, s.highScore);
        s.highScore = newHS;
        try { localStorage.setItem("hs_math-blaster", String(newHS)); } catch { /* noop */ }
        syncDisplay();
        return;
      }
      // Increase level every 15 seconds
      s.level = Math.min(5, Math.floor((TOTAL_TIME - s.timeLeft) / 12) + 1);
      syncDisplay();
    }

    // Move bubbles
    let correctPopped = false;
    let allPopped = true;
    for (const b of s.bubbles) {
      if (b.popping) {
        b.popProgress = Math.min(1, b.popProgress + 0.07);
        if (b.correct && b.popProgress >= 1) correctPopped = true;
      } else {
        b.y += b.speed * (dt / 16);
        allPopped = false;
        // Bubble fell off screen
        if (b.y - b.radius > CANVAS_H) {
          if (b.correct) {
            s.lives -= 1;
            s.combo = 0;
            flashRef.current.push({ text: "Miss!", x: b.x, y: CANVAS_H - 30, ttl: 60, color: "#f59e0b" });
          }
          b.popping = true;
          b.popProgress = 1;
          if (s.lives <= 0) {
            s.status = "gameover";
            const newHS = Math.max(s.score, s.highScore);
            s.highScore = newHS;
            try { localStorage.setItem("hs_math-blaster", String(newHS)); } catch { /* noop */ }
            syncDisplay();
            return;
          }
          syncDisplay();
        }
      }
    }

    // All done for this round
    const allResolved = s.bubbles.every((b) => b.popping && b.popProgress >= 1);
    if (allResolved && s.status === "playing") {
      loadNewEquation();
    }

    // Draw
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e293b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid lines (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < CANVAS_W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, CANVAS_H); ctx.stroke();
    }
    for (let gy = 0; gy < CANVAS_H; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CANVAS_W, gy); ctx.stroke();
    }

    // Draw bubbles
    for (const b of s.bubbles) {
      if (b.popProgress < 1 || !b.popping) {
        drawBubble(ctx, b);
      }
    }

    // Flash texts
    flashRef.current = flashRef.current.filter((f) => f.ttl > 0);
    for (const f of flashRef.current) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, f.ttl / 30);
      ctx.fillStyle = f.color;
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(f.text, f.x, f.y - (60 - f.ttl) * 0.8);
      ctx.restore();
      f.ttl--;
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [loadNewEquation, syncDisplay]);

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    timerAccRef.current = 0;
    flashRef.current = [];
    bubbleIdCounter = 0;
    const s = stateRef.current;
    s.status = "playing";
    s.score = 0;
    s.lives = MAX_LIVES;
    s.timeLeft = TOTAL_TIME;
    s.level = 1;
    s.combo = 0;
    loadNewEquation();
    syncDisplay();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop, loadNewEquation, syncDisplay]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    handleBubbleClick(x, y);
  }, [handleBubbleClick]);

  const handleCanvasTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    handleBubbleClick(x, y);
  }, [handleBubbleClick]);

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => i < displayState.lives);

  return (
    <div className="flex flex-col items-center gap-4 p-3 select-none">
      {/* HUD */}
      <div className="flex justify-between items-center w-full max-w-[480px] bg-slate-900 rounded-xl px-4 py-3 text-white shadow-lg">
        <div className="text-center">
          <div className="text-xs opacity-60 uppercase font-bold">Score</div>
          <div className="text-xl font-extrabold text-yellow-400">{displayState.score}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs opacity-60 uppercase font-bold">Lives</div>
          <div className="flex gap-1">
            {hearts.map((alive, i) => (
              <span key={i} className={`text-lg ${alive ? "text-red-500" : "text-slate-600"}`}>♥</span>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-60 uppercase font-bold">Time</div>
          <div className={`text-xl font-extrabold ${displayState.timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
            {displayState.timeLeft}s
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-60 uppercase font-bold">Best</div>
          <div className="text-xl font-extrabold text-purple-400">{displayState.highScore}</div>
        </div>
      </div>

      {/* Equation banner */}
      {displayState.status === "playing" && displayState.equation && (
        <div className="bg-indigo-600 text-white rounded-xl px-8 py-3 text-2xl font-extrabold tracking-wide shadow-lg shadow-indigo-500/30 w-full max-w-[480px] text-center">
          {displayState.equation}
          {displayState.combo > 1 && (
            <span className="ml-3 text-yellow-300 text-base font-bold">x{displayState.combo} combo!</span>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasTouch}
          className="w-full rounded-2xl shadow-2xl cursor-pointer"
          style={{ touchAction: "none" }}
        />

        {/* Overlay screens */}
        {displayState.status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl gap-4">
            <div className="text-4xl font-extrabold text-white">Math Blaster</div>
            <div className="text-slate-300 text-center px-6">Pop the bubble with the correct answer. 60 seconds. 3 lives.</div>
            {displayState.highScore > 0 && (
              <div className="text-yellow-400 font-bold">Best: {displayState.highScore}</div>
            )}
            <button
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold px-10 py-3 rounded-2xl text-lg transition shadow-lg shadow-indigo-500/40"
            >
              Start Game
            </button>
          </div>
        )}

        {displayState.status === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-2xl gap-4">
            <div className="text-3xl font-extrabold text-white">Game Over!</div>
            <div className="text-5xl font-extrabold text-yellow-400">{displayState.score}</div>
            {displayState.score >= displayState.highScore && displayState.score > 0 && (
              <div className="text-green-400 font-bold text-lg">New Best Score!</div>
            )}
            <div className="text-slate-300">Best: {displayState.highScore}</div>
            <button
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold px-10 py-3 rounded-2xl text-lg transition shadow-lg shadow-indigo-500/40"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400 text-center">Click or tap the bubble with the correct answer</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MathBlasterGame() {
  return (
    <CalculatorVerticalLayout
      title="Math Blaster"
      description="Blast the correct answer bubble in this fast-paced math arcade game. Pop bubbles showing the right answer before they fall — 60 seconds, 3 lives!"
      canonical="https://www.smartkitnow.com/games/math-blaster"
      widget={<MathBlasterWidget />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>How to Play Math Blaster</h2>
          <p>
            Math Blaster is a fast-paced arcade game that sharpens your mental math skills. An equation
            appears at the top of the screen and four colored bubbles descend — only one contains the
            correct answer. Click or tap it before it falls to the bottom!
          </p>
          <h3>Rules</h3>
          <ul>
            <li>Click or tap the bubble that displays the correct answer to the equation shown.</li>
            <li>Clicking a wrong bubble or letting the correct bubble fall costs 1 life.</li>
            <li>You have 3 lives and 60 seconds total.</li>
            <li>Difficulty increases every 12 seconds — bigger numbers and faster bubbles.</li>
          </ul>
          <h3>Scoring &amp; Combos</h3>
          <p>
            Each correct pop is worth 10 points. If you pop correct bubbles consecutively without a mistake,
            you build a combo multiplier — each streak adds +5 bonus points per correct hit.
            A mistake resets your combo to zero.
          </p>
          <h3>Operations Covered</h3>
          <p>
            Math Blaster covers all four arithmetic operations: addition, subtraction, multiplication,
            and division. Division always produces a whole number answer. As difficulty increases,
            the numbers used in each equation grow larger, requiring faster mental calculation.
          </p>
          <h3>Tips for High Scores</h3>
          <ul>
            <li>Focus on eliminating wrong answers quickly using process of elimination.</li>
            <li>Don't guess randomly — a wrong click costs a life.</li>
            <li>Keep your combo alive for bonus points on later questions.</li>
            <li>Watch the bubble speed at higher levels — tap early before they fall.</li>
          </ul>
        </div>
      }
    />
  );
}
