import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";

// ─── Passages ────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type TimerMode = 30 | 60 | 120;

const PASSAGES: Record<Difficulty, string[]> = {
  easy: [
    "The cat sat on the mat and watched the sun go down. It was a calm and nice day.",
    "She went to the shop to buy some milk and bread. The sky was blue and clear today.",
    "He ran to the park with his dog. They had a lot of fun in the warm afternoon sun.",
    "The sun rises in the east and sets in the west. Days go by one at a time for all of us.",
    "My friend has a red bike that he rides to work. It is fast and easy to use on the road.",
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog. Every good programmer knows this phrase by heart.",
    "Technology is reshaping how we interact with the world. Smartphones connect us to information instantly.",
    "Reading books regularly improves vocabulary and enhances cognitive function. It also builds empathy.",
    "The mountains stood tall against the fading horizon, their peaks capped with glistening white snow.",
    "Science and art are more connected than they appear. Both require creativity and precise observation.",
    "Consistency is the foundation of mastery. Small daily improvements lead to remarkable long-term results.",
  ],
  hard: [
    "Quantum entanglement suggests that particles can instantaneously affect each other regardless of distance, challenging classical notions of locality.",
    "The Enlightenment period fundamentally transformed philosophical discourse, emphasizing rationalism, empiricism, and individual liberty over dogmatic tradition.",
    "Neuroplasticity demonstrates that the human brain can reorganize itself by forming new neural connections throughout an individual's entire lifetime.",
    "The Byzantine Empire's administrative sophistication allowed it to survive for over a thousand years after the fall of the Western Roman Empire.",
    "Cryptographic algorithms underpin modern digital security, ensuring that sensitive transmissions remain confidential even across adversarial network infrastructure.",
  ],
};

type GameState = "setup" | "playing" | "finished";

// ─── Typing Board ─────────────────────────────────────────────────────────────
function TypingBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timerMode, setTimerMode] = useState<TimerMode>(60);
  const [gameState, setGameState] = useState<GameState>("setup");
  const [passage, setPassage] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [bestWpm, setBestWpm] = useState(() => {
    try { return parseInt(localStorage.getItem("typing-racer-best-wpm") || "0", 10); } catch { return 0; }
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickPassage = useCallback((diff: Difficulty) => {
    const pool = PASSAGES[diff];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const startGame = useCallback(() => {
    const p = pickPassage(difficulty);
    setPassage(p);
    setTyped("");
    setTimeLeft(timerMode);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setStartTime(0);
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty, timerMode, pickPassage]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState !== "playing") return;
    const value = e.target.value;

    // Start timer on first keystroke
    if (startTime === 0 && value.length > 0) {
      setStartTime(Date.now());
    }

    const newTyped = value.slice(0, passage.length);
    setTyped(newTyped);

    // Track keystrokes
    if (value.length > typed.length) {
      const idx = typed.length;
      const typedChar = value[idx];
      setTotalKeystrokes(prev => prev + 1);
      if (typedChar === passage[idx]) {
        setCorrectKeystrokes(prev => prev + 1);
      }
    }

    // Check completion
    if (newTyped === passage) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGameState("finished");
    }
  }, [gameState, passage, typed, startTime]);

  // Stats computation
  const elapsedSeconds = gameState === "finished"
    ? (timerMode - timeLeft) || 1
    : startTime > 0 ? Math.max(1, Math.floor((Date.now() - startTime) / 1000)) : 1;

  const wordsTyped = typed.trim().split(/\s+/).filter(w => w.length > 0).length;
  const liveWpm = startTime > 0 && gameState === "playing"
    ? Math.round((wordsTyped / Math.max(1, Math.floor((Date.now() - startTime) / 1000))) * 60)
    : 0;

  const finalWpm = gameState === "finished"
    ? Math.round((typed.trim().split(/\s+/).filter(w => w.length > 0).length / elapsedSeconds) * 60)
    : 0;

  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  const progress = passage.length > 0 ? Math.min(100, Math.round((typed.length / passage.length) * 100)) : 0;

  // Save best WPM
  useEffect(() => {
    if (gameState === "finished" && finalWpm > 0) {
      setBestWpm(prev => {
        const next = Math.max(prev, finalWpm);
        try { localStorage.setItem("typing-racer-best-wpm", String(next)); } catch { /* ignore */ }
        return next;
      });
    }
  }, [gameState, finalWpm]);

  // Render colored text
  const renderPassage = () => {
    return passage.split("").map((char, i) => {
      let className = "text-slate-400 dark:text-slate-500"; // untyped
      if (i < typed.length) {
        className = typed[i] === char
          ? "text-emerald-600 dark:text-emerald-400"   // correct
          : "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded"; // wrong
      } else if (i === typed.length) {
        className = "text-slate-900 dark:text-slate-100 border-b-2 border-indigo-500 animate-pulse"; // cursor
      }
      return <span key={i} className={className}>{char}</span>;
    });
  };

  const timerColor = timeLeft <= 10 ? "text-red-500" : timeLeft <= 20 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="flex flex-col w-full gap-4 p-2 sm:p-4 select-none">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xl font-black tracking-wide text-slate-800 dark:text-slate-100">Typing Racer</span>
        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Best WPM: {bestWpm}</span>
      </div>

      {/* Setup */}
      {gameState === "setup" && (
        <div className="flex flex-col gap-5">
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center">Type the displayed passage as fast and accurately as possible!</p>

          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold border capitalize transition-all ${difficulty === d ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Timer</p>
            <div className="grid grid-cols-3 gap-2">
              {([30, 60, 120] as TimerMode[]).map(t => (
                <button key={t} onClick={() => setTimerMode(t)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${timerMode === t ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400"}`}>
                  {t}s
                </button>
              ))}
            </div>
          </div>

          <button onClick={startGame}
            className="w-full max-w-xs mx-auto py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/30">
            Start Typing
          </button>
        </div>
      )}

      {/* Playing */}
      {gameState === "playing" && (
        <div className="flex flex-col gap-4">
          {/* Live stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className={`text-2xl font-black ${timerColor}`}>{timeLeft}s</p>
              <p className="text-xs text-slate-500 font-medium">Time Left</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{liveWpm}</p>
              <p className="text-xs text-slate-500 font-medium">WPM</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{accuracy}%</p>
              <p className="text-xs text-slate-500 font-medium">Accuracy</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>

          {/* Passage display */}
          <div className="font-mono text-base sm:text-lg leading-relaxed bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[100px]">
            {renderPassage()}
          </div>

          {/* Hidden input (mobile + desktop) */}
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl p-3 font-mono text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            rows={3}
            placeholder="Start typing here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          <button onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setGameState("setup"); }}
            className="self-center px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Give up
          </button>
        </div>
      )}

      {/* Finished */}
      {gameState === "finished" && (
        <div className="flex flex-col gap-4 items-center">
          <div className="w-full max-w-xs rounded-2xl border-2 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-6 text-center">
            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-300 mb-1">
              {finalWpm} WPM
            </p>
            <p className="text-slate-500 text-sm mb-4">Accuracy: {accuracy}% &bull; Characters: {typed.length}</p>
            {finalWpm >= bestWpm && finalWpm > 0 && (
              <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">New Personal Best!</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">{typed.length}</p>
              <p className="text-xs text-slate-500">Chars</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{correctKeystrokes}</p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xl font-black text-red-500">{totalKeystrokes - correctKeystrokes}</p>
              <p className="text-xs text-slate-500">Errors</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={startGame}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
              Play Again
            </button>
            <button onClick={() => setGameState("setup")}
              className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors">
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Editorial ────────────────────────────────────────────────────────────────
const editorial = (
  <div className="space-y-12">
    <section id="guide">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">How to Play Typing Racer</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Typing Racer measures how fast and accurately you can type. A passage is displayed on screen — your goal is to reproduce it
        as quickly and correctly as possible before the timer runs out.
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
        <li>Choose a <strong>difficulty</strong> level and <strong>timer</strong> duration (30, 60, or 120 seconds).</li>
        <li>Press <strong>Start Typing</strong> and begin typing the displayed text in the input area below it.</li>
        <li>Green characters indicate correct input. Red means a mistake at that position.</li>
        <li>When the timer ends (or you complete the passage), your final WPM and accuracy are displayed.</li>
        <li>Your best WPM score is saved automatically for motivation.</li>
      </ol>
    </section>

    <section id="tips">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">How to Improve Your Typing Speed</h2>
      <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300">
        <li><strong>Touch typing:</strong> Place your fingers on the home row (ASDF / JKL;) and never look at the keyboard.</li>
        <li><strong>Accuracy first:</strong> Prioritize typing without errors — fast but sloppy typing lowers your effective WPM.</li>
        <li><strong>Practice rhythm:</strong> Type at a consistent pace rather than in bursts. Smooth and steady beats frantic.</li>
        <li><strong>Target weak spots:</strong> Note which letter combinations slow you down (e.g., "th", "qu") and drill them.</li>
        <li><strong>Relax your hands:</strong> Tension causes fatigue and mistakes. Keep wrists neutral and fingers loose.</li>
        <li><strong>WPM explained:</strong> Words per minute is calculated as (total characters typed / 5) divided by minutes elapsed. The standard word length of 5 normalizes across different text lengths.</li>
      </ul>
    </section>

    <section id="faq">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">FAQ</h2>
      <div className="space-y-4">
        {[
          ["What is an average WPM?", "The average adult types about 40 WPM. Proficient typists reach 70-80 WPM. Professional typists often exceed 100 WPM."],
          ["Does it work on mobile?", "Yes! On mobile, tapping the input area opens your virtual keyboard. The passage is visible above as you type."],
          ["How is accuracy calculated?", "Accuracy = (correct keystrokes / total keystrokes) × 100. Only letter keys count — not backspace or modifiers."],
          ["Why does difficulty matter?", "Harder difficulties use more complex vocabulary and longer sentences, which require more precision and familiarity with rare letter combinations."],
        ].map(([q, a]) => (
          <div key={q} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{q}</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ─── Export ───────────────────────────────────────────────────────────────────
export default function TypingRacerGame({
  title = "Typing Racer",
  description = "Test your typing speed and accuracy! Type passages as fast as possible and track your WPM across difficulty levels.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<TypingBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Improve Your Speed" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
