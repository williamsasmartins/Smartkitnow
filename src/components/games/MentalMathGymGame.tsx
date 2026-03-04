import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

type Operation = "+" | "-" | "×" | "÷";
type Difficulty = "easy" | "medium" | "hard";
type GameState = "SETUP" | "PLAYING" | "RESULTS";

interface Problem {
  a: number;
  b: number;
  op: Operation;
  answer: number;
}

interface ModeKey {
  difficulty: Difficulty;
  ops: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIMER_SECONDS = 60;
const POINTS_PER_CORRECT = 10;

const DIFFICULTY_RANGES: Record<Difficulty, [number, number]> = {
  easy: [1, 12],
  medium: [1, 50],
  hard: [1, 100],
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy (1–12)",
  medium: "Medium (1–50)",
  hard: "Hard (1–100)",
};

const ALL_OPS: Operation[] = ["+", "-", "×", "÷"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(ops: Operation[], difficulty: Difficulty): Problem {
  const [min, max] = DIFFICULTY_RANGES[difficulty];
  const op = ops[Math.floor(Math.random() * ops.length)];

  if (op === "+") {
    const a = randInt(min, max);
    const b = randInt(min, max);
    return { a, b, op, answer: a + b };
  }
  if (op === "-") {
    const a = randInt(min, max);
    const b = randInt(min, a);
    return { a, b, op, answer: a - b };
  }
  if (op === "×") {
    const a = randInt(min, Math.min(max, 20));
    const b = randInt(min, Math.min(max, 20));
    return { a, b, op, answer: a * b };
  }
  // Division — always whole result
  const b = randInt(Math.max(min, 1), Math.min(max, 12));
  const answer = randInt(min, Math.min(max, 12));
  const a = b * answer;
  return { a, b, op: "÷", answer };
}

function modeKey(difficulty: Difficulty, ops: Operation[]): string {
  return `mental-math-best-${difficulty}-${[...ops].sort().join("")}`;
}

function getBestScore(difficulty: Difficulty, ops: Operation[]): number {
  try {
    const raw = localStorage.getItem(modeKey(difficulty, ops));
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(difficulty: Difficulty, ops: Operation[], score: number): void {
  try {
    const key = modeKey(difficulty, ops);
    const prev = getBestScore(difficulty, ops);
    if (score > prev) localStorage.setItem(key, String(score));
  } catch { /* silent */ }
}

// ─── Flash overlay ────────────────────────────────────────────────────────────

type FlashType = "correct" | "wrong" | null;

// ─── Main Board ───────────────────────────────────────────────────────────────

function MentalMathBoard() {
  const [gameState, setGameState] = useState<GameState>("SETUP");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [selectedOps, setSelectedOps] = useState<Set<Operation>>(new Set(["+", "-", "×", "÷"]));
  const [problem, setProblem] = useState<Problem | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [flash, setFlash] = useState<FlashType>(null);
  const [shownAnswer, setShownAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<{ score: number; attempted: number; correct: number; best: number } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const correctCountRef = useRef(0);
  const scoreRef = useRef(0);
  const attemptedRef = useRef(0);
  const activeOpsRef = useRef<Operation[]>([...selectedOps]);
  const difficultyRef = useRef<Difficulty>(difficulty);

  const nextProblem = useCallback(() => {
    const ops = activeOpsRef.current;
    if (ops.length === 0) return;
    setProblem(generateProblem(ops, difficultyRef.current));
    setInputValue("");
    setFlash(null);
    setShownAnswer(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = correctCountRef.current;
    const total = attemptedRef.current;
    const sc = scoreRef.current;
    saveBestScore(difficultyRef.current, activeOpsRef.current, correct);
    const best = getBestScore(difficultyRef.current, activeOpsRef.current);
    setResults({ score: sc, attempted: total, correct, best });
    setGameState("RESULTS");
  }, []);

  const startGame = useCallback(() => {
    if (selectedOps.size === 0) return;
    activeOpsRef.current = [...selectedOps];
    difficultyRef.current = difficulty;
    correctCountRef.current = 0;
    scoreRef.current = 0;
    attemptedRef.current = 0;
    setScore(0);
    setStreak(0);
    setAttempted(0);
    setTimeLeft(TIMER_SECONDS);
    setResults(null);
    setFlash(null);
    setShownAnswer(null);
    setGameState("PLAYING");
    const p = generateProblem([...selectedOps], difficulty);
    setProblem(p);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 100);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedOps, difficulty, endGame]);

  const submitAnswer = useCallback(() => {
    if (!problem || flash !== null) return;
    const userAnswer = parseInt(inputValue, 10);
    attemptedRef.current += 1;
    setAttempted((p) => p + 1);

    if (!isNaN(userAnswer) && userAnswer === problem.answer) {
      correctCountRef.current += 1;
      scoreRef.current += POINTS_PER_CORRECT;
      setScore(scoreRef.current);
      setStreak((s) => s + 1);
      setFlash("correct");
      setTimeout(() => nextProblem(), 400);
    } else {
      setStreak(0);
      setFlash("wrong");
      setShownAnswer(problem.answer);
      setTimeout(() => nextProblem(), 1200);
    }
  }, [problem, flash, inputValue, nextProblem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") submitAnswer();
    },
    [submitAnswer]
  );

  const toggleOp = useCallback((op: Operation) => {
    setSelectedOps((prev) => {
      const next = new Set(prev);
      if (next.has(op)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(op);
      } else {
        next.add(op);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timeLeft > 30 ? "bg-emerald-500" : timeLeft > 10 ? "bg-amber-500" : "bg-red-500";

  // ── SETUP ──────────────────────────────────────────────────────────────────

  if (gameState === "SETUP") {
    return (
      <div className="space-y-6 p-2">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">
            Difficulty
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                  difficulty === d
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">
            Operations
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_OPS.map((op) => (
              <button
                key={op}
                onClick={() => toggleOp(op)}
                className={`w-12 h-12 rounded-lg text-lg font-bold border-2 transition-all ${
                  selectedOps.has(op)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
          <p>Best score for this mode: <span className="font-bold text-indigo-600 dark:text-indigo-400">{getBestScore(difficulty, [...selectedOps])} correct</span></p>
        </div>

        <Button
          onClick={startGame}
          disabled={selectedOps.size === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 text-lg rounded-xl"
        >
          Start 60-Second Quiz
        </Button>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────

  if (gameState === "RESULTS" && results) {
    const accuracy = results.attempted > 0 ? Math.round((results.correct / results.attempted) * 100) : 0;
    const newBest = results.correct >= results.best && results.correct > 0;
    return (
      <div className="space-y-6 p-2 text-center">
        <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{results.score}</div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">points earned</p>
        {newBest && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 rounded-xl p-3 text-amber-700 dark:text-amber-300 font-bold">
            New Best Score! {results.correct} correct
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Correct", value: results.correct },
            { label: "Attempted", value: results.attempted },
            { label: "Accuracy", value: `${accuracy}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Best (this mode): <span className="font-bold text-indigo-600 dark:text-indigo-400">{results.best} correct</span>
        </div>
        <div className="flex gap-3">
          <Button onClick={startGame} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl">
            Play Again
          </Button>
          <Button onClick={() => setGameState("SETUP")} variant="outline" className="flex-1 font-bold py-3 rounded-xl">
            Change Mode
          </Button>
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────

  const flashBg =
    flash === "correct"
      ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-400"
      : flash === "wrong"
      ? "bg-red-50 dark:bg-red-950 border-red-400"
      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700";

  return (
    <div className="space-y-4 p-2">
      {/* Timer bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Time</span>
          <span className={timeLeft <= 10 ? "text-red-500 font-black" : "text-slate-800 dark:text-slate-200"}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      {/* Score + Streak */}
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{attempted}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Attempted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-amber-500">{streak}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Streak</div>
        </div>
      </div>

      {/* Problem card */}
      <div className={`border-2 rounded-2xl p-8 text-center transition-all duration-200 ${flashBg}`}>
        {problem && (
          <>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              {problem.a} {problem.op} {problem.b} = ?
            </div>
            {flash === "wrong" && shownAnswer !== null && (
              <div className="text-red-600 dark:text-red-400 font-bold text-lg mt-2">
                Answer: {shownAnswer}
              </div>
            )}
            {flash === "correct" && (
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mt-2">
                Correct! +{POINTS_PER_CORRECT}
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={flash !== null}
          placeholder="Your answer"
          className="flex-1 text-2xl font-bold text-center border-2 border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <Button
          onClick={submitAnswer}
          disabled={flash !== null || inputValue === ""}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-4 text-lg rounded-xl min-w-[80px]"
        >
          Submit
        </Button>
      </div>
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">Press Enter or tap Submit</p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function MentalMathGymGame({
  title = "Mental Math Gym",
  description = "Race against the clock! Solve as many math problems as you can in 60 seconds. Train your brain with addition, subtraction, multiplication, and division across three difficulty levels.",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <p>
          Mental Math Gym challenges you to solve arithmetic problems as quickly as possible within a 60-second window.
          Each correct answer earns 10 points. Configure your preferred operations and difficulty before starting.
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Select your difficulty: Easy (1–12), Medium (1–50), or Hard (1–100).</li>
          <li>Choose which operations to include — you can mix and match.</li>
          <li>Click <strong>Start 60-Second Quiz</strong> to begin the countdown.</li>
          <li>Type your answer in the input field and press <strong>Enter</strong> or click <strong>Submit</strong>.</li>
          <li>Correct answers flash green and advance automatically. Wrong answers flash red and show the correct answer briefly.</li>
          <li>The game ends when the timer reaches zero. Your best score per mode is saved.</li>
        </ol>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips for High Scores</h2>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Stay on streak:</strong> A long streak means you're maintaining both speed and accuracy — which is more valuable than rushing and missing.</li>
          <li><strong>Master multiplication tables:</strong> On Easy and Medium, most multiplication problems stay within the 12× range. Knowing your times tables cold is a huge advantage.</li>
          <li><strong>Division trick:</strong> Division problems are always whole numbers. Use reverse multiplication — if you see 72 ÷ 8, think "what times 8 equals 72?"</li>
          <li><strong>Use the numeric keyboard:</strong> On mobile, the input uses <code>inputMode="numeric"</code> to bring up the number pad automatically.</li>
          <li><strong>Start with fewer operations:</strong> If you're new, start with just addition and subtraction to build speed before mixing in multiplication and division.</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Is my best score saved permanently?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Yes — your best score (measured in correct answers) is stored in your browser's localStorage per mode combination. Clearing your browser data will reset it.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Why are division problems always whole numbers?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              To keep the game fair and fast, all division problems are generated to produce integer results. This means no decimals or remainders to worry about.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Can I deselect all operations?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              No — the game requires at least one operation selected. If you try to deselect the last remaining operation, it will stay selected.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">What's a good target score for beginners?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Aim for 10–15 correct answers in 60 seconds on Easy mode. Once you're consistently above 20, move to Medium. Advanced players often clear 25+ on Hard.
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
      widget={<MentalMathBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
