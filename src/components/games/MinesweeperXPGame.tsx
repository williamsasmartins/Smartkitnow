import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

type CellState = "hidden" | "revealed" | "flagged" | "question";

interface Cell {
  mine: boolean;
  adjacent: number;
  state: CellState;
}

interface ModeConfig {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

const MODES: ModeConfig[] = [
  { label: "Beginner", rows: 9, cols: 9, mines: 10 },
  { label: "Intermediate", rows: 16, cols: 16, mines: 40 },
  { label: "Expert", rows: 16, cols: 30, mines: 99 },
];

const NUM_COLORS: Record<number, string> = {
  1: "#0000ff", 2: "#008000", 3: "#ff0000", 4: "#000080",
  5: "#800000", 6: "#008080", 7: "#000000", 8: "#808080",
};

const xpBorder = "box-shadow: inset -1px -1px #fff, inset 1px 1px #7a7a7a, inset -2px -2px #dfdfdf, inset 2px 2px #555";

function buildEmpty(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, adjacent: 0, state: "hidden" as CellState }))
  );
}

function placeMines(board: Cell[][], rows: number, cols: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (newBoard[r][c].mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    newBoard[r][c] = { ...newBoard[r][c], mine: true };
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].mine) count++;
        }
      }
      newBoard[r][c] = { ...newBoard[r][c], adjacent: count };
    }
  }
  return newBoard;
}

function revealCells(board: Cell[][], rows: number, cols: number, r: number, c: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const stack = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    const cell = newBoard[cr][cc];
    if (cell.state !== "hidden") continue;
    newBoard[cr][cc] = { ...cell, state: "revealed" };
    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([cr + dr, cc + dc]);
        }
      }
    }
  }
  return newBoard;
}

function GameUI() {
  const [modeIdx, setModeIdx] = useState(0);
  const [board, setBoard] = useState<Cell[][]>(() => buildEmpty(MODES[0].rows, MODES[0].cols));
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [face, setFace] = useState<"smile" | "shock" | "win" | "dead">("smile");
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boardInitRef = useRef(false);

  const mode = MODES[modeIdx];

  const countFlags = useCallback((b: Cell[][]) =>
    b.flat().filter(c => c.state === "flagged").length, []);

  const checkWin = useCallback((b: Cell[][], mines: number, rows: number, cols: number): boolean => {
    const total = rows * cols;
    const revealed = b.flat().filter(c => c.state === "revealed").length;
    return revealed === total - mines;
  }, []);

  const resetGame = useCallback(() => {
    const m = MODES[modeIdx];
    setBoard(buildEmpty(m.rows, m.cols));
    setGameState("idle");
    setElapsed(0);
    setFlagCount(0);
    setFace("smile");
    boardInitRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
  }, [modeIdx]);

  useEffect(() => { resetGame(); }, [modeIdx, resetGame]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.min(Math.floor((Date.now() - startTimeRef.current!) / 1000), 999));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleLeftClick = useCallback((r: number, c: number) => {
    if (gameState === "won" || gameState === "lost") return;
    const cell = board[r][c];
    if (cell.state === "flagged" || cell.state === "revealed") return;

    let currentBoard = board;

    if (!boardInitRef.current) {
      boardInitRef.current = true;
      currentBoard = placeMines(board, mode.rows, mode.cols, mode.mines, r, c);
      setGameState("playing");
      startTimer();
    }

    if (currentBoard[r][c].mine) {
      const explodedBoard = currentBoard.map((row, ri) =>
        row.map((cell, ci) => {
          if (cell.mine && cell.state !== "flagged") return { ...cell, state: "revealed" as CellState };
          if (!cell.mine && cell.state === "flagged") return { ...cell, state: "revealed" as CellState };
          return cell;
        })
      );
      setBoard(explodedBoard);
      setGameState("lost");
      setFace("dead");
      stopTimer();
      return;
    }

    const revealed = revealCells(currentBoard, mode.rows, mode.cols, r, c);
    setBoard(revealed);

    if (checkWin(revealed, mode.mines, mode.rows, mode.cols)) {
      const flaggedBoard = revealed.map(row =>
        row.map(cell => cell.mine && cell.state !== "flagged" ? { ...cell, state: "flagged" as CellState } : cell)
      );
      setBoard(flaggedBoard);
      setGameState("won");
      setFace("win");
      stopTimer();
      setFlagCount(mode.mines);
    }
  }, [board, gameState, mode, startTimer, stopTimer, checkWin]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === "won" || gameState === "lost") return;
    const cell = board[r][c];
    if (cell.state === "revealed") return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const newState: CellState = cell.state === "hidden" ? "flagged" : cell.state === "flagged" ? "question" : "hidden";
    newBoard[r][c] = { ...newBoard[r][c], state: newState };
    setBoard(newBoard);
    setFlagCount(countFlags(newBoard));
  }, [board, gameState, countFlags]);

  const handleChord = useCallback((r: number, c: number) => {
    if (gameState !== "playing") return;
    const cell = board[r][c];
    if (cell.state !== "revealed" || cell.adjacent === 0) return;
    let adjacentFlags = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < mode.rows && nc >= 0 && nc < mode.cols && board[nr][nc].state === "flagged") adjacentFlags++;
      }
    }
    if (adjacentFlags !== cell.adjacent) return;

    let currentBoard = board;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= mode.rows || nc < 0 || nc >= mode.cols) continue;
        if (currentBoard[nr][nc].state !== "hidden") continue;
        if (currentBoard[nr][nc].mine) {
          const explodedBoard = currentBoard.map(row =>
            row.map(cell => cell.mine && cell.state !== "flagged" ? { ...cell, state: "revealed" as CellState } : cell)
          );
          setBoard(explodedBoard);
          setGameState("lost");
          setFace("dead");
          stopTimer();
          return;
        }
        currentBoard = revealCells(currentBoard, mode.rows, mode.cols, nr, nc);
      }
    }
    setBoard(currentBoard);
    if (checkWin(currentBoard, mode.mines, mode.rows, mode.cols)) {
      setGameState("won");
      setFace("win");
      stopTimer();
    }
  }, [board, gameState, mode, stopTimer, checkWin]);

  const minesLeft = mode.mines - flagCount;
  const cellSize = modeIdx === 2 ? 20 : modeIdx === 1 ? 22 : 28;

  const getCellStyle = (cell: Cell, r: number, c: number): React.CSSProperties => {
    if (cell.state === "revealed") {
      return {
        width: cellSize,
        height: cellSize,
        backgroundColor: "#c0c0c0",
        border: "1px solid #888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: cellSize * 0.55,
        fontWeight: "bold",
        color: cell.mine ? "#f00" : NUM_COLORS[cell.adjacent] ?? "transparent",
        cursor: "default",
        boxSizing: "border-box",
        userSelect: "none",
      };
    }
    return {
      width: cellSize,
      height: cellSize,
      backgroundColor: "#c0c0c0",
      boxShadow: "inset -1px -1px #888, inset 1px 1px #fff, inset -2px -2px #a0a0a0, inset 2px 2px #dfdfdf",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: cellSize * 0.6,
      cursor: "pointer",
      boxSizing: "border-box",
      userSelect: "none",
    };
  };

  const getCellContent = (cell: Cell) => {
    if (cell.state === "flagged") return "🚩";
    if (cell.state === "question") return "?";
    if (cell.state === "hidden") return "";
    if (cell.mine) return "💣";
    if (cell.adjacent === 0) return "";
    return String(cell.adjacent);
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="flex gap-2 mb-1">
        {MODES.map((m, i) => (
          <button
            key={i}
            onClick={() => setModeIdx(i)}
            className="px-2 py-0.5 text-xs font-bold rounded"
            style={{
              backgroundColor: modeIdx === i ? "#000080" : "#c0c0c0",
              color: modeIdx === i ? "#fff" : "#000",
              boxShadow: modeIdx === i
                ? "inset 1px 1px #888, inset -1px -1px #fff"
                : "inset -1px -1px #888, inset 1px 1px #fff, inset -2px -2px #a0a0a0, inset 2px 2px #dfdfdf",
              border: "none",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: "#c0c0c0", padding: 6, display: "inline-block", boxShadow: "inset -2px -2px #fff, inset 2px 2px #7a7a7a, inset -4px -4px #dfdfdf, inset 4px 4px #555" }}>
        <div style={{ marginBottom: 4, padding: "4px 6px", backgroundColor: "#c0c0c0", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "inset 2px 2px #888, inset -2px -2px #fff", gap: 16, minWidth: Math.max(180, mode.cols * cellSize) }}>
          <div style={{ backgroundColor: "#000", color: "#f00", fontFamily: "monospace", fontWeight: "bold", fontSize: 22, padding: "2px 4px", minWidth: 52, textAlign: "right", letterSpacing: 2 }}>
            {String(Math.max(0, minesLeft)).padStart(3, "0")}
          </div>
          <button
            onClick={resetGame}
            style={{ width: 30, height: 30, fontSize: 18, backgroundColor: "#c0c0c0", border: "none", cursor: "pointer", boxShadow: "inset -1px -1px #888, inset 1px 1px #fff, inset -2px -2px #a0a0a0, inset 2px 2px #dfdfdf", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseDown={(e) => { e.currentTarget.style.boxShadow = "inset 1px 1px #888, inset -1px -1px #fff"; }}
            onMouseUp={(e) => { e.currentTarget.style.boxShadow = "inset -1px -1px #888, inset 1px 1px #fff, inset -2px -2px #a0a0a0, inset 2px 2px #dfdfdf"; }}
          >
            {face === "smile" ? "🙂" : face === "shock" ? "😮" : face === "win" ? "😎" : "😵"}
          </button>
          <div style={{ backgroundColor: "#000", color: "#f00", fontFamily: "monospace", fontWeight: "bold", fontSize: 22, padding: "2px 4px", minWidth: 52, textAlign: "right", letterSpacing: 2 }}>
            {String(Math.min(elapsed, 999)).padStart(3, "0")}
          </div>
        </div>

        <div
          style={{ display: "inline-grid", gridTemplateColumns: `repeat(${mode.cols}, ${cellSize}px)`, boxShadow: "inset 2px 2px #888, inset -2px -2px #fff", overflow: "auto", maxWidth: "calc(100vw - 40px)" }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                style={getCellStyle(cell, r, c)}
                onClick={() => handleLeftClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                onDoubleClick={() => handleChord(r, c)}
                onMouseDown={() => { if (cell.state === "hidden" && gameState !== "lost" && gameState !== "won") setFace("shock"); }}
                onMouseUp={() => { if (face === "shock") setFace("smile"); }}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      {gameState === "won" && (
        <div className="text-green-700 font-bold text-sm bg-gray-100 px-3 py-1 rounded">
          You Win! Time: {elapsed}s
        </div>
      )}
      {gameState === "lost" && (
        <div className="text-red-700 font-bold text-sm bg-gray-100 px-3 py-1 rounded">
          Boom! Click the smiley to restart.
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Left-click to reveal. Right-click to flag. Double-click revealed number to chord.
      </p>
    </div>
  );
}

export default function MinesweeperXPGame() {
  return (
    <CalculatorVerticalLayout
      title="Minesweeper XP - Classic Windows Game"
      description="The classic Minesweeper in Windows XP style! Three difficulty modes. Left-click to reveal, right-click to flag. Don't hit the mines!"
      canonical="https://www.smartkitnow.com/games/minesweeper-xp"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Minesweeper XP</h2>
          <p>
            Clear the minefield without detonating any mines! Numbers reveal how many mines are adjacent
            to each revealed cell. Use logic to determine which cells are safe.
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Left Click:</strong> Reveal a cell</li>
            <li><strong>Right Click:</strong> Flag/unflag a cell as a mine (cycles: hidden → flag → question → hidden)</li>
            <li><strong>Double Click:</strong> Chord — if the number of adjacent flags matches the number, auto-reveal remaining neighbors</li>
            <li><strong>Smiley Button:</strong> Start a new game</li>
          </ul>
          <h3>Difficulty Modes</h3>
          <ul>
            <li><strong>Beginner:</strong> 9×9 grid with 10 mines</li>
            <li><strong>Intermediate:</strong> 16×16 grid with 40 mines</li>
            <li><strong>Expert:</strong> 30×16 grid with 99 mines</li>
          </ul>
          <h3>Tips</h3>
          <p>
            Your first click is always safe — the board is generated after you click. The mine counter
            in the top-left shows how many unflagged mines remain. The timer starts on your first click.
          </p>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
