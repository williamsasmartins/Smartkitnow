import React, { useState, useEffect, useCallback } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";

// ─── Word Bank ────────────────────────────────────────────────────────────────
type Category = "Animals" | "Countries" | "Food" | "Technology" | "Sports" | "Movies";

const WORD_BANK: Record<Category, Record<"easy" | "medium" | "hard", string[]>> = {
  Animals: {
    easy: ["BEAR", "WOLF", "DEER", "FROG", "DUCK", "FISH", "LION", "MOLE"],
    medium: ["RABBIT", "PARROT", "JAGUAR", "MONKEY", "TURTLE", "FALCON", "WOMBAT", "IGUANA"],
    hard: ["CROCODILE", "SALAMANDER", "ORANGUTAN", "RHINOCEROS", "CHIMPANZEE", "WOLVERINE", "BARRACUDA"],
  },
  Countries: {
    easy: ["PERU", "CUBA", "IRAN", "IRAQ", "OMAN", "CHAD", "FIJI", "TOGO"],
    medium: ["BRAZIL", "FRANCE", "GREECE", "TURKEY", "POLAND", "SWEDEN", "MEXICO"],
    hard: ["ARGENTINA", "INDONESIA", "UZBEKISTAN", "MOZAMBIQUE", "KYRGYZSTAN", "AZERBAIJAN"],
  },
  Food: {
    easy: ["RICE", "TACO", "CAKE", "SOUP", "BEEF", "MILK", "PEAR", "KIWI"],
    medium: ["BURGER", "WAFFLE", "SALMON", "MUFFIN", "NOODLE", "RADISH", "PEPPER"],
    hard: ["CROISSANT", "BRUSCHETTA", "QUESADILLA", "GUACAMOLE", "PROSCIUTTO", "RATATOUILLE"],
  },
  Technology: {
    easy: ["CODE", "WIFI", "DATA", "CHIP", "FILE", "PORT", "BYTE", "DISK"],
    medium: ["SERVER", "CURSOR", "ROUTER", "KERNEL", "PYTHON", "LAPTOP", "GITHUB"],
    hard: ["ALGORITHM", "MICROCHIP", "CYBERSECURITY", "BLOCKCHAIN", "JAVASCRIPT", "KUBERNETES"],
  },
  Sports: {
    easy: ["GOLF", "POLO", "SWIM", "YOGA", "JUDO", "SURF", "DIVE", "RACE"],
    medium: ["TENNIS", "HOCKEY", "BOXING", "KARATE", "ROWING", "FENCING", "CRICKET"],
    hard: ["GYMNASTICS", "TRIATHLON", "BASKETBALL", "VOLLEYBALL", "BADMINTON", "SKATEBOARDING"],
  },
  Movies: {
    easy: ["JAWS", "TRON", "DUNE", "THOR", "HULK", "CUBE", "RUSH", "MIST"],
    medium: ["AVATAR", "ALIENS", "BATMAN", "CASINO", "GREASE", "MATRIX", "PSYCHO"],
    hard: ["INCEPTION", "GLADIATOR", "BRAVEHEART", "SCHINDLER", "APOCALYPSE", "INTERSTELLAR"],
  },
};

const CATEGORIES: Category[] = ["Animals", "Countries", "Food", "Technology", "Sports", "Movies"];
const MAX_WRONG = 6;

// ─── SVG Hangman ─────────────────────────────────────────────────────────────
function HangmanSVG({ wrong }: { wrong: number }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full max-w-[180px] mx-auto" aria-label={`Hangman drawing: ${wrong} wrong guesses`}>
      {/* Gallows */}
      <line x1="20" y1="210" x2="180" y2="210" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="210" x2="60" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="20" x2="130" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="20" x2="130" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Head */}
      {wrong >= 1 && <circle cx="130" cy="60" r="15" stroke="currentColor" strokeWidth="3" fill="none" />}
      {/* Body */}
      {wrong >= 2 && <line x1="130" y1="75" x2="130" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {/* Left arm */}
      {wrong >= 3 && <line x1="130" y1="90" x2="105" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {/* Right arm */}
      {wrong >= 4 && <line x1="130" y1="90" x2="155" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {/* Left leg */}
      {wrong >= 5 && <line x1="130" y1="135" x2="105" y2="165" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
      {/* Right leg */}
      {wrong >= 6 && <line x1="130" y1="135" x2="155" y2="165" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

// ─── Game Board ───────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type GameState = "setup" | "playing" | "won" | "lost";

function HangmanBoard() {
  const [category, setCategory] = useState<Category>("Animals");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [word, setWord] = useState<string>("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<GameState>("setup");
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("hangman-highscore") || "0", 10); } catch { return 0; }
  });

  const wrongGuesses = [...guessed].filter(l => !word.includes(l));
  const wrongCount = wrongGuesses.length;
  const revealedAll = word.length > 0 && word.split("").every(l => guessed.has(l));

  const startGame = useCallback(() => {
    const pool = WORD_BANK[category][difficulty];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setWord(chosen);
    setGuessed(new Set());
    setGameState("playing");
  }, [category, difficulty]);

  // Check win/lose
  useEffect(() => {
    if (gameState !== "playing" || word === "") return;
    if (revealedAll) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setHighScore(prev => {
        const next = Math.max(prev, newStreak);
        try { localStorage.setItem("hangman-highscore", String(next)); } catch { /* ignore */ }
        return next;
      });
      setGameState("won");
    } else if (wrongCount >= MAX_WRONG) {
      setStreak(0);
      setGameState("lost");
    }
  }, [guessed, word, gameState]);

  // Keyboard support
  useEffect(() => {
    if (gameState !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) guess(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameState, guessed, word]);

  const guess = useCallback((letter: string) => {
    if (gameState !== "playing" || guessed.has(letter)) return;
    setGuessed(prev => new Set([...prev, letter]));
  }, [gameState, guessed]);

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col items-center w-full gap-4 p-2 sm:p-4 select-none touch-manipulation">
      {/* Header row */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xl font-black tracking-wide text-slate-800 dark:text-slate-100">Hangman Extreme</span>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="text-amber-600 dark:text-amber-400">Streak: {streak}</span>
          <span className="text-violet-600 dark:text-violet-400">Best: {highScore}</span>
        </div>
      </div>

      {/* Setup screen */}
      {gameState === "setup" && (
        <div className="w-full flex flex-col gap-5 items-center">
          <p className="text-slate-600 dark:text-slate-400 text-center text-sm">Choose a category and difficulty, then start guessing!</p>

          <div className="w-full">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${category === c ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-indigo-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold border capitalize transition-all ${difficulty === d ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startGame}
            className="mt-2 w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-lg transition-colors shadow-lg shadow-indigo-500/30">
            Start Game
          </button>
        </div>
      )}

      {/* Playing / Result screen */}
      {gameState !== "setup" && (
        <>
          {/* Info row */}
          <div className="flex gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{category}</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full capitalize">{difficulty}</span>
          </div>

          {/* SVG Hangman */}
          <div className="text-slate-800 dark:text-slate-200 w-full max-w-[200px]">
            <HangmanSVG wrong={wrongCount} />
          </div>

          {/* Wrong count bar */}
          <div className="w-full max-w-xs flex items-center gap-2">
            <span className="text-xs text-slate-500">{wrongCount}/{MAX_WRONG} wrong</span>
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${wrongCount >= 5 ? "bg-red-500" : wrongCount >= 3 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${(wrongCount / MAX_WRONG) * 100}%` }}
              />
            </div>
          </div>

          {/* Word display */}
          <div className="flex gap-2 flex-wrap justify-center">
            {word.split("").map((letter, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-2xl sm:text-3xl font-black min-w-[1.5rem] text-center transition-all ${guessed.has(letter) ? "text-indigo-600 dark:text-indigo-400" : (gameState === "lost" ? "text-red-500" : "text-transparent")}`}>
                  {guessed.has(letter) || gameState === "lost" ? letter : "_"}
                </span>
                <span className="text-slate-400 dark:text-slate-600 text-xl leading-none">_</span>
              </div>
            ))}
          </div>

          {/* Wrong letters */}
          {wrongGuesses.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {wrongGuesses.map(l => (
                <span key={l} className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">{l}</span>
              ))}
            </div>
          )}

          {/* Letter buttons */}
          {gameState === "playing" && (
            <div className="w-full grid grid-cols-9 gap-1 sm:gap-1.5 max-w-xs sm:max-w-sm">
              {ALPHABET.map(l => {
                const isGuessed = guessed.has(l);
                const isWrong = isGuessed && !word.includes(l);
                const isCorrect = isGuessed && word.includes(l);
                return (
                  <button key={l} onClick={() => guess(l)} disabled={isGuessed}
                    className={`aspect-square flex items-center justify-center text-xs sm:text-sm font-bold rounded-md transition-all active:scale-95 ${isWrong ? "bg-red-200 dark:bg-red-900/40 text-red-600 dark:text-red-400 cursor-not-allowed" : isCorrect ? "bg-emerald-200 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 cursor-not-allowed" : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:text-indigo-800 dark:hover:text-indigo-200"}`}>
                    {l}
                  </button>
                );
              })}
            </div>
          )}

          {/* Game over / win message */}
          {(gameState === "won" || gameState === "lost") && (
            <div className={`w-full max-w-xs rounded-2xl p-5 text-center border-2 ${gameState === "won" ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
              <p className={`text-2xl font-black mb-1 ${gameState === "won" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                {gameState === "won" ? "You Got It!" : "Game Over"}
              </p>
              {gameState === "lost" && (
                <p className="text-slate-600 dark:text-slate-400 mb-3">The word was <strong className="text-slate-900 dark:text-white">{word}</strong></p>
              )}
              {gameState === "won" && <p className="text-slate-600 dark:text-slate-400 mb-3">Streak: {streak}</p>}
              <div className="flex gap-2 justify-center">
                <button onClick={startGame}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm">
                  Next Word
                </button>
                <button onClick={() => setGameState("setup")}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition-colors text-sm">
                  Change Settings
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Editorial ────────────────────────────────────────────────────────────────
const editorial = (
  <div className="space-y-12">
    <section id="guide">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">How to Play Hangman Extreme</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Hangman Extreme is a classic word-guessing game. A secret word from your chosen category is hidden behind dashes.
        Guess one letter at a time. Each correct letter is revealed in its position. Each wrong guess draws a part of the hangman figure.
        You lose if 6 wrong letters are guessed before the word is revealed.
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
        <li>Select a <strong>category</strong> (Animals, Countries, Food, etc.) and a <strong>difficulty</strong>.</li>
        <li>Click or type a letter to guess it.</li>
        <li>Correct guesses reveal the letter in the word. Wrong guesses add body parts.</li>
        <li>Reveal the full word before 6 wrong guesses to win and build your streak!</li>
        <li>A physical keyboard also works — just type any letter while playing.</li>
      </ol>
    </section>

    <section id="tips">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Strategy Tips</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
        <li><strong>Start with vowels:</strong> E, A, I, O, U appear in almost every English word.</li>
        <li><strong>Then try common consonants:</strong> T, N, S, R, H are among the most frequent letters.</li>
        <li><strong>Use category clues:</strong> If the category is Animals and you see _ _ O N, think of lions or bison.</li>
        <li><strong>Word length matters:</strong> Short words have fewer hiding spots; long words may repeat letters.</li>
        <li><strong>Hard mode payoff:</strong> Harder difficulty uses longer, rarer words — great for vocabulary building!</li>
      </ul>
    </section>

    <section id="faq">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">FAQ</h2>
      <div className="space-y-4">
        {[
          ["Can I use my keyboard?", "Yes! While playing, simply press any letter key on your physical keyboard to guess that letter."],
          ["How is difficulty determined?", "Easy uses 4-5 letter words. Medium uses 6-8. Hard uses 9+ letter words that are typically less common."],
          ["Is my streak saved?", "Your high score (longest streak) is saved in your browser's localStorage, so it persists between sessions."],
          ["How many guesses do I get?", "You get exactly 6 wrong guesses before the game ends, matching classic Hangman rules."],
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
export default function HangmanExtremeGame({
  title = "Hangman Extreme",
  description = "Classic Hangman word game with 6 categories and 3 difficulty levels. Guess the hidden word before the man is fully drawn!",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<HangmanBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Strategy Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
