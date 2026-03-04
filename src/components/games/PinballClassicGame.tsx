import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const W = 280;
const H = 520;
const GRAVITY = 0.3;
const BALL_R = 8;
const FLIPPER_W = 68;
const FLIPPER_H = 10;
const FLIPPER_Y = H - 60;
const LEFT_FLIPPER_X = 55;
const RIGHT_FLIPPER_X = W - 55;
const FLIPPER_PIVOT_R = 6;

interface Bumper {
  x: number;
  y: number;
  r: number;
  lit: boolean;
  litTimer: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const BUMPERS: Omit<Bumper, "lit" | "litTimer">[] = [
  { x: 90, y: 130, r: 22, score: 100 },
  { x: 190, y: 100, r: 22, score: 100 },
  { x: 140, y: 190, r: 22, score: 150 },
  { x: 70, y: 230, r: 18, score: 75 },
  { x: 210, y: 230, r: 18, score: 75 },
  { x: 140, y: 290, r: 16, score: 200 },
];

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const ballRef = useRef<Ball>({ x: W - 22, y: H - 80, vx: 0, vy: 0 });
  const launchChargeRef = useRef(0);
  const launchingRef = useRef(false);
  const inPlayRef = useRef(false);
  const leftFlipperAngleRef = useRef(0);
  const rightFlipperAngleRef = useRef(0);
  const bumpersRef = useRef<Bumper[]>(BUMPERS.map(b => ({ ...b, lit: false, litTimer: 0 })));

  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const scoreRef = useRef(0);
  const ballsRef = useRef(3);
  const gameOverRef = useRef(false);
  const gameStartedRef = useRef(false);

  const resetBall = useCallback(() => {
    ballRef.current = { x: W - 22, y: H - 100, vx: 0, vy: 0 };
    inPlayRef.current = false;
    launchChargeRef.current = 0;
    launchingRef.current = false;
  }, []);

  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    ballsRef.current = 3;
    setScore(0);
    setBalls(3);
    setGameOver(false);
    setGameStarted(true);
    gameOverRef.current = false;
    gameStartedRef.current = true;
    bumpersRef.current = BUMPERS.map(b => ({ ...b, lit: false, litTimer: 0 }));
    resetBall();
  }, [resetBall]);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#3a4a8a";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    ctx.strokeStyle = "#4a5a9a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W - 35, H - 30);
    ctx.lineTo(W - 35, 40);
    ctx.stroke();

    ctx.strokeStyle = "#44f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, H - 40);
    ctx.lineTo(20, H * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W - 40, H - 40);
    ctx.lineTo(W - 20, H * 0.4);
    ctx.stroke();

    for (const b of bumpersRef.current) {
      const grad = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r);
      if (b.lit) {
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.4, "#ff8");
        grad.addColorStop(1, "#f80");
      } else {
        grad.addColorStop(0, "#88f");
        grad.addColorStop(1, "#226");
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = b.lit ? "#ff0" : "#55a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = b.lit ? "#000" : "#aaa";
      ctx.font = `bold ${Math.floor(b.r * 0.6)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(b.score), b.x, b.y);
    }

    const lAngle = leftFlipperAngleRef.current;
    const rAngle = rightFlipperAngleRef.current;
    ctx.save();
    ctx.translate(LEFT_FLIPPER_X, FLIPPER_Y);
    ctx.rotate(lAngle);
    const lgFlip = ctx.createLinearGradient(0, -FLIPPER_H / 2, FLIPPER_W, FLIPPER_H / 2);
    lgFlip.addColorStop(0, "#77f");
    lgFlip.addColorStop(1, "#334");
    ctx.fillStyle = lgFlip;
    ctx.beginPath();
    ctx.moveTo(0, -FLIPPER_H / 2);
    ctx.lineTo(FLIPPER_W, -3);
    ctx.lineTo(FLIPPER_W, 3);
    ctx.lineTo(0, FLIPPER_H / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#88f";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, FLIPPER_PIVOT_R, 0, Math.PI * 2);
    ctx.fillStyle = "#aaf";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(RIGHT_FLIPPER_X, FLIPPER_Y);
    ctx.rotate(-rAngle);
    const rgFlip = ctx.createLinearGradient(0, -FLIPPER_H / 2, -FLIPPER_W, FLIPPER_H / 2);
    rgFlip.addColorStop(0, "#77f");
    rgFlip.addColorStop(1, "#334");
    ctx.fillStyle = rgFlip;
    ctx.beginPath();
    ctx.moveTo(0, -FLIPPER_H / 2);
    ctx.lineTo(-FLIPPER_W, -3);
    ctx.lineTo(-FLIPPER_W, 3);
    ctx.lineTo(0, FLIPPER_H / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#88f";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, FLIPPER_PIVOT_R, 0, Math.PI * 2);
    ctx.fillStyle = "#aaf";
    ctx.fill();
    ctx.restore();

    const ball = ballRef.current;
    const ballGrad = ctx.createRadialGradient(ball.x - BALL_R * 0.3, ball.y - BALL_R * 0.3, 0, ball.x, ball.y, BALL_R);
    ballGrad.addColorStop(0, "#fff");
    ballGrad.addColorStop(0.4, "#ddd");
    ballGrad.addColorStop(1, "#888");
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!inPlayRef.current && gameStartedRef.current && !gameOverRef.current) {
      const charge = launchChargeRef.current;
      const barH = (charge / 100) * 60;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(W - 32, H - 80, 12, 65);
      const barColor = charge > 70 ? "#f55" : charge > 40 ? "#fa0" : "#5f5";
      ctx.fillStyle = barColor;
      ctx.fillRect(W - 31, H - 80 + (65 - barH), 10, barH);
      ctx.fillStyle = "#fff";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HOLD", W - 26, H - 85);
      ctx.fillText("SPACE", W - 26, H - 75);
    }

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "left";
    ctx.fillText(String(scoreRef.current).padStart(7, "0"), 10, 22);
    ctx.fillStyle = "#aaf";
    ctx.font = "12px sans-serif";
    for (let i = 0; i < ballsRef.current; i++) {
      ctx.beginPath();
      ctx.arc(15 + i * 18, 38, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#cce";
      ctx.fill();
    }

    if (!gameStartedRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(20, H / 2 - 70, W - 40, 140);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PINBALL CLASSIC", W / 2, H / 2 - 40);
      ctx.fillStyle = "#aaf";
      ctx.font = "12px sans-serif";
      ctx.fillText("Z / Left Arrow: Left Flipper", W / 2, H / 2 - 10);
      ctx.fillText("/ / Right Arrow: Right Flipper", W / 2, H / 2 + 8);
      ctx.fillText("Hold SPACE to charge launch", W / 2, H / 2 + 26);
      ctx.fillStyle = "#ffd700";
      ctx.font = "14px sans-serif";
      ctx.fillText("Click or press any key to start", W / 2, H / 2 + 52);
    }

    if (gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(20, H / 2 - 55, W - 40, 110);
      ctx.fillStyle = "#f55";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 18);
      ctx.fillStyle = "#ffd700";
      ctx.font = "16px monospace";
      ctx.fillText(String(scoreRef.current).padStart(7, "0"), W / 2, H / 2 + 10);
      ctx.fillStyle = "#aaf";
      ctx.font = "12px sans-serif";
      ctx.fillText("Click to play again", W / 2, H / 2 + 38);
    }
  }, []);

  const updateFlippers = useCallback(() => {
    const keys = keysRef.current;
    const leftDown = keys.has("z") || keys.has("Z") || keys.has("ArrowLeft");
    const rightDown = keys.has("/") || keys.has("ArrowRight");
    const targetL = leftDown ? -Math.PI / 5 : Math.PI / 6;
    const targetR = rightDown ? -Math.PI / 5 : Math.PI / 6;
    const speed = 0.25;
    leftFlipperAngleRef.current += (targetL - leftFlipperAngleRef.current) * speed;
    rightFlipperAngleRef.current += (targetR - rightFlipperAngleRef.current) * speed;
  }, []);

  const collideFlipper = useCallback((ball: Ball) => {
    const lAngle = leftFlipperAngleRef.current;
    const rAngle = rightFlipperAngleRef.current;

    const checkFlipper = (px: number, py: number, angle: number, side: 1 | -1) => {
      const localX = (ball.x - px) * Math.cos(-angle) - (ball.y - py) * Math.sin(-angle);
      const localY = (ball.x - px) * Math.sin(-angle) + (ball.y - py) * Math.cos(-angle);
      const flipLen = FLIPPER_W;
      if (localX >= -FLIPPER_PIVOT_R && localX <= flipLen + 5 && Math.abs(localY) < FLIPPER_H + BALL_R) {
        const overshoot = FLIPPER_H / 2 + BALL_R - Math.abs(localY);
        if (overshoot > 0) {
          const worldNY = Math.sin(angle) * side;
          const worldNX = -Math.cos(angle) * side * 0;
          ball.y -= overshoot * (localY < 0 ? -1 : 1) * Math.cos(angle);
          ball.x -= overshoot * (localY < 0 ? -1 : 1) * Math.sin(angle) * -1;
          const dot = ball.vx * 0 + ball.vy * 1;
          if ((localY < 0 && ball.vy > 0) || (localY > 0 && ball.vy < 0)) {
            ball.vy *= -0.75;
            ball.vx *= 0.8;
            if (localY < 0) {
              const t = localX / flipLen;
              const flipSpeed = (side > 0 ? -lAngle : -rAngle) * 15;
              ball.vy += flipSpeed * -2.5;
              ball.vx += (t - 0.5) * 3;
            }
          }
        }
      }
    };

    checkFlipper(LEFT_FLIPPER_X, FLIPPER_Y, lAngle, 1);
    checkFlipper(RIGHT_FLIPPER_X, FLIPPER_Y, -rAngle, -1);
  }, []);

  const updatePhysics = useCallback(() => {
    if (!inPlayRef.current || gameOverRef.current) return;
    const ball = ballRef.current;
    ball.vy += GRAVITY;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x < BALL_R + 1) { ball.x = BALL_R + 1; ball.vx = Math.abs(ball.vx) * 0.85; }
    if (ball.x > W - BALL_R - 35) { ball.x = W - BALL_R - 35; ball.vx = -Math.abs(ball.vx) * 0.85; }
    if (ball.y < BALL_R + 1) { ball.y = BALL_R + 1; ball.vy = Math.abs(ball.vy) * 0.9; }

    const wallMarginL = 20 + (ball.y - H * 0.4) / (H * 0.6 - H * 0.4) * 20;
    const wallMarginR = W - 40 - 35 - (ball.y - H * 0.4) / (H * 0.6 - H * 0.4) * 20;
    if (ball.y > H * 0.4 && ball.x < wallMarginL) { ball.x = wallMarginL; ball.vx = Math.abs(ball.vx) * 0.8; }
    if (ball.y > H * 0.4 && ball.x > wallMarginR) { ball.x = wallMarginR; ball.vx = -Math.abs(ball.vx) * 0.8; }

    for (const b of bumpersRef.current) {
      const dx = ball.x - b.x;
      const dy = ball.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < b.r + BALL_R) {
        const nx = dx / dist;
        const ny = dy / dist;
        const speed = Math.hypot(ball.vx, ball.vy);
        ball.x = b.x + nx * (b.r + BALL_R + 1);
        ball.y = b.y + ny * (b.r + BALL_R + 1);
        ball.vx = nx * Math.max(speed, 5) * 1.1;
        ball.vy = ny * Math.max(speed, 5) * 1.1;
        if (!b.lit) {
          b.lit = true;
          b.litTimer = 20;
          const pts = scoreRef.current + b.score;
          scoreRef.current = pts;
          setScore(pts);
        }
      }
      if (b.lit && b.litTimer > 0) {
        b.litTimer--;
        if (b.litTimer <= 0) b.lit = false;
      }
    }

    collideFlipper(ball);

    if (ball.y > H + 20) {
      const remaining = ballsRef.current - 1;
      ballsRef.current = remaining;
      setBalls(remaining);
      if (remaining <= 0) {
        gameOverRef.current = true;
        setGameOver(true);
      } else {
        resetBall();
      }
    }
  }, [collideFlipper, resetBall]);

  const updateLauncher = useCallback(() => {
    const keys = keysRef.current;
    if (!inPlayRef.current && gameStartedRef.current && !gameOverRef.current) {
      if (keys.has(" ")) {
        launchChargeRef.current = Math.min(launchChargeRef.current + 1.5, 100);
        launchingRef.current = true;
      } else if (launchingRef.current) {
        const charge = launchChargeRef.current;
        ballRef.current.vy = -(charge / 100) * 18 - 4;
        ballRef.current.vx = (Math.random() - 0.5) * 1.5;
        inPlayRef.current = true;
        launchingRef.current = false;
        launchChargeRef.current = 0;
      }
    }
  }, []);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      updateFlippers();
      updateLauncher();
      updatePhysics();
      drawScene();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [updateFlippers, updateLauncher, updatePhysics, drawScene]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["z", "Z", "ArrowLeft", "ArrowRight", "/", " "].includes(e.key)) e.preventDefault();
      if (!gameStartedRef.current && !gameOverRef.current) {
        gameStartedRef.current = true;
        setGameStarted(true);
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  const handleCanvasClick = () => {
    if (gameOverRef.current) { resetGame(); return; }
    if (!gameStartedRef.current) { gameStartedRef.current = true; setGameStarted(true); }
  };

  const pressLeft = () => keysRef.current.add("ArrowLeft");
  const releaseLeft = () => keysRef.current.delete("ArrowLeft");
  const pressRight = () => keysRef.current.add("ArrowRight");
  const releaseRight = () => keysRef.current.delete("ArrowRight");
  const pressSpace = () => keysRef.current.add(" ");
  const releaseSpace = () => keysRef.current.delete(" ");

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-2 border-blue-900 rounded cursor-pointer touch-none"
        style={{ maxHeight: "75vh", aspectRatio: `${W}/${H}` }}
        onClick={handleCanvasClick}
      />
      <div className="flex gap-2 mt-1">
        <button
          onPointerDown={pressLeft}
          onPointerUp={releaseLeft}
          onPointerLeave={releaseLeft}
          className="px-4 py-3 bg-blue-800 text-white rounded-lg font-bold text-sm hover:bg-blue-700 active:bg-blue-900"
        >
          Z (Left)
        </button>
        <button
          onPointerDown={pressSpace}
          onPointerUp={releaseSpace}
          onPointerLeave={releaseSpace}
          className="px-4 py-3 bg-yellow-700 text-white rounded-lg font-bold text-sm hover:bg-yellow-600 active:bg-yellow-900"
        >
          LAUNCH
        </button>
        <button
          onPointerDown={pressRight}
          onPointerUp={releaseRight}
          onPointerLeave={releaseRight}
          className="px-4 py-3 bg-blue-800 text-white rounded-lg font-bold text-sm hover:bg-blue-700 active:bg-blue-900"
        >
          / (Right)
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center">Z / Left Arrow: Left flipper. / / Right Arrow: Right flipper. Hold SPACE to charge launch.</p>
    </div>
  );
}

export default function PinballClassicGame() {
  return (
    <CalculatorVerticalLayout
      title="Pinball Classic - Arcade Pinball Game"
      description="Classic arcade pinball with bumpers, flippers, and a spring launcher! Use Z and / keys to control the flippers. Hold Space to charge your launch!"
      canonical="https://www.smartkitnow.com/games/pinball-classic"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Pinball Classic</h2>
          <p>
            Keep the ball in play using the two flippers at the bottom. Hit bumpers to score points.
            Charge the spring launcher by holding Space, then release to launch!
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Z / Left Arrow:</strong> Left flipper</li>
            <li><strong>/ / Right Arrow:</strong> Right flipper</li>
            <li><strong>Hold Space:</strong> Charge the spring launcher</li>
            <li><strong>Release Space:</strong> Launch the ball</li>
          </ul>
          <h3>Scoring</h3>
          <p>
            Hit the glowing bumpers in the center of the table to score points. Round bumpers score
            75 to 200 points each hit. The bumpers light up briefly when struck.
          </p>
          <h3>Lives</h3>
          <p>
            You start with 3 balls. Each time the ball falls past the flippers and out the bottom,
            you lose a ball. The game ends when all 3 balls are lost.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
