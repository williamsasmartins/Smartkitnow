import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const GEMS = ["💎","🔴","💚","💜","🟡","🔵"] as const;
type Gem = typeof GEMS[number];
const COLS = 8, ROWS = 8;

function makeGrid(): (Gem | null)[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => GEMS[Math.floor(Math.random() * GEMS.length)] as Gem)
  );
}

function findMatches(grid: (Gem|null)[][]): Set<string> {
  const matched = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 2; c++) {
      if (grid[r][c] && grid[r][c] === grid[r][c+1] && grid[r][c] === grid[r][c+2]) {
        matched.add(`${r},${c}`); matched.add(`${r},${c+1}`); matched.add(`${r},${c+2}`);
      }
    }
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 2; r++) {
      if (grid[r][c] && grid[r][c] === grid[r+1][c] && grid[r][c] === grid[r+2][c]) {
        matched.add(`${r},${c}`); matched.add(`${r+1},${c}`); matched.add(`${r+2},${c}`);
      }
    }
  }
  return matched;
}

function applyGravity(grid: (Gem|null)[][]): (Gem|null)[][] {
  return grid[0].map((_, c) => {
    const col = grid.map(r => r[c]).filter(Boolean) as Gem[];
    while (col.length < ROWS) col.unshift(GEMS[Math.floor(Math.random()*GEMS.length)] as Gem);
    return col;
  }).reduce((acc, col, c) => {
    col.forEach((gem, r) => { acc[r][c] = gem; });
    return acc;
  }, Array.from({length:ROWS}, () => Array(COLS).fill(null)) as (Gem|null)[][]);
}

function GemGrid() {
  const [grid, setGrid] = useState<(Gem|null)[][]>(makeGrid);
  const [selected, setSelected] = useState<{r:number;c:number}|null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("hs_jewel-hunter")||"0"));
  const [moves, setMoves] = useState(30);
  const [over, setOver] = useState(false);
  const [animating, setAnimating] = useState(false);

  const processMatches = useCallback((g: (Gem|null)[][], addScore: (n:number)=>void, cascade=1) => {
    const matched = findMatches(g);
    if (matched.size === 0) return g;
    addScore(matched.size * 10 * cascade);
    const cleared = g.map((row, r) => row.map((gem, c) => matched.has(`${r},${c}`) ? null : gem));
    const filled = applyGravity(cleared);
    // Recursive cascade
    setTimeout(() => {
      const next = processMatches(filled, addScore, cascade+1);
      setGrid(next);
      setAnimating(false);
    }, 200);
    return filled;
  }, []);

  const handleClick = useCallback((r: number, c: number) => {
    if (over || animating || moves <= 0) return;
    if (!selected) { setSelected({r,c}); return; }
    if (selected.r === r && selected.c === c) { setSelected(null); return; }
    // Must be adjacent
    if (Math.abs(selected.r-r) + Math.abs(selected.c-c) !== 1) { setSelected({r,c}); return; }
    // Swap
    const ng = grid.map(row => [...row]);
    [ng[selected.r][selected.c], ng[r][c]] = [ng[r][c], ng[selected.r][selected.c]];
    const matched = findMatches(ng);
    if (matched.size === 0) { setSelected(null); return; }
    setSelected(null);
    setAnimating(true);
    setMoves(m => { const nm = m-1; if (nm <= 0) setOver(true); return nm; });
    let added = 0;
    const addScore = (n: number) => { added += n; setScore(s => { const ns=s+n; if(ns>best){setBest(ns);localStorage.setItem("hs_jewel-hunter",String(ns));} return ns; }); };
    setGrid(ng);
    setTimeout(() => {
      const result = processMatches(ng, addScore);
      setGrid(result);
      setAnimating(false);
    }, 100);
  }, [over, animating, moves, selected, grid, processMatches, best]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-6 text-sm">
        <span className="text-yellow-400">💰 {score}</span>
        <span className="text-blue-400">Moves: {moves}</span>
        <span className="text-purple-400">Best: {best}</span>
      </div>
      {over && (
        <div className="text-center">
          <div className="text-xl font-bold text-red-400">Game Over! Score: {score}</div>
          <button onClick={() => { setGrid(makeGrid()); setScore(0); setMoves(30); setOver(false); setSelected(null); }}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Play Again</button>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${COLS},40px)`, gap:2 }}>
        {grid.map((row, r) => row.map((gem, c) => (
          <button key={`${r}-${c}`} onClick={() => handleClick(r,c)}
            style={{ width:40,height:40,borderRadius:6,fontSize:20,
              background: selected?.r===r&&selected?.c===c ? "#fbbf24" : "#1e293b",
              border: selected?.r===r&&selected?.c===c ? "2px solid #f59e0b" : "2px solid #334155",
              cursor:"pointer",transition:"transform .1s" }}
            className="hover:scale-110">
            {gem}
          </button>
        )))}
      </div>
      <p className="text-xs text-slate-500">Click two adjacent gems to swap. Match 3+ to score!</p>
    </div>
  );
}

export default function JewelHunterGame() {
  return (
    <CalculatorVerticalLayout
      title="Jewel Hunter"
      description="Swap adjacent gems to match 3 or more in a row! Chain combos for massive scores. Hunt rare jewels in this addictive match-3 puzzle game."
      canonical="https://www.smartkitnow.com/games/jewel-hunter"
      widget={<GemGrid />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Jewel Hunter</h2>
          <p>Click a gem, then click an adjacent gem to swap them. If 3+ matching gems line up in a row or column, they explode!</p>
          <p>Chains and cascades multiply your score. You have 30 moves — make them count!</p>
        </div>
      }
      contentMaxWidth="max-w-2xl"
    />
  );
}
