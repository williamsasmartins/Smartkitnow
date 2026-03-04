import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Player = "white" | "red";
type PointState = { color: Player; count: number } | null;
type Board = PointState[]; // 24 points, index 0-23

interface GameState {
  board: Board;
  barWhite: number;
  barRed: number;
  borneOffWhite: number;
  borneOffRed: number;
  currentPlayer: Player;
  dice: number[];
  movesLeft: number[];
  phase: "start" | "rolling" | "moving" | "over";
  winner: Player | null;
  selected: number | null; // selected point index (-1 = bar)
  validMoves: number[];
  scores: { white: number; red: number };
}

// Starting position: white moves from point 24→1 (index 23→0), red moves 1→24 (index 0→23)
// White: 2 on point 24 (idx 23), 5 on point 13 (idx 12), 3 on point 8 (idx 7), 5 on point 6 (idx 5)
// Red:   2 on point 1 (idx 0),  5 on point 12 (idx 11), 3 on point 17 (idx 16), 5 on point 19 (idx 18)
function buildStartBoard(): Board {
  const board: Board = Array(24).fill(null);
  board[0] = { color: "red", count: 2 };
  board[5] = { color: "white", count: 5 };
  board[7] = { color: "white", count: 3 };
  board[11] = { color: "red", count: 5 };
  board[12] = { color: "white", count: 5 };
  board[16] = { color: "red", count: 3 };
  board[18] = { color: "red", count: 5 };
  board[23] = { color: "white", count: 2 };
  return board;
}

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice(): number[] {
  const d1 = rollDie();
  const d2 = rollDie();
  if (d1 === d2) return [d1, d1, d1, d1];
  return [d1, d2];
}

// Direction: white moves high→low (23→0), red moves low→high (0→23)
function getDirection(player: Player): number {
  return player === "white" ? -1 : 1;
}

// Home board: white = points 0-5 (idx 0-5), red = points 18-23 (idx 18-23)
function isInHomeBoard(player: Player, pointIdx: number): boolean {
  return player === "white" ? pointIdx <= 5 : pointIdx >= 18;
}

function allCheckersHome(board: Board, player: Player, bar: number): boolean {
  if (bar > 0) return false;
  for (let i = 0; i < 24; i++) {
    if (!isInHomeBoard(player, i) && board[i] && board[i]!.color === player) return true;
  }
  return false;
}

function canBearOff(board: Board, player: Player, bar: number): boolean {
  if (bar > 0) return false;
  for (let i = 0; i < 24; i++) {
    if (!isInHomeBoard(player, i) && board[i] && board[i]!.color === player) return false;
  }
  return true;
}

function getValidDestinations(
  board: Board,
  fromIdx: number, // -1 = bar
  die: number,
  player: Player,
  barCount: number
): number[] {
  const dir = getDirection(player);
  const bearingOff = canBearOff(board, player, fromIdx === -1 ? barCount : 0);
  const results: number[] = [];

  if (fromIdx === -1) {
    // Re-entering from bar
    const targetIdx = player === "white" ? 24 - die : die - 1;
    if (targetIdx < 0 || targetIdx > 23) return [];
    const pt = board[targetIdx];
    if (!pt || pt.color === player || pt.count === 1) results.push(targetIdx);
    return results;
  }

  const to = fromIdx + dir * die;

  if (bearingOff) {
    if (player === "white") {
      if (to < 0) {
        // Exact or overshoot — check no checker on higher point
        let exactOk = to === -1;
        if (!exactOk) {
          // Overshoot: no checker on any higher home point
          let highest = -1;
          for (let i = 5; i >= 0; i--) {
            if (board[i] && board[i]!.color === "white") { highest = i; break; }
          }
          if (highest === fromIdx) exactOk = true;
        }
        if (exactOk) results.push(24); // 24 = bear-off indicator
      } else if (to >= 0 && to <= 23) {
        const pt = board[to];
        if (!pt || pt.color === player || pt.count === 1) results.push(to);
      }
    } else {
      if (to > 23) {
        let exactOk = to === 24;
        if (!exactOk) {
          let lowest = 24;
          for (let i = 18; i <= 23; i++) {
            if (board[i] && board[i]!.color === "red") { lowest = i; break; }
          }
          if (lowest === fromIdx) exactOk = true;
        }
        if (exactOk) results.push(24); // bear-off indicator
      } else if (to >= 0 && to <= 23) {
        const pt = board[to];
        if (!pt || pt.color === player || pt.count === 1) results.push(to);
      }
    }
  } else {
    if (to >= 0 && to <= 23) {
      const pt = board[to];
      if (!pt || pt.color === player || pt.count === 1) results.push(to);
    }
  }
  return results;
}

function applyMove(
  board: Board,
  from: number,
  to: number,
  player: Player,
  barWhite: number,
  barRed: number,
  borneOffWhite: number,
  borneOffRed: number
): { board: Board; barWhite: number; barRed: number; borneOffWhite: number; borneOffRed: number } {
  const newBoard = board.map((p) => (p ? { ...p } : null)) as Board;
  const opp: Player = player === "white" ? "red" : "white";
  let newBarW = barWhite;
  let newBarR = barRed;
  let newBornW = borneOffWhite;
  let newBornR = borneOffRed;

  // Remove from source
  if (from === -1) {
    if (player === "white") newBarW = Math.max(0, newBarW - 1);
    else newBarR = Math.max(0, newBarR - 1);
  } else {
    const src = newBoard[from]!;
    if (src.count === 1) newBoard[from] = null;
    else newBoard[from] = { color: player, count: src.count - 1 };
  }

  // Bear off
  if (to === 24) {
    if (player === "white") newBornW++;
    else newBornR++;
    return { board: newBoard, barWhite: newBarW, barRed: newBarR, borneOffWhite: newBornW, borneOffRed: newBornR };
  }

  // Hit blot
  if (newBoard[to] && newBoard[to]!.color === opp && newBoard[to]!.count === 1) {
    if (opp === "white") newBarW++;
    else newBarR++;
    newBoard[to] = null;
  }

  // Place on destination
  if (newBoard[to]) {
    newBoard[to] = { color: player, count: newBoard[to]!.count + 1 };
  } else {
    newBoard[to] = { color: player, count: 1 };
  }

  return { board: newBoard, barWhite: newBarW, barRed: newBarR, borneOffWhite: newBornW, borneOffRed: newBornR };
}

function hasAnyMove(board: Board, player: Player, movesLeft: number[], barWhite: number, barRed: number): boolean {
  const bar = player === "white" ? barWhite : barRed;
  const uniqueDice = [...new Set(movesLeft)];
  for (const die of uniqueDice) {
    if (bar > 0) {
      const dests = getValidDestinations(board, -1, die, player, bar);
      if (dests.length > 0) return true;
    } else {
      for (let i = 0; i < 24; i++) {
        if (board[i] && board[i]!.color === player) {
          const dests = getValidDestinations(board, i, die, player, 0);
          if (dests.length > 0) return true;
        }
      }
    }
  }
  return false;
}

function initialState(): GameState {
  return {
    board: buildStartBoard(),
    barWhite: 0,
    barRed: 0,
    borneOffWhite: 0,
    borneOffRed: 0,
    currentPlayer: "white",
    dice: [],
    movesLeft: [],
    phase: "start",
    winner: null,
    selected: null,
    validMoves: [],
    scores: { white: 0, red: 0 },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Logic
// ─────────────────────────────────────────────────────────────────────────────
function evaluateBoard(board: Board, barW: number, barR: number, bornW: number, bornR: number): number {
  // Positive = good for red, higher borne off red = better
  let score = 0;
  score += bornR * 3 - bornW * 3;
  score -= barR * 2 - barW * 2;
  for (let i = 0; i < 24; i++) {
    const p = board[i];
    if (!p) continue;
    if (p.color === "red") score += (i + 1) * 0.1;
    else score -= (24 - i) * 0.1;
  }
  return score;
}

function getAIMove(
  board: Board,
  movesLeft: number[],
  barRed: number,
  barWhite: number,
  borneOffWhite: number,
  borneOffRed: number
): { from: number; to: number } | null {
  const player: Player = "red";
  const uniqueDice = [...new Set(movesLeft)];
  let bestScore = -Infinity;
  let bestMove: { from: number; to: number } | null = null;

  for (const die of uniqueDice) {
    if (barRed > 0) {
      const dests = getValidDestinations(board, -1, die, player, barRed);
      for (const to of dests) {
        const r = applyMove(board, -1, to, player, barWhite, barRed, borneOffWhite, borneOffRed);
        const s = evaluateBoard(r.board, r.barWhite, r.barRed, r.borneOffWhite, r.borneOffRed);
        if (s > bestScore) { bestScore = s; bestMove = { from: -1, to }; }
      }
    } else {
      for (let i = 0; i < 24; i++) {
        if (!board[i] || board[i]!.color !== player) continue;
        const dests = getValidDestinations(board, i, die, player, 0);
        for (const to of dests) {
          const r = applyMove(board, i, to, player, barWhite, barRed, borneOffWhite, borneOffRed);
          const s = evaluateBoard(r.board, r.barWhite, r.barRed, r.borneOffWhite, r.borneOffRed);
          if (s > bestScore) { bestScore = s; bestMove = { from: i, to }; }
        }
      }
    }
  }
  return bestMove;
}

// ─────────────────────────────────────────────────────────────────────────────
// Board Renderer
// ─────────────────────────────────────────────────────────────────────────────
function CheckerPip({ color, count, selected, valid, onClick }: {
  color: Player; count: number; selected: boolean; valid: boolean; onClick?: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col items-center cursor-pointer group`}
      onClick={onClick}
    >
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div
          key={i}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold select-none
            ${color === "white"
              ? "bg-gray-100 border-gray-400 text-gray-700"
              : "bg-red-500 border-red-700 text-white"}
            ${selected ? "ring-2 ring-yellow-400 ring-offset-1 scale-105" : ""}
            ${valid ? "ring-2 ring-green-400 ring-offset-1 scale-105 animate-pulse" : ""}
            transition-all duration-150`}
        >
          {i === 0 && count > 5 ? count : ""}
        </div>
      ))}
    </div>
  );
}

function PointComponent({ index, point, selected, isValidDest, onSelect, onDrop, isTop }: {
  index: number;
  point: PointState;
  selected: boolean;
  isValidDest: boolean;
  onSelect: (idx: number) => void;
  onDrop: (idx: number) => void;
  isTop: boolean;
}) {
  const triangleColor = index % 2 === 0 ? "#8B4513" : "#D2691E";
  const triangleLight = index % 2 === 0 ? "#A0522D" : "#CD853F";

  return (
    <div
      className={`relative flex flex-col items-center w-full cursor-pointer
        ${isValidDest ? "bg-green-200/30 dark:bg-green-800/20" : ""}
        ${isTop ? "justify-start pt-1" : "justify-end pb-1"}`}
      style={{ minHeight: 120 }}
      onClick={() => {
        if (isValidDest) onDrop(index);
        else if (point) onSelect(index);
      }}
    >
      {/* Triangle */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "100%",
          clipPath: isTop ? "polygon(50% 85%, 0% 0%, 100% 0%)" : "polygon(50% 15%, 0% 100%, 100% 100%)",
          background: `linear-gradient(${isTop ? "to bottom" : "to top"}, ${triangleColor}, ${triangleLight})`,
          opacity: 0.85,
        }}
      />
      {/* Point number */}
      <div className={`absolute text-[9px] font-bold text-white/70 ${isTop ? "bottom-0.5" : "top-0.5"}`}>
        {index + 1}
      </div>
      {/* Checkers */}
      <div className={`relative z-10 flex flex-col ${isTop ? "items-center" : "items-center flex-col-reverse"} gap-0.5`}>
        {point && (
          <CheckerPip
            color={point.color}
            count={point.count}
            selected={selected}
            valid={false}
            onClick={() => onSelect(index)}
          />
        )}
      </div>
      {/* Valid move indicator */}
      {isValidDest && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-green-400/70 border-2 border-green-500 animate-ping" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dice Component
// ─────────────────────────────────────────────────────────────────────────────
function DiceFace({ value, used }: { value: number; used: boolean }) {
  const dots: [number, number][][] = [
    [],
    [[50, 50]],
    [[20, 20], [80, 80]],
    [[20, 20], [50, 50], [80, 80]],
    [[20, 20], [80, 20], [20, 80], [80, 80]],
    [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
    [[20, 20], [80, 20], [20, 50], [80, 50], [20, 80], [80, 80]],
  ];
  return (
    <div
      className={`relative w-10 h-10 rounded-lg border-2 shadow-lg transition-all
        ${used ? "opacity-30 border-gray-400 bg-gray-200 dark:bg-gray-700" : "border-gray-600 bg-white dark:bg-gray-100 shadow-yellow-300/40"}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {(dots[value] || []).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={10} fill={used ? "#aaa" : "#1e293b"} />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Game Component
// ─────────────────────────────────────────────────────────────────────────────
function BackgammonBoard() {
  const [gs, setGs] = useState<GameState>(initialState());
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAiTimer = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
  }, []);

  const handleRoll = useCallback(() => {
    if (gs.phase !== "rolling") return;
    const dice = rollDice();
    const movesLeft = [...dice];
    const player = gs.currentPlayer;
    const bar = player === "white" ? gs.barWhite : gs.barRed;
    if (!hasAnyMove(gs.board, player, movesLeft, gs.barWhite, gs.barRed)) {
      // No moves, switch turn
      setGs((prev) => ({
        ...prev,
        dice,
        movesLeft: [],
        phase: "rolling",
        currentPlayer: player === "white" ? "red" : "white",
        selected: null,
        validMoves: [],
      }));
      return;
    }
    setGs((prev) => ({ ...prev, dice, movesLeft, phase: "moving", selected: null, validMoves: [] }));
  }, [gs]);

  const handleSelectPoint = useCallback((idx: number) => {
    if (gs.phase !== "moving" || gs.currentPlayer !== "white") return;
    const bar = gs.barWhite;
    if (bar > 0 && idx !== -1) return; // Must use bar first

    const point = idx === -1 ? { color: "white" as Player, count: bar } : gs.board[idx];
    if (!point || point.color !== "white") return;

    const uniqueDice = [...new Set(gs.movesLeft)];
    const allDests = new Set<number>();
    for (const die of uniqueDice) {
      const dests = getValidDestinations(gs.board, idx, die, "white", bar);
      dests.forEach((d) => allDests.add(d));
    }

    setGs((prev) => ({
      ...prev,
      selected: idx,
      validMoves: [...allDests],
    }));
  }, [gs]);

  const handleDropTo = useCallback((to: number) => {
    if (gs.phase !== "moving" || gs.selected === null || gs.currentPlayer !== "white") return;
    const from = gs.selected;
    const bar = gs.barWhite;

    // Find which die to use
    const usableDice = gs.movesLeft.filter((die) => {
      const dests = getValidDestinations(gs.board, from, die, "white", bar);
      return dests.includes(to);
    });
    if (usableDice.length === 0) return;

    // Prefer exact die for bearing off, else smallest die
    const die = usableDice.reduce((best, d) => {
      if (to === 24) {
        const exact = from - d === -1;
        const bestExact = from - best === -1;
        if (exact && !bestExact) return d;
        if (!exact && bestExact) return best;
      }
      return d < best ? d : best;
    });

    const newMovesLeft = [...gs.movesLeft];
    const dieIdx = newMovesLeft.indexOf(die);
    newMovesLeft.splice(dieIdx, 1);

    const result = applyMove(gs.board, from, to, "white", gs.barWhite, gs.barRed, gs.borneOffWhite, gs.borneOffRed);

    if (result.borneOffWhite === 15) {
      const newScores = { ...gs.scores, white: gs.scores.white + 1 };
      setGs((prev) => ({ ...prev, ...result, movesLeft: [], phase: "over", winner: "white", selected: null, validMoves: [], scores: newScores }));
      return;
    }

    if (newMovesLeft.length === 0 || !hasAnyMove(result.board, "white", newMovesLeft, result.barWhite, result.barRed)) {
      setGs((prev) => ({
        ...prev,
        ...result,
        movesLeft: [],
        phase: "rolling",
        currentPlayer: "red",
        selected: null,
        validMoves: [],
        dice: prev.dice,
      }));
    } else {
      setGs((prev) => ({
        ...prev,
        ...result,
        movesLeft: newMovesLeft,
        selected: null,
        validMoves: [],
        dice: prev.dice,
      }));
    }
  }, [gs]);

  // AI turn
  useEffect(() => {
    if (gs.currentPlayer !== "red" || gs.phase !== "rolling") return;
    clearAiTimer();
    aiTimerRef.current = setTimeout(() => {
      const dice = rollDice();
      let movesLeft = [...dice];
      let board = gs.board;
      let barW = gs.barWhite, barR = gs.barRed;
      let bornW = gs.borneOffWhite, bornR = gs.borneOffRed;

      const doNextMove = (ml: number[], b: Board, bw: number, br: number, bnW: number, bnR: number) => {
        if (ml.length === 0 || !hasAnyMove(b, "red", ml, bw, br)) {
          if (bnR === 15) {
            setGs((prev) => ({
              ...prev,
              board: b, barWhite: bw, barRed: br, borneOffWhite: bnW, borneOffRed: bnR,
              movesLeft: [], phase: "over", winner: "red",
              scores: { ...prev.scores, red: prev.scores.red + 1 },
              selected: null, validMoves: [], dice,
            }));
          } else {
            setGs((prev) => ({
              ...prev,
              board: b, barWhite: bw, barRed: br, borneOffWhite: bnW, borneOffRed: bnR,
              movesLeft: [], phase: "rolling", currentPlayer: "white",
              selected: null, validMoves: [], dice,
            }));
          }
          return;
        }
        const move = getAIMove(b, ml, br, bw, bnW, bnR);
        if (!move) {
          setGs((prev) => ({
            ...prev,
            board: b, barWhite: bw, barRed: br, borneOffWhite: bnW, borneOffRed: bnR,
            movesLeft: [], phase: "rolling", currentPlayer: "white",
            selected: null, validMoves: [], dice,
          }));
          return;
        }

        // Find die used
        const usableDice = ml.filter((die) => {
          const dests = getValidDestinations(b, move.from, die, "red", br);
          return dests.includes(move.to);
        });
        if (usableDice.length === 0) {
          setGs((prev) => ({
            ...prev,
            board: b, barWhite: bw, barRed: br, borneOffWhite: bnW, borneOffRed: bnR,
            movesLeft: [], phase: "rolling", currentPlayer: "white",
            selected: null, validMoves: [], dice,
          }));
          return;
        }
        const die = usableDice[0];
        const newMl = [...ml];
        newMl.splice(newMl.indexOf(die), 1);

        const r = applyMove(b, move.from, move.to, "red", bw, br, bnW, bnR);

        setGs((prev) => ({
          ...prev,
          board: r.board, barWhite: r.barWhite, barRed: r.barRed,
          borneOffWhite: r.borneOffWhite, borneOffRed: r.borneOffRed,
          movesLeft: newMl, dice, phase: "moving",
          currentPlayer: "red", selected: null, validMoves: [],
        }));

        aiTimerRef.current = setTimeout(() => {
          doNextMove(newMl, r.board, r.barWhite, r.barRed, r.borneOffWhite, r.borneOffRed);
        }, 600);
      };

      setGs((prev) => ({ ...prev, dice, movesLeft: [...dice], phase: "moving", currentPlayer: "red" }));
      aiTimerRef.current = setTimeout(() => {
        doNextMove(dice, board, barW, barR, bornW, bornR);
      }, 500);
    }, 800);

    return clearAiTimer;
  }, [gs.currentPlayer, gs.phase]);

  const newGame = useCallback(() => {
    clearAiTimer();
    setGs((prev) => ({ ...initialState(), scores: prev.scores }));
  }, [clearAiTimer]);

  const topPoints = Array.from({ length: 12 }, (_, i) => 23 - i); // points 24-13
  const botPoints = Array.from({ length: 12 }, (_, i) => i);      // points 1-12

  const barVisible = gs.barWhite > 0 || gs.barRed > 0;

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-3 px-2">
        <div className="flex gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 text-sm font-bold border border-gray-300 dark:border-gray-700">
            <span className="text-gray-400 text-xs">You (White)</span>
            <span className="text-lg font-black text-gray-700 dark:text-gray-200 ml-1">{gs.scores.white}</span>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-1 text-sm font-bold border border-red-200 dark:border-red-800">
            <span className="text-gray-400 text-xs">AI (Red)</span>
            <span className="text-lg font-black text-red-500 ml-1">{gs.scores.red}</span>
          </div>
        </div>
        <button
          onClick={newGame}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors"
        >
          New Game
        </button>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 mb-3 min-h-8">
        {gs.phase === "rolling" && gs.currentPlayer === "white" && (
          <button
            onClick={handleRoll}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 text-sm transition-all active:scale-95"
          >
            Roll Dice
          </button>
        )}
        {gs.phase === "rolling" && gs.currentPlayer === "red" && (
          <span className="text-sm text-slate-500 dark:text-slate-400 italic">AI is thinking...</span>
        )}
        {gs.phase === "moving" && gs.currentPlayer === "white" && (
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Your turn — click a white checker, then a destination
            {gs.barWhite > 0 && " (re-enter from bar first)"}
          </span>
        )}
        {gs.phase === "moving" && gs.currentPlayer === "red" && (
          <span className="text-sm text-slate-500 dark:text-slate-400 italic">AI is moving...</span>
        )}
        {gs.phase === "over" && (
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {gs.winner === "white" ? "You Win!" : "AI Wins!"}
            </span>
            <button
              onClick={newGame}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg"
            >
              Play Again
            </button>
          </div>
        )}
        {gs.phase === "start" && (
          <button
            onClick={() => setGs((prev) => ({ ...prev, phase: "rolling", currentPlayer: "white" }))}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg text-sm"
          >
            Start Game
          </button>
        )}
        {gs.dice.length > 0 && (
          <div className="flex gap-1.5 ml-2">
            {gs.dice.map((d, i) => (
              <DiceFace key={i} value={d} used={!gs.movesLeft.includes(d) || gs.movesLeft.filter(x => x === d).length < gs.dice.filter(x => x === d).length - (gs.dice.length - gs.movesLeft.length)} />
            ))}
          </div>
        )}
      </div>

      {/* Borne off count */}
      <div className="flex gap-4 mb-2 text-sm">
        <span className="text-gray-500">White borne off: <b className="text-gray-700 dark:text-gray-200">{gs.borneOffWhite}</b>/15</span>
        <span className="text-red-400">Red borne off: <b className="text-red-600">{gs.borneOffRed}</b>/15</span>
      </div>

      {/* Board */}
      <div
        className="relative bg-[#5C3317] rounded-2xl p-2 shadow-2xl w-full max-w-2xl border-4 border-[#3B1F0A]"
        style={{ minHeight: 320 }}
      >
        {/* Top half (points 24-13) */}
        <div className="grid grid-cols-13 gap-0.5 mb-1" style={{ display: "grid", gridTemplateColumns: `repeat(6, 1fr) 40px repeat(6, 1fr)` }}>
          {topPoints.slice(0, 6).map((ptIdx) => (
            <PointComponent
              key={ptIdx}
              index={ptIdx}
              point={gs.board[ptIdx]}
              selected={gs.selected === ptIdx}
              isValidDest={gs.validMoves.includes(ptIdx)}
              onSelect={handleSelectPoint}
              onDrop={handleDropTo}
              isTop={true}
            />
          ))}
          {/* Bar (top) */}
          <div
            className="flex flex-col items-center justify-center bg-[#3B1F0A] rounded cursor-pointer"
            onClick={() => gs.barWhite > 0 && handleSelectPoint(-1)}
          >
            {gs.barRed > 0 && (
              <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-700 flex items-center justify-center text-white text-xs font-bold">
                {gs.barRed > 1 ? gs.barRed : ""}
              </div>
            )}
            {gs.barWhite > 0 && (
              <div
                className={`w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-400 flex items-center justify-center text-gray-700 text-xs font-bold
                  ${gs.selected === -1 ? "ring-2 ring-yellow-400" : ""}`}
              >
                {gs.barWhite > 1 ? gs.barWhite : ""}
              </div>
            )}
            <span className="text-[8px] text-white/40 mt-1">BAR</span>
          </div>
          {topPoints.slice(6, 12).map((ptIdx) => (
            <PointComponent
              key={ptIdx}
              index={ptIdx}
              point={gs.board[ptIdx]}
              selected={gs.selected === ptIdx}
              isValidDest={gs.validMoves.includes(ptIdx)}
              onSelect={handleSelectPoint}
              onDrop={handleDropTo}
              isTop={true}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-3 bg-[#3B1F0A] mx-0 my-0.5 rounded" />

        {/* Bottom half (points 1-12) */}
        <div className="grid gap-0.5 mt-1" style={{ display: "grid", gridTemplateColumns: `repeat(6, 1fr) 40px repeat(6, 1fr)` }}>
          {botPoints.slice(0, 6).map((ptIdx) => (
            <PointComponent
              key={ptIdx}
              index={ptIdx}
              point={gs.board[ptIdx]}
              selected={gs.selected === ptIdx}
              isValidDest={gs.validMoves.includes(ptIdx)}
              onSelect={handleSelectPoint}
              onDrop={handleDropTo}
              isTop={false}
            />
          ))}
          {/* Bar (bottom) — just spacer */}
          <div className="bg-[#3B1F0A] rounded" />
          {botPoints.slice(6, 12).map((ptIdx) => (
            <PointComponent
              key={ptIdx}
              index={ptIdx}
              point={gs.board[ptIdx]}
              selected={gs.selected === ptIdx}
              isValidDest={gs.validMoves.includes(ptIdx)}
              onSelect={handleSelectPoint}
              onDrop={handleDropTo}
              isTop={false}
            />
          ))}
        </div>
      </div>

      {/* Bear off target area */}
      {gs.phase === "moving" && gs.currentPlayer === "white" && gs.validMoves.includes(24) && (
        <button
          onClick={() => handleDropTo(24)}
          className="mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm animate-pulse"
        >
          Bear Off Checker
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Export
// ─────────────────────────────────────────────────────────────────────────────
export default function BackgammonLiveGame() {
  const editorial = (
    <div className="space-y-10">
      <section id="how-to-play">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">How to Play Backgammon</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Backgammon is one of the oldest board games in the world. You play as White and your goal is to move all 15 of your checkers around the board and bear them off before your AI opponent (Red) does the same.
        </p>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">1.</span> Click <strong>Roll Dice</strong> to roll. You must use the dice shown to move your white checkers.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">2.</span> Click a white checker to select it, then click a highlighted destination point to move.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">3.</span> White moves from high-numbered points (24) toward low-numbered points (1).</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">4.</span> If you land on a point with a single enemy checker (a "blot"), it is sent to the bar.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">5.</span> A checker on the bar must re-enter the board before any other move.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">6.</span> Once all your checkers are in your home board (points 1-6), you can bear them off.</li>
          <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">7.</span> Rolling doubles gives you four moves instead of two.</li>
        </ul>
      </section>

      <section id="strategy">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Key Strategies</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Build Anchors", tip: "Placing two or more checkers on a point creates an anchor your opponent cannot hit. Build anchors in your opponent's home board to slow their bearing off." },
            { title: "Hit Blots", tip: "Sending opponent checkers to the bar forces them to lose tempo re-entering. Prioritize hitting when it doesn't leave your own blots exposed." },
            { title: "Prime the Board", tip: "A 'prime' is 6 consecutive blocked points. Trapping your opponent's checkers behind a prime is a powerful winning strategy." },
            { title: "Bear Off Efficiently", tip: "When bearing off, always use higher dice on higher points to clear them quickly. Exact rolls are ideal but overshoots count too." },
          ].map(({ title, tip }) => (
            <div key={title} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="rules">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Full Rules Reference</h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p><strong>Doublets:</strong> Rolling the same number on both dice (e.g. 3-3) grants four moves of that value, not two.</p>
          <p><strong>Blocked point:</strong> A point occupied by two or more of your opponent's checkers. You cannot land on or pass through blocked points.</p>
          <p><strong>Bar re-entry:</strong> Roll the die value corresponding to an open point in your opponent's home board. You cannot move other checkers until all bar checkers are re-entered.</p>
          <p><strong>Bearing off:</strong> Once all your checkers are in your home board (points 1-6 for White), you may bear off by rolling the exact number or higher (if no checker occupies a higher point).</p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "What does the AI do?", a: "The AI plays greedy moves — it evaluates every possible move and picks the one that advances its checkers the most, while hitting blots when possible." },
            { q: "What happens if I can't move?", a: "If none of your dice can be used (all valid destinations are blocked), your turn is automatically skipped." },
            { q: "Is the game fair?", a: "Both sides roll real random dice (1-6). The AI has no advantage over the dice — only its strategy differs." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{q}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Backgammon Live"
      description="Play backgammon against an AI opponent. Roll dice, move your white checkers, hit blots, and be the first to bear off all 15 checkers to win."
      canonical="https://www.smartkitnow.com/games/backgammon-live"
      widget={<BackgammonBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-play", label: "How to Play" },
        { id: "strategy", label: "Key Strategies" },
        { id: "rules", label: "Full Rules Reference" },
        { id: "faq", label: "FAQ" },
      ]}
      contentMaxWidth="max-w-5xl"
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
