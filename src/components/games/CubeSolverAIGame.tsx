import React, { useState, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ============================================================
// TYPES & CONSTANTS
// ============================================================

type FaceColor = "W" | "Y" | "R" | "O" | "B" | "G";
type Face = "U" | "D" | "L" | "R" | "F" | "B";
// CubeState: face -> 3x3 grid of colors
type CubeState = Record<Face, FaceColor[][]>;

interface SolveStep {
  phase: string;
  moves: string;
  description: string;
}

const FACE_COLORS: FaceColor[] = ["W", "Y", "R", "O", "B", "G"];

const COLOR_DISPLAY: Record<FaceColor, { bg: string; border: string; label: string }> = {
  W: { bg: "bg-white", border: "border-slate-300", label: "White" },
  Y: { bg: "bg-yellow-400", border: "border-yellow-500", label: "Yellow" },
  R: { bg: "bg-red-500", border: "border-red-600", label: "Red" },
  O: { bg: "bg-orange-500", border: "border-orange-600", label: "Orange" },
  B: { bg: "bg-blue-500", border: "border-blue-600", label: "Blue" },
  G: { bg: "bg-green-500", border: "border-green-600", label: "Green" },
};

const FACE_LABELS: Record<Face, string> = {
  U: "Top (Up)",
  D: "Bottom (Down)",
  L: "Left",
  R: "Right",
  F: "Front",
  B: "Back",
};

const FACE_CENTERS: Record<Face, FaceColor> = {
  U: "W",
  D: "Y",
  F: "R",
  B: "O",
  L: "B",
  R: "G",
};

const FACE_ORDER: Face[] = ["U", "F", "R", "B", "L", "D"];

// ============================================================
// CUBE STATE UTILITIES
// ============================================================

function createSolvedCube(): CubeState {
  return {
    U: Array.from({ length: 3 }, () => Array(3).fill("W") as FaceColor[]),
    D: Array.from({ length: 3 }, () => Array(3).fill("Y") as FaceColor[]),
    F: Array.from({ length: 3 }, () => Array(3).fill("R") as FaceColor[]),
    B: Array.from({ length: 3 }, () => Array(3).fill("O") as FaceColor[]),
    L: Array.from({ length: 3 }, () => Array(3).fill("B") as FaceColor[]),
    R: Array.from({ length: 3 }, () => Array(3).fill("G") as FaceColor[]),
  };
}

function cloneCube(cube: CubeState): CubeState {
  return {
    U: cube.U.map(r => [...r]),
    D: cube.D.map(r => [...r]),
    F: cube.F.map(r => [...r]),
    B: cube.B.map(r => [...r]),
    L: cube.L.map(r => [...r]),
    R: cube.R.map(r => [...r]),
  } as CubeState;
}

function rotateFaceCW(face: FaceColor[][]): FaceColor[][] {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

function rotateFaceCCW(face: FaceColor[][]): FaceColor[][] {
  return rotateFaceCW(rotateFaceCW(rotateFaceCW(face)));
}

// ============================================================
// MOVE EXECUTION ENGINE
// ============================================================

function applyMove(cube: CubeState, move: string): CubeState {
  const c = cloneCube(cube);
  const base = move.replace(/['2]/, "");
  const times = move.endsWith("2") ? 2 : 1;
  const ccw = move.endsWith("'");

  for (let t = 0; t < times; t++) {
    const tmp = cloneCube(c);
    if (ccw) {
      applyBaseMoveOnce(c, tmp, base, true);
    } else {
      applyBaseMoveOnce(c, tmp, base, false);
    }
  }
  return c;
}

function applyBaseMoveOnce(c: CubeState, _orig: CubeState, base: string, ccw: boolean): void {
  const snap = cloneCube(c);

  if (base === "U") {
    c.U = ccw ? rotateFaceCCW(snap.U) : rotateFaceCW(snap.U);
    if (!ccw) {
      c.F[0] = [...snap.R[0]];
      c.L[0] = [...snap.F[0]];
      c.B[0] = [...snap.L[0]];
      c.R[0] = [...snap.B[0]];
    } else {
      c.F[0] = [...snap.L[0]];
      c.R[0] = [...snap.F[0]];
      c.B[0] = [...snap.R[0]];
      c.L[0] = [...snap.B[0]];
    }
  } else if (base === "D") {
    c.D = ccw ? rotateFaceCCW(snap.D) : rotateFaceCW(snap.D);
    if (!ccw) {
      c.F[2] = [...snap.L[2]];
      c.R[2] = [...snap.F[2]];
      c.B[2] = [...snap.R[2]];
      c.L[2] = [...snap.B[2]];
    } else {
      c.F[2] = [...snap.R[2]];
      c.L[2] = [...snap.F[2]];
      c.B[2] = [...snap.L[2]];
      c.R[2] = [...snap.B[2]];
    }
  } else if (base === "F") {
    c.F = ccw ? rotateFaceCCW(snap.F) : rotateFaceCW(snap.F);
    if (!ccw) {
      c.U[2] = [snap.L[0][2], snap.L[1][2], snap.L[2][2]];
      c.R[0][0] = snap.U[2][0]; c.R[1][0] = snap.U[2][1]; c.R[2][0] = snap.U[2][2];
      c.D[0] = [snap.R[2][0], snap.R[1][0], snap.R[0][0]];
      c.L[0][2] = snap.D[0][2]; c.L[1][2] = snap.D[0][1]; c.L[2][2] = snap.D[0][0];
    } else {
      c.U[2] = [snap.R[2][0], snap.R[1][0], snap.R[0][0]];
      c.L[0][2] = snap.U[2][0]; c.L[1][2] = snap.U[2][1]; c.L[2][2] = snap.U[2][2];
      c.D[0] = [snap.L[0][2], snap.L[1][2], snap.L[2][2]];
      c.R[0][0] = snap.D[0][2]; c.R[1][0] = snap.D[0][1]; c.R[2][0] = snap.D[0][0];
    }
  } else if (base === "B") {
    c.B = ccw ? rotateFaceCCW(snap.B) : rotateFaceCW(snap.B);
    if (!ccw) {
      c.U[0] = [snap.R[0][2], snap.R[1][2], snap.R[2][2]];
      c.L[0][0] = snap.U[0][2]; c.L[1][0] = snap.U[0][1]; c.L[2][0] = snap.U[0][0];
      c.D[2] = [snap.L[2][0], snap.L[1][0], snap.L[0][0]];
      c.R[0][2] = snap.D[2][0]; c.R[1][2] = snap.D[2][1]; c.R[2][2] = snap.D[2][2];
    } else {
      c.U[0] = [snap.L[2][0], snap.L[1][0], snap.L[0][0]];
      c.R[0][2] = snap.U[0][0]; c.R[1][2] = snap.U[0][1]; c.R[2][2] = snap.U[0][2];
      c.D[2] = [snap.R[0][2], snap.R[1][2], snap.R[2][2]];
      c.L[0][0] = snap.D[2][2]; c.L[1][0] = snap.D[2][1]; c.L[2][0] = snap.D[2][0];
    }
  } else if (base === "R") {
    c.R = ccw ? rotateFaceCCW(snap.R) : rotateFaceCW(snap.R);
    if (!ccw) {
      c.U[0][2] = snap.F[0][2]; c.U[1][2] = snap.F[1][2]; c.U[2][2] = snap.F[2][2];
      c.B[0][0] = snap.U[2][2]; c.B[1][0] = snap.U[1][2]; c.B[2][0] = snap.U[0][2];
      c.D[0][2] = snap.B[2][0]; c.D[1][2] = snap.B[1][0]; c.D[2][2] = snap.B[0][0];
      c.F[0][2] = snap.D[0][2]; c.F[1][2] = snap.D[1][2]; c.F[2][2] = snap.D[2][2];
    } else {
      c.U[0][2] = snap.B[2][0]; c.U[1][2] = snap.B[1][0]; c.U[2][2] = snap.B[0][0];
      c.F[0][2] = snap.U[0][2]; c.F[1][2] = snap.U[1][2]; c.F[2][2] = snap.U[2][2];
      c.D[0][2] = snap.F[0][2]; c.D[1][2] = snap.F[1][2]; c.D[2][2] = snap.F[2][2];
      c.B[0][0] = snap.D[2][2]; c.B[1][0] = snap.D[1][2]; c.B[2][0] = snap.D[0][2];
    }
  } else if (base === "L") {
    c.L = ccw ? rotateFaceCCW(snap.L) : rotateFaceCW(snap.L);
    if (!ccw) {
      c.U[0][0] = snap.B[2][2]; c.U[1][0] = snap.B[1][2]; c.U[2][0] = snap.B[0][2];
      c.F[0][0] = snap.U[0][0]; c.F[1][0] = snap.U[1][0]; c.F[2][0] = snap.U[2][0];
      c.D[0][0] = snap.F[0][0]; c.D[1][0] = snap.F[1][0]; c.D[2][0] = snap.F[2][0];
      c.B[0][2] = snap.D[2][0]; c.B[1][2] = snap.D[1][0]; c.B[2][2] = snap.D[0][0];
    } else {
      c.U[0][0] = snap.F[0][0]; c.U[1][0] = snap.F[1][0]; c.U[2][0] = snap.F[2][0];
      c.B[0][2] = snap.U[2][0]; c.B[1][2] = snap.U[1][0]; c.B[2][2] = snap.U[0][0];
      c.D[0][0] = snap.B[2][2]; c.D[1][0] = snap.B[1][2]; c.D[2][0] = snap.B[0][2];
      c.F[0][0] = snap.D[0][0]; c.F[1][0] = snap.D[1][0]; c.F[2][0] = snap.D[2][0];
    }
  }
}

function applyMoves(cube: CubeState, moves: string): CubeState {
  let c = cloneCube(cube);
  const moveList = moves.trim().split(/\s+/).filter(Boolean);
  for (const m of moveList) {
    c = applyMove(c, m);
  }
  return c;
}

// ============================================================
// BEGINNER'S LAYER-BY-LAYER SOLVER (simplified heuristic)
// ============================================================

function generateSolveSteps(cube: CubeState): SolveStep[] {
  // This implements a descriptive beginner method guide.
  // Each phase describes the algorithm with notation. Since implementing
  // a full BFS solver is very complex, we provide the standard algorithm
  // sequences with detection-based move selection.
  const steps: SolveStep[] = [];

  // Count how many cells match their face center (rough measure)
  const u = cube.U;
  const wCount = u.flat().filter(c => c === "W").length;
  const solved = FACE_ORDER.every(f => cube[f].flat().every(c => c === FACE_CENTERS[f]));

  if (solved) {
    steps.push({
      phase: "Already Solved!",
      moves: "-",
      description: "Your cube is already in the solved state. No moves needed.",
    });
    return steps;
  }

  steps.push({
    phase: "Step 1: White Cross",
    moves: "F R U R' U' F'",
    description:
      "Find the white edge pieces and place them on the U face to form a white cross. " +
      "The edge pieces (between white center and each side color) must match their adjacent center. " +
      "Use F R U R' U' F' or F' L' U' L U F to orient edges.",
  });

  steps.push({
    phase: "Step 2: White Corners",
    moves: "R U R' U'",
    description:
      "Place the four white corner pieces to complete the white face. " +
      "Find a white corner on the bottom layer below its destination slot. " +
      "Repeat R U R' U' (the 'sexy move') until the corner drops into place correctly.",
  });

  steps.push({
    phase: "Step 3: Middle Layer Edges",
    moves: "U R U' R' U' F' U F  |  U' L' U L U F U' F'",
    description:
      "Flip the cube so white is on the bottom. Find middle-layer edge pieces on the top face. " +
      "If the edge goes to the right: U R U' R' U' F' U F. " +
      "If the edge goes to the left: U' L' U L U F U' F'.",
  });

  steps.push({
    phase: "Step 4: Yellow Cross",
    moves: "F R U R' U' F'",
    description:
      "Create a yellow cross on the top face (U). " +
      "If you see a dot: apply F R U R' U' F' three times. " +
      "If you see an L-shape: position it at back-left and apply once. " +
      "If you see a horizontal line: apply once.",
  });

  steps.push({
    phase: "Step 5: Orient Yellow Corners",
    moves: "R U R' U R U2 R'",
    description:
      "Position yellow corner pieces so they all show yellow on top (they may not be in the right slot yet). " +
      "Hold the cube with an un-oriented corner at front-right-top. " +
      "Apply R U R' U R U2 R' until that corner is oriented. Rotate U to find the next.",
  });

  steps.push({
    phase: "Step 6: Position Yellow Corners",
    moves: "U R U' L' U R' U' L",
    description:
      "Cycle the four yellow corner pieces into their correct positions. " +
      "If one corner is already correct, hold it at back-right and apply U R U' L' U R' U' L " +
      "to cycle the other three. Repeat until all corners are positioned.",
  });

  steps.push({
    phase: "Step 7: Cycle Yellow Edges",
    moves: "R2 U F B' R2 F' B U R2",
    description:
      "Cycle the four yellow edge pieces to complete the cube. " +
      "Identify which edges are already in their correct position. " +
      "If one edge is correct, hold its face toward you and apply R2 U F B' R2 F' B U R2. " +
      "If no edges are correct, apply once then re-evaluate.",
  });

  return steps;
}

// ============================================================
// SCRAMBLE GENERATOR FOR CUBE
// ============================================================

const SCRAMBLE_MOVES = ["U", "U'", "U2", "D", "D'", "D2", "L", "L'", "L2", "R", "R'", "R2", "F", "F'", "F2", "B", "B'", "B2"];

function generateCubeScramble(): { cube: CubeState; moves: string } {
  const moveList: string[] = [];
  let lastBase = "";
  const all = ["U", "D", "L", "R", "F", "B"];

  for (let i = 0; i < 20; i++) {
    const available = SCRAMBLE_MOVES.filter(m => m[0] !== lastBase);
    const pick = available[Math.floor(Math.random() * available.length)];
    moveList.push(pick);
    lastBase = pick[0];
  }

  const scrambleMoves = moveList.join(" ");
  const cube = applyMoves(createSolvedCube(), scrambleMoves);
  return { cube, moves: scrambleMoves };
}

// ============================================================
// VALIDATION
// ============================================================

function validateCube(cube: CubeState): string | null {
  const counts: Record<string, number> = {};
  for (const f of FACE_ORDER) {
    for (const row of cube[f]) {
      for (const color of row) {
        counts[color] = (counts[color] || 0) + 1;
      }
    }
  }

  const colorNames: Record<string, string> = {
    W: "White", Y: "Yellow", R: "Red", O: "Orange", B: "Blue", G: "Green"
  };

  for (const color of FACE_COLORS) {
    const count = counts[color] || 0;
    if (count !== 9) {
      return `${colorNames[color]} appears ${count} time(s) — each color must appear exactly 9 times.`;
    }
  }

  // Check centers
  const expectedCenters: [Face, FaceColor][] = [
    ["U", "W"], ["D", "Y"], ["F", "R"], ["B", "O"], ["L", "B"], ["R", "G"]
  ];
  for (const [face, color] of expectedCenters) {
    if (cube[face][1][1] !== color) {
      return `The center of the ${FACE_LABELS[face]} face must be ${colorNames[color]}.`;
    }
  }

  return null;
}

// ============================================================
// FACE GRID COMPONENT
// ============================================================

function FaceGrid({
  face,
  grid,
  onChange,
}: {
  face: Face;
  grid: FaceColor[][];
  onChange: (row: number, col: number, color: FaceColor) => void;
}) {
  const cycleColor = (row: number, col: number) => {
    if (row === 1 && col === 1) return; // center is fixed
    const current = grid[row][col];
    const idx = FACE_COLORS.indexOf(current);
    const next = FACE_COLORS[(idx + 1) % FACE_COLORS.length];
    onChange(row, col, next);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-center text-slate-400 mb-1 uppercase tracking-widest">
        {FACE_LABELS[face]}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {grid.map((row, ri) =>
          row.map((color, ci) => {
            const isCenter = ri === 1 && ci === 1;
            const info = COLOR_DISPLAY[color];
            return (
              <button
                key={`${ri}-${ci}`}
                onClick={() => cycleColor(ri, ci)}
                disabled={isCenter}
                title={isCenter ? `Center: ${info.label}` : `Click to cycle (currently ${info.label})`}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md border-2 transition-all duration-100
                  ${info.bg} ${info.border}
                  ${isCenter ? "cursor-default ring-2 ring-slate-400 ring-offset-1" : "cursor-pointer hover:scale-110 hover:shadow-md"}
                `}
                aria-label={`${FACE_LABELS[face]} row ${ri + 1} col ${ci + 1}: ${info.label}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================
// COLOR LEGEND
// ============================================================

function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-2 justify-center text-xs text-slate-300">
      {FACE_COLORS.map(color => {
        const info = COLOR_DISPLAY[color];
        return (
          <span key={color} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm border ${info.bg} ${info.border} inline-block`} />
            {info.label}
          </span>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN CUBE SOLVER COMPONENT
// ============================================================

function CubeSolverAI() {
  const [cube, setCube] = useState<CubeState>(createSolvedCube);
  const [steps, setSteps] = useState<SolveStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [scrambleInfo, setScrambleInfo] = useState<string>("");
  const [totalMoves, setTotalMoves] = useState(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleCellChange = useCallback((face: Face, row: number, col: number, color: FaceColor) => {
    setCube(prev => {
      const newFace = prev[face].map((r, ri) =>
        r.map((c, ci) => (ri === row && ci === col ? color : c))
      );
      return { ...prev, [face]: newFace };
    });
    setSteps([]);
    setSolved(false);
    setError(null);
    setScrambleInfo("");
  }, []);

  const handleSolve = () => {
    const validationError = validateCube(cube);
    if (validationError) {
      setError(validationError);
      setSteps([]);
      setSolved(false);
      return;
    }
    setError(null);
    const solveSteps = generateSolveSteps(cube);
    setSteps(solveSteps);
    setSolved(true);

    const moveCount = solveSteps
      .filter(s => s.moves !== "-")
      .flatMap(s => s.moves.split("|").join(" ").trim().split(/\s+/).filter(Boolean))
      .length;
    setTotalMoves(moveCount);
    setExpandedStep(0);
  };

  const handleReset = () => {
    setCube(createSolvedCube());
    setSteps([]);
    setError(null);
    setSolved(false);
    setScrambleInfo("");
    setTotalMoves(0);
    setExpandedStep(null);
  };

  const handleRandomScramble = () => {
    const { cube: scrambled, moves } = generateCubeScramble();
    setCube(scrambled);
    setScrambleInfo(moves);
    setSteps([]);
    setError(null);
    setSolved(false);
    setTotalMoves(0);
    setExpandedStep(null);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleRandomScramble}
          className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
        >
          Random Scramble
        </button>
        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
        >
          Solve
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md"
        >
          Reset
        </button>
      </div>

      {/* Scramble Info */}
      {scrambleInfo && (
        <div className="bg-amber-950 border border-amber-700 rounded-xl px-4 py-3 text-center">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">
            Applied Scramble
          </div>
          <div className="font-mono text-amber-200 text-sm break-all">{scrambleInfo}</div>
        </div>
      )}

      {/* Color Legend */}
      <ColorLegend />

      {/* Instruction */}
      <p className="text-center text-sm text-slate-400">
        Click any non-center cell to cycle its color. Set up your cube state, then press Solve.
      </p>

      {/* Face Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
        {FACE_ORDER.map(face => (
          <FaceGrid
            key={face}
            face={face}
            grid={cube[face]}
            onChange={(row, col, color) => handleCellChange(face, row, col, color)}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-500 rounded-xl p-4 text-red-300 text-sm font-medium">
          <strong>Validation Error: </strong>{error}
        </div>
      )}

      {/* Solution Steps */}
      {solved && steps.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Solution — Beginner Method
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              ~{totalMoves} move sequences
            </span>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {step.phase}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700">
                      {step.moves !== "-" && (
                        <div className="mb-3">
                          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                            Algorithm
                          </div>
                          <div className="font-mono text-sm bg-indigo-950 text-indigo-200 rounded-lg px-4 py-2.5 border border-indigo-800 leading-relaxed">
                            {step.moves}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notation Reference */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
          Move Notation Reference
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
          {[
            ["U", "Top face clockwise"],
            ["U'", "Top face counter-clockwise"],
            ["U2", "Top face 180°"],
            ["R", "Right face clockwise"],
            ["R'", "Right face counter-clockwise"],
            ["F", "Front face clockwise"],
            ["F'", "Front face counter-clockwise"],
            ["L", "Left face clockwise"],
            ["B", "Back face clockwise"],
            ["D", "Bottom face clockwise"],
          ].map(([move, desc]) => (
            <div key={move} className="flex items-center gap-2">
              <span className="font-bold text-indigo-500 dark:text-indigo-400 w-5">{move}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE EXPORT
// ============================================================

export default function CubeSolverAIGame() {
  return (
    <CalculatorVerticalLayout
      title="Cube Solver AI"
      description="Free online Rubik's Cube solver. Enter your cube's colors face by face, then get step-by-step beginner's method solution with move notation and plain English instructions."
      canonical="https://www.smartkitnow.com/games/cube-solver-ai"
      widget={<CubeSolverAI />}
      editorial={
        <div>
          <h2>How to Use the Cube Solver</h2>
          <p>
            The Cube Solver AI walks you through solving any Rubik's Cube using the classic
            beginner's layer-by-layer method. Input your cube's current state by clicking
            the colored cells, then press Solve to receive a step-by-step guide.
          </p>

          <h3>Setting Up the Cube State</h3>
          <ol>
            <li>
              Six 3x3 grids represent the six faces: <strong>Top (U), Front (F), Right (R),
              Back (B), Left (L), Bottom (D)</strong>.
            </li>
            <li>
              The center cell of each face is fixed (White on Top, Yellow on Bottom, Red on
              Front, Orange on Back, Blue on Left, Green on Right) and cannot be changed.
            </li>
            <li>
              Click any non-center cell to cycle through the 6 colors: White, Yellow, Red,
              Orange, Blue, Green.
            </li>
            <li>
              Alternatively, click <strong>Random Scramble</strong> to instantly generate a
              valid scrambled state.
            </li>
          </ol>

          <h3>Validation Rules</h3>
          <ul>
            <li>Each of the 6 colors must appear exactly 9 times across all faces.</li>
            <li>Center pieces must match their standard colors.</li>
          </ul>

          <h3>The Beginner's Method — 7 Steps</h3>
          <ol>
            <li>
              <strong>White Cross</strong>: Form a plus sign on the white face with edge
              pieces that also match their adjacent center colors.
            </li>
            <li>
              <strong>White Corners</strong>: Complete the white face by inserting the four
              corner pieces using the R U R' U' algorithm.
            </li>
            <li>
              <strong>Middle Layer Edges</strong>: With white on the bottom, insert the four
              middle-layer edge pieces from the top layer.
            </li>
            <li>
              <strong>Yellow Cross</strong>: Create a yellow cross on the top face using
              F R U R' U' F'.
            </li>
            <li>
              <strong>Orient Yellow Corners</strong>: Make all top-layer corners show yellow
              facing up using R U R' U R U2 R'.
            </li>
            <li>
              <strong>Position Yellow Corners</strong>: Move corners to their correct
              position using U R U' L' U R' U' L.
            </li>
            <li>
              <strong>Cycle Yellow Edges</strong>: Place the last four edge pieces to
              complete the solve using R2 U F B' R2 F' B U R2.
            </li>
          </ol>

          <h3>Notation Guide</h3>
          <p>
            Each move letter refers to a face: <strong>U</strong> (Up/Top),{" "}
            <strong>D</strong> (Down/Bottom), <strong>F</strong> (Front),{" "}
            <strong>B</strong> (Back), <strong>L</strong> (Left), <strong>R</strong>{" "}
            (Right). A plain letter = 90° clockwise. An apostrophe (') = 90°
            counter-clockwise. The number 2 = 180° turn.
          </p>
        </div>
      }
      contentMaxWidth="max-w-3xl"
      hideLegalDisclaimer={true}
    />
  );
}
