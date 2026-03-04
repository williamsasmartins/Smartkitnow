import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const COLS = 20;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;
const PAC_SPEED = 2.5;
const GHOST_SPEED = 1.8;
const POWER_DURATION = 420; // frames ~7s at 60fps

// 0=empty/dot, 1=wall, 2=power pellet, 3=ghost house
const MAZE_TEMPLATE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,2,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,2,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,3,3,1,1,0,1,0,1,1,1,1],
  [0,0,0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0,0,0],
  [1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,1],
  [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface GhostState {
  x: number; y: number;
  tx: number; ty: number; // target tile
  color: string;
  mode: "chase" | "scatter" | "flee" | "dead";
  dir: number; // 0=right,1=down,2=left,3=up
  scatterTarget: { r: number; c: number };
}

const GHOST_CONFIGS = [
  { color: "#e74c3c", scatter: { r: 0, c: COLS - 1 } },
  { color: "#e91e9f", scatter: { r: 0, c: 0 } },
  { color: "#00bcd4", scatter: { r: ROWS - 1, c: COLS - 1 } },
  { color: "#ff9800", scatter: { r: ROWS - 1, c: 0 } },
];

function buildDotMap(): boolean[][] {
  return MAZE_TEMPLATE.map(row => row.map(cell => cell === 0 || cell === 2));
}
function buildPelletMap(): boolean[][] {
  return MAZE_TEMPLATE.map(row => row.map(cell => cell === 2));
}

function isWall(r: number, c: number): boolean {
  const rr = ((r % ROWS) + ROWS) % ROWS;
  const cc = ((c % COLS) + COLS) % COLS;
  return MAZE_TEMPLATE[rr][cc] === 1 || MAZE_TEMPLATE[rr][cc] === 3;
}

const DIRS = [
  { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: -1, dc: 0 },
];

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    phase: "menu" as "menu" | "playing" | "gameover" | "win",
    pacX: 1.5 * CELL,
    pacY: 16.5 * CELL,
    pacDir: 0,
    pacNextDir: 0,
    mouthAngle: 0,
    mouthOpen: true,
    lives: 3,
    score: 0,
    dots: buildDotMap(),
    pellets: buildPelletMap(),
    ghosts: GHOST_CONFIGS.map((g, i): GhostState => ({
      x: (10 + i % 2) * CELL + CELL / 2,
      y: (9 + Math.floor(i / 2)) * CELL + CELL / 2,
      tx: 10 + i % 2, ty: 9 + Math.floor(i / 2),
      color: g.color, mode: "scatter", dir: 2,
      scatterTarget: g.scatter,
    })),
    powerTimer: 0,
    modeTimer: 0,
    globalMode: "scatter" as "chase" | "scatter",
    touchStartX: 0, touchStartY: 0,
  });
  const animRef = useRef<number>(0);
  const [uiState, setUiState] = useState({ score: 0, lives: 3, phase: "menu" as string });
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("hs_pac-maze") || "0"));
  const highScoreRef = useRef(parseInt(localStorage.getItem("hs_pac-maze") || "0"));

  const resetPositions = useCallback(() => {
    const s = stateRef.current;
    s.pacX = 1.5 * CELL;
    s.pacY = 16.5 * CELL;
    s.pacDir = 0;
    s.ghosts = GHOST_CONFIGS.map((g, i): GhostState => ({
      x: (10 + i % 2) * CELL + CELL / 2,
      y: (9 + Math.floor(i / 2)) * CELL + CELL / 2,
      tx: 10 + i % 2, ty: 9 + Math.floor(i / 2),
      color: g.color, mode: "scatter", dir: 2,
      scatterTarget: g.scatter,
    }));
    s.powerTimer = 0;
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.dots = buildDotMap();
    s.pellets = buildPelletMap();
    s.score = 0;
    s.lives = 3;
    s.phase = "playing";
    s.globalMode = "scatter";
    s.modeTimer = 0;
    resetPositions();
  }, [resetPositions]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.phase !== "playing") { startGame(); return; }
      if (e.key === "ArrowRight") s.pacNextDir = 0;
      if (e.key === "ArrowDown") s.pacNextDir = 1;
      if (e.key === "ArrowLeft") s.pacNextDir = 2;
      if (e.key === "ArrowUp") s.pacNextDir = 3;
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      stateRef.current.touchStartX = e.touches[0].clientX;
      stateRef.current.touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (s.phase !== "playing") { startGame(); return; }
      const dx = e.changedTouches[0].clientX - s.touchStartX;
      const dy = e.changedTouches[0].clientY - s.touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        s.pacNextDir = dx > 0 ? 0 : 2;
      } else {
        s.pacNextDir = dy > 0 ? 1 : 3;
      }
    };
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startGame]);

  const moveGhost = useCallback((g: GhostState, pacTileR: number, pacTileC: number) => {
    const cr = Math.floor(g.y / CELL);
    const cc = Math.floor(g.x / CELL);
    const centerY = cr * CELL + CELL / 2;
    const centerX = cc * CELL + CELL / 2;

    if (Math.abs(g.y - centerY) < 1 && Math.abs(g.x - centerX) < 1) {
      // Decide next direction at tile center
      let targetR = cr, targetC = cc;
      if (g.mode === "flee") {
        targetR = Math.floor(Math.random() * ROWS);
        targetC = Math.floor(Math.random() * COLS);
      } else if (g.mode === "chase") {
        targetR = pacTileR; targetC = pacTileC;
      } else {
        targetR = g.scatterTarget.r; targetC = g.scatterTarget.c;
      }

      let bestDir = g.dir;
      let bestDist = Infinity;
      const reverseDir = (g.dir + 2) % 4;

      for (let d = 0; d < 4; d++) {
        if (d === reverseDir) continue;
        const nr = cr + DIRS[d].dr;
        const nc = cc + DIRS[d].dc;
        if (isWall(nr, nc)) continue;
        const dist = (nr - targetR) ** 2 + (nc - targetC) ** 2;
        if (dist < bestDist) { bestDist = dist; bestDir = d; }
      }
      g.dir = bestDir;
    }

    const spd = g.mode === "flee" ? GHOST_SPEED * 0.5 : g.mode === "dead" ? GHOST_SPEED * 2 : GHOST_SPEED;
    g.x += DIRS[g.dir].dc * spd;
    g.y += DIRS[g.dir].dr * spd;
    g.x = Math.max(0, Math.min(W - 1, g.x));
    g.y = Math.max(0, Math.min(H - 1, g.y));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;

      if (s.phase === "playing") {
        s.modeTimer++;
        if (s.modeTimer % 300 === 0) {
          s.globalMode = s.globalMode === "scatter" ? "chase" : "scatter";
        }

        // Power timer
        if (s.powerTimer > 0) s.powerTimer--;

        // Move Pac-Man
        const d = DIRS[s.pacNextDir];
        const nx = s.pacX + d.dc * PAC_SPEED;
        const ny = s.pacY + d.dr * PAC_SPEED;
        const r = Math.floor(ny / CELL);
        const c = Math.floor(nx / CELL);
        if (!isWall(r, c)) {
          s.pacDir = s.pacNextDir;
          s.pacX = nx;
          s.pacY = ny;
        } else {
          // Keep current dir
          const cd = DIRS[s.pacDir];
          const nx2 = s.pacX + cd.dc * PAC_SPEED;
          const ny2 = s.pacY + cd.dr * PAC_SPEED;
          const r2 = Math.floor(ny2 / CELL);
          const c2 = Math.floor(nx2 / CELL);
          if (!isWall(r2, c2)) {
            s.pacX = nx2;
            s.pacY = ny2;
          }
        }
        // Wrap
        if (s.pacX < 0) s.pacX = W - 1;
        if (s.pacX >= W) s.pacX = 0;

        // Mouth animation
        s.mouthAngle += s.mouthOpen ? 5 : -5;
        if (s.mouthAngle >= 35) s.mouthOpen = false;
        if (s.mouthAngle <= 2) s.mouthOpen = true;

        // Eat dots
        const pacR = Math.floor(s.pacY / CELL);
        const pacC = Math.floor(s.pacX / CELL);
        if (s.dots[pacR]?.[pacC]) {
          s.dots[pacR][pacC] = false;
          s.score += 10;
        }
        if (s.pellets[pacR]?.[pacC]) {
          s.pellets[pacR][pacC] = false;
          s.score += 50;
          s.powerTimer = POWER_DURATION;
          s.ghosts.forEach((g) => { if (g.mode !== "dead") g.mode = "flee"; });
        }

        // Check win
        const anyDot = s.dots.some(row => row.some(Boolean));
        if (!anyDot) { s.phase = "win"; }

        // Move ghosts
        s.ghosts.forEach((g) => {
          if (g.mode !== "flee" && g.mode !== "dead") {
            g.mode = s.globalMode;
          }
          if (s.powerTimer === 0 && g.mode === "flee") g.mode = s.globalMode;
          moveGhost(g, pacR, pacC);
        });

        // Ghost collision
        const pLeft = s.pacX - CELL * 0.4;
        const pRight = s.pacX + CELL * 0.4;
        const pTop = s.pacY - CELL * 0.4;
        const pBot = s.pacY + CELL * 0.4;

        for (const g of s.ghosts) {
          if (g.mode === "dead") continue;
          if (g.x > pLeft && g.x < pRight && g.y > pTop && g.y < pBot) {
            if (g.mode === "flee") {
              g.mode = "dead";
              s.score += 200;
            } else {
              s.lives--;
              if (s.lives <= 0) {
                s.phase = "gameover";
                if (s.score > highScoreRef.current) {
                  highScoreRef.current = s.score;
                  try { localStorage.setItem("hs_pac-maze", String(s.score)); } catch {}
                  setHighScore(s.score);
                }
              }
              else { resetPositions(); }
            }
          }
        }
      }

      // ─── Draw ───────────────────────────────────────────────────────
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      // Draw maze
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = MAZE_TEMPLATE[r][c];
          if (cell === 1) {
            ctx.fillStyle = "#1a237e";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
            ctx.strokeStyle = "#3949ab";
            ctx.lineWidth = 1;
            ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
          }
          if (cell === 3) {
            ctx.fillStyle = "#111";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          }
        }
      }

      // Draw dots
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (stateRef.current.dots[r]?.[c]) {
            ctx.beginPath();
            ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#ffd700";
            ctx.fill();
          }
        }
      }

      // Draw power pellets (blinking)
      if (Math.floor(Date.now() / 300) % 2 === 0) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (s.pellets[r]?.[c]) {
              ctx.beginPath();
              ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 7, 0, Math.PI * 2);
              ctx.fillStyle = "#ffd700";
              ctx.fill();
            }
          }
        }
      }

      // Draw Pac-Man
      if (s.phase !== "gameover") {
        const angleRad = (s.mouthAngle * Math.PI) / 180;
        const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
        ctx.save();
        ctx.translate(s.pacX, s.pacY);
        ctx.rotate(rotations[s.pacDir]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, CELL * 0.45, angleRad, Math.PI * 2 - angleRad);
        ctx.closePath();
        ctx.fillStyle = "#ffd700";
        ctx.fill();
        ctx.restore();
      }

      // Draw ghosts
      for (const g of s.ghosts) {
        const gx = g.x;
        const gy = g.y;
        const gr = CELL * 0.45;
        const gColor = g.mode === "flee"
          ? (s.powerTimer < 120 && Math.floor(Date.now() / 200) % 2 ? "#fff" : "#3498db")
          : g.mode === "dead" ? "#888" : g.color;

        ctx.fillStyle = gColor;
        ctx.beginPath();
        ctx.arc(gx, gy - gr * 0.1, gr, Math.PI, 0);
        ctx.lineTo(gx + gr, gy + gr);
        for (let i = 3; i >= 0; i--) {
          const wx = gx - gr + (gr * 2 / 3) * i;
          ctx.arc(wx + gr / 3, gy + gr, gr / 3, 0, Math.PI, true);
        }
        ctx.lineTo(gx - gr, gy + gr);
        ctx.closePath();
        ctx.fill();

        if (g.mode !== "flee" && g.mode !== "dead") {
          // Eyes
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.ellipse(gx - gr * 0.3, gy - gr * 0.1, gr * 0.22, gr * 0.3, 0, 0, Math.PI * 2);
          ctx.ellipse(gx + gr * 0.3, gy - gr * 0.1, gr * 0.22, gr * 0.3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#00f";
          ctx.beginPath();
          const eyeOff = DIRS[g.dir];
          ctx.arc(gx - gr * 0.3 + eyeOff.dc * 3, gy - gr * 0.1 + eyeOff.dr * 3, gr * 0.12, 0, Math.PI * 2);
          ctx.arc(gx + gr * 0.3 + eyeOff.dc * 3, gy - gr * 0.1 + eyeOff.dr * 3, gr * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // HUD
      ctx.fillStyle = "#000";
      ctx.fillRect(0, H - 32, W, 32);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`Score: ${s.score}`, 10, H - 10);
      for (let i = 0; i < s.lives; i++) {
        ctx.beginPath();
        ctx.arc(W - 20 - i * 26, H - 14, 9, 0.3, Math.PI * 2 - 0.3);
        ctx.closePath();
        ctx.fillStyle = "#ffd700";
        ctx.fill();
      }

      // Overlays
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.82)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 52px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PAC MAZE", W / 2, H / 2 - 40);
        ctx.fillStyle = "#fff";
        ctx.font = "18px sans-serif";
        ctx.fillText("Eat all dots, avoid ghosts!", W / 2, H / 2 + 10);
        ctx.fillText("Arrow keys or Swipe to move", W / 2, H / 2 + 40);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("Click / Tap to Start", W / 2, H / 2 + 90);
        ctx.textAlign = "left";
      } else if (s.phase === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#e74c3c";
        ctx.font = "bold 50px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font = "22px sans-serif";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 25);
        ctx.fillText("Click to restart", W / 2, H / 2 + 60);
        ctx.textAlign = "left";
      } else if (s.phase === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 50px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN!", W / 2, H / 2 - 20);
        ctx.fillStyle = "#ffd700";
        ctx.font = "22px sans-serif";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 + 25);
        ctx.fillText("Click to play again", W / 2, H / 2 + 60);
        ctx.textAlign = "left";
      }

      setUiState({ score: s.score, lives: s.lives, phase: s.phase });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [moveGhost, resetPositions]);

  const handleClick = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "playing") startGame();
  }, [startGame]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex gap-6 text-sm font-mono">
        <span className="text-yellow-400">Score: {uiState.score}</span>
        {highScore > 0 && <span className="text-purple-400">Best: {highScore}</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        style={{ maxWidth: "100%", borderRadius: "8px", cursor: "pointer", touchAction: "none" }}
      />
      <p className="text-xs text-gray-400">Arrow keys or swipe to move • Eat power pellets to scare ghosts</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function PacMazeGame() {
  return (
    <CalculatorVerticalLayout
      title="Pac Maze - Classic Pac-Man Style Game Online"
      description="Navigate a 20x20 maze, eat all dots, and avoid 4 colored ghosts. Power pellets let you turn the tables! Free online Pac-Man style game."
      canonical="https://www.smartkitnow.com/games/pac-maze"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Pac Maze</h2>
          <p>Pac Maze is a classic Pac-Man inspired maze game. Guide your yellow character through a 20x20 maze, eating dots and avoiding the four colored ghosts.</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Arrow Keys:</strong> Move up, down, left, right.</li>
            <li><strong>Swipe:</strong> Swipe in any direction on mobile.</li>
          </ul>
          <h3>Scoring</h3>
          <ul>
            <li>Regular dot: 10 points</li>
            <li>Power pellet (large dot): 50 points</li>
            <li>Eating a frightened ghost: 200 points</li>
          </ul>
          <h3>Ghost Behavior</h3>
          <ul>
            <li>Ghosts alternate between <strong>chase</strong> (targeting you) and <strong>scatter</strong> (retreating to corners) modes.</li>
            <li>Eat a power pellet to send ghosts into <strong>flee</strong> mode for 7 seconds — then eat them for bonus points!</li>
            <li>Each ghost has a unique color and slightly different targeting strategy.</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
