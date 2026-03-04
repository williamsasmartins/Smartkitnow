import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "READY" | "PLAYING" | "GAME_OVER";
type SpeedMode = "slow" | "normal" | "fast";

interface Tile {
  id: number;
  col: number;       // 0-3
  y: number;         // top Y in canvas coords
  height: number;
  tapped: boolean;
  tapFlash: number;  // countdown frames for glow
}

// ─── Audio helpers ────────────────────────────────────────────────────────────

function createAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

const COL_FREQS = [261.63, 329.63, 392.0, 493.88]; // C4, E4, G4, B4

function playPianoNote(ctx: AudioContext | null, col: number): void {
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(COL_FREQS[col] ?? 261.63, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* silent */ }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const HS_KEY = "piano-tiles-hs";

function getHighScore(): number {
  try { return parseInt(localStorage.getItem(HS_KEY) ?? "0", 10); } catch { return 0; }
}

function saveHighScore(score: number): void {
  try {
    if (score > getHighScore()) localStorage.setItem(HS_KEY, String(score));
  } catch { /* silent */ }
}

// ─── Speed configs ────────────────────────────────────────────────────────────

const SPEED_CONFIGS: Record<SpeedMode, { baseSpeed: number; label: string }> = {
  slow:   { baseSpeed: 2.5, label: "Slow" },
  normal: { baseSpeed: 4.5, label: "Normal" },
  fast:   { baseSpeed: 7.5, label: "Fast" },
};

const TILE_HEIGHT_PX = 120;
const SPAWN_GAP = 180; // px between tile tops

// ─── Main Board ───────────────────────────────────────────────────────────────

function PianoTilesBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable game state in refs (avoids stale closure issues in rAF)
  const gameStateRef = useRef<GameState>("READY");
  const tilesRef = useRef<Tile[]>([]);
  const scoreRef = useRef(0);
  const tileIdRef = useRef(0);
  const lastSpawnYRef = useRef(-SPAWN_GAP);
  const speedRef = useRef(4.5);
  const speedModeRef = useRef<SpeedMode>("normal");
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasWRef = useRef(300);
  const canvasHRef = useRef(500);
  const dprRef = useRef(1);

  // React display state
  const [displayState, setDisplayState] = useState<GameState>("READY");
  const [displayScore, setDisplayScore] = useState(0);
  const [displayHs, setDisplayHs] = useState(getHighScore());
  const [speedMode, setSpeedMode] = useState<SpeedMode>("normal");

  // ── Canvas sizing ──────────────────────────────────────────────────────────

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.clientWidth;
    const h = Math.min(Math.round(w * 1.5), 520);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvasWRef.current = w;
    canvasHRef.current = h;
    dprRef.current = dpr;
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  // ── Spawn new tile ─────────────────────────────────────────────────────────

  const spawnTile = useCallback(() => {
    const col = Math.floor(Math.random() * 4);
    const id = tileIdRef.current++;
    tilesRef.current = [
      ...tilesRef.current,
      { id, col, y: lastSpawnYRef.current - SPAWN_GAP, height: TILE_HEIGHT_PX, tapped: false, tapFlash: 0 },
    ];
    lastSpawnYRef.current = lastSpawnYRef.current - SPAWN_GAP;
  }, []);

  // ── Draw frame ─────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;
    const W = canvasWRef.current;
    const H = canvasHRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colW = W / 4;

    // Background
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, W, H);

    // Column dividers
    for (let i = 1; i < 4; i++) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(i * colW, 0);
      ctx.lineTo(i * colW, H);
      ctx.stroke();
    }

    // Ground line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H - 2);
    ctx.lineTo(W, H - 2);
    ctx.stroke();

    // Tiles
    for (const tile of tilesRef.current) {
      const x = tile.col * colW;
      const y = tile.y;

      if (tile.tapped) {
        // Glow flash on tap
        ctx.fillStyle = `rgba(99, 102, 241, ${tile.tapFlash / 10})`;
        ctx.fillRect(x + 2, y + 2, colW - 4, tile.height - 4);
      } else {
        // Regular black tile with subtle border
        ctx.fillStyle = "#1e1e2e";
        ctx.fillRect(x + 3, y + 2, colW - 6, tile.height - 4);
        // Highlight border
        ctx.strokeStyle = "rgba(99,102,241,0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 3, y + 2, colW - 6, tile.height - 4);
      }
    }

    // HUD
    if (gameStateRef.current === "PLAYING") {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, 48);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(20 * (W / 300))}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, 32);
    }

    if (gameStateRef.current === "READY") {
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(22 * (W / 300))}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Tap a tile to start!", W / 2, H / 2 - 10);
      ctx.font = `${Math.round(14 * (W / 300))}px system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("Don't miss any tile", W / 2, H / 2 + 20);
    }
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== "PLAYING") return;

    const H = canvasHRef.current;
    const speed = speedRef.current;

    // Move tiles down
    const nextTiles: Tile[] = [];
    let missed = false;

    for (const tile of tilesRef.current) {
      const newY = tile.y + speed;
      // Check if un-tapped tile passed the bottom
      if (!tile.tapped && newY + tile.height > H) {
        missed = true;
        break;
      }
      // Decrease flash
      const newFlash = tile.tapped ? Math.max(0, tile.tapFlash - 1) : 0;
      // Remove old tapped tiles that are off-screen
      if (tile.tapped && newFlash === 0 && newY > H + 20) continue;
      nextTiles.push({ ...tile, y: newY, tapFlash: newFlash });
    }

    if (missed) {
      gameStateRef.current = "GAME_OVER";
      saveHighScore(scoreRef.current);
      setDisplayState("GAME_OVER");
      setDisplayHs(getHighScore());
      draw();
      return;
    }

    tilesRef.current = nextTiles;

    // Spawn new tiles as needed
    const topMostY = Math.min(...nextTiles.filter(t => !t.tapped).map(t => t.y), 0);
    if (topMostY > -SPAWN_GAP * 0.5) {
      spawnTile();
      // Increase speed every 10 tiles
      if (scoreRef.current > 0 && scoreRef.current % 10 === 0) {
        speedRef.current = Math.min(speedRef.current + 0.3, SPEED_CONFIGS[speedModeRef.current].baseSpeed + 6);
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw, spawnTile]);

  // ── Start game ─────────────────────────────────────────────────────────────

  const startGame = useCallback((col: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioCtx();
    }
    gameStateRef.current = "PLAYING";
    tilesRef.current = [];
    scoreRef.current = 0;
    tileIdRef.current = 0;
    lastSpawnYRef.current = -SPAWN_GAP;
    speedRef.current = SPEED_CONFIGS[speedModeRef.current].baseSpeed;
    setDisplayScore(0);
    setDisplayState("PLAYING");

    // Pre-fill some tiles
    for (let i = 0; i < 5; i++) spawnTile();

    // Tap the initial tile that the user clicked
    const W = canvasWRef.current;
    const H = canvasHRef.current;
    const colW = W / 4;
    // Find any tile in that col near the bottom
    const target = tilesRef.current.find(t => t.col === col && !t.tapped);
    if (target) {
      target.tapped = true;
      target.tapFlash = 10;
      scoreRef.current = 1;
      setDisplayScore(1);
      playPianoNote(audioCtxRef.current, col);
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [spawnTile, gameLoop]);

  const restartGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    gameStateRef.current = "READY";
    tilesRef.current = [];
    scoreRef.current = 0;
    tileIdRef.current = 0;
    lastSpawnYRef.current = -SPAWN_GAP;
    setDisplayScore(0);
    setDisplayState("READY");
    draw();
  }, [draw]);

  // ── Handle tap/click ───────────────────────────────────────────────────────

  const handleCanvasPointer = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const W = canvasWRef.current;
    const H = canvasHRef.current;
    const colW = W / 4;
    const col = Math.floor((x / W) * 4);

    if (gameStateRef.current === "READY") {
      startGame(col);
      return;
    }
    if (gameStateRef.current !== "PLAYING") return;

    // Find topmost un-tapped tile in this column that contains the Y
    let hit = false;
    for (const tile of tilesRef.current) {
      if (tile.col === col && !tile.tapped && y >= tile.y && y <= tile.y + tile.height) {
        tile.tapped = true;
        tile.tapFlash = 10;
        scoreRef.current += 1;
        setDisplayScore(scoreRef.current);
        playPianoNote(audioCtxRef.current, col);
        hit = true;
        break;
      }
    }

    if (!hit) {
      // Clicked white space → game over
      gameStateRef.current = "GAME_OVER";
      saveHighScore(scoreRef.current);
      setDisplayState("GAME_OVER");
      setDisplayHs(getHighScore());
    }
  }, [startGame]);

  // ── Initial draw + cleanup ─────────────────────────────────────────────────

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Draw on resize
  useEffect(() => {
    draw();
  });

  const handleSpeedChange = (mode: SpeedMode) => {
    setSpeedMode(mode);
    speedModeRef.current = mode;
  };

  return (
    <div className="space-y-4">
      {/* Speed selector */}
      <div className="flex gap-2 justify-center">
        {(["slow", "normal", "fast"] as SpeedMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleSpeedChange(m)}
            disabled={displayState === "PLAYING"}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all disabled:opacity-40 ${
              speedMode === m
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
            }`}
          >
            {SPEED_CONFIGS[m].label}
          </button>
        ))}
      </div>

      {/* Score display */}
      <div className="flex justify-between px-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
        <span>Score: <span className="text-indigo-600 dark:text-indigo-400 font-black">{displayScore}</span></span>
        <span>Best: <span className="text-amber-500 font-black">{displayHs}</span></span>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full relative">
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointer}
          className="block w-full touch-none rounded-xl overflow-hidden cursor-pointer"
          style={{ background: "#0d0d0d" }}
        />

        {/* Game Over overlay */}
        {displayState === "GAME_OVER" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl gap-4">
            <div className="text-white text-center">
              <p className="text-3xl font-black">{displayScore}</p>
              <p className="text-slate-300 text-sm">tiles tapped</p>
              {displayScore >= displayHs && displayScore > 0 && (
                <p className="text-amber-400 font-bold mt-1">New High Score!</p>
              )}
              <p className="text-slate-400 text-sm mt-1">Best: {displayHs}</p>
            </div>
            <button
              onClick={restartGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function PianoTilesGame({
  title = "Piano Tiles Speed",
  description = "Test your reflexes! Tap the falling piano tiles before they reach the bottom. Miss one and it's game over. How many can you tap?",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p>
          Piano Tiles Speed is a reflex game where black tiles fall from the top of the screen across four columns.
          Your goal is to tap each tile before it reaches the bottom.
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Choose your speed: Slow, Normal, or Fast.</li>
          <li>Tap any tile to start the game.</li>
          <li>Keep tapping tiles as they fall — each tap plays a piano note.</li>
          <li>If a tile reaches the bottom without being tapped, the game ends.</li>
          <li>If you tap the white (empty) area between tiles, the game also ends.</li>
          <li>The tiles fall faster as your score increases.</li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips for High Scores</h2>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Stay centered:</strong> Keep your finger near the middle of the screen so you can reach any column quickly.</li>
          <li><strong>Look ahead:</strong> Don't just focus on the tile directly in front of you — scan for the next incoming tile.</li>
          <li><strong>Start slow:</strong> Master Slow mode before switching to Normal or Fast. Good technique transfers to higher speeds.</li>
          <li><strong>Use two thumbs on mobile:</strong> Two-thumb technique lets you alternate columns much faster than one finger.</li>
          <li><strong>Don't panic:</strong> Rushing causes misclicks. Stay calm and tap deliberately.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">What are the piano notes played?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Each column corresponds to a note: C4 (261 Hz), E4 (329 Hz), G4 (392 Hz), and B4 (493 Hz). Together they form a C major 7th chord arpeggio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Why does the game end when I tap white space?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              This is the core mechanic of Piano Tiles — precision matters just as much as speed. You must only tap the dark tiles, not the gaps between them.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Is my high score saved?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes, your best score is saved in your browser's localStorage and persists between sessions. High scores are global across all speed modes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Does the speed increase during play?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — tiles gradually speed up as your score increases, with a small bump every 10 tiles tapped. This keeps the game challenging as you improve.
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
      widget={<PianoTilesBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
