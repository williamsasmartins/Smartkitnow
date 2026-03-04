import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 520;
const H = 520;
const BALL_R = 12;
const FRICTION = 0.92;
const FORCE = 0.45;

interface Rect { x: number; y: number; w: number; h: number }
interface Hole { x: number; y: number; r: number }
interface Level {
  walls: Rect[];
  holes: Hole[];
  exit: Rect;
  startX: number;
  startY: number;
}

// ─── 10 Pre-defined Maze Layouts ─────────────────────────────────────────────
const LEVELS: Level[] = [
  // Level 1 — Simple corridor
  {
    startX: 50, startY: 50,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 20, y: 100, w: 300, h: 20 }, { x: 100, y: 200, w: 20, h: 200 },
      { x: 200, y: 300, w: 280, h: 20 },
    ],
    holes: [{ x: 420, y: 150, r: 16 }],
    exit: { x: 420, y: 430, w: 50, h: 50 },
  },
  // Level 2
  {
    startX: 50, startY: 50,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 100, y: 20, w: 20, h: 200 }, { x: 200, y: 150, w: 200, h: 20 },
      { x: 300, y: 20, w: 20, h: 150 }, { x: 100, y: 300, w: 300, h: 20 },
      { x: 200, y: 300, w: 20, h: 180 },
    ],
    holes: [{ x: 250, y: 80, r: 16 }, { x: 450, y: 400, r: 16 }],
    exit: { x: 430, y: 30, w: 50, h: 50 },
  },
  // Level 3
  {
    startX: 40, startY: 40,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 120, y: 20, w: 20, h: 250 }, { x: 250, y: 270, w: 20, h: 230 },
      { x: 20, y: 270, w: 250, h: 20 }, { x: 370, y: 20, w: 20, h: 250 },
      { x: 370, y: 270, w: 130, h: 20 },
    ],
    holes: [{ x: 320, y: 140, r: 16 }, { x: 160, y: 390, r: 16 }],
    exit: { x: 420, y: 420, w: 50, h: 50 },
  },
  // Level 4 — Spiral-like
  {
    startX: 40, startY: 40,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 80, y: 80, w: 360, h: 20 }, { x: 80, y: 80, w: 20, h: 280 },
      { x: 80, y: 360, w: 260, h: 20 }, { x: 340, y: 200, w: 20, h: 160 },
      { x: 160, y: 200, w: 180, h: 20 }, { x: 160, y: 200, w: 20, h: 100 },
      { x: 160, y: 300, w: 120, h: 20 },
    ],
    holes: [{ x: 440, y: 200, r: 16 }, { x: 260, y: 260, r: 16 }],
    exit: { x: 430, y: 420, w: 50, h: 50 },
  },
  // Level 5
  {
    startX: 40, startY: 260,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 100, y: 20, w: 20, h: 160 }, { x: 100, y: 240, w: 20, h: 240 },
      { x: 200, y: 100, w: 20, h: 100 }, { x: 200, y: 280, w: 20, h: 200 },
      { x: 300, y: 20, w: 20, h: 200 }, { x: 300, y: 300, w: 20, h: 180 },
      { x: 400, y: 100, w: 20, h: 320 },
    ],
    holes: [{ x: 150, y: 200, r: 16 }, { x: 350, y: 260, r: 16 }, { x: 450, y: 60, r: 16 }],
    exit: { x: 430, y: 430, w: 50, h: 50 },
  },
  // Level 6
  {
    startX: 260, startY: 40,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 20, y: 120, w: 380, h: 20 }, { x: 20, y: 240, w: 100, h: 20 },
      { x: 200, y: 240, w: 280, h: 20 }, { x: 20, y: 360, w: 380, h: 20 },
      { x: 380, y: 20, w: 20, h: 120 }, { x: 120, y: 120, w: 20, h: 120 },
      { x: 380, y: 240, w: 20, h: 120 },
    ],
    holes: [{ x: 460, y: 300, r: 16 }, { x: 70, y: 300, r: 16 }],
    exit: { x: 40, y: 420, w: 50, h: 50 },
  },
  // Level 7
  {
    startX: 40, startY: 40,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 140, y: 20, w: 20, h: 340 }, { x: 280, y: 160, w: 20, h: 340 },
      { x: 20, y: 200, w: 140, h: 20 }, { x: 280, y: 340, w: 200, h: 20 },
      { x: 420, y: 20, w: 20, h: 340 },
    ],
    holes: [{ x: 200, y: 80, r: 16 }, { x: 360, y: 440, r: 16 }, { x: 460, y: 200, r: 16 }],
    exit: { x: 40, y: 430, w: 50, h: 50 },
  },
  // Level 8
  {
    startX: 260, startY: 260,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 20, y: 160, w: 480, h: 20 }, { x: 20, y: 340, w: 480, h: 20 },
      { x: 160, y: 20, w: 20, h: 140 }, { x: 340, y: 20, w: 20, h: 140 },
      { x: 160, y: 360, w: 20, h: 140 }, { x: 340, y: 360, w: 20, h: 140 },
      { x: 160, y: 160, w: 200, h: 20 }, { x: 160, y: 340, w: 200, h: 20 },
      { x: 160, y: 160, w: 20, h: 180 }, { x: 340, y: 160, w: 20, h: 180 },
    ],
    holes: [{ x: 90, y: 90, r: 16 }, { x: 430, y: 430, r: 16 }, { x: 90, y: 430, r: 16 }, { x: 430, y: 90, r: 16 }],
    exit: { x: 230, y: 220, w: 60, h: 60 },
  },
  // Level 9
  {
    startX: 40, startY: 40,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 60, y: 60, w: 20, h: 400 }, { x: 60, y: 440, w: 400, h: 20 },
      { x: 440, y: 60, w: 20, h: 400 }, { x: 60, y: 60, w: 400, h: 20 },
      { x: 130, y: 130, w: 20, h: 260 }, { x: 130, y: 370, w: 260, h: 20 },
      { x: 370, y: 130, w: 20, h: 260 }, { x: 130, y: 130, w: 260, h: 20 },
      { x: 200, y: 200, w: 120, h: 20 }, { x: 200, y: 200, w: 20, h: 120 },
      { x: 200, y: 300, w: 120, h: 20 }, { x: 300, y: 200, w: 20, h: 120 },
    ],
    holes: [{ x: 95, y: 95, r: 16 }, { x: 425, y: 425, r: 16 }, { x: 95, y: 425, r: 16 }],
    exit: { x: 220, y: 220, w: 60, h: 60 },
  },
  // Level 10 — Boss
  {
    startX: 40, startY: 260,
    walls: [
      { x: 0, y: 0, w: W, h: 20 }, { x: 0, y: H - 20, w: W, h: 20 },
      { x: 0, y: 0, w: 20, h: H }, { x: W - 20, y: 0, w: 20, h: H },
      { x: 80, y: 20, w: 20, h: 120 }, { x: 80, y: 200, w: 20, h: 100 },
      { x: 80, y: 360, w: 20, h: 140 }, { x: 160, y: 20, w: 20, h: 80 },
      { x: 160, y: 160, w: 20, h: 200 }, { x: 160, y: 420, w: 20, h: 80 },
      { x: 240, y: 20, w: 20, h: 180 }, { x: 240, y: 280, w: 20, h: 220 },
      { x: 320, y: 100, w: 20, h: 200 }, { x: 320, y: 360, w: 20, h: 140 },
      { x: 400, y: 20, w: 20, h: 300 }, { x: 400, y: 380, w: 20, h: 120 },
      { x: 80, y: 140, w: 100, h: 20 }, { x: 240, y: 240, w: 100, h: 20 },
      { x: 320, y: 320, w: 100, h: 20 }, { x: 160, y: 380, w: 80, h: 20 },
    ],
    holes: [
      { x: 200, y: 80, r: 16 }, { x: 360, y: 60, r: 16 },
      { x: 460, y: 200, r: 16 }, { x: 280, y: 380, r: 16 },
      { x: 120, y: 440, r: 16 },
    ],
    exit: { x: 430, y: 430, w: 50, h: 50 },
  },
];

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    phase: "menu" as "menu" | "playing" | "gameover" | "win" | "nextlevel",
    level: 0,
    lives: 3,
    bx: 50, by: 50, bvx: 0, bvy: 0,
    keys: { up: false, down: false, left: false, right: false },
    nextLevelTimer: 0,
  });
  const animRef = useRef<number>(0);
  const [uiState, setUiState] = useState({ level: 1, lives: 3, phase: "menu" as string });

  const loadLevel = useCallback((lvlIdx: number) => {
    const lv = LEVELS[lvlIdx];
    const s = stateRef.current;
    s.bx = lv.startX;
    s.by = lv.startY;
    s.bvx = 0;
    s.bvy = 0;
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.phase = "playing";
    s.level = 0;
    s.lives = 3;
    loadLevel(0);
  }, [loadLevel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = stateRef.current.keys;
      if (e.key === "ArrowUp") { k.up = down; e.preventDefault(); }
      if (e.key === "ArrowDown") { k.down = down; e.preventDefault(); }
      if (e.key === "ArrowLeft") { k.left = down; e.preventDefault(); }
      if (e.key === "ArrowRight") { k.right = down; e.preventDefault(); }
    };
    const onDown = (e: KeyboardEvent) => onKey(e, true);
    const onUp = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  const circleRect = (cx: number, cy: number, r: number, rx: number, ry: number, rw: number, rh: number) => {
    const nearX = Math.max(rx, Math.min(rx + rw, cx));
    const nearY = Math.max(ry, Math.min(ry + rh, cy));
    const dx = cx - nearX;
    const dy = cy - nearY;
    return dx * dx + dy * dy < r * r;
  };

  const resolveWall = (bx: number, by: number, bvx: number, bvy: number, wall: Rect) => {
    let nx = bx, ny = by, nvx = bvx, nvy = bvy;
    const cx = wall.x + wall.w / 2;
    const cy = wall.y + wall.h / 2;
    const overlapX = (wall.w / 2 + BALL_R) - Math.abs(bx - cx);
    const overlapY = (wall.h / 2 + BALL_R) - Math.abs(by - cy);

    if (overlapX < overlapY) {
      nx = bx < cx ? cx - wall.w / 2 - BALL_R : cx + wall.w / 2 + BALL_R;
      nvx = -nvx * 0.5;
    } else {
      ny = by < cy ? cy - wall.h / 2 - BALL_R : cy + wall.h / 2 + BALL_R;
      nvy = -nvy * 0.5;
    }
    return { bx: nx, by: ny, bvx: nvx, bvy: nvy };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;

      if (s.phase === "playing") {
        const lv = LEVELS[s.level];
        // Apply force from keys
        if (s.keys.left) s.bvx -= FORCE;
        if (s.keys.right) s.bvx += FORCE;
        if (s.keys.up) s.bvy -= FORCE;
        if (s.keys.down) s.bvy += FORCE;

        // Friction
        s.bvx *= FRICTION;
        s.bvy *= FRICTION;

        s.bx += s.bvx;
        s.by += s.bvy;

        // Bounce off canvas edges
        if (s.bx - BALL_R < 0) { s.bx = BALL_R; s.bvx = Math.abs(s.bvx) * 0.5; }
        if (s.bx + BALL_R > W) { s.bx = W - BALL_R; s.bvx = -Math.abs(s.bvx) * 0.5; }
        if (s.by - BALL_R < 0) { s.by = BALL_R; s.bvy = Math.abs(s.bvy) * 0.5; }
        if (s.by + BALL_R > H) { s.by = H - BALL_R; s.bvy = -Math.abs(s.bvy) * 0.5; }

        // Wall collisions
        for (const wall of lv.walls) {
          if (circleRect(s.bx, s.by, BALL_R, wall.x, wall.y, wall.w, wall.h)) {
            const r = resolveWall(s.bx, s.by, s.bvx, s.bvy, wall);
            s.bx = r.bx; s.by = r.by; s.bvx = r.bvx; s.bvy = r.bvy;
          }
        }

        // Hole detection
        for (const hole of lv.holes) {
          const dx = s.bx - hole.x;
          const dy = s.by - hole.y;
          if (Math.sqrt(dx * dx + dy * dy) < hole.r) {
            s.lives--;
            if (s.lives <= 0) { s.phase = "gameover"; }
            else { loadLevel(s.level); }
          }
        }

        // Exit detection
        const ex = lv.exit;
        if (s.bx > ex.x && s.bx < ex.x + ex.w && s.by > ex.y && s.by < ex.y + ex.h) {
          if (s.level >= LEVELS.length - 1) {
            s.phase = "win";
          } else {
            s.level++;
            loadLevel(s.level);
          }
        }
      }

      // ─── Draw ───────────────────────────────────────────────────────
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, W, H);

      if (s.phase === "playing" || s.phase === "gameover" || s.phase === "win") {
        const lv = LEVELS[s.level < LEVELS.length ? s.level : LEVELS.length - 1];

        // Draw exit
        const ex = lv.exit;
        ctx.fillStyle = "#27ae60";
        ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("EXIT", ex.x + ex.w / 2, ex.y + ex.h / 2 + 5);
        ctx.textAlign = "left";

        // Draw walls
        ctx.fillStyle = "#3d5a99";
        for (const wall of lv.walls) {
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
          ctx.strokeStyle = "#6890d0";
          ctx.lineWidth = 1;
          ctx.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.w - 1, wall.h - 1);
        }

        // Draw holes
        for (const hole of lv.holes) {
          const gradient = ctx.createRadialGradient(hole.x, hole.y, 0, hole.x, hole.y, hole.r);
          gradient.addColorStop(0, "#000");
          gradient.addColorStop(1, "#1a1a2e");
          ctx.beginPath();
          ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = "#555";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw ball
        const gradient = ctx.createRadialGradient(s.bx - 3, s.by - 3, 2, s.bx, s.by, BALL_R);
        gradient.addColorStop(0, "#a0cfff");
        gradient.addColorStop(1, "#2980b9");
        ctx.beginPath();
        ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // HUD
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, W, 36);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`Level: ${s.level + 1}/${LEVELS.length}`, 10, 24);
        ctx.textAlign = "right";
        for (let i = 0; i < s.lives; i++) {
          ctx.beginPath();
          ctx.arc(W - 15 - i * 24, 18, 9, 0, Math.PI * 2);
          ctx.fillStyle = "#e74c3c";
          ctx.fill();
        }
        ctx.textAlign = "left";
      }

      // Overlays
      const s = stateRef.current;
      if (s.phase === "menu") {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#3498db";
        ctx.font = "bold 46px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BALL ROLL MAZE", W / 2, H / 2 - 60);
        ctx.fillStyle = "#fff";
        ctx.font = "16px sans-serif";
        ctx.fillText("Tilt the maze to roll the ball to the exit!", W / 2, H / 2 - 20);
        ctx.fillText("Avoid the holes! 3 lives.", W / 2, H / 2 + 10);
        ctx.fillText("Arrow keys to apply force. 10 levels.", W / 2, H / 2 + 40);
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
        ctx.font = "20px sans-serif";
        ctx.fillText(`Reached level ${s.level + 1}`, W / 2, H / 2 + 25);
        ctx.fillText("Click to try again", W / 2, H / 2 + 60);
        ctx.textAlign = "left";
      } else if (s.phase === "win") {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#2ecc71";
        ctx.font = "bold 50px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN!", W / 2, H / 2 - 30);
        ctx.fillStyle = "#ffd700";
        ctx.font = "22px sans-serif";
        ctx.fillText("All 10 levels complete!", W / 2, H / 2 + 15);
        ctx.fillText("Click to play again", W / 2, H / 2 + 50);
        ctx.textAlign = "left";
      }

      setUiState({ level: s.level + 1, lives: s.lives, phase: s.phase });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [loadLevel]);

  const handleClick = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "playing") startGame();
  }, [startGame]);

  // On-screen arrow buttons for mobile
  const moveStart = useCallback((dir: "up" | "down" | "left" | "right") => {
    stateRef.current.keys[dir] = true;
  }, []);
  const moveEnd = useCallback((dir: "up" | "down" | "left" | "right") => {
    stateRef.current.keys[dir] = false;
  }, []);

  const btnStyle: React.CSSProperties = {
    width: 52, height: 52, borderRadius: 8, background: "rgba(255,255,255,0.12)",
    color: "white", fontSize: 22, border: "2px solid rgba(255,255,255,0.3)",
    cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "center",
    touchAction: "none",
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        style={{ maxWidth: "100%", borderRadius: "10px", cursor: "pointer", touchAction: "none" }}
      />
      <div className="flex flex-col items-center gap-1 mt-1">
        <button style={btnStyle}
          onMouseDown={() => moveStart("up")} onMouseUp={() => moveEnd("up")}
          onTouchStart={(e) => { e.preventDefault(); moveStart("up"); }} onTouchEnd={() => moveEnd("up")}>↑</button>
        <div className="flex gap-2">
          <button style={btnStyle}
            onMouseDown={() => moveStart("left")} onMouseUp={() => moveEnd("left")}
            onTouchStart={(e) => { e.preventDefault(); moveStart("left"); }} onTouchEnd={() => moveEnd("left")}>←</button>
          <button style={btnStyle}
            onMouseDown={() => moveStart("down")} onMouseUp={() => moveEnd("down")}
            onTouchStart={(e) => { e.preventDefault(); moveStart("down"); }} onTouchEnd={() => moveEnd("down")}>↓</button>
          <button style={btnStyle}
            onMouseDown={() => moveStart("right")} onMouseUp={() => moveEnd("right")}
            onTouchStart={(e) => { e.preventDefault(); moveStart("right"); }} onTouchEnd={() => moveEnd("right")}>→</button>
        </div>
      </div>
      <p className="text-xs text-gray-400">Arrow keys or on-screen buttons • Reach the green EXIT</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function BallRollMazeGame() {
  return (
    <CalculatorVerticalLayout
      title="Ball Roll Maze - Tilt Physics Maze Game Online"
      description="Roll a ball through 10 challenging maze levels using physics! Avoid holes, reach the exit. Free online tilt maze puzzle game."
      canonical="https://www.smartkitnow.com/games/ball-roll-maze"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Ball Roll Maze</h2>
          <p>Ball Roll Maze is a physics-based tilt maze game. Apply directional force to roll a ball through 10 progressively challenging maze levels to reach the exit.</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Arrow Keys:</strong> Apply force to the ball in that direction.</li>
            <li><strong>On-Screen Buttons:</strong> Tap the arrow buttons for mobile play.</li>
          </ul>
          <h3>Physics</h3>
          <ul>
            <li>The ball has momentum — it continues rolling when you release a key.</li>
            <li>Friction gradually slows the ball to a stop.</li>
            <li>Bounces off walls with reduced velocity.</li>
          </ul>
          <h3>Hazards</h3>
          <ul>
            <li><strong>Black holes:</strong> Roll into one and lose a life. 3 lives total.</li>
            <li>Reach the <strong>green EXIT</strong> tile to advance to the next level.</li>
            <li>10 levels of increasing complexity.</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
