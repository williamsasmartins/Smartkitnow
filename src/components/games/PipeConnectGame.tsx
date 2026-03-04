import React, { useState, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ── Types ────────────────────────────────────────────────────────────────────
type Color = "red"|"blue"|"green"|"yellow"|"purple"|"orange"|"cyan"|"maroon";
interface Point { r: number; c: number }
interface Level { size: number; endpoints: { color: Color; a: Point; b: Point }[] }

// ── Levels ───────────────────────────────────────────────────────────────────
const LEVELS: Level[] = [
  { size: 6, endpoints: [
    { color:"red",    a:{r:0,c:0}, b:{r:5,c:5} },
    { color:"blue",   a:{r:0,c:5}, b:{r:5,c:0} },
    { color:"green",  a:{r:0,c:3}, b:{r:5,c:3} },
    { color:"yellow", a:{r:2,c:0}, b:{r:2,c:5} },
  ]},
  { size: 7, endpoints: [
    { color:"red",    a:{r:0,c:0}, b:{r:6,c:6} },
    { color:"blue",   a:{r:0,c:6}, b:{r:6,c:0} },
    { color:"green",  a:{r:0,c:3}, b:{r:6,c:3} },
    { color:"yellow", a:{r:3,c:0}, b:{r:3,c:6} },
    { color:"purple", a:{r:1,c:1}, b:{r:5,c:5} },
  ]},
  { size: 8, endpoints: [
    { color:"red",    a:{r:0,c:0}, b:{r:7,c:7} },
    { color:"blue",   a:{r:0,c:7}, b:{r:7,c:0} },
    { color:"green",  a:{r:0,c:4}, b:{r:7,c:3} },
    { color:"yellow", a:{r:4,c:0}, b:{r:3,c:7} },
    { color:"purple", a:{r:1,c:2}, b:{r:6,c:5} },
    { color:"orange", a:{r:2,c:0}, b:{r:5,c:7} },
  ]},
  { size: 8, endpoints: [
    { color:"red",    a:{r:0,c:1}, b:{r:7,c:6} },
    { color:"blue",   a:{r:1,c:0}, b:{r:6,c:7} },
    { color:"green",  a:{r:0,c:4}, b:{r:7,c:3} },
    { color:"yellow", a:{r:3,c:0}, b:{r:4,c:7} },
    { color:"purple", a:{r:0,c:7}, b:{r:7,c:0} },
    { color:"orange", a:{r:2,c:2}, b:{r:5,c:5} },
    { color:"cyan",   a:{r:0,c:0}, b:{r:7,c:7} },
  ]},
  { size: 9, endpoints: [
    { color:"red",    a:{r:0,c:0}, b:{r:8,c:8} },
    { color:"blue",   a:{r:0,c:8}, b:{r:8,c:0} },
    { color:"green",  a:{r:0,c:4}, b:{r:8,c:4} },
    { color:"yellow", a:{r:4,c:0}, b:{r:4,c:8} },
    { color:"purple", a:{r:1,c:1}, b:{r:7,c:7} },
    { color:"orange", a:{r:1,c:7}, b:{r:7,c:1} },
    { color:"cyan",   a:{r:2,c:4}, b:{r:6,c:4} },
    { color:"maroon", a:{r:4,c:2}, b:{r:4,c:6} },
  ]},
];

const COLOR_CSS: Record<Color, string> = {
  red:"#ef4444", blue:"#3b82f6", green:"#22c55e", yellow:"#eab308",
  purple:"#a855f7", orange:"#f97316", cyan:"#06b6d4", maroon:"#9f1239",
};

function ptKey(p: Point) { return `${p.r},${p.c}`; }

// ── Main Component ────────────────────────────────────────────────────────────
function PipeBoard() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [paths, setPaths] = useState<Record<Color, Point[]>>({} as Record<Color, Point[]>);
  const [drawing, setDrawing] = useState<Color | null>(null);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(0);

  const level = LEVELS[levelIdx];
  const { size, endpoints } = level;

  const reset = useCallback(() => {
    setPaths({} as Record<Color, Point[]>);
    setDrawing(null);
    setWon(false);
    setMoves(0);
  }, []);

  const nextLevel = useCallback(() => {
    setLevelIdx(i => Math.min(i + 1, LEVELS.length - 1));
    setPaths({} as Record<Color, Point[]>);
    setDrawing(null);
    setWon(false);
    setMoves(0);
    setCompleted(c => c + 1);
  }, []);

  // Build occupancy map
  const occupied = new Map<string, Color>();
  for (const [color, pts] of Object.entries(paths)) {
    for (const p of pts as Point[]) occupied.set(ptKey(p), color as Color);
  }

  // Endpoint lookup
  const endpointMap = new Map<string, Color>();
  for (const ep of endpoints) {
    endpointMap.set(ptKey(ep.a), ep.color);
    endpointMap.set(ptKey(ep.b), ep.color);
  }

  const getColorAt = (r: number, c: number): Color | null => {
    return occupied.get(ptKey({r,c})) ?? null;
  };

  const isEndpoint = (r: number, c: number) => endpointMap.has(ptKey({r,c}));
  const endpointColor = (r: number, c: number) => endpointMap.get(ptKey({r,c})) ?? null;

  const adjacent = (a: Point, b: Point) =>
    (Math.abs(a.r-b.r) + Math.abs(a.c-b.c)) === 1;

  const handleCellClick = useCallback((r: number, c: number) => {
    const pt = { r, c };
    const key = ptKey(pt);
    const epColor = endpointMap.get(key);

    if (!drawing) {
      // Start drawing from endpoint or existing path
      if (epColor) {
        const newPaths = { ...paths };
        newPaths[epColor] = [pt];
        setPaths(newPaths);
        setDrawing(epColor);
      } else {
        const existColor = getColorAt(r, c);
        if (existColor) {
          // Resume from this point
          const existPath = paths[existColor] ?? [];
          const idx = existPath.findIndex(p => ptKey(p) === key);
          if (idx >= 0) {
            const newPaths = { ...paths };
            newPaths[existColor] = existPath.slice(0, idx + 1);
            setPaths(newPaths);
            setDrawing(existColor);
          }
        }
      }
      return;
    }

    // Currently drawing
    const currentPath = paths[drawing] ?? [];
    const last = currentPath[currentPath.length - 1];

    // Check if clicking on same color endpoint to finish
    if (epColor === drawing && !adjacent(last, pt)) {
      setDrawing(null);
      return;
    }

    // Must be adjacent
    if (!adjacent(last, pt)) { setDrawing(null); return; }

    // Can't go into endpoint of different color
    if (epColor && epColor !== drawing) { return; }

    // Check if already in current path (loop back)
    const inCurrentIdx = currentPath.findIndex(p => ptKey(p) === key);
    if (inCurrentIdx >= 0) {
      const newPaths = { ...paths };
      newPaths[drawing] = currentPath.slice(0, inCurrentIdx + 1);
      setPaths(newPaths);
      return;
    }

    // Clear other paths that use this cell
    const newPaths = { ...paths };
    for (const [c2, pts] of Object.entries(newPaths)) {
      if (c2 !== drawing) {
        const filtered = (pts as Point[]).filter(p => ptKey(p) !== key);
        newPaths[c2 as Color] = filtered;
      }
    }

    newPaths[drawing] = [...currentPath, pt];
    setMoves(m => m + 1);

    // Check if this completes the path
    const ep = endpoints.find(e => e.color === drawing);
    if (ep) {
      const startKey = ptKey(currentPath[0]);
      const isFromA = startKey === ptKey(ep.a);
      const targetEnd = isFromA ? ep.b : ep.a;
      if (ptKey(pt) === ptKey(targetEnd)) {
        setPaths(newPaths);
        setDrawing(null);
        // Check win condition
        const allConnected = endpoints.every(e => {
          const p = newPaths[e.color] ?? [];
          if (p.length < 2) return false;
          const s = ptKey(p[0]);
          const end = ptKey(p[p.length-1]);
          return (s === ptKey(e.a) && end === ptKey(e.b)) ||
                 (s === ptKey(e.b) && end === ptKey(e.a));
        });
        const totalCells = size * size;
        const filledCells = Object.values(newPaths).reduce((sum, pts) => sum + (pts as Point[]).length, 0);
        if (allConnected && filledCells === totalCells) setWon(true);
        return;
      }
    }

    setPaths(newPaths);
  }, [drawing, paths, endpoints, size, endpointMap]);

  const handleMouseEnter = useCallback((r: number, c: number) => {
    if (!drawing) return;
    handleCellClick(r, c);
  }, [drawing, handleCellClick]);

  const cellSize = Math.min(52, Math.floor(320 / size));

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-sm text-slate-400">Level {levelIdx + 1} / {LEVELS.length}</div>
        <div className="text-sm text-slate-400">Moves: {moves}</div>
        <button onClick={reset} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded">
          Reset
        </button>
      </div>

      {won && (
        <div className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-lg animate-bounce">
          🎉 Level Complete!{" "}
          {levelIdx < LEVELS.length - 1 ? (
            <button onClick={nextLevel} className="underline ml-2">Next Level →</button>
          ) : (
            <span>All levels done! 🏆</span>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className="border-2 border-slate-600 rounded"
        style={{ display:"grid", gridTemplateColumns:`repeat(${size}, ${cellSize}px)`, gap:1, background:"#1e293b" }}
        onMouseLeave={() => { if (drawing) setDrawing(null); }}
      >
        {Array.from({ length: size }, (_, r) =>
          Array.from({ length: size }, (_, c) => {
            const color = getColorAt(r, c);
            const epCol = endpointColor(r, c);
            const isEp = isEndpoint(r, c);
            const bg = color ? COLOR_CSS[color] : "#0f172a";
            const borderColor = epCol ? COLOR_CSS[epCol] : "transparent";

            return (
              <div
                key={`${r}-${c}`}
                style={{ width: cellSize, height: cellSize, background: bg, cursor: "pointer",
                  border: isEp ? `3px solid ${borderColor}` : "1px solid #334155",
                  borderRadius: isEp ? "50%" : 2,
                  boxShadow: isEp ? `0 0 8px ${borderColor}` : "none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}
                onClick={() => handleCellClick(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
              >
                {isEp && <div style={{ width: cellSize*0.4, height: cellSize*0.4, borderRadius:"50%",
                  background: epCol ? COLOR_CSS[epCol] : "white", opacity:0.9 }} />}
              </div>
            );
          })
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-slate-500 text-center max-w-xs">
        Click an endpoint to start drawing. Hover or click cells to extend. Connect all pairs and fill every cell to win.
      </p>

      {/* Level selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {LEVELS.map((_, i) => (
          <button key={i} onClick={() => { setLevelIdx(i); setPaths({} as Record<Color,Point[]>); setDrawing(null); setWon(false); setMoves(0); }}
            className={`w-8 h-8 rounded text-xs font-bold ${i === levelIdx ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PipeConnectGame() {
  return (
    <CalculatorVerticalLayout
      title="Pipe Connect"
      description="Connect the colored pipes and fill every cell in this addictive puzzle game. Draw paths between matching dots to complete each level."
      canonical="https://www.smartkitnow.com/games/pipe-connect"
      widget={<PipeBoard />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Pipe Connect</h2>
          <p>Click a colored dot to start drawing a pipe path. Move your mouse (or tap) through cells to route the pipe. Connect both dots of the same color.</p>
          <p><strong>Win condition:</strong> All color pairs connected AND every grid cell filled.</p>
          <p><strong>Tips:</strong> Start with the longest paths first. You can erase a path by clicking anywhere on it and redrawing.</p>
        </div>
      }
      contentMaxWidth="max-w-3xl"
    />
  );
}
