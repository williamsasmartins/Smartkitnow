import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

type Tableau = Card[][];
type Foundation = number; // count of completed sequences

interface GameState {
  tableau: Tableau;
  stock: Card[][];
  foundations: Foundation;
  moves: number;
  selected: { col: number; row: number } | null;
  won: boolean;
  suitMode: 1 | 2;
}

type HistoryEntry = Omit<GameState, "won">;

// ─── Constants ────────────────────────────────────────────────────────────────

const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS_1: Suit[] = ["♠"];
const SUITS_2: Suit[] = ["♠", "♥"];
const RANK_VALUE: Record<Rank, number> = {
  A: 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
  "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDeck(suitMode: 1 | 2): Card[] {
  const suits = suitMode === 1 ? SUITS_1 : SUITS_2;
  const deck: Card[] = [];
  for (let d = 0; d < 2; d++) {
    for (const suit of suits) {
      for (const rank of RANKS) {
        // In 1-suit mode, fill remaining suit slots with spades to get 104 cards
        const count = suitMode === 1 ? 4 : 2;
        for (let k = 0; k < count; k++) {
          deck.push({
            id: `${suit}-${rank}-${d}-${k}`,
            suit,
            rank,
            faceUp: false,
          });
        }
      }
    }
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initGame(suitMode: 1 | 2): GameState {
  const deck = shuffle(buildDeck(suitMode));
  const tableau: Tableau = Array.from({ length: 10 }, () => []);

  // Deal: first 4 columns get 6 cards, last 6 get 5 cards
  let idx = 0;
  for (let col = 0; col < 10; col++) {
    const count = col < 4 ? 6 : 5;
    for (let r = 0; r < count; r++) {
      tableau[col].push({ ...deck[idx], faceUp: false });
      idx++;
    }
    // Flip top card
    const top = tableau[col].length - 1;
    tableau[col][top] = { ...tableau[col][top], faceUp: true };
  }

  // Remaining cards go into stock (10 deals of 10 cards)
  const stock: Card[][] = [];
  while (idx < deck.length) {
    const batch = deck.slice(idx, idx + 10);
    stock.push(batch.map((c) => ({ ...c, faceUp: false })));
    idx += 10;
  }

  return {
    tableau,
    stock,
    foundations: 0,
    moves: 0,
    selected: null,
    won: false,
    suitMode,
  };
}

function deepCloneTableau(t: Tableau): Tableau {
  return t.map((col) => col.map((card) => ({ ...card })));
}

function isValidMove(cards: Card[], targetCol: Card[]): boolean {
  if (cards.length === 0) return false;
  const topCard = cards[0];
  if (targetCol.length === 0) return true; // empty column accepts anything
  const destTop = targetCol[targetCol.length - 1];
  return (
    destTop.faceUp &&
    RANK_VALUE[destTop.rank] === RANK_VALUE[topCard.rank] + 1
  );
}

function isValidSequence(cards: Card[]): boolean {
  // Cards must be same suit and strictly descending in rank
  for (let i = 0; i < cards.length - 1; i++) {
    if (
      cards[i].suit !== cards[i + 1].suit ||
      RANK_VALUE[cards[i].rank] !== RANK_VALUE[cards[i + 1].rank] + 1
    ) {
      return false;
    }
  }
  return true;
}

function checkAndRemoveSequences(tableau: Tableau): { tableau: Tableau; removed: number } {
  let removed = 0;
  const newTab = deepCloneTableau(tableau);
  for (let col = 0; col < newTab.length; col++) {
    const column = newTab[col];
    if (column.length < 13) continue;
    const top13 = column.slice(column.length - 13);
    if (
      top13[0].rank === "K" &&
      top13[12].rank === "A" &&
      isValidSequence(top13)
    ) {
      newTab[col] = column.slice(0, column.length - 13);
      removed++;
      // Flip new top card
      if (newTab[col].length > 0) {
        const newTop = newTab[col].length - 1;
        newTab[col][newTop] = { ...newTab[col][newTop], faceUp: true };
      }
    }
  }
  return { tableau: newTab, removed };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const isRed = (suit: Suit) => suit === "♥" || suit === "♦";

function cardColor(suit: Suit) {
  return isRed(suit) ? "#c0392b" : "#1a1a2e";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CardViewProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  zIndex?: number;
  isInSequence?: boolean;
}

function CardView({ card, isSelected, onClick, style, zIndex = 0, isInSequence }: CardViewProps) {
  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        style={{
          width: 56,
          height: 76,
          borderRadius: 6,
          border: "2px solid #4a5568",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1e3a5f 100%)",
          cursor: "pointer",
          zIndex,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: 56,
        height: 76,
        borderRadius: 6,
        border: `2px solid ${isSelected ? "#f6c90e" : isInSequence ? "#48bb78" : "#cbd5e0"}`,
        background: isSelected ? "#fffde7" : "#fff",
        boxShadow: isSelected ? "0 0 8px 2px #f6c90e88" : "0 1px 3px rgba(0,0,0,0.2)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2px 4px",
        userSelect: "none",
        zIndex,
        ...style,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: "bold", color: cardColor(card.suit), lineHeight: 1 }}>
        {card.rank}
      </div>
      <div style={{ fontSize: 16, textAlign: "center", color: cardColor(card.suit), lineHeight: 1 }}>
        {card.suit}
      </div>
      <div style={{ fontSize: 11, fontWeight: "bold", color: cardColor(card.suit), lineHeight: 1, transform: "rotate(180deg)", alignSelf: "flex-end" }}>
        {card.rank}
      </div>
    </div>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────

function SpiderSolitaire() {
  const [game, setGame] = useState<GameState>(() => initGame(1));
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const saveHistory = useCallback((state: GameState) => {
    const entry: HistoryEntry = {
      tableau: deepCloneTableau(state.tableau),
      stock: state.stock.map((batch) => batch.map((c) => ({ ...c }))),
      foundations: state.foundations,
      moves: state.moves,
      selected: state.selected,
      suitMode: state.suitMode,
    };
    setHistory((h) => [...h.slice(-30), entry]);
  }, []);

  const handleCardClick = useCallback(
    (col: number, row: number) => {
      setGame((prev) => {
        if (prev.won) return prev;
        const column = prev.tableau[col];
        const card = column[row];

        // If nothing selected
        if (!prev.selected) {
          if (!card.faceUp) return prev;
          const sequence = column.slice(row);
          if (!isValidSequence(sequence)) return prev;
          return { ...prev, selected: { col, row } };
        }

        const { col: sCol, row: sRow } = prev.selected;

        // Clicking the same card deselects
        if (sCol === col && sRow === row) {
          return { ...prev, selected: null };
        }

        const movingCards = prev.tableau[sCol].slice(sRow);
        const destColumn = prev.tableau[col];

        // Check if clicking on a face-up card in target col (top of that col)
        if (col !== sCol) {
          if (!isValidMove(movingCards, destColumn)) {
            // Try reselecting
            if (card.faceUp) {
              const sequence = column.slice(row);
              if (isValidSequence(sequence)) {
                return { ...prev, selected: { col, row } };
              }
            }
            return { ...prev, selected: null };
          }

          // Execute move
          saveHistory(prev);
          const newTab = deepCloneTableau(prev.tableau);
          newTab[col] = [...newTab[col], ...movingCards.map((c) => ({ ...c }))];
          newTab[sCol] = newTab[sCol].slice(0, sRow);
          // Flip new top of source
          if (newTab[sCol].length > 0) {
            const t = newTab[sCol].length - 1;
            newTab[sCol][t] = { ...newTab[sCol][t], faceUp: true };
          }
          const { tableau: checked, removed } = checkAndRemoveSequences(newTab);
          const newFoundations = prev.foundations + removed;
          const won = newFoundations >= 8;
          return {
            ...prev,
            tableau: checked,
            foundations: newFoundations,
            moves: prev.moves + 1,
            selected: null,
            won,
          };
        }

        // Clicked within same column - reselect if valid
        if (card.faceUp) {
          const sequence = column.slice(row);
          if (isValidSequence(sequence)) {
            return { ...prev, selected: { col, row } };
          }
        }
        return { ...prev, selected: null };
      });
    },
    [saveHistory]
  );

  const handleColumnClick = useCallback(
    (col: number) => {
      setGame((prev) => {
        if (prev.won || !prev.selected) return prev;
        const { col: sCol, row: sRow } = prev.selected;
        if (sCol === col) return { ...prev, selected: null };

        const movingCards = prev.tableau[sCol].slice(sRow);
        const destColumn = prev.tableau[col];

        if (!isValidMove(movingCards, destColumn)) return { ...prev, selected: null };

        saveHistory(prev);
        const newTab = deepCloneTableau(prev.tableau);
        newTab[col] = [...newTab[col], ...movingCards.map((c) => ({ ...c }))];
        newTab[sCol] = newTab[sCol].slice(0, sRow);
        if (newTab[sCol].length > 0) {
          const t = newTab[sCol].length - 1;
          newTab[sCol][t] = { ...newTab[sCol][t], faceUp: true };
        }
        const { tableau: checked, removed } = checkAndRemoveSequences(newTab);
        const newFoundations = prev.foundations + removed;
        return {
          ...prev,
          tableau: checked,
          foundations: newFoundations,
          moves: prev.moves + 1,
          selected: null,
          won: newFoundations >= 8,
        };
      });
    },
    [saveHistory]
  );

  const handleDealStock = useCallback(() => {
    setGame((prev) => {
      if (prev.won || prev.stock.length === 0) return prev;
      // Cannot deal if any column is empty
      const hasEmpty = prev.tableau.some((col) => col.length === 0);
      if (hasEmpty) return prev;

      saveHistory(prev);
      const [batch, ...remainingStock] = prev.stock;
      const newTab = deepCloneTableau(prev.tableau);
      batch.forEach((card, i) => {
        newTab[i] = [...newTab[i], { ...card, faceUp: true }];
      });
      const { tableau: checked, removed } = checkAndRemoveSequences(newTab);
      return {
        ...prev,
        tableau: checked,
        foundations: prev.foundations + removed,
        stock: remainingStock,
        moves: prev.moves + 1,
        selected: null,
        won: prev.foundations + removed >= 8,
      };
    });
  }, [saveHistory]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setGame((g) => ({
      ...prev,
      won: false,
    }));
  }, [history]);

  const handleNewGame = useCallback((suitMode: 1 | 2) => {
    setGame(initGame(suitMode));
    setHistory([]);
  }, []);

  const CARD_OVERLAP = 22;
  const CARD_FACE_OVERLAP = 18;

  return (
    <div style={{ fontFamily: "sans-serif", background: "#1a6b35", minHeight: 580, borderRadius: 12, padding: 12, userSelect: "none" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ color: "#ffd700", fontWeight: "bold", fontSize: 14 }}>
          Foundations: {game.foundations}/8
        </div>
        <div style={{ color: "#90ee90", fontSize: 13 }}>Moves: {game.moves}</div>
        <div style={{ color: "#add8e6", fontSize: 13 }}>Stock: {game.stock.length} deals left</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            style={{
              padding: "4px 12px", borderRadius: 6, border: "none", cursor: history.length === 0 ? "not-allowed" : "pointer",
              background: history.length === 0 ? "#555" : "#e67e22", color: "#fff", fontWeight: "bold", fontSize: 12,
            }}
          >
            Undo
          </button>
          <button
            onClick={() => handleNewGame(game.suitMode === 1 ? 2 : 1)}
            style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "#2980b9", color: "#fff", fontWeight: "bold", fontSize: 12 }}
          >
            {game.suitMode === 1 ? "2-Suit Mode" : "1-Suit Mode"}
          </button>
          <button
            onClick={() => handleNewGame(game.suitMode)}
            style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: "#27ae60", color: "#fff", fontWeight: "bold", fontSize: 12 }}
          >
            New Game
          </button>
        </div>
      </div>

      {game.won && (
        <div style={{ textAlign: "center", padding: "20px", background: "rgba(0,0,0,0.7)", borderRadius: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 28, color: "#ffd700", fontWeight: "bold" }}>You Win!</div>
          <div style={{ color: "#fff", marginTop: 6 }}>Completed in {game.moves} moves</div>
          <button
            onClick={() => handleNewGame(game.suitMode)}
            style={{ marginTop: 10, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: "#27ae60", color: "#fff", fontWeight: "bold" }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Tableau */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
        {game.tableau.map((column, colIdx) => {
          const colHeight = column.length === 0 ? 80 : column.length * CARD_OVERLAP + (76 - CARD_OVERLAP);
          return (
            <div
              key={colIdx}
              onClick={() => handleColumnClick(colIdx)}
              style={{
                position: "relative",
                width: 60,
                height: Math.max(80, colHeight),
                minHeight: 80,
                background: "rgba(0,80,0,0.35)",
                border: "2px dashed rgba(255,255,255,0.2)",
                borderRadius: 8,
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              {column.map((card, rowIdx) => {
                const isSelected = game.selected?.col === colIdx && game.selected?.row === rowIdx;
                const isPartOfSelection =
                  game.selected?.col === colIdx &&
                  game.selected.row !== undefined &&
                  rowIdx >= game.selected.row;
                return (
                  <div
                    key={card.id}
                    style={{ position: "absolute", top: rowIdx * CARD_OVERLAP, left: 0, zIndex: rowIdx }}
                    onClick={(e) => { e.stopPropagation(); handleCardClick(colIdx, rowIdx); }}
                  >
                    <CardView
                      card={card}
                      isSelected={isSelected}
                      isInSequence={isPartOfSelection && !isSelected}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Stock */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          onClick={handleDealStock}
          style={{
            width: 60, height: 80, borderRadius: 8,
            background: game.stock.length > 0 ? "linear-gradient(135deg,#1e3a5f,#2d6a9f)" : "rgba(0,0,0,0.2)",
            border: "2px solid " + (game.stock.length > 0 ? "#4a9edd" : "#444"),
            cursor: game.stock.length > 0 ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "bold", fontSize: 22,
          }}
        >
          {game.stock.length > 0 ? "🂠" : "—"}
        </div>
        <div style={{ color: "#ccc", fontSize: 12 }}>
          {game.stock.length > 0
            ? `Click to deal 10 cards (${game.stock.length} deals remaining)`
            : "No more deals"}
          {game.tableau.some((c) => c.length === 0) && game.stock.length > 0 && (
            <span style={{ color: "#ff8c00", display: "block" }}>Fill empty columns before dealing</span>
          )}
        </div>

        {/* Foundations display */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 50, height: 68, borderRadius: 6,
                background: i < game.foundations ? "linear-gradient(135deg,#2ecc71,#27ae60)" : "rgba(0,0,0,0.3)",
                border: "2px solid " + (i < game.foundations ? "#2ecc71" : "#444"),
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: i < game.foundations ? 18 : 12,
              }}
            >
              {i < game.foundations ? "♠" : ""}
            </div>
          ))}
        </div>
      </div>

      <div style={{ color: "#aaa", fontSize: 11, marginTop: 8 }}>
        Click a card to select (green = valid sequence), click destination column to move. Build K→A same suit to complete sequences.
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function SpiderSolitaireGame() {
  return (
    <CalculatorVerticalLayout
      title="Spider Solitaire"
      description="Play Spider Solitaire online — 1-suit and 2-suit modes. Build complete K-to-A sequences to win. Free, no download required."
      canonical="https://www.smartkitnow.com/games/spider-solitaire"
      widget={<SpiderSolitaire />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div>
          <h2>How to Play Spider Solitaire</h2>
          <p>
            Spider Solitaire is one of the most popular card games in the world. Your goal is to build 8
            complete sequences of cards from King down to Ace — all in the same suit — and move them to the
            foundations.
          </p>
          <h3>Basic Rules</h3>
          <ul>
            <li>The game uses two standard 52-card decks (104 cards total).</li>
            <li>Cards are dealt across 10 tableau columns. Only the top card of each column is face-up.</li>
            <li>You can move any face-up card (or a valid sequence) to another column if it creates a descending order.</li>
            <li>A <strong>valid movable sequence</strong> must be same-suit and strictly descending (e.g., ♠8-♠7-♠6).</li>
            <li>When a complete K→A same-suit sequence is formed, it is automatically removed to the foundation.</li>
            <li>Click the stock pile to deal 10 new cards (one to each column). You cannot deal if any column is empty.</li>
          </ul>
          <h3>1-Suit vs 2-Suit Mode</h3>
          <p>
            <strong>1-Suit Mode</strong> (Spades only) is beginner-friendly because you can move any descending
            sequence regardless of suit. <strong>2-Suit Mode</strong> adds Hearts and makes the game considerably
            harder, as movable sequences must match in suit.
          </p>
          <h3>Tips &amp; Strategy</h3>
          <ul>
            <li>Try to create empty columns — they act as free spaces to reorganize cards.</li>
            <li>Prioritize uncovering face-down cards early in the game.</li>
            <li>Build same-suit sequences whenever possible, even in 1-suit mode, to practice.</li>
            <li>Use the Undo button freely — Spider Solitaire rewards careful planning.</li>
            <li>Avoid dealing from the stock too early; exhaust tableau moves first.</li>
          </ul>
          <h3>Scoring</h3>
          <p>
            There is no time-based scoring in this version. Your performance is measured by the number of moves
            it takes to clear all 8 foundations. Fewer moves = better game!
          </p>
        </div>
      }
    />
  );
}
