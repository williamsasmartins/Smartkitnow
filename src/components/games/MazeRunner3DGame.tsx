import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const MAZE_SIZE = 15;
const CELL_SIZE = 1;
const FOV = Math.PI / 3;
const NUM_RAYS = 320;
const HALF_FOV = FOV / 2;
const MAX_DEPTH = 20;
const MINIMAP_SCALE = 10;

type MazeCell = 0 | 1; // 0 = open, 1 = wall

function generateMaze(size: number): MazeCell[][] {
  const maze: MazeCell[][] = Array.from({ length: size }, () =>
    Array(size).fill(1)
  );

  const visited: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  function carve(x: number, y: number) {
    visited[y][x] = true;
    maze[y][x] = 0;
    const dirs = [
      [0, -2], [0, 2], [-2, 0], [2, 0],
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && !visited[ny][nx]) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  maze[size - 2][size - 2] = 0;
  return maze;
}

interface PlayerState {
  x: number;
  y: number;
  angle: number;
}

function GameUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [maze, setMaze] = useState<MazeCell[][]>(() => generateMaze(MAZE_SIZE));
  const [player, setPlayer] = useState<PlayerState>({ x: 1.5, y: 1.5, angle: 0 });
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const s = localStorage.getItem("hs_maze-runner-3d");
    return s ? parseInt(s) : null;
  });
  const startTimeRef = useRef<number>(Date.now());
  const playerRef = useRef<PlayerState>({ x: 1.5, y: 1.5, angle: 0 });
  const mazeRef = useRef<MazeCell[][]>(maze);
  const wonRef = useRef(false);

  const resetGame = useCallback(() => {
    const newMaze = generateMaze(MAZE_SIZE);
    const newPlayer = { x: 1.5, y: 1.5, angle: 0 };
    setMaze(newMaze);
    setPlayer(newPlayer);
    setWon(false);
    setElapsed(0);
    wonRef.current = false;
    playerRef.current = newPlayer;
    mazeRef.current = newMaze;
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);

  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, [won]);

  const castRay = useCallback((px: number, py: number, angle: number, mazeData: MazeCell[][]): { dist: number; side: number } => {
    const rayDirX = Math.cos(angle);
    const rayDirY = Math.sin(angle);
    let mapX = Math.floor(px);
    let mapY = Math.floor(py);
    const deltaDistX = Math.abs(1 / (rayDirX || 0.0001));
    const deltaDistY = Math.abs(1 / (rayDirY || 0.0001));
    let stepX: number, stepY: number;
    let sideDistX: number, sideDistY: number;

    if (rayDirX < 0) { stepX = -1; sideDistX = (px - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1 - px) * deltaDistX; }
    if (rayDirY < 0) { stepY = -1; sideDistY = (py - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1 - py) * deltaDistY; }

    let side = 0;
    let hit = false;
    let depth = 0;

    while (!hit && depth < MAX_DEPTH) {
      if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
      else { sideDistY += deltaDistY; mapY += stepY; side = 1; }
      if (mapX >= 0 && mapX < MAZE_SIZE && mapY >= 0 && mapY < MAZE_SIZE && mazeData[mapY][mapX] === 1) hit = true;
      depth++;
    }

    const dist = side === 0
      ? (mapX - px + (1 - stepX) / 2) / (rayDirX || 0.0001)
      : (mapY - py + (1 - stepY) / 2) / (rayDirY || 0.0001);

    return { dist: Math.abs(dist), side };
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const minimap = minimapRef.current;
    if (!canvas || !minimap) return;
    const ctx = canvas.getContext("2d");
    const mctx = minimap.getContext("2d");
    if (!ctx || !mctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const p = playerRef.current;
    const mazeData = mazeRef.current;

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H / 2);
    ctx.fillStyle = "#4a3728";
    ctx.fillRect(0, H / 2, W, H / 2);

    const colWidth = W / NUM_RAYS;
    for (let i = 0; i < NUM_RAYS; i++) {
      const rayAngle = p.angle - HALF_FOV + (i / NUM_RAYS) * FOV;
      const { dist, side } = castRay(p.x, p.y, rayAngle, mazeData);
      const correctedDist = dist * Math.cos(rayAngle - p.angle);
      const wallH = Math.min(H, H / correctedDist);
      const top = (H - wallH) / 2;

      const isExit = Math.floor(p.x + Math.cos(rayAngle) * dist) === MAZE_SIZE - 2 &&
        Math.floor(p.y + Math.sin(rayAngle) * dist) === MAZE_SIZE - 2;

      let baseColor = isExit ? 220 : 180;
      if (side === 1) baseColor = Math.floor(baseColor * 0.7);
      const shade = Math.max(30, Math.min(baseColor, baseColor - dist * 8));
      ctx.fillStyle = isExit ? `rgb(${shade}, ${Math.floor(shade * 0.3)}, 0)` : `rgb(${shade}, ${shade}, ${Math.floor(shade * 0.8)})`;
      ctx.fillRect(i * colWidth, top, colWidth + 1, wallH);
    }

    const mm = MINIMAP_SCALE;
    mctx.clearRect(0, 0, minimap.width, minimap.height);
    mctx.fillStyle = "rgba(0,0,0,0.7)";
    mctx.fillRect(0, 0, minimap.width, minimap.height);
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        if (mazeData[y][x] === 1) {
          mctx.fillStyle = "#888";
          mctx.fillRect(x * mm, y * mm, mm - 1, mm - 1);
        }
        if (x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2) {
          mctx.fillStyle = "#f80";
          mctx.fillRect(x * mm, y * mm, mm - 1, mm - 1);
        }
      }
    }
    mctx.fillStyle = "#0ff";
    mctx.beginPath();
    mctx.arc(p.x * mm, p.y * mm, mm / 2, 0, Math.PI * 2);
    mctx.fill();
    mctx.strokeStyle = "#0ff";
    mctx.lineWidth = 1;
    mctx.beginPath();
    mctx.moveTo(p.x * mm, p.y * mm);
    mctx.lineTo((p.x + Math.cos(p.angle) * 1.5) * mm, (p.y + Math.sin(p.angle) * 1.5) * mm);
    mctx.stroke();
  }, [castRay]);

  const updatePlayer = useCallback(() => {
    if (wonRef.current) return;
    const keys = keysRef.current;
    const speed = 0.05;
    const rotSpeed = 0.04;
    const p = { ...playerRef.current };
    const mazeData = mazeRef.current;

    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) p.angle -= rotSpeed;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) p.angle += rotSpeed;

    let moveX = 0;
    let moveY = 0;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) {
      moveX += Math.cos(p.angle) * speed;
      moveY += Math.sin(p.angle) * speed;
    }
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) {
      moveX -= Math.cos(p.angle) * speed;
      moveY -= Math.sin(p.angle) * speed;
    }

    const nx = p.x + moveX;
    const ny = p.y + moveY;
    const margin = 0.25;
    if (mazeData[Math.floor(p.y)][Math.floor(nx + (moveX > 0 ? margin : -margin))] === 0) p.x = nx;
    if (mazeData[Math.floor(ny + (moveY > 0 ? margin : -margin))][Math.floor(p.x)] === 0) p.y = ny;

    playerRef.current = p;
    setPlayer({ ...p });

    if (Math.floor(p.x) === MAZE_SIZE - 2 && Math.floor(p.y) === MAZE_SIZE - 2) {
      wonRef.current = true;
      setWon(true);
      const t = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setBestTime(prev => {
        const best = prev === null || t < prev ? t : prev;
        try { localStorage.setItem("hs_maze-runner-3d", String(best)); } catch {}
        return best;
      });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { keysRef.current.add(e.key); e.preventDefault(); };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKeyUp); };
  }, []);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      updatePlayer();
      render();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [updatePlayer, render]);

  const pressKey = useCallback((key: string) => keysRef.current.add(key), []);
  const releaseKey = useCallback((key: string) => keysRef.current.delete(key), []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex gap-4 text-sm font-mono text-white bg-gray-900 px-4 py-1 rounded-full">
        <span>Time: {formatTime(elapsed)}</span>
        {bestTime !== null && <span>Best: {formatTime(bestTime)}</span>}
        <span className="text-yellow-400">Exit: bottom-right</span>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={320} height={240} className="border-2 border-gray-600 rounded block" />
        <canvas
          ref={minimapRef}
          width={MAZE_SIZE * MINIMAP_SCALE}
          height={MAZE_SIZE * MINIMAP_SCALE}
          className="absolute top-2 right-2 border border-gray-500 rounded"
          style={{ width: MAZE_SIZE * MINIMAP_SCALE, height: MAZE_SIZE * MINIMAP_SCALE }}
        />
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
            <div className="text-yellow-400 text-2xl font-bold">You Escaped!</div>
            <div className="text-white text-lg mt-1">Time: {formatTime(elapsed)}</div>
            {bestTime !== null && <div className="text-cyan-400 text-sm">Best: {formatTime(bestTime)}</div>}
            <button onClick={resetGame} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
              New Maze
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          onPointerDown={() => pressKey("w")}
          onPointerUp={() => releaseKey("w")}
          onPointerLeave={() => releaseKey("w")}
          className="w-12 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600 active:bg-gray-500"
        >W</button>
        <div className="flex gap-1">
          <button onPointerDown={() => pressKey("a")} onPointerUp={() => releaseKey("a")} onPointerLeave={() => releaseKey("a")}
            className="w-12 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600 active:bg-gray-500">A</button>
          <button onPointerDown={() => pressKey("s")} onPointerUp={() => releaseKey("s")} onPointerLeave={() => releaseKey("s")}
            className="w-12 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600 active:bg-gray-500">S</button>
          <button onPointerDown={() => pressKey("d")} onPointerUp={() => releaseKey("d")} onPointerLeave={() => releaseKey("d")}
            className="w-12 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600 active:bg-gray-500">D</button>
        </div>
        <div className="flex gap-2 mt-1">
          <button onPointerDown={() => pressKey("ArrowLeft")} onPointerUp={() => releaseKey("ArrowLeft")} onPointerLeave={() => releaseKey("ArrowLeft")}
            className="w-10 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600">&#8592;</button>
          <button onPointerDown={() => pressKey("ArrowRight")} onPointerUp={() => releaseKey("ArrowRight")} onPointerLeave={() => releaseKey("ArrowRight")}
            className="w-10 h-10 bg-gray-700 text-white rounded text-sm font-bold hover:bg-gray-600">&#8594;</button>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">WASD / Arrow keys to move. Find the orange exit!</p>
      <button onClick={resetGame} className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">New Maze</button>
    </div>
  );
}

export default function MazeRunner3DGame() {
  return (
    <CalculatorVerticalLayout
      title="Maze Runner 3D - First-Person Maze Game"
      description="Navigate a first-person 3D maze using raycasting. Find the exit as fast as possible! Use WASD or arrow keys to move and rotate."
      canonical="https://www.smartkitnow.com/games/maze-runner-3d"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Maze Runner 3D</h2>
          <p>You are trapped inside a procedurally generated 15x15 maze, viewed from a first-person perspective. Navigate through the corridors and find the glowing orange exit in the bottom-right corner.</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>W / Arrow Up:</strong> Move forward</li>
            <li><strong>S / Arrow Down:</strong> Move backward</li>
            <li><strong>A / Arrow Left:</strong> Rotate left</li>
            <li><strong>D / Arrow Right:</strong> Rotate right</li>
          </ul>
          <h3>Tips</h3>
          <p>Use the minimap in the top-right corner to orient yourself. The orange square on the minimap marks the exit. Your cyan dot shows your current position and facing direction.</p>
          <h3>About the Technology</h3>
          <p>This game uses a classic raycasting rendering technique, the same method used in early 3D games like Wolfenstein 3D. For each screen column, a ray is cast from the player's position at a slightly different angle. When the ray hits a wall, the distance is used to calculate the height of the wall column — farther walls appear shorter.</p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
