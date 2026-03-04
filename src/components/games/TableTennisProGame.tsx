import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 700;
const H = 420;
const TABLE_TOP = H / 2 - 80;
const TABLE_BOTTOM = H / 2 + 80;
const TABLE_LEFT = 80;
const TABLE_RIGHT = W - 80;
const TABLE_MID_X = W / 2;
const NET_H = 40;
const NET_TOP = TABLE_TOP - NET_H / 2;
const PADDLE_W = 12;
const PADDLE_H = 70;
const BALL_R = 8;
const PLAYER_X = TABLE_LEFT + 20;
const AI_X = TABLE_RIGHT - 20;
const WINNING_SCORE = 11;
const SETS_TO_WIN = 2;

// AI difficulty: track factor 0..1 (1=perfect tracking)
const AI_TRACK = 0.08;

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  spin: number; // affects bounce angle
  bounced: boolean; // hit table this side
}

interface GameState {
  phase: "menu" | "playing" | "point" | "setover" | "gameover";
  playerY: number;
  aiY: number;
  ball: Ball;
  playerScore: number;
  aiScore: number;
  playerSets: number;
  aiSets: number;
  lastScorer: "player" | "ai" | null;
  pointText: string;
  pointTimer: number;
  frameCount: number;
  serving: "player" | "ai";
  rallying: boolean;
  particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[];
  touchY: number;
}

function initBall(serving: "player" | "ai"): Ball {
  const dir = serving === "player" ? 1 : -1;
  return {
    x: serving === "player" ? PLAYER_X + 30 : AI_X - 30,
    y: (TABLE_TOP + TABLE_BOTTOM) / 2,
    vx: dir * 6,
    vy: (Math.random() - 0.5) * 3,
    spin: 0,
    bounced: false,
  };
}

function initState(): GameState {
  return {
    phase: "menu",
    playerY: H / 2,
    aiY: H / 2,
    ball: initBall("player"),
    playerScore: 0, aiScore: 0,
    playerSets: 0, aiSets: 0,
    lastScorer: null,
    pointText: "",
    pointTimer: 0,
    frameCount: 0,
    serving: "player",
    rallying: false,
    particles: [],
    touchY: H / 2,
  };
}

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initState());
  const animRef = useRef<number>(0);
  const [uiState, setUiState] = useState({ playerScore: 0, aiScore: 0, playerSets: 0, aiSets: 0, phase: "menu" as string });
  const winsRef = useRef(parseInt(localStorage.getItem("hs_table-tennis-pro") || "0"));
  const [wins, setWins] = useState(winsRef.current);

  const startGame = useCallback(() => {
    const s = initState();
    s.phase = "playing";
    s.ball = initBall("player");
    stateRef.current = s;
  }, []);

  const awardPoint = useCallback((scorer: "player" | "ai") => {
    const s = stateRef.current;
    if (scorer === "player") {
      s.playerScore++;
      s.pointText = "Your Point!";
    } else {
      s.aiScore++;
      s.pointText = "AI Point!";
    }
    s.lastScorer = scorer;

    // Particles
    const px = scorer === "player" ? PLAYER_X : AI_X;
    for (let i = 0; i < 15; i++) {
      s.particles.push({
        x: s.ball.x, y: s.ball.y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: scorer === "player" ? "#3498db" : "#e74c3c",
      });
    }

    // Check set win (first to 11, must lead by 2 if deuce)
    const ps = s.playerScore;
    const as = s.aiScore;
    const setOver = (ps >= WINNING_SCORE || as >= WINNING_SCORE) && Math.abs(ps - as) >= 2;
    if (setOver) {
      if (ps > as) {
        s.playerSets++;
        s.pointText = "Set to YOU!";
      } else {
        s.aiSets++;
        s.pointText = "Set to AI!";
      }
      s.playerScore = 0; s.aiScore = 0;
      if (s.playerSets >= SETS_TO_WIN || s.aiSets >= SETS_TO_WIN) {
        s.phase = "gameover";
        if (s.playerSets >= SETS_TO_WIN) {
          winsRef.current++;
          try { localStorage.setItem("hs_table-tennis-pro", String(winsRef.current)); } catch {}
          setWins(winsRef.current);
        }
      } else {
        s.phase = "setover";
      }
    } else {
      s.phase = "point";
    }

    s.pointTimer = 90;
    s.serving = scorer;
    s.ball = initBall(scorer);
    s.rallying = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.playerY = (e.clientY - rect.top) * (H / rect.height);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      stateRef.current.playerY = (e.touches[0].clientY - rect.top) * (H / rect.height);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;
      s.frameCount++;

      if (s.phase === "playing" || s.phase === "point" || s.phase === "setover") {
        // Point resume
        if ((s.phase === "point" || s.phase === "setover") && s.pointTimer > 0) {
          s.pointTimer--;
          if (s.pointTimer <= 0 && s.phase === "point") s.phase = "playing";
          if (s.pointTimer <= 0 && s.phase === "setover") s.phase = "playing";
        }

        // Clamp paddles to table area
        s.playerY = Math.max(TABLE_TOP + PADDLE_H / 2, Math.min(TABLE_BOTTOM - PADDLE_H / 2, s.playerY));

        // AI paddle tracking
        const aiTarget = s.ball.y;
        s.aiY += (aiTarget - s.aiY) * AI_TRACK * (s.rallying ? 1 : 0.5);
        s.aiY = Math.max(TABLE_TOP + PADDLE_H / 2, Math.min(TABLE_BOTTOM - PADDLE_H / 2, s.aiY));

        // Ball physics
        if (s.phase === "playing") {
          s.ball.x += s.ball.vx;
          s.ball.y += s.ball.vy + s.ball.spin * 0.05;

          // Apply gravity-like drift
          const tableMid = (TABLE_TOP + TABLE_BOTTOM) / 2;
          if (s.ball.y < TABLE_TOP || s.ball.y > TABLE_BOTTOM) {
            s.ball.vy += 0.15; // gravity when not on table
          }

          // Bounce off table top/bottom edges
          if (s.ball.y - BALL_R < TABLE_TOP) {
            s.ball.y = TABLE_TOP + BALL_R;
            s.ball.vy = Math.abs(s.ball.vy) * 0.85;
            s.ball.spin *= 0.9;
          }
          if (s.ball.y + BALL_R > TABLE_BOTTOM) {
            s.ball.y = TABLE_BOTTOM - BALL_R;
            s.ball.vy = -Math.abs(s.ball.vy) * 0.85;
            s.ball.spin *= 0.9;
          }

          // Net collision
          if (Math.abs(s.ball.x - TABLE_MID_X) < BALL_R) {
            if (s.ball.y > TABLE_TOP - NET_H / 2 && s.ball.y < TABLE_TOP) {
              // Ball hits net
              s.ball.vx *= -0.7;
              s.ball.vy *= 0.8;
            }
          }

          // Player paddle collision
          const playerPaddleTop = s.playerY - PADDLE_H / 2;
          const playerPaddleBot = s.playerY + PADDLE_H / 2;
          if (
            s.ball.x - BALL_R <= PLAYER_X + PADDLE_W &&
            s.ball.x - BALL_R >= PLAYER_X - PADDLE_W &&
            s.ball.y >= playerPaddleTop &&
            s.ball.y <= playerPaddleBot &&
            s.ball.vx < 0
          ) {
            const relHit = (s.ball.y - s.playerY) / (PADDLE_H / 2); // -1..1
            s.ball.vx = Math.abs(s.ball.vx) * 1.05 + 0.5;
            s.ball.vy = relHit * 6;
            s.ball.spin = relHit * 2;
            s.ball.x = PLAYER_X + PADDLE_W + BALL_R;
            s.rallying = true;
            // Clamp max speed
            s.ball.vx = Math.min(s.ball.vx, 14);
          }

          // AI paddle collision
          const aiPaddleTop = s.aiY - PADDLE_H / 2;
          const aiPaddleBot = s.aiY + PADDLE_H / 2;
          if (
            s.ball.x + BALL_R >= AI_X - PADDLE_W &&
            s.ball.x + BALL_R <= AI_X + PADDLE_W &&
            s.ball.y >= aiPaddleTop &&
            s.ball.y <= aiPaddleBot &&
            s.ball.vx > 0
          ) {
            const relHit = (s.ball.y - s.aiY) / (PADDLE_H / 2);
            s.ball.vx = -(Math.abs(s.ball.vx) * 1.03 + 0.5);
            s.ball.vy = relHit * 5;
            s.ball.spin = -relHit * 1.5;
            s.ball.x = AI_X - PADDLE_W - BALL_R;
            s.rallying = true;
            s.ball.vx = Math.max(s.ball.vx, -14);
          }

          // Ball goes off left (AI scores)
          if (s.ball.x + BALL_R < TABLE_LEFT - 30) {
            awardPoint("ai");
          }
          // Ball goes off right (Player scores)
          if (s.ball.x - BALL_R > TABLE_RIGHT + 30) {
            awardPoint("player");
          }
          // Ball goes way off top/bottom = fault (serving player loses point)
          if (s.ball.y < 0 || s.ball.y > H) {
            awardPoint(s.ball.vx > 0 ? "ai" : "player");
          }
        }

        // Particles
        s.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.04; });
        s.particles = s.particles.filter((p) => p.life > 0);
      }

      // ─── Draw ───────────────────────────────────────────────────────
      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#1a1a3e");
      bg.addColorStop(1, "#0d0d1f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Table surface
      const tableGrad = ctx.createLinearGradient(0, TABLE_TOP, 0, TABLE_BOTTOM);
      tableGrad.addColorStop(0, "#1565c0");
      tableGrad.addColorStop(0.5, "#1976d2");
      tableGrad.addColorStop(1, "#1565c0");
      ctx.fillStyle = tableGrad;
      ctx.fillRect(TABLE_LEFT, TABLE_TOP, TABLE_RIGHT - TABLE_LEFT, TABLE_BOTTOM - TABLE_TOP);

      // Table edges
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.strokeRect(TABLE_LEFT, TABLE_TOP, TABLE_RIGHT - TABLE_LEFT, TABLE_BOTTOM - TABLE_TOP);

      // Center line
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(TABLE_MID_X, TABLE_TOP);
      ctx.lineTo(TABLE_MID_X, TABLE_BOTTOM);
      ctx.stroke();
      ctx.setLineDash([]);

      // Table legs
      ctx.fillStyle = "#333";
      [[TABLE_LEFT, TABLE_BOTTOM], [TABLE_RIGHT - 10, TABLE_BOTTOM], [TABLE_LEFT, TABLE_TOP - 10], [TABLE_RIGHT - 10, TABLE_TOP - 10]].forEach(([x, y]) => {
        ctx.fillRect(x, y, 10, 30);
      });

      // Net
      ctx.fillStyle = "#aaa";
      ctx.fillRect(TABLE_MID_X - 3, NET_TOP, 6, NET_H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(TABLE_MID_X - 5, NET_TOP - 5, 10, 8);
      ctx.fillRect(TABLE_MID_X - 5, NET_TOP + NET_H - 5, 10, 8);

      // Floor shadow under table
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(W / 2, TABLE_BOTTOM + 25, (TABLE_RIGHT - TABLE_LEFT) / 2.2, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player paddle
      const drawPaddle = (x: number, y: number, color: string, label: string) => {
        const t = y - PADDLE_H / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - PADDLE_W / 2, t, PADDLE_W, PADDLE_H, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Handle
        ctx.fillStyle = "#8d4f1e";
        ctx.fillRect(x - 4, t + PADDLE_H, 8, 20);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, x, t - 6);
        ctx.textAlign = "left";
      };
      drawPaddle(PLAYER_X, stateRef.current.playerY, "#3498db", "YOU");
      drawPaddle(AI_X, stateRef.current.aiY, "#e74c3c", "AI");

      // Draw ball with shadow
      ctx.beginPath();
      ctx.arc(stateRef.current.ball.x + 3, stateRef.current.ball.y + 3, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fill();
      const ballGrad = ctx.createRadialGradient(
        stateRef.current.ball.x - 2, stateRef.current.ball.y - 2, 1,
        stateRef.current.ball.x, stateRef.current.ball.y, BALL_R
      );
      ballGrad.addColorStop(0, "#fffde7");
      ballGrad.addColorStop(0.7, "#fff9c4");
      ballGrad.addColorStop(1, "#f9a825");
      ctx.beginPath();
      ctx.arc(stateRef.current.ball.x, stateRef.current.ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad;
      ctx.fill();

      // Spin indicator
      if (Math.abs(stateRef.current.ball.spin) > 0.3) {
        ctx.strokeStyle = stateRef.current.ball.spin > 0 ? "#ff6b6b" : "#69b7fb";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(stateRef.current.ball.x, stateRef.current.ball.y, BALL_R + 4, 0, Math.PI * Math.abs(stateRef.current.ball.spin));
        ctx.stroke();
      }

      // Particles
      for (const p of stateRef.current.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Score display
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, W, 52);
      ctx.fillStyle = "#3498db";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${stateRef.current.playerScore}`, TABLE_LEFT + 20, 36);
      ctx.fillStyle = "#e74c3c";
      ctx.textAlign = "right";
      ctx.fillText(`${stateRef.current.aiScore}`, W - TABLE_LEFT - 20, 36);
      ctx.fillStyle = "#fff";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Sets: YOU ${stateRef.current.playerSets} — ${stateRef.current.aiSets} AI`, W / 2, 22);
      ctx.font = "18px sans-serif";
      ctx.fillText(`${stateRef.current.playerScore} : ${stateRef.current.aiScore}`, W / 2, 40);

      // Point text
      if ((stateRef.current.phase === "point" || stateRef.current.phase === "setover") && stateRef.current.pointText) {
        ctx.fillStyle = stateRef.current.lastScorer === "player" ? "#3498db" : "#e74c3c";
        ctx.font = "bold 38px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 12;
        ctx.fillText(stateRef.current.pointText, W / 2, H / 2 + 10);
        ctx.shadowBlur = 0;
      }
      ctx.textAlign = "left";

      // Serving indicator
      if (stateRef.current.phase === "playing" && !stateRef.current.rallying) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(stateRef.current.serving === "player" ? "Your serve →" : "← AI serve", W / 2, H - 10);
        ctx.textAlign = "left";
      }

      // Overlays
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.82)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#3498db";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TABLE TENNIS PRO", W / 2, H / 2 - 90);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 58px sans-serif";
        ctx.fillText("🏓", W / 2, H / 2 - 30);
        ctx.fillStyle = "#aaa";
        ctx.font = "16px sans-serif";
        ctx.fillText("Move mouse up/down to control your paddle (left)", W / 2, H / 2 + 30);
        ctx.fillText(`First to ${WINNING_SCORE} points wins a set. Best of ${SETS_TO_WIN * 2 - 1} sets.`, W / 2, H / 2 + 55);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Click / Tap to Start", W / 2, H / 2 + 100);
        ctx.textAlign = "left";
      } else if (s.phase === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.82)";
        ctx.fillRect(0, 0, W, H);
        const youWin = s.playerSets > s.aiSets;
        ctx.fillStyle = youWin ? "#3498db" : "#e74c3c";
        ctx.font = "bold 54px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(youWin ? "YOU WIN!" : "AI WINS!", W / 2, H / 2 - 30);
        ctx.fillStyle = "#fff";
        ctx.font = "26px sans-serif";
        ctx.fillText(`Sets: ${s.playerSets} — ${s.aiSets}`, W / 2, H / 2 + 25);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px sans-serif";
        ctx.fillText("Click to play again", W / 2, H / 2 + 70);
        ctx.textAlign = "left";
      }

      setUiState({ playerScore: s.playerScore, aiScore: s.aiScore, playerSets: s.playerSets, aiSets: s.aiSets, phase: s.phase });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [awardPoint]);

  const handleClick = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "menu" || s.phase === "gameover") startGame();
  }, [startGame]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex gap-6 text-sm font-bold">
        <span className="text-blue-400">YOU: {uiState.playerScore} (Sets: {uiState.playerSets})</span>
        <span className="text-red-400">AI: {uiState.aiScore} (Sets: {uiState.aiSets})</span>
        <span className="text-purple-400">Wins: {wins}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        style={{ maxWidth: "100%", borderRadius: "12px", cursor: "none", touchAction: "none" }}
      />
      <p className="text-xs text-gray-400">Move mouse up/down to control paddle • First to 11 wins a set • Best of 3 sets</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function TableTennisProGame() {
  return (
    <CalculatorVerticalLayout
      title="Table Tennis Pro - Ping Pong Game Online"
      description="Play table tennis against an AI opponent. Control your paddle with mouse or touch, score to 11, and win 2 sets to become the champion. Free online ping pong game."
      canonical="https://www.smartkitnow.com/games/table-tennis-pro"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Table Tennis Pro</h2>
          <p>Table Tennis Pro is a realistic side-view ping pong game. Face an AI opponent across a regulation blue table. Control your paddle on the left, rally, and win sets!</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse Move Up/Down:</strong> Control your left paddle.</li>
            <li><strong>Touch Drag:</strong> Drag your finger up/down on mobile to move the paddle.</li>
          </ul>
          <h3>Physics</h3>
          <ul>
            <li>Ball angle depends on where it hits your paddle — edge hits = sharp angles.</li>
            <li>Ball spin affects its trajectory after bouncing off the table.</li>
            <li>Ball speed gradually increases with each rally.</li>
          </ul>
          <h3>Scoring</h3>
          <ul>
            <li>First to 11 points wins the set (must lead by 2 — deuce rules apply).</li>
            <li>Win 2 sets to win the match (best of 3).</li>
            <li>The server alternates after each point is scored.</li>
          </ul>
          <h3>Tips</h3>
          <ul>
            <li>Hit with the center of the paddle for straight shots, the edges for angled ones.</li>
            <li>Watch the spin indicator (colored arc) on the ball to predict its bounce direction.</li>
            <li>The AI gets slightly faster as the rally goes longer — don't give it time to adjust!</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
