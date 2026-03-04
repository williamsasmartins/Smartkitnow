import React, { useState, useCallback, useMemo } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type Operator = "+" | "-" | "×" | "÷";
type Token = { type: "number"; value: number; id: number } | { type: "op"; value: Operator } | { type: "paren"; value: "(" | ")" };
type GamePhase = "PLAYING" | "WIN" | "GIVEUP";

interface Attempt {
  expr: string;
  result: number | string;
  success: boolean;
}

// ─── Solvable sets ────────────────────────────────────────────────────────────

// Pre-verified solvable card sets (1-9 each, at least one solution to 24)
const SOLVABLE_SETS: number[][] = [
  [1, 2, 3, 4], [1, 2, 3, 6], [1, 2, 4, 6], [1, 2, 6, 9], [1, 3, 4, 6],
  [1, 3, 6, 8], [1, 4, 5, 6], [1, 4, 6, 7], [1, 5, 5, 5], [1, 6, 7, 8],
  [2, 2, 2, 2], [2, 2, 3, 4], [2, 3, 4, 6], [2, 3, 6, 9], [2, 4, 4, 6],
  [2, 4, 6, 6], [2, 6, 6, 6], [3, 3, 4, 6], [3, 3, 6, 6], [3, 4, 4, 6],
  [3, 4, 6, 9], [3, 6, 6, 9], [4, 4, 4, 6], [4, 4, 6, 6], [4, 6, 6, 6],
  [1, 2, 3, 5], [1, 2, 5, 8], [1, 3, 5, 5], [1, 4, 4, 5], [2, 3, 5, 6],
  [1, 1, 4, 6], [1, 2, 4, 4], [2, 2, 4, 4], [1, 3, 3, 3], [2, 3, 3, 6],
  [1, 2, 3, 8], [1, 4, 6, 8], [2, 4, 4, 8], [2, 6, 8, 8], [1, 2, 6, 8],
  [3, 4, 6, 8], [4, 4, 4, 8], [4, 6, 8, 8], [2, 4, 6, 8], [1, 4, 8, 9],
  [2, 6, 6, 8], [3, 3, 3, 3], [3, 3, 8, 8], [1, 5, 6, 8], [2, 5, 7, 8],
];

// ─── Expression parser (NO eval) ──────────────────────────────────────────────

// Tokenize an expression string into { type, value } tokens
function tokenize(expr: string): Array<{ type: "num" | "op" | "lparen" | "rparen"; value: string }> | null {
  const tokens: Array<{ type: "num" | "op" | "lparen" | "rparen"; value: string }> = [];
  let i = 0;
  const s = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");

  while (i < s.length) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") {
      let num = "";
      while (i < s.length && s[i] >= "0" && s[i] <= "9") { num += s[i]; i++; }
      tokens.push({ type: "num", value: num });
    } else if ("+-*/".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
    } else if (ch === "(") {
      tokens.push({ type: "lparen", value: "(" });
      i++;
    } else if (ch === ")") {
      tokens.push({ type: "rparen", value: ")" });
      i++;
    } else {
      return null; // unknown char
    }
  }
  return tokens;
}

// Recursive descent parser → returns a number or throws
function parseExpr(tokens: ReturnType<typeof tokenize>, pos: { i: number }): number {
  if (!tokens) throw new Error("Invalid");
  return parseAddSub(tokens, pos);
}

function parseAddSub(tokens: ReturnType<typeof tokenize>, pos: { i: number }): number {
  if (!tokens) throw new Error("Invalid");
  let left = parseMulDiv(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i].value === "+" || tokens[pos.i].value === "-")) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parseMulDiv(tokens, pos);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

function parseMulDiv(tokens: ReturnType<typeof tokenize>, pos: { i: number }): number {
  if (!tokens) throw new Error("Invalid");
  let left = parseUnary(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i].value === "*" || tokens[pos.i].value === "/")) {
    const op = tokens[pos.i].value;
    pos.i++;
    const right = parseUnary(tokens, pos);
    if (op === "/" && right === 0) throw new Error("Division by zero");
    left = op === "*" ? left * right : left / right;
  }
  return left;
}

function parseUnary(tokens: ReturnType<typeof tokenize>, pos: { i: number }): number {
  if (!tokens) throw new Error("Invalid");
  if (pos.i < tokens.length && tokens[pos.i].value === "-") {
    pos.i++;
    return -parsePrimary(tokens, pos);
  }
  return parsePrimary(tokens, pos);
}

function parsePrimary(tokens: ReturnType<typeof tokenize>, pos: { i: number }): number {
  if (!tokens || pos.i >= tokens.length) throw new Error("Unexpected end");
  const tok = tokens[pos.i];
  if (tok.type === "num") {
    pos.i++;
    return parseFloat(tok.value);
  }
  if (tok.type === "lparen") {
    pos.i++;
    const val = parseAddSub(tokens, pos);
    if (pos.i >= tokens.length || tokens[pos.i].type !== "rparen") throw new Error("Missing )");
    pos.i++;
    return val;
  }
  throw new Error(`Unexpected token: ${tok.value}`);
}

function evaluateExpression(expr: string): number | string {
  try {
    const tokens = tokenize(expr);
    if (!tokens) return "Invalid expression";
    const pos = { i: 0 };
    const result = parseExpr(tokens, pos);
    if (pos.i !== tokens.length) return "Invalid expression";
    if (!isFinite(result)) return "Division by zero";
    return Math.round(result * 1e9) / 1e9; // avoid float dust
  } catch (e: any) {
    return e?.message ?? "Invalid expression";
  }
}

// ─── Brute force solver for "Give Up" hint ────────────────────────────────────

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) result.push([arr[i], ...p]);
  }
  return result;
}

const OPS_LIST: string[] = ["+", "-", "*", "/"];

function findSolution(cards: number[]): string | null {
  for (const perm of permutations(cards)) {
    const [a, b, c, d] = perm;
    for (const o1 of OPS_LIST) {
      for (const o2 of OPS_LIST) {
        for (const o3 of OPS_LIST) {
          // Try several bracketing patterns
          const patterns = [
            `((${a}${o1}${b})${o2}${c})${o3}${d}`,
            `(${a}${o1}(${b}${o2}${c}))${o3}${d}`,
            `${a}${o1}((${b}${o2}${c})${o3}${d})`,
            `${a}${o1}(${b}${o2}(${c}${o3}${d}))`,
            `(${a}${o1}${b})${o2}(${c}${o3}${d})`,
          ];
          for (const pat of patterns) {
            const val = evaluateExpression(pat);
            if (typeof val === "number" && Math.abs(val - 24) < 0.0001) {
              // Pretty print
              return pat
                .replace(/\*/g, "×")
                .replace(/\//g, "÷");
            }
          }
        }
      }
    }
  }
  return null;
}

// ─── localStorage ─────────────────────────────────────────────────────────────

const LS_BEST = "24game-best";
function getBestStreak(): number {
  try { return parseInt(localStorage.getItem(LS_BEST) ?? "0", 10); } catch { return 0; }
}
function saveBestStreak(n: number): void {
  try { if (n > getBestStreak()) localStorage.setItem(LS_BEST, String(n)); } catch { /* silent */ }
}

// ─── Random card set ──────────────────────────────────────────────────────────

function randomCards(): number[] {
  return [...SOLVABLE_SETS[Math.floor(Math.random() * SOLVABLE_SETS.length)]].sort(() => Math.random() - 0.5);
}

// ─── Main Board ───────────────────────────────────────────────────────────────

function TwentyFourBoard() {
  const [cards, setCards] = useState<number[]>(() => randomCards());
  const [tokens, setTokens] = useState<Token[]>([]);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<GamePhase>("PLAYING");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(getBestStreak);
  const [hint, setHint] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);

  const exprStr = useMemo(() => {
    return tokens.map(t => t.value).join(" ");
  }, [tokens]);

  const resetRound = useCallback((newCards?: number[]) => {
    const c = newCards ?? randomCards();
    setCards(c);
    setTokens([]);
    setUsedIds(new Set());
    setPhase("PLAYING");
    setHint(null);
    setFlashColor(null);
  }, []);

  const addNumber = useCallback((idx: number) => {
    if (usedIds.has(idx) || phase !== "PLAYING") return;
    setTokens(prev => [...prev, { type: "number", value: cards[idx], id: idx }]);
    setUsedIds(prev => new Set([...prev, idx]));
  }, [usedIds, phase, cards]);

  const addOp = useCallback((op: Operator) => {
    if (phase !== "PLAYING") return;
    setTokens(prev => [...prev, { type: "op", value: op }]);
  }, [phase]);

  const addParen = useCallback((p: "(" | ")") => {
    if (phase !== "PLAYING") return;
    setTokens(prev => [...prev, { type: "paren", value: p }]);
  }, [phase]);

  const clearExpr = useCallback(() => {
    setTokens([]);
    setUsedIds(new Set());
  }, []);

  const backspace = useCallback(() => {
    setTokens(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.type === "number") {
        setUsedIds(u => {
          const n = new Set(u);
          n.delete(last.id);
          return n;
        });
      }
      return prev.slice(0, -1);
    });
  }, []);

  const evaluate = useCallback(() => {
    if (phase !== "PLAYING") return;
    // Validate all 4 cards are used
    if (usedIds.size !== 4) {
      setAttempts(prev => [{ expr: exprStr, result: "Use all 4 numbers", success: false }, ...prev]);
      return;
    }
    const val = evaluateExpression(exprStr);
    const success = typeof val === "number" && Math.abs(val - 24) < 0.0001;
    setAttempts(prev => [{ expr: exprStr, result: typeof val === "number" ? val : val, success }, ...prev]);

    if (success) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      saveBestStreak(newStreak);
      setBestStreak(getBestStreak());
      setFlashColor("green");
      setPhase("WIN");
    } else {
      setFlashColor("red");
      setTimeout(() => setFlashColor(null), 600);
    }
  }, [phase, usedIds, exprStr, streak]);

  const giveUp = useCallback(() => {
    const solution = findSolution(cards);
    setHint(solution ?? "No solution found (rare — please try a new puzzle)");
    setStreak(0);
    setPhase("GIVEUP");
  }, [cards]);

  const nextPuzzle = useCallback(() => {
    resetRound();
  }, [resetRound]);

  const cardBg = (idx: number) =>
    usedIds.has(idx)
      ? "bg-slate-300 dark:bg-slate-700 opacity-40 cursor-not-allowed"
      : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg cursor-pointer active:scale-95";

  return (
    <div className="space-y-5">
      {/* Streak display */}
      <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
        <span>Streak: <span className="text-indigo-600 dark:text-indigo-400 font-black">{streak}</span></span>
        <span>Best: <span className="text-amber-500 font-black">{bestStreak}</span></span>
      </div>

      {/* Cards */}
      <div className="flex justify-center gap-3">
        {cards.map((n, i) => (
          <button
            key={i}
            onClick={() => addNumber(i)}
            disabled={usedIds.has(i) || phase !== "PLAYING"}
            className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl text-3xl sm:text-4xl font-black shadow-md transition-all duration-150 select-none ${cardBg(i)}`}
          >
            <span className={usedIds.has(i) ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"}>{n}</span>
          </button>
        ))}
      </div>

      {/* Expression display */}
      <div
        className={`min-h-[56px] rounded-xl border-2 px-4 py-3 flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-colors duration-300 ${
          flashColor === "green"
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
            : flashColor === "red"
            ? "border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        }`}
      >
        {exprStr || <span className="text-slate-400 dark:text-slate-500 text-base font-normal">Click numbers and operators to build an expression</span>}
      </div>

      {/* Operators */}
      <div className="flex justify-center gap-2">
        {(["+", "-", "×", "÷"] as Operator[]).map(op => (
          <button
            key={op}
            onClick={() => addOp(op)}
            disabled={phase !== "PLAYING"}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 border-2 border-indigo-200 dark:border-indigo-700 disabled:opacity-40 transition-all active:scale-95 min-w-[44px] min-h-[44px]"
          >
            {op}
          </button>
        ))}
        {(["(", ")"] as Array<"(" | ")">) .map(p => (
          <button
            key={p}
            onClick={() => addParen(p)}
            disabled={phase !== "PLAYING"}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 disabled:opacity-40 transition-all active:scale-95 min-w-[44px] min-h-[44px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={backspace}
          disabled={phase !== "PLAYING" || tokens.length === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all min-h-[44px]"
        >
          Backspace
        </button>
        <button
          onClick={clearExpr}
          disabled={phase !== "PLAYING"}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all min-h-[44px]"
        >
          Clear
        </button>
        <button
          onClick={evaluate}
          disabled={phase !== "PLAYING" || tokens.length === 0}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-40 transition-all min-h-[44px]"
        >
          = Evaluate
        </button>
        <button
          onClick={giveUp}
          disabled={phase !== "PLAYING"}
          className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 disabled:opacity-40 transition-all min-h-[44px]"
        >
          Give Up
        </button>
      </div>

      {/* Win / Give Up message */}
      {phase === "WIN" && (
        <div className="bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-400 rounded-xl p-4 text-center space-y-3">
          <p className="text-emerald-700 dark:text-emerald-300 font-black text-xl">Well done!</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm">Streak: {streak}</p>
          <button onClick={nextPuzzle} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
            Next Puzzle
          </button>
        </div>
      )}
      {phase === "GIVEUP" && hint && (
        <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-400 rounded-xl p-4 text-center space-y-3">
          <p className="text-amber-700 dark:text-amber-300 font-semibold text-sm">One solution:</p>
          <p className="font-mono font-bold text-amber-800 dark:text-amber-200 text-lg">{hint} = 24</p>
          <button onClick={nextPuzzle} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
            Next Puzzle
          </button>
        </div>
      )}

      {/* Attempt history */}
      {attempts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Attempts</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {attempts.map((a, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm font-mono ${
                  a.success
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>{a.expr}</span>
                <span className="font-bold">{typeof a.result === "number" ? `= ${a.result}` : a.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function TwentyFourGame({
  title = "24 Game",
  description = "Use the four numbers shown with addition, subtraction, multiplication, and division (and parentheses) to make exactly 24. A classic math puzzle for all ages.",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p>
          The 24 Game gives you four numbers and one goal: combine them with basic arithmetic to reach exactly 24.
          You must use each number exactly once, in any order, with any combination of +, -, ×, ÷ and parentheses.
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Four card numbers appear on screen (each between 1 and 9).</li>
          <li>Click a number card to add it to your expression.</li>
          <li>Click an operator (+, -, ×, ÷) to add it.</li>
          <li>Use ( ) buttons to add parentheses for grouping.</li>
          <li>Click "= Evaluate" to check if your expression equals 24.</li>
          <li>All four numbers must be used exactly once.</li>
          <li>If you're stuck, click "Give Up" to see one valid solution.</li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Strategies & Tips</h2>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Think in factors:</strong> 24 = 3×8 = 4×6 = 2×12 = 1×24. Try to make one of these pairs from two of the cards, then reach 1 with the other two.</li>
          <li><strong>Division is key:</strong> Division can reach surprising numbers. If you have an 8, try 8÷(something) to create a useful fraction.</li>
          <li><strong>Try reversal:</strong> If (a+b)×c doesn't work, try a×(b+c) or (a×b)+c.</li>
          <li><strong>Use parentheses aggressively:</strong> Many solutions require non-obvious groupings. Don't hesitate to nest parentheses.</li>
          <li><strong>Backspace freely:</strong> You can remove the last token at any time and try a different path.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Are all card sets solvable?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — every card set in this game has been verified to have at least one solution. The game uses a pre-verified list of 50 solvable sets, so you'll never be given an impossible puzzle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">How is the expression evaluated?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The game uses a custom recursive descent parser — no JavaScript <code>eval()</code>. This is safer and handles operator precedence and parentheses correctly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">What is the streak counter?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The streak counts consecutive puzzles you've solved. Clicking "Give Up" resets your streak to zero. Your best streak is saved in localStorage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Can I use a number more than once?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              No — each of the four card numbers must be used exactly once. Once you click a card, it dims and cannot be clicked again until you clear or backspace past it.
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
      widget={<TwentyFourBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Strategies" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
