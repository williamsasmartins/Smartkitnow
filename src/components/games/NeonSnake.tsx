import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GamePageLayout from "@/components/templates/GamePageLayout";
import { Button } from "@/components/ui/button";
import { Cpu, RotateCcw, Sparkles, User, Gauge } from "lucide-react";
import type { Dir, Pos } from "./neonSnake/engine";
import { step, spawnFood } from "./neonSnake/engine";
import { keyToDir } from "./neonSnake/input";

type Difficulty = "easy" | "medium" | "hard";
type EndState = "win" | "lose" | null;

const GRID_W = 28;
const GRID_H = 20;
const WIN_TARGET = 30;

export default function NeonSnake({ title, description }: { title?: string; description?: string }) {
  const pageTitle = title ?? "Neon Snake";
  const pageDescription =
    description ??
    "Slither through a neon grid. Eat, grow, and avoid collisions. Arrow keys or WASD to move. Reach the target length to win.";

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [dir, setDir] = useState<Dir>("right");
  const [pendingDir, setPendingDir] = useState<Dir | null>(null);
  const [snake, setSnake] = useState<Pos[]>(() => [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }]);
  const [food, setFood] = useState<Pos>(() => spawnFood([{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }], GRID_W, GRID_H));
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [end, setEnd] = useState<EndState>(null);
  const [autoRestartSec, setAutoRestartSec] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [paused, setPaused] = useState(false);
  // Added: explicit "started" flag so the game does NOT auto-start on page load.
  // The main loop is gated by this flag and only begins after clicking Start.
  const [started, setStarted] = useState(false);
  // Allow choosing difficulty and starting level before starting
  const [startDifficulty, setStartDifficulty] = useState<Difficulty>("medium");
  const [startLevel, setStartLevel] = useState<number>(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const loopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [redrawTick, setRedrawTick] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  const speedMs = useMemo(() => {
    const base = difficulty === "easy" ? 240 : difficulty === "medium" ? 140 : 90;
    const delta = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
    const adjusted = base - (Math.max(1, level) - 1) * delta;
    return Math.max(60, adjusted);
  }, [difficulty, level]);

  const statusText = useMemo(() => {
    if (end === "win") return "You won!";
    if (end === "lose") return "Game over!";
    if (paused) return "Paused";
    // When not started yet, show a ready state instead of auto-playing.
    if (!started) return "Ready";
    return "Playing";
  }, [end, paused, started]);

  const overlayText = useMemo(() => {
    if (end === "win") return "You won!";
    if (end === "lose") return "Game over!";
    return "";
  }, [end]);

  function playTone(freq: number, ms: number, type: OscillatorType = "sine") {
    const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    const t0 = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
    o.stop(t0 + ms / 1000);
  }

  const resetGame = useCallback((nextDifficulty?: Difficulty) => {
    setDir("right");
    setPendingDir(null);
    const init = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    setSnake(init);
    setFood(spawnFood(init, GRID_W, GRID_H));
    setScore(0);
    setLevel(1);
    setEnd(null);
    setAutoRestartSec(0);
    setShowConfetti(false);
    setPaused(false);
    // Ensure: resetting returns to "not started" so user must click Start.
    setStarted(false);
    if (nextDifficulty) {
      setDifficulty(nextDifficulty);
      setStartDifficulty(nextDifficulty);
    }
    setStartLevel(1);
  }, []);
  // Start handler: enables main loop and resets tick timer
  function startGame() {
    setStarted(true);
    setDifficulty(startDifficulty);
    setLevel(startLevel);
    lastTickRef.current = 0;
    // Focus canvas so keyboard input is captured immediately after Start
    requestAnimationFrame(() => {
      canvasRef.current?.focus();
    });
  }

  // useCallback to close over the latest started/end/paused/dir
  const enqueueDir = useCallback(
    (d: Dir) => {
      if (end) return;
      if (paused) return;
      if (!started) return;
      if (dir === "up" && d === "down") return;
      if (dir === "down" && d === "up") return;
      if (dir === "left" && d === "right") return;
      if (dir === "right" && d === "left") return;
      setPendingDir(d);
    },
    [end, paused, started, dir]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      try {
        const elTarget = e.target as HTMLElement | null;
        const isTyping =
          !!elTarget &&
          (elTarget.tagName === "INPUT" ||
            elTarget.tagName === "TEXTAREA" ||
            (elTarget as any).isContentEditable);
        if (isTyping && elTarget !== canvasRef.current && !started) return;

        const d = keyToDir(e);
        if (d) {
          e.preventDefault();
          e.stopPropagation();
          (e as any).stopImmediatePropagation?.();
          enqueueDir(d);
          return;
        }
        const code = e.code;
        if (code === "KeyP") {
          e.preventDefault();
          setPaused((p) => !p);
        } else if (code === "KeyR") {
          e.preventDefault();
          resetGame();
        } else if (code === "Digit1" || code === "Numpad1") {
          e.preventDefault();
          resetGame("easy");
        } else if (code === "Digit2" || code === "Numpad2") {
          e.preventDefault();
          resetGame("medium");
        } else if (code === "Digit3" || code === "Numpad3") {
          e.preventDefault();
          resetGame("hard");
        }
      } catch (err) {
        console.debug("Input handling error:", err);
      }
    }
    const opts: AddEventListenerOptions = { passive: false, capture: true };
    window.addEventListener("keydown", onKey, opts);
    return () => window.removeEventListener("keydown", onKey, opts);
  }, [enqueueDir, resetGame, started]);

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const padding = 12;
      const cw = containerRef.current?.clientWidth ?? window.innerWidth - 24;
      const rect = containerRef.current?.getBoundingClientRect();
      const vh =
        window.visualViewport?.height ??
        document.documentElement.clientHeight ??
        window.innerHeight;
      const top = rect?.top ?? 0;
      const safeBottom = 140;
      const chAvail = Math.max(240, vh - top - safeBottom);
      const cell = Math.max(8, Math.floor(Math.min((cw - padding * 2) / GRID_W, (chAvail - padding * 2) / GRID_H)));
      const w = GRID_W * cell + padding * 2;
      const h = GRID_H * cell + padding * 2;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const gx = padding + x * cell;
          const gy = padding + y * cell;
          ctx.fillStyle = "rgba(92,130,238,0.06)";
          ctx.fillRect(gx, gy, cell - 1, cell - 1);
        }
      }
      const drawDot = (p: Pos, i: number) => {
        const gx = padding + p.x * cell;
        const gy = padding + p.y * cell;
        const grad = ctx.createLinearGradient(gx, gy, gx + cell, gy + cell);
        const isHead = i === 0;
        grad.addColorStop(0, isHead ? "#5c82ee" : "#4f46e5");
        grad.addColorStop(1, isHead ? "#a855f7" : "#7c3aed");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(gx + 2, gy + 2, cell - 4, cell - 4, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(92,130,238,0.6)";
        ctx.strokeRect(gx + 2, gy + 2, cell - 4, cell - 4);
      };
      snake.forEach((p, i) => drawDot(p, i));
      const fgx = padding + food.x * cell;
      const fgy = padding + food.y * cell;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.roundRect(fgx + 3, fgy + 3, cell - 6, cell - 6, 8);
      ctx.fill();
    }
    draw();
  }, [snake, food, redrawTick]);

  useEffect(() => {
    const onResize = () => setRedrawTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    const coarse = window.matchMedia?.("(pointer: coarse)");
    const touchPoints = (navigator as any).maxTouchPoints || 0;
    setIsTouch(!!coarse?.matches || touchPoints > 0);
    const onChange = () => setIsTouch(!!coarse?.matches || touchPoints > 0);
    coarse?.addEventListener?.("change", onChange);
    return () => {
      window.removeEventListener("resize", onResize);
      coarse?.removeEventListener?.("change", onChange);
    };
  }, []);

  useEffect(() => {
    // Main game loop is only active once "started" is true.
    if (!started) return;
    const loop = (now: number) => {
      if (end || paused) return;
      if (!lastTickRef.current) lastTickRef.current = now;
      const elapsed = now - lastTickRef.current;
      if (elapsed >= speedMs) {
        const nextDir = pendingDir ?? dir;
        if (pendingDir) {
          setDir(pendingDir);
          setPendingDir(null);
        }
        const res = step(snake, nextDir, GRID_W, GRID_H, food);
        if (res.hit !== "none") {
          setEnd("lose");
          setAutoRestartSec(6);
        } else {
          setSnake(res.snake);
          setFood(res.food);
          if (res.ate) {
            setScore((s) => s + 10);
            playTone(880, 100, "triangle");
            const len = res.snake.length;
            if (len % 8 === 0) setLevel((lv) => lv + 1);
            if (len >= WIN_TARGET) {
              setEnd("win");
              setShowConfetti(true);
              setAutoRestartSec(8);
              playTone(1046, 250, "sawtooth");
            }
          }
        }
        lastTickRef.current = now;
      }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
      lastTickRef.current = 0;
    };
  }, [started, snake, dir, pendingDir, speedMs, food, end, paused]);

  useEffect(() => {
    if (!end) return;
    const id = window.setInterval(() => {
      setAutoRestartSec((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          // After auto-restart countdown, reset and show Start screen again.
          resetGame();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [end]);

  const rightRail = (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Game controls</h3>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700 dark:text-slate-300">Difficulty</div>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <Button key={d} type="button" variant={difficulty === d ? "default" : "outline"} className="h-9 px-3" onClick={() => resetGame(d)}>
                {d[0].toUpperCase() + d.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{statusText}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> You</span>
            <span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4" /> Level {level}</span>
            <span>Score {score}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => resetGame()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New game
          </Button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Use Arrow Keys or WASD. Press R to restart. 1/2/3 to set difficulty, P to pause.
        </div>
      </div>
    </div>
  );

  const below = (
    <div>
      <section id="how-to-play" className="scroll-mt-28">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">How to play</h2>
        <div className="mt-3 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Move on the neon grid, eat the glowing food, and grow. Avoid hitting walls or your body. Reach length {WIN_TARGET} to win.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Arrow keys or WASD to move.</li>
            <li>Each food adds +10 score and increases your length.</li>
            <li>Speed ramps slightly as you grow (levels).</li>
            <li>Hitting walls or yourself ends the game.</li>
          </ul>
        </div>
      </section>
    </div>
  );

  return (
    <GamePageLayout
      title={pageTitle}
      description={pageDescription}
      rightRail={rightRail}
      below={below}
      onThisPage={[{ id: "how-to-play", label: "How to play" }]}
    >
      <div className="flex flex-col items-center">
        <div ref={containerRef} className="w-full max-w-[420px]">
          <canvas
          ref={canvasRef}
          // Make canvas focusable so keyboard input works consistently across browsers
          tabIndex={0}
          onPointerDown={(e) => {
            canvasRef.current?.focus();
            swipeStartRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const start = swipeStartRef.current;
            swipeStartRef.current = null;
            if (!start) return;
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            const adx = Math.abs(dx);
            const ady = Math.abs(dy);
            const TH = 24;
            if (adx < TH && ady < TH) return;
            if (adx > ady) enqueueDir(dx > 0 ? "right" : "left");
            else enqueueDir(dy > 0 ? "down" : "up");
          }}
          style={{ touchAction: "none" }}
          className="rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-950"
        />
        </div>
        {started && !end ? (
          <div className="mt-4 md:hidden w-full max-w-[420px]">
            <div className="grid grid-cols-3 gap-2">
              <div />
              <Button type="button" variant="outline" className="h-12" onPointerDown={() => enqueueDir("up")}>↑</Button>
              <div />
              <Button type="button" variant="outline" className="h-12" onPointerDown={() => enqueueDir("left")}>←</Button>
              <Button type="button" variant="outline" className="h-12" onPointerDown={() => enqueueDir("down")}>↓</Button>
              <Button type="button" variant="outline" className="h-12" onPointerDown={() => enqueueDir("right")}>→</Button>
            </div>
          </div>
        ) : null}
        {/* Start overlay: visible until the user clicks Start. */}
        {!started && !end ? (
          <div className="fixed inset-0 z-40 grid place-items-center bg-black/40" role="dialog" aria-modal="true">
            <div className="relative z-20 w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                  <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                  Neon Snake
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Ready to play</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Click Start to begin. Use Arrow Keys or WASD to move. Reach length {WIN_TARGET} to win.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Difficulty</div>
                    <div className="flex gap-2">
                      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                        <Button
                          key={d}
                          type="button"
                          variant={startDifficulty === d ? "default" : "outline"}
                          className="h-9 px-3"
                          onClick={() => setStartDifficulty(d)}
                        >
                          {d[0].toUpperCase() + d.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Start level</div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((lv) => (
                        <Button
                          key={lv}
                          type="button"
                          variant={startLevel === lv ? "default" : "outline"}
                          className="h-9 px-3"
                          onClick={() => setStartLevel(lv)}
                        >
                          {lv}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button type="button" className="w-full" onClick={startGame}>
                    Start Game
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {end ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" role="alertdialog" aria-modal="true" aria-live="assertive">
            {showConfetti ? <ConfettiLayer kind={end === "win" ? "R" : "draw"} /> : null}
            <div className="relative z-20 w-[min(92vw,560px)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-8">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5c82ee]/20 via-fuchsia-400/20 to-amber-300/20 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                  <Sparkles className="h-4 w-4 text-[#5c82ee]" />
                  {end === "win" ? "Victory" : "Game Over"}
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {overlayText}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {end === "win"
                    ? "You reached the target length. Click Restart to play again."
                    : "You collided. Click Restart to try again."}
                </p>
                {autoRestartSec > 0 ? (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Auto restart in {autoRestartSec}s</p>
                ) : null}
                <div className="mt-6">
                  <Button type="button" className="w-full" onClick={() => resetGame()}>
                    Restart Game
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GamePageLayout>
  );
}

function ConfettiLayer({ kind }: { kind: "R" | "draw" }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const colors = kind === "R" ? ["#ef4444", "#fca5a5", "#f87171"] : ["#64748b", "#93c5fd", "#5c82ee"];
    const particles = Array.from({ length: 220 }).map(() => ({
      x: Math.random() * w,
      y: -40 - Math.random() * 220,
      vx: -1.25 + Math.random() * 2.5,
      vy: 2.25 + Math.random() * 2.75,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    let running = true;
    const start = performance.now();
    function tick(now: number) {
      if (!running) return;
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.vy += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.y > h + 12 || p.x < -12 || p.x > w + 12) {
          p.y = -40 - Math.random() * 220;
          p.x = Math.random() * w;
          p.vx = -1.25 + Math.random() * 2.5;
          p.vy = 2.25 + Math.random() * 2.75;
          p.size = 2 + Math.random() * 4;
        }
      }
      if (t < 3000) requestAnimationFrame(tick);
    }
    const id = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(id);
      running = false;
    };
  }, [kind]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-10" />;
}
