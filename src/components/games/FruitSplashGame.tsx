import React, { useState, useCallback, useEffect, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const FRUITS = ["🍎","🍊","🍋","🍇","🍓","🍑"] as const;
type Fruit = typeof FRUITS[number];
const COLS = 7, ROWS = 7;

function makeGrid(): Fruit[][] {
  return Array.from({length:ROWS}, () =>
    Array.from({length:COLS}, () => FRUITS[Math.floor(Math.random()*FRUITS.length)] as Fruit)
  );
}

function FruitGame() {
  const [grid, setGrid] = useState<Fruit[][]>(makeGrid);
  const [path, setPath] = useState<{r:number;c:number}[]>([]);
  const [dragging, setDragging] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("hs_fruit-splash")||"0"));
  const [flash, setFlash] = useState<{r:number;c:number}[]>([]);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTimeLeft(tl => { if (tl<=1) { setOver(true); return 0; } return tl-1; }), 1000);
    return () => clearInterval(t);
  }, [over]);

  const pathSet = new Set(path.map(p=>`${p.r},${p.c}`));
  const pathFruit = path.length > 0 ? grid[path[0].r][path[0].c] : null;

  const adjacent = (a:{r:number;c:number}, b:{r:number;c:number}) =>
    Math.abs(a.r-b.r)<=1 && Math.abs(a.c-b.c)<=1 && !(a.r===b.r&&a.c===b.c);

  const extend = useCallback((r:number, c:number) => {
    if (!dragging || !pathFruit) return;
    const key = `${r},${c}`;
    if (pathSet.has(key)) return;
    const last = path[path.length-1];
    if (!adjacent(last, {r,c})) return;
    if (grid[r][c] !== pathFruit) return;
    setPath(p => [...p, {r,c}]);
  }, [dragging, pathFruit, pathSet, path, grid]);

  const release = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (path.length < 3) { setPath([]); return; }
    // Score
    const pts = path.length <= 3 ? 10 : path.length <= 4 ? 20 : path.length <= 5 ? 40 : path.length <= 6 ? 80 : 150;
    setScore(s => { const ns=s+pts; if(ns>best){setBest(ns);localStorage.setItem("hs_fruit-splash",String(ns));} return ns; });
    setFlash([...path]);
    setTimeout(() => setFlash([]), 300);
    // Remove path cells and apply gravity
    const cleared = path.map(p=>`${p.r},${p.c}`);
    const ng = grid.map(row => [...row]);
    // Clear cells
    for (const {r,c} of path) ng[r][c] = null as any;
    // Gravity: slide down
    for (let c=0;c<COLS;c++) {
      let bottom = ROWS-1;
      for (let r=ROWS-1;r>=0;r--) {
        if (ng[r][c]) { ng[bottom][c]=ng[r][c]; if(bottom!==r) ng[r][c]=null as any; bottom--; }
      }
      for (let r=bottom;r>=0;r--) ng[r][c]=FRUITS[Math.floor(Math.random()*FRUITS.length)] as Fruit;
    }
    setGrid(ng);
    setPath([]);
  }, [dragging, path, grid, best]);

  const start = (r:number, c:number) => { setDragging(true); setPath([{r,c}]); };

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none"
      onMouseUp={release} onTouchEnd={release}>
      <div className="flex gap-6 text-sm">
        <span className="text-green-400">⏱ {timeLeft}s</span>
        <span className="text-yellow-400">🌊 {score}</span>
        <span className="text-purple-400">Best: {best}</span>
      </div>
      {path.length > 0 && (
        <div className="text-sm text-white">
          Path: {path.length} {pathFruit} → {path.length<=3?10:path.length<=4?20:path.length<=5?40:path.length<=6?80:150} pts
        </div>
      )}
      {over && (
        <div className="text-center">
          <div className="text-xl font-bold text-red-400">Time's Up! Score: {score}</div>
          <button onClick={() => { setGrid(makeGrid()); setScore(0); setTimeLeft(60); setOver(false); setPath([]); }}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Play Again</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:`repeat(${COLS},44px)`,gap:3}}
        onMouseLeave={() => { if(dragging) release(); }}>
        {grid.map((row, r) => row.map((fruit, c) => {
          const inPath = pathSet.has(`${r},${c}`);
          const inFlash = flash.some(p=>p.r===r&&p.c===c);
          return (
            <button key={`${r}-${c}`}
              style={{ width:44,height:44,fontSize:22,borderRadius:8,
                background: inFlash?"#fbbf24":inPath?"rgba(251,191,36,0.3)":"#1e293b",
                border: inPath?"2px solid #fbbf24":"2px solid #334155",
                cursor:"grab", transition:"transform .1s, background .15s",
                transform: inPath?"scale(1.1)":"scale(1)" }}
              onMouseDown={() => start(r,c)}
              onMouseEnter={() => extend(r,c)}
              onTouchStart={(e) => { e.preventDefault(); start(r,c); }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                if (el) {
                  const pos = el.getAttribute("data-pos");
                  if (pos) { const [er,ec]=pos.split(",").map(Number); extend(er,ec); }
                }
              }}
              data-pos={`${r},${c}`}>
              {fruit}
            </button>
          );
        }))}
      </div>
      <p className="text-xs text-slate-500">Click & drag through same fruits (including diagonal). 3+ to score!</p>
    </div>
  );
}

export default function FruitSplashGame() {
  return (
    <CalculatorVerticalLayout
      title="Fruit Splash"
      description="Connect paths of matching fruits to score! Longer chains earn more points. Race against the clock in this juicy puzzle game."
      canonical="https://www.smartkitnow.com/games/fruit-splash"
      widget={<FruitGame />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Fruit Splash</h2>
          <p>Click and drag through adjacent matching fruits (including diagonals) to create a path. Release when done — minimum 3 fruits needed.</p>
          <p>Longer paths = bigger scores: 3=10pts, 4=20pts, 5=40pts, 6=80pts, 7+=150pts. Score as much as you can in 60 seconds!</p>
        </div>
      }
      contentMaxWidth="max-w-2xl"
    />
  );
}
