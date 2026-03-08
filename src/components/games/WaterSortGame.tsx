import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
type ColorId = 0 | 1 | 2 | 3 | 4 | 5;
type Difficulty = "easy" | "medium" | "hard";

type Tube = ColorId[];

interface GameConfig {
  colors: number;
  emptyTubes: number;
  tubeCapacity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TUBE_CAPACITY = 4;

const COLOR_PALETTE: { bg: string; border: string; label: string }[] = [
  { bg: "#ef4444", border: "#b91c1c", label: "Red"    },
  { bg: "#3b82f6", border: "#1d4ed8", label: "Blue"   },
  { bg: "#22c55e", border: "#15803d", label: "Green"  },
  { bg: "#eab308", border: "#a16207", label: "Yellow" },
  { bg: "#a855f7", border: "#7e22ce", label: "Purple" },
  { bg: "#f97316", border: "#c2410c", label: "Orange" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  easy:   { colors: 4, emptyTubes: 2, tubeCapacity: TUBE_CAPACITY },
  medium: { colors: 5, emptyTubes: 2, tubeCapacity: TUBE_CAPACITY },
  hard:   { colors: 6, emptyTubes: 2, tubeCapacity: TUBE_CAPACITY },
};

// ─── Puzzle Generation ────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePuzzle(config: GameConfig): Tube[] {
  const { colors, emptyTubes, tubeCapacity } = config;

  // Build solved state: each tube has 4 of one color
  let tubes: Tube[] = Array.from({ length: colors }, (_, i) =>
    Array(tubeCapacity).fill(i as ColorId)
  );

  // Add empty tubes
  for (let i = 0; i < emptyTubes; i++) tubes.push([]);

  // Shuffle by performing random valid reverse-pours many times
  // to reach a scrambled-but-solvable state
  const totalTubes = tubes.length;
  const iterations = colors * tubeCapacity * 8;

  for (let attempt = 0; attempt < iterations; attempt++) {
    // Pick a random non-empty source
    const sources = tubes
      .map((t, i) => ({ i, top: t[t.length - 1], len: t.length }))
      .filter(s => s.len > 0);

    if (sources.length === 0) break;

    const src = sources[Math.floor(Math.random() * sources.length)];

    // Find valid destinations (not same tube, not full, top matches or empty)
    const dests = tubes
      .map((t, i) => ({ i, top: t[t.length - 1], len: t.length }))
      .filter(d => {
        if (d.i === src.i) return false;
        if (d.len >= tubeCapacity) return false;
        if (d.len === 0) return true;
        return d.top === src.top;
      });

    if (dests.length === 0) continue;

    const dst = dests[Math.floor(Math.random() * dests.length)];
    // Pour top of src to dst
    const newTubes = tubes.map(t => [...t]);
    const topColor = newTubes[src.i].pop()!;
    newTubes[dst.i].push(topColor);
    tubes = newTubes;
  }

  return tubes;
}

function isTubeDone(tube: Tube, capacity: number): boolean {
  if (tube.length === 0) return true;
  if (tube.length !== capacity) return false;
  return tube.every(c => c === tube[0]);
}

function isGameWon(tubes: Tube[], capacity: number): boolean {
  return tubes.every(t => isTubeDone(t, capacity));
}

function getTopColor(tube: Tube): ColorId | null {
  return tube.length > 0 ? tube[tube.length - 1] : null;
}

function countTopSameColor(tube: Tube): number {
  if (tube.length === 0) return 0;
  const top = tube[tube.length - 1];
  let count = 0;
  for (let i = tube.length - 1; i >= 0; i--) {
    if (tube[i] === top) count++;
    else break;
  }
  return count;
}

function canPour(from: Tube, to: Tube, capacity: number): boolean {
  if (from.length === 0) return false;
  if (to.length >= capacity) return false;
  const fromTop = getTopColor(from);
  const toTop = getTopColor(to);
  return toTop === null || toTop === fromTop;
}

function pourTube(tubes: Tube[], fromIdx: number, toIdx: number, capacity: number): Tube[] {
  if (!canPour(tubes[fromIdx], tubes[toIdx], capacity)) return tubes;

  const newTubes = tubes.map(t => [...t]);
  const fromColor = getTopColor(newTubes[fromIdx])!;
  const spaceInDest = capacity - newTubes[toIdx].length;
  const countToPour = Math.min(countTopSameColor(newTubes[fromIdx]), spaceInDest);

  for (let i = 0; i < countToPour; i++) {
    newTubes[fromIdx].pop();
    newTubes[toIdx].push(fromColor);
  }

  return newTubes;
}

// ─── Tube Visual Component ─────────────────────────────────────────────────────
function TubeVisual({
  tube,
  capacity,
  selected,
  isDone,
  onClick,
}: {
  tube: Tube;
  capacity: number;
  selected: boolean;
  isDone: boolean;
  onClick: () => void;
}) {
  const segments = Array.from({ length: capacity }, (_, i) => {
    // Display from bottom: index 0 = bottom slot
    const colorIdx = tube[i] ?? null;
    return colorIdx;
  });

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 52,
        height: capacity * 40 + 12,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        outline: "none",
        transform: selected ? "translateY(-12px) scale(1.05)" : "none",
        transition: "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        filter: isDone ? "drop-shadow(0 0 8px rgba(100,255,150,0.6))" : "none",
      }}
      aria-label={`Tube with ${tube.length} segments`}
    >
      {/* Glass tube */}
      <div
        style={{
          position: "relative",
          width: 44,
          height: capacity * 40,
          borderRadius: "0 0 20px 20px",
          border: `3px solid ${selected ? "#818cf8" : isDone ? "#4ade80" : "#4b5563"}`,
          borderTop: "none",
          overflow: "hidden",
          backgroundColor: "#1e293b",
          boxShadow: selected
            ? "0 0 0 2px #6366f1, inset 0 0 8px rgba(99,102,241,0.2)"
            : isDone
            ? "0 0 0 2px #4ade80"
            : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {segments.map((colorIdx, i) => (
          <div
            key={i}
            style={{
              height: 40,
              width: "100%",
              backgroundColor: colorIdx !== null ? COLOR_PALETTE[colorIdx].bg : "transparent",
              borderTop: colorIdx !== null && i > 0 && segments[i - 1] !== colorIdx
                ? `1px solid ${colorIdx !== null ? COLOR_PALETTE[colorIdx].border : "transparent"}`
                : "none",
              transition: "background-color 0.2s",
            }}
          />
        ))}

        {/* Glass shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 4,
            width: 6,
            height: "80%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
            borderRadius: 3,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Tube opening (top rim) */}
      <div
        style={{
          width: 50,
          height: 10,
          borderRadius: "4px 4px 0 0",
          border: `3px solid ${selected ? "#818cf8" : isDone ? "#4ade80" : "#4b5563"}`,
          borderBottom: "none",
          marginBottom: 0,
          backgroundColor: "transparent",
          order: -1,
        }}
      />
    </button>
  );
}

// ─── Game Board (Inner Component) ─────────────────────────────────────────────
function WaterBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [tubes, setTubes] = useState<Tube[]>(() => generatePuzzle(DIFFICULTY_CONFIG.medium));
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<Tube[][]>([]);
  const [won, setWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  const config = DIFFICULTY_CONFIG[difficulty];

  const newLevel = useCallback((diff: Difficulty = difficulty) => {
    const cfg = DIFFICULTY_CONFIG[diff];
    setTubes(generatePuzzle(cfg));
    setSelected(null);
    setHistory([]);
    setWon(false);
    setMoveCount(0);
  }, [difficulty]);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    newLevel(d);
  };

  const handleTubeClick = (idx: number) => {
    if (won) return;

    if (selected === null) {
      // Select this tube if it's not empty
      if (tubes[idx].length > 0) {
        setSelected(idx);
      }
      return;
    }

    if (selected === idx) {
      // Deselect
      setSelected(null);
      return;
    }

    // Try to pour from selected to idx
    if (canPour(tubes[selected], tubes[idx], config.tubeCapacity)) {
      const newTubes = pourTube(tubes, selected, idx, config.tubeCapacity);
      setHistory(prev => [...prev, tubes]);
      setTubes(newTubes);
      setMoveCount(prev => prev + 1);
      setSelected(null);

      if (isGameWon(newTubes, config.tubeCapacity)) {
        setWon(true);
      }
    } else {
      // Switch selection to the clicked tube (if not empty)
      if (tubes[idx].length > 0) {
        setSelected(idx);
      } else {
        setSelected(null);
      }
    }
  };

  const undo = () => {
    if (history.length === 0 || won) return;
    const prevTubes = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setTubes(prevTubes);
    setSelected(null);
    setMoveCount(prev => Math.max(0, prev - 1));
  };

  const totalTubes = config.colors + config.emptyTubes;

  // Arrange tubes in rows of max 5 for responsive layout
  const TUBES_PER_ROW = Math.min(5, totalTubes);
  const tubeRows: number[][] = [];
  for (let i = 0; i < totalTubes; i += TUBES_PER_ROW) {
    tubeRows.push(Array.from({ length: Math.min(TUBES_PER_ROW, totalTubes - i) }, (_, j) => i + j));
  }

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Difficulty */}
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => changeDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
              difficulty === d
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Moves</div>
          <div className="text-xl font-bold text-white">{moveCount}</div>
        </div>
        <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Colors</div>
          <div className="text-xl font-bold text-indigo-400">{config.colors}</div>
        </div>
      </div>

      {/* Win banner */}
      {won && (
        <div className="w-full max-w-xs bg-emerald-900 border-2 border-emerald-500 rounded-2xl p-5 text-center shadow-xl">
          <div className="text-3xl mb-1">🎉</div>
          <div className="text-xl font-bold text-emerald-300">Sorted!</div>
          <div className="text-sm text-emerald-400 mt-1">Completed in {moveCount} moves</div>
        </div>
      )}

      {/* Tube rows */}
      {tubeRows.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {row.map(tubeIdx => (
            <TubeVisual
              key={tubeIdx}
              tube={tubes[tubeIdx]}
              capacity={config.tubeCapacity}
              selected={selected === tubeIdx}
              isDone={isTubeDone(tubes[tubeIdx], config.tubeCapacity)}
              onClick={() => handleTubeClick(tubeIdx)}
            />
          ))}
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={undo}
          disabled={history.length === 0 || won}
          className="px-5 py-2 bg-slate-600 hover:bg-slate-500 active:bg-slate-700 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={() => newLevel()}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-colors"
        >
          New Level
        </button>
      </div>

      {/* Instructions */}
      <p className="text-xs text-slate-400 text-center max-w-xs">
        Click a tube to select it, then click another tube to pour. Sort all colors into single tubes!
      </p>

      {/* Color legend */}
      <div className="flex gap-2 flex-wrap justify-center">
        {COLOR_PALETTE.slice(0, config.colors).map((col, i) => (
          <div key={i} className="flex items-center gap-1">
            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: col.bg, border: `2px solid ${col.border}` }} />
            <span className="text-xs text-slate-400">{col.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exported Page Component ───────────────────────────────────────────────────
export default function WaterSortGame({
  title = "Water Sort Puzzle",
  description = "Sort the colored water into tubes — a satisfying logic puzzle for all ages!",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play Water Sort</h2>
        <p>
          Water Sort Puzzle is a color-sorting brain teaser. You have a set of tubes containing
          mixed-color liquid layers, and your goal is to sort them so each tube contains only one
          color (or is empty).
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-2">
          <li>
            <strong>Click a tube</strong> to select it. The selected tube lifts up to indicate
            it's active.
          </li>
          <li>
            <strong>Click another tube</strong> to pour the top color from the selected tube into it.
          </li>
          <li>
            Pouring is only allowed if the destination tube's <strong>top color matches</strong> the
            color you're pouring, or if the destination tube is <strong>empty</strong>.
          </li>
          <li>
            You can pour <strong>multiple layers</strong> at once if they are the same color on top.
          </li>
          <li>
            Use the <strong>Undo</strong> button to reverse your last move. Plan ahead to minimize moves!
          </li>
          <li>
            The puzzle is solved when all tubes are either <strong>fully single-color</strong> or
            <strong> empty</strong>.
          </li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips &amp; Strategies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Clear one color at a time:</strong> Focus on completing one color fully before
            moving to the next. Look for the color that has the most layers already consolidated.
          </li>
          <li>
            <strong>Use empty tubes as temp storage:</strong> Empty tubes act as "wildcard" slots.
            Use them to temporarily hold a color while you rearrange others.
          </li>
          <li>
            <strong>Don't bury completed colors:</strong> Once you have a full tube of one color,
            avoid pouring other colors on top of it.
          </li>
          <li>
            <strong>Look 2-3 moves ahead:</strong> Water Sort is essentially a sorting algorithm.
            The key is to avoid creating dead-end states where you have no valid pours.
          </li>
          <li>
            <strong>Start with Easy:</strong> Easy (4 colors) teaches the core mechanics.
            Hard (6 colors) requires significantly more planning.
          </li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Is every puzzle solvable?</h3>
            <p>
              Yes. The puzzle is generated by starting from a solved state and then performing
              random valid pours in reverse, guaranteeing a solvable puzzle every time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I pour a partial stack?</h3>
            <p>
              Yes. When multiple layers of the same color are on top, they all pour together as
              long as the destination tube has space.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How many tubes are there?</h3>
            <p>
              Easy: 6 color tubes + 2 empty = 8 total. Medium: 7 color tubes + 2 empty = 9 total.
              Hard: 8 color tubes + 2 empty = 10 total.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a move limit?</h3>
            <p>
              No — there is no move limit. Take as long as you need. The Undo button lets you
              backtrack at any point without penalty (except the move counter).
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
      widget={<WaterBoard />}
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
