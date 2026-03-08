import React, { useState, useCallback, useEffect, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
// Faces: 0=U(top/white), 1=D(bottom/yellow), 2=F(front/green),
//        3=B(back/blue), 4=L(left/orange), 5=R(right/red)
type FaceIndex = 0 | 1 | 2 | 3 | 4 | 5;
type Color = "W" | "Y" | "G" | "B" | "O" | "R";

// CubeState: 6 faces × 9 stickers (row-major, 0=top-left, 8=bottom-right)
type CubeState = Color[][];

// ─── Constants ────────────────────────────────────────────────────────────────
const FACE_COLORS: Record<Color, string> = {
  W: "#ffffff",
  Y: "#ffd500",
  G: "#009b48",
  B: "#0045ad",
  O: "#ff5800",
  R: "#b90000",
};

const FACE_NAMES = ["U", "D", "F", "B", "L", "R"];
const COLOR_ORDER: Color[] = ["W", "Y", "G", "B", "O", "R"];

function makeSolvedCube(): CubeState {
  return COLOR_ORDER.map((c) => Array(9).fill(c) as Color[]);
}

// ─── Rotation Logic ───────────────────────────────────────────────────────────
// Each move mutates a copy of the cube state
function rotateFaceCW(face: Color[]): Color[] {
  // 0 1 2      6 3 0
  // 3 4 5  =>  7 4 1
  // 6 7 8      8 5 2
  return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
}

function rotateFaceCCW(face: Color[]): Color[] {
  return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
}

function deepCopy(state: CubeState): CubeState {
  return state.map((f) => [...f]);
}

// Apply a single move to the cube state, returning a new state
function applyMove(state: CubeState, move: string): CubeState {
  const s = deepCopy(state);
  const [U, D, F, B, L, R] = [0, 1, 2, 3, 4, 5];

  switch (move) {
    case "U": return moveU(s, 1);
    case "U'": return moveU(s, -1);
    case "U2": return moveU(moveU(s, 1), 1);
    case "D": return moveD(s, 1);
    case "D'": return moveD(s, -1);
    case "D2": return moveD(moveD(s, 1), 1);
    case "F": return moveF(s, 1);
    case "F'": return moveF(s, -1);
    case "F2": return moveF(moveF(s, 1), 1);
    case "B": return moveB(s, 1);
    case "B'": return moveB(s, -1);
    case "B2": return moveB(moveB(s, 1), 1);
    case "L": return moveL(s, 1);
    case "L'": return moveL(s, -1);
    case "L2": return moveL(moveL(s, 1), 1);
    case "R": return moveR(s, 1);
    case "R'": return moveR(s, -1);
    case "R2": return moveR(moveR(s, 1), 1);
    default: return s;
  }
   
  void U; void D; void F; void B; void L; void R;
}

function moveU(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  // Rotate U face
  n[0] = dir === 1 ? rotateFaceCW(s[0]) : rotateFaceCCW(s[0]);
  // Cycle: F[0,1,2] -> R[0,1,2] -> B[0,1,2] -> L[0,1,2]
  if (dir === 1) {
    [n[2][0], n[2][1], n[2][2]] = [s[4][0], s[4][1], s[4][2]];
    [n[5][0], n[5][1], n[5][2]] = [s[2][0], s[2][1], s[2][2]];
    [n[3][0], n[3][1], n[3][2]] = [s[5][0], s[5][1], s[5][2]];
    [n[4][0], n[4][1], n[4][2]] = [s[3][0], s[3][1], s[3][2]];
  } else {
    [n[2][0], n[2][1], n[2][2]] = [s[5][0], s[5][1], s[5][2]];
    [n[4][0], n[4][1], n[4][2]] = [s[2][0], s[2][1], s[2][2]];
    [n[3][0], n[3][1], n[3][2]] = [s[4][0], s[4][1], s[4][2]];
    [n[5][0], n[5][1], n[5][2]] = [s[3][0], s[3][1], s[3][2]];
  }
  return n;
}

function moveD(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  n[1] = dir === 1 ? rotateFaceCW(s[1]) : rotateFaceCCW(s[1]);
  // Cycle bottom row: F[6,7,8] -> L[6,7,8] -> B[6,7,8] -> R[6,7,8]
  if (dir === 1) {
    [n[5][6], n[5][7], n[5][8]] = [s[2][6], s[2][7], s[2][8]];
    [n[3][6], n[3][7], n[3][8]] = [s[5][6], s[5][7], s[5][8]];
    [n[4][6], n[4][7], n[4][8]] = [s[3][6], s[3][7], s[3][8]];
    [n[2][6], n[2][7], n[2][8]] = [s[4][6], s[4][7], s[4][8]];
  } else {
    [n[4][6], n[4][7], n[4][8]] = [s[2][6], s[2][7], s[2][8]];
    [n[2][6], n[2][7], n[2][8]] = [s[5][6], s[5][7], s[5][8]];
    [n[5][6], n[5][7], n[5][8]] = [s[3][6], s[3][7], s[3][8]];
    [n[3][6], n[3][7], n[3][8]] = [s[4][6], s[4][7], s[4][8]];
  }
  return n;
}

function moveF(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  n[2] = dir === 1 ? rotateFaceCW(s[2]) : rotateFaceCCW(s[2]);
  if (dir === 1) {
    // U bottom row -> R left col -> D top row (reversed) -> L right col (reversed)
    [n[5][0], n[5][3], n[5][6]] = [s[0][6], s[0][7], s[0][8]];
    [n[1][2], n[1][1], n[1][0]] = [s[5][0], s[5][3], s[5][6]];
    [n[4][8], n[4][5], n[4][2]] = [s[1][0], s[1][1], s[1][2]];
    [n[0][6], n[0][7], n[0][8]] = [s[4][8], s[4][5], s[4][2]];
  } else {
    [n[4][2], n[4][5], n[4][8]] = [s[0][6], s[0][7], s[0][8]];
    [n[1][0], n[1][1], n[1][2]] = [s[4][8], s[4][5], s[4][2]];
    [n[5][6], n[5][3], n[5][0]] = [s[1][0], s[1][1], s[1][2]];
    [n[0][6], n[0][7], n[0][8]] = [s[5][0], s[5][3], s[5][6]];
  }
  return n;
}

function moveB(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  n[3] = dir === 1 ? rotateFaceCW(s[3]) : rotateFaceCCW(s[3]);
  if (dir === 1) {
    [n[4][0], n[4][3], n[4][6]] = [s[0][2], s[0][1], s[0][0]];
    [n[0][0], n[0][1], n[0][2]] = [s[5][2], s[5][5], s[5][8]];
    [n[5][2], n[5][5], n[5][8]] = [s[1][8], s[1][7], s[1][6]];
    [n[1][6], n[1][7], n[1][8]] = [s[4][0], s[4][3], s[4][6]];
  } else {
    [n[5][8], n[5][5], n[5][2]] = [s[0][0], s[0][1], s[0][2]];
    [n[0][0], n[0][1], n[0][2]] = [s[4][6], s[4][3], s[4][0]];
    [n[4][6], n[4][3], n[4][0]] = [s[1][6], s[1][7], s[1][8]];
    [n[1][6], n[1][7], n[1][8]] = [s[5][8], s[5][5], s[5][2]];
  }
  return n;
}

function moveL(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  n[4] = dir === 1 ? rotateFaceCW(s[4]) : rotateFaceCCW(s[4]);
  if (dir === 1) {
    [n[2][0], n[2][3], n[2][6]] = [s[0][0], s[0][3], s[0][6]];
    [n[1][0], n[1][3], n[1][6]] = [s[2][0], s[2][3], s[2][6]];
    [n[3][8], n[3][5], n[3][2]] = [s[1][0], s[1][3], s[1][6]];
    [n[0][0], n[0][3], n[0][6]] = [s[3][8], s[3][5], s[3][2]];
  } else {
    [n[3][2], n[3][5], n[3][8]] = [s[0][6], s[0][3], s[0][0]];
    [n[0][0], n[0][3], n[0][6]] = [s[2][0], s[2][3], s[2][6]];
    [n[2][0], n[2][3], n[2][6]] = [s[1][0], s[1][3], s[1][6]];
    [n[1][0], n[1][3], n[1][6]] = [s[3][8], s[3][5], s[3][2]];
  }
  return n;
}

function moveR(s: CubeState, dir: 1 | -1): CubeState {
  const n = deepCopy(s);
  n[5] = dir === 1 ? rotateFaceCW(s[5]) : rotateFaceCCW(s[5]);
  if (dir === 1) {
    [n[3][6], n[3][3], n[3][0]] = [s[0][2], s[0][5], s[0][8]];
    [n[0][2], n[0][5], n[0][8]] = [s[2][2], s[2][5], s[2][8]];
    [n[2][2], n[2][5], n[2][8]] = [s[1][2], s[1][5], s[1][8]];
    [n[1][2], n[1][5], n[1][8]] = [s[3][6], s[3][3], s[3][0]];
  } else {
    [n[2][2], n[2][5], n[2][8]] = [s[0][2], s[0][5], s[0][8]];
    [n[1][2], n[1][5], n[1][8]] = [s[2][2], s[2][5], s[2][8]];
    [n[3][0], n[3][3], n[3][6]] = [s[1][2], s[1][5], s[1][8]];
    [n[0][2], n[0][5], n[0][8]] = [s[3][6], s[3][3], s[3][0]];
  }
  return n;
}

// ─── Scramble ─────────────────────────────────────────────────────────────────
const ALL_MOVES = ["U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2", "L", "L'", "L2", "R", "R'", "R2"];
const MOVE_BASE: Record<string, string> = {};
ALL_MOVES.forEach((m) => { MOVE_BASE[m] = m[0]; });

function generateScramble(length = 20): string[] {
  const moves: string[] = [];
  let lastBase = "";
  for (let i = 0; i < length; i++) {
    let move: string;
    do {
      move = ALL_MOVES[Math.floor(Math.random() * ALL_MOVES.length)];
    } while (MOVE_BASE[move] === lastBase);
    moves.push(move);
    lastBase = MOVE_BASE[move];
  }
  return moves;
}

// ─── Solve Detection ──────────────────────────────────────────────────────────
function isSolved(state: CubeState): boolean {
  return state.every((face) => face.every((c) => c === face[0]));
}

// ─── Net Face Renderer ────────────────────────────────────────────────────────
function FaceGrid({ face, size = 48, label }: { face: Color[]; size?: number; label?: string }) {
  const cellSize = Math.floor(size / 3);
  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${cellSize}px)`,
          gap: 2,
          background: "#222",
          padding: 3,
          borderRadius: 4,
        }}
      >
        {face.map((color, i) => (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: FACE_COLORS[color],
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 3D CSS Cube Renderer ─────────────────────────────────────────────────────
function CubeNetView({ state }: { state: CubeState }) {
  const S = 80; // face grid size
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top row: U */}
      <div className="flex justify-center" style={{ marginLeft: S + 4 }}>
        <FaceGrid face={state[0]} size={S} label="U" />
      </div>
      {/* Middle row: L F R B */}
      <div className="flex gap-1">
        <FaceGrid face={state[4]} size={S} label="L" />
        <FaceGrid face={state[2]} size={S} label="F" />
        <FaceGrid face={state[5]} size={S} label="R" />
        <FaceGrid face={state[3]} size={S} label="B" />
      </div>
      {/* Bottom row: D */}
      <div className="flex justify-center" style={{ marginLeft: S + 4 }}>
        <FaceGrid face={state[1]} size={S} label="D" />
      </div>
    </div>
  );
}

// ─── 3D Perspective Cube ──────────────────────────────────────────────────────
function Cube3DView({ state, rotX, rotY }: { state: CubeState; rotX: number; rotY: number }) {
  const size = 120; // total cube size in px
  const cell = Math.floor(size / 3) - 2;
  const gap = 2;

  function renderFaceStickers(face: Color[]) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(3, 1fr)`,
          gap: gap,
          padding: gap,
        }}
      >
        {face.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: FACE_COLORS[color],
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
    );
  }

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: "#111",
    border: "2px solid #333",
    transformOrigin: "center center",
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        perspective: 500,
        perspectiveOrigin: "50% 50%",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Front = F (index 2) */}
        <div style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }}>
          {renderFaceStickers(state[2])}
        </div>
        {/* Back = B (index 3) */}
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size / 2}px)` }}>
          {renderFaceStickers([...state[3]].reverse())}
        </div>
        {/* Left = L (index 4) */}
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}>
          {renderFaceStickers(state[4])}
        </div>
        {/* Right = R (index 5) */}
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size / 2}px)` }}>
          {renderFaceStickers(state[5])}
        </div>
        {/* Top = U (index 0) */}
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size / 2}px)` }}>
          {renderFaceStickers(state[0])}
        </div>
        {/* Bottom = D (index 1) */}
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size / 2}px)` }}>
          {renderFaceStickers(state[1])}
        </div>
      </div>
    </div>
  );
}

// ─── Move Button ──────────────────────────────────────────────────────────────
function MoveBtn({ move, onClick }: { move: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded text-xs font-mono font-bold bg-slate-700 hover:bg-indigo-600 active:bg-indigo-700 text-white transition-colors min-w-[32px]"
    >
      {move}
    </button>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────
function RubiksCubeGame() {
  const [cubeState, setCubeState] = useState<CubeState>(makeSolvedCube);
  const [moveCount, setMoveCount] = useState(0);
  const [scramble, setScramble] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(true);
  const [rotX, setRotX] = useState(-25);
  const [rotY, setRotY] = useState(30);
  const [history, setHistory] = useState<CubeState[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTimer((t) => t + 10), 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${m > 0 ? m + ":" : ""}${m > 0 ? String(rem).padStart(2, "0") : rem}.${String(centis).padStart(2, "0")}`;
  };

  const doMove = useCallback((move: string) => {
    setCubeState((prev) => {
      const next = applyMove(prev, move);
      setHistory((h) => [...h, prev]);
      const nowSolved = isSolved(next);
      setSolved(nowSolved);
      if (nowSolved && running) setRunning(false);
      return next;
    });
    setMoveCount((c) => c + 1);
    if (!running && moveCount === 0) setRunning(true);
  }, [running, moveCount]);

  const doScramble = useCallback(() => {
    const moves = generateScramble(20);
    setScramble(moves);
    let state = makeSolvedCube();
    moves.forEach((m) => { state = applyMove(state, m); });
    setCubeState(state);
    setMoveCount(0);
    setTimer(0);
    setRunning(false);
    setSolved(false);
    setHistory([]);
  }, []);

  const doReset = useCallback(() => {
    setCubeState(makeSolvedCube());
    setMoveCount(0);
    setTimer(0);
    setRunning(false);
    setSolved(true);
    setScramble([]);
    setHistory([]);
  }, []);

  const doUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCubeState(prev);
    setHistory((h) => h.slice(0, -1));
    setMoveCount((c) => Math.max(0, c - 1));
    setSolved(isSolved(prev));
  }, [history]);

  // Orbit drag on 3D view
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setRotY((r) => r + dx * 0.5);
    setRotX((r) => Math.max(-90, Math.min(90, r - dy * 0.5)));
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { dragRef.current = null; };

  const onTouchStart = (e: React.TouchEvent) => {
    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current) return;
    const dx = e.touches[0].clientX - dragRef.current.x;
    const dy = e.touches[0].clientY - dragRef.current.y;
    setRotY((r) => r + dx * 0.5);
    setRotX((r) => Math.max(-90, Math.min(90, r - dy * 0.5)));
    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = () => { dragRef.current = null; };

  const moveGroups = [
    { label: "U Face", moves: ["U", "U'", "U2"] },
    { label: "D Face", moves: ["D", "D'", "D2"] },
    { label: "F Face", moves: ["F", "F'", "F2"] },
    { label: "B Face", moves: ["B", "B'", "B2"] },
    { label: "L Face", moves: ["L", "L'", "L2"] },
    { label: "R Face", moves: ["R", "R'", "R2"] },
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header stats */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="bg-slate-800 rounded-xl px-5 py-3 text-center min-w-[100px]">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Timer</div>
          <div className="text-2xl font-mono font-bold text-white">{formatTime(timer)}</div>
        </div>
        <div className="bg-slate-800 rounded-xl px-5 py-3 text-center min-w-[100px]">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Moves</div>
          <div className="text-2xl font-mono font-bold text-white">{moveCount}</div>
        </div>
        <div className={`rounded-xl px-5 py-3 text-center min-w-[100px] ${solved ? "bg-emerald-700" : "bg-slate-800"}`}>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Status</div>
          <div className="text-lg font-bold text-white">{solved ? "SOLVED!" : "Solving..."}</div>
        </div>
      </div>

      {/* Scramble sequence */}
      {scramble.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 mb-1 uppercase tracking-widest">Scramble</div>
          <div className="font-mono text-sm text-yellow-300 flex flex-wrap gap-1 justify-center">
            {scramble.map((m, i) => (
              <span key={i} className="bg-slate-700 px-1.5 py-0.5 rounded">{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* 3D view + Net view */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* 3D interactive cube */}
        <div
          ref={cubeRef}
          className="cursor-grab active:cursor-grabbing rounded-xl p-4 bg-slate-900 border border-slate-700"
          style={{ userSelect: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="text-xs text-slate-500 text-center mb-2">Drag to rotate view</div>
          <Cube3DView state={cubeState} rotX={rotX} rotY={rotY} />
        </div>

        {/* Cube net */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="text-xs text-slate-500 text-center mb-2">Unfolded net view</div>
          <CubeNetView state={cubeState} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={doScramble}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white transition-colors"
        >
          Scramble (20 moves)
        </button>
        <button
          onClick={doReset}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-slate-600 hover:bg-slate-500 text-white transition-colors"
        >
          Reset
        </button>
        <button
          onClick={doUndo}
          disabled={history.length === 0}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white transition-colors"
        >
          Undo
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors text-white ${running ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
        >
          {running ? "Pause" : "Start"} Timer
        </button>
      </div>

      {/* Move buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {moveGroups.map((group) => (
          <div key={group.label} className="bg-slate-800 rounded-xl p-3">
            <div className="text-xs text-slate-400 font-semibold mb-2 text-center">{group.label}</div>
            <div className="flex gap-1 justify-center">
              {group.moves.map((m) => (
                <MoveBtn key={m} move={m} onClick={() => doMove(m)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        U=Up D=Down F=Front B=Back L=Left R=Right | Apostrophe = counter-clockwise | 2 = double turn
      </p>
    </div>
  );
}

// ─── Editorial ────────────────────────────────────────────────────────────────
function RubiksCubeEditorial() {
  return (
    <div className="space-y-10">
      <section id="how-to-play">
        <h2 className="text-2xl font-bold mb-3">How to Play</h2>
        <p>
          Use the <strong>face rotation buttons</strong> (U, D, F, B, L, R) to rotate each face of the
          Rubik's Cube. A plain letter means a clockwise 90-degree turn; the apostrophe (') denotes a
          counter-clockwise turn; 2 means a 180-degree double turn.
        </p>
        <p className="mt-3">
          Press <strong>Scramble</strong> to apply 20 random moves and mix the cube. Use the
          <strong> Undo</strong> button to reverse your last move. The timer starts automatically on your
          first move after a scramble.
        </p>
        <p className="mt-3">
          Drag the 3D view to orbit the cube and inspect all faces from any angle. The unfolded net
          view shows all six faces simultaneously.
        </p>
      </section>

      <section id="notation">
        <h2 className="text-2xl font-bold mb-3">WCA Move Notation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="p-2 text-left border border-slate-300 dark:border-slate-700">Move</th>
                <th className="p-2 text-left border border-slate-300 dark:border-slate-700">Face</th>
                <th className="p-2 text-left border border-slate-300 dark:border-slate-700">Direction</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["U", "Upper (White)", "Clockwise"],
                ["U'", "Upper (White)", "Counter-clockwise"],
                ["U2", "Upper (White)", "180°"],
                ["D", "Down (Yellow)", "Clockwise"],
                ["F", "Front (Green)", "Clockwise"],
                ["B", "Back (Blue)", "Clockwise"],
                ["L", "Left (Orange)", "Clockwise"],
                ["R", "Right (Red)", "Clockwise"],
              ].map(([move, face, dir]) => (
                <tr key={move} className="border-b border-slate-200 dark:border-slate-800">
                  <td className="p-2 font-mono font-bold border border-slate-300 dark:border-slate-700">{move}</td>
                  <td className="p-2 border border-slate-300 dark:border-slate-700">{face}</td>
                  <td className="p-2 border border-slate-300 dark:border-slate-700">{dir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold mb-3">Solving Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Start by solving the <strong>white cross</strong> on the U face.</li>
          <li>Complete the <strong>white corners</strong> to finish the first layer.</li>
          <li>Solve the <strong>middle layer edges</strong> using U R U' R' U' F' U F sequences.</li>
          <li>Create a <strong>yellow cross</strong> on the D face using F R U R' U' F'.</li>
          <li>Finally, <strong>permute the corners and edges</strong> to complete the last layer.</li>
        </ul>
      </section>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function RubiksCube3x3Game() {
  return (
    <CalculatorVerticalLayout
      title="Rubik's Cube 3x3"
      description="Interactive 3D Rubik's Cube with CSS transforms. Practice moves with U, D, F, B, L, R notation. Scramble, solve, and track your time."
      canonical="https://www.smartkitnow.com/games/rubiks-cube-3x3"
      widget={<RubiksCubeGame />}
      editorial={<RubiksCubeEditorial />}
      onThisPage={[
        { id: "how-to-play", label: "How to Play" },
        { id: "notation", label: "WCA Move Notation" },
        { id: "tips", label: "Solving Tips" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-5xl"
    />
  );
}
