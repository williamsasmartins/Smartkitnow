import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────
type GridSize = 3 | 4 | 5;
type GameStatus = "PLAYING" | "WON" | "LOST";

interface TileData {
  value: number;
  id: number;
  merging?: boolean;
  isNew?: boolean;
}

type Board = (TileData | null)[][];

// ─── Constants ────────────────────────────────────────────────────────────────
const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2:    { bg: "#eee4da", text: "#776e65" },
  4:    { bg: "#ede0c8", text: "#776e65" },
  8:    { bg: "#f2b179", text: "#f9f6f2" },
  16:   { bg: "#f59563", text: "#f9f6f2" },
  32:   { bg: "#f67c5f", text: "#f9f6f2" },
  64:   { bg: "#f65e3b", text: "#f9f6f2" },
  128:  { bg: "#edcf72", text: "#f9f6f2" },
  256:  { bg: "#edcc61", text: "#f9f6f2" },
  512:  { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
};

const TILE_FONT_SIZE: Record<number, string> = {
  1: "2rem", 2: "2rem", 3: "1.8rem", 4: "1.5rem",
};

let tileIdCounter = 0;

function makeId() { return ++tileIdCounter; }

// ─── Board Logic ──────────────────────────────────────────────────────────────
function createEmptyBoard(size: GridSize): Board {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => { if (!cell) cells.push([r, c]); })
  );
  return cells;
}

function spawnTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = { value, id: makeId(), isNew: true };
  return newBoard;
}

function initBoard(size: GridSize): Board {
  let board = createEmptyBoard(size);
  board = spawnTile(board);
  board = spawnTile(board);
  return board;
}

function slideRow(row: (TileData | null)[]): { result: (TileData | null)[]; score: number; moved: boolean } {
  const tiles = row.filter(Boolean) as TileData[];
  let score = 0;
  let moved = false;
  const merged: (TileData | null)[] = [];

  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const newVal = tiles[i].value * 2;
      score += newVal;
      merged.push({ value: newVal, id: makeId(), merging: true });
      moved = true;
      i += 2;
    } else {
      merged.push({ ...tiles[i], isNew: false });
      i++;
    }
  }

  const size = row.length;
  const result: (TileData | null)[] = [
    ...merged,
    ...Array(size - merged.length).fill(null),
  ];

  if (!moved) {
    moved = result.some((t, idx) => {
      const orig = row[idx];
      if (t === null && orig === null) return false;
      if (t === null || orig === null) return true;
      return t.value !== orig.value;
    });
  }

  return { result, score, moved };
}

function transpose(board: Board): Board {
  const size = board.length;
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (__, c) => board[c][r])
  );
}

function reverseRows(board: Board): Board {
  return board.map(row => [...row].reverse());
}

type Direction = "left" | "right" | "up" | "down";

function applyMove(board: Board, dir: Direction): { board: Board; score: number; moved: boolean } {
  let workBoard = board.map(row => [...row]);
  let totalScore = 0;
  let anyMoved = false;

  if (dir === "up") workBoard = transpose(workBoard);
  if (dir === "right") workBoard = reverseRows(workBoard);
  if (dir === "down") { workBoard = transpose(workBoard); workBoard = reverseRows(workBoard); }

  const resultRows = workBoard.map(row => slideRow(row));
  workBoard = resultRows.map(r => r.result);
  totalScore = resultRows.reduce((acc, r) => acc + r.score, 0);
  anyMoved = resultRows.some(r => r.moved);

  if (dir === "down") { workBoard = reverseRows(workBoard); workBoard = transpose(workBoard); }
  if (dir === "right") workBoard = reverseRows(workBoard);
  if (dir === "up") workBoard = transpose(workBoard);

  return { board: workBoard, score: totalScore, moved: anyMoved };
}

function checkWin(board: Board): boolean {
  return board.some(row => row.some(t => t && t.value >= 2048));
}

function hasMovesLeft(board: Board): boolean {
  const size = board.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) return true;
      const val = board[r][c]!.value;
      if (r + 1 < size && board[r + 1][c]?.value === val) return true;
      if (c + 1 < size && board[r][c + 1]?.value === val) return true;
    }
  }
  return false;
}

// ─── Tile Component ────────────────────────────────────────────────────────────
function Tile({ tile, cellSize }: { tile: TileData; cellSize: number }) {
  const colors = TILE_COLORS[tile.value] ?? { bg: "#3c3a32", text: "#f9f6f2" };
  const digits = String(tile.value).length;
  const fontSize = TILE_FONT_SIZE[digits] ?? "1.2rem";

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        width: cellSize,
        height: cellSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        fontSize,
        fontWeight: 800,
        fontFamily: "'Arial', sans-serif",
        animation: tile.isNew
          ? "tile-appear 0.15s ease-out"
          : tile.merging
          ? "tile-merge 0.2s ease-out"
          : undefined,
        transition: "background-color 0.1s",
        userSelect: "none",
      }}
    >
      {tile.value}
    </div>
  );
}

// ─── Game Board (Inner Component) ─────────────────────────────────────────────
function Game2048Board() {
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [board, setBoard] = useState<Board>(() => initBoard(4));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem("2048-best") ?? "0", 10) || 0; }
    catch { return 0; }
  });
  const [status, setStatus] = useState<GameStatus>("PLAYING");
  const [wonAcknowledged, setWonAcknowledged] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const newGame = useCallback((size: GridSize = gridSize) => {
    setBoard(initBoard(size));
    setScore(0);
    setStatus("PLAYING");
    setWonAcknowledged(false);
  }, [gridSize]);

  const move = useCallback((dir: Direction) => {
    if (status === "LOST") return;
    if (status === "WON" && !wonAcknowledged) return;

    setBoard(prev => {
      const { board: newBoard, score: gained, moved } = applyMove(prev, dir);
      if (!moved) return prev;

      const spawned = spawnTile(newBoard);

      setScore(s => {
        const next = s + gained;
        setBestScore(best => {
          const newBest = Math.max(best, next);
          try { localStorage.setItem("2048-best", String(newBest)); } catch {}
          return newBest;
        });
        return next;
      });

      if (checkWin(spawned) && status === "PLAYING") {
        setStatus("WON");
      } else if (!hasMovesLeft(spawned)) {
        setStatus("LOST");
      }

      return spawned;
    });
  }, [status, wonAcknowledged]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: "left", ArrowRight: "right",
        ArrowUp: "up", ArrowDown: "down",
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move]);

  // Touch/pointer swipe on grid
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    const THRESHOLD = 30;
    if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  };

  const changeGridSize = (size: GridSize) => {
    setGridSize(size);
    newGame(size);
  };

  const GAP = 8;
  const BOARD_MAX = 340;
  const cellSize = Math.floor((BOARD_MAX - GAP * (gridSize + 1)) / gridSize);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Style tag for animations */}
      <style>{`
        @keyframes tile-appear { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes tile-merge { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>

      {/* Scores */}
      <div className="flex gap-4 w-full max-w-[340px] justify-between">
        <div className="flex-1 bg-[#bbada0] rounded-lg p-3 text-center">
          <div className="text-xs font-bold text-[#eee4da] uppercase tracking-wide">Score</div>
          <div className="text-2xl font-extrabold text-white">{score}</div>
        </div>
        <div className="flex-1 bg-[#bbada0] rounded-lg p-3 text-center">
          <div className="text-xs font-bold text-[#eee4da] uppercase tracking-wide">Best</div>
          <div className="text-2xl font-extrabold text-white">{bestScore}</div>
        </div>
      </div>

      {/* Grid size selector */}
      <div className="flex gap-2">
        {([3, 4, 5] as GridSize[]).map(size => (
          <button
            key={size}
            onClick={() => changeGridSize(size)}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              gridSize === size
                ? "bg-[#f65e3b] text-white"
                : "bg-[#bbada0] text-[#f9f6f2] hover:bg-[#cdc1b4]"
            }`}
          >
            {size}×{size}
          </button>
        ))}
        <button
          onClick={() => newGame()}
          className="px-3 py-1 rounded text-sm font-bold bg-[#8f7a66] text-[#f9f6f2] hover:bg-[#7a6758] transition-colors ml-2"
        >
          New Game
        </button>
      </div>

      {/* Board */}
      <div className="relative">
        <div
          ref={boardRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{
            backgroundColor: "#bbada0",
            borderRadius: 8,
            padding: GAP,
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gap: GAP,
            touchAction: "none",
            cursor: "grab",
            width: BOARD_MAX,
            boxSizing: "border-box",
          }}
        >
          {/* Background cells */}
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div
              key={`bg-${i}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: "rgba(238,228,218,0.35)",
                borderRadius: 6,
              }}
            />
          ))}

          {/* Tiles overlay */}
          <div
            style={{
              position: "absolute",
              top: GAP,
              left: GAP,
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gap: GAP,
              pointerEvents: "none",
            }}
          >
            {board.flat().map((tile, i) =>
              tile ? (
                <Tile key={tile.id} tile={tile} cellSize={cellSize} />
              ) : (
                <div key={`empty-${i}`} style={{ width: cellSize, height: cellSize }} />
              )
            )}
          </div>
        </div>

        {/* Win Overlay */}
        {status === "WON" && !wonAcknowledged && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(237,194,46,0.85)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>You reached 2048!</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setWonAcknowledged(true)}
                style={{ background: "#8f7a66", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}
              >
                Continue
              </button>
              <button
                onClick={() => newGame()}
                style={{ background: "#f65e3b", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, cursor: "pointer" }}
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {status === "LOST" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(119,110,101,0.85)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>Game Over!</div>
            <div style={{ fontSize: "1rem", color: "#eee4da" }}>Score: {score}</div>
            <button
              onClick={() => newGame()}
              style={{ background: "#f65e3b", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-[340px]">
        Use arrow keys or swipe to move tiles. Merge same numbers to reach 2048!
      </p>
    </div>
  );
}

// ─── Exported Page Component ───────────────────────────────────────────────────
export default function Game2048Classic({
  title = "2048 Classic",
  description = "Slide tiles on a grid, merge numbers, and reach the legendary 2048 tile!",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play 2048</h2>
        <p>
          2048 is a single-player sliding tile puzzle game. The objective is simple: combine
          numbered tiles by sliding them across a 4×4 grid until you create a tile with the
          value 2048.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Use the <strong>Arrow Keys</strong> (or swipe on mobile) to slide all tiles in one direction.</li>
          <li>When two tiles of the same number collide, they <strong>merge into one</strong> tile with their combined value.</li>
          <li>After every move, a new tile (2 or 4) appears on a random empty cell.</li>
          <li>The game ends when the board is full and no merges are possible.</li>
        </ul>
        <p className="mt-4">
          You can choose between <strong>3×3</strong> (easier), <strong>4×4</strong> (classic), or
          <strong> 5×5</strong> (harder, more room) grid sizes.
        </p>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips &amp; Strategies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Corner strategy:</strong> Keep your highest tile in one corner (e.g., top-left)
            and never move it away. Build a "snake" pattern from that corner.
          </li>
          <li>
            <strong>Don't move up (or left) randomly:</strong> Pick two directions that keep your
            large tile in its corner, and only use the other two when necessary.
          </li>
          <li>
            <strong>Plan ahead:</strong> Before each move, visualize what the board will look like
            after the slide. Avoid moves that scatter your high-value tiles.
          </li>
          <li>
            <strong>Merge small tiles first:</strong> Clear small tiles to free up space, then chain
            bigger merges.
          </li>
          <li>
            <strong>Score big:</strong> The score is the sum of all merged values — a single 512 merge
            gives you more points than dozens of small merges.
          </li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Is 2048 solvable every time?</h3>
            <p>Not always. Some random tile placements make it impossible to win. However, with good
            strategy you can consistently reach 1024 and often 2048.</p>
          </div>
          <div>
            <h3 className="font-semibold">What happens after I reach 2048?</h3>
            <p>You'll see a "You reached 2048!" overlay. You can choose to <strong>Continue</strong>
            playing for a higher score or start a <strong>New Game</strong>.</p>
          </div>
          <div>
            <h3 className="font-semibold">Does the game save my best score?</h3>
            <p>Yes! Your best score is stored in your browser's localStorage and persists between
            sessions.</p>
          </div>
          <div>
            <h3 className="font-semibold">What are the grid size options for?</h3>
            <p>3×3 is faster and more chaotic, good for quick games. 4×4 is the classic. 5×5 gives you
            more room to maneuver, making it possible to reach much higher tile values.</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<Game2048Board />}
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
