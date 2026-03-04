import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 600;
const H = 480;
const GOAL_LEFT = 150;
const GOAL_RIGHT = 450;
const GOAL_TOP = 60;
const GOAL_BOTTOM = 220;
const GOAL_W = GOAL_RIGHT - GOAL_LEFT;
const GOAL_H = GOAL_BOTTOM - GOAL_TOP;
const GK_W = 80;
const GK_H = 90;
const MAX_POWER_MS = 600;
const KICKS_PER_ROUND = 5;
const BALL_START_X = W / 2;
const BALL_START_Y = H - 80;

type Phase = "menu" | "player_aim" | "charging" | "ball_flying" | "result" | "ai_turn" | "gameover";

interface GameState {
  phase: Phase;
  playerScore: number;
  aiScore: number;
  roundKick: number; // 0..4 (kick number in current round)
  isPlayerTurn: boolean;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  ballScale: number;
  targetX: number;
  targetY: number;
  aimX: number;
  aimY: number;
  chargeStart: number;
  power: number;
  gkX: number;
  gkY: number;
  gkTargetX: number;
  gkVX: number;
  resultText: string;
  resultColor: string;
  resultTimer: number;
  frameCount: number;
  roundOver: boolean;
  playerKicks: boolean[];
  aiKicks: boolean[];
}

function initState(): GameState {
  return {
    phase: "menu",
    playerScore: 0, aiScore: 0,
    roundKick: 0, isPlayerTurn: true,
    ballX: BALL_START_X, ballY: BALL_START_Y,
    ballVX: 0, ballVY: 0, ballScale: 1,
    targetX: W / 2, targetY: GOAL_TOP + GOAL_H / 2,
    aimX: W / 2, aimY: GOAL_TOP + GOAL_H / 2,
    chargeStart: 0, power: 0,
    gkX: W / 2, gkY: GOAL_BOTTOM - GK_H / 2,
    gkTargetX: W / 2, gkVX: 0,
    resultText: "", resultColor: "#fff",
    resultTimer: 0,
    frameCount: 0, roundOver: false,
    playerKicks: [], aiKicks: [],
  };
}

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initState());
  const animRef = useRef<number>(0);
  const [uiScore, setUiScore] = useState({ player: 0, ai: 0, phase: "menu" as string });

  const startGame = useCallback(() => {
    stateRef.current = initState();
    stateRef.current.phase = "player_aim";
  }, []);

  const isGoal = useCallback((tx: number, ty: number, gkCX: number): boolean => {
    if (tx < GOAL_LEFT || tx > GOAL_RIGHT || ty < GOAL_TOP || ty > GOAL_BOTTOM) return false;
    // GK saves if target is near GK position
    const gkLeft = gkCX - GK_W / 2;
    const gkRight = gkCX + GK_W / 2;
    const gkTop = GOAL_BOTTOM - GK_H;
    const gkBot = GOAL_BOTTOM;
    if (tx >= gkLeft && tx <= gkRight && ty >= gkTop && ty <= gkBot) return false;
    return true;
  }, []);

  const shootAI = useCallback(() => {
    const s = stateRef.current;
    // AI picks a random spot in the goal
    const tx = GOAL_LEFT + 20 + Math.random() * (GOAL_W - 40);
    const ty = GOAL_TOP + 10 + Math.random() * (GOAL_H - 20);
    s.targetX = tx; s.targetY = ty;
    s.ballX = W / 2; s.ballY = BALL_START_Y;
    s.ballScale = 1;

    // GK dives: with 40% chance block, else dive opposite
    const blockChance = 0.4;
    if (Math.random() < blockChance) {
      s.gkTargetX = tx; // save
    } else {
      s.gkTargetX = tx < W / 2 ? GOAL_RIGHT - GK_W / 2 : GOAL_LEFT + GK_W / 2;
    }
    const dx = tx - BALL_START_X;
    const dy = ty - BALL_START_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    s.ballVX = dx / dist * 12;
    s.ballVY = dy / dist * 12;
    s.phase = "ball_flying";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.phase !== "player_aim" && s.phase !== "charging") return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      // Clamp aim to goal area
      s.aimX = Math.max(GOAL_LEFT + 5, Math.min(GOAL_RIGHT - 5, mx));
      s.aimY = Math.max(GOAL_TOP + 5, Math.min(GOAL_BOTTOM - 5, my));
    };

    const handleMouseDown = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.phase === "player_aim") {
        s.phase = "charging";
        s.chargeStart = performance.now();
        s.power = 0;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.phase !== "charging") return;
      const power = Math.min(1, (performance.now() - s.chargeStart) / MAX_POWER_MS);
      s.power = power;
      s.targetX = s.aimX;
      s.targetY = s.aimY;
      // GK dives based on target position with some AI imperfection
      const gkBias = (Math.random() - 0.5) * 100;
      s.gkTargetX = Math.max(GOAL_LEFT + GK_W / 2, Math.min(GOAL_RIGHT - GK_W / 2, s.targetX + gkBias));
      const dx = s.targetX - BALL_START_X;
      const dy = s.targetY - BALL_START_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spd = 8 + power * 8;
      s.ballVX = dx / dist * spd;
      s.ballVY = dy / dist * spd;
      s.phase = "ball_flying";
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0] || e.changedTouches[0];
      const mx = (t.clientX - rect.left) * (W / rect.width);
      const my = (t.clientY - rect.top) * (H / rect.height);
      s.aimX = Math.max(GOAL_LEFT + 5, Math.min(GOAL_RIGHT - 5, mx));
      s.aimY = Math.max(GOAL_TOP + 5, Math.min(GOAL_BOTTOM - 5, my));
      if (s.phase === "player_aim") {
        s.phase = "charging";
        s.chargeStart = performance.now();
      }
    };

    const handleTouchEnd = () => {
      const s = stateRef.current;
      if (s.phase !== "charging") return;
      const power = Math.min(1, (performance.now() - s.chargeStart) / MAX_POWER_MS);
      s.power = power;
      s.targetX = s.aimX;
      s.targetY = s.aimY;
      const gkBias = (Math.random() - 0.5) * 100;
      s.gkTargetX = Math.max(GOAL_LEFT + GK_W / 2, Math.min(GOAL_RIGHT - GK_W / 2, s.targetX + gkBias));
      const dx = s.targetX - BALL_START_X;
      const dy = s.targetY - BALL_START_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spd = 8 + power * 8;
      s.ballVX = dx / dist * spd;
      s.ballVY = dy / dist * spd;
      s.phase = "ball_flying";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      s.frameCount++;

      // GK movement
      if (s.phase === "ball_flying" || s.phase === "result") {
        const gkSpeed = 7;
        const dx = s.gkTargetX - s.gkX;
        s.gkX += Math.sign(dx) * Math.min(Math.abs(dx), gkSpeed);
      }

      // Charging power update
      if (s.phase === "charging") {
        s.power = Math.min(1, (timestamp - s.chargeStart) / MAX_POWER_MS);
      }

      // Ball flying
      if (s.phase === "ball_flying") {
        s.ballX += s.ballVX;
        s.ballY += s.ballVY;
        s.ballScale = Math.max(0.3, 1 - (BALL_START_Y - s.ballY) / (BALL_START_Y - GOAL_TOP) * 0.6);

        if (s.ballY <= s.targetY || s.ballY <= GOAL_TOP - 20) {
          // Check result
          const scored = isGoal(s.targetX, s.targetY, s.gkX);
          if (s.isPlayerTurn) {
            s.playerKicks = [...s.playerKicks, scored];
            if (scored) { s.playerScore++; s.resultText = "GOAL!"; s.resultColor = "#2ecc71"; }
            else { s.resultText = "SAVED!"; s.resultColor = "#e74c3c"; }
          } else {
            s.aiKicks = [...s.aiKicks, scored];
            if (scored) { s.aiScore++; s.resultText = "AI SCORES!"; s.resultColor = "#e74c3c"; }
            else { s.resultText = "SAVED!"; s.resultColor = "#2ecc71"; }
          }
          s.resultTimer = 90;
          s.phase = "result";
        }
      }

      // Result display timeout
      if (s.phase === "result") {
        s.resultTimer--;
        if (s.resultTimer <= 0) {
          s.roundKick++;
          if (s.roundKick >= KICKS_PER_ROUND * 2) {
            s.phase = "gameover";
          } else if (s.roundKick % 2 === 0) {
            // Player's turn again
            s.isPlayerTurn = true;
            s.ballX = BALL_START_X; s.ballY = BALL_START_Y; s.ballScale = 1;
            s.gkX = W / 2; s.gkY = GOAL_BOTTOM - GK_H / 2; s.gkTargetX = W / 2;
            s.phase = "player_aim";
          } else {
            // AI's turn
            s.isPlayerTurn = false;
            s.gkX = W / 2; s.gkY = GOAL_BOTTOM - GK_H / 2; s.gkTargetX = W / 2;
            s.phase = "ai_turn";
          }
        }
      }

      // AI turn delay
      if (s.phase === "ai_turn") {
        s.resultTimer++;
        if (s.resultTimer >= 60) {
          s.resultTimer = 0;
          shootAI();
        }
      }

      // ─── Draw ───────────────────────────────────────────────────────
      // Sky / pitch
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#1a1a4e");
      sky.addColorStop(0.5, "#2c4a1e");
      sky.addColorStop(1, "#1a3a0a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Pitch markings
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, H - 40, 60, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // Penalty spot
      ctx.beginPath();
      ctx.arc(BALL_START_X, BALL_START_Y - 10, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();

      // Goal net (back)
      ctx.fillStyle = "rgba(200,200,200,0.08)";
      ctx.fillRect(GOAL_LEFT, GOAL_TOP, GOAL_W, GOAL_H);
      for (let x = GOAL_LEFT; x <= GOAL_RIGHT; x += 20) {
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, GOAL_TOP);
        ctx.lineTo(x, GOAL_BOTTOM);
        ctx.stroke();
      }
      for (let y = GOAL_TOP; y <= GOAL_BOTTOM; y += 20) {
        ctx.beginPath();
        ctx.moveTo(GOAL_LEFT, y);
        ctx.lineTo(GOAL_RIGHT, y);
        ctx.stroke();
      }

      // Goal posts
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(GOAL_LEFT, GOAL_BOTTOM);
      ctx.lineTo(GOAL_LEFT, GOAL_TOP);
      ctx.lineTo(GOAL_RIGHT, GOAL_TOP);
      ctx.lineTo(GOAL_RIGHT, GOAL_BOTTOM);
      ctx.stroke();

      // Aim crosshair when player is aiming
      if (s.phase === "player_aim" || s.phase === "charging") {
        ctx.strokeStyle = "rgba(255,255,0,0.8)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(s.aimX - 15, s.aimY);
        ctx.lineTo(s.aimX + 15, s.aimY);
        ctx.moveTo(s.aimX, s.aimY - 15);
        ctx.lineTo(s.aimX, s.aimY + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shot trajectory guide
        ctx.strokeStyle = "rgba(255,255,0,0.2)";
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(BALL_START_X, BALL_START_Y);
        ctx.lineTo(s.aimX, s.aimY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw goalkeeper
      ctx.fillStyle = "#e67e22";
      ctx.beginPath();
      ctx.roundRect(s.gkX - GK_W / 2, GOAL_BOTTOM - GK_H, GK_W, GK_H, 8);
      ctx.fill();
      // GK jersey stripes
      ctx.fillStyle = "#d35400";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(s.gkX - GK_W / 2 + i * (GK_W / 3), GOAL_BOTTOM - GK_H, GK_W / 6, GK_H);
      }
      // GK head
      ctx.beginPath();
      ctx.arc(s.gkX, GOAL_BOTTOM - GK_H - 12, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#f5cba7";
      ctx.fill();

      // Draw ball
      const ballR = 12 * s.ballScale;
      const ballGrad = ctx.createRadialGradient(s.ballX - ballR * 0.3, s.ballY - ballR * 0.3, 1, s.ballX, s.ballY, ballR);
      ballGrad.addColorStop(0, "#fff");
      ballGrad.addColorStop(0.5, "#ddd");
      ballGrad.addColorStop(1, "#888");
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, ballR, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Pentagon marks
      if (ballR > 6) {
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, ballR * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Power bar when charging
      if (s.phase === "charging") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(W / 2 - 80, H - 30, 160, 18);
        const powerColor = s.power < 0.5 ? "#2ecc71" : s.power < 0.8 ? "#f39c12" : "#e74c3c";
        ctx.fillStyle = powerColor;
        ctx.fillRect(W / 2 - 80, H - 30, 160 * s.power, 18);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(W / 2 - 80, H - 30, 160, 18);
        ctx.fillStyle = "#fff";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("POWER", W / 2, H - 17);
        ctx.textAlign = "left";
      }

      // Result text
      if (s.phase === "result" && s.resultText) {
        ctx.fillStyle = s.resultColor;
        ctx.font = "bold 52px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10;
        ctx.fillText(s.resultText, W / 2, H / 2 + 20);
        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
      }

      // Score board
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`YOU ${s.playerScore}  —  ${s.aiScore} AI`, W / 2, 32);

      // Kick indicators
      const kicksForKick = (kicks: boolean[], total: number) => {
        for (let i = 0; i < total; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          if (i < kicks.length) {
            ctx.fillStyle = kicks[i] ? "#2ecc71" : "#e74c3c";
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.2)";
          }
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };
      ctx.save();
      ctx.translate(W / 2 - 120, H - 24);
      for (let i = 0; i < KICKS_PER_ROUND; i++) {
        const scored = i < s.playerKicks.length ? s.playerKicks[i] : undefined;
        ctx.beginPath();
        ctx.arc(i * 22, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = scored === undefined ? "rgba(255,255,255,0.2)" : scored ? "#2ecc71" : "#e74c3c";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.translate(130, 0);
      for (let i = 0; i < KICKS_PER_ROUND; i++) {
        const scored = i < s.aiKicks.length ? s.aiKicks[i] : undefined;
        ctx.beginPath();
        ctx.arc(i * 22, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = scored === undefined ? "rgba(255,255,255,0.2)" : scored ? "#e74c3c" : "#2ecc71";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Turn indicator
      if (s.phase === "player_aim" || s.phase === "charging") {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("YOUR KICK — Aim & Hold to power up!", W / 2, H - 50);
        ctx.textAlign = "left";
      } else if (s.phase === "ai_turn") {
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("AI KICK — Be the goalkeeper!", W / 2, H - 50);
        ctx.textAlign = "left";
      }

      // Overlays
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.82)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 46px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PENALTY", W / 2, H / 2 - 70);
        ctx.fillText("SHOOTOUT", W / 2, H / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font = "17px sans-serif";
        ctx.fillText("5 kicks each. Best of 5 wins!", W / 2, H / 2 + 30);
        ctx.fillText("Hold mouse/touch inside goal to power up kick.", W / 2, H / 2 + 60);
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Click / Tap to Start", W / 2, H / 2 + 110);
        ctx.textAlign = "left";
      } else if (s.phase === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, W, H);
        const winner = s.playerScore > s.aiScore ? "YOU WIN!" : s.playerScore === s.aiScore ? "DRAW!" : "AI WINS!";
        ctx.fillStyle = s.playerScore > s.aiScore ? "#2ecc71" : s.playerScore === s.aiScore ? "#f39c12" : "#e74c3c";
        ctx.font = "bold 54px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(winner, W / 2, H / 2 - 30);
        ctx.fillStyle = "#fff";
        ctx.font = "26px sans-serif";
        ctx.fillText(`${s.playerScore} — ${s.aiScore}`, W / 2, H / 2 + 25);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px sans-serif";
        ctx.fillText("Click to play again", W / 2, H / 2 + 70);
        ctx.textAlign = "left";
      }

      setUiScore({ player: s.playerScore, ai: s.aiScore, phase: s.phase });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isGoal, shootAI]);

  const handleClick = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "menu" || s.phase === "gameover") startGame();
  }, [startGame]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        style={{ maxWidth: "100%", borderRadius: "12px", cursor: "crosshair", touchAction: "none" }}
      />
      <p className="text-xs text-gray-400">Aim in goal → Hold to power up → Release to shoot</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function PenaltyShootoutGame() {
  return (
    <CalculatorVerticalLayout
      title="Penalty Shootout - Soccer Penalty Kick Game Online"
      description="Take 5 penalty kicks against an AI goalkeeper. Score more than the AI to win! Free online soccer penalty shootout game."
      canonical="https://www.smartkitnow.com/games/penalty-shootout"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Penalty Shootout</h2>
          <p>Penalty Shootout is a front-view soccer penalty kick game. You and the AI each take 5 kicks. Score the most goals to win the shootout!</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse Move:</strong> Aim the crosshair within the goal.</li>
            <li><strong>Hold Mouse / Touch:</strong> Fill the power bar (up to 0.5 seconds max).</li>
            <li><strong>Release:</strong> The ball shoots to your aimed position.</li>
          </ul>
          <h3>Goalkeeper AI</h3>
          <ul>
            <li>The goalkeeper reacts to the direction of your shot with some randomness.</li>
            <li>More power = harder shots (higher speed), but the GK also moves faster on powerful shots.</li>
            <li>When the AI kicks, you watch the goalkeeper dive — will it save the shot?</li>
          </ul>
          <h3>Winning</h3>
          <ul>
            <li>5 kicks each, best total score wins.</li>
            <li>Draws are possible!</li>
            <li>Score indicator dots below the field show hit/miss for each kick.</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
