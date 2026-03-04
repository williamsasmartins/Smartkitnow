import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// Ludo path for each color (15 steps on outer track + 6 home stretch)
const BOARD_SIZE = 15;
const OUTER_PATH_LENGTH = 52;

// Starting square index on the outer path for each color
const COLOR_START: Record<string, number> = { red: 0, blue: 13, green: 26, yellow: 39 };
// Safe squares (star squares) on the outer path
const SAFE_SQUARES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const COLORS = ["red", "blue", "green", "yellow"] as const;
type Color = typeof COLORS[number];
type TokenState = "home" | "active" | "done";
interface Token { color: Color; id: number; pos: number; state: TokenState }

const CSS: Record<Color, string> = {
  red: "#ef4444", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308"
};
const DARK: Record<Color, string> = {
  red: "#991b1b", blue: "#1d4ed8", green: "#15803d", yellow: "#a16207"
};

function initTokens(): Token[] {
  return COLORS.flatMap(color =>
    [0,1,2,3].map(id => ({ color, id, pos: -1, state: "home" as TokenState }))
  );
}

function advancePos(pos: number, steps: number, color: Color): number {
  return (pos + steps) % OUTER_PATH_LENGTH;
}

// Build a simple board layout mapping - simplified visual representation
function LudoBoard({ tokens, onTokenClick, activeColor, validTokenIds }: {
  tokens: Token[]; onTokenClick: (t: Token) => void;
  activeColor: Color; validTokenIds: Set<number>;
}) {
  const tokensByColor = Object.fromEntries(
    COLORS.map(c => [c, tokens.filter(t => t.color === c)])
  );

  return (
    <div className="relative">
      {/* Home bases */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {COLORS.map(color => (
          <div key={color} style={{ background: CSS[color], opacity: 0.15, border:`2px solid ${CSS[color]}` }}
            className="rounded-lg p-3 flex flex-wrap gap-2">
            <span style={{color:CSS[color]}} className="text-xs font-bold w-full">{color.toUpperCase()}</span>
            {tokensByColor[color].filter(t => t.state === "home").map(t => (
              <button key={t.id} onClick={() => onTokenClick(t)}
                disabled={!validTokenIds.has(t.id)}
                style={{ background: validTokenIds.has(t.id) ? CSS[color] : DARK[color],
                  border: `2px solid ${validTokenIds.has(t.id) ? "white" : "transparent"}`,
                  boxShadow: validTokenIds.has(t.id) ? `0 0 8px ${CSS[color]}` : "none" }}
                className="w-8 h-8 rounded-full text-white text-xs font-bold transition-all hover:scale-110">
                {t.id+1}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Active tokens */}
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-2">Active Tokens (position on track)</div>
        <div className="flex flex-wrap gap-2">
          {tokens.filter(t => t.state === "active").map(t => (
            <button key={`${t.color}-${t.id}`} onClick={() => onTokenClick(t)}
              disabled={!validTokenIds.has(t.id) || t.color !== activeColor}
              style={{ background: CSS[t.color], border: `2px solid ${validTokenIds.has(t.id) && t.color===activeColor ? "white":"transparent"}`,
                boxShadow: validTokenIds.has(t.id) && t.color===activeColor ? `0 0 8px ${CSS[t.color]}` : "none" }}
              className="w-10 h-10 rounded-full text-white text-xs font-bold flex flex-col items-center justify-center transition-all hover:scale-110">
              <span>{t.color[0].toUpperCase()}{t.id+1}</span>
              <span className="text-[9px] opacity-80">#{t.pos}</span>
            </button>
          ))}
          {tokens.filter(t => t.state === "active").length === 0 &&
            <span className="text-slate-500 text-xs">No active tokens yet</span>}
        </div>
      </div>

      {/* Done tokens */}
      {tokens.some(t => t.state === "done") && (
        <div className="mt-2 text-sm text-center">
          {COLORS.map(c => {
            const done = tokens.filter(t => t.color === c && t.state === "done").length;
            return done > 0 ? <span key={c} style={{color:CSS[c]}} className="mr-2">{c}: {done}/4 🏠</span> : null;
          })}
        </div>
      )}
    </div>
  );
}

function rollDie(): number { return Math.floor(Math.random() * 6) + 1; }

function LudoGame() {
  const [tokens, setTokens] = useState<Token[]>(initTokens);
  const [die, setDie] = useState<number | null>(null);
  const [turn, setTurn] = useState<Color>("red");
  const [phase, setPhase] = useState<"roll"|"move">("roll");
  const [winner, setWinner] = useState<Color | null>(null);
  const [message, setMessage] = useState("Red's turn! Roll the die.");
  const [isAI, setIsAI] = useState(false);

  const humanColor: Color = "red";

  const getValidMoves = useCallback((tks: Token[], color: Color, rolled: number): number[] => {
    const colorTokens = tks.filter(t => t.color === color);
    const valid: number[] = [];
    for (const t of colorTokens) {
      if (t.state === "done") continue;
      if (t.state === "home" && rolled === 6) valid.push(t.id);
      if (t.state === "active") {
        const newPos = advancePos(t.pos, rolled, color);
        // Check if overshoots (simplified: if crosses start again it's home stretch)
        valid.push(t.id);
      }
    }
    return valid;
  }, []);

  const moveToken = useCallback((tokenId: number) => {
    if (phase !== "move" || die === null) return;
    setTokens(prev => {
      const next = prev.map(t => {
        if (t.id !== tokenId || t.color !== turn) return t;
        if (t.state === "home" && die === 6) {
          return { ...t, state: "active" as TokenState, pos: COLOR_START[turn] };
        }
        if (t.state === "active") {
          const newPos = advancePos(t.pos, die, turn);
          // Check if token completed the circuit (52 steps from start)
          const startPos = COLOR_START[turn];
          const distFromStart = (t.pos - startPos + OUTER_PATH_LENGTH) % OUTER_PATH_LENGTH;
          const newDist = distFromStart + die;
          if (newDist >= OUTER_PATH_LENGTH) {
            return { ...t, state: "done" as TokenState, pos: 99 };
          }
          return { ...t, pos: newPos };
        }
        return t;
      });

      // Check win
      const turnTokens = next.filter(t => t.color === turn);
      if (turnTokens.every(t => t.state === "done")) {
        setWinner(turn);
        setMessage(`🏆 ${turn.toUpperCase()} wins!`);
        return next;
      }

      // Next turn
      const nextColor = COLORS[(COLORS.indexOf(turn) + 1) % 4];
      setTurn(nextColor);
      setPhase("roll");
      setDie(null);
      setMessage(`${nextColor.toUpperCase()}'s turn! Roll the die.`);
      return next;
    });
  }, [phase, die, turn]);

  const handleRoll = useCallback(() => {
    if (phase !== "roll") return;
    const rolled = rollDie();
    setDie(rolled);
    const valid = getValidMoves(tokens, turn, rolled);
    if (valid.length === 0) {
      setMessage(`${turn.toUpperCase()} rolled ${rolled} - no valid moves. Passing.`);
      setTimeout(() => {
        const nextColor = COLORS[(COLORS.indexOf(turn) + 1) % 4];
        setTurn(nextColor);
        setPhase("roll");
        setDie(null);
        setMessage(`${nextColor.toUpperCase()}'s turn! Roll the die.`);
      }, 1000);
    } else if (valid.length === 1 && tokens.find(t => t.id === valid[0] && t.color === turn)?.state === "active"
      && tokens.filter(t => t.color === turn && t.state === "home").length === 0) {
      // Auto-move if only one option
      setPhase("move");
      setTimeout(() => moveToken(valid[0]), 300);
    } else {
      setPhase("move");
      setMessage(`Rolled ${rolled}! Choose a token to move.`);
    }
  }, [phase, tokens, turn, getValidMoves, moveToken]);

  // AI turn
  useEffect(() => {
    if (turn !== humanColor && phase === "roll" && !winner) {
      setIsAI(true);
      const t = setTimeout(() => {
        handleRoll();
        setIsAI(false);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [turn, phase, winner, handleRoll]);

  useEffect(() => {
    if (turn !== humanColor && phase === "move" && die !== null && !winner) {
      setIsAI(true);
      const valid = getValidMoves(tokens, turn, die);
      if (valid.length > 0) {
        const t = setTimeout(() => {
          moveToken(valid[Math.floor(Math.random() * valid.length)]);
          setIsAI(false);
        }, 600);
        return () => clearTimeout(t);
      }
    }
  }, [turn, phase, die, tokens, winner, getValidMoves, moveToken]);

  const validIds = phase === "move" && die !== null && turn === humanColor
    ? new Set(getValidMoves(tokens, turn, die))
    : new Set<number>();

  const handleTokenClick = useCallback((t: Token) => {
    if (t.color !== humanColor || phase !== "move" || !validIds.has(t.id)) return;
    moveToken(t.id);
  }, [humanColor, phase, validIds, moveToken]);

  const dieEmoji = ["","⚀","⚁","⚂","⚃","⚄","⚅"];

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-sm mx-auto">
      <div className="text-center">
        <div className="text-lg font-bold" style={{ color: CSS[turn] }}>{message}</div>
        {isAI && <div className="text-xs text-slate-500 animate-pulse">AI is thinking...</div>}
      </div>

      {winner && (
        <div className="bg-yellow-500 text-black font-bold text-xl px-6 py-3 rounded-xl animate-bounce">
          🏆 {winner.toUpperCase()} WINS!
          <button onClick={() => { setTokens(initTokens()); setTurn("red"); setPhase("roll"); setDie(null); setWinner(null); setMessage("Red's turn! Roll the die."); }}
            className="block text-sm font-normal mt-1 underline">Play Again</button>
        </div>
      )}

      {/* Die */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">{die ? dieEmoji[die] : "🎲"}</div>
        {phase === "roll" && turn === humanColor && !winner && (
          <button onClick={handleRoll}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-lg transition-all hover:scale-105">
            Roll!
          </button>
        )}
      </div>

      <LudoBoard tokens={tokens} onTokenClick={handleTokenClick}
        activeColor={turn} validTokenIds={validIds} />

      <p className="text-xs text-slate-500 text-center">
        You are RED. Roll 6 to enter a token. Move tokens around the board to bring them home!
      </p>
    </div>
  );
}

export default function LudoPartyGame() {
  return (
    <CalculatorVerticalLayout
      title="Ludo Party"
      description="Play the classic Ludo board game! Roll dice and race your tokens to the center. Play against AI opponents in this fun multiplayer board game."
      canonical="https://www.smartkitnow.com/games/ludo-party"
      widget={<LudoGame />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Ludo Party</h2>
          <p>You play as Red. Roll the die and move your tokens around the board. Roll a 6 to enter a new token from home base.</p>
          <p><strong>Goal:</strong> Get all 4 of your tokens to the center (home) before opponents do.</p>
          <p>Landing on an opponent's token sends it back to their home base!</p>
        </div>
      }
      contentMaxWidth="max-w-sm"
    />
  );
}
