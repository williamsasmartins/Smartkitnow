import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Color = "w" | "b";
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type Piece = { type: PieceType; color: Color } | null;
type Board = Piece[][];

interface GameState {
  board: Board;
  turn: Color;
  castling: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
  enPassant: [number, number] | null;
  halfMove: number;
  fullMove: number;
}

interface Move {
  from: [number, number];
  to: [number, number];
  promotion?: PieceType;
  castle?: "K" | "Q";
  enPassant?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PIECE_UNICODE: Record<Color, Record<PieceType, string>> = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" },
};

const PIECE_VALUES: Record<PieceType, number> = {
  K: 20000, Q: 900, R: 500, B: 330, N: 320, P: 100,
};

const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_MID_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const PIECE_TABLES: Record<PieceType, number[][]> = {
  P: PAWN_TABLE, N: KNIGHT_TABLE, B: BISHOP_TABLE,
  R: ROOK_TABLE, Q: QUEEN_TABLE, K: KING_MID_TABLE,
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL BOARD SETUP
// ─────────────────────────────────────────────────────────────────────────────
function initialBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRow: PieceType[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  backRow.forEach((type, c) => {
    b[0][c] = { type, color: "b" };
    b[7][c] = { type, color: "w" };
  });
  for (let c = 0; c < 8; c++) {
    b[1][c] = { type: "P", color: "b" };
    b[6][c] = { type: "P", color: "w" };
  }
  return b;
}

function initialGameState(): GameState {
  return {
    board: initialBoard(),
    turn: "w",
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    enPassant: null,
    halfMove: 0,
    fullMove: 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BOARD COPY (IMMUTABLE)
// ─────────────────────────────────────────────────────────────────────────────
function copyBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function copyState(state: GameState): GameState {
  return {
    board: copyBoard(state.board),
    turn: state.turn,
    castling: { ...state.castling },
    enPassant: state.enPassant ? [...state.enPassant] as [number, number] : null,
    halfMove: state.halfMove,
    fullMove: state.fullMove,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOVE GENERATION
// ─────────────────────────────────────────────────────────────────────────────
function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getRawMoves(state: GameState, r: number, c: number): Move[] {
  const { board, enPassant } = state;
  const piece = board[r][c];
  if (!piece) return [];
  const { type, color } = piece;
  const opp: Color = color === "w" ? "b" : "w";
  const moves: Move[] = [];

  function addMove(tr: number, tc: number, extras?: Partial<Move>) {
    if (!inBounds(tr, tc)) return;
    const target = board[tr][tc];
    if (target && target.color === color) return;
    moves.push({ from: [r, c], to: [tr, tc], ...extras });
  }

  function slide(dr: number, dc: number) {
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target) {
        if (target.color === opp) moves.push({ from: [r, c], to: [nr, nc] });
        break;
      }
      moves.push({ from: [r, c], to: [nr, nc] });
      nr += dr; nc += dc;
    }
  }

  switch (type) {
    case "P": {
      const dir = color === "w" ? -1 : 1;
      const startRow = color === "w" ? 6 : 1;
      const promRow = color === "w" ? 0 : 7;
      // Forward
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        if (r + dir === promRow) {
          (["Q", "R", "B", "N"] as PieceType[]).forEach(pt =>
            moves.push({ from: [r, c], to: [r + dir, c], promotion: pt })
          );
        } else {
          moves.push({ from: [r, c], to: [r + dir, c] });
        }
        // Double push
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push({ from: [r, c], to: [r + 2 * dir, c] });
        }
      }
      // Captures
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (board[nr][nc] && board[nr][nc]!.color === opp) {
          if (nr === promRow) {
            (["Q", "R", "B", "N"] as PieceType[]).forEach(pt =>
              moves.push({ from: [r, c], to: [nr, nc], promotion: pt })
            );
          } else {
            moves.push({ from: [r, c], to: [nr, nc] });
          }
        }
        // En passant
        if (enPassant && enPassant[0] === nr && enPassant[1] === nc) {
          moves.push({ from: [r, c], to: [nr, nc], enPassant: true });
        }
      }
      break;
    }
    case "N":
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        addMove(r + dr, c + dc);
      }
      break;
    case "B":
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
      break;
    case "R":
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
      break;
    case "Q":
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
      break;
    case "K":
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        addMove(r + dr, c + dc);
      }
      // Castling
      if (color === "w" && r === 7 && c === 4) {
        if (state.castling.wK && !board[7][5] && !board[7][6] && board[7][7]?.type === "R") {
          moves.push({ from: [7, 4], to: [7, 6], castle: "K" });
        }
        if (state.castling.wQ && !board[7][3] && !board[7][2] && !board[7][1] && board[7][0]?.type === "R") {
          moves.push({ from: [7, 4], to: [7, 2], castle: "Q" });
        }
      }
      if (color === "b" && r === 0 && c === 4) {
        if (state.castling.bK && !board[0][5] && !board[0][6] && board[0][7]?.type === "R") {
          moves.push({ from: [0, 4], to: [0, 6], castle: "K" });
        }
        if (state.castling.bQ && !board[0][3] && !board[0][2] && !board[0][1] && board[0][0]?.type === "R") {
          moves.push({ from: [0, 4], to: [0, 2], castle: "Q" });
        }
      }
      break;
  }
  return moves;
}

function isSquareAttacked(board: Board, r: number, c: number, byColor: Color): boolean {
  // Quick attack detection
  const opp = byColor;
  const self: Color = opp === "w" ? "b" : "w";
  // Check all opponent pieces
  for (let pr = 0; pr < 8; pr++) {
    for (let pc = 0; pc < 8; pc++) {
      const p = board[pr][pc];
      if (!p || p.color !== opp) continue;
      // Temporary state for raw moves
      const tmpState: GameState = {
        board, turn: opp, castling: { wK: false, wQ: false, bK: false, bQ: false },
        enPassant: null, halfMove: 0, fullMove: 1,
      };
      const rawMoves = getRawMoves(tmpState, pr, pc);
      if (rawMoves.some(m => m.to[0] === r && m.to[1] === c)) return true;
    }
  }
  return false;
}

function applyMove(state: GameState, move: Move): GameState {
  const next = copyState(state);
  const { board } = next;
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = board[fr][fc]!;

  // En passant capture
  if (move.enPassant) {
    const captureRow = piece.color === "w" ? tr + 1 : tr - 1;
    board[captureRow][tc] = null;
  }

  // Castling rook movement
  if (move.castle) {
    if (move.castle === "K") {
      const row = piece.color === "w" ? 7 : 0;
      board[row][5] = board[row][7];
      board[row][7] = null;
    } else {
      const row = piece.color === "w" ? 7 : 0;
      board[row][3] = board[row][0];
      board[row][0] = null;
    }
  }

  // Move piece
  board[tr][tc] = move.promotion ? { type: move.promotion, color: piece.color } : piece;
  board[fr][fc] = null;

  // Update castling rights
  if (piece.type === "K") {
    if (piece.color === "w") { next.castling.wK = false; next.castling.wQ = false; }
    else { next.castling.bK = false; next.castling.bQ = false; }
  }
  if (piece.type === "R") {
    if (fr === 7 && fc === 0) next.castling.wQ = false;
    if (fr === 7 && fc === 7) next.castling.wK = false;
    if (fr === 0 && fc === 0) next.castling.bQ = false;
    if (fr === 0 && fc === 7) next.castling.bK = false;
  }

  // En passant target
  if (piece.type === "P" && Math.abs(tr - fr) === 2) {
    next.enPassant = [(fr + tr) / 2, tc];
  } else {
    next.enPassant = null;
  }

  // Half move clock
  if (piece.type === "P" || board[tr][tc] !== piece) next.halfMove = 0;
  else next.halfMove++;

  // Full move
  if (piece.color === "b") next.fullMove++;
  next.turn = piece.color === "w" ? "b" : "w";

  return next;
}

function findKing(board: Board, color: Color): [number, number] | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.type === "K" && board[r][c]?.color === color) return [r, c];
    }
  }
  return null;
}

function isInCheck(state: GameState, color: Color): boolean {
  const king = findKing(state.board, color);
  if (!king) return false;
  const opp: Color = color === "w" ? "b" : "w";
  return isSquareAttacked(state.board, king[0], king[1], opp);
}

function getLegalMoves(state: GameState, color: Color): Move[] {
  const legal: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (!p || p.color !== color) continue;
      const raw = getRawMoves(state, r, c);
      for (const move of raw) {
        // Filter castling through check
        if (move.castle) {
          const row = color === "w" ? 7 : 0;
          const opp: Color = color === "w" ? "b" : "w";
          const cols = move.castle === "K" ? [4, 5, 6] : [4, 3, 2];
          if (cols.some(col => isSquareAttacked(state.board, row, col, opp))) continue;
        }
        const next = applyMove(state, move);
        if (!isInCheck(next, color)) legal.push(move);
      }
    }
  }
  return legal;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATION
// ─────────────────────────────────────────────────────────────────────────────
function evaluateBoard(state: GameState): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (!p) continue;
      const tableRow = p.color === "w" ? r : 7 - r;
      const tableScore = PIECE_TABLES[p.type][tableRow][c];
      const val = PIECE_VALUES[p.type] + tableScore;
      score += p.color === "w" ? val : -val;
    }
  }
  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAX WITH ALPHA-BETA PRUNING
// ─────────────────────────────────────────────────────────────────────────────
function minimax(
  state: GameState, depth: number, alpha: number, beta: number, maximizing: boolean
): number {
  const color: Color = maximizing ? "w" : "b";
  const legalMoves = getLegalMoves(state, color);

  if (depth === 0) return evaluateBoard(state);
  if (legalMoves.length === 0) {
    if (isInCheck(state, color)) return maximizing ? -99999 : 99999;
    return 0; // Stalemate
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const next = applyMove(state, move);
      const ev = minimax(next, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const next = applyMove(state, move);
      const ev = minimax(next, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(state: GameState, depth: number): Move | null {
  const legalMoves = getLegalMoves(state, "b");
  if (legalMoves.length === 0) return null;

  let best: Move | null = null;
  let bestScore = Infinity;

  for (const move of legalMoves) {
    const next = applyMove(state, move);
    const score = minimax(next, depth - 1, -Infinity, Infinity, true);
    if (score < bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

// ─────────────────────────────────────────────────────────────────────────────
// ALGEBRAIC NOTATION
// ─────────────────────────────────────────────────────────────────────────────
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

function toAlgebraic(move: Move, piece: Piece, captured: boolean): string {
  if (!piece) return "";
  const [, fc] = move.from;
  const [tr, tc] = move.to;
  const file = FILES[tc];
  const rank = RANKS[tr];

  if (move.castle === "K") return "O-O";
  if (move.castle === "Q") return "O-O-O";

  let notation = "";
  if (piece.type === "P") {
    if (captured || move.enPassant) notation = FILES[fc] + "x" + file + rank;
    else notation = file + rank;
    if (move.promotion) notation += "=" + move.promotion;
  } else {
    notation = piece.type + (captured ? "x" : "") + file + rank;
  }
  return notation;
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME UI COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ChessGameUI() {
  const [gameState, setGameState] = useState<GameState>(initialGameState());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [legalDests, setLegalDests] = useState<Move[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [stateHistory, setStateHistory] = useState<GameState[]>([initialGameState()]);
  const [status, setStatus] = useState<"playing" | "check" | "checkmate" | "stalemate">("playing");
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [captured, setCaptured] = useState<{ w: Piece[]; b: Piece[] }>({ w: [], b: [] });
  const [promotionPending, setPromotionPending] = useState<{ move: Move } | null>(null);
  const moveHistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (moveHistRef.current) {
      moveHistRef.current.scrollTop = moveHistRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const updateStatus = useCallback((state: GameState) => {
    const color = state.turn;
    const legal = getLegalMoves(state, color);
    const inCheck = isInCheck(state, color);
    if (legal.length === 0) {
      setStatus(inCheck ? "checkmate" : "stalemate");
    } else if (inCheck) {
      setStatus("check");
    } else {
      setStatus("playing");
    }
  }, []);

  const executeMove = useCallback((move: Move, currentState: GameState) => {
    const [fr, fc] = move.from;
    const [tr, tc] = move.to;
    const movingPiece = currentState.board[fr][fc];
    const capturedPiece = currentState.board[tr][tc];
    const isCapture = !!capturedPiece || !!move.enPassant;

    const notation = toAlgebraic(move, movingPiece, isCapture);
    const nextState = applyMove(currentState, move);

    setLastMove(move);
    setMoveHistory(prev => [...prev, notation]);
    setStateHistory(prev => [...prev, nextState]);
    setCaptured(prev => {
      if (!isCapture) return prev;
      const capPiece = move.enPassant
        ? { type: "P" as PieceType, color: (movingPiece!.color === "w" ? "b" : "w") as Color }
        : capturedPiece;
      if (!capPiece) return prev;
      const capturer = movingPiece!.color;
      return { ...prev, [capturer]: [...prev[capturer], capPiece] };
    });

    setGameState(nextState);
    setSelected(null);
    setLegalDests([]);
    updateStatus(nextState);
    return nextState;
  }, [updateStatus]);

  // AI turn
  useEffect(() => {
    if (gameState.turn !== "b" || status === "checkmate" || status === "stalemate") return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const bestMove = getBestMove(gameState, 3);
      if (bestMove) {
        executeMove(bestMove, gameState);
      }
      setAiThinking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [gameState.turn, gameState, status, executeMove]);

  const handleSquareClick = (r: number, c: number) => {
    if (gameState.turn !== "w" || aiThinking || status === "checkmate" || status === "stalemate") return;
    if (promotionPending) return;

    const piece = gameState.board[r][c];

    // If a piece is already selected
    if (selected) {
      const move = legalDests.find(m => m.to[0] === r && m.to[1] === c);
      if (move) {
        if (move.promotion) {
          // Show promotion picker (default to Q if auto-mode, show picker)
          setPromotionPending({ move });
          return;
        }
        executeMove(move, gameState);
        return;
      }
    }

    // Select piece
    if (piece && piece.color === "w") {
      setSelected([r, c]);
      const legal = getLegalMoves(gameState, "w").filter(m => m.from[0] === r && m.from[1] === c);
      setLegalDests(legal);
    } else {
      setSelected(null);
      setLegalDests([]);
    }
  };

  const handlePromotion = (type: PieceType) => {
    if (!promotionPending) return;
    const move = { ...promotionPending.move, promotion: type };
    setPromotionPending(null);
    executeMove(move, gameState);
  };

  const handleUndo = () => {
    if (stateHistory.length < 3) return;
    const newHistory = stateHistory.slice(0, -2);
    const prevState = newHistory[newHistory.length - 1];
    setStateHistory(newHistory);
    setMoveHistory(prev => prev.slice(0, -2));
    setGameState(prevState);
    setSelected(null);
    setLegalDests([]);
    setLastMove(null);
    updateStatus(prevState);
    setCaptured({ w: [], b: [] });
  };

  const handleNewGame = () => {
    const fresh = initialGameState();
    setGameState(fresh);
    setSelected(null);
    setLegalDests([]);
    setMoveHistory([]);
    setStateHistory([fresh]);
    setStatus("playing");
    setLastMove(null);
    setCaptured({ w: [], b: [] });
    setPromotionPending(null);
  };

  const getSquareColor = (r: number, c: number): string => {
    const isLight = (r + c) % 2 === 0;
    const isSelected = selected && selected[0] === r && selected[1] === c;
    const isLastFrom = lastMove && lastMove.from[0] === r && lastMove.from[1] === c;
    const isLastTo = lastMove && lastMove.to[0] === r && lastMove.to[1] === c;
    const isDest = legalDests.some(m => m.to[0] === r && m.to[1] === c);

    if (isSelected) return "bg-yellow-400";
    if (isLastFrom || isLastTo) return isLight ? "bg-yellow-200" : "bg-yellow-600";
    if (isDest) return isLight ? "bg-green-300" : "bg-green-600";
    return isLight ? "bg-amber-100" : "bg-amber-800";
  };

  const statusText = () => {
    if (status === "checkmate") {
      const winner = gameState.turn === "w" ? "Black" : "White";
      return `Checkmate! ${winner} wins!`;
    }
    if (status === "stalemate") return "Stalemate! Draw!";
    if (status === "check") return `${gameState.turn === "w" ? "White" : "Black"} is in Check!`;
    if (aiThinking) return "AI is thinking...";
    return gameState.turn === "w" ? "Your turn (White)" : "Black's turn";
  };

  const renderCaptured = (color: Color) => {
    const pieces = captured[color];
    if (!pieces.length) return null;
    return (
      <div className="flex flex-wrap gap-0.5 min-h-[24px]">
        {pieces.map((p, i) => (
          <span key={i} className="text-lg leading-none" title={`${p?.type}`}>
            {p ? PIECE_UNICODE[p.color][p.type] : ""}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Status bar */}
      <div className={`w-full max-w-[520px] text-center py-2 px-4 rounded-lg font-bold text-sm ${
        status === "checkmate" ? "bg-red-600 text-white" :
        status === "stalemate" ? "bg-gray-600 text-white" :
        status === "check" ? "bg-orange-500 text-white" :
        aiThinking ? "bg-blue-600 text-white" :
        gameState.turn === "w" ? "bg-slate-100 text-slate-800 border border-slate-300" :
        "bg-slate-700 text-white"
      }`}>
        {statusText()}
      </div>

      {/* Black captured */}
      <div className="w-full max-w-[520px] flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium w-20">Captured:</span>
        {renderCaptured("w")}
      </div>

      {/* Board */}
      <div className="relative">
        <div className="grid grid-cols-8 border-2 border-amber-900 shadow-2xl"
             style={{ width: "min(520px, 90vw)", height: "min(520px, 90vw)" }}>
          {gameState.board.map((row, r) =>
            row.map((piece, c) => {
              const size = "min(65px, calc(90vw / 8))";
              return (
                <div
                  key={`${r}-${c}`}
                  className={`${getSquareColor(r, c)} flex items-center justify-center cursor-pointer relative transition-colors duration-150`}
                  style={{ width: size, height: size }}
                  onClick={() => handleSquareClick(r, c)}
                >
                  {/* Coordinate labels */}
                  {c === 0 && (
                    <span className="absolute top-0.5 left-0.5 text-[9px] font-bold opacity-60 leading-none">
                      {RANKS[r]}
                    </span>
                  )}
                  {r === 7 && (
                    <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold opacity-60 leading-none">
                      {FILES[c]}
                    </span>
                  )}
                  {/* Legal move dot */}
                  {legalDests.some(m => m.to[0] === r && m.to[1] === c) && !piece && (
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-70 z-10" />
                  )}
                  {/* Piece */}
                  {piece && (
                    <span
                      className={`chess-piece z-20 ${
                        piece.color === "w" ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" : "text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]"
                      }`}
                      style={{ fontSize: "min(44px, calc(90vw / 9))", lineHeight: 1, userSelect: "none" }}
                    >
                      {PIECE_UNICODE[piece.color][piece.type]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* White captured */}
      <div className="w-full max-w-[520px] flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium w-20">Captured:</span>
        {renderCaptured("b")}
      </div>

      {/* Promotion picker */}
      {promotionPending && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
            <p className="font-bold text-slate-800 text-lg">Promote Pawn To:</p>
            <div className="flex gap-4">
              {(["Q", "R", "B", "N"] as PieceType[]).map(type => (
                <button
                  key={type}
                  onClick={() => handlePromotion(type)}
                  className="text-5xl hover:scale-110 transition-transform bg-amber-100 rounded-xl p-3 hover:bg-amber-200"
                >
                  {PIECE_UNICODE["w"][type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls & History */}
      <div className="w-full max-w-[520px] flex gap-3">
        <button
          onClick={handleNewGame}
          className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          New Game
        </button>
        <button
          onClick={handleUndo}
          disabled={stateHistory.length < 3 || gameState.turn !== "w"}
          className="flex-1 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors"
        >
          Undo Move
        </button>
      </div>

      {/* Move history */}
      <div className="w-full max-w-[520px]">
        <p className="text-xs font-semibold text-slate-500 mb-1">Move History</p>
        <div
          ref={moveHistRef}
          className="h-32 overflow-y-auto bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-200"
        >
          {moveHistory.length === 0 && <span className="text-slate-500">No moves yet</span>}
          {moveHistory.reduce((acc: JSX.Element[], move, i) => {
            if (i % 2 === 0) {
              acc.push(
                <span key={i} className="mr-2">
                  <span className="text-slate-500">{Math.floor(i / 2) + 1}.</span>{" "}
                  <span className="text-emerald-400">{move}</span>
                  {moveHistory[i + 1] && (
                    <span className="text-blue-400 ml-2">{moveHistory[i + 1]}</span>
                  )}
                </span>
              );
            }
            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO PLAY
// ─────────────────────────────────────────────────────────────────────────────
function ChessHowToPlay() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">How to Play Chess Master AI</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You play as White against an AI opponent (Black). Click any white piece to select it — valid
          destination squares will highlight in green. Click a highlighted square to move. The AI uses
          minimax search with alpha-beta pruning at depth 3 for challenging but beatable play.
        </p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Chess Piece Moves</h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>♙ Pawn:</strong> Moves forward 1 square (or 2 from start). Captures diagonally. Promotes on the last rank.</li>
          <li><strong>♘ Knight:</strong> Moves in an L-shape (2+1 squares). Can jump over pieces.</li>
          <li><strong>♗ Bishop:</strong> Moves diagonally any number of squares.</li>
          <li><strong>♖ Rook:</strong> Moves horizontally or vertically any number of squares.</li>
          <li><strong>♕ Queen:</strong> Combines rook and bishop movement.</li>
          <li><strong>♔ King:</strong> Moves 1 square in any direction. Can castle with a rook.</li>
        </ul>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Special Rules</h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Castling:</strong> King and rook swap if neither has moved and no pieces are between them.</li>
          <li><strong>En Passant:</strong> A pawn can capture a pawn that just moved 2 squares past it.</li>
          <li><strong>Promotion:</strong> When a pawn reaches the last rank, choose Queen, Rook, Bishop, or Knight.</li>
          <li><strong>Checkmate:</strong> Your king is in check with no legal moves — you lose.</li>
          <li><strong>Stalemate:</strong> No legal moves but not in check — it's a draw.</li>
        </ul>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Controls</h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>New Game:</strong> Resets the board to starting position.</li>
          <li><strong>Undo Move:</strong> Takes back your last move and the AI's response (available on your turn).</li>
        </ul>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function ChessMasterAIGame() {
  return (
    <CalculatorVerticalLayout
      title="Chess Master AI"
      description="Play chess against a challenging AI opponent. Full chess rules with minimax AI, move highlighting, castling, en passant, promotion, and move history."
      canonical="https://www.smartkitnow.com/games/chess-master-ai"
      widget={<ChessGameUI />}
      editorial={<ChessHowToPlay />}
      showTopBanner={true}
      showSidebar={true}
      contentMaxWidth="max-w-3xl"
    />
  );
}
