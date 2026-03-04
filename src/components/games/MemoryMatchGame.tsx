import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type CardStatus = "hidden" | "flipped" | "matched";

interface CardData {
  id: number;
  emoji: string;
  status: CardStatus;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🦄",
  "🦋", "🌸", "🍎", "🎵",
];

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: number; rows: number; label: string }> = {
  easy:   { pairs: 6,  cols: 4, rows: 3, label: "Easy (4×3)"   },
  medium: { pairs: 8,  cols: 4, rows: 4, label: "Medium (4×4)" },
  hard:   { pairs: 10, cols: 5, rows: 4, label: "Hard (5×4)"   },
};

const LS_KEY = (d: Difficulty) => `memory-best-${d}`;

// ─── Shuffle helper ───────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): CardData[] {
  const chosen = EMOJIS.slice(0, pairs);
  const doubled = [...chosen, ...chosen];
  const shuffled = shuffle(doubled);
  return shuffled.map((emoji, i) => ({ id: i, emoji, status: "hidden" as CardStatus }));
}

// ─── Card Component ────────────────────────────────────────────────────────────
function MemCard({ card, onClick, disabled }: {
  card: CardData;
  onClick: () => void;
  disabled: boolean;
}) {
  const isVisible = card.status !== "hidden";
  const isMatched = card.status === "matched";

  return (
    <div
      onClick={() => !disabled && card.status === "hidden" && onClick()}
      style={{ perspective: 600 }}
      className={`cursor-pointer ${disabled || card.status !== "hidden" ? "cursor-default" : ""}`}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 10,
            backgroundColor: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            border: "3px solid #3730a3",
          }}
        >
          <span style={{ fontSize: "1.5rem", opacity: 0.6 }}>?</span>
        </div>

        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 10,
            backgroundColor: isMatched ? "#064e3b" : "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isMatched
              ? "0 0 0 3px #34d399, 0 2px 8px rgba(0,0,0,0.3)"
              : "0 0 0 2px #475569, 0 2px 8px rgba(0,0,0,0.2)",
            transition: "box-shadow 0.2s, background-color 0.2s",
          }}
        >
          <span
            style={{
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              filter: isMatched ? "none" : "none",
              animation: isMatched ? "match-pop 0.3s ease-out" : undefined,
            }}
          >
            {card.emoji}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Game Board (Inner Component) ─────────────────────────────────────────────
function MemoryBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<CardData[]>(() => buildDeck(DIFFICULTY_CONFIG.medium.pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(() => {
    try { const v = localStorage.getItem(LS_KEY("medium")); return v ? parseInt(v, 10) : null; }
    catch { return null; }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const config = DIFFICULTY_CONFIG[difficulty];

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now() - elapsed * 1000;
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000));
    }, 500);
  }, [stopTimer, elapsed]);

  const resetGame = useCallback((diff: Difficulty = difficulty) => {
    stopTimer();
    const cfg = DIFFICULTY_CONFIG[diff];
    setCards(buildDeck(cfg.pairs));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setLocked(false);
    setGameStarted(false);
    setGameWon(false);
    setElapsed(0);
    startTimeRef.current = null;

    const stored = localStorage.getItem(LS_KEY(diff));
    setBestMoves(stored ? parseInt(stored, 10) : null);
  }, [difficulty, stopTimer]);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    resetGame(d);
  };

  const handleCardClick = useCallback((cardId: number) => {
    if (locked || gameWon) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.status !== "hidden") return;

    if (!gameStarted) {
      setGameStarted(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000));
      }, 500);
    }

    const newFlipped = [...flippedIds, cardId];

    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: "flipped" } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      setLocked(true);

      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = cards.find(c => c.id === id2)!;

      if (c1.emoji === c2.emoji) {
        // Match!
        setCards(prev =>
          prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, status: "matched" } : c)
        );
        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        setFlippedIds([]);
        setLocked(false);

        if (newMatched === config.pairs) {
          stopTimer();
          setGameWon(true);
          setBestMoves(prev => {
            const newBest = prev === null || newMoves < prev ? newMoves : prev;
            try { localStorage.setItem(LS_KEY(difficulty), String(newBest)); } catch {}
            return newBest;
          });
        }
      } else {
        // No match: flip back after 800ms
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, status: "hidden" } : c)
          );
          setFlippedIds([]);
          setLocked(false);
        }, 800);
      }
    }
  }, [cards, flippedIds, locked, gameWon, gameStarted, moves, matchedPairs, config.pairs, difficulty, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <style>{`
        @keyframes match-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Difficulty selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => changeDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              difficulty === d
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {DIFFICULTY_CONFIG[d].label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Moves</div>
          <div className="text-xl font-bold text-white">{moves}</div>
        </div>
        <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Time</div>
          <div className="text-xl font-bold text-white">{formatTime(elapsed)}</div>
        </div>
        <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
          <div className="text-xs text-slate-400 uppercase">Pairs</div>
          <div className="text-xl font-bold text-emerald-400">{matchedPairs}/{config.pairs}</div>
        </div>
        {bestMoves !== null && (
          <div className="bg-slate-800 rounded-lg px-4 py-2 text-center border border-slate-700">
            <div className="text-xs text-slate-400 uppercase">Best</div>
            <div className="text-xl font-bold text-yellow-400">{bestMoves}</div>
          </div>
        )}
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gap: 8,
          width: "100%",
          maxWidth: config.cols === 5 ? 360 : 300,
        }}
      >
        {cards.map(card => (
          <MemCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={locked || gameWon || card.status !== "hidden"}
          />
        ))}
      </div>

      {/* Win message */}
      {gameWon && (
        <div className="w-full max-w-xs bg-emerald-900 border-2 border-emerald-500 rounded-2xl p-6 text-center shadow-2xl shadow-emerald-500/20">
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-xl font-bold text-emerald-300 mb-1">You Win!</div>
          <div className="text-sm text-emerald-400 mb-1">Completed in {moves} moves, {formatTime(elapsed)}</div>
          {bestMoves !== null && moves <= bestMoves && (
            <div className="text-sm text-yellow-400 font-semibold">New Best Score!</div>
          )}
        </div>
      )}

      {/* New game button */}
      <button
        onClick={() => resetGame()}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-colors"
      >
        New Game
      </button>

      <p className="text-xs text-slate-400 text-center">
        Click cards to flip them. Find all matching pairs to win!
      </p>
    </div>
  );
}

// ─── Exported Page Component ───────────────────────────────────────────────────
export default function MemoryMatchGame({
  title = "Memory Match Cards",
  description = "Flip cards to find matching pairs. Test your memory and beat your best score!",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play Memory Match</h2>
        <p>
          Memory Match is a classic card-flipping game where you flip cards to reveal hidden
          symbols and find all matching pairs. The goal is to match all pairs with the fewest
          moves possible.
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-2">
          <li>Choose a difficulty: Easy (4×3, 6 pairs), Medium (4×4, 8 pairs), or Hard (5×4, 10 pairs).</li>
          <li>Click any face-down card to flip it and reveal the emoji.</li>
          <li>Click a second card — if the emojis match, both cards stay face-up (matched!).</li>
          <li>If they don't match, both cards flip back face-down after 800ms.</li>
          <li>You can only flip 2 cards at a time. The game locks briefly during the check.</li>
          <li>The timer starts on your first card flip. Find all pairs to win!</li>
        </ol>
        <p className="mt-4">
          Your best score (fewest moves) for each difficulty is saved in the browser and persists
          between sessions.
        </p>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips &amp; Strategies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Scan first:</strong> Before clicking, take a moment to look at the card positions
            to anticipate where you saw specific emojis.
          </li>
          <li>
            <strong>Mental grid:</strong> Assign a rough "address" to each card in your mind (e.g.,
            "the dog is top-left corner, row 2"). This spatial memory trick dramatically improves recall.
          </li>
          <li>
            <strong>Flip known pairs first:</strong> If you already know where a matching pair is,
            click those two immediately before memory fades.
          </li>
          <li>
            <strong>Use misses strategically:</strong> When a card doesn't match your flip, note its
            location. You may need it as the second of a pair later.
          </li>
          <li>
            <strong>Easy → Hard progression:</strong> Start on Easy to warm up your spatial memory,
            then move to Hard for a real challenge.
          </li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How many cards are there?</h3>
            <p>Easy: 12 cards (6 pairs). Medium: 16 cards (8 pairs). Hard: 20 cards (10 pairs).
            All use unique emoji symbols.</p>
          </div>
          <div>
            <h3 className="font-semibold">What counts as the "best score"?</h3>
            <p>The best score is the <strong>fewest number of moves</strong> (pairs flipped) used to
            complete the board, tracked per difficulty level.</p>
          </div>
          <div>
            <h3 className="font-semibold">Does the timer stop when I win?</h3>
            <p>Yes. The timer stops the moment you find the last matching pair.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a perfect (minimum) number of moves?</h3>
            <p>The theoretical minimum is equal to the number of pairs (one perfect flip per pair).
            For Easy that's 6 moves, Medium is 8, Hard is 10 — but this is only possible with
            perfect memory!</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<MemoryBoard />}
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
