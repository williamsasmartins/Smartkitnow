import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameState = "SETUP" | "PLAYING" | "PAUSED" | "GAME_OVER";
type Difficulty = "slow" | "normal" | "fast";
type ViewMode = "EMBEDDED" | "THEATER";

interface Point { x: number; y: number; }

// ─── Constants ────────────────────────────────────────────────────────────────
const CELL = 18;
const MIN_GRID = 16;

const DIFFICULTY_SPEED: Record<Difficulty, number> = {
  slow: 350,
  normal: 200,
  fast: 100,
};

const HIGH_SCORE_KEY = "snake-classic-hs";
const BG_COLOR = "#111111";
const SNAKE_COLOR = "#4ade80";
const SNAKE_HEAD_COLOR = "#86efac";
const FOOD_COLOR = "#f87171";
const GRID_LINE_COLOR = "#1a1a1a";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomFood(snake: Point[], cols: number, rows: number): Point {
  let pos: Point;
  do {
    pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function nextHead(head: Point, dir: Direction, cols: number, rows: number): Point {
  const map: Record<Direction, Point> = {
    UP:    { x: head.x, y: (head.y - 1 + rows) % rows },
    DOWN:  { x: head.x, y: (head.y + 1) % rows },
    LEFT:  { x: (head.x - 1 + cols) % cols, y: head.y },
    RIGHT: { x: (head.x + 1) % cols, y: head.y },
  };
  return map[dir];
}

function hitSelf(head: Point, body: Point[]): boolean {
  return body.slice(1).some(s => s.x === head.x && s.y === head.y);
}

// ─── Snake Canvas Component (Inner) ───────────────────────────────────────────
function SnakeBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(MIN_GRID);
  const [rows, setRows] = useState(MIN_GRID);
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10) || 0; }
    catch { return 0; }
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [viewMode, setViewMode] = useState<ViewMode>("EMBEDDED");
  const [canvasSize, setCanvasSize] = useState({ w: MIN_GRID * CELL, h: MIN_GRID * CELL });

  // Game state refs (for tick loop without stale closures)
  const snakeRef = useRef<Point[]>([{ x: 8, y: 8 }]);
  const dirRef = useRef<Direction>("RIGHT");
  const pendingDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 4, y: 4 });
  const scoreRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<GameState>("SETUP");
  const colsRef = useRef(MIN_GRID);
  const rowsRef = useRef(MIN_GRID);
  const diffRef = useRef<Difficulty>("normal");
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keep refs in sync
  useEffect(() => { stateRef.current = gameState; }, [gameState]);
  useEffect(() => { diffRef.current = difficulty; }, [difficulty]);

  // ResizeObserver: calculate grid from container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = el.clientWidth || MIN_GRID * CELL;
      const h = viewMode === "THEATER" ? Math.min(window.innerHeight * 0.65, 480) : Math.min(w, 360);
      const c = Math.max(MIN_GRID, Math.floor(w / CELL));
      const r = Math.max(MIN_GRID, Math.floor(h / CELL));
      const actualW = c * CELL;
      const actualH = r * CELL;
      setCols(c); setRows(r);
      colsRef.current = c; rowsRef.current = r;
      setCanvasSize({ w: actualW, h: actualH });
    };

    updateSize();
    const obs = new ResizeObserver(updateSize);
    obs.observe(el);
    return () => obs.disconnect();
  }, [viewMode]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c = colsRef.current;
    const r = rowsRef.current;

    // Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= c; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, r * CELL); ctx.stroke();
    }
    for (let y = 0; y <= r; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(c * CELL, y * CELL); ctx.stroke();
    }

    // Food
    const f = foodRef.current;
    ctx.fillStyle = FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
      const pad = i === 0 ? 1 : 2;
      ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    });

    // Game Over overlay
    if (stateRef.current === "GAME_OVER") {
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = FOOD_COLOR;
      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "18px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 15);
      ctx.fillStyle = "#aaa";
      ctx.font = "14px monospace";
      ctx.fillText("Press Start to play again", canvas.width / 2, canvas.height / 2 + 45);
    }

    // Paused overlay
    if (stateRef.current === "PAUSED") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    }
  }, []);

  // Game tick
  const tick = useCallback(() => {
    if (stateRef.current !== "PLAYING") return;

    dirRef.current = pendingDirRef.current;
    const snake = snakeRef.current;
    const c = colsRef.current;
    const r = rowsRef.current;
    const head = nextHead(snake[0], dirRef.current, c, r);

    if (hitSelf(head, snake)) {
      stateRef.current = "GAME_OVER";
      setGameState("GAME_OVER");
      setHighScore(prev => {
        const hs = Math.max(prev, scoreRef.current);
        try { localStorage.setItem(HIGH_SCORE_KEY, String(hs)); } catch {}
        return hs;
      });
      draw();
      return;
    }

    const ateFood = head.x === foodRef.current.x && head.y === foodRef.current.y;
    const newSnake = [head, ...snake];
    if (!ateFood) newSnake.pop();

    snakeRef.current = newSnake;

    if (ateFood) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      foodRef.current = randomFood(newSnake, c, r);
    }

    draw();

    // Speed up every 5 foods
    const baseSpeed = DIFFICULTY_SPEED[diffRef.current];
    const speedReduction = Math.floor(scoreRef.current / 5) * 15;
    const speed = Math.max(80, baseSpeed - speedReduction);

    tickRef.current = setTimeout(tick, speed);
  }, [draw]);

  const startGame = useCallback(() => {
    if (tickRef.current) clearTimeout(tickRef.current);
    const c = colsRef.current;
    const r = rowsRef.current;
    const cx = Math.floor(c / 2);
    const cy = Math.floor(r / 2);
    const initSnake: Point[] = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    snakeRef.current = initSnake;
    dirRef.current = "RIGHT";
    pendingDirRef.current = "RIGHT";
    foodRef.current = randomFood(initSnake, c, r);
    scoreRef.current = 0;
    setScore(0);
    stateRef.current = "PLAYING";
    setGameState("PLAYING");
    draw();
    tickRef.current = setTimeout(tick, DIFFICULTY_SPEED[difficulty]);
  }, [draw, tick, difficulty]);

  const togglePause = useCallback(() => {
    if (stateRef.current === "PLAYING") {
      if (tickRef.current) clearTimeout(tickRef.current);
      stateRef.current = "PAUSED";
      setGameState("PAUSED");
      draw();
    } else if (stateRef.current === "PAUSED") {
      stateRef.current = "PLAYING";
      setGameState("PLAYING");
      tickRef.current = setTimeout(tick, DIFFICULTY_SPEED[diffRef.current]);
    }
  }, [draw, tick]);

  // Keyboard controls
  useEffect(() => {
    const OPPOSITE: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    const KEY_MAP: Record<string, Direction> = {
      ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
      w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
    };

    const handler = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        if (stateRef.current === "PLAYING" && dir !== OPPOSITE[dirRef.current]) {
          pendingDirRef.current = dir;
        }
      }
      if (e.key === " " || e.key === "Escape") {
        e.preventDefault();
        if (stateRef.current === "PLAYING" || stateRef.current === "PAUSED") {
          togglePause();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePause]);

  // Swipe controls on canvas
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    const OPPOSITE: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    let dir: Direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? "RIGHT" : "LEFT";
    } else {
      dir = dy > 0 ? "DOWN" : "UP";
    }
    if (stateRef.current === "PLAYING" && dir !== OPPOSITE[dirRef.current]) {
      pendingDirRef.current = dir;
    }
  };

  // D-pad button handler
  const dpadMove = (dir: Direction) => {
    const OPPOSITE: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    if (stateRef.current === "PLAYING" && dir !== OPPOSITE[dirRef.current]) {
      pendingDirRef.current = dir;
    }
  };

  // Draw on canvas size change
  useEffect(() => { draw(); }, [canvasSize, draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 font-mono select-none">
      {/* Header bar */}
      <div className="flex gap-3 w-full justify-between items-center flex-wrap">
        <div className="flex gap-3">
          <div className="bg-gray-900 rounded px-3 py-1.5 text-center border border-gray-700">
            <div className="text-xs text-gray-500 uppercase">Score</div>
            <div className="text-xl font-bold text-green-400">{score}</div>
          </div>
          <div className="bg-gray-900 rounded px-3 py-1.5 text-center border border-gray-700">
            <div className="text-xs text-gray-500 uppercase">Best</div>
            <div className="text-xl font-bold text-yellow-400">{highScore}</div>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          {(["slow", "normal", "fast"] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              disabled={gameState === "PLAYING" || gameState === "PAUSED"}
              className={`px-2 py-1 rounded text-xs font-bold capitalize transition-colors ${
                difficulty === d ? "bg-green-700 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setViewMode(v => v === "EMBEDDED" ? "THEATER" : "EMBEDDED")}
            className="px-2 py-1 rounded text-xs font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Toggle Theater Mode"
          >
            {viewMode === "EMBEDDED" ? "Theater" : "Exit"}
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="w-full">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{
            display: "block",
            backgroundColor: BG_COLOR,
            borderRadius: 4,
            border: "2px solid #333",
            touchAction: "none",
            cursor: "crosshair",
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center flex-wrap justify-center">
        {gameState === "SETUP" || gameState === "GAME_OVER" ? (
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-green-700 hover:bg-green-600 active:bg-green-800 text-white font-bold rounded-lg transition-colors"
          >
            {gameState === "GAME_OVER" ? "Restart" : "Start Game"}
          </button>
        ) : (
          <button
            onClick={togglePause}
            className="px-6 py-2.5 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
          >
            {gameState === "PAUSED" ? "Resume" : "Pause"}
          </button>
        )}
      </div>

      {/* D-pad for mobile */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          onPointerDown={() => dpadMove("UP")}
          className="w-12 h-12 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold rounded-lg text-xl flex items-center justify-center transition-colors"
          aria-label="Up"
        >▲</button>
        <div className="flex gap-1">
          <button
            onPointerDown={() => dpadMove("LEFT")}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold rounded-lg text-xl flex items-center justify-center transition-colors"
            aria-label="Left"
          >◀</button>
          <div className="w-12 h-12 bg-gray-800 rounded-lg" />
          <button
            onPointerDown={() => dpadMove("RIGHT")}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold rounded-lg text-xl flex items-center justify-center transition-colors"
            aria-label="Right"
          >▶</button>
        </div>
        <button
          onPointerDown={() => dpadMove("DOWN")}
          className="w-12 h-12 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-bold rounded-lg text-xl flex items-center justify-center transition-colors"
          aria-label="Down"
        >▼</button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Arrow keys / WASD to move. Space to pause. Swipe or use D-pad on mobile.
      </p>
    </div>
  );
}

// ─── Exported Page Component ───────────────────────────────────────────────────
export default function SnakeClassicGame({
  title = "Snake Classic",
  description = "Play the retro Nokia-style Snake game. Eat food, grow longer, don't eat yourself!",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play Snake</h2>
        <p>
          Snake is the iconic Nokia mobile game where you guide a growing snake around the screen,
          eating food to score points while avoiding collisions with your own tail.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to change the snake's direction.
            On mobile, use the on-screen D-pad or swipe on the game area.
          </li>
          <li>
            Eat the <strong>red food</strong> to grow longer and earn a point.
          </li>
          <li>
            The snake <strong>wraps around edges</strong> — going off the right side brings you back
            from the left. There are no walls to die on.
          </li>
          <li>
            The game ends when the snake <strong>runs into itself</strong>.
          </li>
          <li>
            Speed increases every 5 foods eaten, so stay sharp!
          </li>
        </ul>
        <p className="mt-4">
          Press <strong>Space</strong> or click the <em>Pause</em> button to pause at any time.
          Use <strong>Theater Mode</strong> for a larger view.
        </p>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips &amp; Strategies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Stay near the edges early on:</strong> When the snake is short, circling the
            perimeter gives you time to react and avoids cutting yourself off.
          </li>
          <li>
            <strong>Plan your path to food:</strong> Don't just head directly at the food if it will
            trap you. Approach from a direction that keeps open escape routes.
          </li>
          <li>
            <strong>Use wrap-around strategically:</strong> Wrapping can be a shortcut or an escape
            move. Don't forget that going off any edge brings you back from the opposite side.
          </li>
          <li>
            <strong>Move in open space:</strong> As the snake grows, keep it in large open areas.
            Avoid coiling too tightly in corners.
          </li>
          <li>
            <strong>Slow mode to practice:</strong> Learn the patterns on Slow mode, then challenge
            yourself on Normal and Fast.
          </li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Does the snake die when hitting walls?</h3>
            <p>
              No — the snake wraps around the edges (teleports through walls). The only way to lose
              is by running into your own body.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How fast does the game get?</h3>
            <p>
              The speed increases by 15ms per every 5 foods eaten, down to a minimum of 80ms between
              ticks. On Fast mode, it starts at 100ms and gets extremely quick.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is my high score saved?</h3>
            <p>Yes, it's saved in localStorage and persists between browser sessions.</p>
          </div>
          <div>
            <h3 className="font-semibold">Does it work on mobile?</h3>
            <p>
              Yes. Use the on-screen D-pad buttons or swipe directly on the game canvas (20px
              threshold) to control the snake.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<SnakeBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
